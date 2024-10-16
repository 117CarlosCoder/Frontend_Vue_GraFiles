<template>
    <v-card class=" pa-0 h-100 w-100">
  
      <v-row class="pa-0 ma-0">
        <v-col class="pa-0">
          <v-navigation-drawer expand-on-hover rail permanent>
            <v-list>
              <v-list-item prepend-icon="mdi-account" :subtitle="user.email" :title="user.name"></v-list-item>
            </v-list>
  
            <v-divider></v-divider>
  
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-delete-variant" title="Papeleria" value="papeleria" @click="trashFiles">
              </v-list-item>
              <v-list-item prepend-icon="mdi-account-check" title="Crear Usuario" value="crearusuario"
                @click="createUser"></v-list-item>
              <v-list-item prepend-icon="mdi-cog" title="Configuracion" value="Configuracion"
                @click="changeConfig"></v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-container fluid class="fill-height h-100 w-100 pa-0 ma-0">
          <v-main class="h-100 w-100 pa-0 ma-0">
            <Trash v-if="trash"></Trash>
            <CreateEmployee v-if="users"></CreateEmployee>
            <ChangePassword v-if="config"></ChangePassword>
  
          </v-main>
        </v-container>
      </v-row>
  
    </v-card>
  </template>
  
  <script>
  import Files from './Files.vue';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import FilesShared from './FilesShared.vue';
  import ChangePassword from './ChangePassword.vue';
import Trash from './Trash.vue';
import CreateEmployee from './createEmployee.vue';
  
  export default {
    setup() {
      const trash = ref(true);
      const users = ref(false);
      const config = ref(false);
      const role = ref(localStorage.getItem('userRole'));
      const user = ref({
        name: '',
        email: ''
      });
  
      onMounted(async () => {
        try {
          const response = await axios.get('http://localhost:8080/user/get/info', { withCredentials: true });
          user.value = response.data;
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      });
  
      const trashFiles = () => {
        users.value = false;
        config.value = false;
        trash.value = true;
      };
  
      const createUser = () => {
        config.value = false;
        trash.value = false;
        users.value = true;
      };
  
      const changeConfig = () => {
        config.value = true;
        trash.value = false;
        users.value = false;
      };
  
      return {
        user,
        trash,
        users,
        config,
        role,
        trashFiles,
        changeConfig,
        createUser
      };
    },
  };
  </script>
  