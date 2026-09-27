'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useAudio } from '@/components/audio/AudioContext';
import { BIBLE_BOOKS } from '@vachanam/shared';
import {
  BookOpen,
  Sparkles,
  GitGraph,
  Palette,
  Headphones,
  Search,
  ArrowRight,
  Bookmark,
  Share2,
  Calendar,
  Volume2,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, Badge } from '@/components/ui/card';
import { VerseExplanationDrawer } from '@/components/ai/VerseExplanationDrawer';

export default function HomePage() {
  const { language, t } = useI18n();
  const { playTrack } = useAudio();
  const [dailyVerse, setDailyVerse] = useState(null);
  const [selectedTestament, setSelectedTestament] = useState('ALL');
  const [explainOpen, setExplainOpen] = useState(false);

  useEffect(() => {
    api.getDailyVerse().then((dv) => {
      if (dv) setDailyVerse(dv);
    });
  }, []);

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    if (selectedTestament === 'ALL') return true;
    return b.testament === selectedTestament;
  });

  const dailyText = dailyVerse
    ? (language === 'te' ? dailyVerse.verseTextTe : language === 'hi' ? dailyVerse.verseTextHi : dailyVerse.verseTextEn)
    : 'ఆదియందు దేవుడు భూమ్యాకాశములను సృజించెను.';

  const handlePlayDailyAudio = () => {
    playTrack({
      title: dailyVerse?.reference || 'Daily Verse',
      reference: dailyText,
      audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      duration: 30
    });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section & Daily Verse Card */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border bg-gradient-to-b from-primary-900/5 via-gold-50/20 to-transparent dark:from-primary-950/40 dark:via-gold-950/10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Title */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold-100 dark:bg-gold-950/80 border border-gold-300 dark:border-gold-800 text-xs font-semibold text-gold-900 dark:text-gold-200">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>{t('tagline')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-primary-950 dark:text-gold-200 tracking-tight leading-tight">
              {language === 'te' ? 'జీవముగల దేవుని వాక్యము' : language === 'hi' ? 'परमेश्वर का सामर्थी जीवित वचन' : 'The Living & Abiding Word of God'}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Read, listen, study with AI theological breakdowns, explore visual diagrams, and create scripture artwork in Telugu, English, and Hindi.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/reader">
                <Button variant="gold" size="lg" className="rounded-2xl">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t('read')}
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="rounded-2xl">
                  <Search className="w-5 h-5 mr-2" />
                  {t('search')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Daily Verse Featured Card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-gold-400/40 shadow-2xl bg-card">
              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Visual Art Half */}
                <div
                  className="md:col-span-2 relative min-h-[220px] bg-cover bg-center flex items-end p-6"
                  style={{
                    backgroundImage: `url(${dailyVerse?.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80'})`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative z-10 text-white space-y-1">
                    <Badge variant="gold" className="text-[10px] font-bold uppercase tracking-wider">
                      {t('today_verse')}
                    </Badge>
                    <h3 className="font-serif text-lg font-bold text-gold-300">
                      {dailyVerse?.theme || 'Divine Grace'}
                    </h3>
                  </div>
                </div>

                {/* Verse Text & Actions */}
                <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gold-600 dark:text-gold-400 font-serif">
                      {dailyVerse?.reference || 'John 3:16 • యోహాను 3:16'}
                    </span>
                    <blockquote className="font-serif text-lg sm:text-xl text-foreground leading-relaxed italic">
                      "{dailyText}"
                    </blockquote>
                  </div>

                  {/* Actions on Daily Verse */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                    <Button variant="gold" size="sm" onClick={() => setExplainOpen(true)}>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {t('ai_explanation')}
                    </Button>

                    <Button variant="outline" size="sm" onClick={handlePlayDailyAudio}>
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      {t('listen')}
                    </Button>

                    <Link href={`/artwork?verseText=${encodeURIComponent(dailyText)}&reference=${encodeURIComponent(dailyVerse?.reference || '')}`}>
                      <Button variant="outline" size="sm">
                        <Palette className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                        {t('artwork')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Quick Access Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/diagrams" className="group">
            <Card className="p-5 hover:border-gold-400 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GitGraph className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-foreground">{t('diagrams')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Timelines, mindmaps & flowcharts</p>
              </div>
            </Card>
          </Link>

          <Link href="/artwork" className="group">
            <Card className="p-5 hover:border-gold-400 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-foreground">{t('artwork')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">High-res artwork & social shares</p>
              </div>
            </Card>
          </Link>

          <Link href="/audio" className="group">
            <Card className="p-5 hover:border-gold-400 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-foreground">{t('audio')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Multi-speed voice synthesizer</p>
              </div>
            </Card>
          </Link>

          <Link href="/plans" className="group">
            <Card className="p-5 hover:border-gold-400 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-foreground">{t('plans')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">30-day, 90-day & 1-year plans</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* 3. Canonical Books Navigator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {language === 'te' ? 'గ్రంథముల జాబితా' : language === 'hi' ? 'बाइबिल की पुस्तकें' : 'Books of the Holy Bible'}
            </h2>
            <p className="text-xs text-muted-foreground">Select any book to start reading in Book, Parallel, or Focus mode</p>
          </div>

          {/* Testament Filters */}
          <div className="flex items-center bg-muted rounded-xl p-1 border border-border">
            <button
              onClick={() => setSelectedTestament('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'ALL' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('all_books')} (66)
            </button>
            <button
              onClick={() => setSelectedTestament('OT')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'OT' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('ot')} (39)
            </button>
            <button
              onClick={() => setSelectedTestament('NT')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'NT' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('nt')} (27)
            </button>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBooks.map((book) => {
            const name = language === 'te' ? book.telugu : language === 'hi' ? book.hindi : book.english;
            const subtitle = language === 'te' ? book.english : book.telugu;

            return (
              <Link
                key={book.id}
                href={`/reader?book=${book.code}&chapter=1`}
                className="group"
              >
                <Card className="p-3.5 rounded-2xl hover:border-gold-400 hover:shadow-md transition-all h-full flex flex-col justify-between bg-card group-hover:bg-gold-50/20 dark:group-hover:bg-gold-950/20">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{book.code}</span>
                      <span className="font-sans px-1.5 py-0.2 rounded bg-muted text-[9px]">
                        {book.chapters} ch
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground mt-1 font-serif group-hover:text-gold-600 transition-colors truncate">
                      {name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-gold-600 dark:text-gold-400 font-medium">
                    <span>{book.category}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Explanation Drawer Modal */}
      {dailyVerse && (
        <VerseExplanationDrawer
          verseKey={dailyVerse.verseKey}
          verseText={dailyText}
          reference={dailyVerse.reference}
          isOpen={explainOpen}
          onClose={() => setExplainOpen(false)}
        />
      )}
    </div>
  );
}
