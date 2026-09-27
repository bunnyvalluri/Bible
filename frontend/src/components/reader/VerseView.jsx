'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { HIGHLIGHT_COLORS } from '@vachanam/shared';
import { Sparkles, Palette, Volume2, Copy, Bookmark, MessageSquare } from 'lucide-react';

export function VerseView({
  verses,
  book,
  chapterNumber,
  onSelectVerse,
  highlights = {},
  fontSize = 'md',
  fontFamily = 'serif',
  isVerseByVerse = true
}) {
  const { language } = useI18n();

  const fontSizes = {
    sm: 'text-base sm:text-lg leading-relaxed',
    md: 'text-lg sm:text-xl leading-loose',
    lg: 'text-xl sm:text-2xl leading-loose',
    xl: 'text-2xl sm:text-3xl leading-loose'
  };

  const getHighlightClass = (verseKey) => {
    const colorId = highlights[verseKey];
    if (!colorId) return '';
    const match = HIGHLIGHT_COLORS.find(c => c.id === colorId);
    return match ? match.class : '';
  };

  if (isVerseByVerse) {
    return (
      <div className={`space-y-4 sm:space-y-6 max-w-4xl mx-auto text-[#171717] ${fontSizes[fontSize] || fontSizes.md}`}>
        {verses.map((verse, idx) => {
          const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;
          const hlClass = getHighlightClass(verse.verseKey);

          return (
            <div
              key={verse.id || verse.verseKey || idx}
              onClick={() => onSelectVerse(verse)}
              className={`group relative rounded-2xl p-3 sm:p-4 transition-all cursor-pointer border border-transparent hover:border-gold-300 hover:bg-[#FEFCE8]/40 ${hlClass}`}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Verse Number Badge */}
                <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 text-[#163A5F] group-hover:bg-[#163A5F] group-hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center font-mono transition-colors shadow-sm select-none">
                  {verse.verseNumber}
                </span>

                {/* Verse Text */}
                <div className="flex-1 font-serif tracking-normal">
                  <p className="leading-relaxed sm:leading-loose text-[#171717]">
                    {text}
                  </p>
                </div>
              </div>

              {/* Quick Hover Action Pill (Desktop) */}
              <div className="hidden group-hover:flex items-center space-x-1.5 absolute right-4 bottom-2 bg-white/95 backdrop-blur-sm border border-[#E5E7EB] rounded-xl px-2 py-1 shadow-md text-xs text-[#737373]">
                <span className="text-[10px] font-bold text-[#163A5F] uppercase font-sans mr-1">Options</span>
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Continuous Editorial Paragraph Mode
  return (
    <div className={`max-w-4xl mx-auto text-[#171717] font-serif ${fontSizes[fontSize] || fontSizes.md} space-y-4`}>
      <p className="leading-loose">
        {verses.map((verse, idx) => {
          const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;
          const hlClass = getHighlightClass(verse.verseKey);

          return (
            <span
              key={verse.id || verse.verseKey || idx}
              onClick={() => onSelectVerse(verse)}
              className={`inline group cursor-pointer rounded-md px-1 py-0.5 transition-colors hover:bg-[#FEFCE8] ${hlClass}`}
            >
              <sup className="verse-num font-bold text-xs text-[#163A5F] select-none mr-1 font-mono font-sans group-hover:underline">
                {verse.verseNumber}
              </sup>
              <span>{text}</span>{' '}
            </span>
          );
        })}
      </p>
    </div>
  );
}
