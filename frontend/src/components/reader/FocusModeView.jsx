'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '../ui/button';
import { Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';

export function FocusModeView({
  verses,
  book,
  chapterNumber,
  onExitFocus,
  onPrevChapter,
  onNextChapter,
  fontSize = 'lg'
}) {
  const { language } = useI18n();

  const fontSizes = {
    sm: 'text-lg leading-loose',
    md: 'text-xl leading-loose',
    lg: 'text-2xl leading-loose',
    xl: 'text-3xl leading-loose'
  };

  const bookTitle = language === 'te' ? book.telugu : language === 'hi' ? book.hindi : book.english;

  return (
    <div className="fixed inset-0 z-50 bg-white text-[#171717] overflow-y-auto px-6 py-12 transition-colors">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Top Minimal Toolbar */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-serif">
              Focus Meditation Mode
            </span>
            <h2 className="text-2xl font-bold font-serif text-[#163A5F]">
              {bookTitle} {chapterNumber}
            </h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExitFocus}
            className="rounded-full flex items-center space-x-1.5 border-[#E5E7EB] text-[#171717] bg-white hover:bg-slate-50"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Focus</span>
          </Button>
        </div>

        {/* Reading Text */}
        <div className={`font-serif space-y-6 text-[#171717] ${fontSizes[fontSize] || fontSizes.lg}`}>
          {verses.map((verse) => {
            const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;
            return (
              <p key={verse.verseKey} className="leading-relaxed hover:text-gold-700 transition-colors">
                <span className="verse-num text-sm text-gold-600 font-bold mr-2 select-none">
                  {verse.verseNumber}
                </span>
                {text}
              </p>
            );
          })}
        </div>

        {/* Bottom Minimal Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-border/40">
          <Button variant="ghost" size="sm" onClick={onPrevChapter}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous Chapter
          </Button>

          <Button variant="ghost" size="sm" onClick={onNextChapter}>
            Next Chapter
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
