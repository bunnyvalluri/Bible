'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { READING_MODES, FONT_SIZES } from '@vachanam/shared';
import {
  BookOpen,
  Columns,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center space-x-2">
            <Type className="w-5 h-5 text-[#163A5F]" />
            <h3 className="font-bold text-base text-[#171717] font-serif">Reader Customization</h3>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-[#737373] hover:text-[#171717]" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 1. Reading Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#525252]">
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
                      ? 'bg-[#163A5F]/10 border-[#163A5F] font-bold'
                      : 'border-[#E5E7EB] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-[#163A5F]' : 'text-[#737373]'}`} />
                  <div>
                    <h5 className="text-sm text-[#171717]">{m.label}</h5>
                    <p className="text-xs text-[#525252] font-normal">{m.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#525252]">
            {t('font_size')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.id}
                onClick={() => setFontSize(fs.id)}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  fontSize === fs.id
                    ? 'bg-[#163A5F] text-white border-transparent shadow-sm'
                    : 'border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#171717]'
                }`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Typography Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#525252]">
            Typography Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFontFamily('serif')}
              className={`py-2 px-3 text-xs rounded-xl border font-serif transition-all ${
                fontFamily === 'serif'
                  ? 'bg-[#163A5F]/10 border-[#163A5F] font-bold text-[#163A5F]'
                  : 'border-[#E5E7EB] text-[#171717] hover:bg-[#F8FAFC]'
              }`}
            >
              Cormorant Serif (Book)
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`py-2 px-3 text-xs rounded-xl border font-sans transition-all ${
                fontFamily === 'sans'
                  ? 'bg-[#163A5F]/10 border-[#163A5F] font-bold text-[#163A5F]'
                  : 'border-[#E5E7EB] text-[#171717] hover:bg-[#F8FAFC]'
              }`}
            >
              Inter Sans (Modern)
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="default" size="sm" className="bg-[#163A5F] text-white" onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
