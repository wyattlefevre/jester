import { GameIds } from '../GameIds'
import { GameInstance, GameSetting, GameSettingDescription } from '../GameInstance'
import { HostMessageSizes } from '../HostMessage'
import { Prompt, PromptType } from '../Prompt'
import PromptManager from '../PromptManager'
import Room from '../Room'

export default class MedevialRPS implements GameInstance {
  private promptManager: PromptManager
  private room: Room
  private bracket: string[]
  private fightInProgress: boolean
  private fighterMovePrompt: Prompt = {
    promptId: MedievalRPSPromptIds.FighterMove,
    prompt: 'Make your move',
    rules: {
      type: PromptType.Selection,
      limit: 1,
      responseOptions: [MedievalMoves.Shield, MedievalMoves.Sword, MedievalMoves.Axe],
    },
  }

  applySettings(settings: GameSetting[]) {}
  validateSettings: (settings: GameSetting[]) => boolean
  setPromptManager(promptManager: PromptManager) {
    this.promptManager = promptManager
  }

  start(room: Room, onGameEnd: () => void) {
    this.room = room
    console.log('Medieval RPS game started!')
    this.room.messageHost([
      { text: 'hello from rps', size: HostMessageSizes.medium },
      { text: 'click next to start', size: HostMessageSizes.small },
    ])
    this.bracket = this.room.getPlayerNames()
    this.shuffle(this.bracket)
    this.fightInProgress = false
  }

  nextPhase() {
    if (this.fightInProgress) {
      return
    }
    this.runNextFight()
  }

  private shuffle(array) {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
  }

  private runNextFight() {
    this.fightInProgress = true
    if (this.bracket.length < 2) {
      this.endGame()
      return
    }
    let p1 = this.bracket.shift()
    let p2 = this.bracket.shift()
    this.runFight(p1, p2)
  }

  private runFight(p1: string, p2: string) {
    this.promptManager.resetResponseCounts(this.fighterMovePrompt.promptId)
    console.log(`runfight p1: ${p1}, p2: ${p2}`)
    let p1Response
    let p2Response
    this.room.messageHost([{ text: `${p1} vs ${p2}`, size: HostMessageSizes.large }])
    this.promptManager.closePrompt(this.fighterMovePrompt.promptId)
    this.promptManager.openPrompt(
      this.fighterMovePrompt.promptId,
      this.fighterMovePrompt.rules,
      (playerNickname, value) => {
        if (playerNickname === p1) {
          p1Response = value
        } else if (playerNickname === p2) {
          p2Response = value
        }
        if (p1Response && p1Response === p2Response) {
          this.room.messageHost([
            { text: `${p1} vs ${p2}`, size: HostMessageSizes.large },
            { text: `${p1Response} | ${p2Response}`, size: HostMessageSizes.medium },
            { text: 'TIE!', size: HostMessageSizes.medium },
          ])
          // this.runFight(p1, p2)
          this.bracket.unshift(p2)
          this.bracket.unshift(p1)
          this.fightInProgress = false
          return
        } else if (p1Response && p2Response) {
          console.log('p1:', p1, p1Response)
          console.log('p2:', p2, p2Response)
          if (this.isWinner(p1Response, p2Response)) {
            this.room.messageHost([
              { text: `${p1} vs ${p2}`, size: HostMessageSizes.large },
              { text: `${p1Response} | ${p2Response}`, size: HostMessageSizes.medium },
              { text: `${p1} wins`, size: HostMessageSizes.medium },
            ])
            this.bracket.push(p1)
          } else {
            this.room.messageHost([
              { text: `${p1} vs ${p2}`, size: HostMessageSizes.large },
              { text: `${p1Response} | ${p2Response}`, size: HostMessageSizes.medium },
              { text: `${p2} wins`, size: HostMessageSizes.medium },
            ])
            this.bracket.push(p2)
          }
          this.fightInProgress = false
          return
        }
      },
    )
    this.room.promptPlayer(this.fighterMovePrompt, p1)
    this.room.promptPlayer(this.fighterMovePrompt, p2)
  }

  private isWinner(res1: MedievalMoves, res2: MedievalMoves) {
    switch (res1) {
      case MedievalMoves.Axe:
        if (res2 === MedievalMoves.Shield) {
          console.log('axe beats shield')
          return true
        }
        break
      case MedievalMoves.Shield:
        if (res2 === MedievalMoves.Sword) {
          console.log('shield beats sword')
          return true
        }
        break
      case MedievalMoves.Sword:
        if (res2 === MedievalMoves.Axe) {
          console.log('sword beats axe')
          return true
        }
        break
    }
    console.log(`${res1} loses or ties to ${res2}`)
    return false
  }

  private endGame() {
    this.room.messageHost([
      { text: `${this.bracket[0]} is the champion`, size: HostMessageSizes.large },
    ])
  }

  static gameId: number = GameIds.MedevialRPS
  static gameName: string = 'Medevial RPS'
  static gameDescription: string = 'A competitive RPS style game'
  static gameSettingDescriptions: GameSettingDescription[] = [
    {
      name: 'example (m RPS)',
      type: 'number',
      defaultValue: 0,
    },
  ]
  static playerLimit: number = 10
  static playerMinimum: number = 2
}

enum MedievalRPSPromptIds {
  FighterMove = 'fighter-move',
}

enum MedievalMoves {
  Sword = 'sword',
  Shield = 'shield',
  Axe = 'axe',
}
