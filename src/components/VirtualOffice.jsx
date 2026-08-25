// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  { label:"📄 PDF Merge",    query:"pdf merge karni hai" },
  { label:"📝 Resume",        query:"resume banana hai" },
  { label:"🖼️ Compress",     query:"image compress" },
  { label:"🔳 QR Code",      query:"qr code banana hai" },
  { label:"📑 PDF→Word",     query:"pdf to word" },
  { label:"👑 Tu kaun hai?", query:"tu kaun hai?" },
];

function pathPos(waypoints, t) {
  t = Math.min(1, Math.max(0, t));
  if (t === 0) return { x: waypoints[0][0], y: waypoints[0][1] };
  if (t === 1) return { x: waypoints[waypoints.length-1][0], y: waypoints[waypoints.length-1][1] };
  const segs = waypoints.slice(0,-1).map((p,i) => ({
    len: Math.hypot(waypoints[i+1][0]-p[0], waypoints[i+1][1]-p[1]) || 0.001,
    fx: p[0], fy: p[1], tx: waypoints[i+1][0], ty: waypoints[i+1][1],
  }));
  const total = segs.reduce((s,seg) => s+seg.len, 0);
  let rem = t * total;
  for (const seg of segs) {
    if (rem <= seg.len) {
      const lt = rem / seg.len;
      return { x: seg.fx+(seg.tx-seg.fx)*lt, y: seg.fy+(seg.ty-seg.fy)*lt };
    }
    rem -= seg.len;
  }
  return { x: waypoints[waypoints.length-1][0], y: waypoints[waypoints.length-1][1] };
}

const W1_GO  = [[451,190],[651,190],[651,82],[710,82]];
const W1_RET = [[710,82],[651,82],[651,190],[451,190]];
const W2_GO  = [[71,364],[137,364],[137,255],[710,255]];
const W2_RET = [[710,255],[137,255],[137,364],[71,364]];

const Chibi = ({ x=0, y=0, shirt, hair, isBoss=false, walking=false, holdFile=false, holdCoffee=false }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx="0" cy="13" rx="9" ry="3.5" fill="rgba(0,0,0,0.18)" />
    <g>
      <rect x="-4.5" y="3" width="3.5" height="7" rx="1.5" fill="#1e293b" />
      <ellipse cx="-2.5" cy="10.8" rx="4.5" ry="2.5" fill="#0f172a" />
      {walking && (
        <animateTransform attributeName="transform" type="rotate"
          values="-18,-2.5,3; 18,-2.5,3; -18,-2.5,3"
          dur="0.44s" repeatCount="indefinite" />
      )}
    </g>
    <g>
      <rect x="1" y="3" width="3.5" height="7" rx="1.5" fill="#1e293b" />
      <ellipse cx="2.5" cy="10.8" rx="4.5" ry="2.5" fill="#0f172a" />
      {walking && (
        <animateTransform attributeName="transform" type="rotate"
          values="18,2.5,3; -18,2.5,3; 18,2.5,3"
          dur="0.44s" repeatCount="indefinite" />
      )}
    </g>
    <rect x="-7" y="-8" width="14" height="13" rx="3.5" fill={isBoss ? "#0f172a" : shirt} />
    {isBoss ? (
      <>
        <polygon points="-2.5,-8 0,-5 2.5,-8" fill="#ffffff" />
        <polygon points="-1.5,-5.5 0,2 1.5,-5.5" fill="#ef4444" />
      </>
    ) : <line x1="-3" y1="-8" x2="-3" y2="-3" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />}
    <g>
      <circle cx="-9" cy="-1" r="3" fill="#fcd34d" />
      {walking && (
        <animateTransform attributeName="transform" type="rotate"
          values="22,-9,-8; -22,-9,-8; 22,-9,-8"
          dur="0.44s" repeatCount="indefinite" />
      )}
    </g>
    <g>
      <circle cx="9" cy="-1" r="3" fill="#fcd34d" />
      {holdFile   && <text x="7" y="2" fontSize="9">📑</text>}
      {holdCoffee && <text x="7" y="2" fontSize="9">☕</text>}
      {walking && (
        <animateTransform attributeName="transform" type="rotate"
          values="-22,9,-8; 22,9,-8; -22,9,-8"
          dur="0.44s" repeatCount="indefinite" />
      )}
    </g>
    <circle cx="0" cy="-15" r="8" fill="#fcd34d" />
    <path d="M -8 -17 Q 0 -26 8 -17 Q 6 -23 0 -24 Q -6 -23 -8 -17 Z" fill={hair} />
    <circle cx="-3" cy="-15" r="1.5" fill="#0f172a" />
    <circle cx="3"  cy="-15" r="1.5" fill="#0f172a" />
    <path d="M -2 -11 Q 0 -9 2 -11" stroke="#92400e" strokeWidth="0.9" fill="none" />
    {isBoss && (
      <>
        <ellipse cx="-3" cy="-15" rx="3.2" ry="2.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <ellipse cx="3"  cy="-15" rx="3.2" ry="2.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <line x1="-6" y1="-14" x2="-6.5" y2="-17" stroke="#334155" strokeWidth="0.9" />
        <line x1="6"  y1="-14" x2="6.5"  y2="-17" stroke="#334155" strokeWidth="0.9" />
        <text x="-5" y="-24" fontSize="11">👑</text>
      </>
    )}
  </g>
);

