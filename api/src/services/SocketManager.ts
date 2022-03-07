import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import RoomManager from './RoomManager'

export const loadConnectionHandlers = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
  const roomManager = RoomManager.getInstance()
  io.on('connection', (socket: Socket) => {
    console.log('connected with id: ', socket.id)
    socket.on(
      'join-room-as-host',
      (roomId: string, token: string, cb: (message: string) => void) => {
        console.log('joining room as host')
        console.log('request room :', roomId)
        const requestedRoom = roomManager.getRoomByRoomId(roomId)
        console.log(requestedRoom)
        try {
          requestedRoom.addHost(socket, token)
          cb('successfully added host')
        } catch (err) {
          console.error(err)
          io.to(socket.id).emit('error', err.message)
        }
      },
    )
    socket.on('join-room', (roomId: string, nickname: string) => {
      console.log(nickname, 'joining room', roomId)
      const requestedRoom = roomManager.getRoomByRoomId(roomId)
      try {
        requestedRoom.addPlayer(socket, nickname)
        console.log('successfully added', nickname, 'to room', roomId)
      } catch (err) {
        console.error(err)
        io.to(socket.id).emit('error', err.message)
      }
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
    })
    // join with roomName, nickname, etc.
  })
}
