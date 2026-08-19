// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";

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

// Simple ID generator (safer than crypto.randomUUID in some environments)
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExperience = () => {
    setExperience([...experience, { id: generateId(), company: "", role: "", start: "", end: "", description: "" }]);
  };
  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addEducation = () => {
    setEducation([...education, { id: generateId(), degree: "", institution: "", year: "" }]);
  };
  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const addProject = () => {
    setProjects([...projects, { id: generateId(), name: "", link: "", description: "" }]);
  };
  const removeProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const addCertification = () => {
    setCertifications([...certifications, { id: generateId(), name: "", issuer: "", year: "" }]);
  };
  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
  };

  const generatePDF = async () => {
    if (!form.fullName || !form.email || !form.title) {
      setError("Please fill at least Full Name, Email, and Job Title.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      // ================= HEADER =================
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text(form.fullName, margin, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(form.title, margin, y);
      y += 5;

      // Contact line
      const contactParts = [];
      if (form.email) contactParts.push(form.email);
      if (form.phone) contactParts.push(form.phone);
      if (form.location) contactParts.push(form.location);
      if (form.linkedin) contactParts.push("LinkedIn: " + form.linkedin);
      if (form.website) contactParts.push(form.website);
      const contactLine = contactParts.join("  |  ");
      if (contactLine) {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(contactLine, margin, y);
        y += 5;
      }

      // Divider
      y += 2;
      doc.setDrawColor(0, 0, 0);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // ================= SUMMARY =================
      if (form.summary.trim()) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("PROFESSIONAL SUMMARY", margin, y);
        y += 5;

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const summaryLines = doc.splitTextToSize(form.summary, contentWidth);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 4.5 + 4;
      }

      // ================= SKILLS =================
      if (form.skills.trim()) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("SKILLS", margin, y);
        y += 5;

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const skillsArray = form.skills.split(",").map(s => s.trim()).filter(s => s);
        const skillsLine = skillsArray.join("  •  ");
        const skillsLines = doc.splitTextToSize(skillsLine, contentWidth);
        doc.text(skillsLines, margin, y);
        y += skillsLines.length * 4.5 + 4;
      }

      // ================= EXPERIENCE =================
      const validExperience = experience.filter(exp => exp.company || exp.role);
      if (validExperience.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("WORK EXPERIENCE", margin, y);
        y += 5;

        for (const exp of validExperience) {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const jobTitle = `${exp.role}${exp.company ? " at " + exp.company : ""}`;
          doc.text(jobTitle, margin, y);
          
          if (exp.start || exp.end) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            const dates = `${exp.start || "N/A"} - ${exp.end || "Present"}`;
            doc.text(dates, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (exp.description.trim()) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);
            const descLines = doc.splitTextToSize(exp.description, contentWidth - 5);
            descLines.forEach(line => {
              doc.text("• " + line, margin + 5, y);
              y += 4.5;
            });
          }
          y += 4;
        }
        y += 2;
      }

      // ================= EDUCATION =================
      const validEducation = education.filter(edu => edu.degree || edu.institution);
      if (validEducation.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("EDUCATION", margin, y);
        y += 5;

        for (const edu of validEducation) {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(edu.degree, margin, y);
          
          if (edu.year) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text(edu.year, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (edu.institution) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);
            doc.text(edu.institution, margin + 5, y);
            y += 4.5;
          }
          y += 3;
        }
        y += 2;
      }

      // ================= PROJECTS =================
      const validProjects = projects.filter(proj => proj.name);
      if (validProjects.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("PROJECTS", margin, y);
        y += 5;

        for (const proj of validProjects) {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(proj.name, margin, y);
          
          if (proj.link) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 255);
            doc.text(proj.link, pageWidth - margin, y, { align: "right" }); // removed textWithLink to avoid type issues
          }
          y += 4.5;

          if (proj.description.trim()) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);
            const projLines = doc.splitTextToSize(proj.description, contentWidth - 5);
            projLines.forEach(line => {
              doc.text("• " + line, margin + 5, y);
              y += 4.5;
            });
          }
          y += 3;
        }
        y += 2;
      }

      // ================= CERTIFICATIONS =================
      const validCerts = certifications.filter(cert => cert.name);
      if (validCerts.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("CERTIFICATIONS", margin, y);
        y += 5;

        for (const cert of validCerts) {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(cert.name, margin, y);
          
          if (cert.year) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text(cert.year, pageWidth - margin, y, { align: "right" });
          }
          y += 4.5;

          if (cert.issuer) {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);
            doc.text(cert.issuer, margin + 5, y);
            y += 4.5;
          }
          y += 3;
        }
      }

      doc.save(`${form.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err: any) {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">📝 ATS-Friendly Resume Maker</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Create a professional, ATS-optimized resume. Fill in your details and download as PDF.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Software Engineer" />
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

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
            <textarea name="summary" value={form.summary} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Brief summary about yourself, skills, and career goals..." />
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <input type="text" name="skills" value={form.skills} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="JavaScript, React, Node.js, Python, SQL, AWS, etc." />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate skills with commas. They will appear in a single line separated by bullets.</p>
          </div>

          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Work Experience</h2>
              <button onClick={addExperience} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
            </div>
            {experience.map((exp, index) => (
              <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Experience {index + 1}</h3>
                  {experience.length > 1 && (
                    <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1">Company</label>
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Google" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Role</label>
                    <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Start Date</label>
                    <input type="text" value={exp.start} onChange={(e) => updateExperience(exp.id, "start", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Jan 2022" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">End Date</label>
                    <input type="text" value={exp.end} onChange={(e) => updateExperience(exp.id, "end", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Present" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs mb-1">Description</label>
                    <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="• Led team of 5 engineers..." />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Education</h2>
              <button onClick={addEducation} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
            </div>
            {education.map((edu, index) => (
              <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Education {index + 1}</h3>
                  {education.length > 1 && (
                    <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1">Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="B.Tech CSE" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="IIT Delhi" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Year</label>
                    <input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="2023" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Projects</h2>
              <button onClick={addProject} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
            </div>
            {projects.map((proj, index) => (
              <div key={proj.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Project {index + 1}</h3>
                  {projects.length > 1 && (
                    <button onClick={() => removeProject(proj.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1">Project Name</label>
                    <input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="E-commerce Website" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Link</label>
                    <input type="text" value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="github.com/johndoe/project" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs mb-1">Description</label>
                    <textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Built with React, Node.js..." />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Certifications</h2>
              <button onClick={addCertification} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">+ Add</button>
            </div>
            {certifications.map((cert, index) => (
              <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Certification {index + 1}</h3>
                  {certifications.length > 1 && (
                    <button onClick={() => removeCertification(cert.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1">Name</label>
                    <input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="AWS Certified Developer" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Issuer</label>
                    <input type="text" value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Amazon Web Services" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Year</label>
                    <input type="text" value={cert.year} onChange={(e) => updateCertification(cert.id, "year", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="2024" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm">{error}</div>}

          <button onClick={generatePDF} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition">
            {isGenerating ? "Generating..." : "Generate ATS-Friendly Resume PDF"}
          </button>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Privacy:</strong> All data stays in your browser. Nothing is uploaded. Your resume is generated locally.
        </div>
      </div>
    </div>
  );
}