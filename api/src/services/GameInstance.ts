export interface GameInfo {
  gameId: number
  gameName: string
  gameDescription: string
}

export interface GameInstance {
  applySettings: (settings: GameSetting[]) => void
  start: () => boolean // will need to pass in WS connections or something so it knows who to communicate with. also maybe a callback for when it's finished
  validateSettings: (settings: GameSetting[]) => boolean
}

export interface GameSettingDescription {
  name: string
  type: 'string' | 'number'
  defaultValue: string | number
}

export interface GameSetting {
  name: string
  value: string | number
}
