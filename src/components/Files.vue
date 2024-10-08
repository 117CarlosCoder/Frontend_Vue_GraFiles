<template>
  <v-container fluid class="pa-0">
    <v-toolbar flat>
      <NewFile @created="fetchFiles" :directory="fileActual" />
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
          @click="selectDirectory(file)"
          hover
          :class="{ 'selected': selectDirectorys.includes(file.id) }"
        >
          <v-card-title class="text-h6 font-weight-bold white--text">
            {{ file.name }}
          </v-card-title>
          <v-card-actions class="pa-4 bg-grey-darken-3">
            <v-icon color="grey-lighten-1" class="mr-2">mdi-folder</v-icon>
            <span class="text-body-2 grey--text text--lighten-1">{{ formatDate(file.updated) }}</span>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon small v-bind="props" @click.stop>
                  <v-icon color="grey-lighten-1">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click.stop="editFile(file)">
                  <template v-slot:prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Editar Nombre</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="shareFile(file)">
                  <template v-slot:prepend>
                    <v-icon>mdi-share-variant</v-icon>
                  </template>
                  <v-list-item-title>Compartir</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="confirmDelete(file)">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title class="error--text">Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="300">
      <v-card>
        <v-card-title class="headline">Cofirmar Eliminación</v-card-title>
        <v-card-text>¿Esta seguro que quieres elminar la carpeta?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" text @click="deleteFile">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="shareDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Compartir Carpeta</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="shareEmail"
            label="correo electronico"
            type="email"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="shareDialog = false">Cancelar</v-btn>
          <v-btn color="primary" text @click="shareFolder">Comparir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editNameDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Editar Nombre de la Carpeta</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newFolderName"
            label="Ingresa el nuevo nombre"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="editNameDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="updateFolderName">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NewFile from './NewFile.vue';

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
    const fileToDelete = ref(null);
    const fileToShare = ref(null);
    const fileToEdit = ref(null);
    const shareEmail = ref('');
    const newFolderName = ref('');

    const fetchFiles = async () => {
      directoryId.value = id.value === "" ? rootdirectory : id.value;
      try {
        const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId.value}`, { withCredentials: true });
        files.value = response.data;
        fileActual.value = {
          "directory": 0,
          "id": rootdirectory
        };
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    onMounted(fetchFiles);

    const selectDirectory = async (file) => {
      routeSave.value.push(file.directory_parent_id);
      fileActual.value = file;
      id.value = file.id;
      directoryId.value = id.value === "" ? rootdirectory : id.value;
      arrowActive.value = directoryId.value !== rootdirectory;
      filesAfter.value.push(fileActual.value);

      try {
        const response = await axios.get(`http://localhost:8080/directory/gets?id=${directoryId.value}`, { withCredentials: true });
        files.value = response.data;
      } catch (error) {
        console.error("Error fetching files:", error);
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
        arrowActive.value = routeSave.value.length > 0;
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    const toggleView = () => {
      isListView.value = !isListView.value;
    };

    const showInfo = () => {
      console.log("Show info");
    };

    const confirmDelete = (file) => {
      fileToDelete.value = file;
      deleteDialog.value = true;
    };

    const deleteFile = async () => {
      if (fileToDelete.value) {
        try {
          await axios.delete(`http://localhost:8080/directory/deleted?id=${fileToDelete.value.id}`, { withCredentials: true });
          console.log("Delete file:", fileToDelete.value.name);
          await fetchFiles(); 
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
      deleteDialog.value = false;
      fileToDelete.value = null;
    };

    const confirmShare = (file) => {
      fileToShare.value = file;
      shareEmail.value = '';
      shareDialog.value = true;
    };

    const shareFolder = async () => {
      if (fileToShare.value && shareEmail.value) {
        try {
          await axios.post(`http://localhost:8080/directory/share`, {
            id: fileToShare.value.id,
            email: shareEmail.value
          }, { withCredentials: true });
          console.log("Share folder:", fileToShare.value.name, "with", shareEmail.value);
        } catch (error) {
          console.error("Error sharing folder:", error);
        }
      }
      shareDialog.value = false;
      fileToShare.value = null;
    };

    const confirmEditName = (file) => {
      fileToEdit.value = file;
      newFolderName.value = file.name;
      editNameDialog.value = true;
    };

    const updateFolderName = async () => {
      if (fileToEdit.value && newFolderName.value) {
        const loadData ={
            "id": fileToEdit.value.id,
            "name": newFolderName.value
        }
        try {
          await axios.put(`http://localhost:8080/directory/updated`, loadData, { withCredentials: true });
          console.log("Update folder name:", fileToEdit.value.name, "to", newFolderName.value);
          await fetchFiles(); 
        } catch (error) {
          console.error("Error updating folder name:", error);
        }
      }
      editNameDialog.value = false;
      fileToEdit.value = null;
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const editFile = (file) => {
      confirmEditName(file);
    };

    const shareFile = (file) => {
      confirmShare(file);
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
      shareEmail,
      newFolderName,
      confirmDelete,
      deleteFile,
      confirmShare,
      shareFolder,
      confirmEditName,
      updateFolderName,
      formatDate,
      editFile,
      shareFile, 
      goHome
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