<template>
  <v-dialog
    :model-value="open"
    @update:model-value="(v: boolean) => !v && emit('close')"
    max-width="640"
    persistent
  >
    <v-card class="rounded-xl overflow-hidden">
      <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
        <v-icon class="mr-3" size="28">{{
          isEdit ? "mdi-account-edit-outline" : "mdi-account-plus-outline"
        }}</v-icon>
        <div>
          <div class="text-h6 font-weight-bold">
            {{ isEdit ? "Editar usuário" : "Novo usuário" }}
          </div>
          <div class="text-caption opacity-75">
            {{
              isEdit
                ? "Atualize os dados do administrador"
                : "Cadastre um novo administrador"
            }}
          </div>
        </div>
        <v-spacer />
        <v-btn icon variant="text" color="white" @click="emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="onSubmit" class="pa-6">
        <div class="d-flex justify-center mb-5">
          <div
            class="avatar-wrapper"
            @click="triggerFileInput"
            @mouseenter="showAvatarOverlay = true"
            @mouseleave="showAvatarOverlay = false"
          >
            <v-avatar size="96" color="primary-lighten-5" class="avatar-edit">
              <v-img v-if="displayPhoto" :src="displayPhoto" cover />
              <span v-else class="text-h5 font-weight-bold text-primary">
                {{ initials }}
              </span>
            </v-avatar>
            <div
              class="avatar-overlay"
              :style="{ opacity: showAvatarOverlay ? 1 : 0 }"
            >
              <v-icon size="22" color="white">mdi-camera-outline</v-icon>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onFileChange"
            />
          </div>
        </div>

        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nomeReal"
              label="Nome completo"
              variant="outlined"
              density="comfortable"
              :rules="isEdit ? [] : [rules.required]"
              :disabled="isEdit"
              :hint="
                isEdit ? 'Nome só pode ser alterado pelo próprio usuário' : ''
              "
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.username"
              label="Usuário (login)"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required, rules.minUsername]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              label="E-mail"
              type="email"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required, rules.email]"
              :disabled="isEdit"
              :hint="isEdit ? 'E-mail só pode ser alterado pelo próprio usuário' : ''"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.telefone"
              label="Telefone"
              variant="outlined"
              density="comfortable"
              placeholder="(00) 00000-0000"
              :rules="isEdit ? [] : [rules.required]"
              @input="formatPhone"
            />
          </v-col>

          <v-col v-if="!isEdit" cols="12">
            <v-select
              v-model="form.role"
              :items="roleOptions"
              :loading="isLoadingRoles"
              label="Cargo"
              prepend-inner-icon="mdi-shield-account-outline"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              :hint="
                roleOptions.length <= 1
                  ? 'Outros cargos serão liberados conforme a regra do cliente'
                  : ''
              "
              persistent-hint
            />
          </v-col>

          <v-col v-if="!isEdit" cols="12">
            <v-text-field
              v-model="form.password"
              :label="isEdit ? 'Nova senha (opcional)' : 'Senha'"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              :rules="passwordRules"
              :hint="
                isEdit
                  ? 'Deixe em branco para manter a senha atual'
                  : 'Mínimo 6 caracteres'
              "
              persistent-hint
              autocomplete="new-password"
            >
              <template #append-inner>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <v-icon size="20">
                    {{
                      showPassword ? "mdi-eye-off-outline" : "mdi-eye-outline"
                    }}
                  </v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex justify-end gap-2 mt-4">
          <v-btn variant="text" @click="emit('close')" :disabled="loading"
            >Cancelar</v-btn
          >
          <v-btn
            color="primary"
            type="submit"
            rounded="lg"
            :loading="loading"
            class="px-6 text-capitalize font-weight-bold"
          >
            {{ isEdit ? "Salvar alterações" : "Criar usuário" }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import type {
  UsuarioCreateDto,
  UsuarioResponseDto,
  UsuarioUpdateDto,
} from "@/entities/usuario.types";
import { useRolesQuery } from "@/queries/usuario.queries";

const props = defineProps<{
  open: boolean;
  initialData?: UsuarioResponseDto;
  loading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: UsuarioCreateDto | UsuarioUpdateDto];
}>();

const isEdit = computed(() => !!props.initialData);
const formRef = ref<any>(null);
const showPassword = ref(false);
const showAvatarOverlay = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewPhotoUrl = ref("");

const form = reactive({
  nomeReal: "",
  username: "",
  email: "",
  telefone: "",
  password: "",
  photoUrl: "",
  role: "Admin",
});

const rolesQuery = useRolesQuery();
const isLoadingRoles = computed(() => rolesQuery.isLoading.value);
const roleOptions = computed(() => rolesQuery.data.value ?? ["Admin"]);

const displayPhoto = computed(
  () => previewPhotoUrl.value || form.photoUrl || null,
);

const initials = computed(() => {
  const base = form.nomeReal || form.username || "?";
  return (
    base
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      Object.assign(form, {
        nomeReal: val.nomeReal ?? "",
        username: val.username ?? "",
        email: val.email ?? "",
        telefone: "",
        password: "",
        photoUrl: val.photoUrl ?? "",
        role: val.role ?? "Admin",
      });
    } else {
      Object.assign(form, {
        nomeReal: "",
        username: "",
        email: "",
        telefone: "",
        password: "",
        photoUrl: "",
        role: "Admin",
      });
    }
    previewPhotoUrl.value = "";
  },
  { immediate: true },
);

const rules = {
  required: (v: any) => !!v || "Campo obrigatório",
  minUsername: (v: string) => (v?.length ?? 0) >= 3 || "Mínimo 3 caracteres",
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "E-mail inválido",
  minPassword: (v: string) => (v?.length ?? 0) >= 6 || "Mínimo 6 caracteres",
};

const passwordRules = computed(() => {
  if (isEdit.value) {
    return [
      (v: string) =>
        !v || rules.minPassword(v) === true || rules.minPassword(v),
    ];
  }
  return [rules.required, rules.minPassword];
});

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

function triggerFileInput() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  } 

  previewPhotoUrl.value = URL.createObjectURL(file);
  form.photoUrl = previewPhotoUrl.value;
}

async function onSubmit() {
  const valid = await formRef.value?.validate();
  if (valid && !valid.valid) {
    return;
  }

  if (isEdit.value) {
    const payload: UsuarioUpdateDto = {
      username: form.username || undefined,
      telefone: form.telefone || undefined,
      photoUrl: form.photoUrl || undefined,
    };

    emit("submit", payload);
  } else {
    const payload: UsuarioCreateDto = {
      nomeReal: form.nomeReal,
      username: form.username,
      email: form.email,
      telefone: form.telefone,
      password: form.password,
      role: form.role,
      photoUrl: form.photoUrl || undefined,
    };
    emit("submit", payload);
  }
}

</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-edit {
  border: 3px solid #e3edf7;
  transition: border-color 0.2s;
}

.avatar-wrapper:hover .avatar-edit {
  border-color: #195fa0;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  pointer-events: none;
}
</style>
