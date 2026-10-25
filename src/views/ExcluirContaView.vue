<template>
  <v-container class="py-12" style="max-width: 560px">
    <v-card rounded="xl" elevation="2" class="pa-6">
      <h1 class="text-h5 font-weight-bold mb-2">Excluir conta do TruckFlow Motorista</h1>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Você também pode excluir pelo app, em Perfil &gt; "Excluir minha conta". Se não tem mais o app instalado,
        entre com seu usuário e senha abaixo.
      </p>

      <v-alert type="info" variant="tonal" density="compact" class="mb-6 text-body-2">
        Serão apagados: nome, telefone, e-mail, usuário, veículos cadastrados e sessões ativas.
        Agendamentos e notas fiscais já registrados ficam guardados pela fábrica por obrigação legal (fiscal),
        sem vínculo com seus dados pessoais.
      </v-alert>

      <v-alert v-if="concluido" type="success" variant="tonal" class="mb-2">
        Conta excluída. Seus dados pessoais foram removidos.
      </v-alert>

      <v-form v-else ref="form" @submit.prevent="excluir">
        <v-text-field
          v-model="login"
          label="Usuário ou e-mail"
          autocomplete="username"
          :rules="[obrigatorio]"
          variant="outlined"
          class="mb-2"
        />
        <v-text-field
          v-model="senha"
          label="Senha"
          type="password"
          autocomplete="current-password"
          :rules="[obrigatorio]"
          variant="outlined"
          class="mb-2"
        />
        <v-checkbox
          v-model="confirmado"
          label="Entendo que essa ação não pode ser desfeita"
          density="compact"
          hide-details
          class="mb-4"
        />
        <v-alert v-if="erro" type="error" variant="tonal" density="compact" class="mb-4">{{ erro }}</v-alert>
        <v-btn
          type="submit"
          color="error"
          block
          size="large"
          :loading="enviando"
          :disabled="!confirmado"
        >
          Excluir minha conta
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import axios, { AxiosError } from "axios";
import { ref } from "vue";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const login = ref("");
const senha = ref("");
const confirmado = ref(false);
const enviando = ref(false);
const concluido = ref(false);
const erro = ref<string | null>(null);
const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);

const obrigatorio = (v: string) => !!v?.trim() || "Obrigatório";

async function excluir() {
  if (!(await form.value?.validate())?.valid) {
    return;
  }

  enviando.value = true;
  erro.value = null;

  try {
    const { data } = await api.post<{ token: string }>("/AuthMotorista/login", {
      login: login.value.trim(),
      password: senha.value,
    });

    await api.delete("/AuthMotorista/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    concluido.value = true;
  } catch (e) {
    const resposta = (e as AxiosError<{ message?: string }>).response;
    erro.value =
      resposta?.status === 429
        ? "Muitas tentativas. Aguarde alguns minutos e tente de novo."
        : resposta?.status === 401
          ? "Usuário ou senha inválidos."
          : resposta?.data?.message ?? "Não foi possível excluir agora. Tente novamente.";
  } finally {
    enviando.value = false;
    senha.value = "";
  }
}
</script>
