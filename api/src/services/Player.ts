import { Socket } from 'socket.io'
import { PromptResponse } from './Prompt'

export class Player {
  private nickname: string
  private socket: Socket
  private promptResponses: Map<string, PromptResponse>
  private roomId: string

  constructor(nickname: string, socket: Socket, roomId: string) {
    this.nickname = nickname
    this.socket = socket
    this.roomId = roomId
    this.promptResponses = new Map<string, PromptResponse>()
  }

  addPromptResponse(response: PromptResponse) {
    if (!this.promptResponses.has(response.promptId)) {
      this.promptResponses.set(response.promptId, response)
    } else {
      console.log('player already resonded to this response')
    }
  }

  getNickname() {
    return this.nickname
  }

  getSocket() {
    return this.socket
  }

  getPromptResponse(promptId: string) {
    return this.promptResponses.get(promptId)
  }
}
