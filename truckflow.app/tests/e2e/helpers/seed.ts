import { type APIRequestContext } from "@playwright/test";
import { TEST_ENV } from "./env";
import { gerarChaveNFRandomica, gerarPlacaRandomica } from "./nf";

export function decodeJwt(token: string): any {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
}

export async function getEmpresaAtual(apiAdmin: APIRequestContext, adminToken: string) {
  const claims = decodeJwt(adminToken);
  const empresaId = claims.EmpresaId ?? claims.empresaId;
  if (!empresaId) throw new Error("EmpresaId não encontrado no JWT admin.");
  const url = `${TEST_ENV.apiBaseUrl}/Empresa/${empresaId}`;
  const resp = await apiAdmin.get(url);
  if (!resp.ok()) {
    throw new Error(`GET Empresa falhou: ${resp.status()} ${await resp.text()}`);
  }
  return await resp.json();
}

export interface NotaCriada {
  chaveAcesso: string;
  pesoBruto: number;
  produtoId: string;
  fornecedorId: string;
  placa: string;
}

/**
 * Cria uma NF nova diretamente via /NotaFiscal/save com payload mock.
 * Chave randômica para evitar conflito entre runs.
 */
export async function criarNotaFiscal(
  apiAdmin: APIRequestContext,
  opts: {
    fornecedorId: string;
    fornecedorCnpj: string;
    produtoId: string;
    produtoDescricao: string;
    pesoBruto: number;
    valorTotal?: number;
    cnpjDestinatario?: string;
  }
): Promise<NotaCriada> {
  const chaveAcesso = gerarChaveNFRandomica(opts.fornecedorCnpj);
  const placa = gerarPlacaRandomica();

  const dto = {
    chaveAcesso,
    numero: Number(chaveAcesso.slice(25, 34)),
    fornecedor: "FORNECEDOR TESTE",
    fornecedorId: opts.fornecedorId,
    serie: "1",
    // 1 dia atrás absorve qualquer divergência de fuso entre cliente e servidor (validator usa DateTime.Now local).
    dataEmissao: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    emitenteNome: "FORNECEDOR TESTE",
    emitenteCnpj: opts.fornecedorCnpj,
    destinatarioNome: "EMPRESA TESTE",
    destinatarioCpfCnpj: opts.cnpjDestinatario ?? "00000000000000",
    valorTotal: opts.valorTotal ?? 10_000,
    pesoBruto: opts.pesoBruto,
    volumeQuantidade: 1,
    placaVeiculo: placa,
    tipoCarga: 0,
    itens: [
      {
        codigo: "1",
        descricao: opts.produtoDescricao,
        ean: null,
        produtoSistemaId: opts.produtoId,
        produtoSistemaNome: opts.produtoDescricao,
        quantidade: opts.pesoBruto,
        unidade: "KG",
        valorUnitario: 1,
        valorTotal: opts.pesoBruto,
      },
    ],
  };

  const url = `${TEST_ENV.apiBaseUrl}/NotaFiscal/save`;
  const resp = await apiAdmin.post(url, { data: dto });
  if (!resp.ok()) {
    throw new Error(
      `Criar NF falhou em ${url}: ${resp.status()} ${await resp.text()}`
    );
  }

  return {
    chaveAcesso,
    pesoBruto: opts.pesoBruto,
    produtoId: opts.produtoId,
    fornecedorId: opts.fornecedorId,
    placa,
  };
}

/**
 * Lista o primeiro planejamento ativo (status Planejado ou EmAndamento)
 * que tenha um item do produto desejado e que tenha saldo disponível.
 */
export async function buscarPlanejamentoComItem(
  apiAdmin: APIRequestContext,
  produtoId: string
): Promise<{ planejamentoId: string; itemId: string }> {
  const url = `${TEST_ENV.apiBaseUrl}/PlanejamentoRecebimento?pageSize=50`;
  const resp = await apiAdmin.get(url);
  if (!resp.ok()) {
    throw new Error(
      `Listar planejamentos falhou em ${url}: ${resp.status()} ${await resp.text()}`
    );
  }
  const body = await resp.json();
  const items: any[] = body.items ?? [];

  for (const p of items) {
    if (p.status === "Encerrado" || p.status === "Concluido") continue;
    const item = (p.itens ?? []).find((i: any) => {
      // o response não tem produtoId; matching via nome é frágil
      // tentamos por todas as estratégias
      return (
        i.produtoId === produtoId ||
        (i.produto && i.produto.toLowerCase().includes("soja") && produtoId.startsWith("17f805d4")) ||
        (i.produto && i.produto.toLowerCase().includes("milho") && produtoId.startsWith("61fb5ce1"))
      );
    });
    if (item) {
      return { planejamentoId: p.id, itemId: item.id };
    }
  }

  throw new Error(`Nenhum planejamento ativo com item do produto ${produtoId}.`);
}

