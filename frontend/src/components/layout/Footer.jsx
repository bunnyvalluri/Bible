'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { BookOpen, Sparkles, Globe } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F8FAFC] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-gold-300/40 bg-white flex items-center justify-center">
                <img src="/logo.png" alt="Vachanam Emblem" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#163A5F]">
                వచనం • Vachanam • वचन
              </span>
            </div>
            <p className="text-sm text-[#525252] max-w-md leading-relaxed">
              An enterprise-grade multilingual digital Bible platform engineered for churches, theology students, pastors, families, and youth. Seamlessly blending reverent printed typography with advanced AI verse explanations, visual learning diagrams, audio, and offline reading.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#C9A227] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Publicly Accessible • 100% Free • No Login Required</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-3">
              Scripture Tools
            </h4>
            <ul className="space-y-2 text-sm text-[#525252]">
              <li><Link href="/reader" className="hover:text-[#163A5F] transition-colors">Bible Reader</Link></li>
              <li><Link href="/search" className="hover:text-[#163A5F] transition-colors">Multilingual Search</Link></li>
              <li><Link href="/diagrams" className="hover:text-[#163A5F] transition-colors">Visual Diagrams</Link></li>
              <li><Link href="/artwork" className="hover:text-[#163A5F] transition-colors">Verse Artwork Studio</Link></li>
              <li><Link href="/audio" className="hover:text-[#163A5F] transition-colors">Audio Bible</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-3">
              Spiritual Growth
            </h4>
            <ul className="space-y-2 text-sm text-[#525252]">
              <li><Link href="/plans" className="hover:text-[#163A5F] transition-colors">30-Day Gospel Journey</Link></li>
              <li><Link href="/plans" className="hover:text-[#163A5F] transition-colors">90-Day Wisdom & Psalms</Link></li>
              <li><Link href="/plans" className="hover:text-[#163A5F] transition-colors">One-Year Bible</Link></li>
              <li><Link href="/saved" className="hover:text-[#163A5F] transition-colors">My Bookmarks & Notes</Link></li>
              <li><Link href="/admin" className="hover:text-[#163A5F] transition-colors">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] space-y-4 sm:space-y-0">
          <p suppressHydrationWarning>© 2026 Vachanam Bible Engine. Built for the glory of God.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Telugu • English • Hindi</span>
            </span>
            <span>•</span>
            <span>PWA & Offline Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
