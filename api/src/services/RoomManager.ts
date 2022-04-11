import { GameInstance, GameSetting } from './GameInstance'
import { Superlatives } from './games'
import MedevialRPS from './games/MedievalRPS'
import { GameError } from './GameService'
import PromptManager from './PromptManager'
import Room from './Room'

// manages active rooms
// uses the singleton design pattern https://refactoring.guru/design-patterns/singleton/typescript/example
class RoomManager {
  private static instance: RoomManager
  private static readonly roomIdLength: number = 4
  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager()
    }
    return RoomManager.instance
  }
  private rooms: Map<string, Room>
  private constructor() {
    this.rooms = new Map<string, Room>()
  }
  private generateRoomId(): string {
    let newCode = this.makeid(RoomManager.roomIdLength)
    while (this.rooms.has(newCode)) {
      newCode = this.makeid(RoomManager.roomIdLength)
    }
    return newCode
  }

  private makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  public getRoomByRoomId(roomId: string): Room | null {
    return this.rooms.get(roomId)
  }

  public openRoom(gameId: number, gameSettings: GameSetting[], hostToken: string): string {
    console.log('open room settings')
    console.log(gameSettings)
    const roomId = this.generateRoomId()
    const promptManager = new PromptManager(roomId)
    let game: GameInstance
    let room: Room
    switch (gameId) {
      case Superlatives.gameId:
        game = new Superlatives()
        game.applySettings(gameSettings)
        game.setPromptManager(promptManager)
        room = new Room(
          game,
          Superlatives.playerLimit,
          roomId,
          Superlatives.playerMinimum,
          hostToken,
          promptManager,
        )
        break
      case MedevialRPS.gameId:
        game = new MedevialRPS()
        game.applySettings(gameSettings)
        game.setPromptManager(promptManager)
        room = new Room(
          game,
          MedevialRPS.playerLimit,
          roomId,
          MedevialRPS.playerMinimum,
          hostToken,
          promptManager,
        )
        break
      default:
        throw new GameError('Invalid gameId')
    }
    console.log('opening room with code: ', roomId)
    this.rooms.set(roomId, room)
    return roomId
  }

  public isAcceptingPlayers(roomId: string): boolean {
    if (this.rooms.has(roomId) && this.rooms.get(roomId).isAcceptingNewPlayers()) {
      return true
    }
    return false
  }

  public isNicknameAvailable(roomId: string, nickname: string): boolean {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId).isNicknameAvailable(nickname)
    }
    return false
  }
}

export default RoomManager
