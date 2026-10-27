<template>
  <v-container fluid class="dashboard-bg pa-6 pb-12">
    <div class="dashboard-header mb-6 pa-6 rounded-xl">
      <div class="d-flex justify-space-between align-center flex-wrap" style="gap: 12px">
        <div>
          <div class="d-flex align-center mb-1" style="gap: 8px">
            <v-icon color="white" size="20" class="opacity-70">mdi-view-dashboard</v-icon>
            <span class="text-caption text-white opacity-70 text-uppercase font-weight-medium" style="letter-spacing: 0.08em">
              Operação de hoje
            </span>
            <span class="ao-vivo d-flex align-center text-caption font-weight-bold ml-2">
              <span class="pulso mr-1" /> AO VIVO
            </span>
          </div>
          <h1 class="text-h4 font-weight-bold text-white">Dashboard Operacional</h1>
          <p class="text-body-2 mt-1" style="color: rgba(255, 255, 255, 0.7)">
            {{ dataDeHoje }}
            <span v-if="atualizadoEm"> • atualizado às {{ atualizadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }}</span>
          </p>
        </div>

        <v-btn icon="mdi-refresh" variant="tonal" color="white" :loading="atualizando" size="small" @click="recarregar()" />
      </div>
    </div>

    <v-alert v-if="erro" type="error" variant="tonal" rounded="xl" class="mb-5">
      Não foi possível atualizar o dashboard.
      <template #append><v-btn variant="text" @click="recarregar()">Tentar de novo</v-btn></template>
    </v-alert>

    <template v-if="dados">
      <v-row dense class="mb-2">
        <v-col v-for="kpi in kpis" :key="kpi.titulo" cols="12" sm="6" lg="2">
          <KpiCard v-bind="kpi" :texto-comparacao="textoComparacao" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" lg="8">
          <ChartCard
            titulo="Hoje, hora a hora"
            :subtitulo="`Agendados, chegadas e descargas concluídas • linha cinza = média das últimas ${dados.diaSemana.replace('-feira', 's')}`"
            :option="opcaoDia"
            :altura="300"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <ChartCard
            titulo="Meta do dia"
            :subtitulo="subtituloMeta"
            :option="opcaoMeta"
            :vazio="dados.indicadores.atingimentoMetaPct === null"
            texto-vazio="Configure a meta diária em Empresa → Operação"
            :altura="300"
          />
        </v-col>

        <v-col cols="12" lg="8">
          <DocasAgora :docas="dados.docas" />
        </v-col>
        <v-col cols="12" lg="4">
          <PatioAgora :patio="dados.patio" />
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <ListaCaminhoes
            titulo="Próximas chegadas"
            subtitulo="Nas próximas 2 horas"
            :caminhoes="dados.proximasChegadas"
            modo="faltam"
            cor="primary"
            texto-vazio="Nenhuma chegada nas próximas 2 horas"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <ListaCaminhoes
            titulo="Atrasados"
            subtitulo="Horário passou e o caminhão não chegou"
            :caminhoes="dados.atrasados"
            modo="atraso"
            cor="error"
            texto-vazio="Nenhum atraso agora"
            icone-vazio="mdi-check-circle-outline"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <UpcomingAppointments />
        </v-col>
      </v-row>

      <AtalhosRelatorios class="mt-6" />
    </template>

    <v-row v-else-if="carregando" dense>
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="2"><v-skeleton-loader type="article" class="rounded-xl" /></v-col>
      <v-col cols="12" lg="8"><v-skeleton-loader type="image" height="300" class="rounded-xl" /></v-col>
      <v-col cols="12" lg="4"><v-skeleton-loader type="image" height="300" class="rounded-xl" /></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AtalhosRelatorios from "@/components/dashboard/AtalhosRelatorios.vue";
import DocasAgora from "@/components/dashboard/DocasAgora.vue";
import ListaCaminhoes from "@/components/dashboard/ListaCaminhoes.vue";
import PatioAgora from "@/components/dashboard/PatioAgora.vue";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments.vue";
import ChartCard from "@/components/relatorios/ChartCard.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import { diaHoraAHoraOption, metaGaugeOption } from "@/components/relatorios/charts/dashboardOptions";
import { useDashboardHoje } from "@/hooks/useDashboard";
import { formatarNumero, formatarToneladas } from "@/utils/relatorioFormat";

const { dados, carregando, atualizando, erro, atualizadoEm, recarregar } = useDashboardHoje();

const dataDeHoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

const textoComparacao = computed(() =>
  dados.value ? `vs média das ${dados.value.diaSemana.replace("-feira", "s")}` : "vs média",
);

const kpis = computed(() => {
  const i = dados.value!.indicadores;
  return [
    { titulo: "Agendados hoje", valor: formatarNumero(i.agendadosHoje.valor), icone: "mdi-calendar-check", cor: "primary", variacao: i.agendadosHoje.variacaoPct, detalhe: `${i.aindaPorVir} ainda por vir` },
    { titulo: "Concluídos", valor: formatarNumero(i.concluidos.valor), icone: "mdi-truck-check", cor: "success", variacao: i.concluidos.variacaoPct, detalhe: "até agora" },
    { titulo: "Toneladas hoje", valor: formatarToneladas(i.pesoRecebidoKg.valor), icone: "mdi-weight", cor: "indigo", variacao: i.pesoRecebidoKg.variacaoPct, detalhe: "até agora" },
    { titulo: "No pátio", valor: formatarNumero(i.noPatio.valor), icone: "mdi-truck-fast-outline", cor: "cyan-darken-1", variacao: null, detalhe: "agora" },
    { titulo: "Atrasados", valor: formatarNumero(i.atrasados.valor), icone: "mdi-clock-alert-outline", cor: "warning", variacao: null, detalhe: "sem check-in" },
    { titulo: "Não compareceu", valor: formatarNumero(i.naoCompareceu.valor), icone: "mdi-account-cancel-outline", cor: "error", variacao: i.naoCompareceu.variacaoPct, inverter: true, detalhe: "hoje" },
  ];
});

const opcaoDia = computed(() => diaHoraAHoraOption(dados.value!.porHora, dados.value!.horaAtual, dados.value!.diaSemana));
const opcaoMeta = computed(() => metaGaugeOption(dados.value!.indicadores.atingimentoMetaPct ?? 0));

const subtituloMeta = computed(() => {
  const d = dados.value!;
  return d.metaDiariaKg
    ? `${formatarToneladas(d.indicadores.pesoRecebidoKg.valor)} de ${formatarToneladas(d.metaDiariaKg)} recebidas`
    : "Meta diária não configurada";
});
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  background-color: #eef0f8;
  background-image: radial-gradient(#c8cde8 1px, transparent 1px);
  background-size: 24px 24px;
}

.dashboard-header {
  background: linear-gradient(135deg, #195fa0 0%, #0d3f6e 60%, #0a2e52 100%);
  box-shadow: 0 4px 24px rgba(25, 95, 160, 0.35);
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.ao-vivo {
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.18);
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.06em;
}

.pulso {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulsar 1.6s infinite;
}

@keyframes pulsar {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
</style>
