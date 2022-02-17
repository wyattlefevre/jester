const GameList: GameInfo[] = [
  {
    gameId: 1,
    gameName: 'Superlatives',
    gameDescription: 'A fun party game',
  },
  {
    gameId: 2,
    gameName: 'Medevial RPS',
    gameDescription: 'Battle to the death in this RPS style game',
  },
]

export const getAllGamesInfo = () => {
  return GameList.map((game) => {
    return { id: game.gameId, name: game.gameName, description: game.gameDescription }
  })
}
