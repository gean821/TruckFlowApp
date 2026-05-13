/**
 * Gera uma chave de acesso de NF-e com 44 dígitos numéricos.
 * Não é validada na SEFAZ (testes não chamam /validar-sefaz); só precisa ser única.
 *
 * Estrutura: cUF(2) + AAMM(4) + CNPJ(14) + Modelo(2) + Serie(3) + nNF(9) + tpEmis(1) + cNF(8) + cDV(1)
 */
export function gerarChaveNFRandomica(cnpjEmitente: string): string {
  const cUF = "41"; // PR
  const now = new Date();
  const AA = String(now.getFullYear() % 100).padStart(2, "0");
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const cnpj = cnpjEmitente.padStart(14, "0").slice(-14);
  const modelo = "55";
  const serie = "001";
  const nNF = String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, "0");
  const tpEmis = "1";
  const cNF = String(Math.floor(Math.random() * 100_000_000)).padStart(8, "0");

  const base = cUF + AA + MM + cnpj + modelo + serie + nNF + tpEmis + cNF;

  // dígito verificador módulo 11
  const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
  let soma = 0;
  for (let i = base.length - 1, p = 0; i >= 0; i--, p = (p + 1) % pesos.length) {
    soma += Number(base[i]) * pesos[p];
  }
  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;

  return base + String(dv);
}

export function gerarPlacaRandomica(): string {
  const letras = () => Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const numero = () => Math.floor(Math.random() * 10);
  return `${letras()}${numero()}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${numero()}${numero()}`;
}
