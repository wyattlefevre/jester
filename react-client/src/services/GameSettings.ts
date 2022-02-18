export interface GameSettingDescription {
  name: string
  type: 'string' | 'number'
  defaultValue: string | number
}

export interface GameSetting {
  name: string
  value: string | number
}
