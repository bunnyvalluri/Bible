const EventEmitter = require('events');
const { ExecutionContext } = require('./ExecutionContext');
const stateStore = require('./StateStore');
const logger = require('../utilities/logger');
const { retryWithBackoff } = require('../utilities/backoff');

/**
 * LoopRunner is the core execution container for stateful, iterative AI loops.
 */
class LoopRunner extends EventEmitter {
  constructor(name, options = {}) {
    super();
    this.name = name;
    this.maxRetries = options.maxRetries ?? 3;
    this.initialDelayMs = options.initialDelayMs ?? 1000;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  /**
   * Execute the loop with full lifecycle hooks.
   * @param {Object} inputs - Loop input parameters
   * @param {Object} handlers - Lifecycle handlers { validate, execute, verify, save, onProgress }
   * @returns {Promise<ExecutionContext>}
   */
  async run(inputs = {}, handlers = {}) {
    const ctx = new ExecutionContext({
      loopName: this.name,
      inputs
    });

    await stateStore.setState(ctx.id, 'PENDING', { loopName: this.name, inputs });
    logger.info(`Starting Loop [${this.name}] (Run ID: ${ctx.id})`);
    this.emit('loop:start', { ctx });

    try {
      await stateStore.setState(ctx.id, 'RUNNING');

      // 1. Pre-flight Validation Hook
      if (handlers.validate) {
        ctx.logStep('PREFLIGHT_VALIDATE');
        const isValid = await handlers.validate(inputs, ctx);
        if (!isValid) {
          throw new Error(`Pre-flight validation failed for loop ${this.name}`);
        }
      }

      // 2. Execution with Retries & Exponential Backoff
      let outputData = null;
      let verificationPassed = false;

      await retryWithBackoff(
        async (attempt) => {
          ctx.metrics.retryCount = attempt - 1;
          if (attempt > 1) {
            await stateStore.setState(ctx.id, 'RETRYING', { attempt });
            this.emit('loop:retry', { ctx, attempt });
          }

          ctx.logStep(`EXECUTE_ATTEMPT_${attempt}`);
          const rawOutput = await handlers.execute(inputs, ctx);

          // 3. Verification Pipeline Hook
          if (handlers.verify) {
            ctx.logStep(`VERIFY_ATTEMPT_${attempt}`);
            const verifyResult = await handlers.verify(rawOutput, inputs, ctx);

            if (verifyResult === true || (verifyResult && verifyResult.valid)) {
              verificationPassed = true;
              outputData = rawOutput;
              ctx.recordVerification(true, 'Output satisfied all verification criteria');
              return rawOutput;
            } else {
              const reason = typeof verifyResult === 'object' ? verifyResult.reason : 'Verification rejected output';
              ctx.recordVerification(false, reason);
              throw new Error(`Verification failed: ${reason}`);
            }
          } else {
            outputData = rawOutput;
            verificationPassed = true;
            return rawOutput;
          }
        },
        {
          maxRetries: this.maxRetries,
          initialDelayMs: this.initialDelayMs,
          onRetry: ({ attempt, error, nextDelayMs }) => {
            logger.warn(`Loop [${this.name}] Attempt ${attempt} failed: ${error.message}. Retrying in ${Math.round(nextDelayMs)}ms...`);
          }
        }
      );

      // 4. Persistence Hook
      if (handlers.save && outputData) {
        ctx.logStep('PERSISTENCE');
        await handlers.save(outputData, inputs, ctx);
      }

      // 5. Completion
      ctx.complete(outputData);
      await stateStore.setState(ctx.id, 'COMPLETED', { outputs: outputData, metrics: ctx.metrics });
      logger.info(`Loop [${this.name}] completed successfully in ${ctx.metrics.durationMs}ms`);
      this.emit('loop:completed', { ctx, outputs: outputData });

      return ctx;
    } catch (err) {
      ctx.fail(err);
      await stateStore.setState(ctx.id, 'FAILED', { error: err.message, metrics: ctx.metrics });
      logger.error(`Loop [${this.name}] terminated with error: ${err.message}`, { stack: err.stack });
      this.emit('loop:failed', { ctx, error: err });
      throw err;
    }
  }
}

module.exports = { LoopRunner };
