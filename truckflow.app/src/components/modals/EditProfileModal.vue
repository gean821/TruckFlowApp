<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="modal-card" elevation="0">

      <div class="modal-header px-8 pt-8 pb-6">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="modal-title">Meu Perfil</div>
            <div class="modal-subtitle">Edite suas informações pessoais</div>
          </div>
          <v-btn icon="mdi-close" variant="text" density="comfortable" class="close-btn" @click="closeModal" />
        </div>

        <div class="d-flex align-center ga-4 mt-6">
          <div class="avatar-wrapper" @click="triggerFileInput">
            <v-avatar size="72" class="profile-avatar">
              <v-img v-if="previewPhotoUrl || photoUrl" :src="previewPhotoUrl || photoUrl" cover />
              <span v-else class="avatar-initials">{{ initials }}</span>
            </v-avatar>
            <div class="avatar-overlay">
              <v-icon size="18" color="white">mdi-camera</v-icon>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
          </div>
          <div>
            <div class="user-name">{{ form.username || 'Usuário' }}</div>
            <div class="user-email">{{ form.email || '' }}</div>
            <div class="change-photo-link mt-1" @click="triggerFileInput">Alterar foto</div>
          </div>
        </div>
      </div>

      <v-card-text class="px-8 pb-8 pt-5">
        <v-form @submit.prevent="submitForm">

          <div class="section-label">Informações da Conta</div>

          <div class="field-group">
            <div class="field-wrapper">
              <label class="field-label">Usuário</label>
              <v-text-field
                v-model="form.username"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account-outline"
                placeholder="Seu nome de usuário"
                :error-messages="errors.username"
                hide-details="auto"
                class="modern-field"
              />
            </div>

            <div class="field-wrapper">
              <label class="field-label">E-mail</label>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-email-outline"
                placeholder="seu@email.com"
                :error-messages="errors.email"
                hide-details="auto"
                class="modern-field"
              />
            </div>

            <div class="field-wrapper">
              <label class="field-label">Telefone / WhatsApp</label>
              <v-text-field
                v-model="form.telefone"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-phone-outline"
                placeholder="(11) 99999-9999"
                :error-messages="errors.telefone"
                hide-details="auto"
                class="modern-field"
                @input="formatPhone"
              />
            </div>
          </div>

          <div class="section-label mt-5">Segurança</div>

          <div class="field-group">
            <div class="field-wrapper">
              <label class="field-label">
                Nova Senha <span class="optional">(opcional)</span>
              </label>
              <v-text-field
                v-model="form.password"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :error-messages="errors.password"
                hide-details="auto"
                class="modern-field"
                @click:append-inner="showPassword = !showPassword"
              />
            </div>

            <div class="field-wrapper">
              <label class="field-label">Confirmar Nova Senha</label>
              <v-text-field
                v-model="form.confirmPassword"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :error-messages="errors.confirmPassword"
                hide-details="auto"
                class="modern-field"
                :disabled="!form.password"
              />
            </div>

            <div v-if="form.password" class="password-hints">
              <div class="hint-item" :class="{ active: form.password.length >= 6 }">
                <v-icon size="13">{{ form.password.length >= 6 ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Mínimo 6 caracteres
              </div>
              <div class="hint-item" :class="{ active: /[A-Z]/.test(form.password) }">
                <v-icon size="13">{{ /[A-Z]/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Letra maiúscula
              </div>
              <div class="hint-item" :class="{ active: /\d/.test(form.password) }">
                <v-icon size="13">{{ /\d/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Número
              </div>
              <div class="hint-item" :class="{ active: /[^A-Za-z0-9]/.test(form.password) }">
                <v-icon size="13">{{ /[^A-Za-z0-9]/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Caractere especial
              </div>
            </div>
          </div>

          <v-alert v-if="successMessage" type="success" variant="tonal" density="compact" class="mt-4 rounded-lg">
            {{ successMessage }}
          </v-alert>
          <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mt-4 rounded-lg">
            {{ errorMessage }}
          </v-alert>

          <div class="d-flex ga-3 mt-6">
            <v-btn variant="outlined" color="grey" class="flex-1 action-btn" @click="closeModal">
              Cancelar
            </v-btn>
            <v-btn color="#195FA0" type="submit" :loading="saving" class="flex-1 action-btn save-btn">
              Salvar Alterações
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { AuthService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'

type EditProfileForm = {
  email: string
  password: string
  confirmPassword: string
  username: string
  telefone: string
}

const props = defineProps<{
  modelValue: boolean
  photoUrl?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const authStore = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const showPassword = ref(false)
const previewPhotoUrl = ref('')
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive<EditProfileForm>({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  telefone: ''
})

const errors = reactive<Record<string, string>>({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  telefone: ''
})

const initials = computed(() => {
  const text = form.username?.trim() || authStore.user?.unique_name || 'U'
  return text.substring(0, 2).toUpperCase()
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    fillForm()
    clearErrors()
    showPassword.value = false
    previewPhotoUrl.value = ''
    successMessage.value = ''
    errorMessage.value = ''
  }
}, { immediate: true })

function fillForm() {
  form.email = authStore.user?.email || ''
  form.password = ''
  form.confirmPassword = ''
  form.username = authStore.user?.unique_name || ''
  form.telefone = ''
}

function clearErrors() {
  Object.keys(errors).forEach((key) => { errors[key] = '' })
}

function closeModal() {
  emit('update:modelValue', false)
}

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  previewPhotoUrl.value = URL.createObjectURL(file)
}

function formatPhone() {
  const digits = form.telefone.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    form.telefone = digits
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    form.telefone = digits
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }
}

function isValidBrazilPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

function isValidIdentityPassword(value: string) {
  return (
    value.length >= 6 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  )
}

function validateForm() {
  clearErrors()
  let isValid = true

  if (!form.username.trim()) {
    errors.username = 'Usuário é obrigatório'
    isValid = false
  } else if (form.username.trim().length < 3) {
    errors.username = 'Usuário deve ter pelo menos 3 caracteres'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido'
    isValid = false
  }

  if (form.telefone && !isValidBrazilPhone(form.telefone)) {
    errors.telefone = 'Telefone inválido. Use DDD + número'
    isValid = false
  }

  if (form.password) {
    if (!isValidIdentityPassword(form.password)) {
      errors.password = 'Senha fraca. Verifique os requisitos abaixo'
      isValid = false
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirme a senha'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem'
      isValid = false
    }
  }

  return isValid
}

async function submitForm() {
  if (!validateForm()) return

  const userId = authStore.userId
  if (!userId) {
    errorMessage.value = 'Usuário não identificado. Faça login novamente.'
    return
  }

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const dto = {
        username: form.username.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim() || undefined,
        password: form.password.trim() || undefined,
    }

    await AuthService.update(userId, dto)
    
    authStore.updateUser({
        unique_name: dto.username,
        email: dto.email
    })

      successMessage.value = 'Informações atualizadas com sucesso!'
      setTimeout(() => closeModal(), 1500)
  } catch (err: any) {
      errorMessage.value = err?.response?.data?.message || 'Erro ao salvar. Tente novamente.'
  } finally {
      saving.value = false
  }
}
</script>

<style scoped>
.modal-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, rgb(24, 103, 192) 0%, rgb(24, 103, 192) 100%);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
}

.modal-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

.close-btn {
  color: rgba(255, 255, 255, 0.8) !important;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.profile-avatar {
  border: 3px solid rgba(255, 255, 255, 0.35);
  transition: opacity 0.2s;
}

.avatar-wrapper:hover .profile-avatar {
  opacity: 0.8;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-initials {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
}

.user-name {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.user-email {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 2px;
}

.change-photo-link {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.section-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #195FA0;
  margin-bottom: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.optional {
  font-weight: 400;
  color: #9CA3AF;
  font-size: 0.75rem;
}

.modern-field :deep(.v-field) {
  border-radius: 10px !important;
  font-size: 0.9rem;
}

.modern-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
}

.password-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: 10px 14px;
  background: #F8FAFC;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  color: #9CA3AF;
  transition: color 0.2s;
}

.hint-item.active {
  color: #16A34A;
}

.hint-item.active .v-icon {
  color: #16A34A !important;
}

.action-btn {
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  height: 42px !important;
}

.save-btn {
  color: white !important;
}
</style>