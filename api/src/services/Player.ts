import { Socket } from 'socket.io'

export class Player {
  private nickname: string
  private socket: Socket
  private promptResponses: Map<string, string>
  private roomId: string

  constructor(nickname: string, socket: Socket, roomId: string, onDisconnect: () => void) {
    this.nickname = nickname
    this.socket = socket
    this.roomId = roomId
    this.promptResponses = new Map<string, string>()
    socket.join(this.roomId)
    socket.on('disconnect', onDisconnect)
    socket.on('prompt-response', (promptId: string, response: string) => {
      this.setPromptResponse(promptId, response)
    })
  }

  setPromptResponse(promptId: string, response: string) {
    if (!this.promptResponses.has(promptId)) {
      this.promptResponses.set(promptId, response)
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
