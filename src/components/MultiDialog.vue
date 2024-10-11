<template>
    <v-list>
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
        <v-list-item v-if="file.fileType" @click.stop="openCreateFile(file)">
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

    <MoveFile v-if="moveDialog" :fileToMove="file" @change="emitChange"/>

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
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import MoveFile from './MoveFile.vue';

export default {
    props: {
        file: {
            type: Object,
            required: true
        }
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
        const extensions = ref(['.txt', '.md', '.json', '.csv']);
        const fileNameError = ref('');
        const dialog = ref(false);

        const confirmDelete = (file) => {
            fileToDelete.value = file;
            deleteDialog.value = true;
        };

        const deleteFile = async () => {
            if (fileToDelete.value && !fileToDelete.value.fileType) {
                try {
                    await axios.delete(`http://localhost:8080/directory/deleted?id=${fileToDelete.value.id}`, { withCredentials: true });
                    console.log("Delete file:", fileToDelete.value.name);
                    emit('change');
                } catch (error) {
                    console.error("Error deleting file:", error);
                }
            }
            if (fileToDelete.value && fileToDelete.value.fileType) {
                try {
                    console.log(fileToDelete.value)
                    await axios.delete(`http://localhost:8080/file/deleted?id=${fileToDelete.value.id}`, { withCredentials: true });
                    console.log("Delete file:", fileToDelete.value.name);
                    emit('change');
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
                const loadData = {
                    "id": fileToEdit.value.id,
                    "name": newFolderName.value,
                    "directory": fileToEdit.value.directory
                };
                try {
                    await axios.put(`http://localhost:8080/directory/updated`, loadData, { withCredentials: true });
                    console.log("Update folder name:", fileToEdit.value.name, "to", newFolderName.value);
                    emit('change');
                } catch (error) {
                    console.error("Error updating folder name:", error);
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
                emit('change');

                createFileDialog.value = false;
                fileNameError.value = '';
                fileName.value = '';
                fileExtension.value = '';
                fileContent.value = '';

            } catch (error) {
                console.error('Error subiendo el archivo:', error);
            }
        };

        const editFile = (file) => {
            confirmEditName(file);
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
                console.error('Error subiendo el archivo:', error);
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
                console.error('Error subiendo el archivo:', error);
            }
        };

        const emitChange = () =>{
            emit('change');
        }

        const openCreateFile = (file) => {
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

        const moveFile = () =>{
            moveDialog.value = true;
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
            emitChange
        };

    },
    emits: ['change']
}
</script>
