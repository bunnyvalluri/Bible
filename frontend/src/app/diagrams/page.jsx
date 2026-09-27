'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import { DIAGRAM_TEMPLATES } from '@vachanam/shared';
import {
  GitGraph,
  Calendar,
  Layers,
  Network,
  Compass,
  Filter,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';
import { InteractiveDiagram } from '@/components/ai/InteractiveDiagram';

export default function DiagramsPage() {
  const { language, t } = useI18n();
  const [diagrams, setDiagrams] = useState(DIAGRAM_TEMPLATES);
  const [selectedType, setSelectedType] = useState('ALL');
  const [activeDiagram, setActiveDiagram] = useState(DIAGRAM_TEMPLATES[0]);

  useEffect(() => {
    api.getDiagrams().then((data) => {
      if (data && data.length > 0) {
        setDiagrams(data);
        setActiveDiagram(data[0]);
      }
    });
  }, []);

  const types = [
    { id: 'ALL', label: 'All Diagrams' },
    { id: 'timeline', label: 'Timelines' },
    { id: 'flowchart', label: 'Flowcharts' },
    { id: 'concept', label: 'Concept Maps' },
    { id: 'relationship', label: 'Character Maps' },
    { id: 'mindmap', label: 'Mind Maps' }
  ];

  const filtered = diagrams.filter((d) => {
    if (selectedType === 'ALL') return true;
    return d.type === selectedType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950 text-xs font-semibold text-gold-900 dark:text-gold-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Visual Theology Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          {t('diagrams')}
        </h1>
        <p className="text-sm text-muted-foreground">
          Interactive timelines, mindmaps, character relationship graphs, and theological flowcharts
        </p>
      </div>

      {/* Type Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {types.map((tp) => (
          <button
            key={tp.id}
            onClick={() => setSelectedType(tp.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-2xl border transition-all ${
              selectedType === tp.id
                ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 border-transparent shadow-md'
                : 'bg-card border-border hover:bg-muted text-muted-foreground'
            }`}
          >
            {tp.label}
          </button>
        ))}
      </div>

      {/* Diagram Selection & Live Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Diagram List Navigation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Available Models ({filtered.length})
          </h3>
          <div className="space-y-2">
            {filtered.map((item) => {
              const isSelected = activeDiagram?.id === item.id || activeDiagram?.diagramKey === item.id;
              const title = language === 'te' ? (item.titleTelugu || item.title || item.titleEn) : (item.title || item.titleEn);

              return (
                <div
                  key={item.id || item.diagramKey}
                  onClick={() => setActiveDiagram(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-900/10 dark:bg-gold-400/10 border-gold-400 shadow-md font-bold'
                      : 'bg-card border-border hover:border-gold-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={isSelected ? 'gold' : 'outline'} className="text-[10px] uppercase font-bold">
                      {item.type}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">{item.bookCode}</span>
                  </div>
                  <h4 className="font-serif text-sm text-foreground mt-2">{title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Interactive Renderer */}
        <div className="lg:col-span-2">
          {activeDiagram ? (
            <InteractiveDiagram diagram={activeDiagram} />
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              Select a diagram from the list to explore.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
