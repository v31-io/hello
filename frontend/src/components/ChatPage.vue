<script setup>
import { useUserStore } from '@/stores/user';
import { useServerStore } from '@/stores/server';
import { ref } from 'vue';

const message = ref('')
const chats = ref([])
const user = useUserStore()
const server = useServerStore()

function sendMessage(pmessage) {
  server.sendMessage(pmessage)
  chats.value.push({
    self: true,
    user: user.id,
    chat: pmessage
  })
  message.value = ''
}

server.receiveMessageHandler((chat) => chats.value.push(chat))

</script>

<template>
  <v-main>
    <v-container>
      <v-col>
        <v-card v-for="(chat, index) in chats" :key="index"
          prepend-icon="mdi-account" :color="chat.self ? 'blue' : null"
          :title="chat.user"
          class="mb-4">
          <v-card-text>{{chat.chat}}</v-card-text>
        </v-card>
      </v-col>
      <v-footer app>
        <v-text-field
            v-model="message"
            append-icon="mdi-send"
            clear-icon="mdi-close-circle"
            label="Message"
            type="text"
            clearable
            @keypress.enter="message == '' ? null : sendMessage(message)"
            @click:append="sendMessage(message)"
            @click:clear="message = ''"
            class="align-center justify-center"
          ></v-text-field>
      </v-footer>
    </v-container>
  </v-main>
</template>