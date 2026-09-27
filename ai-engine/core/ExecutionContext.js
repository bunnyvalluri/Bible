const { randomUUID } = require('crypto');

class ExecutionContext {
  constructor(options = {}) {
    this.id = options.id || randomUUID();
    this.loopName = options.loopName || 'AnonymousLoop';
    this.inputs = options.inputs || {};
    this.outputs = {};
    this.state = 'PENDING';
    this.errors = [];
    this.stepLogs = [];
    this.metadata = options.metadata || {};
    this.metrics = {
      startTime: Date.now(),
      endTime: null,
      durationMs: 0,
      tokensUsed: 0,
      retryCount: 0,
      verificationsPassed: 0,
      verificationsFailed: 0
    };
  }

  logStep(stepName, details = {}) {
    const entry = {
      step: stepName,
      timestamp: new Date().toISOString(),
      details
    };
    this.stepLogs.push(entry);
  }

  recordVerification(passed, reason = '') {
    if (passed) {
      this.metrics.verificationsPassed += 1;
    } else {
      this.metrics.verificationsFailed += 1;
    }
    this.logStep('VERIFICATION', { passed, reason });
  }

  complete(outputs = {}) {
    this.state = 'COMPLETED';
    this.outputs = outputs;
    this.metrics.endTime = Date.now();
    this.metrics.durationMs = this.metrics.endTime - this.metrics.startTime;
  }

  fail(error) {
    this.state = 'FAILED';
    this.errors.push({
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    this.metrics.endTime = Date.now();
    this.metrics.durationMs = this.metrics.endTime - this.metrics.startTime;
  }

  toJSON() {
    return {
      id: this.id,
      loopName: this.loopName,
      state: this.state,
      inputs: this.inputs,
      outputs: this.outputs,
      errors: this.errors,
      metrics: this.metrics,
      metadata: this.metadata,
      stepLogs: this.stepLogs
    };
  }
}

module.exports = { ExecutionContext };
