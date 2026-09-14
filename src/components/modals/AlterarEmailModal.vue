<template>
  <v-dialog
    :model-value="modelValue"
    max-width="480"
    width="95vw"
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card :style="styles.modalCard" elevation="0">
      <div :style="styles.modalHeader">
        <div :style="styles.headerTop">
          <div>
            <div :style="styles.modalTitle">Alterar E-mail</div>
            <div :style="styles.modalSubtitle">{{ subtitulo }}</div>
          </div>
          <v-btn icon="mdi-close" variant="text" density="comfortable" :style="styles.closeBtn" @click="closeModal" />
        </div>
      </div>

      <v-card-text :style="styles.cardText">
        <template v-if="etapa === 1">
          <div :style="styles.infoBox">
            <v-icon size="40" color="#195FA0">mdi-email-edit-outline</v-icon>
            <div :style="styles.infoTitle">Verificação por e-mail</div>
            <div :style="styles.infoText">
              Enviaremos um código de 6 dígitos para <strong>{{ emailAtual }}</strong>.<br />
              O código expira em 15 minutos.
            </div>
          </div>
          <v-btn block color="#195FA0" :loading="isEnviando" :style="styles.primaryBtn" @click="handleEnviarCodigo">
            Enviar código
          </v-btn>
          <v-btn block variant="outlined" color="grey" :style="styles.secondaryBtn" @click="closeModal">
            Cancelar
          </v-btn>
        </template>

        <template v-else-if="etapa === 2">
          <div :style="styles.infoText2">
            Digite o código enviado para <strong>{{ emailAtual }}</strong>.
          </div>
          <div :style="styles.fieldWrapper">
            <label :style="styles.fieldLabel">Código de verificação</label>
            <v-text-field
              v-model="form.codigo"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-shield-key-outline"
              placeholder="000000"
              maxlength="6"
              :error-messages="errors.codigo"
              hide-details="auto"
              :style="styles.modernField"
              @keyup.enter="handleVerificarCodigo"
            />
          </div>
          <v-btn
            block
            color="#195FA0"
            :loading="isVerificando"
            :disabled="form.codigo.length !== 6"
            :style="styles.primaryBtn"
            @click="handleVerificarCodigo"
          >
            Verificar
          </v-btn>
          <v-btn block variant="text" color="grey" :style="styles.linkBtn" :disabled="isEnviando" @click="handleReenviar">
            Reenviar código
          </v-btn>
        </template>

        <template v-else-if="etapa === 3">
          <div :style="styles.fieldWrapper">
            <label :style="styles.fieldLabel">Novo e-mail</label>
            <v-text-field
              v-model="form.novoEmail"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-email-outline"
              placeholder="novo@email.com"
              type="email"
              :error-messages="errors.novoEmail"
              hide-details="auto"
              :style="styles.modernField"
            />
          </div>
          <div :style="styles.actionRow">
            <v-btn variant="outlined" color="grey" :style="styles.actionBtn" @click="closeModal">
              Cancelar
            </v-btn>
            <v-btn
              color="#195FA0"
              :loading="isAlterandoEmail"
              :style="{ ...styles.actionBtn, ...styles.saveBtn }"
              @click="handleAlterarEmail"
            >
              Alterar E-mail
            </v-btn>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useVerificacaoEmail } from '@/hooks/useVerificacaoEmail';
import { FinalidadeVerificacaoEmail } from '@/enums/FinalidadeVerificacaoEmail';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const authStore = useAuthStore();
const { enviarCodigo, verificarCodigo, alterarEmail, reset, isEnviando, isVerificando, isAlterandoEmail, codigoToken } = useVerificacaoEmail();

const etapa = ref(1);
const emailAtual = computed(() => authStore.user?.email || '');

const subtitulo = computed(() => {
  if (etapa.value === 1) return 'Confirme sua identidade por e-mail';
  if (etapa.value === 2) return 'Digite o código enviado';
  return 'Informe o novo e-mail';
});

const form = reactive({ codigo: '', novoEmail: '' });
const errors = reactive({ codigo: '', novoEmail: '' });

watch(() => props.modelValue, (isOpen) => { if (isOpen) resetState(); });

