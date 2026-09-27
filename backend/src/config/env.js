const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'vachanam_admin_secret_key_2026',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'vachanam-audio-bible',
  GOOGLE_TTS_API_KEY: process.env.GOOGLE_TTS_API_KEY || '',
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10)
};
