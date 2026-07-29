import React, { useState } from 'react';
import { Sparkles, X, Send, Copy, Check, Bot, User, Loader2 } from 'lucide-react';

interface AsistenteIAModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymName?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AsistenteIAModal: React.FC<AsistenteIAModalProps> = ({
  isOpen,
  onClose,
  gymName = 'Gimnasio Fitness Zone',
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `¡Hola! Soy el Asistente IA de GymSaaS para **${gymName}**. Puedo ayudarte a diseñar rutinas de entrenamiento personalizadas, responder dudas de musculación y nutrición, redactar mensajes de cobro por WhatsApp o crear promociones. ¿En qué te ayudo hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    '🏆 Generar rutina de hipertrofia de 5 días para socio principiante',
    '🚴 Diseñar rutina de pérdida de grasa para socio intermedio',
    '💬 Redactar mensaje cordial de cobro por WhatsApp',
    '🎯 Crear estrategia de promociones para captar nuevos socios',
    '🥗 Consejos de nutrición deportiva y ganancia muscular',
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          gymName,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply || data.error || 'No fue posible obtener una respuesta de la IA.';

      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Ocurrió un error al conectar con el servidor de IA. Asegúrate de que el servidor esté activo.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg h-[88vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white leading-tight flex items-center gap-1.5">
                Asistente IA GymSaaS
              </h2>
              <p className="text-[11px] text-slate-400">
                Impulsado por Google Gemini en el servidor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
          <div className="flex items-center gap-2 w-max">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qp)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors hover:border-amber-500/50 flex items-center gap-1.5 whitespace-nowrap"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-normal">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-100'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text.split('\n').map((line, lIdx) => {
                    // Simple formatting for bold and bullets
                    let formatted = line;
                    return (
                      <p key={lIdx} className={line.startsWith('- ') || line.startsWith('• ') ? 'ml-2 mb-1' : 'mb-1'}>
                        {formatted}
                      </p>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar respuesta</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/80 text-slate-300 rounded-xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span className="text-xs">Generando respuesta estructurada...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Escribe tu consulta o pide una rutina..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
