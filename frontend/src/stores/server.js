import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'


export const useServerStore = defineStore('server', () => {
    const socket = io({ path: '/api/ws/', transports: ['websocket'], autoConnect: false })
    
    const name = ref('')
    const token = ref('')
    const connected = ref(false) 
  
    socket.on("connect", () => {
      connected.value = true
    })

    // For handling re-connect scenarios
    function connectionHandler(fn) {
      socket.on("connect", fn)
    }
 
    socket.on("disconnect", () => {
      connected.value = false
      name.value = ''
    })

    async function register(user, ptoken, ack) {
      token.value = ptoken
      await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      socket.connect()
      socket.emit('register', user, ack)
    }

    function logout() {
      socket.emit('logout')
      socket.disconnect()
    }

    function sendMessage(message, ack) {
      socket.emit('chat', message, ack)
    }

    function receiveMessageHandler(fn) {
      socket.on('chat', fn)
    }

    function setName(pname) {
      name.value = `${socket.id}@${pname}`
    }

    return { name, connected, register, logout, sendMessage, receiveMessageHandler, connectionHandler, setName }
})