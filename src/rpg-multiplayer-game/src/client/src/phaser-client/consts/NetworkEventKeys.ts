enum NetworkEventKeys {
  // Initial position of players
  PlayersInitialStatusInfo = 'players-initial-status-info',

  // Players positions update
  PlayersStatusUpdate = 'players-status-update',
  
  // Player settings update
  PlayerSettingsUpdate = 'player-settings-update',

  // New player joined
  PlayersNew = 'players-new',

  // A player left
  PlayersLeft = 'players-left',

  // A player has pressed a key
  PlayersInput = 'players-input',

  // An error happened in the server
  ServerError = 'server-error',

  // Server went offline or internet went down
  ServerOffline = 'disconnect',
}

export default NetworkEventKeys
