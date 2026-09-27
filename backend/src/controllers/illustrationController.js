const prisma = require('../config/db');
const path = require('path');
const {
  defaultIllustrationEngine,
  defaultContentAnalyzer,
  defaultVisualMetaphorGenerator
} = require(path.resolve(__dirname, '../../../ai-engine'));

class IllustrationController {
  /**
   * GET /api/illustrations/:verseKey
   * Retrieve cached or generate Bible illustration for a verse
   */
  async getByVerseKey(req, res) {
    try {
      const { verseKey } = req.params;
      const { lang = 'en', type = 'verse' } = req.query;

      // 1. Check existing illustration in DB
      let illustration = await prisma.illustration.findFirst({
        where: { verseKey, language: lang, illustrationType: type },
        include: { qaReviews: true }
      });

      if (!illustration) {
        // Fetch verse details
        const verse = await prisma.verse.findUnique({
          where: { verseKey },
          include: { book: true }
        });

        let ref, text;
        if (verse) {
          ref = `${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}`;
          text = lang === 'te' ? verse.textTelugu : lang === 'hi' ? verse.textHindi : verse.textEnglish;
        } else {
          const parts = verseKey.split('.');
          const bookCode = parts[0] || 'JHN';
          const ch = parts[1] || '1';
          const v = parts[2] || '1';
          ref = `${bookCode} ${ch}:${v}`;
          text = 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.';
        }

        // Generate via Illustration Engine
        illustration = await defaultIllustrationEngine.generateIllustration({
          verseKey,
          reference: ref,
          text,
          language: lang,
          illustrationType: type,
          prisma
        });
      }

      return res.json({
        success: true,
        data: illustration
      });
    } catch (err) {
      console.error('Error fetching/generating illustration:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/generate
   */
  async generate(req, res) {
    try {
      const { verseKey, reference, text, language = 'en', type = 'verse', style } = req.body;

      if (!verseKey) {
        return res.status(400).json({ success: false, error: 'verseKey is required' });
      }

      const result = await defaultIllustrationEngine.generateIllustration({
        verseKey,
        reference: reference || verseKey,
        text: text || 'God’s Holy Word',
        language,
        illustrationType: type,
        style,
        prisma
      });

      return res.status(201).json({
        success: true,
        data: result
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/batch
   * Background batch generation
   */
  async batch(req, res) {
    try {
      const { verseKeys = [], limit = 10, language = 'en' } = req.body;
      const targetKeys = verseKeys.length > 0 ? verseKeys : ['GEN.1.1', 'JHN.3.16', 'PSA.23.1', 'PRO.3.5', 'ROM.8.28'].slice(0, limit);

      const batchId = `batch_ill_${Date.now()}`;

      // Trigger asynchronous background processing
      setImmediate(async () => {
        for (const vk of targetKeys) {
          try {
            const verse = await prisma.verse.findUnique({ where: { verseKey: vk }, include: { book: true } });
            if (verse) {
              const ref = `${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}`;
              const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;
              await defaultIllustrationEngine.generateIllustration({
                verseKey: vk,
                reference: ref,
                text,
                language,
                prisma
              });
            }
          } catch (e) {
            console.warn(`Batch item ${vk} failed:`, e.message);
          }
        }
      });

      return res.json({
        success: true,
        batchId,
        status: 'PROCESSING',
        totalItems: targetKeys.length,
        items: targetKeys
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/:id/regenerate
   */
  async regenerate(req, res) {
    try {
      const { id } = req.params;
      const existing = await prisma.illustration.findUnique({ where: { id: parseInt(id, 10) } });
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Illustration not found' });
      }

      const refreshed = await defaultIllustrationEngine.generateIllustration({
        verseKey: existing.verseKey,
        reference: existing.verseKey,
        text: existing.theme || 'Scripture',
        language: existing.language,
        illustrationType: existing.illustrationType,
        style: existing.style,
        prisma
      });

      return res.json({ success: true, data: refreshed });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/illustrations/:id/status
   */
  async getStatus(req, res) {
    try {
      const { id } = req.params;
      const item = await prisma.illustration.findUnique({
        where: { id: parseInt(id, 10) },
        include: { qaReviews: true, generations: true }
      });
      if (!item) return res.status(404).json({ success: false, error: 'Illustration not found' });
      return res.json({ success: true, data: item });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/:id/qa
   */
  async submitQA(req, res) {
    try {
      const { id } = req.params;
      const { contentScore, styleScore, safetyScore, accuracyScore, approved, feedback } = req.body;

      const qa = await prisma.illustrationQA.create({
        data: {
          illustrationId: parseInt(id, 10),
          contentScore: contentScore ?? 1.0,
          styleScore: styleScore ?? 1.0,
          safetyScore: safetyScore ?? 1.0,
          accuracyScore: accuracyScore ?? 1.0,
          approved: approved ?? true,
          feedback: feedback || 'Approved via QA audit'
        }
      });

      return res.json({ success: true, data: qa });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new IllustrationController();
