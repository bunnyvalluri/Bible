'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { BookOpen, Heart, Shield, Sparkles, Globe, Download } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary-900 dark:bg-gold-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-gold-300 dark:text-primary-950" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-primary-900 dark:text-gold-300">
                వచనం • Vachanam • वचन
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              An enterprise-grade multilingual digital Bible platform engineered for churches, theology students, pastors, families, and youth. Seamlessly blending reverent printed typography with advanced AI verse explanations, visual learning diagrams, audio, and offline reading.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gold-600 dark:text-gold-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Publicly Accessible • 100% Free • No Login Required</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Scripture Tools
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/reader" className="hover:text-gold-600 transition-colors">Bible Reader</Link></li>
              <li><Link href="/search" className="hover:text-gold-600 transition-colors">Multilingual Search</Link></li>
              <li><Link href="/diagrams" className="hover:text-gold-600 transition-colors">Visual Diagrams</Link></li>
              <li><Link href="/artwork" className="hover:text-gold-600 transition-colors">Verse Artwork Studio</Link></li>
              <li><Link href="/audio" className="hover:text-gold-600 transition-colors">Audio Bible</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Spiritual Growth
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/plans" className="hover:text-gold-600 transition-colors">30-Day Gospel Journey</Link></li>
              <li><Link href="/plans" className="hover:text-gold-600 transition-colors">90-Day Wisdom & Psalms</Link></li>
              <li><Link href="/plans" className="hover:text-gold-600 transition-colors">One-Year Bible</Link></li>
              <li><Link href="/saved" className="hover:text-gold-600 transition-colors">My Bookmarks & Notes</Link></li>
              <li><Link href="/admin" className="hover:text-gold-600 transition-colors">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Vachanam Bible Engine. Built for the glory of God and the edification of the Church.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-gold-500" />
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
