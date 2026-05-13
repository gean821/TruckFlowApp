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

test.describe("Fluxo de recebimento via API", () => {
  test("Motorista reserva → admin finaliza com peso da NF → saldo desconta corretamente", async () => {
    const adminToken = await loginAdmin();
    const motoristaToken = await loginMotorista();

    const apiAdmin = await newApi(adminToken);
    const apiMotorista = await newApi(motoristaToken);

    // 1) Resolve planejamento ativo do produto Soja
    const { planejamentoId, itemId } = await buscarPlanejamentoComItem(
      apiAdmin,
      TEST_ENV.seed.produtoSojaId
    );

    // 2) Snapshot inicial
    const dashInicial = await getDashboard(apiAdmin, planejamentoId);
    const itemInicial = getItemDoDashboard(dashInicial, itemId);

    // 3) Cria NF nova com peso conhecido (em toneladas — unidade do sistema)
    const PESO = 25;
    const empresa = await getEmpresaAtual(apiAdmin, adminToken);
    const nf = await criarNotaFiscal(apiAdmin, {
      fornecedorId: TEST_ENV.seed.fornecedorId,
      fornecedorCnpj: TEST_ENV.seed.fornecedorCnpj,
      produtoId: TEST_ENV.seed.produtoSojaId,
      produtoDescricao: "Soja em Grão",
      pesoBruto: PESO,
      cnpjDestinatario: empresa.cnpj ?? empresa.documento,
    });

    // 4) Garante uma vaga Disponivel do fornecedor com planejamento ativo
    const agendCriado = await criarAgendamentoDisponivel(apiAdmin, {
      fornecedorId: TEST_ENV.seed.fornecedorId,
      produtoId: TEST_ENV.seed.produtoSojaId,
      localDescargaId: TEST_ENV.seed.localDescargaId,
    });

    // Motorista lista vagas disponíveis pra essa NF
    // Consulta /disponiveis exatamente no dia do agendamento criado
    const vagas = await listarVagasDisponiveis(apiMotorista, nf.chaveAcesso, {
      data: new Date(agendCriado.dataInicio),
      diasAFrente: 1,
    });
    const vaga = vagas.find((v: any) => v.id === agendCriado.id);
    expect(vaga, `vaga ${agendCriado.id} (data ${agendCriado.dataInicio}) deveria aparecer em /disponiveis. Vagas: ${JSON.stringify(vagas.map((v: any) => ({ id: v.id, data: v.horarioInicio })))}`).toBeTruthy();

    // 5) Motorista reserva
    const reservarUrl = `${TEST_ENV.apiBaseUrl}/AgendamentoMotorista/reservar`;
    const reservarResp = await apiMotorista.post(reservarUrl, {
      data: {
        agendamentoId: vaga.id,
        notaFiscalChaveAcesso: nf.chaveAcesso,
        placaVeiculo: nf.placa,
        tipoVeiculo: 1,
      },
    });
    expect(reservarResp.ok(), `Reservar deveria 200, veio ${reservarResp.status()} ${await reservarResp.text()}`).toBe(true);

    // 6) Snapshot intermediário — saldo desceu, reservado subiu
    const dashReservado = await getDashboard(apiAdmin, planejamentoId);
    const itemReservado = getItemDoDashboard(dashReservado, itemId);

    expect(itemReservado.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada + PESO, 2);
    expect(itemReservado.faltaReceber).toBeCloseTo(itemInicial.faltaReceber - PESO, 2);

    // 7) Admin: check-in (status → EmAndamento)
    const checkInUrl = `${TEST_ENV.apiBaseUrl}/AgendamentoAdmin/${vaga.id}/check-in`;
    const checkInResp = await apiAdmin.patch(checkInUrl);
    expect(checkInResp.ok(), `Check-in: ${checkInResp.status()} ${await checkInResp.text()}`).toBe(true);

    // 8) Admin: finalizar com peso igual ao reservado (caso normal)
    const finalizarUrl = `${TEST_ENV.apiBaseUrl}/AgendamentoAdmin/${vaga.id}/finalizar`;
    const finalizarResp = await apiAdmin.post(finalizarUrl, { data: PESO });
    expect(finalizarResp.ok(), `Finalizar: ${finalizarResp.status()} ${await finalizarResp.text()}`).toBe(true);

    // 9) Snapshot final — reservado volta ao inicial, recebido subiu PESO
    const dashFinal = await getDashboard(apiAdmin, planejamentoId);
    const itemFinal = getItemDoDashboard(dashFinal, itemId);

    expect(itemFinal.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada, 2);
    expect(itemFinal.quantidadeTotalRecebida).toBeCloseTo(itemInicial.quantidadeTotalRecebida + PESO, 2);

    await apiAdmin.dispose();
    await apiMotorista.dispose();
  });

  test("Finalizar com peso diferente (ajuste de balança) atualiza recebido pelo valor real", async () => {
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

    const PESO_NF = 30;
    const PESO_REAL = 28.5; // balança mediu 1.5T a menos

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

    // Consulta /disponiveis exatamente no dia do agendamento criado
    const vagas = await listarVagasDisponiveis(apiMotorista, nf.chaveAcesso, {
      data: new Date(agendCriado.dataInicio),
      diasAFrente: 1,
    });
    const vaga = vagas.find((v: any) => v.id === agendCriado.id);
    expect(vaga, `vaga ${agendCriado.id} (data ${agendCriado.dataInicio}) deveria aparecer em /disponiveis. Vagas: ${JSON.stringify(vagas.map((v: any) => ({ id: v.id, data: v.horarioInicio })))}`).toBeTruthy();

    await apiMotorista.post(`${TEST_ENV.apiBaseUrl}/AgendamentoMotorista/reservar`, {
      data: {
        agendamentoId: vaga.id,
        notaFiscalChaveAcesso: nf.chaveAcesso,
        placaVeiculo: nf.placa,
        tipoVeiculo: 1,
      },
    });

    await apiAdmin.patch(`${TEST_ENV.apiBaseUrl}/AgendamentoAdmin/${vaga.id}/check-in`);

    const finalizarResp = await apiAdmin.post(
      `${TEST_ENV.apiBaseUrl}/AgendamentoAdmin/${vaga.id}/finalizar`,
      { data: PESO_REAL }
    );
    expect(finalizarResp.ok()).toBe(true);

    const dashFinal = await getDashboard(apiAdmin, planejamentoId);
    const itemFinal = getItemDoDashboard(dashFinal, itemId);

    // Recebido sobe pelo PESO_REAL (não pelo PESO_NF). Reserva volta ao inicial.
    expect(itemFinal.quantidadeTotalRecebida).toBeCloseTo(itemInicial.quantidadeTotalRecebida + PESO_REAL, 2);
    expect(itemFinal.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada, 2);

    await apiAdmin.dispose();
    await apiMotorista.dispose();
  });
});
