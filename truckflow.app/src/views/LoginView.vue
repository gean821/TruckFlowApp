<template>
  <v-row no-gutters class="fill-height">
    <v-col cols="12" md="6" lg="7" class="bg-primary d-none d-md-flex flex-column align-center justify-center position-relative overflow-hidden">
      <div class="circle-decoration circle-1"></div>
      <div class="circle-decoration circle-2"></div>
      
      <div class="z-index-1 text-center px-10">
        <v-icon size="80" color="white" icon="mdi-truck-check-outline" class="mb-6"></v-icon>
        <h2 class="text-h3 font-weight-bold text-white mb-4">TruckFlow</h2>
        <p class="text-h6 text-blue-lighten-4 font-weight-regular max-width-500 mx-auto">
          Gerencie sua operação logística com a precisão de um relógio suíço.
        </p>
      </div>
    </v-col>

    <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center bg-white fill-height">
      <v-container class="px-8 px-md-16">
        <div class="mb-10">
          <v-icon color="primary" size="40" icon="mdi-truck-fast" class="mb-4 d-md-none"></v-icon>
          <h3 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">Bem-vindo de volta!</h3>
          <p class="text-body-1 text-grey">Insira suas credenciais para acessar o painel.</p>
        </div>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="formLogin.login"
            label="Usuario"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            color="primary"
            class="mb-2"
            rounded="lg"
          ></v-text-field>

          <v-text-field
            v-model="formLogin.password"
            label="Senha"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :type="showPass ? 'text' : 'password'"
            :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPass = !showPass"
            color="primary"
            class="mb-1"
            rounded="lg"
          ></v-text-field>

          <div class="d-flex justify-space-between align-center mb-6">
            <v-checkbox 
              v-model="remember" 
              label="Lembrar-me" 
              color="primary" 
              hide-details 
              density="compact"
            ></v-checkbox>
            <a href="#" class="text-decoration-none text-body-2 font-weight-bold text-primary">Esqueceu a senha?</a>
          </div>

          <v-btn 
            block 
            color="#195FA0" 
            size="x-large" 
            type="submit" 
            class="text-capitalize font-weight-bold text-white mb-6"
            rounded="lg"
            elevation="2"
            :loading="loading"
          >
            Acessar Sistema
          </v-btn>
        </v-form>

        <div class="text-center text-body-2 text-grey-darken-1">
          Ainda não tem conta? 
          <a href="/register" class="text-primary font-weight-bold text-decoration-none">Cadastre sua empresa</a>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type AdminLoginDto from '@/Dtos/adm/adminLoginDto';
import { useAuthStore } from '@/stores/AuthStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();

const formLogin = ref<AdminLoginDto>({
  password: '',
  login: ''
});

const showPass = ref(false);
const remember = ref(false);
const loading = ref(false);

async function handleLogin() {
  loading.value = true;

  try {
    await authStore.login(formLogin.value);
    
    router.push("/visualizar");
  } catch (e) {
    alert("Usuário ou senha inválidos");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #195FA0 !important;
}

.circle-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.circle-1 {
  width: 600px;
  height: 600px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -50px;
  right: -50px;
}

.z-index-1 {
  z-index: 1;
}
</style>