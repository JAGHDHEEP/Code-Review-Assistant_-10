import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleReviewRequest } from './server/review';

// Serves POST /api/review during `npm run dev` / `npm run preview`, mirroring api/review.ts on Vercel.
function reviewApi(): Plugin {
  const middleware = async (req: any, res: any, next: () => void) => {
    if (req.url !== '/api/review') return next();
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk);
    const response = await handleReviewRequest(
      new Request('http://localhost/api/review', {
        method: req.method,
        headers: { 'content-type': 'application/json' },
        body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
      }),
    );
    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(await response.text());
  };
  return {
    name: 'review-api',
    configureServer: (server) => { server.middlewares.use(middleware); },
    configurePreviewServer: (server) => { server.middlewares.use(middleware); },
  };
}

export default defineConfig(({ mode }) => {
  // Load .env.local into the *server* process only. Nothing is injected into the client bundle.
  const env = loadEnv(mode, '.', '');
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), reviewApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
