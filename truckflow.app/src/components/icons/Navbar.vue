<template>
    <v-app-bar 
        scroll-threshold="0"
        color="#195FA0"
        class="pa-2">
        <v-app-bar-nav-icon icon="mdi-menu"
        @click="abrirNavegacao">

        </v-app-bar-nav-icon>
        <v-app-bar-title class="d-flex justify-center">
            <v-img :width="130"
                aspect-ratio="16/9"
                cover src="/Rectangle.svg"
                class="pa-3 mt-3">
            </v-img>
        </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer 
        id="navegacao"
        color="#195FA0" 
        v-model="ativo">
        <v-list
            class="d-flex flex-column ga-5 pa-3
            mt-3"
            >
            <v-list-item
                prepend-avatar="/Profile.svg"
                title="Username"
                subtitle="Função"
            </v-list-item>
            
            <v-divider color="white">
            </v-divider>

            <v-list-item
               title="Programação"
               to="/programacao"
               class="mt-5 pa-3"
               variant="outlined"
               rounded="pill"
 
            </v-list-item />
            
            <v-list-item
               title="Bloqueios"
               to="/bloqueios"
               class="mt-5 pa-3"
               variant="outlined"
               rounded="pill"

            </v-list-item />
            
            <v-list-item
               title="Notificações"
               rounded="pill"
               to="/notificacoes"
               class="mt-5 pa-3"
               variant="outlined"
            </v-list-item />

            <v-list-item
               title="Gerenciar"
               to="/gerenciar"
               class="mt-5 pa-3"
               rounded="pill"
               variant="outlined"
            </v-list-item />

            <v-list-item 
               title="Relatórios"
               to="/relatorios"
               class="mt-5 pa-3"
               rounded="pill"
               variant="outlined"
            </v-list-item />
        </v-list>
          
        <template v-slot:append>
            <div class="pa-5">
                <v-btn 
                    prepend-icon="mdi-logout"
                    color="red-darken-2"
                    block
                    @click="logout"
                >
                    Sair
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import router from '@/router';
import {ref} from 'vue';


const ativo = ref(false);


function abrirNavegacao() {
    ativo.value = !ativo.value;
}

function logout() {
    router.push('/home');
}
</script>
