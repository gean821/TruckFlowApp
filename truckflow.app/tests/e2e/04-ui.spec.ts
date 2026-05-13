import { test, expect } from "@playwright/test";
import { TEST_ENV } from "./helpers/env";
import { loginAdmin, loginMotorista, newApi } from "./helpers/api";
import {
  buscarPlanejamentoComItem,
  criarAgendamentoDisponivel,
  criarNotaFiscal,
  getDashboard,
  getEmpresaAtual,
  getItemDoDashboard,
  listarVagasDisponiveis,
} from "./helpers/seed";

async function loginViaUi(page: any) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Usuário" }).fill(TEST_ENV.admin.login);
  await page.getByRole("textbox", { name: "Senha" }).fill(TEST_ENV.admin.password);
  await page.getByRole("button", { name: /acessar sistema/i }).click();
  await page.waitForURL(/\/(dashboard|visualizar|home)/i, { timeout: 15_000 });
}

test.describe("UI — dialog finalizar e tela de órfãos", () => {
  test("Admin finaliza operação via dialog editando peso real → recebimento atualiza", async ({ page }) => {
    // Setup via API: cria reserva e faz check-in pra agendamento ficar EmAndamento
    const adminToken = await loginAdmin();
    const motoristaToken = await loginMotorista();
    const apiAdmin = await newApi(adminToken);
    const apiMotorista = await newApi(motoristaToken);

    const { planejamentoId, itemId } = await buscarPlanejamentoComItem(
      apiAdmin,
      TEST_ENV.seed.produtoSojaId
    );

    const dashInicial = await getDashboard(apiAdmin, planejamentoId);
    const itemInicial = getItemDoDashboard(dashInicial, itemId);

    const PESO_NF = 15;
    const PESO_REAL = 14.2;

    const empresa = await getEmpresaAtual(apiAdmin, adminToken);
    const nf = await criarNotaFiscal(apiAdmin, {
      fornecedorId: TEST_ENV.seed.fornecedorId,
      fornecedorCnpj: TEST_ENV.seed.fornecedorCnpj,
      produtoId: TEST_ENV.seed.produtoSojaId,
      produtoDescricao: "Soja em Grão",
      pesoBruto: PESO_NF,
      cnpjDestinatario: empresa.cnpj ?? empresa.documento,
    });

    const agendCriado = await criarAgendamentoDisponivel(apiAdmin, {
      fornecedorId: TEST_ENV.seed.fornecedorId,
      produtoId: TEST_ENV.seed.produtoSojaId,
      localDescargaId: TEST_ENV.seed.localDescargaId,
    });

    const vagas = await listarVagasDisponiveis(apiMotorista, nf.chaveAcesso, {
      data: new Date(agendCriado.dataInicio),
      diasAFrente: 1,
    });
    const vaga = vagas.find((v: any) => v.id === agendCriado.id);
    expect(vaga).toBeTruthy();

    await apiMotorista.post(`${TEST_ENV.apiBaseUrl}/AgendamentoMotorista/reservar`, {
      data: {
        agendamentoId: vaga.id,
        notaFiscalChaveAcesso: nf.chaveAcesso,
        placaVeiculo: nf.placa,
        tipoVeiculo: 1,
      },
    });

    await apiAdmin.patch(`${TEST_ENV.apiBaseUrl}/AgendamentoAdmin/${vaga.id}/check-in`);

    await apiAdmin.dispose();
    await apiMotorista.dispose();

    // UI: admin loga e finaliza pelo dialog
    await loginViaUi(page);
    // Preset "proxima" cobre próximos 7 dias; nossa vaga está em 1-6 dias
    await page.goto(`/visualizar?periodo=proxima&search=${encodeURIComponent(nf.placa)}`);
    await page.waitForTimeout(1000); // debounce + query

    // Encontra a linha com a placa e clica no botão Finalizar Operação (mdi-check-all)
    const linha = page.locator(`tr:has-text("${nf.placa}")`).first();
    await expect(linha).toBeVisible({ timeout: 10_000 });
    await linha.locator('button:has(.mdi-check-all)').click();

    // Dialog deve abrir com peso pré-preenchido
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Finalizar Operação/)).toBeVisible();
    await expect(dialog.getByText(new RegExp(nf.placa))).toBeVisible();
    await expect(dialog.getByText(/Reservado \(NF\)/)).toBeVisible();

    // Edita o peso pro valor real — Vuetify renderiza como input[type=number]
    const inputPeso = dialog.locator('input[type="number"]');
    await inputPeso.click();
    await inputPeso.press("ControlOrMeta+a");
    await inputPeso.press("Delete");
    await inputPeso.type(String(PESO_REAL));
    await inputPeso.press("Tab"); // dispara blur pra sincronizar v-model.number

    const btnConfirmar = dialog.getByRole("button", { name: /confirmar recebimento/i });
    await expect(btnConfirmar).toBeEnabled({ timeout: 5_000 });
    await btnConfirmar.click();

    // Espera dialog fechar
    await expect(dialog).toBeHidden({ timeout: 15_000 });

    // Valida no backend que recebido subiu PESO_REAL (não PESO_NF) e reserva zerou
    const apiAdminFinal = await newApi(adminToken);
    const dashFinal = await getDashboard(apiAdminFinal, planejamentoId);
    const itemFinal = getItemDoDashboard(dashFinal, itemId);

    expect(itemFinal.quantidadeTotalRecebida).toBeCloseTo(
      itemInicial.quantidadeTotalRecebida + PESO_REAL,
      2
    );
    expect(itemFinal.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada, 2);
    await apiAdminFinal.dispose();
  });

  test("Tela de Recebimentos Órfãos carrega paginada com search funcional", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await loginViaUi(page);
    await page.goto("/recebimentos-orfaos");

    await expect(page.getByRole("heading", { name: /Recebimentos órfãos/i })).toBeVisible({
      timeout: 10_000,
    });

    // Search field existe e responde a interação (debounce dispara recarga)
    const search = page.getByLabel(/buscar/i).first();
    await expect(search).toBeVisible();
    await search.fill("qualquer-coisa-inexistente");
    await page.waitForTimeout(500);

    // Tabela carrega — pode estar vazia ou ter resultados; ambos são OK,
    // o importante é não ter quebrado.
    await expect(page.locator(".v-table").first()).toBeVisible();

    expect(consoleErrors, `Erros console: ${consoleErrors.join("\n")}`).toEqual([]);
  });
});
