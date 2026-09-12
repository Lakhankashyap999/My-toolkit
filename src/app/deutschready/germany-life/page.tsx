'use client';

import { useState, useEffect } from 'react';
import { Compass, Building, Train, ShoppingBag, Stethoscope, Briefcase } from 'lucide-react';
import { GERMANY_SCENARIOS } from '@/data/germanyScenarios';
import GermanyScenarioCard from '@/components/GermanyScenarioCard';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';

export default function GermanyLifePage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(GERMANY_SCENARIOS[0].id);
  const activeScenario = GERMANY_SCENARIOS.find((s) => s.id === selectedScenarioId) || GERMANY_SCENARIOS[0];

  const { recordActivity, progress } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;

  const categoryIcons: Record<string, typeof Building> = {
    anmeldung: Building,
    deutsche_bahn: Train,
    supermarkt: ShoppingBag,
    arzt: Stethoscope,
    wohnung: Building,
    job_interview: Briefcase,
  };

  useEffect(() => {
    if (activeScenario) {
      const isHinglish = progress.uiLanguage === 'hinglish';
      recordActivity({
        type: 'scenario',
        id: activeScenario.id,
        title: isHinglish ? activeScenario.titleHindi : activeScenario.title,
        detail: `${activeScenario.locationName} (${activeScenario.level})`,
        path: `/deutschready/germany-life`,
      });
    }
  }, [activeScenario, recordActivity, progress.uiLanguage]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <Compass className="h-3.5 w-3.5" />
          <span>{t.scenarios}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          {progress.uiLanguage === 'german'
            ? 'Praxistraining vor der Ankunft in Deutschland'
            : progress.uiLanguage === 'english'
            ? 'Practice Real Situations Before Arriving in Germany'
            : 'Germany Pahunchne Se Pehle Practice Karo'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {progress.uiLanguage === 'german'
            ? 'Meistern Sie Bürgeramt, Bahn, Supermarkt und Arztpraxis ohne Stress.'
            : progress.uiLanguage === 'english'
            ? 'Handle train stations, city registration, supermarkets, and doctor appointments with zero stress.'
            : 'Train station, city registration, supermarket aur doctor clinic ke practical situations bina kisi tension ke handle karna seekhein.'}
        </p>
      </div>

      {/* Scenario Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {GERMANY_SCENARIOS.map((sc) => {
          const Icon = categoryIcons[sc.category] || Compass;
          const isSelected = sc.id === selectedScenarioId;
          const title = progress.uiLanguage === 'hinglish' ? sc.titleHindi : sc.title;

          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold border transition-all active:scale-95 ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-md dark:border-white dark:bg-white dark:text-neutral-900'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Card */}
      <div>
        <GermanyScenarioCard key={activeScenario.id} scenario={activeScenario} />
      </div>
    </div>
  );
}
