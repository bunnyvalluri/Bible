'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import {
  Sparkles,
  BookOpen,
  History,
  HeartHandshake,
  Compass,
  Smile,
  X,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/card';

export function VerseExplanationDrawer({ verseKey, verseText, reference, isOpen, onClose }) {
  const { language, t } = useI18n();
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && verseKey) {
      loadExplanation();
    }
  }, [isOpen, verseKey, language]);

  const loadExplanation = async (refresh = false) => {
    setLoading(true);
    try {
      const data = await api.getVerseExplanation(verseKey, language, refresh);
      setExplanation(data);
    } catch (err) {
      console.error('Failed to load explanation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  let keyPointsList = [];
  if (explanation && explanation.keyPoints) {
    try {
      keyPointsList = typeof explanation.keyPoints === 'string'
        ? JSON.parse(explanation.keyPoints)
        : explanation.keyPoints;
    } catch (e) {
      keyPointsList = [explanation.keyPoints];
    }
  }

  const handleCopy = () => {
    if (!explanation) return;
    const text = `${reference}\n"${verseText}"\n\nExplanation:\n${explanation.simpleExplanation}\n\nSpiritual Meaning:\n${explanation.spiritualMeaning}\n\nLife Application:\n${explanation.lifeApplication}\n\n- Via Vachanam Bible Engine`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:max-w-2xl bg-white h-full h-[100dvh] shadow-2xl flex flex-col border-l border-[#E5E7EB] overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-400 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-[#171717] font-serif truncate">{reference}</h3>
                <Badge variant="gold" className="text-[9px] sm:text-[10px] flex-shrink-0">Theological AI</Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-[#737373] truncate">{t('ai_explanation')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 min-h-[44px] min-w-[44px] border-[#E5E7EB] text-[#171717] bg-white hover:bg-slate-50"
              onClick={() => loadExplanation(true)}
              title="Regenerate"
              aria-label="Regenerate explanation"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#163A5F]' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 min-h-[44px] min-w-[44px] border-[#E5E7EB] text-[#171717] bg-white hover:bg-slate-50"
              onClick={handleCopy}
              title={t('copy')}
              aria-label={t('copy')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full text-[#737373] hover:text-[#171717]"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Selected Verse Quote Card */}
        <div className="p-6 pb-2">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
            <p className="text-base font-serif italic text-[#163A5F] leading-relaxed">
              "{verseText}"
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-[#737373]">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
              <p className="text-sm font-medium">Synthesizing theological insights in {language.toUpperCase()}...</p>
            </div>
          ) : explanation ? (
            <>
              {/* 1. Simple Explanation */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#163A5F] font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-gold-500" />
                  <h4>{t('simple_explanation')}</h4>
                </div>
                <p className="text-sm leading-relaxed text-[#171717] bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
                  {explanation.simpleExplanation}
                </p>
              </div>

              {/* 2. 3 Key Learning Points */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#163A5F] font-bold text-sm">
                  <Compass className="w-4 h-4 text-gold-500" />
                  <h4>{t('key_points')}</h4>
                </div>
                <div className="space-y-2">
                  {keyPointsList.map((point, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-[#171717]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Historical & Cultural Context */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#163A5F] font-bold text-sm">
                  <History className="w-4 h-4 text-gold-500" />
                  <h4>{t('historical_context')}</h4>
                </div>
                <p className="text-sm leading-relaxed text-[#525252] bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
                  {explanation.historicalContext}
                </p>
              </div>

              {/* 4. Spiritual Meaning */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#163A5F] font-bold text-sm">
                  <HeartHandshake className="w-4 h-4 text-gold-500" />
                  <h4>{t('spiritual_meaning')}</h4>
                </div>
                <p className="text-sm leading-relaxed text-[#171717] bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
                  {explanation.spiritualMeaning}
                </p>
              </div>

              {/* 5. Practical Life Application */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#163A5F] font-bold text-sm">
                  <Compass className="w-4 h-4 text-gold-500" />
                  <h4>{t('life_application')}</h4>
                </div>
                <p className="text-sm leading-relaxed text-[#171717] bg-[#FDF8E8] p-4 rounded-xl border border-gold-200">
                  {explanation.lifeApplication}
                </p>
              </div>

              {/* 6. Youth Perspective */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#163A5F] font-bold text-sm">
                  <Smile className="w-4 h-4 text-gold-500" />
                  <h4>{t('youth_explanation')}</h4>
                </div>
                <p className="text-sm leading-relaxed text-[#171717] bg-[#EFF6FF] p-4 rounded-xl border border-blue-200">
                  {explanation.youthExplanation}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-[#737373] text-sm">
              No explanation available. Click retry.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#737373]">
          <span>AI Model: {explanation?.aiModel || 'vachanam-theology'}</span>
          <Button variant="gold" size="sm" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy All Insights'}
          </Button>
        </div>
      </div>
    </div>
  );
}
