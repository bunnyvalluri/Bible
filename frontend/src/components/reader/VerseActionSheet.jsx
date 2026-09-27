'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAudio } from '../audio/AudioContext';
import {
  isBookmarked,
  addBookmark,
  removeBookmark,
  setHighlight,
  saveNote,
  getNoteByVerse
} from '@/lib/storage';
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Highlighter,
  FileText,
  Palette,
  Headphones,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { HIGHLIGHT_COLORS } from '@vachanam/shared';

export function VerseActionSheet({
  verse,
  book,
  chapterNumber,
  isOpen,
  onClose,
  onOpenExplain,
  onOpenArtwork,
  onOpenIllustration,
  onHighlightChange
}) {
  const { language, t } = useI18n();
  const { playTrack } = useAudio();
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [currentColor, setCurrentColor] = useState(null);

  if (!isOpen || !verse) return null;

  const verseText = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;
  const bookName = language === 'te' ? book.telugu : language === 'hi' ? book.hindi : book.english;
  const reference = `${bookName} ${chapterNumber}:${verse.verseNumber}`;

  useEffect(() => {
    isBookmarked(verse.verseKey).then(setBookmarked);
    getNoteByVerse(verse.verseKey).then((n) => {
      if (n) setNoteText(n.contentMarkdown || '');
    });
  }, [verse.verseKey]);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(`${reference} - "${verseText}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHighlightSelect = async (colorId) => {
    const nextColor = currentColor === colorId ? null : colorId;
    setCurrentColor(nextColor);
    await setHighlight(verse.verseKey, nextColor);
    if (onHighlightChange) onHighlightChange(verse.verseKey, nextColor);
  };

  const handleSaveNote = async () => {
    await saveNote({
      verseKey: verse.verseKey,
      bookName,
      chapterNumber,
      verseNumber: verse.verseNumber,
      contentMarkdown: noteText
    });
    setNoteOpen(false);
    alert('Note saved successfully!');
  };

  const handlePlayAudio = () => {
    playTrack({
      title: `${bookName} ${chapterNumber}:${verse.verseNumber}`,
      reference: verseText,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      duration: 15
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-4 animate-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#163A5F]">
              Verse Selected
            </span>
            <h4 className="text-base font-bold font-serif text-[#171717]">{reference}</h4>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-[#737373] hover:text-[#171717]" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Verse Text Snippet */}
        <p className="text-sm font-serif italic text-[#525252] leading-relaxed line-clamp-2">
          "{verseText}"
        </p>

        {/* Action Grid */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px] bg-[#163A5F] hover:bg-[#0f2742] text-white shadow-sm"
            onClick={() => {
              onClose();
              onOpenExplain(verse, reference, verseText);
            }}
          >
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span>{t('ai_explanation')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px] border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#163A5F]"
            onClick={() => {
              onClose();
              if (onOpenIllustration) onOpenIllustration(verse, reference, verseText);
            }}
          >
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span>Illustration</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px] border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#171717]"
            onClick={handleToggleBookmark}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-[#C9A227]" /> : <Bookmark className="w-4 h-4 text-[#737373]" />}
            <span>{bookmarked ? t('bookmarked') : t('bookmark')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px] border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#171717]"
            onClick={() => {
              onClose();
              onOpenArtwork(verse, reference, verseText);
            }}
          >
            <Palette className="w-4 h-4 text-purple-600" />
            <span>{t('create_artwork')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px] border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#171717]"
            onClick={handlePlayAudio}
          >
            <Headphones className="w-4 h-4 text-sky-600" />
            <span>{t('listen')}</span>
          </Button>
        </div>

        {/* Secondary Bar: Highlights, Note, Copy */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
          {/* Highlight Color Pickers */}
          <div className="flex items-center space-x-1.5">
            <Highlighter className="w-3.5 h-3.5 text-[#737373] mr-1" />
            {HIGHLIGHT_COLORS.map((col) => (
              <button
                key={col.id}
                onClick={() => handleHighlightSelect(col.id)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  col.id === 'gold' ? 'bg-amber-300' :
                  col.id === 'emerald' ? 'bg-emerald-300' :
                  col.id === 'sapphire' ? 'bg-sky-300' :
                  col.id === 'ruby' ? 'bg-rose-300' : 'bg-purple-300'
                } ${currentColor === col.id ? 'scale-125 border-[#171717]' : 'border-transparent hover:scale-110'}`}
                title={col.name}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-[#525252] hover:text-[#171717]"
              onClick={() => setNoteOpen(!noteOpen)}
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              {t('note')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-[#525252] hover:text-[#171717]"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? t('copied') : t('copy')}
            </Button>
          </div>
        </div>

        {/* Embedded Note Editor */}
        {noteOpen && (
          <div className="pt-2 space-y-2 animate-in fade-in">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write personal reflection or study notes in Markdown..."
              className="w-full h-24 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#163A5F]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setNoteOpen(false)}>Cancel</Button>
              <Button variant="default" size="sm" className="bg-[#163A5F] text-white" onClick={handleSaveNote}>Save Note</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
