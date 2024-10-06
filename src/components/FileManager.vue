<template>
  <v-card class=" pa-0 h-100 w-100">
    
      <v-row class="pa-0 ma-0 h-100">
        <v-col cols="2">
          <v-navigation-drawer
            expand-on-hover
            rail
            permanent
          >
            <v-list>
              <v-list-item
                prepend-icon="mdi-account"
                :subtitle="user.email"
                :title="user.name"

              ></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
              <v-list-item
                prepend-icon="mdi-folder"
                title="Archivos"
                value="archivos"
                @click="changeFolder"
              >
              </v-list-item>
              <v-list-item prepend-icon="mdi-account-multiple" title="Compartido" value="Compartido" @click="changeShare"></v-list-item>
              <v-list-item prepend-icon="mdi-cog" title="Configuracion" value="Configuracion" @click="changeConfig"></v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-container fluid class="fill-height h-100 w-100 pa-0 ma-0">
          <v-main class="h-100 w-100 pa-5 ma-0">
            <h1 v-if="folder && role === 'EMPLOYEE'">Hola1 Employee</h1>
            <GetEmployes v-if="folder && role === 'ADMIN'" class="w-100 h-auto "></GetEmployes>
            <h1 v-if="folder && role === 'ADMIN'">Hola1 Admin</h1>
            <h1 v-if="share && role === 'EMPLOYEE'">Hola2 Employee</h1>
            <h1 v-if="share && role === 'ADMIN'">Hola2 Admin</h1>
            <h1 v-if="config && role === 'EMPLOYEE'">Hola3 Employee</h1>
            <h1 v-if="config && role === 'ADMIN'">Hola3 Admin</h1>

          </v-main>
        </v-container>
      </v-row>
    
  </v-card>
</template>

<script>
import GetEmployes from '@/pages/Admin/getEmployes.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  components: {
    GetEmployes, // Registra el componente
  },
  setup() {
    const folder = ref(true);
    const share = ref(false);
    const config = ref(false); 
    const role = ref(localStorage.getItem('userRole'));
    const user = ref({
        name:'',
        email:''
    });

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/get/info', {withCredentials:true});
        user.value = response.data;
        console.log(user.value)
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    });

    const changeFolder = () => {
      share.value = false;
      config.value = false;
      folder.value = true; 
    };
    
    const changeShare = () => {
      config.value = false;
      folder.value = false; 
      share.value = true; 
    };

    const changeConfig = () => {
      config.value = true; 
      folder.value = false; 
      share.value = false; 
    };

    return {
      user,
      folder,
      share,
      config,
      role,
      changeFolder,
      changeConfig,
      changeShare
    };
  },
};
</script>
