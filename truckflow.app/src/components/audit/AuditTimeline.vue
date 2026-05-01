<template>
  <div class="audit-timeline">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" size="32" />
    </div>

    <div v-else-if="erro" class="text-center pa-6 text-error">
      <v-icon size="32" class="mb-2">mdi-alert-circle-outline</v-icon>
      <p class="text-body-2">Não foi possível carregar o histórico.</p>
    </div>

    <div v-else-if="items.length === 0" class="text-center pa-8 text-grey">
      <v-icon size="36" class="mb-2 opacity-50">mdi-history</v-icon>
      <p class="text-body-2">Sem eventos registrados para este item.</p>
    </div>

    <v-timeline
      v-else
      density="compact"
      align="start"
      side="end"
      truncate-line="start"
      class="pa-0"
    >
      <v-timeline-item
        v-for="evt in items"
        :key="evt.id"
        :dot-color="ACTION_META[evt.action].color"
        size="small"
      >
        <template #icon>
          <v-icon size="14" color="white">{{
            ACTION_META[evt.action].icon
          }}</v-icon>
        </template>

        <div class="d-flex flex-column">
          <div class="d-flex align-center flex-wrap gap-2">
            <v-chip
              :color="ACTION_META[evt.action].color"
              size="x-small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ ACTION_META[evt.action].label }}
            </v-chip>
            <span class="text-caption text-grey">{{
              formatDataHora(evt.timestamp)
            }}</span>
          </div>

          <div class="text-body-2 mt-1 text-grey-darken-2">
            <v-icon size="13" class="mr-1 text-grey-lighten-1"
              >mdi-account-circle-outline</v-icon
            >
            <span class="font-weight-medium">{{
              evt.userName ?? "Sistema"
            }}</span>
          </div>

          <v-btn
            v-if="evt.changes"
            variant="text"
            size="x-small"
            color="primary"
            class="text-capitalize align-self-start mt-1 px-2"
            @click="toggle(evt.id)"
          >
            {{ expanded.has(evt.id) ? "Ocultar" : "Ver mudanças" }}
            <v-icon end size="14">{{
              expanded.has(evt.id) ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>

          <v-expand-transition>
            <div v-if="expanded.has(evt.id)" class="mt-2">
              <v-table density="compact" class="changes-table-mini">
                <thead>
                  <tr>
                    <th class="text-caption font-weight-bold">Campo</th>
                    <th class="text-caption font-weight-bold">
                      {{ evt.action === "Update" ? "Antes" : "Valor" }}
                    </th>
                    <th
                      v-if="evt.action === 'Update'"
                      class="text-caption font-weight-bold"
                    >
                      Depois
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="[campo, valor] in formatChanges(evt)" :key="campo">
                    <td class="font-weight-medium">{{ campo }}</td>
                    <td>
                      <code class="text-caption">{{
                        formatAuditValueLabeled(campo, valor.from, evt.labels)
                      }}</code>
                    </td>
                    <td v-if="evt.action === 'Update'">
                      <code class="text-caption">{{
                        formatAuditValueLabeled(campo, valor.to, evt.labels)
                      }}</code>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-expand-transition>
        </div>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { format, parseISO } from "date-fns";
import { useAuditLogQuery } from "@/queries/audit.queries";
import { ACTION_META, formatAuditValueLabeled, formatChanges } from "@/utils/audit";

const props = withDefaults(
  defineProps<{
    entityName: string;
    entityId: string;
    pageSize?: number;
  }>(),
  {
    pageSize: 30,
  },
);

const params = computed(() => ({
  pageNumber: 1,
  pageSize: props.pageSize,
  entityName: props.entityName,
  entityId: props.entityId,
}));

const query = useAuditLogQuery(params);

const isLoading = computed(() => query.isLoading.value);
const erro = computed(() => query.isError.value);
const items = computed(() => query.data.value?.items ?? []);

const expanded = ref(new Set<string>());

function toggle(id: string) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id);
  } else {
    expanded.value.add(id);
  }
  expanded.value = new Set(expanded.value);
}

function formatDataHora(iso: string) {
  return format(parseISO(iso), "dd/MM/yyyy HH:mm:ss");
}
</script>

<style scoped>
.changes-table-mini {
  background: #fafbfc;
  border-radius: 6px;
  border: 1px solid #eef0f3;
}
.changes-table-mini code {
  background: #fff;
  padding: 1px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  word-break: break-all;
}
</style>
