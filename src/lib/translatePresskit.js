import { GoogleGenerativeAI } from '@google/generative-ai';

const LANG_NAMES = { en: 'English', fr: 'French' };

// Fields that are pure text and should be translated
const TEXT_FIELDS = ['twitterBio', 'bio', 'longBio', 'releasesCtaText'];

function buildPayload(data) {
  const payload = {};

  // Simple text fields
  for (const field of TEXT_FIELDS) {
    if (data[field]) payload[field] = data[field];
  }

  // Milestones: flat object of arrays
  const milestones = data.artistMilestones || {};
  const milestoneFlat = {};
  for (const [cat, items] of Object.entries(milestones)) {
    if (Array.isArray(items)) {
      items.forEach((item, i) => {
        if (item) milestoneFlat[`milestone_${cat}_${i}`] = item;
      });
    }
  }
  if (Object.keys(milestoneFlat).length) payload._milestones = milestoneFlat;

  // Recognitions
  const recs = Array.isArray(data.recognitions)
    ? data.recognitions.filter(Boolean)
    : (data.recognitions || '').split('\n').map(s => s.trim()).filter(Boolean);
  if (recs.length) payload._recognitions = recs;

  // Release descriptions
  if (Array.isArray(data.releases)) {
    const relDesc = {};
    data.releases.forEach((r, i) => {
      if (r?.description) relDesc[`release_${i}_desc`] = r.description;
    });
    if (Object.keys(relDesc).length) payload._releases = relDesc;
  }

  return payload;
}

function applyTranslated(originalData, translated) {
  const result = { ...originalData };

  for (const field of TEXT_FIELDS) {
    if (translated[field]) result[field] = translated[field];
  }

  // Milestones
  if (translated._milestones) {
    const milestones = JSON.parse(JSON.stringify(originalData.artistMilestones || {}));
    for (const [key, value] of Object.entries(translated._milestones)) {
      const match = key.match(/^milestone_(.+)_(\d+)$/);
      if (match) {
        const [, cat, idx] = match;
        if (Array.isArray(milestones[cat])) milestones[cat][Number(idx)] = value;
      }
    }
    result.artistMilestones = milestones;
  }

  // Recognitions
  if (translated._recognitions) {
    result.recognitions = translated._recognitions;
  }

  // Releases
  if (translated._releases) {
    const releases = (originalData.releases || []).map((r, i) => {
      const desc = translated._releases[`release_${i}_desc`];
      return desc ? { ...r, description: desc } : r;
    });
    result.releases = releases;
  }

  return result;
}

export async function translatePresskit(data, langCode) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY no configurada.');

  const langName = LANG_NAMES[langCode];
  if (!langName) throw new Error(`Idioma no soportado: ${langCode}`);

  const payload = buildPayload(data);
  if (!Object.keys(payload).length) return data;

  const prompt = `You are a professional music industry translator specializing in EPKs (Electronic Press Kits).
Translate the following JSON object from Spanish to ${langName}.
Keep the artist's voice and tone. Preserve formatting (line breaks, punctuation style).
Do NOT translate proper nouns (artist names, band names, venue names, city names, platform names).
Return ONLY a valid JSON object with the same keys and translated values. No explanation, no markdown.

${JSON.stringify(payload, null, 2)}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let attempts = 0;
  while (attempts < 3) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const result = await model.generateContent(prompt, { signal: controller.signal });
      clearTimeout(timeoutId);
      const text = result.response.text().trim();
      const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const translated = JSON.parse(clean);
      return applyTranslated(data, translated);
    } catch (err) {
      attempts++;
      console.warn(`translatePresskit (intento ${attempts}/3):`, err?.message || err);
      if (attempts >= 3) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempts));
    }
  }
  return data;
}
