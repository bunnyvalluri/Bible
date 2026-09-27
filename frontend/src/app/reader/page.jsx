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
  ArrowLeft
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

  // Reader Settings State
  const [readingMode, setReadingMode] = useState(READING_MODES.BOOK);
  const [fontSize, setFontSize] = useState('md');
  const [fontFamily, setFontFamily] = useState('serif');
  const [settingsOpen, setSettingsOpen] = useState(false);

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

      // Track reading history
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
      title: `${bookName} - Chapter ${chapterNumber}`,
      reference: `${currentBook.english} ${chapterNumber}`,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      duration: 180
    });
  };

  const bookName = language === 'te' ? currentBook.telugu : language === 'hi' ? currentBook.hindi : currentBook.english;
  const verses = chapterData?.verses || [];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. Sticky Reader Header Toolbar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Book and Chapter Selectors */}
          <div className="flex items-center space-x-2">
            {/* Book Selector */}
            <select
              value={currentBook.code}
              onChange={(e) => handleNavigateChapter(e.target.value, 1)}
              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif shadow-sm"
            >
              <optgroup label="Old Testament (పాత నిబంధన)">
                {BIBLE_BOOKS.filter(b => b.testament === 'OT').map(b => (
                  <option key={b.code} value={b.code}>
                    {language === 'te' ? b.telugu : language === 'hi' ? b.hindi : b.english}
                  </option>
                ))}
              </optgroup>
              <optgroup label="New Testament (క్రొత్త నిబంధన)">
                {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                  <option key={b.code} value={b.code}>
                    {language === 'te' ? b.telugu : language === 'hi' ? b.hindi : b.english}
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Chapter Selector */}
            <select
              value={chapterNumber}
              onChange={(e) => handleNavigateChapter(currentBook.code, parseInt(e.target.value, 10))}
              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {t('chapter')} {num}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions: Audio, Modes, Settings */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2.5 sm:px-3 text-xs flex items-center space-x-1 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50"
              onClick={handlePlayChapterAudio}
            >
              <Headphones className="w-4 h-4 text-gold-600" />
              <span className="hidden sm:inline">{t('listen')}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2.5 sm:px-3 text-xs flex items-center space-x-1 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50"
              onClick={() => setReadingMode(readingMode === READING_MODES.PARALLEL ? READING_MODES.BOOK : READING_MODES.PARALLEL)}
            >
              <Columns className="w-4 h-4 text-[#163A5F]" />
              <span className="hidden sm:inline">
                {readingMode === READING_MODES.PARALLEL ? 'Single View' : 'Parallel'}
              </span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50"
              onClick={() => setSettingsOpen(true)}
              title="Reader Settings"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#163A5F]" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Reader Book Paper Surface */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5E7EB] shadow-sm min-h-[600px] space-y-8 animate-in fade-in duration-300">
          {/* Chapter Heading */}
          <div className="text-center space-y-2 border-b border-[#E5E7EB] pb-6">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-serif font-semibold">
              {currentBook.category} • {currentBook.testament === 'OT' ? t('ot') : t('nt')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#163A5F]">
              {bookName} {chapterNumber}
            </h1>
            <p className="text-xs text-[#737373] font-serif italic">
              {currentBook.english} {chapterNumber} • {verses.length} Verses
            </p>
          </div>

          {/* Reading Mode Rendering */}
          {loading ? (
            <div className="py-24 text-center text-[#737373] text-sm space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
              <p>Loading Scripture...</p>
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
            />
          )}

          {/* 3. Bottom Chapter Navigation */}
          {chapterData?.navigation && (
            <div className="flex items-center justify-between pt-8 border-t border-[#E5E7EB]">
              {chapterData.navigation.prev ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl flex items-center space-x-1 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50"
                  onClick={() => handleNavigateChapter(chapterData.navigation.prev.bookCode, chapterData.navigation.prev.chapterNumber)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('previous_chapter')}</span>
                </Button>
              ) : <div />}

              <span className="text-xs font-serif text-[#737373]">
                {chapterNumber} of {currentBook.chapters}
              </span>

              {chapterData.navigation.next ? (
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-xl flex items-center space-x-1 bg-[#163A5F] hover:bg-[#0f2842] text-white"
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
