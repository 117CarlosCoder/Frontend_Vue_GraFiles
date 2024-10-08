<template>
    <div class="pa-4 text-center">
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-file"
          text="Nuevo"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card
        prepend-icon="mdi-file"
        title="Nuevo Archivo o directorio"
      >
        <v-card-text>
          <v-row dense>
            <v-col
            >
              <v-text-field
                v-model="fileName"
                label="Nombre"
                required
              ></v-text-field>
            </v-col>

            
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="cerrar"
            variant="plain"
            @click="dialog = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Crear"
            variant="tonal"
            @click="create(), dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';

export default {
    props: {
        directory: {
            type: Object, 
            required: true
        }
    },
    data: () => ({
      dialog: false,
    }),
    setup(props,{emit}) { 
        
        const fileName = ref("");

        const create = async () =>{
            const loadData = {
                "name" : fileName.value,
                "directory" : props.directory.directory+1,
                "directory_parent_id" : props.directory.id
            }

                console.log(loadData)

             try {
                const response = await axios.post(`http://localhost:8080/directory/created`, loadData,{ withCredentials: true });
                emit('created');
                
            } catch (error) {
                console.error("Error fetching files:", error);
            }


        }

        return {
            create,
            fileName
        };
    }
};
</script>