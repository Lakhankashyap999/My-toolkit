// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProGate from "../../components/ProGate";

export default function InvoiceGeneratorPage() {
  const [invoiceNo, setInvoiceNo] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [businessName, setBusinessName] = useState("ToolBox Solutions Pvt Ltd");
  const [businessGst, setBusinessGst] = useState("07AAAAA0000A1Z5");
  const [clientName, setClientName] = useState("Acme Global Corp");
  const [clientEmail, setClientEmail] = useState("billing@acme.com");

  const [items, setItems] = useState([
    { desc: "Software Development & Architecture", qty: 1, rate: 25000 },
    { desc: "Cloud Hosting & DevOps Setup", qty: 1, rate: 8000 },
  ]);

  const [gstPercent, setGstPercent] = useState(18);
  const [notes, setNotes] = useState("Thank you for your business! Payment due within 15 days.");

  const addItem = () => {
    setItems((prev) => [...prev, { desc: "New Service / Item", qty: 1, rate: 1000 }]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
    const gstAmount = (subtotal * gstPercent) / 100;
    const grandTotal = subtotal + gstAmount;
    return { subtotal, gstAmount, grandTotal };
  }, [items, gstPercent]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <ProGate>
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
        <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40 print:hidden">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
              ← Back to ToolBox
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={printInvoice}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-blue-500/20"
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 pt-8">
          <div className="text-center mb-8 print:hidden">
            <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
              Pro Billing
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Professional GST Invoice Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
              Create GST-compliant invoices, automatically calculate taxes, and print or download high-res PDF invoices.
            </p>
          </div>

          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#0071e3]">INVOICE</div>
                <div className="text-xs font-mono font-bold text-slate-400 mt-0.5">#{invoiceNo}</div>
              </div>
              <div className="text-left sm:text-right space-y-1">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="font-extrabold text-sm sm:text-base border-b border-transparent hover:border-slate-300 outline-none text-left sm:text-right"
                />
                <div className="text-xs text-slate-500">GSTIN: {businessGst}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bill To:</span>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Business Name"
                  className="w-full font-bold text-slate-900 border-b border-transparent hover:border-slate-300 outline-none"
                />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Client Email"
                  className="w-full text-slate-500 border-b border-transparent hover:border-slate-300 outline-none"
                />
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Details:</span>
                <div className="flex sm:justify-end gap-2">
                  <span className="text-slate-400">Date:</span>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 w-16 text-center">Qty</th>
                    <th className="py-2 w-28 text-right">Rate (₹)</th>
                    <th className="py-2 w-28 text-right">Amount (₹)</th>
                    <th className="py-2 w-8 print:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5">
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => updateItem(idx, "desc", e.target.value)}
                          className="w-full font-semibold border-b border-transparent hover:border-slate-300 outline-none"
                        />
                      </td>
                      <td className="py-2.5 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(idx, "qty", Number(e.target.value))}
                          className="w-12 text-center font-bold border rounded outline-none"
                        />
                      </td>
                      <td className="py-2.5 text-right">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(idx, "rate", Number(e.target.value))}
                          className="w-24 text-right font-bold border rounded px-1 outline-none"
                        />
                      </td>
                      <td className="py-2.5 text-right font-bold font-mono">
                        {formatCurrency((item.qty || 0) * (item.rate || 0))}
                      </td>
                      <td className="py-2.5 text-right print:hidden">
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 font-bold">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="text-xs font-bold text-[#0071e3] hover:underline print:hidden flex items-center gap-1"
            >
              + Add Line Item
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t gap-4">
              <div className="w-full sm:w-1/2 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Notes:</span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs text-slate-600 border border-slate-200 rounded-xl p-2.5 outline-none resize-none"
                />
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 items-center">
                  <span>GST ({gstPercent}%):</span>
                  <span className="font-bold text-emerald-600">+{formatCurrency(totals.gstAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-black border-t-2 border-slate-900 pt-2 text-[#0071e3]">
                  <span>Total Due:</span>
                  <span>{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProGate>
  );
}