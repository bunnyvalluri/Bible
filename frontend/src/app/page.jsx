'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Play,
  Copy,
  Check,
  Filter,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, Badge } from '@/components/ui/card';
import { VerseExplanationDrawer } from '@/components/ai/VerseExplanationDrawer';
import { BibleIllustrationModal } from '@/components/illustration/BibleIllustrationModal';

export default function HomePage() {
  const router = useRouter();
  const { language, t } = useI18n();
  const { playTrack } = useAudio();
  const [dailyVerse, setDailyVerse] = useState(null);
  const [selectedTestament, setSelectedTestament] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [illModalOpen, setIllModalOpen] = useState(false);
  const [selectedIllVerse, setSelectedIllVerse] = useState(null);

  useEffect(() => {
    api.getDailyVerse().then((dv) => {
      if (dv) setDailyVerse(dv);
    });
  }, []);

  // Filter books based on testament, category, and search query
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((b) => {
      if (selectedTestament !== 'ALL' && b.testament !== selectedTestament) return false;
      if (selectedCategory !== 'ALL' && b.category !== selectedCategory) return false;
      if (bookSearchQuery.trim()) {
        const query = bookSearchQuery.toLowerCase().trim();
        const matchesName =
          b.english.toLowerCase().includes(query) ||
          b.telugu.toLowerCase().includes(query) ||
          b.hindi.toLowerCase().includes(query) ||
          b.code.toLowerCase().includes(query);
        if (!matchesName) return false;
      }
      return true;
    });
  }, [selectedTestament, selectedCategory, bookSearchQuery]);

  // Distinct categories available in current testament
  const availableCategories = useMemo(() => {
    const relevantBooks = selectedTestament === 'ALL'
      ? BIBLE_BOOKS
      : BIBLE_BOOKS.filter(b => b.testament === selectedTestament);
    const cats = Array.from(new Set(relevantBooks.map(b => b.category)));
    return ['ALL', ...cats];
  }, [selectedTestament]);

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

  const handleCopyDailyVerse = () => {
    if (typeof navigator !== 'undefined') {
      const textToCopy = `"${dailyText}" — ${dailyVerse?.reference || 'John 3:16'}\n(వచనం • Vachanam Bible)`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(heroSearchQuery.trim())}`);
    }
  };

  const quickJumpTopics = [
    { label: language === 'te' ? 'యోహాను 3:16' : language === 'hi' ? 'यूहन्ना 3:16' : 'John 3:16', q: 'John 3:16' },
    { label: language === 'te' ? 'కీర్తనలు 23' : language === 'hi' ? 'भजन संहिता 23' : 'Psalm 23', q: 'Psalm 23' },
    { label: language === 'te' ? 'సామెతలు 3:5' : language === 'hi' ? 'नीतिवचन 3:5' : 'Proverbs 3:5', q: 'Proverbs 3:5' },
    { label: language === 'te' ? 'రోమీయులకు 8:28' : language === 'hi' ? 'रोमियों 8:28' : 'Romans 8:28', q: 'Romans 8:28' },
    { label: language === 'te' ? 'ప్రేమ' : language === 'hi' ? 'प्रेम' : 'Love', q: 'love' },
    { label: language === 'te' ? 'సమాధానం' : language === 'hi' ? 'शांति' : 'Peace', q: 'peace' }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      {/* 1. Hero Section & Quick Scripture Explorer */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] bg-gradient-to-b from-[#F8FAFC] via-white to-white">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header Title */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/80 text-xs font-semibold text-gold-900 shadow-sm">
              <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
              <span>{t('tagline')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#163A5F] tracking-tight leading-[1.15]">
              {language === 'te' ? 'జీవముగల దేవుని వాక్యము' : language === 'hi' ? 'परमेश्वर का सामर्थी जीवित वचन' : 'The Living & Abiding Word of God'}
            </h1>

            <p className="text-base sm:text-lg text-[#525252] leading-relaxed max-w-2xl mx-auto">
              {language === 'te'
                ? 'పరిశుద్ధ గ్రంథమును తెలుగు, ఇంగ్లీష్, హిందీ భాషలలో చదవండి, వినండి, మరియు AI దైవశాస్త్ర వివరణలతో లోతుగా అధ్యయనం చేయండి.'
                : language === 'hi'
                ? 'पवित्र बाइबिल को तेलुगु, अंग्रेजी और हिंदी में पढ़ें, सुनें और AI आत्मिक व्याख्याओं के साथ गहराई से अध्ययन करें।'
                : 'Read, listen, study with AI theological breakdowns, explore visual diagrams, and create scripture artwork in Telugu, English, and Hindi.'}
            </p>

            {/* Quick Scripture Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#163A5F]/40 transition-all p-1.5">
                <Search className="w-5 h-5 text-[#737373] ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full px-3 py-2.5 text-sm bg-transparent outline-none text-[#171717] placeholder:text-[#737373]"
                />
                <Button type="submit" size="sm" className="rounded-xl bg-[#163A5F] hover:bg-[#0f2842] text-white px-5 font-semibold shrink-0">
                  {t('search')}
                </Button>
              </div>
            </form>

            {/* Quick Jump Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-[#737373]">
              <span className="font-medium mr-1">{language === 'te' ? 'ముఖ్య వాక్యములు:' : language === 'hi' ? 'लोकप्रिय:' : 'Quick Jump:'}</span>
              {quickJumpTopics.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(item.q)}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#163A5F]/10 hover:text-[#163A5F] border border-[#E5E7EB] transition-colors text-xs font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Featured Daily Verse Masterpiece Card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-gold-300/60 shadow-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Visual Art Side */}
                <div
                  className="md:col-span-5 relative min-h-[240px] md:min-h-[300px] bg-cover bg-center flex items-end p-6"
                  style={{
                    backgroundImage: `url(${dailyVerse?.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80'})`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                  <div className="relative z-10 text-white space-y-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A227] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('today_verse')}</span>
                    </span>
                    <h3 className="font-serif text-xl font-bold text-gold-200 drop-shadow-sm">
                      {dailyVerse?.theme || 'Divine Grace & Eternal Love'}
                    </h3>
                  </div>
                </div>

                {/* Verse Text & Actions */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C9A227] font-serif tracking-wider uppercase">
                        {dailyVerse?.reference || 'John 3:16 • యోహాను 3:16'}
                      </span>
                      <button
                        onClick={handleCopyDailyVerse}
                        className="p-1.5 rounded-lg text-[#737373] hover:text-[#163A5F] hover:bg-[#F8FAFC] transition-colors"
                        title={copied ? t('copied') : t('copy')}
                        aria-label="Copy verse"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <blockquote className="font-serif text-lg sm:text-xl text-[#171717] leading-relaxed italic border-l-2 border-gold-400 pl-4">
                      "{dailyText}"
                    </blockquote>
                  </div>

                  {/* Actions on Daily Verse */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#E5E7EB]">
                    <Button
                      variant="gold"
                      size="sm"
                      className="rounded-xl shadow-sm font-semibold"
                      onClick={() => setExplainOpen(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      {t('ai_explanation')}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-[#E5E7EB] text-[#171717] bg-white hover:bg-[#F8FAFC] font-medium"
                      onClick={handlePlayDailyAudio}
                    >
                      <Volume2 className="w-4 h-4 mr-1.5 text-[#163A5F]" />
                      {t('listen')}
                    </Button>

                    <Link href={`/artwork?verseText=${encodeURIComponent(dailyText)}&reference=${encodeURIComponent(dailyVerse?.reference || '')}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-[#E5E7EB] text-[#171717] bg-white hover:bg-[#F8FAFC] font-medium"
                      >
                        <Palette className="w-4 h-4 mr-1.5 text-[#2563EB]" />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/reader" className="group">
            <Card className="p-5 rounded-2xl border-[#E5E7EB] hover:border-[#163A5F]/40 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#163A5F]/10 text-[#163A5F] flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-[#163A5F]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('read')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">{language === 'te' ? 'పుస్తకం, సమాంతర మరియు ఏకాగ్రత పఠనం' : language === 'hi' ? 'समानांतर और एकाग्रता पठन' : 'Book, parallel & focus reading'}</p>
              </div>
            </Card>
          </Link>

          <Link href="/diagrams" className="group">
            <Card className="p-5 rounded-2xl border-[#E5E7EB] hover:border-blue-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <GitGraph className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('diagrams')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">{language === 'te' ? 'టైమ్‌లైన్‌లు మరియు దైవశాస్త్ర రూపురేఖలు' : language === 'hi' ? 'समयरेखा और रूपरेखा' : 'Timelines & theological mindmaps'}</p>
              </div>
            </Card>
          </Link>

          <Link href="/artwork" className="group">
            <Card className="p-5 rounded-2xl border-[#E5E7EB] hover:border-purple-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('artwork')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">{language === 'te' ? 'అందమైన వాక్య పోస్టర్లు & సోషల్ షేరింగ్' : language === 'hi' ? 'वचन पोस्टर और चित्रशाला' : 'Scripture cards & studio creator'}</p>
              </div>
            </Card>
          </Link>

          <Link href="/plans" className="group">
            <Card className="p-5 rounded-2xl border-[#E5E7EB] hover:border-emerald-300 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-[#171717]">{t('plans')}</h4>
                <p className="text-xs text-[#737373] mt-0.5">{language === 'te' ? '30 రోజులు, 90 రోజులు & 1-సంవత్సర ప్రణాళికలు' : language === 'hi' ? 'पठन योजनाएँ और प्रगति' : 'Guided spiritual journey tracks'}</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* 3. Canonical Scripture Library & Book Navigator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#163A5F] uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-gold-600" />
              <span>{language === 'te' ? 'పరిశుద్ధ గ్రంథ గ్రంథాలయము' : language === 'hi' ? 'पवित्र बाइबिल पुस्तकालय' : 'Canonical Scripture Library'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163A5F]">
              {language === 'te' ? 'గ్రంథముల విభాగము' : language === 'hi' ? 'बाइबिल की पुस्तकें' : 'Explore All 66 Books'}
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
              {language === 'te'
                ? 'ఏదైనా గ్రంథమును ఎంచుకుని పఠనము ప్రారంభించండి (66 గ్రంథములు • 1,189 అధ్యాయములు)'
                : language === 'hi'
                ? 'किसी भी पुस्तक का चयन करके पठन शुरू करें'
                : 'Select any book to start reading in Book, Parallel, or Focus mode'}
            </p>
          </div>

          {/* Search within books */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              placeholder={language === 'te' ? 'గ్రంథము పేరు శోధించండి...' : language === 'hi' ? 'पुस्तक का नाम खोजें...' : 'Filter books by name...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#163A5F] text-[#171717]"
            />
          </div>
        </div>

        {/* Filters Row: Testament Tabs & Category Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Testament Tabs */}
          <div className="flex items-center bg-[#F8FAFC] rounded-xl p-1 border border-[#E5E7EB]">
            <button
              onClick={() => { setSelectedTestament('ALL'); setSelectedCategory('ALL'); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'ALL'
                  ? 'bg-[#163A5F] text-white shadow-sm font-bold'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              {t('all_books')} (66)
            </button>
            <button
              onClick={() => { setSelectedTestament('OT'); setSelectedCategory('ALL'); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'OT'
                  ? 'bg-[#163A5F] text-white shadow-sm font-bold'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              {t('ot')} (39)
            </button>
            <button
              onClick={() => { setSelectedTestament('NT'); setSelectedCategory('ALL'); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedTestament === 'NT'
                  ? 'bg-[#163A5F] text-white shadow-sm font-bold'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              {t('nt')} (27)
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-white border-gold-600 font-bold shadow-sm'
                    : 'bg-white text-[#525252] border-[#E5E7EB] hover:bg-[#F8FAFC] hover:text-[#171717]'
                }`}
              >
                {cat === 'ALL' ? 'All Genres' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {filteredBooks.map((book) => {
            const name = language === 'te' ? book.telugu : language === 'hi' ? book.hindi : book.english;
            const subtitle = language === 'te' ? book.english : book.telugu;

            return (
              <Link
                key={book.id}
                href={`/reader?book=${book.code}&chapter=1`}
                className="group block"
              >
                <Card className="p-4 rounded-2xl border-[#E5E7EB] hover:border-gold-400 hover:shadow-md transition-all h-full flex flex-col justify-between bg-white hover:bg-slate-50">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#737373] font-mono">
                      <span className="font-bold text-[#163A5F]">{book.code}</span>
                      <span className="font-sans px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-[#525252] font-semibold">
                        {book.chapters} ch
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[#171717] mt-1.5 font-serif group-hover:text-[#163A5F] transition-colors truncate">
                      {name}
                    </h4>
                    <p className="text-xs text-[#737373] truncate mt-0.5">{subtitle}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-gold-700 font-medium">
                    <span className="truncate">{book.category}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#163A5F] shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#E5E7EB] space-y-2">
            <BookOpen className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#171717]">No books match your filter</p>
            <p className="text-xs text-[#737373]">Try searching with a different keyword or reset filters.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSelectedTestament('ALL'); setSelectedCategory('ALL'); setBookSearchQuery(''); }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* 4. Visual Bible — Hand-Drawn Metaphors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Metaphor Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163A5F]">
              {language === 'te' ? 'దృశ్య వేద రమణీయకత' : language === 'hi' ? 'सचित्र आत्मिक शिक्षा' : 'The Visual Bible'}
            </h2>
            <p className="text-xs sm:text-sm text-[#737373]">
              {language === 'te'
                ? 'వాక్య భావార్ధమును ప్రతిబింబించే 16:9 ఉన్నత దృశ్య రూపకల్పనలు'
                : language === 'hi'
                ? 'वचनों का आत्मिक अर्थ समझाने वाले सुंदर दृश्य रूपक'
                : 'Hand-drawn 16:9 editorial visual metaphors explaining the heart of scripture'}
            </p>
          </div>
          <Link href="/artwork">
            <Button variant="outline" size="sm" className="rounded-xl text-xs border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50 font-semibold">
              <Palette className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
              {t('artwork')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: John 3:16 */}
          <Card
            className="group overflow-hidden rounded-3xl border-[#E5E7EB] hover:border-gold-400 cursor-pointer transition-all hover:shadow-lg bg-white"
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
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <Badge className="bg-gold-500 text-white text-[10px] font-bold mb-1 shadow">Bridge of Grace</Badge>
                <h4 className="font-serif font-bold text-base">John 3:16 • యోహాను 3:16</h4>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xs bg-white">
              <p className="text-[#525252] line-clamp-2 leading-relaxed">
                A glowing bridge spanning a deep chasm, connecting broken terrain into eternal life.
              </p>
            </div>
          </Card>

          {/* Card 2: Psalm 23:1 */}
          <Card
            className="group overflow-hidden rounded-3xl border-[#E5E7EB] hover:border-gold-400 cursor-pointer transition-all hover:shadow-lg bg-white"
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
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold mb-1 shadow">Pastoral Peace</Badge>
                <h4 className="font-serif font-bold text-base">Psalm 23:1 • కీర్తనలు 23:1</h4>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xs bg-white">
              <p className="text-[#525252] line-clamp-2 leading-relaxed">
                A deep-rooted cedar flourishing beside calm, living waters with peaceful green pastures.
              </p>
            </div>
          </Card>

          {/* Card 3: Proverbs 3:5 */}
          <Card
            className="group overflow-hidden rounded-3xl border-[#E5E7EB] hover:border-gold-400 cursor-pointer transition-all hover:shadow-lg bg-white"
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
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <Badge className="bg-blue-600 text-white text-[10px] font-bold mb-1 shadow">Steadfast Path</Badge>
                <h4 className="font-serif font-bold text-base">Proverbs 3:5 • సామెతలు 3:5</h4>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xs bg-white">
              <p className="text-[#525252] line-clamp-2 leading-relaxed">
                An unshakable rock fortress grounded upon ancient stone, leading out into illuminated paths.
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
