import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { MessageChannel } from 'worker_threads'
import { Prompt } from './Prompt'
import RoomManager from './RoomManager'

export class SocketManager {
  private static instance: SocketManager
  public static initialize(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(io)
      SocketManager.instance.loadConnectionHandlers()
    }
  }
  public static getInstance() {
    return SocketManager.instance
  }

  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  private constructor(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this.io = io
  }
  private loadConnectionHandlers() {
    const roomManager = RoomManager.getInstance()
    this.io.on(Events.Connection, (socket: Socket) => {
      console.log('connected with id: ', socket.id)
      socket.on(
        Events.JoinRoomAsHost,
        (roomId: string, token: string, cb: (message: string) => void) => {
          console.log('joining room as host')
          console.log('request room :', roomId)
          const requestedRoom = roomManager.getRoomByRoomId(roomId)
          console.log(requestedRoom)
          try {
            requestedRoom.addHost(socket, token)
            socket.join(roomId)
            cb('successfully added host')
          } catch (err) {
            console.error(err)
            this.io.to(socket.id).emit('error', err.message)
          }
        },
      )
      socket.on(Events.JoinRoom, (roomId: string, nickname: string) => {
        console.log(nickname, 'joining room', roomId)
        const requestedRoom = roomManager.getRoomByRoomId(roomId)
        try {
          requestedRoom.addPlayer(socket, nickname)
          socket.join(roomId)
          console.log(`adding ${nickname} to room:${roomId}-players`)
          socket.join(`${roomId}-players`)
          console.log('successfully added', nickname, 'to room', roomId)
        } catch (err) {
          console.error(err)
          this.io.to(socket.id).emit('error', err.message)
        }
      })
      socket.on(Events.Disconnect, () => {
        console.log('disconnected')
      })
    })
  }

  public emit(to: string, event: Events, ...data: any[]) {
    this.io.to(to).emit(event, data)
  }

  public sendError(to: string, message: string) {
    this.io.to(to).emit(Events.Error, message)
  }
}

export enum Events {
  Connection = 'connection',
  Disconnect = 'disconnect',
  JoinRoom = 'join-room',
  JoinRoomAsHost = 'join-room-as-host',
  UpdatePlayerList = 'update-player-list',
  StartGame = 'start-game',
  NextPhase = 'next-phase',
  Prompt = 'prompt',
  PromptResponse = 'prompt-response',
  Error = 'error',
  Message = 'message',
}
