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
            <div :style="styles.modalTitle">Esqueci minha senha</div>
            <div :style="styles.modalSubtitle">{{ subtitulo }}</div>
          </div>
          <v-btn icon="mdi-close" variant="text" density="comfortable" :style="styles.closeBtn" @click="closeModal" />
        </div>
      </div>

      <v-card-text :style="styles.cardText">
        <template v-if="etapa === 1">
          <div :style="styles.infoBox">
            <v-icon size="40" color="#195FA0">mdi-lock-reset</v-icon>
            <div :style="styles.infoTitle">Redefinir senha</div>
            <div :style="styles.infoText">
              Informe o e-mail da sua conta. Enviaremos um código de 6 dígitos para redefinir sua senha.
            </div>
          </div>
          <div :style="styles.fieldWrapper">
            <label :style="styles.fieldLabel">E-mail</label>
            <v-text-field
              v-model="form.email"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-email-outline"
              placeholder="seu@email.com"
              type="email"
              :error-messages="errors.email"
              hide-details="auto"
              :style="styles.modernField"
              @keyup.enter="handleEnviarCodigo"
            />
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
            Se o e-mail <strong>{{ form.email }}</strong> estiver cadastrado, um código foi enviado. Verifique sua caixa de entrada.
          </div>
          <div :style="styles.fieldGroup">
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
              />
            </div>
            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">Nova senha</label>
              <v-text-field
                v-model="form.novaSenha"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Digite a nova senha"
                :error-messages="errors.novaSenha"
                hide-details="auto"
                :style="styles.modernField"
                @click:append-inner="showPassword = !showPassword"
              />
            </div>
            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">Confirmar nova senha</label>
              <v-text-field
                v-model="form.confirmarSenha"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Confirme a nova senha"
                :error-messages="errors.confirmarSenha"
                hide-details="auto"
                :style="styles.modernField"
                :disabled="!form.novaSenha"
              />
            </div>
            <div v-if="form.novaSenha" :style="styles.passwordHints">
              <div :style="{ ...styles.hintItem, ...(form.novaSenha.length >= 6 ? styles.hintActive : {}) }">
                <v-icon size="13">{{ form.novaSenha.length >= 6 ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Mínimo 6 caracteres
              </div>
              <div :style="{ ...styles.hintItem, ...(/[A-Z]/.test(form.novaSenha) ? styles.hintActive : {}) }">
                <v-icon size="13">{{ /[A-Z]/.test(form.novaSenha) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Letra maiúscula
              </div>
              <div :style="{ ...styles.hintItem, ...(/\d/.test(form.novaSenha) ? styles.hintActive : {}) }">
                <v-icon size="13">{{ /\d/.test(form.novaSenha) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Número
              </div>
              <div :style="{ ...styles.hintItem, ...(/[^A-Za-z0-9]/.test(form.novaSenha) ? styles.hintActive : {}) }">
                <v-icon size="13">{{ /[^A-Za-z0-9]/.test(form.novaSenha) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Caractere especial
              </div>
            </div>
          </div>
          <div :style="styles.actionRow">
            <v-btn variant="outlined" color="grey" :style="styles.actionBtn" @click="etapa = 1">
              Voltar
            </v-btn>
            <v-btn
              color="#195FA0"
              :loading="isRedefinindo"
              :style="{ ...styles.actionBtn, ...styles.saveBtn }"
              @click="handleRedefinirSenha"
            >
              Redefinir senha
            </v-btn>
          </div>
          <v-btn block variant="text" color="grey" :style="styles.linkBtn" :disabled="isEnviando" @click="handleReenviar">
            Reenviar código
          </v-btn>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { AuthService } from '@/services/AuthService';
import { useToastStore } from '@/stores/ToastStore';
import type RedefinirSenhaDto from '@/Dtos/auth/RedefinirSenhaDto';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const toast = useToastStore();

const etapa = ref(1);
const showPassword = ref(false);

const form = reactive({ email: '', codigo: '', novaSenha: '', confirmarSenha: '' });
const errors = reactive({ email: '', codigo: '', novaSenha: '', confirmarSenha: '' });

const subtitulo = computed(() => {
  if (etapa.value === 1) return 'Informe seu e-mail para receber o código';
  return 'Digite o código e crie sua nova senha';
});

watch(() => props.modelValue, (isOpen) => { if (isOpen) resetState(); });

function resetState() {
  etapa.value = 1;
  showPassword.value = false;
  form.email = '';
  form.codigo = '';
  form.novaSenha = '';
  form.confirmarSenha = '';
  errors.email = '';
  errors.codigo = '';
  errors.novaSenha = '';
  errors.confirmarSenha = '';
}

function closeModal() { emit('update:modelValue', false); }

const enviarMutation = useMutation({
  mutationFn: (email: string) => AuthService.esqueciSenha(email),
  onError: () => toast.notify('Erro ao enviar o código. Tente novamente.', 'error'),
});

const redefinirMutation = useMutation({
  mutationFn: (dto: RedefinirSenhaDto) => AuthService.redefinirSenha(dto),
  onSuccess: () => {
    toast.notify('Senha redefinida com sucesso! Faça login.', 'success');
    closeModal();
  },
  onError: () => toast.notify('Código inválido ou expirado.', 'error'),
});

const isEnviando = enviarMutation.isPending;
const isRedefinindo = redefinirMutation.isPending;

async function handleEnviarCodigo() {
  errors.email = '';
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Informe um e-mail válido';
    return;
  }
  try {
    await enviarMutation.mutateAsync(form.email);
    etapa.value = 2;
  } catch { /* tratado pelo onError */ }
}

async function handleReenviar() {
  form.codigo = '';
  try {
    await enviarMutation.mutateAsync(form.email);
    toast.notify('Código reenviado.', 'success');
  } catch { /* tratado pelo onError */ }
}

function validarEtapa2() {
  errors.codigo = '';
  errors.novaSenha = '';
  errors.confirmarSenha = '';
  let valid = true;
  if (form.codigo.length !== 6) { errors.codigo = 'Digite os 6 dígitos do código'; valid = false; }
  if (!form.novaSenha) { errors.novaSenha = 'Nova senha é obrigatória'; valid = false; }
  else if (!isValidPassword(form.novaSenha)) { errors.novaSenha = 'Senha não atende aos requisitos'; valid = false; }
  if (!form.confirmarSenha) { errors.confirmarSenha = 'Confirme a nova senha'; valid = false; }
  else if (form.novaSenha !== form.confirmarSenha) { errors.confirmarSenha = 'As senhas não coincidem'; valid = false; }
  return valid;
}

function isValidPassword(value: string) {
  return value.length >= 6 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
}

async function handleRedefinirSenha() {
  if (!validarEtapa2()) return;
  try {
    await redefinirMutation.mutateAsync({
      email: form.email,
      codigo: form.codigo,
      novaSenha: form.novaSenha,
      confirmarSenha: form.confirmarSenha,
    });
  } catch { /* tratado pelo onError */ }
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
    gap: '12px', padding: '24px 16px', background: '#F0F6FF', borderRadius: '14px', marginBottom: '20px',
  },
  infoTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a1a' },
  infoText: { fontSize: '0.85rem', color: '#555', lineHeight: '1.5' },
  infoText2: { fontSize: '0.85rem', color: '#555', lineHeight: '1.5', marginBottom: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  fieldWrapper: { display: 'flex', flexDirection: 'column' as const, gap: '4px', marginBottom: '12px' },
  fieldLabel: { fontSize: '0.78rem', fontWeight: '600', color: '#374151' },
  modernField: { borderRadius: '10px', fontSize: '0.9rem' },
  passwordHints: {
    display: 'flex', flexWrap: 'wrap' as const, gap: '6px', columnGap: '16px',
    padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5E7EB', marginBottom: '12px',
  },
  hintItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#9CA3AF', transition: 'color 0.2s' },
  hintActive: { color: '#16A34A' },
  primaryBtn: { borderRadius: '10px', fontWeight: '600', textTransform: 'none' as const, letterSpacing: '0', height: '42px', color: 'white', marginBottom: '8px' },
  secondaryBtn: { borderRadius: '10px', fontWeight: '600', textTransform: 'none' as const, letterSpacing: '0', height: '42px' },
  linkBtn: { textTransform: 'none' as const, letterSpacing: '0', fontSize: '0.82rem', marginTop: '4px' },
  actionRow: { display: 'flex', gap: '12px', marginTop: '4px', marginBottom: '8px' },
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
