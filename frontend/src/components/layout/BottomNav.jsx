'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  BookOpen,
  Search,
  Calendar,
  Bookmark,
  GitGraph
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const items = [
    { href: '/reader', label: t('read'), icon: BookOpen },
    { href: '/search', label: t('search'), icon: Search },
    { href: '/diagrams', label: t('diagrams'), icon: GitGraph },
    { href: '/plans', label: t('plans'), icon: Calendar },
    { href: '/saved', label: t('saved'), icon: Bookmark }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-[0_-2px_10px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 transition-colors relative ${
                isActive ? 'text-[#163A5F]' : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              {/* Gold active top indicator pill */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#C9A227] rounded-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#163A5F] stroke-[2.25]' : 'text-[#737373]'}`} />
              <span className={`text-[10px] mt-1 truncate max-w-full font-sans ${isActive ? 'font-bold text-[#163A5F]' : 'font-medium text-[#737373]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
