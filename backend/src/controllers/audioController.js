const ttsService = require('../services/ttsService');
const imageService = require('../services/imageService');
const { successResponse } = require('../utils/response');

class MediaController {
  async getChapterAudio(req, res, next) {
    try {
      const { chapterId } = req.params;
      const { lang = 'en' } = req.query;
      const audio = await ttsService.getChapterAudio(chapterId, lang);
      return successResponse(res, audio, 'Audio track retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getVerseAudio(req, res, next) {
    try {
      const { verseKey } = req.params;
      const { lang = 'en' } = req.query;
      const audio = await ttsService.getVerseAudio(verseKey, lang);
      return successResponse(res, audio, 'Verse audio retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getVerseArtwork(req, res, next) {
    try {
      const { verseKey } = req.params;
      const images = await imageService.getVerseArtwork(verseKey);
      return successResponse(res, images, 'Verse artwork retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MediaController();
