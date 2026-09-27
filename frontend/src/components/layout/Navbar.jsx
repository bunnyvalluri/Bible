'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  BookOpen,
  Search,
  Calendar,
  Bookmark,
  GitGraph,
  Palette,
  Headphones,
  Shield,
  Wifi,
  WifiOff,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navLinks = [
    { href: '/reader', label: t('read'), icon: BookOpen },
    { href: '/search', label: t('search'), icon: Search },
    { href: '/plans', label: t('plans'), icon: Calendar },
    { href: '/saved', label: t('saved'), icon: Bookmark },
    { href: '/diagrams', label: t('diagrams'), icon: GitGraph },
    { href: '/artwork', label: t('artwork'), icon: Palette },
    { href: '/audio', label: t('audio'), icon: Headphones },
    { href: '/admin', label: t('admin'), icon: Shield }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#163A5F] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-[#163A5F] font-serif">
              వచనం • Vachanam
            </span>
            <span className="text-[10px] text-[#737373] font-medium uppercase tracking-wider">
              {language === 'te' ? 'పరిశుద్ధ గ్రంథము' : language === 'hi' ? 'पवित्र बाइबिल' : 'Holy Bible Engine'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#163A5F]/10 text-[#163A5F] font-semibold'
                    : 'text-[#525252] hover:text-[#171717] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#163A5F]' : 'text-[#737373]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Online Status & Language Switcher */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Offline / Online indicator */}
          <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#525252]" title={isOnline ? 'Online' : 'Offline PWA Active'}>
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline text-[11px] font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium text-amber-600">Offline</span>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#F8FAFC] rounded-xl p-0.5 border border-[#E5E7EB]">
            <button
              onClick={() => setLanguage('te')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'te'
                  ? 'bg-[#163A5F] text-white font-bold shadow-sm'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-[#163A5F] text-white font-bold shadow-sm'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'hi'
                  ? 'bg-[#163A5F] text-white font-bold shadow-sm'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => setLanguage(language === 'te' ? 'en' : language === 'en' ? 'hi' : 'te')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#F8FAFC] text-[#163A5F] border border-[#E5E7EB]"
          >
            {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिंदी' : 'EN'}
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-[#171717]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-[#163A5F] text-white font-bold'
                      : 'bg-[#F8FAFC] text-[#171717] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
