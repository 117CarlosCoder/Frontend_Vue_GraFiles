<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="text-none font-weight-regular" prepend-icon="mdi-file" text="Nuevo" variant="tonal"
          v-bind="activatorProps">
          Nuevo
        </v-btn>
      </template>

      <v-card title="Nuevo">
        <v-card-text>
          <v-btn class="ma-2" text="Crear Directorio" variant="tonal" @click="openCreateDirectory"></v-btn>
          <v-btn class="ma-2" text="Crear Archivo" variant="tonal" @click="openCreateFile"></v-btn>
          <v-btn class="ma-2" text="Subir Imagen" variant="tonal" @click="openUploadImage"></v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createDirectoryDialog" max-width="400">
      <v-card title="Nuevo Directorio">
        <v-card-text>
          <v-text-field v-model="directoryName" label="Nombre del Directorio" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="createDirectoryDialog = false"></v-btn>
          <v-btn color="primary" text="Crear" variant="tonal" @click="createDirectory"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createFileDialog" max-width="600">
      <v-card title="Crear Archivo">
        <v-card-text>
          <v-text-field v-model="fileName" label="Nombre del Archivo" required></v-text-field>
          <v-select v-model="fileExtension" :items="extensions" label="Extensión del Archivo" required></v-select>
          <v-textarea v-model="fileContent" label="Contenido del Archivo" rows="4" outlined required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="createFileDialog = false"></v-btn>
          <v-btn color="primary" text="Crear y Subir" variant="tonal" @click="uploadFile"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="uploadImageDialog" max-width="400">
  <v-card title="Subir Imagen">
    <v-card-text>
      <v-text-field 
        v-model="imageName" 
        label="Nombre de la Imagen" 
        required>
      </v-text-field>
      <v-file-input 
        v-model="imageFile" 
        label="Seleccionar Imagen" 
        accept="image/*" 
        required
        @change="previewImage">
      </v-file-input>
      <div v-if="imagePreview" class="mt-4">
        <h4>Previsualización:</h4>
        <img :src="imagePreview" alt="Previsualización de la imagen" class="w-100" />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text="Cancelar" variant="plain" @click="uploadImageDialog = false"></v-btn>
      <v-btn color="primary" text="Subir" variant="tonal" @click="uploadImage"></v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  props: {
    directory: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = ref(false);
    const createDirectoryDialog = ref(false);
    const createFileDialog = ref(false);
    const uploadImageDialog = ref(false);
    const directoryName = ref('');
    const fileName = ref('');
    const fileContent = ref('');
    const fileExtension = ref('');
    const extensions = ref(['.txt', '.md', '.json', '.csv']);
    const fileNameError = ref('');
    const imageFile = ref(null);
    const imageName = ref('');
    const imagePreview = ref(null);



    const openCreateDirectory = () => {
      directoryName.value = '';
      createDirectoryDialog.value = true;
      dialog.value = false;
    };

    const openCreateFile = () => {
      fileNameError.value = '';
      fileName.value = '';
      fileExtension.value = '';
      fileContent.value = '';
      createFileDialog.value = true;
      dialog.value = false;
    };

    const openUploadImage = () => {
      imageFile.value = null;
      uploadImageDialog.value = true;
      dialog.value = false;
    };

    const createDirectory = async () => {
      const loadData = {
        name: directoryName.value,
        directory: props.directory.directory + 1,
        directory_parent_id: props.directory.id
      };

      try {
        await axios.post(`http://localhost:8080/directory/created`, loadData, { withCredentials: true });
        emit('created');
        createDirectoryDialog.value = false;
      } catch (error) {
        console.error('Error creando el directorio:', error);
      }
    };

    const uploadFile = async () => {
      const regex = /^[a-zA-Z0-9-_]+$/;

      if (!fileName.value || !fileExtension.value || !fileContent.value) {
        alert('Faltan datos para crear el archivo');
        return;
      }

      if (!regex.test(fileName.value)) {
        fileNameError.value = 'El nombre del archivo solo puede contener letras, números, guiones (-) y guiones bajos (_).';
        alert(fileNameError.value);
        return;
      }

      const blob = new Blob([fileContent.value], { type: 'text/plain' });
      const fullFileName = `${fileName.value}${fileExtension.value}`;

      const formData = new FormData();
      formData.append('file', new File([blob], fullFileName));
      formData.append('directoryId', props.directory.id);

      try {
        const response = await axios.post(`http://localhost:8080/file/created`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        createFileDialog.value = false;
        emit('created');
      } catch (error) {
        console.error('Error subiendo el archivo:', error);
      }
    };

    const previewImage = () => {
  if (imageFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(imageFile.value);
  } else {
    imagePreview.value = null;
  }
};


    const uploadImage = async () => {
  if (!imageFile.value || !imageName.value) {
    alert('Faltan datos: asegúrese de seleccionar una imagen y dar un nombre.');
    return;
  }

  const fileExtension = imageFile.value.name.split('.').pop(); 
  
  const fullFileName = `${imageName.value}.${fileExtension}`; 
  const blob = imageFile.value;
  const file = new File([blob], fullFileName, { type: blob.type });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('directoryId', props.directory.id);

  try {
    const response = await axios.post(`http://localhost:8080/file/created`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
    uploadImageDialog.value = false;
    emit('created');
  } catch (error) {
    console.error('Error subiendo la imagen:', error);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
      alert(`Error: ${error.response.data.message || 'Ya exite un archivo con ese nomnbre'}`);
    }
  }
};



    return {
      dialog,
      createDirectoryDialog,
      createFileDialog,
      uploadImageDialog,
      directoryName,
      fileName,
      fileContent,
      fileExtension,
      fileNameError,
      extensions,
      imageFile,
      openCreateDirectory,
      openCreateFile,
      openUploadImage,
      createDirectory,
      uploadFile,
      uploadImage,
      imageName,
      previewImage,
      imagePreview
    };
  }
};
</script>
