const prisma = require('../config/db');
const cache = require('./cacheService');

class BibleService {
  async getAllBooks(testament = null) {
    const cacheKey = `books_${testament || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const where = testament ? { testament: testament.toUpperCase() } : {};
    const books = await prisma.book.findMany({
      where,
      orderBy: { orderIndex: 'asc' }
    });

    cache.set(cacheKey, books, 86400); // 24hr cache
    return books;
  }

  async getBook(bookIdentifier) {
    const isId = !isNaN(parseInt(bookIdentifier, 10)) && Number(bookIdentifier) > 0;
    const cacheKey = `book_${bookIdentifier}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let book = null;
    if (isId) {
      book = await prisma.book.findUnique({
        where: { id: parseInt(bookIdentifier, 10) }
      });
    } else {
      book = await prisma.book.findFirst({
        where: {
          OR: [
            { code: { equals: bookIdentifier.toUpperCase() } },
            { shortCode: { equals: bookIdentifier } }
          ]
        }
      });
    }

    if (book) {
      cache.set(cacheKey, book, 86400);
    }
    return book;
  }

  async getChapter(bookCode, chapterNumber) {
    const chNum = parseInt(chapterNumber, 10);
    const book = await this.getBook(bookCode);
    if (!book) return null;

    const cacheKey = `chapter_${book.code}_${chNum}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const chapter = await prisma.chapter.findUnique({
      where: {
        bookId_chapterNumber: {
          bookId: book.id,
          chapterNumber: chNum
        }
      },
      include: {
        book: true,
        verses: {
          orderBy: { verseNumber: 'asc' },
          include: {
            explanations: true,
            images: true
          }
        },
        audios: true
      }
    });

    if (chapter) {
      cache.set(cacheKey, chapter, 3600);
    }
    return chapter;
  }

  async getVerse(verseKey) {
    const cacheKey = `verse_${verseKey}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const verse = await prisma.verse.findUnique({
      where: { verseKey },
      include: {
        book: true,
        chapter: true,
        explanations: true,
        images: true,
        audios: true
      }
    });

    if (verse) {
      cache.set(cacheKey, verse, 3600);
    }
    return verse;
  }

  async getNavigation(bookCode, chapterNumber) {
    const book = await this.getBook(bookCode);
    if (!book) return null;

    const currentCh = parseInt(chapterNumber, 10);
    let prev = null;
    let next = null;

    if (currentCh > 1) {
      prev = { bookCode: book.code, chapterNumber: currentCh - 1 };
    } else if (book.id > 1) {
      const prevBook = await prisma.book.findUnique({ where: { id: book.id - 1 } });
      if (prevBook) {
        prev = { bookCode: prevBook.code, chapterNumber: prevBook.chaptersCount };
      }
    }

    if (currentCh < book.chaptersCount) {
      next = { bookCode: book.code, chapterNumber: currentCh + 1 };
    } else if (book.id < 66) {
      const nextBook = await prisma.book.findUnique({ where: { id: book.id + 1 } });
      if (nextBook) {
        next = { bookCode: nextBook.code, chapterNumber: 1 };
      }
    }

    return { prev, current: { bookCode: book.code, chapterNumber: currentCh }, next };
  }
}

module.exports = new BibleService();
