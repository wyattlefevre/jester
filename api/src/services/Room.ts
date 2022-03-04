import { Socket } from 'socket.io'
import { GameInstance } from './GameInstance'

class Room {
  private host: Socket
  private hostToken: string
  private players: Map<string, Socket> // nickname mapped to player Socket
  private game: GameInstance
  private playerLimit: number
  private roomId: string
  private lobbyOpen: boolean
  private playerMinimum: number
  constructor(
    game: GameInstance,
    playerLimit: number,
    roomId: string,
    playerMinimum: number,
    hostToken: string,
  ) {
    this.game = game
    this.playerLimit = playerLimit
    this.players = new Map<string, Socket>()
    this.roomId = roomId
    this.lobbyOpen = false // will be set to true once host has connected
    this.playerMinimum = playerMinimum
    this.hostToken = hostToken
  }

  isAcceptingNewPlayers(): boolean {
    if (this.players.size < this.playerLimit && this.lobbyOpen && this.host) {
      return true
    }
    return false
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
    this.players[nickname] = socket
    socket.join(this.roomId)
    socket.to(this.host.id).emit('player join', nickname)
  }

  addHost(socket: Socket, token: string) {
    console.log('adding host:', socket.id)
    if (this.hostToken != token) {
      throw new RoomError('invalid token')
    }
    this.host = socket
    this.host.join(this.roomId)
    this.lobbyOpen = true
  }
  removePlayer(socket: Socket) {}
  getRoomId(): string {
    return this.roomId
  }
  startGame() {
    // TODO: logic to determine if starting a game is allowed
    this.lobbyOpen = false
  }
  disconnectAllSockets() {
    this.players.forEach((p) => {
      p.disconnect()
    })
    this.host.disconnect()
  }
}
export class RoomError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, RoomError.prototype)
  }
}

export default Room
