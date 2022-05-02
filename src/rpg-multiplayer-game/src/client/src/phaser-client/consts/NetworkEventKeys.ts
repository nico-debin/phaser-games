enum NetworkEventKeys {
  // Initial position of players
  PlayersInitialStatusInfo = 'players-initial-status-info',

  // Players positions update
  PlayersStatusUpdate = 'players-status-update',

  // Player settings update
  PlayerSettingsUpdate = 'player-settings-update',

  // Send player back to initial position (main island)
  PlayerRestartPosition = 'player-restart-position',

  // New player joined
  PlayersNew = 'players-new',

  // A player left
  PlayersLeft = 'players-left',

  // A player has pressed a key
  PlayersInput = 'players-input',

  // Player fight (shoots an arrow)
  PlayerFightAction = 'player-fight-action',

  // Player has been damaged by an arrow
  PlayerHurt = 'player-hurt',

  // A player has been killed
  PlayerDead = 'player-dead',

  // Sync server's players with client
  PlayersSync = 'players-sync',

  // Restart game
  RestartGame = 'restart-game',

  // An error happened in the server
  ServerError = 'server-error',

  // Server went offline or internet went down
  ServerOffline = 'disconnect',

  /**** FIGHT EVENTS ****/
  // Player wants to fight
  PlayerJoinFight = 'player-join-fight',

  // Start waiting to other players to join
  StartFightWaitingRoom = 'start-fight-waiting-room',

  // Start fight
  StartFight = 'start-fight',

  // End fight
  EndFight = 'end-fight',
}

export default NetworkEventKeys;
