// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function CronJobTool() {
  const [cronExpression, setCronExpression] = useState<string>("*/15 * * * *");

  const presets = [
    { label: "Every 15 mins", exp: "*/15 * * * *" },
    { label: "Every 2 hours", exp: "0 */2 * * *" },
    { label: "Daily Midnight", exp: "0 0 * * *" },
    { label: "Every Monday 9 AM", exp: "0 9 * * 1" },
    { label: "Weekdays at 6 PM", exp: "0 18 * * 1-5" },
    { label: "1st of Every Month", exp: "0 0 1 * *" },
  ];

  const explanation = useMemo(() => {
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) return "Invalid cron format. Standard format requires exactly 5 parts: [min] [hour] [day-of-month] [month] [day-of-week]";

    const [min, hour, dom, mon, dow] = parts;

    if (cronExpression === "*/15 * * * *") return "Runs every 15 minutes of every hour, every day.";
    if (cronExpression === "0 */2 * * *") return "Runs at minute 0 past every 2nd hour, every day.";
    if (cronExpression === "0 0 * * *") return "Runs once a day at midnight (00:00 UTC).";
    if (cronExpression === "0 9 * * 1") return "Runs every Monday morning at 09:00 AM UTC.";
    if (cronExpression === "0 18 * * 1-5") return "Runs at 06:00 PM UTC, Monday through Friday.";
    if (cronExpression === "0 0 1 * *") return "Runs at midnight on the first day of every month.";

    return `Custom Cron: At minute ${min}, hour ${hour}, on day ${dom} of month ${mon}, weekday ${dow}.`;
  }, [cronExpression]);

  return (
    <div className="space-y-4">
      {/* Expression Input */}
      <div className="p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] space-y-2">
        <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">
          Cron Expression (5-part Unix standard)
        </label>
        <input
          type="text"
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          className="w-full p-3.5 bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 rounded-xl text-base font-mono font-bold text-[#0071e3]"
        />
      </div>

      {/* Human Meaning */}
      <div className="p-5 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-1">
        <span className="text-xs font-bold text-[#0071e3] dark:text-blue-400">Plain English Meaning:</span>
        <p className="text-base font-bold text-[#1d1d1f] dark:text-white">{explanation}</p>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#6e6e73] dark:text-white/60">Quick Schedule Presets:</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((item) => (
            <button
              key={item.label}
              onClick={() => setCronExpression(item.exp)}
              className="text-xs bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] text-[#1d1d1f] dark:text-white px-3.5 py-1.5 rounded-full font-mono font-medium transition-colors border border-black/5 dark:border-white/5"
            >
              {item.label} ({item.exp})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
