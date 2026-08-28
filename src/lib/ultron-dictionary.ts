/* ═══════════════════════════════════════════════════════════════════════════
 *  ULTRON 5.0 — MASSIVE LEXICON & 12-DIMENSIONAL SEMANTIC VECTOR DATABASE
 *  ─────────────────────────────────────────────────────────────────────────
 *  File: src/lib/ultron-dictionary.ts
 *
 *  Vector Dimensions (12D):
 *   [0] Physicality     (0 = abstract, 1 = concrete physical object)
 *   [1] Sentiment       (-1 = negative, 0 = neutral, +1 = positive)
 *   [2] Urgency         (0 = relaxed, 1 = extreme emergency)
 *   [3] Formality       (0 = slang/casual, 1 = statutory legal)
 *   [4] Legal Domain    (0 = none, 1 = pure jurisprudence)
 *   [5] Tax/Financial   (0 = none, 1 = banking/taxation)
 *   [6] Tech/Computing  (0 = none, 1 = computer science/tools)
 *   [7] Social/Human    (0 = impersonal, 1 = deeply human/relational)
 *   [8] Action/Verbness (0 = static entity, 1 = dynamic action)
 *   [9] Medical/Health  (0 = none, 1 = healthcare)
 *  [10] Academic/Govt   (0 = none, 1 = exam/government)
 *  [11] Mathematical    (0 = qualitative, 1 = quantitative/numeric)
 *
 *  Architect: Lakhan Kashyap • ToolBox Suite
 * ═══════════════════════════════════════════════════════════════════════════ */

export type Vec12 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];

export type DictionaryEntry = {
  v: Vec12;
  cat: "noun" | "verb" | "adj" | "adv" | "legal" | "tax" | "tech" | "social" | "qword" | "interj";
  valence: number;      // -1.0 to +1.0
  synonyms: string[];
  hinglish: string[];
  definition: string;
};

