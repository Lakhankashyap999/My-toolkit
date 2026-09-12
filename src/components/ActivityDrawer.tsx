'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  X,
  History,
  Clock,
  BookOpen,
  Compass,
  Dumbbell,
  Mic,
  Sparkles,
  ShieldCheck,
  LogOut,
  ExternalLink,
  UserCheck,
  Mail,
} from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';
import DeutschAuthModal from './DeutschAuthModal';

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityDrawer({ isOpen, onClose }: ActivityDrawerProps) {
  const { progress, logout } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  const history = progress.activityHistory || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case 'scenario':
        return <Compass className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'practice':
        return <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'speaking':
        return <Mic className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.round(diff / 60000);
    if (mins < 1) return 'Abhi-abhi (Just now)';
    if (mins < 60) return `${mins}m pehle`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h pehle`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] flex justify-end bg-black/50 backdrop-blur-xs">
        <div className="relative h-full w-full max-w-md bg-white shadow-2xl dark:bg-neutral-950 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-4 sm:p-6 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-base sm:text-lg">
              <History className="h-5 w-5 text-rose-600" />
              <span>{t.recentActivity}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Email / User Profile Card */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50">
            {progress.userEmail ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {progress.userEmail}
                      </span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Active & Synced" />
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold dark:text-emerald-400">
                      ✓ {t.verifiedWithEmail}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="rounded-xl p-2 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-4 text-center dark:border-rose-900/60 dark:bg-rose-950/20">
                <Mail className="mx-auto h-6 w-6 text-rose-500 mb-2" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Progress Save &amp; Sync Karein
                </h4>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  Toolbox email login se aapki saari activity real-time save hogi.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Email Verify Karein</span>
                </button>
              </div>
            )}
          </div>

          {/* Activity Timeline List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {history.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-400">
                <Clock className="mx-auto h-8 w-8 text-neutral-300 dark:text-neutral-700 mb-2" />
                <p>{t.noActivityYet}</p>
                <Link
                  href="/deutschready/learn"
                  onClick={onClose}
                  className="mt-3 inline-block font-bold text-rose-600 hover:underline"
                >
                  Lektionen starten ➔
                </Link>
              </div>
            ) : (
              history.map((act) => (
                <div
                  key={act.id}
                  className="group flex items-start justify-between gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-xs transition-all hover:border-neutral-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      {getActivityIcon(act.type)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                        {act.title}
                      </h5>
                      {act.detail && (
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          {act.detail}
                        </p>
                      )}
                      <span className="text-[10px] text-neutral-400">
                        {formatTimestamp(act.timestamp)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={act.path}
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-neutral-800 dark:hover:text-rose-400 transition-colors shrink-0"
                    title={t.revisit}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DeutschAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
