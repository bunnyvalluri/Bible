'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  // Primary navigation (visible directly on desktop)
  const primaryLinks = [
    { href: '/reader', label: t('read'), icon: BookOpen },
    { href: '/search', label: t('search'), icon: Search },
    { href: '/plans', label: t('plans'), icon: Calendar },
    { href: '/audio', label: t('audio'), icon: Headphones }
  ];

  // Secondary tools (in More dropdown on desktop)
  const secondaryLinks = [
    {
      href: '/diagrams',
      label: t('diagrams'),
      desc: language === 'te' ? 'AI దృశ్య చిత్రపటములు' : language === 'hi' ? 'दृश्य रूपरेखा' : 'Theological Diagrams',
      icon: GitGraph
    },
    {
      href: '/artwork',
      label: t('artwork'),
      desc: language === 'te' ? 'వాక్య చిత్ర స్టూడియో' : language === 'hi' ? 'वचन चित्रशाला' : 'Verse Art Studio',
      icon: Palette
    },
    {
      href: '/saved',
      label: t('saved'),
      desc: language === 'te' ? 'బుక్‌మార్క్‌లు & నోట్స్' : language === 'hi' ? 'बुकमार्क और नोट्स' : 'Bookmarks & Notes',
      icon: Bookmark
    },
    {
      href: '/admin',
      label: t('admin'),
      desc: language === 'te' ? 'నిర్వాహణ వ్యవస్థ' : language === 'hi' ? 'प्रशासन कक्ष' : 'Admin & Automation',
      icon: Shield
    }
  ];

  const allNavLinks = [...primaryLinks, ...secondaryLinks];

  const isMoreActive = secondaryLinks.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#163A5F] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A227]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg leading-tight tracking-tight text-[#163A5F] font-serif whitespace-nowrap">
              వచనం <span className="font-sans font-semibold text-xs sm:text-sm text-[#737373]">• Vachanam</span>
            </span>
            <span className="text-[10px] text-[#737373] font-medium tracking-wide whitespace-nowrap">
              {language === 'te' ? 'పరిశుద్ధ గ్రంథము' : language === 'hi' ? 'पवित्र बाइबिल' : 'Holy Bible Engine'}
            </span>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
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

          {/* More Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isMoreActive
                  ? 'bg-[#163A5F]/10 text-[#163A5F] font-semibold'
                  : 'text-[#525252] hover:text-[#171717] hover:bg-[#F8FAFC]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              <span>{t('more_tools')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-2 space-y-1 animate-in fade-in zoom-in-95 z-50">
                {secondaryLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#163A5F]/10 text-[#163A5F]'
                          : 'hover:bg-[#F8FAFC] text-[#171717]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-[#163A5F] text-white' : 'bg-[#F8FAFC] text-[#163A5F]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight">{item.label}</span>
                        <span className="text-xs text-[#737373] mt-0.5">{item.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Online Status & Language Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Offline / Online indicator (desktop) */}
          <div className="hidden sm:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#525252]" title={isOnline ? 'Online' : 'Offline PWA Active'}>
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium text-amber-600">Offline</span>
              </>
            )}
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-[#F8FAFC] rounded-xl p-0.5 border border-[#E5E7EB] shadow-inner">
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
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
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

          {/* Mobile menu hamburger toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-[#171717] hover:bg-[#F8FAFC]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {allNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#163A5F] text-white font-bold shadow-sm'
                      : 'bg-[#F8FAFC] text-[#171717] hover:bg-[#F1F5F9] border border-[#E5E7EB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C9A227]' : 'text-[#163A5F]'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
