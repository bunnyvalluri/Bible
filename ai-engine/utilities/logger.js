const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLevel = process.env.LOG_LEVEL ? (LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] ?? LOG_LEVELS.INFO) : LOG_LEVELS.INFO;

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] [AI-LOOP-ENGINE] ${message}${metaStr}`;
}

const logger = {
  debug(msg, meta = {}) {
    if (currentLevel <= LOG_LEVELS.DEBUG) console.debug('\x1b[36m' + formatMessage('DEBUG', msg, meta) + '\x1b[0m');
  },
  info(msg, meta = {}) {
    if (currentLevel <= LOG_LEVELS.INFO) console.log('\x1b[32m' + formatMessage('INFO', msg, meta) + '\x1b[0m');
  },
  warn(msg, meta = {}) {
    if (currentLevel <= LOG_LEVELS.WARN) console.warn('\x1b[33m' + formatMessage('WARN', msg, meta) + '\x1b[0m');
  },
  error(msg, meta = {}) {
    if (currentLevel <= LOG_LEVELS.ERROR) console.error('\x1b[31m' + formatMessage('ERROR', msg, meta) + '\x1b[0m');
  }
};

module.exports = logger;
