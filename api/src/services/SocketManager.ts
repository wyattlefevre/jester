import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import RoomManager from "./RoomManager";

export const loadConnectionHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  const roomManager = RoomManager.getInstance()
  io.on('connection', (socket: Socket) => {
    console.log('connected with id: ', socket.id)
    socket.on('join-room-as-host', (roomCode: string, token: string) => {
      console.log('joining room as host')
      console.log('request room :', roomCode)
      const requestedRoom = roomManager.getRoomByRoomCode(roomCode)
      console.log(requestedRoom)
      try {
        requestedRoom.addHost(socket, token)
      } catch (err) {
        console.error(err)
        io.to(socket.id).emit('error', err)
      }
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
    })
    // join with roomName, nickname, etc.
  })
}