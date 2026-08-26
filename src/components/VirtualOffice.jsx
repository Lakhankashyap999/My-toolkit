// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─────────────────────────── CONSTANTS ─────────────────────────────────── */
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const EMPLOYEES = [
  { id:"no18",  name:"NO18",  role:"PDF Specialist",  tool:"PDF Editor & Merger",    path:"/pdf-tools",         shirt:"#2563eb", hair:"#1e293b", x:225, y:150 },
  { id:"aura",  name:"AURA",  role:"Resume Architect", tool:"ATS Resume Builder",     path:"/resume-maker",      shirt:"#db2777", hair:"#9333ea", x:340, y:150 },
  { id:"relax", name:"RELAX", role:"Compression Guru", tool:"Smart Image Compressor", path:"/image-compressor",  shirt:"#059669", hair:"#047857", x:455, y:150 },
  { id:"chris", name:"CHRIS", role:"Docx Converter",   tool:"PDF to Word Converter",  path:"/pdf-to-word",       shirt:"#d97706", hair:"#b45309", x:570, y:150 },
  { id:"melby", name:"MELBY", role:"QR Lead",          tool:"QR Code Generator",      path:"/qr-code-generator", shirt:"#7c3aed", hair:"#6d28d9", x:75,  y:320 },
  { id:"vikkg", name:"VIKKG", role:"Security Ops",     tool:"File Security Suite",    path:"/pdf-tools",         shirt:"#0891b2", hair:"#0e7490", x:200, y:320 },
  { id:"tony",  name:"TONY",  role:"ULTRON AI",        tool:"ULTRON 3.0 Neural AI",   path:"/chatbot",           shirt:"#4f46e5", hair:"#38bdf8", x:490, y:320 },
  { id:"bolt",  name:"BOLT",  role:"Analytics Lead",   tool:"PDF Editor & Merger",    path:"/pdf-tools",         shirt:"#dc2626", hair:"#991b1b", x:605, y:320 },
];
const PLANTS = ["🪴","🌸","🌵","🌱","🌺","🌿","🪴","🌱"];

const PRESETS = [
  { label:"📄 PDF Merge",    query:"pdf merge" },
  { label:"📝 Resume",        query:"resume banana" },
  { label:"🖼️ Compress",     query:"image compress" },
  { label:"🔳 QR Code",      query:"qr code" },
  { label:"📑 PDF→Word",     query:"pdf to word" },
  { label:"👑 Tu kaun hai?", query:"tu kaun hai?" },
];

const DISPATCH_CMD = {
  no18:  "NO18, merge the PDF documents NOW!",
  aura:  "AURA, ATS Resume Builder initialize karo!",
  relax: "RELAX, compress the images immediately!",
  chris: "CHRIS, PDF to Word convert karo!",
  melby: "MELBY, HD Vector QR generate karo!",
  vikkg: "VIKKG, file security suite run karo!",
  tony:  "TONY, ULTRON Neural AI activate karo!",
  bolt:  "BOLT, analytics dashboard launch karo!",
};

/* ─────────────── WALKING PATHS TO CABIN GATE (x=190, y=168) ─────────────── */
const TO_CABIN = {
  no18:  [[221,194],[190,168]],
  aura:  [[336,194],[200,194],[200,168],[190,168]],
  relax: [[451,194],[200,194],[200,168],[190,168]],
  chris: [[566,194],[200,194],[200,168],[190,168]],
  melby: [[71,364],[71,232],[200,232],[200,168],[190,168]],
  vikkg: [[196,364],[137,364],[137,232],[200,232],[200,168],[190,168]],
  tony:  [[486,364],[345,364],[345,232],[200,232],[200,168],[190,168]],
  bolt:  [[601,364],[651,364],[651,232],[200,232],[200,168],[190,168]],
};

/* ──────────────── AUTONOMOUS WALKER PATHS ───────────────────────────────── */
const W1_SMOKE_GO  = [[451,190],[651,190],[651,408],[772,408]];
const W1_SMOKE_RET = [[772,408],[651,408],[651,190],[451,190]];
const W1_COOLER_GO  = [[451,190],[651,190],[651,82],[710,82]];
const W1_COOLER_RET = [[710,82],[651,82],[651,190],[451,190]];
const W2_GO  = [[71,364],[137,364],[137,255],[710,255]];
const W2_RET = [[710,255],[137,255],[137,364],[71,364]];

/* ───────────────────── PATH UTILITIES ───────────────────────────────────── */
function computeLen(wps) {
  if (!wps || wps.length < 2) return 1;
  let s = 0;
  for (let i = 0; i < wps.length - 1; i++)
    s += Math.hypot(wps[i+1][0]-wps[i][0], wps[i+1][1]-wps[i][1]);
  return Math.max(1, s);
}

