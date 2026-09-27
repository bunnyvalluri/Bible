'use client';

import React from 'react';
import { Badge } from '../ui/card';

export function ParallelVerseView({
  verses,
  book,
  chapterNumber,
  onSelectVerse,
  highlights = {},
  fontSize = 'md'
}) {
  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-relaxed'
  };

  return (
    <div className="space-y-4">
      {/* Column Headers */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md py-2 border-b border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold uppercase tracking-wider text-[#525252]">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px] bg-[#F8FAFC] text-[#163A5F] border-[#E5E7EB]">తెలుగు</Badge>
          <span>Telugu Bible</span>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px] bg-[#F8FAFC] text-[#163A5F] border-[#E5E7EB]">English</Badge>
          <span>King James Version</span>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px] bg-[#F8FAFC] text-[#163A5F] border-[#E5E7EB]">हिंदी</Badge>
          <span>Hindi Bible</span>
        </div>
      </div>

      {/* Verses Parallel Rows */}
      <div className="divide-y divide-[#E5E7EB]">
        {verses.map((verse) => (
          <div
            key={verse.verseKey}
            onClick={() => onSelectVerse(verse)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 hover:bg-[#F8FAFC] cursor-pointer rounded-xl px-3 transition-colors group"
          >
            {/* Telugu Column */}
            <div className={`space-y-1 font-telugu text-[#171717] ${fontSizes[fontSize] || fontSizes.md}`}>
              <div className="flex items-start space-x-2">
                <span className="verse-num text-xs font-bold text-[#163A5F] bg-[#F8FAFC] border border-[#E5E7EB] px-1.5 py-0.5 rounded">
                  {verse.verseNumber}
                </span>
                <p className="leading-relaxed">{verse.textTelugu}</p>
              </div>
            </div>

            {/* English Column */}
            <div className={`space-y-1 font-serif text-[#171717] ${fontSizes[fontSize] || fontSizes.md}`}>
              <div className="flex items-start space-x-2">
                <span className="md:hidden verse-num text-xs font-bold text-[#737373]">EN {verse.verseNumber}:</span>
                <p className="leading-relaxed text-[#262626]">{verse.textEnglish}</p>
              </div>
            </div>

            {/* Hindi Column */}
            <div className={`space-y-1 font-devanagari text-[#171717] ${fontSizes[fontSize] || fontSizes.md}`}>
              <div className="flex items-start space-x-2">
                <span className="md:hidden verse-num text-xs font-bold text-[#737373]">HI {verse.verseNumber}:</span>
                <p className="leading-relaxed text-[#262626]">{verse.textHindi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
