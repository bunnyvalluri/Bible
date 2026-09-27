'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Palette, Sparkles } from 'lucide-react';
import { VerseCanvasEditor } from '@/components/artwork/VerseCanvasEditor';

function ArtworkContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const verseTextParam = searchParams.get('verseText') || 'దేవుడు లోకమును ఎంతో ప్రేమించెను. కాగా ఆయన తన అద్వితీయకుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.';
  const referenceParam = searchParams.get('reference') || 'యోహాను 3:16 • John 3:16';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32 bg-white">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900">
          <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Scripture Artwork Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#163A5F]">
          {t('artwork')}
        </h1>
        <p className="text-sm text-[#525252]">
          Transform verses into biblical fine artwork for mobile wallpaper, stories, and presentations
        </p>
      </div>

      <VerseCanvasEditor
        initialVerseText={verseTextParam}
        initialReference={referenceParam}
      />
    </div>
  );
}

export default function ArtworkPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading Studio...</div>}>
      <ArtworkContent />
    </Suspense>
  );
}
