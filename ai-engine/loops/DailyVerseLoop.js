const { LoopRunner } = require('../core/LoopRunner');
const { defaultVerseExplanationLoop } = require('./VerseExplanationLoop');
const { defaultVerseImageLoop } = require('./MediaLoops');
const logger = require('../utilities/logger');

class DailyVerseLoop {
  constructor() {
    this.runner = new LoopRunner('DailyVerseLoop', { maxRetries: 2 });
  }

  async execute({ dateKey = new Date().toISOString().slice(0, 10), verseData, prisma }) {
    const context = await this.runner.run(
      { dateKey, verseData },
      {
        validate: async (inputs) => !!(inputs.dateKey && inputs.verseData),
        execute: async (inputs, ctx) => {
          const vd = inputs.verseData;
          ctx.logStep('GENERATE_EXPLANATIONS_TRILINGUAL');

          // Generate 3 languages via explanation loop
          const [expEn, expTe, expHi] = await Promise.all([
            defaultVerseExplanationLoop.execute({
              verseKey: vd.verseKey,
              reference: vd.referenceEn,
              text: vd.verseTextEn,
              language: 'en',
              prisma
            }),
            defaultVerseExplanationLoop.execute({
              verseKey: vd.verseKey,
              reference: vd.referenceTe,
              text: vd.verseTextTe,
              language: 'te',
              prisma
            }),
            defaultVerseExplanationLoop.execute({
              verseKey: vd.verseKey,
              reference: vd.referenceHi,
              text: vd.verseTextHi,
              language: 'hi',
              prisma
            })
          ]);

          ctx.logStep('GENERATE_ARTWORK');
          const imageAsset = await defaultVerseImageLoop.execute({
            verseKey: vd.verseKey,
            reference: vd.referenceEn,
            theme: vd.theme || 'Faith & Grace',
            prisma
          });

          return {
            dateKey: inputs.dateKey,
            verseKey: vd.verseKey,
            reference: vd.referenceEn,
            theme: vd.theme || 'Divine Guidance & Peace',
            verseTextEn: vd.verseTextEn,
            verseTextTe: vd.verseTextTe,
            verseTextHi: vd.verseTextHi,
            explanationEn: expEn.data?.simpleExplanation,
            explanationTe: expTe.data?.simpleExplanation,
            explanationHi: expHi.data?.simpleExplanation,
            imageUrl: imageAsset?.imageUrl,
            audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3'
          };
        },
        verify: async (output) => {
          return { valid: !!(output.dateKey && output.verseKey && output.verseTextEn) };
        },
        save: async (output) => {
          if (prisma) {
            try {
              await prisma.dailyVerse.upsert({
                where: { dateKey: output.dateKey },
                update: output,
                create: output
              });
              logger.info(`Saved daily verse for ${output.dateKey} (${output.verseKey})`);
            } catch (err) {
              logger.warn(`Failed to persist daily verse: ${err.message}`);
            }
          }
        }
      }
    );

    return context.outputs;
  }
}

module.exports = { DailyVerseLoop, defaultDailyVerseLoop: new DailyVerseLoop() };
