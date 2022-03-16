import { GameIds } from '../GameIds'
import { GameInstance, GameInfo, GameSetting, GameSettingDescription } from '../GameInstance'
import { PromptType } from '../Prompt'
import Room from '../Room'

class Superlatives implements GameInstance {
  private room: Room
  applySettings(settings: GameSetting[]) {
    console.log('applying game settings')
  }
  validateSettings: (settings: GameSetting[]) => boolean
  start(room: Room) {
    this.room = room
    console.log('superlatives game started!!')
    console.log('prompting all players...')
    this.room.promptPlayers({
      promptId: '1',
      prompt: 'ready to play?',
      rules: {
        type: PromptType.Selection,
        limit: 1,
        responseOptions: ['yes', 'no'],
      },
    })
  }

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
  static playerMinimum: number = 3
  static getInfo(): GameInfo {
    return {
      gameId: this.gameId,
      gameName: this.gameName,
      gameDescription: this.gameDescription,
    }
  }
}

export default Superlatives
