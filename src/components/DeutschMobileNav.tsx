'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Dumbbell, Mic, Compass, BookmarkCheck } from 'lucide-react';

export default function DeutschMobileNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/deutschready/learn', label: 'Learn', icon: BookOpen },
    { href: '/deutschready/practice', label: 'Practice', icon: Dumbbell },
    { href: '/deutschready/speak', label: 'Speak', icon: Mic },
    { href: '/deutschready/germany-life', label: 'Germany', icon: Compass },
    { href: '/deutschready/vocab', label: 'Vocab', icon: BookmarkCheck },
  ];

  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-neutral-200/90 bg-white/95 backdrop-blur-lg dark:border-neutral-800/90 dark:bg-neutral-950/95 pb-[max(env(safe-area-inset-bottom,0px),6px)] shadow-lg">
      <div className="flex h-16 items-center justify-around px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 min-w-[56px] min-h-[48px] rounded-2xl transition-all active:scale-95 ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-rose-50 dark:bg-rose-950/60' : ''}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
