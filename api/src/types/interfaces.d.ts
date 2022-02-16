interface GameInfo {
  id: number
  name: string
  description: string
}

interface Game {
  id: number
  name: string
  description: string
  start: (settings: any) => boolean
}
