<template>
    <v-dialog v-model="moveDialog" max-width="900" scrollable>
      <v-card class="bg-dark">
        <v-card-title class="text-h5 font-weight-bold white--text pa-4">
          Mover {{ fileToMove ? (fileToMove.fileType ? 'Archivo' : 'Carpeta') : 'Elemento' }}
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
  
        <v-card-text class="pa-4">
          <v-alert v-if="error" type="error" class="mb-4">
            {{ error }}
          </v-alert>
  
          <v-row class="mb-4">
            <v-col cols="auto">
              <v-btn icon @click="goBack" :disabled="!canGoBack">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-breadcrumbs :items="breadcrumbs" class="pa-0">
                <template v-slot:divider>
                  <v-icon>mdi-chevron-right</v-icon>
                </template>
                <template v-slot:item="{ item }">
                  <v-breadcrumbs-item
                    :disabled="item.disabled"
                    @click="navigateTo(item)"
                  >
                    {{ item.text }}
                  </v-breadcrumbs-item>
                </template>
              </v-breadcrumbs>
            </v-col>
          </v-row>
  
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
                :class="{ 'selected': file.id === currentDirectory }"
              >
                <v-card-title class="text-h6 font-weight-bold white--text">
                  {{ file.name }}
                </v-card-title>
                <v-card-actions :class="file.fileType ? 'bg-primary' : 'bg-grey-darken-3'">
                  <v-icon class="mr-2">
                    {{ file.fileType ? 'mdi-file' : 'mdi-folder' }}
                  </v-icon>
                  <span class="text-body-2 grey--text text--lighten-1">{{ formatDate(file.updated) }}</span>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
  
        <v-card-actions class="pa-4">
          <v-btn color="primary" @click="moveFiles" :disabled="!canMove">
            Mover
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleView">
            <v-icon>{{ isListView ? 'mdi-view-grid' : 'mdi-view-list' }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    fileToMove: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['change', 'close']);
  
  const moveDialog = ref(true);
  const files = ref([]);
  const isListView = ref(false);
  const error = ref(null);
  const breadcrumbs = ref([{ text: 'Raiz', disabled: false, id: '000000000000000000000000' }]);
  
  const rootDirectory = '000000000000000000000000';
  const currentDirectory = ref(rootDirectory);
  const directoryHistory = ref([]);
  
  const canMove = computed(() => {
    return props.fileToMove && currentDirectory.value !== props.fileToMove.directory_parent_id;
  });
  
  const canGoBack = computed(() => {
    return directoryHistory.value.length > 0;
  });
  
  const fetchFiles = async (directoryId) => {
    error.value = null;
    try {
      const [dirResponse, fileResponse] = await Promise.all([
        axios.get(`http://localhost:8080/directory/gets?id=${directoryId}`, { withCredentials: true }),
        axios.get(`http://localhost:8080/file/gets?id=${directoryId}`, { withCredentials: true })
      ]);
      
      files.value = [...dirResponse.data, ...fileResponse.data]
        .filter(file => !props.fileToMove || file.id !== props.fileToMove.id);
    } catch (err) {
      console.error("Error fetching files:", err);
      error.value = "Error al cargar los archivos. Por favor, inténtelo de nuevo.";
    }
  };
  
  const selectDirectory = (file) => {
    if (!file.fileType) {
      directoryHistory.value.push(currentDirectory.value);
      currentDirectory.value = file.id;
      breadcrumbs.value.push({ text: file.name, disabled: false, id: file.id });
      fetchFiles(file.id);
    }
  };
  
  const navigateTo = (item) => {
    const index = breadcrumbs.value.findIndex(crumb => crumb.id === item.id);
    if (index !== -1) {
      breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
      currentDirectory.value = item.id;
      directoryHistory.value = directoryHistory.value.slice(0, index);
      fetchFiles(item.id);
    }
  };
  
  const goBack = () => {
    if (canGoBack.value) {
      const previousDirectory = directoryHistory.value.pop();
      currentDirectory.value = previousDirectory;
      breadcrumbs.value.pop();
      fetchFiles(previousDirectory);
    }
  };
  
  const toggleView = () => {
    isListView.value = !isListView.value;
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const moveFiles = async () => {
  if (!props.fileToMove) {
    error.value = "No se ha seleccionado ningún archivo para mover.";
    return;
  }

  const loadData = {
    id: props.fileToMove.id,
    directory_parent_id: currentDirectory.value 
  };
  
  console.log('Moving to directory:', loadData.directory_parent_id, ' y el id ', loadData.id,);
  
  try {
    const endpoint = props.fileToMove.fileType ? 'file/move' : 'directory/move';
    await axios.post(`http://localhost:8080/${endpoint}`, loadData, { withCredentials: true });
    moveDialog.value = false;
    emit('change');
    emit('close');
  } catch (err) {
    console.error("Error moving file/directory:", err);
    error.value = "Error al mover el archivo/directorio. Por favor, inténtelo de nuevo.";
  }
};

  
  const closeDialog = () => {
    moveDialog.value = false;
    emit('close');
  };
  
  onMounted(() => {
    if (props.fileToMove) {
      fetchFiles(rootDirectory);
    } else {
      error.value = "No se ha proporcionado un archivo para mover.";
    }
  });
  
  watch(() => props.fileToMove, (newVal) => {
    if (newVal) {
      fetchFiles(rootDirectory);
      breadcrumbs.value = [{ text: 'Raiz', disabled: false, id: rootDirectory }];
      currentDirectory.value = rootDirectory;
      directoryHistory.value = [];
    }
  });
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
  
  .bg-dark {
    background-color: #1E1E1E !important;
  }
  </style>