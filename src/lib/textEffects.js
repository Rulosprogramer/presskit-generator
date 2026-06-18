// Efectos de texto para títulos/subtítulos/texto del presskit.
// Cada efecto devuelve un fragmento de estilo CSS inline.

export const TEXT_EFFECT_OPTIONS = [
  { id: 'none', label: 'Ninguno' },
  { id: 'fondo', label: 'Fondo' },
  { id: 'sombra', label: 'Sombra' },
  { id: 'neon', label: 'Neón' },
  { id: 'contorno', label: 'Contorno' },
];

// color = color del texto (para el efecto neón que brilla en su propio color)
export function getTextEffectStyle(effect, color = '#ffffff') {
  switch (effect) {
    case 'fondo':
      return {
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: '0.15em 0.6em',
        borderRadius: '0.5em',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      };
    case 'sombra':
      return { textShadow: '0 2px 10px rgba(0,0,0,0.65)' };
    case 'neon':
      return { textShadow: `0 0 6px ${color}, 0 0 14px ${color}, 0 0 26px ${color}` };
    case 'contorno':
      return {
        WebkitTextStrokeWidth: '1px',
        WebkitTextStrokeColor: 'rgba(0,0,0,0.7)',
        paintOrder: 'stroke fill',
      };
    case 'none':
    default:
      return {};
  }
}

// Versión para @react-pdf/renderer (no soporta text-shadow ni text-stroke).
// Solo el efecto "fondo" es replicable de forma fiel; el resto se ignora en el PDF real.
export function getPdfTextEffectStyle(effect) {
  switch (effect) {
    case 'fondo':
      return {
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 6,
      };
    case 'sombra':
    case 'neon':
    case 'contorno':
    case 'none':
    default:
      return {};
  }
}
