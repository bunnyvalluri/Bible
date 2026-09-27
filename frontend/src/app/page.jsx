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
import { BibleIllustrationModal } from '@/components/illustration/BibleIllustrationModal';
import { Image as ImageIcon } from 'lucide-react';

export default function HomePage() {
  const { language, t } = useI18n();
  const { playTrack } = useAudio();
  const [dailyVerse, setDailyVerse] = useState(null);
  const [selectedTestament, setSelectedTestament] = useState('ALL');
  const [explainOpen, setExplainOpen] = useState(false);
  const [illModalOpen, setIllModalOpen] = useState(false);
  const [selectedIllVerse, setSelectedIllVerse] = useState(null);

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
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Title */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-300 text-xs font-semibold text-gold-900">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>{t('tagline')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#163A5F] tracking-tight leading-tight">
              {language === 'te' ? 'జీవముగల దేవుని వాక్యము' : language === 'hi' ? 'परमेश्वर का सामर्थी जीवित वचन' : 'The Living & Abiding Word of God'}
            </h1>

            <p className="text-base sm:text-lg text-[#525252] leading-relaxed">
              Read, listen, study with AI theological breakdowns, explore visual diagrams, and create scripture artwork in Telugu, English, and Hindi.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/reader">
                <Button variant="default" size="lg" className="rounded-2xl bg-[#163A5F] hover:bg-[#0f2842] text-white">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t('read')}
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="rounded-2xl border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50">
                  <Search className="w-5 h-5 mr-2 text-[#163A5F]" />
                  {t('search')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Daily Verse Featured Card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm bg-white">
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
                <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gold-600 font-serif">
                      {dailyVerse?.reference || 'John 3:16 • యోహాను 3:16'}
                    </span>
                    <blockquote className="font-serif text-lg sm:text-xl text-[#171717] leading-relaxed italic">
                      "{dailyText}"
                    </blockquote>
                  </div>

                  {/* Actions on Daily Verse */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E7EB]">
                    <Button variant="gold" size="sm" onClick={() => setExplainOpen(true)}>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {t('ai_explanation')}
                    </Button>

                    <Button variant="outline" size="sm" className="border-[#E5E7EB] text-[#171717] bg-white hover:bg-slate-50" onClick={handlePlayDailyAudio}>
                      <Play className="w-3.5 h-3.5 mr-1.5 text-[#163A5F]" />
                      {t('listen')}
                    </Button>

                    <Link href={`/artwork?verseText=${encodeURIComponent(dailyText)}&reference=${encodeURIComponent(dailyVerse?.reference || '')}`}>
                      <Button variant="outline" size="sm" className="border-[#E5E7EB] text-[#171717] bg-white hover:bg-slate-50">
                        <Palette className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
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
            <Card className="p-5 border-[#E5E7EB] hover:border-blue-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-110 transition-transform">
                <GitGraph className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('diagrams')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">Timelines, mindmaps & flowcharts</p>
              </div>
            </Card>
          </Link>

          <Link href="/artwork" className="group">
            <Card className="p-5 border-[#E5E7EB] hover:border-purple-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('artwork')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">High-res artwork & social shares</p>
              </div>
            </Card>
          </Link>

          <Link href="/audio" className="group">
            <Card className="p-5 border-[#E5E7EB] hover:border-amber-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('audio')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">Multi-speed voice synthesizer</p>
              </div>
            </Card>
          </Link>

          <Link href="/plans" className="group">
            <Card className="p-5 border-[#E5E7EB] hover:border-emerald-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('plans')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">30-day, 90-day & 1-year plans</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* 3. Canonical Books Navigator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#163A5F]">
              {language === 'te' ? 'గ్రంథముల జాబితా' : language === 'hi' ? 'बाइबिल की पुस्तकें' : 'Books of the Holy Bible'}
            </h2>
            <p className="text-xs text-[#737373]">Select any book to start reading in Book, Parallel, or Focus mode</p>
          </div>

          {/* Testament Filters */}
          <div className="flex items-center bg-[#F8FAFC] rounded-xl p-1 border border-[#E5E7EB]">
            <button
              onClick={() => setSelectedTestament('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'ALL' ? 'bg-white text-[#163A5F] shadow-sm font-bold' : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              {t('all_books')} (66)
            </button>
            <button
              onClick={() => setSelectedTestament('OT')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'OT' ? 'bg-white text-[#163A5F] shadow-sm font-bold' : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              {t('ot')} (39)
            </button>
            <button
              onClick={() => setSelectedTestament('NT')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'NT' ? 'bg-white text-[#163A5F] shadow-sm font-bold' : 'text-[#737373] hover:text-[#171717]'
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
                <Card className="p-3.5 rounded-2xl border-[#E5E7EB] hover:border-gold-400 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white hover:bg-slate-50">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#737373] font-mono">
                      <span>{book.code}</span>
                      <span className="font-sans px-1.5 py-0.2 rounded bg-slate-100 text-[9px] text-[#525252]">
                        {book.chapters} ch
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#171717] mt-1 font-serif group-hover:text-[#163A5F] transition-colors truncate">
                      {name}
                    </h4>
                    <p className="text-[11px] text-[#737373] truncate">{subtitle}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-gold-600 font-medium">
                    <span>{book.category}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#163A5F]" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Visual Bible — Educational Scripture Metaphors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Metaphor Engine</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#163A5F]">
              {language === 'te' ? 'దృశ్య వేద రమణీయకత' : language === 'hi' ? 'सचित्र आत्मिक शिक्षा' : 'The Visual Bible'}
            </h2>
            <p className="text-xs text-[#737373]">
              Hand-drawn 16:9 editorial visual metaphors explaining the heart of scripture
            </p>
          </div>
          <Link href="/artwork">
            <Button variant="outline" size="sm" className="rounded-xl text-xs border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50">
              <Palette className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
              Artwork Studio
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: John 3:16 */}
          <Card
            className="group overflow-hidden rounded-2xl border-[#E5E7EB] hover:border-gold-400 cursor-pointer transition-all hover:shadow-md bg-white"
            onClick={() => {
              setSelectedIllVerse({
                verseKey: 'JHN.3.16',
                chapterNumber: 3,
                verseNumber: 16,
                book: { english: 'John', telugu: 'యోహాను', hindi: 'यूहन्ना' },
                textEnglish: 'For God so loved the world, that he gave his only begotten Son...',
                textTelugu: 'దేవుడు లోకమును ఎంతో ప్రేమించెను...',
                textHindi: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा...'
              });
              setIllModalOpen(true);
            }}
          >
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80"
                alt="John 3:16"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <Badge className="bg-gold-500 text-white text-[10px] font-bold mb-1">Bridge Metaphor</Badge>
                <h4 className="font-serif font-bold text-sm">John 3:16 • The Bridge of Grace</h4>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xs bg-white">
              <p className="text-[#525252] line-clamp-2">
                A glowing bridge spanning a chasm, connecting broken terrain to sunlit pastures.
              </p>
            </div>
          </Card>

          {/* Card 2: Psalm 23:1 */}
          <Card
            className="group overflow-hidden rounded-2xl border-[#E5E7EB] hover:border-gold-400 cursor-pointer transition-all hover:shadow-md bg-white"
            onClick={() => {
              setSelectedIllVerse({
                verseKey: 'PSA.23.1',
                chapterNumber: 23,
                verseNumber: 1,
                book: { english: 'Psalms', telugu: 'కీర్తనలు', hindi: 'भजन संहिता' },
                textEnglish: 'The LORD is my shepherd; I shall not want.',
                textTelugu: 'యెహోవా నా కాపరి నాకు లేమి కలుగదు.',
                textHindi: 'यहोवा मेरा चरवाहा है; मुझे कुछ घटी न होगी।'
              });
              setIllModalOpen(true);
            }}
          >
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
                alt="Psalm 23:1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold mb-1">Pastoral Metaphor</Badge>
                <h4 className="font-serif font-bold text-sm">Psalm 23:1 • Still Waters & Flourishing Cedar</h4>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xs bg-white">
              <p className="text-[#525252] line-clamp-2">
                A deep-rooted cedar flourishing beside calm, living waters with gentle slopes.
              </p>
            </div>
          </Card>

          {/* Card 3: Proverbs 3:5 */}
          <Card
            className="group overflow-hidden rounded-2xl border-[#E5E7EB] hover:border-gold-400 cursor-pointer transition-all hover:shadow-md bg-white"
            onClick={() => {
              setSelectedIllVerse({
                verseKey: 'PRO.3.5',
                chapterNumber: 3,
                verseNumber: 5,
                book: { english: 'Proverbs', telugu: 'సామెతలు', hindi: 'नीतिवचन' },
                textEnglish: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
                textTelugu: 'నీ స్వబుద్ధిని ఆధారము చేసికొనక నీ పూర్ణహృదయముతో యెహోవాయందు నమ్మకముంచుము.',
                textHindi: 'तू अपनी समझ का सहारा न लेना, वरन सम्पूर्ण मन से यहोवा पर भरोसा रखना।'
              });
              setIllModalOpen(true);
            }}
          >
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80"
                alt="Proverbs 3:5"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <Badge className="bg-blue-600 text-white text-[10px] font-bold mb-1">Steadfast Path</Badge>
                <h4 className="font-serif font-bold text-sm">Proverbs 3:5 • The Stepping Stones of Faith</h4>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xs bg-white">
              <p className="text-[#525252] line-clamp-2">
                An unshakable rock fortress grounded upon ancient stone foundation.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bible Visual Illustration Modal */}
      {selectedIllVerse && (
        <BibleIllustrationModal
          verse={selectedIllVerse}
          bookName={language === 'te' ? selectedIllVerse.book.telugu : language === 'hi' ? selectedIllVerse.book.hindi : selectedIllVerse.book.english}
          isOpen={illModalOpen}
          onClose={() => setIllModalOpen(false)}
        />
      )}

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
