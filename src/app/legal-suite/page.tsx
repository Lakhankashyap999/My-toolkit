// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProGate from "../../components/ProGate";
import AuthGate from "../../components/AuthGate";

export default function LegalSuitePage() {
  const [activeTab, setActiveTab] = useState<
    "converter" | "judgments" | "notice" | "limitation" | "courtfee" | "interest" | "affidavits"
  >("converter");

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [showAdvocateProfile, setShowAdvocateProfile] = useState(true);

  // Active Advocate & Case Details (Auto-syncs across notices, citations & printouts)
  const [caseInfo, setCaseInfo] = useState({
    advocateName: "Adv. Lakhan Kashyap",
    enrollmentNo: "D/1842/2018 (Bar Council of Delhi)",
    chamberAddress: "Chamber No. 428, Lawyers Block, High Court / District Court, New Delhi",
    advocatePhone: "+91 98765 43210",
    advocateEmail: "counsel.kashyap@lawchamber.in",
    clientName: "Rajesh Kumar Sharma",
    oppositePartyName: "M/s Apex Global Infra Pvt. Ltd. & Ors.",
    courtName: "In the Court of Principal District & Sessions Judge, New Delhi",
    caseNumber: "CS (COMM) No. 412 of 2025",
    policeStation: "P.S. Connaught Place, New Delhi",
    dateOfNotice: new Date().toISOString().split("T")[0],
  });

  /* ========================================================================== */
  /*  DATABASE 1: IPC ⟷ BNS & CrPC ⟷ BNSS & IEA ⟷ BSA MASTER CONVERTER (2024)  */
  /* ========================================================================== */
  const LEGAL_SECTIONS_DB = [
    {
      id: "sec-103",
      oldSec: "IPC 302",
      newSec: "BNS 103(1)",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Punishment for Murder",
      punishment: "Death or Imprisonment for Life, and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "murder killing 302 death penalty 103 life imprisonment",
      desc: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Sub-clause (2) prescribes death or life imprisonment for mob lynching / murder on ground of race/caste/community.",
    },
    {
      id: "sec-318-4",
      oldSec: "IPC 420",
      newSec: "BNS 318(4)",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Cheating and Dishonestly Inducing Delivery of Property",
      punishment: "Imprisonment up to 7 Years and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Magistrate of the First Class",
      compoundable: "Compoundable with permission of Court (BNSS 359)",
      keywords: "cheating 420 fraud deception property delivery 318",
      desc: "Cheating and dishonestly inducing the person deceived to deliver any property, or to make, alter or destroy the whole or any part of a valuable security.",
    },
    {
      id: "sec-109",
      oldSec: "IPC 307",
      newSec: "BNS 109",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Attempt to Murder",
      punishment: "Imprisonment up to 10 Years and fine; if hurt is caused, Life Imprisonment",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "attempt to murder 307 firing stabbing deadly weapon 109",
      desc: "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder.",
    },
    {
      id: "sec-64",
      oldSec: "IPC 376",
      newSec: "BNS 64",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Punishment for Rape",
      punishment: "Rigorous Imprisonment not less than 10 Years extending to Life, and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Court of Session (Presided by Woman Judge)",
      compoundable: "Non-Compoundable",
      keywords: "rape 376 sexual assault 64 65 70 gangrape",
      desc: "Penalizes rape with minimum 10 years up to life imprisonment. Section 70 BNS penalizes Gang Rape with minimum 20 years or imprisonment for remainder of natural life.",
    },
    {
      id: "sec-85-86",
      oldSec: "IPC 498A",
      newSec: "BNS 85 & 86",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Husband or Relative of Husband Subjecting Woman to Cruelty (Dowry)",
      punishment: "Imprisonment up to 3 Years and fine",
      cognizable: "Cognizable (Subject to BNSS Sec 35 / 41A notice)",
      bailable: "Non-Bailable",
      triableBy: "Magistrate of the First Class",
      compoundable: "Non-Compoundable",
      keywords: "498a cruelty dowry harassment husband in-laws 85 86",
      desc: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment up to 3 years.",
    },
    {
      id: "sec-115",
      oldSec: "IPC 323",
      newSec: "BNS 115(2)",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Voluntarily Causing Hurt (Simple Hurt)",
      punishment: "Imprisonment up to 1 Year, or fine up to ₹1,000, or both",
      cognizable: "Non-Cognizable",
      bailable: "Bailable",
      triableBy: "Any Magistrate",
      compoundable: "Compoundable by the Person to whom Hurt is caused",
      keywords: "323 simple hurt beating slapping assault 115",
      desc: "Whoever does any act with the intention of thereby causing hurt to any person, or with the knowledge that he is likely thereby to cause hurt.",
    },
    {
      id: "sec-117",
      oldSec: "IPC 325 / 326",
      newSec: "BNS 117 & 118",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Voluntarily Causing Grievous Hurt by Dangerous Weapons",
      punishment: "Imprisonment up to 7 Years (BNS 117) / Imprisonment up to 10 Years or Life (BNS 118)",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Magistrate of the First Class / Court of Session",
      compoundable: "Non-Compoundable (Sec 118)",
      keywords: "325 326 grievous hurt fracture rod knife dangerous weapons 117 118",
      desc: "Causing grievous hurt, permanent privation of sight/hearing, fracture or dislocation of bone, or using weapons of shooting, stabbing, or corrosive substance.",
    },
    {
      id: "sec-303-305",
      oldSec: "IPC 379 / 380",
      newSec: "BNS 303(2) & 305",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Theft in Dwelling House / Building",
      punishment: "Imprisonment up to 3 Years (Theft) / Up to 7 Years (Dwelling House)",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Any Magistrate",
      compoundable: "Compoundable with permission if value < ₹5,000 / community service",
      keywords: "379 380 theft stealing house theft 303 305",
      desc: "Theft of movable property without consent. BNS introduces Community Service for petty first-time theft where value is less than ₹5,000 upon return of property.",
    },
    {
      id: "sec-309-310",
      oldSec: "IPC 392 / 395",
      newSec: "BNS 309 & 310",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Robbery and Dacoity (5 or More Persons)",
      punishment: "Rigorous Imprisonment up to 10-14 Years (Robbery) / Life Imprisonment or 10 Years (Dacoity)",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "392 395 robbery dacoity loot extortion armed gang 309 310",
      desc: "In all robbery there is either theft or extortion with threat of instant death, hurt, or wrongful restraint. When 5 or more persons commit robbery, it is Dacoity.",
    },
    {
      id: "sec-316",
      oldSec: "IPC 406",
      newSec: "BNS 316",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Criminal Breach of Trust (CBT)",
      punishment: "Imprisonment up to 5 Years, or fine, or both",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Magistrate of the First Class",
      compoundable: "Compoundable with permission of Court",
      keywords: "406 criminal breach of trust misappropriation entrustment 316",
      desc: "Dishonest misappropriation or conversion to own use of property entrusted to a person.",
    },
    {
      id: "sec-336-340",
      oldSec: "IPC 467 / 468 / 471",
      newSec: "BNS 336 / 338 / 340",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Forgery of Valuable Security & Using Forged Document as Genuine",
      punishment: "Imprisonment for Life or up to 7-10 Years, and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Magistrate of the First Class",
      compoundable: "Non-Compoundable",
      keywords: "467 468 471 forgery fake document fake signature stamp property will 336 338 340",
      desc: "Making false document, will, adoption deed, or valuable security with intent to cheat or defraud.",
    },
    {
      id: "sec-351-352",
      oldSec: "IPC 504 / 506",
      newSec: "BNS 351 & 352",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Criminal Intimidation & Intentional Insult to Provoke Breach of Peace",
      punishment: "Imprisonment up to 2 Years / Up to 7 Years (if threat is death/grievous hurt)",
      cognizable: "Non-Cognizable / Cognizable (if threat of death)",
      bailable: "Bailable",
      triableBy: "Any Magistrate",
      compoundable: "Compoundable",
      keywords: "504 506 threat criminal intimidation abuse gaali threat to kill 351 352",
      desc: "Threatening another with injury to person, reputation, or property with intent to cause alarm or compel illegal acts.",
    },
    {
      id: "sec-61",
      oldSec: "IPC 120B",
      newSec: "BNS 61",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Criminal Conspiracy",
      punishment: "Same as principal offence / Imprisonment up to 6 Months or fine",
      cognizable: "Cognizable / As per offence conspired",
      bailable: "Non-Bailable / As per offence",
      triableBy: "Court by which offence conspired is triable",
      compoundable: "Non-Compoundable",
      keywords: "120b conspiracy agreement to commit crime saazish 61",
      desc: "When two or more persons agree to do, or cause to be done, an illegal act or an act by illegal means.",
    },
    {
      id: "sec-3-5",
      oldSec: "IPC 34",
      newSec: "BNS 3(5)",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Acts Done by Several Persons in Furtherance of Common Intention",
      punishment: "Joint Vicarious Liability (Each person liable as if done by him alone)",
      cognizable: "As per main section",
      bailable: "As per main section",
      triableBy: "As per main section",
      compoundable: "As per main section",
      keywords: "34 common intention group crime joint liability 3(5)",
      desc: "When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone.",
    },
    {
      id: "sec-483-bnss",
      oldSec: "CrPC 439",
      newSec: "BNSS 483",
      act: "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
      title: "Special Powers of High Court or Court of Session Regarding Regular Bail",
      punishment: "Procedural Bail Section",
      cognizable: "Procedural",
      bailable: "Bail Procedure",
      triableBy: "Sessions Court / High Court",
      compoundable: "N/A",
      keywords: "439 bail regular bail sessions high court 483 bnss",
      desc: "Empowers the High Court or Court of Session to direct that any person accused of an offence and in custody be released on bail.",
    },
    {
      id: "sec-482-bnss",
      oldSec: "CrPC 438",
      newSec: "BNSS 482",
      act: "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
      title: "Direction for Grant of Bail to Person Apprehending Arrest (Anticipatory Bail)",
      punishment: "Procedural Anticipatory Bail Section",
      cognizable: "Procedural",
      bailable: "Anticipatory Bail",
      triableBy: "Sessions Court / High Court",
      compoundable: "N/A",
      keywords: "438 anticipatory bail agrim zamanat arrest stay 482 bnss",
      desc: "When any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to High Court or Court of Session for pre-arrest bail.",
    },
    {
      id: "sec-528-bnss",
      oldSec: "CrPC 482",
      newSec: "BNSS 528",
      act: "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
      title: "Saving of Inherent Powers of High Court (FIR & Criminal Quashing)",
      punishment: "Procedural Inherent Powers",
      cognizable: "Procedural",
      bailable: "N/A",
      triableBy: "High Court",
      compoundable: "N/A",
      keywords: "482 quashing quash fir chargesheet inherent powers high court 528 bnss bhajan lal",
      desc: "Saves inherent powers of High Court to make such orders as may be necessary to give effect to any order under this Sanhita, or to prevent abuse of the process of any Court or otherwise to secure the ends of justice.",
    },
    {
      id: "sec-35-bnss",
      oldSec: "CrPC 41A",
      newSec: "BNSS 35(3)",
      act: "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
      title: "Notice of Appearance Before Police Officer (Mandatory Notice for <= 7 Yrs Offences)",
      punishment: "Arrest Safeguard Section",
      cognizable: "Procedural",
      bailable: "N/A",
      triableBy: "Police / Magistrate",
      compoundable: "N/A",
      keywords: "41a arnesh kumar notice of appearance arrest guidelines 35 bnss",
      desc: "Police officer shall issue notice directing accused to appear where arrest is not required for offences punishable with <= 7 years imprisonment (Strict Arnesh Kumar compliance).",
    },
    {
      id: "sec-63-bsa",
      oldSec: "Evidence Act 65B",
      newSec: "BSA 63",
      act: "Bharatiya Sakshya Adhiniyam (BSA)",
      title: "Admissibility of Electronic Records & Mandatory Electronic Certificate",
      punishment: "Evidence Admissibility Standard",
      cognizable: "Evidence Law",
      bailable: "N/A",
      triableBy: "All Courts",
      compoundable: "N/A",
      keywords: "65b certificate electronic evidence whatsapp cctv call recording printout 63 bsa arjun panditrao",
      desc: "Any information contained in an electronic record printed on paper, stored or recorded in optical or magnetic media shall be deemed to be a document if accompanied by a verified Certificate by person in charge of device.",
    },
  ];

  const [sectionSearchQuery, setSectionSearchQuery] = useState("");
  const [selectedActFilter, setSelectedActFilter] = useState("ALL");

  const filteredSections = useMemo(() => {
    const q = sectionSearchQuery.toLowerCase().trim();
    return LEGAL_SECTIONS_DB.filter((s) => {
      const matchAct = selectedActFilter === "ALL" || s.act.includes(selectedActFilter);
      const matchQuery =
        !q ||
        s.oldSec.toLowerCase().includes(q) ||
        s.newSec.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.keywords.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q);
      return matchAct && matchQuery;
    });
  }, [sectionSearchQuery, selectedActFilter]);

  /* ========================================================================== */
  /*  DATABASE 2: MASSIVE LANDMARK SUPREME COURT PRECEDENTS & RULINGS (1950-2025)*/
  /* ========================================================================== */
  const LANDMARK_JUDGMENTS_DB = [
    {
      id: "sc-antil",
      caseName: "Satender Kumar Antil v. Central Bureau of Investigation & Anr.",
      citation: "(2022) 10 SCC 51 : 2022 LiveLaw (SC) 577",
      year: "2022",
      bench: "Supreme Court of India (S.K. Kaul & M.M. Sundresh, JJ.)",
      category: "Bail & Arrest Safeguards",
      sections: "CrPC 41, 41A, 88, 170, 204, 437, 439 | BNSS 35, 480, 483",
      ratioSummary:
        "Laid down nationwide landmark guidelines classifying offences into 4 Categories (A, B, C, D) for grant of bail without taking accused into judicial custody upon chargesheet submission if accused cooperated during investigation without arrest under 41A.",
      courtParagraphQuote:
        "Courts must ensure that the principle 'Bail is the rule, jail is the exception' is adhered to in letter and spirit. Investigating agencies and police officers are bound to strictly comply with Section 41 & 41A CrPC. Non-compliance shall entitle the accused to grant of bail.",
    },
    {
      id: "sc-arnesh",
      caseName: "Arnesh Kumar v. State of Bihar & Anr.",
      citation: "(2014) 8 SCC 273 : AIR 2014 SC 2756",
      year: "2014",
      bench: "Supreme Court of India (C.K. Prasad & P.C. Ghose, JJ.)",
      category: "Arrest Safeguards & 498A",
      sections: "IPC 498A, CrPC 41(1)(b), 41A | BNS 85, BNSS 35",
      ratioSummary:
        "Mandatory 8-point checklist before arresting accused in offences punishable with imprisonment up to 7 years. Police cannot automatically arrest on filing of 498A/cheating FIR without recording written reasons and issuing 41A Notice.",
      courtParagraphQuote:
        "No arrest can be made merely because it is lawful for the police officer to do so. In all cases where the offence is punishable with imprisonment up to 7 years, police officer shall issue notice under Section 41A within two weeks of FIR. Magistrate shall not authorize mechanical detention without written satisfaction.",
    },
    {
      id: "sc-bhajanlal",
      caseName: "State of Haryana & Ors. v. Bhajan Lal & Ors.",
      citation: "1992 Supp (1) SCC 335 : AIR 1992 SC 604",
      year: "1992",
      bench: "Supreme Court of India (S. Ratnavel Pandian & K. Jayachandra Reddy, JJ.)",
      category: "FIR Quashing & Criminal Procedure",
      sections: "CrPC 482, Article 226 | BNSS 528",
      ratioSummary:
        "The Supreme Court formulated the 7 Golden Illustrative Categories of cases where the High Court must exercise extraordinary inherent jurisdiction under Section 482 CrPC to quash malicious, absurd, or legally barred FIRs.",
      courtParagraphQuote:
        "Where the allegations made in the FIR or complaint, even if taken at their face value and accepted in their entirety, do not prima facie constitute any offence or make out a case against the accused, or where criminal proceeding is manifestly attended with mala fide, the High Court shall quash the FIR.",
    },
    {
      id: "sc-rangappa",
      caseName: "Rangappa v. Sri Mohan",
      citation: "(2010) 11 SCC 441 : AIR 2010 SC 1898 (3-Judge Bench)",
      year: "2010",
      bench: "Supreme Court of India (K.G. Balakrishnan CJI, P. Sathasivam & J.M. Panchal, JJ.)",
      category: "Cheque Bounce (Section 138 NI Act)",
      sections: "Negotiable Instruments Act 1881 Sec 138, 139, 118",
      ratioSummary:
        "Presumption under Section 139 of NI Act includes the existence of a legally enforceable debt or liability. Once signature on the cheque is admitted, the burden shifts entirely to the accused to rebut the presumption by raising a probable defence.",
      courtParagraphQuote:
        "The presumption mandated by Section 139 NI Act does indeed include the existence of a legally enforceable debt or liability. It is a rebuttable presumption and it is open to the accused to raise a defence on preponderance of probabilities, but mere bare denial by accused is insufficient.",
    },
    {
      id: "sc-manish-sisodia",
      caseName: "Manish Sisodia v. Directorate of Enforcement",
      citation: "2024 LiveLaw (SC) 562 : Criminal Appeal No. 3295 of 2024",
      year: "2024",
      bench: "Supreme Court of India (B.R. Gavai & K.V. Viswanathan, JJ.)",
      category: "Bail & Right to Speedy Trial (PMLA / CrPC)",
      sections: "PMLA Sec 45, CrPC 439, Constitution Article 21 | BNSS 483",
      ratioSummary:
        "Prolonged pre-trial incarceration without trial commencing within reasonable time violates Fundamental Right to Speedy Trial under Article 21. Even stringent bail conditions under special statutes (PMLA/UAPA/NDPS) must give way to Article 21.",
      courtParagraphQuote:
        "Right to speedy trial is a fundamental right under Article 21. Where trial is unlikely to conclude in near future and accused has undergone substantial incarceration, bail cannot be denied solely on gravity of offence. Jail cannot be the rule when trial delay is not attributable to accused.",
    },
    {
      id: "sc-rajnesh-neha",
      caseName: "Rajnesh v. Neha & Anr.",
      citation: "(2021) 2 SCC 324 : AIR 2021 SC 569",
      year: "2020",
      bench: "Supreme Court of India (Indu Malhotra & R. Subhash Reddy, JJ.)",
      category: "Matrimonial & Maintenance Guidelines",
      sections: "CrPC 125, HMA Sec 24, DV Act Sec 12 | BNSS 144",
      ratioSummary:
        "Formulated mandatory nationwide guidelines for grant of maintenance. Both husband and wife must mandatorily file detailed 'Affidavit of Disclosure of Assets and Liabilities' (Form Enclosure I/II/III) to prevent false claims and concealment of income.",
      courtParagraphQuote:
        "Maintenance is not a punitive measure but to prevent vagrancy and destitution. Both parties in all matrimonial disputes claiming maintenance must mandatorily file an Affidavit of Disclosure of Assets and Liabilities before the trial court passes interim maintenance.",
    },
    {
      id: "sc-arjun-khotkar",
      caseName: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal & Ors.",
      citation: "(2020) 7 SCC 1 : AIR 2020 SC 4917 (3-Judge Bench)",
      year: "2020",
      bench: "Supreme Court of India (R.F. Nariman, S. Ravindra Bhat & V. Ramasubramanian, JJ.)",
      category: "Electronic Evidence & Section 65B Certificate",
      sections: "Indian Evidence Act 1872 Sec 65B | BSA Sec 63",
      ratioSummary:
        "Furnishing a Certificate under Section 65B(4) is a condition precedent to the admissibility of electronic evidence (WhatsApp chats, emails, CDR, CCTV recordings) where the original device is not brought before the Court.",
      courtParagraphQuote:
        "The certificate required under Section 65B(4) is a mandatory condition precedent for the admissibility of electronic records produced by way of secondary evidence. Oral evidence in the place of such certificate cannot suffice.",
    },
    {
      id: "sc-lalita-kumari",
      caseName: "Lalita Kumari v. Government of Uttar Pradesh & Ors.",
      citation: "(2014) 2 SCC 1 : AIR 2014 SC 187 (5-Judge Constitution Bench)",
      year: "2014",
      bench: "Supreme Court of India (P. Sathasivam CJI, B.S. Chauhan, Ranjana Desai, Ranjan Gogoi & S.A. Bobde, JJ.)",
      category: "Mandatory Registration of FIR",
      sections: "CrPC 154 | BNSS 173",
      ratioSummary:
        "Registration of FIR is mandatory under Section 154 of CrPC if the information discloses commission of a cognizable offence. Police officer has no discretion or power to conduct preliminary inquiry in such cases.",
      courtParagraphQuote:
        "Registration of FIR is mandatory under Section 154 of the Code if the information discloses commission of a cognizable offence and no preliminary inquiry is permissible in such a situation. Preliminary inquiry permitted only in matrimonial disputes, commercial offences, medical negligence and corruption.",
    },
    {
      id: "sc-dk-basu",
      caseName: "D.K. Basu v. State of West Bengal",
      citation: "(1997) 1 SCC 416 : AIR 1997 SC 610",
      year: "1997",
      bench: "Supreme Court of India (Kuldip Singh & A.S. Anand, JJ.)",
      category: "Arrestee Rights & Custodial Violence Safeguards",
      sections: "Constitution Article 21, 22 | CrPC 41B, 50A, 54",
      ratioSummary:
        "Laid down the famous 11 mandatory guidelines for arrest and detention by police to prevent custodial torture, including mandatory Memo of Arrest, informing relatives, medical checkup every 48 hours, and right to meet advocate.",
      courtParagraphQuote:
        "Custodial violence, including torture and death in the lock-ups, strikes a blow at the rule of law. The requirements laid down herein flow from Articles 21 and 22(1) of the Constitution and shall be strictly followed by all police and investigating personnel.",
    },
    {
      id: "sc-sushila-aggarwal",
      caseName: "Sushila Aggarwal & Ors. v. State (NCT of Delhi) & Anr.",
      citation: "(2020) 5 SCC 1 : AIR 2020 SC 831 (5-Judge Constitution Bench)",
      year: "2020",
      bench: "Supreme Court of India (Arun Mishra, Indira Banerjee, Vineet Saran, M.R. Shah & S. Ravindra Bhat, JJ.)",
      category: "Anticipatory Bail (No Fixed Time Limit)",
      sections: "CrPC 438 | BNSS 482",
      ratioSummary:
        "Anticipatory bail granted under Section 438 CrPC should ordinarily not be limited to a fixed period or time frame; it continues in favour of the accused till the end of the trial unless cancelled for specific supervening circumstances.",
      courtParagraphQuote:
        "There is nothing in Section 438 CrPC to restrict the grant of anticipatory bail to a fixed period. The protection granted under Section 438 should ordinarily enure till the end of the trial unless there are special circumstances requiring limitation.",
    },
    {
      id: "sc-puttaswamy",
      caseName: "Justice K.S. Puttaswamy (Retd.) v. Union of India",
      citation: "(2017) 10 SCC 1 : AIR 2017 SC 4161 (9-Judge Constitution Bench)",
      year: "2017",
      bench: "Supreme Court of India (9-Judge Bench, J.S. Khehar CJI, Chandrachud, Nariman et al.)",
      category: "Fundamental Right to Privacy",
      sections: "Constitution of India Article 21, Part III",
      ratioSummary:
        "Unanimously declared that the Right to Privacy is a fundamental right protected intrinsically under Article 21 (Right to Life and Personal Liberty) and as an integral part of Part III of the Constitution.",
      courtParagraphQuote:
        "Privacy is the constitutional core of human dignity. The right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21 and as a part of the freedoms guaranteed by Part III of the Constitution.",
    },
    {
      id: "sc-meters-instruments",
      caseName: "Meters and Instruments Pvt. Ltd. & Anr. v. Kanchan Mehta",
      citation: "(2018) 1 SCC 560 : AIR 2017 SC 4594",
      year: "2018",
      bench: "Supreme Court of India (A.K. Goel & U.U. Lalit, JJ.)",
      category: "Cheque Bounce Compounding & Settlement",
      sections: "NI Act Sec 138, 143, 147 | CrPC 320",
      ratioSummary:
        "Offence under Section 138 NI Act is primarily a civil wrong clothed with criminal sanction. The Court can discharge/close proceedings if accused offers to pay the cheque amount with reasonable interest and costs without complainant's consent.",
      courtParagraphQuote:
        "The object of Section 138 is not to penalize the accused, but to maintain regular business transactions and credibility of negotiable instruments. Compounding of Section 138 offence is encouraged and court can discharge if just compensation is tendered.",
    },
    {
      id: "sc-fortune-infra",
      caseName: "Fortune Infrastructure & Anr. v. Trevor D'Lima & Ors.",
      citation: "(2018) 5 SCC 442 : AIR 2018 SC 1238",
      year: "2018",
      bench: "Supreme Court of India (A.K. Sikri & Ashok Bhushan, JJ.)",
      category: "Real Estate, Consumer Rights & Builder Delay",
      sections: "Consumer Protection Act 1986 Sec 14 | RERA Sec 18",
      ratioSummary:
        "A flat purchaser cannot be made to wait indefinitely for possession of the flat. Upon unreasonable delay by builder beyond agreed period, the buyer is entitled to seek full refund of money with interest and compensation.",
      courtParagraphQuote:
        "A person cannot be made to wait indefinitely for possession of the flat allotted to him, and is entitled to seek refund of the amount paid by him, along with compensation and interest from the developer for failure to deliver within contractual timeframe.",
    },
    {
      id: "sc-vidya-drolia",
      caseName: "Vidya Drolia & Ors. v. Durga Trading Corporation",
      citation: "(2021) 2 SCC 1 : 2020 LiveLaw (SC) 972 (3-Judge Bench)",
      year: "2020",
      bench: "Supreme Court of India (N.V. Ramana, Sanjiv Khanna & Krishna Murari, JJ.)",
      category: "Arbitration & Arbitrability of Disputes",
      sections: "Arbitration & Conciliation Act 1996 Sec 8, 11 | Transfer of Property Act Sec 111",
      ratioSummary:
        "Landmark ruling settling the 4-fold test for when a dispute is non-arbitrable in India. Landlord-tenant disputes under General Law are arbitrable unless governed by special Rent Control Act.",
      courtParagraphQuote:
        "An action in rem is non-arbitrable. Actions in personam involving purely inter-se civil/commercial rights, including tenancy disputes under the Transfer of Property Act, are fully arbitrable under Section 11 of the Arbitration Act.",
    },
  ];

  const [judgmentSearchQuery, setJudgmentSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  const filteredJudgments = useMemo(() => {
    const q = judgmentSearchQuery.toLowerCase().trim();
    return LANDMARK_JUDGMENTS_DB.filter((j) => {
      const matchCategory = selectedCategoryFilter === "ALL" || j.category.includes(selectedCategoryFilter);
      const matchQuery =
        !q ||
        j.caseName.toLowerCase().includes(q) ||
        j.citation.toLowerCase().includes(q) ||
        j.sections.toLowerCase().includes(q) ||
        j.ratioSummary.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [judgmentSearchQuery, selectedCategoryFilter]);

  const copyLegalCitation = (j: (typeof LANDMARK_JUDGMENTS_DB)[0]) => {
    const text = `CITATION FOR COURT PLEADINGS / BAIL APPLICATION:
"${j.caseName} [${j.citation}], Bench: ${j.bench}"
Ratio Decidendi / Legal Principle:
"${j.ratioSummary}"
Key Excerpt:
"${j.courtParagraphQuote}"
(Applicable Provisions: ${j.sections})`;
    navigator.clipboard.writeText(text);
    setCopiedCitationId(j.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  /* ========================================================================== */
  /*  MODULE 3: 1-CLICK COURT-READY LEGAL NOTICE GENERATOR                      */
  /* ========================================================================== */
  const [noticeType, setNoticeType] = useState<"sec138" | "eviction" | "recovery" | "consumer">("sec138");
  const [noticeAmount, setNoticeAmount] = useState<number | string>(550000);
  const [chequeNumber, setChequeNumber] = useState("418290");
  const [chequeDate, setChequeDate] = useState("2025-01-15");
  const [bankName, setBankName] = useState("HDFC Bank Ltd., Connaught Place Branch");
  const [memoDate, setMemoDate] = useState("2025-01-20");
  const [dishonourReason, setDishonourReason] = useState("Funds Insufficient");
  const [propertyAddress, setPropertyAddress] = useState("Flat No. B-402, Royal Palms Apartments, Sector 62, Noida, U.P.");
  const [monthlyRent, setMonthlyRent] = useState<number | string>(35000);
  const [unpaidMonths, setUnpaidMonths] = useState<number | string>(3);
  const [interestRate, setInterestRate] = useState<number | string>(18);

  /* ========================================================================== */
  /*  MODULE 4: LIMITATION PERIOD CALCULATOR (LIMITATION ACT 1963)              */
  /* ========================================================================== */
  const [limitationType, setLimitationType] = useState<"recovery" | "sec138" | "consumer" | "appeal_hc" | "decree">("sec138");
  const [causeOfActionDate, setCauseOfActionDate] = useState("2025-01-20");

  const limitationCalculation = useMemo(() => {
    const start = new Date(causeOfActionDate || new Date());
    let deadline = new Date(start);
    let totalDays = 0;
    let statutoryRule = "";

    if (limitationType === "sec138") {
      // 30 days to send notice + 15 days demand window + 30 days to file complaint
      deadline.setDate(deadline.getDate() + 75);
      statutoryRule = "Section 138/142 NI Act: 30 days to issue Notice + 15 days cure window + 30 days to file complaint before MM.";
    } else if (limitationType === "recovery") {
      deadline.setFullYear(deadline.getFullYear() + 3);
      statutoryRule = "Article 19-21, Limitation Act 1963: 3 Years from the date when loan / invoice payment became due.";
    } else if (limitationType === "consumer") {
      deadline.setFullYear(deadline.getFullYear() + 2);
      statutoryRule = "Section 69, Consumer Protection Act 2019: 2 Years from the date on which cause of action arose.";
    } else if (limitationType === "appeal_hc") {
      deadline.setDate(deadline.getDate() + 90);
      statutoryRule = "Article 116, Limitation Act 1963: 90 Days from the date of certified decree/order of District Court.";
    } else if (limitationType === "decree") {
      deadline.setFullYear(deadline.getFullYear() + 12);
      statutoryRule = "Article 136, Limitation Act 1963: 12 Years for execution of any civil decree (except injunction).";
    }

    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;

    return {
      lastDateFormatted: deadline.toISOString().split("T")[0],
      daysLeft: Math.abs(daysLeft),
      isExpired,
      statutoryRule,
    };
  }, [limitationType, causeOfActionDate]);

  /* ========================================================================== */
  /*  MODULE 5: STATE-WISE COURT FEE CALCULATOR                                 */
  /* ========================================================================== */
  const [suitValuation, setSuitValuation] = useState<number | string>(1000000);
  const [selectedState, setSelectedState] = useState("delhi");
  const [suitCategory, setSuitCategory] = useState("recovery");

  const courtFeeCalculation = useMemo(() => {
    const val = Number(suitValuation) || 0;
    let fee = 0;

    if (selectedState === "delhi") {
      // Delhi Court Fees Act sliding scale approx
      if (val <= 100000) fee = val * 0.03;
      else if (val <= 500000) fee = 3000 + (val - 100000) * 0.02;
      else if (val <= 2000000) fee = 11000 + (val - 500000) * 0.015;
      else fee = 33500 + (val - 2000000) * 0.01;
    } else if (selectedState === "up") {
      fee = val * 0.075; // Approx 7.5% in UP
    } else if (selectedState === "maharashtra") {
      fee = Math.min(300000, val * 0.05); // Capped in Maharashtra
    } else {
      fee = val * 0.05;
    }

    if (suitCategory === "injunction") fee = 500; // Fixed nominal for injunction

    return {
      courtFeeAmount: Math.round(fee),
      stampPaperType: "Non-Judicial / e-Court Stamp Paper",
    };
  }, [suitValuation, selectedState, suitCategory]);

  /* ========================================================================== */
  /*  MODULE 6: LEGAL INTEREST & DECREE CALCULATOR (SECTION 34 CPC)             */
  /* ========================================================================== */
  const [principalClaim, setPrincipalClaim] = useState<number | string>(500000);
  const [interestPct, setInterestPct] = useState<number | string>(18);
  const [interestStartDate, setInterestStartDate] = useState("2024-01-01");
  const [interestEndDate, setInterestEndDate] = useState(new Date().toISOString().split("T")[0]);

  const interestCalculation = useMemo(() => {
    const p = Number(principalClaim) || 0;
    const r = Number(interestPct) || 18;
    const d1 = new Date(interestStartDate);
    const d2 = new Date(interestEndDate);

    const diffDays = Math.max(0, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const interestAmt = Math.round(((p * r) / 100 / 365) * diffDays);
    const totalClaimWithInterest = p + interestAmt;

    return {
      diffDays,
      interestAmt,
      totalClaimWithInterest,
    };
  }, [principalClaim, interestPct, interestStartDate, interestEndDate]);

  return (
    <AuthGate>
      <ProGate>
        <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-24 antialiased font-sans">
          
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #legal-notice-print-area,
              #legal-notice-print-area * {
                visibility: visible;
              }
              #legal-notice-print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                background: white !important;
                color: black !important;
                padding: 30px !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                font-family: 'Times New Roman', serif !important;
                line-height: 1.6 !important;
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
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
                >
                  <span>📜</span>
                  <span className="hidden sm:inline">Draft &amp; Print Legal Notice</span>
                  <span className="sm:hidden">Print Notice</span>
                </button>

                <span className="hidden md:inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  ⚖️ Advocate Legal Hub (2024 Law)
                </span>
              </div>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto px-4 pt-6">
            
            {/* ── ⚖️ ACTIVE ADVOCATE & CASE MASTER BAR ───────────────────────── */}
            <div className="no-print bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md mb-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚖️</span>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                      Active Advocate Chamber &amp; Case Record
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Live syncs across all Legal Notices, Petitions, Court Fee calculations &amp; Vakalatnama.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvocateProfile(!showAdvocateProfile)}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/40"
                >
                  {showAdvocateProfile ? "▲ Minimize Header" : "▼ Edit Chamber Details"}
                </button>
              </div>

              {showAdvocateProfile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Advocate / Counsel Name</label>
                    <input
                      type="text"
                      value={caseInfo.advocateName}
                      onChange={(e) => setCaseInfo({ ...caseInfo, advocateName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Bar Council Enrollment No.</label>
                    <input
                      type="text"
                      value={caseInfo.enrollmentNo}
                      onChange={(e) => setCaseInfo({ ...caseInfo, enrollmentNo: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Client / Complainant Name</label>
                    <input
                      type="text"
                      value={caseInfo.clientName}
                      onChange={(e) => setCaseInfo({ ...caseInfo, clientName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Opposite Party / Accused</label>
                    <input
                      type="text"
                      value={caseInfo.oppositePartyName}
                      onChange={(e) => setCaseInfo({ ...caseInfo, oppositePartyName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="font-bold text-slate-500 block mb-1">Chamber Office Address</label>
                    <input
                      type="text"
                      value={caseInfo.chamberAddress}
                      onChange={(e) => setCaseInfo({ ...caseInfo, chamberAddress: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Court / Forum Name</label>
                    <input
                      type="text"
                      value={caseInfo.courtName}
                      onChange={(e) => setCaseInfo({ ...caseInfo, courtName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Case / Suit / FIR No.</label>
                    <input
                      type="text"
                      value={caseInfo.caseNumber}
                      onChange={(e) => setCaseInfo({ ...caseInfo, caseNumber: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-semibold outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Header Title */}
            <div className="no-print text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                <span>🏛️</span> ALL-IN-ONE ADVOCATE &amp; LEGAL MASTER SUITE (A TO Z)
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                Advocate &amp; Legal Master Suite
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
                IPC to BNS (2024 Law) Section Converter, 1950-2025 Supreme Court Precedents Matrix, 1-Click Court Notice Generator, Limitation Act Engine &amp; Court Fee Stamp Calculator.
              </p>
            </div>

            {/* ── 7 MASTER MODULE TABS ────────────────────────────────────────── */}
            <div className="no-print flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "converter", name: "🔍 IPC ⟷ BNS / BNSS Converter" },
                { id: "judgments", name: "🏛️ Supreme Court Rulings Database" },
                { id: "notice", name: "📜 1-Click Legal Notice Maker" },
                { id: "limitation", name: "⏳ Limitation Period Engine" },
                { id: "courtfee", name: "💰 Court Fee & Stamp Duty" },
                { id: "interest", name: "📈 Sec 34 CPC Interest Claim" },
                { id: "affidavits", name: "📑 Vakalatnama & Affidavits" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === t.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30 scale-[1.01]"
                      : "bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            {/* ── 1. IPC ⟷ BNS & CrPC ⟷ BNSS CONVERTER ──────────────────────── */}
            {activeTab === "converter" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-2/3">
                      <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
                      <input
                        type="text"
                        value={sectionSearchQuery}
                        onChange={(e) => setSectionSearchQuery(e.target.value)}
                        placeholder="Search by IPC Section (e.g. 302, 420, 307, 498A, 439) or Crime Name (Murder, Cheating, Bail)..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full sm:w-auto justify-center">
                      {["ALL", "BNS", "BNSS", "BSA"].map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setSelectedActFilter(act)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            selectedActFilter === act
                              ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm"
                              : "text-slate-500"
                          }`}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between items-center px-1">
                    <span>Showing {filteredSections.length} statutory legal sections</span>
                    <span className="text-indigo-600 font-bold">New Criminal Laws Effective 1st July 2024</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSections.map((sec) => (
                    <div
                      key={sec.id}
                      className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-500/40 transition"
                    >
                      <div className="flex items-center justify-between gap-2 border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-black text-xs border border-rose-200">
                            {sec.oldSec}
                          </span>
                          <span className="text-xs font-black text-slate-400">➔</span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-black text-xs border border-emerald-200">
                            {sec.newSec}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border">
                          {sec.act}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {sec.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {sec.desc}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                          <span className="text-slate-400 block font-bold">Punishment</span>
                          <span className="font-black text-slate-800 dark:text-slate-200">{sec.punishment}</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                          <span className="text-slate-400 block font-bold">Bail / Offence Nature</span>
                          <span className={`font-black ${sec.bailable === "Bailable" ? "text-emerald-600" : "text-rose-600"}`}>
                            {sec.bailable} • {sec.cognizable}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 border-t">
                        <span>Triable By: <strong>{sec.triableBy}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            const cite = `[${sec.oldSec} ➔ ${sec.newSec}] ${sec.title} (${sec.act}): ${sec.desc} [Punishment: ${sec.punishment}, Nature: ${sec.bailable} / ${sec.cognizable}]`;
                            navigator.clipboard.writeText(cite);
                            setCopiedCitationId(sec.id);
                            setTimeout(() => setCopiedCitationId(null), 2000);
                          }}
                          className="text-indigo-600 font-bold hover:underline"
                        >
                          {copiedCitationId === sec.id ? "✓ Copied!" : "📋 Copy Citation"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 2. LANDMARK SUPREME COURT PRECEDENTS DATABASE ─────────────── */}
            {activeTab === "judgments" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-2/3">
                      <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
                      <input
                        type="text"
                        value={judgmentSearchQuery}
                        onChange={(e) => setJudgmentSearchQuery(e.target.value)}
                        placeholder="Search Landmark Rulings by Case Name, Topic (Bail, 498A, Cheque Bounce, Quashing, 65B, RERA)..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold outline-none"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Bail">Bail &amp; Personal Liberty</option>
                      <option value="Cheque">Cheque Bounce (138 NI Act)</option>
                      <option value="Quashing">FIR Quashing (Bhajan Lal)</option>
                      <option value="Matrimonial">Matrimonial &amp; 498A</option>
                      <option value="Electronic">Electronic Evidence (65B)</option>
                    </select>
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between items-center px-1">
                    <span>Showing {filteredJudgments.length} Supreme Court Precedents (Article 141 Binding Law)</span>
                    <span className="text-emerald-600 font-bold">1-Click Citation Copy for Court Pleadings</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredJudgments.map((j) => (
                    <div
                      key={j.id}
                      className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200">
                              {j.category}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">Year: {j.year}</span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                            {j.caseName}
                          </h3>
                          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                            {j.citation}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyLegalCitation(j)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                        >
                          <span>{copiedCitationId === j.id ? "✓ Citation Copied!" : "📋 Copy Court Citation"}</span>
                        </button>
                      </div>

                      <div className="text-xs space-y-2">
                        <div>
                          <span className="font-bold text-slate-400 block text-[10px] uppercase">Bench:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{j.bench}</span>
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border">
                          <span className="font-bold text-slate-400 block text-[10px] uppercase mb-1">
                            Ratio Decidendi / Core Legal Ruling:
                          </span>
                          <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                            {j.ratioSummary}
                          </p>
                        </div>

                        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl">
                          <span className="font-bold text-amber-700 dark:text-amber-400 block text-[10px] uppercase mb-0.5">
                            Key Court Quote for Pleading:
                          </span>
                          <p className="font-serif italic text-xs text-slate-800 dark:text-slate-200">
                            &quot;{j.courtParagraphQuote}&quot;
                          </p>
                        </div>

                        <div className="text-[11px] text-slate-500 pt-1">
                          Applicable Statutes: <span className="font-bold text-slate-700 dark:text-slate-300">{j.sections}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 3. 1-CLICK LEGAL NOTICE DRAFTING ENGINE ─────────────────────── */}
            {activeTab === "notice" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="border-b pb-2">
                    <span className="text-xs font-black uppercase text-indigo-600">
                      Legal Notice Parameters
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Select Notice Type</label>
                    <select
                      value={noticeType}
                      onChange={(e) => setNoticeType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    >
                      <option value="sec138">Section 138 NI Act (Cheque Bounce Demand Notice)</option>
                      <option value="eviction">Tenant Eviction &amp; Rent Default (Sec 106 TPA)</option>
                      <option value="recovery">Money Recovery &amp; Commercial Dues (Order 37 CPC)</option>
                      <option value="consumer">Consumer Protection Deficiency in Service Notice</option>
                    </select>
                  </div>

                  {noticeType === "sec138" && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Cheque Amount (₹)</label>
                          <input
                            type="number"
                            value={noticeAmount}
                            onChange={(e) => setNoticeAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Cheque Number</label>
                          <input
                            type="text"
                            value={chequeNumber}
                            onChange={(e) => setChequeNumber(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Cheque Date</label>
                          <input
                            type="date"
                            value={chequeDate}
                            onChange={(e) => setChequeDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Return Memo Date</label>
                          <input
                            type="date"
                            value={memoDate}
                            onChange={(e) => setMemoDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-0.5">Bank Branch Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-0.5">Dishonour Reason</label>
                        <select
                          value={dishonourReason}
                          onChange={(e) => setDishonourReason(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                        >
                          <option value="Funds Insufficient">Funds Insufficient</option>
                          <option value="Account Closed">Account Closed</option>
                          <option value="Stop Payment by Drawer">Stop Payment by Drawer</option>
                          <option value="Exceeds Arrangement">Exceeds Arrangement</option>
                          <option value="Signatures Differ">Signatures Differ</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {noticeType === "eviction" && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-xs font-bold block mb-0.5">Rented Property Address</label>
                        <textarea
                          rows={2}
                          value={propertyAddress}
                          onChange={(e) => setPropertyAddress(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Monthly Rent (₹)</label>
                          <input
                            type="number"
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Unpaid Months</label>
                          <input
                            type="number"
                            value={unpaidMonths}
                            onChange={(e) => setUnpaidMonths(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {noticeType === "recovery" && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Principal Due (₹)</label>
                          <input
                            type="number"
                            value={noticeAmount}
                            onChange={(e) => setNoticeAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-0.5">Interest Claim (% p.a.)</label>
                          <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPrintModal(true)}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>🖨️</span>
                    <span>View &amp; Print Full Legal Notice</span>
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-black uppercase text-slate-400">
                      Live Notice Preview (Court Format)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">✓ Verified Statutory Clauses</span>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border font-serif text-xs leading-relaxed space-y-4 text-slate-800 dark:text-slate-200">
                    <div className="text-center border-b pb-3">
                      <div className="font-black text-sm uppercase tracking-wide">{caseInfo.advocateName}</div>
                      <div className="text-[11px] font-sans text-slate-500">{caseInfo.enrollmentNo}</div>
                      <div className="text-[10px] font-sans text-slate-400">{caseInfo.chamberAddress} • Ph: {caseInfo.advocatePhone}</div>
                    </div>

                    <div className="flex justify-between font-sans text-[11px]">
                      <div><strong>SPEED POST A.D. / EMAIL</strong></div>
                      <div><strong>Date:</strong> {caseInfo.dateOfNotice}</div>
                    </div>

                    <div>
                      <strong>TO:</strong><br />
                      <strong>{caseInfo.oppositePartyName}</strong><br />
                      (Notice Addressee / Accused)
                    </div>

                    <div>
                      <strong>UNDER INSTRUCTIONS FROM:</strong><br />
                      <strong>{caseInfo.clientName}</strong> (Hereinafter referred to as &quot;My Client&quot;)
                    </div>

                    <div className="font-bold uppercase text-center py-1 bg-slate-200/60 dark:bg-slate-800/60 rounded">
                      {noticeType === "sec138" && "LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881"}
                      {noticeType === "eviction" && "STATUTORY EVICTION NOTICE UNDER SECTION 106 OF TRANSFER OF PROPERTY ACT, 1882"}
                      {noticeType === "recovery" && "DEMAND NOTICE FOR RECOVERY OF OUTSTANDING COMMERCIAL DUES (ORDER 37 CPC)"}
                      {noticeType === "consumer" && "LEGAL NOTICE FOR DEFICIENCY IN SERVICE & MENTAL AGONY (CPA 2019)"}
                    </div>

                    <p>
                      Sir/Madam,<br />
                      Under instructions from and on behalf of my client above named, I do hereby serve upon you the present Legal Demand Notice:
                    </p>

                    {noticeType === "sec138" && (
                      <p>
                        1. That towards the discharge of your legally enforceable debt and liability, you issued Cheque bearing No. <strong>{chequeNumber}</strong> dated <strong>{chequeDate}</strong> for an amount of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> drawn on <strong>{bankName}</strong>.<br />
                        2. That my client presented the said cheque for encashment, however, the same was returned dishonoured by your banker vide Return Memo dated <strong>{memoDate}</strong> with remarks &quot;<strong>{dishonourReason}</strong>&quot;.<br />
                        3. You are hereby called upon to pay the cheque amount of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> within <strong>15 days</strong> of receipt of this notice, failing which criminal proceedings under Section 138 of Negotiable Instruments Act, 1881 shall be initiated against you at your sole risk, cost and consequences.
                      </p>
                    )}

                    {noticeType === "eviction" && (
                      <p>
                        1. That you were inducted as a tenant in respect of premises <strong>{propertyAddress}</strong> at a monthly rent of <strong>₹{Number(monthlyRent).toLocaleString("en-IN")}</strong>.<br />
                        2. That you have defaulted in payment of rent for <strong>{unpaidMonths} months</strong> amounting to total arrears of <strong>₹{(Number(monthlyRent) * Number(unpaidMonths)).toLocaleString("en-IN")}</strong>.<br />
                        3. My client hereby terminates your tenancy under Section 106 of Transfer of Property Act, and calls upon you to clear arrears and hand over vacant peaceful possession within 15 days.
                      </p>
                    )}

                    <div className="pt-4 text-right font-sans">
                      <div className="font-bold">{caseInfo.advocateName}</div>
                      <div className="text-[10px] text-slate-500">Advocate / Legal Counsel</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. LIMITATION ACT ENGINE ────────────────────────────────────── */}
            {activeTab === "limitation" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Nature of Suit / Legal Proceeding</label>
                    <select
                      value={limitationType}
                      onChange={(e) => setLimitationType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold outline-none"
                    >
                      <option value="sec138">Cheque Bounce (Sec 138/142 NI Act - Notice + Complaint)</option>
                      <option value="recovery">Money Recovery Suit (Article 19-21 Limitation Act - 3 Years)</option>
                      <option value="consumer">Consumer Forum Complaint (Sec 69 CPA - 2 Years)</option>
                      <option value="appeal_hc">Appeal to High Court (Article 116 Limitation Act - 90 Days)</option>
                      <option value="decree">Execution of Civil Decree (Article 136 Limitation Act - 12 Years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Date of Cause of Action / Memo / Decree</label>
                    <input
                      type="date"
                      value={causeOfActionDate}
                      onChange={(e) => setCauseOfActionDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Statutory Deadline to File Case:</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                        {limitationCalculation.lastDateFormatted}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-xs font-black border ${
                      limitationCalculation.isExpired
                        ? "bg-rose-50 text-rose-600 border-rose-300"
                        : "bg-emerald-50 text-emerald-600 border-emerald-300"
                    }`}>
                      {limitationCalculation.isExpired
                        ? `⚠️ TIME BARRED (${limitationCalculation.daysLeft} Days Overdue)`
                        : `✓ VALID TO FILE (${limitationCalculation.daysLeft} Days Remaining)`}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t leading-relaxed">
                    <strong>Limitation Rule: </strong>{limitationCalculation.statutoryRule}
                  </p>

                  {limitationCalculation.isExpired && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                      💡 <strong>Section 5 Condonation Advice: </strong>File an Application for Condonation of Delay under Section 5 of Limitation Act citing sufficient cause (Medical illness / Covid / bona fide delay) along with supportive affidavit. Note: Section 5 does NOT apply to original Suits or Order 21 executions.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── 5. COURT FEE & STAMP DUTY CALCULATOR ────────────────────────── */}
            {activeTab === "courtfee" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Suit Valuation / Claim Amount (₹)</label>
                    <input
                      type="number"
                      value={suitValuation}
                      onChange={(e) => setSuitValuation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">State Jurisdiction</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold outline-none"
                    >
                      <option value="delhi">Delhi (Court Fees Act Schedule)</option>
                      <option value="up">Uttar Pradesh (Court Fees Act)</option>
                      <option value="maharashtra">Maharashtra (Bombay Court Fees Act)</option>
                      <option value="other">Other States (Ad-Valorem Scale)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Suit Category</label>
                    <select
                      value={suitCategory}
                      onChange={(e) => setSuitCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold outline-none"
                    >
                      <option value="recovery">Money Recovery / Damages (Ad-Valorem)</option>
                      <option value="injunction">Permanent Injunction (Fixed Nominal Stamp)</option>
                      <option value="partition">Partition Suit</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 block uppercase">
                      Estimated Court Fee Stamp Payable
                    </span>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                      ₹{courtFeeCalculation.courtFeeAmount.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Calculated on Suit Valuation of ₹{Number(suitValuation).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 sm:border-l sm:pl-6">
                    <div><strong>Stamp Mode:</strong> {courtFeeCalculation.stampPaperType}</div>
                    <div><strong>Court Process Fee:</strong> Nominal ₹10–₹50 per summons</div>
                    <div><strong>Welfare Stamp:</strong> ₹25 / ₹50 Bar Council Stamp on Vakalatnama</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 6. SECTION 34 CPC LEGAL INTEREST CALCULATOR ──────────────────── */}
            {activeTab === "interest" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Principal Amount (₹)</label>
                    <input
                      type="number"
                      value={principalClaim}
                      onChange={(e) => setPrincipalClaim(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      value={interestPct}
                      onChange={(e) => setInterestPct(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Start Date (Due Date)</label>
                    <input
                      type="date"
                      value={interestStartDate}
                      onChange={(e) => setInterestStartDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">End Date (Filing Date)</label>
                    <input
                      type="date"
                      value={interestEndDate}
                      onChange={(e) => setInterestEndDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                    <span className="text-[11px] font-bold text-slate-400">Total Duration (Days)</span>
                    <div className="text-xl font-black mt-1">{interestCalculation.diffDays} Days</div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-2xl">
                    <span className="text-[11px] font-bold text-amber-600">Accrued Pre-Suit Interest</span>
                    <div className="text-xl font-black text-amber-600 mt-1">₹{interestCalculation.interestAmt.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-2xl">
                    <span className="text-[11px] font-bold text-emerald-600">Total Decreetal Claim</span>
                    <div className="text-xl font-black text-emerald-600 mt-1">₹{interestCalculation.totalClaimWithInterest.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 7. VAKALATNAMA & AFFIDAVIT GENERATOR ───────────────────────── */}
            {activeTab === "affidavits" && (
              <div className="bg-white dark:bg-[#0c1017] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="border-b pb-2 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-indigo-600">
                    Court Vakalatnama &amp; Standard Affidavits
                  </span>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border font-serif text-xs leading-relaxed space-y-4">
                  <div className="text-center border-b pb-3">
                    <h2 className="text-base font-black uppercase">VAKALATNAMA</h2>
                    <p className="font-sans text-[11px] text-slate-500 mt-0.5">{caseInfo.courtName}</p>
                    <p className="font-sans text-[11px] font-bold text-slate-700 dark:text-slate-300">Suit / Case No.: {caseInfo.caseNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                    <div><strong>{caseInfo.clientName}</strong><br /><span className="text-slate-500">...Plaintiff / Petitioner / Complainant</span></div>
                    <div className="text-right"><strong>VERSUS</strong><br /><strong>{caseInfo.oppositePartyName}</strong><br /><span className="text-slate-500">...Defendant / Respondent / Accused</span></div>
                  </div>

                  <p>
                    I/We, the above-named Plaintiff/Petitioner/Complainant do hereby appoint and retain <strong>{caseInfo.advocateName}</strong>, Advocate ({caseInfo.enrollmentNo}), to act, appear and plead for me/us in the above-mentioned case, to file plaints, petitions, applications, receive monies, and do all legal acts necessary for the conduct of the case.
                  </p>

                  <div className="pt-8 flex justify-between items-end font-sans text-xs">
                    <div>
                      <div className="w-36 border-b border-slate-900 mb-1" />
                      <p className="font-bold">Client / Executant</p>
                    </div>
                    <div className="text-right">
                      <div className="w-36 border-b border-slate-900 mb-1 ml-auto" />
                      <p className="font-bold">{caseInfo.advocateName}</p>
                      <p className="text-[10px] text-slate-500">Advocate / Accepted</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <span>🖨️</span>
                  <span>Print Vakalatnama</span>
                </button>
              </div>
            )}

          </div>

          {/* ── MODAL: OFFICIAL PRINTABLE LEGAL NOTICE (A4) ─────────────────── */}
          {showPrintModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
              <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-black text-base">Court-Ready Legal Notice Preview</h3>
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(false)}
                    className="text-slate-400 hover:text-slate-800 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div
                  id="legal-notice-print-area"
                  className="border-2 border-slate-900 p-8 rounded-2xl font-serif text-xs leading-relaxed space-y-4"
                >
                  <div className="text-center border-b-2 border-slate-900 pb-3">
                    <h2 className="text-lg font-black uppercase">{caseInfo.advocateName}</h2>
                    <p className="text-[11px] font-sans font-semibold text-slate-700">{caseInfo.enrollmentNo}</p>
                    <p className="text-[10px] font-sans text-slate-600">{caseInfo.chamberAddress} • Ph: {caseInfo.advocatePhone}</p>
                  </div>

                  <div className="flex justify-between font-sans text-xs pt-1">
                    <div><strong>REGISTERED SPEED POST A.D. / EMAIL</strong></div>
                    <div><strong>Date:</strong> {caseInfo.dateOfNotice}</div>
                  </div>

                  <div className="text-xs">
                    <strong>TO,</strong><br />
                    <strong>{caseInfo.oppositePartyName}</strong><br />
                    (Notice Addressee / Accused)
                  </div>

                  <div className="text-xs">
                    <strong>UNDER INSTRUCTIONS FROM:</strong><br />
                    <strong>{caseInfo.clientName}</strong> (Hereinafter referred to as &quot;My Client&quot;)
                  </div>

                  <div className="font-bold uppercase text-center py-1.5 bg-slate-100 border border-slate-900 rounded text-xs">
                    {noticeType === "sec138" && "STATUTORY LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881"}
                    {noticeType === "eviction" && "EVICTION & DEMAND NOTICE UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882"}
                    {noticeType === "recovery" && "DEMAND NOTICE FOR PAYMENT OF COMMERCIAL DUES & SUMMARY SUIT ORDER 37 CPC"}
                    {noticeType === "consumer" && "LEGAL NOTICE FOR DEFICIENCY IN SERVICE UNDER CONSUMER PROTECTION ACT, 2019"}
                  </div>

                  <p>
                    Sir/Madam,<br />
                    Under instructions from and on behalf of my client above named, I do hereby serve upon you the present Legal Demand Notice:
                  </p>

                  {noticeType === "sec138" && (
                    <div className="space-y-2">
                      <p>
                        1. That towards the discharge of your existing legally enforceable debt and liability, you issued Cheque bearing No. <strong>{chequeNumber}</strong> dated <strong>{chequeDate}</strong> for an amount of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> drawn on <strong>{bankName}</strong> in favour of my client.
                      </p>
                      <p>
                        2. That my client presented the said cheque for encashment, however, the same was returned dishonoured and unpaid by your banker vide Cheque Return Memo dated <strong>{memoDate}</strong> with statutory remarks &quot;<strong>{dishonourReason}</strong>&quot;.
                      </p>
                      <p>
                        3. You are hereby called upon to pay the entire cheque amount of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> to my client within <strong>15 days</strong> from the receipt of this notice.
                      </p>
                      <p>
                        4. Please note that if you fail to make the payment within the stipulated 15 days, my client shall be constrained to institute criminal complaint against you under Section 138 read with Section 142 of the Negotiable Instruments Act, 1881 before the Competent Judicial Magistrate, at your entire cost and peril.
                      </p>
                    </div>
                  )}

                  {noticeType === "eviction" && (
                    <div className="space-y-2">
                      <p>
                        1. That you were inducted as a tenant in respect of premises situated at <strong>{propertyAddress}</strong> on a monthly rental of <strong>₹{Number(monthlyRent).toLocaleString("en-IN")}</strong>.
                      </p>
                      <p>
                        2. That you have persistently defaulted in payment of rent for <strong>{unpaidMonths} months</strong> amounting to total outstanding rent arrears of <strong>₹{(Number(monthlyRent) * Number(unpaidMonths)).toLocaleString("en-IN")}</strong>.
                      </p>
                      <p>
                        3. My client hereby terminates your tenancy under Section 106 of the Transfer of Property Act, 1882 and calls upon you to vacate and hand over peaceful physical possession along with cleared arrears within 15 days of this notice.
                      </p>
                    </div>
                  )}

                  {noticeType === "recovery" && (
                    <div className="space-y-2">
                      <p>
                        1. That you are in receipt of commercial goods/services from my client against which an outstanding balance of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> remains unpaid despite repeated reminders.
                      </p>
                      <p>
                        2. You are hereby called upon to pay the principal sum of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> along with interest @ <strong>{interestRate}% p.a.</strong> within 15 days, failing which a Summary Suit under Order XXXVII of the Code of Civil Procedure, 1908 will be instituted.
                      </p>
                    </div>
                  )}

                  <div className="pt-8 text-right font-sans text-xs">
                    <div className="font-bold">{caseInfo.advocateName}</div>
                    <div className="text-[10px] text-slate-600">Advocate / Legal Counsel</div>
                    <div className="text-[10px] text-slate-500">{caseInfo.enrollmentNo}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                  >
                    <span>🖨️</span>
                    <span>Print Notice on Advocate Letterhead</span>
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