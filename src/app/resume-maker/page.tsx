// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import ProGate from "../../components/ProGate";

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

export default function ResumeMakerPage() {
  const [form, setForm] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
    skills: "",
    interests: "",
  });

  const [experience, setExperience] = useState<Experience[]>([
    { id: generateId(), company: "", role: "", start: "", end: "", description: "" },
  ]);
  const [education, setEducation] = useState<Education[]>([
    { id: generateId(), degree: "", institution: "", year: "" },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: generateId(), name: "", link: "", description: "" },
  ]);
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: generateId(), name: "", issuer: "", year: "" },
  ]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: generateId(), title: "", year: "" },
  ]);
  const [languages, setLanguages] = useState<Language[]>([
    { id: generateId(), name: "", proficiency: "" },
  ]);
  const [references, setReferences] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Dynamic add/remove/update functions for each array
  const addExperience = () => {
    setExperience([...experience, { id: generateId(), company: "", role: "", start: "", end: "", description: "" }]);
  };
  const removeExperience = (id: string) => setExperience(experience.filter(exp => exp.id !== id));
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addEducation = () => setEducation([...education, { id: generateId(), degree: "", institution: "", year: "" }]);
  const removeEducation = (id: string) => setEducation(education.filter(edu => edu.id !== id));
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const addProject = () => setProjects([...projects, { id: generateId(), name: "", link: "", description: "" }]);
  const removeProject = (id: string) => setProjects(projects.filter(proj => proj.id !== id));
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const addCertification = () => setCertifications([...certifications, { id: generateId(), name: "", issuer: "", year: "" }]);
  const removeCertification = (id: string) => setCertifications(certifications.filter(cert => cert.id !== id));
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
  };

  const addAchievement = () => setAchievements([...achievements, { id: generateId(), title: "", year: "" }]);
  const removeAchievement = (id: string) => setAchievements(achievements.filter(ach => ach.id !== id));
  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements.map(ach => ach.id === id ? { ...ach, [field]: value } : ach));
  };

  const addLanguage = () => setLanguages([...languages, { id: generateId(), name: "", proficiency: "" }]);
  const removeLanguage = (id: string) => setLanguages(languages.filter(lang => lang.id !== id));
  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map(lang => lang.id === id ? { ...lang, [field]: value } : lang));
  };

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
      const margin = 18;
      const contentWidth = pageWidth - 2 * margin;
      const bottomLimit = pageHeight - margin;
      let y = margin;

      // ---------- ATS-safe palette: near-black text only, no colored links ----------
      const COLOR_HEADING = [0, 0, 0];
      const COLOR_SUBHEADING = [30, 30, 30];
      const COLOR_BODY = [45, 45, 45];
      const COLOR_META = [90, 90, 90];
      const COLOR_RULE = [0, 0, 0];

      // ---------- helpers ----------
      const ensureSpace = (needed: number) => {
        if (y + needed > bottomLimit) {
          doc.addPage();
          y = margin;
        }
      };

      const sectionHeading = (label: string) => {
        ensureSpace(12);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...COLOR_HEADING);
        doc.text(label.toUpperCase(), margin, y);
        y += 1.5;
        doc.setDrawColor(...COLOR_RULE);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
      };

      const bodyText = (text: string, x: number, width: number, size = 9.5) => {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(size);
        doc.setTextColor(...COLOR_BODY);
        const lines = doc.splitTextToSize(text, width);
        lines.forEach((line: string) => {
          ensureSpace(5);
          doc.text(line, x, y);
          y += 4.5;
        });
      };

      const bulletLines = (text: string, x: number, width: number) => {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR_BODY);
        const lines = doc.splitTextToSize(text, width);
        lines.forEach((line: string) => {
          ensureSpace(5);
          doc.text("- " + line, x, y);
          y += 4.5;
        });
      };

      // ================= HEADER =================
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...COLOR_HEADING);
      doc.text(form.fullName, margin, y);
      y += 7;

      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(...COLOR_SUBHEADING);
      doc.text(form.title, margin, y);
      y += 5.5;

      const contactParts: string[] = [];
      if (form.email) contactParts.push(form.email);
      if (form.phone) contactParts.push(form.phone);
      if (form.location) contactParts.push(form.location);
      if (form.linkedin) contactParts.push(form.linkedin);
      if (form.website) contactParts.push(form.website);
      const contactLine = contactParts.join("   |   ");
      if (contactLine) {
        doc.setFontSize(9);
        doc.setTextColor(...COLOR_META);
        const contactLines = doc.splitTextToSize(contactLine, contentWidth);
        contactLines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 4.2;
        });
      }

      y += 2;
      doc.setDrawColor(...COLOR_RULE);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;

      // ================= SUMMARY =================
      if (form.summary.trim()) {
        sectionHeading("Professional Summary");
        bodyText(form.summary.trim(), margin, contentWidth, 10);
        y += 3;
      }

      // ================= SKILLS =================
      if (form.skills.trim()) {
        sectionHeading("Skills");
        const skillsArray = form.skills.split(",").map(s => s.trim()).filter(s => s);
        bodyText(skillsArray.join("   |   "), margin, contentWidth, 10);
        y += 3;
      }

      // ================= EXPERIENCE =================
      const validExperience = experience.filter(exp => exp.company || exp.role);
      if (validExperience.length > 0) {
        sectionHeading("Work Experience");

        for (const exp of validExperience) {
          ensureSpace(9);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...COLOR_HEADING);
          const jobTitle = exp.role || "";
          doc.text(jobTitle, margin, y);

          if (exp.start || exp.end) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...COLOR_META);
            const dates = `${exp.start || "N/A"} - ${exp.end || "Present"}`;
            doc.text(dates, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (exp.company) {
            doc.setFont("Helvetica", "italic");
            doc.setFontSize(10);
            doc.setTextColor(...COLOR_SUBHEADING);
            doc.text(exp.company, margin, y);
            y += 4.5;
          }

          if (exp.description.trim()) {
            const descBullets = exp.description
              .split("\n")
              .map(l => l.replace(/^[-•\s]+/, "").trim())
              .filter(l => l);
            descBullets.forEach(line => bulletLines(line, margin + 4, contentWidth - 4));
          }
          y += 3.5;
        }
        y += 1;
      }

      // ================= EDUCATION =================
      const validEducation = education.filter(edu => edu.degree || edu.institution);
      if (validEducation.length > 0) {
        sectionHeading("Education");

        for (const edu of validEducation) {
          ensureSpace(9);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...COLOR_HEADING);
          doc.text(edu.degree, margin, y);

          if (edu.year) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...COLOR_META);
            doc.text(edu.year, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (edu.institution) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...COLOR_SUBHEADING);
            doc.text(edu.institution, margin, y);
            y += 4.5;
          }
          y += 3;
        }
        y += 1;
      }

      // ================= PROJECTS =================
      const validProjects = projects.filter(proj => proj.name);
      if (validProjects.length > 0) {
        sectionHeading("Projects");

        for (const proj of validProjects) {
          ensureSpace(9);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...COLOR_HEADING);
          doc.text(proj.name, margin, y);

          if (proj.link) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...COLOR_META);
            doc.text(proj.link, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (proj.description.trim()) {
            const projBullets = proj.description
              .split("\n")
              .map(l => l.replace(/^[-•\s]+/, "").trim())
              .filter(l => l);
            projBullets.forEach(line => bulletLines(line, margin + 4, contentWidth - 4));
          }
          y += 3;
        }
        y += 1;
      }

      // ================= CERTIFICATIONS =================
      const validCerts = certifications.filter(cert => cert.name);
      if (validCerts.length > 0) {
        sectionHeading("Certifications");

        for (const cert of validCerts) {
          ensureSpace(9);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(...COLOR_HEADING);
          doc.text(cert.name, margin, y);

          if (cert.year) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...COLOR_META);
            doc.text(cert.year, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (cert.issuer) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...COLOR_SUBHEADING);
            doc.text(cert.issuer, margin, y);
            y += 4.5;
          }
          y += 3;
        }
        y += 1;
      }

      // ================= ACHIEVEMENTS =================
      const validAchievements = achievements.filter(ach => ach.title);
      if (validAchievements.length > 0) {
        sectionHeading("Achievements");

        for (const ach of validAchievements) {
          ensureSpace(5);
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(...COLOR_BODY);
          doc.text("- " + ach.title, margin, y);
          if (ach.year) {
            doc.setFontSize(9);
            doc.setTextColor(...COLOR_META);
            doc.text(ach.year, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;
        }
        y += 1;
      }

      // ================= LANGUAGES =================
      const validLanguages = languages.filter(lang => lang.name);
      if (validLanguages.length > 0) {
        sectionHeading("Languages");
        const languageLine = validLanguages
          .map(lang => lang.name + (lang.proficiency ? ` (${lang.proficiency})` : ""))
          .join("   |   ");
        bodyText(languageLine, margin, contentWidth, 9.5);
        y += 1;
      }

      // ================= INTERESTS =================
      if (form.interests.trim()) {
        sectionHeading("Interests");
        const interestsLine = form.interests.split(",").map(s => s.trim()).filter(s => s).join("   |   ");
        bodyText(interestsLine, margin, contentWidth, 9.5);
        y += 1;
      }

      // ================= REFERENCES =================
      if (references.trim()) {
        sectionHeading("References");
        bodyText(references.trim(), margin, contentWidth, 9.5);
      }

      doc.save(`${form.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err: any) {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProGate>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">📝 Professional Resume Maker</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Create a complete ATS-friendly resume with all sections recruiters look for.
            </p>
          </div>

          {/* Form sections */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">👤 Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Senior Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Mumbai, India" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn</label>
                  <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="linkedin.com/in/johndoe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website / Portfolio</label>
                  <input type="text" name="website" value={form.website} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="johndoe.com" />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📋 Professional Summary</h2>
              <textarea name="summary" value={form.summary} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Experienced software engineer with 5+ years in full-stack development..." />
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🛠️ Skills</h2>
              <input type="text" name="skills" value={form.skills} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Docker" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate skills with commas. They appear on the resume separated by a vertical bar.</p>
            </div>

            {/* Work Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">💼 Work Experience</h2>
                <button onClick={addExperience} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
              </div>
              {experience.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Experience {index + 1}</h3>
                    {experience.length > 1 && <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs mb-1">Company</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Google" /></div>
                    <div><label className="block text-xs mb-1">Role</label><input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Software Engineer" /></div>
                    <div><label className="block text-xs mb-1">Start Date</label><input type="text" value={exp.start} onChange={(e) => updateExperience(exp.id, "start", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Jan 2022" /></div>
                    <div><label className="block text-xs mb-1">End Date</label><input type="text" value={exp.end} onChange={(e) => updateExperience(exp.id, "end", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Present" /></div>
                    <div className="sm:col-span-2"><label className="block text-xs mb-1">Description (one bullet point per line)</label><textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder={"Led team of 5 engineers to ship the checkout redesign\nImproved API response time by 40%"} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">🎓 Education</h2>
                <button onClick={addEducation} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
              </div>
              {education.map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Education {index + 1}</h3>
                    {education.length > 1 && <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><label className="block text-xs mb-1">Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="B.Tech CSE" /></div>
                    <div><label className="block text-xs mb-1">Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="IIT Delhi" /></div>
                    <div><label className="block text-xs mb-1">Year</label><input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="2023" /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">🚀 Projects</h2>
                <button onClick={addProject} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
              </div>
              {projects.map((proj, index) => (
                <div key={proj.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Project {index + 1}</h3>
                    {projects.length > 1 && <button onClick={() => removeProject(proj.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs mb-1">Project Name</label><input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="E-commerce Website" /></div>
                    <div><label className="block text-xs mb-1">Link</label><input type="text" value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="github.com/johndoe/project" /></div>
                    <div className="sm:col-span-2"><label className="block text-xs mb-1">Description (one bullet point per line)</label><textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder={"Built with React, Node.js and PostgreSQL\nIntegrated Razorpay for payments"} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">📜 Certifications</h2>
                <button onClick={addCertification} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
              </div>
              {certifications.map((cert, index) => (
                <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Certification {index + 1}</h3>
                    {certifications.length > 1 && <button onClick={() => removeCertification(cert.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><label className="block text-xs mb-1">Name</label><input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="AWS Certified Developer" /></div>
                    <div><label className="block text-xs mb-1">Issuer</label><input type="text" value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Amazon Web Services" /></div>
                    <div><label className="block text-xs mb-1">Year</label><input type="text" value={cert.year} onChange={(e) => updateCertification(cert.id, "year", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="2024" /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">🏆 Achievements</h2>
                <button onClick={addAchievement} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
              </div>
              {achievements.map((ach, index) => (
                <div key={ach.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Achievement {index + 1}</h3>
                    {achievements.length > 1 && <button onClick={() => removeAchievement(ach.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs mb-1">Title</label><input type="text" value={ach.title} onChange={(e) => updateAchievement(ach.id, "title", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Employee of the Month" /></div>
                    <div><label className="block text-xs mb-1">Year</label><input type="text" value={ach.year} onChange={(e) => updateAchievement(ach.id, "year", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="2023" /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">🗣️ Languages</h2>
                <button onClick={addLanguage} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
              </div>
              {languages.map((lang, index) => (
                <div key={lang.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Language {index + 1}</h3>
                    {languages.length > 1 && <button onClick={() => removeLanguage(lang.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs mb-1">Language</label><input type="text" value={lang.name} onChange={(e) => updateLanguage(lang.id, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Hindi" /></div>
                    <div><label className="block text-xs mb-1">Proficiency</label><input type="text" value={lang.proficiency} onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Native / Fluent" /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💡 Interests</h2>
              <input type="text" name="interests" value={form.interests} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Cricket, Reading, Open Source, Photography" />
            </div>

            {/* References */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📎 References</h2>
              <textarea value={references} onChange={(e) => setReferences(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Available upon request, or list references..." />
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm">{error}</div>}

            <button onClick={generatePDF} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition text-lg">
              {isGenerating ? "Generating..." : "Generate ATS-Friendly Resume PDF"}
            </button>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>ATS Tip:</strong> Use standard section headings, avoid tables and images. Include keywords from job description. Keep formatting simple.
          </div>
        </div>
      </div>
    </ProGate>
  );
}