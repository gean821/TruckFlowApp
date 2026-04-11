<div align="center">
  
  # 🚚 TruckFlow Frontend
  **Plataforma de Gestão Logística, Agendamento de Docas e Controle de Pátio**

</div>

---

## 📖 Sobre o Projeto

O **TruckFlow** é uma solução para otimização logística, focada em conectar fornecedores, transportadoras e a operação interna (portaria e docas). O sistema gerencia todo o ciclo de vida do recebimento de cargas, mitigando o tempo de espera (Demurrage) e aumentando a eficiência operacional do pátio.

### ✨ Principais Módulos

- **Gestão Cadastral:** Controle completo de **Empresas**, **Fornecedores**, **Produtos**, **Locais de Descarga** e **Unidades de Entrega**.
- **Gestão de Recebimentos:** Administração de contratos de entrega e metas diárias (cadência) por fornecedor e produto.
- **Agendamento e Grades:** Configuração de grades de horários disponíveis nas docas e interface para agendamento por parte das transportadoras/fornecedores.
- **Operação e Monitoramento:** Painel de controle em tempo real para a portaria realizar operações de Check-in, Check-out e acompanhamento de status.
- **Dashboard e Relatórios:** Indicadores de desempenho (KPIs), taxa de ocupação e volume de carga.

---

## 🛠️ Stack Tecnológica

A aplicação foi construída com as melhores práticas do ecossistema Front-end moderno, garantindo escalabilidade, reatividade e fácil manutenção.

- **Vue 3 (Composition API)**: Framework reativo utilizado para a construção das interfaces, utilizando `<script setup>` para componentes mais limpos.
- **TypeScript**: Tipagem estática para todo o código, garantindo contratos estritos (Interfaces/DTOs) entre o Front-end e a API.
- **Vuetify 3**: Biblioteca oficial de componentes UI baseada no Material Design, garantindo consistência visual e acessibilidade.
- **TanStack Query (Vue Query)**: Gerenciamento de estado assíncrono. Utilizado para buscar, realizar cache, sincronizar e atualizar dados da API (ex: `useGradeQuery`, `useMutation`), simplificando o *data-fetching*.
- **Pinia**: Gerenciamento de estado global. Utilizado para manter estados síncronos e regras de negócio no lado do cliente (ex: Autenticação, dados do usuário logado, carrinhos temporários).
- **Vite**: *Bundler* ultrarrápido para ambiente de desenvolvimento e geração do *build* de produção.

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura baseada em separação de responsabilidades (SoC), dividida nas seguintes camadas principais:

- **`src/views/`**: Páginas roteáveis da aplicação (Containers principais).
- **`src/components/`**: Componentes de UI reutilizáveis (Modais, Tabelas, Formulários).
- **`src/services/`**: Camada de integração HTTP com o Back-end (Axios/Fetch). Isola as chamadas de API dos componentes.
- **`src/stores/`**: Gerenciadores de estado (Pinia) para regras de negócios e armazenamento de longo prazo.
- **`src/hooks/` & `src/queries/`**: *Composables* do Vue e abstrações do TanStack Query para encapsular a lógica de mutações e buscas de dados, entregando estado reativo (`isLoading`, `data`, `error`) direto para a View.
- **`src/Dtos/` & `src/entities/`**: Definições de tipagem do TypeScript, espelhando os contratos de dados do Back-end.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão LTS recomendada, 18.x ou superior)
- **NPM** ou **Yarn**

### 1. Configuração de Variáveis de Ambiente

Na raiz do projeto, crie um arquivo `.env` (ou `.env.local`) copiando a estrutura base do projeto. Exemplo de configuração:

```env
# .env
VITE_API_URL=http://localhost:7100/api
VITE_APP_TITLE=TruckFlow
```
*(Ajuste a `VITE_API_URL` para o endereço local onde sua API Back-end está rodando).*

### 2. Instalação e Execução

Instale as dependências do projeto:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### 3. Build para Produção

Para compilar o código minificado e otimizado para produção:
```bash
npm run build
```
O resultado será gerado na pasta `/dist`.

### 4. Testes

Para executar a suíte de testes unitários (Vitest):
```bash
npm run test:unit
```

---

## 🤝 Padrões de Contribuição

- **Branching:** `feature/nome-da-feature`, `bugfix/nome-do-bug`, `hotfix/nome-do-hotfix`.
- **Commits:** Siga o padrão *Conventional Commits* (ex: `feat: adiciona modulo de recebimentos`, `fix: corrige validacao do modal de agendamento`).
