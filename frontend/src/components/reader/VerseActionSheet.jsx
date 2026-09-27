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
  Share2,
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
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
              Verse Selected
            </span>
            <h4 className="text-base font-bold font-serif text-foreground">{reference}</h4>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Verse Text Snippet */}
        <p className="text-sm font-serif italic text-muted-foreground leading-relaxed line-clamp-2">
          "{verseText}"
        </p>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <Button
            variant="gold"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px]"
            onClick={() => {
              onClose();
              onOpenExplain(verse, reference, verseText);
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('ai_explanation')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px]"
            onClick={handleToggleBookmark}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-gold-500" /> : <Bookmark className="w-4 h-4" />}
            <span>{bookmarked ? t('bookmarked') : t('bookmark')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px]"
            onClick={() => {
              onClose();
              onOpenArtwork(verse, reference, verseText);
            }}
          >
            <Palette className="w-4 h-4 text-purple-500" />
            <span>{t('create_artwork')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 py-1 gap-1 text-[11px]"
            onClick={handlePlayAudio}
          >
            <Headphones className="w-4 h-4 text-sky-500" />
            <span>{t('listen')}</span>
          </Button>
        </div>

        {/* Secondary Bar: Highlights, Note, Copy */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {/* Highlight Color Pickers */}
          <div className="flex items-center space-x-1.5">
            <Highlighter className="w-3.5 h-3.5 text-muted-foreground mr-1" />
            {HIGHLIGHT_COLORS.map((col) => (
              <button
                key={col.id}
                onClick={() => handleHighlightSelect(col.id)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  col.id === 'gold' ? 'bg-amber-400' :
                  col.id === 'emerald' ? 'bg-emerald-400' :
                  col.id === 'sapphire' ? 'bg-sky-400' :
                  col.id === 'ruby' ? 'bg-rose-400' : 'bg-purple-400'
                } ${currentColor === col.id ? 'scale-125 border-foreground' : 'border-transparent hover:scale-110'}`}
                title={col.name}
              />
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => setNoteOpen(!noteOpen)}
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              {t('note')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
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
              className="w-full h-24 p-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setNoteOpen(false)}>Cancel</Button>
              <Button variant="gold" size="sm" onClick={handleSaveNote}>Save Note</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