export const ULTRON_DICTIONARY: Record<string, DictionaryEntry> = {
  // ── LEGAL & CRIMINAL LAW (BNS / BNSS / IPC / CRPC) ─────────────────────────
  murder: {
    v: [0.8, -0.95, 0.95, 0.9, 1.0, 0.0, 0.0, 0.7, 0.9, 0.8, 0.3, 0.0],
    cat: "legal",
    valence: -0.95,
    synonyms: ["homicide", "killing", "manslaughter", "slay", "assassination"],
    hinglish: ["hatya", "qatl", "maar dalna", "302", "103", "bns 103"],
    definition: "Unlawful premeditated killing of one human being by another. Governed by BNS Sec 103 (Old IPC 302)."
  },
  theft: {
    v: [0.7, -0.7, 0.6, 0.8, 0.95, 0.5, 0.0, 0.4, 0.8, 0.0, 0.2, 0.3],
    cat: "legal",
    valence: -0.7,
    synonyms: ["stealing", "larceny", "robbery", "pilferage"],
    hinglish: ["chori", "loot", "utha lena", "379", "303", "bns 303"],
    definition: "Dishonestly moving moveable property out of possession without consent. BNS Sec 303 (Old IPC 379)."
  },
  cheating: {
    v: [0.4, -0.8, 0.7, 0.8, 0.95, 0.8, 0.0, 0.6, 0.7, 0.0, 0.3, 0.4],
    cat: "legal",
    valence: -0.8,
    synonyms: ["fraud", "deception", "swindling", "forgery", "scam"],
    hinglish: ["dhokha", "420", "318", "bns 318", "ghotala", "chuna lagana"],
    definition: "Deceiving any person fraudulently or dishonestly to deliver property. BNS Sec 318(4) (Old IPC 420)."
  },
  bail: {
    v: [0.3, 0.2, 0.85, 0.95, 1.0, 0.2, 0.0, 0.7, 0.6, 0.0, 0.4, 0.2],
    cat: "legal",
    valence: 0.2,
    synonyms: ["surety", "bond", "release", "conditional freedom"],
    hinglish: ["jamanat", "rihayi", "439", "483", "satender antil", "gudikanti"],
    definition: "Temporary release of an accused person awaiting trial. BNSS Sec 483 (Old CrPC 439). Bail is the rule."
  },
  anticipatory_bail: {
    v: [0.2, 0.3, 0.9, 0.95, 1.0, 0.1, 0.0, 0.6, 0.5, 0.0, 0.4, 0.1],
    cat: "legal",
    valence: 0.3,
    synonyms: ["pre-arrest bail", "advance bail", "protective order"],
    hinglish: ["advance jamanat", "438", "482", "giraftari se pehle"],
    definition: "Direction to release on bail a person anticipating arrest. BNSS Sec 482 (Old CrPC 438)."
  },
  fir: {
    v: [0.5, -0.4, 0.8, 0.9, 1.0, 0.0, 0.0, 0.5, 0.8, 0.0, 0.7, 0.0],
    cat: "legal",
    valence: -0.4,
    synonyms: ["first information report", "police complaint", "criminal report"],
    hinglish: ["shikayat", "police report", "darj karwana", "154", "173", "lalita kumari"],
    definition: "First Information Report recorded by police under BNSS Sec 173 for cognizable offences."
  },
  quashing: {
    v: [0.2, 0.5, 0.7, 0.95, 1.0, 0.0, 0.0, 0.5, 0.7, 0.0, 0.4, 0.0],
    cat: "legal",
    valence: 0.5,
    synonyms: ["annulment", "dismissal", "nullification", "setting aside"],
    hinglish: ["fir radd", "cancel fir", "482", "528", "bhajan lal"],
    definition: "Inherent powers of High Court under BNSS Sec 528 (CrPC 482) to quash frivolous or malicious criminal proceedings."
  },
  cheque_bounce: {
    v: [0.6, -0.7, 0.75, 0.9, 0.95, 0.9, 0.0, 0.6, 0.7, 0.0, 0.2, 0.7],
    cat: "legal",
    valence: -0.7,
    synonyms: ["dishonour of cheque", "insufficient funds", "return memo", "138 ni act"],
    hinglish: ["check bounce", "paisa nahi tha", "138 notice", "speed post", "rangappa"],
    definition: "Criminal offence under Sec 138 Negotiable Instruments Act upon cheque dishonour due to insufficiency of funds."
  },
  dowry_harassment: {
    v: [0.6, -0.9, 0.85, 0.9, 1.0, 0.4, 0.0, 0.9, 0.7, 0.3, 0.3, 0.0],
    cat: "legal",
    valence: -0.9,
    synonyms: ["matrimonial cruelty", "domestic violence", "dowry death"],
    hinglish: ["dahej", "498a", "85", "bns 85", "sasural me pareshani"],
    definition: "Cruelty by husband or relatives of husband for unlawful property demands. BNS Sec 85/86 (Old IPC 498A)."
  },
  vakalatnama: {
    v: [0.7, 0.2, 0.4, 0.95, 1.0, 0.1, 0.0, 0.7, 0.5, 0.0, 0.5, 0.0],
    cat: "legal",
    valence: 0.2,
    synonyms: ["power of attorney", "advocate appointment", "memo of appearance"],
    hinglish: ["mukhtarnama", "vakeel patra", "court sign", "advocate authorization"],
    definition: "Formal legal document authorizing an advocate to represent a client in court."
  },

  // ── INCOME TAX & CHARTERED ACCOUNTANCY ────────────────────────────────────
  income_tax: {
    v: [0.3, -0.2, 0.5, 0.85, 0.2, 1.0, 0.0, 0.5, 0.6, 0.0, 0.8, 0.95],
    cat: "tax",
    valence: -0.2,
    synonyms: ["direct tax", "itr", "taxation", "revenue collection"],
    hinglish: ["aaykar", "tax katna", "tax slab", "incometax return", "budget 2024"],
    definition: "Direct tax levied on the annual net income of individuals and corporations under Income Tax Act 1961."
  },
  new_tax_regime: {
    v: [0.2, 0.4, 0.4, 0.85, 0.1, 1.0, 0.0, 0.4, 0.4, 0.0, 0.8, 0.9],
    cat: "tax",
    valence: 0.4,
    synonyms: ["section 115bac", "default regime", "concessional tax rates"],
    hinglish: ["naya tax slab", "7.75 lakh zero tax", "75000 standard deduction", "ay 2025-26"],
    definition: "Default income tax regime with revised lower slab rates and ₹75k standard deduction with ₹7.75L zero tax threshold."
  },
  standard_deduction: {
    v: [0.2, 0.7, 0.3, 0.8, 0.1, 0.95, 0.0, 0.3, 0.4, 0.0, 0.6, 0.8],
    cat: "tax",
    valence: 0.7,
    synonyms: ["flat deduction", "salary exemption", "statutory allowance"],
    hinglish: ["75000 chhoot", "50000 deduction", "salaried deduction", "tax saving"],
    definition: "Flat statutory tax deduction of ₹75,000 for salaried employees under New Tax Regime AY 2025-26."
  },
  section_87a: {
    v: [0.2, 0.8, 0.4, 0.9, 0.1, 1.0, 0.0, 0.4, 0.5, 0.0, 0.7, 0.85],
    cat: "tax",
    valence: 0.8,
    synonyms: ["tax rebate", "zero tax credit", "full rebate"],
    hinglish: ["87a rebate", "zero tax", "7 lakh tak no tax", "tax mafi"],
    definition: "Tax rebate provision granting 100% tax relief up to ₹7,00,000 taxable income in New Tax Regime."
  },
  advance_tax: {
    v: [0.3, -0.1, 0.75, 0.85, 0.2, 0.95, 0.0, 0.4, 0.7, 0.0, 0.6, 0.85],
    cat: "tax",
    valence: -0.1,
    synonyms: ["pay as you earn", "quarterly tax", "installment tax"],
    hinglish: ["15 june", "15 sept", "15 dec", "15 march", "234b", "234c interest"],
    definition: "Statutory scheme requiring taxpayers with >₹10k tax liability to pay tax in 4 quarterly installments."
  },
  hra_exemption: {
    v: [0.2, 0.6, 0.3, 0.8, 0.1, 0.9, 0.0, 0.5, 0.4, 0.0, 0.5, 0.8],
    cat: "tax",
    valence: 0.6,
    synonyms: ["house rent allowance", "section 10(13a)", "rental deduction"],
    hinglish: ["kiraya chhoot", "rent receipt", "hra calculation", "50 percent metro"],
    definition: "Tax exemption on House Rent Allowance under Section 10(13A) of Income Tax Act."
  },
  gst_invoice: {
    v: [0.6, 0.1, 0.4, 0.85, 0.2, 0.95, 0.2, 0.4, 0.6, 0.0, 0.7, 0.8],
    cat: "tax",
    valence: 0.1,
    synonyms: ["tax invoice", "commercial bill", "e-way bill", "gstin"],
    hinglish: ["gst bill", "cgst sgst igst", "bilty", "hsn sac code"],
    definition: "Mandatory commercial document issued under GST Law detailing supply of goods/services, tax rates and GSTIN."
  },

  // ── TECHNOLOGY & TOOLBOX PLATFORM ─────────────────────────────────────────
  pdf_merge: {
    v: [0.6, 0.4, 0.3, 0.4, 0.0, 0.0, 1.0, 0.2, 0.8, 0.0, 0.2, 0.3],
    cat: "tech",
    valence: 0.4,
    synonyms: ["combine pdf", "join documents", "pdf concatenation"],
    hinglish: ["pdf jodo", "ek sath karna", "merge file", "all pdf into one"],
    definition: "Browser-side binary operation combining multiple PDF streams into a single structured PDF file."
  },
  pdf_compress: {
    v: [0.5, 0.5, 0.3, 0.4, 0.0, 0.0, 1.0, 0.2, 0.8, 0.0, 0.2, 0.4],
    cat: "tech",
    valence: 0.5,
    synonyms: ["reduce pdf size", "optimize pdf", "shrink file"],
    hinglish: ["pdf chhota karo", "size kam karna", "kb me convert", "mb to kb"],
    definition: "Lossless/lossy compression of embedded raster images and font subsets to reduce PDF file size."
  },
  exam_photo_resizer: {
    v: [0.7, 0.6, 0.7, 0.7, 0.0, 0.0, 0.9, 0.6, 0.8, 0.0, 1.0, 0.7],
    cat: "tech",
    valence: 0.6,
    synonyms: ["upsc photo crop", "ssc signature resize", "admit card photo specs"],
    hinglish: ["20kb se 50kb", "signature 10kb 20kb", "passport size photo", "upsc form"],
    definition: "Canvas-based image dimension & quality transformer matching official UPSC, SSC, and NTA guidelines."
  },
  ats_resume_builder: {
    v: [0.7, 0.8, 0.5, 0.7, 0.0, 0.2, 0.7, 0.9, 0.8, 0.0, 0.8, 0.2],
    cat: "tech",
    valence: 0.8,
    synonyms: ["curriculum vitae creator", "ats friendly cv", "job application generator"],
    hinglish: ["biodata maker", "naukri ke liye cv", "ats clean format", "1-click resume"],
    definition: "Single-page responsive ATS-compliant resume builder with live preview and clean PDF export."
  },
  ocr_extractor: {
    v: [0.5, 0.5, 0.4, 0.6, 0.1, 0.1, 1.0, 0.3, 0.8, 0.0, 0.5, 0.2],
    cat: "tech",
    valence: 0.5,
    synonyms: ["optical character recognition", "image to text", "scan reader"],
    hinglish: ["photo se text nikalna", "image padhna", "extract handwriting"],
    definition: "Client-side neural character recognition converting raster images into editable UTF-8 text strings."
  },

  // ── HUMAN EMOTIONS & SOCIAL CONNECTIONS ───────────────────────────────────
  frustration: {
    v: [0.3, -0.8, 0.7, 0.1, 0.0, 0.0, 0.0, 0.9, 0.4, 0.4, 0.0, 0.0],
    cat: "social",
    valence: -0.8,
    synonyms: ["annoyance", "irritation", "anger", "exasperation"],
    hinglish: ["gussa", "dimag kharab", "pareshaan", "pareshani", "chidh"],
    definition: "Negative emotional state arising from blocked progress, unresolved problems or system failure."
  },
  gratitude: {
    v: [0.2, 0.9, 0.2, 0.4, 0.0, 0.0, 0.0, 0.95, 0.3, 0.0, 0.0, 0.0],
    cat: "social",
    valence: 0.9,
    synonyms: ["thankfulness", "appreciation", "acknowledgment"],
    hinglish: ["shukriya", "dhanyavaad", "thanks bhai", "bahut badhiya", "maza aa gaya"],
    definition: "Warm feeling of appreciation and thankfulness towards a helpful action."
  },
  confusion: {
    v: [0.2, -0.4, 0.5, 0.2, 0.0, 0.0, 0.0, 0.8, 0.2, 0.0, 0.2, 0.0],
    cat: "social",
    valence: -0.4,
    synonyms: ["perplexity", "bewilderment", "uncertainty"],
    hinglish: ["samajh nahi aa raha", "ulajh gaya", "kya karu", "doubt hai"],
    definition: "Lack of understanding or certainty about a situation, law, tax clause or technical step."
  },
  founder_identity: {
    v: [0.8, 0.95, 0.4, 0.8, 0.3, 0.4, 0.9, 1.0, 0.6, 0.0, 0.7, 0.2],
    cat: "social",
    valence: 0.95,
    synonyms: ["chief architect", "creator", "visionary developer"],
    hinglish: ["lakhan kashyap", "lakhan sir", "kisne banaya", "toolbox founder", "boss"],
    definition: "Lakhan Kashyap, Founder & Chief Architect of ToolBox Suite and designer of ULTRON AI Core."
  }
};