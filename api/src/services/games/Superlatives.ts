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
  private currentSuperlativeIndex = 0
  private votingRound = 1
  private superlativeVotes: Map<string, Map<string, number>> // superlative -> nickname -> number of votes

  applySettings(settings: GameSetting[]) {
    console.log('applying game settings')
    console.log(settings)
    settings.forEach((setting) => {
      switch (setting.name) {
        case 'Names per player':
          if (typeof setting.value === 'number' && setting.value > 0 && setting.value < 5)
            this.NAMES_PER_PLAYER = setting.value
          break
        case 'Superlatives per player':
          if (typeof setting.value === 'number' && setting.value > 0 && setting.value < 5)
            this.SUPERLATIVES_PER_PLAYER = setting.value
          break
        case 'Include Player Names':
          if (typeof setting.value === 'boolean') this.INCLUDE_CURRENT_PLAYERS = setting.value
          break
      }
    })
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
    this.currentSuperlativeIndex = 0
    this.superlativeVotes = new Map<string, Map<string, number>>()
    console.log('superlatives game started!!')
    this.executeCurrentPhase()
  }

  nextPhase() {
    console.log('in game: nextPhase()')
    if (this.voting) {
      console.log('calling voting phase (still voting)')
      this.currentSuperlativeIndex = this.votingRound
      console.log(this.currentSuperlativeIndex, this.votingRound)
      this.votingPhase()
      this.votingRound += 1
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
    const currentSuperlative = this.superlativeList[this.currentSuperlativeIndex]
    console.log('voting phase. current superlative:', currentSuperlative)
    if (this.currentSuperlativeIndex === 0) {
      this.promptManager.closePrompt(SuperlativePromptIds.SuperlativeGeneration)
    } else {
      this.promptManager.closePrompt(
        SuperlativePromptIds.SuperlativeVotePre +
          this.superlativeList[this.currentSuperlativeIndex - 1],
      )
    }
    this.room.allPlayersPromptClose()

    this.room.messageHost([
      { text: 'Time to vote!', size: HostMessageSizes.large },
      { text: currentSuperlative, size: HostMessageSizes.medium },
      { text: '', size: HostMessageSizes.medium },
      { text: 'Who has voted:', size: HostMessageSizes.small },
    ])

    const playersThatHaveVoted = new Set<string>()
    const superlativeVotePrompt: Prompt = {
      promptId: SuperlativePromptIds.SuperlativeVotePre + currentSuperlative,
      prompt: `Vote for: ${currentSuperlative}`,
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
        if (!this.superlativeVotes.get(currentSuperlative)) {
          this.superlativeVotes.set(currentSuperlative, new Map<string, number>())
        }
        if (!this.superlativeVotes.get(currentSuperlative).get(value)) {
          this.superlativeVotes.get(currentSuperlative).set(value, 0)
        }
        const currentCount = this.superlativeVotes.get(currentSuperlative).get(value)
        this.superlativeVotes.get(currentSuperlative).set(value, currentCount + 1)

        playersThatHaveVoted.add(nickname)
        const playersThatHaveVotedArr = Array.from(playersThatHaveVoted.keys())
        const votedMessages: HostMessage[] = playersThatHaveVotedArr.map((name) => {
          return { text: name, size: HostMessageSizes.small }
        })
        this.room.messageHost([
          { text: 'Time to vote!', size: HostMessageSizes.large },
          {
            text: currentSuperlative,
            size: HostMessageSizes.medium,
          },
          { text: '', size: HostMessageSizes.medium },
          { text: 'Who has voted:', size: HostMessageSizes.small },
          ...votedMessages,
        ])
      },
    )

    this.room.promptPlayers(superlativeVotePrompt)

    if (this.currentSuperlativeIndex + 1 >= this.superlativeList.length) {
      this.voting = false
    }
  }
  private resultsPhase = () => {
    console.log('---results phase---')
    console.log('superlativeVotes:')
    console.log(this.superlativeVotes)
    this.promptManager.closePrompt(
      SuperlativePromptIds.SuperlativeVotePre +
        this.superlativeList[this.currentSuperlativeIndex - 1],
    )
    this.room.allPlayersPromptClose()
    const superlativeResults = new Map<string, [string[], number]>() //superlative name -> winner(s)

    this.superlativeVotes.forEach((counts, superlative) => {
      let winner = []
      let currentMax = 0
      counts.forEach((count, playername) => {
        if (count > currentMax) {
          winner = [playername]
          currentMax = count
        } else if (count === currentMax) {
          winner.push(playername)
        }
      })
      superlativeResults.set(superlative, [winner, currentMax])
      console.log('winner is', winner, 'of superlative', superlative)
    })

    const resultsMessages: HostMessage[] = []
    superlativeResults.forEach(([winner, votes], superlative) => {
      let winnerString = winner.join(' ')
      resultsMessages.push({
        text: `${superlative}: ${winnerString} (${votes})`,
        size: HostMessageSizes.medium,
      })
    })
    this.room.messageHost([{ text: 'Results', size: HostMessageSizes.large }, ...resultsMessages])
  }
  private readonly phases = [
    this.nameGenerationPhase,
    this.superlativeGenerationPhase,
    this.votingPhase,
    this.resultsPhase,
  ]

  static gameId: number = GameIds.Superlatives
  static gameName: string = 'Superlatives'
  static gameDescription: string = 'A fun superlatives party game'
  static gameSettingDescriptions: GameSettingDescription[] = [
    {
      name: 'Names per player',
      description: 'The number of names a player can add to the name pool',
      type: 'number',
      defaultValue: 3,
      min: 0,
      max: 5,
    },
    {
      name: 'Superlatives per player',
      description: 'The number of superlatives a player can add to the superlative pool',
      type: 'number',
      defaultValue: 2,
      min: 0,
      max: 5,
    },
    {
      name: 'Include Player Names',
      description: 'Include player names in the name pool',
      type: 'boolean',
      defaultValue: true,
    },
  ]
  static playerLimit: number = 10
  static playerMinimum: number = 3
}

enum SuperlativePromptIds {
  NameGeneration = 'name-generation',
  SuperlativeGeneration = 'superlative-generation',
  SuperlativeVotePre = 'superlative-vote-',
}
