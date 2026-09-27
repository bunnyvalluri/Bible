'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAudio } from '../audio/AudioContext';
import {
  isBookmarked,
  addBookmark,
  removeBookmark,
  setHighlight,
  saveNote,
  getNoteByVerse,
  getHighlight
} from '@/lib/storage';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Image as ImageIcon,
  Bookmark,
  BookmarkCheck,
  Highlighter,
  FileText,
  Share2,
  MoreHorizontal,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';
import { HIGHLIGHT_COLORS } from '@vachanam/shared';
import { VerseExplanationCard } from './VerseExplanationCard';
import { VerseIllustrationCard } from './VerseIllustrationCard';

export function VerseBlock({
  verse,
  book,
  chapterNumber,
  explanation: initialExplanation,
  illustration: initialIllustration,
  forceShowExplanation = false,
  forceShowIllustration = false,
  onExplanationUpdate,
  onIllustrationUpdate
}) {
  const { language, t } = useI18n();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const [bookmarked, setBookmarked] = useState(false);
  const [highlightColor, setHighlightColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [hasNote, setHasNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Explanation and Illustration expansion states
  const [showExplanation, setShowExplanation] = useState(false);
  const [showIllustration, setShowIllustration] = useState(false);
  const [explanationData, setExplanationData] = useState(initialExplanation);
  const [illustrationData, setIllustrationData] = useState(initialIllustration);

  const isAudioActive = currentTrack?.verseKey === verse.verseKey && isPlaying;

  // Language text selection
  const verseText = useMemo(() => {
    if (language === 'te') return verse.textTelugu || verse.textEnglish;
    if (language === 'hi') return verse.textHindi || verse.textEnglish;
    return verse.textEnglish || verse.textTelugu;
  }, [language, verse]);

  const bookName = useMemo(() => {
    if (language === 'te') return book?.telugu || book?.english;
    if (language === 'hi') return book?.hindi || book?.english;
    return book?.english || '';
  }, [language, book]);

  const reference = `${bookName} ${chapterNumber}:${verse.verseNumber}`;

  // Sync initial props
  useEffect(() => {
    setExplanationData(initialExplanation);
  }, [initialExplanation]);

  useEffect(() => {
    setIllustrationData(initialIllustration);
  }, [initialIllustration]);

  // Handle force show props from chapter level
  useEffect(() => {
    if (forceShowExplanation) setShowExplanation(true);
  }, [forceShowExplanation]);

  useEffect(() => {
    if (forceShowIllustration) setShowIllustration(true);
  }, [forceShowIllustration]);

  // Load IndexedDB state for bookmark, note, and highlight
  useEffect(() => {
    let mounted = true;
    isBookmarked(verse.verseKey).then((bm) => {
      if (mounted) setBookmarked(Boolean(bm));
    });
    getHighlight(verse.verseKey).then((hl) => {
      if (mounted && hl?.color) setHighlightColor(hl.color);
    });
    getNoteByVerse(verse.verseKey).then((n) => {
      if (mounted && n) {
        setNoteText(n.contentMarkdown || '');
        setHasNote(Boolean(n.contentMarkdown));
      }
    });
    return () => {
      mounted = false;
    };
  }, [verse.verseKey]);

  // Bookmark Toggle
  const handleToggleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(verse.verseKey);
      setBookmarked(false);
    } else {
      await addBookmark({
        verseKey: verse.verseKey,
        bookName,
        chapterNumber,
        verseNumber: verse.verseNumber,
        textPreview: verseText,
        language
      });
      setBookmarked(true);
    }
  };

  // Highlight Selection
  const handleSelectHighlight = async (colorId) => {
    const nextColor = highlightColor === colorId ? null : colorId;
    setHighlightColor(nextColor);
    await setHighlight(verse.verseKey, nextColor);
    setShowColorPicker(false);
  };

  // Note Save
  const handleSaveNote = async () => {
    await saveNote({
      verseKey: verse.verseKey,
      bookName,
      chapterNumber,
      verseNumber: verse.verseNumber,
      contentMarkdown: noteText
    });
    setHasNote(Boolean(noteText.trim()));
    setShowNoteModal(false);
  };

  // Audio Playback for single verse
  const handlePlayAudio = () => {
    const audioUrl = verse.audioUrl || `/api/audio/verse/${verse.verseKey}?lang=${language}`;
    playTrack({
      title: reference,
      reference,
      verseKey: verse.verseKey,
      audioUrl: audioUrl,
      duration: 15
    });
  };

  // Share Verse
  const handleShare = async () => {
    const shareMessage = `"${verseText}"\n— ${reference} (Vachanam Bible)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: reference,
          text: shareMessage,
          url: window.location.href
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightBg = () => {
    if (!highlightColor) return '';
    const colorObj = HIGHLIGHT_COLORS.find((c) => c.id === highlightColor);
    return colorObj?.bg || 'bg-yellow-100/60';
  };

  return (
    <article
      id={`verse-${verse.verseNumber}`}
      aria-label={`Verse ${verse.verseNumber}`}
      className={`group relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 transition-all duration-300 border ${
        isAudioActive
          ? 'bg-[#FFFDF7] border-[#C9A227] ring-2 ring-gold-200/60 shadow-md'
          : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Top Meta & Verse Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Verse Number Badge */}
          <span
            className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg text-xs font-serif font-bold transition-colors ${
              isAudioActive
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'bg-gold-50 text-[#163A5F] border border-gold-200/70'
            }`}
          >
            {verse.verseNumber}
          </span>

          <span className="text-[11px] font-mono text-gray-400 font-medium">
            {verse.verseKey}
          </span>
        </div>

        {/* Status indicator badges */}
        <div className="flex items-center space-x-1.5">
          {explanationData && (
            <span
              onClick={() => setShowExplanation(!showExplanation)}
              className="cursor-pointer text-[10px] font-semibold text-[#163A5F] bg-blue-50/70 border border-blue-100 px-2 py-0.5 rounded-full flex items-center space-x-1 hover:bg-blue-100/60 transition-colors"
              title="AI Theological Synthesis Available"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#C9A227]" />
              <span>AI Study</span>
            </span>
          )}

          {illustrationData?.imageUrl && (
            <span
              onClick={() => setShowIllustration(!showIllustration)}
              className="cursor-pointer text-[10px] font-semibold text-[#163A5F] bg-amber-50/70 border border-amber-100 px-2 py-0.5 rounded-full flex items-center space-x-1 hover:bg-amber-100/60 transition-colors"
              title="16:9 Visual Illustration Available"
            >
              <ImageIcon className="w-2.5 h-2.5 text-[#C9A227]" />
              <span>Illustration</span>
            </span>
          )}

          {hasNote && (
            <span
              onClick={() => setShowNoteModal(true)}
              className="cursor-pointer text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1 hover:bg-emerald-100 transition-colors"
              title="Personal Study Note Saved"
            >
              <FileText className="w-2.5 h-2.5 text-emerald-600" />
              <span>Note</span>
            </span>
          )}
        </div>
      </div>

      {/* Scripture Text Body */}
      <div className={`p-2 rounded-xl transition-colors ${getHighlightBg()}`}>
        <p
          className={`font-serif text-gray-900 leading-relaxed text-base sm:text-lg select-text ${
            language === 'te' ? 'font-telugu leading-[2.1]' : language === 'hi' ? 'font-devanagari leading-[2.0]' : ''
          }`}
        >
          {verseText}
        </p>
      </div>

      {/* Inline Personal Study Note Preview if present */}
      {hasNote && noteText && (
        <div
          onClick={() => setShowNoteModal(true)}
          className="mt-2.5 px-3 py-2 bg-emerald-50/50 border-l-2 border-emerald-500 rounded-r-xl text-xs text-emerald-900 cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <div className="flex items-center space-x-1.5 font-semibold text-[11px] text-emerald-700 mb-0.5">
            <FileText className="w-3 h-3" />
            <span>My Note:</span>
          </div>
          <p className="line-clamp-2 italic">{noteText}</p>
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1.5">
        {/* Primary Study Actions */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-wrap">
          {/* 1. Listen / Play Verse */}
          <button
            onClick={handlePlayAudio}
            aria-label="Listen to Verse"
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all ${
              isAudioActive
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#163A5F] hover:bg-gray-100/80'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isAudioActive ? 'animate-pulse' : 'text-[#C9A227]'}`} />
            <span className="hidden xs:inline">{isAudioActive ? 'Playing' : 'Listen'}</span>
          </button>

          {/* 2. Explain Verse */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            aria-label="Explain Verse"
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all ${
              showExplanation
                ? 'bg-blue-50 text-[#163A5F] font-semibold border border-blue-200/80'
                : 'text-gray-600 hover:text-[#163A5F] hover:bg-gray-100/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Explain</span>
            {showExplanation ? (
              <ChevronUp className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            )}
          </button>

          {/* 3. Illustrate Verse */}
          <button
            onClick={() => setShowIllustration(!showIllustration)}
            aria-label="Illustrate Verse"
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all ${
              showIllustration
                ? 'bg-amber-50 text-[#163A5F] font-semibold border border-amber-200/80'
                : 'text-gray-600 hover:text-[#163A5F] hover:bg-gray-100/80'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Illustrate</span>
            {showIllustration ? (
              <ChevronUp className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>

        {/* Secondary Verse Utilities */}
        <div className="flex items-center space-x-1">
          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark Verse'}
            className="p-1.5 text-gray-500 hover:text-[#163A5F] hover:bg-gray-100/80 rounded-lg transition-colors"
            title={bookmarked ? 'Bookmarked' : 'Bookmark Verse'}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-[#C9A227]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Highlight Color Picker Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              aria-label="Highlight Verse"
              className="p-1.5 text-gray-500 hover:text-[#163A5F] hover:bg-gray-100/80 rounded-lg transition-colors"
              title="Highlight Verse"
            >
              <Highlighter
                className={`w-4 h-4 ${highlightColor ? 'text-[#C9A227]' : ''}`}
              />
            </button>

            {/* Color Palette Popover */}
            {showColorPicker && (
              <div className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl p-2 shadow-lg z-30 flex items-center space-x-1 animate-in fade-in">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleSelectHighlight(color.id)}
                    className={`w-6 h-6 rounded-full ${color.bg} border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                      highlightColor === color.id ? 'border-[#163A5F]' : 'border-transparent'
                    }`}
                    title={color.label}
                  >
                    {highlightColor === color.id && <Check className="w-3 h-3 text-gray-800" />}
                  </button>
                ))}
                {highlightColor && (
                  <button
                    onClick={() => handleSelectHighlight(null)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full ml-1"
                    title="Clear Highlight"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Note Button */}
          <button
            onClick={() => setShowNoteModal(true)}
            aria-label="Add Note"
            className="p-1.5 text-gray-500 hover:text-[#163A5F] hover:bg-gray-100/80 rounded-lg transition-colors"
            title="Study Note"
          >
            <FileText className={`w-4 h-4 ${hasNote ? 'text-emerald-600' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share Verse"
            className="p-1.5 text-gray-500 hover:text-[#163A5F] hover:bg-gray-100/80 rounded-lg transition-colors"
            title={copied ? 'Copied!' : 'Share Verse'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible / Expandable AI Explanation Component */}
      {showExplanation && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in">
          <VerseExplanationCard
            verse={verse}
            explanation={explanationData}
            book={book}
            chapterNumber={chapterNumber}
            onExplanationGenerated={(data) => {
              setExplanationData(data);
              if (onExplanationUpdate) onExplanationUpdate(data);
            }}
          />
        </div>
      )}

      {/* Collapsible / Expandable Dedicated 16:9 Illustration Component */}
      {showIllustration && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in">
          <VerseIllustrationCard
            verse={verse}
            illustration={illustrationData}
            book={book}
            chapterNumber={chapterNumber}
            onIllustrationGenerated={(data) => {
              setIllustrationData(data);
              if (onIllustrationUpdate) onIllustrationUpdate(data);
            }}
          />
        </div>
      )}

      {/* Personal Note Dialog / Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif font-bold text-[#163A5F] text-base">
                  Study Note: {reference}
                </h3>
              </div>
              <button
                onClick={() => setShowNoteModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 italic mb-3 font-serif bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              "{verseText}"
            </p>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your reflection, theological observation, or personal prayer for this verse..."
              rows={5}
              className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
            />

            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNoteModal(false)}
                className="border-gray-200 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNote}
                className="bg-[#163A5F] text-white hover:bg-[#112d4a] text-xs font-semibold px-4"
              >
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
