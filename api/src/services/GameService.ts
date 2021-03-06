import { GameInfo, GameSettingDescription } from './GameInstance'
import { Superlatives } from '@/services/games'
import { GameIds } from './GameIds'
import MedevialRPS from './games/MedievalRPS'

const GameList: GameInfo[] = [
  {
    gameId: Superlatives.gameId,
    gameName: Superlatives.gameName,
    gameDescription: Superlatives.gameDescription,
  },
  {
    gameId: MedevialRPS.gameId,
    gameName: 'Medevial RPS',
    gameDescription: 'Battle to the death in this RPS style game',
  },
]

export const getAllGamesInfo = () => {
  return GameList.map((game) => {
    return { id: game.gameId, name: game.gameName, description: game.gameDescription }
  })
}

export const getGameSettingDescriptions = (gameId: number): GameSettingDescription[] | null => {
  switch (gameId) {
    case Superlatives.gameId:
      return Superlatives.gameSettingDescriptions
    case MedevialRPS.gameId:
      return MedevialRPS.gameSettingDescriptions
    default:
      return null
  }
}

export class GameError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, GameError.prototype)
  }
}

export const validGameId = (gameId: number) => {
  return [Superlatives.gameId].includes(gameId)
}
