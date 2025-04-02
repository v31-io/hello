import cookie from "cookie"
import { Server } from 'socket.io'


export default function websocket (server) {
  const socketUserMap = {}

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
    const id = socket.id
    console.log(`User connected from ${id}`)
    
    socket.on('disconnect', () => {
      console.log(`User disconnected from session ${id}`)
      delete socketUserMap[id]
    })

    socket.on('register', (user) => {
      socketUserMap[id] = user
      console.log(`User ${user} registerd to session ${id}`)
    })

    socket.on('logout', () => {
      const user = socketUserMap[id]
      console.log(`User ${user} de-registerd from session ${id}`)
      delete socketUserMap[id]
    })

    socket.emit('chat', {
      user: 'server',
      chat: 'Welcome to the chat room! Please be civil and have fun!'
    })

    socket.on('chat', (message) => {
      socket.broadcast.emit('chat', {
        user: socketUserMap[id],
        chat: message
      })
    })
  })
}