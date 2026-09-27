const { LoopRunner } = require('../core/LoopRunner');
const { defaultDiagramVerifier, defaultImageVerifier } = require('../verifiers/DomainVerifiers');
const { defaultImageGenProvider, defaultTTSProvider } = require('../services/mediaProviders');
const { DIAGRAM_PROMPTS } = require('../prompts/domainPrompts');

class DiagramGenerationLoop {
  constructor() {
    this.runner = new LoopRunner('DiagramGenerationLoop', { maxRetries: 2 });
  }

  async execute({ bookCode, chapter, type = 'flowchart', titleEn, data, prisma }) {
    const context = await this.runner.run(
      { bookCode, chapter, type, titleEn },
      {
        validate: async (inputs) => !!(inputs.bookCode && inputs.type),
        execute: async (inputs) => {
          return {
            diagramKey: `${inputs.bookCode.toLowerCase()}-${inputs.type}-${Date.now()}`,
            bookCode: inputs.bookCode,
            chapter: inputs.chapter || 1,
            type: inputs.type,
            titleEn: inputs.titleEn || `${inputs.bookCode} ${inputs.type}`,
            data: typeof data === 'string' ? data : JSON.stringify(data || {
              nodes: [
                { id: '1', label: 'Spiritual Principle' },
                { id: '2', label: 'Faith Walk & Application' }
              ],
              links: [{ source: '1', target: '2', label: 'Transforms' }]
            })
          };
        },
        verify: async (output) => defaultDiagramVerifier.verify(output),
        save: async (output) => {
          if (prisma) {
            try {
              await prisma.diagram.upsert({
                where: { diagramKey: output.diagramKey },
                update: output,
                create: output
              });
            } catch (err) {
              // Graceful handle
            }
          }
        }
      }
    );
    return context.outputs;
  }
}

class VerseImageLoop {
  constructor() {
    this.runner = new LoopRunner('VerseImageLoop', { maxRetries: 2 });
  }

  async execute({ verseKey, reference, theme, style, prisma }) {
    const context = await this.runner.run(
      { verseKey, reference, theme, style },
      {
        validate: async (inputs) => !!(inputs.verseKey && inputs.reference),
        execute: async (inputs) => {
          return await defaultImageGenProvider.generateVerseArtwork(inputs);
        },
        verify: async (output) => defaultImageVerifier.verify(output),
        save: async (output) => {
          if (prisma) {
            try {
              await prisma.verseImage.create({ data: output });
            } catch (err) {}
          }
        }
      }
    );
    return context.outputs;
  }
}

class AudioGenerationLoop {
  constructor() {
    this.runner = new LoopRunner('AudioGenerationLoop', { maxRetries: 2 });
  }

  async execute({ verseKey, chapterId, text, language, prisma }) {
    const context = await this.runner.run(
      { verseKey, chapterId, text, language },
      {
        validate: async (inputs) => !!(inputs.text && inputs.language),
        execute: async (inputs) => {
          return await defaultTTSProvider.generateAudio(inputs);
        },
        verify: async (output) => ({ valid: !!(output.audioUrl && output.durationSeconds > 0) }),
        save: async (output) => {
          if (prisma) {
            try {
              await prisma.audio.create({ data: output });
            } catch (err) {}
          }
        }
      }
    );
    return context.outputs;
  }
}

module.exports = {
  DiagramGenerationLoop,
  VerseImageLoop,
  AudioGenerationLoop,
  defaultDiagramLoop: new DiagramGenerationLoop(),
  defaultVerseImageLoop: new VerseImageLoop(),
  defaultAudioLoop: new AudioGenerationLoop()
};
