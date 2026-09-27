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
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-md py-2 border-b border-border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Badge variant="gold" className="text-[10px]">తెలుగు</Badge>
          <span>Telugu Bible</span>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px]">English</Badge>
          <span>King James Version</span>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px]">हिंदी</Badge>
          <span>Hindi Bible</span>
        </div>
      </div>

      {/* Verses Parallel Rows */}
      <div className="divide-y divide-border">
        {verses.map((verse) => (
          <div
            key={verse.verseKey}
            onClick={() => onSelectVerse(verse)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 hover:bg-muted/30 cursor-pointer rounded-xl px-3 transition-colors group"
          >
            {/* Telugu Column */}
            <div className={`space-y-1 font-telugu ${fontSizes[fontSize] || fontSizes.md}`}>
              <div className="flex items-start space-x-2">
                <span className="verse-num text-xs font-bold text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-950/60 px-1.5 py-0.5 rounded">
                  {verse.verseNumber}
                </span>
                <p className="text-foreground leading-relaxed">{verse.textTelugu}</p>
              </div>
            </div>

            {/* English Column */}
            <div className={`space-y-1 font-serif ${fontSizes[fontSize] || fontSizes.md}`}>
              <div className="flex items-start space-x-2">
                <span className="md:hidden verse-num text-xs font-bold text-muted-foreground">EN {verse.verseNumber}:</span>
                <p className="text-foreground/90 leading-relaxed">{verse.textEnglish}</p>
              </div>
            </div>

            {/* Hindi Column */}
            <div className={`space-y-1 font-devanagari ${fontSizes[fontSize] || fontSizes.md}`}>
              <div className="flex items-start space-x-2">
                <span className="md:hidden verse-num text-xs font-bold text-muted-foreground">HI {verse.verseNumber}:</span>
                <p className="text-foreground/90 leading-relaxed">{verse.textHindi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
