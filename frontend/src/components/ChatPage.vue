<script setup>
import { useUserStore } from '@/stores/user';
import { useServerStore } from '@/stores/server';
import { ref, useTemplateRef, nextTick } from 'vue';

const chatListBottom = useTemplateRef('chatListBottom')
const message = ref('')
const chats = ref([])
const user = useUserStore()
const server = useServerStore()

async function scrollTochatListBottom() {
  await nextTick()
  chatListBottom.value.$el.scrollIntoView({ behavior: 'smooth' })
}

function sendMessage(pmessage) {
  const chat = ref({
    self: true,
    user: user.name,
    chat: pmessage,
    loading: true
  })

  server.sendMessage(pmessage, () => {
    chat.value.loading = false
  })
  
  chats.value.push(chat.value)
  message.value = ''
  scrollTochatListBottom()
} 

server.receiveMessageHandler((chat) => {
  chat.self = false
  chat.loading = false
  chats.value.push(chat)
  scrollTochatListBottom()
})

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
          <v-card-actions v-if="chat.loading">
            <v-btn :prepend-icon="'mdi-check'" slim size="x-small" :loading="chat.loading" disabled class="ps-0 pe-0 ms-0"/>
          </v-card-actions>
        </v-card>
        <v-spacer ref="chatListBottom" />
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