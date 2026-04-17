<template>
  <v-dialog
    :model-value="modelValue"
    max-width="760"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-space-between align-center px-6 pt-6 pb-2">
        <span class="text-h5 font-weight-bold">Editar Informações</span>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeModal"
        />
      </v-card-title>

      <v-card-text class="px-6 pb-6">
        <v-form @submit.prevent="submitForm">
          <div class="d-flex flex-column align-center mb-6">
            <div class="avatar-wrapper">
              <v-avatar size="96" class="profile-avatar">
                <v-img
                  v-if="previewPhotoUrl || photoUrl"
                  :src="previewPhotoUrl || photoUrl"
                  cover
                />
                <span v-else class="text-h5 font-weight-bold">
                  {{ initials }}
                </span>
              </v-avatar>

              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="d-none"
                @change="onFileChange"
              />

              <v-btn
                icon="mdi-camera"
                size="small"
                color="primary"
                class="camera-btn"
                @click="triggerFileInput"
              />
            </div>

            <div class="text-caption text-medium-emphasis mt-3">
              Clique na câmera para alterar a foto
            </div>
          </div>

          <v-card variant="outlined" class="mb-4 rounded-lg">
            <v-card-text>
              <div class="text-subtitle-1 font-weight-bold mb-3">
                Escolha o que deseja editar
              </div>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="edit.photo"
                    label="Foto de perfil"
                    color="primary"
                    hide-details
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="edit.username"
                    label="Usuário"
                    color="primary"
                    hide-details
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="edit.email"
                    label="E-mail"
                    color="primary"
                    hide-details
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="edit.telefone"
                    label="Telefone / WhatsApp"
                    color="primary"
                    hide-details
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="edit.password"
                    label="Senha"
                    color="primary"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.username"
                label="Usuário"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account-outline"
                :disabled="!edit.username"
                :error-messages="errors.username"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="E-mail Corporativo"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email-outline"
                :disabled="!edit.email"
                :error-messages="errors.email"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.telefone"
                label="Telefone / WhatsApp"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-phone-outline"
                :disabled="!edit.telefone"
                :error-messages="errors.telefone"
                @input="formatPhone"
                placeholder="(11) 99999-9999"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Senha"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                :disabled="!edit.password"
                :error-messages="errors.password"
                @click:append-inner="showPassword = !showPassword"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.confirmPassword"
                label="Confirmar Senha"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showPassword ? 'text' : 'password'"
                :disabled="!edit.password"
                :error-messages="errors.confirmPassword"
              />
            </v-col>
          </v-row>

          <v-alert
            v-if="edit.password"
            type="info"
            variant="tonal"
            class="mt-2"
          >
            A senha deve ter no mínimo 6 caracteres, com letra maiúscula,
            letra minúscula, número e caractere especial.
          </v-alert>

          <div class="d-flex justify-end ga-3 mt-5">
            <v-btn
              variant="text"
              color="default"
              @click="closeModal"
            >
              Cancelar
            </v-btn>

            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
              class="px-6"
            >
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
import type AdminUpdateDto from '@/Dtos/adm/adminUpdateDto'

type EditProfileForm = {
  email: string
  password: string
  confirmPassword: string
  username: string
  telefone: string
}

type EditFlags = {
  photo: boolean
  email: boolean
  password: boolean
  username: boolean
  telefone: boolean
}

type SavePayload = AdminUpdateDto & {
  photoFile?: File | null
  changedFields: {
    photo: boolean
    email: boolean
    password: boolean
    username: boolean
    telefone: boolean
  }
}

const props = defineProps<{
  modelValue: boolean
  adminData?: Partial<AdminUpdateDto> | null
  loading?: boolean
  photoUrl?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: SavePayload): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const showPassword = ref(false)
const selectedPhotoFile = ref<File | null>(null)
const previewPhotoUrl = ref('')

const form = reactive<EditProfileForm>({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  telefone: ''
})

