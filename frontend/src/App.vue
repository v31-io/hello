<script setup>
  import { useKeycloak } from '@dsb-norge/vue-keycloak-js'
  import { computed, ref } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { useServerStore } from '@/stores/server'
  
  import LoginPage from './components/LoginPage.vue'
  import ChatPage from './components/ChatPage.vue'

  const { keycloak } = useKeycloak()
  const theme = ref('dark')
  const user = useUserStore()
  const server = useServerStore()
  const page = computed(() => user.id ? ChatPage : LoginPage)
  const statusSnackbar = ref(false)

  function onClickTheme () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function onClickLogout () {
    user.logout()
    server.logout()
    keycloak.logout()
  }

  function onClickStatus () {
    statusSnackbar.value = true
  }
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-btn :prepend-icon="'mdi-circle'" slim size="small" flat :ripple="false" :disabled="!server.connected"
        :color="server.connected ? 'success' : 'error'" @click="onClickStatus" class="ps-0 pe-0 ms-0"/>
        <v-snackbar v-model="statusSnackbar" :timeout="5000" multi-line>
          {{ `${user.id}:${user.name}\n${server.name}` }}
        </v-snackbar>
      <v-app-bar-title class="ms-0">Hello Chat</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"  
        slim @click="onClickTheme"/>
      <v-btn v-if="user.id != ''" :prepend-icon="'mdi-logout'"  slim @click="onClickLogout"/>
    </v-app-bar>

    <component :is="page" />
  </v-app>
</template>