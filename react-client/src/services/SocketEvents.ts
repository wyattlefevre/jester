export enum ClientEvents {
  Connect = 'connect',
  Disconnect = 'disconnect',
  JoinRoom = 'join-room',
  JoinRoomAsHost = 'join-room-as-host',
  UpdatePlayerList = 'update-player-list',
  StartGame = 'start-game',
  NextPhase = 'next-phase',
  Prompt = 'prompt',
  PromptResponse = 'prompt-response',
  Error = 'error',
  Message = 'message',
}
