import React from 'react'
import { useParams } from 'react-router-dom'

const PlayerControls = () => {
  const { roomId } = useParams()
  return <div>Play {roomId}</div>
}

export default PlayerControls
