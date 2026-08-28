// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORIES = {
  length: {
    name: "Length & Distance",
    units: {
      meter: { name: "Meters (m)", factor: 1 },
      kilometer: { name: "Kilometers (km)", factor: 1000 },
      centimeter: { name: "Centimeters (cm)", factor: 0.01 },
      millimeter: { name: "Millimeters (mm)", factor: 0.001 },
      foot: { name: "Feet (ft)", factor: 0.3048 },
      inch: { name: "Inches (in)", factor: 0.0254 },
      yard: { name: "Yards (yd)", factor: 0.9144 },
      mile: { name: "Miles (mi)", factor: 1609.34 },
    },
  },
  weight: {
    name: "Weight & Mass",
    units: {
      kilogram: { name: "Kilograms (kg)", factor: 1 },
      gram: { name: "Grams (g)", factor: 0.001 },
      milligram: { name: "Milligrams (mg)", factor: 0.000001 },
      pound: { name: "Pounds (lbs)", factor: 0.453592 },
      ounce: { name: "Ounces (oz)", factor: 0.0283495 },
      quintal: { name: "Quintals (q)", factor: 100 },
      ton: { name: "Metric Tonnes (t)", factor: 1000 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { name: "Celsius (°C)" },
      fahrenheit: { name: "Fahrenheit (°F)" },
      kelvin: { name: "Kelvin (K)" },
    },
  },
  area: {
    name: "Area & Land",
    units: {
      sq_meter: { name: "Square Meters (m²)", factor: 1 },
      sq_foot: { name: "Square Feet (sq ft)", factor: 0.092903 },
      acre: { name: "Acres (ac)", factor: 4046.86 },
      hectare: { name: "Hectares (ha)", factor: 10000 },
      bigha: { name: "Bigha (Standard)", factor: 2500 },
      sq_yard: { name: "Gaj / Sq Yard", factor: 0.836127 },
    },
  },
  digital: {
    name: "Data Storage",
    units: {
      byte: { name: "Bytes (B)", factor: 1 },
      kb: { name: "Kilobytes (KB)", factor: 1024 },
      mb: { name: "Megabytes (MB)", factor: 1024 * 1024 },
      gb: { name: "Gigabytes (GB)", factor: 1024 * 1024 * 1024 },
      tb: { name: "Terabytes (TB)", factor: 1024 * 1024 * 1024 * 1024 },
    },
  },
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<keyof typeof CATEGORIES>("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [value, setValue] = useState<number | string>(10);

  const convertedValue = useMemo(() => {
    const raw = Number(value);
    if (isNaN(raw)) return 0;

    if (category === "temperature") {
      let c = raw;
      if (fromUnit === "fahrenheit") c = ((raw - 32) * 5) / 9;
      if (fromUnit === "kelvin") c = raw - 273.15;

      let result = c;
      if (toUnit === "fahrenheit") result = (c * 9) / 5 + 32;
      if (toUnit === "kelvin") result = c + 273.15;
      return Number(result.toFixed(4));
    }

    const currentCat = CATEGORIES[category];
    const fromFactor = (currentCat.units as any)[fromUnit]?.factor || 1;
    const toFactor = (currentCat.units as any)[toUnit]?.factor || 1;

    const baseVal = raw * fromFactor;
    const result = baseVal / toFactor;
    return Number(result.toFixed(6));
  }, [category, fromUnit, toUnit, value]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCategoryChange = (cat: keyof typeof CATEGORIES) => {
    setCategory(cat);
    const unitKeys = Object.keys(CATEGORIES[cat].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ⚖️ Accurate Real-Time Unit Converter
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Converter Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Universal Unit Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Convert length, land area (Acre/Bigha/Gaj), weight, temperature, and digital storage in real-time.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCategoryChange(key as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                category === key
                  ? "bg-[#0071e3] text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                From ({CATEGORIES[category].name})
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xl sm:text-2xl font-black outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none cursor-pointer"
              >
                {Object.entries(CATEGORIES[category].units).map(([uKey, uData]) => (
                  <option key={uKey} value={uKey}>
                    {uData.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={swapUnits}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#0071e3] hover:text-white flex items-center justify-center font-bold text-sm transition shadow-sm"
              >
                ⇄
              </button>
            </div>

            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                To Result
              </label>
              <div className="w-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 text-xl sm:text-2xl font-black text-[#0071e3] dark:text-blue-400 truncate">
                {convertedValue}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none cursor-pointer"
              >
                {Object.entries(CATEGORIES[category].units).map(([uKey, uData]) => (
                  <option key={uKey} value={uKey}>
                    {uData.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}