const edit = reactive<EditFlags>({
  photo: false,
  email: false,
  password: false,
  username: false,
  telefone: false
})

const errors = reactive<Record<string, string>>({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  telefone: '',
  photo: ''
})

const photoUrl = computed(() => props.photoUrl || '')

const initials = computed(() => {
  const text = form.username?.trim() || 'U'
  return text.substring(0, 2).toUpperCase()
})

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      fillForm()
      resetEditFlags()
      clearErrors()
      showPassword.value = false
      selectedPhotoFile.value = null
      previewPhotoUrl.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => props.adminData,
  () => {
    if (props.modelValue) {
      fillForm()
    }
  },
  { deep: true }
)

function fillForm() {
  form.email = props.adminData?.email || ''
  form.password = ''
  form.confirmPassword = ''
  form.username = props.adminData?.username || ''
  form.telefone = props.adminData?.telefone || ''
}

function resetEditFlags() {
  edit.photo = false
  edit.email = false
  edit.password = false
  edit.username = false
  edit.telefone = false
}

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function closeModal() {
  emit('update:modelValue', false)
}

function triggerFileInput() {
  edit.photo = true
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  selectedPhotoFile.value = file
  previewPhotoUrl.value = URL.createObjectURL(file)
  edit.photo = true
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
  const hasMinLength = value.length >= 6
  const hasUpper = /[A-Z]/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasNumber = /\d/.test(value)
  const hasSpecial = /[^A-Za-z0-9]/.test(value)

  return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial
}

function hasAtLeastOneChange() {
  return (
    edit.photo ||
    edit.email ||
    edit.password ||
    edit.username ||
    edit.telefone
  )
}

function validateForm() {
  clearErrors()
  let isValid = true

  if (!hasAtLeastOneChange()) {
    errors.username = 'Selecione pelo menos uma informação para editar'
    isValid = false
  }

  if (edit.username) {
    if (!form.username.trim()) {
      errors.username = 'Usuário é obrigatório'
      isValid = false
    } else if (form.username.trim().length < 3) {
      errors.username = 'Usuário deve ter pelo menos 3 caracteres'
      isValid = false
    }
  }

  if (edit.email) {
    if (!form.email.trim()) {
      errors.email = 'E-mail é obrigatório'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'E-mail inválido'
      isValid = false
    }
  }

  if (edit.telefone) {
    if (!form.telefone.trim()) {
      errors.telefone = 'Telefone é obrigatório'
      isValid = false
    } else if (!isValidBrazilPhone(form.telefone)) {
      errors.telefone = 'Telefone inválido. Use DDD + número'
      isValid = false
    }
  }

  if (edit.password) {
    if (!form.password) {
      errors.password = 'Senha é obrigatória'
      isValid = false
    } else if (!isValidIdentityPassword(form.password)) {
      errors.password =
        'A senha deve conter maiúscula, minúscula, número, símbolo e mínimo de 6 caracteres'
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

  if (edit.photo && !selectedPhotoFile.value && !previewPhotoUrl.value) {
    errors.photo = 'Selecione uma foto válida'
    isValid = false
  }

  return isValid
}

function submitForm() {
  if (!validateForm()) return

  emit('save', {
    email: edit.email ? form.email.trim() : '',
    password: edit.password ? form.password.trim() : '',
    username: edit.username ? form.username.trim() : '',
    telefone: edit.telefone ? form.telefone.trim() : '',
    photoFile: edit.photo ? selectedPhotoFile.value : null,
    changedFields: {
      photo: edit.photo,
      email: edit.email,
      password: edit.password,
      username: edit.username,
      telefone: edit.telefone
    }
  })
}
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
}

.profile-avatar {
  border: 2px solid #eeeeee;
  background: rgba(25, 95, 160, 0.12);
}

.camera-btn {
  position: absolute;
  right: -6px;
  bottom: -6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>