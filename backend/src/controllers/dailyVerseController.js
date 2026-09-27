const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

class DailyVerseController {
  async getToday(req, res, next) {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      let daily = await prisma.dailyVerse.findUnique({
        where: { dateKey: todayKey }
      });

      if (!daily) {
        // Find latest available or default
        daily = await prisma.dailyVerse.findFirst({
          orderBy: { id: 'desc' }
        });
      }

      if (!daily) {
        // Fallback John 3:16
        return successResponse(res, {
          dateKey: todayKey,
          verseKey: 'JHN.3.16',
          reference: 'John 3:16 • యోహాను 3:16 • यूहन्ना 3:16',
          theme: 'Unconditional Grace',
          verseTextEn: 'For God so loved the world, that he gave his only begotten Son...',
          verseTextTe: 'దేవుడు లోకమును ఎంతో ప్రేమించెను...',
          verseTextHi: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा...',
          imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80'
        });
      }

      return successResponse(res, daily, 'Daily verse retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DailyVerseController();
