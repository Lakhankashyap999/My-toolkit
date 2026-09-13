// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import ProGate from "../../../components/ProGate";
import AuthGate from "../../../components/AuthGate";

type ToolType = "select" | "text" | "whiteout" | "highlight" | "signature" | "draw";
type TextItem = { id: string; str: string; x: number; y: number; width: number; height: number; fontSize: number; isEdited: boolean; editedStr: string; };
type OEl = { id: number; page: number; type: "text"|"whiteout"|"highlight"|"signature"|"draw"; x: number; y: number; w?: number; h?: number; text?: string; size?: number; color?: string; font?: string; dataUrl?: string; points?: {x:number;y:number}[]; };

function hex01(hex: string) {
  const h = (hex || "#000000").replace("#", "");
  return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255, b: parseInt(h.slice(4,6),16)/255 };
}

export default function PDFEditPage() {
  const [file, setFile] = useState<File|null>(null);
  const [pjDoc, setPjDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [rotations, setRotations] = useState<number[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const drawRef   = useRef<HTMLCanvasElement|null>(null);
  const signRef   = useRef<HTMLCanvasElement|null>(null);
  const overlayRef= useRef<HTMLDivElement|null>(null);
  const fileRef   = useRef<HTMLInputElement|null>(null);
  const histRef   = useRef<OEl[][]>([[]]);
  const histIdx   = useRef(0);
  const [scale, setScale]     = useState(1.5);
  const [cvSize, setCvSize]   = useState({ w: 0, h: 0 });
  const [vpRef, setVpRef]     = useState<any>(null);
  const [items, setItems]     = useState<TextItem[]>([]);
  const [editId, setEditId]   = useState<string|null>(null);
  const [els, setEls]         = useState<OEl[]>([]);
  const [selId, setSelId]     = useState<number|null>(null);
  const [drag, setDrag]       = useState<{id:number;ox:number;oy:number}|null>(null);
  const [tool, setTool]       = useState<ToolType>("select");
  const [tText, setTText]     = useState("New Text");
  const [tSize, setTSize]     = useState(14);
  const [tColor, setTColor]   = useState("#000000");
  const [drawing, setDrawing] = useState(false);
  const [path, setPath]       = useState<{x:number;y:number}[]>([]);
  const [signModal, setSignModal] = useState(false);
  const [sigDrw, setSigDrw]   = useState(false);
  const [sigUrl, setSigUrl]   = useState<string|null>(null);
  const [watermark, setWatermark] = useState("");
  const [thumbs, setThumbs]   = useState<Map<number,string>>(new Map());
  const [busy, setBusy]       = useState(false);
  const [errMsg, setErrMsg]   = useState("");
  const [ok, setOk]           = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) { setErrMsg("Please upload a valid PDF."); return; }
    setErrMsg(""); setBusy(true);
    try {
      const ab = await f.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const pj = await pdfjsLib.getDocument({ data: ab.slice(0) }).promise;
      setPjDoc(pj); setFile(f);
      setNumPages(pj.numPages); setCurPage(1);
      setRotations(new Array(pj.numPages).fill(0));
      setDeleted([]); setEls([]); setItems([]);
      histRef.current = [[]]; histIdx.current = 0;
      genThumbs(pj, pj.numPages);
    } catch { setErrMsg("Could not open PDF. May be password-protected."); }
    finally { setBusy(false); }
  };

  const genThumbs = async (pj: any, total: number) => {
    const m = new Map<number,string>();
    for (let p=1; p<=total; p++) {
      try {
        const pg = await pj.getPage(p);
        const v  = pg.getViewport({ scale: 0.2 });
        const c  = document.createElement("canvas");
        c.width=v.width; c.height=v.height;
        await pg.render({ canvasContext: c.getContext("2d")!, viewport: v }).promise;
        m.set(p, c.toDataURL("image/jpeg", 0.55));
      } catch {}
    }
    setThumbs(new Map(m));
  };

  const renderPage = useCallback(async () => {
    if (!pjDoc || !canvasRef.current) return;
    try {
      const pg = await pjDoc.getPage(curPage);
      const v  = pg.getViewport({ scale, rotation: rotations[curPage-1]||0 });
      setVpRef(v);
      const w = Math.round(v.width), h = Math.round(v.height);
      setCvSize({ w, h });
      canvasRef.current.width = w; canvasRef.current.height = h;
      await pg.render({ canvasContext: canvasRef.current.getContext("2d")!, viewport: v }).promise;
      const content = await pg.getTextContent();
      const ti: TextItem[] = content.items
        .filter((it: any) => it.str?.trim())
        .map((it: any, idx: number) => {
          const [,,,sy,tx,ty] = it.transform;
          const pt = v.convertToViewportPoint(tx, ty);
          const fs = Math.abs(sy) * scale;
          const aw = (it.width > 0 ? it.width : it.str.length * Math.abs(sy) * 0.55) * scale;
          return { id:`t-${curPage}-${idx}`, str:it.str, editedStr:it.str, isEdited:false,
            x:pt[0], y:pt[1]-fs, width:Math.max(aw,8), height:Math.max(fs*1.3,8), fontSize:fs };
        });
      setItems(ti); setEditId(null);
    } catch(e){ console.error(e); }
  }, [pjDoc, curPage, scale, rotations]);

  useEffect(() => { if (pjDoc) renderPage(); }, [renderPage]);

  useEffect(() => {
    if (!drawRef.current) return;
    drawRef.current.width = cvSize.w; drawRef.current.height = cvSize.h;
    redrawDraw();
  }, [cvSize]);

  const pushH = (newEls: OEl[]) => {
    const i = histIdx.current;
    histRef.current = histRef.current.slice(0, i+1);
    histRef.current.push(JSON.parse(JSON.stringify(newEls)));
    histIdx.current = histRef.current.length - 1;
    setEls(newEls);
  };
  const undo = useCallback(() => { if (histIdx.current<=0) return; histIdx.current--; setEls(JSON.parse(JSON.stringify(histRef.current[histIdx.current]))); },[]);
  const redo = useCallback(() => { if (histIdx.current>=histRef.current.length-1) return; histIdx.current++; setEls(JSON.parse(JSON.stringify(histRef.current[histIdx.current]))); },[]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey||e.metaKey)&&e.key==="z"){ e.preventDefault(); undo(); }
      if ((e.ctrlKey||e.metaKey)&&e.key==="y"){ e.preventDefault(); redo(); }
      if (e.key==="Delete"&&selId!==null&&document.activeElement?.tagName!=="INPUT") { pushH(els.filter(x=>x.id!==selId)); setSelId(null); }
    };
    window.addEventListener("keydown", h); return ()=>window.removeEventListener("keydown", h);
  },[undo,redo,selId,els]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool==="select"||tool==="draw") return;
    if (!overlayRef.current) return;
    const r = overlayRef.current.getBoundingClientRect();
    const cx=e.clientX-r.left, cy=e.clientY-r.top;
    let el: OEl|null = null;
    if (tool==="text") el={id:Date.now(),page:curPage,type:"text",x:cx,y:cy,text:tText,size:tSize,color:tColor};
    else if (tool==="whiteout") el={id:Date.now(),page:curPage,type:"whiteout",x:cx-50,y:cy-10,w:120,h:24};
    else if (tool==="highlight") el={id:Date.now(),page:curPage,type:"highlight",x:cx-60,y:cy-10,w:160,h:22};
    else if (tool==="signature") { if(!sigUrl){setSignModal(true);return;} el={id:Date.now(),page:curPage,type:"signature",x:cx-60,y:cy-30,w:140,h:70,dataUrl:sigUrl}; }
    if (el){ pushH([...els,el]); setSelId(el.id); }
  };

  const redrawDraw = () => {
    if (!drawRef.current) return;
    const ctx = drawRef.current.getContext("2d")!;
    ctx.clearRect(0,0,drawRef.current.width,drawRef.current.height);
    els.filter(e=>e.type==="draw"&&e.page===curPage&&e.points&&e.points.length>1).forEach(e=>{
      ctx.beginPath(); ctx.moveTo(e.points![0].x,e.points![0].y);
      e.points!.forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.strokeStyle="#e11d48"; ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.stroke();
    });
    if (path.length>1){
      ctx.beginPath(); ctx.moveTo(path[0].x,path[0].y);
      path.forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.strokeStyle="#e11d48"; ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.stroke();
    }
  };
  useEffect(()=>{ redrawDraw(); },[els,path,curPage]);

  const dStart=(e:React.MouseEvent<HTMLCanvasElement>)=>{ if(tool!=="draw")return; const r=drawRef.current!.getBoundingClientRect(); setDrawing(true); setPath([{x:e.clientX-r.left,y:e.clientY-r.top}]); };
  const dMove=(e:React.MouseEvent<HTMLCanvasElement>)=>{ if(!drawing||tool!=="draw")return; const r=drawRef.current!.getBoundingClientRect(); setPath(p=>[...p,{x:e.clientX-r.left,y:e.clientY-r.top}]); };
  const dEnd=()=>{ if(!drawing)return; setDrawing(false); if(path.length>1) pushH([...els,{id:Date.now(),page:curPage,type:"draw",x:0,y:0,points:path}]); setPath([]); };

  const elDown=(e:React.MouseEvent,id:number)=>{ e.stopPropagation(); if(tool!=="select")return; setSelId(id); const el=els.find(x=>x.id===id); if(!el)return; setDrag({id,ox:e.clientX-el.x,oy:e.clientY-el.y}); };
  const ovMove=(e:React.MouseEvent)=>{ if(!drag)return; setEls(p=>p.map(x=>x.id===drag.id?{...x,x:e.clientX-drag.ox,y:e.clientY-drag.oy}:x)); };
  const ovUp=()=>{ if(drag){pushH([...els]);setDrag(null);} };

  const tiClick=(e:React.MouseEvent,id:string)=>{ e.stopPropagation(); if(tool!=="select")return; setEditId(id); };
  const tiChange=(id:string,v:string)=>setItems(p=>p.map(t=>t.id===id?{...t,editedStr:v,isEdited:v!==t.str}:t));
  const tiCommit=()=>setEditId(null);

  const sStart=(e:React.MouseEvent<HTMLCanvasElement>)=>{ const c=signRef.current;if(!c)return; const ctx=c.getContext("2d")!,r=c.getBoundingClientRect(); ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle="#111";setSigDrw(true); };
  const sDraw=(e:React.MouseEvent<HTMLCanvasElement>)=>{ if(!sigDrw)return; const c=signRef.current!;const ctx=c.getContext("2d")!,r=c.getBoundingClientRect();ctx.lineTo(e.clientX-r.left,e.clientY-r.top);ctx.stroke(); };
  const sEnd=()=>setSigDrw(false);
  const sClear=()=>signRef.current?.getContext("2d")?.clearRect(0,0,400,160);
  const sSave=()=>{ setSigUrl(signRef.current?.toDataURL("image/png")||null); setSignModal(false); };

  const rotatePage=()=>setRotations(p=>{const c=[...p];c[curPage-1]=(c[curPage-1]+90)%360;return c;});
  const delPage=()=>{ if(numPages-deleted.length<=1){setErrMsg("Cannot delete all pages.");return;} if(!deleted.includes(curPage)) setDeleted(p=>[...p,curPage]); };
  const restPage=()=>setDeleted(p=>p.filter(x=>x!==curPage));

  const savePdf = async () => {
    if (!file||!vpRef) return;
    setBusy(true); setErrMsg("");
    try {
      const ab=await file.arrayBuffer();
      const doc=await PDFDocument.load(ab);
      const hel=await doc.embedFont(StandardFonts.Helvetica);
      const tim=await doc.embedFont(StandardFonts.TimesRoman);
      const cou=await doc.embedFont(StandardFonts.Courier);
      const pgs=doc.getPages();
      pgs.forEach((p,i)=>{ const r=rotations[i]||0; if(r) p.setRotation(degrees((p.getRotation().angle+r)%360)); });
      if(watermark.trim()) pgs.forEach(p=>{ const{width,height}=p.getSize(); p.drawText(watermark,{x:width/5,y:height/2,size:52,font:hel,color:rgb(.6,.6,.6),opacity:.18,rotate:degrees(45)}); });
      const edited=items.filter(t=>t.isEdited);
      if(edited.length&&pgs[curPage-1]){
        const pg=pgs[curPage-1]; const{height:H}=pg.getSize();
        for(const t of edited){
          const px=t.x/scale, py=H-(t.y+t.height)/scale;
          pg.drawRectangle({x:px-1,y:py-2,width:t.width/scale+4,height:t.height/scale+4,color:rgb(1,1,1)});
          if(t.editedStr.trim()) pg.drawText(t.editedStr,{x:px,y:py+2,size:Math.max(t.fontSize/scale,6),font:hel,color:rgb(0,0,0)});
        }
      }
      for(const e of els){
        if(deleted.includes(e.page)||!pgs[e.page-1])continue;
        const pg=pgs[e.page-1]; const{height:H}=pg.getSize();
        if(e.type==="whiteout") pg.drawRectangle({x:e.x/scale,y:H-(e.y+(e.h||24))/scale,width:(e.w||120)/scale,height:(e.h||24)/scale,color:rgb(1,1,1)});
        else if(e.type==="highlight") pg.drawRectangle({x:e.x/scale,y:H-(e.y+(e.h||22))/scale,width:(e.w||160)/scale,height:(e.h||22)/scale,color:rgb(1,.95,.2),opacity:.45});
        else if(e.type==="text"){const{r,g,b}=hex01(e.color||"#000");const f=e.font==="Times"?tim:e.font==="Courier"?cou:hel;pg.drawText(e.text||"",{x:e.x/scale,y:H-(e.y+(e.size||14))/scale,size:Math.max((e.size||14)/scale,6),font:f,color:rgb(r,g,b)});}
        else if(e.type==="signature"&&e.dataUrl){const ib=await fetch(e.dataUrl).then(r=>r.arrayBuffer());const img=await doc.embedPng(ib);pg.drawImage(img,{x:e.x/scale,y:H-(e.y+(e.h||70))/scale,width:(e.w||140)/scale,height:(e.h||70)/scale});}
      }
      [...deleted].sort((a,b)=>b-a).forEach(n=>doc.removePage(n-1));
      const bytes=await doc.save();
      const url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
      const a=document.createElement("a");a.href=url;a.download=`Edited_${file.name}`;a.click();
      URL.revokeObjectURL(url); setOk(true); setTimeout(()=>setOk(false),4000);
    } catch(e:any){ setErrMsg("Save failed: "+(e.message||"")); }
    finally { setBusy(false); }
  };

  const isDelPage=deleted.includes(curPage);
  const toolDefs: {id:ToolType;icon:string;label:string}[] = [
    {id:"select",icon:"↖",label:"Select & Edit Text"},
    {id:"text",icon:"T",label:"Add Text"},
    {id:"whiteout",icon:"▭",label:"Whiteout Eraser"},
    {id:"highlight",icon:"◈",label:"Highlight"},
    {id:"signature",icon:"✍",label:"Signature"},
    {id:"draw",icon:"✏",label:"Freehand Draw"},
  ];

  return (
    <AuthGate><ProGate>
    <div className="min-h-screen bg-[#f2f2f7] dark:bg-[#040404] text-[#1d1d1f] dark:text-white antialiased flex flex-col">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#0c0e12]/95 backdrop-blur-md sticky top-0 z-40 h-14 flex items-center px-4 justify-between gap-3">
        <Link href="/pdf-tools" className="text-[#0071e3] text-xs font-bold shrink-0">← PDF Suite</Link>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button onClick={undo} disabled={histIdx.current<=0} title="Ctrl+Z" className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-xs font-bold disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition">↩ Undo</button>
          <button onClick={redo} disabled={histIdx.current>=histRef.current.length-1} title="Ctrl+Y" className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-xs font-bold disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition">↪ Redo</button>
          <div className="w-px h-5 bg-black/10 dark:bg-white/10"/>
          <button onClick={()=>setScale(s=>Math.max(0.5,+(s-.25).toFixed(2)))} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold">−</button>
          <span className="text-xs font-bold w-12 text-center tabular-nums">{Math.round(scale*100)}%</span>
          <button onClick={()=>setScale(s=>Math.min(3,+(s+.25).toFixed(2)))} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold">+</button>
          <div className="w-px h-5 bg-black/10 dark:bg-white/10"/>
          <input type="text" placeholder="Watermark…" value={watermark} onChange={e=>setWatermark(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium outline-none w-36 focus:ring-2 ring-[#0071e3]"/>
        </div>
        {file&&<button onClick={savePdf} disabled={busy} className="shrink-0 bg-[#0071e3] hover:bg-[#006bd6] text-white font-bold px-4 py-2 rounded-full text-xs shadow-md shadow-blue-500/20 active:scale-95 transition">{busy?"Saving…":"📥 Save PDF"}</button>}
      </nav>

      {!file ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-xl w-full text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-[#0071e3] text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-500/20 mb-4">👑 Pro PDF Studio</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Adobe-Style PDF Editor</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">Click on <strong className="text-[#0071e3]">existing text to edit it directly</strong>. Add text, highlight, sign, draw — 100% in-browser.</p>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-slate-500 mb-8">
              {["✅ Real PDF Rendering","✅ Click-to-Edit Text","✅ Undo / Redo","✅ Drag Elements","✅ Digital Signature","✅ Freehand Draw"].map(s=><span key={s} className="bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">{s}</span>)}
            </div>
            <label htmlFor="pdf-up" className="block cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-3xl p-14 bg-white dark:bg-[#0c0e12] transition-all group">
              <span className="text-6xl block mb-3">📑</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#0071e3] transition block">Click or drag PDF here</span>
              <span className="text-xs text-slate-400 block mt-1">Works best with digitally-created PDFs (not scanned images)</span>
            </label>
            <input type="file" id="pdf-up" ref={fileRef} accept="application/pdf" onChange={handleFileChange} className="hidden"/>
            {busy&&<p className="mt-4 text-sm text-[#0071e3] font-semibold animate-pulse">Rendering PDF…</p>}
            {errMsg&&<div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 font-semibold">⚠️ {errMsg}</div>}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-[185px] shrink-0 border-r border-black/5 dark:border-white/10 bg-white dark:bg-[#0c0e12] flex flex-col gap-1.5 p-2.5 overflow-y-auto">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 mt-1 mb-0.5">Tools</p>
            {toolDefs.map(t=>(
              <button key={t.id} onClick={()=>{setTool(t.id);if(t.id==="signature"&&!sigUrl)setSignModal(true);}}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${tool===t.id?"bg-[#0071e3] text-white shadow-md shadow-blue-500/20":"text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"}`}>
                <span className="text-sm font-black w-4 text-center">{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
            {tool==="select"&&<div className="mt-1 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-[11px] text-[#0071e3] leading-loose">💡 <strong>Hover</strong> any PDF text to see blue glow.<br/><strong>Click</strong> to edit it in place.<br/>Press <strong>Enter</strong> to confirm.<br/><br/>Drag added items to move.<br/><kbd className="bg-white dark:bg-black px-1 rounded border text-[10px]">Del</kbd> removes selected.</div>}
            {tool==="text"&&<div className="mt-1 space-y-2.5 text-xs"><p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Text Options</p><input type="text" value={tText} onChange={e=>setTText(e.target.value)} placeholder="Text content…" className="w-full bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2 font-medium text-xs outline-none focus:ring-2 ring-[#0071e3]"/><div className="flex items-center gap-2"><span className="text-slate-500 shrink-0 text-[11px] w-16">Size:{tSize}pt</span><input type="range" min={8} max={72} value={tSize} onChange={e=>setTSize(+e.target.value)} className="flex-1 accent-[#0071e3]"/></div><div className="flex items-center gap-2"><span className="text-slate-500 shrink-0 text-[11px] w-16">Color</span><input type="color" value={tColor} onChange={e=>setTColor(e.target.value)} className="h-7 w-full rounded-lg cursor-pointer border"/></div></div>}
            <div className="h-px bg-black/5 dark:bg-white/5 my-1"/>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 mb-0.5">Pages</p>
            <div className="flex gap-1"><button onClick={()=>setCurPage(p=>Math.max(1,p-1))} disabled={curPage<=1} className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 disabled:opacity-30">◀</button><span className="flex items-center text-[11px] font-bold px-1.5 whitespace-nowrap">{curPage}/{numPages}</span><button onClick={()=>setCurPage(p=>Math.min(numPages,p+1))} disabled={curPage>=numPages} className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 disabled:opacity-30">▶</button></div>
            <button onClick={rotatePage} className="py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition">🔄 Rotate 90°</button>
            {isDelPage?<button onClick={restPage} className="py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">✓ Restore</button>:<button onClick={delPage} className="py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">🗑 Delete Page</button>}
            {sigUrl&&<button onClick={()=>setSignModal(true)} className="py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5">✍️ Redraw Sign</button>}
            <div className="h-px bg-black/5 dark:bg-white/5"/>
            <button onClick={()=>{setFile(null);setEls([]);setItems([]);setPjDoc(null);}} className="py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">✕ Close PDF</button>
            {ok&&<div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[11px] text-emerald-600 font-bold text-center">✅ PDF Saved!</div>}
            {errMsg&&<div className="p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-[11px] text-rose-600 font-bold break-words">⚠️ {errMsg}</div>}
          </aside>

          <main className="flex-1 overflow-auto bg-[#c7c7cc] dark:bg-slate-900 flex flex-col items-center py-8 px-6 gap-4">
            {isDelPage&&<div className="bg-rose-100 dark:bg-rose-950/50 border border-rose-300 rounded-xl px-4 py-2 text-xs font-bold text-rose-600">Page marked for deletion — removed on Save.</div>}
            <div style={{width:cvSize.w,height:cvSize.h,opacity:isDelPage?.3:1}} className="relative shadow-2xl bg-white select-none">
              <canvas ref={canvasRef} style={{position:"absolute",top:0,left:0,display:"block"}}/>
              {items.map(item=>(
                <div key={item.id} onClick={e=>tiClick(e,item.id)} title={tool==="select"?"Click to edit text":undefined}
                  style={{position:"absolute",left:item.x,top:item.y,width:Math.max(item.width,10),height:Math.max(item.height,10),zIndex:10,cursor:tool==="select"?"text":"default"}}>
                  {editId===item.id?(
                    <input autoFocus value={item.editedStr} onChange={e=>tiChange(item.id,e.target.value)} onBlur={tiCommit} onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")tiCommit();}}
                      style={{fontSize:item.fontSize,fontFamily:"Helvetica,Arial,sans-serif",width:Math.max(item.width+80,100),height:item.height+6,background:"rgba(255,255,255,0.98)",border:"2.5px solid #0071e3",borderRadius:4,padding:"0 4px",outline:"none",boxShadow:"0 0 0 4px rgba(0,113,227,0.2)",color:"#000",position:"relative",zIndex:30}}/>
                  ):(
                    <div className="w-full h-full rounded transition-all"
                      style={{background:item.isEdited?"rgba(255,235,59,0.3)":"transparent",border:item.isEdited?"1.5px dashed #0071e3":tool==="select"?"1px solid transparent":"none"}}
                      onMouseEnter={e=>{if(tool==="select")(e.currentTarget as HTMLDivElement).style.background="rgba(0,113,227,0.09)";}}
                      onMouseLeave={e=>{if(tool==="select"&&!item.isEdited)(e.currentTarget as HTMLDivElement).style.background="transparent";}}/>
                  )}
                </div>
              ))}
              <div ref={overlayRef} onClick={handleOverlayClick} onMouseMove={ovMove} onMouseUp={ovUp}
                style={{position:"absolute",top:0,left:0,width:cvSize.w,height:cvSize.h,zIndex:20,cursor:tool==="select"?"default":"crosshair"}}>
                {els.filter(e=>e.page===curPage&&e.type!=="draw").map(e=>(
                  <div key={e.id} onMouseDown={ev=>elDown(ev,e.id)} style={{position:"absolute",left:e.x,top:e.y,zIndex:25,outline:selId===e.id?"2px solid #0071e3":"none",borderRadius:3}} className={tool==="select"?"cursor-move":""}>
                    {e.type==="text"&&<span style={{fontSize:e.size,color:e.color,fontFamily:"sans-serif",whiteSpace:"nowrap",display:"block",padding:"1px 2px"}}>{e.text}</span>}
                    {e.type==="whiteout"&&<div style={{width:e.w,height:e.h,background:"#fff",border:"1px solid #d1d5db"}}/>}
                    {e.type==="highlight"&&<div style={{width:e.w,height:e.h,background:"rgba(255,235,59,0.45)"}}/>}
                    {e.type==="signature"&&e.dataUrl&&<img src={e.dataUrl} alt="sig" style={{width:e.w,height:e.h,objectFit:"contain"}}/>}
                    {selId===e.id&&<button onMouseDown={ev=>{ev.stopPropagation();const n=els.filter(x=>x.id!==e.id);pushH(n);setSelId(null);}} style={{position:"absolute",top:-10,right:-10,width:20,height:20,borderRadius:"50%",background:"#ef4444",color:"#fff",fontSize:10,border:"none",cursor:"pointer",zIndex:30,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
                  </div>
                ))}
              </div>
              <canvas ref={drawRef} width={cvSize.w} height={cvSize.h}
                onMouseDown={dStart} onMouseMove={dMove} onMouseUp={dEnd} onMouseLeave={dEnd}
                style={{position:"absolute",top:0,left:0,zIndex:tool==="draw"?30:5,cursor:tool==="draw"?"crosshair":"default",pointerEvents:tool==="draw"?"all":"none"}}/>
            </div>
          </main>

          <aside className="w-[96px] shrink-0 border-l border-black/5 dark:border-white/10 bg-white dark:bg-[#0c0e12] overflow-y-auto flex flex-col gap-2 p-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Pages</p>
            {Array.from({length:numPages}).map((_,i)=>{
              const p=i+1, isDel=deleted.includes(p);
              return (
                <button key={p} onClick={()=>setCurPage(p)} className={`relative rounded-lg overflow-hidden border-2 transition-all ${curPage===p?"border-[#0071e3] shadow-md":""} ${isDel?"opacity-30":""}`}>
                  {thumbs.get(p)?<img src={thumbs.get(p)} alt={`p${p}`} className="w-full block"/>:<div className="w-full aspect-[3/4] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] text-slate-400">…</div>}
                  <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center font-bold bg-white/80 dark:bg-black/70 py-0.5">{p}</span>
                  {isDel&&<span className="absolute inset-0 bg-rose-500/20 flex items-center justify-center text-[9px] font-bold text-rose-600">DEL</span>}
                </button>
              );
            })}
          </aside>
        </div>
      )}

      {signModal&&(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e12] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4 text-center">
            <h3 className="text-sm font-black uppercase tracking-wider">Draw Your Signature</h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white overflow-hidden">
              <canvas ref={signRef} width={400} height={160} onMouseDown={sStart} onMouseMove={sDraw} onMouseUp={sEnd} onMouseLeave={sEnd} className="cursor-crosshair"/>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button onClick={sClear} className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">Clear</button>
              <button onClick={sSave} className="py-2.5 rounded-xl bg-[#0071e3] text-white shadow-md shadow-blue-500/20">Save & Place</button>
            </div>
            <button onClick={()=>setSignModal(false)} className="text-xs text-slate-400 hover:text-slate-600 transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
    </ProGate></AuthGate>
  );
}
