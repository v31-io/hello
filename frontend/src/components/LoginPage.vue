<script setup>
  import { ref } from 'vue'
  import loginImage from '@/assets/login.svg'
  import { useUserStore } from '@/stores/user'
  import { useServerStore } from '@/stores/server'

  const user = useUserStore()
  const server = useServerStore()
  const userName = ref('')

  const rules = [
    value => {
      if (value) return true
      return 'You must enter a name.'
    },
  ]

  function onClickRegister() {
    if (userName.value == '') return
    user.login(userName.value)
    server.register(userName.value)
  }
</script>

<template>
  <v-main>
    <v-container class="fill-height">
        <v-col xs="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <v-img aspect-ratio="16/9" cover :src="loginImage" class="mb-8" />
          <v-row>
            <v-text-field v-model="userName" :rules="rules" label="User Name" 
              @keypress.enter="onClickRegister" class="mb-2" />
            <v-btn block @click="onClickRegister" :disabled="userName == ''">Register</v-btn>
          </v-row>
        </v-col>
    </v-container>
  </v-main>
</template>