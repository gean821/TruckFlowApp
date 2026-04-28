<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    width="95vw"
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card :style="styles.modalCard" elevation="0">

      <div :style="styles.modalHeader">
        <div :style="styles.headerTop">
          <div>
            <div :style="styles.modalTitle">Meu Perfil</div>
            <div :style="styles.modalSubtitle">Edite suas informações pessoais</div>
          </div>
          <v-btn icon="mdi-close" variant="text" density="comfortable" :style="styles.closeBtn" @click="closeModal" />
        </div>

        <div :style="styles.avatarRow">
          <div :style="styles.avatarWrapper" @click="triggerFileInput" @mouseenter="showAvatarOverlay = true" @mouseleave="showAvatarOverlay = false">
            <v-avatar size="72" :style="styles.profileAvatar">
              <v-img v-if="previewPhotoUrl || photoUrl" :src="previewPhotoUrl || photoUrl" cover />
              <span v-else :style="styles.avatarInitials">{{ initials }}</span>
            </v-avatar>
            <div :style="{ ...styles.avatarOverlay, opacity: showAvatarOverlay ? 1 : 0 }">
              <v-icon size="18" color="white">mdi-camera</v-icon>
            </div>
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileChange" />
          </div>
          <div>
            <div :style="styles.userName">{{ form.username || 'Usuário' }}</div>
            <div :style="styles.userEmail">{{ form.email || '' }}</div>
            <div :style="styles.changePhotoLink" @click="triggerFileInput">Alterar foto</div>
          </div>
        </div>
      </div>

      <v-card-text :style="styles.cardText">
        <v-form @submit.prevent="submitForm">

          <div :style="styles.sectionLabel">Informações da Conta</div>

          <div :style="styles.fieldGroup">
            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">Usuário</label>
              <v-text-field
                v-model="form.username"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account-outline"
                placeholder="Seu nome de usuário"
                :error-messages="errors.username"
                hide-details="auto"
                :style="styles.modernField"
              />
            </div>

            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">E-mail</label>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-email-outline"
                placeholder="seu@email.com"
                :error-messages="errors.email"
                hide-details="auto"
                :style="styles.modernField"
              />
            </div>

            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">Telefone / WhatsApp</label>
              <v-text-field
                v-model="form.telefone"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-phone-outline"
                placeholder="(11) 99999-9999"
                :error-messages="errors.telefone"
                hide-details="auto"
                :style="styles.modernField"
                @input="formatPhone"
              />
            </div>
          </div>

          <div :style="{ ...styles.sectionLabel, marginTop: '20px' }">Segurança</div>

          <div :style="styles.fieldGroup">
            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">
                Nova Senha <span :style="styles.optional">(opcional)</span>
              </label>
              <v-form autocomplete="off" @submit.prevent="submitForm"></v-form>
              <v-text-field
                v-model="form.password"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                name="new-profile-password"
                placeholder="Digite uma nova senha se quiser alterar"
                :error-messages="errors.password"
                hide-details="auto"
                :style="styles.modernField"
                @click:append-inner="showPassword = !showPassword"
              />
            </div>

            <div :style="styles.fieldWrapper">
              <label :style="styles.fieldLabel">Confirmar Nova Senha</label>
              <v-text-field
                v-model="form.confirmPassword"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                name="confirm-new-profile-password"
                placeholder="Confirme a nova senha"
                :error-messages="errors.confirmPassword"
                hide-details="auto"
                :style="styles.modernField"
                :disabled="!form.password"
              />
            </div>

            <div v-if="form.password" :style="styles.passwordHints">
              <div :style="{ ...styles.hintItem, ...(form.password.length >= 6 ? styles.hintItemActive : {}) }">
                <v-icon size="13">{{ form.password.length >= 6 ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Mínimo 6 caracteres
              </div>
              <div :style="{ ...styles.hintItem, ...(/[A-Z]/.test(form.password) ? styles.hintItemActive : {}) }">
                <v-icon size="13">{{ /[A-Z]/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Letra maiúscula
              </div>
              <div :style="{ ...styles.hintItem, ...(/\d/.test(form.password) ? styles.hintItemActive : {}) }">
                <v-icon size="13">{{ /\d/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Número
              </div>
              <div :style="{ ...styles.hintItem, ...(/[^A-Za-z0-9]/.test(form.password) ? styles.hintItemActive : {}) }">
                <v-icon size="13">{{ /[^A-Za-z0-9]/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                Caractere especial
              </div>
            </div>
          </div>

          <v-alert v-if="successMessage" type="success" variant="tonal" density="compact" :style="styles.alert">
            {{ successMessage }}
          </v-alert>
          <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" :style="styles.alert">
            {{ errorMessage }}
          </v-alert>

          <div :style="styles.actionRow">
            <v-btn variant="outlined" color="grey" :style="styles.actionBtn" @click="closeModal">
              Cancelar
            </v-btn>
            <v-btn color="#195FA0" type="submit" :loading="saving" :style="{ ...styles.actionBtn, ...styles.saveBtn }">
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
const showAvatarOverlay = ref(false)
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

const styles = {
  modalCard: {
    borderRadius: '20px',
    overflow: 'hidden',
  },
  modalHeader: {
    background: 'linear-gradient(135deg, rgb(24, 103, 192) 0%, rgb(24, 103, 192) 100%)',
    padding: '32px 32px 24px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '-0.3px',
  },
  modalSubtitle: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '2px',
  },
  closeBtn: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
  },
  avatarWrapper: {
    position: 'relative' as const,
    cursor: 'pointer',
    flexShrink: 0,
  },
  profileAvatar: {
    border: '3px solid rgba(255, 255, 255, 0.35)',
    transition: 'opacity 0.2s',
  },
  avatarOverlay: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  avatarInitials: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'white',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'white',
  },
  userEmail: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: '2px',
  },
  changePhotoLink: {
    fontSize: '0.78rem',
    color: 'rgba(255, 255, 255, 0.85)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    marginTop: '4px',
  },
  cardText: {
    padding: '20px 32px 32px',
  },
  sectionLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '1.2px',
    textTransform: 'uppercase' as const,
    color: '#195FA0',
    marginBottom: '12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#374151',
  },
  optional: {
    fontWeight: '400',
    color: '#9CA3AF',
    fontSize: '0.75rem',
  },
  modernField: {
    borderRadius: '10px',
    fontSize: '0.9rem',
  },
  passwordHints: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    columnGap: '16px',
    padding: '10px 14px',
    background: '#F8FAFC',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
  },
  hintItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.74rem',
    color: '#9CA3AF',
    transition: 'color 0.2s',
  },
  hintItemActive: {
    color: '#16A34A',
  },
  alert: {
    marginTop: '16px',
    borderRadius: '8px',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  actionBtn: {
    flex: 1,
    borderRadius: '10px',
    fontWeight: '600',
    textTransform: 'none' as const,
    letterSpacing: '0',
    height: '42px',
  },
  saveBtn: {
    color: 'white',
  },
}

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
@media (max-width: 600px) {
  :deep(.v-dialog) {
    margin: 12px;
  }

  :deep(.v-card) {
    max-height: 92vh !important;
  }

  :deep(.v-card-text) {
    padding: 16px !important;
    max-height: calc(92vh - 170px) !important;
    overflow-y: auto !important;
  }
}

@media (max-width: 420px) {
  :deep(.v-card-text) {
    padding: 14px !important;
  }

  :deep(.v-btn) {
    font-size: 0.78rem;
  }
}
</style>