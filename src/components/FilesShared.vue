<template>
    <v-container fluid class="pa-0">
      <v-toolbar flat>
        <v-btn icon @click="reload">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleView">
          <v-icon>{{ isListView ? 'mdi-view-grid' : 'mdi-view-list' }}</v-icon>
        </v-btn>
        <v-btn icon @click="showInfo">
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </v-toolbar>
  
   
  
      <v-row class="pa-5">
    <v-col
      v-for="file in files"
      :key="file.id"
      cols="12"
      :sm="isListView ? 12 : 6"
      :md="isListView ? 12 : 4"
      :lg="isListView ? 12 : 3"
    >
    <v-card 
        hover
      >
        <v-card-title  class="text-h6 font-weight-bold white--text">
          {{ file.name }}
        </v-card-title>
        <v-card-actions v-if="isImageType(file.fileType)" :class="'bg-warning'" >
          <v-icon class="mr-2">mdi-image-album
          </v-icon>
          <span class="text-body-2 grey--text text--lighten-1">{{ formatDate(file.updated) }}</span>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon small v-bind="props" @click.stop>
                <v-icon color="grey-lighten-1">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <template v-if="file">
              <ShareDialog @change="fetchFiles" :file="file" />
            </template>
          </v-menu>
        </v-card-actions>
        <v-card-actions v-else-if="file.fileType" :class="'bg-primary'" >
          <v-icon class="mr-2">mdi-file
          </v-icon>
          <span class="text-body-2 grey--text text--lighten-1">{{ formatDate(file.updated) }}</span>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon small v-bind="props" @click.stop>
                <v-icon color="grey-lighten-1">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <template v-if="file">
              <ShareDialog @change="fetchFiles" :file="file" />
            </template>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  
  
      
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
import ShareDialog from './ShareDialog.vue';
  
  export default {
    components: {
      ShareDialog
    },
    setup() {
      const id = ref("");
      const rootdirectory = "000000000000000000000000";
      const files = ref([]);
      const directoryId = ref("");
      const isListView = ref(false);

      const fetchFiles = async () => {
        directoryId.value = id.value === "" ? rootdirectory : id.value;
        try {
          const response = await axios.get(`http://localhost:8080/file/get/shared`, { withCredentials: true });
          files.value = response.data;
          console.log(files.value)
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };
  
  
      onMounted(fetchFiles);
  
      const toggleView = () => {
        isListView.value = !isListView.value;
      };
  
      const showInfo = () => {
        console.log("Show info");
      };
  
     
      const isImageType = (fileType) => {
            return fileType && fileType.startsWith('image/');
        };
  
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
  

      const reload = async () => {
      id.value = "";
      directoryId.value = "";
      await fetchFiles();
    };

      return {
        id,
        rootdirectory,
        files,
        fetchFiles,
        directoryId,
        isListView,
        toggleView,
        showInfo,
        formatDate,
        reload,
        isImageType
      };
    }
  };
  </script>
  
  <style scoped>
  .selected {
    border: 2px solid #4d6c94;
  }
  
  .v-card-actions {
    border-top: 1px solid rgba(255, 255, 255, 0.397);
  }
  
  .v-card {
    border: 2px solid #5d656e;
    transition: all 0.3s ease;
  }
  
  .v-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  </style>