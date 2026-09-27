const prisma = require('../config/db');

const ARTWORK_IMAGES = [
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1920&q=85'
];

class ImageService {
  async getVerseArtwork(verseKey) {
    const images = await prisma.verseImage.findMany({
      where: { verseKey }
    });

    if (images.length > 0) return images;

    const verse = await prisma.verse.findUnique({
      where: { verseKey },
      include: { book: true }
    });

    const hash = (verse ? verse.id : 1) % ARTWORK_IMAGES.length;
    return [
      {
        verseKey,
        imageUrl: ARTWORK_IMAGES[hash],
        prompt: `Biblical artwork of ${verseKey}`,
        style: 'biblical-oil-painting',
        resolution: '1920x1080'
      }
    ];
  }
}

module.exports = new ImageService();
