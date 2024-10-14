<template>
    <AlertaSuccesful  v-if="successMessage" :message="successMessage" :duration="2000" />
    <Alerta v-if="errorMessage" :message="errorMessage" />
    <v-list>
        <v-list-item @click.stop="dialog = true">
            <template v-slot:prepend>
                <v-icon>mdi-eye</v-icon>
            </template>
            <v-list-item-title>Ver Archivo</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="file.fileType" @click.stop="moveFile()">
            <template v-slot:prepend>
                <v-icon>mdi-file-move</v-icon>
            </template>
            <v-list-item-title>Mover Archivo</v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click.stop="moveFile()">
            <template v-slot:prepend>
                <v-icon>mdi-file-move</v-icon>
            </template>
            <v-list-item-title> Mover directorio</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="file.fileType" @click.stop="copyfile(file)">
            <template v-slot:prepend>
                <v-icon>mdi-content-copy</v-icon>
            </template>
            <v-list-item-title>Copiar Archivo</v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click.stop="copyDirectory(file)">
            <template v-slot:prepend>
                <v-icon>mdi-content-copy</v-icon>
            </template>
            <v-list-item-title>Copiar directorio</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isImageType(file.fileType)" @click.stop="updateImageDialog = true">
            <template v-slot:prepend>
                <v-icon>mdi-pencil</v-icon>
            </template>
            <v-list-item-title>Editar Imagen</v-list-item-title>
        </v-list-item>
        <v-list-item v-else-if="file.fileType" @click.stop="openCreateFile(file)">
            <template v-slot:prepend>
                <v-icon>mdi-pencil</v-icon>
            </template>
            <v-list-item-title>Editar Archivo</v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click.stop="editFile(file)">
            <template v-slot:prepend>
                <v-icon>mdi-pencil</v-icon>
            </template>
            <v-list-item-title>Editar Nombre</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="file.fileType" @click.stop="shareFile(file)">
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

    <MoveFile v-if="moveDialog" :fileToMove="file" @change="emitChange" />

    <v-dialog v-model="deleteDialog" max-width="300">
        <v-card>
            <v-card-title class="headline">Confirmar Eliminación</v-card-title>
            <v-card-text>¿Está seguro que quiere eliminar la carpeta?</v-card-text>
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
                <v-text-field v-model="shareEmail" label="Correo electrónico" type="email"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="shareDialog = false">Cancelar</v-btn>
                <v-btn color="primary" text @click="shareFolder">Compartir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editNameDialog" max-width="400">
        <v-card>
            <v-card-title class="headline">Editar Nombre de la Carpeta</v-card-title>
            <v-card-text>
                <v-text-field v-model="newFolderName" label="Ingresa el nuevo nombre"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="editNameDialog = false">Cancelar</v-btn>
                <v-btn color="primary" text @click="updateFolderName">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="createFileDialog" max-width="600">
        
        <v-card title="Actualizar Archivo">
            <v-card-text>
                <v-text-field v-model="fileName" label="Nombre del Archivo" required></v-text-field>
                <v-select v-model="fileExtension" :items="extensions" label="Extensión del Archivo" required></v-select>
                <v-textarea v-model="fileContent" label="Contenido del Archivo" rows="4" outlined required></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-btn text="Cancelar" variant="plain" @click="createFileDialog = false"></v-btn>
                <v-btn color="primary" text="Actualizar" variant="tonal" @click="uploadFile(file)"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="updateImageDialog" max-width="400">
        <v-card title="Actualizar Imagen">
            
            <v-card-text>
                <v-text-field v-model="imageName" label="Nombre de la Imagen" required>
                </v-text-field>
                <v-file-input v-model="imageFile" label="Seleccionar Nueva Imagen" accept="image/*" required
                    @change="previewImage">
                </v-file-input>
                <div v-if="imagePreview" class="mt-4">
                    <h4>Previsualización:</h4>
                    <img :src="imagePreview" alt="Previsualización de la imagen" class="w-100" />
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text="Cancelar" variant="plain" @click="updateImageDialog = false"></v-btn>
                <v-btn color="primary" text="Actualizar" variant="tonal" @click="uploadImage"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


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
                        <img :src="getFileUrl()" alt="Vista previa de la imagen"
                            style="max-width: 100%; max-height: 300px;" />
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
import MoveFile from './MoveFile.vue';
import Alerta from './Alerta.vue';
import AlertaSuccesful from './AlertaSuccesful.vue';

