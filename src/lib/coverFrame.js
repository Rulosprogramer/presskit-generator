// Modelo de encuadre de portada tipo crop editor (Instagram/Canva).
//
// Marco fijo (overflow:hidden). La imagen ORIGINAL completa se coloca dentro,
// recortada por el marco. La escala parte de "cubrir el marco" (igual que antes):
//
//  - scale = 1  -> la imagen CUBRE el marco (llena el diseño, recorta lo que sobra).
//  - scale > 1  -> acercar (zoom in).
//  - scale < 1  -> alejar: revela más de la foto original (hasta verla completa).
//  - offsetX/offsetY: desplazamiento como fracción del marco (-1..1), desde el centro.
//
// Para que "scale = 1" cubra el marco en CUALQUIER renderer (editor, web, PDF)
// sin importar su relación de aspecto, calculamos la escala de cobertura a partir
// del aspecto de la imagen (imageAspect = ancho/alto) y del marco (frameAspect).
// La misma función produce los estilos para web, HTMLPreview y react-pdf.

export const COVER_FRAME_DEFAULT = { scale: 1, offsetX: 0, offsetY: 0 };

export const COVER_SCALE_MIN = 0.3; // alejar para revelar la foto completa
export const COVER_SCALE_MAX = 3;   // acercar

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Escala a la que la imagen "cubre" exactamente el marco (sin bandas).
export function coverScaleFor(imageAspect, frameAspect) {
  if (!Number.isFinite(imageAspect) || !Number.isFinite(frameAspect) || imageAspect <= 0 || frameAspect <= 0) {
    return 1;
  }
  return imageAspect > frameAspect ? imageAspect / frameAspect : frameAspect / imageAspect;
}

// Lee los campos de encuadre del presskit (con compatibilidad hacia atrás).
export function normalizeCoverFrame(data = {}) {
  const hasNew = data.coverImageScale != null || data.coverImageOffsetX != null || data.coverImageOffsetY != null;
  if (!hasNew && data.coverImageZoom != null) {
    // Migración suave desde el modelo viejo (zoom + position 0-100).
    const px = num(data.coverImagePositionX, 50);
    const py = num(data.coverImagePositionY, 50);
    return {
      scale: clamp(num(data.coverImageZoom, 1), COVER_SCALE_MIN, COVER_SCALE_MAX),
      offsetX: clamp((50 - px) / 100, -1, 1),
      offsetY: clamp((50 - py) / 100, -1, 1),
      imageAspect: num(data.coverImageAspect, 0),
    };
  }
  return {
    scale: clamp(num(data.coverImageScale, 1), COVER_SCALE_MIN, COVER_SCALE_MAX),
    offsetX: clamp(num(data.coverImageOffsetX, 0), -1, 1),
    offsetY: clamp(num(data.coverImageOffsetY, 0), -1, 1),
    imageAspect: num(data.coverImageAspect, 0),
  };
}

// Estilo de la imagen interna. El contenedor (marco) debe ser
// position:relative + overflow:hidden. Sirve para CSS y para react-pdf.
//   frameAspect = ancho/alto del marco de ESTE renderer.
export function coverFrameImageStyle({ scale = 1, offsetX = 0, offsetY = 0, imageAspect = 0, frameAspect = 0 }) {
  const hasAspect = imageAspect > 0 && frameAspect > 0;
  // base = escala que cubre el marco. Con ella, scale=1 llena el diseño.
  const base = hasAspect ? coverScaleFor(imageAspect, frameAspect) : 1;
  const display = base * clamp(num(scale, 1), COVER_SCALE_MIN, COVER_SCALE_MAX);
  const sizePct = display * 100;
  const left = (100 - sizePct) / 2 + num(offsetX, 0) * 100;
  const top = (100 - sizePct) / 2 + num(offsetY, 0) * 100;
  return {
    position: 'absolute',
    width: `${sizePct}%`,
    height: `${sizePct}%`,
    // Tailwind preflight pone max-width:100% a las imágenes; lo anulamos para
    // permitir que la imagen exceda el marco (esencial para el zoom/cobertura).
    maxWidth: 'none',
    maxHeight: 'none',
    left: `${left}%`,
    top: `${top}%`,
    // Con aspecto conocido usamos contain (revela foto completa al alejar);
    // sin aspecto, cover para llenar el diseño como fallback.
    objectFit: hasAspect ? 'contain' : 'cover',
  };
}

// Limita el desplazamiento para que el encuadre no deje la imagen fuera del marco.
export function clampOffset(value, scale) {
  const maxPan = Math.max(0, (clamp(num(scale, 1), COVER_SCALE_MIN, COVER_SCALE_MAX) - 1) / 2) + 0.2;
  return clamp(num(value, 0), -maxPan, maxPan);
}
