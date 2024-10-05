<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-app-bar-title>GraFiles</v-app-bar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in employes" :key="item.name">
                            <td>{{ item.name }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-container>
        </v-main>

        <v-footer color="primary" dark app>
            <v-container>
                <v-row no-gutters>
                    <v-col cols="12" sm="6" class="text-center text-sm-left">
                        &copy; {{ new Date().getFullYear() }} Ediciones Gráficas
                    </v-col>
                    <v-col cols="12" sm="6" class="text-center text-sm-right">
                        <v-btn text small href="mailto:soporte@grafiles.com">
                            <v-icon left small>mdi-email</v-icon>
                            soporte@grafiles.com
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </v-app>
</template>

<script>

import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const employes = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/emp/get/employee');
        employes.value = response.data;
        console.log(employes.value)
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    });

    return {
      employes
    };
  }
};


</script>

<style scoped>
.v-btn {
    text-transform: none;
}
</style>