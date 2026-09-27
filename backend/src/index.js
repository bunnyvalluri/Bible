const app = require('./app');
const config = require('./config/env');
const prisma = require('./config/db');

const PORT = config.PORT || 5000;

async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to Prisma Database successfully.');

    app.listen(PORT, () => {
      console.log(`
============================================================
🕊️  VACHANAM (వచనం • Vachanam • वचन) API SERVER
============================================================
📡 Port:        http://localhost:${PORT}
🚀 Health:      http://localhost:${PORT}/api/health
📖 Books API:   http://localhost:${PORT}/api/books
🔍 Search API:  http://localhost:${PORT}/api/search?q=love
🌅 Daily Verse: http://localhost:${PORT}/api/daily-verse/today
💡 AI Explain:  http://localhost:${PORT}/api/explanations/JHN.3.16
📊 Diagrams:    http://localhost:${PORT}/api/diagrams
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
