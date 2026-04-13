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
};

function normalizeText(value) {
  return String(value || '').trim();
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

  return normalized;
}
