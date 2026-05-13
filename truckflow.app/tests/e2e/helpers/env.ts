export const TEST_ENV = {
  apiBaseUrl: process.env.API_URL ?? "http://localhost:8080/v1",
  frontUrl: process.env.FRONT_URL ?? "http://localhost:5173",

  admin: {
    login: process.env.ADMIN_LOGIN ?? "admin@empresateste.com",
    password: process.env.ADMIN_PASSWORD ?? "TruckFlow@123",
  },
  motorista: {
    login: process.env.MOTORISTA_LOGIN ?? "gean.luca",
    password: process.env.MOTORISTA_PASSWORD ?? "!Maringa1",
  },

  seed: {
    // Fornecedor que tem planejamento ATIVO de Soja (FORNECEDOR TESTE LTDA)
    fornecedorId: "4a6abbab-0a58-497c-b5f2-1ab408bd6f60",
    fornecedorCnpj: "12345678000199",
    produtoSojaId: "17f805d4-18c4-48b3-84d7-b124d14852d2",
    produtoMilhoId: "61fb5ce1-1de1-4b22-abfd-a28abe615b13",
    // Algum local de descarga existente
    localDescargaId: "bf786016-f6c6-4b53-ab1f-36ffe86d664c",
  },
};
