import { io, Socket } from 'socket.io-client'
import { autorun } from 'mobx'
import { useStore } from '../../store/useStore'

import Phaser from 'phaser'
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles'

import {
  EndFight,
  MovementInput,
  PlayerDead,
  PlayerFightAction,
  PlayerHurt,
  PlayerId,
  PlayerInitialState,
  PlayerSettings,
  PlayersInitialStates,
  PlayersStates,
  PlayerState,
  StartFight,
} from '../types/playerTypes'
import { VotingZone, VotingZoneValue } from '../types/gameObjectsTypes'

import { gameVotingManager } from '../classes/GameVotingManager'
import { gameState } from '../states/GameState'

// Keys
import AvatarKeys from '../consts/AvatarKeys'
import FontKeys from '../consts/FontKeys'
import NetworkEventKeys from '../consts/NetworkEventKeys'
import SceneKeys from '../consts/SceneKeys'

// Animations
import { createNpcAnims } from '../anims'

// Characters
import Player from '../characters/Player'
import PlayerFactory from '../characters/PlayerFactory'

// NPC Characters
import Cobra from '../characters/npc/Cobra'
import Hud from './Hud'
import { ThrowableWeaponArrow } from '../classes/ThrowableWeaponArrow'
import AbstractThrowableWeapon from '../classes/AbstractThrowableWeapon'
import TextureKeys from '../consts/TextureKeys'
import TilemapKeys from '../consts/TilemapKeys'

export default class Game extends Phaser.Scene {
  // All players in the game
  players!: Phaser.GameObjects.Group

  // Current player from this client
  currentPlayer!: Player

  // Game tilemap
  private mapIsland!: Phaser.Tilemaps.Tilemap;

  // Available arrows for current player
  private currentPlayerThrowableWeapons!: Phaser.Physics.Arcade.Group

  // Available arrows for the rest of the players
  private restOfPlayersThrowableWeapons!: Phaser.Physics.Arcade.Group

  // Settings selected in the login page
  playerSettings: PlayerSettings;

  // SocketIO client
  private socket!: Socket
  // Flag to check if it was previosly connected (to check reconnections)
  private disconnectedFromServer = false

  // Flag to prevent sending player settings when it was already sent when first connected
  private preventDuplicateInitialSettingsEvent = true

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput


  // Voting zones rectangles
  private votingZones: VotingZone[] = []
  private currentVotingZoneValue: VotingZoneValue

  // Emitter when the voting zone is active
  private votingZoneParticlesEmitter?: Phaser.GameObjects.Particles.ParticleEmitter

  // Emitter when the voting zone turns to inactive
  private votingZoneExplodeParticlesEmitter?: Phaser.GameObjects.Particles.ParticleEmitter
  

  // Render Texture where tilemaps layers are rendered to (useful for dark mode)
  private renderTexture!: Phaser.GameObjects.RenderTexture

  // Render texture to draw blood splatters on fight mode
  public bloodSplatterRenderTexture!: Phaser.GameObjects.RenderTexture

  // Rain effect
  private isRaining: boolean = false;
  private rainParticlesEmitter?: Phaser.GameObjects.Particles.ParticleEmitter

  // Rounded light effect for current player in dark mode
  private currentPlayerVision!: Phaser.GameObjects.Image

  // Container that holds all lights in dark mode (except current player vision)
  private visionMaskContainer!: Phaser.GameObjects.Container

  // Tweens for light's flickering effect
  private lightTweens: Phaser.Tweens.Tween[] = []

  // The fighter INDEX from gameFightState.fighters that the camera is currently following
  // This is only for players that are viewers and not fighting
  private fightCameraFollowedPlayerIndex?: number

  private steps: Phaser.GameObjects.Image[] = []

  constructor() {
    super({ key: SceneKeys.Game })

    // Login page settings
    const { getState } = useStore
    const { username, avatar: avatarName, isVoter } = getState()
    this.playerSettings = {
      username,
      avatarName: avatarName as AvatarKeys,
      isVoter,
      hidePlayersWhileVoting: true,
    }
  }

  get currentPlayerId() {
    return this.socket.id
  }

