import React from 'react'
import { useParams } from 'react-router-dom'

const GameRoom = () => {
  const { roomId } = useParams()

  return <div>GameRoom {roomId}</div>
}

export default GameRoom
