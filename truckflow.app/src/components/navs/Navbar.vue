<template>
  <v-app-bar scroll-threshold="0" color="#195FA0" class="pa-2" elevation="0">
    <v-app-bar-nav-icon icon="mdi-menu" @click="abrirNavegacao"></v-app-bar-nav-icon>

    <v-app-bar-title class="d-flex justify-center">
      <div class="text-h6 text-white font-weight-bold">
        <v-img :width="145" aspect-ratio="16/9" cover src="/Rectangle.svg" class="pa-3 mt-3"> </v-img>
      </div>
    </v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-bell-outline" @click="openBellModal"></v-btn>

      <v-menu 
        v-model="accountModal"
        location="bottom end"
        transition="scale-transition"
        :close-on-content-click="false"
    >
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-card min-width="220" class="rounded-lg">
          <v-list>
            <v-list-item :title="profile.name" :subtitle="roleDisplay">
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal">GL</v-avatar>
              </template>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list density="compact" nav>
            <v-list-item 
                prepend-icon="mdi-cog-outline"
                title="Configurações"
                @click="toConfigs"
            >
            </v-list-item>
            
            <v-list-item
                prepend-icon="mdi-logout"
                color="error"
                title="Sair"
                @click="logout">
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>

  <v-navigation-drawer 
    v-model="ativo"
    color="#195FA0"
    border="none"
    width="280"
  >
    
    <div class="pa-4 text-center">
        <v-avatar size="80" color="white" class="mb-3">
            <v-img src="/cat.jpg" alt="Profile"></v-img>
        </v-avatar>
        <div class="text-white font-weight-bold text-h6">{{ profile.name }}</div>
        <div class="text-white-darken-1 text-body-2">{{ roleDisplay }}</div>
    </div>

    <v-divider class="mb-4 border-opacity-25" color="white"></v-divider>

    <v-list class="px-3" density="comfortable" nav>
      
        <v-list-item 
            to="/visualizar" 
            prepend-icon="mdi-calendar-month-outline" 
            title="Agendamentos" 
            rounded="xl"
            variant="outlined"
            base-color="white"
            class="mb-2"
      ></v-list-item>

       <v-list-item 
            to="/visualizar-grades" 
            prepend-icon="mdi-eye" 
            title="Visualizar Grades" 
            rounded="xl"
            variant="outlined"
            base-color="white"
            class="mb-2"
      ></v-list-item>
      
      <v-list-group value="Notificacoes">
        <template v-slot:activator="{props}">
          <v-list-item 
            to="/programacao" 
            prepend-icon="mdi-calendar-check" 
            title="Programação" 
            rounded="xl"
            variant="outlined"
            base-color="white"
            class="mb-2"
          >
          </v-list-item>
        </template>
    </v-list-group value="Notificacoes">


      <v-list-item 
        to="/bloqueios" 
        prepend-icon="mdi-lock-outline" 
        title="Bloqueios" 
        rounded="xl"
        variant="outlined"
        base-color="white"
        class="mb-2"
      ></v-list-item>

      <v-list-group value="Notificacoes">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-bell-ring-outline"
            title="Notificações"
            rounded="xl"
            variant="outlined"
            base-color="white"
            class="mb-2"
          ></v-list-item>
        </template>

        <v-list-item
          to="reagendamentos"
          title="Reagendar Carga"
          prepend-icon="mdi-circle-small"
          rounded="xl"
          variant="text" 
          color="white"
          class="pl-6 mb-1 text-white"
        ></v-list-item>

         <v-list-item
          to="notificacoes-motoristas"
          title="Motoristas"
          prepend-icon="mdi-circle-small"
          rounded="xl"
          variant="text" 
          color="white"
          class="pl-6 mb-1 text-white"
        ></v-list-item>

         <v-list-item
          to="enviar-notificacao"
          title="Enviar notificação"
          prepend-icon="mdi-circle-small"
          rounded="xl"
          variant="text" 
          color="white"
          class="pl-6 mb-1 text-white"
        ></v-list-item>

      </v-list-group>

      <v-list-group value="Gerenciar">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-cog-box"
            title="Gerenciar"
            rounded="xl"
            variant="outlined"
            base-color="white"
            class="mb-2"
          ></v-list-item>
        </template>

        <div class="d-flex flex-column gap-1 mt-1">
            <v-list-item title="Produtos" 
                to="produtos" rounded="xl"
                variant="text"
                class="pl-6 text-white"
                prepend-icon="mdi-package-variant-closed"
                density="compact" />
            <v-list-item title="Descarga"
                to="locais" 
                rounded="xl"
                variant="text"
                class="pl-6 text-white"
                prepend-icon="mdi-truck-delivery"
                density="compact" />
            <v-list-item title="Fornecedores" to="fornecedores" rounded="xl" variant="text" class="pl-6 text-white" prepend-icon="mdi-domain" density="compact" />
            <v-list-item title="Recebimento" to="recebimentos" rounded="xl" variant="text" class="pl-6 text-white" prepend-icon="mdi-import" density="compact" />
            <v-list-item title="Controle" to="/visualizar-recebimentos" rounded="xl" variant="text" class="pl-6 text-white" prepend-icon="mdi-clipboard-list-outline" density="compact" />
        </div>
      </v-list-group>

      <v-list-item 
        to="/relatorios" 
        prepend-icon="mdi-file-chart-outline" 
        title="Relatórios" 
        rounded="xl"
        variant="outlined"
        base-color="white"
        class="mt-2"
      ></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const accountModal = ref(false);
const isActiveBell = ref(false);
const ativo = ref(true);

const profile = {
  name: "Gean Luca",
  role: "admin",
};

const roleDisplay = ref('Administrador');

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
:deep(.v-list-group__items .v-list-item) {
  /* Ajuste fino para os subitens */
  font-size: 0.9rem; 
  opacity: 0.9;
}

/* Efeito hover suave nos subitens */
:deep(.v-list-group__items .v-list-item:hover) {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>