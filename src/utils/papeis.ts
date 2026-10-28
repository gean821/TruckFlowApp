export const formatarPapeis = (papeis: unknown, vazio = "—") => {
  const lista = (Array.isArray(papeis) ? papeis : typeof papeis === "string" && papeis.startsWith("[") ? tentarLista(papeis) : [papeis])
    .filter((p): p is string => typeof p === "string" && p.length > 0);
  return lista.length ? lista.join(" • ") : vazio;
};

const tentarLista = (texto: string): unknown[] => {
  try {
    const valor = JSON.parse(texto);
    return Array.isArray(valor) ? valor : [texto];
  } catch {
    return [texto];
  }
};
