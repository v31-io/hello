<script setup>
import loadingImage from '@/assets/loading.svg'
</script>

<template>
  <v-main>
    <v-container class="fill-height">
        <v-col cols="6" offset="3" sm="4" offset-sm="4">
          <v-img aspect-ratio="16/9" cover :src="loadingImage" />
        </v-col>
    </v-container>
  </v-main>
</template>