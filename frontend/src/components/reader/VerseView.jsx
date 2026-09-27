'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { VerseBlock } from './VerseBlock';
import { ChapterStudyBar } from './ChapterStudyBar';

export function VerseView({
  verses = [],
  book,
  chapterNumber,
  onSelectVerse,
  highlights = {},
  fontSize = 'md',
  fontFamily = 'serif',
  isVerseByVerse = true,
  onRefreshChapter
}) {
  const { language } = useI18n();
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [showAllIllustrations, setShowAllIllustrations] = useState(false);

  if (isVerseByVerse) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {/* Chapter Level Study Bar */}
        <ChapterStudyBar
          book={book}
          chapterNumber={chapterNumber}
          totalVerses={verses.length}
          showAllExplanations={showAllExplanations}
          onToggleAllExplanations={() => setShowAllExplanations(!showAllExplanations)}
          showAllIllustrations={showAllIllustrations}
          onToggleAllIllustrations={() => setShowAllIllustrations(!showAllIllustrations)}
          onRefreshChapter={onRefreshChapter}
        />

        {/* Verse-By-Verse Content Units */}
        <div className="space-y-4 sm:space-y-6">
          {verses.map((verse, idx) => {
            const verseExplanation = verse.explanations?.find(
              (e) => e.language === language || e.language === 'en'
            ) || verse.explanations?.[0];

            const verseIllustration = verse.illustrations?.find(
              (i) => i.language === language || i.language === 'en'
            ) || verse.illustrations?.[0];

            return (
              <VerseBlock
                key={verse.id || verse.verseKey || idx}
                verse={verse}
                book={book}
                chapterNumber={chapterNumber}
                explanation={verseExplanation}
                illustration={verseIllustration}
                forceShowExplanation={showAllExplanations}
                forceShowIllustration={showAllIllustrations}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Continuous Editorial Paragraph Mode
  return (
    <div className="max-w-4xl mx-auto text-[#171717] font-serif space-y-4">
      {/* Chapter Level Study Bar */}
      <ChapterStudyBar
        book={book}
        chapterNumber={chapterNumber}
        totalVerses={verses.length}
        showAllExplanations={showAllExplanations}
        onToggleAllExplanations={() => setShowAllExplanations(!showAllExplanations)}
        showAllIllustrations={showAllIllustrations}
        onToggleAllIllustrations={() => setShowAllIllustrations(!showAllIllustrations)}
        onRefreshChapter={onRefreshChapter}
      />

      <div className="p-6 sm:p-8 bg-white border border-gray-100 rounded-3xl shadow-xs leading-loose">
        <p className="text-base sm:text-lg text-gray-900 leading-[2.2]">
          {verses.map((verse, idx) => {
            const text =
              language === 'te'
                ? verse.textTelugu || verse.textEnglish
                : language === 'hi'
                ? verse.textHindi || verse.textEnglish
                : verse.textEnglish;

            return (
              <span
                key={verse.id || verse.verseKey || idx}
                onClick={() => onSelectVerse && onSelectVerse(verse)}
                className="inline group cursor-pointer rounded-md px-1 py-0.5 transition-colors hover:bg-gold-50/60"
              >
                <sup className="verse-num font-bold text-xs text-[#163A5F] select-none mr-1 font-mono group-hover:underline">
                  {verse.verseNumber}
                </sup>
                <span className="font-serif">{text}</span>{' '}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
