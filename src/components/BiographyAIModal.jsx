import { useEffect, useRef, useState } from 'react';
import { generateBioSectionWithAI } from '../lib/aiBio';

function BiographyAIModal({ isOpen, onClose, onUseBio, section, artistData, currentValue }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState(currentValue || '');
  const [editMode, setEditMode] = useState(false);
  const messagesEndRef = useRef(null);

  const sectionLabels = {
    twitterBio: 'Bio para Twitter (140 caracteres)',
    shortBio: 'Bio corta (1 párrafo)',
    longBio: 'Bio completa (3-4 párrafos)',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Iniciar conversación con datos del artista
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    const systemMessage = {
      id: 'system-1',
      role: 'assistant',
      text: `Hola, voy a ayudarte a crear la ${sectionLabels[section].toLowerCase()} para tu EPK. 📝\n\nTengo esta información sobre ti:\n\n🎤 **${artistData.artistName || 'Artista'}**\n🎵 Género: ${artistData.genre || 'No especificado'}\n📍 Ciudad: ${artistData.city || 'No especificada'}\n🏆 Reconocimientos: ${artistData.recognitions || 'Sin reconocimientos cargados'}\n\n¿Hay algo que me gustaría destacar o cambiar en tu biografía?`,
    };

    setMessages([systemMessage]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Preparar contexto de conversación
      const conversationContext = messages
        .map((m) => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.text}`)
        .join('\n\n');

      const fullPrompt = [
        'Eres un copywriter musical experto en EPK para artistas independientes.',
        'Estás en una conversación con un artista para crear su biografía.',
        '',
        'INFORMACIÓN DEL ARTISTA:',
        `- Nombre: ${artistData.artistName}`,
        `- Género: ${artistData.genre}`,
        `- Ciudad: ${artistData.city}`,
        `- Reconocimientos: ${artistData.recognitions}`,
        '',
        'CONVERSACIÓN ANTERIOR:',
        conversationContext,
        '',
        'INSTRUCCIONES:',
        `- Tipo de bio: ${sectionLabels[section]}`,
        section === 'twitterBio'
          ? '- Máximo 140 caracteres'
          : section === 'shortBio'
            ? '- Un párrafo'
            : '- 3 a 4 párrafos',
        '- Si el usuario pide generar la bio, proporciona SOLAMENTE el texto final de la biografía',
        '- Si es una pregunta o comentario, responde brevemente (máx 2 líneas)',
        '- Idioma: español neutro',
        '- Tono: profesional y útil para EPK',
        '',
        'En tu próximo mensaje:',
        '1. Si debe ser una biografía completa, responde SOLO el texto (sin explicaciones)',
        '2. Si es una pregunta, ayuda al usuario de forma breve',
      ].join('\n');

      const response = await generateBioSectionWithAI({
        artistName: artistData.artistName,
        genre: artistData.genre,
        city: artistData.city,
        recognitions: artistData.recognitions,
        style: artistData.bioStyle || 'prensa',
        section,
        customPrompt: fullPrompt,
      });

      // Detectar si es una biografía generada o una respuesta conversacional
      const isRealBio = response.length > 30 && (response.includes('.') || response.includes(','));

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: response,
        isBio: isRealBio && response.length > 50,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Si es una biografía, guardarla como candidato
      if (aiMessage.isBio) {
        setGeneratedBio(response);
        setEditMode(true);
      }
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: `❌ Error: ${error?.message || 'No se pudo generar. Intenta de nuevo.'}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleUseBio = () => {
    if (generatedBio.trim()) {
      onUseBio(generatedBio);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl flex flex-col h-[80vh]">
        {/* Header */}
        <div className="mb-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Crear biografía con IA</h2>
          <p className="mt-1 text-sm text-zinc-400">{sectionLabels[section]}</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-fuchsia-500/20 border border-fuchsia-400/40 text-zinc-100'
                    : 'bg-cyan-500/10 border border-cyan-400/40 text-zinc-100'
                } ${msg.isBio ? 'max-w-none bg-white/5 border-white/20' : ''}`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Edit Bio Section */}
        {generatedBio && editMode && (
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-300 font-semibold mb-2">Editar biografía</p>
            <textarea
              value={generatedBio}
              onChange={(e) => setGeneratedBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-300"
            />
          </div>
        )}

        {/* Input Area */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !loading && input.trim()) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Escribe tu mensaje o pide 'generar biografía'..."
            disabled={loading}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:opacity-50"
          >
            {loading ? '⏳' : 'Enviar'}
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            onClick={handleUseBio}
            disabled={!generatedBio.trim()}
            className="flex-1 rounded-lg bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300 disabled:opacity-50"
          >
            ✓ Usar esta bio
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiographyAIModal;
