import cookie from "cookie"
import { Server } from 'socket.io'


export default function websocket (server) {
  const io = new Server(server, { path: '/ws/'})

  io.on('connection', (socket) => {
    const { sessionID } = cookie.parse(socket.handshake.headers.cookie)
    
    console.log(`User connected from session ${sessionID}`)
    
    socket.emit('chat', {
      greeting: 'Welcome to the chat room! Please be civil and have fun!'
    })
    
    socket.on('disconnect', () => {
      console.log(`User disconnected from session ${sessionID}`)
    })
  })
}