export async function getDashboard(
  apiAdmin: APIRequestContext,
  planejamentoId: string
): Promise<any> {
  const url = `${TEST_ENV.apiBaseUrl}/PlanejamentoRecebimento/${planejamentoId}/dashboard`;
  const resp = await apiAdmin.get(url);
  if (!resp.ok()) {
    throw new Error(
      `Dashboard falhou em ${url}: ${resp.status()} ${await resp.text()}`
    );
  }
  return await resp.json();
}

export function getItemDoDashboard(dashboard: any, itemId: string): any {
  const item = dashboard.itens.find((i: any) => i.id === itemId);
  if (!item) throw new Error(`Item ${itemId} não encontrado no dashboard.`);
  return item;
}

/**
 * Cria um agendamento avulso Disponivel (sem motorista nem placa) para o teste reservar.
 * Janela curta (30 min) num horário futuro, evitando conflito de doca.
 */
export async function criarAgendamentoDisponivel(
  apiAdmin: APIRequestContext,
  opts: {
    fornecedorId: string;
    produtoId: string;
    localDescargaId: string;
    minutosAFrente?: number;
  }
): Promise<{ id: string; dataInicio: string }> {
  // Janela aleatória nos próximos 2-10 dias (dentro do range que listarVagasDisponiveis varre),
  // horário comercial, minuto aleatório pra reduzir colisão de doca.
  // Retry com novo horário se houver conflito.
  const url = `${TEST_ENV.apiBaseUrl}/AgendamentoAdmin`;
  const maxTentativas = 6;
  let ultimaResposta = "";

  for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
    const dataInicio = new Date();
    if (opts.minutosAFrente !== undefined) {
      dataInicio.setTime(Date.now() + opts.minutosAFrente * 60 * 1000);
    } else {
      // 1-6 dias à frente: cobre preset "Próx. 7" do front e range de 14 dias do app motorista
      const diasAFrente = 1 + Math.floor(Math.random() * 6);
      dataInicio.setDate(dataInicio.getDate() + diasAFrente);
      const hora = 6 + Math.floor(Math.random() * 12);
      const minuto = Math.floor(Math.random() * 60);
      dataInicio.setUTCHours(hora, minuto, 0, 0);
    }
    const dataFim = new Date(dataInicio.getTime() + 20 * 60 * 1000);

    const dto = {
      fornecedorId: opts.fornecedorId,
      produtoId: opts.produtoId,
      tipoCarga: 0,
      localDescargaId: opts.localDescargaId,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      volumeCarga: 0,
    };

    const resp = await apiAdmin.post(url, { data: dto });
    if (resp.ok()) {
      const body = await resp.json();
      return { id: body.id, dataInicio: body.dataInicio };
    }
    ultimaResposta = `${resp.status()} ${await resp.text()}`;
    // Se for conflito de doca, tenta outro horário; senão aborta cedo
    if (opts.minutosAFrente !== undefined || !ultimaResposta.includes("Conflito")) {
      break;
    }
  }

  throw new Error(
    `Criar agendamento avulso falhou em ${url} após ${maxTentativas} tentativas: ${ultimaResposta}`
  );
}

/**
 * Lista vagas disponíveis pro motorista a partir de uma chave de NF salva.
 * Varre N dias a partir da data informada (default: hoje) até encontrar vagas ou esgotar.
 */
export async function listarVagasDisponiveis(
  apiMotorista: APIRequestContext,
  chaveAcesso: string,
  opts?: { data?: Date; diasAFrente?: number }
): Promise<any[]> {
  const startData = opts?.data ?? new Date();
  const dias = opts?.diasAFrente ?? 14;

  for (let i = 0; i <= dias; i++) {
    const d = new Date(startData);
    d.setDate(d.getDate() + i);
    const dataParam = d.toISOString().slice(0, 10);
    const url = `${TEST_ENV.apiBaseUrl}/AgendamentoMotorista/disponiveis?chaveAcesso=${chaveAcesso}&data=${dataParam}`;
    const resp = await apiMotorista.get(url);
    if (!resp.ok()) {
      throw new Error(
        `Listar vagas falhou em ${url}: ${resp.status()} ${await resp.text()}`
      );
    }
    const vagas = await resp.json();
    if (Array.isArray(vagas) && vagas.length > 0) return vagas;
  }
  return [];
}
