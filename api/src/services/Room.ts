import { Socket } from 'socket.io'
import { GameInstance } from './GameInstance'
import { Player } from './Player'
import { Prompt, PromptResponse, PromptRules, PromptType } from './Prompt'
import { SocketManager } from './SocketManager'

class Room {
  private host: Socket
  private hostToken: string
  private players: Map<string, Player> // nickname mapped to player Socket
  private game: GameInstance
  private playerLimit: number
  private roomId: string
  private lobbyOpen: boolean
  private playerMinimum: number
  private openPrompts: Map<string, PromptRules> // promptId's that are currently answerable (usually just one)

  constructor(
    game: GameInstance,
    playerLimit: number,
    roomId: string,
    playerMinimum: number,
    hostToken: string,
  ) {
    this.game = game
    this.playerLimit = playerLimit
    this.players = new Map<string, Player>()
    this.roomId = roomId
    this.lobbyOpen = false // will be set to true once host has connected
    this.playerMinimum = playerMinimum
    this.hostToken = hostToken
    this.openPrompts = new Map<string, PromptRules>()
  }

  isAcceptingNewPlayers(): boolean {
    if (this.players.size < this.playerLimit && this.lobbyOpen && this.host) {
      return true
    }
    return false
  }

  isNicknameAvailable(nickname: string) {
    console.log('checking nickname', nickname)
    console.log('isnicknameavailable: ', !this.players.has(nickname), nickname)
    console.log(this.players)
    return !this.players.has(nickname)
  }

  addPlayer(socket: Socket, nickname: string) {
    if (!this.host) {
      throw new RoomError('Host not connected')
    }
    if (!this.lobbyOpen) {
      throw new RoomError('Lobby not open')
    }
    if (this.players.size >= this.playerLimit) {
      throw new RoomError('Room is full')
    }
    if (this.players.has(nickname)) {
      throw new RoomError('Nickname already in use')
    }

    const player = new Player(nickname, socket, this.roomId)
    this.players.set(nickname, player)
    this.addPlayerSocketListeners(player)

    const io = SocketManager.getInstance().getIO()
    io.to(this.host.id).emit('update-player-list', this.getPlayerNames())
  }

  addHost(socket: Socket, token: string) {
    console.log('adding host:', socket.id)
    if (this.hostToken != token) {
      throw new RoomError('invalid token')
    }
    this.host = socket
    this.host.join(this.roomId)
    this.addHostListeners(this.host)
    this.lobbyOpen = true
  }

  removePlayer(nickname: string) {
    this.players.delete(nickname)
    const io = SocketManager.getInstance().getIO()
    io.to(this.host.id).emit('update-player-list', this.getPlayerNames())
  }

  getRoomId(): string {
    return this.roomId
  }

  startGame() {
    if (this.players.size >= this.playerMinimum && this.players.size <= this.playerLimit) {
      this.lobbyOpen = false
      console.log('starting game')
      this.game.start(this)
    } else {
      const io = SocketManager.getInstance().getIO()
      const message =
        this.players.size >= this.playerMinimum ? 'too many players' : 'not enough players'
      io.to(this.host.id).emit('error', `could not start game ${message}`)
    }
  }

  disconnectAllSockets() {
    this.players.forEach((p) => {
      p.getSocket().disconnect()
    })
    this.host.disconnect()
  }

  promptPlayers(prompt: Prompt) {
    const sm = SocketManager.getInstance()
    sm.promptRoom(`${this.roomId}-players`, prompt)
  }

  private addHostListeners(hostSocket: Socket) {
    hostSocket.on('start-game', () => {
      this.startGame()
    })
  }

  private addPlayerSocketListeners(player: Player) {
    const playerSocket = player.getSocket()
    playerSocket.join(this.roomId)
    playerSocket.on('disconnect', () => {
      this.removePlayer(player.getNickname())
    })
    playerSocket.on('prompt-response', (PromptResponse) => {
      if (this.isValidPromptResponse(PromptResponse)) {
        player.addPromptResponse(PromptResponse)
      }
    })
  }

  private getPlayerNames(): string[] {
    return Array.from(this.players.keys())
  }

  private isValidPromptResponse(response: PromptResponse): boolean {
    if (this.openPrompts.has(response.promptId)) {
      const rules = this.openPrompts.get(response.promptId)
      if (response.responses.length <= rules.limit && response.responses.length > 0) {
        if (rules.type === PromptType.Selection) {
          let valid = true
          response.responses.forEach((res) => {
            if (!rules.responseOptions.includes(res)) {
              valid = false
            }
          })
          return valid
        } else if (rules.type === PromptType.FreeResponse) {
          return true
        }
      }
    }
    return false
  }
}
export class RoomError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, RoomError.prototype)
  }
}

export default Room
