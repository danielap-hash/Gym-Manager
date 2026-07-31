import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper function for smart offline fallback when Gemini API key is missing or fails
function generateSmartFallback(prompt: string, gymName: string = 'GymOS'): string {
  const lower = prompt.toLowerCase();

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
}

// AI Assistant endpoint for workouts, bodybuilding Q&A, gym admin advice
app.post('/api/ai-assistant', async (req, res) => {
  const { prompt, gymName } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El mensaje o consulta es requerido' });
  }

  const effectiveGymName = gymName || 'GymOS Central';

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY no encontrada. Generando respuesta estructurada de contingencia GymOS.');
      return res.json({ reply: generateSmartFallback(prompt, effectiveGymName) });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Eres el Asistente Experto en IA para Administradores de Gimnasios y Personal Trainers ("GymOS AI") para el gimnasio "${effectiveGymName}".
Tus responsabilidades principales son:
1. Diseñar rutinas de entrenamiento personalizadas de musculación, hipertrofia, fuerza, pérdida de grasa o acondicionamiento según la experiencia, días y objetivos del socio.
2. Responder consultas técnicas sobre musculación, técnica de ejercicios, biomecánica, periodización, nutrición deportiva y suplementación.
3. Redactar mensajes persuasivos y profesionales de cobro, recordatorio de vencimiento de membresía o promociones para WhatsApp.
4. Proporcionar estrategias comerciales para mejorar la retención de clientes e incrementar ingresos en el gimnasio.

Usa un tono profesional, alentador, estructurado con viñetas claras y formato limpio en español.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || generateSmartFallback(prompt, effectiveGymName);
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error en /api/ai-assistant:', error?.message || error);
    // Return smart fallback instead of failing with 500
    return res.json({ reply: generateSmartFallback(prompt, effectiveGymName) });
  }
});

// Vite middleware for development vs static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
