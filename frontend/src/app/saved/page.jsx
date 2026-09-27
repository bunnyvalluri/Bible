'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  getBookmarks,
  removeBookmark,
  getNotes,
  deleteNote,
  getHighlights,
  setHighlight,
  getReadingHistory
} from '@/lib/storage';
import {
  Bookmark,
  FileText,
  Highlighter,
  History,
  Download,
  Upload,
  Trash2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, Badge } from '@/components/ui/card';
import { HIGHLIGHT_COLORS } from '@vachanam/shared';

export default function SavedPage() {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadAllSaved();
  }, []);

  const loadAllSaved = async () => {
    const [bm, nt, hl, rh] = await Promise.all([
      getBookmarks(),
      getNotes(),
      getHighlights(),
      getReadingHistory()
    ]);
    setBookmarks(bm);
    setNotes(nt);
    setHighlights(hl);
    setHistory(rh);
  };

  const handleRemoveBookmark = async (id) => {
    await removeBookmark(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteNote = async (verseKey) => {
    await deleteNote(verseKey);
    setNotes(prev => prev.filter(n => n.verseKey !== verseKey));
  };

  const handleExportJSON = () => {
    const exportData = {
      bookmarks,
      notes,
      highlights,
      history,
      exportedAt: new Date().toISOString(),
      app: 'Vachanam'
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vachanam-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        alert('Data backup imported successfully!');
        loadAllSaved();
      } catch (err) {
        alert('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen pb-32 bg-white">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#163A5F]">{t('saved')}</h1>
          <p className="text-sm text-[#525252]">Manage your bookmarks, study notes, and highlighted verses</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50" onClick={handleExportJSON}>
            <Download className="w-4 h-4 mr-1.5 text-[#163A5F]" />
            Export Data
          </Button>

          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            <div className="h-9 px-3 text-xs inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#171717] font-medium shadow-sm">
              <Upload className="w-4 h-4 mr-1.5 text-[#163A5F]" />
              Import Data
            </div>
          </label>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center space-x-2 border-b border-[#E5E7EB] pb-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-[#163A5F] text-white font-bold shadow-sm'
              : 'text-[#737373] hover:text-[#171717]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'notes'
              ? 'bg-[#163A5F] text-white font-bold shadow-sm'
              : 'text-[#737373] hover:text-[#171717]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Study Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'highlights'
              ? 'bg-[#163A5F] text-white font-bold shadow-sm'
              : 'text-[#737373] hover:text-[#171717]'
          }`}
        >
          <Highlighter className="w-4 h-4" />
          <span>Highlights ({highlights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-[#163A5F] text-white font-bold shadow-sm'
              : 'text-[#737373] hover:text-[#171717]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      {/* Tab 1: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 text-[#737373] text-sm">
              No bookmarks saved yet. Click the bookmark button while reading to save verses.
            </div>
          ) : (
            bookmarks.map((bm) => {
              const [bCode, ch] = (bm.verseKey || '').split('.');
              return (
                <Card key={bm.id} className="p-4 rounded-2xl flex items-center justify-between gap-4 border-[#E5E7EB] hover:border-gold-400 transition-all bg-white shadow-sm">
                  <div className="space-y-1 min-w-0">
                    <span className="font-serif font-bold text-sm text-gold-600">
                      {bm.bookName} {bm.chapterNumber}:{bm.verseNumber}
                    </span>
                    <p className="text-sm text-[#171717] truncate font-serif italic">"{bm.textPreview}"</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href={`/reader?book=${bCode}&chapter=${ch}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50">
                        <BookOpen className="w-3.5 h-3.5 mr-1 text-[#163A5F]" />
                        Read
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-rose-600 hover:bg-rose-50" onClick={() => handleRemoveBookmark(bm.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-16 text-[#737373] text-sm">
              No study notes written yet. Select any verse in the reader to write notes.
            </div>
          ) : (
            notes.map((note) => {
              const [bCode, ch] = (note.verseKey || '').split('.');
              return (
                <Card key={note.verseKey} className="p-5 rounded-2xl space-y-3 border-[#E5E7EB] hover:border-gold-400 transition-all bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-gold-600">
                      {note.bookName} {note.chapterNumber}:{note.verseNumber}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link href={`/reader?book=${bCode}&chapter=${ch}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50">
                          <BookOpen className="w-3.5 h-3.5 mr-1 text-[#163A5F]" />
                          View Verse
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteNote(note.verseKey)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm text-[#171717] font-sans whitespace-pre-wrap leading-relaxed">
                    {note.contentMarkdown}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Highlights */}
      {activeTab === 'highlights' && (
        <div className="space-y-3">
          {highlights.length === 0 ? (
            <div className="text-center py-16 text-[#737373] text-sm">
              No highlighted verses yet. Use the highlighter palette while reading.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((hl) => {
                const [bCode, ch, v] = (hl.verseKey || '').split('.');
                const matchColor = HIGHLIGHT_COLORS.find(c => c.id === hl.color);

                return (
                  <Card key={hl.verseKey} className="p-4 rounded-2xl flex items-center justify-between border-[#E5E7EB] bg-white shadow-sm">
                    <div className="flex items-center space-x-3">
                      <span className={`w-4 h-4 rounded-full ${hl.color === 'gold' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <span className="font-bold text-sm font-serif text-[#171717]">{hl.verseKey}</span>
                    </div>

                    <Link href={`/reader?book=${bCode}&chapter=${ch}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-[#163A5F] hover:bg-slate-50">
                        Jump to Verse
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: History */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-16 text-[#737373] text-sm">
              No recent reading activity recorded.
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between bg-white shadow-sm">
                <div>
                  <h4 className="font-bold text-sm font-serif text-[#171717]">{item.bookName} {item.chapterNumber}</h4>
                  <span className="text-[11px] text-[#737373]">{new Date(item.timestamp).toLocaleString()}</span>
                </div>

                <Link href={`/reader?book=${item.bookCode}&chapter=${item.chapterNumber}`}>
                  <Button variant="outline" size="sm" className="text-xs border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50">
                    Continue Reading
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
