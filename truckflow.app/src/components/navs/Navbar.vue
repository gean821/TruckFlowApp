<template>
    <v-app-bar scroll-threshold="0" color="#195FA0" class="pa-2">
        <v-app-bar-nav-icon icon="mdi-menu" @click="abrirNavegacao">

        </v-app-bar-nav-icon>

        <v-app-bar-title class="d-flex justify-center">
            <v-img :width="145" aspect-ratio="16/9" cover src="/Rectangle.svg" class="pa-3 mt-3">
            </v-img>
        </v-app-bar-title>

        <template v-slot:append>
            <v-btn 
                icon="mdi-bell-outline"
                @click="openBellModal"
            ></v-btn>

            <v-menu 
                v-model="accountModal"
                location="bottom end"
                transition="fade-transition"
                close-on-content-click
            >

                <!-- Trigger -->
            <template #activator="{ props }">
                <v-btn icon v-bind="props">
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>

                <v-card class="py-2" min-width="220">
                    <v-list>
                        <v-list-item>
                            <v-list-item-title class="font-weight-bold">
                                {{ profile.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ roleDisplay }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2" />

                        <v-list-item @click="logout" link>
                            <v-icon 
                                color="red-darken-2"
                                class="mr-2"
                            >
                                mdi-logout
                            </v-icon>
                                Sair
                        </v-list-item>

                        <v-list-item 
                            @click="toConfigs" 
                            link
                        >
                            <v-icon 
                                class="mr-2"
                                color="black"
                            >
                                mdi-cog-outline
                            </v-icon>
                            Configurações
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </template>

    </v-app-bar>
    <v-navigation-drawer id="navegacao" color="#195FA0" v-model="ativo">
        <v-list class="d-flex flex-column ga-5 pa-3
            mt-3">
            <v-list-item prepend-avatar="/Profile.svg" title="Username" subtitle="Função" </v-list-item>

                <v-divider color="white">
                </v-divider>

                <v-list-item title="Programação" to="/programacao" class="list mt-5 pa-3 text-align" variant="outlined"
                    rounded="pill" </v-list-item />

                <v-list-item title="Bloqueios" to="/bloqueios" class="list mt-5 pa-3" variant="outlined" rounded="pill"
                    </v-list-item />

                <v-list-item title="Notificações" rounded="pill" to="/notificacoes" class="list mt-5 pa-3"
                    variant="outlined" </v-list-item />

                <v-list-group value="Gerenciar">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" title="Gerenciar" rounded="pill" variant="outlined"
                            class="list mt-5 pa-3">
                        </v-list-item>
                    </template>

                    <v-list-item title="Produtos" to="produtos" class="sub-item" />

                    <v-list-item title="Descarga" to="locais" class="sub-item" />

                    <v-list-item title="Fornecedores" to="fornecedores" class="sub-item" />
                    <v-list-item title="Recebimento" to="recebimentos" class="sub-item" />
                    <v-list-item title="Controle" to="/visualizar-recebimentos" class="sub-item" />
                </v-list-group>

                <v-list-item title="Relatórios" to="/relatorios" class="list mt-5 pa-3" rounded="pill"
                    variant="outlined" </v-list-item />
            </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
const accountModal = ref(false);
const isActiveBell = ref(false);
const ativo = ref(false);

const profile = {
  name: "Gean Luca",
  role: "admin",
};

const roleDisplay = ref('Adm');


function abrirNavegacao() {
    ativo.value = !ativo.value;
}

function openBellModal() {
    isActiveBell.value = true;
}

function logout() {
    router.push('/home');
}

function toConfigs() {
    router.push('/account-config')
}

</script>

<style scoped>
.sub-item {
    text-align: center;
    font-size: 0.9rem;
    padding: 8px 16px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 8px;
    width: 100%;
}

.list {
    text-align: center;
}
</style>
