<template>
  <v-card elevation="0" class="rounded-xl pa-5 chart-card h-100 d-flex flex-column">
    <div class="d-flex align-start justify-space-between mb-3">
      <div class="pr-2">
        <div class="d-flex align-center">
          <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">{{ titulo }}</h3>
          <v-tooltip v-if="ajuda" location="top" max-width="320">
            <template #activator="{ props: tip }">
              <v-icon v-bind="tip" size="16" class="ml-1 text-grey">mdi-information-outline</v-icon>
            </template>
            {{ ajuda }}
          </v-tooltip>
        </div>
        <div v-if="subtitulo" class="text-caption text-grey-darken-1">{{ subtitulo }}</div>
      </div>

      <div class="d-flex align-center flex-shrink-0">
        <slot name="acoes" />
        <v-tooltip text="Baixar imagem" location="top">
          <template #activator="{ props: tip }">
            <v-btn v-bind="tip" icon="mdi-download-outline" size="small" variant="text" density="comfortable" :disabled="vazio" @click="baixar" />
          </template>
        </v-tooltip>
        <v-tooltip text="Tela cheia" location="top">
          <template #activator="{ props: tip }">
            <v-btn v-bind="tip" icon="mdi-arrow-expand" size="small" variant="text" density="comfortable" :disabled="vazio" @click="telaCheia = true" />
          </template>
        </v-tooltip>
      </div>
    </div>

    <div class="flex-grow-1 position-relative" :style="{ minHeight: `${altura}px` }">
      <div v-if="vazio" class="estado-vazio d-flex flex-column align-center justify-center text-grey">
        <v-icon size="36" class="mb-2 text-grey-lighten-1">mdi-chart-box-outline</v-icon>
        <span class="text-body-2">{{ textoVazio }}</span>
      </div>
      <v-chart
        v-else
        ref="grafico"
        :option="option"
        :theme="TEMA"
        :loading="carregando"
        :loading-options="{ text: '', color: CORES.primaria, maskColor: 'rgba(255,255,255,0.6)' }"
        autoresize
        :style="{ height: `${altura}px`, width: '100%' }"
        @click="(p: unknown) => emit('clique', p)"
      />
    </div>

    <slot name="rodape" />

    <v-dialog v-model="telaCheia" fullscreen transition="dialog-bottom-transition">
      <v-card class="pa-6 d-flex flex-column">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <h2 class="text-h6 font-weight-bold">{{ titulo }}</h2>
            <div v-if="subtitulo" class="text-body-2 text-grey-darken-1">{{ subtitulo }}</div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="telaCheia = false" />
        </div>
        <v-chart :option="option" :theme="TEMA" autoresize class="flex-grow-1" style="min-height: 70vh" />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";
import { CORES, TEMA } from "./charts/echarts";

const props = withDefaults(
  defineProps<{
    titulo: string;
    subtitulo?: string;
    ajuda?: string;
    option: EChartsOption;
    altura?: number;
    carregando?: boolean;
    vazio?: boolean;
    textoVazio?: string;
    nomeArquivo?: string;
  }>(),
  { altura: 300, carregando: false, vazio: false, textoVazio: "Sem dados no período" },
);

const emit = defineEmits<{ clique: [params: unknown] }>();

const grafico = ref<InstanceType<typeof VChart> | null>(null);
const telaCheia = ref(false);

const baixar = () => {
  const url = grafico.value?.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#ffffff" });
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.download = `${props.nomeArquivo ?? props.titulo}.png`;
  link.click();
};
</script>

<style scoped>
.chart-card {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.estado-vazio {
  position: absolute;
  inset: 0;
}
</style>