function pathPos(wps, t) {
  if (!wps || !wps.length) return { x:0, y:0 };
  t = Math.min(1, Math.max(0, t));
  if (t === 0) return { x:wps[0][0], y:wps[0][1] };
  if (t === 1) return { x:wps[wps.length-1][0], y:wps[wps.length-1][1] };
  const segs = wps.slice(0,-1).map((p,i)=>({
    len: Math.hypot(wps[i+1][0]-p[0], wps[i+1][1]-p[1])||0.001,
    fx:p[0], fy:p[1], tx:wps[i+1][0], ty:wps[i+1][1],
  }));
  const total = segs.reduce((s,g)=>s+g.len, 0);
  let rem = t * total;
  for (const sg of segs) {
    if (rem <= sg.len + 0.001) {
      const lt = Math.min(1, rem/sg.len);
      return { x:sg.fx+(sg.tx-sg.fx)*lt, y:sg.fy+(sg.ty-sg.fy)*lt };
    }
    rem -= sg.len;
  }
  return { x:wps[wps.length-1][0], y:wps[wps.length-1][1] };
}

/* ───────────────────── CHIBI CHARACTER ──────────────────────────────────── */
const Chibi = ({ x=0, y=0, shirt, hair, isBoss=false, walking=false, holdFile=false, holdCoffee=false }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx="0" cy="13" rx="9" ry="3.5" fill="rgba(0,0,0,0.18)" />
    <g>
      <rect x="-4.5" y="3" width="3.5" height="7" rx="1.5" fill="#1e293b" />
      <ellipse cx="-2.5" cy="10.8" rx="4.5" ry="2.5" fill="#0f172a" />
      {walking && <animateTransform attributeName="transform" type="rotate" values="-18,-2.5,3;18,-2.5,3;-18,-2.5,3" dur="0.44s" repeatCount="indefinite" />}
    </g>
    <g>
      <rect x="1" y="3" width="3.5" height="7" rx="1.5" fill="#1e293b" />
      <ellipse cx="2.5" cy="10.8" rx="4.5" ry="2.5" fill="#0f172a" />
      {walking && <animateTransform attributeName="transform" type="rotate" values="18,2.5,3;-18,2.5,3;18,2.5,3" dur="0.44s" repeatCount="indefinite" />}
    </g>
    <rect x="-7" y="-8" width="14" height="13" rx="3.5" fill={isBoss?"#0f172a":shirt} />
    {isBoss
      ? <><polygon points="-2.5,-8 0,-5 2.5,-8" fill="#fff"/><polygon points="-1.5,-5.5 0,2 1.5,-5.5" fill="#ef4444"/></>
      : <line x1="-3" y1="-8" x2="-3" y2="-3" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>}
    <g>
      <circle cx="-9" cy="-1" r="3" fill="#fcd34d" />
      {walking && <animateTransform attributeName="transform" type="rotate" values="22,-9,-8;-22,-9,-8;22,-9,-8" dur="0.44s" repeatCount="indefinite" />}
    </g>
    <g>
      <circle cx="9" cy="-1" r="3" fill="#fcd34d" />
      {holdFile   && <text x="7" y="2" fontSize="9">📑</text>}
      {holdCoffee && <text x="7" y="2" fontSize="9">☕</text>}
      {walking && <animateTransform attributeName="transform" type="rotate" values="-22,9,-8;22,9,-8;-22,9,-8" dur="0.44s" repeatCount="indefinite" />}
    </g>
    <circle cx="0" cy="-15" r="8" fill="#fcd34d" />
    <path d="M -8 -17 Q 0 -26 8 -17 Q 6 -23 0 -24 Q -6 -23 -8 -17 Z" fill={hair} />
    <circle cx="-3" cy="-15" r="1.5" fill="#0f172a" />
    <circle cx="3"  cy="-15" r="1.5" fill="#0f172a" />
    <path d="M -2 -11 Q 0 -9 2 -11" stroke="#92400e" strokeWidth="0.9" fill="none" />
    {isBoss && <>
      <ellipse cx="-3" cy="-15" rx="3.2" ry="2.5" fill="none" stroke="#334155" strokeWidth="0.9" />
      <ellipse cx="3"  cy="-15" rx="3.2" ry="2.5" fill="none" stroke="#334155" strokeWidth="0.9" />
      <line x1="-6" y1="-14" x2="-6.5" y2="-17" stroke="#334155" strokeWidth="0.9" />
      <line x1="6"  y1="-14" x2="6.5"  y2="-17" stroke="#334155" strokeWidth="0.9" />
      <text x="-5" y="-24" fontSize="11">👑</text>
    </>}
  </g>
);

