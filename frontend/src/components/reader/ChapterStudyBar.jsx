'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18n } from '@/lib/i18n';
import { useSocket } from '@/hooks/useSocket';
import { REALTIME_EVENTS } from '@vachanam/shared';
import {
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Layers,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';

export function ChapterStudyBar({
  book,
  chapterNumber,
  totalVerses,
  showAllExplanations,
  onToggleAllExplanations,
  showAllIllustrations,
  onToggleAllIllustrations,
  onRefreshChapter
}) {
  const { language, t } = useI18n();
  const { isConnected, on } = useSocket();
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [batchJobId, setBatchJobId] = useState(null);

  useEffect(() => {
    const cleanCompleted = on(REALTIME_EVENTS.AI_EXPLANATION_COMPLETED, (event) => {
      setCompletedCount((prev) => {
        const next = prev + 1;
        if (totalVerses > 0) {
          const pct = Math.min(100, Math.round((next / (totalVerses * 2)) * 100));
          setBatchProgress(pct);
          if (pct >= 100) {
            setIsBatchGenerating(false);
          }
        }
        return next;
      });
      if (onRefreshChapter) onRefreshChapter();
    });

    const cleanIllustration = on(REALTIME_EVENTS.ILLUSTRATION_COMPLETED, (event) => {
      setCompletedCount((prev) => {
        const next = prev + 1;
        if (totalVerses > 0) {
          const pct = Math.min(100, Math.round((next / (totalVerses * 2)) * 100));
          setBatchProgress(pct);
          if (pct >= 100) {
            setIsBatchGenerating(false);
          }
        }
        return next;
      });
      if (onRefreshChapter) onRefreshChapter();
    });

    return () => {
      cleanCompleted();
      cleanIllustration();
    };
  }, [on, totalVerses, onRefreshChapter]);

  const handleBatchGenerate = async () => {
    if (!book?.code || !chapterNumber) return;
    setIsBatchGenerating(true);
    setBatchProgress(10);
    setCompletedCount(0);

    try {
      const res = await axios.post(`/api/chapters/${book.code}/${chapterNumber}/generate-study-content`, {
        language,
        includeExplanations: true,
        includeIllustrations: true
      });

      if (res.data?.success) {
        setBatchJobId(res.data.jobId || 'batch-started');
      }
    } catch (err) {
      console.error('Failed to trigger chapter study generation:', err);
      setIsBatchGenerating(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Chapter Study Info & Global Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 mr-2">
            <div className="p-1.5 rounded-lg bg-gold-50 text-[#C9A227]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-xs text-[#163A5F] tracking-wide uppercase">
              Study Modes
            </span>
          </div>

          <Button
            size="xs"
            variant={showAllExplanations ? 'secondary' : 'outline'}
            onClick={onToggleAllExplanations}
            className={`text-xs font-medium border-gray-200 transition-all ${
              showAllExplanations ? 'bg-gold-50 text-[#163A5F] border-gold-300 font-semibold' : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 text-[#C9A227]" />
            {showAllExplanations ? 'Hide Explanations' : 'Show All Explanations'}
          </Button>

          <Button
            size="xs"
            variant={showAllIllustrations ? 'secondary' : 'outline'}
            onClick={onToggleAllIllustrations}
            className={`text-xs font-medium border-gray-200 transition-all ${
              showAllIllustrations ? 'bg-gold-50 text-[#163A5F] border-gold-300 font-semibold' : 'text-gray-600'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1 text-[#C9A227]" />
            {showAllIllustrations ? 'Hide Illustrations' : 'Show All Illustrations'}
          </Button>
        </div>

        {/* Right: Batch AI Study Content Generator */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
          {isBatchGenerating ? (
            <div className="flex items-center space-x-2 text-xs text-[#163A5F] bg-gold-50/70 border border-gold-200 px-3 py-1.5 rounded-xl font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
              <span>Generating {book?.english} {chapterNumber} Study Materials ({batchProgress}%)</span>
            </div>
          ) : (
            <Button
              size="xs"
              onClick={handleBatchGenerate}
              className="bg-gradient-to-r from-[#163A5F] to-[#1E4E80] text-white hover:opacity-95 text-xs font-medium px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Generate Chapter Study Content</span>
            </Button>
          )}
        </div>
      </div>

      {/* Real-time Chapter Progress Indicator */}
      {isBatchGenerating && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Synthesizing theological context and 16:9 visual artwork for {totalVerses} verses...</span>
            <span className="font-mono font-bold text-[#163A5F]">{completedCount} / {totalVerses * 2} Units</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#163A5F] via-[#C9A227] to-[#D4AF37] h-1.5 transition-all duration-300 rounded-full"
              style={{ width: `${batchProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
