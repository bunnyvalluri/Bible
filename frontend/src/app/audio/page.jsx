'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAudio } from '@/components/audio/AudioContext';
import { BIBLE_BOOKS } from '@vachanam/shared';
import {
  Headphones,
  Play,
  Pause,
  Download,
  Volume2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, Badge } from '@/components/ui/card';

export default function AudioBiblePage() {
  const { language, t } = useI18n();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[0]);
  const [audioLang, setAudioLang] = useState('te');

  const handlePlayChapter = (chNum) => {
    const bookTitle = audioLang === 'te' ? selectedBook.telugu : audioLang === 'hi' ? selectedBook.hindi : selectedBook.english;
    playTrack({
      title: `${bookTitle} - Chapter ${chNum}`,
      reference: `${selectedBook.english} ${chNum} (${audioLang.toUpperCase()})`,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      duration: 180
    });
  };

  const bookName = language === 'te' ? selectedBook.telugu : language === 'hi' ? selectedBook.hindi : selectedBook.english;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-xs font-semibold text-amber-900 dark:text-amber-200">
          <Headphones className="w-3.5 h-3.5" />
          <span>Multilingual Voice Synthesizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          {t('audio')}
        </h1>
        <p className="text-sm text-muted-foreground">
          Listen to clear, narrated scripture recordings in Telugu, English, and Hindi
        </p>
      </div>

      {/* Book & Language Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        {/* Book Selector */}
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-gold-500" />
          <select
            value={selectedBook.code}
            onChange={(e) => {
              const b = BIBLE_BOOKS.find(item => item.code === e.target.value);
              if (b) setSelectedBook(b);
            }}
            className="bg-muted font-serif font-semibold text-foreground px-4 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            {BIBLE_BOOKS.map(b => (
              <option key={b.code} value={b.code}>
                {language === 'te' ? b.telugu : language === 'hi' ? b.hindi : b.english} ({b.chapters} Ch)
              </option>
            ))}
          </select>
        </div>

        {/* Audio Language Selection */}
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setAudioLang('te')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              audioLang === 'te' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setAudioLang('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              audioLang === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setAudioLang('hi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              audioLang === 'hi' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Chapters Audio Playlist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-foreground">
          {bookName} — Audio Chapters ({selectedBook.chapters})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chNum) => {
            const isThisTrack = currentTrack?.reference?.includes(`${selectedBook.english} ${chNum}`);

            return (
              <Card
                key={chNum}
                className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                  isThisTrack
                    ? 'border-gold-400 bg-gold-50/40 dark:bg-gold-950/30 shadow-md'
                    : 'hover:border-gold-300 bg-card'
                }`}
              >
                <div>
                  <span className="text-xs font-mono text-muted-foreground uppercase">Chapter {chNum}</span>
                  <h4 className="font-serif font-bold text-sm text-foreground">
                    {bookName} {chNum}
                  </h4>
                </div>

                <Button
                  variant={isThisTrack && isPlaying ? 'gold' : 'outline'}
                  size="icon"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  onClick={() => {
                    if (isThisTrack) togglePlay();
                    else handlePlayChapter(chNum);
                  }}
                >
                  {isThisTrack && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
