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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32 bg-white">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
          <Headphones className="w-3.5 h-3.5 text-amber-700" />
          <span>Multilingual Voice Synthesizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#163A5F]">
          {t('audio')}
        </h1>
        <p className="text-sm text-[#525252]">
          Listen to clear, narrated scripture recordings in Telugu, English, and Hindi
        </p>
      </div>

      {/* Book & Language Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
        {/* Book Selector */}
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-gold-600" />
          <select
            value={selectedBook.code}
            onChange={(e) => {
              const b = BIBLE_BOOKS.find(item => item.code === e.target.value);
              if (b) setSelectedBook(b);
            }}
            className="bg-white font-serif font-semibold text-[#171717] px-4 py-2 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {BIBLE_BOOKS.map(b => (
              <option key={b.code} value={b.code}>
                {language === 'te' ? b.telugu : language === 'hi' ? b.hindi : b.english} ({b.chapters} Ch)
              </option>
            ))}
          </select>
        </div>

        {/* Audio Language Selection */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#E5E7EB] shadow-sm">
          <button
            onClick={() => setAudioLang('te')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              audioLang === 'te' ? 'bg-[#163A5F] text-white shadow-sm' : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setAudioLang('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              audioLang === 'en' ? 'bg-[#163A5F] text-white shadow-sm' : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setAudioLang('hi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              audioLang === 'hi' ? 'bg-[#163A5F] text-white shadow-sm' : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Chapters Audio Playlist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#163A5F]">
          {bookName} — Audio Chapters ({selectedBook.chapters})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chNum) => {
            const isThisTrack = currentTrack?.reference?.includes(`${selectedBook.english} ${chNum}`);

            return (
              <Card
                key={chNum}
                className={`p-4 rounded-2xl flex items-center justify-between transition-all border-[#E5E7EB] ${
                  isThisTrack
                    ? 'border-gold-400 bg-[#FEFCE8] shadow-sm'
                    : 'hover:border-gold-300 bg-white'
                }`}
              >
                <div>
                  <span className="text-xs font-mono text-[#737373] uppercase">Chapter {chNum}</span>
                  <h4 className="font-serif font-bold text-sm text-[#171717]">
                    {bookName} {chNum}
                  </h4>
                </div>

                <Button
                  variant={isThisTrack && isPlaying ? 'gold' : 'outline'}
                  size="icon"
                  className={`w-10 h-10 rounded-full flex-shrink-0 ${
                    isThisTrack && isPlaying
                      ? 'bg-gold-500 text-white'
                      : 'border-[#E5E7EB] bg-white text-[#163A5F] hover:bg-slate-50'
                  }`}
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
