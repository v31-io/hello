<script setup>
  import { ref } from 'vue'
  import loginImage from '../assets/login.svg'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const userName = ref('')

  const rules = [
    value => {
      if (value) return true
      return 'You must enter a name.'
    },
  ]

  function onClickRegister() {
    user.login(userName.value)
  }
</script>

<template>
  <v-main>
    <v-container fill-height>
      <v-row justify="center" align="center">
        <v-col xs="12" sm="6" md="4">
          <v-img aspect-ratio="16/9" cover :src="loginImage" class="mb-2" />
          <v-row>
            <v-text-field v-model="userName" :rules="rules" label="User Name"/>
            <v-btn class="mt-2" block @click="onClickRegister" :disabled="userName == ''">Register</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>