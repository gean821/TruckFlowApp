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
      <div class="d-flex flex-wrap justify-space-between align-center gap-4">
        <div>
          <div class="d-flex align-center gap-2 mb-1">
            <v-icon color="white" size="18" style="opacity:0.7;">mdi-domain</v-icon>
            <span class="text-caption text-white text-uppercase font-weight-medium" style="opacity:0.7; letter-spacing:0.08em;">Administração</span>
          </div>
          <h1 class="text-h5 font-weight-bold text-white">Dados da Empresa</h1>
          <p class="text-body-2 mt-1" style="color: rgba(255,255,255,0.65);">
            Gerencie as informações cadastrais da sua organização
          </p>
        </div>
        <div class="d-flex align-center" style="gap: 12px;">
          <template v-if="editMode">
            <v-btn variant="tonal" color="white" height="38" class="text-capitalize font-weight-medium px-4" rounded="lg" elevation="0" style="color:rgba(255,255,255,0.9);" :disabled="isUpdating" @click="cancelEdit">
              Cancelar
            </v-btn>
            <v-btn color="white" prepend-icon="mdi-content-save" height="38" class="text-capitalize font-weight-bold px-5" rounded="lg" elevation="0" style="color:#195FA0;" :loading="isUpdating" @click="salvar">
              Salvar Alterações
            </v-btn>
          </template>
          <v-btn v-else color="white" prepend-icon="mdi-pencil-outline" height="38" class="text-capitalize font-weight-bold px-5" rounded="lg" elevation="0" style="color:#195FA0;" :disabled="isLoading" @click="startEdit">
            Editar Dados
          </v-btn>
        </div>
      </div>
    </div>

    <template v-if="isLoading">
      <v-skeleton-loader type="card" rounded="xl" height="520" />
    </template>

    <template v-else>
      <v-alert v-if="isError" type="error" variant="tonal" rounded="xl" class="mb-4" prepend-icon="mdi-alert-circle-outline">
        Não foi possível carregar os dados da empresa.
      </v-alert>

      <v-card elevation="0" class="rounded-xl overflow-hidden" style="box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 4px 8px rgba(0,0,0,.04), 0 16px 40px rgba(0,0,0,.08);">

        <div style="height: 180px; background: linear-gradient(135deg, #1e3a5f 0%, #195FA0 40%, #2980b9 100%); position: relative; overflow: hidden;">
          <div style="position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:rgba(255,255,255,0.06);border-radius:50%;pointer-events:none;" />
          <div style="position:absolute;bottom:-100px;left:35%;width:260px;height:260px;background:rgba(255,255,255,0.04);border-radius:50%;pointer-events:none;" />
          <div style="position:absolute;top:20px;left:-30px;width:140px;height:140px;background:rgba(255,255,255,0.03);border-radius:50%;pointer-events:none;" />
          <div style="position:absolute;bottom:16px;right:24px;opacity:0.12;">
            <v-icon size="96" color="white">mdi-domain</v-icon>
          </div>
        </div>

        <div class="px-7" style="margin-top: -52px;">
          <v-avatar
            size="104"
            rounded="xl"
            style="border: 4px solid white; box-shadow: 0 4px 20px rgba(0,0,0,0.18); background: linear-gradient(135deg, #195FA0, #0A2E52);"
          >
            <span class="text-h3 font-weight-bold text-white">{{ iniciais }}</span>
          </v-avatar>
        </div>

        <div class="px-7 pt-3 pb-2">
          <div class="d-flex align-center flex-wrap mb-1" style="gap: 8px;">
            <span class="text-h5 font-weight-bold text-grey-darken-3">
              {{ empresa?.nomeFantasia || empresa?.razaoSocial || '—' }}
            </span>
            <v-chip
              :color="empresa?.ativa ? 'success' : 'error'"
              variant="tonal"
              size="x-small"
              :prepend-icon="empresa?.ativa ? 'mdi-check-circle' : 'mdi-close-circle'"
            >
              {{ empresa?.ativa ? 'Ativa' : 'Inativa' }}
            </v-chip>
          </div>
          <div class="text-body-2 text-grey">{{ empresa?.razaoSocial }}</div>
        </div>

        <div class="px-7 pt-3 pb-5 d-flex flex-wrap align-center" style="gap: 8px;">
          <v-chip variant="tonal" color="blue-darken-1" size="small" prepend-icon="mdi-identifier">
            {{ empresa?.cnpj ? formatCnpj(empresa.cnpj) : '—' }}
          </v-chip>
          <v-chip variant="tonal" color="grey-darken-1" size="small" prepend-icon="mdi-calendar-outline">
            Membro desde {{ empresa?.createdAt ? formatData(empresa.createdAt) : '—' }}
          </v-chip>
        </div>

        <v-divider />

        <template v-if="!editMode">

          <div class="d-flex flex-wrap px-7 py-5" style="gap: 0;">
            <div class="info-section" style="flex: 1; min-width: 200px;">
              <div class="d-flex align-center mb-2" style="gap: 8px;">
                <v-avatar color="blue-lighten-5" size="30" rounded="md">
                  <v-icon color="#195FA0" size="15">mdi-email-outline</v-icon>
                </v-avatar>
                <span class="info-label">E-mail</span>
              </div>
              <div class="info-value pl-1">{{ empresa?.email || '—' }}</div>
            </div>

            <v-divider vertical class="mx-6 d-none d-sm-block" />

            <div class="info-section" style="flex: 1; min-width: 160px;">
              <div class="d-flex align-center mb-2" style="gap: 8px;">
                <v-avatar color="green-lighten-5" size="30" rounded="md">
                  <v-icon color="#2E7D32" size="15">mdi-phone-outline</v-icon>
                </v-avatar>
                <span class="info-label">Telefone</span>
              </div>
              <div class="info-value pl-1">{{ empresa?.telefone ? formatTelefone(empresa.telefone) : '—' }}</div>
            </div>

            <v-divider vertical class="mx-6 d-none d-sm-block" />

            <div class="info-section" style="flex: 1; min-width: 200px;">
              <div class="d-flex align-center mb-2" style="gap: 8px;">
                <v-avatar color="purple-lighten-5" size="30" rounded="md">
                  <v-icon color="#6A1B9A" size="15">mdi-map-marker-outline</v-icon>
                </v-avatar>
                <span class="info-label">Localização</span>
              </div>
              <div class="info-value pl-1">{{ empresa?.cidade && empresa?.estado ? `${empresa.cidade} — ${empresa.estado}` : '—' }}</div>
            </div>
          </div>

          <v-divider />

          <div class="px-7 py-6">
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-4">Endereço Completo</div>
            <div class="info-value mb-5" style="font-size: 0.95rem;">{{ enderecoCompleto }}</div>
            <v-row>
              <v-col cols="6" sm="3">
                <div class="info-label mb-1">CEP</div>
                <div class="info-value">{{ empresa?.cep ? formatCep(empresa.cep) : '—' }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label mb-1">Bairro</div>
                <div class="info-value">{{ empresa?.bairro || '—' }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label mb-1">Cidade</div>
                <div class="info-value">{{ empresa?.cidade || '—' }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label mb-1">Estado</div>
                <div class="info-value">{{ empresa?.estado || '—' }}</div>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-else>
          <div class="px-7 py-6">

            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-4">Identificação</div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.razaoSocial" label="Razão Social" variant="outlined" density="compact" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.nomeFantasia" label="Nome Fantasia" variant="outlined" density="compact" hide-details="auto" />
              </v-col>
            </v-row>

            <v-divider class="my-6" />

            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-4">Contato</div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.email" label="E-mail" type="email" variant="outlined" density="compact" hide-details="auto" prepend-inner-icon="mdi-email-outline" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.telefone" label="Telefone" variant="outlined" density="compact" hide-details="auto" prepend-inner-icon="mdi-phone-outline" />
              </v-col>
            </v-row>

            <v-divider class="my-6" />

            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-4">Endereço</div>
            <v-row>
              <v-col cols="12" sm="3">
                <v-text-field v-model="form.cep" label="CEP" variant="outlined" density="compact" hide-details="auto" :loading="loadingCep" @blur="buscarCep" />
              </v-col>
              <v-col cols="12" sm="7">
                <v-text-field v-model="form.logradouro" label="Logradouro" variant="outlined" density="compact" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="2">
                <v-text-field v-model="form.numero" label="Número" variant="outlined" density="compact" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.complemento" label="Complemento" variant="outlined" density="compact" hide-details="auto" placeholder="Opcional" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.bairro" label="Bairro" variant="outlined" density="compact" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="form.cidade" label="Cidade" variant="outlined" density="compact" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="1">
                <v-text-field v-model="form.estado" label="UF" variant="outlined" density="compact" hide-details="auto" maxlength="2" />
              </v-col>
            </v-row>
          </div>
        </template>

      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useEmpresaQuery } from "@/queries/empresa.queries";
import { useEmpresa } from "@/hooks/useEmpresa";
import type { EmpresaUpdateDto } from "@/Dtos/empresa/empresaDto";
import { fetchAddressByCep } from "@/shared/services/adress.service";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const { data: empresa, isLoading, isError } = useEmpresaQuery();
const { update, isUpdating } = useEmpresa();

const editMode = ref(false);
const loadingCep = ref(false);
const form = ref<EmpresaUpdateDto>({});

watch(
  [empresa, isLoading],
  ([data, loading]) => {
    if (!loading && !data) editMode.value = true;
  },
  { immediate: true }
);

const iniciais = computed(() => {
  const nome = empresa.value?.nomeFantasia || empresa.value?.razaoSocial || "??";
  return nome.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
});

function startEdit() {
  form.value = {
    razaoSocial: empresa.value?.razaoSocial ?? "",
    nomeFantasia: empresa.value?.nomeFantasia ?? "",
    email: empresa.value?.email ?? "",
    telefone: empresa.value?.telefone ?? "",
    cep: empresa.value?.cep ?? "",
    logradouro: empresa.value?.logradouro ?? "",
    numero: empresa.value?.numero ?? "",
    complemento: empresa.value?.complemento ?? "",
    bairro: empresa.value?.bairro ?? "",
    cidade: empresa.value?.cidade ?? "",
    estado: empresa.value?.estado ?? "",
  };
  editMode.value = true;
}

function cancelEdit() {
  editMode.value = false;
  form.value = {};
}

async function salvar() {
  const payload: EmpresaUpdateDto = { ...form.value };
  if (payload.complemento === "") payload.complemento = null;
  await update(payload);
  editMode.value = false;
}

async function buscarCep() {
  const cep = form.value.cep?.replace(/\D/g, "") ?? "";
  if (cep.length !== 8) return;
  loadingCep.value = true;
  try {
    const address = await fetchAddressByCep(cep);
    if (address) {
      form.value.logradouro = address.logradouro;
      form.value.bairro = address.bairro;
      form.value.cidade = address.localidade;
      form.value.estado = address.uf;
    }
  } finally {
    loadingCep.value = false;
  }
}

const enderecoCompleto = computed(() => {
  if (!empresa.value) return "—";
  const { logradouro, numero, complemento, bairro, cidade, estado } = empresa.value;
  const partes = [logradouro, numero ? `nº ${numero}` : null, complemento || null, bairro, cidade, estado].filter(Boolean);
  return partes.length > 0 ? partes.join(", ") : "—";
});

function formatCnpj(cnpj: string) {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14) return cnpj;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function formatCep(cep: string) {
  const d = cep.replace(/\D/g, "");
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep;
}

function formatTelefone(tel: string) {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

function formatData(dateStr: string) {
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
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
</style>
