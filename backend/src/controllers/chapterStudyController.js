const prisma = require('../config/db');
const { getQueueManager } = require('../queues/QueueManager');
const { successResponse, errorResponse } = require('../utils/response');

class ChapterStudyController {
  constructor() {
    this.queueManager = getQueueManager(prisma);
  }

  // Generate study content (AI explanations & illustrations) for all verses in a chapter
  generateChapterStudyContent = async (req, res, next) => {
    try {
      const { bookCode, chapterNumber } = req.params;
      const { language = 'en', includeIllustrations = true, includeExplanations = true } = req.body;

      const book = await prisma.book.findFirst({
        where: {
          OR: [
            { code: { equals: bookCode.toUpperCase() } },
            { shortCode: { equals: bookCode } }
          ]
        }
      });

      if (!book) {
        return errorResponse(res, `Book not found: ${bookCode}`, 404);
      }

      const chapter = await prisma.chapter.findUnique({
        where: {
          bookId_chapterNumber: {
            bookId: book.id,
            chapterNumber: parseInt(chapterNumber, 10)
          }
        },
        include: {
          verses: {
            orderBy: { verseNumber: 'asc' }
          }
        }
      });

      if (!chapter || !chapter.verses || chapter.verses.length === 0) {
        return errorResponse(res, `No verses found for ${bookCode} chapter ${chapterNumber}`, 404);
      }

      const jobs = [];

      for (const verse of chapter.verses) {
        if (includeExplanations) {
          const expJob = await this.queueManager.enqueueJob('ai-explanation', {
            verseKey: verse.verseKey,
            language
          }, {
            idempotencyKey: `ai_exp_${verse.verseKey}_${language}`
          });
          jobs.push({ type: 'ai-explanation', verseKey: verse.verseKey, jobId: expJob.jobId });
        }

        if (includeIllustrations) {
          const illJob = await this.queueManager.enqueueJob('illustration', {
            verseKey: verse.verseKey,
            style: 'vachanam-editorial-handdrawn',
            language
          }, {
            idempotencyKey: `ill_${verse.verseKey}`
          });
          jobs.push({ type: 'illustration', verseKey: verse.verseKey, jobId: illJob.jobId });
        }
      }

      return successResponse(res, {
        bookCode: book.code,
        chapterNumber: chapter.chapterNumber,
        totalVerses: chapter.verses.length,
        dispatchedJobsCount: jobs.length,
        jobs
      }, `Study content generation queued for ${chapter.verses.length} verses`);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new ChapterStudyController();
