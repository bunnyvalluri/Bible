import books from './src/books.js';
import constants from './src/constants.js';
import readingPlans from './src/readingPlans.js';
import diagramTemplates from './src/diagramTemplates.js';

export const { BIBLE_BOOKS, getBookById, getBookByCode, getBookByName, getBookName } = books;
export const { LANGUAGES, READING_MODES, DIAGRAM_TYPES, HIGHLIGHT_COLORS, AUDIO_SPEEDS, FONT_SIZES } = constants;
export const { READING_PLANS } = readingPlans;
export const { DIAGRAM_TEMPLATES, getDiagramsByBook, getDiagramById } = diagramTemplates;

export default {
  ...books,
  ...constants,
  ...readingPlans,
  ...diagramTemplates
};
