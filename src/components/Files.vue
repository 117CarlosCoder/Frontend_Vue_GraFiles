<template>
  <v-container fluid class="pa-0">
    <v-toolbar flat>
      <NewFile @created="fetchFilesChange" :directory="fileActual" />
      <v-btn icon @click="goHome">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleView">
        <v-icon>{{ isListView ? 'mdi-view-grid' : 'mdi-view-list' }}</v-icon>
      </v-btn>
      <v-btn icon @click="showInfo">
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-toolbar>
    <Alerta v-if="errorMessage" :message="errorMessage" />
    
    <v-breadcrumbs :items="breadcrumbItems" divider="/" class="pa-4">
      <template v-slot:item="{ item, index }">
        <v-breadcrumbs-item
          :disabled="index === breadcrumbItems.length - 1"
          @click="breadcrumbNavigate(item.id)"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <v-btn v-if="arrowActive" icon @click="routeChange" class="mb-4">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

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
      @dblclick="selectDirectory(file)"
      hover
      :class="{ 'selected': selectDirectorys.includes(file.id) }"
    >
      <v-card-title  class="text-h6 font-weight-bold white--text">
        {{ file.name }}
      </v-card-title>
      <v-card-actions v-if="isImageType(file.fileType)" :class="'bg-warning'" >
        <v-icon class="mr-2">
          {{'mdi-image-album' }}
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
            <MultiDialog @change="fetchFilesChange" :file="file" />
          </template>
        </v-menu>
      </v-card-actions>
      <v-card-actions v-else-if="file.fileType" :class="'bg-primary'" >
        <v-icon class="mr-2">
          {{ 'mdi-file' }}
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
            <MultiDialog @change="fetchFilesChange" :file="file" />
          </template>
        </v-menu>
      </v-card-actions>
      <v-card-actions v-else :class="'bg-grey-darken-3'" >
        <v-icon class="mr-2">
          {{'mdi-folder' }}
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
            <MultiDialog @change="fetchFilesChange" :file="file" />
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
import NewFile from './NewFile.vue';
import Alerta from './Alerta.vue';


export default {
  components: {
    NewFile
  },
  setup() {
    const id = ref("");
    const rootdirectory = "000000000000000000000000";
    const selectDirectorys = ref([]);
    const files = ref([]);
    const fileActual = ref({});
    const filesAfter = ref([]);
    const routeSave = ref([]);
    const directoryId = ref("");
    const arrowActive = ref(false);
    const isListView = ref(false);
    const deleteDialog = ref(false);
    const shareDialog = ref(false);
    const editNameDialog = ref(false);
    const newFolderName = ref('');
    const breadcrumbItems = ref([{ text: 'Raiz', id: rootdirectory }]);
    const errorMessage = ref('');

    const fetchFiles = async () => {
      directoryId.value = id.value === "" ? rootdirectory : id.value;
      try {
        const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId.value}`, { withCredentials: true });
        files.value = response.data;
        fileActual.value = {
          "directory": 0,
          "id": rootdirectory
        };

        const responsefile = await axios.get(`http://localhost:8080/file/gets?id=${directoryId.value}`, { withCredentials: true });


        files.value = [...files.value, ...responsefile.data];
        updateBreadcrumbs();

    

      } catch (error) {
        errorMessage.value = error || 'Hubo un problema con la solicitud.';
        console.error("Error fetching files:", error);
      }
    };


    const fetchFilesChange = async () => {
      directoryId.value = id.value === "" ? rootdirectory : id.value;
      try {
        const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId.value}`, { withCredentials: true });
        files.value = response.data;

        const responsefile = await axios.get(`http://localhost:8080/file/gets?id=${directoryId.value}`, { withCredentials: true });


        files.value = [...files.value, ...responsefile.data];
        updateBreadcrumbs();
      } catch (error) {
        errorMessage.value =error || 'Hubo un problema con la solicitud.';
        console.error("Error fetching files:", error);
      }
    };

    onMounted(fetchFiles);

    const selectDirectory = async (file) => {

      if (file.fileType) {
        
      }
      else{

      routeSave.value.push(file.directory_parent_id);
      fileActual.value = file;
      id.value = file.id;
      directoryId.value = id.value === "" ? rootdirectory : id.value;
      arrowActive.value = directoryId.value !== rootdirectory;
      filesAfter.value.push(fileActual.value);

      try {
        const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId.value}`, { withCredentials: true });
        files.value = response.data;
         const responsefile = await axios.get(`http://localhost:8080/file/gets?id=${directoryId.value}`, { withCredentials: true });


        files.value = [...files.value, ...responsefile.data];
        updateBreadcrumbs();
      } catch (error) {
        errorMessage.value =error || 'Hubo un problema con la solicitud.';
        console.error("Error fetching files:", error);
      }
    }
    };

    const routeChange = async () => {
      filesAfter.value.pop();
      if (filesAfter.value.length === 0) {
        fileActual.value = { "id": rootdirectory };
      } else {
        fileActual.value = filesAfter.value[filesAfter.value.length - 1];
      }

      try {
        const response = await axios.get(`http://localhost:8080/directory/gets?id=${routeSave.value.pop()}`, { withCredentials: true });
        files.value = response.data;

         const responsefile = await axios.get(`http://localhost:8080/file/gets?id=${fileActual.value.id}`, { withCredentials: true });

        files.value = [...files.value, ...responsefile.data];

        arrowActive.value = routeSave.value.length > 0;
        updateBreadcrumbs();
      } catch (error) {
        errorMessage.value = error || 'Hubo un problema con la solicitud.';
        console.error("Error fetching files:", error);
      }
    };

    const breadcrumbNavigate = async (directoryId) => {
      id.value = directoryId;
      await fetchFilesChange();
    };

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

    const updateBreadcrumbs = () => {
      breadcrumbItems.value = filesAfter.value.map((file) => ({
        text: file.name,
        id: file.id
      }));
      breadcrumbItems.value.unshift({ text: 'Raiz', id: rootdirectory });
    };
    

    const goHome = async () => {
      id.value = "";
      selectDirectorys.value = [];
      fileActual.value = {};
      filesAfter.value = [];
      routeSave.value = [];
      directoryId.value = "";
      arrowActive.value = false;

      await fetchFiles();
    };


    return {
      id,
      rootdirectory,
      selectDirectorys,
      files,
      selectDirectory,
      fetchFiles,
      routeChange,
      directoryId,
      arrowActive,
      fileActual,
      filesAfter,
      isListView,
      toggleView,
      showInfo,
      deleteDialog,
      shareDialog,
      editNameDialog,
      newFolderName,
      formatDate,
      fetchFilesChange,
      goHome,
      routeSave,
      breadcrumbItems,
      breadcrumbNavigate,
      isImageType,
      errorMessage
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