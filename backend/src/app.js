const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

// Route Imports
const booksRouter = require('./routes/books');
const chaptersRouter = require('./routes/chapters');
const versesRouter = require('./routes/verses');
const searchRouter = require('./routes/search');
const dailyVerseRouter = require('./routes/dailyVerse');
const explanationsRouter = require('./routes/explanations');
const diagramsRouter = require('./routes/diagrams');
const audioRouter = require('./routes/audio');
const imagesRouter = require('./routes/images');
const plansRouter = require('./routes/plans');
const adminRouter = require('./routes/admin');

const app = express();

// Security & Core Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// Root Health / Info
app.get('/', (req, res) => {
  res.json({
    app: 'Vachanam (వచనం • Vachanam • वचन)',
    description: 'Multilingual Digital Bible API with AI Explanations, Diagrams, and Media',
    version: '1.0.0',
    status: 'ONLINE',
    docs: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/books', booksRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/verses', versesRouter);
app.use('/api/search', searchRouter);
app.use('/api/daily-verse', dailyVerseRouter);
app.use('/api/explanations', explanationsRouter);
app.use('/api/diagrams', diagramsRouter);
app.use('/api/audio', audioRouter);
app.use('/api/images', imagesRouter);
app.use('/api/plans', plansRouter);
app.use('/api/admin', adminRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
