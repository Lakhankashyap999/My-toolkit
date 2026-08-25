// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import ProGate from "../../components/ProGate";
import AuthGate from "../../components/AuthGate";

/* ========================================================================== */
/*  INTERFACES & TYPES                                                        */
/* ========================================================================== */

interface Experience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface Achievement {
  id: string;
  title: string;
  year: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/* ========================================================================== */
/*  TEMPLATES CONFIGURATION                                                   */
/* ========================================================================== */

const RESUME_TEMPLATES = [
  {
    id: "ats-clean",
    name: "Classic ATS Standard",
    badge: "99% ATS Pass",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    desc: "Single-column monochrome layout optimized for high-volume ATS scanners.",
    primaryColor: "#1e293b",
    headerBg: "transparent",
  },
  {
    id: "modern-tech",
    name: "Modern Tech & Developer",
    badge: "Most Popular",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    desc: "Clean tech layout with blue accent banners and bold section dividers.",
    primaryColor: "#0071e3",
    headerBg: "#f0f7ff",
  },
  {
    id: "executive",
    name: "Executive Leadership",
    badge: "Corporate",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    desc: "Dark top banner with gold/teal accent hierarchy for senior roles.",
    primaryColor: "#0f172a",
    headerBg: "#0f172a",
  },
  {
    id: "minimalist",
    name: "Apple Minimalist",
    badge: "Ultra Clean",
    badgeColor: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    desc: "Spacious layout with generous margins and subtle gray metadata.",
    primaryColor: "#334155",
    headerBg: "transparent",
  },
  {
    id: "creative-accent",
    name: "Creative Accent",
    badge: "Designers & Product",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    desc: "Vibrant accent colors with pill-style skill tags.",
    primaryColor: "#e11d48",
    headerBg: "#fff1f2",
  },
];

/* ========================================================================== */
/*  SAMPLE DEMO DATA FOR 1-CLICK TEST                                         */
/* ========================================================================== */

const SAMPLE_DATA = {
  fullName: "Lakhan Kashyap",
  title: "Senior Full Stack Engineer",
  email: "lakhan.kashyap@example.com",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  linkedin: "linkedin.com/in/lakhankashyap",
  website: "lakhankashyap.dev",
  summary: "Results-driven Full Stack Engineer with 5+ years of experience building high-scale web applications using React, Next.js, Node.js, and Cloud Infrastructure. Proven track record of improving system performance by 65% and leading cross-functional developer teams.",
  skills: "React.js, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, AWS, Docker, REST APIs, GraphQL",
  interests: "Open Source Development, Tech Blogging, Machine Learning, UI Architecture",
};

const SAMPLE_EXP: Experience[] = [
  {
    id: generateId(),
    company: "TechCorp Solutions",
    role: "Senior Full Stack Engineer",
    start: "Jan 2023",
    end: "Present",
    description: "Architected high-throughput Next.js frontend serving 500k+ monthly active users.\nReduced API response latency by 45% through Redis caching and PostgreSQL query optimization.\nMentored 4 junior engineers and implemented CI/CD pipelines using GitHub Actions.",
  },
  {
    id: generateId(),
    company: "Innovate Web Systems",
    role: "Frontend Developer",
    start: "Jul 2021",
    end: "Dec 2022",
    description: "Built responsive React dashboards with real-time WebSocket data updates.\nCollaborated with product designers to implement an accessible Tailwind CSS design system.",
  },
];

const SAMPLE_EDU: Education[] = [
  {
    id: generateId(),
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Indian Institute of Technology (IIT)",
    year: "2017 - 2021",
  },
];

const SAMPLE_PROJECTS: Project[] = [
  {
    id: generateId(),
    name: "ToolBox - Web Utility Suite",
    link: "toolbox.app",
    description: "Built an all-in-one browser utility platform featuring PDF editing, ATS resume generation, and image compression.",
  },
];

const SAMPLE_CERTS: Certification[] = [
  {
    id: generateId(),
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2024",
  },
];

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: generateId(),
    title: "1st Place Winner - National Hackathon 2023",
    year: "2023",
  },
];

