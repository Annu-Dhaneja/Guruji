import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { registerRoutes } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(
    express.json({
      limit: '10mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf ? buf.toString() : '';
      },
    })
  );
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Register API Routes
  registerRoutes(app);

  // Catch-all for unhandled API routes so they return JSON 404 instead of falling through to Vite/index.html HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
  });

  // Serve Vite Dev Server or Static Assets in Production
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
    console.log(`GurucraftPro server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
