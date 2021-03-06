import PromptManager from './PromptManager'
import Room from './Room'

export interface GameInfo {
  gameId: number
  gameName: string
  gameDescription: string
}

export interface GameInstance {
  applySettings: (settings: GameSetting[]) => void
  start: (room: Room, onGameEnd: () => void) => void // will need to pass in WS connections or something so it knows who to communicate with. also maybe a callback for when it's finished
  nextPhase: () => void
  validateSettings: (settings: GameSetting[]) => boolean
  setPromptManager: (promptManager: PromptManager) => void
}

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