  preload() {
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  init() {
    this.scene.launch(SceneKeys.Hud)
  }

  create() {
    // Socket to communicate with the server
    this.socket = io({
      query: {
        playerSettings: JSON.stringify(this.playerSettings),
      }
    })
    this.socket.once('connect', () => {
      gameState.connectingToServer = false;
    })

    // Players will be stored in this group
    this.players = this.add.group({
      classType: Player,
    })


    // Round pixels to prevent sub-pixel aliasing
    this.cameras.main.setRoundPixels(true)

    // Create animations
    createNpcAnims(this.anims)

    this.currentPlayerThrowableWeapons = this.physics.add.group({
      classType: ThrowableWeaponArrow,
      maxSize: 3, // TODO: Remove hardcoded value
    })

    this.restOfPlayersThrowableWeapons = this.physics.add.group({
      classType: ThrowableWeaponArrow,
    })

    // Create tilemap and layers
    this.mapIsland = this.add.tilemap('islands');

    const tilesetIslandBeach = this.mapIsland.addTilesetImage('tf_beach_tileB', TilemapKeys.BeachTiles, 32, 32, 0, 0)
    const tilesetIslandShoreline = this.mapIsland.addTilesetImage('tf_beach_tileA1', TilemapKeys.BeachShoreTiles, 32, 32, 0, 0)

    const ocean = this.mapIsland.createLayer('Ocean', [tilesetIslandShoreline])
    // Group all tilset layers
    const islandsTilesLayerGroup = this.add.layer([
      this.mapIsland.createLayer('Island 1/Main Island', [tilesetIslandBeach, tilesetIslandShoreline]),
      this.mapIsland.createLayer('Island 1/Voting Islands', [tilesetIslandBeach, tilesetIslandShoreline]),
      this.mapIsland.createLayer('Island 2/Island', [tilesetIslandBeach, tilesetIslandShoreline]),
      this.mapIsland.createLayer('Island 2/Paths', [tilesetIslandBeach]),
      this.mapIsland.createLayer('Island 1/Paths', [tilesetIslandBeach]),
      this.mapIsland.createLayer('Island 1/Vegetation bottom', tilesetIslandBeach),
      this.mapIsland.createLayer('Island 2/Vegetation bottom', tilesetIslandBeach),
    ])
    const vegetationTop1 = this.mapIsland.createLayer('Island 1/Vegetation top', tilesetIslandBeach).setDepth(10)
    const vegetationTop2 = this.mapIsland.createLayer('Island 2/Vegetation top', tilesetIslandBeach).setDepth(10)

    // Animated Tiles (like sea water in the shore)
    // @ts-ignore
    this.sys.animatedTiles.init(this.mapIsland);

    this.steps.push(this.add.image(0, 0, TextureKeys.Footprints, Phaser.Math.Between(0, 3)).setAlpha(1));

    // make a RenderTexture that is the size of the screen
    this.renderTexture = this.make.renderTexture({
      width: this.mapIsland.widthInPixels,
      height: this.mapIsland.heightInPixels,
    }, true);
    this.renderTexture.draw([ocean, ...islandsTilesLayerGroup.getAll(), vegetationTop1, vegetationTop2]).setAlpha(0);
    this.visionMaskContainer = this.make.container({}, false);

    // Render texture to draw blood splatters on fight mode
    this.bloodSplatterRenderTexture = this.add.renderTexture(0, 0, this.mapIsland.widthInPixels, this.mapIsland.heightInPixels);

    // Illuminate palmtrees and campfires
    const lightsLayer = this.mapIsland.getObjectLayer('Lights');
    lightsLayer.objects.forEach((tiledObject) => {
      const {x, y } = tiledObject
      const campfireVision = this.make.image({
        x,
        y,
        key: TextureKeys.VisionMask,
        add: false,
        scale: 1,
      })
      this.visionMaskContainer.add(campfireVision);
    });

    // Voting Zones
    const votingZonesLayer = this.mapIsland.getObjectLayer('Voting Zones')
    votingZonesLayer.objects.forEach((tiledObject) => {
        const {x, y, height, width, properties } = tiledObject
        const votingValue = properties[0]['value'] as string

        const rectangle = this.add.rectangle(x!, y!, width, height, 0x9966ff, 0.5).setStrokeStyle(4, 0xefc53f).setOrigin(0);
        this.add.bitmapText(x! + width!/2 , y! + height!/2, FontKeys.DESYREL, votingValue, 64).setOrigin(0.5).setCenterAlign();

        this.votingZones.push({ value: votingValue, zone: rectangle});
    })

    // Voting Frontier: border that tells if a player is in voting islands or not
    const thresholdsLayer = this.mapIsland.getObjectLayer('Thresholds')
    const votingFrontier = thresholdsLayer.objects.find((tiledObject) => tiledObject.name === 'Voting Frontier')!
    if (votingFrontier) {
      gameState.votingFrontierY = votingFrontier.y;
    }

    // Cobra NPC
    const playersLayer = this.mapIsland.getObjectLayer('Players')
    const randomPlayerIndex = Phaser.Math.Between(0, playersLayer.objects.length - 1)
    const playerObj = playersLayer.objects[randomPlayerIndex]
    const cobra = new Cobra(this, playerObj?.x!, playerObj?.y!)
    cobra.setDepth(3)
    this.add.existing(cobra)
    this.physics.add.existing(cobra)
    cobra.body.onCollide = true

    // Make the cobra talk
    this.physics.add.overlap(cobra, this.players, (go1: Phaser.GameObjects.GameObject, go2: Phaser.GameObjects.GameObject) => {
      const player = go2 as Player;
      if (this.currentPlayerId === player.id && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        cobra.speak()
      }
    })

    // Enable collision by property on all layers
    islandsTilesLayerGroup.getChildren().forEach((islandTileLayer) => {
      const tilemapLayer = islandTileLayer as Phaser.Tilemaps.TilemapLayer
      tilemapLayer.setCollisionByProperty({ collides: true })
    })

    // Enable collission between Cobra and map tiles
    this.physics.add.collider(cobra, [...islandsTilesLayerGroup.getChildren()])

    // Enable collider between arrows and players
    this.physics.add.overlap([this.currentPlayerThrowableWeapons, this.restOfPlayersThrowableWeapons], this.players, this.handleThrowableWeaponPlayerOverlap, undefined, this)

    // Camara limited to the map
    this.cameras.main.setBounds(0, 0, this.mapIsland.widthInPixels, this.mapIsland.heightInPixels);

    // Create cursor keys and initial movement input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.lastMovementInput = {
      left: false,
      right: false,
      up: false,
      down: false,
    }

    // All players in the game - used when joining a game that already has players (or not)
    this.socket.on(NetworkEventKeys.PlayersInitialStatusInfo, (
      playersInitialStates: PlayersInitialStates,
    ) => {
      this.handleServerReconnect()

      Object.keys(playersInitialStates).forEach((id) => {
        const isMainPlayer = playersInitialStates[id].playerId === this.currentPlayerId;
        this.addPlayer(playersInitialStates[id], isMainPlayer)
      })

      this.cameras.main.startFollow(this.currentPlayer, true)
    })

    // A new player has joined the game
    this.socket.on(NetworkEventKeys.PlayersNew, (
      playerInitialState: PlayerInitialState,
    ) => {
      this.addPlayer(playerInitialState, false)
    })

    // A player has been disconnected
    this.socket.on(NetworkEventKeys.PlayersLeft, (playerId: PlayerId) => {
      this.removePlayer(playerId)
    })

    // Update players positions
    this.socket.on(NetworkEventKeys.PlayersStatusUpdate, (
      newPlayerStates: PlayersStates,
    ) => {
      Object.keys(newPlayerStates).forEach((id) => this.updatePlayerState(newPlayerStates[id]))
    })

    // An error happened in the server
    this.socket.on(NetworkEventKeys.ServerError, (errorMsg: string) => {
      console.error(`Server error: ${errorMsg}`);

      this.add.text(10, 10, `Server error: ${errorMsg}`, {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#333333'
      })
    });

    // Server offline or internet went down
    this.socket.on(NetworkEventKeys.ServerOffline, () => {
      console.error('Disconnected from server')
      this.disconnectedFromServer = true
      
      // Paint all players in color red
      this.players.setTint(0xff0000)
    })

    // Send an event when the current player changes it's voting setting (or any other setting)
    // Update voting manager accordingly
    autorun(() => {
      if (gameState.currentPlayer !== undefined) {
        if (this.preventDuplicateInitialSettingsEvent) {
          // Prevent sending player settings when it was already sent with NetworkEventKeys.PlayersInitialStatusInfo
          this.preventDuplicateInitialSettingsEvent = false;
        } else {
          const currentPlayerSettings: PlayerSettings = {
            id: gameState.currentPlayer.id,
            username: gameState.currentPlayer.username,
            avatarName: gameState.currentPlayer.avatarName,
            isVoter: gameState.currentPlayer.isVoter,
            hidePlayersWhileVoting: gameState.currentPlayer.hidePlayersWhileVoting,
          }
          this.socket.emit(NetworkEventKeys.PlayerSettingsUpdate, currentPlayerSettings)

          if (gameState.currentPlayer.isVoter) {
            gameVotingManager.addPlayer(gameState.currentPlayer.id)
          } else {
            gameVotingManager.removePlayer(gameState.currentPlayer.id)
            this.updateVotingZoneRender(undefined) // disable voting zone highlight if the player is standing on it
          }
  
          // Trigger a player update to reflect any rendering update
          this.players.getChildren().map((gameObject) => this.handlePlayerVisibilityWhileVoting(gameObject as Player))
        }
      }
    })

    // Prevent player to keep moving by inertia on hard stop
    autorun(() => {
      if (!gameState.playerCanMove) {
        this.hardStopCurrentPlayerMovement()
      }
    })

    // Send respawn event to server
    autorun(() => {
      // Respawn player to main island
      if (gameState.respawnFlagEnabled) {
        gameState.disableRespawnFlag();
        this.socket.emit(NetworkEventKeys.PlayerRestartPosition)
      }

      // RESET GAME
      if (gameState.restartGame) {
        gameState.disableRestartGameFlag();
        this.socket.emit(NetworkEventKeys.RestartGame);
      }
    })

    // Send event to server to join fight
    autorun(() => {
      if (gameState.gameFight.playerWantsToFight) {
        this.socket.emit(NetworkEventKeys.PlayerJoinFight);
      }
    })

    // Show/Hide HUD on fight mode
    autorun(() => {
      this.scene.setVisible(!gameState.gameFight.fightMode, SceneKeys.Hud);
    })

    // Dark mode
    autorun(() => {
      if (gameState.darkMode) {
        this.startRain();
      } else {
        this.stopRain();
      }
    })

    // Show/Hide Username labeles
    autorun(() => {
      const newValue = gameState.showPlayersUsernames;
      (this.players.getChildren() as Player[]).forEach((player) => {
        player.setRenderUsername(newValue);
      })
    })

    // Another player has updated it's settings
    this.socket.on(NetworkEventKeys.PlayerSettingsUpdate, (playerSettings: PlayerSettings) => {
      if (playerSettings.id) {
        const playerId: PlayerId = playerSettings.id;
        gameState.updatePlayerSettings(playerId, playerSettings)
        playerSettings.isVoter ? gameVotingManager.addPlayer(playerId) : gameVotingManager.removePlayer(playerId)
      } else {
        console.error("Can't update remote player settings without player's id: ", playerSettings)
      }
    })

    this.socket.on(NetworkEventKeys.RestartGame, () => {
      // Stop fight mode
      gameState.gameFight.clear();

      // Revive dead players
      this.restorePlayersHealth();

      // Close open menus
      const hudScene = this.scene.get(SceneKeys.Hud) as Hud;
      hudScene.closeMenus();

      // Display player's health bar
      this.setPlayersHealthBarVisibility(false);

      // Make sure our player is visible
      this.renderPlayersAsDefault();
      // this.currentPlayer.setVisible(true);
      // (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setEnable(false);
      // this.currentPlayerVision.setVisible(true);
      // gameState.playerCanMove = true;

      // Clear blood
      this.bloodSplatterRenderTexture.clear();
    })

    this.socket.on(NetworkEventKeys.StartFightWaitingRoom, () => {
      // Start fight mode
      gameState.gameFight.onWaitingRoom = true;

      // Close open menus
      const hudScene = this.scene.get(SceneKeys.Hud) as Hud
      hudScene.closeMenus()
    })

    this.socket.on(NetworkEventKeys.StartFight, (data: StartFight) => {
      // Start fight mode
      gameState.gameFight.fightMode = true;

      // Set players who are going to fight (the rest of the players will be viewers)
      gameState.gameFight.addFighters(data.fighters);

      // Render options depending if the player is a fighter or a viewer
      (this.players.getChildren() as Player[]).forEach(player => {
        if (data.fighters.includes(player.id)) {
          this.renderPlayerAsFighter(player);
        } else {
          this.renderPlayerAsFightViewer(player);
        }
      });

      // Close open menus
      const hudScene = this.scene.get(SceneKeys.Hud) as Hud;
      hudScene.closeMenus();

      if (!gameState.gameFight.playerWantsToFight) {
        // Make the camara to follow a fighter
        this.followNextFighter();

        // Show player's usernames
        gameState.showPlayersUsernames = true;
      } 

      // Clear blood
      this.bloodSplatterRenderTexture.clear();
    })

    this.socket.on(NetworkEventKeys.EndFight, (data: EndFight) => {
      const player = this.getPlayerById(data.winnerId);
      if (!player) return;

      // Set player as winner (stars an animation)
      player.winner();

      // Freeze player
      if (this.currentPlayerId === data.winnerId) {
        gameState.playerCanMove = false;
      }
    });

    this.socket.on(NetworkEventKeys.PlayerFightAction, (action: PlayerFightAction) => {
      if (!gameState.gameFight.fightMode) return

      const player = this.getPlayerById(action.playerId);
      if (!player) {
        console.error("Couldn't find player with id " + action.playerId);
        return;
      }

      player.fight()
    })

    this.socket.on(NetworkEventKeys.PlayerHurt, (data: PlayerHurt) => {
      if (!gameState.gameFight.fightMode) return

      const player = this.getPlayerById(data.playerId);
      if (!player) {
        console.error("Couldn't find player with id " + data.playerId);
        return;
      }

      gameState.updatePlayerHealth(data.playerId, data.health)

      // Paint player in red for half a second
      player.setTint(0xff0000)
      this.time.delayedCall(500, () => player.clearTint())

      player.hurt(data.damage, data.orientation);
    });

    this.socket.on(NetworkEventKeys.PlayerDead, (data: PlayerDead) => {
      if (!gameState.gameFight.fightMode) return

      const player = this.getPlayerById(data.playerId);
      if (!player) {
        console.error("Couldn't find player with id " + data.playerId);
        return;
      }

      gameState.updatePlayerHealth(data.playerId, 0)

      // Paint player in red for half a second
      player.kill();

      if (data.playerId === this.currentPlayerId) {
        gameState.playerCanMove = false;
      }
    });
  }

