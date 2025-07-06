import os from 'os'
import { Server } from 'socket.io'
import { createAdapter } from "@socket.io/redis-adapter"
import { getRedisClient } from '../services/redis.js'


const HOST = os.hostname().split('-')[0]

export default async function websocket (server) {
  const socketIDUserMap = {}

  const pubClient = getRedisClient('socketpub')
  const subClient = getRedisClient('socketsub')

  await Promise.all([
    pubClient.connect(),
    subClient.connect()
  ]);

  const io = new Server(server, { 
    path: '/ws/', 
    adapter: createAdapter(pubClient, subClient, { key: 'hello:socket.io' }) 
  })

  io.engine.on("initial_headers", (headers) => {
    // custom header x-server for nginx load balancer sticky session
    headers['x-server'] = HOST
  })

  io.on('connection', (socket) => {
    const socketID = socket.id
    console.log(`User connected from ${socketID}`)
    
    socket.on('disconnect', () => {
      console.log(`User disconnected from ${socketID}`)
      delete socketIDUserMap[socketID]
    })

    socket.on('register', async (user, ack) => {
      socketIDUserMap[socketID] = user
      console.log(`User ${user} registerd from ${socketID}`)
      await ack(socketID)

      socket.emit('chat', {
        user: 'server',
        chat: 'Welcome to the chat room! Please be civil and have fun!',
        host: HOST
      })
    })

    socket.on('logout', () => {
      const user = socketIDUserMap[socketID]
      console.log(`User ${user} deregisterd from ${socketID}`)
      delete socketIDUserMap[socketID]
    })

    socket.on('chat', (message, ack) => {
      socket.broadcast.emit('chat', {
        user: socketIDUserMap[socketID],
        chat: message,
        host: HOST
      })
      ack()
    })
  })
}