export default {
    props: {
        file: {
            type: Object,
            required: true
        }
    },
    components: {
    Alerta
  },
    setup(props, { emit }) {
        const fileToDelete = ref(null);
        const fileToShare = ref(null);
        const fileToEdit = ref(null);
        const deleteDialog = ref(false);
        const shareDialog = ref(false);
        const editNameDialog = ref(false);
        const shareEmail = ref('');
        const newFolderName = ref('');
        const createFileDialog = ref(false);
        const moveDialog = ref(false);
        const fileName = ref('');
        const fileContent = ref('');
        const fileExtension = ref('');
        const extensions = ref(['.txt', '.html']);
        const fileNameError = ref('');
        const dialog = ref(false);
        const updateImageDialog = ref(false);
        const imageName = ref(props.file.name.split('.').slice(0, -1).join('.') || '');
        const imageFile = ref(null);
        const imagePreview = ref('');
        const errorMessage = ref('');
        const successMessage = ref('');

        const confirmDelete = (file) => {
            fileToDelete.value = file;
            deleteDialog.value = true;
            errorMessage.value ="";
        };

        const deleteFile = async () => {
            if (fileToDelete.value && !fileToDelete.value.fileType) {
                try {
                    await axios.delete(`http://localhost:8080/directory/deleted?id=${fileToDelete.value.id}`, { withCredentials: true });
                    console.log("Delete file:", fileToDelete.value.name);
                    emit('change');
                } catch (error) {
                    errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
        console.error("Error fetching files:", error);
                }
            }
            if (fileToDelete.value && fileToDelete.value.fileType) {
                try {
                    console.log(fileToDelete.value)
                    await axios.delete(`http://localhost:8080/file/deleted?id=${fileToDelete.value.id}`, { withCredentials: true });
                    console.log("Delete file:", fileToDelete.value.name);
                    emit('change');
                } catch (error) {
                    errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
        console.error("Error fetching files:", error);
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
                    const formData = new FormData();
                    formData.append('id', fileToShare.value.id);
                    formData.append('email', shareEmail.value);

                    await axios.post(`http://localhost:8080/file/share`, formData, { withCredentials: true });
                    console.log("Share folder:", fileToShare.value.name, "with", shareEmail.value);
                    successMessage.value = 'Archivo Compartido con exito';
                    setTimeout(() => {
                    emit('change');},2000);
                    
                } catch (error) {
                    errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
        console.error("Error fetching files:", error);
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


        const previewImage = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
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

        const updateFolderName = async () => {
            if (fileToEdit.value && newFolderName.value) {
                const loadData = {
                    "id": fileToEdit.value.id,
                    "name": newFolderName.value,
                    "directory": fileToEdit.value.directory
                };
                try {
                    const response = await axios.put(`http://localhost:8080/directory/updated`, loadData, { withCredentials: true });
                    console.log("Update folder name:", fileToEdit.value.name, "to", newFolderName.value);
                    successMessage.value = response.data;
                    emit('change');
                    
                } catch (error) {
                    errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
        console.error("Error fetching files:", error);
                }
            }
            editNameDialog.value = false;
            fileToEdit.value = "";
            newFolderName.value = "";
        };


        const uploadFile = async (file) => {
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
            console.log(fullFileName)

            const formData = new FormData();
            formData.append('file', new File([blob], fullFileName));
            formData.append('directoryId', file.directory_id);
            formData.append('id', file.id);

            try {

                const response = await axios.put(`http://localhost:8080/file/upload`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data);

                successMessage.value = 'Archivo Actualizdo con exito';
                createFileDialog.value = false;
                fileNameError.value = '';
                fileName.value = '';
                fileExtension.value = '';
                fileContent.value = '';
                emit('change');

                

            } catch (error) {
                errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
                console.error("Error fetching files:", error);
            }
        };

        const editFile = (file) => {

            console.log(file)
            confirmEditName(file);
        };

        const isImageType = (fileType) => {
            return fileType && fileType.startsWith('image/');
        };

        const shareFile = (file) => {
            confirmShare(file);
        };

        const copyDirectory = async (file) => {
            try {

                const formData = {
                    "id": file.id,
                    "directory_parent_id": file.directory_parent_id
                }
                const response = await axios.post(`http://localhost:8080/directory/copy`, formData, {
                    withCredentials: true,
                });

                console.log(response)
                emit('change');
            } catch (error) {
                errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
        console.error("Error fetching files:", error);
            }
        };

        const copyfile = async (file) => {
            try {

                const formData = new FormData();
                formData.append('id', file.id);
                const response = await axios.post(`http://localhost:8080/file/copy`, formData, {
                    withCredentials: true,
                });

                console.log(response)
                emit('change');
            } catch (error) {
                errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
        console.error("Error fetching files:", error);
            }
        };

        const emitChange = () => {
            emit('change');
        }

        const openCreateFile = (file) => {

            console.log(file)
            const dotIndex = file.name.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < file.name.length - 1) {
                // Dividir en nombre y extensión
                fileName.value = file.name.substring(0, dotIndex);
                fileExtension.value = file.name.substring(dotIndex);
            }
            fileContent.value = atob(file.content);
            createFileDialog.value = true;
            dialog.value = false;
        };

        const moveFile = () => {
            moveDialog.value = true;
        };

        const uploadImage = async () => {
            if (!imageFile.value || !imageName.value) {
                alert('Faltan datos: asegúrese de seleccionar una imagen y dar un nombre.');
                return;
            }

            const fileExtension = imageFile.value.name.split('.').pop();
            
            const fullFileName = `${imageName.value}.${fileExtension}`; 

            const blob = imageFile.value;
            const fileImg = new File([blob], fullFileName, { type: blob.type });

            const formData = new FormData();
            formData.append('file', fileImg);
            formData.append('directoryId', props.file.directory_id);
            formData.append('id', props.file.id);

            try {
                const response = await axios.put(`http://localhost:8080/file/upload`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data);
                updateImageDialog.value = false;
                successMessage.value = 'Imagen Actualizado con éxito';
                emit('change');
                
            } catch (error) {
                errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
                if (error.response) {
                    console.error('Detalles del error:', error.response.data);
                    errorMessage.value = error.response.data || error.message || 'Ocurrió un error inesperado';
                }
            }


        };

        return {
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
            openCreateFile,
            editFile,
            shareFile,
            fileName,
            fileContent,
            fileExtension,
            extensions,
            fileNameError,
            createFileDialog,
            uploadFile,
            copyDirectory,
            moveDialog,
            moveFile,
            copyfile,
            emitChange,
            previewImage,
            updateImageDialog,
            imageName,
            imageFile,
            isImageType,
            imagePreview,
            uploadImage,
            dialog,
            decodedContent,
            getFileUrl,
            formatFileSize,
            formatDate,
            isImageType,
            errorMessage,
            successMessage

        };

    },
    emits: ['change']
}
</script>
