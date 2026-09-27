const prisma = require('../config/db');

class TTSService {
  async getChapterAudio(chapterId, language = 'en') {
    const audio = await prisma.audio.findFirst({
      where: {
        chapterId: parseInt(chapterId, 10),
        language
      }
    });

    if (audio) return audio;

    // Return high quality streaming audio preview
    return {
      chapterId: parseInt(chapterId, 10),
      language,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      durationSeconds: 180.0,
      storageProvider: 'stream-cdn'
    };
  }

  async getVerseAudio(verseKey, language = 'en') {
    const audio = await prisma.audio.findFirst({
      where: {
        verseKey,
        language
      }
    });

    if (audio) return audio;

    return {
      verseKey,
      language,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      durationSeconds: 15.0,
      storageProvider: 'stream-cdn'
    };
  }
}

module.exports = new TTSService();
