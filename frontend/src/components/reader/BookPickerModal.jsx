'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { BIBLE_BOOKS } from '@vachanam/shared';
import {
  Search,
  X,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';

export function BookPickerModal({
  isOpen,
  onClose,
  currentBookCode,
  currentChapter,
  onSelectChapter
}) {
  const { language, t } = useI18n();
  const [selectedTestament, setSelectedTestament] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBook, setActiveBook] = useState(null); // When user selects a book to pick chapter

  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((b) => {
      if (selectedTestament !== 'ALL' && b.testament !== selectedTestament) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          b.english.toLowerCase().includes(q) ||
          b.telugu.toLowerCase().includes(q) ||
          b.hindi.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedTestament, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-2.5">
            {activeBook ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-semibold text-[#163A5F]"
                onClick={() => setActiveBook(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>{language === 'te' ? 'గ్రంథముల జాబితా' : language === 'hi' ? 'पुस्तकों की सूची' : 'All Books'}</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#163A5F]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#163A5F]">
                  {language === 'te' ? 'గ్రంథము & అధ్యాయము ఎంచుకోండి' : language === 'hi' ? 'पुस्तक और अध्याय चुनें' : 'Select Book & Chapter'}
                </h3>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-[#737373] hover:text-[#171717] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Book Selection List */}
        {!activeBook ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Testament Tabs */}
            <div className="p-4 border-b border-[#E5E7EB] space-y-3 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'te' ? 'గ్రంథము పేరుతో శోధించండి (ఉదా: యోహాను, Gen, మత్తయి)...' : language === 'hi' ? 'पुस्तक का नाम खोजें...' : 'Search books by name or abbreviation...'}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#163A5F] text-[#171717]"
                  autoFocus
                />
              </div>

              {/* Testament Switcher */}
              <div className="flex items-center justify-center bg-[#F8FAFC] rounded-xl p-1 border border-[#E5E7EB]">
                <button
                  onClick={() => setSelectedTestament('ALL')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedTestament === 'ALL' ? 'bg-[#163A5F] text-white font-bold shadow-sm' : 'text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  {t('all_books')} (66)
                </button>
                <button
                  onClick={() => setSelectedTestament('OT')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedTestament === 'OT' ? 'bg-[#163A5F] text-white font-bold shadow-sm' : 'text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  {t('ot')} (39)
                </button>
                <button
                  onClick={() => setSelectedTestament('NT')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedTestament === 'NT' ? 'bg-[#163A5F] text-white font-bold shadow-sm' : 'text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  {t('nt')} (27)
                </button>
              </div>
            </div>

            {/* Scrollable Books Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredBooks.map((book) => {
                  const isCurrent = book.code === currentBookCode;
                  const name = language === 'te' ? book.telugu : language === 'hi' ? book.hindi : book.english;
                  const subtitle = language === 'te' ? book.english : book.telugu;

                  return (
                    <button
                      key={book.id}
                      onClick={() => setActiveBook(book)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                        isCurrent
                          ? 'bg-[#163A5F]/10 border-[#163A5F] shadow-sm'
                          : 'bg-white border-[#E5E7EB] hover:border-gold-400 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-[#163A5F] font-mono">{book.code}</span>
                          <span className="text-[10px] text-[#737373] bg-slate-100 px-1.5 py-0.5 rounded-md font-sans">
                            {book.chapters} ch
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#171717] truncate mt-0.5 group-hover:text-[#163A5F]">
                          {name}
                        </h4>
                        <p className="text-[11px] text-[#737373] truncate">{subtitle}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Chapter Selection Grid */
          <div className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <span className="text-xs font-bold text-gold-600 uppercase tracking-wider font-mono">
                  {activeBook.category} • {activeBook.testament === 'OT' ? t('ot') : t('nt')}
                </span>
                <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#163A5F]">
                  {language === 'te' ? activeBook.telugu : language === 'hi' ? activeBook.hindi : activeBook.english}
                </h4>
                <p className="text-xs text-[#737373]">
                  {activeBook.english} • {activeBook.chapters} {language === 'te' ? 'అధ్యాయములు' : language === 'hi' ? 'अध्याय' : 'Chapters'}
                </p>
              </div>
              <Badge variant="gold" className="text-xs font-bold px-3 py-1">
                Select Chapter
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((chNum) => {
                  const isCurrent = activeBook.code === currentBookCode && chNum === currentChapter;
                  return (
                    <button
                      key={chNum}
                      onClick={() => {
                        onSelectChapter(activeBook.code, chNum);
                        onClose();
                      }}
                      className={`h-11 sm:h-12 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#163A5F] text-white shadow-md ring-2 ring-gold-400'
                          : 'bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#163A5F] hover:bg-[#163A5F]/10 text-[#171717]'
                      }`}
                    >
                      {chNum}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