function resetState() {
  etapa.value = 1;
  form.codigo = '';
  form.novoEmail = '';
  errors.codigo = '';
  errors.novoEmail = '';
  reset();
}

function closeModal() { emit('update:modelValue', false); }

async function handleEnviarCodigo() {
  try {
    await enviarCodigo({ finalidade: FinalidadeVerificacaoEmail.AlterarEmail });
    etapa.value = 2;
  } catch { /* toast já exibido pelo hook */ }
}

async function handleReenviar() {
  form.codigo = '';
  try {
    await enviarCodigo({ finalidade: FinalidadeVerificacaoEmail.AlterarEmail });
  } catch { /* toast já exibido pelo hook */ }
}

async function handleVerificarCodigo() {
  errors.codigo = '';
  if (form.codigo.length !== 6) {
    errors.codigo = 'Digite os 6 dígitos do código';
    return;
  }
  try {
    await verificarCodigo({ codigo: form.codigo, finalidade: FinalidadeVerificacaoEmail.AlterarEmail });
    etapa.value = 3;
  } catch { /* toast já exibido pelo hook */ }
}

function validarEmail() {
  errors.novoEmail = '';
  if (!form.novoEmail.trim()) { errors.novoEmail = 'Novo e-mail é obrigatório'; return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.novoEmail)) { errors.novoEmail = 'E-mail inválido'; return false; }
  if (form.novoEmail.trim() === emailAtual.value) { errors.novoEmail = 'O novo e-mail deve ser diferente do atual'; return false; }
  return true;
}

async function handleAlterarEmail() {
  if (!validarEmail() || !codigoToken.value) return;
  try {
    await alterarEmail({ codigoToken: codigoToken.value, novoEmail: form.novoEmail.trim() });
    closeModal();
  } catch { /* toast já exibido pelo hook */ }
}

const styles = {
  modalCard: { borderRadius: '20px', overflow: 'hidden' },
  modalHeader: { background: 'linear-gradient(135deg, rgb(24,103,192) 0%, rgb(13,63,110) 100%)', padding: '28px 32px 24px' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '700', color: 'white', letterSpacing: '-0.3px' },
  modalSubtitle: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' },
  closeBtn: { color: 'rgba(255,255,255,0.8)' },
  cardText: { padding: '24px 32px 32px' },
  infoBox: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', textAlign: 'center' as const,
    gap: '12px', padding: '24px 16px', background: '#F0F6FF', borderRadius: '14px', marginBottom: '20px'
  },
  infoTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a1a' },
  infoText: { fontSize: '0.85rem', color: '#555', lineHeight: '1.5' },
  infoText2: { fontSize: '0.85rem', color: '#555', lineHeight: '1.5', marginBottom: '16px' },
  fieldWrapper: { display: 'flex', flexDirection: 'column' as const, gap: '4px', marginBottom: '12px' },
  fieldLabel: { fontSize: '0.78rem', fontWeight: '600', color: '#374151' },
  modernField: { borderRadius: '10px', fontSize: '0.9rem' },
  primaryBtn: { borderRadius: '10px', fontWeight: '600', textTransform: 'none' as const, letterSpacing: '0', height: '42px', color: 'white', marginBottom: '8px' },
  secondaryBtn: { borderRadius: '10px', fontWeight: '600', textTransform: 'none' as const, letterSpacing: '0', height: '42px' },
  linkBtn: { textTransform: 'none' as const, letterSpacing: '0', fontSize: '0.82rem', marginTop: '4px' },
  actionRow: { display: 'flex', gap: '12px', marginTop: '20px' },
  actionBtn: { flex: 1, borderRadius: '10px', fontWeight: '600', textTransform: 'none' as const, letterSpacing: '0', height: '42px' },
  saveBtn: { color: 'white' },
};
</script>

<style scoped>
@media (max-width: 600px) {
  :deep(.v-dialog) { margin: 12px; }
  :deep(.v-card) { max-height: 92vh !important; }
  :deep(.v-card-text) { padding: 16px !important; max-height: calc(92vh - 130px) !important; overflow-y: auto !important; }
}
</style>