/* ───────────────────── DESK UNIT ────────────────────────────────────────── */
const DeskUnit = ({ cx, cy, plant, emp, showChar, onDispatch }) => (
  <g transform={`translate(${cx},${cy})`} className="cursor-pointer" onClick={onDispatch}>
    <rect x="-42" y="-5" width="84" height="44" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="2"/>
    <rect x="22" y="0" width="18" height="36" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5"/>
    <line x1="22" y1="18" x2="40" y2="18" stroke="#78350f" strokeWidth="1"/>
    <circle cx="31" cy="10" r="2.5" fill="#fef08a"/><circle cx="31" cy="26" r="2.5" fill="#fef08a"/>
    <rect x="-24" y="-40" width="40" height="36" rx="5" fill="#c8ccd0" stroke="#6b7280" strokeWidth="2"/>
    <rect x="-20" y="-36" width="32" height="25" rx="2" fill="#052e16" stroke="#16a34a" strokeWidth="1.2"/>
    <line x1="-17" y1="-30" x2="10" y2="-30" stroke="#4ade80" strokeWidth="1.2"/>
    <line x1="-17" y1="-24" x2="6"  y2="-24" stroke="#4ade80" strokeWidth="0.9"/>
    <line x1="-17" y1="-18" x2="9"  y2="-18" stroke="#4ade80" strokeWidth="0.9"/>
    <line x1="-17" y1="-12" x2="5"  y2="-12" stroke="#4ade80" strokeWidth="0.8"/>
    <circle cx="13" cy="-19" r="1.8" fill="#4ade80"/>
    <rect x="-6" y="-4" width="12" height="5" rx="1.5" fill="#9ca3af"/>
    <rect x="-10" y="0" width="20" height="3" rx="1.5" fill="#6b7280"/>
    <rect x="-34" y="8" width="48" height="14" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
    {[0,1,2].map(r=>[0,1,2,3,4,5,6].map(c=>(
      <rect key={`k${r}${c}`} x={-31+c*6} y={10+r*4} width={4.5} height={3} rx={0.8} fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.4"/>
    )))}
    <rect x="-42" y="0" width="16" height="24" rx="1.5" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
    <rect x="-40" y="1" width="16" height="24" rx="1.5" fill="#fefce8" stroke="#d97706" strokeWidth="0.8"/>
    <rect x="-38" y="2" width="16" height="24" rx="1.5" fill="#ffffff" stroke="#e5e7eb" strokeWidth="0.8"/>
    <line x1="-36" y1="8"  x2="-24" y2="8"  stroke="#94a3b8" strokeWidth="0.7"/>
    <line x1="-36" y1="13" x2="-26" y2="13" stroke="#94a3b8" strokeWidth="0.7"/>
    <line x1="-36" y1="18" x2="-25" y2="18" stroke="#94a3b8" strokeWidth="0.7"/>
    <rect x="14" y="12" width="9" height="12" rx="3" fill="#7c3aed" stroke="#5b21b6" strokeWidth="1"/>
    <path d="M23 16 Q27 16 27 20 Q27 24 23 24" stroke="#5b21b6" strokeWidth="1" fill="none"/>
    <ellipse cx="18.5" cy="12.5" rx="4" ry="1.8" fill="#a78bfa"/>
    <text x="-42" y="-7" fontSize="13">{plant}</text>
    {showChar && <Chibi x={-4} y={44} shirt={emp.shirt} hair={emp.hair}/>}
    <rect x="-38" y="55" width="74" height="20" rx="3" fill="#0f172a" stroke={emp.shirt} strokeWidth="1.5"/>
    <text x="-30" y="69" fill={emp.shirt} fontSize="13" fontWeight="bold" fontFamily="monospace">{emp.name}</text>
  </g>
);

/* ───────────────────── DUST TRAIL ───────────────────────────────────────── */
const Dust = ({ x, y, dir=1 }) => (
  <>
    <ellipse cx={x-dir*13} cy={y} rx="11" ry="4.5" fill="#c8b898" opacity="0.5"/>
    <ellipse cx={x-dir*24} cy={y} rx="6"  ry="3"   fill="#c8b898" opacity="0.32"/>
    <ellipse cx={x-dir*33} cy={y} rx="3"  ry="2"   fill="#c8b898" opacity="0.15"/>
    <circle  cx={x-dir*10} cy={y-5} r="1.5" fill="#e0d0b0" opacity="0.4"/>
  </>
);

/* ───────────────────── SMOKE PARTICLES ──────────────────────────────────── */
const Smoke = ({ x, y }) => (
  <g>
    <text x={x-6} y={y-2} fontSize="11">🚬</text>
    <circle cx={x+5} cy={y-14} r="3" fill="#94a3b8" opacity="0.7">
      <animate attributeName="cy" values={`${y-14};${y-38}`} dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="r"  values="3;9"              dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.7;0"       dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx={x+9} cy={y-18} r="2" fill="#cbd5e1" opacity="0.5">
      <animate attributeName="cy" values={`${y-18};${y-46}`} dur="2.0s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="r"  values="2;7"               dur="2.0s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0"        dur="2.0s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx={x+3} cy={y-11} r="2" fill="#e2e8f0" opacity="0.4">
      <animate attributeName="cy" values={`${y-11};${y-30}`} dur="1.1s" begin="0.9s" repeatCount="indefinite"/>
      <animate attributeName="r"  values="2;6"               dur="1.1s" begin="0.9s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0"        dur="1.1s" begin="0.9s" repeatCount="indefinite"/>
    </circle>
  </g>
);

