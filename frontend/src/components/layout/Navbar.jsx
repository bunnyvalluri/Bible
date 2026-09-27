'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useTheme } from 'next-themes';
import {
  BookOpen,
  Search,
  Calendar,
  Bookmark,
  GitGraph,
  Palette,
  Headphones,
  Shield,
  Sun,
  Moon,
  Globe,
  Wifi,
  WifiOff,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-900 to-primary-700 dark:from-gold-600 dark:to-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-gold-300 dark:text-primary-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-primary-900 dark:text-gold-300 font-serif">
              వచనం • Vachanam
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {language === 'te' ? 'పరిశుద్ధ గ్రంథము' : language === 'hi' ? 'पवित्र बाइबिल' : 'Holy Bible Engine'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-900/10 dark:bg-gold-400/15 text-primary-900 dark:text-gold-300 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-500 dark:text-gold-400' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Language, Theme, Status */}
        <div className="hidden sm:flex items-center space-x-2">
          {/* Offline / Online indicator */}
          <div className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-muted/70 text-muted-foreground" title={isOnline ? 'Online' : 'Offline PWA Active'}>
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline text-[11px] font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Offline</span>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-muted/80 rounded-xl p-0.5 border border-border">
            <button
              onClick={() => setLanguage('te')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'te'
                  ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'hi'
                  ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Theme Switcher */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl w-9 h-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-gold-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary-900" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          {/* Mobile Language button */}
          <button
            onClick={() => setLanguage(language === 'te' ? 'en' : language === 'en' ? 'hi' : 'te')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-muted text-primary-900 dark:text-gold-300 border border-border"
          >
            {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिंदी' : 'EN'}
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4">
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
                      ? 'bg-primary-900 text-white dark:bg-gold-400 dark:text-primary-950 font-bold'
                      : 'bg-muted/40 text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border mt-3">
            <span className="text-xs text-muted-foreground">Appearance</span>
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center space-x-2"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Night Theme'}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
