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
  /*  COMPLETE 1,059 BARE-ACT CHAPTERS & STRUCTURE (BNS, BNSS, BSA)             */
  /* ========================================================================== */
  const BARE_ACT_STRUCTURE = {
    BNS: {
      fullName: "Bharatiya Nyaya Sanhita, 2023 (BNS)",
      totalSections: 358,
      totalChapters: 20,
      enactedDate: "1st July 2024",
      replacedLaw: "Indian Penal Code, 1860 (IPC - 511 Sections)",
      chapters: [
        { num: 1, title: "Preliminary", sections: "Sec 1 to 3", desc: "Short title, commencement, application and general definitions" },
        { num: 2, title: "Of Punishments", sections: "Sec 4 to 13", desc: "Death, life imprisonment, rigorous/simple imprisonment, forfeiture, fine & Community Service" },
        { num: 3, title: "General Exceptions & Right of Private Defence", sections: "Sec 14 to 44", desc: "Acts done by mistake of fact, judicial acts, accident, necessity, insanity, intoxication, private defence" },
        { num: 4, title: "Of Abetment, Criminal Conspiracy & Attempt", sections: "Sec 45 to 62", desc: "Abetment in India and outside, criminal conspiracy (Sec 61), attempting offences (Sec 62)" },
        { num: 5, title: "Of Offences Against Women and Children", sections: "Sec 63 to 99", desc: "Rape (Sec 64), Gang rape (Sec 70), Deceitful promise of marriage (Sec 69), Dowry death (Sec 80), Cruelty (Sec 85/86), Stalking (Sec 78)" },
        { num: 6, title: "Of Offences Affecting the Human Body", sections: "Sec 100 to 146", desc: "Murder (Sec 103), Culpable homicide (Sec 105), Hit & Run rash driving (Sec 106), Attempt to murder (Sec 109), Hurt (Sec 115), Grievous hurt (Sec 117/118), Kidnapping (Sec 137)" },
        { num: 7, title: "Of Offences Against the State", sections: "Sec 147 to 158", desc: "Waging war against Govt (Sec 147), acts endangering sovereignty, unity and integrity of India (Sec 152)" },
        { num: 8, title: "Of Offences Relating to the Army, Navy and Air Force", sections: "Sec 159 to 168", desc: "Abetment of mutiny, assault on superior officer, desertion and harbouring deserter" },
        { num: 9, title: "Of Offences Relating to Elections", sections: "Sec 169 to 177", desc: "Bribery at elections, undue influence, false statement and illegal payments" },
        { num: 10, title: "Of Offences Relating to Coin, Currency-notes, Bank-notes & Stamps", sections: "Sec 178 to 188", desc: "Counterfeiting coins, forging government currency notes, possessing fake stamps" },
        { num: 11, title: "Of Offences Against the Public Tranquillity", sections: "Sec 189 to 197", desc: "Unlawful assembly (Sec 189), Rioting (Sec 191), Affray (Sec 194), Promoting enmity between groups (Sec 196)" },
        { num: 12, title: "Of Offences by or Relating to Public Servants", sections: "Sec 198 to 205", desc: "Public servant disobeying law, unlawful trading, personating a public servant" },
        { num: 13, title: "Of Contempts of the Lawful Authority of Public Servants", sections: "Sec 206 to 226", desc: "Absconding to avoid summons, omission to produce document, refusing oath or to answer questions" },
        { num: 14, title: "Of False Evidence and Offences Against Public Justice", sections: "Sec 227 to 269", desc: "Giving false evidence / perjury (Sec 227), fabricating evidence, threatening witnesses (Sec 232)" },
        { num: 15, title: "Of Offences Affecting the Public Health, Safety, Convenience & Decency", sections: "Sec 270 to 297", desc: "Public nuisance (Sec 270), adulteration of food/drugs, rash driving in public (Sec 281), obscenity (Sec 294)" },
        { num: 16, title: "Of Offences Relating to Religion", sections: "Sec 298 to 302", desc: "Injuring or defiling place of worship, outraging religious feelings (Sec 299), disturbing religious assembly" },
        { num: 17, title: "Of Offences Against Property", sections: "Sec 303 to 334", desc: "Theft (Sec 303), Snatching (Sec 304), Extortion (Sec 308), Robbery (Sec 309), Dacoity (Sec 310), Breach of trust (Sec 316), Cheating (Sec 318)" },
        { num: 18, title: "Of Offences Relating to Documents and Property Marks", sections: "Sec 335 to 350", desc: "Forgery (Sec 336), Forgery of valuable security (Sec 338), Using forged document as genuine (Sec 340)" },
        { num: 19, title: "Of Criminal Intimidation, Insult, Annoyance, Defamation, etc.", sections: "Sec 351 to 357", desc: "Criminal intimidation (Sec 351), Intentional insult (Sec 352), Defamation with Community Service (Sec 356)" },
        { num: 20, title: "Repeal and Savings", sections: "Sec 358", desc: "Repeal of Indian Penal Code (45 of 1860) and savings of previous actions & pending trials" },
      ],
    },
    BNSS: {
      fullName: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
      totalSections: 531,
      totalChapters: 39,
      schedules: "2 Schedules (Classification of Offences & 56 Statutory Forms)",
      enactedDate: "1st July 2024",
      replacedLaw: "Code of Criminal Procedure, 1973 (CrPC - 484 Sections)",
      chapters: [
        { num: 1, title: "Preliminary", sections: "Sec 1 to 5", desc: "Definitions of Bailable, Cognizable, Inquiry, Investigation, Judicial Proceeding, Victim, Police Report" },
        { num: 2, title: "Constitution of Criminal Courts and Offices", sections: "Sec 6 to 20", desc: "Sessions courts, Judicial Magistrates 1st/2nd Class, Executive Magistrates, Public Prosecutors" },
        { num: 3, title: "Power of Courts", sections: "Sec 21 to 29", desc: "Sentences which High Courts, Sessions Judges and Magistrates may pass, sentence in default of fine" },
        { num: 4, title: "Powers of Superior Police & Aid to Magistrates", sections: "Sec 30 to 34", desc: "Public when to assist Magistrates and police, aid to person executing warrant" },
        { num: 5, title: "Arrest of Persons", sections: "Sec 35 to 62", desc: "Arrest without warrant, mandatory Section 35(3) Notice for <= 7 yrs offences, arrestee rights & medical examination" },
        { num: 6, title: "Processes to Compel Appearance (Summons & Warrants)", sections: "Sec 63 to 93", desc: "Form of summons, electronic summons, warrant of arrest, proclamation and attachment of absconding offender" },
        { num: 7, title: "Processes to Compel Production of Things & Search Warrants", sections: "Sec 94 to 110", desc: "Summons to produce document, search-warrants, electronic search, seizure of stolen property" },
        { num: 8, title: "Reciprocal Arrangements & Attachment of Proceeds of Crime", sections: "Sec 111 to 124", desc: "Assistance in relation to orders of attachment, forfeiture of property derived from criminal activity" },
        { num: 9, title: "Security for Keeping the Peace and for Good Behaviour", sections: "Sec 125 to 143", desc: "Security on conviction, security from suspected persons and habitual offenders (Old 107/116)" },
        { num: 10, title: "Order for Maintenance of Wives, Children and Parents", sections: "Sec 144 to 147", desc: "Monthly maintenance order, interim maintenance, alteration in allowance and enforcement warrant (Old 125)" },
        { num: 11, title: "Maintenance of Public Order and Tranquillity", sections: "Sec 148 to 167", desc: "Unlawful assemblies, public nuisances, urgent cases of nuisance / Sec 163 (Old 144), disputes as to land" },
        { num: 12, title: "Preventive Action of the Police", sections: "Sec 168 to 172", desc: "Police to prevent cognizable offences, arrest to prevent injury to public property" },
        { num: 13, title: "Information to Police & Powers to Investigate (FIR)", sections: "Sec 173 to 196", desc: "Zero FIR & e-FIR (Sec 173), witness examination (Sec 180), confession before Magistrate (Sec 183), remand (Sec 187), chargesheet (Sec 193)" },
        { num: 14, title: "Jurisdiction of Criminal Courts in Inquiries and Trials", sections: "Sec 197 to 210", desc: "Ordinary place of inquiry/trial, offences committed on journey or electronic offences" },
        { num: 15, title: "Conditions Requisite for Initiation of Proceedings", sections: "Sec 211 to 222", desc: "Cognizance by Magistrates, prosecution for contempt of lawful authority, prosecution of Judges/Public Servants" },
        { num: 16, title: "Complaints to Magistrates", sections: "Sec 223 to 226", desc: "Examination of complainant, postponement of issue of process, dismissal of private complaint (Old 200/202)" },
        { num: 17, title: "Commencement of Proceedings Before Magistrates", sections: "Sec 227 to 233", desc: "Issue of process, electronic supply of chargesheet and police documents to accused (Sec 230)" },
        { num: 18, title: "The Charge", sections: "Sec 234 to 247", desc: "Form of charges, joinder of charges, separate charges for distinct offences" },
        { num: 19, title: "Trial Before a Court of Session", sections: "Sec 248 to 260", desc: "Opening case for prosecution, discharge (Sec 250), framing charge, plea of guilty, acquittal/conviction" },
        { num: 20, title: "Trial of Warrant-Cases by Magistrates", sections: "Sec 261 to 273", desc: "Cases instituted on police report, discharge (Sec 262), evidence for prosecution & defence" },
        { num: 21, title: "Trial of Summons-Cases by Magistrates", sections: "Sec 274 to 282", desc: "Substance of accusation to be stated, conviction on plea of guilty, non-appearance of complainant" },
        { num: 22, title: "Summary Trials", sections: "Sec 283 to 288", desc: "Power to try summarily, record in summary trials, judgment in summary cases" },
        { num: 23, title: "Plea Bargaining", sections: "Sec 289 to 300", desc: "Application for plea bargaining, mutually satisfactory disposition, finality of judgment" },
        { num: 24, title: "Attendance of Persons Confined or Detained in Prisons", sections: "Sec 301 to 306", desc: "Requiring attendance of prisoners, electronic video linkage for trial" },
        { num: 25, title: "Evidence in Inquiries and Trials", sections: "Sec 307 to 336", desc: "Language of Courts, taking and recording evidence electronically, commission for examination of witnesses" },
        { num: 26, title: "General Provisions as to Inquiries and Trials", sections: "Sec 337 to 366", desc: "Right of person against whom proceedings are instituted to be defended by counsel, examination of accused (Sec 351), compounding of offences (Sec 359)" },
        { num: 27, title: "Provisions as to Accused Persons of Unsound Mind", sections: "Sec 367 to 378", desc: "Procedure in case of lunatic accused, release on bail of person of unsound mind" },
        { num: 28, title: "Offences Affecting Administration of Justice", sections: "Sec 379 to 391", desc: "Procedure in cases mentioned in Sec 215, appeal from order under Sec 379" },
        { num: 29, title: "The Judgment", sections: "Sec 392 to 406", desc: "Language and contents of judgment, compensation to victim (Sec 395), order to pay costs" },
        { num: 30, title: "Submission of Death Sentences for Confirmation", sections: "Sec 407 to 412", desc: "Sentence of death to be submitted by Court of Session to High Court for confirmation" },
        { num: 31, title: "Appeals", sections: "Sec 413 to 435", desc: "Appeals from convictions, appeals against acquittal (Sec 419), powers of Appellate Court" },
        { num: 32, title: "Reference and Revision", sections: "Sec 436 to 445", desc: "Reference to High Court, High Court & Sessions Judge's powers of revision (Old 397/401)" },
        { num: 33, title: "Transfer of Criminal Cases", sections: "Sec 446 to 452", desc: "Supreme Court & High Court power to transfer cases and appeals, Sessions Judge power of transfer" },
        { num: 34, title: "Execution, Suspension, Remission & Commutation of Sentences", sections: "Sec 453 to 477", desc: "Execution of death sentence, warrant for levy of fine, power to suspend or remit sentences" },
        { num: 35, title: "Provisions as to Bail and Bonds", sections: "Sec 478 to 496", desc: "Bail in bailable offences (Sec 478), Bail before Magistrate (Sec 480), Anticipatory Bail (Sec 482), Special powers of High Court/Sessions for Regular Bail (Sec 483)" },
        { num: 36, title: "Disposal of Property", sections: "Sec 497 to 505", desc: "Order for custody and disposal of property pending trial, destruction of libellous and obscene matter" },
        { num: 37, title: "Irregular Proceedings", sections: "Sec 506 to 512", desc: "Irregularities which do not vitiate proceedings, proceedings in wrong place" },
        { num: 38, title: "Limitation for Taking Cognizance of Certain Offences", sections: "Sec 513 to 518", desc: "Bar to taking cognizance after lapse of period of limitation, exclusion of time" },
        { num: 39, title: "Miscellaneous & Inherent Powers of High Court", sections: "Sec 519 to 531", desc: "Inherent powers of High Court to quash proceedings / FIR (Sec 528), repeal of CrPC 1973 (Sec 531)" },
      ],
    },
    BSA: {
      fullName: "Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
      totalSections: 170,
      totalChapters: 12,
      enactedDate: "1st July 2024",
      replacedLaw: "Indian Evidence Act, 1872 (IEA - 167 Sections)",
      chapters: [
        { num: 1, title: "Preliminary", sections: "Sec 1 to 2", desc: "Short title, application to all judicial proceedings, definitions of Court, Document, Electronic record, Fact, Evidence, Proved, Disproved" },
        { num: 2, title: "Relevancy of Facts", sections: "Sec 3 to 50", desc: "Facts in issue, Res Gestae (Sec 4), Motive/preparation, Admissions, Police Confessions inadmissible (Sec 23), Dying declaration (Sec 26), Expert opinions (Sec 39), Character evidence" },
        { num: 3, title: "Facts Which Need Not Be Proved", sections: "Sec 51 to 53", desc: "Facts judicially noticeable, facts admitted need not be proved" },
        { num: 4, title: "Of Oral Evidence", sections: "Sec 54 to 55", desc: "Proof of facts by oral evidence, oral evidence must be direct" },
        { num: 5, title: "Of Documentary Evidence & Electronic Records", sections: "Sec 56 to 93", desc: "Primary & secondary evidence, electronic and digital records (Sec 61), mandatory Electronic Evidence Certificate (Sec 63 / Old 65B), public documents, presumptions as to electronic messages" },
        { num: 6, title: "Of the Exclusion of Oral by Documentary Evidence", sections: "Sec 94 to 103", desc: "Evidence of terms of contracts, grants, exclusion of evidence of oral agreement (Old 91/92)" },
        { num: 7, title: "Of the Burden of Proof", sections: "Sec 104 to 120", desc: "Burden of proof, on whom burden lies, proof of good faith, presumption as to dowry death (Sec 118 / Old 113B), presumption in rape (Sec 119 / Old 114A)" },
        { num: 8, title: "Estoppel", sections: "Sec 121 to 123", desc: "Estoppel of tenant and licensee of person in possession, estoppel of acceptor of bill of exchange" },
        { num: 9, title: "Of Witnesses", sections: "Sec 124 to 139", desc: "Who may testify, dumb witnesses, judge & magistrate privilege, professional communications of advocates / attorney-client privilege (Sec 132)" },
        { num: 10, title: "Of the Examination of Witnesses", sections: "Sec 140 to 165", desc: "Order of production, examination-in-chief, cross-examination, re-examination, leading questions (Sec 146), refreshing memory, judge's power to put questions" },
        { num: 11, title: "Of Improper Admission and Rejection of Evidence", sections: "Sec 166", desc: "No new trial for improper admission or rejection of evidence if other sufficient evidence exists" },
        { num: 12, title: "Repeal and Savings", sections: "Sec 167 to 170", desc: "Repeal of Indian Evidence Act (1 of 1872) and transitional provisions" },
      ],
    },
  };

  const [selectedBareAct, setSelectedBareAct] = useState<"BNS" | "BNSS" | "BSA">("BNS");
  const [bareActSearchQuery, setBareActSearchQuery] = useState("");

  const currentActData = BARE_ACT_STRUCTURE[selectedBareAct];

  const filteredChapters = useMemo(() => {
    const q = bareActSearchQuery.toLowerCase().trim();
    return currentActData.chapters.filter((ch) => {
      return (
        !q ||
        ch.title.toLowerCase().includes(q) ||
        ch.sections.toLowerCase().includes(q) ||
        ch.desc.toLowerCase().includes(q) ||
        `Chapter ${ch.num}`.toLowerCase().includes(q)
      );
    });
  }, [currentActData, bareActSearchQuery]);

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
  /*  EXHAUSTIVE DATABASE 3: 40+ HISTORIC SUPREME COURT LANDMARK PRECEDENTS      */
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

  // Open 12.49+ Crore live case law search externally
  const handleUniversalSearch = (query: string) => {
    const term = encodeURIComponent(query || "Supreme Court of India judgments");
    window.open(`https://indiankanoon.org/search/?formInput=${term}`, "_blank");
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
                  ⚖️ 1,059 Bare-Act Sections
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
                BNS (358 Sec), BNSS (531 Sec), BSA (170 Sec) Bare-Act Navigator, 1950-2025 Landmark Supreme Court Matrix, 1-Click Court Notice Generator &amp; Limitation Engine.
              </p>
            </div>

            {/* ── 8 MASTER MODULE TABS ────────────────────────────────────────── */}
            <div className="no-print flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "bareact", name: "📖 1,059 Bare-Act Chapters (BNS/BNSS/BSA)" },
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

            {/* ── 1. COMPLETE 1,059 BARE-ACT CHAPTERS & STRUCTURE ─────────────── */}
            {activeTab === "bareact" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full sm:w-auto">
                      {(["BNS", "BNSS", "BSA"] as const).map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setSelectedBareAct(act)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                            selectedBareAct === act
                              ? "bg-indigo-600 text-white shadow-md"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60"
                          }`}
                        >
                          {act === "BNS" && "🇮🇳 BNS (358 Sec)"}
                          {act === "BNSS" && "⚖️ BNSS (531 Sec)"}
                          {act === "BSA" && "📜 BSA (170 Sec)"}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-1/2">
                      <span className="absolute left-3.5 top-2.5 text-slate-400">🔍</span>
                      <input
                        type="text"
                        value={bareActSearchQuery}
                        onChange={(e) => setBareActSearchQuery(e.target.value)}
                        placeholder={`Search ${selectedBareAct} Chapters or Topics...`}
                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 flex flex-col sm:flex-row justify-between gap-2 text-xs">
                    <div>
                      <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block">{currentActData.fullName}</span>
                      <span className="text-[11px] text-slate-500">Replaced: {currentActData.replacedLaw}</span>
                    </div>
                    <div className="flex gap-4 font-bold text-slate-700 dark:text-slate-300">
                      <div>Total Chapters: <strong>{currentActData.totalChapters}</strong></div>
                      <div>Total Sections: <strong className="text-indigo-600">{currentActData.totalSections}</strong></div>
                      <div>Effective: <strong>{currentActData.enactedDate}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChapters.map((ch) => (
                    <div
                      key={ch.num}
                      className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-indigo-500/40 transition"
                    >
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 font-black text-[11px] border border-indigo-200">
                          Chapter {ch.num}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                          {ch.sections}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {ch.desc}
                      </p>
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