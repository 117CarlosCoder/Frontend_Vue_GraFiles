<template>
      <v-spacer></v-spacer>
      <v-icon small>mdi-account</v-icon>
      <v-btn text @click="logout">Cerrar Sesión</v-btn>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';

export default {
    setup() {
        const router = useRouter();

        const logout = async () => {
            try {
                
                await axios.post('http://localhost:8080/auth/logout',null,{withCredentials:true});
                localStorage.removeItem('userRole');
                VueCookies.remove('jwtToken');
                router.push('/');
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        };

        return {
            logout,
        };
    },
};
</script>