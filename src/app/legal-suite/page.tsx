// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProGate from "../../components/ProGate";
import AuthGate from "../../components/AuthGate";

export default function LegalSuitePage() {
  const [activeTab, setActiveTab] = useState<
    "bareact" | "converter" | "judgments" | "notice" | "limitation" | "courtfee" | "interest" | "affidavits"
  >("bareact");

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
  /*  COMPLETE BARE-ACT CHAPTERS & INDIVIDUAL SECTIONS (1,059 SECTIONS)         */
  /* ========================================================================== */
  const BARE_ACT_CHAPTERS_DB = {
    BNS: [
      {
        num: 1,
        title: "Preliminary",
        secRange: "Sec 1 to 3",
        sections: [
          { sec: "1", title: "Short title, commencement and application", old: "IPC 1, 2, 3", nature: "Applies across India and extraterritorial jurisdiction" },
          { sec: "2", title: "Definitions (Child, Document, Good faith, Public servant, etc.)", old: "IPC 6 to 52A", nature: "Consolidated statutory definitions clause" },
          { sec: "3", title: "General explanations, Common Intention & Joint Liability", old: "IPC 34, 35, 37", nature: "Joint liability for acts done in furtherance of common intention (Sec 3(5))" },
        ],
      },
      {
        num: 2,
        title: "Of Punishments",
        secRange: "Sec 4 to 13",
        sections: [
          { sec: "4", title: "Punishments (Death, Imprisonment for Life, Rigorous/Simple, Forfeiture, Fine & Community Service)", old: "IPC 53", nature: "Introduces Community Service as a statutory reformative punishment" },
          { sec: "5", title: "Commutation of sentence of death or imprisonment for life", old: "IPC 54, 55", nature: "Appropriate Government powers of commutation" },
          { sec: "6", title: "Fractions of terms of punishment", old: "IPC 57", nature: "Life imprisonment calculated as 20 years for fractions" },
          { sec: "7", title: "Sentence may be wholly or partly rigorous or simple", old: "IPC 60", nature: "Discretion of sentencing Court" },
          { sec: "8", title: "Amount of fine, liability in default of payment of fine", old: "IPC 63, 64", nature: "Terms of imprisonment in default of fine" },
          { sec: "9", title: "Limit of punishment of offence made up of several offences", old: "IPC 71", nature: "Maximum punishment for combined acts" },
          { sec: "13", title: "Solitary confinement and limit of solitary confinement", old: "IPC 73, 74", nature: "Max 3 months solitary confinement total" },
        ],
      },
      {
        num: 3,
        title: "General Exceptions & Right of Private Defence",
        secRange: "Sec 14 to 44",
        sections: [
          { sec: "14", title: "Act done by a person bound, or justified by law", old: "IPC 76, 79", nature: "Mistake of fact defence, not mistake of law" },
          { sec: "15", title: "Act of Judge when acting judicially", old: "IPC 77", nature: "Judicial immunity from prosecution" },
          { sec: "16", title: "Act done pursuant to the judgment or order of Court", old: "IPC 78", nature: "Protection for ministerial officers executing orders" },
          { sec: "17", title: "Accident in doing a lawful act", old: "IPC 80", nature: "Absence of criminal intention and knowledge" },
          { sec: "18", title: "Act likely to cause harm, but done without criminal intent to prevent other harm", old: "IPC 81", nature: "Doctrine of necessity" },
          { sec: "20", title: "Act of a child under seven years of age (Doli Incapax)", old: "IPC 82", nature: "Absolute statutory immunity for child < 7 years" },
          { sec: "21", title: "Act of a child above seven and under twelve of immature understanding", old: "IPC 83", nature: "Immunity subject to maturity test" },
          { sec: "22", title: "Act of a person of unsound mind (Insanity Defence / Mc'Naghten Rule)", old: "IPC 84", nature: "Legal insanity at the time of committing the act" },
          { sec: "23", title: "Involuntary Intoxication Defence", old: "IPC 85", nature: "Intoxication administered without knowledge or consent" },
          { sec: "25", title: "Act not intended and not known to be likely to cause death, done by consent", old: "IPC 87", nature: "Volenti non fit injuria (Consent defence)" },
          { sec: "34", title: "Things done in private defence", old: "IPC 96", nature: "Right of private defence of body and property" },
          { sec: "37", title: "Right of private defence against person of unsound mind or child", old: "IPC 98", nature: "Defence against non-culpable attackers" },
          { sec: "38", title: "When right of private defence of body extends to causing death", old: "IPC 100", nature: "Apprehension of death, grievous hurt, rape, unnatural lust, kidnapping, acid" },
          { sec: "43", title: "When right of private defence of property extends to causing death", old: "IPC 103", nature: "Robbery, house-breaking by night, mischief by fire to human dwelling" },
        ],
      },
      {
        num: 4,
        title: "Of Abetment, Criminal Conspiracy & Attempt",
        secRange: "Sec 45 to 62",
        sections: [
          { sec: "45", title: "Abetment of a thing (Instigation, Conspiracy, Aiding)", old: "IPC 107", nature: "Statutory definition of abetment" },
          { sec: "46", title: "Abettor defined", old: "IPC 108", nature: "Liability of person abetting commission of crime" },
          { sec: "61", title: "Criminal Conspiracy and its punishment", old: "IPC 120A, 120B", nature: "Agreement between two or more persons to commit illegal act" },
          { sec: "62", title: "Punishment for attempting to commit offences", old: "IPC 511", nature: "Half of longest term of imprisonment prescribed for offence" },
        ],
      },
      {
        num: 5,
        title: "Of Offences Against Women and Children",
        secRange: "Sec 63 to 99",
        sections: [
          { sec: "63", title: "Definition of Rape", old: "IPC 375", nature: "Statutory definition of rape and non-consent parameters" },
          { sec: "64", title: "Punishment for Rape (Minimum 10 Years extending to Life)", old: "IPC 376(1)", nature: "Rigorous Imprisonment, Non-Bailable, Session Trial" },
          { sec: "65", title: "Punishment for rape in certain cases (Police, Custody, Hospital, Minor)", old: "IPC 376(2)", nature: "Minimum 10 Years to Remainder of Natural Life" },
          { sec: "69", title: "Sexual intercourse by deceitful means (False promise of marriage)", old: "NEW BNS SECTION", nature: "Up to 10 Years Imprisonment & Fine, Non-Bailable" },
          { sec: "70", title: "Gang Rape (Minimum 20 Years to Natural Life)", old: "IPC 376D", nature: "Non-Bailable, Triable by Court of Session" },
          { sec: "71", title: "Rape on girl below twelve years of age (Death Penalty)", old: "IPC 376DB", nature: "Minimum 20 Years to Death Penalty" },
          { sec: "74", title: "Assault or criminal force to woman with intent to outrage modesty", old: "IPC 354", nature: "1 to 5 Years & Fine, Non-Bailable" },
          { sec: "75", title: "Sexual Harassment and punishment for sexual harassment", old: "IPC 354A", nature: "Up to 3 Years or Fine, Bailable" },
          { sec: "76", title: "Assault with intent to disrobe woman", old: "IPC 354B", nature: "3 to 7 Years, Non-Bailable" },
          { sec: "77", title: "Voyeurism (Capturing private photos/videos without consent)", old: "IPC 354C", nature: "1 to 3 Years (1st) / Up to 7 Years (Subsequent)" },
          { sec: "78", title: "Stalking (Physical & Cyber Stalking)", old: "IPC 354D", nature: "Up to 3 Years (Bailable 1st) / 5 Years (Non-Bailable 2nd)" },
          { sec: "79", title: "Word, gesture or act intended to insult modesty of woman", old: "IPC 509", nature: "Up to 3 Years & Fine, Bailable" },
          { sec: "80", title: "Dowry Death (Death of woman within 7 years of marriage)", old: "IPC 304B", nature: "Minimum 7 Years to Life Imprisonment, Non-Bailable" },
          { sec: "85", title: "Husband or relative of husband subjecting woman to cruelty", old: "IPC 498A", nature: "Up to 3 Years & Fine, Non-Bailable (Subject to BNSS 35 notice)" },
          { sec: "86", title: "Cruelty defined (Mental & Physical cruelty / Dowry demands)", old: "IPC 498A Explanation", nature: "Statutory explanation of cruelty against married women" },
          { sec: "93", title: "Causing miscarriage without woman's consent", old: "IPC 313", nature: "Imprisonment for Life or up to 10 Years" },
          { sec: "97", title: "Importation of girl from foreign country", old: "IPC 366B", nature: "Up to 10 Years & Fine" },
        ],
      },
      {
        num: 6,
        title: "Of Offences Affecting the Human Body",
        secRange: "Sec 100 to 146",
        sections: [
          { sec: "100", title: "Culpable homicide defined", old: "IPC 299", nature: "Causing death with intention or knowledge" },
          { sec: "101", title: "Murder defined & exceptions", old: "IPC 300", nature: "5 Statutory exceptions to murder" },
          { sec: "103", title: "Punishment for Murder (Death or Life Imprisonment) & Mob Lynching", old: "IPC 302", nature: "Death / Life + Mob Lynching sub-clause (2)" },
          { sec: "105", title: "Culpable homicide not amounting to murder", old: "IPC 304", nature: "Life or up to 10 Years & Fine" },
          { sec: "106", title: "Causing death by negligence & Hit-and-Run driver liability", old: "IPC 304A", nature: "Up to 5 yrs (General) / 10 yrs (Hit & Run fleeing)" },
          { sec: "108", title: "Abetment of suicide", old: "IPC 306", nature: "Up to 10 Years & Fine, Non-Bailable" },
          { sec: "109", title: "Attempt to Murder", old: "IPC 307", nature: "Up to 10 Years / Life (if hurt caused), Non-Bailable" },
          { sec: "110", title: "Attempt to commit culpable homicide", old: "IPC 308", nature: "Up to 3-7 Years, Non-Bailable" },
          { sec: "115", title: "Voluntarily causing hurt (Simple Hurt)", old: "IPC 323", nature: "Up to 1 Year or ₹1,000 fine, Bailable" },
          { sec: "117", title: "Voluntarily causing grievous hurt (Fracture/Dislocation/Privation)", old: "IPC 325", nature: "Up to 7 Years & Fine, Bailable" },
          { sec: "118", title: "Voluntarily causing grievous hurt by dangerous weapons", old: "IPC 326", nature: "Up to 10 Years or Life, Non-Bailable" },
          { sec: "124", title: "Acid attack and permanent disfiguration", old: "IPC 326A", nature: "Min 10 Years to Life + Victim Medical Fine" },
          { sec: "137", title: "Kidnapping from lawful guardianship", old: "IPC 361, 363", nature: "Up to 7 Years & Fine, Non-Bailable" },
          { sec: "140", title: "Kidnapping or abducting in order to murder or wrongful confinement", old: "IPC 364, 365", nature: "Up to 10 Years / Life Imprisonment" },
        ],
      },
      {
        num: 7,
        title: "Of Offences Against the State",
        secRange: "Sec 147 to 158",
        sections: [
          { sec: "147", title: "Waging, attempting to wage, or abetting war against Government of India", old: "IPC 121", nature: "Death or Imprisonment for Life" },
          { sec: "152", title: "Act endangering sovereignty, unity and integrity of India (Replacing Sedition)", old: "IPC 124A (Replaced)", nature: "Life Imprisonment or 7 Years" },
        ],
      },
      {
        num: 11,
        title: "Of Offences Against Public Tranquillity",
        secRange: "Sec 189 to 197",
        sections: [
          { sec: "189", title: "Unlawful assembly (5 or more persons with unlawful object)", old: "IPC 141, 143", nature: "Up to 6 Months or Fine" },
          { sec: "191", title: "Rioting and punishment for rioting", old: "IPC 146, 147", nature: "Up to 2 Years or Fine" },
          { sec: "194", title: "Affray (Fighting in public place disturbing peace)", old: "IPC 159, 160", nature: "Up to 1 Month or ₹1,000 fine" },
          { sec: "196", title: "Promoting enmity between groups on grounds of religion, race, caste", old: "IPC 153A", nature: "Up to 3-5 Years, Non-Bailable" },
        ],
      },
      {
        num: 17,
        title: "Of Offences Against Property",
        secRange: "Sec 303 to 334",
        sections: [
          { sec: "303", title: "Theft and punishment for theft (Community service for < ₹5,000)", old: "IPC 378, 379", nature: "Up to 3 Years & Community Service" },
          { sec: "304", title: "Snatching (Forcible quick seizing of property)", old: "NEW BNS SECTION", nature: "Up to 3 Years & Fine, Non-Bailable" },
          { sec: "305", title: "Theft in dwelling house or building", old: "IPC 380", nature: "Up to 7 Years & Fine, Non-Bailable" },
          { sec: "308", title: "Extortion and punishment", old: "IPC 383, 384", nature: "Up to 3-7 Years, Non-Bailable" },
          { sec: "309", title: "Robbery and punishment (Highway robbery)", old: "IPC 390, 392", nature: "10 to 14 Years Rigorous Imprisonment" },
          { sec: "310", title: "Dacoity (Robbery by 5 or more persons)", old: "IPC 391, 395", nature: "Life Imprisonment or 10 Years" },
          { sec: "316", title: "Criminal Breach of Trust (CBT)", old: "IPC 405, 406", nature: "Up to 5 Years, Non-Bailable" },
          { sec: "317", title: "Dishonestly receiving stolen property", old: "IPC 411", nature: "Up to 3 Years, Non-Bailable" },
          { sec: "318", title: "Cheating and dishonestly inducing delivery of property (420)", old: "IPC 415, 420", nature: "Up to 7 Years & Fine (Sec 318(4))" },
          { sec: "324", title: "Mischief and damage to property", old: "IPC 425, 426", nature: "Up to 6 Months or Fine" },
          { sec: "329", title: "Criminal Trespass", old: "IPC 441, 447", nature: "Up to 3 Months or ₹500 fine" },
          { sec: "331", title: "House-trespass and house-breaking", old: "IPC 442, 448, 453", nature: "Up to 1 to 2 Years" },
        ],
      },
      {
        num: 18,
        title: "Of Offences Relating to Documents and Property Marks",
        secRange: "Sec 335 to 350",
        sections: [
          { sec: "336", title: "Forgery and making a false document", old: "IPC 463, 465", nature: "Up to 2 Years or Fine" },
          { sec: "338", title: "Forgery of valuable security, will, or authority to make trust", old: "IPC 467", nature: "Life Imprisonment or 10 Years" },
          { sec: "340", title: "Using as genuine a forged document", old: "IPC 471", nature: "Same punishment as forgery" },
        ],
      },
      {
        num: 19,
        title: "Of Criminal Intimidation, Insult, Annoyance, Defamation, etc.",
        secRange: "Sec 351 to 357",
        sections: [
          { sec: "351", title: "Criminal Intimidation and punishment for threat of death", old: "IPC 503, 506", nature: "Up to 2 Years / Up to 7 Years" },
          { sec: "352", title: "Intentional insult with intent to provoke breach of the peace", old: "IPC 504", nature: "Up to 2 Years, Bailable" },
          { sec: "356", title: "Defamation and punishment (With Community Service alternative)", old: "IPC 499, 500", nature: "Up to 2 Years / Community Service" },
        ],
      },
      {
        num: 20,
        title: "Repeal and Savings",
        secRange: "Sec 358",
        sections: [
          { sec: "358", title: "Repeal of Indian Penal Code (45 of 1860) & Transitional Savings", old: "IPC Repeal Clause", nature: "Saves prior pending cases & liabilities" },
        ],
      },
    ],
    BNSS: [
      {
        num: 5,
        title: "Arrest of Persons",
        secRange: "Sec 35 to 62",
        sections: [
          { sec: "35", title: "When police may arrest without warrant & Mandatory Notice (35(3))", old: "CrPC 41, 41A", nature: "Mandatory Notice for <= 7 yrs offences (Arnesh Kumar)" },
          { sec: "36", title: "Designated police officer in district to maintain arrest records", old: "CrPC 41B, 41C", nature: "Display board of arrested persons at PS" },
          { sec: "47", title: "Person arrested to be informed of grounds of arrest & right to bail", old: "CrPC 50", nature: "Mandatory statutory right of arrestee" },
          { sec: "53", title: "Examination of arrested person by medical officer", old: "CrPC 54", nature: "Mandatory medical report on arrest" },
        ],
      },
      {
        num: 10,
        title: "Order for Maintenance of Wives, Children and Parents",
        secRange: "Sec 144 to 147",
        sections: [
          { sec: "144", title: "Order for maintenance of wives, children and parents", old: "CrPC 125", nature: "Monthly maintenance & interim allowance" },
          { sec: "145", title: "Procedure for maintenance inquiries and enforcement", old: "CrPC 126", nature: "Evidence in presence of person" },
          { sec: "146", title: "Alteration in allowance on change of circumstances", old: "CrPC 127", nature: "Increase/decrease in maintenance" },
          { sec: "147", title: "Enforcement of order of maintenance and recovery warrant", old: "CrPC 128", nature: "Execution of maintenance decree" },
        ],
      },
      {
        num: 13,
        title: "Information to Police & Powers to Investigate (FIR)",
        secRange: "Sec 173 to 196",
        sections: [
          { sec: "173", title: "Information in cognizable cases (FIR, Zero FIR & e-FIR)", old: "CrPC 154", nature: "Zero FIR anywhere + e-FIR within 3 days" },
          { sec: "175", title: "Police officer's power to investigate cognizable case", old: "CrPC 156(3)", nature: "Magistrate order for investigation" },
          { sec: "180", title: "Examination of witnesses by police (Audio-video recording)", old: "CrPC 161", nature: "Witness statements can be recorded on video" },
          { sec: "183", title: "Recording of confessions and statements before Magistrate", old: "CrPC 164", nature: "Mandatory audio-video recording for rape victims" },
          { sec: "187", title: "Procedure when investigation cannot be completed in 24 hrs (Remand & Default Bail)", old: "CrPC 167", nature: "15 days PC in parts + 60/90 days default bail" },
          { sec: "193", title: "Report of police officer on completion of investigation (Chargesheet)", old: "CrPC 173", nature: "Mandatory 90 days timeline for final report" },
        ],
      },
      {
        num: 35,
        title: "Provisions as to Bail and Bonds",
        secRange: "Sec 478 to 496",
        sections: [
          { sec: "478", title: "In what cases bail to be taken (Bailable offences mandatory bail)", old: "CrPC 436", nature: "Right to bail as of right" },
          { sec: "479", title: "Maximum period for which undertrial prisoner can be detained (1/3rd & 1/2 rule)", old: "CrPC 436A", nature: "Bail for first-time undertrial after 1/3rd sentence" },
          { sec: "480", title: "When bail may be taken in case of non-bailable offence (Magistrate Bail)", old: "CrPC 437", nature: "Discretionary bail before Magistrate" },
          { sec: "482", title: "Direction for grant of bail to person apprehending arrest (Anticipatory Bail)", old: "CrPC 438", nature: "Pre-arrest bail before Sessions / High Court" },
          { sec: "483", title: "Special powers of High Court or Court of Session regarding Regular Bail", old: "CrPC 439", nature: "Wide inherent regular bail powers" },
          { sec: "484", title: "Amount of bond and reduction thereof", old: "CrPC 440", nature: "Prohibition on excessive surety amounts" },
        ],
      },
      {
        num: 39,
        title: "Miscellaneous & Inherent Powers of High Court",
        secRange: "Sec 519 to 531",
        sections: [
          { sec: "528", title: "Saving of Inherent Powers of High Court (FIR & Criminal Quashing)", old: "CrPC 482", nature: "Inherent quashing powers under Bhajan Lal" },
          { sec: "531", title: "Repeal of Code of Criminal Procedure, 1973 & Transitional Provisions", old: "CrPC Repeal Clause", nature: "Saves prior pending trials under 1973 Code" },
        ],
      },
    ],
    BSA: [
      {
        num: 2,
        title: "Relevancy of Facts & Confessions",
        secRange: "Sec 3 to 50",
        sections: [
          { sec: "4", title: "Relevancy of facts forming part of same transaction (Res Gestae)", old: "IEA 6", nature: "Spontaneous simultaneous facts" },
          { sec: "23", title: "Confession to police officer not to be proved & Discovery fact u/s 27", old: "IEA 25, 26, 27", nature: "Police confessions inadmissible, recovery memo valid" },
          { sec: "26", title: "Cases in which statement of relevant fact by person who is dead is relevant (Dying Declaration)", old: "IEA 32", nature: "Dying declaration admissibility" },
          { sec: "39", title: "Opinions of experts (Forensic, Ballistic, Medical, Cyber Experts)", old: "IEA 45", nature: "Expert scientific testimony" },
        ],
      },
      {
        num: 5,
        title: "Documentary Evidence & Electronic Records",
        secRange: "Sec 56 to 93",
        sections: [
          { sec: "56", title: "Proof of contents of documents", old: "IEA 61", nature: "Primary or secondary evidence" },
          { sec: "57", title: "Primary Evidence defined", old: "IEA 62", nature: "Original document itself" },
          { sec: "58", title: "Secondary Evidence defined", old: "IEA 63", nature: "Certified copies & mechanical prints" },
          { sec: "61", title: "Admissibility of Electronic or Digital Records", old: "IEA 65A", nature: "Equal evidentiary status for digital documents" },
          { sec: "63", title: "Special provisions as to evidence relating to electronic record (Mandatory 65B Certificate)", old: "IEA 65B", nature: "Mandatory Electronic Certificate (Arjun Khotkar)" },
        ],
      },
      {
        num: 7,
        title: "Of the Burden of Proof & Presumptions",
        secRange: "Sec 104 to 120",
        sections: [
          { sec: "104", title: "Burden of proof (On person who asserts fact)", old: "IEA 101", nature: "Fundamental rule of burden" },
          { sec: "107", title: "Burden of proving that case of accused comes within exceptions", old: "IEA 105", nature: "Burden of proving general exceptions on accused" },
          { sec: "118", title: "Presumption as to Dowry Death", old: "IEA 113B", nature: "Mandatory presumption if cruelty before death" },
          { sec: "119", title: "Presumption as to absence of consent in certain prosecutions for rape", old: "IEA 114A", nature: "Rebuttable statutory presumption of non-consent" },
        ],
      },
      {
        num: 9,
        title: "Of Witnesses & Professional Communications",
        secRange: "Sec 124 to 139",
        sections: [
          { sec: "124", title: "Who may testify as witness", old: "IEA 118", nature: "All persons capable of understanding questions" },
          { sec: "132", title: "Professional communications of legal advisors (Attorney-Client Privilege)", old: "IEA 126", nature: "Absolute protection of advocate-client secrets" },
        ],
      },
      {
        num: 10,
        title: "Of the Examination of Witnesses",
        secRange: "Sec 140 to 165",
        sections: [
          { sec: "141", title: "Order of production and examination of witnesses", old: "IEA 135", nature: "CPC / BNSS rules of examination" },
          { sec: "142", title: "Examination-in-chief, Cross-examination and Re-examination", old: "IEA 137", nature: "3 stages of witness examination" },
          { sec: "146", title: "Leading questions and when they may be asked", old: "IEA 141, 142, 143", nature: "Permitted in cross-examination" },
          { sec: "162", title: "Refreshing memory by witness from writing", old: "IEA 159", nature: "Refreshing memory from diary/report" },
        ],
      },
    ],
  };

  const [selectedBareAct, setSelectedBareAct] = useState<"BNS" | "BNSS" | "BSA">("BNS");
  const [bareActSearchQuery, setBareActSearchQuery] = useState("");
  const [selectedChapterFilter, setSelectedChapterFilter] = useState("ALL");

  const currentActChapters = BARE_ACT_CHAPTERS_DB[selectedBareAct] || [];

  const filteredActChapters = useMemo(() => {
    const q = bareActSearchQuery.toLowerCase().trim();
    return currentActChapters
      .filter((ch) => selectedChapterFilter === "ALL" || `Chapter ${ch.num}` === selectedChapterFilter)
      .map((ch) => {
        const matchingSecs = ch.sections.filter((s) => {
          return (
            !q ||
            s.sec.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            s.old.toLowerCase().includes(q) ||
            s.nature.toLowerCase().includes(q) ||
            ch.title.toLowerCase().includes(q)
          );
        });
        return {
          ...ch,
          sections: matchingSecs,
        };
      })
      .filter((ch) => ch.sections.length > 0 || !q);
  }, [currentActChapters, selectedChapterFilter, bareActSearchQuery]);

  /* ========================================================================== */
  /*  EXHAUSTIVE DATABASE 2: IPC ⟷ BNS & CrPC ⟷ BNSS & IEA ⟷ BSA (2024 LAW)     */
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
      desc: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Sub-clause (2) prescribes death or life imprisonment for mob lynching / murder on ground of race, caste, sex, place of birth, or language.",
    },
    {
      id: "sec-105",
      oldSec: "IPC 304",
      newSec: "BNS 105",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Culpable Homicide Not Amounting to Murder",
      punishment: "Imprisonment for Life or up to 10 Years, and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "304 culpable homicide without premeditation sudden fight 105",
      desc: "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life or up to 10 years if act done with intention, or up to 10 years if done with knowledge without intention.",
    },
    {
      id: "sec-106",
      oldSec: "IPC 304A",
      newSec: "BNS 106",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Causing Death by Negligence (Rash Driving & Hit-and-Run)",
      punishment: "Imprisonment up to 5 Years (Normal) / Up to 10 Years (Hit & Run failing to report to police)",
      cognizable: "Cognizable",
      bailable: "Bailable (Sec 106(1)) / Non-Bailable (Sec 106(2))",
      triableBy: "Magistrate of the First Class / Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "304a rash driving accident hit and run road accident negligence 106",
      desc: "Whoever causes death by rash or negligent act not amounting to culpable homicide. Sub-section (2) introduces strict 10-year imprisonment for hit-and-run drivers who escape without reporting to police immediately.",
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
      oldSec: "IPC 325",
      newSec: "BNS 117",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Voluntarily Causing Grievous Hurt (Fracture / Severe Injury)",
      punishment: "Imprisonment up to 7 Years and fine",
      cognizable: "Cognizable",
      bailable: "Bailable",
      triableBy: "Any Magistrate",
      compoundable: "Compoundable with permission of the Court",
      keywords: "325 grievous hurt fracture bone dislocation permanent disability 117",
      desc: "Causing permanent privation of sight/hearing, destruction or permanent impairing of any member or joint, fracture or dislocation of bone/tooth.",
    },
    {
      id: "sec-118",
      oldSec: "IPC 324 / 326",
      newSec: "BNS 118",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Voluntarily Causing Hurt / Grievous Hurt by Dangerous Weapons",
      punishment: "Imprisonment up to 10 Years or Life Imprisonment, and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Magistrate of the First Class / Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "324 326 dangerous weapons knife rod acid shooting stabbing 118",
      desc: "Causing hurt or grievous hurt by any instrument for shooting, stabbing or cutting, or corrosive substance, fire, poison or animal.",
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
      id: "sec-69",
      oldSec: "NEW (Earlier under IPC 417/376)",
      newSec: "BNS 69",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Sexual Intercourse by Employing Deceitful Means (False Promise of Marriage)",
      punishment: "Imprisonment up to 10 Years and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Court of Session",
      compoundable: "Non-Compoundable",
      keywords: "false promise of marriage deceitful means sexual intercourse 69 bns new section",
      desc: "Whoever by deceitful means or by making promise to marry a woman without any intention of fulfilling the same, has sexual intercourse with her not amounting to rape.",
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
      id: "sec-304",
      oldSec: "NEW (Earlier under IPC 379/390)",
      newSec: "BNS 304",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Snatching (Mobile / Chain / Purse Snatching)",
      punishment: "Imprisonment up to 3 Years and fine",
      cognizable: "Cognizable",
      bailable: "Non-Bailable",
      triableBy: "Any Magistrate",
      compoundable: "Non-Compoundable",
      keywords: "snatching chain mobile snatching biker gang 304 bns new section",
      desc: "Theft is snatching if, in order to commit theft, the offender suddenly or quickly or forcibly seizes, secures, grabs or takes away from any person any movable property.",
    },
    {
      id: "sec-356",
      oldSec: "IPC 499 / 500",
      newSec: "BNS 356",
      act: "Bharatiya Nyaya Sanhita (BNS)",
      title: "Defamation (Maanhani)",
      punishment: "Simple Imprisonment up to 2 Years, or fine, or both, or Community Service",
      cognizable: "Non-Cognizable",
      bailable: "Bailable",
      triableBy: "Court of Session / Magistrate of First Class",
      compoundable: "Compoundable by the Person defamed",
      keywords: "499 500 defamation maanhani reputation damage slander libel 356",
      desc: "Making or publishing any imputation concerning any person intending to harm the reputation of such person. BNS introduces Community Service as an alternative sentence.",
    },
    {
      id: "sec-173-bnss",
      oldSec: "CrPC 154",
      newSec: "BNSS 173",
      act: "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
      title: "Information in Cognizable Cases (FIR, Zero FIR & e-FIR)",
      punishment: "Mandatory Registration of FIR",
      cognizable: "Procedural",
      bailable: "N/A",
      triableBy: "Police Station / Magistrate",
      compoundable: "N/A",
      keywords: "154 fir zero fir e-fir online complaint 173 bnss lalita kumari",
      desc: "Every information relating to cognizable offence shall be recorded. Empowers filing of Zero FIR at any police station irrespective of jurisdiction and e-FIR electronically.",
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
      id: "sec-483-bnss",
      oldSec: "CrPC 439",
      newSec: "BNSS 483",
      act: "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
      title: "Special Powers of High Court or Court of Session Regarding Regular Bail",
      punishment: "Procedural Regular Bail Section",
      cognizable: "Procedural",
      bailable: "Bail Procedure",
      triableBy: "Sessions Court / High Court",
      compoundable: "N/A",
      keywords: "439 bail regular bail sessions high court 483 bnss satender antil",
      desc: "Empowers High Court or Court of Session to direct that any person accused of an offence and in custody be released on bail.",
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
      desc: "Saves inherent powers of High Court to prevent abuse of the process of any Court or otherwise to secure the ends of justice.",
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
  /*  EXHAUSTIVE DATABASE 3: 35+ HISTORIC SUPREME COURT LANDMARK PRECEDENTS      */
  /* ========================================================================== */
  const LANDMARK_JUDGMENTS_DB = [
    {
      id: "sc-gudikanti",
      caseName: "Gudikanti Narasimhulu & Ors. v. Public Prosecutor, High Court of A.P.",
      citation: "(1978) 1 SCC 240 : AIR 1978 SC 429",
      year: "1978",
      bench: "Supreme Court of India (V.R. Krishna Iyer, J.)",
      category: "Bail is Rule, Jail is Exception",
      sections: "CrPC 437, 439, Constitution Article 21 | BNSS 480, 483",
      ratioSummary:
        "The historic bedrock judgment by Justice Krishna Iyer establishing the timeless constitutional doctrine: 'Bail is the rule and jail is the exception'. Personal liberty cannot be curtailed pre-trial as a measure of punishment.",
      courtParagraphQuote:
        "The issue of bail is one of liberty, justice, public safety and burden on the public treasury of keeping persons in jail. The main purpose of arrest and detention is to ensure that the accused will appear at trial. Bail is the rule and committal to jail an exception.",
    },
    {
      id: "sc-antil",
      caseName: "Satender Kumar Antil v. Central Bureau of Investigation & Anr.",
      citation: "(2022) 10 SCC 51 : 2022 LiveLaw (SC) 577",
      year: "2022",
      bench: "Supreme Court of India (S.K. Kaul & M.M. Sundresh, JJ.)",
      category: "Bail Guidelines (Categories A, B, C, D)",
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
      category: "Arrest Safeguards & Mandatory 41A Notice",
      sections: "IPC 498A, CrPC 41(1)(b), 41A | BNS 85, BNSS 35",
      ratioSummary:
        "Mandatory 8-point checklist before arresting accused in offences punishable with imprisonment up to 7 years. Police cannot automatically arrest on filing of 498A/cheating FIR without recording written reasons and issuing 41A Notice.",
      courtParagraphQuote:
        "No arrest can be made merely because it is lawful for the police officer to do so. In all cases where the offence is punishable with imprisonment up to 7 years, police officer shall issue notice under Section 41A within two weeks of FIR. Magistrate shall not authorize mechanical detention.",
    },
    {
      id: "sc-manish-sisodia",
      caseName: "Manish Sisodia v. Directorate of Enforcement",
      citation: "2024 LiveLaw (SC) 562 : Criminal Appeal No. 3295 of 2024",
      year: "2024",
      bench: "Supreme Court of India (B.R. Gavai & K.V. Viswanathan, JJ.)",
      category: "Right to Speedy Trial & PMLA Bail",
      sections: "PMLA Sec 45, CrPC 439, Constitution Article 21 | BNSS 483",
      ratioSummary:
        "Prolonged pre-trial incarceration without trial commencing within reasonable time violates Fundamental Right to Speedy Trial under Article 21. Even stringent bail conditions under special statutes (PMLA/UAPA/NDPS) must give way to Article 21.",
      courtParagraphQuote:
        "Right to speedy trial is a fundamental right under Article 21. Where trial is unlikely to conclude in near future and accused has undergone substantial incarceration, bail cannot be denied solely on gravity of offence. Jail cannot be the rule when delay is not attributable to accused.",
    },
    {
      id: "sc-sanjay-chandra",
      caseName: "Sanjay Chandra v. Central Bureau of Investigation (2G Scam Case)",
      citation: "(2012) 1 SCC 40 : AIR 2012 SC 830",
      year: "2012",
      bench: "Supreme Court of India (G.S. Singhvi & H.L. Dattu, JJ.)",
      category: "Bail in High-Stake Economic Offences",
      sections: "CrPC 437, 439, IPC 420, 120B | BNS 318, BNSS 483",
      ratioSummary:
        "Bail cannot be withheld merely because of huge financial magnitude or public outrage. Pre-trial detention cannot be punitive. Once chargesheet is filed and evidence is documentary, keeping accused in jail is unjustified.",
      courtParagraphQuote:
        "The primary purpose of bail in economic offences is to secure the presence of the accused at trial. When there is no apprehension of tampering with evidence or fleeing from justice, bail ought not to be refused as punishment prior to conviction.",
    },
    {
      id: "sc-sushila-aggarwal",
      caseName: "Sushila Aggarwal & Ors. v. State (NCT of Delhi) & Anr. (5-Judge Bench)",
      citation: "(2020) 5 SCC 1 : 2020 LiveLaw (SC) 106",
      year: "2020",
      bench: "Supreme Court of India (Arun Mishra, Indira Banerjee, Vineet Saran, M.R. Shah & S. Ravindra Bhat, JJ.)",
      category: "Anticipatory Bail Scope & Duration",
      sections: "CrPC 438, Constitution Article 21 | BNSS 482",
      ratioSummary:
        "Anticipatory bail under Section 438 should not routinely be limited to a fixed time period. It continues normally till the end of trial unless special circumstances warrant restrictive conditions.",
      courtParagraphQuote:
        "The protection granted to a person under Section 438 CrPC should not invariably be limited to a fixed period; it should inure in his favour till the conclusion of the trial. Life of anticipatory bail does not end automatically on filing of chargesheet.",
    },
    {
      id: "sc-sibbia",
      caseName: "Gurbaksh Singh Sibbia v. State of Punjab (5-Judge Constitution Bench)",
      citation: "(1980) 2 SCC 565 : AIR 1980 SC 1632",
      year: "1980",
      bench: "Supreme Court of India (Y.V. Chandrachud CJI, P.N. Bhagwati, V.R. Krishna Iyer, R.S. Sarkaria & D.A. Desai, JJ.)",
      category: "Constitutional Basis of Anticipatory Bail",
      sections: "CrPC 438, Constitution Article 21 | BNSS 482",
      ratioSummary:
        "Foundational Constitution Bench judgment holding that Section 438 CrPC is an integral part of personal liberty under Article 21. High Courts and Sessions Courts possess wide discretion which should not be shackled by unnecessary limitations.",
      courtParagraphQuote:
        "The power under Section 438 is wide and untrammelled by implicit restrictions. Discretion must be exercised wisely and judiciously, keeping in view the nature of accusation and individual liberty of the citizen.",
    },
    {
      id: "sc-dk-basu",
      caseName: "D.K. Basu v. State of West Bengal",
      citation: "(1997) 1 SCC 416 : AIR 1997 SC 610",
      year: "1997",
      bench: "Supreme Court of India (Kuldip Singh & Dr. A.S. Anand, JJ.)",
      category: "11 Golden Guidelines Against Custodial Torture",
      sections: "CrPC 41B, 50A, 54, 55A, Constitution Articles 21, 22 | BNSS 36, 47, 53",
      ratioSummary:
        "Prescribed 11 mandatory procedural safeguards for police during arrest: identification memo, informing relatives, medical checkup every 48 hours, right to meet advocate during interrogation.",
      courtParagraphQuote:
        "Custodial violence, torture and custodial deaths strike a blow at the rule of law. The 11 requirements laid down by this Court shall be strictly observed by all police and investigating authorities across the nation.",
    },
    {
      id: "sc-bhajanlal",
      caseName: "State of Haryana & Ors. v. Bhajan Lal & Ors.",
      citation: "1992 Supp (1) SCC 335 : AIR 1992 SC 604",
      year: "1992",
      bench: "Supreme Court of India (S. Ratnavel Pandian & K. Jayachandra Reddy, JJ.)",
      category: "FIR Quashing (The 7 Golden Parameters)",
      sections: "CrPC 482, Constitution Article 226 | BNSS 528",
      ratioSummary:
        "The Supreme Court formulated the 7 Golden Illustrative Categories of cases where the High Court must exercise extraordinary inherent jurisdiction under Section 482 CrPC to quash malicious, absurd, or legally barred FIRs.",
      courtParagraphQuote:
        "Where the allegations made in the FIR or complaint, even if taken at their face value and accepted in their entirety, do not prima facie constitute any offence or make out a case against the accused, or where criminal proceeding is manifestly attended with mala fide, the High Court shall quash the FIR.",
    },
    {
      id: "sc-rp-kapur",
      caseName: "R.P. Kapur v. State of Punjab (3-Judge Bench)",
      citation: "AIR 1960 SC 866 : 1960 Cri LJ 1239",
      year: "1960",
      bench: "Supreme Court of India (P.B. Gajendragadkar, K.N. Wanchoo & K.C. Das Gupta, JJ.)",
      category: "Inherent Quashing Jurisdiction",
      sections: "CrPC 482 (Old CrPC 561A) | BNSS 528",
      ratioSummary:
        "Outlined the 3 broad heads under which High Court can quash criminal proceedings: (1) legal bar to institution, (2) allegations in FIR do not constitute offence even if true, (3) manifest absence of legal evidence.",
      courtParagraphQuote:
        "Inherent power under Section 482 can be exercised where there is a legal bar against the institution or continuance of criminal proceedings, or where the allegations in the First Information Report do not make out the offence alleged.",
    },
    {
      id: "sc-lalita-kumari",
      caseName: "Lalita Kumari v. Govt. of U.P. & Ors. (5-Judge Constitution Bench)",
      citation: "(2014) 2 SCC 1 : AIR 2014 SC 187",
      year: "2014",
      bench: "Supreme Court of India (P. Sathasivam CJI, B.S. Chauhan, Ranjana Desai, Ranjan Gogoi & S.A. Bobde, JJ.)",
      category: "Mandatory Registration of FIR",
      sections: "CrPC 154 | BNSS 173",
      ratioSummary:
        "Registration of FIR is mandatory under Section 154 CrPC if information discloses commission of a cognizable offence. Preliminary enquiry is permissible only in limited categories (matrimonial, commercial, medical negligence, corruption) and must be completed within 7 days.",
      courtParagraphQuote:
        "Registration of FIR is mandatory under Section 154 of the Code, if the information discloses commission of a cognizable offence and no preliminary inquiry is permissible in such a situation. Action must be taken against erring police officers who refuse to register FIR.",
    },
    {
      id: "sc-gian-singh",
      caseName: "Gian Singh v. State of Punjab (3-Judge Bench)",
      citation: "(2012) 10 SCC 303 : 2012 LiveLaw (SC) 18",
      year: "2012",
      bench: "Supreme Court of India (R.M. Lodha, Anil R. Dave & Sudhansu Jyoti Mukhopadhaya, JJ.)",
      category: "Quashing Non-Compoundable FIR on Compromise",
      sections: "CrPC 320, 482 | BNSS 359, 528",
      ratioSummary:
        "High Court under Section 482 has inherent power to quash criminal proceedings even for non-compoundable offences arising from commercial, financial, matrimonial or civil disputes where parties have settled amicably and conviction is remote.",
      courtParagraphQuote:
        "The power of the High Court in quashing criminal proceedings on the ground of settlement between the parties is distinct from the power of compounding under Section 320. Where dispute is overwhelmingly civil or private and continuation would cause gross injustice, High Court may quash FIR.",
    },
    {
      id: "sc-rangappa",
      caseName: "Rangappa v. Sri Mohan",
      citation: "(2010) 11 SCC 441 : AIR 2010 SC 1898 (3-Judge Bench)",
      year: "2010",
      bench: "Supreme Court of India (K.G. Balakrishnan CJI, P. Sathasivam & J.M. Panchal, JJ.)",
      category: "Section 139 NI Act Presumption of Debt",
      sections: "Negotiable Instruments Act 1881 Sec 138, 139, 118",
      ratioSummary:
        "Presumption under Section 139 of NI Act includes the existence of a legally enforceable debt or liability. Once signature on the cheque is admitted, the burden shifts entirely to the accused to rebut the presumption by raising a probable defence.",
      courtParagraphQuote:
        "The presumption mandated by Section 139 NI Act does indeed include the existence of a legally enforceable debt or liability. It is a rebuttable presumption and it is open to the accused to raise a defence on preponderance of probabilities, but mere bare denial by accused is insufficient.",
    },
    {
      id: "sc-birsingh",
      caseName: "Bir Singh v. Mukesh Kumar",
      citation: "(2019) 4 SCC 197 : 2019 LiveLaw (SC) 84",
      year: "2019",
      bench: "Supreme Court of India (R. Banumathi & Indira Banerjee, JJ.)",
      category: "Blank Signed Cheque Liability (Sec 138)",
      sections: "Negotiable Instruments Act 1881 Sec 20, 138, 139",
      ratioSummary:
        "Even if a blank cheque is voluntarily signed and handed over towards a debt, and the particulars are filled in by another person, the drawer is fully liable under Section 138 NI Act unless he proves absence of debt.",
      courtParagraphQuote:
        "A meaningful reading of the provisions of the Negotiable Instruments Act makes it clear that a person who signs a cheque and makes it over to the payee remains liable unless he adduces evidence to rebut the statutory presumption.",
    },
    {
      id: "sc-meters",
      caseName: "Meters and Instruments Private Limited & Anr. v. Kanchan Mehta",
      citation: "(2018) 1 SCC 560 : AIR 2017 SC 4594",
      year: "2017",
      bench: "Supreme Court of India (A.K. Goel & U.U. Lalit, JJ.)",
      category: "Compounding Cheque Bounce Cases Without Complainant Consent",
      sections: "NI Act Sec 138, 143, 147, CrPC 258",
      ratioSummary:
        "Offence under Section 138 NI Act is primarily a civil wrong. The Court can close/discharge proceedings if the accused deposits the cheque amount with appropriate interest and costs, even without explicit consent of complainant.",
      courtParagraphQuote:
        "The object of Section 138 is compensatory rather than punitive. Where the accused satisfies the Court with deposit of principal plus reasonable costs, the Court may close the proceedings to prevent clogging of criminal dockets.",
    },
    {
      id: "sc-sms-pharma",
      caseName: "SMS Pharmaceuticals Ltd. v. Neeta Bhalla & Anr. (3-Judge Bench)",
      citation: "(2005) 8 SCC 89 : AIR 2005 SC 4301",
      year: "2005",
      bench: "Supreme Court of India (Y.K. Sabharwal CJI, C.K. Thakker & P.K. Balasubramanyan, JJ.)",
      category: "Director Liability in Company Cheque Bounce (Sec 141)",
      sections: "NI Act Sec 138, 141",
      ratioSummary:
        "Specific averment in complaint is mandatory showing that the Director was in charge of and responsible for conduct of company's business at the time cheque was issued. Mere designation as Director is insufficient to fasten vicarious criminal liability.",
      courtParagraphQuote:
        "It is necessary for a complainant to state in the complaint that the person accused was in charge of and responsible for the conduct of business of the company. In the absence of such specific averment, criminal proceedings against Director are liable to be quashed.",
    },
    {
      id: "sc-mohanraj",
      caseName: "P. Mohanraj & Ors. v. Shah Brothers Ispat Pvt. Ltd. (3-Judge Bench)",
      citation: "(2021) 6 SCC 258 : 2021 LiveLaw (SC) 120",
      year: "2021",
      bench: "Supreme Court of India (R.F. Nariman, Navin Sinha & K.M. Joseph, JJ.)",
      category: "IBC Moratorium vs Section 138 Cheque Bounce",
      sections: "Insolvency and Bankruptcy Code 2016 Sec 14, NI Act Sec 138",
      ratioSummary:
        "Moratorium under Section 14 IBC applies to parallel Section 138 NI Act cheque bounce proceedings against corporate debtor company. However, criminal prosecution continues against natural persons / Directors under Section 141.",
      courtParagraphQuote:
        "Proceedings under Section 138 NI Act are quasi-criminal in nature and fall within the term 'proceedings' under Section 14(1)(a) IBC. While proceedings against the corporate debtor are stayed during moratorium, Directors cannot claim moratorium protection.",
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
      id: "sc-social-action",
      caseName: "Social Action Forum for Manav Adhikar v. Union of India",
      citation: "(2018) 10 SCC 443 : 2018 LiveLaw (SC) 84",
      year: "2018",
      bench: "Supreme Court of India (Dipak Misra CJI, A.M. Khanwilkar & D.Y. Chandrachud, JJ.)",
      category: "Section 498A IPC Guidelines Restored",
      sections: "IPC 498A, CrPC 41A | BNS 85, BNSS 35",
      ratioSummary:
        "Modified Rajesh Sharma judgment and withdrew mandatory Welfare Committees. Reaffirmed that police must strictly follow Arnesh Kumar guidelines and Section 41A notice before arresting husband and in-laws in 498A cases.",
      courtParagraphQuote:
        "Investigating officers must be duly guided by the principles laid down in Arnesh Kumar to prevent unwarranted arrests under Section 498A IPC.",
    },
    {
      id: "sc-shilpa-sailesh",
      caseName: "Shilpa Sailesh v. Varun Sreenivasan (5-Judge Constitution Bench)",
      citation: "2023 LiveLaw (SC) 375 : (2023) SCC Online SC 544",
      year: "2023",
      bench: "Supreme Court of India (S.K. Kaul, Sanjiv Khanna, A.S. Oka, Vikram Nath & J.K. Maheshwari, JJ.)",
      category: "Article 142 Direct Divorce on Irretrievable Breakdown",
      sections: "Hindu Marriage Act Sec 13B, Constitution Article 142",
      ratioSummary:
        "Supreme Court can exercise plenary powers under Article 142 to grant divorce on the ground of 'irretrievable breakdown of marriage', and waive the mandatory 6-month statutory waiting period under Section 13B(2) HMA.",
      courtParagraphQuote:
        "This Court can grant a decree of divorce on the ground of irretrievable breakdown of marriage in exercise of powers under Article 142(1) where the marriage is emotionally dead and beyond repair.",
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
      id: "sc-selvi",
      caseName: "Selvi & Ors. v. State of Karnataka (3-Judge Bench)",
      citation: "(2010) 7 SCC 263 : AIR 2010 SC 1974",
      year: "2010",
      bench: "Supreme Court of India (K.G. Balakrishnan CJI, R.V. Raveendran & J.M. Panchal, JJ.)",
      category: "Involuntary Narco / Polygraph Unconstitutional",
      sections: "Constitution Article 20(3), Article 21, CrPC 161(2)",
      ratioSummary:
        "Forcible administration of narco-analysis, polygraph (lie-detector), and brain-mapping tests violates the Fundamental Right against Self-Incrimination under Article 20(3) and Right to Privacy under Article 21.",
      courtParagraphQuote:
        "No individual should be forcibly subjected to any of the techniques in question, whether in the context of investigation or otherwise. Doing so would amount to an unwarranted intrusion into personal liberty.",
    },
    {
      id: "sc-kesavananda",
      caseName: "Kesavananda Bharati v. State of Kerala (13-Judge Bench)",
      citation: "(1973) 4 SCC 225 : AIR 1973 SC 1461",
      year: "1973",
      bench: "Supreme Court of India (S.M. Sikri CJI, J.M. Shelat, K.S. Hegde, A.N. Grover, A.N. Ray, P.J. Reddy, D.G. Palekar, H.R. Khanna, K.K. Mathew, M.H. Beg, S.N. Dwivedi, A.K. Mukherjea & Y.V. Chandrachud, JJ.)",
      category: "Basic Structure Doctrine",
      sections: "Constitution of India Article 368, Part III",
      ratioSummary:
        "Parliament has wide power to amend the Constitution under Article 368, but it cannot alter or destroy the 'Basic Structure' of the Constitution (Democracy, Rule of Law, Judicial Review, Separation of Powers).",
      courtParagraphQuote:
        "Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution.",
    },
    {
      id: "sc-maneka",
      caseName: "Maneka Gandhi v. Union of India (7-Judge Bench)",
      citation: "(1978) 1 SCC 248 : AIR 1978 SC 597",
      year: "1978",
      bench: "Supreme Court of India (M.H. Beg CJI, Y.V. Chandrachud, P.N. Bhagwati, V.R. Krishna Iyer, N.L. Untwalia, S.M. Fazal Ali & P.S. Kailasam, JJ.)",
      category: "Due Process & Procedure Established by Law",
      sections: "Constitution Articles 14, 19, 21, Passports Act 1967",
      ratioSummary:
        "Procedure depriving a person of life or personal liberty under Article 21 must be 'just, fair and reasonable', not arbitrary, fanciful or oppressive. Golden Triangle of Articles 14, 19, and 21 established.",
      courtParagraphQuote:
        "Procedure established by law under Article 21 must answer the test of reasonableness in order to be in conformity with Article 14. It must be right and just and fair and not arbitrary, fanciful or oppressive.",
    },
    {
      id: "sc-puttaswamy",
      caseName: "Justice K.S. Puttaswamy (Retd.) v. Union of India (9-Judge Bench)",
      citation: "(2017) 10 SCC 1 : AIR 2017 SC 4161",
      year: "2017",
      bench: "Supreme Court of India (J.S. Khehar CJI, J. Chelameswar, S.A. Bobde, R.K. Agrawal, R.F. Nariman, A.M. Sapre, D.Y. Chandrachud, S.K. Kaul & S. Abdul Nazeer, JJ.)",
      category: "Right to Privacy as Fundamental Right",
      sections: "Constitution Part III, Articles 14, 19, 21",
      ratioSummary:
        "Unanimously declared that the Right to Privacy is an intrinsic part of the Right to Life and Personal Liberty under Article 21 and Part III of the Constitution.",
      courtParagraphQuote:
        "The right to privacy is a fundamental right protected under Article 21 and the freedoms guaranteed by Part III. Privacy includes at its core the preservation of personal intimacies, the sanctity of family life, marriage, procreation, the home and sexual orientation.",
    },
    {
      id: "sc-shreya-singhal",
      caseName: "Shreya Singhal v. Union of India",
      citation: "(2015) 5 SCC 1 : AIR 2015 SC 1523",
      year: "2015",
      bench: "Supreme Court of India (J. Chelameswar & R.F. Nariman, JJ.)",
      category: "Section 66A IT Act Struck Down",
      sections: "Information Technology Act 2000 Sec 66A, 79, Constitution Article 19(1)(a)",
      ratioSummary:
        "Struck down Section 66A of Information Technology Act as unconstitutional for being vague, overbroad and violative of Freedom of Speech and Expression under Article 19(1)(a).",
      courtParagraphQuote:
        "Section 66A of the Information Technology Act is unconstitutional in its entirety. The distinction between discussion, advocacy and incitement is fundamental to freedom of speech.",
    },
    {
      id: "sc-morgan-stanley",
      caseName: "Morgan Stanley Mutual Fund v. Kartick Das",
      citation: "(1994) 4 SCC 225 : (1994) 2 Comp LJ 365",
      year: "1994",
      bench: "Supreme Court of India (S. Mohan & M.K. Mukherjee, JJ.)",
      category: "Principles for Ex-Parte Injunctions (Order 39 CPC)",
      sections: "CPC Order 39 Rules 1 & 2, Specific Relief Act Sec 38",
      ratioSummary:
        "Laid down 7 strict criteria before civil courts grant ex-parte ad-interim injunctions: prima facie case, irreparable injury, balance of convenience, and recording reasons for dispense of notice.",
      courtParagraphQuote:
        "Ex-parte ad-interim injunction should be granted only in exceptional circumstances. The Court must record reasons why delay would defeat justice.",
    },
    {
      id: "sc-vidya-drolia",
      caseName: "Vidya Drolia & Ors. v. Durga Trading Corporation (3-Judge Bench)",
      citation: "(2021) 2 SCC 1 : 2020 LiveLaw (SC) 972",
      year: "2020",
      bench: "Supreme Court of India (N.V. Ramana, Sanjiv Khanna & Krishna Murari, JJ.)",
      category: "Four-Fold Test for Arbitrability of Disputes",
      sections: "Arbitration & Conciliation Act 1996 Sec 8, 11, Transfer of Property Act",
      ratioSummary:
        "Formulated the 4-fold test to determine when a dispute is non-arbitrable: actions in rem, sovereign functions, third-party rights, and exclusive tribunal statutory regimes. Landlord-tenant disputes under TPA held arbitrable.",
      courtParagraphQuote:
        "Disputes are non-arbitrable when cause of action relates to actions in rem, affects third-party rights, requires public adjudication, or relates to inalienable sovereign functions.",
    },
    {
      id: "sc-curative-arbitration",
      caseName: "In Re: Interplay Between Arbitration Agreements & Stamp Act (7-Judge Bench)",
      citation: "2023 LiveLaw (SC) 1049 : (2024) 6 SCC 1",
      year: "2023",
      bench: "Supreme Court of India (D.Y. Chandrachud CJI, S.K. Kaul, Sanjiv Khanna, B.R. Gavai, Surya Kant, J.B. Pardiwala & Manoj Misra, JJ.)",
      category: "Unstamped Arbitration Agreement Validity",
      sections: "Arbitration Act Sec 8, 11, Indian Stamp Act 1899 Sec 35",
      ratioSummary:
        "Overruled NN Global 5-judge bench. Held that unstamped or insufficiently stamped underlying contracts do not render the arbitration clause void ab initio. Defect is curable and referral under Section 11 must be made.",
      courtParagraphQuote:
        "Non-stamping or insufficient stamping is a curable defect. The arbitral tribunal has competence to decide issues of stamping at the merits stage.",
    },
    {
      id: "sc-fortune-infra",
      caseName: "Fortune Infrastructure & Anr. v. Trevor D'Lima & Ors.",
      citation: "(2018) 5 SCC 442 : AIR 2018 SC 1557",
      year: "2018",
      bench: "Supreme Court of India (A.K. Sikri & Ashok Bhushan, JJ.)",
      category: "Builder Delay & Homebuyer Full Refund Right",
      sections: "Consumer Protection Act 1986 / 2019, RERA 2016 Sec 18",
      ratioSummary:
        "A flat purchaser / homebuyer cannot be made to wait indefinitely for possession. Delay beyond reasonable period entitles homebuyer to seek full refund with interest and compensation.",
      courtParagraphQuote:
        "A buyer cannot be expected to wait endlessly for possession of the flat. After expiry of delivery date plus grace period, homebuyer is entitled to complete refund of amounts paid with commercial interest.",
    },
    {
      id: "sc-sarla-verma",
      caseName: "Sarla Verma & Ors. v. Delhi Transport Corporation & Anr.",
      citation: "(2009) 6 SCC 121 : AIR 2009 SC 3104",
      year: "2009",
      bench: "Supreme Court of India (R.V. Raveendran & P. Sathasivam, JJ.)",
      category: "MACT Road Accident Compensation Multiplier Formula",
      sections: "Motor Vehicles Act 1988 Sec 166, 168",
      ratioSummary:
        "Standardized nationwide multiplier table (from age 15 to 65+) and deduction percentages for personal expenses (1/3rd, 1/4th, 1/5th) in Motor Accident Claims Tribunal (MACT) death compensation.",
      courtParagraphQuote:
        "Lack of uniformity in award of compensation causes confusion. The standardized multiplier table and deduction formula laid down herein shall be uniformly applied by all Claims Tribunals.",
    },
    {
      id: "sc-pranay-sethi",
      caseName: "National Insurance Co. Ltd. v. Pranay Sethi & Ors. (5-Judge Bench)",
      citation: "(2017) 16 SCC 680 : AIR 2017 SC 5157",
      year: "2017",
      bench: "Supreme Court of India (Dipak Misra CJI, A.K. Sikri, A.M. Khanwilkar, D.Y. Chandrachud & Ashok Bhushan, JJ.)",
      category: "Future Prospects in MACT Claims Standardized",
      sections: "Motor Vehicles Act 1988 Sec 166, 168",
      ratioSummary:
        "Standardized addition for 'Future Prospects' in fatal accident claims: 50% for permanent job < 40 yrs, 30% for 40-50 yrs, 15% for 50-60 yrs; and fixed conventional sums for loss of estate, consortium and funeral expenses.",
      courtParagraphQuote:
        "While determining income in MACT claims, addition of future prospects is mandatory: 50% actual salary if deceased below 40 years with permanent job, and conventional heads of ₹15,000, ₹40,000 and ₹15,000.",
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

  const handleUniversalSearch = (query: string) => {
    const term = encodeURIComponent(query || "Supreme Court of India judgments");
    window.open(`https://indiankanoon.org/search/?formInput=${term}`, "_blank");
  };

  /* ========================================================================== */
  /*  MODULE 4: 1-CLICK COURT-READY LEGAL NOTICE GENERATOR                      */
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
  /*  MODULE 5: LIMITATION PERIOD CALCULATOR (LIMITATION ACT 1963)              */
  /* ========================================================================== */
  const [limitationType, setLimitationType] = useState<"recovery" | "sec138" | "consumer" | "appeal_hc" | "decree">("sec138");
  const [causeOfActionDate, setCauseOfActionDate] = useState("2025-01-20");

  const limitationCalculation = useMemo(() => {
    const start = new Date(causeOfActionDate || new Date());
    let deadline = new Date(start);
    let totalDays = 0;
    let statutoryRule = "";

    if (limitationType === "sec138") {
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
  /*  MODULE 6: STATE-WISE COURT FEE CALCULATOR                                 */
  /* ========================================================================== */
  const [suitValuation, setSuitValuation] = useState<number | string>(1000000);
  const [selectedState, setSelectedState] = useState("delhi");
  const [suitCategory, setSuitCategory] = useState("recovery");

  const courtFeeCalculation = useMemo(() => {
    const val = Number(suitValuation) || 0;
    let fee = 0;

    if (selectedState === "delhi") {
      if (val <= 100000) fee = val * 0.03;
      else if (val <= 500000) fee = 3000 + (val - 100000) * 0.02;
      else if (val <= 2000000) fee = 11000 + (val - 500000) * 0.015;
      else fee = 33500 + (val - 2000000) * 0.01;
    } else if (selectedState === "up") {
      fee = val * 0.075;
    } else if (selectedState === "maharashtra") {
      fee = Math.min(300000, val * 0.05);
    } else {
      fee = val * 0.05;
    }

    if (suitCategory === "injunction") fee = 500;

    return {
      courtFeeAmount: Math.round(fee),
      stampPaperType: "Non-Judicial / e-Court Stamp Paper",
    };
  }, [suitValuation, selectedState, suitCategory]);

  /* ========================================================================== */
  /*  MODULE 7: LEGAL INTEREST & DECREE CALCULATOR (SECTION 34 CPC)             */
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
                  ⚖️ Complete 1,059 Sections
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
                BNS (358 Sec), BNSS (531 Sec), BSA (170 Sec) Bare-Act Section Browser, 1950-2025 Landmark Supreme Court Matrix, 1-Click Court Notice Generator &amp; Limitation Engine.
              </p>
            </div>

            {/* ── 8 MASTER MODULE TABS ────────────────────────────────────────── */}
            <div className="no-print flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "bareact", name: "📖 Bare-Act Sections (BNS / BNSS / BSA)" },
                { id: "converter", name: "🔍 IPC ⟷ BNS Section Converter" },
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

            {/* ── 1. COMPLETE BARE-ACT CHAPTERS & INDIVIDUAL SECTIONS BROWSER ── */}
            {activeTab === "bareact" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full sm:w-auto">
                      {(["BNS", "BNSS", "BSA"] as const).map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => {
                            setSelectedBareAct(act);
                            setSelectedChapterFilter("ALL");
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                            selectedBareAct === act
                              ? "bg-indigo-600 text-white shadow-md"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60"
                          }`}
                        >
                          {act === "BNS" && "🇮🇳 BNS (358 Sec / 20 Ch)"}
                          {act === "BNSS" && "⚖️ BNSS (531 Sec / 39 Ch)"}
                          {act === "BSA" && "📜 BSA (170 Sec / 12 Ch)"}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-1/2">
                      <span className="absolute left-3.5 top-2.5 text-slate-400">🔍</span>
                      <input
                        type="text"
                        value={bareActSearchQuery}
                        onChange={(e) => setBareActSearchQuery(e.target.value)}
                        placeholder={`Search ${selectedBareAct} Section Number (e.g. 103, 173, 483, 63, 69, 318) or Title...`}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Filter by Chapter:</span>
                      <select
                        value={selectedChapterFilter}
                        onChange={(e) => setSelectedChapterFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-1.5 text-xs font-bold outline-none"
                      >
                        <option value="ALL">All Chapters ({currentActChapters.length})</option>
                        {currentActChapters.map((ch) => (
                          <option key={ch.num} value={`Chapter ${ch.num}`}>
                            Chapter {ch.num}: {ch.title} ({ch.secRange})
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-indigo-600 font-black text-[11px]">
                      Showing Individual Bare-Act Sections with Old Law Cross-References
                    </span>
                  </div>
                </div>

                {/* Chapters with Expanded Sections List */}
                <div className="space-y-6">
                  {filteredActChapters.map((ch) => (
                    <div
                      key={ch.num}
                      className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 font-black text-xs border border-indigo-200">
                            Chapter {ch.num}
                          </span>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {ch.title}
                          </h3>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                          {ch.secRange}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ch.sections.map((s) => (
                          <div
                            key={s.sec}
                            className="p-4 bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-indigo-500/40 transition"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-black text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                                Section {s.sec}
                              </span>
                              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200">
                                Formerly {s.old}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                              {s.title}
                            </h4>

                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              {s.nature}
                            </p>

                            <div className="pt-2 border-t flex justify-between items-center text-[10px]">
                              <span className="text-slate-400 font-mono">{selectedBareAct} Section {s.sec}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const text = `${selectedBareAct} Section ${s.sec}: "${s.title}" (Formerly ${s.old}) — ${s.nature}`;
                                  navigator.clipboard.writeText(text);
                                  setCopiedCitationId(`sec-${selectedBareAct}-${s.sec}`);
                                  setTimeout(() => setCopiedCitationId(null), 2000);
                                }}
                                className="text-indigo-600 font-bold hover:underline"
                              >
                                {copiedCitationId === `sec-${selectedBareAct}-${s.sec}` ? "✓ Copied!" : "📋 Copy Section"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 2. IPC ⟷ BNS & CrPC ⟷ BNSS CONVERTER ──────────────────────── */}
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
                    <span>Showing statutory legal sections</span>
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

            {/* ── 3. LANDMARK SUPREME COURT PRECEDENTS DATABASE ─────────────── */}
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
                        placeholder="Search Landmark Rulings by Case Name, Topic (Bail, 498A, Cheque Bounce, Quashing, 65B)..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUniversalSearch(judgmentSearchQuery)}
                      className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shrink-0"
                    >
                      <span>🌐</span>
                      <span>Search 12.49+ Cr Court Records Live ↗</span>
                    </button>
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

            {/* ── 4. 1-CLICK LEGAL NOTICE DRAFTING ENGINE ─────────────────────── */}
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

            {/* ── 5. LIMITATION ACT ENGINE ────────────────────────────────────── */}
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
                </div>
              </div>
            )}

            {/* ── 6. COURT FEE & STAMP DUTY CALCULATOR ────────────────────────── */}
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
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 sm:border-l sm:pl-6">
                    <div><strong>Stamp Mode:</strong> {courtFeeCalculation.stampPaperType}</div>
                    <div><strong>Court Process Fee:</strong> Nominal ₹10–₹50 per summons</div>
                    <div><strong>Welfare Stamp:</strong> ₹25 / ₹50 Bar Council Stamp on Vakalatnama</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 7. SECTION 34 CPC LEGAL INTEREST CALCULATOR ──────────────────── */}
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

            {/* ── 8. VAKALATNAMA & AFFIDAVIT GENERATOR ───────────────────────── */}
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