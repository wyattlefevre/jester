class Superlatives implements Game {
  public static gameId: number = 1
  public static gameName: string = 'superlatives'
  public static gameDescription: string = 'a fun superlatives party game'
  private static settingDescriptions: GameSettingDescription[] = [
    {
      name: 'example',
      type: 'string',
      defaultValue: 'default value',
    },
  ]
  start: () => boolean

  public static getInfo(): GameInfo {
    return {
      gameId: Superlatives.gameId,
      gameName: Superlatives.gameName,
      gameDescription: Superlatives.gameDescription,
    }
  }
}
