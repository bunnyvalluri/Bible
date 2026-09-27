'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useI18n } from '@/lib/i18n';
import { useSocket } from '@/hooks/useSocket';
import { useJobProgress } from '@/hooks/useJobProgress';
import { REALTIME_EVENTS } from '@vachanam/shared';
import {
  Sparkles,
  BookOpen,
  History,
  HeartHandshake,
  Compass,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';

export function VerseExplanationCard({
  verse,
  explanation: initialExplanation,
  book,
  chapterNumber,
  onExplanationGenerated
}) {
  const { language, t } = useI18n();
  const { isConnected, on } = useSocket();
  const [explanation, setExplanation] = useState(initialExplanation);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');

  // Listen for real-time completion for this specific verse
  React.useEffect(() => {
    setExplanation(initialExplanation);
  }, [initialExplanation]);

  React.useEffect(() => {
    const cleanCompleted = on(REALTIME_EVENTS.AI_EXPLANATION_COMPLETED, (event) => {
      if (event.payload?.verseKey === verse.verseKey) {
        setExplanation(event.payload.explanation);
        setIsGenerating(false);
        setActiveJobId(null);
        if (onExplanationGenerated) onExplanationGenerated(event.payload.explanation);
      }
    });

    const cleanProgress = on(REALTIME_EVENTS.AI_EXPLANATION_PROGRESS, (event) => {
      if (event.payload?.jobId === activeJobId) {
        setGenerationProgress(event.payload.progress || 50);
        setGenerationStage(event.payload.stage || 'Analyzing scripture...');
      }
    });

    return () => {
      cleanCompleted();
      cleanProgress();
    };
  }, [on, verse.verseKey, activeJobId, onExplanationGenerated]);

  const handleGenerateExplanation = async () => {
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStage('Dispatching AI analysis job...');

    try {
      const res = await axios.post('/api/jobs/explanation', {
        verseKey: verse.verseKey,
        language
      });
      if (res.data?.jobId) {
        setActiveJobId(res.data.jobId);
      }
    } catch (err) {
      console.error('Failed to trigger explanation job:', err);
      setIsGenerating(false);
    }
  };

  // 1. Generation in Progress State
  if (isGenerating) {
    return (
      <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F8FAFC] to-white border border-gold-300/60 shadow-sm space-y-3 animate-in fade-in">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#163A5F] font-bold font-serif">
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
            <span>AI Theological Synthesis in Progress...</span>
          </div>
          <span className="font-mono font-bold text-[#C9A227]">{generationProgress}%</span>
        </div>

        <p className="text-xs text-[#737373] italic">{generationStage}</p>

        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-[#163A5F] transition-all duration-300"
            style={{ width: `${generationProgress}%` }}
          />
        </div>
      </div>
    );
  }

  // 2. No Explanation Yet Generated
  if (!explanation) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5 text-[#525252]">
          <div className="w-7 h-7 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
          </div>
          <span>
            {language === 'te'
              ? 'ఈ వచనమునకు AI దైవశాస్త్ర వివరణ అందుబాటులో ఉంది.'
              : language === 'hi'
              ? 'इस पद के लिए AI आत्मिक व्याख्या उपलब्ध है।'
              : 'Detailed 6-dimensional theological breakdown available for this verse.'}
          </span>
        </div>

        <Button
          variant="gold"
          size="sm"
          className="rounded-xl text-xs px-3.5 py-1.5 font-semibold shrink-0 shadow-sm"
          onClick={handleGenerateExplanation}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {t('ai_explanation')}
        </Button>
      </div>
    );
  }

  // 3. Render Completed Explanation
  let keyPointsList = [];
  try {
    keyPointsList = typeof explanation.keyPoints === 'string' ? JSON.parse(explanation.keyPoints) : (explanation.keyPoints || []);
  } catch (e) {
    keyPointsList = [];
  }

  return (
    <div className="mt-4 rounded-2xl bg-white border border-gold-300/60 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 bg-[#F8FAFC] border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-[#C9A227] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif font-bold text-xs sm:text-sm text-[#163A5F]">
            {t('ai_explanation')}
          </span>
          <Badge variant="outline" className="text-[10px] bg-white text-[#737373] border-[#E5E7EB]">
            {explanation.aiModel || 'gpt-4o-mini'}
          </Badge>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#163A5F] hover:text-[#0f2842] font-semibold flex items-center space-x-1"
        >
          <span>{isExpanded ? 'Less' : 'Read Full Study'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Meaning Summary */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700 font-sans">
            {t('simple_explanation')}
          </h4>
          <p className="text-sm sm:text-base text-[#171717] leading-relaxed font-serif">
            {explanation.simpleExplanation}
          </p>
        </div>

        {/* 3 Key Learning Points */}
        {keyPointsList.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#163A5F] font-sans">
              {t('key_points')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {keyPointsList.map((pt, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-gold-100 text-gold-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-[#525252] leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Dimensions */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t border-[#E5E7EB] text-xs sm:text-sm animate-in fade-in duration-200">
            {explanation.historicalContext && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#163A5F]">
                  <History className="w-3.5 h-3.5 text-gold-600" />
                  <span>{t('historical_context')}</span>
                </div>
                <p className="text-[#525252] leading-relaxed">{explanation.historicalContext}</p>
              </div>
            )}

            {explanation.spiritualMeaning && (
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('spiritual_meaning')}</span>
                </div>
                <p className="text-[#525252] leading-relaxed">{explanation.spiritualMeaning}</p>
              </div>
            )}

            {explanation.lifeApplication && (
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('life_application')}</span>
                </div>
                <p className="text-[#525252] leading-relaxed">{explanation.lifeApplication}</p>
              </div>
            )}

            {explanation.youthExplanation && (
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('youth_explanation')}</span>
                </div>
                <p className="text-[#525252] leading-relaxed">{explanation.youthExplanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
