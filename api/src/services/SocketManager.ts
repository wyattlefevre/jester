import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const loadConnectionHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  io.on('connection', (socket: Socket) => {
    console.log('connected with id: ', socket.id)
    socket.on('disconnect', () => {
      console.log('disconnected')
    })
    // join with roomName, nickname, etc.
  })
}