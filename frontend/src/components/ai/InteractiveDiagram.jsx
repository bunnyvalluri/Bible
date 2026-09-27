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
    <Card className="border-[#E5E7EB] overflow-hidden shadow-sm bg-white">
      <CardHeader className="bg-[#F8FAFC] border-b border-[#E5E7EB] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="gold" className="uppercase text-[10px] tracking-wider font-bold">
                {diagram.type || 'Diagram'}
              </Badge>
              <span className="text-xs text-[#737373]">{diagram.verses || diagram.bookCode}</span>
            </div>
            <CardTitle className="text-xl font-serif mt-1 text-[#163A5F]">
              {diagram.title || diagram.titleEn}
            </CardTitle>
            {diagram.titleTelugu && (
              <p className="text-xs text-[#737373] font-telugu mt-0.5">{diagram.titleTelugu}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-[#E5E7EB] text-[#171717] bg-white hover:bg-slate-50"
              onClick={() => alert('Diagram saved to clipboard.')}
            >
              <Share2 className="w-3.5 h-3.5 mr-1 text-[#163A5F]" />
              Share
            </Button>
          </div>
        </div>
        {diagram.description && (
          <p className="text-xs text-[#525252] mt-2 leading-relaxed">
            {diagram.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6 bg-white">
        {/* Render Type 1: Timeline */}
        {diagram.type === 'timeline' && (
          <div className="relative pl-6 border-l-2 border-gold-400 space-y-6 my-2">
            {nodes.map((node, i) => (
              <div
                key={node.id || i}
                onClick={() => setSelectedNode(node)}
                className={`relative group cursor-pointer p-4 rounded-xl transition-all border ${
                  selectedNode?.id === node.id
                    ? 'bg-[#FEFCE8] border-gold-400 shadow-sm'
                    : 'bg-white hover:bg-[#F8FAFC] border-[#E5E7EB]'
                }`}
              >
                {/* Timeline Pin */}
                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-gold-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  {i + 1}
                </div>

                <h4 className="font-bold text-sm text-[#171717] group-hover:text-gold-700 transition-colors">
                  {node.title}
                </h4>
                <p className="text-xs text-[#525252] mt-1 leading-relaxed">
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
                      ? 'bg-[#EFF6FF] border-[#2563EB] shadow-sm'
                      : 'bg-white border-[#E5E7EB] hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-[#163A5F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {node.step || i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-[#171717]">{node.title}</h4>
                      <p className="text-xs text-[#525252] mt-0.5">{node.desc}</p>
                    </div>
                  </div>
                </div>

                {i < nodes.length - 1 && (
                  <div className="flex justify-center">
                    <div className="p-1 rounded-full bg-gold-100 text-gold-700 border border-gold-300">
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
                    ? 'bg-[#FEFCE8] border-gold-400 shadow-sm'
                    : 'bg-white border-[#E5E7EB] hover:border-gold-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-[#171717]">{node.title}</h4>
                  {node.category && (
                    <Badge variant="outline" className="text-[10px] bg-white border-[#E5E7EB] text-[#525252]">
                      {node.category}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#525252] mt-2 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Relationship Links */}
        {links && links.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-3">
              Theological Dynamic Links
            </h5>
            <div className="space-y-2">
              {links.map((link, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                  <span className="font-semibold text-[#163A5F] capitalize">{link.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-600" />
                  <span className="font-semibold text-[#163A5F] capitalize">{link.target}</span>
                  <span className="text-[#737373] ml-2">({link.label})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
