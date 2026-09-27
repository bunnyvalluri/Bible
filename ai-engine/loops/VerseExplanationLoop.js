const { LoopRunner } = require('../core/LoopRunner');
const { defaultAIProvider } = require('../services/aiModelProvider');
const { defaultCacheManager } = require('../cache/AICacheManager');
const { defaultExplanationVerifier } = require('../verifiers/ExplanationVerifier');
const { EXPLANATION_PROMPTS } = require('../prompts/explanationPrompts');

class VerseExplanationLoop {
  constructor() {
    this.runner = new LoopRunner('VerseExplanationLoop', {
      maxRetries: 3,
      initialDelayMs: 1200
    });
  }

  async execute({ verseKey, reference, text, language = 'en', forceRefresh = false, prisma }) {
    const cacheKey = `ai_exp_${verseKey}_${language}`;

    // 1. Check in-memory / L1 cache
    if (!forceRefresh) {
      const cached = defaultCacheManager.get(cacheKey);
      if (cached) return { data: cached, fromCache: true };
    }

    // 2. Run stateful LoopRunner
    const context = await this.runner.run(
      { verseKey, reference, text, language },
      {
        validate: async (inputs) => {
          return !!(inputs.verseKey && inputs.text && inputs.reference);
        },

        execute: async (inputs, ctx) => {
          const prompt = EXPLANATION_PROMPTS.generatePrompt({
            reference: inputs.reference,
            text: inputs.text,
            language: inputs.language
          });
          ctx.logStep('CALL_AI_MODEL', { language: inputs.language });
          return await defaultAIProvider.generateVerseExplanation({
            reference: inputs.reference,
            text: inputs.text,
            language: inputs.language,
            prompt
          });
        },

        verify: async (output) => {
          return await defaultExplanationVerifier.verify(output);
        },

        save: async (output, inputs) => {
          defaultCacheManager.set(cacheKey, output, 86400 * 1000);
          if (prisma) {
            try {
              await prisma.explanation.upsert({
                where: { verseKey_language: { verseKey: inputs.verseKey, language: inputs.language } },
                update: {
                  simpleExplanation: output.simpleExplanation,
                  keyPoints: typeof output.keyPoints === 'string' ? output.keyPoints : JSON.stringify(output.keyPoints),
                  historicalContext: output.historicalContext,
                  spiritualMeaning: output.spiritualMeaning,
                  lifeApplication: output.lifeApplication,
                  youthExplanation: output.youthExplanation,
                  aiModel: output.aiModel || 'loop-engine'
                },
                create: {
                  verseKey: inputs.verseKey,
                  language: inputs.language,
                  simpleExplanation: output.simpleExplanation,
                  keyPoints: typeof output.keyPoints === 'string' ? output.keyPoints : JSON.stringify(output.keyPoints),
                  historicalContext: output.historicalContext,
                  spiritualMeaning: output.spiritualMeaning,
                  lifeApplication: output.lifeApplication,
                  youthExplanation: output.youthExplanation,
                  aiModel: output.aiModel || 'loop-engine'
                }
              });
            } catch (err) {
              // Non-blocking if running offline
            }
          }
        }
      }
    );

    return { data: context.outputs, executionContext: context.toJSON(), fromCache: false };
  }
}

module.exports = { VerseExplanationLoop, defaultVerseExplanationLoop: new VerseExplanationLoop() };
