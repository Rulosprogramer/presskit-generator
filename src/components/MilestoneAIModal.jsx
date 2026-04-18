import { useEffect, useRef, useState } from 'react';
import { generateArtistMilestoneWithAI } from '../lib/aiBio';

const categoryLabels = {
  digital: 'Tracción Digital',
  live: 'Validación en Vivo',
  press: 'Curaduría y Prensa',
  collaborations: 'Colaboraciones',
};

const categoryInstructions = {
  digital: 'Enfócate en crecimiento, porcentajes o nichos; si el número es pequeño, resalta velocidad o ciudades estratégicas.',
  live: 'Resalta consistencia y prestigio de los lugares usando circuito, escena local, showcase o aforo completo.',
  press: 'Resalta respaldo de terceros con frases como Selección oficial, Destacado por, o crítica especializada.',
  collaborations: 'Enfócate en sinergia y respaldo profesional; usa alianza estratégica o bajo la producción de cuando aplique.',
};

function MilestoneAIModal({ isOpen, onClose, onUseMilestone, category, artistData, currentValue }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedMilestone, setGeneratedMilestone] = useState(currentValue || '');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const categoryLabel = categoryLabels[category] || 'Hitos';

  useEffect(() => {
    if (!isOpen) return;

    setMessages([
      {
        id: 'system-1',
        role: 'assistant',
        text: `Voy a ayudarte a crear un hito de ${categoryLabel}.\n\nCompárteme datos reales (números, lugares, medios, colaborador, contexto) y yo te devuelvo una frase de impacto sin inventar información.`,
      },
    ]);
    setInput('');
    setLoading(false);
    setGeneratedMilestone(currentValue || '');
  }, [isOpen, category]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen || loading) return;
    inputRef.current?.focus();
  }, [isOpen, loading]);

  const handleSendMessage = async (rawValue) => {
    const value = rawValue ?? input;
    const trimmed = String(value || '').trim();
    if (loading) return;
    if (!trimmed) {
      setMessages((prev) => [
        ...prev,
        {
          id: `warn-${Date.now()}`,
          role: 'assistant',
          text: 'Escríbeme un dato real para poder ayudarte con el hito.',
        },
      ]);
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationContext = [...messages, userMessage]
        .map((m) => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.text}`)
        .join('\n\n');

      const prompt = [
        'Eres un manager estrella y copywriter musical experto en EPK para artistas independientes.',
        'Debes hacer upcycling: elevar el dato sin mentir.',
        'Idioma: español neutro.',
        '',
        'Reglas generales obligatorias:',
        '- Devuelve una sola frase corta de máximo 15 palabras cuando el usuario pida generar.',
        '- Voz activa y contundente.',
        '- Empieza con un verbo de acción o un número impactante.',
        '- No inventes premios, cifras, medios o colaboraciones.',
        '',
        `Categoría: ${categoryLabel}`,
        `Instrucción de categoría: ${categoryInstructions[category] || ''}`,
        '',
        'Contexto del artista:',
        `- Nombre: ${artistData.artistName || 'Artista independiente'}`,
        `- Género: ${artistData.genre || 'No especificado'}`,
        `- Ciudad: ${artistData.city || 'No especificada'}`,
        '',
        'Conversación:',
        conversationContext,
        '',
        'Instrucciones de respuesta:',
        '- Si el usuario aún está dando datos o preguntando, responde breve en 1-2 líneas para guiar.',
        '- Si el usuario pide generar (por ejemplo: "genera", "haz el hito"), entrega SOLO la frase final del hito.',
      ].join('\n');

      const response = await generateArtistMilestoneWithAI({
        artistName: artistData.artistName,
        genre: artistData.genre,
        city: artistData.city,
        category,
        rawInput: trimmed,
        customPrompt: prompt,
      });

      const safeResponse = String(response || '').trim() || 'Necesito más datos reales para ayudarte. Cuéntame cifras, lugares o contexto.';

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: safeResponse,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (safeResponse.length > 0) {
        setGeneratedMilestone(safeResponse);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: `No pude generar el hito ahora: ${error?.message || 'intenta nuevamente.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMilestone = () => {
    const value = String(generatedMilestone || '').trim();
    if (!value) return;
    onUseMilestone(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur">
      <div className="relative flex h-[80vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
        <div className="mb-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Crear hito con IA</h2>
          <p className="mt-1 text-sm text-zinc-400">Categoría: {categoryLabel}</p>
        </div>

        <div className="mb-4 flex-1 space-y-4 overflow-y-auto px-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs rounded-lg px-4 py-3 text-sm whitespace-pre-wrap lg:max-w-md xl:max-w-lg ${
                  msg.role === 'user'
                    ? 'border border-fuchsia-400/40 bg-fuchsia-500/20 text-zinc-100'
                    : 'border border-cyan-400/40 bg-cyan-500/10 text-zinc-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Editar hito</p>
          <textarea
            value={generatedMilestone}
            onChange={(event) => setGeneratedMilestone(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-300"
          />
        </div>

        <div className="mb-4 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Escribe datos reales o pide: 'genera el hito'"
            disabled={loading}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Enviar'}
          </button>
        </div>

        <div className="flex gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleUseMilestone}
            disabled={!String(generatedMilestone || '').trim()}
            className="flex-1 cursor-pointer rounded-lg bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Usar este hito
          </button>
        </div>
      </div>
    </div>
  );
}

export default MilestoneAIModal;
