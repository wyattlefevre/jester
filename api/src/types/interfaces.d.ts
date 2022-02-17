interface GameInfo {
  gameId: number
  gameName: string
  gameDescription: string
}

interface Game {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly settingDescriptions: GameSettingDescription[]
  updateSettings: (settings: GameSetting[]) => boolean
  start: () => boolean // will need to pass in WS connections or something so it knows who to communicate with. also maybe a callback for when it's finished
  getInfo: () => GameInfo
  validateSettings: (settings: GameSetting[]) => boolean
}

interface GameSettingDescription {
  name: string
  type: 'string' | 'number'
  defaultValue: string | number
}

interface GameSetting {
  name: string
  value: string | number
}
