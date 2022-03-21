import { GameIds } from '../GameIds'
import { GameInstance, GameInfo, GameSetting, GameSettingDescription } from '../GameInstance'
import HostMessage, { HostMessageSizes } from '../HostMessage'
import { Prompt, PromptResponse, PromptType } from '../Prompt'
import PromptManager from '../PromptManager'
import Room from '../Room'

export default class Superlatives implements GameInstance {
  private NAMES_PER_PLAYER = 3
  private INCLUDE_CURRENT_PLAYERS = true
  private SUPERLATIVES_PER_PLAYER = 2
  private room: Room
  private promptManager: PromptManager
  private namesList: string[]
  private superlativeList: string[]
  private currentPhase: number = 0
  private voting: boolean = false
  private currentSuperlative = 0
  private superlativeVotes: Map<string, Map<string, number>> // superlative -> nickname -> number of votes

  applySettings(settings: GameSetting[]) {
    console.log('applying game settings')
  }
  validateSettings: (settings: GameSetting[]) => boolean
  start(room: Room, onGameEnd: () => void) {
    this.room = room
    this.namesList = []
    if (this.INCLUDE_CURRENT_PLAYERS) {
      const playerNicknames = this.room.getPlayerNames()
      this.namesList = playerNicknames
    }
    this.superlativeList = []
    this.voting = false
    this.currentPhase = 0
    this.currentSuperlative = 0
    this.superlativeVotes = new Map<string, Map<string, number>>()
    console.log('superlatives game started!!')
    this.executeCurrentPhase()
  }

  nextPhase() {
    console.log('in game: nextPhase()')
    if (this.voting) {
      console.log('calling voting phase (still voting)')
      this.votingPhase()
    } else {
      console.log('moving on to next phase')
      this.currentPhase++
      this.executeCurrentPhase()
    }
  }
  executeCurrentPhase() {
    this.phases[this.currentPhase]()
  }

  setPromptManager(promptManager: PromptManager) {
    this.promptManager = promptManager
  }

  private nameGenerationPhase = () => {
    if (this.namesList.length == 0) {
      this.room.messageHost([
        { text: 'Names', size: HostMessageSizes.large },
        { text: 'Names will appear here.', size: HostMessageSizes.small },
      ])
    } else {
      const nameListMessages: HostMessage[] = this.namesList.map((name) => {
        return { text: name, size: HostMessageSizes.small }
      })
      this.room.messageHost([{ text: 'Names', size: HostMessageSizes.large }, ...nameListMessages])
    }
    const nameGenerationPrompt: Prompt = {
      promptId: SuperlativePromptIds.NameGeneration,
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
    this.promptManager.closePrompt(SuperlativePromptIds.NameGeneration)
    this.room.allPlayersPromptClose()
    // message host
    this.room.messageHost([
      { text: 'Superlatives', size: HostMessageSizes.large },
      { text: 'Superlatives will appear here.', size: HostMessageSizes.small },
    ])
    //open prompt of current phase
    const superlativeGenerationPrompt: Prompt = {
      promptId: SuperlativePromptIds.SuperlativeGeneration,
      prompt: 'Add superlatives to the pool',
      rules: {
        type: PromptType.FreeResponse,
        limit: this.SUPERLATIVES_PER_PLAYER,
        responseOptions: [],
      },
    }

    this.promptManager.openPrompt(
      superlativeGenerationPrompt.promptId,
      superlativeGenerationPrompt.rules,
      (nickname, value) => {
        this.superlativeList.push(value)
        const superlativeListMessages: HostMessage[] = this.superlativeList.map((superlative) => {
          return { text: superlative, size: HostMessageSizes.small }
        })
        this.room.messageHost([
          { text: 'Superlatives', size: HostMessageSizes.large },
          ...superlativeListMessages,
        ])
      },
    )
    this.room.promptPlayers(superlativeGenerationPrompt)
  }
  private votingPhase = () => {
    this.voting = true
    console.log('voting phase. current superlative:', this.superlativeList[this.currentSuperlative])
    if (this.currentSuperlative === 0) {
      this.promptManager.closePrompt(SuperlativePromptIds.SuperlativeGeneration)
    } else {
      this.promptManager.closePrompt(
        SuperlativePromptIds.SuperlativeVotePre + this.superlativeList[this.currentSuperlative - 1],
      )
    }
    this.room.allPlayersPromptClose()

    this.room.messageHost([
      { text: 'Time to vote!', size: HostMessageSizes.large },
      { text: this.superlativeList[this.currentSuperlative], size: HostMessageSizes.medium },
      { text: '', size: HostMessageSizes.medium },
      { text: 'Who has voted:', size: HostMessageSizes.small },
    ])

    const playersThatHaveVoted = new Set<string>()
    const superlativeVotePrompt: Prompt = {
      promptId:
        SuperlativePromptIds.SuperlativeVotePre + this.superlativeList[this.currentSuperlative],
      prompt: `Vote for: ${this.superlativeList[this.currentSuperlative]}`,
      rules: {
        type: PromptType.Selection,
        limit: 1,
        responseOptions: [...this.namesList],
      },
    }

    this.promptManager.openPrompt(
      superlativeVotePrompt.promptId,
      superlativeVotePrompt.rules,
      (nickname, value) => {
        console.log('received vote from', nickname, value)
        if (!this.superlativeVotes.get(this.superlativeList[this.currentSuperlative])) {
          this.superlativeVotes.set(
            this.superlativeList[this.currentSuperlative],
            new Map<string, number>(),
          )
        }
        if (!this.superlativeVotes.get(this.superlativeList[this.currentSuperlative]).get(value)) {
          this.superlativeVotes.get(this.superlativeList[this.currentSuperlative]).set(value, 0)
        }
        const currentCount = this.superlativeVotes
          .get(this.superlativeList[this.currentSuperlative])
          .get(value)
        this.superlativeVotes
          .get(this.superlativeList[this.currentSuperlative])
          .set(value, currentCount + 1)

        playersThatHaveVoted.add(nickname)
        const playersThatHaveVotedArr = Array.from(playersThatHaveVoted.keys())
        const votedMessages: HostMessage[] = playersThatHaveVotedArr.map((name) => {
          return { text: name, size: HostMessageSizes.small }
        })
        this.room.messageHost([
          { text: 'Time to vote!', size: HostMessageSizes.large },
          { text: this.superlativeList[this.currentSuperlative], size: HostMessageSizes.medium },
          { text: '', size: HostMessageSizes.medium },
          { text: 'Who has voted:', size: HostMessageSizes.small },
          ...votedMessages,
        ])
      },
    )

    this.room.promptPlayers(superlativeVotePrompt)

    this.currentSuperlative++
    if (this.currentSuperlative >= this.superlativeList.length) {
      this.voting = false
    }
  }
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

enum SuperlativePromptIds {
  NameGeneration = 'name-generation',
  SuperlativeGeneration = 'superlative-generation',
  SuperlativeVotePre = 'superlative-vote-',
}
