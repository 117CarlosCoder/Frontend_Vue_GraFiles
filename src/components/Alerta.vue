<template>
  <v-dialog v-model="visible" max-width="400">
    <v-card>
      <v-card-title class=" red--text">{{ message }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="close">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  message: String,
  duration: {
    type: Number,
    default: 2000 // Duración predeterminada de 1 segundo
  }
});

const visible = ref(true);

const close = () => {
  visible.value = false;
};

// Auto-cerrar el diálogo después de la duración especificada
setTimeout(() => {
  visible.value = false;
}, props.duration);
</script>
