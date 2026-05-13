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

test.describe("Estorno de reserva", () => {
  test("Admin cancela agendamento reservado → reserva é estornada e saldo volta", async () => {
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

    const PESO = 20;
    const empresa = await getEmpresaAtual(apiAdmin, adminToken);
    const nf = await criarNotaFiscal(apiAdmin, {
      fornecedorId: TEST_ENV.seed.fornecedorId,
      fornecedorCnpj: TEST_ENV.seed.fornecedorCnpj,
      produtoId: TEST_ENV.seed.produtoSojaId,
      produtoDescricao: "Soja em Grão",
      pesoBruto: PESO,
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

    // Motorista reserva
    await apiMotorista.post(`${TEST_ENV.apiBaseUrl}/AgendamentoMotorista/reservar`, {
      data: {
        agendamentoId: vaga.id,
        notaFiscalChaveAcesso: nf.chaveAcesso,
        placaVeiculo: nf.placa,
        tipoVeiculo: 1,
      },
    });

    const dashAposReserva = await getDashboard(apiAdmin, planejamentoId);
    const itemAposReserva = getItemDoDashboard(dashAposReserva, itemId);
    expect(itemAposReserva.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada + PESO, 2);

    // Admin cancela
    const cancelResp = await apiAdmin.patch(
      `${TEST_ENV.apiBaseUrl}/AgendamentoAdmin/${vaga.id}/cancelar`
    );
    expect(cancelResp.ok(), `Cancelar: ${cancelResp.status()} ${await cancelResp.text()}`).toBe(true);

    // Saldo volta ao inicial — reserva estornada
    const dashFinal = await getDashboard(apiAdmin, planejamentoId);
    const itemFinal = getItemDoDashboard(dashFinal, itemId);

    expect(itemFinal.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada, 2);
    expect(itemFinal.quantidadeTotalRecebida).toBeCloseTo(itemInicial.quantidadeTotalRecebida, 2);

    await apiAdmin.dispose();
    await apiMotorista.dispose();
  });

  test("Reserva > saldo disponível devolve 400 amigável", async () => {
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

    // Peso muito acima do saldo disponível
    const PESO_EXCEDENTE =
      itemInicial.quantidadeTotalPlanejada +
      itemInicial.toleranciaExtra -
      itemInicial.quantidadeTotalRecebida -
      itemInicial.quantidadeReservada +
      100; // garante estouro

    const empresa = await getEmpresaAtual(apiAdmin, adminToken);
    const nf = await criarNotaFiscal(apiAdmin, {
      fornecedorId: TEST_ENV.seed.fornecedorId,
      fornecedorCnpj: TEST_ENV.seed.fornecedorCnpj,
      produtoId: TEST_ENV.seed.produtoSojaId,
      produtoDescricao: "Soja em Grão",
      pesoBruto: PESO_EXCEDENTE,
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

    const reservarResp = await apiMotorista.post(
      `${TEST_ENV.apiBaseUrl}/AgendamentoMotorista/reservar`,
      {
        data: {
          agendamentoId: vaga.id,
          notaFiscalChaveAcesso: nf.chaveAcesso,
          placaVeiculo: nf.placa,
          tipoVeiculo: 1,
        },
      }
    );

    expect(reservarResp.status()).toBe(400);
    const body = await reservarResp.json();
    expect(body.message ?? body.errors?.[0]).toMatch(/excede o saldo dispon[íi]vel/i);

    // Garante que nada vazou no dashboard
    const dashFinal = await getDashboard(apiAdmin, planejamentoId);
    const itemFinal = getItemDoDashboard(dashFinal, itemId);
    expect(itemFinal.quantidadeReservada).toBeCloseTo(itemInicial.quantidadeReservada, 2);

    await apiAdmin.dispose();
    await apiMotorista.dispose();
  });
});
