'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18n } from '@/lib/i18n';
import { useSocket } from '@/hooks/useSocket';
import { REALTIME_EVENTS } from '@vachanam/shared';
import {
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Share2,
  Loader2,
  RefreshCw,
  X,
  Palette,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';

export function VerseIllustrationCard({
  verse,
  illustration: initialIllustration,
  book,
  chapterNumber,
  onIllustrationGenerated
}) {
  const { language, t } = useI18n();
  const { on } = useSocket();
  const [illustration, setIllustration] = useState(initialIllustration);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIllustration(initialIllustration);
  }, [initialIllustration]);

  useEffect(() => {
    const cleanCompleted = on(REALTIME_EVENTS.ILLUSTRATION_COMPLETED, (event) => {
      if (event.payload?.verseKey === verse.verseKey) {
        setIllustration(event.payload.illustration);
        setIsGenerating(false);
        setActiveJobId(null);
        if (onIllustrationGenerated) onIllustrationGenerated(event.payload.illustration);
      }
    });

    const cleanProgress = on(REALTIME_EVENTS.ILLUSTRATION_PROGRESS, (event) => {
      if (event.payload?.jobId === activeJobId) {
        setGenerationProgress(event.payload.progress || 50);
        setGenerationStage(event.payload.stage || 'Creating visual artwork...');
      }
    });

    return () => {
      cleanCompleted();
      cleanProgress();
    };
  }, [on, verse.verseKey, activeJobId, onIllustrationGenerated]);

  const handleGenerateIllustration = async () => {
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStage('Extracting visual theological concepts...');

    try {
      const res = await axios.post('/api/jobs/illustration', {
        verseKey: verse.verseKey,
        style: 'vachanam-editorial-handdrawn',
        language
      });
      if (res.data?.jobId) {
        setActiveJobId(res.data.jobId);
      }
    } catch (err) {
      console.error('Failed to trigger illustration job:', err);
      setIsGenerating(false);
    }
  };

  const handleShareImage = async () => {
    const shareText = `"${verse.textEnglish || verse.textTelugu || verse.textHindi}" — ${book?.english || ''} ${chapterNumber}:${verse.verseNumber}\nVisual Illustration by Vachanam`;
    if (navigator.share && illustration?.imageUrl) {
      try {
        await navigator.share({
          title: `Vachanam Biblical Illustration - ${book?.english || ''} ${chapterNumber}:${verse.verseNumber}`,
          text: shareText,
          url: illustration.imageUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (illustration?.imageUrl) {
      navigator.clipboard.writeText(`${shareText}\n${illustration.imageUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 1. Generation in progress
  if (isGenerating) {
    return (
      <div className="mt-3 rounded-2xl border border-gold-300/60 bg-gradient-to-br from-[#F8FAFC] to-white p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#163A5F] font-bold font-serif text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
            <span>AI Biblical Metaphor Generation</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#C9A227]">{generationProgress}%</span>
        </div>

        {/* 16:9 Skeleton Container */}
        <div className="relative w-full aspect-video rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border border-gray-200 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-white/80 shadow-md flex items-center justify-center mb-3 text-[#C9A227]">
            <Palette className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-[#163A5F]">{generationStage || 'Synthesizing 16:9 reverent composition...'}</p>
          <p className="text-[11px] text-[#737373] mt-1 max-w-xs">Crafting hand-drawn visual narrative with sacred geometry and dignified editorial palette.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#163A5F] via-[#C9A227] to-[#D4AF37] h-2 transition-all duration-500 rounded-full"
            style={{ width: `${generationProgress}%` }}
          />
        </div>
      </div>
    );
  }

  // 2. Illustration Exists
  if (illustration?.imageUrl) {
    return (
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Visual Illustration Card Header */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-[#F8FAFC] to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-gold-50 text-[#C9A227]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#163A5F] font-serif uppercase tracking-wider">
              Biblical Illustration • 16:9
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 text-gray-500 hover:text-[#163A5F] hover:bg-gray-100 rounded-lg transition-colors"
              title="Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShareImage}
              className="p-1.5 text-gray-500 hover:text-[#163A5F] hover:bg-gray-100 rounded-lg transition-colors"
              title="Share Illustration"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 16:9 Image Container */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative w-full aspect-video bg-gray-900 group cursor-pointer overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={illustration.imageUrl}
            alt={illustration.visualMetaphor || `Illustration for ${book?.english} ${chapterNumber}:${verse.verseNumber}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div className="text-white text-xs flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#C9A227]" />
              <span className="font-medium">Click to view full sacred resolution</span>
            </div>
          </div>
        </div>

        {/* Caption and Metaphor Context */}
        {illustration.visualMetaphor && (
          <div className="p-3.5 sm:p-4 bg-[#FDFEFE] border-t border-gray-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A227]">
                Visual Metaphor & Symbolism
              </span>
              {illustration.theme && (
                <Badge variant="outline" className="text-[10px] text-[#163A5F] border-gray-200 py-0">
                  {illustration.theme}
                </Badge>
              )}
            </div>
            <p className="text-xs text-[#525252] leading-relaxed">
              {illustration.visualMetaphor}
            </p>
          </div>
        )}

        {/* Fullscreen Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in">
            <div className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#163A5F]">
                    {book?.english} {chapterNumber}:{verse.verseNumber} Illustration
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sacred Hand-Drawn 16:9 Metaphor • Vachanam Visual Identity
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShareImage}
                    className="border-gray-200 text-xs text-[#163A5F]"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Image */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={illustration.imageUrl}
                  alt={illustration.visualMetaphor || 'Sacred Illustration'}
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>

              {/* Modal Scripture & Metaphor Details */}
              <div className="p-6 bg-white border-t border-gray-200 space-y-3">
                <blockquote className="italic font-serif text-sm text-[#163A5F] border-l-2 border-[#C9A227] pl-3">
                  "{verse.textEnglish || verse.textTelugu || verse.textHindi}"
                </blockquote>
                {illustration.visualMetaphor && (
                  <p className="text-xs text-gray-600">
                    <strong className="text-[#163A5F]">Theological Concept: </strong>
                    {illustration.visualMetaphor}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. No Illustration Yet - Discreet Trigger Button
  return (
    <div className="mt-3">
      <button
        onClick={handleGenerateIllustration}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gold-200 bg-gold-50/40 hover:bg-gold-100/60 text-[#163A5F] text-xs font-medium transition-all shadow-xs group"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C9A227] group-hover:rotate-12 transition-transform" />
        <span>Generate 16:9 Visual Illustration</span>
      </button>
    </div>
  );
}
