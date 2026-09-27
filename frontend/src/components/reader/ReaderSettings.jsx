'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { READING_MODES, FONT_SIZES } from '@vachanam/shared';
import {
  BookOpen,
  Columns,
  Layers,
  Sparkles,
  Maximize2,
  Type,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

export function ReaderSettings({
  readingMode,
  setReadingMode,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  isOpen,
  onClose
}) {
  const { t } = useI18n();

  if (!isOpen) return null;

  const modes = [
    { id: READING_MODES.BOOK, label: t('mode_book'), icon: BookOpen, desc: 'Classic printed book layout' },
    { id: READING_MODES.PARALLEL, label: t('mode_parallel'), icon: Columns, desc: 'Telugu, English & Hindi side-by-side' },
    { id: READING_MODES.FOCUS, label: t('mode_focus'), icon: Maximize2, desc: 'Distraction-free ambient reader' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <Type className="w-5 h-5 text-gold-500" />
            <h3 className="font-bold text-base text-foreground font-serif">Reader Customization</h3>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 1. Reading Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('reading_mode')}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {modes.map((m) => {
              const Icon = m.icon;
              const isSelected = readingMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setReadingMode(m.id)}
                  className={`flex items-start space-x-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-primary-900/10 dark:bg-gold-400/10 border-gold-400 font-bold'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-gold-500' : 'text-muted-foreground'}`} />
                  <div>
                    <h5 className="text-sm text-foreground">{m.label}</h5>
                    <p className="text-xs text-muted-foreground font-normal">{m.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('font_size')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.id}
                onClick={() => setFontSize(fs.id)}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  fontSize === fs.id
                    ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 border-transparent shadow-sm'
                    : 'border-border hover:bg-muted/40 text-foreground'
                }`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Typography Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Typography Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFontFamily('serif')}
              className={`py-2 px-3 text-xs rounded-xl border font-serif transition-all ${
                fontFamily === 'serif'
                  ? 'bg-gold-100 dark:bg-gold-950/60 border-gold-400 font-bold text-primary-950 dark:text-gold-300'
                  : 'border-border text-foreground'
              }`}
            >
              Cormorant Serif (Book)
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`py-2 px-3 text-xs rounded-xl border font-sans transition-all ${
                fontFamily === 'sans'
                  ? 'bg-gold-100 dark:bg-gold-950/60 border-gold-400 font-bold text-primary-950 dark:text-gold-300'
                  : 'border-border text-foreground'
              }`}
            >
              Inter Sans (Modern)
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="gold" size="sm" onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
