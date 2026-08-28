// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function BmiCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState<number | string>(175);
  const [heightFt, setHeightFt] = useState<number | string>(5);
  const [heightIn, setHeightIn] = useState<number | string>(9);
  const [weightKg, setWeightKg] = useState<number | string>(70);
  const [weightLbs, setWeightLbs] = useState<number | string>(154);
  const [age, setAge] = useState<number | string>(25);
  const [gender, setGender] = useState<"male" | "female">("male");

  const results = useMemo(() => {
    let hMeters = 0;
    let wKg = 0;

    if (unitSystem === "metric") {
      hMeters = (Number(heightCm) || 0) / 100;
      wKg = Number(weightKg) || 0;
    } else {
      const totalInches = (Number(heightFt) || 0) * 12 + (Number(heightIn) || 0);
      hMeters = totalInches * 0.0254;
      wKg = (Number(weightLbs) || 0) * 0.453592;
    }

    if (hMeters <= 0 || wKg <= 0) return null;

    const bmi = Number((wKg / (hMeters * hMeters)).toFixed(1));

    let category = "Normal weight";
    let color = "text-emerald-500";
    let pct = 50;

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-sky-500";
      pct = Math.max(10, (bmi / 18.5) * 25);
    } else if (bmi <= 24.9) {
      category = "Normal (Healthy)";
      color = "text-emerald-500";
      pct = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
    } else if (bmi <= 29.9) {
      category = "Overweight";
      color = "text-amber-500";
      pct = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
    } else {
      category = "Obesity Range";
      color = "text-rose-500";
      pct = Math.min(100, 75 + ((bmi - 30) / 10) * 25);
    }

    const minHealthyKg = (18.5 * (hMeters * hMeters)).toFixed(1);
    const maxHealthyKg = (24.9 * (hMeters * hMeters)).toFixed(1);

    const userAge = Number(age) || 25;
    let bmr = 10 * wKg + 6.25 * (hMeters * 100) - 5 * userAge;
    bmr += gender === "male" ? 5 : -161;

    return {
      bmi,
      category,
      color,
      pct,
      minHealthyKg,
      maxHealthyKg,
      bmr: Math.round(bmr),
      maintenanceCalories: Math.round(bmr * 1.375),
    };
  }, [unitSystem, heightCm, heightFt, heightIn, weightKg, weightLbs, age, gender]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ⚕️ WHO Standard BMI Health Engine
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Health Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            BMI &amp; Ideal Weight Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Check your Body Mass Index (BMI), ideal healthy weight range, and daily maintenance calories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Select Unit System
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setUnitSystem("metric")}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    unitSystem === "metric" ? "bg-[#0071e3] text-white shadow" : "text-slate-500"
                  }`}
                >
                  Metric (cm / kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem("imperial")}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    unitSystem === "imperial" ? "bg-[#0071e3] text-white shadow" : "text-slate-500"
                  }`}
                >
                  Imperial (ft / lbs)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Height
              </label>
              {unitSystem === "metric" ? (
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">in</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                3. Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={unitSystem === "metric" ? weightKg : weightLbs}
                  onChange={(e) =>
                    unitSystem === "metric" ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)
                  }
                  className="w-full bg-slate-100 dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
                <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">
                  {unitSystem === "metric" ? "kg" : "lbs"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`py-1 rounded-lg text-xs font-bold ${gender === "male" ? "bg-[#0071e3] text-white" : "text-slate-400"}`}
                  >
                    ♂ Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`py-1 rounded-lg text-xs font-bold ${gender === "female" ? "bg-[#0071e3] text-white" : "text-slate-400"}`}
                  >
                    ♀ Female
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4">
            {results && (
              <>
                <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Your Body Mass Index (BMI)
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1">
                      {results.bmi}
                    </div>
                    <div className={`text-sm font-extrabold mt-1 ${results.color}`}>
                      {results.category}
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <div className="w-full h-3 bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500 rounded-full overflow-hidden" />
                    <div
                      className="absolute top-1 w-3 h-5 bg-slate-900 dark:bg-white rounded-full shadow -translate-x-1/2 border"
                      style={{ left: `${results.pct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-4 text-[10px] text-slate-400 font-bold pt-1">
                    <span>&lt; 18.5</span>
                    <span>18.5 - 24.9</span>
                    <span>25 - 29.9</span>
                    <span>30+</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2.5 text-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Health Recommendations
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span>Healthy Weight Range:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {results.minHealthyKg} kg - {results.maxHealthyKg} kg
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span>Basal Metabolic Rate (BMR):</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.bmr} kcal/day</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-600 dark:text-slate-400">
                    <span>Daily Maintenance Calories:</span>
                    <span className="font-bold text-[#0071e3]">{results.maintenanceCalories} kcal/day</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}