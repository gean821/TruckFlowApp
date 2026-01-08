<template>
  <v-row no-gutters class="fill-height">
    
    <v-col cols="12" md="6" lg="7" class="bg-primary d-none d-md-flex flex-column align-center justify-center position-relative overflow-hidden">
      <div class="circle-decoration circle-1"></div>
      <div class="circle-decoration circle-2"></div>
      
      <div class="z-index-1 text-center px-10">
        <v-icon size="80" color="white" icon="mdi-office-building-cog" class="mb-6"></v-icon>
        <h2 class="text-h3 font-weight-bold text-white mb-4">Comece agora</h2>
        <p class="text-h6 text-blue-lighten-4 font-weight-regular max-width-500 mx-auto">
          Junte-se a centenas de empresas que reduziram o tempo de fila em até 40% com o TruckFlow.
        </p>
      </div>
    </v-col>

    <v-col cols="12" md="6" lg="5" class="d-flex flex-column bg-white fill-height">

      <div class="pa-6">
        <v-btn 
          variant="text" 
          color="grey-darken-2" 
          prepend-icon="mdi-arrow-left"
          class="text-capitalize font-weight-bold"
          @click="goBack"
        >
          Voltar ao Início
        </v-btn>
      </div>

      <v-container class="flex-grow-1 d-flex align-center justify-center px-8 px-md-16 pb-16">
        <div class="w-100">
          
          <div class="mb-8">
            <h3 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">Criar conta corporativa</h3>
            <p class="text-body-1 text-grey">Preencha os dados abaixo para configurar seu ambiente administrativo.</p>
          </div>

          <v-form ref="formRef" @submit.prevent="handleRegister">
            
            <v-text-field
              v-model="form.nomeReal"
              label="Nome Completo ou Razão Social"
              variant="outlined"
              prepend-inner-icon="mdi-account-outline"
              color="primary"
              class="mb-2"
              rounded="lg"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.username"
              label="Usuario ex: teste.teste"
              variant="outlined"
              prepend-inner-icon="mdi-account-outline"
              color="primary"
              class="mb-2"
              rounded="lg"
              :rules="[rules.required]"
            ></v-text-field>


            <v-text-field
              v-model="form.email"
              label="E-mail Corporativo"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
              color="primary"
              class="mb-2"
              rounded="lg"
              type="email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>

            <v-text-field
              v-model="form.telefone"
              label="Telefone / WhatsApp"
              variant="outlined"
              prepend-inner-icon="mdi-phone-outline"
              color="primary"
              class="mb-2"
              rounded="lg"
              placeholder="(00) 00000-0000"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              label="Senha"
              variant="outlined"
              prepend-inner-icon="mdi-lock-outline"
              :type="showPass ? 'text' : 'password'"
              :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPass = !showPass"
              color="primary"
              class="mb-2"
              rounded="lg"
              :rules="[rules.required, rules.min]"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              label="Confirmar Senha"
              variant="outlined"
              prepend-inner-icon="mdi-lock-check-outline"
              type="password"
              color="primary"
              class="mb-4"
              rounded="lg"
              :rules="[rules.required, rules.match]"
            ></v-text-field>

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
              Finalizar Cadastro
            </v-btn>
          </v-form>

          <div class="text-center text-caption text-grey">
            Ao se cadastrar, você concorda com nossos <a href="#" class="text-primary text-decoration-none">Termos de Uso</a>.
          </div>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type AdminRegisterDto from '@/Dtos/adm/adminRegisterDto';
import { AuthService } from '@/services/AuthService';
import { useAuthStore } from '@/stores/AuthStore';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const formRef = ref<any>(null);
const loading = ref(false);
const showPass = ref(false);

const form = reactive<AdminRegisterDto>({
  username: '',
  nomeReal: '',
  email: '',
  telefone: '',
  password: '',
});

const confirmPassword = ref('');

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  min: (v: string) => v.length >= 6 || 'Mínimo de 6 caracteres',
  match: (v: string) => v === form.password || 'As senhas não conferem'
};

function goBack() {
  router.back();
}

async function handleRegister() {
  const { valid } = await formRef.value.validate();
  
  if (valid) {
    loading.value = true;
    
    try {

      await AuthService.register({
        username: form.username,
        nomeReal: form.nomeReal,
        email: form.email,
        telefone: form.telefone,
        password: form.password,
      });

      router.push('/login'); 
    } catch (error) {
      console.error(error);
      throw error;
    } finally {    //adicionar snackbars ou alert para usuario.
      loading.value = false;
    }
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