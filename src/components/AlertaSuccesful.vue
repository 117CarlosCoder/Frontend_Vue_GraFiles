<template>
    <v-dialog v-model="visible" max-width="400">
      <v-card>
        <v-card-title class="text-h5">{{ message }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="close">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    message: String,
    duration: {
      type: Number,
      default: 2000
    }
  });
  
  const visible = ref(true);
  
  const close = () => {
    visible.value = false;
  };
  
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
  
  watch(() => props.message, () => {
    visible.value = true;
  });
  </script>
  