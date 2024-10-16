<template>
    <v-row class="pa-5">
            
            <v-col
              v-for="file in files"
              :key="file.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                hover
                @click="selectDirectory(file)"
                :class="{ 'selected': selectDirectorys.includes(file.id) }"
              >
                <v-img
                  :src="file.thumbnail"
                  height="150"
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                >
                  <v-card-title v-text="file.name" class="white--text"></v-card-title>
                </v-img>
                <v-card-actions>
                  <v-icon>mdi-folder</v-icon>
                  <span class="caption">{{ file.modifiedDate }}</span>
                  <v-spacer></v-spacer>
                  <v-btn icon small>
                    <v-icon small>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
</template>

<script>
    import { ref, onMounted } from 'vue';
  import axios from 'axios';
import NewFile from './NewFile.vue';
  
  export default {
    setup() {
      const id = ref("");
      const rootdirectory = "000000000000000000000000";
      const selectDirectorys = ref([]);
      const files = ref([]);
      const fileActual = ref({});
      const routeSave = ref([]);
      var directoryId =  ref("");
      const arrowActive = ref(false);
  
      const fetchFiles = async () => {
        directoryId= id.value === "" ? rootdirectory : id.value;
        try {
          const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId}`, { withCredentials: true });
          files.value = response.data;
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };
  
      onMounted(() => {
        fetchFiles();
      });
  
      const selectDirectory = async (file) => {
        routeSave.value.push(file.directory_parent_id);

        fileActual.value = file;
        id.value = file.id;
         directoryId = id.value === "" ? rootdirectory : id.value;

         if (directoryId != rootdirectory) {
          arrowActive.value =true;
         }

        try {
          const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId}`, { withCredentials: true });
          files.value = response.data;
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

      const routeChange = async () =>{

        try {
          const response = await axios.get(`http://localhost:8080/directory/gets?id=${routeSave.value.pop()}`, { withCredentials: true });
          files.value = response.data;
          if (routeSave.value.length == 0) {
            arrowActive.value =false;
          }
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      }
  
      return {
        id,
        rootdirectory,
        selectDirectorys,
        files,
        selectDirectory,
        routeChange,
        directoryId,
        arrowActive,
        fileActual
      };
    }
  };
</script>