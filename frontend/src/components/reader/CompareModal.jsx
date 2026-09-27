'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/card';
import { X, Copy, Share2 } from 'lucide-react';

export function CompareModal({ verse, book, chapterNumber, isOpen, onClose }) {
  if (!isOpen || !verse) return null;

  const handleCopyAll = () => {
    const text = `Comparison: ${book.english} ${chapterNumber}:${verse.verseNumber}\n\n[Telugu • తెలుగు]:\n${verse.textTelugu}\n\n[English]:\n${verse.textEnglish}\n\n[Hindi • हिंदी]:\n${verse.textHindi}\n\n- Vachanam Bible Engine`;
    navigator.clipboard.writeText(text);
    alert('Comparison copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="gold">Compare Translations</Badge>
              <span className="text-xs text-[#737373]">{verse.verseKey}</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#163A5F] mt-1">
              {book.english} / {book.telugu} {chapterNumber}:{verse.verseNumber}
            </h3>
          </div>

          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-[#737373] hover:text-[#171717]" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Translation Cards */}
        <div className="space-y-4">
          {/* Telugu */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">
                తెలుగు (Telugu Translation)
              </span>
            </div>
            <p className="font-telugu text-lg leading-relaxed text-[#171717]">{verse.textTelugu}</p>
          </div>

          {/* English */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#525252] uppercase tracking-wider">
                English (King James Version)
              </span>
            </div>
            <p className="font-serif text-lg leading-relaxed text-[#171717]">{verse.textEnglish}</p>
          </div>

          {/* Hindi */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#525252] uppercase tracking-wider">
                हिंदी (Hindi Holy Bible)
              </span>
            </div>
            <p className="font-devanagari text-lg leading-relaxed text-[#171717]">{verse.textHindi}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            <Copy className="w-4 h-4 mr-1.5" />
            Copy All
          </Button>
          <Button variant="gold" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
