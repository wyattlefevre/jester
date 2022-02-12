import GameList from '@/models/GameList'

export const getAllGamesInfo = () => {
  return GameList.map((game) => {
    return { id: game.id, name: game.name, description: game.description }
  })
}
