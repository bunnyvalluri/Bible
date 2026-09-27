const prisma = require('../config/db');
const cache = require('../services/cacheService');
const { runBatch: runAIBatch } = require('../../../scripts/generateAIExplanations');
const { runBatch: runImageBatch } = require('../../../scripts/generateVerseImages');
const { runBatch: runAudioBatch } = require('../../../scripts/generateAudioFiles');
const { successResponse, errorResponse } = require('../utils/response');

class AdminController {
  async getSystemHealth(req, res, next) {
    try {
      const [
        totalBooks,
        totalChapters,
        totalVerses,
        totalExplanations,
        totalDiagrams,
        totalImages,
        totalAudios,
        totalBookmarks,
        totalNotes
      ] = await Promise.all([
        prisma.book.count(),
        prisma.chapter.count(),
        prisma.verse.count(),
        prisma.explanation.count(),
        prisma.diagram.count(),
        prisma.verseImage.count(),
        prisma.audio.count(),
        prisma.bookmark.count(),
        prisma.note.count()
      ]);

      const stats = {
        database: 'Connected',
        status: 'Healthy',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cacheStats: cache.getStats(),
        counts: {
          books: totalBooks,
          chapters: totalChapters,
          verses: totalVerses,
          explanations: totalExplanations,
          diagrams: totalDiagrams,
          images: totalImages,
          audios: totalAudios,
          bookmarks: totalBookmarks,
          notes: totalNotes
        }
      };

      return successResponse(res, stats, 'System health report generated');
    } catch (err) {
      next(err);
    }
  }

  async triggerAIBatch(req, res, next) {
    try {
      const limit = parseInt(req.body.limit || '20', 10);
      runAIBatch(limit).catch(err => console.error('Async AI batch error:', err));
      return successResponse(res, { status: 'Triggered', limit }, `AI explanation batch triggered for ${limit} verses`);
    } catch (err) {
      next(err);
    }
  }

  async triggerImageBatch(req, res, next) {
    try {
      const limit = parseInt(req.body.limit || '50', 10);
      runImageBatch(limit).catch(err => console.error('Async image batch error:', err));
      return successResponse(res, { status: 'Triggered', limit }, `Verse artwork batch triggered for ${limit} verses`);
    } catch (err) {
      next(err);
    }
  }

  async triggerAudioBatch(req, res, next) {
    try {
      const limit = parseInt(req.body.limit || '10', 10);
      runAudioBatch(limit).catch(err => console.error('Async audio batch error:', err));
      return successResponse(res, { status: 'Triggered', limit }, `Audio generation batch triggered for ${limit} chapters`);
    } catch (err) {
      next(err);
    }
  }

  async flushCache(req, res, next) {
    try {
      cache.flush();
      return successResponse(res, { flushed: true }, 'Application memory cache cleared successfully');
    } catch (err) {
      next(err);
    }
  }

  async importCustomBibleData(req, res, next) {
    try {
      const { verses } = req.body;
      if (!Array.isArray(verses) || verses.length === 0) {
        return errorResponse(res, 'Verses array is required', 400);
      }

      let importedCount = 0;
      for (const v of verses) {
        if (v.verseKey && v.bookId && v.chapterNumber && v.verseNumber) {
          await prisma.verse.upsert({
            where: { verseKey: v.verseKey },
            update: {
              textTelugu: v.textTelugu || '',
              textEnglish: v.textEnglish || '',
              textHindi: v.textHindi || ''
            },
            create: {
              verseKey: v.verseKey,
              bookId: v.bookId,
              chapterNumber: v.chapterNumber,
              verseNumber: v.verseNumber,
              textTelugu: v.textTelugu || '',
              textEnglish: v.textEnglish || '',
              textHindi: v.textHindi || ''
            }
          });
          importedCount++;
        }
      }

      return successResponse(res, { imported: importedCount }, `Successfully imported ${importedCount} verses.`);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
