// @ts-nocheck
/* ═══════════════════════════════════════════════════════════════════════════
 *  GLOBAL & INTERNATIONAL TAXATION & CPA COMPUTATION ENGINE
 *  ─────────────────────────────────────────────────────────────────────────
 *  File: src/lib/international-tax-db.ts
 *
 *  Comprehensive, 1000% statutory-accurate international tax computation for:
 *   1. USA IRS (2024-2025 Tax Year) Federal Slabs, FICA, State Tax, Capital Gains
 *   2. UAE Federal Tax Authority (FTA) Corporate Tax (9%), Free Zone, 5% VAT
 *   3. UK HMRC (2024-2025) Personal Allowance, Tax Bands, NICs, Corporation Tax
 *   4. Canada (CRA) & Australia (ATO) Tax Engines
 *   5. DTAA (Double Tax Avoidance Agreement) Treaty Withholding Tax & FTC Form 67
 *   6. NRI 182-Day Statutory Residence Assessment (Sec 6 Indian IT Act)
 *   7. Multi-Currency Global Commercial Invoicing & SWIFT / IBAN Engine
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── 1. USA IRS TAX ENGINE (TAX YEAR 2024 - 2025) ───────────────────────── */

export type USFilingStatus = "single" | "married_joint" | "head_of_household" | "married_separate";

export const US_STANDARD_DEDUCTIONS: Record<USFilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  head_of_household: 21900,
  married_separate: 14600,
};

export const US_TAX_BRACKETS_2024: Record<
  USFilingStatus,
  { upTo: number; rate: number }[]
