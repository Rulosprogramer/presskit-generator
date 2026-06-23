// Abrevia métricas grandes (streams, views) para que no se desborden en el PDF.
// Reglas:
//  - Si el usuario ya lo escribió abreviado (contiene letras o "+"), se respeta.
//  - >= 1,000,000  -> "1.2M+" (un decimal bajo 10M, entero arriba)
//  - >= 10,000     -> "40k+"  (5+ cifras)
//  - Números menores se dejan tal cual.
export function abbreviateMetric(raw) {
  if (raw == null) return raw;
  const str = String(raw).trim();
  if (!str) return str;

  // Ya viene abreviado o con texto (k, m, +, etc.): respetar.
  if (/[a-zA-Z+]/.test(str)) return str;

  // Quita separadores de miles (coma, punto, espacio).
  const digits = str.replace(/[.,\s]/g, '');
  if (!/^\d+$/.test(digits)) return str; // no es un número plano

  const n = parseInt(digits, 10);
  if (!Number.isFinite(n)) return str;

  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const val = m >= 10 ? Math.floor(m) : Math.floor(m * 10) / 10;
    return `${val}M+`;
  }
  if (n >= 10_000) {
    return `${Math.floor(n / 1000)}k+`;
  }
  return str;
}
