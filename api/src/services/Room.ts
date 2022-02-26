import { Socket } from 'socket.io'
import { GameInstance } from './GameInstance'

class Room {
  private host: Socket
  private players: Map<string, Socket> // nickname mapped to player Socket
  private game: GameInstance
  private playerLimit: number
  private roomCode: string
  private lobbyOpen: boolean
  constructor(game: GameInstance, playerLimit: number, roomCode: string) {
    this.game = game
    this.playerLimit = playerLimit
    this.players = new Map<string, Socket>()
    this.roomCode = roomCode
    this.lobbyOpen = false // will be set to true once host has connected
  }

  addPlayer(socket: Socket, nickname: string) {
    if (!this.host) {
      throw new RoomError("Host not connected")
    }
    if (!this.lobbyOpen) {
      throw new RoomError("Lobby not open")
    }
    if (this.players.size >= this.playerLimit) {
      throw new RoomError("Room is full")
    }
    if (this.players.has(nickname)) {
      throw new RoomError("Nickname already in use")
    }
    this.players[nickname] = socket
    socket.join(this.roomCode)
    socket.to(this.host.id).emit("player join", nickname)
  }
  addHost(socket: Socket) {
    this.host = socket
    this.host.join(this.roomCode)
    this.lobbyOpen = true
  }
  removePlayer(socket: Socket) {}
  getRoomCode(): string {
    return this.roomCode
  }
  startGame() {
    // TODO: logic to determine if starting a game is allowed
    this.lobbyOpen = false
  }
  
}
export class RoomError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, RoomError.prototype)
  }
}

export default Room
