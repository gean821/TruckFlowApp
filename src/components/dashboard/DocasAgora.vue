<template>
  <v-card elevation="0" class="rounded-xl pa-5 painel h-100">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Docas agora</h3>
        <div class="text-caption text-grey-darken-1">{{ ocupadas }} de {{ docas.length }} ocupada{{ ocupadas === 1 ? "" : "s" }}</div>
      </div>
      <div class="d-flex align-center text-caption" style="gap: 12px">
        <span class="d-flex align-center"><span class="ponto ponto-ocupada mr-1" /> Ocupada</span>
        <span class="d-flex align-center"><span class="ponto ponto-livre mr-1" /> Livre</span>
      </div>
    </div>

    <div v-if="docas.length === 0" class="text-center text-grey py-8">
      <v-icon size="36" class="mb-2 text-grey-lighten-1">mdi-garage-variant</v-icon>
      <div class="text-body-2">Nenhuma doca ativa cadastrada</div>
    </div>

    <div v-else class="grade-docas">
      <div v-for="doca in docas" :key="doca.id" class="doca pa-3 rounded-lg" :class="doca.ocupada ? 'doca-ocupada' : 'doca-livre'">
        <div class="d-flex align-start justify-space-between mb-2" style="gap: 8px">
          <div class="text-body-2 font-weight-bold text-grey-darken-4 nome-doca" :title="doca.nome">{{ doca.nome }}</div>
          <v-chip size="x-small" :color="doca.ocupada ? 'primary' : 'success'" variant="flat" class="font-weight-bold flex-shrink-0">
            {{ doca.ocupada ? "Ocupada" : "Livre" }}
          </v-chip>
        </div>

        <template v-if="doca.atual">
          <div class="text-h6 font-weight-bold placa">{{ doca.atual.placa || "Sem placa" }}</div>
          <div class="text-caption text-grey-darken-2 text-truncate">{{ doca.atual.fornecedor || doca.atual.motorista || "—" }}</div>
          <div class="d-flex align-center mt-2 text-caption" :class="(doca.atual.minutos ?? 0) > 90 ? 'text-error font-weight-bold' : 'text-grey-darken-1'">
            <v-icon size="14" class="mr-1">mdi-timer-outline</v-icon>
            há {{ formatarDuracao(doca.atual.minutos) }} no pátio
          </div>
        </template>

        <template v-else>
          <template v-if="doca.proximo && (doca.proximo.minutos ?? 0) < 0">
            <div class="text-caption text-error font-weight-bold mb-1">Atrasado há {{ formatarDuracao(-(doca.proximo.minutos ?? 0)) }}</div>
            <div class="text-body-2 font-weight-medium">{{ formatarHora(doca.proximo.dataInicio) }} • {{ doca.proximo.placa || "—" }}</div>
          </template>
          <template v-else-if="doca.proximo">
            <div class="text-caption text-grey-darken-1 mb-1">Próximo em {{ formatarDuracao(doca.proximo.minutos) }}</div>
            <div class="text-body-2 font-weight-medium">{{ formatarHora(doca.proximo.dataInicio) }} • {{ doca.proximo.placa || "—" }}</div>
          </template>
          <div v-else class="text-body-2 text-grey">Sem agendamentos hoje</div>
        </template>

        <div class="text-caption text-grey mt-2">{{ doca.concluidosHoje }} descarga{{ doca.concluidosHoje === 1 ? "" : "s" }} hoje</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DashboardHojeDoca } from "@/entities/dashboardHoje.types";
import { formatarDuracao, formatarHora } from "@/utils/relatorioFormat";

const props = defineProps<{ docas: DashboardHojeDoca[] }>();

const ocupadas = computed(() => props.docas.filter((d) => d.ocupada).length);
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.grade-docas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.doca {
  border: 1px solid transparent;
  min-height: 132px;
}
.doca-ocupada {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.doca-livre {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.nome-doca {
  min-width: 0;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.placa {
  letter-spacing: 0.06em;
  color: #0f172a;
}
.ponto {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.ponto-ocupada {
  background: rgb(var(--v-theme-primary));
}
.ponto-livre {
  background: rgb(var(--v-theme-success));
}
</style>
