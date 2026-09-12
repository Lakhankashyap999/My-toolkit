'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Dumbbell, Mic, Compass, BookmarkCheck } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { progress } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;

  const tabs = [
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/practice', label: 'Practice', icon: Dumbbell },
    { href: '/speak', label: 'Speak', icon: Mic },
    { href: '/germany-life', label: 'Germany', icon: Compass },
    { href: '/vocab', label: 'Vocab', icon: BookmarkCheck },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-neutral-200/80 bg-white/95 backdrop-blur-lg dark:border-neutral-800/80 dark:bg-neutral-950/95 pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-rose-50 dark:bg-rose-950/60' : ''}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
