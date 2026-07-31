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
  gymName = 'GymOS Central',
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `¡Hola! Soy el Asistente IA de **GymOS** para **${gymName}**. Puedo ayudarte a diseñar rutinas de entrenamiento personalizadas, responder dudas de musculación y nutrición, redactar mensajes de cobro por WhatsApp o crear promociones. ¿En qué te ayudo hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const generateClientFallback = (promptText: string) => {
    const lower = promptText.toLowerCase();

    if (lower.includes('hipertrofia') || lower.includes('5 días') || lower.includes('principiante')) {
      return `🏋️ **RUTINA DE HIPERTROFIA DE 5 DÍAS PARA PRINCIPIANTE (${gymName})**

📌 **Estructura Semanal (Push / Pull / Legs / Torso / Pierna):**

• **Día 1: Pecho, Hombro Frontal/Lateral y Tríceps (Push)**
- Press de Banca con Barra / Máncuerna: 4 series x 8-10 reps (Descanso: 90s)
- Press Inclinado con Mancuernas: 3 series x 10-12 reps
- Elevaciones Laterales con Mancuerna: 4 series x 12-15 reps
- Extensión de Tríceps en Polea Alta: 3 series x 12-15 reps

• **Día 2: Espalda, Hombro Posterior y Bíceps (Pull)**
- Jalón al Pecho en Polea / Dominadas asistidas: 4 series x 8-10 reps
- Remo con Barra o en Máquina: 3 series x 10-12 reps
- Face Pulls en Polea Alta: 4 series x 15 reps
- Curls de Bíceps con Barra EZ: 3 series x 10-12 reps

• **Día 3: Pierna Completa (Enfoque Cuádriceps y Glúteo)**
- Sentadilla Libre o Prensa de Pierna: 4 series x 8-10 reps
- Zancadas / Lunge caminando: 3 series x 10 pasos por pierna
- Extensión de Cuádriceps en Máquina: 3 series x 12-15 reps
- Elevación de Talones para Gemelos: 4 series x 15 reps

• **Día 4: Torso Completo (Enfoque Densidad)**
- Press Militar de Hombro: 4 series x 8-10 reps
- Remo Gironda en Polea Baja: 4 series x 10-12 reps
- Aperturas en Pec Deck / Contractor: 3 series x 12-15 reps
- Curl Martillo para Bíceps: 3 series x 12 reps

• **Día 5: Pierna Enfoque Isquiotibiales y Glúteos**
- Peso Muerto Rumano con Mancuernas/Barra: 4 series x 8-10 reps
- Curl Femoral Tumbado o Sentado: 4 series x 12-15 reps
- Hip Thrust / Empuje de Cadera con Barra: 4 series x 10-12 reps
- Abdominales / Crunch en Polea: 3 series x 15-20 reps

💡 *Recomendación del Trainer:* Mantener sobrecarga progresiva cada 2 semanas y descansar 7-8 horas diarias.`;
    }

    if (lower.includes('grasa') || lower.includes('pérdida') || lower.includes('intermedio')) {
      return `🚴 **RUTINA DE PÉRDIDA DE GRASA Y ACONDICIONAMIENTO (${gymName})**

📌 **Estrategia Combinada (Musculación + HIIT de Alta Intensidad):**

• **Bloque 1: Circuito de Fuerza Metabólica (3 Días por semana)**
- Sentadillas con Mancuerna al Pecho (Goblet Squat): 4x12
- Press de Banca o Push-ups: 4x12
- Remo con Mancuerna a una mano: 4x12 por lado
- Zancadas Alternas con peso corporal: 3x15
- Plancha Abdominal (Core Hold): 4 series x 45 segundos

• **Bloque 2: Cardio HIIT en Caminadora / Bici Spinning (15-20 Minutos al finalizar)**
- 1 minuto a máxima velocidad (85-90% FC)
- 1 minuto a paso moderado de recuperación (50% FC)
- Repetir durante 8 a 10 ciclos completos.

💡 *Tip Nutricional:* Mantener un déficit calórico moderado (300-500 kcal) priorizando consumo de proteína limpia (1.8g - 2.2g por kg de peso corporal).`;
    }

    if (lower.includes('cobro') || lower.includes('whatsapp') || lower.includes('mensaje')) {
      return `💬 **PLANTILLAS PROFESIONALES DE COBRO POR WHATSAPP (${gymName})**

