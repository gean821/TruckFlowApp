<template>
  <v-container
    fluid
    class="pa-6 pb-12"
    style="min-height: 100vh; background-color: #EEF0F8; background-image: radial-gradient(#c8cde8 1px, transparent 1px); background-size: 24px 24px;"
  >
    <div
      class="mb-5 pa-6 rounded-xl"
      style="background: linear-gradient(135deg, #195FA0 0%, #0D3F6E 60%, #0A2E52 100%); box-shadow: 0 4px 24px rgba(25,95,160,0.35); position: relative; overflow: hidden;"
    >
      <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:rgba(255,255,255,0.05);border-radius:50%;pointer-events:none;" />
      <div style="position:absolute;bottom:-60px;right:120px;width:160px;height:160px;background:rgba(255,255,255,0.04);border-radius:50%;pointer-events:none;" />
      <div>
        <div class="d-flex align-center gap-2 mb-1">
          <v-icon color="white" size="18" style="opacity:0.7;">mdi-account-circle-outline</v-icon>
          <span class="text-caption text-white text-uppercase font-weight-medium" style="opacity:0.7; letter-spacing:0.08em;">Perfil</span>
        </div>
        <h1 class="text-h5 font-weight-bold text-white">Minha Conta</h1>
        <p class="text-body-2 mt-1" style="color: rgba(255,255,255,0.65);">
          Suas informações pessoais e dados da organização
        </p>
      </div>
    </div>

    <template v-if="isLoadingUser">
      <v-skeleton-loader type="card" rounded="xl" height="520" />
    </template>

    <template v-else>
      <v-card
        elevation="0"
        class="rounded-xl overflow-hidden"
        style="box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 4px 8px rgba(0,0,0,.04), 0 16px 40px rgba(0,0,0,.08);"
      >
        <div style="height: 180px; background: linear-gradient(135deg, #1e3a5f 0%, #195FA0 40%, #2980b9 100%); position: relative; overflow: hidden;">
          <div style="position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:rgba(255,255,255,0.06);border-radius:50%;pointer-events:none;" />
          <div style="position:absolute;bottom:-100px;left:35%;width:260px;height:260px;background:rgba(255,255,255,0.04);border-radius:50%;pointer-events:none;" />
          <div style="position:absolute;top:20px;left:-30px;width:140px;height:140px;background:rgba(255,255,255,0.03);border-radius:50%;pointer-events:none;" />
          <div style="position:absolute;bottom:16px;right:24px;opacity:0.12;">
            <v-icon size="96" color="white">mdi-account</v-icon>
          </div>
        </div>

        <div class="px-7" style="margin-top: -52px;">
          <v-avatar
            size="104"
            rounded="xl"
            style="border: 4px solid white; box-shadow: 0 4px 20px rgba(0,0,0,0.18); background: linear-gradient(135deg, #195FA0, #0A2E52);"
          >
            <v-img v-if="usuario?.photoUrl" :src="usuario.photoUrl" cover />
            <span v-else class="text-h3 font-weight-bold text-white">{{ iniciais }}</span>
          </v-avatar>
        </div>

        <div class="px-7 pt-3 pb-2">
          <div class="d-flex align-center flex-wrap mb-1" style="gap: 8px;">
            <span class="text-h5 font-weight-bold text-grey-darken-3">
              {{ usuario?.nomeReal || usuario?.username || authStore.user?.unique_name || '—' }}
            </span>
            <v-chip color="primary" variant="tonal" size="x-small" prepend-icon="mdi-shield-account-outline">
              {{ usuario?.role || authStore.user?.role || '—' }}
            </v-chip>
          </div>
          <div class="text-body-2 text-grey">{{ usuario?.email || authStore.user?.email || '—' }}</div>
        </div>

        <div class="px-7 pt-2 pb-5 d-flex flex-wrap align-center" style="gap: 8px;">
          <v-chip variant="tonal" color="blue-darken-1" size="small" prepend-icon="mdi-domain">
            {{ empresa?.nomeFantasia || empresa?.razaoSocial || '—' }}
          </v-chip>
          <v-chip variant="tonal" color="deep-purple-darken-1" size="small" prepend-icon="mdi-identifier">
            {{ empresa?.cnpj ? formatCnpj(empresa.cnpj) : '—' }}
          </v-chip>
          <v-chip variant="tonal" color="grey-darken-1" size="small" prepend-icon="mdi-calendar-outline">
            Membro desde {{ usuario?.createdAt ? formatDataCurta(usuario.createdAt) : '—' }}
          </v-chip>
        </div>

        <v-divider />

        <div class="d-flex flex-wrap px-7 py-5" style="gap: 0;">
          <div class="info-section" style="flex: 1; min-width: 200px;">
            <div class="d-flex align-center mb-2" style="gap: 8px;">
              <v-avatar color="blue-lighten-5" size="30" rounded="md">
                <v-icon color="#195FA0" size="15">mdi-email-outline</v-icon>
              </v-avatar>
              <span class="info-label">E-mail</span>
            </div>
            <div class="info-value pl-1">{{ usuario?.email || authStore.user?.email || '—' }}</div>
          </div>

          <v-divider vertical class="mx-6 d-none d-sm-block" />

          <div class="info-section" style="flex: 1; min-width: 160px;">
            <div class="d-flex align-center mb-2" style="gap: 8px;">
              <v-avatar color="purple-lighten-5" size="30" rounded="md">
                <v-icon color="#6A1B9A" size="15">mdi-shield-account-outline</v-icon>
              </v-avatar>
              <span class="info-label">Função</span>
            </div>
            <div class="info-value pl-1">{{ usuario?.role || authStore.user?.role || '—' }}</div>
          </div>

          <v-divider vertical class="mx-6 d-none d-sm-block" />

          <div class="info-section" style="flex: 1; min-width: 200px;">
            <div class="d-flex align-center mb-2" style="gap: 8px;">
              <v-avatar color="orange-lighten-5" size="30" rounded="md">
                <v-icon color="#E65100" size="15">mdi-domain</v-icon>
              </v-avatar>
              <span class="info-label">Empresa</span>
            </div>
            <div class="info-value pl-1">{{ empresa?.nomeFantasia || empresa?.razaoSocial || '—' }}</div>
          </div>
        </div>

        <v-divider />

        <div class="px-7 py-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">Informações da Conta</div>
            <v-btn
              v-if="!modoEdicao"
              variant="tonal"
              color="primary"
              size="small"
              prepend-icon="mdi-pencil-outline"
              style="text-transform: none; border-radius: 8px; font-weight: 600; letter-spacing: 0;"
              @click="entrarModoEdicao"
            >
              Editar
            </v-btn>
          </div>

          <template v-if="!modoEdicao">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="info-label mb-1">Usuário</div>
                <div class="info-value">{{ usuario?.username || authStore.user?.unique_name || '—' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-label mb-1">Telefone</div>
                <div class="info-value">{{ usuario?.telefone || '—' }}</div>
              </v-col>
            </v-row>
          </template>

          <template v-else>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">Usuário</div>
                <v-text-field
                  v-model="form.username"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-account-outline"
                  placeholder="Seu nome de usuário"
                  :error-messages="errors.username"
                  hide-details="auto"
                  style="border-radius: 10px;"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">Telefone / WhatsApp</div>
                <v-text-field
                  v-model="form.telefone"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-phone-outline"
                  placeholder="(11) 99999-9999"
                  :error-messages="errors.telefone"
                  hide-details="auto"
                  style="border-radius: 10px;"
                  @input="formatPhone"
                />
              </v-col>
            </v-row>
            <div class="d-flex mt-4" style="gap: 12px;">
              <v-btn
                variant="outlined"
                color="grey"
                style="text-transform: none; border-radius: 10px; font-weight: 600; letter-spacing: 0; height: 40px;"
                @click="cancelarEdicao"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="#195FA0"
                :loading="salvando"
                style="text-transform: none; border-radius: 10px; font-weight: 600; letter-spacing: 0; height: 40px; color: white;"
                @click="salvarInformacoes"
              >
                Salvar Alterações
              </v-btn>
            </div>
          </template>
        </div>

        <v-divider />

        <div class="px-7 py-6">
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-4">Dados Cadastrais</div>
          <v-row>
            <v-col cols="6" sm="3">
              <div class="info-label mb-1">CNPJ da Empresa</div>
              <div class="info-value">{{ empresa?.cnpj ? formatCnpj(empresa.cnpj) : '—' }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="info-label mb-1">Conta criada em</div>
              <div class="info-value">{{ usuario?.createdAt ? formatDataLonga(usuario.createdAt) : '—' }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="info-label mb-1">Última atualização</div>
              <div class="info-value">{{ usuario?.updatedAt ? formatDataLonga(usuario.updatedAt) : '—' }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="info-label mb-1">Empresa registrada em</div>
              <div class="info-value">{{ empresa?.createdAt ? formatDataLonga(empresa.createdAt) : '—' }}</div>
            </v-col>
          </v-row>
        </div>

        <v-divider />

        <div class="px-7 py-5">
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-4">Segurança</div>
          <div class="d-flex flex-wrap" style="gap: 12px;">
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-lock-reset"
              style="text-transform: none; border-radius: 10px; font-weight: 600; letter-spacing: 0;"
              @click="showAlterarSenha = true"
            >
              Alterar Senha
            </v-btn>
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-email-edit-outline"
              style="text-transform: none; border-radius: 10px; font-weight: 600; letter-spacing: 0;"
              @click="showAlterarEmail = true"
            >
              Alterar E-mail
            </v-btn>
          </div>
        </div>

        <AlterarSenhaModal v-model="showAlterarSenha" />
        <AlterarEmailModal v-model="showAlterarEmail" />
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/stores/AuthStore';
import { useUsuarioByIdQuery } from '@/queries/usuario.queries';
import { useEmpresaQuery } from '@/queries/empresa.queries';
import { useToastStore } from '@/stores/ToastStore';
import { AuthService } from '@/services/AuthService';
import AlterarSenhaModal from '@/components/modals/AlterarSenhaModal.vue';
import AlterarEmailModal from '@/components/modals/AlterarEmailModal.vue';

const authStore = useAuthStore();
const toast = useToastStore();

const showAlterarSenha = ref(false);
const showAlterarEmail = ref(false);
const modoEdicao = ref(false);
const salvando = ref(false);

const userId = computed(() => authStore.userId ?? null);
const { data: usuario, isLoading: isLoadingUser, refetch } = useUsuarioByIdQuery(userId);
const { data: empresa } = useEmpresaQuery();

const iniciais = computed(() => {
  const name = usuario.value?.nomeReal || usuario.value?.username || authStore.user?.unique_name || 'U';
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
});

const form = reactive({ username: '', telefone: '' });
const errors = reactive({ username: '', telefone: '' });

function entrarModoEdicao() {
  form.username = usuario.value?.username || authStore.user?.unique_name || '';
  form.telefone = usuario.value?.telefone || '';
  errors.username = '';
  errors.telefone = '';
  modoEdicao.value = true;
}

function cancelarEdicao() {
  modoEdicao.value = false;
}

function formatPhone() {
  const digits = form.telefone.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    form.telefone = digits
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    form.telefone = digits
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}

function validar() {
  errors.username = '';
  errors.telefone = '';
  let valid = true;

  if (!form.username.trim()) {
    errors.username = 'Usuário é obrigatório';
    valid = false;
  } else if (form.username.trim().length < 3) {
    errors.username = 'Usuário deve ter pelo menos 3 caracteres';
    valid = false;
  }

  const digits = form.telefone.replace(/\D/g, '');
  if (form.telefone && digits.length !== 10 && digits.length !== 11) {
    errors.telefone = 'Telefone inválido. Use DDD + número';
    valid = false;
  }

  return valid;
}

async function salvarInformacoes() {
  if (!validar()) return;

  salvando.value = true;
  try {
    await AuthService.atualizarPerfil({
      username: form.username.trim(),
      telefone: form.telefone.trim() || undefined,
    });

    authStore.updateUser({ unique_name: form.username.trim() });
    await refetch();
    modoEdicao.value = false;
    toast.notify('Informações atualizadas com sucesso!', 'success');
  } catch {
    toast.notify('Erro ao salvar. Tente novamente.', 'error');
  } finally {
    salvando.value = false;
  }
}

function formatDataLonga(dateStr: string) {
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

function formatDataCurta(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateStr;
  }
}

function formatCnpj(cnpj: string) {
  const d = cnpj.replace(/\D/g, '');
  if (d.length !== 14) return cnpj;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}
</script>

<style scoped>
.info-label {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9e9e9e;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #212121;
}

.info-section {
  padding: 4px 0;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}
</style>
