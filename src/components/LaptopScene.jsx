"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ========================================================================== */
/*  CANVAS DYNAMIC SCREEN TEXTURE (Throttled for 60FPS Smooth Performance)   */
/* ========================================================================== */

const SCREEN_W = 1200; // Lower resolution for super fast GPU memory upload
const SCREEN_H = 750;
const SCENE_DURATION = 5;

const BRAND = {
  bg: "#0b0f17",
  card: "#121824",
  border: "#1e293b",
  borderLight: "#334155",
  text: "#f8fafc",
  muted: "#94a3b8",
  subtle: "#64748b",
  blue: "#0071e3",
  teal: "#0d9488",
  green: "#10b981",
  greenSoft: "rgba(16,185,129,0.15)",
};

function drawRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawText(ctx, str, x, y, { size = 13, weight = 500, color = BRAND.text, align = "left" } = {}) {
  ctx.font = `${weight} ${size}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(str, x, y);
}

function drawBadge(ctx, x, y, label, bg, fg) {
  ctx.font = `600 10px Inter, sans-serif`;
  const w = ctx.measureText(label).width + 14;
  drawRoundRect(ctx, x, y - 9, w, 18, 9);
  ctx.fillStyle = bg;
  ctx.fill();
  drawText(ctx, label, x + 7, y, { size: 10, weight: 600, color: fg });
  return w;
}

const TOOL_SCENES = [
  {
    toolName: "PDF Editor & Merger",
    badge: "Popular Tool",
    icon: "📄",
    sidebarActive: 0,
    files: [
      { name: "Q4_Financial_Report.pdf", size: "3.4 MB", pages: "18 pages", status: "Done" },
      { name: "Signed_Agreement_2026.pdf", size: "1.2 MB", pages: "4 pages", status: "Done" },
      { name: "Project_Proposal_Draft.pdf", size: "4.8 MB", pages: "12 pages", status: "Processing..." },
      { name: "Tax_Declaration_Form.pdf", size: "850 KB", pages: "2 pages", status: "Queued" },
    ],
    actionBtn: "Merge All PDFs",
    toast: "Merged 4 files → ToolBox_Combined.pdf",
  },
  {
    toolName: "Smart Image Compressor",
    badge: "80% Reduction",
    icon: "🖼️",
    sidebarActive: 1,
    files: [
      { name: "hero_banner_4k.png", orig: "4.8 MB", comp: "960 KB (-80%)" },
      { name: "product_mockup.jpg", orig: "2.4 MB", comp: "420 KB (-82%)" },
      { name: "profile_avatar.png", orig: "1.1 MB", comp: "210 KB (-81%)" },
      { name: "portfolio_shot.png", orig: "3.6 MB", comp: "710 KB (-80%)" },
    ],
    actionBtn: "Compress All Images",
    toast: "Saved 9.6 MB space across 4 images!",
  },
  {
    toolName: "ATS Resume Builder",
    badge: "Pro Template",
    icon: "📝",
    sidebarActive: 2,
    resume: {
      name: "Lakhan Kashyap",
      title: "Senior Full Stack Engineer",
      skills: ["React.js", "Next.js", "Node.js", "TypeScript"],
    },
    actionBtn: "Export ATS PDF",
    toast: "Generated ATS Resume → Lakhan_Resume.pdf",
  },
];

function renderScreenFrame(ctx, sceneIdx, progress) {
  const scene = TOOL_SCENES[sceneIdx];

  ctx.fillStyle = BRAND.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Top Titlebar
  ctx.fillStyle = "#070a0f";
  ctx.fillRect(0, 0, SCREEN_W, 36);

  const dots = ["#ff5f56", "#ffbd2e", "#27c93f"];
  dots.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(18 + i * 16, 18, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  drawRoundRect(ctx, SCREEN_W / 2 - 180, 7, 360, 22, 5);
  ctx.fillStyle = "#1e293b";
  ctx.fill();
  drawText(ctx, "🔒 https://toolbox.app/" + scene.toolName.toLowerCase().replace(/ /g, "-"), SCREEN_W / 2, 18, {
    size: 10.5,
    color: "#94a3b8",
    align: "center",
  });

  // App Nav
  const NAV_H = 46;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 36, SCREEN_W, NAV_H);
  ctx.strokeStyle = BRAND.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 36 + NAV_H);
  ctx.lineTo(SCREEN_W, 36 + NAV_H);
  ctx.stroke();

  drawText(ctx, "🛠️ ToolBox", 24, 36 + NAV_H / 2, { size: 15, weight: 800, color: "#ffffff" });

  const navs = ["All Tools", "PDF Editor", "Image Compressor", "Resume Builder"];
  let nx = 150;
  navs.forEach((item, i) => {
    const isAct = i === scene.sidebarActive + 1;
    if (isAct) {
      drawRoundRect(ctx, nx - 8, 36 + 10, ctx.measureText(item).width + 16, 26, 6);
      ctx.fillStyle = BRAND.blue;
      ctx.fill();
    }
    drawText(ctx, item, nx, 36 + NAV_H / 2, {
      size: 12,
      weight: isAct ? 700 : 500,
      color: isAct ? "#ffffff" : BRAND.muted,
    });
    nx += ctx.measureText(item).width + 24;
  });

  // Sidebar + Content Split
  const SIDEBAR_W = 210;
  const WORK_Y = 36 + NAV_H;

  ctx.fillStyle = "#0d131f";
  ctx.fillRect(0, WORK_Y, SIDEBAR_W, SCREEN_H - WORK_Y);
  ctx.strokeStyle = BRAND.border;
  ctx.beginPath();
  ctx.moveTo(SIDEBAR_W, WORK_Y);
  ctx.lineTo(SIDEBAR_W, SCREEN_H);
  ctx.stroke();

  const sidebarItems = [
    { name: "PDF Editor", icon: "📄" },
    { name: "Image Compressor", icon: "🖼️" },
    { name: "Resume Builder", icon: "📝" },
    { name: "QR Generator", icon: "🔳" },
  ];

  sidebarItems.forEach((item, i) => {
    const sy = WORK_Y + 18 + i * 40;
    const isAct = i === scene.sidebarActive;
    if (isAct) {
      drawRoundRect(ctx, 12, sy, SIDEBAR_W - 24, 32, 8);
      ctx.fillStyle = "rgba(0,113,227,0.18)";
      ctx.fill();
      ctx.strokeStyle = BRAND.blue;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    drawText(ctx, `${item.icon}  ${item.name}`, 24, sy + 16, {
      size: 12,
      weight: isAct ? 700 : 500,
      color: isAct ? "#ffffff" : BRAND.muted,
    });
  });

  // Content Workspace
  const MAIN_X = SIDEBAR_W + 28;
  const MAIN_Y = WORK_Y + 24;

  drawText(ctx, `${scene.icon}  ${scene.toolName}`, MAIN_X, MAIN_Y + 12, { size: 20, weight: 800, color: "#ffffff" });
  drawBadge(ctx, MAIN_X + ctx.measureText(`${scene.icon}  ${scene.toolName}`).width + 20, MAIN_Y + 12, scene.badge, "rgba(16,185,129,0.2)", "#34d399");

  // Action Button
  const btnW = 150;
  const btnX = SCREEN_W - 40 - btnW;
  drawRoundRect(ctx, btnX, MAIN_Y + 4, btnW, 34, 8);
  ctx.fillStyle = BRAND.blue;
  ctx.fill();
  drawText(ctx, `⚡ ${scene.actionBtn}`, btnX + btnW / 2, MAIN_Y + 21, {
    size: 12,
    weight: 700,
    color: "#ffffff",
    align: "center",
  });

  // Table / Card Content
  const TABLE_Y = MAIN_Y + 54;
  const TABLE_W = SCREEN_W - SIDEBAR_W - 68;

  if (sceneIdx === 0 || sceneIdx === 1) {
    drawRoundRect(ctx, MAIN_X, TABLE_Y, TABLE_W, 360, 12);
    ctx.fillStyle = BRAND.card;
    ctx.fill();
    ctx.strokeStyle = BRAND.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    const activeRowIdx = Math.min(scene.files.length - 1, Math.floor(progress * scene.files.length * 1.2));

    scene.files.forEach((file, i) => {
      const ry = TABLE_Y + 20 + i * 76;
      const isDone = i <= activeRowIdx;

      ctx.strokeStyle = "#1e293b";
      ctx.beginPath();
      ctx.moveTo(MAIN_X + 16, ry + 60);
      ctx.lineTo(MAIN_X + TABLE_W - 16, ry + 60);
      ctx.stroke();

      drawText(ctx, sceneIdx === 0 ? "📄" : "🖼️", MAIN_X + 20, ry + 20, { size: 16 });
      drawText(ctx, file.name, MAIN_X + 48, ry + 20, { size: 13, weight: 600, color: "#f8fafc" });

      if (sceneIdx === 0) {
        drawText(ctx, file.pages, MAIN_X + 380, ry + 20, { size: 12, color: BRAND.muted });
        drawText(ctx, file.size, MAIN_X + 540, ry + 20, { size: 12, color: BRAND.muted });
      } else {
        drawText(ctx, file.orig, MAIN_X + 380, ry + 20, { size: 12, color: BRAND.muted });
        drawText(ctx, file.comp, MAIN_X + 540, ry + 20, { size: 12, weight: 700, color: "#34d399" });
      }

      if (isDone) {
        drawBadge(ctx, MAIN_X + TABLE_W - 100, ry + 20, "✓ Ready", "rgba(16,185,129,0.2)", "#34d399");
      } else {
        drawBadge(ctx, MAIN_X + TABLE_W - 100, ry + 20, "⏳ Wait", "rgba(0,113,227,0.2)", "#38bdf8");
      }

      const pbW = TABLE_W - 60;
      const pbVal = isDone ? 1 : Math.max(0.1, (progress * scene.files.length) - i);
      drawRoundRect(ctx, MAIN_X + 20, ry + 44, pbW, 5, 2.5);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      drawRoundRect(ctx, MAIN_X + 20, ry + 44, pbW * Math.min(1, pbVal), 5, 2.5);
      ctx.fillStyle = isDone ? BRAND.green : BRAND.blue;
      ctx.fill();
    });
  } else {
    // Resume preview
    const PANEL_W = (TABLE_W - 20) / 2;

    drawRoundRect(ctx, MAIN_X, TABLE_Y, PANEL_W, 360, 12);
    ctx.fillStyle = BRAND.card;
    ctx.fill();
    ctx.strokeStyle = BRAND.border;
    ctx.stroke();

    drawText(ctx, "Live ATS Resume Editor", MAIN_X + 20, TABLE_Y + 30, { size: 14, weight: 700, color: "#fff" });

    const PREV_X = MAIN_X + PANEL_W + 20;
    drawRoundRect(ctx, PREV_X, TABLE_Y, PANEL_W, 360, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    drawText(ctx, scene.resume.name, PREV_X + 24, TABLE_Y + 40, { size: 18, weight: 800, color: "#0f172a" });
    drawText(ctx, scene.resume.title, PREV_X + 24, TABLE_Y + 64, { size: 12, weight: 600, color: BRAND.blue });
  }

  // Toast Notification Popup
  if (progress > 0.65) {
    const toastAlpha = Math.min(1, (progress - 0.65) / 0.15);
    ctx.save();
    ctx.globalAlpha = toastAlpha;

    const TW = 400;
    const TH = 42;
    const TX = SCREEN_W / 2 - TW / 2;
    const TY = SCREEN_H - 54;

    drawRoundRect(ctx, TX, TY, TW, TH, 10);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.strokeStyle = BRAND.blue;
    ctx.lineWidth = 1;
    ctx.stroke();

    drawText(ctx, "🎉  " + scene.toast, SCREEN_W / 2, TY + TH / 2, {
      size: 12,
      weight: 600,
      color: "#ffffff",
      align: "center",
    });
    ctx.restore();
  }
}

/* ========================================================================== */
/*  OPTIMIZED THREE.JS LAPTOP CANVAS COMPONENT                                */
/* ========================================================================== */

export default function LaptopScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Offscreen 2D Canvas for screen content
    const texCanvas = document.createElement("canvas");
    texCanvas.width = SCREEN_W;
    texCanvas.height = SCREEN_H;
    const tctx = texCanvas.getContext("2d");

    const texture = new THREE.CanvasTexture(texCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // 2. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped at 1.5 for butter smooth 60fps
    mount.appendChild(renderer.domElement);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    // 3. Laptop Mesh Geometry
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0x222630,
      metalness: 0.8,
      roughness: 0.25,
    });

    const darkBezelMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      metalness: 0.3,
      roughness: 0.5,
    });

    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 2.45), aluminumMat);
    baseMesh.position.y = -0.85;
    laptopGroup.add(baseMesh);

    const trackpadMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.005, 0.72),
      new THREE.MeshStandardMaterial({ color: 0x2a303f, metalness: 0.4, roughness: 0.4 })
    );
    trackpadMesh.position.set(0, -0.785, 0.55);
    laptopGroup.add(trackpadMesh);

    const screenPivot = new THREE.Group();
    screenPivot.position.set(0, -0.79, -1.22);
    laptopGroup.add(screenPivot);

    const screenBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.3, 0.08), aluminumMat);
    screenBack.position.set(0, 1.15, -0.04);
    screenPivot.add(screenBack);

    const screenBezel = new THREE.Mesh(new THREE.BoxGeometry(3.46, 2.18, 0.02), darkBezelMat);
    screenBezel.position.set(0, 1.15, 0.01);
    screenPivot.add(screenBezel);

    const screenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(3.32, 2.05),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    screenDisplay.position.set(0, 1.15, 0.022);
    screenPivot.add(screenDisplay);

    // Initial Closed Position for Entrance Animation
    screenPivot.rotation.x = Math.PI / 2.05;
    laptopGroup.rotation.x = 0.08;
    laptopGroup.rotation.y = -0.4;
    laptopGroup.scale.setScalar(0.75);

    // 4. Resize Handling
    function handleResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // 5. GSAP Entrance Animation
    const entranceTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: mount,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    entranceTimeline
      .to(laptopGroup.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: "power3.out" }, 0)
      .to(laptopGroup.rotation, { y: 0, duration: 1.2, ease: "power3.out" }, 0.1)
      .to(screenPivot.rotation, { x: Math.PI / 2 - 1.68, duration: 1.1, ease: "power2.out" }, 0.2);

    // 6. Throttled Parallax & Throttled 2D Canvas Redraw (15 FPS Canvas updates = Zero Lag!)
    let targetMouseX = 0;
    let targetMouseY = 0;

    function handleMouseMove(e) {
      const rect = mount.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.5;
    }

    if (!isTouch && !reduceMotion) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const clock = new THREE.Clock();
    let lastCanvasUpdate = 0;
    let animFrameId;

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Throttle 2D Canvas texture updates to 15 FPS (Saves 80% GPU memory transfer load!)
      if (elapsedTime - lastCanvasUpdate > 1 / 15) {
        lastCanvasUpdate = elapsedTime;

        const totalCycle = SCENE_DURATION * TOOL_SCENES.length;
        const currentCycleTime = elapsedTime % totalCycle;
        const activeSceneIdx = Math.floor(currentCycleTime / SCENE_DURATION) % TOOL_SCENES.length;
        const sceneProgress = (currentCycleTime % SCENE_DURATION) / SCENE_DURATION;

        renderScreenFrame(tctx, activeSceneIdx, sceneProgress);
        texture.needsUpdate = true;
      }

      // Smooth Parallax Interpolation (60 FPS)
      if (!reduceMotion) {
        laptopGroup.rotation.y += (targetMouseX * 0.2 - laptopGroup.rotation.y) * 0.05;
        laptopGroup.rotation.x += (0.08 - targetMouseY * 0.08 - laptopGroup.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    }

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      if (!isTouch && !reduceMotion) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      resizeObserver.disconnect();
      entranceTimeline.scrollTrigger?.kill();
      entranceTimeline.kill();

      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      texture.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} style={{ width: "100%", height: "100%" }} />;
}