// Typography system for different artist styles
export const typefaces = {
  urbano: {
    id: 'urbano',
    name: 'Urbano',
    label: 'Urbano',
    description: 'Sans Serif Extra Bold o Black, muy geométrica o industrial',
    examples: 'Impact, Montserrat Black, Bebas Neue, Stencil',
    fontFamily: "'Bebas Neue', 'Montserrat Black', sans-serif",
    fontStack: "font-['BebasNeue']",
    fallback: 'sans-serif',
    weights: {
      heading: '900',
      body: '700',
    },
    letterSpacing: '0.08em',
    lineHeight: '1.1',
    primaryFont: 'Bebas Neue',
  },
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    label: 'Neutral',
    description: 'Neo-Grotesque Sans Serif con grosores uniformes',
    examples: 'Inter, Roboto, Helvetica Now, Open Sans',
    fontFamily: "'Inter', 'Roboto', sans-serif",
    fontStack: "font-['Inter']",
    fallback: 'sans-serif',
    weights: {
      heading: '700',
      body: '400',
    },
    letterSpacing: '0.02em',
    lineHeight: '1.5',
    primaryFont: 'Inter',
  },
  regional: {
    id: 'regional',
    name: 'Regional',
    label: 'Regional / Popular',
    description: 'Serif Clásica o Display con remates marcados',
    examples: 'Playfair Display, Bodoni, Cinzel, Copperplate',
    fontFamily: "'Playfair Display', serif",
    fontStack: "font-['PlayfairDisplay']",
    fallback: 'serif',
    weights: {
      heading: '700',
      body: '400',
    },
    letterSpacing: '0.01em',
    lineHeight: '1.3',
    primaryFont: 'Playfair Display',
  },
  alternativo: {
    id: 'alternativo',
    name: 'Alternativo',
    label: 'Alternativo / Indie',
    description: 'Serif moderna, Vintage 70s, o con distorsiones sutiles',
    examples: 'Cormorant Garamond, Syne, Archivo Black, Typewriter',
    fontFamily: "'Cormorant Garamond', 'Syne', serif",
    fontStack: "font-['CormorantGaramond']",
    fallback: 'serif',
    weights: {
      heading: '600',
      body: '400',
    },
    letterSpacing: '0.03em',
    lineHeight: '1.4',
    primaryFont: 'Cormorant Garamond',
  },
  script: {
    id: 'script',
    name: 'Script',
    label: 'Script / Elegante',
    description: 'Caligrafía moderna o Handwriting fluida',
    examples: 'Great Vibes, Rochester, Homemade Apple',
    fontFamily: "'Great Vibes', cursive",
    fontStack: "font-['GreatVibes']",
    fallback: 'cursive',
    weights: {
      heading: '400',
      body: '400',
    },
    letterSpacing: '0.02em',
    lineHeight: '1.6',
    primaryFont: 'Great Vibes',
  },
};

// Get typeface by ID
export function getTypeface(typefaceId = 'neutral') {
  return typefaces[typefaceId] || typefaces.neutral;
}

// Get CSS font-family string
export function getTypefaceFontFamily(typefaceId = 'neutral') {
  const typeface = getTypeface(typefaceId);
  return typeface.fontFamily;
}

// Get inline style object for a typeface
export function getTypefaceStyles(typefaceId = 'neutral', weight = 'body') {
  const typeface = getTypeface(typefaceId);
  return {
    fontFamily: typeface.fontFamily,
    fontWeight: typeface.weights[weight],
    letterSpacing: typeface.letterSpacing,
    lineHeight: typeface.lineHeight,
  };
}

// Get all typeface options for UI
export function getTypefaceOptions() {
  return Object.values(typefaces).map((tf) => ({
    id: tf.id,
    name: tf.name,
    label: tf.label,
    description: tf.description,
    examples: tf.examples,
  }));
}

// CSS to inject for fonts (fallback for direct usage)
export function getTypefaceCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
  `;
}
