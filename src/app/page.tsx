"use client";

import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const tools = [
  {
    id: 1,
    name: "PDF Editor",
    icon: "📄",
    gradient: "from-rose-400 to-orange-400",
    badge: "Popular",
    price: "₹0 / Free",
    proPrice: "₹29 Pro",
    desc: "Merge, split, compress, and convert PDFs instantly.",
    features: ["Merge PDF", "Split PDF", "Compress PDF", "Image to PDF"],
    path: "/pdf-tools",
  },
  {
    id: 2,
    name: "Resume Maker",
    icon: "📝",
    gradient: "from-blue-400 to-indigo-400",
    badge: "New",
    price: "₹29 Pro",
    proPrice: "₹29 One-time",
    desc: "Create ATS-friendly resumes with beautiful templates.",
    features: ["3 Templates", "Live Preview", "Download as PDF", "No Watermark"],
    path: "/resume-maker", // 👈 Added active link
  },
  {
    id: 3,
    name: "Image Compressor",
    icon: "🖼️",
    gradient: "from-emerald-400 to-teal-400",
    badge: "Fast",
    price: "₹0 / Free",
    proPrice: "Unlimited",
    desc: "Reduce image size without losing quality.",
    features: ["Compress up to 80%", "Batch Processing", "High Quality", "No Upload Limit"],
    path: "/image-compressor",
  },
  {
    id: 4,
    name: "Chatbot Help",
    icon: "💬",
    gradient: "from-purple-400 to-pink-400",
    badge: "AI",
    price: "Coming Soon",
    proPrice: "Free in Pro",
    desc: "Instant answers to all your tool-related queries.",
    features: ["24/7 Support", "Smart Suggestions", "Quick Replies"],
    path: "/chatbot", // 👈 Added active link
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Freelance Designer",
    text: "This toolbox saved me hours every week. Image compressor is lightning fast!",
    avatar: "👨‍💻",
  },
  {
    name: "Priya Patel",
    role: "HR Manager",
    text: "Resume maker is super easy. I recommend it to all candidates.",
    avatar: "👩‍💼",
  },
  {
    name: "Amit Kumar",
    role: "Student",
    text: "PDF merge for college projects? Best free tool ever. No signup needed!",
    avatar: "👨‍🎓",
  },
];

const faqs = [
  {
    q: "Is this tool really free?",
    a: "Yes! Most basic features are free forever. Pro plan is only ₹29 for advanced tools and unlimited access.",
  },
  {
    q: "Do I need to create an account?",
    a: "No, you can use tools directly without any login. Your files are processed securely and deleted after download.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We don't store your files. All processing happens on your device or temporary server with auto-delete.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, Paytm, Google Pay, PhonePe, and all major debit/credit cards via Razorpay.",
  },
];

