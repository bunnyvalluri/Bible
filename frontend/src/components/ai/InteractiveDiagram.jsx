'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../ui/card';
import { Button } from '../ui/button';
import {
  GitGraph,
  Calendar,
  Layers,
  ArrowRight,
  Share2,
  Download,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function InteractiveDiagram({ diagram }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!diagram) return null;

  const data = typeof diagram.data === 'string' ? JSON.parse(diagram.data) : diagram.data || diagram;
  const nodes = data.nodes || [];
  const links = data.links || [];

  return (
    <Card className="border-border overflow-hidden shadow-lg bg-card">
      <CardHeader className="bg-muted/40 border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="gold" className="uppercase text-[10px] tracking-wider font-bold">
                {diagram.type || 'Diagram'}
              </Badge>
              <span className="text-xs text-muted-foreground">{diagram.verses || diagram.bookCode}</span>
            </div>
            <CardTitle className="text-xl font-serif mt-1 text-primary-950 dark:text-gold-200">
              {diagram.title || diagram.titleEn}
            </CardTitle>
            {diagram.titleTelugu && (
              <p className="text-xs text-muted-foreground font-telugu mt-0.5">{diagram.titleTelugu}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => alert('Diagram saved to clipboard.')}
            >
              <Share2 className="w-3.5 h-3.5 mr-1" />
              Share
            </Button>
          </div>
        </div>
        {diagram.description && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {diagram.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Render Type 1: Timeline */}
        {diagram.type === 'timeline' && (
          <div className="relative pl-6 border-l-2 border-gold-400/40 space-y-6 my-2">
            {nodes.map((node, i) => (
              <div
                key={node.id || i}
                onClick={() => setSelectedNode(node)}
                className={`relative group cursor-pointer p-4 rounded-xl transition-all border ${
                  selectedNode?.id === node.id
                    ? 'bg-gold-50 dark:bg-gold-950/30 border-gold-400 shadow-md'
                    : 'bg-card hover:bg-muted/40 border-border'
                }`}
              >
                {/* Timeline Pin */}
                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-gold-400 border-2 border-background flex items-center justify-center text-[10px] text-primary-950 font-bold">
                  {i + 1}
                </div>

                <h4 className="font-bold text-sm text-foreground group-hover:text-gold-600 transition-colors">
                  {node.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Render Type 2: Flowchart */}
        {diagram.type === 'flowchart' && (
          <div className="space-y-4">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id || i}>
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedNode?.id === node.id
                      ? 'bg-primary-900/10 dark:bg-gold-400/10 border-gold-400 shadow-md'
                      : 'bg-card border-border hover:border-gold-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {node.step || i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{node.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{node.desc}</p>
                    </div>
                  </div>
                </div>

                {i < nodes.length - 1 && (
                  <div className="flex justify-center">
                    <div className="p-1 rounded-full bg-gold-100 dark:bg-gold-950/80 text-gold-600 border border-gold-300 dark:border-gold-800">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Render Type 3: Concept & Armor */}
        {(diagram.type === 'concept' || diagram.type === 'relationship' || diagram.type === 'mindmap') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node, i) => (
              <div
                key={node.id || i}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedNode?.id === node.id
                    ? 'bg-gold-50 dark:bg-gold-950/30 border-gold-400 shadow-md'
                    : 'bg-card border-border hover:border-gold-400/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-foreground">{node.title}</h4>
                  {node.category && (
                    <Badge variant="outline" className="text-[10px]">
                      {node.category}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Relationship Links */}
        {links && links.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Theological Dynamic Links
            </h5>
            <div className="space-y-2">
              {links.map((link, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs p-2.5 rounded-lg bg-muted/40 border border-border">
                  <span className="font-semibold text-primary-900 dark:text-gold-300 capitalize">{link.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
                  <span className="font-semibold text-primary-900 dark:text-gold-300 capitalize">{link.target}</span>
                  <span className="text-muted-foreground ml-2">({link.label})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
