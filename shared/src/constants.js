/**
 * Shared Application Constants for Vachanam
 */

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', fontClass: 'font-inter' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', fontClass: 'font-telugu' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', fontClass: 'font-devanagari' }
];

const READING_MODES = {
  BOOK: 'book',             // Standard single book/chapter layout
  PARALLEL: 'parallel',     // Multi-column translation (Telugu + English + Hindi)
  COMPARE: 'compare',       // Verse-by-verse comparison modal/drawer
  SINGLE: 'single',         // Clean minimalist single language
  FOCUS: 'focus'            // Distraction-free full-screen reader with ambient styles
};

const DIAGRAM_TYPES = {
  FLOWCHART: 'flowchart',
  TIMELINE: 'timeline',
  CHARACTER_RELATIONSHIP: 'relationship',
  INFOGRAPHIC: 'infographic',
  MINDMAP: 'mindmap',
  CONCEPT_MAP: 'concept',
  JOURNEY_MAP: 'journey'
};

const HIGHLIGHT_COLORS = [
  { id: 'gold', name: 'Spiritual Gold', class: 'bg-amber-300/40 text-amber-950 dark:bg-amber-400/30 dark:text-amber-100 border-b-2 border-amber-500' },
  { id: 'emerald', name: 'Grace Green', class: 'bg-emerald-300/40 text-emerald-950 dark:bg-emerald-400/30 dark:text-emerald-100 border-b-2 border-emerald-500' },
  { id: 'sapphire', name: 'Peace Blue', class: 'bg-sky-300/40 text-sky-950 dark:bg-sky-400/30 dark:text-sky-100 border-b-2 border-sky-500' },
  { id: 'ruby', name: 'Love Red', class: 'bg-rose-300/40 text-rose-950 dark:bg-rose-400/30 dark:text-rose-100 border-b-2 border-rose-500' },
  { id: 'amethyst', name: 'Wisdom Purple', class: 'bg-purple-300/40 text-purple-950 dark:bg-purple-400/30 dark:text-purple-100 border-b-2 border-purple-500' }
];

const AUDIO_SPEEDS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

const FONT_SIZES = [
  { id: 'sm', label: 'Small', class: 'text-base leading-relaxed' },
  { id: 'md', label: 'Medium', class: 'text-lg leading-loose' },
  { id: 'lg', label: 'Large', class: 'text-xl leading-loose' },
  { id: 'xl', label: 'Extra Large', class: 'text-2xl leading-loose' }
];

module.exports = {
  LANGUAGES,
  READING_MODES,
  DIAGRAM_TYPES,
  HIGHLIGHT_COLORS,
  AUDIO_SPEEDS,
  FONT_SIZES
};
