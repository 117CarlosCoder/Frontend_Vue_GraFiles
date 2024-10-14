<template>
  <v-app-bar app color="primary" dark>
      <v-app-bar-title>GraFiles</v-app-bar-title>
    </v-app-bar>
  <div class="d-flex flex-column items-center justify-center bg-gray-100 h-100">
    <div class="text-center mb-8">
      <svg-icon type="mdi" :path="path" size="48" class="text-blue-600 mx-auto mb-2"></svg-icon>
      <h1 class="text-4xl font-bold text-gray-800">GraFiles</h1>
    </div>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
        <div class="text-subtitle-1 text-medium-emphasis">Cuenta</div>
  
        <v-alert
        v-if="errorMessage"
        type="error"
        dismissible
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

        <v-text-field
          v-model="username"
          density="compact"
          placeholder="Nombre de Usuario"
          prepend-inner-icon="mdi-account"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Contraseña
  
          <!--
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Recuperar Contraseña</a>-->
        </div>
  
        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Ingresa tu constraseña"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="toggleVisibility"
        ></v-text-field>
  
        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
        </v-card>
  
        <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="login"
        >
          Iniciar Sesion
        </v-btn>
  
       
      </v-card>
    </div>
    <v-footer color="primary" dark app>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="6" class="text-center text-sm-left">
            &copy; {{ new Date().getFullYear() }} Ediciones Gráficas
          </v-col>
          <v-col cols="12" sm="6" class="text-center text-sm-right">
            <v-btn text small href="mailto:soporte@grafiles.com">
              <v-icon left small>mdi-email</v-icon>
              soporte@grafiles.com
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiFileChartOutline } from '@mdi/js'
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const path = ref(mdiFileChartOutline)
  const visible = ref(false)
  const username = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const router = useRouter();
  
  const toggleVisibility = () => {
    visible.value = !visible.value
  }


  const login = async () => {

    


    const loginData = {
        username: username.value,
        password: password.value
      };

    try {
        const response = await axios.post('http://localhost:8080/auth/login', loginData,{withCredentials: true});

        if (response.status === 200) {
          const { role } = response.data; 
          localStorage.setItem('userRole', role);

          if (role === 'ADMIN') {
            router.push('/admin/files');
          } else if (role === 'EMPLOYEE'){
            router.push('/employee/files');
          } else {
            router.push('/');
          }
          errorMessage.value = '';
        }
        else{
          errorMessage.value = response.data.message || 'Error desconocido durante el inicio de sesión.';
        }
        
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error en la solicitud de login. Por favor, intente nuevamente.';
      }
  }
  </script>
  
  <style scoped>

  </style>