'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { HIGHLIGHT_COLORS } from '@vachanam/shared';

export function VerseView({
  verses,
  book,
  chapterNumber,
  onSelectVerse,
  highlights = {},
  fontSize = 'md',
  fontFamily = 'serif'
}) {
  const { language } = useI18n();

  const fontSizes = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-loose',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose'
  };

  const fontFamilies = {
    serif: 'font-serif',
    sans: 'font-sans',
    telugu: 'font-telugu',
    devanagari: 'font-devanagari'
  };

  const getHighlightClass = (verseKey) => {
    const colorId = highlights[verseKey];
    if (!colorId) return '';
    const match = HIGHLIGHT_COLORS.find(c => c.id === colorId);
    return match ? match.class : '';
  };

  return (
    <div className={`space-y-4 max-w-3xl mx-auto ${fontSizes[fontSize] || fontSizes.md}`}>
      {verses.map((verse, idx) => {
        const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;
        const isFirstVerse = verse.verseNumber === 1;
        const hlClass = getHighlightClass(verse.verseKey);

        return (
          <span
            key={verse.id || verse.verseKey || idx}
            onClick={() => onSelectVerse(verse)}
            className={`inline group cursor-pointer rounded-lg px-1 py-0.5 transition-colors hover:bg-gold-100/60 dark:hover:bg-gold-950/40 ${hlClass}`}
          >
            {/* Verse Number Indicator */}
            <sup className="verse-num font-bold text-xs text-gold-600 dark:text-gold-400 select-none mr-1.5 group-hover:underline">
              {verse.verseNumber}
            </sup>

            {/* Drop Cap for Verse 1 in Book Mode */}
            {isFirstVerse ? (
              <span className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-primary-900 dark:first-letter:text-gold-300 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                {text}
              </span>
            ) : (
              <span>{text}</span>
            )}{' '}
          </span>
        );
      })}
    </div>
  );
}
