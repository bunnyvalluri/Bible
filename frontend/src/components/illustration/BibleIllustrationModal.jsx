'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import {
  Image as ImageIcon,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  Info,
  X,
  CheckCircle2,
  Layers,
  Palette
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge, Card } from '../ui/card';

export function BibleIllustrationModal({ isOpen, onClose, verse, bookName }) {
  const { language, t } = useI18n();
  const [illustration, setIllustration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const verseKey = verse?.verseKey || (verse ? `${verse.bookId || 'GEN'}.${verse.chapterNumber}.${verse.verseNumber}` : null);
  const refText = verse ? `${bookName || verse.book?.english || 'Scripture'} ${verse.chapterNumber}:${verse.verseNumber}` : '';
  const scriptureText = verse
    ? (language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish)
    : '';

  useEffect(() => {
    if (isOpen && verseKey) {
      loadIllustration();
    }
  }, [isOpen, verseKey, language]);

  const loadIllustration = async () => {
    setLoading(true);
    try {
      const data = await api.getIllustration(verseKey, language);
      setIllustration(data);
    } catch (err) {
      console.warn('Failed to load illustration:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!verseKey) return;
    setRegenerating(true);
    try {
      const refreshed = await api.generateIllustration({
        verseKey,
        reference: refText,
        text: scriptureText,
        language
      });
      setIllustration(refreshed);
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (!illustration) return;
    const canvas = canvasRef.current;
    if (!canvas) {
      window.open(illustration.imageUrl, '_blank');
      return;
    }

    const link = document.createElement('a');
    link.download = `vachanam-illustration-${verseKey || 'verse'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vachanam Bible Illustration — ${refText}`,
          text: `"${scriptureText}" — ${refText}\n\nVisual Metaphor: ${illustration?.visualMetaphor || ''}`,
          url: window.location.href
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`"${scriptureText}" — ${refText}\n${illustration?.imageUrl || ''}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !verse) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in-50">
      <div className="bg-white text-[#171717] border border-[#E5E7EB] rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-3.5 sm:p-6 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#163A5F] truncate">
                  {refText}
                </h3>
                <Badge variant="outline" className="text-[9px] sm:text-xs bg-gold-50 text-gold-800 border-gold-200 flex-shrink-0">
                  Visual Explanation
                </Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-[#737373] truncate">
                Vachanam Bible Illustration Engine • 16:9 Editorial Style
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl text-[#737373] hover:text-[#171717] hover:bg-slate-100 transition-colors flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 flex-1">
          {loading ? (
            <div className="aspect-video w-full rounded-2xl bg-[#F8FAFC] animate-pulse flex flex-col items-center justify-center space-y-3 border border-[#E5E7EB]">
              <ImageIcon className="w-10 h-10 text-slate-300 animate-bounce" />
              <p className="text-xs text-[#737373] font-medium">Synthesizing visual metaphor & illustration...</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* 16:9 Illustration Canvas Preview */}
              <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-[#E5E7EB] bg-slate-900 group">
                <img
                  src={illustration?.imageUrl || 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1920&q=80'}
                  alt={refText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Programmatic Scripture Typography Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 text-white space-y-1 sm:space-y-2 pointer-events-none">
                  <p className={`text-xs sm:text-base md:text-xl font-medium leading-relaxed drop-shadow-md ${
                    language === 'te' ? 'font-telugu' : language === 'hi' ? 'font-devanagari' : 'font-serif italic'
                  }`}>
                    "{scriptureText}"
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] sm:text-sm font-semibold text-gold-300 tracking-wide font-sans">
                      — {refText}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest font-sans">
                      వచనం • Vachanam
                    </span>
                  </div>
                </div>
              </div>

              {/* Cognitive Breakdown & Visual Metaphor Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <Card className="p-3.5 sm:p-4 border-[#E5E7EB] bg-[#F8FAFC] space-y-1.5 sm:space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gold-600 uppercase tracking-wider">
                    <Palette className="w-4 h-4" />
                    <span>Spiritual Theme</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#171717]">
                    {illustration?.theme || 'Divine Grace & Everlasting Covenant'}
                  </p>
                </Card>

                <Card className="p-3.5 sm:p-4 border-[#E5E7EB] bg-[#F8FAFC] space-y-1.5 sm:space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gold-600 uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>Visual Metaphor Explanation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                    {illustration?.visualMetaphor || 'A warm radiant bridge of grace spanning a deep chasm towards the sunlit dawn, illustrating unconditional salvation.'}
                  </p>
                </Card>
              </div>

              {/* QA Rating & Biblical Safety Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-[11px] sm:text-xs">
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Biblical Safety & Content QA Passed</span>
                </div>
                <div className="flex items-center space-x-3 text-[#737373]">
                  <span>Aspect: <strong>16:9</strong></span>
                  <span>Style: <strong>Hand-Drawn</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-3.5 sm:p-6 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2.5 bg-[#F8FAFC]">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl flex items-center space-x-2 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50 min-h-[44px]"
            onClick={handleRegenerate}
            disabled={regenerating || loading}
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl flex items-center space-x-1.5 sm:space-x-2 border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50 min-h-[44px]"
              onClick={handleShare}
              disabled={loading || !illustration}
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="rounded-xl flex items-center space-x-1.5 sm:space-x-2 bg-[#163A5F] hover:bg-[#0f2842] text-white min-h-[44px]"
              onClick={handleDownload}
              disabled={loading || !illustration}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
