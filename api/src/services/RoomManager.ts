import { GameInstance, GameSetting } from './GameInstance'
import { Superlatives } from './games'
import { GameError } from './GameService'
import Room from './Room'

// manages active rooms
// uses the singleton design pattern https://refactoring.guru/design-patterns/singleton/typescript/example
class RoomManager {
  private static instance: RoomManager
  private static readonly roomCodeLength: number = 4
  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager()
    }
    return RoomManager.instance
  }
  private rooms: Map<string, GameInstance>
  private constructor() {
    this.rooms = new Map<string, GameInstance>()
  }

  public getRoomByRoomCode(roomCode: string): GameInstance | null {
    return this.rooms[roomCode]
  }

  public openRoom(gameId: number, gameSettings: GameSetting[]): string {
    switch (gameId) {
      case Superlatives.gameId:
        const game = new Superlatives()
        game.applySettings(gameSettings)
        const roomCode = this.generateRoomCode()
        const room = new Room(game, Superlatives.playerLimit, roomCode)
        this.rooms[roomCode] = room
        return roomCode
      default:
        throw new GameError('Invalid gameId')
    }

    return '1234'
  }

  private generateRoomCode(): string {
    let newCode = this.makeid(RoomManager.roomCodeLength)
    while (this.rooms.has(newCode)) {
      newCode = this.makeid(RoomManager.roomCodeLength)
    }
    return newCode
  }

  private makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}

export default RoomManager
