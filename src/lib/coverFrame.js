// Modelo de encuadre de portada tipo crop editor (Instagram/Canva).
//
// Marco fijo (overflow:hidden). La imagen ORIGINAL completa se coloca dentro,
// dimensionada como un porcentaje del marco (scale) y desplazada (offsetX/offsetY).
// objectFit:'contain' preserva toda la información de la foto; el marco la recorta.
//
//  - scale: tamaño de la imagen relativo al marco. 1 = del tamaño del marco
//    (revela toda la foto, con bandas si el aspecto difiere). >1 = acercar.
//  - offsetX/offsetY: desplazamiento como fracción del marco (-1..1), desde el centro.
//
// La misma función produce los estilos para web, HTMLPreview y react-pdf,
// así el encuadre se ve idéntico en todos lados.

export const COVER_FRAME_DEFAULT = { scale: 1, offsetX: 0, offsetY: 0 };

export const COVER_SCALE_MIN = 1;
export const COVER_SCALE_MAX = 4;

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Lee los campos de encuadre del presskit (con compatibilidad hacia atrás).
export function normalizeCoverFrame(data = {}) {
  // Campo nuevo. Si no existe, intentamos derivar del modelo viejo (zoom) o usamos default.
  const hasNew = data.coverImageScale != null || data.coverImageOffsetX != null || data.coverImageOffsetY != null;
  if (!hasNew && data.coverImageZoom != null) {
    // Migración suave: el zoom viejo se aproxima a scale; posiciones 0-100 -> offset -0.5..0.5.
    const legacyScale = clamp(num(data.coverImageZoom, 1), COVER_SCALE_MIN, COVER_SCALE_MAX);
    const px = num(data.coverImagePositionX, 50);
    const py = num(data.coverImagePositionY, 50);
    return {
      scale: legacyScale,
      offsetX: clamp((50 - px) / 100, -1, 1),
      offsetY: clamp((50 - py) / 100, -1, 1),
    };
  }
  return {
    scale: clamp(num(data.coverImageScale, 1), COVER_SCALE_MIN, COVER_SCALE_MAX),
    offsetX: clamp(num(data.coverImageOffsetX, 0), -1, 1),
    offsetY: clamp(num(data.coverImageOffsetY, 0), -1, 1),
  };
}

// Estilo de la imagen interna dado el encuadre. El contenedor (marco) debe ser
// position:relative + overflow:hidden. Sirve tanto para CSS como para react-pdf.
export function coverFrameImageStyle({ scale, offsetX, offsetY }) {
  const sizePct = scale * 100;
  const left = (100 - sizePct) / 2 + offsetX * 100;
  const top = (100 - sizePct) / 2 + offsetY * 100;
  return {
    position: 'absolute',
    width: `${sizePct}%`,
    height: `${sizePct}%`,
    left: `${left}%`,
    top: `${top}%`,
    objectFit: 'contain',
  };
}

// Calcula el scale al que la imagen "cubre" exactamente el marco (sin bandas),
// dado el aspecto de la imagen (w/h) y del marco (w/h). Útil como valor inicial.
export function coverScaleFor(imageAspect, frameAspect) {
  if (!Number.isFinite(imageAspect) || !Number.isFinite(frameAspect) || imageAspect <= 0 || frameAspect <= 0) {
    return 1;
  }
  const s = imageAspect > frameAspect ? imageAspect / frameAspect : frameAspect / imageAspect;
  return clamp(s, COVER_SCALE_MIN, COVER_SCALE_MAX);
}

// Limita el desplazamiento para que el encuadre no deje la imagen totalmente fuera.
export function clampOffset(value, scale) {
  // Margen de paneo permitido: la mitad del exceso de la imagen sobre el marco.
  const maxPan = Math.max(0, (scale - 1) / 2) + 0.15;
  return clamp(value, -maxPan, maxPan);
}
