// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState<string>("2000-08-30");
  const [targetDate, setTargetDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const asOfDate = targetDate ? new Date(targetDate) : now;

    if (isNaN(birthDate.getTime()) || birthDate > asOfDate) {
      return null;
    }

    let years = asOfDate.getFullYear() - birthDate.getFullYear();
    let months = asOfDate.getMonth() - birthDate.getMonth();
    let days = asOfDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = asOfDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bornDay = daysOfWeek[birthDate.getDay()];

    let nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    const diffToNextBday = nextBday.getTime() - now.getTime();
    const nextBdayDays = Math.floor(diffToNextBday / (1000 * 60 * 60 * 24));
    const nextBdayHours = Math.floor((diffToNextBday / (1000 * 60 * 60)) % 24);
    const nextBdayMinutes = Math.floor((diffToNextBday / (1000 * 60)) % 60);
    const nextBdaySeconds = Math.floor((diffToNextBday / 1000) % 60);

    const m = birthDate.getMonth() + 1;
    const d = birthDate.getDate();
    let zodiac = "Virgo";
    let symbol = "♍";

    if ((m === 1 && d <= 19) || (m === 12 && d >= 22)) { zodiac = "Capricorn"; symbol = "♑"; }
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) { zodiac = "Aquarius"; symbol = "♒"; }
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) { zodiac = "Pisces"; symbol = "♓"; }
    else if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) { zodiac = "Aries"; symbol = "♈"; }
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) { zodiac = "Taurus"; symbol = "♉"; }
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) { zodiac = "Gemini"; symbol = "♊"; }
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) { zodiac = "Cancer"; symbol = "♋"; }
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) { zodiac = "Leo"; symbol = "♌"; }
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) { zodiac = "Virgo"; symbol = "♍"; }
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) { zodiac = "Libra"; symbol = "♎"; }
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) { zodiac = "Scorpio"; symbol = "♏"; }
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) { zodiac = "Sagittarius"; symbol = "♐"; }

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      bornDay,
      zodiac,
      symbol,
      nextBdayDays,
      nextBdayHours,
      nextBdayMinutes,
      nextBdaySeconds,
    };
  }, [dob, targetDate, now]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            🎂 Live Age &amp; Birthday Countdown
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Life Calculator
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Exact Age Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Find your exact age in years, months, days, hours, and get a live countdown to your next birthday!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Date of Birth (DOB)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Calculate Age As Of Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
              />
            </div>

            {stats && (
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Day Born:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">🗓️ {stats.bornDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Zodiac Sign:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{stats.symbol} {stats.zodiac}</span>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-6 space-y-4">
            {stats ? (
              <>
                <div className="bg-gradient-to-br from-[#0071e3] to-indigo-600 text-white rounded-3xl p-6 shadow-xl shadow-blue-500/20 text-center">
                  <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
                    Your Exact Age
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    {stats.years} <span className="text-lg font-bold opacity-90">Yrs</span>{" "}
                    {stats.months} <span className="text-lg font-bold opacity-90">Mos</span>{" "}
                    {stats.days} <span className="text-lg font-bold opacity-90">Days</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                  <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                    <span>🎂 Next Birthday Countdown</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl">
                      <div className="text-lg font-black text-slate-900 dark:text-white">{stats.nextBdayDays}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Days</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl">
                      <div className="text-lg font-black text-slate-900 dark:text-white">{stats.nextBdayHours}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Hours</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl">
                      <div className="text-lg font-black text-slate-900 dark:text-white">{stats.nextBdayMinutes}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Mins</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl">
                      <div className="text-lg font-black text-[#0071e3]">{stats.nextBdaySeconds}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Secs</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2.5 text-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Total Time Lived
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span>Total Weeks:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.totalWeeks.toLocaleString("en-IN")} Weeks</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span>Total Days:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.totalDays.toLocaleString("en-IN")} Days</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
                    <span>Total Minutes:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.totalMinutes.toLocaleString("en-IN")} Mins</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-[#0c1017] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                Please enter a valid Date of Birth.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}