// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import ProGate from "../../components/ProGate";
import AuthGate from "../../components/AuthGate";

/* ─────────────────────────── TYPES ─────────────────────────── */
interface Experience   { id:string; company:string; role:string; start:string; end:string; description:string }
interface Education    { id:string; degree:string; institution:string; year:string; gpa:string }
interface Project      { id:string; name:string; link:string; tech:string; description:string }
interface Certification{ id:string; name:string; issuer:string; year:string }
interface Achievement  { id:string; title:string; year:string }
interface Language     { id:string; name:string; proficiency:string }

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/* ─────────────────────────── TEMPLATES ─────────────────────── */
const TEMPLATES = [
  { id:"ats-clean",       name:"Classic ATS",          badge:"99% ATS Pass",    badgeColor:"bg-emerald-500/10 text-emerald-600 border-emerald-500/20", accent:"#1e293b" },
  { id:"modern-tech",     name:"Modern Tech & Dev",    badge:"Most Popular",    badgeColor:"bg-blue-500/10 text-blue-600 border-blue-500/20",          accent:"#0071e3" },
  { id:"executive",       name:"Executive Leadership", badge:"Corporate",       badgeColor:"bg-purple-500/10 text-purple-600 border-purple-500/20",    accent:"#0f172a" },
  { id:"minimalist",      name:"Apple Minimalist",     badge:"Ultra Clean",     badgeColor:"bg-slate-500/10 text-slate-600 border-slate-500/20",       accent:"#334155" },
  { id:"creative-accent", name:"Creative Accent",      badge:"Design & Product",badgeColor:"bg-rose-500/10 text-rose-600 border-rose-500/20",          accent:"#e11d48" },
];

/* ─────────────────────────── SAMPLE ────────────────────────── */
const S_FORM = {
  fullName:"Lakhan Kashyap", title:"Senior Full Stack Engineer",
  email:"lakhan@example.com", phone:"+91 98765 43210", location:"Mumbai, India",
  linkedin:"linkedin.com/in/lakhankashyap", website:"lakhankashyap.dev",
  summary:"Results-driven Full Stack Engineer with 5+ years building high-scale web applications using React, Next.js, Node.js, and Cloud Infrastructure. Proven track record improving system performance by 65% and leading cross-functional teams.",
  skills:"React.js, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, AWS, Docker, REST APIs, GraphQL",
};
const S_EXP:Experience[]    = [{ id:uid(), company:"TechCorp Solutions", role:"Senior Full Stack Engineer", start:"Jan 2023", end:"Present", description:"Architected Next.js frontend serving 500k+ monthly active users.\nReduced API latency by 45% via Redis caching and query optimization.\nMentored 4 junior engineers; implemented CI/CD with GitHub Actions." }];
const S_EDU:Education[]     = [{ id:uid(), degree:"B.Tech Computer Science & Engineering", institution:"Indian Institute of Technology (IIT)", year:"2017 – 2021", gpa:"8.9 / 10" }];
const S_PROJ:Project[]      = [{ id:uid(), name:"ToolBox – Web Utility Suite", link:"mytoolboxs.online", tech:"Next.js, TypeScript, Supabase", description:"All-in-one browser utility platform with PDF editing, ATS resume generation, and image tools." }];
const S_CERT:Certification[]= [{ id:uid(), name:"AWS Certified Solutions Architect", issuer:"Amazon Web Services", year:"2024" }];
const S_ACH:Achievement[]   = [{ id:uid(), title:"1st Place – National Hackathon 2023", year:"2023" }];
const S_LANG:Language[]     = [{ id:uid(), name:"English", proficiency:"Fluent" },{ id:uid(), name:"Hindi", proficiency:"Native" }];

