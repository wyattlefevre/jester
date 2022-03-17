import { GameIds } from '../GameIds'
import { GameInstance, GameInfo, GameSetting, GameSettingDescription } from '../GameInstance'
import HostMessage, { HostMessageSizes } from '../HostMessage'
import { Prompt, PromptResponse, PromptType } from '../Prompt'
import PromptManager from '../PromptManager'
import Room from '../Room'

export default class Superlatives implements GameInstance {
  private NAMES_PER_PLAYER = 3
  private room: Room
  private promptManager: PromptManager
  private namesList: string[]
  private currentPhase: number = 0
  applySettings(settings: GameSetting[]) {
    console.log('applying game settings')
  }
  validateSettings: (settings: GameSetting[]) => boolean
  start(room: Room, onGameEnd: () => void) {
    this.room = room
    this.namesList = []
    this.currentPhase = 0
    console.log('superlatives game started!!')
    this.executeCurrentPhase()
  }

  nextPhase() {
    this.currentPhase++
    this.executeCurrentPhase()
  }
  executeCurrentPhase() {
    this.phases[this.currentPhase]()
  }

  setPromptManager(promptManager: PromptManager) {
    this.promptManager = promptManager
  }

  private nameGenerationPhase = () => {
    this.room.messageHost([
      { text: 'Names', size: HostMessageSizes.large },
      { text: 'example name', size: HostMessageSizes.small },
    ])
    const nameGenerationPrompt: Prompt = {
      promptId: 'name-generation',
      prompt: 'Add names to the pool',
      rules: {
        type: PromptType.FreeResponse,
        limit: this.NAMES_PER_PLAYER,
        responseOptions: [],
      },
    }
    this.promptManager.openPrompt(
      nameGenerationPrompt.promptId,
      nameGenerationPrompt.rules,
      (nickname: string, value: string) => {
        this.namesList.push(value)
        const nameListMessages: HostMessage[] = this.namesList.map((name) => {
          return { text: name, size: HostMessageSizes.small }
        })
        this.room.messageHost([
          { text: 'Names', size: HostMessageSizes.large },
          ...nameListMessages,
        ])
      },
    )
    this.room.promptPlayers(nameGenerationPrompt)
  }
  private superlativeGenerationPhase = () => {
    //close prompt from last phase
    //open prompt of current phase
  }
  private votingPhase = () => {}
  private resultsPhase = () => {}
  private readonly phases = [
    this.nameGenerationPhase,
    this.superlativeGenerationPhase,
    this.votingPhase,
    this.resultsPhase,
  ]

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

export enum SuperlativesEvents {}
