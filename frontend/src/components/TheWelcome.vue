<script setup>
import { ref, markRaw } from 'vue'
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'

const API_URL = import.meta.env.VITE_BACKEND_URL || ''

let welcomeItemsData = ref([{
  icon: markRaw(DocumentationIcon),
  heading: 'Hello',
  content: 'Halloooo'
}, {
  icon: markRaw(ToolingIcon),
  heading: 'World',
  content: 'Worldoo'
}])

// Fetch data from backend
fetch(`${API_URL}/api`)
  .then(response => response.json())
  .then(backendItems => {
    backendItems.forEach(item => {
      welcomeItemsData.value.push({
        icon: markRaw(ToolingIcon),
        heading: item.id,
        content: item.title
      })
    })
  })
  .catch(error => {
    console.error('Error fetching data:', error)
  })
</script>

<template>
  <template v-for="item in welcomeItemsData" :key="item">
    <WelcomeItem :icon=item.icon :heading="item.heading" :content="item.content"/>
  </template>
</template>