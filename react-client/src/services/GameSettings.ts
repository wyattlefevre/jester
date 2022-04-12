export interface GameSettingDescription {
  name: string
  description?: string
  type: 'number' | 'boolean'
  defaultValue: number | boolean
  min?: number
  max?: number
}

export interface GameSetting {
  name: string
  value: number | boolean
}