/* ═══════════════════════ MAIN COMPONENT ════════════════════════════════════ */
export default function VirtualOffice() {

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = now.getHours() % 12, mm = now.getMinutes(), ss = now.getSeconds();
  const toR = (deg) => ((deg - 90) * Math.PI) / 180;
  const CX = 385, CY = 25;
  const hx = CX + Math.cos(toR(hh*30 + mm*0.5)) * 9,  hy = CY + Math.sin(toR(hh*30 + mm*0.5)) * 9;
  const mx = CX + Math.cos(toR(mm*6  + ss*0.1)) * 14, my = CY + Math.sin(toR(mm*6  + ss*0.1)) * 14;
  const sx = CX + Math.cos(toR(ss*6))           * 15, sy = CY + Math.sin(toR(ss*6))           * 15;

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(v => (v+1) % 10000), 100);
    return () => clearInterval(id);
  }, []);

  const [hrMsg, setHrMsg]         = useState("Hello! Main HR Lakhan hoon 👑 · Kisi bhi tool ki help ke liye click karo ya likh ke pucho!");
  const [userInput, setUserInput] = useState("");

  const [stage, setStage]           = useState(0);
  const [runner, setRunner]         = useState(null);
  const [goPath, setGoPath]         = useState(null);
  const [retPath, setRetPath]       = useState(null);
  const [dispCmd, setDispCmd]       = useState("");
  const [stageStart, setStageStart] = useState(0);
  const [launchedTool, setLaunched] = useState(null);

  const pc = tick % 19; const showPaper = pc < 17;
  const pt = pc < 3 ? 0 : pc < 13 ? (pc-3)/10 : 1;
  const px = 108 + pt * 62, py = (162 + pt*48) - Math.sin(pt*Math.PI)*28;

  const w1c = tick % 175;
  const w1_sGo  = w1c>=10  && w1c<32;
  const w1_smk  = w1c>=32  && w1c<52;
  const w1_sRet = w1c>=52  && w1c<74;
  const w1_cGo  = w1c>=84  && w1c<114;
  const w1_cAt  = w1c>=114 && w1c<134;
  const w1_cRet = w1c>=134 && w1c<165;
  const w1active = stage===0 && (w1_sGo||w1_smk||w1_sRet||w1_cGo||w1_cAt||w1_cRet);
  const w1walk   = stage===0 && (w1_sGo||w1_sRet||w1_cGo||w1_cRet);
  const w1pos =
    w1_sGo  ? pathPos(W1_SMOKE_GO,   (w1c-10)/21) :
    w1_smk  ? { x:772, y:408 } :
    w1_sRet ? pathPos(W1_SMOKE_RET,  (w1c-52)/21) :
    w1_cGo  ? pathPos(W1_COOLER_GO,  (w1c-84)/29) :
    w1_cAt  ? { x:710, y:82 } :
    w1_cRet ? pathPos(W1_COOLER_RET, (w1c-134)/30) :
              { x:451, y:190 };

  const w2c  = (tick+60) % 120;
  const w2go  = w2c>=5  && w2c<50;
  const w2at  = w2c>=50 && w2c<65;
  const w2ret = w2c>=65 && w2c<110;
  const w2active = stage===0 && (w2go||w2at||w2ret);
  const w2walk   = stage===0 && (w2go||w2ret);
  const w2pos =
    w2go  ? pathPos(W2_GO,  (w2c-5)/44) :
    w2at  ? { x:710, y:255 } :
    w2ret ? pathPos(W2_RET, (w2c-65)/44) :
            { x:71,  y:364 };

  useEffect(() => {
    if (stage===0 || !runner) return;
    const elapsed = Date.now() - stageStart;
    if (stage===1 && elapsed>=1500) { setStage(2); setStageStart(Date.now()); }
    if (stage===2 && goPath) {
      const dur = Math.max(1800, Math.min(5500, (computeLen(goPath)/185)*1000));
      if (elapsed>=dur) { setStage(3); setStageStart(Date.now()); setHrMsg(`👑 HR: "${dispCmd}"`); }
    }
    if (stage===3 && elapsed>=2500) { setStage(4); setStageStart(Date.now()); }
    if (stage===4 && retPath) {
      const dur = Math.max(1800, Math.min(5500, (computeLen(retPath)/185)*1000));
      if (elapsed>=dur) { setStage(5); setLaunched(runner); setHrMsg(`👑 HR: "${runner.name} tool launch kar raha hai! 🚀"`); }
    }
  }, [tick]);

  const runnerPos = (() => {
    if (!runner || stage<2 || stage>4) return null;
    const elapsed = Date.now() - stageStart;
    if (stage===2 && goPath) {
      const dur = Math.max(1800, Math.min(5500, (computeLen(goPath)/185)*1000));
      return pathPos(goPath, Math.min(1, elapsed/dur));
    }
    if (stage===3) return { x:140, y:185 };
    if (stage===4 && retPath) {
      const dur = Math.max(1800, Math.min(5500, (computeLen(retPath)/185)*1000));
      return pathPos(retPath, Math.min(1, elapsed/dur));
    }
    return null;
  })();

  const dispatch = (id) => {
    if (stage!==0) return;
    const emp = EMPLOYEES.find(e=>e.id===id);
    if (!emp) return;
    const gp = TO_CABIN[id];
    setRunner(emp); setGoPath(gp); setRetPath([...gp].reverse());
    setDispCmd(DISPATCH_CMD[id]);
    setStage(1); setStageStart(Date.now());
    setHrMsg(`👑 HR Lakhan: "${emp.name.toUpperCase()}, CABIN MEIN AAO ABHI!"`);
  };

  const handleQuery = (raw) => {
    const t = raw.trim().toLowerCase();
    if (!t || stage!==0) return;
    if (t.includes("tu kaun")||t.includes("who are you")||t.includes("tera naam")) {
      setHrMsg("Dikh nahi raha? Main yahan ka HR Lakhan hoon 👑. 24/7 aapki help ke liye available hoon!"); return;
    }
    if      (t.includes("image")||t.includes("compress")||t.includes("photo")) dispatch("relax");
    else if (t.includes("pdf")&&(t.includes("merge")||t.includes("split")))    dispatch("no18");
    else if (t.includes("resume")||t.includes("cv")||t.includes("biodata"))    dispatch("aura");
    else if (t.includes("word")||t.includes("doc")||t.includes("convert"))     dispatch("chris");
    else if (t.includes("qr")||t.includes("barcode"))                          dispatch("melby");
    else if (t.includes("security")||t.includes("lock"))                       dispatch("vikkg");
    else if (t.includes("ai")||t.includes("ultron")||t.includes("chat"))       dispatch("tony");
    else setHrMsg("Sir, jo help chahiye wo batao. (PDF merge, Resume, Compress, QR, Word)");
  };

  const closeModal = () => {
    setLaunched(null); setStage(0); setRunner(null);
    setGoPath(null); setRetPath(null);
    setHrMsg("Hello! Main HR Lakhan hoon 👑 · Kisi bhi tool ki help ke liye click karo ya likh ke pucho!");
  };

  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth - 4;
      setScale(w > 0 ? Math.min(1, w/820) : 1);
    };
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      if (wrapRef.current) ro.observe(wrapRef.current);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 select-none">

      <style>{`
        @keyframes hrTicker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .hr-ticker { display:inline-block; white-space:nowrap; animation: hrTicker var(--dur,20s) linear infinite; }
      `}</style>

      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-[#0071e3]/20">
          🏢 Busy Cartoon Office — Live 24/7
        </div>
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Meet Your Tool Team</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
          Desk click karo — employee chalke HR cabin jaayega, briefing lega, wapas aayega, tab tool launch!
        </p>
      </div>

      <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

        <div className="px-3 py-2.5 border-b border-slate-800 bg-[#080c14] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wide shrink-0 hidden sm:block">Live</span>
          <div className="overflow-hidden flex-1 bg-slate-900/80 border border-blue-500/30 rounded-xl px-3 h-7 flex items-center">
            <span
              key={hrMsg}
              className="hr-ticker text-[11px] font-bold text-sky-200"
              style={{ "--dur": `${Math.max(10, hrMsg.length * 0.2)}s` }}
            >
              {hrMsg}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;{hrMsg}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>

        <div ref={wrapRef} className="bg-[#0c1117] overflow-hidden p-1 sm:p-2">
          <div style={{
            width: `${820*scale}px`, height: `${445*scale}px`,
            transform: `scale(${scale})`, transformOrigin: "top left",
          }}>
            <svg viewBox="0 0 820 445" width="820" height="445">

              <rect x="18" y="50" width="784" height="378" fill="#e0d4b8"/>
              {Array.from({length:14}).map((_,i)=>Array.from({length:7}).map((_,j)=>(
                <rect key={`f${i}${j}`} x={18+i*56} y={50+j*54} width={56} height={54}
                  fill={(i+j)%2===0?"#d5c9a8":"#c9bf9c"} stroke="#bfb494" strokeWidth="0.7"/>
              )))}

              <rect x="0"   y="0" width="18"  height="445" fill="#1e3e53"/>
              <rect x="0"   y="0" width="4"   height="445" fill="rgba(255,255,255,0.07)"/>
              <rect x="802" y="0" width="18"  height="445" fill="#1e3e53"/>
              <rect x="816" y="0" width="4"   height="445" fill="rgba(0,0,0,0.2)"/>
              <rect x="0"   y="0" width="820" height="50"  fill="#2c5a77"/>
              <rect x="0"   y="46" width="820" height="4"  fill="#152e3e"/>
              <rect x="0"   y="425" width="820" height="20" fill="#2c5a77"/>
              <rect x="0"   y="425" width="820" height="3"  fill="#152e3e"/>
              <rect x="18"  y="50" width="784" height="4"  fill="rgba(0,0,0,0.12)"/>
              {[140,230,320,380].map(y=>(
                <g key={y}>
                  <line x1="0" y1={y} x2="18" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                  <line x1="802" y1={y} x2="820" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </g>
              ))}

              <rect x="200" y="6" width="118" height="38" fill="#bae6fd" stroke="#475569" strokeWidth="2" rx="2"/>
              <line x1="259" y1="6"  x2="259" y2="44" stroke="#475569" strokeWidth="1.5"/>
              <line x1="200" y1="25" x2="318" y2="25" stroke="#475569" strokeWidth="1.5"/>
              <rect x="204" y="8" width="22" height="15" rx="1" fill="rgba(255,255,255,0.28)"/>

              <rect x="110" y="7" width="42" height="37" fill="#ffffff" stroke="#475569" strokeWidth="1.5" rx="2"/>
              <rect x="110" y="7" width="42" height="12" fill="#ef4444" rx="2"/>
              <text x="131" y="17" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">{MONTHS[now.getMonth()]}</text>
              <text x="131" y="33" fill="#0f172a" fontSize="17" fontWeight="bold" textAnchor="middle">{now.getDate()}</text>
              <text x="131" y="42" fill="#6b7280" fontSize="6.5" textAnchor="middle">{DAYS[now.getDay()]}</text>

              <circle cx={CX} cy={CY} r="17" fill="#ffffff" stroke="#334155" strokeWidth="2.5"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
                const r2=a*Math.PI/180;
                return <line key={a} x1={CX+Math.cos(r2-Math.PI/2)*14} y1={CY+Math.sin(r2-Math.PI/2)*14}
                  x2={CX+Math.cos(r2-Math.PI/2)*16} y2={CY+Math.sin(r2-Math.PI/2)*16}
                  stroke="#94a3b8" strokeWidth="1"/>;
              })}
              <line x1={CX} y1={CY} x2={hx} y2={hy} stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1={CX} y1={CY} x2={mx} y2={my} stroke="#334155" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1={CX} y1={CY} x2={sx} y2={sy} stroke="#ef4444" strokeWidth="1"   strokeLinecap="round"/>
              <circle cx={CX} cy={CY} r="2" fill="#334155"/>
              <circle cx={CX} cy={CY} r="1.5" fill="#ef4444"/>

              <rect x="440" y="6" width="118" height="38" fill="#bae6fd" stroke="#475569" strokeWidth="2" rx="2"/>
              <line x1="499" y1="6"  x2="499" y2="44" stroke="#475569" strokeWidth="1.5"/>
              <line x1="440" y1="25" x2="558" y2="25" stroke="#475569" strokeWidth="1.5"/>
              <rect x="444" y="8" width="22" height="15" rx="1" fill="rgba(255,255,255,0.28)"/>

              <rect x="58" y="7" width="40" height="35" fill="#1e293b" rx="2" stroke="#475569" strokeWidth="1"/>
              <text x="62" y="21" fill="#f59e0b" fontSize="9" fontWeight="bold">WORK</text>
              <text x="62" y="34" fill="#f59e0b" fontSize="9" fontWeight="bold">HARD</text>

              <rect x="750" y="6" width="48" height="41" fill="#a16207" stroke="#78350f" strokeWidth="2.5" rx="2"/>
              <circle cx="756" cy="28" r="3" fill="#fef08a"/>
              <rect x="754" y="2" width="36" height="12" fill="#16a34a" rx="2"/>
              <text x="758" y="12" fill="#ffffff" fontSize="9.5" fontWeight="black" fontFamily="monospace">EXIT</text>

              <rect x="20" y="52" width="170" height="178" fill="rgba(186,230,253,0.06)"/>
              <line x1="20" y1="52" x2="190" y2="52" stroke="#38bdf8" strokeWidth="2"/>
              <line x1="20" y1="52" x2="20"  y2="230" stroke="#38bdf8" strokeWidth="2"/>
              <line x1="20" y1="230" x2="190" y2="230" stroke="#38bdf8" strokeWidth="2"/>
              <line x1="190" y1="52"  x2="190" y2="152" stroke="#38bdf8" strokeWidth="2"/>
              <line x1="190" y1="184" x2="190" y2="230" stroke="#38bdf8" strokeWidth="2"/>

              <rect x="183" y="151" width="14" height="34" rx="2" fill="#071824" stroke="#38bdf8" strokeWidth="1.5"/>
              <rect x="184.5" y="152.5" width="9" height="30" rx="1" fill="#0d2438"/>
              <line x1="184.5" y1="158" x2="186" y2="158" stroke="#38bdf8" strokeWidth="0.8"/>
              <line x1="184.5" y1="176" x2="186" y2="176" stroke="#38bdf8" strokeWidth="0.8"/>
              <circle cx="191" cy="168" r="2.2" fill="#fef08a"/>
              <rect x="193" y="155" width="22" height="10" rx="2" fill="#0f2537"/>
              <text x="204" y="163" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">GATE</text>
              {(stage===2||stage===3) && (
                <rect x="182" y="150" width="16" height="36" rx="3"
                  fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2"/>
              )}

              <rect x="20" y="52" width="170" height="20" fill="#0b1a25"/>
              <text x="27" y="66" fill="#f59e0b" fontSize="9.5" fontWeight="bold" fontFamily="monospace">👑 HR LAKHAN CABIN</text>
              <line x1="20" y1="112" x2="190" y2="112" stroke="rgba(56,189,248,0.14)" strokeWidth="1"/>
              <line x1="20" y1="158" x2="190" y2="158" stroke="rgba(56,189,248,0.09)" strokeWidth="1"/>

              <rect x="22" y="74" width="32" height="122" rx="3" fill="#a16207" stroke="#78350f" strokeWidth="1.5"/>
              <line x1="22" y1="105" x2="54" y2="105" stroke="#78350f" strokeWidth="1.2"/>
              <line x1="22" y1="136" x2="54" y2="136" stroke="#78350f" strokeWidth="1.2"/>
              {["#ef4444","#3b82f6","#10b981"].map((c,i)=><rect key={i} x={25+i*9} y="77"  width="7" height="26" rx="1" fill={c}/>)}
              {["#f59e0b","#8b5cf6","#ec4899"].map((c,i)=><rect key={i} x={25+i*9} y="108" width="7" height="26" rx="1" fill={c}/>)}
              {["#06b6d4","#84cc16","#f97316"].map((c,i)=><rect key={i} x={25+i*9} y="139" width="7" height="24" rx="1" fill={c}/>)}

              <rect x="60" y="138" width="120" height="55" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
              <rect x="148" y="143" width="28" height="44" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5"/>
              <line x1="148" y1="165" x2="176" y2="165" stroke="#451a03" strokeWidth="1.2"/>
              <circle cx="162" cy="154" r="3" fill="#fef08a"/>
              <circle cx="162" cy="174" r="3" fill="#fef08a"/>

              <rect x="72" y="102" width="58" height="44" rx="5" fill="#c8ccd0" stroke="#6b7280" strokeWidth="2"/>
              <rect x="77" y="107" width="48" height="32" rx="2" fill="#052e16" stroke="#16a34a" strokeWidth="1.2"/>
              <line x1="80" y1="114" x2="122" y2="114" stroke="#4ade80" strokeWidth="1.2"/>
              <line x1="80" y1="120" x2="116" y2="120" stroke="#4ade80" strokeWidth="0.9"/>
              <line x1="80" y1="126" x2="120" y2="126" stroke="#4ade80" strokeWidth="0.9"/>
              <circle cx="124" cy="114" r="1.8" fill="#4ade80"/>
              <rect x="94" y="146" width="14" height="5" rx="1.5" fill="#9ca3af"/>
              <rect x="87" y="150" width="28" height="3" rx="1.5" fill="#6b7280"/>

              <rect x="68" y="160" width="72" height="14" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
              {[0,1,2].map(r=>[0,1,2,3,4,5,6,7].map(c=>(
                <rect key={`hk${r}${c}`} x={71+c*8} y={162+r*4} width={6} height={3} rx={0.8} fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.4"/>
              )))}

              <polygon points="162,196 178,196 174,224 166,224" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
              <rect x="160" y="192" width="20" height="5" rx="1.5" fill="#4b5563"/>
              <circle cx="167" cy="210" r="4.5" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.8"/>
              <line x1="164" y1="207" x2="170" y2="213" stroke="#94a3b8" strokeWidth="0.7"/>
              <line x1="170" y1="207" x2="164" y2="213" stroke="#94a3b8" strokeWidth="0.7"/>
              <circle cx="173" cy="216" r="3.5" fill="#fef9c3" stroke="#d1d5db" strokeWidth="0.8"/>

              {showPaper && (
                <g>
                  <circle cx={px} cy={py} r="6" fill="#ffffff" stroke="#d1d5db" strokeWidth="1.5" opacity="0.95"/>
                  <line x1={px-3} y1={py-2} x2={px+3} y2={py+2} stroke="#94a3b8" strokeWidth="0.8"/>
                  <line x1={px+3} y1={py-2} x2={px-3} y2={py+2} stroke="#94a3b8" strokeWidth="0.8"/>
                </g>
              )}

              <Chibi x={110} y={192} shirt="#0f172a" hair="#78350f" isBoss/>

              {stage===3 && runner && (
                <>
                  <Chibi x={140} y={185} shirt={runner.shirt} hair={runner.hair}/>
                  <rect x="50" y="76" width="138" height="24" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5"/>
                  <text x="119" y="92" fill="#713f12" fontSize="9" fontWeight="bold" textAnchor="middle">
                    👑 {runner.name}: task mil gaya!
                  </text>
                </>
              )}

              <g transform="translate(698,56)">
                <rect x="0" y="8" width="24" height="50" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" rx="2"/>
                <ellipse cx="12" cy="4" rx="10" ry="13" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5"/>
                <rect x="3" y="32" width="8" height="6" rx="1" fill="#ef4444"/>
                <rect x="13" y="32" width="8" height="6" rx="1" fill="#3b82f6"/>
                <text x="1" y="56" fontSize="10">💧</text>
              </g>

              <g transform="translate(738,54)">
                <rect x="0" y="0" width="44" height="82" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" rx="2"/>
                <line x1="22" y1="0" x2="22" y2="82" stroke="#475569" strokeWidth="1.5"/>
                <line x1="0" y1="41" x2="44" y2="41" stroke="#475569" strokeWidth="1.5"/>
                <circle cx="16" cy="20" r="2.5" fill="#fef08a"/><circle cx="28" cy="20" r="2.5" fill="#fef08a"/>
                <circle cx="16" cy="61" r="2.5" fill="#fef08a"/><circle cx="28" cy="61" r="2.5" fill="#fef08a"/>
                <rect x="2"  y="-9"  width="9" height="11" rx="1" fill="#ef4444" opacity="0.9"/>
                <rect x="13" y="-7"  width="9" height="9"  rx="1" fill="#3b82f6" opacity="0.9"/>
                <rect x="24" y="-11" width="9" height="13" rx="1" fill="#10b981" opacity="0.9"/>
              </g>

              <g transform="translate(696,238)">
                <rect x="0" y="0" width="56" height="40" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" rx="3"/>
                <rect x="8" y="-15" width="40" height="19" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="2"/>
                <rect x="18" y="-9" width="20" height="5" rx="1" fill="#38bdf8"/>
                <rect x="5" y="10" width="46" height="22" fill="#cbd5e1" rx="2"/>
                <rect x="10" y="14" width="36" height="12" fill="#94a3b8" rx="1"/>
                <circle cx="46" cy="28" r="3.5" fill="#4ade80"/>
                <rect x="14" y="-20" width="28" height="7" fill="#ffffff" stroke="#d1d5db" rx="1"/>
                <text x="16" y="-10" fontSize="9">🖨️</text>
              </g>

              {EMPLOYEES.slice(0,4).map((emp,i)=>(
                <DeskUnit key={emp.id} cx={emp.x} cy={emp.y} plant={PLANTS[i]} emp={emp}
                  showChar={!(stage>=2&&stage<=4&&runner?.id===emp.id) && !(emp.id==="relax"&&w1active)}
                  onDispatch={()=>dispatch(emp.id)}/>
              ))}

              {EMPLOYEES.slice(4,8).map((emp,i)=>(
                <DeskUnit key={emp.id} cx={emp.x} cy={emp.y} plant={PLANTS[i+4]} emp={emp}
                  showChar={!(stage>=2&&stage<=4&&runner?.id===emp.id) && !(emp.id==="melby"&&w2active)}
                  onDispatch={()=>dispatch(emp.id)}/>
              ))}

              {w1active && w1pos && (
                <g>
                  {w1walk && <Dust x={w1pos.x} y={w1pos.y+12} dir={(w1_sGo||w1_cGo)?1:-1}/>}
                  <Chibi x={w1pos.x} y={w1pos.y}
                    shirt={EMPLOYEES[2].shirt} hair={EMPLOYEES[2].hair}
                    walking={w1walk} holdCoffee={w1_cAt}/>
                  {w1_smk && <Smoke x={w1pos.x+4} y={w1pos.y-14}/>}
                </g>
              )}

              {w2active && w2pos && (
                <g>
                  {w2walk && <Dust x={w2pos.x} y={w2pos.y+12} dir={w2go?1:-1}/>}
                  <Chibi x={w2pos.x} y={w2pos.y}
                    shirt={EMPLOYEES[4].shirt} hair={EMPLOYEES[4].hair}
                    walking={w2walk} holdFile={w2at}/>
                </g>
              )}

              {stage===1 && runner && (
                <g>
                  <rect x={runner.x-65} y={runner.y-62} width="138" height="32" rx="8"
                    fill="#fee2e2" stroke="#ef4444" strokeWidth="2"/>
                  <text x={runner.x-52} y={runner.y-43} fill="#991b1b" fontSize="12" fontWeight="black">
                    😱 Oh shit! Boss!
                  </text>
                </g>
              )}

              {runnerPos && runner && (stage===2||stage===4) && (
                <g transform={`translate(${runnerPos.x},${runnerPos.y})`}>
                  <Dust x={0} y={12} dir={stage===2?-1:1}/>
                  {stage===2 && <text x="-20" y="34" fontSize="12">💨</text>}
                  <Chibi x={0} y={0} shirt={runner.shirt} hair={runner.hair} walking holdFile={stage===2}/>
                  <rect x="-44" y="-52" width="88" height="24" rx="6" fill="#fff" stroke="#ef4444" strokeWidth="1.2"/>
                  <text x="0" y="-36" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {stage===2 ? "🏃 Cabin ja raha hoon!" : "🫡 Kaam mil gaya boss!"}
                  </text>
                </g>
              )}

              <text x="20"  y="425" fontSize="22">🪴</text>
              <text x="784" y="425" fontSize="22">🪴</text>
              <text x="784" y="148" fontSize="18">🌴</text>

            </svg>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-[#080c14] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-[10px] font-bold text-slate-500 shrink-0">Quick:</span>
            {PRESETS.map((p,i)=>(
              <button key={i} disabled={stage!==0} onClick={()=>handleQuery(p.query)}
                className="bg-slate-900 border border-slate-800 hover:border-[#0071e3] hover:text-[#0071e3] disabled:opacity-40 text-slate-300 text-[11px] px-3 py-1.5 rounded-full font-bold transition active:scale-95">
                {p.label}
              </button>
            ))}
          </div>
          <form onSubmit={e=>{e.preventDefault();handleQuery(userInput);setUserInput("");}}
            className="w-full sm:w-auto flex items-center gap-2">
            <input type="text" value={userInput} disabled={stage!==0}
              onChange={e=>setUserInput(e.target.value)}
              placeholder="Ask HR Lakhan..."
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-full sm:w-52"/>
            <button type="submit" disabled={stage!==0}
              className="bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition shrink-0">
              Ask ⚡
            </button>
          </form>
        </div>
      </div>

      {launchedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-indigo-600 flex items-center justify-center text-2xl mx-auto animate-bounce">⚡</div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Task Ready • HR Lakhan dispatched
              </span>
              <h3 className="text-lg font-black mt-2">{launchedTool.tool}</h3>
              <p className="text-xs text-slate-400 mt-1">
                <strong>{launchedTool.name}</strong> is executing your request in browser!
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={closeModal}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition">
                Close
              </button>
              <Link href={launchedTool.path}
                className="flex-1 bg-[#0071e3] hover:bg-[#0077ed] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                Launch Tool →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}