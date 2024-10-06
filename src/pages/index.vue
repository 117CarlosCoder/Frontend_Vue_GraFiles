<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>GraFiles</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-icon small>mdi-account</v-icon>
      <v-btn text @click="login">Iniciar Sesión</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row class="text-center">
          <v-col cols="12">
            <h1 class="text-h3 font-weight-bold mb-4">Bienvenido a GraFiles</h1>
            <p class="subtitle-1">
              Sistema de gestión de archivos en la nube para Ediciones Gráficas
            </p>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" class="mt-8">
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="primary">mdi-cloud-upload</v-icon>
            <h2 class="text-h5 mt-4">Almacenamiento Seguro</h2>
            <p>Sube y almacena tus archivos de forma segura en la nube.</p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="primary">mdi-account-group</v-icon>
            <h2 class="text-h5 mt-4">Colaboración</h2>
            <p>Comparte archivos fácilmente con tus compañeros de trabajo.</p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="primary">mdi-shield-check</v-icon>
            <h2 class="text-h5 mt-4">Acceso Controlado</h2>
            <p>Gestiona los permisos de acceso a tus archivos.</p>
          </v-col>
        </v-row>

        <v-row class="mt-12" align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-8">
              <v-card-title class="headline">¿Listo para empezar?</v-card-title>
              <v-card-text>
                Inicia sesión para comenzar a utilizar GraFiles y gestionar tus archivos de forma eficiente.
              </v-card-text>
              <v-card-actions>
               
                <v-btn
                  color="primary"
                  x-large
                  block
                  @click="login"
                >
                  Iniciar Sesión
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

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
  </v-app>
</template>

<script>


import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const login = () => {
      router.push('/login');  
    };

    return {
      login
    };
  }
};


</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>