import { GoogleGenerativeAI } from '@google/generative-ai';

const styleGuides = {
  prensa: 'Tono editorial y profesional para medios, entrevistas y notas de prensa.',
  festival: 'Tono curatorial y escenico, enfocado en programadores y dossiers de festivales.',
  fanbase: 'Tono cercano y emocional, ideal para comunidad, redes y audiencia.',
  marca: 'Tono premium y estrategico, orientado a marcas, alianzas y patrocinios.',
};

const sectionRules = {
  twitterBio: 'Escribe solo una bio breve de maximo 140 caracteres.',
  shortBio: 'Escribe solo una bio corta en un parrafo.',
  longBio: 'Escribe solo una bio completa de 3 a 4 parrafos separados por doble salto de linea.',
  releaseCta: 'Escribe solo un texto final breve y poderoso para invitar a reproducir los releases de un artista en su EPK. Maximo 2 lineas.',
};

const milestoneCategoryRules = {
  digital: 'Enfocate en crecimiento, porcentajes o nichos. Si el numero es pequeno, resalta la velocidad de crecimiento o la presencia en ciudades estrategicas.',
  live: 'Resalta la consistencia y el prestigio de los lugares. Usa palabras como circuito, escena local, showcase o aforo completo.',
  press: 'Resalta el respaldo de terceros. Usa frases como Seleccion oficial, Destacado por, o Bajo la mirada de la critica especializada.',
  collaborations: 'Enfocate en la sinergia y el respaldo profesional. Si el colaborador es mas grande, usa Alianza estrategica o Bajo la produccion de.',
};

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeReleaseCta(value) {
  const normalized = normalizeText(value)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  const twoLines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join('\n');

  const compact = (twoLines || normalized).replace(/\s+/g, ' ').trim();
  const MAX_CHARS = 120;

  if (compact.length <= MAX_CHARS) {
    return compact;
  }

  return `${compact.slice(0, MAX_CHARS - 1).trim()}…`;
}

function normalizeMilestoneText(value) {
  const compact = normalizeText(value)
    .replace(/\r\n/g, ' ')
    .replace(/[“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!compact) {
    return '';
  }

  const sentence = compact.split(/(?<=[.!?])\s+/)[0] || compact;
  const words = sentence.split(/\s+/).filter(Boolean);

  if (words.length <= 15) {
    return sentence;
  }

  return `${words.slice(0, 15).join(' ')}…`;
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry({ prompt, retries = 4 }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Configuración faltante. Contacta al administrador.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash'
  });

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'text/plain',
          temperature: 0.7,
        },
      });

      const response = await result.response;
      const text = response.text();
      return text || '';
    } catch (error) {
      // Manejar errores de rate limit (429)
      if (error?.status === 429 && attempt < retries) {
        const backoffMs = Math.min(2000 * Math.pow(2, attempt), 30000);
        console.log(`Reintento ${attempt + 1}/${retries} en ${backoffMs}ms...`);
        await wait(backoffMs);
        continue;
      }

      if (error?.status === 429) {
        throw new Error('Has alcanzado el limite de solicitudes de IA. Por favor espera al menos 30 segundos e intenta de nuevo.');
      }

      if (error?.status === 403) {
        throw new Error('No está configurada correctamente la API de Gemini. Contacta al administrador.');
      }

      // En el último intento, lanzar error sanitizado
      if (attempt === retries) {
        const safeErrorMessage = 'Error al generar con IA. Por favor intenta de nuevo.';
        throw new Error(safeErrorMessage);
      }

      // En intentos anteriores, reintentar con backoff
      const backoffMs = Math.min(2000 * Math.pow(2, attempt), 30000);
      console.log(`Reintento ${attempt + 1}/${retries} en ${backoffMs}ms...`);
      await wait(backoffMs);
    }
  }

  throw new Error('No se pudo completar la solicitud de IA después de varios intentos.');
}

export async function generateBioSectionWithAI({ artistName, genre, city, recognitions, style, section, customPrompt }) {
  if (!sectionRules[section]) {
    throw new Error('Seccion de biografia no valida.');
  }

  // Si hay prompt personalizado (desde modal de chat), usarlo
  const prompt = customPrompt || [
    'Eres un copywriter musical experto en EPK para artistas independientes.',
    'Idioma: espanol neutro.',
    'Responde solo el texto final solicitado, sin comillas, sin markdown, sin etiquetas.',
    sectionRules[section],
    '',
    'Contexto del artista:',
    `- Nombre: ${artistName || 'Artista independiente'}`,
    `- Genero: ${genre || 'No especificado'}`,
    `- Ciudad: ${city || 'No especificada'}`,
    `- Reconocimientos o contexto: ${recognitions || 'Sin reconocimientos cargados'}`,
    `- Estilo solicitado: ${style || 'prensa'}`,
    `- Guia de estilo: ${styleGuides[style] || styleGuides.prensa}`,
    '',
    'Reglas:',
    '- Evita inventar premios enormes no mencionados.',
    '- Manten un tono profesional y util para EPK.',
  ].join('\n');

  const text = await callGeminiWithRetry({ prompt, retries: 4 });
  const normalized = normalizeText(text);

  if (section === 'twitterBio') {
    return normalized.slice(0, 140);
  }

  if (section === 'releaseCta') {
    return normalizeReleaseCta(normalized);
  }

  return normalized;
}

export async function generateArtistMilestoneWithAI({ artistName, genre, city, category, rawInput, customPrompt }) {
  if (!milestoneCategoryRules[category]) {
    throw new Error('Categoria de hitos no valida.');
  }

  const prompt = customPrompt || [
    'Eres un manager estrella y copywriter musical experto en EPK para artistas independientes.',
    'Tu trabajo es hacer upcycling: elevar el dato sin mentir.',
    'Idioma: espanol neutro.',
    'Devuelve solo la frase final, sin comillas, sin markdown, sin explicacion.',
    'Formato: una sola frase corta, maximo 15 palabras.',
    'Voz: activa y contundente. Evita el formato El artista ha hecho...',
    'Tecnica: empieza con un verbo de accion o un numero impactante.',
    '',
    `Categoria: ${category}`,
    milestoneCategoryRules[category],
    '',
    'Contexto del artista:',
    `- Nombre: ${artistName || 'Artista independiente'}`,
    `- Genero: ${genre || 'No especificado'}`,
    `- Ciudad: ${city || 'No especificada'}`,
    `- Dato bruto a elevar: ${rawInput || 'Sin dato cargado'}`,
    '',
    'Reglas:',
    '- No inventes premios, cifras ni alianzas que no existan.',
    '- Enfocate en elevar y sintetizar el dato cargado.',
  ].join('\n');

  const text = await callGeminiWithRetry({ prompt, retries: 4 });
  if (customPrompt) {
    return normalizeText(text);
  }

  return normalizeMilestoneText(text);
}
