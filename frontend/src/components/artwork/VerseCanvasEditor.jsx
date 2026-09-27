'use client';

import React, { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { toPng, toJpeg } from 'html-to-image';
import {
  Download,
  Share2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Type,
  Maximize2,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const BACKGROUND_PRESETS = [
  { id: 'divine-gold', name: 'Divine Dawn', url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80' },
  { id: 'mountain-glory', name: 'Mountain Solace', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { id: 'cathedral-light', name: 'Cathedral Rays', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80' },
  { id: 'forest-peace', name: 'Living Green', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80' },
  { id: 'night-stars', name: 'Night Majesty', url: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80' }
];

export function VerseCanvasEditor({
  initialVerseText = 'దేవుడు లోకమును ఎంతో ప్రేమించెను. కాగా ఆయన తన అద్వితీయకుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.',
  initialReference = 'యోహాను 3:16 • John 3:16'
}) {
  const { language } = useI18n();
  const [verseText, setVerseText] = useState(initialVerseText);
  const [reference, setReference] = useState(initialReference);
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_PRESETS[0].url);
  const [aspectRatio, setAspectRatio] = useState('1:1'); // 1:1, 9:16, 16:9
  const [fontTheme, setFontTheme] = useState('gold-serif');
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(canvasRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `vachanam-verse-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Unable to generate artwork image directly; please try screenshotting.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reference,
          text: `"${verseText}" - ${reference} (via Vachanam)`
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(`"${verseText}" - ${reference}`);
      alert('Verse text copied to clipboard!');
    }
  };

  const getAspectClass = () => {
    if (aspectRatio === '9:16') return 'aspect-[9/16] max-w-sm';
    if (aspectRatio === '16:9') return 'aspect-[16/9] max-w-2xl';
    return 'aspect-square max-w-md';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left: Studio Preview Canvas */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 bg-muted/20 border border-border rounded-3xl">
        <div
          ref={canvasRef}
          className={`relative w-full ${getAspectClass()} rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-8 sm:p-12 text-center transition-all duration-300`}
          style={{
            backgroundImage: `url(${selectedBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Ambient Overlay */}
          <div
            className="absolute inset-0 bg-primary-950 transition-opacity"
            style={{ opacity: overlayOpacity }}
          />

          {/* Canvas Decorative Header */}
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <span className="w-8 h-px bg-gold-400/60" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-300 font-serif">
              Holy Scripture • పరిశుద్ధ గ్రంథము
            </span>
            <span className="w-8 h-px bg-gold-400/60" />
          </div>

          {/* Main Verse Text */}
          <div className="relative z-10 my-auto py-4">
            <p
              className={`text-white font-serif leading-relaxed drop-shadow-md ${
                aspectRatio === '9:16' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              } ${fontTheme === 'gold-serif' ? 'text-gold-100 font-serif' : 'text-white font-sans font-medium'}`}
            >
              "{verseText}"
            </p>
          </div>

          {/* Canvas Reference & Watermark */}
          <div className="relative z-10 flex flex-col items-center space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-gold-400 tracking-wide font-serif drop-shadow">
              {reference}
            </h4>
            <span className="text-[10px] text-white/70 font-sans tracking-wider">
              VACHANAM (వచనం) BIBLE
            </span>
          </div>
        </div>

        {/* Download & Share Actions */}
        <div className="flex items-center space-x-3 mt-6">
          <Button variant="gold" size="lg" onClick={handleDownload} disabled={isDownloading}>
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? 'Generating...' : 'Download High-Res PNG'}
          </Button>

          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Right: Studio Customization Panel */}
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold font-serif text-foreground">Studio Controls</h3>
          <p className="text-xs text-muted-foreground">Customize verse artwork typography & backgrounds</p>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Verse Text
          </label>
          <textarea
            value={verseText}
            onChange={(e) => setVerseText(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
          />
        </div>

        {/* Reference Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Reference Citation
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
          />
        </div>

        {/* Aspect Ratio Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Format / Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '1:1', label: '1:1 Square' },
              { id: '9:16', label: '9:16 Story' },
              { id: '16:9', label: '16:9 Banner' }
            ].map((ar) => (
              <button
                key={ar.id}
                onClick={() => setAspectRatio(ar.id)}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  aspectRatio === ar.id
                    ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 font-bold border-transparent'
                    : 'border-border hover:bg-muted/40 text-foreground'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Biblical Fine Art Backgrounds
          </label>
          <div className="grid grid-cols-5 gap-2">
            {BACKGROUND_PRESETS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBg(bg.url)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedBg === bg.url ? 'border-gold-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundImage: `url(${bg.url})`, backgroundSize: 'cover' }}
                title={bg.name}
              />
            ))}
          </div>
        </div>

        {/* Overlay Darkening */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Overlay Darkness</span>
            <span>{Math.round(overlayOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.8}
            step={0.05}
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full accent-gold-500"
          />
        </div>
      </Card>
    </div>
  );
}
