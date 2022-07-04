# Grooming Wars - Multiplayer game

<img src="https://raw.githubusercontent.com/nicodebin/phaser-games/4355d0ef450ecef90bbd0843eeba976989f18edb/src/rpg-multiplayer-game/screenshots/Screenshot%202022-04-07%20at%2023.07.20.png" width="600">

## About Grooming Wars
Grooming Wars is a tool into a game. It's a fun approach to let a team estimate story points during a [grooming session](https://www.productplan.com/glossary/backlog-grooming/). So it's a 2D top-down multiplayer game where a player has it's own avatar and must lead it to the corresponding "voting island" to estimate the backlog ticket in discussion. Once all players have voted, a board with the results comes up, and you have the chance to ether restart the game for a new estimation or "fight for your vote" which takes players to a battle island where they can shoot arrows. Last survivor is the winner. The game restarts after the fight is over.
## How to run the game

1. Run `yarn` to install dependencies
2. Run `yarn build` to build client and server.
3. Run `yarn start` to start the node server. Will start listening by default on port 8082.
4. Open `http://localhost:8082/` to connect a new client.

## How to make changes to the client or the server

1. Go to the desired directory (`src/client` or `src/server`)
2. Run `yarn` to install dependencies
3. Add your changes to the code
4. Run `yarn build` to compile
5. Restart the server

## How to deploy
Run `yarn deploy` to push master branch to heroku.

## Setup and Credits

- Language: [Typescript](https://www.typescriptlang.org/)
- Server: [NodeJS](https://nodejs.org/)
- Networking: [Socket.IO](https://socket.io/)
- Game Engine: [Phaser 3](https://phaser.io/)
- Phaser plugins:
  - [RexUI](https://github.com/rexrainbow/phaser3-rex-notes/)
- Login page:
  - [React](https://reactjs.org/)
- State management:
  - [MobX](https://mobx.js.org/)
  - [zustand](https://github.com/pmndrs/zustand) - _To be removed_
- Assets:
  - UI:
    - [Wooden GUI Set
](https://www.gamedevmarket.net/asset/wooden-gui-set-8857/)
  - Login Background:
    - [Voxel world](https://unsplash.com/es/fotos/Ue97JK9S0QE) by [Simon Lee](https://unsplash.com/es/@simonppt)
  - Tilemaps:
    - [Beach Tileset]((https://finalbossblues.itch.io/tf-beach-tileset)) by [finalbossblues](https://www.patreon.com/finalbossblues)
  - Avatars
    - All avatars where made using [Universal-LPC-Spritesheet-Character-Generator](https://github.com/sanderfrenken/Universal-LPC-Spritesheet-Character-Generator)
    - The assets used to generate the avatars are in `src/client/public/credits/all-credits.csv`
  - NPC
    - [Cobra](https://opengameart.org/content/king-cobra)
  