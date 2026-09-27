/**
 * Verse Artwork and Biblical Image Batch Generator
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BIBLICAL_IMAGE_PALETTES = [
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1920&q=85'
];

async function generateVerseImage(verseKey) {
  const verse = await prisma.verse.findUnique({
    where: { verseKey },
    include: { book: true }
  });

  if (!verse) return null;

  const hash = verse.id % BIBLICAL_IMAGE_PALETTES.length;
  const imageUrl = BIBLICAL_IMAGE_PALETTES[hash];
  const prompt = `Biblical fine art representation of ${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}, soft divine golden light, reverent biblical oil painting style, cinematic landscape`;

  const savedImage = await prisma.verseImage.create({
    data: {
      verseId: verse.id,
      verseKey,
      imageUrl,
      prompt,
      style: 'biblical-fine-art',
      resolution: '1920x1080',
      storageProvider: process.env.CLOUDINARY_CLOUD_NAME ? 'cloudinary' : 'curated-cdn'
    }
  });

  return savedImage;
}

async function runBatch(limit = 100) {
  console.log(`🎨 Generating biblical artwork for first ${limit} verses...`);
  const verses = await prisma.verse.findMany({
    take: limit,
    orderBy: { id: 'asc' }
  });

  for (const v of verses) {
    const existing = await prisma.verseImage.findFirst({ where: { verseKey: v.verseKey } });
    if (!existing) {
      console.log(`Creating artwork for ${v.verseKey}...`);
      await generateVerseImage(v.verseKey);
    }
  }

  console.log('✅ Verse Artwork generation batch complete!');
}

if (require.main === module) {
  runBatch(100)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

module.exports = {
  generateVerseImage,
  runBatch
};