const SAMPLE_LANGUAGES: Language[] = [
  { id: generateId(), name: "English", proficiency: "Fluent" },
  { id: generateId(), name: "Hindi", proficiency: "Native" },
];

/* ========================================================================== */
/*  MAIN RESUME MAKER PAGE COMPONENT                                          */
/* ========================================================================== */

export default function ResumeMakerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern-tech");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [form, setForm] = useState(SAMPLE_DATA);
  const [experience, setExperience] = useState<Experience[]>(SAMPLE_EXP);
  const [education, setEducation] = useState<Education[]>(SAMPLE_EDU);
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [certifications, setCertifications] = useState<Certification[]>(SAMPLE_CERTS);
  const [achievements, setAchievements] = useState<Achievement[]>(SAMPLE_ACHIEVEMENTS);
  const [languages, setLanguages] = useState<Language[]>(SAMPLE_LANGUAGES);
  const [references, setReferences] = useState<string>("Available upon request.");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load sample data
  const handleLoadSampleData = () => {
    setForm(SAMPLE_DATA);
    setExperience(SAMPLE_EXP);
    setEducation(SAMPLE_EDU);
    setProjects(SAMPLE_PROJECTS);
    setCertifications(SAMPLE_CERTS);
    setAchievements(SAMPLE_ACHIEVEMENTS);
    setLanguages(SAMPLE_LANGUAGES);
    setReferences("Available upon request.");
  };

  // Reset form
  const handleClearForm = () => {
    setForm({
      fullName: "", title: "", email: "", phone: "", location: "",
      linkedin: "", website: "", summary: "", skills: "", interests: ""
    });
    setExperience([{ id: generateId(), company: "", role: "", start: "", end: "", description: "" }]);
    setEducation([{ id: generateId(), degree: "", institution: "", year: "" }]);
    setProjects([{ id: generateId(), name: "", link: "", description: "" }]);
    setCertifications([{ id: generateId(), name: "", issuer: "", year: "" }]);
    setAchievements([{ id: generateId(), title: "", year: "" }]);
    setLanguages([{ id: generateId(), name: "", proficiency: "" }]);
    setReferences("");
  };

  // Dynamic add/remove/update functions
  const addExperience = () => {
    setExperience([...experience, { id: generateId(), company: "", role: "", start: "", end: "", description: "" }]);
  };
  const removeExperience = (id: string) => setExperience(experience.filter((exp) => exp.id !== id));
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const addEducation = () => setEducation([...education, { id: generateId(), degree: "", institution: "", year: "" }]);
  const removeEducation = (id: string) => setEducation(education.filter((edu) => edu.id !== id));
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  const addProject = () => setProjects([...projects, { id: generateId(), name: "", link: "", description: "" }]);
  const removeProject = (id: string) => setProjects(projects.filter((proj) => proj.id !== id));
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)));
  };

  const addCertification = () => setCertifications([...certifications, { id: generateId(), name: "", issuer: "", year: "" }]);
  const removeCertification = (id: string) => setCertifications(certifications.filter((cert) => cert.id !== id));
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)));
  };

  const addAchievement = () => setAchievements([...achievements, { id: generateId(), title: "", year: "" }]);
  const removeAchievement = (id: string) => setAchievements(achievements.filter((ach) => ach.id !== id));
  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements.map((ach) => (ach.id === id ? { ...ach, [field]: value } : ach)));
  };

  const addLanguage = () => setLanguages([...languages, { id: generateId(), name: "", proficiency: "" }]);
  const removeLanguage = (id: string) => setLanguages(languages.filter((lang) => lang.id !== id));
  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)));
  };

  /* ========================================================================== */
  /*  MULTI-TEMPLATE PDF GENERATOR ENGINE (jsPDF)                               */
  /* ========================================================================== */

  const generatePDF = async () => {
    if (!form.fullName || !form.email || !form.title) {
      setError("Please fill at least Full Name, Email, and Job Title.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - 2 * margin;
      const bottomLimit = pageHeight - margin;
      let y = margin;

      // Color Schemes based on Selected Template
      const COLOR_PALETTES: Record<string, any> = {
        "ats-clean": {
          name: [30, 41, 59],
          title: [71, 85, 105],
          section: [30, 41, 59],
          body: [51, 65, 85],
          meta: [100, 116, 139],
          rule: [203, 213, 225],
        },
        "modern-tech": {
          name: [0, 113, 227],
          title: [51, 65, 85],
          section: [0, 113, 227],
          body: [30, 41, 59],
          meta: [100, 116, 139],
          rule: [0, 113, 227],
        },
        executive: {
          name: [255, 255, 255],
          title: [203, 213, 225],
          section: [15, 23, 42],
          body: [30, 41, 59],
          meta: [100, 116, 139],
          rule: [15, 23, 42],
        },
        minimalist: {
          name: [15, 23, 42],
          title: [100, 116, 139],
          section: [51, 65, 85],
          body: [51, 65, 85],
          meta: [148, 163, 184],
          rule: [226, 232, 240],
        },
        "creative-accent": {
          name: [225, 29, 72],
          title: [71, 85, 105],
          section: [225, 29, 72],
          body: [30, 41, 59],
          meta: [100, 116, 139],
          rule: [225, 29, 72],
        },
      };

      const theme = COLOR_PALETTES[selectedTemplate] || COLOR_PALETTES["ats-clean"];

      // Helper: Page Space Check
      const ensureSpace = (needed: number) => {
        if (y + needed > bottomLimit) {
          doc.addPage();
          y = margin;
        }
      };

      // Helper: Section Heading Generator
      const sectionHeading = (label: string) => {
        ensureSpace(12);
        y += 3;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...theme.section);
        doc.text(label.toUpperCase(), margin, y);
        y += 1.8;

        doc.setDrawColor(...theme.rule);
        doc.setLineWidth(selectedTemplate === "modern-tech" ? 0.6 : 0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4.5;
      };

      // Helper: Labeled Line
      const labeledLine = (label: string, value: string, size = 9.5) => {
        if (!value || !value.trim()) return;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(size);
        const labelText = label + " ";
        const labelWidth = doc.getTextWidth(labelText);
        const availWidth = contentWidth - labelWidth;

        doc.setFont("Helvetica", "normal");
        const lines = doc.splitTextToSize(value, availWidth);
        lines.forEach((line: string, idx: number) => {
          ensureSpace(5);
          if (idx === 0) {
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(size);
            doc.setTextColor(...theme.section);
            doc.text(labelText, margin, y);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(...theme.body);
            doc.text(line, margin + labelWidth, y);
          } else {
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(...theme.body);
            doc.text(line, margin, y);
          }
          y += 4.5;
        });
      };

      // Helper: Body Paragraph Text
      const bodyText = (text: string, x: number, width: number, size = 9.5) => {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(size);
        doc.setTextColor(...theme.body);
        const lines = doc.splitTextToSize(text, width);
        lines.forEach((line: string) => {
          ensureSpace(5);
          doc.text(line, x, y);
          y += 4.5;
        });
      };

      // Helper: Bullet Lines
      const bulletLines = (text: string, x: number, width: number) => {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...theme.body);
        const lines = doc.splitTextToSize(text, width);
        lines.forEach((line: string, idx: number) => {
          ensureSpace(5);
          doc.text((idx === 0 ? "• " : "  ") + line, x, y);
          y += 4.5;
        });
      };

      // ================= EXECUTIVE HEADER BANNER (IF EXECUTIVE TEMPLATE) =================
      if (selectedTemplate === "executive") {
        doc.setFillColor(15, 23, 42); // Dark Header Block
        doc.rect(0, 0, pageWidth, 38, "F");

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text(form.fullName, pageWidth / 2, 14, { align: "center" });

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(203, 213, 225);
        doc.text(form.title, pageWidth / 2, 22, { align: "center" });

        const contactParts: string[] = [];
        if (form.email) contactParts.push(form.email);
        if (form.phone) contactParts.push(form.phone);
        if (form.location) contactParts.push(form.location);
        const contactLine = contactParts.join("   |   ");

        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(contactLine, pageWidth / 2, 30, { align: "center" });

        y = 44;
      } else {
        // ================= STANDARD CLEAN HEADER =================
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(...theme.name);
        doc.text(form.fullName, pageWidth / 2, y, { align: "center" });
        y += 7;

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(...theme.title);
        doc.text(form.title, pageWidth / 2, y, { align: "center" });
        y += 5.5;

        const contactParts: string[] = [];
        if (form.email) contactParts.push(form.email);
        if (form.phone) contactParts.push(form.phone);
        if (form.location) contactParts.push(form.location);
        if (form.linkedin) contactParts.push(form.linkedin);
        if (form.website) contactParts.push(form.website);

        const contactLine = contactParts.join("   |   ");
        if (contactLine) {
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...theme.meta);
          const contactLines = doc.splitTextToSize(contactLine, contentWidth);
          contactLines.forEach((line: string) => {
            doc.text(line, pageWidth / 2, y, { align: "center" });
            y += 4.3;
          });
        }

        y += 2;
        doc.setDrawColor(...theme.rule);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 7;
      }

      // ================= SUMMARY =================
      if (form.summary.trim()) {
        sectionHeading("Professional Summary");
        bodyText(form.summary.trim(), margin, contentWidth, 9.5);
        y += 2;
      }

      // ================= SKILLS =================
      if (form.skills.trim()) {
        sectionHeading("Technical Skills");
        const skillsArray = form.skills.split(",").map((s) => s.trim()).filter((s) => s);
        labeledLine("Skills:", skillsArray.join(" • "), 9.5);
        y += 2;
      }

      // ================= WORK EXPERIENCE =================
      const validExperience = experience.filter((exp) => exp.company || exp.role);
      if (validExperience.length > 0) {
        sectionHeading("Work Experience");

        for (const exp of validExperience) {
          ensureSpace(10);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...theme.section);
          doc.text(exp.company || "", margin, y);

          if (exp.start || exp.end) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...theme.meta);
            const dates = `${exp.start || "N/A"} - ${exp.end || "Present"}`;
            doc.text(dates, pageWidth - margin, y, { align: "right" });
          }
          y += 4.8;

          if (exp.role) {
            doc.setFont("Helvetica", "bolditalic");
            doc.setFontSize(9.5);
            doc.setTextColor(...theme.body);
            doc.text(exp.role, margin, y);
            y += 4.8;
          }

          if (exp.description.trim()) {
            const descBullets = exp.description
              .split("\n")
              .map((l) => l.replace(/^[-•\s]+/, "").trim())
              .filter((l) => l);
            descBullets.forEach((line) => bulletLines(line, margin + 2, contentWidth - 4));
          }
          y += 2.5;
        }
      }

      // ================= EDUCATION =================
      const validEducation = education.filter((edu) => edu.degree || edu.institution);
      if (validEducation.length > 0) {
        sectionHeading("Education");

        for (const edu of validEducation) {
          ensureSpace(9);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...theme.section);
          doc.text(edu.degree, margin, y);

          if (edu.year) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...theme.meta);
            doc.text(edu.year, pageWidth - margin, y, { align: "right" });
          }
          y += 4.8;

          if (edu.institution) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(...theme.body);
            doc.text(edu.institution, margin, y);
            y += 4.8;
          }
          y += 2;
        }
      }

      // ================= PROJECTS =================
      const validProjects = projects.filter((proj) => proj.name);
      if (validProjects.length > 0) {
        sectionHeading("Key Projects");

        for (const proj of validProjects) {
          ensureSpace(9);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...theme.section);
          doc.text(proj.name, margin, y);

          if (proj.link) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...theme.meta);
            doc.text(proj.link, pageWidth - margin, y, { align: "right" });
          }
          y += 4.8;

          if (proj.description.trim()) {
            const projBullets = proj.description
              .split("\n")
              .map((l) => l.replace(/^[-•\s]+/, "").trim())
              .filter((l) => l);
            projBullets.forEach((line) => bulletLines(line, margin + 2, contentWidth - 4));
          }
          y += 2.5;
        }
      }

      // Save PDF file
      doc.save(`${form.fullName.replace(/\s+/g, "_")}_${selectedTemplate.toUpperCase()}_Resume.pdf`);
    } catch (err: any) {
      setError("Failed to generate PDF. Please check form fields.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ========================================================================== */
  /*  RENDER COMPONENT                                                          */
  /* ========================================================================== */

  return (
    <AuthGate>
      <ProGate>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
          {/* Top Navbar */}
          <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">🛠️</span>
                <span className="text-xl font-bold tracking-tight">ToolBox</span>
                <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] font-bold px-2.5 py-0.5 rounded-full border border-[#0071e3]/20">
                  Pro Engine
                </span>
              </a>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoadSampleData}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
                >
                  ✨ Load Sample Data
                </button>
                <button
                  onClick={handleClearForm}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                >
                  Clear Form
                </button>
                <a href="/" className="text-xs font-semibold text-slate-500 hover:text-[#0071e3] transition">
                  ← Back Home
                </a>
              </div>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                📝 Advanced Multi-Template Resume Builder
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Select from 5 ATS-compliant professional templates. Fill details or load sample data to generate instant PDFs.
              </p>
            </div>

            {/* ── TEMPLATE SELECTOR PICKER ───────────────────────────────────── */}
            <div className="mb-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                Step 1: Choose Your Preferred Resume Template
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {RESUME_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-white dark:bg-slate-900 border-[#0071e3] shadow-lg shadow-blue-500/15 ring-2 ring-[#0071e3]/30 scale-[1.02]"
                          : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                            {tmpl.badge}
                          </span>
                          {isSelected && <span className="text-[#0071e3] text-xs font-bold">✓ Active</span>}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tmpl.name}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{tmpl.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
                        <div className="w-full h-1.5 rounded-full" style={{ background: tmpl.primaryColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── EDIT / LIVE PREVIEW TAB CONTROLS ───────────────────────────── */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === "edit" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
                  }`}
                >
                  📝 Edit Resume Form
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === "preview" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
                  }`}
                >
                  👁️ Live Sheet Preview
                </button>
              </div>

              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-slate-400 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition flex items-center gap-2"
              >
                <span>⚡</span> {isGenerating ? "Building PDF..." : `Generate ${RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.name} PDF`}
              </button>
            </div>

            {/* ── FORM OR PREVIEW CONTENT ────────────────────────────────────── */}
            {activeTab === "edit" ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    👤 Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="Lakhan Kashyap" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Job Title *</label>
                      <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="Senior Full Stack Engineer" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="lakhan@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Phone</label>
                      <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Location</label>
                      <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="Mumbai, India" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">LinkedIn Profile</label>
                      <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="linkedin.com/in/lakhankashyap" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Portfolio / Website</label>
                      <input type="text" name="website" value={form.website} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="lakhankashyap.dev" />
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    📋 Professional Summary
                  </h2>
                  <textarea name="summary" value={form.summary} onChange={handleChange} rows={4} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium leading-relaxed" placeholder="Experienced engineer with 5+ years building full-stack web applications..." />
                </div>

                {/* Skills */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    🛠️ Technical Skills
                  </h2>
                  <input type="text" name="skills" value={form.skills} onChange={handleChange} className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium" placeholder="React, Next.js, Node.js, TypeScript, Tailwind CSS, SQL" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Separate skills with commas. They render cleanly formatted on the resume.</p>
                </div>

                {/* Work Experience */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      💼 Work Experience
                    </h2>
                    <button onClick={addExperience} className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add Position</button>
                  </div>
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">Position {index + 1}</h3>
                        {experience.length > 1 && <button onClick={() => removeExperience(exp.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="block text-[11px] font-bold mb-1">Company</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="TechCorp" /></div>
                        <div><label className="block text-[11px] font-bold mb-1">Role Title</label><input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="Software Engineer" /></div>
                        <div><label className="block text-[11px] font-bold mb-1">Start Date</label><input type="text" value={exp.start} onChange={(e) => updateExperience(exp.id, "start", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="Jan 2022" /></div>
                        <div><label className="block text-[11px] font-bold mb-1">End Date</label><input type="text" value={exp.end} onChange={(e) => updateExperience(exp.id, "end", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="Present" /></div>
                        <div className="sm:col-span-2"><label className="block text-[11px] font-bold mb-1">Bullet Point Accomplishments (One per line)</label><textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs leading-relaxed" placeholder={"Architected high-throughput frontend serving 500k users\nReduced API latency by 45% using Redis caching"} /></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">🎓 Education</h2>
                    <button onClick={addEducation} className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add Education</button>
                  </div>
                  {education.map((edu, index) => (
                    <div key={edu.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">Degree {index + 1}</h3>
                        {education.length > 1 && <button onClick={() => removeEducation(edu.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div><label className="block text-[11px] font-bold mb-1">Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="B.Tech CSE" /></div>
                        <div><label className="block text-[11px] font-bold mb-1">Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="IIT Delhi" /></div>
                        <div><label className="block text-[11px] font-bold mb-1">Year</label><input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="2017 - 2021" /></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">🚀 Key Projects</h2>
                    <button onClick={addProject} className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">+ Add Project</button>
                  </div>
                  {projects.map((proj, index) => (
                    <div key={proj.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">Project {index + 1}</h3>
                        {projects.length > 1 && <button onClick={() => removeProject(proj.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="block text-[11px] font-bold mb-1">Project Name</label><input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="ToolBox Utility Platform" /></div>
                        <div><label className="block text-[11px] font-bold mb-1">Link</label><input type="text" value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs" placeholder="toolbox.app" /></div>
                        <div className="sm:col-span-2"><label className="block text-[11px] font-bold mb-1">Description</label><textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs leading-relaxed" placeholder="All-in-one browser utility platform built using React and Next.js" /></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-xs font-semibold">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold transition text-sm shadow-xl shadow-blue-500/25"
                >
                  {isGenerating ? "Building PDF Document..." : "Generate & Download Professional Resume PDF"}
                </button>
              </div>
            ) : (
              /* ── LIVE SHEET PREVIEW TAB ────────────────────────────────────── */
              <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 max-w-3xl mx-auto min-h-[700px] font-sans">
                {/* Executive Top Banner Style preview */}
                {selectedTemplate === "executive" && (
                  <div className="bg-slate-900 text-white -mx-8 -mt-8 p-6 mb-6 text-center">
                    <h1 className="text-2xl font-black">{form.fullName || "Your Full Name"}</h1>
                    <div className="text-xs font-semibold text-slate-300 mt-1">{form.title || "Your Target Job Title"}</div>
                    <div className="text-[10px] text-slate-400 mt-2">
                      {[form.email, form.phone, form.location].filter(Boolean).join("   |   ")}
                    </div>
                  </div>
                )}

                {selectedTemplate !== "executive" && (
                  <div className="text-center pb-4 border-b mb-6">
                    <h1 className="text-2xl font-black" style={{ color: RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.primaryColor }}>
                      {form.fullName || "Your Full Name"}
                    </h1>
                    <div className="text-xs font-bold text-slate-600 mt-1">{form.title || "Your Target Job Title"}</div>
                    <div className="text-[10px] text-slate-400 mt-2">
                      {[form.email, form.phone, form.location, form.linkedin].filter(Boolean).join("   |   ")}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {form.summary && (
                  <div className="mb-6">
                    <div className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.primaryColor }}>
                      Professional Summary
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{form.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experience.some((e) => e.company) && (
                  <div className="mb-6">
                    <div className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.primaryColor }}>
                      Work Experience
                    </div>
                    {experience.map((exp, idx) => (
                      <div key={idx} className="mb-4 text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.company}</span>
                          <span className="text-slate-400 font-normal text-[10px]">{exp.start} - {exp.end}</span>
                        </div>
                        <div className="italic text-slate-600 font-semibold mb-1">{exp.role}</div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {form.skills && (
                  <div className="mb-6">
                    <div className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.primaryColor }}>
                      Technical Skills
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{form.skills}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ProGate>
    </AuthGate>
  );
}