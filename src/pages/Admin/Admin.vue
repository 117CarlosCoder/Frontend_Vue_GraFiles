<script setup lang="ts">
import FileManagerAdmin from '@/components/FileManagerAdmin.vue';
</script>

<template>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>GraFiles</v-app-bar-title>
      <v-spacer></v-spacer>
      <Logout></Logout>
    </v-app-bar>
  <v-main class="w-100 m-0 pa-0 h-100">
    <FileManagerAdmin></FileManagerAdmin>
  </v-main>
</template>