  createVotingZoneEmitter(): void {
    if (!this.votingZoneParticlesEmitter) {
      // Emitter when the voting zone is active
      this.votingZoneParticlesEmitter = this.add.particles(TextureKeys.Stars).createEmitter({
        frame: { frames: [ 0, 1, 2, 3 ], cycle: false },
        tint: 0xfaff74,
        // quantity: 48,
        lifespan: 500,
        scale: { start: 0.6, end: 0, ease: Phaser.Math.Easing.Sine.InOut },
        blendMode: Phaser.BlendModes.ADD,
        on: false,
      });
    }

    if (!this.votingZoneExplodeParticlesEmitter) {
      // Emitter when the voting zone turns to inactive
      this.votingZoneExplodeParticlesEmitter = this.add.particles(TextureKeys.Stars).createEmitter({
        frame: { frames: [ 0, 1, 2, 3 ], cycle: false },
        tint: 0xfaff74,
        speed: 90,
        lifespan: 2000,
        quantity: 28,
        frequency: 6000,
        scale: { start: 0.5, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        on: false,
      })
      .onParticleDeath(() => {
        if (this.votingZoneExplodeParticlesEmitter?.getAliveParticleCount() === 0) {
          // Stop itself
          this.votingZoneExplodeParticlesEmitter?.stop();
        }
      });
    }
  }

  updateVotingZoneEmitter(x: number, y: number, votingZone: Phaser.Types.GameObjects.Particles.RandomZoneSource): void {
    if (!this.votingZoneParticlesEmitter || !this.votingZoneExplodeParticlesEmitter) {
      this.createVotingZoneEmitter();
    }

    const emitZone: Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig = {
      type: 'random',
      source: votingZone,
    };

    this.votingZoneParticlesEmitter?.setEmitZone(emitZone);
    this.votingZoneParticlesEmitter?.setPosition(x, y);
    
    this.votingZoneExplodeParticlesEmitter?.setEmitZone(emitZone);
    this.votingZoneExplodeParticlesEmitter?.setPosition(x, y);
  }

  // The player is fighting and fightmode is enabled
  private renderPlayerAsFighter(player: Player): void {
    player.healthBarIsVisible = true;
  }

 // The player is NOT fighting and fightmode is enabled
  private renderPlayerAsFightViewer(player: Player): void {
    player.setVisible(false);
    // For some reason, set visible is not enough
    player.setAlpha(0);
    player.healthBarIsVisible = false;
    player.setRenderUsername(false);
    (player.body as Phaser.Physics.Arcade.Body).setEnable(false);
    if (player.id === this.currentPlayerId) {
      gameState.playerCanMove = false;
    }
  }

  // Fightmode is not enabled. Default render to all players.
  private renderPlayersAsDefault(): void {
    (this.players.getChildren() as Player[]).forEach(player => {
      player.setVisible(true);
      player.setAlpha(1);
      player.healthBarIsVisible = false;
      player.setRenderUsername(gameState.showPlayersUsernames);
      (player.body as Phaser.Physics.Arcade.Body).setEnable(true);
      if (player.id === this.currentPlayerId) {
        gameState.playerCanMove = true;
      }
    });

    this.cameras.main.startFollow(this.currentPlayer, true)
  }

  private getPlayerById(playerId: PlayerId): Player | undefined {
    return (this.players.getChildren() as Player[]).find(player => player.id === playerId);
  }

  private createRainParticles(): void {
    this.rainParticlesEmitter = this.add.particles(TextureKeys.Rain).setDepth(100).createEmitter({
      frame: 0,
      x: { min: this.cameras.main.worldView.left - 150, max: this.cameras.main.worldView.right + 150 },
      y: { min: this.cameras.main.worldView.top - 200, max: this.cameras.main.worldView.top },
      lifespan: 600,
      speedX: { min: 0, max: 200 },
      speedY: 1500,
      quantity: { min: 15, max: 30 },
      rotate: { min: 80, max: 100 },
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      on: false,
      alpha: 0.6,
    });
  }

  private startRain(): void {
    if (this.isRaining) return;
    this.isRaining = true;

    if (this.lightTweens.length === 0) {
      this.visionMaskContainer.each((gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject !== this.currentPlayerVision) {
          const tween = this.tweens.add({
            targets: gameObject,
            scale: 0.8,
            duration: Phaser.Math.Between(1500, 2500),
            ease: Phaser.Math.Easing.Bounce.InOut,
            loop: -1,
            yoyo: true,
            loopDelay: Phaser.Math.Between(0, 250),
          });
          this.lightTweens.push(tween);
        }
      })
    }
    this.lightTweens.forEach((tween: Phaser.Tweens.Tween) => tween.restart())

    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 1500,
      onStart: () => {
        this.currentPlayerVision.setActive(true);
        this.renderTexture.setTint(0x0a2948);
        this.renderTexture.setAlpha(0);
      },
      onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          this.renderTexture.setAlpha(value/100);
      },
      onComplete: () => {
        if (!this.rainParticlesEmitter) {
          this.createRainParticles()
        }
        this.rainParticlesEmitter?.start();
      }
    });
  }

  private stopRain(): void {
    if (!this.isRaining) return;
    this.isRaining = false;

    this.lightTweens.forEach((tween: Phaser.Tweens.Tween) => tween.stop())

    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 1500,
      onStart: () => {
        this.rainParticlesEmitter?.stop();
      },
      onUpdate: (tween) => {
          if (!this.renderTexture.isTinted) {
            return;
          }
          const value = Math.floor(tween.getValue());
          this.renderTexture.setAlpha(1 - value/100);
      },
      onComplete: () => {
        this.currentPlayerVision.setActive(false);
        this.renderTexture.clearTint();
      }
    });
  }

  restorePlayersHealth(): void {
    gameState.restorePlayersHealth();
    (this.players.getChildren() as Player[]).forEach(player => player.revive());
    gameState.playerCanMove =  true;
  }

  setPlayersHealthBarVisibility(visibility: boolean): void {
    (this.players.getChildren() as Player[]).forEach(player => player.healthBarIsVisible = visibility);
  }

  updatePlayerState(newPlayerState: PlayerState): void {
    const { playerId } = newPlayerState;
    const player = this.getPlayerById(playerId);
    if (!player) return;

    // UNCAUGHT BUG: For some reason I couldn't find yet, the player
    // rendering needs to be moved by 16 pixels in X and Y. 
    // Remove this when the bug is fixed
    const errorOffset = 16;
    const isCurrentPlayer = newPlayerState.playerId === this.currentPlayerId

    player.setPosition(newPlayerState.x + errorOffset, newPlayerState.y + errorOffset)
    player.update(newPlayerState.movementInput)

    this.handleFootprintTrail(player);

    if (gameState.getPlayer(player.id)?.isVoter) {
      gameVotingManager.setVote(player.id, newPlayerState.votingZone)

      if (isCurrentPlayer) {
        this.updateVotingZoneRender(newPlayerState.votingZone)
      }
    }

    this.handlePlayerVisibilityWhileVoting(player)
  }

  private handleFootprintTrail(player: Player): void {
    if (player.id === this.currentPlayerId && this.steps.length > 0) {
      const stepY = player.y + player.displayHeight * 0.45;
      const stepTilePosition = this.mapIsland.worldToTileXY(player.x, stepY);
      const sandTile = this.mapIsland.getTileAt(stepTilePosition.x, stepTilePosition.y, false, 'Island 1/Main Island') || this.mapIsland.getTileAt(stepTilePosition.x, stepTilePosition.y, false, 'Island 1/Voting Islands');
      const vegetationTile = this.mapIsland.getTileAt(stepTilePosition.x, stepTilePosition.y, false, 'Island 1/Vegetation bottom');
      const doStep: boolean = sandTile && sandTile.properties?.groundType === 'sand' && !vegetationTile;
      if (
        doStep && Math.hypot(this.steps[0].x - player.x, this.steps[0].y - stepY) > 50
      ) {
        // did the player move far enough to generate a new step
        if (this.steps.length >= 8) {
          this.steps.unshift(this.steps.pop()!.setAlpha(1));
          let rotation: number;
          switch (player.orientation) {
            case 'up':
              rotation = 360 - 90;
              break;
            case 'down':
              rotation = 90;
              break;
            case 'left':
              rotation = 180;
              break;
            case 'right':
            default:
              rotation = 0;
          }

          this.steps[0].setPosition(player.x, stepY).setAngle(rotation);
        } else {
          this.steps.unshift(
            this.add.image(player.x, stepY, TextureKeys.Footprints, Phaser.Math.Between(0, 3))
          );
        }
      }
    }
  }

  handlePlayerVisibilityWhileVoting(player: Player): void {
    const isCurrentPlayer = player.id === this.currentPlayerId
    if (!isCurrentPlayer && gameState.votingFrontierY) {
      const playerIsVoting = player.y < gameState.votingFrontierY
      const isHidden = gameState.hidePlayersWhileVoting && playerIsVoting
      player.setVisible(!isHidden)

      if (
        player.y - 2 <= gameState.votingFrontierY &&
        gameState.votingFrontierY <= player.y + 2
      ) {
        // Emit particles when the voting frontier is crossed
        const emitter = this.add
          .particles(TextureKeys.Stars)
          .createEmitter({
            frame: { frames: [0, 1, 2, 3], cycle: true },
            tint: 0xfaff74,
            speed: 90,
            lifespan: 1000,
            quantity: 100,
            frequency: 6000,
            scale: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
            on: false,
          })
          .onParticleDeath(() => {
            if (emitter.getAliveParticleCount() === 0) {
              // Self destroy
              emitter.stop().remove();
            }
          })
          .setPosition(player.x, player.y)
          .start();
      }
    }
  }

  handleThrowableWeaponPlayerOverlap(
    obj1: Phaser.GameObjects.GameObject, // Weapon
    obj2: Phaser.GameObjects.GameObject, // Player
  ) {
    const player = obj1 as Player
    const throwable = obj2 as AbstractThrowableWeapon

    // Avoid collisions with the player who thrown the weapon
    if (player.id === throwable.thrownBy) return;

    // Avoid collisions with dead players
    if (player.isDead) return;

    throwable.disableBody();
    throwable.setVisible(false);
  }

  update(t: number, dt: number) {
    this.handleMovementInput()
    this.handleFootprintTrailVanish(dt)
    this.handleFightInput()
    this.handleFightCamera()
    this.handleFightEffects()
  }

  private handleMovementInput(): void {
    if (!gameState.playerCanMove) return

    const newMovementInput: MovementInput = { ...this.lastMovementInput }

    if (this.cursors.left.isDown && !this.cursors.right.isDown) {
      newMovementInput.left = true
    } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
      newMovementInput.right = true
    } else {
      newMovementInput.left = false
      newMovementInput.right = false
    }

    if (this.cursors.up.isDown && !this.cursors.down.isDown) {
      newMovementInput.up = true
    } else if (this.cursors.down.isDown && !this.cursors.up.isDown) {
      newMovementInput.down = true
    } else {
      newMovementInput.up = false
      newMovementInput.down = false
    }

    this.updateLastMovementInput(newMovementInput)
  }

  private updateLastMovementInput(movementInput: MovementInput): void {
    // Capture last movement to compare what changed
    const { left, right, up, down } = this.lastMovementInput
    if (
      left !== movementInput.left ||
      right !== movementInput.right ||
      up !== movementInput.up ||
      down !== movementInput.down
    ) {
      this.lastMovementInput = movementInput
      this.socket.emit(NetworkEventKeys.PlayersInput, this.lastMovementInput)

      this.currentPlayer.update(this.lastMovementInput)
    }
  }

  private handleFightInput(): void {
    // Only in fight mode
    if (!gameState.gameFight.fightMode) return

    // Only if the player is a fighting
    if (!gameState.gameFight.playerWantsToFight) return

    if (this.currentPlayer && this.currentPlayer.isDead) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      if (this.currentPlayer.fight()) {
        this.socket.emit(NetworkEventKeys.PlayerFightAction)
      }
    }
  }

  private handleFightCamera(): void {
    // Only in fight mode
    if (!gameState.gameFight.fightMode) return

    // Only if the player is a fight viewer (not a fighter)
    if (gameState.gameFight.playerWantsToFight) return

    // Start following a fighter
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.followNextFighter();
    }
  }

  private followNextFighter(): void {
      const currentIdx = this.fightCameraFollowedPlayerIndex || 0;
      const fighters = gameState.gameFight.getAllFighters();

      let nextIdx = currentIdx + 1;
      if (fighters.length === nextIdx || !fighters[nextIdx]) {
        nextIdx = 0;
      }

      const playerId = fighters[nextIdx]
      const player = this.getPlayerById(playerId)
      this.fightCameraFollowedPlayerIndex = nextIdx;

      player && this.cameras.main.startFollow(player, true)
  }

  private handleFightEffects(): void {
    // Only in fight mode
    if (!gameState.gameFight.fightMode) return

    // The player that is beeing followed by the camera
    let followedPlayer: Player; 

    if (gameState.gameFight.playerWantsToFight) {
      followedPlayer = this.currentPlayer;
    } else {
      const index = this.fightCameraFollowedPlayerIndex || 0;
      const fighters = gameState.gameFight.getAllFighters();
      followedPlayer = this.getPlayerById(fighters[index])!
    }

    if (this.currentPlayerVision && this.currentPlayerVision.active && followedPlayer) {
      this.currentPlayerVision.setPosition(followedPlayer.x, followedPlayer.y);
    }
    this.rainParticlesEmitter?.setPosition({ min: this.cameras.main.worldView.left - 150, max: this.cameras.main.worldView.right + 150 }, { min: this.cameras.main.worldView.top - 200, max: this.cameras.main.worldView.top })
  }

  private handleFootprintTrailVanish(delta: number): void {
    this.steps.forEach((step: Phaser.GameObjects.Image) => step.setAlpha(step.alpha - (delta / 4000)))
  }
    
  hardStopCurrentPlayerMovement() {
    this.updateLastMovementInput({
      left: false,
      right: false,
      up: false,
      down: false,
    })
  }

  updateVotingZoneRender(newVotingZoneValue: VotingZoneValue) {
    const getVotingZone = (value: VotingZoneValue) => this.votingZones.find((votingZone) => votingZone.value === value)
    if (this.currentVotingZoneValue === undefined) {
      if (newVotingZoneValue) {
        this.currentVotingZoneValue = newVotingZoneValue
        const votingZone = getVotingZone(newVotingZoneValue)
        votingZone?.zone.setFillStyle(0x9966ff, 0.8)
        if (votingZone?.zone) {
          this.updateVotingZoneEmitter(votingZone.zone.x, votingZone.zone.y, votingZone.zone.geom)
          this.votingZoneParticlesEmitter?.start()
        }
      }
    } else {
      if (newVotingZoneValue === undefined) {
        const votingZone = getVotingZone(this.currentVotingZoneValue)
        this.currentVotingZoneValue = undefined
        votingZone?.zone.setFillStyle(0x9966ff, 0.5)
        this.votingZoneParticlesEmitter?.stop()
        this.votingZoneExplodeParticlesEmitter?.start()
      }
    }
  }

  handleServerReconnect() {
    const isServerReconnect = this.disconnectedFromServer
    if (isServerReconnect) {
      console.log('Reconnecting - Destroying players')
      this.disconnectedFromServer = false
      this.players.clear(true, true)
    }
  }

  addPlayer(playerInitialState: PlayerInitialState, isMainPlayer = true): void {
    const player = PlayerFactory.fromPlayerInitialState(this, playerInitialState)

    player.setDepth(5)

    // Show player's username
    player.setRenderUsername(gameState.showPlayersUsernames);

    if (isMainPlayer) {
      this.currentPlayer = player
      this.currentPlayer.setThrowableWeapon(this.currentPlayerThrowableWeapons);
      this.currentPlayerVision = this.make.image({
        x: player.x,
        y: player.y,
        key: TextureKeys.VisionMask,
        add: false,
        scale: 1,
      })
      this.visionMaskContainer.add(this.currentPlayerVision);
      this.renderTexture.setMask(new Phaser.Display.Masks.BitmapMask(this, this.visionMaskContainer))
      this.renderTexture.mask.invertAlpha = true;
      this.currentPlayerVision.setActive(false)
    } else {
      player.setThrowableWeapon(this.restOfPlayersThrowableWeapons);
    }
    
    // Add player to physics engine
    this.physics.add.existing(player)
    const avatarSetting = playerInitialState.avatar
    const { sizeFactor } = avatarSetting.body

    // Set player's shape in physics engine
    const playerBody = player.body as Phaser.Physics.Arcade.Body
    playerBody.setSize(
      sizeFactor * avatarSetting.body.size.width,
      sizeFactor * avatarSetting.body.size.height,
      avatarSetting.body.size.center,
    )
    playerBody.setOffset(
      sizeFactor * avatarSetting.body.offset.x,
      sizeFactor * avatarSetting.body.offset.y,
    )

    // Add player to scene
    this.add.existing(player)

    // Add player to players group
    this.players.add(player)

    if (playerInitialState.playerSettings.isVoter) {
      gameVotingManager.addPlayer(player.id, playerInitialState.votingZone)
    }
    gameState.addPlayer(player.id, playerInitialState.playerSettings, isMainPlayer)

    // Hide the player if it's on voting islands
    this.handlePlayerVisibilityWhileVoting(player)

    // Show health bar on fight mode
    player.healthBarIsVisible = gameState.gameFight.fightMode;
  }

  removePlayer(playerId: PlayerId) {
    const player = this.getPlayerById(playerId);
    if (player) {
      player.destroy()
      gameVotingManager.removePlayer(playerId)
      gameState.removePlayer(playerId)
    }
  }
}
