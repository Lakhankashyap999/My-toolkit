// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function MockDataTool() {
  const [mockCount, setMockCount] = useState<number>(10);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const generatedUsers = useMemo(() => {
    const firstNames = ["Lakhan", "Priya", "Aarav", "Ananya", "Rohit", "Deepika", "Rajesh", "Neha", "Vikram", "Pooja", "Arjun", "Kavita", "Sanjay", "Ritu", "Aditya"];
    const lastNames = ["Kashyap", "Sharma", "Patel", "Iyer", "Verma", "Nair", "Gupta", "Kulkarni", "Singh", "Deshmukh", "Reddy", "Mehta", "Bhatia", "Joshi", "Chauhan"];
    const cities = ["New Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Kolkata", "Chandigarh", "Chennai"];

    return Array.from({ length: mockCount }).map((_, i) => {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i > 10 ? i : ""}@example.com`;
      const phone = `+91 9${Math.floor(100000000 + (i * 739174) % 899999999)}`;
      const pan = `${ln.substring(0, 4).toUpperCase()}P${1000 + i}F`;
      const gstin = `07${pan}1Z5`;
      const city = cities[i % cities.length];

      return { id: i + 1, name, email, phone, pan, gstin, city };
    });
  }, [mockCount]);

  const downloadCsv = () => {
    const header = "id,name,email,phone,pan,gstin,city";
    const rows = generatedUsers.map((u) => `${u.id},"${u.name}","${u.email}","${u.phone}","${u.pan}","${u.gstin}","${u.city}"`);
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indian_mock_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">Quantity:</span>
          {[5, 10, 25, 50].map((num) => (
            <button
              key={num}
              onClick={() => setMockCount(num)}
              className={`text-xs px-3.5 py-1 rounded-full font-bold transition ${
                mockCount === num
                  ? "bg-[#0071e3] text-white"
                  : "bg-white dark:bg-white/10 text-[#6e6e73] dark:text-white/70"
              }`}
            >
              {num} Records
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCsv}
            className="text-[11px] font-bold text-[#0071e3] hover:underline"
          >
            ⬇️ Download CSV
          </button>
          <button
            onClick={() => copyToClipboard(JSON.stringify(generatedUsers, null, 2), "mock-copy")}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full font-bold shadow-sm"
          >
            {copiedKey === "mock-copy" ? "✓ Copied!" : "📋 Copy JSON Array"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-white/[0.02]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#f5f5f7] dark:bg-white/5 border-b border-black/[0.06] dark:border-white/[0.08] text-[#6e6e73] dark:text-white/60 font-bold">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">PAN</th>
              <th className="p-3">City</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {generatedUsers.map((u) => (
              <tr key={u.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                <td className="p-3 text-[#6e6e73]">{u.id}</td>
                <td className="p-3 font-bold text-[#1d1d1f] dark:text-white">{u.name}</td>
                <td className="p-3 text-[#6e6e73] dark:text-white/70">{u.email}</td>
                <td className="p-3 text-[#0071e3]">{u.phone}</td>
                <td className="p-3 text-amber-600 dark:text-amber-400 font-bold">{u.pan}</td>
                <td className="p-3 text-[#1d1d1f] dark:text-white">{u.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
