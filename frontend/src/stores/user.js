import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const id = ref('')
    const name = ref('')
  
    function login(pid, pname) {
      id.value = pid
      name.value = pname
    }

    function logout() {
      id.value = ''
      name.value = ''
    }
  
    return { id, name, login, logout }
})