const DeskUnit = ({ cx, cy, plant, emp, showChar, onDispatch }) => (
  <g transform={`translate(${cx},${cy})`} className="cursor-pointer" onClick={onDispatch}>
    <rect x="-42" y="-5" width="84" height="44" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    <rect x="22" y="0" width="18" height="36" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
    <line x1="22" y1="18" x2="40" y2="18" stroke="#78350f" strokeWidth="1" />
    <circle cx="31" cy="10" r="2.5" fill="#fef08a" />
    <circle cx="31" cy="26" r="2.5" fill="#fef08a" />
    <rect x="-24" y="-40" width="40" height="36" rx="5" fill="#c8ccd0" stroke="#6b7280" strokeWidth="2" />
    <rect x="-20" y="-36" width="32" height="25" rx="2" fill="#052e16" stroke="#16a34a" strokeWidth="1.2" />
    <line x1="-17" y1="-30" x2="10" y2="-30" stroke="#4ade80" strokeWidth="1.2" />
    <line x1="-17" y1="-24" x2="6"  y2="-24" stroke="#4ade80" strokeWidth="0.9" />
    <line x1="-17" y1="-18" x2="9"  y2="-18" stroke="#4ade80" strokeWidth="0.9" />
    <line x1="-17" y1="-12" x2="5"  y2="-12" stroke="#4ade80" strokeWidth="0.8" />
    <circle cx="13" cy="-19" r="1.8" fill="#4ade80" />
    <rect x="-6" y="-4" width="12" height="5" rx="1.5" fill="#9ca3af" />
    <rect x="-10" y="0" width="20" height="3" rx="1.5" fill="#6b7280" />
    <rect x="-34" y="8" width="48" height="14" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />
    {[0,1,2].map(r=>[0,1,2,3,4,5,6].map(c=>(
      <rect key={`k${r}${c}`} x={-31+c*6} y={10+r*4} width={4.5} height={3} rx={0.8} fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.4" />
    )))}
    <rect x="-42" y="0" width="16" height="24" rx="1.5" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
    <rect x="-40" y="1" width="16" height="24" rx="1.5" fill="#fefce8" stroke="#d97706" strokeWidth="0.8" />
    <rect x="-38" y="2" width="16" height="24" rx="1.5" fill="#ffffff"  stroke="#e5e7eb" strokeWidth="0.8" />
    <line x1="-36" y1="8"  x2="-24" y2="8"  stroke="#94a3b8" strokeWidth="0.7" />
    <line x1="-36" y1="13" x2="-26" y2="13" stroke="#94a3b8" strokeWidth="0.7" />
    <line x1="-36" y1="18" x2="-25" y2="18" stroke="#94a3b8" strokeWidth="0.7" />
    <rect x="14" y="12" width="9" height="12" rx="3" fill="#7c3aed" stroke="#5b21b6" strokeWidth="1" />
    <path d="M23 16 Q27 16 27 20 Q27 24 23 24" stroke="#5b21b6" strokeWidth="1" fill="none" />
    <ellipse cx="18.5" cy="12.5" rx="4" ry="1.8" fill="#a78bfa" />
    <text x="-42" y="-7" fontSize="13">{plant}</text>
    {showChar && <Chibi x={-4} y={44} shirt={emp.shirt} hair={emp.hair} />}
    <rect x="-38" y="55" width="74" height="18" rx="3" fill="#0f172a" stroke={emp.shirt} strokeWidth="1.5" />
    <text x="-32" y="68" fill={emp.shirt} fontSize="11" fontWeight="bold" fontFamily="monospace">
      {emp.name} · {emp.role.split(" ")[0]}
    </text>
  </g>
);

