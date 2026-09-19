import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import playerRoutes from './routes/players';
import clubRoutes from './routes/clubs';
import transferRoutes from './routes/transfers';
import rumourRoutes from './routes/rumours';
import predictionRoutes from './routes/predictions';
import searchRoutes from './routes/search';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/rumours', rumourRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'TransferIQ API Backend is running', version: '1.0.0' });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mode: process.env.DATABASE_URL ? 'live' : 'demo', timestamp: new Date().toISOString() });
});

// Silence Chrome DevTools 404s
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.json({});
});

// Catch-all 404 for unknown routes (prevents HTML default responses)
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 TransferIQ Backend running on http://localhost:${PORT}`);
  console.log(`📊 Mode: ${process.env.DATABASE_URL ? 'Database' : 'Demo Data'}`);
});

export default app;
