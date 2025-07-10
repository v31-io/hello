<script setup>
  import { useKeycloak } from '@dsb-norge/vue-keycloak-js'

  import loginImage from '@/assets/login.svg'
  import { useServerStore } from '@/stores/server'

  const { userName } = useKeycloak()
  const server = useServerStore()

  server.login()
</script>

<template>
  <v-main>
    <v-container class="fill-height">
        <v-col xs="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <v-img aspect-ratio="16/9" cover :src="loginImage" class="mb-8" />
          <v-card v-if="userName != ''">
            <template v-slot:title>
              <span class="font-weight-black">Hello {{userName}}! <br/>Connecting to server...</span>
            </template>
          </v-card>
        </v-col>
    </v-container>
  </v-main>
</template>