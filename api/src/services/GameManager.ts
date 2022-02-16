// manages active games
// uses the singleton design pattern https://refactoring.guru/design-patterns/singleton/typescript/example

class GameManager {
  private static instance: GameManager
  private games: Map<string, Game>
  private constructor() {
    this.games = new Map<string, Game>()
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }

  public getGameByRoomCode(roomCode: string): Game | null {
    return this.games[roomCode]
  }
}
