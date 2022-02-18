import { Socket } from 'socket.io'
import { GameInstance } from './GameInstance'

class Room {
  private host: Socket[]
  private players: Socket[]
  private game: GameInstance
  private playerLimit: number
  private roomCode: string
  constructor(game: GameInstance, playerLimit: number, roomCode: string) {
    this.game = game
    this.playerLimit = playerLimit
    this.players = []
    this.roomCode = roomCode
  }

  addPlayer(socket: Socket) {}
  addHost(socket: Socket) {}
  removePlayer(socket: Socket) {}
  getRoomCode(): string {
    return this.roomCode
  }
}

export class RoomError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, RoomError.prototype)
  }
}

export default Room
