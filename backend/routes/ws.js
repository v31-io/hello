import cookie from "cookie"
import { Server } from 'socket.io'


export default function websocket (server) {
  const sessionIDUserMap = {}

  const io = new Server(server, { path: '/ws/' })

  io.engine.on("initial_headers", (headers) => {
    const randomNumber = Math.random().toString()
    const sessionID = randomNumber.substring(2, randomNumber.length)
    const sessionCookie = cookie.serialize("sessionID", sessionID, {
      maxAge: 900000, httpOnly: true
    });
    headers["set-cookie"] = sessionCookie;
  });

  io.on('connection', (socket) => {
    const socketID = socket.id
    const sessionID = cookie.parse(socket.handshake.headers.cookie)['sessionID']
    console.log(`User ${sessionID} connected from ${socketID}`)
    
    socket.on('disconnect', () => {
      console.log(`User ${sessionID} disconnected from ${socketID}`)
      delete sessionIDUserMap[sessionID]
    })

    socket.on('register', async (user, ack) => {
      sessionIDUserMap[sessionID] = user
      console.log(`User ${sessionID}:${user} registerd from ${socketID}`)
      await ack(sessionID)

      socket.emit('chat', {
        user: 'server',
        chat: 'Welcome to the chat room! Please be civil and have fun!'
      })
    })

    socket.on('logout', () => {
      const user = sessionIDUserMap[sessionID]
      console.log(`User ${sessionID}:${user} deregisterd from ${socketID}`)
      delete sessionIDUserMap[sessionID]
    })

    socket.on('chat', (message) => {
      socket.broadcast.emit('chat', {
        user: sessionIDUserMap[sessionID],
        chat: message
      })
    })
  })
}