<template>
  <AlertaSuccesful  v-if="successMessage" :message="successMessage" :duration="2000" />
  <Alerta v-if="errorMessage" :message="errorMessage" />
      <v-card class="mx-auto pa-6" max-width="400">
        <v-card-title class="text-h5 mb-4">
          Cambiar Contraseña
        </v-card-title>
        <v-form @submit.prevent="changePassword">
          <v-text-field
            v-model="currentPassword"
            :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showCurrentPassword ? 'text' : 'password'"
            label="Contraseña Actual"
            required
            @click:append="showCurrentPassword = !showCurrentPassword"
          ></v-text-field>
  
          <v-text-field
            v-model="newPassword"
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNewPassword ? 'text' : 'password'"
            label="Nueva Contraseña"
            required
            @click:append="showNewPassword = !showNewPassword"
          ></v-text-field>
  
          <v-text-field
            v-model="confirmPassword"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirmar Nueva Contraseña"
            required
            @click:append="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>
  
          <v-btn
            type="submit"
            color="blue"
            block
            class="mt-4"
            :loading="loading"
          >
            Cambiar Contraseña
          </v-btn>
        </v-form>
  
        <v-alert
          v-if="errorMessage"
          type="error"
          class="mt-4"
          density="compact"
        >
          {{ errorMessage }}
        </v-alert>
  
        <v-alert
          v-if="successMessage"
          type="success"
          class="mt-4"
          density="compact"
        >
          {{ successMessage }}
        </v-alert>
      </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import AlertaSuccesful from './AlertaSuccesful.vue';
  import Alerta from './Alerta.vue';
  
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const errorMessage = ref('');
  const successMessage = ref('');
  const loading = ref(false);
  
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  
  const changePassword = async() => {
    errorMessage.value = '';
    successMessage.value = '';
  
    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
      errorMessage.value = 'Por favor, complete todos los campos.';
      return;
    }
  
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'La nueva contraseña y la confirmación no coinciden.';
      return;
    }
  
   
  

    loading.value = true;

    const loadData = {
        "actualPassword" : currentPassword.value,
        "newPassword" : newPassword.value 
    }

    try {
        const response = await axios.post(`http://localhost:8080/user/change/password`, loadData, { withCredentials: true });
   
        successMessage.value = 'Contraseña cambiada con exito';
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
        errorMessage.value = "";
       

      } catch (error) {

        errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
      }

      loading.value = false;
      setTimeout(() => {
        successMessage.value = "";},2000);
      
  };
  </script>
  
  <style scoped>
  .change-password {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  </style>