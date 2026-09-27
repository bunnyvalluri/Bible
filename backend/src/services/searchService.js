const prisma = require('../config/db');

class SearchService {
  async search({ query, language = 'all', bookCode = null, testament = null, limit = 20, page = 1 }) {
    if (!query || !query.trim()) {
      return { results: [], total: 0, page: 1, totalPages: 0 };
    }

    const q = query.trim();
    const skip = (page - 1) * limit;

    // Check if query is a verse reference like "John 3:16" or "PSA 23" or "మత్తయి 5:3"
    const refMatch = q.match(/^([A-Za-z0-9\u0C00-\u0C7F\u0900-\u097F\s]+)\s+(\d+)(?::(\d+))?$/);
    if (refMatch) {
      const bookQuery = refMatch[1].trim();
      const chNum = parseInt(refMatch[2], 10);
      const vNum = refMatch[3] ? parseInt(refMatch[3], 10) : null;

      const book = await prisma.book.findFirst({
        where: {
          OR: [
            { english: { contains: bookQuery } },
            { telugu: { contains: bookQuery } },
            { hindi: { contains: bookQuery } },
            { code: { equals: bookQuery.toUpperCase() } }
          ]
        }
      });

      if (book) {
        const whereClause = {
          bookId: book.id,
          chapterNumber: chNum
        };
        if (vNum) {
          whereClause.verseNumber = vNum;
        }

        const [verses, total] = await Promise.all([
          prisma.verse.findMany({
            where: whereClause,
            include: { book: true },
            take: limit,
            skip
          }),
          prisma.verse.count({ where: whereClause })
        ]);

        return {
          results: verses.map(v => this.formatVerseResult(v, q)),
          total,
          page,
          totalPages: Math.ceil(total / limit)
        };
      }
    }

    // General text search across Telugu, English, and Hindi
    const textConditions = [];
    if (language === 'te' || language === 'all') {
      textConditions.push({ textTelugu: { contains: q } });
    }
    if (language === 'en' || language === 'all') {
      textConditions.push({ textEnglish: { contains: q } });
    }
    if (language === 'hi' || language === 'all') {
      textConditions.push({ textHindi: { contains: q } });
    }

    const where = {
      OR: textConditions
    };

    if (bookCode) {
      const book = await prisma.book.findFirst({
        where: { code: bookCode.toUpperCase() }
      });
      if (book) {
        where.bookId = book.id;
      }
    }

    if (testament) {
      where.book = { testament: testament.toUpperCase() };
    }

    const [verses, total] = await Promise.all([
      prisma.verse.findMany({
        where,
        include: { book: true },
        take: limit,
        skip,
        orderBy: [{ bookId: 'asc' }, { chapterNumber: 'asc' }, { verseNumber: 'asc' }]
      }),
      prisma.verse.count({ where })
    ]);

    return {
      results: verses.map(v => this.formatVerseResult(v, q)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  formatVerseResult(verse, query) {
    return {
      id: verse.id,
      verseKey: verse.verseKey,
      bookId: verse.bookId,
      bookCode: verse.book.code,
      bookEnglish: verse.book.english,
      bookTelugu: verse.book.telugu,
      bookHindi: verse.book.hindi,
      chapterNumber: verse.chapterNumber,
      verseNumber: verse.verseNumber,
      textTelugu: verse.textTelugu,
      textEnglish: verse.textEnglish,
      textHindi: verse.textHindi,
      reference: `${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}`,
      referenceTelugu: `${verse.book.telugu} ${verse.chapterNumber}:${verse.verseNumber}`,
      referenceHindi: `${verse.book.hindi} ${verse.chapterNumber}:${verse.verseNumber}`
    };
  }

  async getSuggestions(query, language = 'en') {
    if (!query || query.length < 2) return [];
    const q = query.trim();

    // Suggest matching books or popular topics
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { english: { contains: q } },
          { telugu: { contains: q } },
          { hindi: { contains: q } },
          { code: { contains: q.toUpperCase() } }
        ]
      },
      take: 5
    });

    const bookSuggestions = books.map(b => ({
      type: 'book',
      text: `${b.english} (${b.telugu})`,
      query: b.english,
      code: b.code
    }));

    return bookSuggestions;
  }

  getPopularSearches() {
    return [
      { text: 'John 3:16', te: 'యోహాను 3:16', hi: 'यूहन्ना 3:16', query: 'John 3:16' },
      { text: 'Psalm 23', te: 'కీర్తనలు 23', hi: 'भजन 23', query: 'PSA 23' },
      { text: 'Love / ప్రేమ', te: 'ప్రేమ', hi: 'प्रेम', query: 'love' },
      { text: 'Peace / సమాధానం', te: 'సమాధానం', hi: 'शांति', query: 'peace' },
      { text: 'Faith / విశ్వాసం', te: 'విశ్వాసం', hi: 'विश्वास', query: 'faith' },
      { text: 'Hope / నిరీక్షణ', te: 'నిరీక్షణ', hi: 'आशा', query: 'hope' }
    ];
  }
}

module.exports = new SearchService();
