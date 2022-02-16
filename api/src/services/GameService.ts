const GameList: GameInfo[] = [
  {
    id: 1,
    name: 'Superlatives',
    description: 'A fun party game',
  },
  {
    id: 2,
    name: 'Medevial RPS',
    description: 'Battle to the death in this RPS style game',
  },
]

export const getAllGamesInfo = () => {
  return GameList.map((game) => {
    return { id: game.id, name: game.name, description: game.description }
  })
}
