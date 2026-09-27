const http = require('http');
const app = require('./app');
const config = require('./config/env');
const prisma = require('./config/db');
const { initializeSocketServer } = require('./realtime/socketServer');
const { getOutboxService } = require('./outbox/OutboxService');
const { getQueueManager } = require('./queues/QueueManager');
const { registerAllJobWorkers } = require('./workers/JobWorkers');

const PORT = config.PORT || 5000;

async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to Prisma Database successfully.');

    // Create HTTP Server & Real-time Gateway
    const httpServer = http.createServer(app);
    const io = initializeSocketServer(httpServer);
    console.log('⚡ Socket.IO Realtime Gateway initialized.');

    // Initialize Outbox and Background Queues
    const outboxService = getOutboxService(prisma);
    outboxService.start(1000);
    console.log('📦 Transactional Outbox Engine started.');

    const queueManager = getQueueManager(prisma);
    registerAllJobWorkers(queueManager, prisma);
    queueManager.start(1500);
    console.log('🔄 Background Queue & AI Workers registered and started.');

    httpServer.listen(PORT, () => {
      console.log(`
============================================================
🕊️  VACHANAM (వచనం • Vachanam • वचन) REAL-TIME SERVER
============================================================
📡 Port:        http://localhost:${PORT}
⚡ WebSocket:   ws://localhost:${PORT} (Socket.IO)
🚀 Health:      http://localhost:${PORT}/api/health
📖 Books API:   http://localhost:${PORT}/api/books
🔍 Search API:  http://localhost:${PORT}/api/search?q=love
🌅 Daily Verse: http://localhost:${PORT}/api/daily-verse/today
💡 AI Explain:  http://localhost:${PORT}/api/explanations/JHN.3.16
📊 Diagrams:    http://localhost:${PORT}/api/diagrams
🔄 Job Queue:   http://localhost:${PORT}/api/jobs/health
⚙️  Environment: ${config.NODE_ENV}
============================================================
      `);
    });
  } catch (err) {
    console.error('❌ Failed to start Vachanam Server:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
