const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export const paraIso = (data: Date) =>
  `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;

export const deIso = (iso: string) => {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano!, (mes ?? 1) - 1, dia ?? 1);
};

export const formatarNumero = (valor: number, casas = 0) =>
  valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

export const formatarToneladas = (kg: number) => {
  const toneladas = kg / 1000;
  return `${formatarNumero(toneladas, toneladas >= 1000 ? 0 : 1)} t`;
};

export const formatarPct = (valor: number | null | undefined, casas = 1) =>
  valor === null || valor === undefined ? "—" : `${formatarNumero(valor, casas)}%`;

export const formatarDiaCurto = (iso: string) => {
  const data = deIso(iso);
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`;
};

export const descreverPeriodo = (inicioIso: string, fimIso: string) => {
  const inicio = deIso(inicioIso);
  const fim = deIso(fimIso);
  const mesmoAno = inicio.getFullYear() === fim.getFullYear();

  if (mesmoAno && inicio.getMonth() === fim.getMonth()) {
    return inicio.getDate() === fim.getDate()
      ? `${fim.getDate()} de ${MESES[fim.getMonth()]} ${fim.getFullYear()}`
      : `${inicio.getDate()} a ${fim.getDate()} de ${MESES[fim.getMonth()]} ${fim.getFullYear()}`;
  }

  const inicioTexto = `${inicio.getDate()} ${MESES[inicio.getMonth()]}${mesmoAno ? "" : ` ${inicio.getFullYear()}`}`;
  return `${inicioTexto} a ${fim.getDate()} ${MESES[fim.getMonth()]} ${fim.getFullYear()}`;
};
