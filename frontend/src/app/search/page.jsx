'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import { BIBLE_BOOKS } from '@vachanam/shared';
import {
  Search as SearchIcon,
  Sparkles,
  BookOpen,
  Filter,
  Clock,
  TrendingUp,
  ArrowRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, Badge } from '@/components/ui/card';

export default function SearchPage() {
  const { language, t } = useI18n();
  const [query, setQuery] = useState('');
  const [searchLang, setSearchLang] = useState('all');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedTestament, setSelectedTestament] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    api.getPopularSearches().then(setPopularSearches);
    const saved = localStorage.getItem('vachanam_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery || !searchQuery.trim()) return;
    setLoading(true);

    try {
      const data = await api.search({
        query: searchQuery,
        language: searchLang,
        bookCode: selectedBook || undefined,
        testament: selectedTestament || undefined,
        limit: 30
      });

      setResults(data.results || []);
      setTotal(data.total || 0);

      // Save to recent
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem('vachanam_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setTotal(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen pb-32 bg-white">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#163A5F]">
          {t('search')}
        </h1>
        <p className="text-sm text-[#525252]">
          Search scripture across Telugu (తెలుగు), English, and Hindi (हिंदी)
        </p>
      </div>

      {/* Main Search Input Bar */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 w-5 h-5 text-gold-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search_placeholder')}
            className="w-full pl-12 pr-28 py-4 bg-white border-2 border-[#E5E7EB] focus:border-[#2563EB] rounded-2xl text-base text-[#171717] shadow-sm focus:outline-none transition-all"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-24 text-[#737373] hover:text-[#171717] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Button
            variant="default"
            size="default"
            className="absolute right-2.5 h-10 px-4 rounded-xl bg-[#163A5F] hover:bg-[#0f2842] text-white"
            onClick={() => handleSearch()}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto text-xs">
        {/* Language Filter */}
        <select
          value={searchLang}
          onChange={(e) => {
            setSearchLang(e.target.value);
            if (query) handleSearch();
          }}
          className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 font-medium text-[#171717] focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="all">All Languages</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>

        {/* Testament Filter */}
        <select
          value={selectedTestament}
          onChange={(e) => {
            setSelectedTestament(e.target.value);
            if (query) handleSearch();
          }}
          className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 font-medium text-[#171717] focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="">Both Testaments</option>
          <option value="OT">Old Testament (పాత నిబంధన)</option>
          <option value="NT">New Testament (క్రొత్త నిబంధన)</option>
        </select>

        {/* Book Filter */}
        <select
          value={selectedBook}
          onChange={(e) => {
            setSelectedBook(e.target.value);
            if (query) handleSearch();
          }}
          className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 font-medium text-[#171717] focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="">All 66 Books</option>
          {BIBLE_BOOKS.map(b => (
            <option key={b.code} value={b.code}>
              {language === 'te' ? b.telugu : language === 'hi' ? b.hindi : b.english}
            </option>
          ))}
        </select>
      </div>

      {/* Popular and Recent Queries */}
      {results.length === 0 && !loading && (
        <div className="max-w-2xl mx-auto space-y-6 pt-4">
          {/* Popular */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
              <TrendingUp className="w-3.5 h-3.5 text-gold-600" />
              <span>{t('popular_searches')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p.query);
                    handleSearch(p.query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-gold-400 text-xs text-[#171717] font-medium transition-colors shadow-sm"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* Recent */}
          {recentSearches.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
                <Clock className="w-3.5 h-3.5 text-[#163A5F]" />
                <span>{t('recent_searches')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((qText, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(qText);
                      handleSearch(qText);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#525252] hover:text-[#171717] transition-colors"
                  >
                    {qText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Header */}
      {results.length > 0 && (
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 text-xs text-[#737373]">
          <span>Found {total} matching verses</span>
          <span>Showing top results</span>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((item) => (
          <Link
            key={item.id || item.verseKey}
            href={`/reader?book=${item.bookCode}&chapter=${item.chapterNumber}`}
            className="block group"
          >
            <Card className="p-5 rounded-2xl border-[#E5E7EB] hover:border-blue-400 hover:shadow-md transition-all space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#163A5F] group-hover:underline">
                  {language === 'te' ? item.referenceTelugu : language === 'hi' ? item.referenceHindi : item.reference}
                </span>
                <Badge variant="outline" className="text-[10px] bg-[#F8FAFC] text-[#525252] border-[#E5E7EB]">
                  {item.bookCode} {item.chapterNumber}:{item.verseNumber}
                </Badge>
              </div>

              {/* Multilingual Text Snippets */}
              <div className="space-y-1.5 text-sm">
                {item.textTelugu && (
                  <p className="font-telugu text-[#171717] leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-[#737373] mr-1.5 font-sans">TE:</span>
                    {item.textTelugu}
                  </p>
                )}
                {item.textEnglish && (
                  <p className="font-serif text-[#525252] leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-[#737373] mr-1.5 font-sans">EN:</span>
                    {item.textEnglish}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end text-xs text-gold-600 font-medium group-hover:translate-x-1 transition-transform">
                <span>Read Full Chapter</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#163A5F]" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
