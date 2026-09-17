import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { solveStudentQuery } from './src/server/geminiService.ts';

dotenv.config();

const currentDir = typeof __dirname !== 'undefined' 
  ? __dirname 
  : path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to allow image uploads (base64)
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API route for AI solving
  app.post('/api/solve', async (req, res) => {
    try {
      const result = await solveStudentQuery(req.body);
      res.json(result);
    } catch (error: any) {
      console.error('API Error in /api/solve:', error);
      res.json({
        text: `⚠️ **تنبيه مؤقت:** توجد كثافة مؤقتة في استخدام سيرفرات الذكاء الاصطناعي (High Server Demand). يرجى الضغط مجدداً على زر الإرسال خلال ثوانٍ قليلة يا بطل! 🎯`,
        error: error?.message || 'Internal Server Error',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
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
