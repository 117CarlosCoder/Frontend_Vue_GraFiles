<template>
    <v-container>
      <v-card class="mx-auto pa-6" max-width="600">
        <v-card-title class="text-h5 mb-4">
          Crear Nuevo Usuario
        </v-card-title>
        <v-form @submit.prevent="createUser" v-model="isFormValid">
          <v-text-field
            v-model="user.name"
            label="Nombre"
            required
            :rules="[v => !!v || 'El nombre es requerido']"
          ></v-text-field>
  
          <v-text-field
            v-model="user.username"
            label="Nombre de usuario"
            required
            :rules="[v => !!v || 'El nombre de usuario es requerido']"
          ></v-text-field>
  
          <v-text-field
            v-model="user.email"
            label="Correo electrónico"
            type="email"
            required
            :rules="[
              v => !!v || 'El correo electrónico es requerido',
              v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
            ]"
          ></v-text-field>
  
          <v-text-field
            v-model="user.password"
            label="Contraseña"
            type="password"
            required
            :rules="[v => !!v || 'La contraseña es requerida']"
          ></v-text-field>

  
          
  
          <v-btn
            type="submit"
            color="primary"
            block
            class="mt-4"
            :disabled="!isFormValid"
          >
            Crear Usuario
          </v-btn>
        </v-form>
  
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="3000"
        >
          {{ snackbar.text }}
        </v-snackbar>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import axios from 'axios';
  
  const isFormValid = ref(false);
  
  const user = reactive({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  
  
  const snackbar = reactive({
    show: false,
    text: '',
    color: ''
  });
  
  const createUser = async () => {


      snackbar.text = 'Usuario creado exitosamente';
      snackbar.color = 'success';
      snackbar.show = true;
  
      try {
          const response = await axios.post(`http://localhost:8080/admin/create/User`, user, { withCredentials: true });
  
          user.update = false;
          user.role = null;
          isFormValid.value = false;
          user.name = '';
          user.username = '';
          user.email = '';
          user.password = '';

        } catch (error) {
          console.error("Error fetching files:", error);
        }

    
  };
  </script>