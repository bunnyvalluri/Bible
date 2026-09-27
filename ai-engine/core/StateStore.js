const logger = require('../utilities/logger');

const VALID_STATES = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED'];

class StateStore {
  constructor() {
    this.memoryStore = new Map();
  }

  async setState(executionId, state, data = {}) {
    if (!VALID_STATES.includes(state)) {
      throw new Error(`Invalid state "${state}". Valid states: ${VALID_STATES.join(', ')}`);
    }

    const current = this.memoryStore.get(executionId) || {
      id: executionId,
      createdAt: new Date().toISOString(),
      history: []
    };

    current.state = state;
    current.updatedAt = new Date().toISOString();
    current.history.push({ state, timestamp: current.updatedAt, note: data.note || '' });
    current.data = { ...current.data, ...data };

    this.memoryStore.set(executionId, current);
    logger.debug(`State changed for [${executionId}] -> ${state}`);
    return current;
  }

  async getState(executionId) {
    return this.memoryStore.get(executionId) || null;
  }

  async listExecutions(filter = {}) {
    const list = Array.from(this.memoryStore.values());
    return list.filter(item => {
      if (filter.state && item.state !== filter.state) return false;
      if (filter.loopName && item.data?.loopName !== filter.loopName) return false;
      return true;
    });
  }
}

module.exports = new StateStore();
