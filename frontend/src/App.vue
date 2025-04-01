<script setup>
  import { computed, ref } from 'vue'
  import { useUserStore } from '@/stores/user'
  
  import LoginPage from './components/LoginPage.vue'
  import ChatPage from './components/ChatPage.vue'

  const theme = ref('dark')
  const user = useUserStore()
  const page = computed(() => user.id ? ChatPage : LoginPage)

  function onClickTheme () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-app-bar-title>Hello Chat</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"  
        slim @click="onClickTheme"/>
      <v-btn v-if="user.id != ''" :prepend-icon="'mdi-logout'"  slim @click="user.logout()"/>
    </v-app-bar>

    <component :is="page" />
  </v-app>
</template>