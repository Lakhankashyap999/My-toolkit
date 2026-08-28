// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProGate from "../../components/ProGate";
import AuthGate from "../../components/AuthGate";

export default function TaxSuitePage() {
  const [activeTab, setActiveTab] = useState<
    "regime" | "capitalgains" | "advancetax" | "gst" | "tds" | "depreciation" | "ratios" | "num2words"
  >("regime");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showClientProfileBar, setShowClientProfileBar] = useState(true);

  // Client Details for Master Dashboard, Official Memo & Excel Export
  const [clientInfo, setClientInfo] = useState({
    name: "M/s Sharma Enterprises",
    pan: "AAACS1234F",
    gstin: "27AAACS1234F1Z5",
    caFirm: "Kashyap & Associates, Chartered Accountants",
    caMembership: "M.No. 543210",
    udin: "25543210AAAAAA1234",
    date: new Date().toISOString().split("T")[0],
    assessmentYear: "2025-26",
    financialYear: "2024-25",
    status: "Individual (< 60 Yrs)",
  });

  /* ========================================================================== */
  /*  MODULE 1: OLD VS NEW REGIME + SURCHARGE & MARGINAL RELIEF (AY 2025-26)   */
  /* ========================================================================== */
  const [grossSalary, setGrossSalary] = useState<number | string>(1500000);
  const [otherIncome, setOtherIncome] = useState<number | string>(50000);
  const [ageCategory, setAgeCategory] = useState<"general" | "senior" | "superSenior">("general");

  // Deductions under Old Regime
  const [sec80C, setSec80C] = useState<number | string>(150000);
  const [sec80CCD1B, setSec80CCD1B] = useState<number | string>(50000); // NPS
  const [sec80D_Self, setSec80D_Self] = useState<number | string>(25000);
  const [sec80D_Parents, setSec80D_Parents] = useState<number | string>(50000);
  const [hraExemption, setHraExemption] = useState<number | string>(120000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number | string>(200000);
  const [sec80E, setSec80E] = useState<number | string>(0); // Edu loan
  const [sec80G, setSec80G] = useState<number | string>(0); // Donations
  const [sec80TTA, setSec80TTA] = useState<number | string>(10000); // Savings interest

  const regimeCalculation = useMemo(() => {
    const gross = (Number(grossSalary) || 0) + (Number(otherIncome) || 0);

    // --- NEW REGIME (Budget 2024 Slabs) ---
    const stdDedNew = 75000;
    const taxableNew = Math.max(0, gross - stdDedNew);

    let baseTaxNew = 0;
    if (taxableNew <= 300000) {
      baseTaxNew = 0;
    } else if (taxableNew <= 700000) {
      baseTaxNew = (taxableNew - 300000) * 0.05;
    } else if (taxableNew <= 1000000) {
      baseTaxNew = 400000 * 0.05 + (taxableNew - 700000) * 0.1;
    } else if (taxableNew <= 1200000) {
      baseTaxNew = 400000 * 0.05 + 300000 * 0.1 + (taxableNew - 1000000) * 0.15;
    } else if (taxableNew <= 1500000) {
      baseTaxNew = 400000 * 0.05 + 300000 * 0.1 + 200000 * 0.15 + (taxableNew - 1200000) * 0.2;
    } else {
      baseTaxNew = 400000 * 0.05 + 300000 * 0.1 + 200000 * 0.15 + 300000 * 0.2 + (taxableNew - 1500000) * 0.3;
    }

    // Section 87A Rebate New Regime (Up to 7L taxable = 0 tax)
    let rebateNew = 0;
    if (taxableNew <= 700000) {
      rebateNew = baseTaxNew;
      baseTaxNew = 0;
    }

    // Surcharge New Regime
    let surchargeNew = 0;
    if (taxableNew > 20000000) surchargeNew = baseTaxNew * 0.25;
    else if (taxableNew > 10000000) surchargeNew = baseTaxNew * 0.15;
    else if (taxableNew > 5000000) surchargeNew = baseTaxNew * 0.1;

    const cessNew = (baseTaxNew + surchargeNew) * 0.04;
    const totalTaxNew = Math.round(baseTaxNew + surchargeNew + cessNew);

    // --- OLD REGIME ---
    const stdDedOld = 50000;
    const ded80C = Math.min(150000, Number(sec80C) || 0);
    const dedNPS = Math.min(50000, Number(sec80CCD1B) || 0);
    const ded80D = Math.min(50000, Number(sec80D_Self) || 0) + Math.min(50000, Number(sec80D_Parents) || 0);
    const dedHRA = Number(hraExemption) || 0;
    const dedHomeLoan = Math.min(200000, Number(homeLoanInterest) || 0);
    const ded80E = Number(sec80E) || 0;
    const ded80G = Number(sec80G) || 0;
    const ded80TTA = Math.min(ageCategory === "senior" ? 50000 : 10000, Number(sec80TTA) || 0);

    const totalOldDeductions = stdDedOld + ded80C + dedNPS + ded80D + dedHRA + dedHomeLoan + ded80E + ded80G + ded80TTA;
    const taxableOld = Math.max(0, gross - totalOldDeductions);

    // Exemption limit by age
    let basicExemption = 250000;
    if (ageCategory === "senior") basicExemption = 300000;
    if (ageCategory === "superSenior") basicExemption = 500000;

    let baseTaxOld = 0;
    if (taxableOld <= basicExemption) {
      baseTaxOld = 0;
    } else if (taxableOld <= 500000) {
      baseTaxOld = (taxableOld - basicExemption) * 0.05;
    } else if (taxableOld <= 1000000) {
      baseTaxOld = (500000 - basicExemption) * 0.05 + (taxableOld - 500000) * 0.2;
    } else {
      baseTaxOld = (500000 - basicExemption) * 0.05 + 500000 * 0.2 + (taxableOld - 1000000) * 0.3;
    }

    // Section 87A Rebate Old Regime (Up to 5L taxable = max 12.5k)
    let rebateOld = 0;
    if (taxableOld <= 500000) {
      rebateOld = baseTaxOld;
      baseTaxOld = 0;
    }

    // Surcharge Old Regime
    let surchargeOld = 0;
    if (taxableOld > 50000000) surchargeOld = baseTaxOld * 0.37;
    else if (taxableOld > 20000000) surchargeOld = baseTaxOld * 0.25;
    else if (taxableOld > 10000000) surchargeOld = baseTaxOld * 0.15;
    else if (taxableOld > 5000000) surchargeOld = baseTaxOld * 0.1;

    const cessOld = (baseTaxOld + surchargeOld) * 0.04;
    const totalTaxOld = Math.round(baseTaxOld + surchargeOld + cessOld);

    const diff = totalTaxOld - totalTaxNew;
    const betterRegime = diff > 0 ? "New Regime" : diff < 0 ? "Old Regime" : "Both Equal";
    const savings = Math.abs(diff);

    return {
      gross,
      taxableNew,
      baseTaxNew,
      rebateNew,
      surchargeNew,
      cessNew,
      totalTaxNew,
      taxableOld,
      baseTaxOld,
      rebateOld,
      surchargeOld,
      cessOld,
      totalTaxOld,
      totalOldDeductions,
      betterRegime,
      savings,
    };
  }, [
    grossSalary,
    otherIncome,
    ageCategory,
    sec80C,
    sec80CCD1B,
    sec80D_Self,
    sec80D_Parents,
    hraExemption,
    homeLoanInterest,
    sec80E,
    sec80G,
    sec80TTA,
  ]);

  /* ========================================================================== */
  /*  MODULE 2: CAPITAL GAINS ENGINE (BUDGET 2024 AMENDMENTS)                   */
  /* ========================================================================== */
  const [stcgEquity, setStcgEquity] = useState<number | string>(100000); // 20%
  const [ltcgEquity, setLtcgEquity] = useState<number | string>(250000); // 12.5% above 1.25L
  const [ltcgProperty, setLtcgProperty] = useState<number | string>(500000); // 12.5%

  const capitalGainsCalculation = useMemo(() => {
    const stcgEq = Number(stcgEquity) || 0;
    const ltcgEq = Number(ltcgEquity) || 0;
    const ltcgProp = Number(ltcgProperty) || 0;

    const taxStcgEq = stcgEq * 0.2;
    const taxableLtcgEq = Math.max(0, ltcgEq - 125000);
    const taxLtcgEq = taxableLtcgEq * 0.125;
    const taxLtcgProp = ltcgProp * 0.125;

    const totalBaseCgTax = taxStcgEq + taxLtcgEq + taxLtcgProp;
    const cessCg = totalBaseCgTax * 0.04;
    const totalCgTax = Math.round(totalBaseCgTax + cessCg);

    return {
      stcgEq,
      taxStcgEq,
      ltcgEq,
      taxableLtcgEq,
      taxLtcgEq,
      ltcgProp,
      taxLtcgProp,
      totalBaseCgTax,
      cessCg,
      totalCgTax,
    };
  }, [stcgEquity, ltcgEquity, ltcgProperty]);

  /* ========================================================================== */
  /*  MODULE 3: ADVANCE TAX & SECTION 234A/B/C INTEREST CALCULATOR              */
  /* ========================================================================== */
  const [estimatedTaxLiability, setEstimatedTaxLiability] = useState<number | string>(200000);
  const [tdsPaid, setTdsPaid] = useState<number | string>(50000);
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState<number | string>(80000);
  const [delayFilingMonths, setDelayFilingMonths] = useState<number | string>(3);

  const advanceTaxCalculation = useMemo(() => {
    const netTax = Math.max(0, (Number(estimatedTaxLiability) || 0) - (Number(tdsPaid) || 0));
    const paid = Number(advanceTaxPaid) || 0;
    const shortfall = Math.max(0, netTax - paid);

    const months234A = Math.max(0, Number(delayFilingMonths) || 0);
    const interest234A = Math.round(shortfall * 0.01 * months234A);

    let interest234B = 0;
    if (paid < netTax * 0.9) {
      interest234B = Math.round(shortfall * 0.01 * (months234A + 3));
    }

    const inst1 = Math.round(netTax * 0.15);
    const inst2 = Math.round(netTax * 0.45);
    const inst3 = Math.round(netTax * 0.75);
    const inst4 = netTax;

    return {
      netTax,
      paid,
      shortfall,
      interest234A,
      interest234B,
      totalInterest: interest234A + interest234B,
      totalPayableWithInterest: shortfall + interest234A + interest234B,
      inst1,
      inst2,
      inst3,
      inst4,
    };
  }, [estimatedTaxLiability, tdsPaid, advanceTaxPaid, delayFilingMonths]);

  /* ========================================================================== */
  /*  MODULE 4: MASTER GST ENGINE (INCLUSIVE/EXCLUSIVE & LATE FEES)             */
  /* ========================================================================== */
  const [gstMode, setGstMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [gstAmount, setGstAmount] = useState<number | string>(100000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstCessRate, setGstCessRate] = useState<number | string>(0);
  const [gstSupplyType, setGstSupplyType] = useState<"intra" | "inter">("intra");

  const [returnType, setReturnType] = useState<"normal" | "nil">("normal");
  const [daysLate, setDaysLate] = useState<number | string>(15);
  const [gstLiability, setGstLiability] = useState<number | string>(50000);

  const gstCalculation = useMemo(() => {
    const amt = Number(gstAmount) || 0;
    const cess = Number(gstCessRate) || 0;
    let basePrice = 0;
    let totalGst = 0;
    let cessAmount = 0;
    let finalTotal = 0;

    if (gstMode === "exclusive") {
      basePrice = amt;
      totalGst = (amt * gstRate) / 100;
      cessAmount = (amt * cess) / 100;
      finalTotal = basePrice + totalGst + cessAmount;
    } else {
      finalTotal = amt;
      basePrice = (amt * 100) / (100 + gstRate + cess);
      totalGst = (basePrice * gstRate) / 100;
      cessAmount = (basePrice * cess) / 100;
    }

    const cgst = gstSupplyType === "intra" ? totalGst / 2 : 0;
    const sgst = gstSupplyType === "intra" ? totalGst / 2 : 0;
    const igst = gstSupplyType === "inter" ? totalGst : 0;

    const days = Math.max(0, Number(daysLate) || 0);
    const liability = Math.max(0, Number(gstLiability) || 0);

    const perDayFee = returnType === "nil" ? 20 : 50;
    const rawLateFee = days * perDayFee;
    const maxLateFeeCap = returnType === "nil" ? 500 : 10000;
    const actualLateFee = Math.min(rawLateFee, maxLateFeeCap);

    const interestPenalty = Math.round(((liability * 18) / 100 / 365) * days);

    return {
      basePrice: Math.round(basePrice * 100) / 100,
      totalGst: Math.round(totalGst * 100) / 100,
      cessAmount: Math.round(cessAmount * 100) / 100,
      finalTotal: Math.round(finalTotal * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      actualLateFee,
      interestPenalty,
      totalLateDue: actualLateFee + interestPenalty,
    };
  }, [gstMode, gstAmount, gstRate, gstCessRate, gstSupplyType, returnType, daysLate, gstLiability]);

  /* ========================================================================== */
  /*  MODULE 5: TDS / TCS MASTER MATRIX (20+ SECTIONS WITH 206AA & 201(1A))      */
  /* ========================================================================== */
  const [tdsSection, setTdsSection] = useState("194J_P");
  const [tdsBillAmount, setTdsBillAmount] = useState<number | string>(150000);
  const [payeePanAvailable, setPayeePanAvailable] = useState(true);
  const [tdsDelayMonths, setTdsDelayMonths] = useState<number | string>(2);

  const TDS_DATA: Record<
    string,
    { name: string; sectionCode: string; rate: number; threshold: number; desc: string }
  > = {
    "194C_I": { name: "Contractor (Individual/HUF)", sectionCode: "194C", rate: 1.0, threshold: 30000, desc: "Single > ₹30,000 or Aggregate > ₹1,00,000 per year" },
    "194C_C": { name: "Contractor (Company/Firm)", sectionCode: "194C", rate: 2.0, threshold: 30000, desc: "Single > ₹30,000 or Aggregate > ₹1,00,000 per year" },
    "194J_P": { name: "Professional Fees / Royalty", sectionCode: "194J", rate: 10.0, threshold: 30000, desc: "CA, Doctor, Lawyer, Technical Consultancy > ₹30,000/yr" },
    "194J_T": { name: "Technical Services & BPO", sectionCode: "194J", rate: 2.0, threshold: 30000, desc: "Tech services, Call center ops (Special reduced 2% rate)" },
    "194I_Land": { name: "Rent on Land, Building & Furniture", sectionCode: "194I", rate: 10.0, threshold: 240000, desc: "Annual rent payment exceeding ₹2,40,000" },
    "194I_Plant": { name: "Rent on Plant, Machinery & Equipment", sectionCode: "194I", rate: 2.0, threshold: 240000, desc: "Annual rental payment exceeding ₹2,40,000" },
    "194IA": { name: "Transfer of Immovable Property", sectionCode: "194IA", rate: 1.0, threshold: 5000000, desc: "Property purchase value exceeding ₹50 Lakhs" },
    "194IB": { name: "Rent by Individual/HUF (> ₹50k/mo)", sectionCode: "194IB", rate: 5.0, threshold: 50000, desc: "Monthly rent exceeding ₹50,000 by non-audit persons" },
    "194H": { name: "Commission & Brokerage", sectionCode: "194H", rate: 5.0, threshold: 15000, desc: "Commission/Brokerage payment exceeding ₹15,000" },
    "194Q": { name: "Purchase of Goods (> ₹50 Lakhs)", sectionCode: "194Q", rate: 0.1, threshold: 5000000, desc: "0.1% on purchase value exceeding ₹50L (Turnover > ₹10 Cr)" },
    "194A": { name: "Interest other than Securities", sectionCode: "194A", rate: 10.0, threshold: 40000, desc: "Interest from banks/NBFCs exceeding ₹40,000" },
    "194R": { name: "Business Benefit or Perquisite", sectionCode: "194R", rate: 10.0, threshold: 20000, desc: "Value of benefit/perquisite in course of business > ₹20,000" },
    "194M": { name: "Contract/Commission by Ind/HUF", sectionCode: "194M", rate: 5.0, threshold: 5000000, desc: "Payments exceeding ₹50 Lakhs per year" },
    "194N": { name: "Cash Withdrawal from Banks", sectionCode: "194N", rate: 2.0, threshold: 10000000, desc: "Aggregate cash withdrawal exceeding ₹1 Crore" },
    "194S": { name: "Transfer of Crypto / VDA", sectionCode: "194S", rate: 1.0, threshold: 10000, desc: "Virtual Digital Assets purchase > ₹10k/₹50k" },
    "206C_1H": { name: "TCS on Sale of Goods (> ₹50 Lakhs)", sectionCode: "206C(1H)", rate: 0.1, threshold: 5000000, desc: "TCS collected from buyer on receipts > ₹50 Lakhs" },
    "206C_1G": { name: "TCS on Foreign Remittance (LRS)", sectionCode: "206C(1G)", rate: 5.0, threshold: 700000, desc: "Foreign tour packages / remittance > ₹7 Lakhs" },
  };

  const tdsCalculation = useMemo(() => {
    const section = TDS_DATA[tdsSection] || TDS_DATA["194J_P"];
    const bill = Number(tdsBillAmount) || 0;
    const isPenalized = !payeePanAvailable;

    const effectiveRate = isPenalized ? 20.0 : section.rate;
    const tdsAmount = Math.round((bill * effectiveRate) / 100);
    const netPayable = bill - tdsAmount;

    const months = Math.max(0, Number(tdsDelayMonths) || 0);
    const lateDepositInterest = Math.round(((tdsAmount * 1.5) / 100) * months);

    return {
      section,
      effectiveRate,
      tdsAmount,
      netPayable,
      isPenalized,
      lateDepositInterest,
      totalTdsLiability: tdsAmount + lateDepositInterest,
    };
  }, [tdsSection, tdsBillAmount, payeePanAvailable, tdsDelayMonths]);

  /* ========================================================================== */
  /*  MODULE 6: DEPRECIATION & DTA/DTL TIMING DIFFERENCE ENGINE                 */
  /* ========================================================================== */
  const [assetCost, setAssetCost] = useState<number | string>(500000);
  const [assetCategory, setAssetCategory] = useState("plant");
  const [usedLessThan180Days, setUsedLessThan180Days] = useState(false);
  const [isAdditionalDepApplicable, setIsAdditionalDepApplicable] = useState(false);
  const [usefulLifeYears, setUsefulLifeYears] = useState<number | string>(10);
  const [salvagePercent, setSalvagePercent] = useState<number | string>(5);

  const ASSET_RATES: Record<string, { name: string; itRate: number; defaultLife: number }> = {
    plant: { name: "Plant & Machinery (General)", itRate: 15, defaultLife: 15 },
    computers: { name: "Computers, Laptops & Servers", itRate: 40, defaultLife: 3 },
    furniture: { name: "Furniture, Fixtures & Fittings", itRate: 10, defaultLife: 10 },
    building: { name: "Office Buildings / Factory", itRate: 10, defaultLife: 30 },
    vehicles: { name: "Commercial Motor Vehicles", itRate: 30, defaultLife: 8 },
  };

  const depCalculation = useMemo(() => {
    const cost = Number(assetCost) || 0;
    const selected = ASSET_RATES[assetCategory] || ASSET_RATES["plant"];

    let baseItRate = selected.itRate;
    let addlDepRate = 0;
    if (isAdditionalDepApplicable && assetCategory === "plant") {
      addlDepRate = usedLessThan180Days ? 10 : 20;
    }

    const effectiveItRate = usedLessThan180Days ? baseItRate / 2 : baseItRate;
    const normalItDep = Math.round((cost * effectiveItRate) / 100);
    const addlItDep = Math.round((cost * addlDepRate) / 100);
    const itDepAmount = normalItDep + addlItDep;
    const itClosingWdv = cost - itDepAmount;

    const life = Math.max(1, Number(usefulLifeYears) || selected.defaultLife);
    const salvage = Math.min(10, Math.max(0, Number(salvagePercent) || 5));
    const residualValue = (cost * salvage) / 100;
    const depreciableAmount = cost - residualValue;
    const coDepAmount = Math.round(depreciableAmount / life);
    const coClosingBookValue = cost - coDepAmount;

    const timingDiff = itDepAmount - coDepAmount;
    const deferredTaxImpact = Math.round(Math.abs(timingDiff) * 0.25);

    return {
      selected,
      effectiveItRate,
      addlItDep,
      itDepAmount,
      itClosingWdv,
      coDepAmount,
      coClosingBookValue,
      timingDiff,
      deferredTaxImpact,
      isDTL: timingDiff > 0,
    };
  }, [assetCost, assetCategory, usedLessThan180Days, isAdditionalDepApplicable, usefulLifeYears, salvagePercent]);

  /* ========================================================================== */
  /*  MODULE 7: FINANCIAL AUDIT RATIOS & CMA DATA ANALYSIS                      */
  /* ========================================================================== */
  const [currentAssets, setCurrentAssets] = useState<number | string>(1200000);
  const [currentLiabilities, setCurrentLiabilities] = useState<number | string>(800000);
  const [inventory, setInventory] = useState<number | string>(300000);
  const [totalDebt, setTotalDebt] = useState<number | string>(1500000);
  const [netWorth, setNetWorth] = useState<number | string>(2000000);
  const [annualTurnover, setAnnualTurnover] = useState<number | string>(5000000);
  const [netProfit, setNetProfit] = useState<number | string>(650000);
  const [tradeReceivables, setTradeReceivables] = useState<number | string>(450000);

  const ratiosCalculation = useMemo(() => {
    const ca = Number(currentAssets) || 0;
    const cl = Math.max(1, Number(currentLiabilities) || 1);
    const inv = Number(inventory) || 0;
    const debt = Number(totalDebt) || 0;
    const nw = Math.max(1, Number(netWorth) || 1);
    const sales = Math.max(1, Number(annualTurnover) || 1);
    const np = Number(netProfit) || 0;
    const debtors = Number(tradeReceivables) || 0;

    const currentRatio = Math.round((ca / cl) * 100) / 100;
    const quickRatio = Math.round(((ca - inv) / cl) * 100) / 100;
    const debtEquityRatio = Math.round((debt / nw) * 100) / 100;
    const netProfitMargin = Math.round((np / sales) * 10000) / 100;
    const roe = Math.round((np / nw) * 10000) / 100;
    const debtorsDays = Math.round((debtors / sales) * 365);
    const workingCapital = ca - cl;

    return {
      currentRatio,
      quickRatio,
      debtEquityRatio,
      netProfitMargin,
      roe,
      debtorsDays,
      workingCapital,
      isCRHealthy: currentRatio >= 1.33,
      isDERHealthy: debtEquityRatio <= 2.0,
    };
  }, [currentAssets, currentLiabilities, inventory, totalDebt, netWorth, annualTurnover, netProfit, tradeReceivables]);

  /* ========================================================================== */
  /*  MODULE 8: NUMBER TO WORDS (CHEQUES & AUDIT DEEDS)                         */
  /* ========================================================================== */
  const [numInput, setNumInput] = useState<number | string>(1874960);
  const [copiedWords, setCopiedWords] = useState(false);

  const wordsOutput = useMemo(() => {
    const n = Math.floor(Number(numInput) || 0);
    if (n === 0) return "Rupees Zero Only";
    if (isNaN(n) || n < 0) return "Please enter a valid positive number";

    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const inWords = (num: number): string => {
      if (num === 0) return "";
      if (num < 20) return a[num] + " ";
      if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10] + " ";
      if (num < 1000) return a[Math.floor(num / 100)] + " Hundred " + inWords(num % 100);
      if (num < 100000) return inWords(Math.floor(num / 1000)) + "Thousand " + inWords(num % 1000);
      if (num < 10000000) return inWords(Math.floor(num / 100000)) + "Lakh " + inWords(num % 100000);
      return inWords(Math.floor(num / 10000000)) + "Crore " + inWords(num % 10000000);
    };

    return `Rupees ${inWords(n).trim()} Only`;
  }, [numInput]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2000);
  };

  /* ========================================================================== */
  /*  ULTRA-PREMIUM FORMATTED EXCEL (.XLS / SPREADSHEETML) EXPORT ENGINE        */
  /* ========================================================================== */
  const handleExportExcel = () => {
    try {
      const htmlExcelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>CA Master Audit Sheet</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
            table { border-collapse: collapse; width: 100%; }
            .banner-title { background-color: #0f172a; color: #ffffff; font-size: 14pt; font-weight: bold; text-align: center; height: 38px; }
            .info-label { background-color: #f8fafc; font-weight: bold; color: #475569; width: 180px; }
            .info-val { font-weight: 600; color: #0f172a; }
            .sec-header { background-color: #1e40af; color: #ffffff; font-size: 12pt; font-weight: bold; height: 32px; padding-left: 10px; }
            th { background-color: #334155; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #94a3b8; height: 28px; }
            td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 11pt; }
            .num-cell { text-align: right; font-family: 'Consolas', 'Courier New', monospace; mso-number-format: "\\#\\,\\#\\#0"; }
            .bold-total { font-weight: bold; background-color: #f1f5f9; }
            .highlight-green { font-weight: bold; background-color: #dcfce7; color: #166534; }
            .highlight-blue { font-weight: bold; background-color: #dbeafe; color: #1e40af; }
            .text-left { text-align: left; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <table>
            <col width="340">
            <col width="170">
            <col width="170">
            <col width="320">

            <!-- MASTER HEADER -->
            <tr>
              <td colspan="4" class="banner-title">CHARTERED ACCOUNTANT MASTER AUDIT &amp; TAX WORKING SHEET</td>
            </tr>
            <tr>
              <td class="info-label">CA Firm / Practitioner:</td>
              <td class="info-val" colspan="3">${clientInfo.caFirm} (${clientInfo.caMembership})</td>
            </tr>
            <tr>
              <td class="info-label">Assessee / Client Name:</td>
              <td class="info-val">${clientInfo.name}</td>
              <td class="info-label">PAN / GSTIN:</td>
              <td class="info-val">${clientInfo.pan} / ${clientInfo.gstin}</td>
            </tr>
            <tr>
              <td class="info-label">Assessment Year:</td>
              <td class="info-val">${clientInfo.assessmentYear} (FY: ${clientInfo.financialYear})</td>
              <td class="info-label">UDIN / Date:</td>
              <td class="info-val">${clientInfo.udin} | ${clientInfo.date}</td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 1: INCOME TAX REGIME COMPARISON -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 1: STATEMENT OF TOTAL INCOME &amp; TAX REGIME COMPARISON (AY 2025-26 - BUDGET 2024)</td>
            </tr>
            <tr>
              <th>Particulars</th>
              <th>Old Tax Regime (₹)</th>
              <th>New Tax Regime (₹)</th>
              <th>Statutory Notes / Slabs</th>
            </tr>
            <tr>
              <td>Gross Total Salary / Receipts</td>
              <td class="num-cell">${Number(regimeCalculation.gross)}</td>
              <td class="num-cell">${Number(regimeCalculation.gross)}</td>
              <td>Gross Income from all heads</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: Standard Deduction u/s 16(ia)</td>
              <td class="num-cell">50000</td>
              <td class="num-cell">75000</td>
              <td>Budget 2024 Hiked to ₹75,000 in New Regime</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: Section 80C Deductions</td>
              <td class="num-cell">${Math.min(150000, Number(sec80C) || 0)}</td>
              <td class="num-cell">0</td>
              <td>Max ₹1.5 Lakhs Cap (Old Only)</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: Section 80CCD(1B) NPS</td>
              <td class="num-cell">${Math.min(50000, Number(sec80CCD1B) || 0)}</td>
              <td class="num-cell">0</td>
              <td>Additional ₹50k NPS Exemption</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: Section 80D Health Insurance</td>
              <td class="num-cell">${Math.min(50000, Number(sec80D_Self) || 0) + Math.min(50000, Number(sec80D_Parents) || 0)}</td>
              <td class="num-cell">0</td>
              <td>Self + Senior Parents Mediclaim</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: House Rent Allowance (HRA)</td>
              <td class="num-cell">${Number(hraExemption) || 0}</td>
              <td class="num-cell">0</td>
              <td>Exemption u/s 10(13A)</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: Home Loan Interest u/s 24(b)</td>
              <td class="num-cell">${Math.min(200000, Number(homeLoanInterest) || 0)}</td>
              <td class="num-cell">0</td>
              <td>Max ₹2 Lakhs Self-Occupied</td>
            </tr>
            <tr class="bold-total">
              <td>Total Deductions Claimed</td>
              <td class="num-cell">${regimeCalculation.totalOldDeductions}</td>
              <td class="num-cell">75000</td>
              <td>Chapter VI-A vs Standard Deduction</td>
            </tr>
            <tr class="bold-total">
              <td>Net Taxable Income</td>
              <td class="num-cell">${regimeCalculation.taxableOld}</td>
              <td class="num-cell">${regimeCalculation.taxableNew}</td>
              <td>Rounded to nearest ₹10</td>
            </tr>
            <tr>
              <td>Tax on Total Income (Before Cess)</td>
              <td class="num-cell">${regimeCalculation.baseTaxOld}</td>
              <td class="num-cell">${regimeCalculation.baseTaxNew}</td>
              <td>Applicable Slab Rates</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Less: Tax Rebate u/s 87A</td>
              <td class="num-cell">${regimeCalculation.rebateOld}</td>
              <td class="num-cell">${regimeCalculation.rebateNew}</td>
              <td>New: Taxable &lt;= 7L (0 Tax), Old: &lt;= 5L</td>
            </tr>
            <tr>
              <td style="padding-left: 20px; color: #475569;">Add: Health &amp; Education Cess @ 4%</td>
              <td class="num-cell">${regimeCalculation.cessOld}</td>
              <td class="num-cell">${regimeCalculation.cessNew}</td>
              <td>Mandatory 4% Cess</td>
            </tr>
            <tr class="highlight-blue" style="font-size: 12pt;">
              <td>TOTAL FINAL TAX PAYABLE</td>
              <td class="num-cell">${regimeCalculation.totalTaxOld}</td>
              <td class="num-cell">${regimeCalculation.totalTaxNew}</td>
              <td>Final Tax Liability (Including Cess)</td>
            </tr>
            <tr class="highlight-green">
              <td>CA RECOMMENDATION &amp; SAVINGS</td>
              <td colspan="3" class="text-left" style="padding: 8px 12px;">
                ⚡ ${regimeCalculation.betterRegime} is highly recommended for Assessee resulting in net tax savings of ₹${regimeCalculation.savings.toLocaleString("en-IN")}.
              </td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 2: CAPITAL GAINS -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 2: CAPITAL GAINS COMPUTATION (BUDGET 2024 AMENDMENTS)</td>
            </tr>
            <tr>
              <th>Capital Gains Head</th>
              <th>Gain Amount (₹)</th>
              <th>Tax Rate (%)</th>
              <th>Tax Payable (₹)</th>
            </tr>
            <tr>
              <td>STCG on Listed Equity (Sec 111A)</td>
              <td class="num-cell">${capitalGainsCalculation.stcgEq}</td>
              <td class="text-center">20.00%</td>
              <td class="num-cell">${capitalGainsCalculation.taxStcgEq}</td>
            </tr>
            <tr>
              <td>LTCG on Listed Equity (Sec 112A)</td>
              <td class="num-cell">${capitalGainsCalculation.ltcgEq}</td>
              <td class="text-center">12.50% (Exempt 1.25L)</td>
              <td class="num-cell">${capitalGainsCalculation.taxLtcgEq}</td>
            </tr>
            <tr>
              <td>LTCG on Immovable Property</td>
              <td class="num-cell">${capitalGainsCalculation.ltcgProp}</td>
              <td class="text-center">12.50% (No Indexation)</td>
              <td class="num-cell">${capitalGainsCalculation.taxLtcgProp}</td>
            </tr>
            <tr class="bold-total">
              <td colspan="3">Total Capital Gains Tax Payable (Including 4% Cess)</td>
              <td class="num-cell" style="color: #1e40af;">${capitalGainsCalculation.totalCgTax}</td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 3: ADVANCE TAX & 234A/B/C -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 3: ADVANCE TAX &amp; SECTION 234A / 234B / 234C INTEREST SCHEDULE</td>
            </tr>
            <tr>
              <th>Quarter / Installment Due Date</th>
              <th>Mandatory %</th>
              <th>Cumulative Target Amount (₹)</th>
              <th>Statutory Status</th>
            </tr>
            <tr>
              <td>1st Installment (On or before 15th June)</td>
              <td class="text-center">15%</td>
              <td class="num-cell">${advanceTaxCalculation.inst1}</td>
              <td>1st Quarter Advance Tax</td>
            </tr>
            <tr>
              <td>2nd Installment (On or before 15th September)</td>
              <td class="text-center">45%</td>
              <td class="num-cell">${advanceTaxCalculation.inst2}</td>
              <td>2nd Quarter Advance Tax</td>
            </tr>
            <tr>
              <td>3rd Installment (On or before 15th December)</td>
              <td class="text-center">75%</td>
              <td class="num-cell">${advanceTaxCalculation.inst3}</td>
              <td>3rd Quarter Advance Tax</td>
            </tr>
            <tr>
              <td>4th Installment (On or before 15th March)</td>
              <td class="text-center">100%</td>
              <td class="num-cell">${advanceTaxCalculation.inst4}</td>
              <td>Final Advance Tax Installment</td>
            </tr>
            <tr>
              <td>Section 234A Interest (Delay in filing ITR)</td>
              <td colspan="2" class="num-cell" style="color: #dc2626;">${advanceTaxCalculation.interest234A}</td>
              <td>1% per month on assessed tax shortfall</td>
            </tr>
            <tr>
              <td>Section 234B Interest (Advance Tax Shortfall &lt; 90%)</td>
              <td colspan="2" class="num-cell" style="color: #dc2626;">${advanceTaxCalculation.interest234B}</td>
              <td>1% per month from 1st April of AY</td>
            </tr>
            <tr class="bold-total">
              <td>Total Outstanding Tax + Statutory Interest</td>
              <td colspan="3" class="num-cell" style="color: #b91c1c; font-size: 12pt;">${advanceTaxCalculation.totalPayableWithInterest}</td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 4: GST MASTER -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 4: GST MASTER &amp; GSTR LATE FEE STATEMENT</td>
            </tr>
            <tr>
              <th>GST Tax Parameter</th>
              <th>Amount (₹)</th>
              <th>Rate / Breakdown</th>
              <th>Remarks</th>
            </tr>
            <tr>
              <td>Base Taxable Value</td>
              <td class="num-cell">${gstCalculation.basePrice}</td>
              <td class="text-center">Mode: ${gstMode.toUpperCase()}</td>
              <td>Net Goods / Service Value</td>
            </tr>
            <tr>
              <td>CGST + SGST (Intra-State) / IGST (Inter-State)</td>
              <td class="num-cell">${gstCalculation.totalGst}</td>
              <td class="text-center">Slab: ${gstRate}%</td>
              <td>CGST: ₹${gstCalculation.cgst} | SGST: ₹${gstCalculation.sgst}</td>
            </tr>
            <tr class="bold-total">
              <td>Final Tax Invoice Value</td>
              <td class="num-cell" style="color: #1e40af;">${gstCalculation.finalTotal}</td>
              <td colspan="2">Gross Invoice Payable by Buyer</td>
            </tr>
            <tr>
              <td>GSTR Late Filing Penalty (${daysLate} Days Delay)</td>
              <td class="num-cell" style="color: #dc2626;">${gstCalculation.actualLateFee}</td>
              <td class="text-center">${returnType === "nil" ? "₹20/Day (Nil)" : "₹50/Day (Normal)"}</td>
              <td>Statutory Capped</td>
            </tr>
            <tr>
              <td>Section 50(1) Interest @ 18% p.a.</td>
              <td class="num-cell" style="color: #d97706;">${gstCalculation.interestPenalty}</td>
              <td class="text-center">18% p.a.</td>
              <td>On Net Cash Tax Liability (₹${gstLiability})</td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 5: TDS / TCS MASTER -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 5: TDS / TCS MASTER COMPLIANCE &amp; SECTION 206AA PENALTY</td>
            </tr>
            <tr>
              <th>Section &amp; Payment Nature</th>
              <th>Bill Amount (₹)</th>
              <th>Effective Rate &amp; TDS</th>
              <th>Net Pay to Vendor (₹)</th>
            </tr>
            <tr>
              <td>Section ${tdsCalculation.section.sectionCode} — ${tdsCalculation.section.name}</td>
              <td class="num-cell">${Number(tdsBillAmount)}</td>
              <td class="text-center">${tdsCalculation.effectiveRate}% (TDS: ₹${tdsCalculation.tdsAmount})</td>
              <td class="num-cell" style="color: #166534; font-weight: bold;">${tdsCalculation.netPayable}</td>
            </tr>
            <tr>
              <td colspan="2">Payee PAN Furnished Status</td>
              <td colspan="2" class="${payeePanAvailable ? "" : "highlight-row"}" style="color: ${payeePanAvailable ? "#166534" : "#dc2626"};">
                ${payeePanAvailable ? "✓ Valid PAN Furnished (Normal Rate)" : "⚠️ Section 206AA Penalty Triggered: Mandatory 20.00% Higher TDS Applied"}
              </td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 6: DEPRECIATION -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 6: DEPRECIATION SCHEDULE &amp; DEFERRED TAX (AS-22 / IND AS 12)</td>
            </tr>
            <tr>
              <th>Asset Block / Description</th>
              <th>Asset Cost (₹)</th>
              <th>Income Tax WDV (₹)</th>
              <th>Companies Act SLM (₹)</th>
            </tr>
            <tr>
              <td>${depCalculation.selected.name} (${usefulLifeYears} Yrs Life)</td>
              <td class="num-cell">${Number(assetCost)}</td>
              <td class="num-cell">₹${depCalculation.itDepAmount} (Rate: ${depCalculation.effectiveItRate}%)</td>
              <td class="num-cell">₹${depCalculation.coDepAmount}</td>
            </tr>
            <tr class="bold-total">
              <td>Closing Balance at Year End</td>
              <td>-</td>
              <td class="num-cell">WDV: ₹${depCalculation.itClosingWdv}</td>
              <td class="num-cell">Book Value: ₹${depCalculation.coClosingBookValue}</td>
            </tr>
            <tr>
              <td>Depreciation Timing Variance</td>
              <td colspan="3" class="text-left">
                Variance: ₹${Math.abs(depCalculation.timingDiff).toLocaleString("en-IN")} ➔ Creates <strong>${depCalculation.isDTL ? "Deferred Tax Liability (DTL)" : "Deferred Tax Asset (DTA)"}</strong> of approx ₹${depCalculation.deferredTaxImpact.toLocaleString("en-IN")}.
              </td>
            </tr>
            <tr><td colspan="4" style="height: 12px; border: none;"></td></tr>

            <!-- SECTION 7: AUDIT RATIOS -->
            <tr>
              <td colspan="4" class="sec-header">SECTION 7: FINANCIAL AUDIT RATIOS &amp; BANK CMA BENCHMARKS</td>
            </tr>
            <tr>
              <th>Financial Ratio Name</th>
              <th>Calculated Ratio</th>
              <th>Bank MPBF Benchmark</th>
              <th>Audit Health Assessment</th>
            </tr>
            <tr>
              <td>Current Ratio (Liquidity)</td>
              <td class="text-center font-bold">${ratiosCalculation.currentRatio} : 1</td>
              <td class="text-center">&gt;= 1.33 : 1</td>
              <td style="color: ${ratiosCalculation.isCRHealthy ? "#166534" : "#dc2626"}; font-weight: bold;">
                ${ratiosCalculation.isCRHealthy ? "✓ HEALTHY (Bank Eligible)" : "⚠️ CRITICAL (Low Working Capital)"}
              </td>
            </tr>
            <tr>
              <td>Quick / Acid-Test Ratio</td>
              <td class="text-center font-bold">${ratiosCalculation.quickRatio} : 1</td>
              <td class="text-center">&gt;= 1.00 : 1</td>
              <td>${ratiosCalculation.quickRatio >= 1.0 ? "✓ OPTIMAL LIQUIDITY" : "TIGHT CASH FLOW"}</td>
            </tr>
            <tr>
              <td>Debt to Equity Ratio (Leverage)</td>
              <td class="text-center font-bold">${ratiosCalculation.debtEquityRatio} : 1</td>
              <td class="text-center">&lt;= 2.00 : 1</td>
              <td style="color: ${ratiosCalculation.isDERHealthy ? "#166534" : "#dc2626"}; font-weight: bold;">
                ${ratiosCalculation.isDERHealthy ? "✓ SAFE SOLVENCY" : "⚠️ HIGH LEVERAGE"}
              </td>
            </tr>
            <tr>
              <td>Net Profit Margin &amp; ROE</td>
              <td class="text-center font-bold">NPM: ${ratiosCalculation.netProfitMargin}%</td>
              <td class="text-center">ROE: ${ratiosCalculation.roe}%</td>
              <td>Operating Profitability &amp; Shareholder Return</td>
            </tr>
            <tr><td colspan="4" style="height: 16px; border: none;"></td></tr>

            <!-- CERTIFICATION & SIGNATURE -->
            <tr>
              <td colspan="2" style="border-top: 2px solid #0f172a; font-size: 10pt; color: #64748b;">
                Certified true &amp; correct adhering to Income Tax Act 1961, CGST Act 2017 &amp; Companies Act 2013.<br>
                Generated via ToolBox CA Master Engine.
              </td>
              <td colspan="2" style="border-top: 2px solid #0f172a; text-align: right; font-weight: bold;">
                For ${clientInfo.caFirm}<br><br>
                ____________________________<br>
                Authorized Signatory / Partner<br>
                ${clientInfo.caMembership}
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlExcelContent], { type: "application/vnd.ms-excel;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = `${clientInfo.name.replace(/[^a-zA-Z0-9]/g, "_")}_CA_Master_Audit_Sheet_${clientInfo.assessmentYear}.xls`;
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      alert("Failed to generate Excel file.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthGate>
      <ProGate>
        <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-24 antialiased font-sans">
          
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #ca-official-print-memo,
              #ca-official-print-memo * {
                visibility: visible;
              }
              #ca-official-print-memo {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                background: white !important;
                color: black !important;
                padding: 20px !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          {/* Top Sticky Header */}
          <nav className="no-print border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3] shrink-0">
                ← Back to ToolBox
              </Link>
              
              <div className="flex items-center gap-2 shrink-0">
                {/* 1-CLICK EXCEL EXPORT BUTTON */}
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
                >
                  <span>📊</span>
                  <span className="hidden sm:inline">{downloadSuccess ? "✓ Downloaded Excel!" : "Export Complete Client Excel (.XLS)"}</span>
                  <span className="sm:hidden">{downloadSuccess ? "✓ Done" : "Excel"}</span>
                </button>

                {/* PRINT OFFICIAL MEMO BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
                >
                  <span>🖨️</span>
                  <span className="hidden sm:inline">Print Official CA Memo</span>
                  <span className="sm:hidden">Memo</span>
                </button>

                <span className="hidden md:inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  💎 CA Master Suite
                </span>
              </div>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto px-4 pt-6">
            
            {/* ── 👤 ACTIVE CLIENT & FIRM MASTER BAR ─────────────────────────── */}
            <div className="no-print bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md mb-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                      Active Client &amp; CA Firm Master Profile
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Edit details below — syncs live across all 8 modules, Excel download &amp; Official Print Memo.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClientProfileBar(!showClientProfileBar)}
                  className="text-xs font-bold text-[#0071e3] bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/40"
                >
                  {showClientProfileBar ? "▲ Minimize Header" : "▼ Edit Client Profile"}
                </button>
              </div>

              {showClientProfileBar && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Assessee / Client Name</label>
                    <input
                      type="text"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. M/s Sharma Enterprises"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Client PAN Number</label>
                    <input
                      type="text"
                      value={clientInfo.pan}
                      onChange={(e) => setClientInfo({ ...clientInfo, pan: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. AAACS1234F"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Client GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={clientInfo.gstin}
                      onChange={(e) => setClientInfo({ ...clientInfo, gstin: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold uppercase outline-none focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. 27AAACS1234F1Z5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Assessment Year</label>
                    <select
                      value={clientInfo.assessmentYear}
                      onChange={(e) => setClientInfo({ ...clientInfo, assessmentYear: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
                    >
                      <option value="2025-26">AY 2025-26 (FY 2024-25 - Budget 2024)</option>
                      <option value="2024-25">AY 2024-25 (FY 2023-24)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">CA Firm / Practitioner</label>
                    <input
                      type="text"
                      value={clientInfo.caFirm}
                      onChange={(e) => setClientInfo({ ...clientInfo, caFirm: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
                      placeholder="e.g. Kashyap & Associates, CAs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">CA Membership No.</label>
                    <input
                      type="text"
                      value={clientInfo.caMembership}
                      onChange={(e) => setClientInfo({ ...clientInfo, caMembership: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
                      placeholder="e.g. M.No. 543210"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">UDIN (ICAI Certification)</label>
                    <input
                      type="text"
                      value={clientInfo.udin}
                      onChange={(e) => setClientInfo({ ...clientInfo, udin: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
                      placeholder="e.g. 25543210AAAAAA1234"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Date of Computation</label>
                    <input
                      type="date"
                      value={clientInfo.date}
                      onChange={(e) => setClientInfo({ ...clientInfo, date: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 font-bold outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Header Title */}
            <div className="no-print text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                <span>⚡</span> ALL-IN-ONE CA COMPLIANCE &amp; TAX SUITE (A TO Z)
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                Chartered Accountant Master Suite
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
                Income Tax (Budget 2024), Capital Gains, Advance Tax 234A/B/C, GST Engine, 20+ Section TDS/TCS Matrix, Audit Depreciation (WDV vs SLM + DTA/DTL), Bank CMA Ratios &amp; 1-Click Excel.
              </p>
            </div>

            {/* ── 8 MASTER MODULE TABS ────────────────────────────────────────── */}
            <div className="no-print flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "regime", name: "⚖️ Old vs New Regime (AY 25-26)" },
                { id: "capitalgains", name: "📈 Capital Gains (Budget 2024)" },
                { id: "advancetax", name: "⏳ Advance Tax & 234A/B/C" },
                { id: "gst", name: "🧾 GST Master & Late Fee" },
                { id: "tds", name: "📋 TDS & TCS Master Matrix" },
                { id: "depreciation", name: "🏢 Depreciation & DTA/DTL" },
                { id: "ratios", name: "📊 Bank CMA & Audit Ratios" },
                { id: "num2words", name: "✍️ Rupees in Words" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === t.id
                      ? "bg-[#0071e3] text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30 scale-[1.01]"
                      : "bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            {/* ── 1. OLD VS NEW REGIME MODULE ────────────────────────────────── */}
            {activeTab === "regime" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-xs font-black uppercase text-[#0071e3]">Income &amp; Deductions</span>
                    <select
                      value={ageCategory}
                      onChange={(e) => setAgeCategory(e.target.value as any)}
                      className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-1.5 text-xs font-bold outline-none"
                    >
                      <option value="general">Individual (&lt; 60 Yrs)</option>
                      <option value="senior">Senior Citizen (60-80 Yrs)</option>
                      <option value="superSenior">Super Senior (&gt; 80 Yrs)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold block mb-1">Gross Salary / CTC (₹)</label>
                      <input
                        type="number"
                        value={grossSalary}
                        onChange={(e) => setGrossSalary(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#0071e3]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">Other Income / Int. (₹)</label>
                      <input
                        type="number"
                        value={otherIncome}
                        onChange={(e) => setOtherIncome(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-black outline-none"
                      />
                    </div>
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block pt-2">
                    Chapter VI-A Deductions (For Old Regime)
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold block mb-0.5">Section 80C (Max 1.5L)</label>
                      <input
                        type="number"
                        value={sec80C}
                        onChange={(e) => setSec80C(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-0.5">80CCD(1B) NPS (50k)</label>
                      <input
                        type="number"
                        value={sec80CCD1B}
                        onChange={(e) => setSec80CCD1B(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-0.5">80D Self/Family</label>
                      <input
                        type="number"
                        value={sec80D_Self}
                        onChange={(e) => setSec80D_Self(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-0.5">80D Senior Parents</label>
                      <input
                        type="number"
                        value={sec80D_Parents}
                        onChange={(e) => setSec80D_Parents(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-0.5">HRA Exemption (₹)</label>
                      <input
                        type="number"
                        value={hraExemption}
                        onChange={(e) => setHraExemption(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-0.5">Home Loan 24(b)</label>
                      <input
                        type="number"
                        value={homeLoanInterest}
                        onChange={(e) => setHomeLoanInterest(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-xl">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                      Client Savings Recommendation
                    </span>
                    <div className="text-3xl font-black mt-3">
                      {regimeCalculation.betterRegime === "New Regime"
                        ? `⚡ New Regime Saves ₹${regimeCalculation.savings.toLocaleString("en-IN")}`
                        : `⚡ Old Regime Saves ₹${regimeCalculation.savings.toLocaleString("en-IN")}`}
                    </div>
                    <p className="text-xs text-white/80 mt-1">
                      Budget 2024 Slabs with ₹75,000 Standard Deduction + Section 87A Rebate vs Chapter VI-A.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2">
                      <div className="font-black text-[#0071e3] text-sm">New Regime (Default)</div>
                      <div className="text-2xl font-black">₹{regimeCalculation.totalTaxNew.toLocaleString("en-IN")}</div>
                      <div className="text-slate-500 text-[11px] pt-1 border-t">
                        Taxable: ₹{regimeCalculation.taxableNew.toLocaleString("en-IN")}
                      </div>
                      <div className="text-slate-400 text-[10px]">Std Ded: ₹75,000 | Rebate 87A: ₹{regimeCalculation.rebateNew.toLocaleString("en-IN")}</div>
                    </div>

                    <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2">
                      <div className="font-black text-slate-700 dark:text-slate-300 text-sm">Old Regime</div>
                      <div className="text-2xl font-black">₹{regimeCalculation.totalTaxOld.toLocaleString("en-IN")}</div>
                      <div className="text-slate-500 text-[11px] pt-1 border-t">
                        Taxable: ₹{regimeCalculation.taxableOld.toLocaleString("en-IN")}
                      </div>
                      <div className="text-slate-400 text-[10px]">Deductions: ₹{regimeCalculation.totalOldDeductions.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. CAPITAL GAINS MODULE (BUDGET 2024) ───────────────────────── */}
            {activeTab === "capitalgains" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="border-b pb-3">
                  <span className="text-xs font-black uppercase text-amber-500">
                    Budget 2024 Revised Capital Gains Tax Slabs (Effective July 23, 2024)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">STCG on Listed Shares (Sec 111A)</label>
                    <input
                      type="number"
                      value={stcgEquity}
                      onChange={(e) => setStcgEquity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Hiked to 20% in Budget 2024</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">LTCG on Listed Shares (Sec 112A)</label>
                    <input
                      type="number"
                      value={ltcgEquity}
                      onChange={(e) => setLtcgEquity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">12.5% above ₹1.25 Lakhs exemption</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">LTCG on Immovable Property</label>
                    <input
                      type="number"
                      value={ltcgProperty}
                      onChange={(e) => setLtcgProperty(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">12.5% without indexation</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">STCG Tax (20%)</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      ₹{capitalGainsCalculation.taxStcgEq.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">LTCG Equity Tax (12.5%)</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      ₹{capitalGainsCalculation.taxLtcgEq.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">Property LTCG Tax (12.5%)</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      ₹{capitalGainsCalculation.taxLtcgProp.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                    <span className="text-[11px] font-bold text-emerald-600">Total Tax Payable (Inc Cess)</span>
                    <div className="text-xl font-black text-emerald-600 mt-1">
                      ₹{capitalGainsCalculation.totalCgTax.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. ADVANCE TAX & 234A/B/C MODULE ────────────────────────────── */}
            {activeTab === "advancetax" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Estimated Tax Liability (₹)</label>
                    <input
                      type="number"
                      value={estimatedTaxLiability}
                      onChange={(e) => setEstimatedTaxLiability(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">TDS / TCS Paid (₹)</label>
                    <input
                      type="number"
                      value={tdsPaid}
                      onChange={(e) => setTdsPaid(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Advance Tax Deposited (₹)</label>
                    <input
                      type="number"
                      value={advanceTaxPaid}
                      onChange={(e) => setAdvanceTaxPaid(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Delay in Filing (Months)</label>
                    <input
                      type="number"
                      value={delayFilingMonths}
                      onChange={(e) => setDelayFilingMonths(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border space-y-3">
                  <span className="text-xs font-black uppercase text-[#0071e3]">
                    Statutory Advance Tax Installment Schedule (Section 208/211)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border">
                      <div className="text-slate-400 font-bold">15th June (15%)</div>
                      <div className="text-base font-black mt-1">₹{advanceTaxCalculation.inst1.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border">
                      <div className="text-slate-400 font-bold">15th Sept (45%)</div>
                      <div className="text-base font-black mt-1">₹{advanceTaxCalculation.inst2.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border">
                      <div className="text-slate-400 font-bold">15th Dec (75%)</div>
                      <div className="text-base font-black mt-1">₹{advanceTaxCalculation.inst3.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border">
                      <div className="text-slate-400 font-bold">15th March (100%)</div>
                      <div className="text-base font-black mt-1">₹{advanceTaxCalculation.inst4.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">Sec 234A Interest (Late Return)</span>
                    <div className="text-lg font-black text-rose-500 mt-1">₹{advanceTaxCalculation.interest234A.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">Sec 234B Interest (Shortfall &lt; 90%)</span>
                    <div className="text-lg font-black text-rose-500 mt-1">₹{advanceTaxCalculation.interest234B.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-2xl">
                    <span className="text-[11px] font-bold text-rose-600">Total Tax + Interest Due</span>
                    <div className="text-xl font-black text-rose-600 mt-1">₹{advanceTaxCalculation.totalPayableWithInterest.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. GST MASTER & LATE FEE MODULE ────────────────────────────── */}
            {activeTab === "gst" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-xs font-black uppercase text-[#0071e3]">Tax Invoice Engine</span>
                      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setGstMode("exclusive")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            gstMode === "exclusive" ? "bg-white dark:bg-slate-800 text-[#0071e3] shadow-sm" : "text-slate-500"
                          }`}
                        >
                          + Exclusive
                        </button>
                        <button
                          type="button"
                          onClick={() => setGstMode("inclusive")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            gstMode === "inclusive" ? "bg-white dark:bg-slate-800 text-[#0071e3] shadow-sm" : "text-slate-500"
                          }`}
                        >
                          - Inclusive
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {gstMode === "exclusive" ? "Base Taxable Value (₹)" : "Total MRP / Invoice Amount (₹)"}
                      </label>
                      <input
                        type="number"
                        value={gstAmount}
                        onChange={(e) => setGstAmount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl p-3 text-lg font-black outline-none focus:ring-2 focus:ring-[#0071e3]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          GST Slab
                        </label>
                        <select
                          value={gstRate}
                          onChange={(e) => setGstRate(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Cess (%)
                        </label>
                        <input
                          type="number"
                          value={gstCessRate}
                          onChange={(e) => setGstCessRate(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Supply
                        </label>
                        <select
                          value={gstSupplyType}
                          onChange={(e) => setGstSupplyType(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                        >
                          <option value="intra">Intra (CGST+SGST)</option>
                          <option value="inter">Inter (IGST)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
                      <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                        GST Tax Breakdown
                      </span>
                      <div className="text-3xl font-black mt-3">
                        Total Invoice: ₹{gstCalculation.finalTotal.toLocaleString("en-IN")}
                      </div>
                      <p className="text-xs text-white/80 mt-1">
                        Base Price: ₹{gstCalculation.basePrice.toLocaleString("en-IN")} + GST: ₹{gstCalculation.totalGst.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-3 gap-3 text-center text-xs">
                      {gstSupplyType === "intra" ? (
                        <>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                            <span className="text-[11px] font-bold text-slate-400">CGST ({gstRate / 2}%)</span>
                            <div className="text-base font-black mt-1">₹{gstCalculation.cgst.toLocaleString("en-IN")}</div>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                            <span className="text-[11px] font-bold text-slate-400">SGST ({gstRate / 2}%)</span>
                            <div className="text-base font-black mt-1">₹{gstCalculation.sgst.toLocaleString("en-IN")}</div>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                          <span className="text-[11px] font-bold text-slate-400">IGST ({gstRate}%)</span>
                          <div className="text-base font-black mt-1">₹{gstCalculation.igst.toLocaleString("en-IN")}</div>
                        </div>
                      )}
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                        <span className="text-[11px] font-bold text-emerald-600">Net Tax</span>
                        <div className="text-base font-black text-emerald-600 mt-1">₹{gstCalculation.totalGst.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="text-xs font-black uppercase text-rose-500">
                      GSTR-3B / GSTR-1 Late Filing Penalty &amp; Sec 50(1) Interest (18% p.a.)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">Return Status</label>
                      <select
                        value={returnType}
                        onChange={(e) => setReturnType(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                      >
                        <option value="normal">Normal Return (₹50 / day late fee)</option>
                        <option value="nil">Nil Return (₹20 / day late fee)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">Days of Delay</label>
                      <input
                        type="number"
                        value={daysLate}
                        onChange={(e) => setDaysLate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">Net Cash Tax Liability (₹)</label>
                      <input
                        type="number"
                        value={gstLiability}
                        onChange={(e) => setGstLiability(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">Late Fee Payable</span>
                      <div className="text-lg font-black text-rose-500 mt-0.5">₹{gstCalculation.actualLateFee.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Sec 50(1) Interest (18% p.a.)</span>
                      <div className="text-lg font-black text-amber-500 mt-0.5">₹{gstCalculation.interestPenalty.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Total Statutory Due</span>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">₹{gstCalculation.totalLateDue.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 5. TDS & TCS MASTER MATRIX MODULE ──────────────────────────── */}
            {activeTab === "tds" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Select Section (TDS &amp; TCS 20+ Prescribed Rates)
                    </label>
                    <select
                      value={tdsSection}
                      onChange={(e) => setTdsSection(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0071e3]"
                    >
                      {Object.entries(TDS_DATA).map(([k, s]) => (
                        <option key={k} value={k}>
                          Section {s.sectionCode} — {s.name} ({s.rate}%)
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {tdsCalculation.section.desc}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Gross Invoice / Bill Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={tdsBillAmount}
                      onChange={(e) => setTdsBillAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-base font-black outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  payeePanAvailable
                    ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="pan-check"
                      checked={payeePanAvailable}
                      onChange={(e) => setPayeePanAvailable(e.target.checked)}
                      className="w-5 h-5 accent-[#0071e3]"
                    />
                    <div>
                      <label htmlFor="pan-check" className="text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200">
                        Payee PAN is Furnished &amp; Valid
                      </label>
                      {!payeePanAvailable && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                          ⚠️ Section 206AA Triggered: Non-furnishing of PAN attracts mandatory higher TDS rate of 20.00%.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">Applicable Rate</span>
                    <div className="text-xl font-black text-[#0071e3] mt-1">{tdsCalculation.effectiveRate}%</div>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-2xl">
                    <span className="text-[11px] font-bold text-rose-600">TDS to Deduct</span>
                    <div className="text-xl font-black text-rose-600 mt-1">₹{tdsCalculation.tdsAmount.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                    <span className="text-[11px] font-bold text-emerald-600">Net Pay to Vendor</span>
                    <div className="text-xl font-black text-emerald-600 mt-1">₹{tdsCalculation.netPayable.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">Challan 281 Due Date</span>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">7th of Next Month</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 6. DEPRECIATION & DTA/DTL TIMING DIFFERENCE ─────────────────── */}
            {activeTab === "depreciation" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Asset Purchase / Book Cost (₹)</label>
                    <input
                      type="number"
                      value={assetCost}
                      onChange={(e) => setAssetCost(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Asset Block / Category</label>
                    <select
                      value={assetCategory}
                      onChange={(e) => setAssetCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold outline-none"
                    >
                      {Object.entries(ASSET_RATES).map(([k, v]) => (
                        <option key={k} value={k}>{v.name} (IT: {v.itRate}%)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Useful Life under Co. Act (Years)</label>
                    <input
                      type="number"
                      value={usefulLifeYears}
                      onChange={(e) => setUsefulLifeYears(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="half-year"
                      checked={usedLessThan180Days}
                      onChange={(e) => setUsedLessThan180Days(e.target.checked)}
                      className="w-4 h-4 accent-[#0071e3]"
                    />
                    <label htmlFor="half-year" className="text-xs font-bold cursor-pointer">
                      Put to Use &lt; 180 Days (50% Half Rate u/s 32)
                    </label>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="addl-dep"
                      checked={isAdditionalDepApplicable}
                      onChange={(e) => setIsAdditionalDepApplicable(e.target.checked)}
                      className="w-4 h-4 accent-[#0071e3]"
                    />
                    <label htmlFor="addl-dep" className="text-xs font-bold cursor-pointer">
                      Additional Depreciation @ 20% (Manufacturing Plant)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-3xl space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#0071e3]">
                      <span>Income Tax Act (WDV)</span>
                      <span>Rate: {depCalculation.effectiveItRate}%</span>
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      Dep: ₹{depCalculation.itDepAmount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-slate-500 pt-2 border-t">
                      Closing WDV: <strong>₹{depCalculation.itClosingWdv.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="p-5 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-3xl space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-purple-600">
                      <span>Companies Act (SLM)</span>
                      <span>Life: {usefulLifeYears} Yrs</span>
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      Dep: ₹{depCalculation.coDepAmount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-slate-500 pt-2 border-t">
                      Closing Book: <strong>₹{depCalculation.coClosingBookValue.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-3xl space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-amber-600">
                      <span>AS-22 / Ind AS 12</span>
                      <span>{depCalculation.isDTL ? "DTL (Liability)" : "DTA (Asset)"}</span>
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      Timing Diff: ₹{Math.abs(depCalculation.timingDiff).toLocaleString("en-IN")}
                    </div>
                    <div className="text-slate-500 pt-2 border-t">
                      Deferred Tax Impact: <strong>₹{depCalculation.deferredTaxImpact.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 7. FINANCIAL AUDIT RATIOS & BANK CMA DATA ───────────────────── */}
            {activeTab === "ratios" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="border-b pb-2 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-[#0071e3]">
                    Financial Statement Inputs for CMA / Bank CC Limits
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border">
                    Bank MPBF Benchmark
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Current Assets (₹)</label>
                    <input
                      type="number"
                      value={currentAssets}
                      onChange={(e) => setCurrentAssets(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Current Liabilities (₹)</label>
                    <input
                      type="number"
                      value={currentLiabilities}
                      onChange={(e) => setCurrentLiabilities(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Inventory / Stock (₹)</label>
                    <input
                      type="number"
                      value={inventory}
                      onChange={(e) => setInventory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Total Debt / Loans (₹)</label>
                    <input
                      type="number"
                      value={totalDebt}
                      onChange={(e) => setTotalDebt(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Net Worth / Equity (₹)</label>
                    <input
                      type="number"
                      value={netWorth}
                      onChange={(e) => setNetWorth(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Annual Turnover / Sales (₹)</label>
                    <input
                      type="number"
                      value={annualTurnover}
                      onChange={(e) => setAnnualTurnover(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Net Profit After Tax (₹)</label>
                    <input
                      type="number"
                      value={netProfit}
                      onChange={(e) => setNetProfit(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-0.5">Trade Receivables (₹)</label>
                    <input
                      type="number"
                      value={tradeReceivables}
                      onChange={(e) => setTradeReceivables(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className={`p-4 rounded-2xl border ${ratiosCalculation.isCRHealthy ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                    <span className="text-slate-400 font-bold block">Current Ratio</span>
                    <div className="text-xl font-black mt-1">{ratiosCalculation.currentRatio} : 1</div>
                    <span className="text-[10px] text-slate-500 font-bold">Benchmark &gt;= 1.33</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-slate-400 font-bold block">Quick Ratio</span>
                    <div className="text-xl font-black mt-1">{ratiosCalculation.quickRatio} : 1</div>
                    <span className="text-[10px] text-slate-500 font-bold">Benchmark &gt;= 1.00</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${ratiosCalculation.isDERHealthy ? "bg-slate-50 dark:bg-slate-900" : "bg-rose-50 border-rose-200"}`}>
                    <span className="text-slate-400 font-bold block">Debt to Equity</span>
                    <div className="text-xl font-black mt-1">{ratiosCalculation.debtEquityRatio} : 1</div>
                    <span className="text-[10px] text-slate-500 font-bold">Benchmark &lt;= 2.00</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-slate-400 font-bold block">Net Profit Margin</span>
                    <div className="text-xl font-black text-emerald-600 mt-1">{ratiosCalculation.netProfitMargin}%</div>
                    <span className="text-[10px] text-slate-500 font-bold">ROE: {ratiosCalculation.roe}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── 8. NUMBER TO WORDS MODULE ─────────────────────────────────── */}
            {activeTab === "num2words" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Enter Amount in Figures (e.g. 1874960)
                  </label>
                  <input
                    type="number"
                    value={numInput}
                    onChange={(e) => setNumInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl p-4 text-xl sm:text-2xl font-black outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/40 space-y-3">
                  <span className="text-[11px] font-black text-[#0071e3] uppercase tracking-wider block">
                    Indian Currency Words Format (Cheques, Deeds &amp; Vouchers)
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                    {wordsOutput}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(wordsOutput)}
                    className="px-4 py-2 bg-[#0071e3] text-white rounded-xl text-xs font-bold transition shadow active:scale-95"
                  >
                    {copiedWords ? "✓ Copied to Clipboard!" : "📋 Copy in Words"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── OFFICIAL CA CLIENT COMPUTATION MEMO MODAL ──────────────────── */}
          {showPrintModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
              <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b">
                  <h2 className="text-lg font-black">Official Client Computation Memo Preview</h2>
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(false)}
                    className="text-slate-400 hover:text-slate-800 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <label className="font-bold text-slate-500 block mb-0.5">Client / Firm Name</label>
                    <input
                      type="text"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className="w-full bg-white border rounded-lg p-2 font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-0.5">PAN Number</label>
                    <input
                      type="text"
                      value={clientInfo.pan}
                      onChange={(e) => setClientInfo({ ...clientInfo, pan: e.target.value.toUpperCase() })}
                      className="w-full bg-white border rounded-lg p-2 font-semibold uppercase outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-0.5">CA Firm Name</label>
                    <input
                      type="text"
                      value={clientInfo.caFirm}
                      onChange={(e) => setClientInfo({ ...clientInfo, caFirm: e.target.value })}
                      className="w-full bg-white border rounded-lg p-2 font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-0.5">UDIN</label>
                    <input
                      type="text"
                      value={clientInfo.udin}
                      onChange={(e) => setClientInfo({ ...clientInfo, udin: e.target.value })}
                      className="w-full bg-white border rounded-lg p-2 font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-0.5">Assessment Year</label>
                    <input
                      type="text"
                      value={clientInfo.assessmentYear}
                      onChange={(e) => setClientInfo({ ...clientInfo, assessmentYear: e.target.value })}
                      className="w-full bg-white border rounded-lg p-2 font-semibold outline-none"
                    />
                  </div>
                </div>

                <div
                  id="ca-official-print-memo"
                  className="border-2 border-slate-900 p-8 rounded-2xl bg-white text-slate-900 font-sans space-y-6"
                >
                  <div className="text-center pb-4 border-b-2 border-slate-900">
                    <h2 className="text-xl font-black tracking-tight">{clientInfo.caFirm}</h2>
                    <p className="text-xs font-semibold text-slate-600">{clientInfo.caMembership} • UDIN: {clientInfo.udin}</p>
                    <div className="mt-2 inline-block bg-slate-100 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border">
                      STATEMENT OF TOTAL INCOME &amp; TAX COMPUTATION MEMO
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b">
                    <div><strong>Assessee / Client:</strong> {clientInfo.name}</div>
                    <div><strong>Assessment Year:</strong> {clientInfo.assessmentYear} (FY: {clientInfo.financialYear})</div>
                    <div><strong>PAN Number:</strong> {clientInfo.pan}</div>
                    <div><strong>Date of Computation:</strong> {clientInfo.date}</div>
                  </div>

                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-y border-slate-900">
                        <th className="p-2 text-left">Particulars</th>
                        <th className="p-2 text-right">Old Tax Regime (₹)</th>
                        <th className="p-2 text-right">New Tax Regime (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-bold">1. Gross Salary / Total Receipts</td>
                        <td className="p-2 text-right font-bold">₹{regimeCalculation.gross.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right font-bold">₹{regimeCalculation.gross.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="p-2 pl-4 text-slate-600">Less: Standard Deduction u/s 16(ia)</td>
                        <td className="p-2 text-right">₹50,000</td>
                        <td className="p-2 text-right">₹75,000</td>
                      </tr>
                      <tr>
                        <td className="p-2 pl-4 text-slate-600">Less: Chapter VI-A (80C, 80D, HRA, 24b)</td>
                        <td className="p-2 text-right">₹{(regimeCalculation.totalOldDeductions - 50000).toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right text-slate-400">N/A</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-2">2. Net Taxable Income</td>
                        <td className="p-2 text-right">₹{regimeCalculation.taxableOld.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right">₹{regimeCalculation.taxableNew.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="p-2">3. Tax on Total Income (Before Cess)</td>
                        <td className="p-2 text-right">₹{regimeCalculation.baseTaxOld.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right">₹{regimeCalculation.baseTaxNew.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="p-2 pl-4 text-slate-600">Add: Health &amp; Education Cess @ 4%</td>
                        <td className="p-2 text-right">₹{regimeCalculation.cessOld.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right">₹{regimeCalculation.cessNew.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-slate-100 font-black text-sm border-t border-slate-900">
                        <td className="p-2">TOTAL TAX PAYABLE</td>
                        <td className="p-2 text-right">₹{regimeCalculation.totalTaxOld.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right text-[#0071e3]">₹{regimeCalculation.totalTaxNew.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="p-3 bg-slate-50 rounded-xl border text-xs">
                    <strong>CA Recommendation: </strong>
                    {regimeCalculation.betterRegime === "New Regime"
                      ? `New Tax Regime is recommended for Assessee resulting in net tax savings of ₹${regimeCalculation.savings.toLocaleString("en-IN")}.`
                      : `Old Tax Regime is recommended for Assessee resulting in net tax savings of ₹${regimeCalculation.savings.toLocaleString("en-IN")}.`}
                  </div>

                  <div className="pt-8 flex justify-between items-end text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500">Certified as per Income Tax Act 1961 &amp; Finance Act 2024.</p>
                      <p className="text-[10px] text-slate-400">Generated via ToolBox CA Master Engine</p>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="w-40 border-b border-slate-900 mb-1" />
                      <p className="font-bold">Authorized Signatory</p>
                      <p className="text-[10px] text-slate-500">Chartered Accountant / Seal</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span>Download Complete Excel (.XLS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-6 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-black shadow-lg shadow-blue-500/25 flex items-center gap-2"
                  >
                    <span>🖨️</span>
                    <span>Print Clean A4 Document</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ProGate>
    </AuthGate>
  );
}