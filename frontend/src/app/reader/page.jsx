'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useAudio } from '@/components/audio/AudioContext';
import { addReadingHistory, getHighlights } from '@/lib/storage';
import { BIBLE_BOOKS, READING_MODES } from '@vachanam/shared';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  SlidersHorizontal,
  Sparkles,
  Columns,
  Maximize2,
  Copy,
  Layers,
  ArrowLeft,
  ChevronDown,
  List,
  AlignLeft,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';
import { VerseView } from '@/components/reader/VerseView';
import { ParallelVerseView } from '@/components/reader/ParallelVerseView';
import { FocusModeView } from '@/components/reader/FocusModeView';
import { CompareModal } from '@/components/reader/CompareModal';
import { ReaderSettings } from '@/components/reader/ReaderSettings';
import { VerseActionSheet } from '@/components/reader/VerseActionSheet';
import { VerseExplanationDrawer } from '@/components/ai/VerseExplanationDrawer';
import { BibleIllustrationModal } from '@/components/illustration/BibleIllustrationModal';
import { BookPickerModal } from '@/components/reader/BookPickerModal';

function ReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useI18n();
  const { playTrack } = useAudio();

  const bookCode = (searchParams.get('book') || 'GEN').toUpperCase();
  const chapterNumber = parseInt(searchParams.get('chapter') || '1', 10);

  const [currentBook, setCurrentBook] = useState(BIBLE_BOOKS[0]);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Layout & Settings
  const [readingMode, setReadingMode] = useState(READING_MODES.BOOK);
  const [isVerseByVerse, setIsVerseByVerse] = useState(true);
  const [fontSize, setFontSize] = useState('md');
  const [fontFamily, setFontFamily] = useState('serif');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookPickerOpen, setBookPickerOpen] = useState(false);

  // Selected Verse & Modals
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [illustrationOpen, setIllustrationOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [highlights, setHighlights] = useState({});

  useEffect(() => {
    const book = BIBLE_BOOKS.find(b => b.code.toUpperCase() === bookCode) || BIBLE_BOOKS[0];
    setCurrentBook(book);
    loadChapter(book.code, chapterNumber);
    loadLocalHighlights();
  }, [bookCode, chapterNumber]);

  const loadLocalHighlights = async () => {
    const hlList = await getHighlights();
    const map = {};
    hlList.forEach(h => { map[h.verseKey] = h.color; });
    setHighlights(map);
  };

  const loadChapter = async (code, chNum) => {
    setLoading(true);
    try {
      const data = await api.getChapter(code, chNum);
      setChapterData(data);

      const book = BIBLE_BOOKS.find(b => b.code.toUpperCase() === code) || BIBLE_BOOKS[0];
      const bookName = language === 'te' ? book.telugu : language === 'hi' ? book.hindi : book.english;

      addReadingHistory({
        bookCode: code,
        bookName,
        chapterNumber: chNum
      });
    } catch (err) {
      console.error('Failed to load chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVerse = (verse) => {
    setSelectedVerse(verse);
    setActionSheetOpen(true);
  };

  const handleNavigateChapter = (targetBookCode, targetChapter) => {
    router.push(`/reader?book=${targetBookCode}&chapter=${targetChapter}`);
  };

  const handlePlayChapterAudio = () => {
    const bookName = language === 'te' ? currentBook.telugu : language === 'hi' ? currentBook.hindi : currentBook.english;
    playTrack({
      title: `${bookName} ${chapterNumber}`,
      reference: `${currentBook.english} Chapter ${chapterNumber}`,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      duration: 180
    });
  };

  const bookName = language === 'te' ? currentBook.telugu : language === 'hi' ? currentBook.hindi : currentBook.english;
  const verses = chapterData?.verses || [];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. Reader Navigation Toolbar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] py-3 px-3 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          
          {/* Quick Book & Chapter Picker Trigger Button */}
          <button
            onClick={() => setBookPickerOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#F8FAFC] hover:bg-[#163A5F]/10 border border-[#E5E7EB] text-[#163A5F] transition-all group shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-gold-600 group-hover:scale-110 transition-transform" />
            <span className="font-serif font-bold text-sm sm:text-base leading-none">
              {bookName} {chapterNumber}
            </span>
            <ChevronDown className="w-4 h-4 text-[#737373] group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Quick Controls: Audio, View Mode, Font Settings */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Audio narration button */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2.5 sm:px-3.5 text-xs font-semibold rounded-xl border-[#E5E7EB] bg-white text-[#171717] hover:bg-[#F8FAFC] shadow-sm"
              onClick={handlePlayChapterAudio}
            >
              <Volume2 className="w-4 h-4 mr-1 text-[#163A5F]" />
              <span className="hidden sm:inline">{t('listen')}</span>
            </Button>

            {/* Verse-by-Verse / Paragraph toggle */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl border-[#E5E7EB] bg-white text-[#171717] hover:bg-[#F8FAFC] shadow-sm"
              onClick={() => setIsVerseByVerse(!isVerseByVerse)}
              title={isVerseByVerse ? 'Switch to Paragraph Mode' : 'Switch to Verse-by-Verse Mode'}
            >
              {isVerseByVerse ? <List className="w-4 h-4 mr-1 text-[#163A5F]" /> : <AlignLeft className="w-4 h-4 mr-1 text-[#163A5F]" />}
              <span className="hidden md:inline">{isVerseByVerse ? 'Verse Mode' : 'Book Mode'}</span>
            </Button>

            {/* Parallel Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              className={`h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl border-[#E5E7EB] shadow-sm ${
                readingMode === READING_MODES.PARALLEL ? 'bg-[#163A5F] text-white' : 'bg-white text-[#171717] hover:bg-[#F8FAFC]'
              }`}
              onClick={() => setReadingMode(readingMode === READING_MODES.PARALLEL ? READING_MODES.BOOK : READING_MODES.PARALLEL)}
            >
              <Columns className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Parallel</span>
            </Button>

            {/* Reader Settings Modal Trigger */}
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 rounded-xl border-[#E5E7EB] bg-white text-[#171717] hover:bg-[#F8FAFC] shadow-sm"
              onClick={() => setSettingsOpen(true)}
              title="Reader Settings"
              aria-label="Reader Settings"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#163A5F]" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Reader Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5E7EB] shadow-sm space-y-10 min-h-[650px]">
          {/* Chapter Title Header */}
          <div className="text-center space-y-2.5 border-b border-[#E5E7EB] pb-8">
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-gold-700 font-mono font-bold">
              <span>{currentBook.category}</span>
              <span>•</span>
              <span>{currentBook.testament === 'OT' ? t('ot') : t('nt')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#163A5F] tracking-tight">
              {bookName} {chapterNumber}
            </h1>

            <p className="text-xs sm:text-sm text-[#737373] font-serif">
              {currentBook.english} Chapter {chapterNumber} • {verses.length} Verses
            </p>
          </div>

          {/* Verses Content */}
          {loading ? (
            <div className="py-24 text-center text-[#737373] text-sm space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
              <p className="font-medium">Loading Scripture...</p>
            </div>
          ) : readingMode === READING_MODES.PARALLEL ? (
            <ParallelVerseView
              verses={verses}
              book={currentBook}
              chapterNumber={chapterNumber}
              onSelectVerse={handleSelectVerse}
              highlights={highlights}
              fontSize={fontSize}
            />
          ) : (
            <VerseView
              verses={verses}
              book={currentBook}
              chapterNumber={chapterNumber}
              onSelectVerse={handleSelectVerse}
              highlights={highlights}
              fontSize={fontSize}
              fontFamily={fontFamily}
              isVerseByVerse={isVerseByVerse}
            />
          )}

          {/* 3. Bottom Chapter Navigation Bar */}
          {chapterData?.navigation && (
            <div className="flex items-center justify-between pt-8 border-t border-[#E5E7EB] gap-2">
              {chapterData.navigation.prev ? (
                <Button
                  variant="outline"
                  size="default"
                  className="rounded-2xl flex items-center space-x-2 border-[#E5E7EB] bg-white text-[#171717] hover:bg-[#F8FAFC] shadow-sm font-semibold text-xs sm:text-sm"
                  onClick={() => handleNavigateChapter(chapterData.navigation.prev.bookCode, chapterData.navigation.prev.chapterNumber)}
                >
                  <ChevronLeft className="w-4 h-4 text-[#163A5F]" />
                  <span>{t('previous_chapter')}</span>
                </Button>
              ) : <div />}

              <button
                onClick={() => setBookPickerOpen(true)}
                className="text-xs font-serif font-semibold text-[#163A5F] hover:underline px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                {chapterNumber} of {currentBook.chapters}
              </button>

              {chapterData.navigation.next ? (
                <Button
                  variant="default"
                  size="default"
                  className="rounded-2xl flex items-center space-x-2 bg-[#163A5F] hover:bg-[#0f2842] text-white shadow-md font-semibold text-xs sm:text-sm"
                  onClick={() => handleNavigateChapter(chapterData.navigation.next.bookCode, chapterData.navigation.next.chapterNumber)}
                >
                  <span>{t('next_chapter')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : <div />}
            </div>
          )}
        </div>
      </div>

      {/* Book & Chapter Picker Modal */}
      <BookPickerModal
        isOpen={bookPickerOpen}
        onClose={() => setBookPickerOpen(false)}
        currentBookCode={currentBook.code}
        currentChapter={chapterNumber}
        onSelectChapter={handleNavigateChapter}
      />

      {/* Focus Mode Overlay */}
      {readingMode === READING_MODES.FOCUS && (
        <FocusModeView
          verses={verses}
          book={currentBook}
          chapterNumber={chapterNumber}
          onExitFocus={() => setReadingMode(READING_MODES.BOOK)}
          onPrevChapter={() => chapterData?.navigation?.prev && handleNavigateChapter(chapterData.navigation.prev.bookCode, chapterData.navigation.prev.chapterNumber)}
          onNextChapter={() => chapterData?.navigation?.next && handleNavigateChapter(chapterData.navigation.next.bookCode, chapterData.navigation.next.chapterNumber)}
          fontSize={fontSize}
        />
      )}

      {/* Verse Action Sheet */}
      <VerseActionSheet
        verse={selectedVerse}
        book={currentBook}
        chapterNumber={chapterNumber}
        isOpen={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        onOpenExplain={(v, ref, text) => {
          setSelectedVerse(v);
          setExplainOpen(true);
        }}
        onOpenArtwork={(v, ref, text) => {
          router.push(`/artwork?verseText=${encodeURIComponent(text)}&reference=${encodeURIComponent(ref)}`);
        }}
        onOpenIllustration={(v, ref, text) => {
          if (v) setSelectedVerse(v);
          setIllustrationOpen(true);
        }}
        onHighlightChange={(vKey, color) => {
          setHighlights(prev => ({ ...prev, [vKey]: color }));
        }}
      />

      {/* Bible Visual Illustration Modal */}
      {selectedVerse && (
        <BibleIllustrationModal
          verse={selectedVerse}
          bookName={bookName}
          isOpen={illustrationOpen}
          onClose={() => setIllustrationOpen(false)}
        />
      )}

      {/* AI Explanation Drawer */}
      {selectedVerse && (
        <VerseExplanationDrawer
          verseKey={selectedVerse.verseKey}
          verseText={language === 'te' ? selectedVerse.textTelugu : language === 'hi' ? selectedVerse.textHindi : selectedVerse.textEnglish}
          reference={`${bookName} ${chapterNumber}:${selectedVerse.verseNumber}`}
          isOpen={explainOpen}
          onClose={() => setExplainOpen(false)}
        />
      )}

      {/* Compare Modal */}
      {selectedVerse && (
        <CompareModal
          verse={selectedVerse}
          book={currentBook}
          chapterNumber={chapterNumber}
          isOpen={compareOpen}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {/* Reader Settings Modal */}
      <ReaderSettings
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading Scripture Reader...</div>}>
      <ReaderContent />
    </Suspense>
  );
}