📌 **Opción 1: Recordatorio Cordial y Amigable**
"¡Hola {nombre}! 👋 Esperamos que estés teniendo una excelente semana en ${gymName}. Queremos recordarte que tu membresía vence el próximo {fecha}. Recuerda que puedes renovar directamente en recepción o por transferencia para no perder tus días de entrenamiento. ¡Nos vemos en el gym! 🏋️‍♂️"

📌 **Opción 2: Recordatorio de Vencimiento Cercano**
"¡Hola {nombre}! Te saludamos del equipo de ${gymName}. 📢 Notamos que tu plan venció el {fecha} y cuentas con un saldo pendiente de {deuda}. ¿Nos confirmas si renovarás este mes para mantener tu cupo y plan de entrenamiento activo? ¡Quedamos atentos!"

📌 **Opción 3: Mensaje Formal / Pago Vencido**
"Estimado/a {nombre}, le escribimos de la administración de ${gymName}. Su cuota correspondiente al periodo actual se encuentra vencida ({deuda}). Le solicitamos amablemente realizar la cancelación a la brevedad para evitar la suspensión temporal del acceso biométrico/molinete. Muchas gracias por su colaboración. 🙏"`;
    }

    if (lower.includes('promoción') || lower.includes('captar') || lower.includes('estrategia') || lower.includes('socio')) {
      return `🎯 **ESTRATEGIA COMERCIAL Y CAMPAÑAS DE CAPTACIÓN (${gymName})**

📌 **1. Campaña "Trae un Amigo" (Plan Referidos)**
- Otorga 10 días adicionales gratis al socio por cada amigo que inscriba en plan trimestral o mensual.

📌 **2. Pases de Prueba de 3 Días "VIP Experience"**
- Regala pases digitales de 3 días a comercios locales aliados (suplementerías, tiendas de ropa deportiva, barberías).

📌 **3. Paquetes Anuales y Semestrales con Descuento**
- Ofrece 20% de descuento en el pago al contado del plan semestral o un kit de bienvenida con termo/camiseta del gimnasio.

📌 **4. Evaluación Antropométrica Gratuita**
- Incluye una prueba de bioimpedancia o toma de pliegues gratis en la inscripción del primer mes para aumentar el valor percibido.`;
    }

    if (lower.includes('nutrición') || lower.includes('suplemento') || lower.includes('dieta')) {
      return `🥗 **GUÍA DE NUTRICIÓN DEPORTIVA Y GANANCIA MUSCULAR (${gymName})**

📌 **1. Distribución de Macronutrientes Recomendada:**
• **Proteínas:** 1.8g a 2.2g por kg de peso corporal (Pollo, pavo, huevos, pescado, carne magra, tofu, proteína de suero).
• **Carbohidratos:** 3g a 5g por kg según nivel de actividad (Arroz, avena, papa, camote, pasta integral).
• **Grasas Saludables:** 0.8g a 1g por kg (Aguacate, frutos secos, aceite de oliva virgen extra).

📌 **2. Suplementación con Evidencia Científica A+:**
• **Creatina Monohidratada:** 3g a 5g diarios a cualquier hora del día para mejorar fuerza e hipertrofia.
• **Whey Protein (Proteína de Suero):** 1 scoop post-entrenamiento para alcanzar tu requerimiento diario.
• **Citrulina Malato / Pre-Entreno:** 6g a 8g antes de entrenar para mayor congestión y flujo sanguíneo.

💧 *Hidratación:* Beber al menos 35-45 ml de agua por kg de peso al día.`;
    }

    return `🤖 **ASISTENTE TÉCNICO GYMOS (${gymName})**

Gracias por tu consulta. Aquí tienes algunas recomendaciones técnicas clave:

• **Planificación de Entrenamiento:** Para maximizar hipertrofia y fuerza en tus socios, estructura sesiones de 45 a 60 minutos combinando ejercicios multiarticulares pesados con trabajo analítico de aislamiento.
• **Frecuencia de Entrenamiento:** Frecuencia 2 por grupo muscular semanal muestra los mejores resultados biomecánicos.
• **Gestión de Membresías:** Utiliza las herramientas de WhatsApp de GymOS para enviar alertas automáticas de cobro 3 días antes del vencimiento.

*¿Deseas que te diseñe una rutina específica para algún cliente o redacte una plantilla personalizada? ¡Escríbemelo a continuación!*`;
  };

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
        data.reply || data.error || generateClientFallback(text);

      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      // Fallback seamlessly on network/static host error
      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: generateClientFallback(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
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
                Asistente IA GymOS
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
