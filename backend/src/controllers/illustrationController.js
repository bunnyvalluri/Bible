const prisma = require('../config/db');
const imageClient = require('../services/imageGenerationClient');
const { getQueueManager } = require('../queues/QueueManager');
const broadcaster = require('../realtime/broadcaster');
const { REALTIME_EVENTS } = require('@vachanam/shared');

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
        where: { verseKey, language: lang },
        include: { qaReviews: true, generations: true }
      });

      if (!illustration) {
        // Fetch verse details
        const verse = await prisma.verse.findUnique({
          where: { verseKey },
          include: { book: true }
        });

        if (verse) {
          const genResult = await imageClient.generateVerseIllustration({
            verseKey,
            bookCode: verse.book.code,
            bookName: verse.book.english,
            chapter: verse.chapterNumber,
            verseNumber: verse.verseNumber,
            verseText: verse.textEnglish,
            language: lang,
            style: 'vachanam-editorial-handdrawn'
          });
          illustration = genResult.illustration;
        }
      }

      return res.json({
        success: true,
        data: illustration
      });
    } catch (err) {
      console.error('Error fetching illustration:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/generate
   */
  async generate(req, res) {
    try {
      const {
        verseKey,
        style = 'vachanam-editorial-handdrawn',
        language = 'en',
        qualityMode = 'STANDARD',
        provider = null,
        forceRegenerate = false
      } = req.body;

      if (!verseKey) {
        return res.status(400).json({ success: false, error: 'verseKey is required' });
      }

      const verse = await prisma.verse.findUnique({
        where: { verseKey },
        include: { book: true }
      });

      if (!verse) {
        return res.status(404).json({ success: false, error: `Verse not found: ${verseKey}` });
      }

      const result = await imageClient.generateVerseIllustration({
        verseKey,
        bookCode: verse.book.code,
        bookName: verse.book.english,
        chapter: verse.chapterNumber,
        verseNumber: verse.verseNumber,
        verseText: verse.textEnglish,
        language,
        style,
        qualityMode,
        provider,
        forceRegenerate
      });

      return res.status(201).json({
        success: true,
        data: result.illustration,
        fromCache: result.fromCache
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/chapter/:bookCode/:chapterNumber
   * Chapter Batch Image Generation
   */
  async generateChapterImages(req, res) {
    try {
      const { bookCode, chapterNumber } = req.params;
      const { language = 'en', style = 'vachanam-editorial-handdrawn', qualityMode = 'STANDARD' } = req.body;

      const chNum = parseInt(chapterNumber, 10);
      const book = await prisma.book.findFirst({
        where: { code: bookCode.toUpperCase() }
      });

      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }

      const verses = await prisma.verse.findMany({
        where: { bookId: book.id, chapterNumber: chNum },
        orderBy: { verseNumber: 'asc' }
      });

      const verseKeys = verses.map(v => v.verseKey);
      const queueManager = getQueueManager(prisma);

      const job = await queueManager.enqueueJob('illustration-batch', {
        verseKeys,
        language,
        style,
        qualityMode
      }, {
        idempotencyKey: `ch_img_${bookCode}_${chNum}_${language}`
      });

      return res.status(202).json({
        success: true,
        batchJobId: job.jobId,
        bookCode,
        chapterNumber: chNum,
        totalVerses: verseKeys.length,
        message: `Queued batch illustration generation for ${book.english} ${chNum} (${verseKeys.length} verses)`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/book/:bookCode
   * Book Batch Image Generation
   */
  async generateBookImages(req, res) {
    try {
      const { bookCode } = req.params;
      const { language = 'en', startChapter = 1, endChapter = 999 } = req.body;

      const book = await prisma.book.findFirst({
        where: { code: bookCode.toUpperCase() }
      });

      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }

      const verses = await prisma.verse.findMany({
        where: {
          bookId: book.id,
          chapterNumber: { gte: parseInt(startChapter, 10), lte: parseInt(endChapter, 10) }
        },
        orderBy: [{ chapterNumber: 'asc' }, { verseNumber: 'asc' }]
      });

      const verseKeys = verses.map(v => v.verseKey);
      const queueManager = getQueueManager(prisma);

      const job = await queueManager.enqueueJob('illustration-batch', {
        verseKeys,
        language
      }, {
        idempotencyKey: `book_img_${bookCode}_${startChapter}_${endChapter}`
      });

      return res.status(202).json({
        success: true,
        batchJobId: job.jobId,
        bookCode,
        totalVerses: verseKeys.length,
        message: `Queued book illustration batch for ${book.english} (${verseKeys.length} verses)`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/bible/resumable
   * Resumable Full Bible Illustration Pipeline
   */
  async generateBiblePipeline(req, res) {
    try {
      const { language = 'en', batchSize = 50 } = req.body;

      // Discover ungenerated verses
      const existingIllustrations = await prisma.illustration.findMany({
        where: { language, status: 'COMPLETED' },
        select: { verseKey: true }
      });

      const completedSet = new Set(existingIllustrations.map(i => i.verseKey));

      const pendingVerses = await prisma.verse.findMany({
        select: { verseKey: true },
        orderBy: [{ bookId: 'asc' }, { chapterNumber: 'asc' }, { verseNumber: 'asc' }]
      });

      const ungeneratedKeys = pendingVerses
        .map(v => v.verseKey)
        .filter(k => !completedSet.has(k))
        .slice(0, parseInt(batchSize, 10));

      const queueManager = getQueueManager(prisma);
      const job = await queueManager.enqueueJob('illustration-batch', {
        verseKeys: ungeneratedKeys,
        language
      }, {
        idempotencyKey: `bible_pipeline_${Date.now()}`
      });

      return res.status(202).json({
        success: true,
        batchJobId: job.jobId,
        totalRemaining: pendingVerses.length - completedSet.size,
        currentBatchCount: ungeneratedKeys.length,
        completedCount: completedSet.size
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/illustrations/admin/list
   * Admin filter & list
   */
  async adminList(req, res) {
    try {
      const { bookCode, status, provider, qaStatus, limit = 50, page = 1 } = req.query;
      const take = parseInt(limit, 10);
      const skip = (parseInt(page, 10) - 1) * take;

      const where = {};
      if (status) where.status = status;
      if (provider) where.provider = provider;
      if (qaStatus) where.qaStatus = qaStatus;
      if (bookCode) {
        where.verseKey = { startsWith: `${bookCode.toUpperCase()}.` };
      }

      const [items, total] = await Promise.all([
        prisma.illustration.findMany({
          where,
          include: { qaReviews: true, generations: true, verse: { include: { book: true } } },
          orderBy: { createdAt: 'desc' },
          take,
          skip
        }),
        prisma.illustration.count({ where })
      ]);

      return res.json({
        success: true,
        data: items,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: take,
          totalPages: Math.ceil(total / take)
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/admin/:id/approve
   */
  async adminApprove(req, res) {
    try {
      const { id } = req.params;
      const updated = await prisma.illustration.update({
        where: { id: parseInt(id, 10) },
        data: { status: 'COMPLETED', qaStatus: 'PASSED' }
      });
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/admin/:id/reject
   */
  async adminReject(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const updated = await prisma.illustration.update({
        where: { id: parseInt(id, 10) },
        data: { status: 'REJECTED', qaStatus: 'FAILED' }
      });
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * DELETE /api/illustrations/admin/:id
   */
  async adminDelete(req, res) {
    try {
      const { id } = req.params;
      await prisma.illustration.delete({
        where: { id: parseInt(id, 10) }
      });
      return res.json({ success: true, message: 'Illustration metadata deleted' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/illustrations/health
   */
  async getHealth(req, res) {
    try {
      const health = await imageClient.getHealth();
      return res.json({ success: true, data: health });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/illustrations/batch
   * Legacy simple batch compatibility
   */
  async batch(req, res) {
    try {
      const { verseKeys = [], limit = 10, language = 'en' } = req.body;
      const targetKeys = verseKeys.length > 0 ? verseKeys : ['GEN.1.1', 'JHN.3.16', 'PSA.23.1', 'PRO.3.5', 'ROM.8.28'].slice(0, limit);

      const queueManager = getQueueManager(prisma);
      const job = await queueManager.enqueueJob('illustration-batch', {
        verseKeys: targetKeys,
        language
      });

      return res.json({
        success: true,
        batchId: job.jobId,
        status: 'PROCESSING',
        totalItems: targetKeys.length,
        items: targetKeys
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new IllustrationController();
