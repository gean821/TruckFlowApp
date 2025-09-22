<template>
    <div class="section d-flex flex-row align-center pa-5">
        <h1 class="text-h3 text-center d-flex flex-row pa-5 ga-5 ">
            Cadastros
            <v-img width="auto" aspect-ratio="16/9" cover src="/Clipboard.svg">
            </v-img>
        </h1>
    </div>
    <v-row class="d-flex flex-column justify-center align-center">
        <v-col cols="12" md="4">
            <v-card height="500" width="auto" color="#EDEAEA" variant="flat" rounded="xl">
                <div class="buttons d-flex flex-column justify-center align-center pa-5 ga-10">
                    <v-btn color="#0D47A1"
                        width="514"
                        height="67"
                        rounded="xl"
                        variant="elevated"
                        prepend-icon="mdi-plus-thick"
                        to="cadastro-produto"
                    >
                        Cadastrar Produto
                    </v-btn>

                    <v-btn color="#0D47A1"
                        width="514"
                        height="67"
                        rounded="xl"
                        variant="elevated"
                        prepend-icon="mdi-plus-thick"
                    >
                        Cadastrar Fornecedor
                    </v-btn>

                    <v-btn color="#0D47A1"
                        width="514"
                        height="67"
                        rounded="xl"
                        variant="elevated"
                        prepend-icon="mdi-plus-thick"
                    >
                        Cadastrar Local de descarga
                    </v-btn>

                     <v-btn color="#0D47A1"
                        width="514"
                        height="67"
                        rounded="xl"
                        variant="elevated"
                        prepend-icon="mdi-pencil"
                    >
                        Editar Cadastros
                    </v-btn>
                </div>
            </v-card>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">

</script>


<style scoped>
.text-h3 {
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 15px;
    font-style: normal;
}
</style>
