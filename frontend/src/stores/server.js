import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'


export const useServerStore = defineStore('server', () => {
    const socket = io({ path: '/api/ws/', transports: ['websocket'], autoConnect: false })
    const connected = ref(false) 
  
    socket.on("connect", () => {
      connected.value = true
    })

    socket.on("disconnect", () => {
      connected.value = false
    })

    function register(user, ack) {
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

    return { connected, register, logout, sendMessage, receiveMessageHandler }
})