/* ═══════════════════════ COMPONENT ═════════════════════════════ */
export default function ResumeMakerPage() {
  const [tmpl, setTmpl]   = useState("modern-tech");
  const [tab, setTab]     = useState<"edit"|"preview">("edit");
  const [form, setForm]   = useState(S_FORM);
  const [exp,  setExp]    = useState<Experience[]>(S_EXP);
  const [edu,  setEdu]    = useState<Education[]>(S_EDU);
  const [proj, setProj]   = useState<Project[]>(S_PROJ);
  const [cert, setCert]   = useState<Certification[]>(S_CERT);
  const [ach,  setAch]    = useState<Achievement[]>(S_ACH);
  const [lang, setLang]   = useState<Language[]>(S_LANG);
  const [busy, setBusy]   = useState(false);
  const [err,  setErr]    = useState("");

  const hc = (e:any) => setForm({...form,[e.target.name]:e.target.value});

  const loadSample = () => { setForm(S_FORM); setExp(S_EXP); setEdu(S_EDU); setProj(S_PROJ); setCert(S_CERT); setAch(S_ACH); setLang(S_LANG); };
  const clearAll   = () => {
    setForm({fullName:"",title:"",email:"",phone:"",location:"",linkedin:"",website:"",summary:"",skills:""});
    setExp([{id:uid(),company:"",role:"",start:"",end:"",description:""}]);
    setEdu([{id:uid(),degree:"",institution:"",year:"",gpa:""}]);
    setProj([{id:uid(),name:"",link:"",tech:"",description:""}]);
    setCert([{id:uid(),name:"",issuer:"",year:""}]);
    setAch([{id:uid(),title:"",year:""}]);
    setLang([{id:uid(),name:"",proficiency:""}]);
  };

  /* ── updaters ── */
  const upd = <T extends {id:string}>(arr:T[], id:string, f:keyof T, v:string) =>
    arr.map(x => x.id===id ? {...x,[f]:v} : x);

  /* ════════════════════ PDF GENERATION ═══════════════════════ */
  const generatePDF = async () => {
    if (!form.fullName || !form.email || !form.title) {
      setErr("Please fill Name, Email and Job Title."); return;
    }
    setBusy(true); setErr("");
    try {
      const doc  = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const PW   = doc.internal.pageSize.getWidth();   // 210
      const PH   = doc.internal.pageSize.getHeight();  // 297
      const M    = 18;                                  // margin
      const CW   = PW - 2*M;
      const BOT  = PH - M;
      let   y    = M;

      /* palette */
      const PAL:Record<string,any> = {
        "ats-clean":      { name:[15,23,42],  title:[71,85,105], sec:[15,23,42],  body:[51,65,85],   meta:[100,116,139], rule:[200,210,220], lw:0.25 },
        "modern-tech":    { name:[0,113,227],  title:[51,65,85],  sec:[0,113,227], body:[30,41,59],   meta:[100,116,139], rule:[0,113,227],   lw:0.7  },
        executive:        { name:[255,255,255],title:[203,213,225],sec:[15,23,42], body:[30,41,59],   meta:[100,116,139], rule:[15,23,42],    lw:0.3  },
        minimalist:       { name:[15,23,42],  title:[100,116,139],sec:[51,65,85], body:[71,85,105],  meta:[148,163,184], rule:[226,232,240], lw:0.2  },
        "creative-accent":{ name:[225,29,72], title:[71,85,105], sec:[225,29,72], body:[30,41,59],   meta:[100,116,139], rule:[225,29,72],   lw:0.6  },
      };
      const P = PAL[tmpl] || PAL["ats-clean"];

      const newPage = () => { doc.addPage(); y = M; };
      const room    = (n:number) => { if (y+n > BOT) newPage(); };

      /* section heading */
      const heading = (label:string) => {
        room(14);
        y += 4;
        doc.setFont("Helvetica","bold");
        doc.setFontSize(10);
        doc.setTextColor(...P.sec);
        doc.text(label.toUpperCase(), M, y);
        y += 2;
        doc.setDrawColor(...P.rule);
        doc.setLineWidth(P.lw);
        doc.line(M, y, PW-M, y);
        y += 5;
      };

      /* body text with auto wrap */
      const bodyTxt = (text:string, x:number, w:number, sz=9.5, color=P.body) => {
        doc.setFont("Helvetica","normal");
        doc.setFontSize(sz);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, w);
        for (const l of lines) { room(5); doc.text(l,x,y); y+=4.5; }
      };

      /* bullet point */
      const bullet = (text:string, indent=M+3) => {
        doc.setFont("Helvetica","normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...P.body);
        const lines = doc.splitTextToSize(text, CW - 5);
        for (let i=0;i<lines.length;i++) {
          room(5);
          doc.text((i===0?"• ":"  ")+lines[i], indent, y);
          y+=4.5;
        }
      };

      /* ─── HEADER ─── */
      if (tmpl==="executive") {
        doc.setFillColor(15,23,42);
        doc.rect(0,0,PW,42,"F");
        doc.setFont("Helvetica","bold"); doc.setFontSize(22); doc.setTextColor(255,255,255);
        doc.text(form.fullName, PW/2, 14, {align:"center"});
        doc.setFont("Helvetica","normal"); doc.setFontSize(11); doc.setTextColor(203,213,225);
        doc.text(form.title, PW/2, 22, {align:"center"});
        const cParts=[form.email,form.phone,form.location].filter(Boolean);
        doc.setFontSize(9); doc.setTextColor(148,163,184);
        doc.text(cParts.join("   |   "), PW/2, 30, {align:"center"});
        if (form.linkedin||form.website) {
          const lParts=[form.linkedin,form.website].filter(Boolean);
          doc.setFontSize(8); doc.setTextColor(100,116,139);
          doc.text(lParts.join("   |   "), PW/2, 37, {align:"center"});
        }
        y = 50;
      } else {
        /* name */
        doc.setFont("Helvetica","bold"); doc.setFontSize(22); doc.setTextColor(...P.name);
        doc.text(form.fullName, PW/2, y, {align:"center"}); y+=7;
        /* title */
        doc.setFont("Helvetica","normal"); doc.setFontSize(11); doc.setTextColor(...P.title);
        doc.text(form.title, PW/2, y, {align:"center"}); y+=6;
        /* contact row */
        const cParts=[form.email,form.phone,form.location,form.linkedin,form.website].filter(Boolean);
        if (cParts.length) {
          const cLine = cParts.join("  |  ");
          doc.setFontSize(8.5); doc.setTextColor(...P.meta);
          const cLines = doc.splitTextToSize(cLine, CW);
          for (const l of cLines) { doc.text(l, PW/2, y, {align:"center"}); y+=4.2; }
        }
        y+=2;
        doc.setDrawColor(...P.rule); doc.setLineWidth(P.lw);
        doc.line(M, y, PW-M, y); y+=6;
      }

      /* ─── SUMMARY ─── */
      if (form.summary.trim()) {
        heading("Professional Summary");
        bodyTxt(form.summary.trim(), M, CW);
        y+=2;
      }

      /* ─── SKILLS ─── */
      if (form.skills.trim()) {
        heading("Technical Skills");
        const skills = form.skills.split(",").map(s=>s.trim()).filter(Boolean);
        if (tmpl==="creative-accent") {
          // pill-style: comma + bullets
          bodyTxt(skills.join("  •  "), M, CW, 9.5, P.body);
        } else {
          // every ~5 skills per line
          const chunkSize = 5;
          for (let i=0;i<skills.length;i+=chunkSize) {
            const chunk = skills.slice(i,i+chunkSize).join("  |  ");
            bodyTxt(chunk, M, CW, 9.5, P.body);
          }
        }
        y+=2;
      }

      /* ─── EXPERIENCE ─── */
      const validExp = exp.filter(e=>e.company||e.role);
      if (validExp.length) {
        heading("Work Experience");
        for (const e of validExp) {
          room(12);
          doc.setFont("Helvetica","bold"); doc.setFontSize(10.5); doc.setTextColor(...P.sec);
          doc.text(e.company||"", M, y);
          if (e.start||e.end) {
            doc.setFont("Helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...P.meta);
            doc.text(`${e.start||""}${e.end?" – "+e.end:""}`, PW-M, y, {align:"right"});
          }
          y+=5;
          if (e.role) {
            doc.setFont("Helvetica","bolditalic"); doc.setFontSize(9.5); doc.setTextColor(...P.body);
            doc.text(e.role, M, y); y+=5;
          }
          if (e.description.trim()) {
            const bullets = e.description.split("\n").map(l=>l.replace(/^[-•\s]+/,"").trim()).filter(Boolean);
            for (const b of bullets) bullet(b);
          }
          y+=3;
        }
      }

      /* ─── EDUCATION ─── */
      const validEdu = edu.filter(e=>e.degree||e.institution);
      if (validEdu.length) {
        heading("Education");
        for (const e of validEdu) {
          room(10);
          doc.setFont("Helvetica","bold"); doc.setFontSize(10.5); doc.setTextColor(...P.sec);
          doc.text(e.degree||"", M, y);
          if (e.year) {
            doc.setFont("Helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...P.meta);
            doc.text(e.year, PW-M, y, {align:"right"});
          }
          y+=5;
          if (e.institution) { bodyTxt(e.institution, M, CW, 9.5); }
          if (e.gpa) {
            doc.setFont("Helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...P.meta);
            room(5); doc.text(`GPA: ${e.gpa}`, M, y); y+=4.5;
          }
          y+=2;
        }
      }

      /* ─── PROJECTS ─── */
      const validProj = proj.filter(p=>p.name);
      if (validProj.length) {
        heading("Key Projects");
        for (const p of validProj) {
          room(10);
          doc.setFont("Helvetica","bold"); doc.setFontSize(10.5); doc.setTextColor(...P.sec);
          doc.text(p.name||"", M, y);
          if (p.link) {
            doc.setFont("Helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...P.meta);
            doc.text(p.link, PW-M, y, {align:"right"});
          }
          y+=5;
          if (p.tech) { bodyTxt(`Tech: ${p.tech}`, M, CW, 9, P.meta); }
          if (p.description.trim()) {
            const bullets = p.description.split("\n").map(l=>l.replace(/^[-•\s]+/,"").trim()).filter(Boolean);
            for (const b of bullets) bullet(b);
          }
          y+=2;
        }
      }

      /* ─── CERTIFICATIONS ─── */
      const validCert = cert.filter(c=>c.name);
      if (validCert.length) {
        heading("Certifications");
        for (const c of validCert) {
          room(8);
          doc.setFont("Helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...P.body);
          doc.text(c.name||"", M, y);
          if (c.year) {
            doc.setFont("Helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...P.meta);
            doc.text(c.year, PW-M, y, {align:"right"});
          }
          y+=4.5;
          if (c.issuer) { bodyTxt(c.issuer, M, CW, 9, P.meta); }
          y+=1;
        }
      }

      /* ─── ACHIEVEMENTS ─── */
      const validAch = ach.filter(a=>a.title);
      if (validAch.length) {
        heading("Achievements & Awards");
        for (const a of validAch) {
          room(6);
          doc.setFont("Helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...P.body);
          const yr = a.year ? ` (${a.year})` : "";
          bullet(`${a.title}${yr}`);
        }
        y+=1;
      }

      /* ─── LANGUAGES ─── */
      const validLang = lang.filter(l=>l.name);
      if (validLang.length) {
        heading("Languages");
        const langStr = validLang.map(l=>`${l.name}${l.proficiency?" ("+l.proficiency+")":""}`).join("   |   ");
        bodyTxt(langStr, M, CW, 9.5);
      }

      doc.save(`${(form.fullName||"Resume").replace(/\s+/g,"_")}_${tmpl}_Resume.pdf`);
    } catch(e:any) {
      setErr("PDF generation failed. Please check your inputs.");
    } finally {
      setBusy(false);
    }
  };

  /* ════════════════════ INPUT HELPERS ════════════════════════ */
  const InputField = ({label,name,value,placeholder,type="text",full=false}:any) => (
    <div className={full?"sm:col-span-2":""}>
      <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-400">{label}</label>
      <input type={type} name={name} value={value} onChange={hc}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3] transition"
      />
    </div>
  );

  const SectionCard = ({title,children}:any) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      {children}
    </div>
  );

  const accentColor = TEMPLATES.find(t=>t.id===tmpl)?.accent || "#0071e3";

  /* ════════════════════ RENDER ═══════════════════════════════ */
  return (
    <AuthGate>
      <ProGate>
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#040404] text-[#1d1d1f] dark:text-white antialiased pb-20">

          {/* ── NAVBAR ── */}
          <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#111113]/80 border-b border-black/5 dark:border-white/10">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-1.5 shrink-0">
                <span className="text-xl">🛠️</span>
                <span className="font-bold text-[15px] tracking-tight">ToolBox</span>
                <span className="text-[10px] bg-[#0071e3]/10 text-[#0071e3] font-bold px-2 py-0.5 rounded-full border border-[#0071e3]/20">Pro</span>
              </Link>
              <div className="flex items-center gap-2">
                <button onClick={loadSample} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition">
                  ✨ <span className="hidden sm:inline">Load Sample</span>
                </button>
                <button onClick={clearAll} className="px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
                  Clear
                </button>
                <Link href="/" className="text-[11px] font-bold text-slate-500 hover:text-[#0071e3] transition">← Home</Link>
              </div>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto px-4 py-6">

            {/* TITLE */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">📝 ATS Resume Builder</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">5 professional templates · All sections · 100% browser-side · Instant PDF</p>
            </div>

            {/* ── STEP 1: TEMPLATE PICKER ── */}
            <div className="mb-6">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Step 1 · Choose Template</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {TEMPLATES.map(t => (
                  <div key={t.id} onClick={()=>setTmpl(t.id)}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all ${tmpl===t.id
                      ? "bg-white dark:bg-slate-900 border-[#0071e3] ring-2 ring-[#0071e3]/30 shadow-md"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"}`}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${t.badgeColor}`}>{t.badge}</span>
                      {tmpl===t.id && <span className="text-[#0071e3] text-xs font-bold">✓</span>}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">{t.name}</p>
                    <div className="h-1.5 w-full rounded-full mt-2" style={{background:t.accent}}/>
                  </div>
                ))}
              </div>
            </div>

            {/* ── STEP 2: TABS + GENERATE ── */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-5">
              <div className="flex gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
                {(["edit","preview"] as const).map(t=>(
                  <button key={t} onClick={()=>setTab(t)}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${tab===t?"bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm":"text-slate-500"}`}
                  >
                    {t==="edit"?"📝 Edit Form":"👁️ Preview"}
                  </button>
                ))}
              </div>
              <button onClick={generatePDF} disabled={busy}
                className="w-full sm:w-auto bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-slate-400 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2">
                {busy ? "⏳ Building..." : "⚡ Download Resume PDF"}
              </button>
            </div>

            {err && <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-3 text-xs font-semibold">⚠️ {err}</div>}

            {/* ══════════════ EDIT TAB ══════════════ */}
            {tab==="edit" && (
              <div className="space-y-4">

                {/* Personal Info */}
                <SectionCard title="">
                  <h2 className="font-bold text-base mb-4 flex items-center gap-2">👤 Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Full Name *" name="fullName" value={form.fullName} placeholder="Lakhan Kashyap"/>
                    <InputField label="Job Title *" name="title" value={form.title} placeholder="Senior Full Stack Engineer"/>
                    <InputField label="Email *" name="email" value={form.email} placeholder="you@example.com" type="email"/>
                    <InputField label="Phone" name="phone" value={form.phone} placeholder="+91 98765 43210"/>
                    <InputField label="Location" name="location" value={form.location} placeholder="Mumbai, India"/>
                    <InputField label="LinkedIn" name="linkedin" value={form.linkedin} placeholder="linkedin.com/in/you"/>
                    <InputField label="Portfolio / Website" name="website" value={form.website} placeholder="yoursite.dev" full/>
                  </div>
                </SectionCard>

                {/* Summary */}
                <SectionCard title="">
                  <h2 className="font-bold text-base mb-3 flex items-center gap-2">📋 Professional Summary</h2>
                  <textarea name="summary" value={form.summary} onChange={hc} rows={4}
                    placeholder="Results-driven engineer with X years of experience..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-[#0071e3] transition"/>
                  <p className="text-[10px] text-slate-400 mt-1.5">💡 ATS tip: include keywords from the job description here.</p>
                </SectionCard>

                {/* Skills */}
                <SectionCard title="">
                  <h2 className="font-bold text-base mb-3 flex items-center gap-2">🛠️ Technical Skills</h2>
                  <input type="text" name="skills" value={form.skills} onChange={hc}
                    placeholder="React, Next.js, TypeScript, Node.js, AWS, Docker"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3] transition"/>
                  <p className="text-[10px] text-slate-400 mt-1.5">Separate each skill with a comma.</p>
                </SectionCard>

                {/* Experience */}
                <SectionCard title="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">💼 Work Experience</h2>
                    <button onClick={()=>setExp([...exp,{id:uid(),company:"",role:"",start:"",end:"",description:""}])}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add</button>
                  </div>
                  {exp.map((e,i)=>(
                    <div key={e.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-500">Position {i+1}</span>
                        {exp.length>1 && <button onClick={()=>setExp(exp.filter(x=>x.id!==e.id))} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div><label className="block text-[11px] font-bold mb-1">Company</label><input value={e.company} onChange={ev=>setExp(upd(exp,e.id,"company",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="TechCorp"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">Job Title</label><input value={e.role} onChange={ev=>setExp(upd(exp,e.id,"role",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Software Engineer"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">Start Date</label><input value={e.start} onChange={ev=>setExp(upd(exp,e.id,"start",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Jan 2022"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">End Date</label><input value={e.end} onChange={ev=>setExp(upd(exp,e.id,"end",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Present"/></div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold mb-1">Bullet Accomplishments <span className="font-normal text-slate-400">(one per line, start with action verb)</span></label>
                          <textarea value={e.description} onChange={ev=>setExp(upd(exp,e.id,"description",ev.target.value))} rows={3} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder={"Architected frontend serving 500k users\nReduced API latency by 45% via Redis caching"}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Education */}
                <SectionCard title="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">🎓 Education</h2>
                    <button onClick={()=>setEdu([...edu,{id:uid(),degree:"",institution:"",year:"",gpa:""}])}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add</button>
                  </div>
                  {edu.map((e,i)=>(
                    <div key={e.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-500">Degree {i+1}</span>
                        {edu.length>1 && <button onClick={()=>setEdu(edu.filter(x=>x.id!==e.id))} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="sm:col-span-2"><label className="block text-[11px] font-bold mb-1">Degree / Course</label><input value={e.degree} onChange={ev=>setEdu(upd(edu,e.id,"degree",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="B.Tech Computer Science"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">Institution</label><input value={e.institution} onChange={ev=>setEdu(upd(edu,e.id,"institution",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="IIT Delhi"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">Year</label><input value={e.year} onChange={ev=>setEdu(upd(edu,e.id,"year",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="2017 – 2021"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">GPA / Percentage <span className="font-normal text-slate-400">(optional)</span></label><input value={e.gpa} onChange={ev=>setEdu(upd(edu,e.id,"gpa",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="8.9 / 10"/></div>
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Projects */}
                <SectionCard title="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">🚀 Key Projects</h2>
                    <button onClick={()=>setProj([...proj,{id:uid(),name:"",link:"",tech:"",description:""}])}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add</button>
                  </div>
                  {proj.map((p,i)=>(
                    <div key={p.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-500">Project {i+1}</span>
                        {proj.length>1 && <button onClick={()=>setProj(proj.filter(x=>x.id!==p.id))} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div><label className="block text-[11px] font-bold mb-1">Project Name</label><input value={p.name} onChange={ev=>setProj(upd(proj,p.id,"name",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="ToolBox Platform"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">Live Link</label><input value={p.link} onChange={ev=>setProj(upd(proj,p.id,"link",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="yourproject.com"/></div>
                        <div className="sm:col-span-2"><label className="block text-[11px] font-bold mb-1">Tech Stack</label><input value={p.tech} onChange={ev=>setProj(upd(proj,p.id,"tech",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Next.js, TypeScript, Supabase"/></div>
                        <div className="sm:col-span-2"><label className="block text-[11px] font-bold mb-1">Description</label><textarea value={p.description} onChange={ev=>setProj(upd(proj,p.id,"description",ev.target.value))} rows={2} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Brief description of what it does and the impact"/></div>
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Certifications */}
                <SectionCard title="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">🏆 Certifications</h2>
                    <button onClick={()=>setCert([...cert,{id:uid(),name:"",issuer:"",year:""}])}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add</button>
                  </div>
                  {cert.map((c,i)=>(
                    <div key={c.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-500">Cert {i+1}</span>
                        {cert.length>1 && <button onClick={()=>setCert(cert.filter(x=>x.id!==c.id))} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2"><label className="block text-[11px] font-bold mb-1">Certification Name</label><input value={c.name} onChange={ev=>setCert(upd(cert,c.id,"name",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="AWS Certified Solutions Architect"/></div>
                        <div><label className="block text-[11px] font-bold mb-1">Year</label><input value={c.year} onChange={ev=>setCert(upd(cert,c.id,"year",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="2024"/></div>
                        <div className="sm:col-span-3"><label className="block text-[11px] font-bold mb-1">Issuer</label><input value={c.issuer} onChange={ev=>setCert(upd(cert,c.id,"issuer",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Amazon Web Services"/></div>
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Achievements */}
                <SectionCard title="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">🥇 Achievements & Awards</h2>
                    <button onClick={()=>setAch([...ach,{id:uid(),title:"",year:""}])}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add</button>
                  </div>
                  {ach.map((a,i)=>(
                    <div key={a.id} className="flex gap-2.5 items-end mb-2">
                      <div className="flex-1"><label className="block text-[11px] font-bold mb-1">Achievement</label><input value={a.title} onChange={ev=>setAch(upd(ach,a.id,"title",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="1st Place – National Hackathon"/></div>
                      <div className="w-20"><label className="block text-[11px] font-bold mb-1">Year</label><input value={a.year} onChange={ev=>setAch(upd(ach,a.id,"year",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="2023"/></div>
                      {ach.length>1 && <button onClick={()=>setAch(ach.filter(x=>x.id!==a.id))} className="text-red-400 hover:text-red-600 text-xs font-bold mb-2">✕</button>}
                    </div>
                  ))}
                </SectionCard>

                {/* Languages */}
                <SectionCard title="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">🌐 Languages</h2>
                    <button onClick={()=>setLang([...lang,{id:uid(),name:"",proficiency:""}])}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add</button>
                  </div>
                  {lang.map((l,i)=>(
                    <div key={l.id} className="flex gap-2.5 items-end mb-2">
                      <div className="flex-1"><label className="block text-[11px] font-bold mb-1">Language</label><input value={l.name} onChange={ev=>setLang(upd(lang,l.id,"name",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="English"/></div>
                      <div className="w-32"><label className="block text-[11px] font-bold mb-1">Proficiency</label><input value={l.proficiency} onChange={ev=>setLang(upd(lang,l.id,"proficiency",ev.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0071e3]" placeholder="Fluent"/></div>
                      {lang.length>1 && <button onClick={()=>setLang(lang.filter(x=>x.id!==l.id))} className="text-red-400 hover:text-red-600 text-xs font-bold mb-2">✕</button>}
                    </div>
                  ))}
                </SectionCard>

                {/* Bottom Generate Button */}
                <button onClick={generatePDF} disabled={busy}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-slate-400 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition">
                  {busy ? "⏳ Building Resume PDF..." : "⚡ Generate & Download Resume PDF"}
                </button>
              </div>
            )}

            {/* ══════════════ PREVIEW TAB ══════════════ */}
            {tab==="preview" && (
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 max-w-3xl mx-auto overflow-hidden font-sans">

                {/* Header */}
                {tmpl==="executive" ? (
                  <div className="bg-slate-900 text-white p-6 text-center">
                    <h1 className="text-2xl font-black">{form.fullName||"Your Name"}</h1>
                    <p className="text-sm text-slate-300 mt-1">{form.title||"Job Title"}</p>
                    <p className="text-xs text-slate-400 mt-2">{[form.email,form.phone,form.location].filter(Boolean).join("   |   ")}</p>
                    {(form.linkedin||form.website) && <p className="text-xs text-slate-500 mt-1">{[form.linkedin,form.website].filter(Boolean).join("   |   ")}</p>}
                  </div>
                ):(
                  <div className="p-6 text-center border-b border-slate-100">
                    <h1 className="text-2xl font-black" style={{color:accentColor}}>{form.fullName||"Your Name"}</h1>
                    <p className="text-sm font-semibold text-slate-600 mt-1">{form.title||"Job Title"}</p>
                    <p className="text-xs text-slate-400 mt-2">{[form.email,form.phone,form.location,form.linkedin,form.website].filter(Boolean).join("   |   ")}</p>
                  </div>
                )}

                <div className="p-6 space-y-5 text-xs">
                  {/* Preview Section Helper */}
                  {(() => {
                    const PrevSection = ({label,children}:any) => (
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-widest mb-2 pb-1 border-b" style={{color:accentColor, borderColor:accentColor+"33"}}>{label}</div>
                        {children}
                      </div>
                    );
                    return (
                      <>
                        {form.summary && (
                          <PrevSection label="Professional Summary">
                            <p className="text-slate-700 leading-relaxed">{form.summary}</p>
                          </PrevSection>
                        )}

                        {form.skills && (
                          <PrevSection label="Technical Skills">
                            <p className="text-slate-700 font-medium">{form.skills.split(",").map(s=>s.trim()).filter(Boolean).join("  •  ")}</p>
                          </PrevSection>
                        )}

                        {exp.some(e=>e.company) && (
                          <PrevSection label="Work Experience">
                            {exp.filter(e=>e.company||e.role).map((e,i)=>(
                              <div key={i} className="mb-3">
                                <div className="flex justify-between font-bold text-slate-900">
                                  <span>{e.company}</span>
                                  <span className="text-slate-400 font-normal text-[10px]">{e.start}{e.end?" – "+e.end:""}</span>
                                </div>
                                <div className="italic text-slate-600 font-semibold mb-1">{e.role}</div>
                                {e.description && e.description.split("\n").filter(Boolean).map((b,j)=>(
                                  <p key={j} className="text-slate-700 before:content-['•'] before:mr-1.5">{b.replace(/^[-•\s]+/,"")}</p>
                                ))}
                              </div>
                            ))}
                          </PrevSection>
                        )}

                        {edu.some(e=>e.degree||e.institution) && (
                          <PrevSection label="Education">
                            {edu.filter(e=>e.degree||e.institution).map((e,i)=>(
                              <div key={i} className="mb-2">
                                <div className="flex justify-between font-bold text-slate-900"><span>{e.degree}</span><span className="text-slate-400 font-normal">{e.year}</span></div>
                                <div className="text-slate-600">{e.institution}{e.gpa && <span className="ml-2 text-slate-400">GPA: {e.gpa}</span>}</div>
                              </div>
                            ))}
                          </PrevSection>
                        )}

                        {proj.some(p=>p.name) && (
                          <PrevSection label="Key Projects">
                            {proj.filter(p=>p.name).map((p,i)=>(
                              <div key={i} className="mb-2">
                                <div className="flex justify-between font-bold text-slate-900"><span>{p.name}</span><span className="text-slate-400 font-normal text-[10px]">{p.link}</span></div>
                                {p.tech && <div className="text-slate-500 text-[10px]">Tech: {p.tech}</div>}
                                <p className="text-slate-700 mt-0.5">{p.description}</p>
                              </div>
                            ))}
                          </PrevSection>
                        )}

                        {cert.some(c=>c.name) && (
                          <PrevSection label="Certifications">
                            {cert.filter(c=>c.name).map((c,i)=>(
                              <div key={i} className="flex justify-between mb-1">
                                <span className="font-semibold text-slate-800">{c.name} <span className="font-normal text-slate-500">– {c.issuer}</span></span>
                                <span className="text-slate-400">{c.year}</span>
                              </div>
                            ))}
                          </PrevSection>
                        )}

                        {ach.some(a=>a.title) && (
                          <PrevSection label="Achievements & Awards">
                            {ach.filter(a=>a.title).map((a,i)=>(
                              <p key={i} className="text-slate-700 before:content-['•'] before:mr-1.5">{a.title}{a.year && <span className="text-slate-400 ml-1">({a.year})</span>}</p>
                            ))}
                          </PrevSection>
                        )}

                        {lang.some(l=>l.name) && (
                          <PrevSection label="Languages">
                            <p className="text-slate-700">{lang.filter(l=>l.name).map(l=>`${l.name}${l.proficiency?" ("+l.proficiency+")":""}`).join("   |   ")}</p>
                          </PrevSection>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* ATS tips footer */}
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                  <p className="text-[10px] text-slate-400 text-center">
                    ✅ ATS-Compliant: Single column · No images/tables · Standard headings · Machine-readable fonts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ProGate>
    </AuthGate>
  );
}