import type { Metadata } from 'next';
import DeutschNavbar from '@/components/DeutschNavbar';
import DeutschMobileNav from '@/components/DeutschMobileNav';
import ResumeBanner from '@/components/ResumeBanner';

export const metadata: Metadata = {
  title: 'DeutschReady — AI German Learning Platform | MyToolboxs',
  description: 'Master German from A0 to B2 with 10-level AI progressive doubt ladder, slow 0.75x audio, Der/Die/Das trainer, and Germany life simulators.',
};

export default function DeutschReadyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 font-sans selection:bg-rose-500 selection:text-white">
      <DeutschNavbar />
      <main className="flex-1 pb-20 lg:pb-12">
        {children}
      </main>
      <ResumeBanner />
      <DeutschMobileNav />
    </div>
  );
}
