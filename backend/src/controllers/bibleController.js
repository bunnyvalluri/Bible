const bibleService = require('../services/bibleService');
const { successResponse, errorResponse } = require('../utils/response');

class BibleController {
  async getBooks(req, res, next) {
    try {
      const { testament } = req.query;
      const books = await bibleService.getAllBooks(testament);
      return successResponse(res, books, 'Books retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getBook(req, res, next) {
    try {
      const { identifier } = req.params;
      const book = await bibleService.getBook(identifier);
      if (!book) {
        return errorResponse(res, `Book not found: ${identifier}`, 404);
      }
      return successResponse(res, book, 'Book retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getChapter(req, res, next) {
    try {
      const { bookCode, chapterNumber } = req.params;
      const chapter = await bibleService.getChapter(bookCode, chapterNumber);
      if (!chapter) {
        return errorResponse(res, `Chapter ${chapterNumber} not found for book ${bookCode}`, 404);
      }
      const navigation = await bibleService.getNavigation(bookCode, chapterNumber);
      return successResponse(res, { ...chapter, navigation }, 'Chapter retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getVerse(req, res, next) {
    try {
      const { verseKey } = req.params;
      const verse = await bibleService.getVerse(verseKey);
      if (!verse) {
        return errorResponse(res, `Verse ${verseKey} not found`, 404);
      }
      return successResponse(res, verse, 'Verse retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BibleController();
