<template>
  <v-list>
    <v-list-item @click.stop="dialog = true">
      <template v-slot:prepend>
        <v-icon>mdi-eye</v-icon>
      </template>
      <v-list-item-title>Ver Archivo</v-list-item-title>
    </v-list-item>

    <v-list-item @click.stop="confirmDelete()">
      <template v-slot:prepend>
        <v-icon color="error">mdi-delete</v-icon>
      </template>
      <v-list-item-title class="error--text">Eliminar Archivo</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        Información del Archivo
      </v-card-title>
      <v-card-text class="pt-4">
        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">Nombre :</v-list-item-title>
            <v-list-item-subtitle>{{ file.name }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">Tipo de archivo:</v-list-item-title>
            <v-list-item-subtitle>{{ file.fileType }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">Tamaño:</v-list-item-title>
            <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">Creación:</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(file.created) }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">Modificación:</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(file.updated) }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">Directorio:</v-list-item-title>
            <v-list-item-subtitle>{{ 'Raiz' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <div class="mt-4">
          <h3 class="text-h6 mb-2">Vista Previa del Archivo</h3>
          <div v-if="isImageType(file.fileType)">
            <img :src="getFileUrl()" alt="Vista previa de la imagen" style="max-width: 100%; max-height: 300px;" />
          </div>
          <div v-else>
            <pre>{{ decodedContent }}</pre>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'FileInfoDialog',
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const dialog = ref(false);

    const isImageType = (fileType) => {
      return fileType && fileType.startsWith('image/');
    };

    const decodedContent = computed(() => {
      if (props.file.content) {
        return atob(props.file.content);
      }
      return '';
    });

    const getFileUrl = () => {
      return `data:${props.file.fileType};base64,${props.file.content}`;
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };

    const confirmDelete = async () => {
      if (props.file && props.file.fileType) {
        try {
          console.log(props.file);
          await axios.delete(`http://localhost:8080/file/deletedShare?id=${props.file.id}`, { withCredentials: true });
          console.log("Delete file:", props.file.name);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
      emit('change');
    };

    return {
      dialog,
      decodedContent,
      getFileUrl,
      formatFileSize,
      formatDate,
      isImageType,
      confirmDelete
    };
  }
};
</script>