const Dust = ({ x, y, dir=1 }) => (
  <>
    <ellipse cx={x-dir*13} cy={y} rx="11" ry="4.5" fill="#c8b898" opacity="0.5" />
    <ellipse cx={x-dir*24} cy={y} rx="6"  ry="3"   fill="#c8b898" opacity="0.32" />
    <ellipse cx={x-dir*33} cy={y} rx="3"  ry="2"   fill="#c8b898" opacity="0.15" />
    <circle  cx={x-dir*10} cy={y-5} r="1.5" fill="#e0d0b0" opacity="0.4" />
    <circle  cx={x-dir*20} cy={y-4} r="1"   fill="#e0d0b0" opacity="0.25" />
  </>
);

export default function VirtualOffice() {
  const [hrMsg, setHrMsg]           = useState("Hello! Main HR Lakhan hoon 👑. Main aapki kya help karu?");
  const [userInput, setUserInput]   = useState("");
  const [launchedTool, setLaunched] = useState(null);
  const [stage, setStage]           = useState(0);
  const [runner, setRunner]         = useState(null);
  const [rpos, setRpos]             = useState({ x:0, y:0 });
  const [tick, setTick]             = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(v => (v+1) % 10000), 150);
    return () => clearInterval(id);
  }, []);

  const pc = tick % 19;
  const showPaper = pc < 17;
  const pt = pc < 3 ? 0 : pc < 13 ? (pc-3)/10 : 1;
  const px = 108 + pt * 62;
  const py = (162 + pt * 48) - Math.sin(pt * Math.PI) * 28;

  const w1c   = tick % 100;
  const w1go  = w1c >= 5  && w1c < 40;
  const w1at  = w1c >= 40 && w1c < 55;
  const w1ret = w1c >= 55 && w1c < 90;
  const w1active = stage === 0 && (w1go || w1at || w1ret);
  const w1walk   = stage === 0 && (w1go || w1ret);
  const w1pos = w1go  ? pathPos(W1_GO,  (w1c-5)/34)
              : w1at  ? { x:W1_GO[W1_GO.length-1][0], y:W1_GO[W1_GO.length-1][1] }
              : w1ret ? pathPos(W1_RET, (w1c-55)/34)
              : { x:W1_GO[0][0], y:W1_GO[0][1] };

  const w2c   = (tick + 60) % 120;
  const w2go  = w2c >= 5  && w2c < 50;
  const w2at  = w2c >= 50 && w2c < 65;
  const w2ret = w2c >= 65 && w2c < 110;
  const w2active = stage === 0 && (w2go || w2at || w2ret);
  const w2walk   = stage === 0 && (w2go || w2ret);
  const w2pos = w2go  ? pathPos(W2_GO,  (w2c-5)/44)
              : w2at  ? { x:W2_GO[W2_GO.length-1][0], y:W2_GO[W2_GO.length-1][1] }
              : w2ret ? pathPos(W2_RET, (w2c-65)/44)
              : { x:W2_GO[0][0], y:W2_GO[0][1] };

  const dispatch = (targetId, cmd) => {
    const emp = EMPLOYEES.find(e => e.id === targetId);
    if (!emp || stage !== 0) return;
    setRunner(emp);
    setRpos({ x: emp.x, y: emp.y + 40 });
    setStage(1);
    setHrMsg(`👑 HR Lakhan: "${emp.name.toUpperCase()}, cabin mein aao ABHI!"`);
    setTimeout(() => { setStage(2); setRpos({ x:102, y:188 }); }, 1800);
    setTimeout(() => { setStage(3); setHrMsg(`👑 HR Lakhan: "${cmd}"`); }, 3600);
    setTimeout(() => { setStage(4); setLaunched(emp); }, 5400);
  };

  const handleQuery = (raw) => {
    const t = raw.trim().toLowerCase();
    if (!t || stage !== 0) return;
    if (t.includes("tu kaun")||t.includes("tum kaun")||t.includes("who are you")||t.includes("tera naam")) {
      setHrMsg("Dikh nahi raha? Main yahan ka HR Lakhan hoon 👑. 24/7 aapki help ke liye available hoon!"); return;
    }
    if      (t.includes("image")||t.includes("compress")||t.includes("photo"))                        dispatch("relax","RELAX, compress the images immediately!");
    else if (t.includes("pdf")&&(t.includes("merge")||t.includes("split")||t.includes("jodo")))       dispatch("no18","NO18, merge the PDF documents NOW!");
    else if (t.includes("resume")||t.includes("cv")||t.includes("biodata"))                           dispatch("aura","AURA, ATS Resume Builder initialize karo!");
    else if (t.includes("word")||t.includes("doc")||t.includes("convert"))                            dispatch("chris","CHRIS, PDF to Word convert karo!");
    else if (t.includes("qr")||t.includes("barcode"))                                                 dispatch("melby","MELBY, HD Vector QR generate karo!");
    else if (t.includes("security")||t.includes("lock")||t.includes("encrypt"))                       dispatch("vikkg","VIKKG, file security suite run karo!");
    else if (t.includes("ai")||t.includes("ultron")||t.includes("chat")||t.includes("bot"))           dispatch("tony","TONY, ULTRON Neural AI activate karo!");
    else setHrMsg("Sir, jo help chahiye wo batao. (PDF merge, Resume, Compress, QR, Word)");
  };

  const closeModal = () => {
    setLaunched(null); setStage(0); setRunner(null);
    setHrMsg("Hello! Main HR Lakhan hoon 👑. Main aapki kya help karu?");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 select-none">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-[#0071e3]/20">
          🏢 Busy Cartoon Office — Live 24/7
        </div>
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Meet Your Tool Team</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
          Assign a task — watch the employee panic, sprint to HR cabin, get briefed, and open your tool!
        </p>
      </div>

      <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-[#080c14] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-xs font-black text-slate-200 uppercase tracking-wide">Office Live</span>
          </div>
          <div className="bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-200 flex items-center gap-2 flex-1 sm:max-w-2xl overflow-hidden">
            <span className="shrink-0">👑</span>
            <span className="truncate">{hrMsg}</span>
          </div>
        </div>

        <div className="overflow-x-auto bg-[#0c1117] p-1 sm:p-3">
          <svg viewBox="0 0 820 445" className="w-full h-auto" style={{ minWidth:"480px" }}>
            <rect x="18" y="50" width="784" height="378" fill="#e0d4b8" />
            {Array.from({length:14}).map((_,i)=>Array.from({length:7}).map((_,j)=>(
              <rect key={`f${i}${j}`} x={18+i*56} y={50+j*54} width={56} height={54}
                fill={(i+j)%2===0?"#d5c9a8":"#c9bf9c"} stroke="#bfb494" strokeWidth="0.7" />
            )))}
            <rect x="0"   y="0" width="18"  height="445" fill="#1e3e53" />
            <rect x="0"   y="0" width="4"   height="445" fill="rgba(255,255,255,0.07)" />
            <rect x="802" y="0" width="18"  height="445" fill="#1e3e53" />
            <rect x="816" y="0" width="4"   height="445" fill="rgba(0,0,0,0.2)" />
            <rect x="0"   y="0" width="820" height="50"  fill="#2c5a77" />
            <rect x="0"   y="46" width="820" height="4"  fill="#152e3e" />
            <rect x="0"   y="425" width="820" height="20" fill="#2c5a77" />
            <rect x="0"   y="425" width="820" height="3"  fill="#152e3e" />
            <rect x="18"  y="50" width="784" height="4"  fill="rgba(0,0,0,0.12)" />
            {[140,230,320,380].map(y=>(
              <g key={y}>
                <line x1="0" y1={y} x2="18" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="802" y1={y} x2="820" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </g>
            ))}
            <rect x="200" y="6" width="118" height="38" fill="#bae6fd" stroke="#475569" strokeWidth="2" rx="2" />
            <line x1="259" y1="6"  x2="259" y2="44" stroke="#475569" strokeWidth="1.5" />
            <line x1="200" y1="25" x2="318" y2="25" stroke="#475569" strokeWidth="1.5" />
            <rect x="204" y="8"  width="22" height="15" rx="1" fill="rgba(255,255,255,0.28)" />
            <rect x="440" y="6" width="118" height="38" fill="#bae6fd" stroke="#475569" strokeWidth="2" rx="2" />
            <line x1="499" y1="6"  x2="499" y2="44" stroke="#475569" strokeWidth="1.5" />
            <line x1="440" y1="25" x2="558" y2="25" stroke="#475569" strokeWidth="1.5" />
            <rect x="444" y="8"  width="22" height="15" rx="1" fill="rgba(255,255,255,0.28)" />
            <circle cx="385" cy="25" r="17" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
            <circle cx="385" cy="25" r="2"  fill="#334155" />
            <line x1="385" y1="25" x2="385" y2="13" stroke="#0f172a" strokeWidth="2" />
            <line x1="385" y1="25" x2="396" y2="25" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="58" y="7" width="38" height="33" fill="#1e293b" rx="2" stroke="#475569" strokeWidth="1" />
            <text x="62" y="20" fill="#f59e0b" fontSize="7.5" fontWeight="bold">WORK</text>
            <text x="62" y="32" fill="#f59e0b" fontSize="7.5" fontWeight="bold">HARD</text>
            <rect x="750" y="6" width="48" height="41" fill="#a16207" stroke="#78350f" strokeWidth="2.5" rx="2" />
            <circle cx="756" cy="28" r="3" fill="#fef08a" />
            <rect x="754" y="2" width="36" height="12" fill="#16a34a" rx="2" />
            <text x="758" y="11" fill="#ffffff" fontSize="8.5" fontWeight="black" fontFamily="monospace">EXIT</text>
            <rect x="20" y="52" width="170" height="178" fill="rgba(186,230,253,0.06)" stroke="#38bdf8" strokeWidth="2" rx="3" />
            <rect x="20" y="52" width="170" height="20" fill="#0b1a25" />
            <text x="27" y="65" fill="#f59e0b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">👑 HR LAKHAN CABIN</text>
            <line x1="20" y1="112" x2="190" y2="112" stroke="rgba(56,189,248,0.14)" strokeWidth="1" />
            <line x1="20" y1="158" x2="190" y2="158" stroke="rgba(56,189,248,0.09)" strokeWidth="1" />
            <rect x="22" y="74" width="32" height="122" rx="3" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
            <line x1="22" y1="105" x2="54" y2="105" stroke="#78350f" strokeWidth="1.2" />
            <line x1="22" y1="136" x2="54" y2="136" stroke="#78350f" strokeWidth="1.2" />
            {["#ef4444","#3b82f6","#10b981"].map((c,i)=><rect key={i} x={25+i*9} y="77"  width="7" height="26" rx="1" fill={c} />)}
            {["#f59e0b","#8b5cf6","#ec4899"].map((c,i)=><rect key={i} x={25+i*9} y="108" width="7" height="26" rx="1" fill={c} />)}
            {["#06b6d4","#84cc16","#f97316"].map((c,i)=><rect key={i} x={25+i*9} y="139" width="7" height="24" rx="1" fill={c} />)}
            <rect x="60" y="138" width="120" height="55" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <rect x="148" y="143" width="28" height="44" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <line x1="148" y1="165" x2="176" y2="165" stroke="#451a03" strokeWidth="1.2" />
            <circle cx="162" cy="154" r="3" fill="#fef08a" />
            <circle cx="162" cy="174" r="3" fill="#fef08a" />
            <rect x="72" y="102" width="58" height="44" rx="5" fill="#c8ccd0" stroke="#6b7280" strokeWidth="2" />
            <rect x="77" y="107" width="48" height="32" rx="2" fill="#052e16" stroke="#16a34a" strokeWidth="1.2" />
            <line x1="80" y1="114" x2="122" y2="114" stroke="#4ade80" strokeWidth="1.2" />
            <line x1="80" y1="120" x2="116" y2="120" stroke="#4ade80" strokeWidth="0.9" />
            <line x1="80" y1="126" x2="120" y2="126" stroke="#4ade80" strokeWidth="0.9" />
            <circle cx="124" cy="114" r="1.8" fill="#4ade80" />
            <rect x="94" y="146" width="14" height="5" rx="1.5" fill="#9ca3af" />
            <rect x="87" y="150" width="28" height="3" rx="1.5" fill="#6b7280" />
            <rect x="68" y="160" width="72" height="14" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />
            {[0,1,2].map(r=>[0,1,2,3,4,5,6,7].map(c=>(
              <rect key={`hk${r}${c}`} x={71+c*8} y={162+r*4} width={6} height={3} rx={0.8} fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.4" />
            )))}
            <polygon points="162,196 178,196 174,224 166,224" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="160" y="192" width="20" height="5" rx="1.5" fill="#4b5563" />
            <circle cx="167" cy="210" r="4.5" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.8" />
            <line x1="164" y1="207" x2="170" y2="213" stroke="#94a3b8" strokeWidth="0.7" />
            <line x1="170" y1="207" x2="164" y2="213" stroke="#94a3b8" strokeWidth="0.7" />
            <circle cx="173" cy="216" r="3.5" fill="#fef9c3" stroke="#d1d5db" strokeWidth="0.8" />
            {showPaper && (
              <g>
                <circle cx={px} cy={py} r="6" fill="#ffffff" stroke="#d1d5db" strokeWidth="1.5" opacity="0.95" />
                <line x1={px-3} y1={py-2} x2={px+3} y2={py+2} stroke="#94a3b8" strokeWidth="0.8" />
                <line x1={px+3} y1={py-2} x2={px-3} y2={py+2} stroke="#94a3b8" strokeWidth="0.8" />
                {pt>0.1&&pt<0.9&&(
                  <>
                    <circle cx={px-10} cy={py+4} r="2.5" fill="#e2e8f0" opacity="0.45" />
                    <circle cx={px-18} cy={py+7} r="1.5" fill="#e2e8f0" opacity="0.25" />
                  </>
                )}
              </g>
            )}
            <Chibi x={110} y={192} shirt="#0f172a" hair="#78350f" isBoss />
            {stage===3 && runner && (
              <g>
                <rect x="25" y="75" width="158" height="20" rx="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
                <text x="30" y="89" fill="#713f12" fontSize="8.5" fontWeight="bold">👑 {runner.name}: Execute this task!</text>
              </g>
            )}
            <g transform="translate(698,56)">
              <rect x="0" y="8" width="24" height="50" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
              <ellipse cx="12" cy="4" rx="10" ry="13" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              <rect x="3" y="32" width="8" height="6" rx="1" fill="#ef4444" />
              <rect x="13" y="32" width="8" height="6" rx="1" fill="#3b82f6" />
              <text x="1" y="56" fontSize="10">💧</text>
            </g>
            <g transform="translate(738,54)">
              <rect x="0" y="0" width="44" height="82" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" rx="2" />
              <line x1="22" y1="0" x2="22" y2="82" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="41" x2="44" y2="41" stroke="#475569" strokeWidth="1.5" />
              <circle cx="16" cy="20" r="2.5" fill="#fef08a" /><circle cx="28" cy="20" r="2.5" fill="#fef08a" />
              <circle cx="16" cy="61" r="2.5" fill="#fef08a" /><circle cx="28" cy="61" r="2.5" fill="#fef08a" />
              <rect x="2" y="-9" width="9" height="11" rx="1" fill="#ef4444" opacity="0.9" />
              <rect x="13" y="-7" width="9" height="9" rx="1" fill="#3b82f6" opacity="0.9" />
              <rect x="24" y="-11" width="9" height="13" rx="1" fill="#10b981" opacity="0.9" />
            </g>
            <g transform="translate(696,238)">
              <rect x="0" y="0" width="56" height="40" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" rx="3" />
              <rect x="8" y="-15" width="40" height="19" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="2" />
              <rect x="18" y="-9" width="20" height="5" rx="1" fill="#38bdf8" />
              <rect x="5" y="10" width="46" height="22" fill="#cbd5e1" rx="2" />
              <rect x="10" y="14" width="36" height="12" fill="#94a3b8" rx="1" />
              <circle cx="46" cy="28" r="3.5" fill="#4ade80" />
              <rect x="14" y="-20" width="28" height="7" fill="#ffffff" stroke="#d1d5db" rx="1" />
              <text x="16" y="-10" fontSize="9">🖨️</text>
            </g>
            {EMPLOYEES.slice(0,4).map((emp,i)=>(
              <DeskUnit key={emp.id} cx={emp.x} cy={emp.y} plant={PLANTS[i]} emp={emp}
                showChar={!(runner?.id===emp.id && stage>=2) && !(emp.id==="relax" && w1active)}
                onDispatch={()=>handleQuery(["pdf merge","resume banana","image compress","pdf to word"][i]+" karna hai")} />
            ))}
            {EMPLOYEES.slice(4,8).map((emp,i)=>(
              <DeskUnit key={emp.id} cx={emp.x} cy={emp.y} plant={PLANTS[i+4]} emp={emp}
                showChar={!(runner?.id===emp.id && stage>=2) && !(emp.id==="melby" && w2active)}
                onDispatch={()=>handleQuery(["qr code","security lock","ultron ai","pdf merge"][i]+" karna hai")} />
            ))}
            {w1active && (
              <g>
                {w1walk && <Dust x={w1pos.x} y={w1pos.y+12} dir={w1go?1:-1} />}
                <Chibi x={w1pos.x} y={w1pos.y} shirt={EMPLOYEES[2].shirt} hair={EMPLOYEES[2].hair}
                  walking={w1walk} holdCoffee={w1at} />
              </g>
            )}
            {w2active && (
              <g>
                {w2walk && <Dust x={w2pos.x} y={w2pos.y+12} dir={w2go?1:-1} />}
                <Chibi x={w2pos.x} y={w2pos.y} shirt={EMPLOYEES[4].shirt} hair={EMPLOYEES[4].hair}
                  walking={w2walk} holdFile={w2at} />
              </g>
            )}
            {stage===1 && runner && (
              <g>
                <rect x={runner.x-60} y={runner.y-55} width="130" height="28" rx="7" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.8" />
                <text x={runner.x-52} y={runner.y-38} fill="#991b1b" fontSize="10.5" fontWeight="black">
                  😱 Oh shit! Boss!
                </text>
              </g>
            )}
            {stage>=2 && runner && (
              <g style={{ transform:`translate(${rpos.x}px,${rpos.y}px)`, transition:"transform 1.8s ease-out" }}>
                <Dust x={0} y={42} dir={1} />
                <text x="-22" y="35" fontSize="13">💨</text>
                <Chibi x={0} y={0} shirt={runner.shirt} hair={runner.hair} walking={stage===2} holdFile />
                <rect x="-42" y="-50" width="84" height="22" rx="5" fill="#ffffff" stroke="#ef4444" strokeWidth="1.2" />
                <text x="-35" y="-35" fill="#0f172a" fontSize="9.5" fontWeight="bold">
                  {stage===2 ? "🏃 Bhago abhi!" : "🫡 Yes Boss!"}
                </text>
              </g>
            )}
            <text x="20"  y="425" fontSize="22">🪴</text>
            <text x="784" y="425" fontSize="22">🪴</text>
            <text x="784" y="148" fontSize="18">🌴</text>
          </svg>
        </div>

        <p className="text-center text-[10px] text-slate-600 pb-1 sm:hidden">← Scroll to explore full office →</p>

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
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-full sm:w-52" />
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
              <p className="text-xs text-slate-400 mt-1"><strong>{launchedTool.name}</strong> is executing your request!</p>
            </div>
            <div className="flex gap-2">
              <button onClick={closeModal}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition">Close</button>
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