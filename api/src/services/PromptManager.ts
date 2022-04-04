import { Prompt, PromptResponse, PromptRules, PromptType } from './Prompt'
import { SocketManager } from './SocketManager'

export default class PromptManager {
  // private promptResponses: Map<string, Map<string, PromptResponse[]>> //promptId -> nickname -> prompt responses
  private promptCallbacks: Map<string, (playerNickname: string, value: string) => void> //map prompt id to success callback
  private playerResponseCounts: Map<string, Map<string, number>> //map player nickname -> promptId -> number of responses
  private roomId: string
  private openPrompts: Map<string, PromptRules> // promptId's that are currently answerable (usually just one)
  //TODO: be able to add response validator from the game object (so that you can do custom logic like rejecting duplicate names in superlatives)

  constructor(roomId: string) {
    this.roomId = roomId
    this.openPrompts = new Map<string, PromptRules>()
    this.playerResponseCounts = new Map<string, Map<string, number>>()
    this.promptCallbacks = new Map<string, (promptId: string, playerNickname: string) => void>()
  }

  handlePlayerPromptResponse(nickname: string, response: PromptResponse): number {
    // returns -1 on error or the number of responses remaining for the player
    const responseLimit = this.getResponseLimit(response.promptId)
    if (responseLimit === 0) {
      return -1
    }
    if (
      this.isValidPromptResponse(response) &&
      this.getPlayerResponseCount(nickname, response.promptId) < responseLimit
    ) {
      this.incrementPlayerResponseCount(nickname, response.promptId)
      const successCallback = this.promptCallbacks.get(response.promptId)
      successCallback(nickname, response.response)
      return responseLimit - this.getPlayerResponseCount(nickname, response.promptId)
    }
    return -1
  }

  openPrompt(
    promptId: string,
    rules: PromptRules,
    onValidResponse: (playerNickname: string, value: string) => void,
    // TODO this is where to add the custom validation function
  ) {
    this.openPrompts.set(promptId, rules)
    this.promptCallbacks.set(promptId, onValidResponse)
  }

  closePrompt(promptId: string) {
    this.openPrompts.delete(promptId)
  }

  resetResponseCounts(promptId: string) {
    this.playerResponseCounts.forEach((promptCounts) => {
      promptCounts.set(promptId, 0)
    })
  }

  private isValidPromptResponse(response: PromptResponse): boolean {
    if (!this.openPrompts.has(response.promptId)) {
      return false
    }
    const rules = this.openPrompts.get(response.promptId)
    if (rules.type === PromptType.Selection) {
      if (rules.responseOptions.includes(response.response)) {
        return true
      }
    } else if (rules.type === PromptType.FreeResponse) {
      return true
    }
    return false
  }

  private getResponseLimit(promptId: string): number {
    if (!this.openPrompts.has(promptId)) {
      return 0
    }
    return this.openPrompts.get(promptId).limit
  }

  private getPlayerResponseCount(playerNickname: string, promptId: string) {
    if (!this.playerResponseCounts.has(playerNickname)) {
      this.playerResponseCounts.set(playerNickname, new Map<string, number>())
    }
    if (!this.playerResponseCounts.get(playerNickname).has(promptId)) {
      this.playerResponseCounts.get(playerNickname).set(promptId, 0)
    }
    return this.playerResponseCounts.get(playerNickname).get(promptId)
  }
  private incrementPlayerResponseCount(playerNickname: string, promptId: string) {
    let count = this.playerResponseCounts.get(playerNickname).get(promptId)
    count = count + 1
    this.playerResponseCounts.get(playerNickname).set(promptId, count)
  }
}
