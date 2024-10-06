<template>
            <v-container class="pa-0 ma-0 w-100 h-auto ">
                <v-table class="w-100">
                    <thead class="w-100">
                        <tr class="w-100">
                            <th class="text-left w-100">
                                Name
                            </th>
                        </tr>
                    </thead>
                    <tbody class="w-100">
                        <tr v-for="item in employes" :key="item.name" class="w-100">
                            <td class="w-100">{{ item.name }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-container>
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

.v-container--fluid{
    max-width: none;
    min-width: none;
}
.v-container{
    max-width: none;
    min-width: none;
}
</style>