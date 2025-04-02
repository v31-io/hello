import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'


export const useServerStore = defineStore('server', () => {
    const _URL = '/api'
    const socket = io({ path: `${_URL}/ws/`, transports: ['websocket'] })
    const connected = ref(false) 
  
    async function checkConnection() {
      try {
        const res = await axios.head(_URL)
        connected.value = res.status == 200  
      } catch {
        connected.value = false
      }
      // setTimeout(checkConnection, 1000)
    }
  
    checkConnection()

    return { connected }
}, {
  persist: true
})