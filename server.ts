import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization for Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Assistant endpoint for workouts, bodybuilding Q&A, gym admin advice
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { prompt, gymName, clientContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El mensaje o consulta es requerido' });
    }

    const systemInstruction = `Eres el Asistente Experto en IA para Administradores de Gimnasios y Personal Trainers ("GymSaaS AI") para el gimnasio "${gymName || 'Gimnasio Fitness'}".
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

    const reply = response.text || 'No se pudo generar una respuesta en este momento.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error en /api/ai-assistant:', error);
    return res.status(500).json({
      error: 'Error al consultar la Inteligencia Artificial',
      details: error?.message || 'Error desconocido',
    });
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