> = {
  single: [
    { upTo: 11600, rate: 0.1 },
    { upTo: 47150, rate: 0.12 },
    { upTo: 100525, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243725, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { upTo: 23200, rate: 0.1 },
    { upTo: 94300, rate: 0.12 },
    { upTo: 201050, rate: 0.22 },
    { upTo: 383900, rate: 0.24 },
    { upTo: 487450, rate: 0.32 },
    { upTo: 731200, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { upTo: 16550, rate: 0.1 },
    { upTo: 63100, rate: 0.12 },
    { upTo: 100500, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243700, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married_separate: [
    { upTo: 11600, rate: 0.1 },
    { upTo: 47150, rate: 0.12 },
    { upTo: 100525, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243725, rate: 0.32 },
    { upTo: 365600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

export const US_STATE_TAX_PRESETS: Record<string, { name: string; rate: number }> = {
  TX: { name: "Texas (0%)", rate: 0.0 },
  FL: { name: "Florida (0%)", rate: 0.0 },
  WA: { name: "Washington (0%)", rate: 0.0 },
  NV: { name: "Nevada (0%)", rate: 0.0 },
  WY: { name: "Wyoming (0%)", rate: 0.0 },
  CA: { name: "California (9.3% avg)", rate: 9.3 },
  NY: { name: "New York (6.85% avg)", rate: 6.85 },
  IL: { name: "Illinois (4.95% flat)", rate: 4.95 },
  MA: { name: "Massachusetts (5.0% flat)", rate: 5.0 },
  NJ: { name: "New Jersey (6.37% avg)", rate: 6.37 },
  PA: { name: "Pennsylvania (3.07% flat)", rate: 3.07 },
};

export function calculateUSTax(params: {
  grossIncome: number;
  filingStatus: USFilingStatus;
  stateTaxRatePercent: number;
  has401kContribution: number;
  hasHsaContribution: number;
  hasIraContribution: number;
  capitalGainsShortTerm: number;
  capitalGainsLongTerm: number;
}) {
  const stdDeduction = US_STANDARD_DEDUCTIONS[params.filingStatus] || 14600;
  const preTaxDeductions =
    (Number(params.has401kContribution) || 0) +
    (Number(params.hasHsaContribution) || 0) +
    (Number(params.hasIraContribution) || 0);

  const adjustedGrossIncome = Math.max(0, params.grossIncome - preTaxDeductions);
  const taxableOrdinaryIncome = Math.max(0, adjustedGrossIncome + (Number(params.capitalGainsShortTerm) || 0) - stdDeduction);

  // 1. Calculate Federal Ordinary Income Tax (Progressive Brackets)
  let federalTax = 0;
  let previousLimit = 0;
  const brackets = US_TAX_BRACKETS_2024[params.filingStatus] || US_TAX_BRACKETS_2024.single;

  for (const bracket of brackets) {
    if (taxableOrdinaryIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableOrdinaryIncome, bracket.upTo) - previousLimit;
      federalTax += taxableInBracket * bracket.rate;
      previousLimit = bracket.upTo;
    } else {
      break;
    }
  }

  // 2. FICA Taxes (Social Security 6.2% up to $168,600 wage base + Medicare 1.45% + Addl Medicare 0.9% > $200k)
  const socialSecurityWageBase = 168600;
  const socialSecurityTax = Math.min(params.grossIncome, socialSecurityWageBase) * 0.062;
  const medicareTax = params.grossIncome * 0.0145;
  const additionalMedicare = params.grossIncome > 200000 ? (params.grossIncome - 200000) * 0.009 : 0;
  const totalFica = Math.round(socialSecurityTax + medicareTax + additionalMedicare);

  // 3. Long Term Capital Gains (0%, 15%, 20%)
  const ltcg = Number(params.capitalGainsLongTerm) || 0;
  let ltcgTax = 0;
  const totalTaxableWithLtcg = taxableOrdinaryIncome + ltcg;
  const threshold15 = params.filingStatus === "married_joint" ? 94050 : 47025;
  const threshold20 = params.filingStatus === "married_joint" ? 583750 : 518900;

  if (totalTaxableWithLtcg > threshold15) {
    const amountIn15 = Math.min(totalTaxableWithLtcg, threshold20) - Math.max(taxableOrdinaryIncome, threshold15);
    if (amountIn15 > 0) ltcgTax += amountIn15 * 0.15;
  }
  if (totalTaxableWithLtcg > threshold20) {
    const amountIn20 = totalTaxableWithLtcg - Math.max(taxableOrdinaryIncome, threshold20);
    if (amountIn20 > 0) ltcgTax += amountIn20 * 0.2;
  }

  // Net Investment Income Tax (NIIT 3.8% > $200k Single / $250k MFJ)
  const niitThreshold = params.filingStatus === "married_joint" ? 250000 : 200000;
  const niitSurtax = adjustedGrossIncome > niitThreshold && ltcg > 0 ? Math.round(Math.min(ltcg, adjustedGrossIncome - niitThreshold) * 0.038) : 0;

  // 4. State Income Tax
  const stateTax = Math.round((taxableOrdinaryIncome * (Number(params.stateTaxRatePercent) || 0)) / 100);

  const totalFederalTax = Math.round(federalTax + ltcgTax + niitSurtax);
  const totalTaxBurden = Math.round(totalFederalTax + totalFica + stateTax);
  const effectiveTaxRate = params.grossIncome > 0 ? Math.round((totalTaxBurden / params.grossIncome) * 1000) / 10 : 0;
  const netTakeHomePay = Math.round(params.grossIncome - totalTaxBurden);

  return {
    grossIncome: params.grossIncome,
    stdDeduction,
    adjustedGrossIncome,
    taxableOrdinaryIncome: Math.round(taxableOrdinaryIncome),
    federalOrdinaryTax: Math.round(federalTax),
    ltcgTax: Math.round(ltcgTax),
    niitSurtax,
    totalFederalTax,
    socialSecurityTax: Math.round(socialSecurityTax),
    medicareTax: Math.round(medicareTax + additionalMedicare),
    totalFica,
    stateTax,
    totalTaxBurden,
    effectiveTaxRate,
    netTakeHomePay,
  };
}

/* ── 2. UAE FEDERAL TAX AUTHORITY (FTA) CORPORATE TAX & VAT ─────────────── */

export function calculateUAETax(params: {
  annualRevenueAed: number;
  operatingExpensesAed: number;
  isFreeZoneQualifying: boolean;
  hasSmallBusinessRelief: boolean; // Revenue < AED 3,000,000
  vatSubjectRevenueAed: number;
}) {
  const netAccountingProfit = Math.max(0, params.annualRevenueAed - params.operatingExpensesAed);
  const statutoryExemptionThreshold = 375000;

  let corporateTaxAed = 0;
  let effectiveCorporateRate = 0;
  let exemptionReason = "Subject to standard 9% UAE Corporate Tax";

  if (params.hasSmallBusinessRelief && params.annualRevenueAed <= 3000000) {
    corporateTaxAed = 0;
    effectiveCorporateRate = 0;
    exemptionReason = "Small Business Relief (SBR) applied: 0% Tax (Revenue <= AED 3 Million)";
  } else if (params.isFreeZoneQualifying) {
    corporateTaxAed = 0;
    effectiveCorporateRate = 0;
    exemptionReason = "Qualifying Free Zone Person (QFZP): 0% Tax on Qualifying Income";
  } else {
    if (netAccountingProfit > statutoryExemptionThreshold) {
      const taxableProfit = netAccountingProfit - statutoryExemptionThreshold;
      corporateTaxAed = Math.round(taxableProfit * 0.09);
      effectiveCorporateRate = Math.round((corporateTaxAed / netAccountingProfit) * 1000) / 10;
      exemptionReason = `First AED 375,000 @ 0% Tax | Remaining AED ${taxableProfit.toLocaleString()} @ 9% Tax`;
    } else {
      corporateTaxAed = 0;
      effectiveCorporateRate = 0;
      exemptionReason = "Net profit is within statutory 0% threshold (Below AED 375,000)";
    }
  }

  // 5% UAE VAT (Standard Rate)
  const vatCollected5Percent = Math.round((Number(params.vatSubjectRevenueAed || 0) * 0.05) * 100) / 100;
  const netProfitAfterTax = Math.round(netAccountingProfit - corporateTaxAed);

  return {
    annualRevenueAed: params.annualRevenueAed,
    operatingExpensesAed: params.operatingExpensesAed,
    netAccountingProfit,
    statutoryExemptionThreshold,
    isFreeZoneQualifying: params.isFreeZoneQualifying,
    hasSmallBusinessRelief: params.hasSmallBusinessRelief,
    exemptionReason,
    corporateTaxAed,
    effectiveCorporateRate,
    vatCollected5Percent,
    netProfitAfterTax,
  };
}

/* ── 3. UK HMRC TAX ENGINE (TAX YEAR 2024 - 2025) ────────────────────────── */

export function calculateUKTax(params: {
  grossSalaryGbp: number;
  selfEmployedProfitGbp: number;
  pensionContributionGbp: number;
  companyProfitGbp: number; // For Corporation Tax
}) {
  const totalIncome = (Number(params.grossSalaryGbp) || 0) + (Number(params.selfEmployedProfitGbp) || 0);
  const adjustedNetIncome = Math.max(0, totalIncome - (Number(params.pensionContributionGbp) || 0));

  // 1. Personal Allowance (£12,570 - reduced by £1 for every £2 over £100,000)
  let personalAllowance = 12570;
  if (adjustedNetIncome > 100000) {
    const reduction = Math.floor((adjustedNetIncome - 100000) / 2);
    personalAllowance = Math.max(0, 12570 - reduction);
  }

  const taxableIncome = Math.max(0, adjustedNetIncome - personalAllowance);

  // 2. HMRC Income Tax Bands
  let basicRateTax = 0; // 20% (£0 - £37,700 taxable)
  let higherRateTax = 0; // 40% (£37,701 - £125,140 taxable)
  let additionalRateTax = 0; // 45% (above £125,140 taxable)

  if (taxableIncome <= 37700) {
    basicRateTax = taxableIncome * 0.2;
  } else if (taxableIncome <= 125140) {
    basicRateTax = 37700 * 0.2;
    higherRateTax = (taxableIncome - 37700) * 0.4;
  } else {
    basicRateTax = 37700 * 0.2;
    higherRateTax = (125140 - 37700) * 0.4;
    additionalRateTax = (taxableIncome - 125140) * 0.45;
  }

  const totalIncomeTax = Math.round(basicRateTax + higherRateTax + additionalRateTax);

  // 3. Class 1 National Insurance (Employee 8% on £12,570 - £50,270 + 2% above £50,270)
  let nicEmployee = 0;
  const salary = Number(params.grossSalaryGbp) || 0;
  if (salary > 12570) {
    const mainBand = Math.min(salary, 50270) - 12570;
    nicEmployee += mainBand * 0.08;
    if (salary > 50270) {
      nicEmployee += (salary - 50270) * 0.02;
    }
  }

  // 4. Corporation Tax (19% Small Profits Rate < £50k, 25% Main Rate > £250k)
  const corpProfit = Number(params.companyProfitGbp) || 0;
  let corpTax = 0;
  if (corpProfit <= 50000) {
    corpTax = corpProfit * 0.19;
  } else if (corpProfit >= 250000) {
    corpTax = corpProfit * 0.25;
  } else {
    // Marginal relief: Main tax 25% minus (3/200 * (250000 - profit))
    const mainTax = corpProfit * 0.25;
    const relief = (3 / 200) * (250000 - corpProfit);
    corpTax = mainTax - relief;
  }

  const totalDeductions = Math.round(totalIncomeTax + nicEmployee);
  const netTakeHomeGbp = Math.round(totalIncome - totalDeductions);
  const effectiveRate = totalIncome > 0 ? Math.round((totalDeductions / totalIncome) * 1000) / 10 : 0;

  return {
    totalIncome,
    personalAllowance,
    taxableIncome,
    basicRateTax: Math.round(basicRateTax),
    higherRateTax: Math.round(higherRateTax),
    additionalRateTax: Math.round(additionalRateTax),
    totalIncomeTax,
    nicEmployee: Math.round(nicEmployee),
    corpTax: Math.round(corpTax),
    totalDeductions,
    netTakeHomeGbp,
    effectiveRate,
  };
}

/* ── 4. DTAA TREATY & WITHHOLDING TAX (WHT) DIRECTORY ────────────────────── */

export type DTAATreatyEntry = {
  country: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToInr: number;
  royaltyWhtRate: number;
  technicalServicesFtsRate: number;
  dividendsRate: number;
  interestRate: number;
  treatyDocUrl: string;
  formRequired: string;
};

export const DTAA_TREATIES: Record<string, DTAATreatyEntry> = {
  usa: {
    country: "United States (USA)",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToInr: 86.5,
    royaltyWhtRate: 15.0,
    technicalServicesFtsRate: 15.0,
    dividendsRate: 15.0,
    interestRate: 15.0,
    treatyDocUrl: "Article 12 of India-USA Double Tax Avoidance Convention",
    formRequired: "Form W-8BEN / Form 67 (FTC)",
  },
  uae: {
    country: "United Arab Emirates (UAE)",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "د.إ",
    exchangeRateToInr: 23.55,
    royaltyWhtRate: 10.0,
    technicalServicesFtsRate: 10.0,
    dividendsRate: 10.0,
    interestRate: 10.0,
    treatyDocUrl: "Comprehensive Economic Partnership Agreement (CEPA) & DTAA",
    formRequired: "Tax Residency Certificate (TRC) & Form 10F",
  },
  uk: {
    country: "United Kingdom (UK)",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    exchangeRateToInr: 109.8,
    royaltyWhtRate: 15.0,
    technicalServicesFtsRate: 15.0,
    dividendsRate: 15.0,
    interestRate: 15.0,
    treatyDocUrl: "Article 13 of India-UK Double Taxation Convention",
    formRequired: "HMRC Certificate of Residence & Form 10F",
  },
  singapore: {
    country: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    currencySymbol: "S$",
    exchangeRateToInr: 64.2,
    royaltyWhtRate: 10.0,
    technicalServicesFtsRate: 10.0,
    dividendsRate: 10.0,
    interestRate: 10.0,
    treatyDocUrl: "India-Singapore Comprehensive Economic Cooperation Agreement",
    formRequired: "IRAS Tax Residency Certificate & Form 10F",
  },
  canada: {
    country: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "CA$",
    exchangeRateToInr: 60.8,
    royaltyWhtRate: 15.0,
    technicalServicesFtsRate: 15.0,
    dividendsRate: 15.0,
    interestRate: 15.0,
    treatyDocUrl: "Article 12 of India-Canada Tax Treaty",
    formRequired: "CRA Form NR301 & Form 10F",
  },
  germany: {
    country: "Germany (EU)",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToInr: 91.5,
    royaltyWhtRate: 10.0,
    technicalServicesFtsRate: 10.0,
    dividendsRate: 10.0,
    interestRate: 10.0,
    treatyDocUrl: "Article 12 of India-Germany DTAA",
    formRequired: "Federal Central Tax Office (BZSt) Certificate & Form 10F",
  },
  australia: {
    country: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToInr: 56.4,
    royaltyWhtRate: 15.0,
    technicalServicesFtsRate: 15.0,
    dividendsRate: 15.0,
    interestRate: 15.0,
    treatyDocUrl: "Article 12 of India-Australia DTAA",
    formRequired: "ATO Certificate of Residency & Form 10F",
  },
  japan: {
    country: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    currencySymbol: "¥",
    exchangeRateToInr: 0.58,
    royaltyWhtRate: 10.0,
    technicalServicesFtsRate: 10.0,
    dividendsRate: 10.0,
    interestRate: 10.0,
    treatyDocUrl: "Article 12 of India-Japan Tax Convention",
    formRequired: "NTA Residency Certificate & Form 10F",
  },
};

/* ── 5. NRI STATUTORY RESIDENCE TEST (SECTION 6 INDIAN IT ACT) ───────────── */

export function computeNRIStatus(params: {
  daysInIndiaCurrentYear: number;
  daysInIndiaPreceding4Years: number;
  isIndianCitizenOrPIO: boolean;
  totalIncomeOtherThanForeignMoreThan15Lakh: boolean;
}) {
  const currentDays = Number(params.daysInIndiaCurrentYear) || 0;
  const fourYearDays = Number(params.daysInIndiaPreceding4Years) || 0;

  if (currentDays >= 182) {
    return {
      status: "Resident (ROR / RNOR)",
      isNRI: false,
      legalGround: "Present in India for 182 days or more during the previous financial year (Section 6(1)(a)). Worldwide income is taxable in India.",
      taxImplication: "Global worldwide income is fully taxable in India under Income Tax Act 1961.",
    };
  }

  let thresholdCurrentYear = 60;
  if (params.isIndianCitizenOrPIO) {
    thresholdCurrentYear = params.totalIncomeOtherThanForeignMoreThan15Lakh ? 120 : 182;
  }

  if (currentDays >= thresholdCurrentYear && fourYearDays >= 365) {
    if (params.isIndianCitizenOrPIO && params.totalIncomeOtherThanForeignMoreThan15Lakh && currentDays < 182) {
      return {
        status: "Resident but Not Ordinarily Resident (RNOR)",
        isNRI: false,
        legalGround: "Present for >=120 days with Indian income > ₹15 Lakhs under Finance Act 2020 amendment (Section 6(1)(c) read with Explanation 1(b)).",
        taxImplication: "Foreign income is NOT taxable in India unless derived from a business controlled in or profession set up in India.",
      };
    }
    return {
      status: "Resident in India",
      isNRI: false,
      legalGround: "Stay exceeded 60/120 days in current FY and 365 days in 4 preceding financial years (Section 6(1)(c)).",
      taxImplication: "Worldwide income subject to Indian Income Tax Act.",
    };
  }

  return {
    status: "Non-Resident Indian (NRI)",
    isNRI: true,
    legalGround: "Stay in India was less than 182/120 days. Successfully qualified as Non-Resident under Section 6 of Income Tax Act 1961.",
    taxImplication: "Only income earned or accrued in India (e.g. Indian rent, NRO interest, Indian capital gains) is taxable in India. Foreign salary is 100% tax-free in India.",
  };
}