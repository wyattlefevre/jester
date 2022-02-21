import { GameIds } from '../GameIds'
import { GameInstance, GameInfo, GameSetting, GameSettingDescription } from '../GameInstance'

class Superlatives implements GameInstance {
  applySettings = (settings: GameSetting[]) => {
    console.log('applying game settings')
  }
  validateSettings: (settings: GameSetting[]) => boolean
  start: () => boolean
  static gameId: number = GameIds.Superlatives
  static gameName: string = 'superlatives'
  static gameDescription: string = 'a fun superlatives party game'
  static gameSettingDescriptions: GameSettingDescription[] = [
    {
      name: 'example',
      type: 'string',
      defaultValue: 'default value',
    },
  ]
  static playerLimit: number = 10
  static getInfo(): GameInfo {
    return {
      gameId: this.gameId,
      gameName: this.gameName,
      gameDescription: this.gameDescription,
    }
  }
}

export default Superlatives
