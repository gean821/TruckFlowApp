<template>
  <v-navigation-drawer
    v-model="open"
    location="right"
    width="480"
    temporary
    :elevation="6"
  >
    <div class="audit-drawer-header pa-4 d-flex align-center">
      <v-icon class="mr-2" color="white">mdi-history</v-icon>
      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-bold text-white">Histórico</div>
        <div class="text-caption text-white opacity-75">
          {{ entityLabel ?? ENTITY_LABELS[entityName] ?? entityName }}
        </div>
      </div>
      <v-btn icon variant="text" color="white" size="small" @click="open = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <div class="pa-3">
      <AuditTimeline
        v-if="open && entityId"
        :entity-name="entityName"
        :entity-id="entityId"
      />
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AuditTimeline from './AuditTimeline.vue';
import { ENTITY_LABELS } from '@/utils/audit';

const props = defineProps<{
  modelValue: boolean;
  entityName: string;
  entityId: string;
  entityLabel?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
});
</script>

<style scoped>
.audit-drawer-header {
  background: linear-gradient(90deg, #0A2E52 0%, #195FA0 100%);
}
</style>