export default function Home() {
  return (
    <div
      className={`${inter.variable} font-sans min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-white antialiased`}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <span className="text-[17px] font-semibold tracking-tight">ToolBox</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#1d1d1f]/80 dark:text-white/80">
              <a href="#tools" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Tools</a>
              <a href="#features" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">FAQ</a>
              <button className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-medium transition-colors">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#f5f5f7] dark:bg-white/10 px-4 py-1.5 rounded-full text-[13px] font-medium mb-8 text-[#1d1d1f]/70 dark:text-white/70">
            <span className="w-1.5 h-1.5 bg-[#30d158] rounded-full" />
            Trusted by 2,000+ users in India
          </div>
          <h1 className="text-[44px] sm:text-[68px] font-semibold tracking-tight leading-[1.05] mb-6">
            All your daily tools.
            <br />
            <span className="text-[#0071e3]">In one place.</span>
          </h1>
          <p className="text-[19px] sm:text-[21px] text-[#6e6e73] dark:text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Edit PDFs, create resumes, compress images, and get instant help —
            all with a beautifully simple interface. No signup required, just start using.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#tools"
              className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-7 py-3 rounded-full font-medium transition-colors text-[15px]"
            >
              Explore Tools
            </a>
            <a
              href="#pricing"
              className="bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white px-7 py-3 rounded-full font-medium transition-colors text-[15px]"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          {[
            { value: "2K+", label: "Active Users" },
            { value: "1.5K+", label: "Files Processed" },
            { value: "4.5/5", label: "Average Rating" },
            { value: "No Signup", label: "Required" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#f5f5f7] dark:bg-white/5 rounded-2xl p-5 sm:p-7"
            >
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">{stat.value}</div>
              <div className="text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4">Why choose ToolBox?</h2>
        <p className="text-center text-[17px] text-[#6e6e73] dark:text-white/60 mb-14 max-w-2xl mx-auto">
          We focus on speed, privacy, and simplicity. No clutter, no ads, just tools that work.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Process files in seconds, right in your browser." },
            { icon: "🔒", title: "100% Secure", desc: "Your files are never stored. Auto-delete after processing." },
            { icon: "💸", title: "Affordable Pro", desc: "Unlock all tools for just ₹29 — one-time, no subscription." },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#f5f5f7] dark:bg-white/5 rounded-3xl p-8 hover:bg-[#eeeef0] dark:hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-2xl mb-5 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-[19px] font-semibold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-[#6e6e73] dark:text-white/60 text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4">Available tools</h2>
        <p className="text-center text-[17px] text-[#6e6e73] dark:text-white/60 mb-14 max-w-2xl mx-auto">
          Pick a tool and get started instantly — no login, no hassle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white dark:bg-[#1d1d1f] rounded-3xl border border-black/5 dark:border-white/10 p-6 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-none transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-5`}>
                {tool.icon}
              </div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="text-[18px] font-semibold tracking-tight">{tool.name}</h3>
                <span className="text-[11px] bg-[#0071e3]/10 text-[#0071e3] dark:bg-white/10 dark:text-white px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  {tool.badge}
                </span>
              </div>
              <p className="text-[#6e6e73] dark:text-white/60 text-[14px] mb-4 leading-relaxed">{tool.desc}</p>
              <ul className="space-y-1.5 mb-4 flex-grow">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="text-[13px] text-[#6e6e73] dark:text-white/50 flex items-center gap-2">
                    <span className="text-[#30d158]">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/10">
                <span className="text-[13px] font-medium text-[#6e6e73] dark:text-white/50">{tool.price}</span>
                {tool.path ? (
                  <Link
                    href={tool.path}
                    className="text-[13px] font-semibold text-[#0071e3] hover:underline transition"
                  >
                    Use Tool →
                  </Link>
                ) : (
                  <button
                    onClick={() => alert(`${tool.name} will be live soon!`)}
                    className="text-[13px] font-semibold text-[#0071e3] hover:underline transition"
                  >
                    Use Tool →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#f5f5f7] dark:bg-white/5 py-20 mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4">How it works</h2>
          <p className="text-center text-[17px] text-[#6e6e73] dark:text-white/60 mb-14 max-w-2xl mx-auto">
            Three simple steps to get your work done.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Choose a Tool", desc: "Select the tool you need from the list above." },
              { step: "2", title: "Upload & Process", desc: "Upload your file or fill in details. Our tool does the rest." },
              { step: "3", title: "Download & Go", desc: "Get your processed file instantly. No waiting, no login." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#0071e3] text-white rounded-full flex items-center justify-center text-lg font-semibold mb-5">
                  {s.step}
                </div>
                <h3 className="text-[18px] font-semibold mb-2 tracking-tight">{s.title}</h3>
                <p className="text-[#6e6e73] dark:text-white/60 text-[15px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4">What users say</h2>
        <p className="text-center text-[17px] text-[#6e6e73] dark:text-white/60 mb-14">Loved by students, professionals, and creators.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#f5f5f7] dark:bg-white/5 rounded-3xl p-7 hover:bg-[#eeeef0] dark:hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-4">{t.avatar}</div>
              <p className="text-[#1d1d1f] dark:text-white/80 text-[15px] leading-relaxed mb-5">"{t.text}"</p>
              <div className="font-semibold text-[14px] tracking-tight">{t.name}</div>
              <div className="text-[13px] text-[#6e6e73] dark:text-white/50">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#f5f5f7] dark:bg-white/5 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-4">Simple, honest pricing</h2>
          <p className="text-[17px] text-[#6e6e73] dark:text-white/60 mb-14">Free forever. Upgrade only when you need more.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white dark:bg-[#1d1d1f] border border-black/5 dark:border-white/10 rounded-3xl p-8 w-full sm:w-72 text-left">
              <h3 className="text-[15px] font-semibold mb-2 text-[#6e6e73] dark:text-white/60">Free</h3>
              <p className="text-4xl font-semibold tracking-tight mb-5">₹0</p>
              <ul className="space-y-2.5 text-[14px] text-[#1d1d1f]/80 dark:text-white/70 mb-7">
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> PDF Merge & Split</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Image Compressor (5/day)</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Basic Resume Template</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> No Ads, No Signup</li>
              </ul>
              <button className="w-full bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-white py-3 rounded-full font-medium hover:bg-[#e8e8ed] dark:hover:bg-white/20 transition-colors">
                Start Free
              </button>
            </div>
            <div className="bg-[#0071e3] rounded-3xl p-8 w-full sm:w-72 text-left relative text-white">
              <span className="absolute top-6 right-6 bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-full font-medium">POPULAR</span>
              <h3 className="text-[15px] font-semibold mb-2 text-white/80">Pro</h3>
              <p className="text-4xl font-semibold tracking-tight mb-1">₹29</p>
              <p className="text-[13px] text-white/70 mb-5">one-time payment</p>
              <ul className="space-y-2.5 text-[14px] text-white/90 mb-7">
                <li className="flex items-center gap-2"><span>✓</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span>✓</span> Unlimited Image Compression</li>
                <li className="flex items-center gap-2"><span>✓</span> 3+ Resume Templates</li>
                <li className="flex items-center gap-2"><span>✓</span> PDF Compress & Convert</li>
                <li className="flex items-center gap-2"><span>✓</span> Priority Support</li>
              </ul>
              <button className="w-full bg-white text-[#0071e3] py-3 rounded-full font-semibold hover:bg-white/90 transition-colors">
                Get Pro for ₹29
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#f5f5f7] dark:bg-white/5 rounded-2xl p-5 sm:p-6">
              <summary className="flex justify-between items-center gap-4 cursor-pointer font-medium text-[15px] tracking-tight list-none">
                {faq.q}
                <span className="text-[#6e6e73] dark:text-white/50 shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-[#6e6e73] dark:text-white/60 text-[14px] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded-[32px] sm:rounded-[40px] py-16 px-6 text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-4">Ready to simplify your daily tasks?</h2>
          <p className="text-[17px] opacity-90 mb-8">Join thousands of happy users. No signup required.</p>
          <a
            href="#tools"
            className="inline-block bg-white text-[#0071e3] px-8 py-3.5 rounded-full font-semibold text-[15px] hover:bg-white/90 transition-colors"
          >
            Start Using Free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-3 pb-10 mb-10 border-b border-black/5 dark:border-white/10">
            <span className="text-[11px] uppercase tracking-widest text-[#6e6e73] dark:text-white/40 font-medium">
              Crafted by
            </span>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center text-white font-semibold text-lg shadow-md ring-4 ring-[#f5f5f7] dark:ring-white/10">
              LK
            </div>
            <div>
              <div className="font-semibold text-[15px] tracking-tight">Lakhan Kashyap</div>
              <div className="text-[13px] text-[#6e6e73] dark:text-white/50">Founder & Developer</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛠️</span>
              <span className="font-semibold text-[15px] tracking-tight">ToolBox</span>
            </div>
            <div className="text-[13px] text-[#6e6e73] dark:text-white/50">
              © {new Date().getFullYear()} ToolBox. All rights reserved.
            </div>
            <div className="flex gap-5 text-[13px] text-[#6e6e73] dark:text-white/50">
              <a href="#" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
