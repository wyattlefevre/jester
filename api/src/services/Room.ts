import { Socket } from 'socket.io'
import { GameInstance } from './GameInstance'
import HostMessage from './HostMessage'
import { Player } from './Player'
import { Prompt, PromptResponse, PromptRules, PromptType } from './Prompt'
import PromptManager from './PromptManager'
import { Events, SocketManager } from './SocketManager'

class Room {
  private host: Socket
  private hostToken: string
  private players: Map<string, Player> // nickname mapped to player Socket
  private game: GameInstance
  private playerLimit: number
  private roomId: string
  private lobbyOpen: boolean
  private playerMinimum: number
  private promptManager: PromptManager

  constructor(
    game: GameInstance,
    playerLimit: number,
    roomId: string,
    playerMinimum: number,
    hostToken: string,
    promptManager: PromptManager,
  ) {
    this.game = game
    this.playerLimit = playerLimit
    this.players = new Map<string, Player>()
    this.roomId = roomId
    this.lobbyOpen = false // will be set to true once host has connected
    this.playerMinimum = playerMinimum
    this.hostToken = hostToken
    this.promptManager = promptManager
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
    this.addPlayertListeners(player)

    const sm = SocketManager.getInstance()
    sm.emit(this.host.id, Events.UpdatePlayerList, this.getPlayerNames())
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
    const sm = SocketManager.getInstance()
    sm.emit(this.host.id, Events.UpdatePlayerList, this.getPlayerNames())
  }

  getRoomId(): string {
    return this.roomId
  }

  startGame() {
    if (this.players.size >= this.playerMinimum && this.players.size <= this.playerLimit) {
      this.lobbyOpen = false
      console.log('starting game')
      this.game.start(this, this.onGameEnd)
    } else {
      const message =
        this.players.size >= this.playerMinimum ? 'too many players' : 'not enough players'
      const sm = SocketManager.getInstance()
      sm.sendError(this.host.id, message)
    }
  }

  disconnectAllSockets() {
    this.players.forEach((p) => {
      p.getSocket().disconnect()
    })
    this.host.disconnect()
  }

  emitToPlayers(e: Events, ...data: any) {
    const sm = SocketManager.getInstance()
    sm.emit(`${this.roomId}-players`, e, ...data)
  }

  messageHost(messages: HostMessage[]) {
    const sm = SocketManager.getInstance()
    sm.emit(this.host.id, Events.Message, messages)
  }

  promptPlayers(prompt: Prompt) {
    this.emitToPlayers(Events.Prompt, prompt)
  }

  private onGameEnd = () => {
    console.log('game over')
  }

  private addHostListeners(hostSocket: Socket) {
    hostSocket.on(Events.StartGame, () => {
      this.startGame()
    })
  }

  private addPlayertListeners(player: Player) {
    const playerSocket = player.getSocket()
    playerSocket.join(this.roomId)
    playerSocket.on(Events.Disconnect, () => {
      this.removePlayer(player.getNickname())
    })
    playerSocket.on(Events.PromptResponse, (response: PromptResponse) => {
      if (!this.promptManager.handlePlayerPromptResponse(player.getNickname(), response)) {
        this.sendPlayerError('response not saved', player)
      }
    })
  }

  private sendPlayerError(message: string, player: Player) {
    const sm = SocketManager.getInstance()
    sm.sendError(player.getSocket().id, message)
  }

  private getPlayerNames(): string[] {
    return Array.from(this.players.keys())
  }
}
export class RoomError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, RoomError.prototype)
  }
}

export default Room
