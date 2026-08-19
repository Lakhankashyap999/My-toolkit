"use client";

import Link from "next/link";

const tools = [
  {
    id: 1,
    name: "PDF Editor",
    icon: "📄",
    gradient: "from-rose-500 to-orange-500",
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
    gradient: "from-blue-500 to-indigo-500",
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
    gradient: "from-green-500 to-emerald-500",
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
    gradient: "from-purple-500 to-pink-500",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ToolBox
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#tools" className="hover:text-blue-600 transition">Tools</a>
              <a href="#features" className="hover:text-blue-600 transition">Features</a>
              <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
              <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-gray-900 dark:via-transparent dark:to-gray-900 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Trusted by 10,000+ users in India
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            All Your Daily Tools
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In One Place
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Edit PDFs, create resumes, compress images, and get instant help —
            all with a beautifully simple interface. No signup required, just start using.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tools" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition text-lg">
              Explore Tools →
            </a>
            <a href="#pricing" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition text-lg">
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50K+", label: "Files Processed" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "100%", label: "Free Tools" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Why Choose ToolBox?</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          We focus on speed, privacy, and simplicity. No clutter, no ads, just tools that work.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Process files in seconds, right in your browser." },
            { icon: "🔒", title: "100% Secure", desc: "Your files are never stored. Auto-delete after processing." },
            { icon: "💸", title: "Affordable Pro", desc: "Unlock all tools for just ₹29 — one-time, no subscription." },
          ].map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Available Tools</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Pick a tool and get started instantly — no login, no hassle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-3xl mb-4 shadow-md`}>
                {tool.icon}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{tool.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                  {tool.badge}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tool.desc}</p>
              <ul className="space-y-1.5 mb-4 flex-grow">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{tool.price}</span>
                {tool.path ? (
                  <Link
                    href={tool.path}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    Use Tool →
                  </Link>
                ) : (
                  <button
                    onClick={() => alert(`${tool.name} will be live soon!`)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
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
      <section className="bg-white dark:bg-gray-800/50 py-16 mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Three simple steps to get your work done.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Choose a Tool", desc: "Select the tool you need from the list above." },
              { step: "2", title: "Upload & Process", desc: "Upload your file or fill in details. Our tool does the rest." },
              { step: "3", title: "Download & Go", desc: "Get your processed file instantly. No waiting, no login." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">What Users Say</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12">Loved by students, professionals, and creators.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
              <div className="text-4xl mb-4">{t.avatar}</div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{t.text}"</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white dark:bg-gray-800/50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple & Honest Pricing</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-12">Free forever. Upgrade only when you need more.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-72 text-left">
              <h3 className="text-lg font-bold mb-2">Free</h3>
              <p className="text-4xl font-extrabold mb-4">₹0</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <li>✓ PDF Merge & Split</li>
                <li>✓ Image Compressor (5/day)</li>
                <li>✓ Basic Resume Template</li>
                <li>✓ No Ads, No Signup</li>
              </ul>
              <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold">
                Start Free
              </button>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600 rounded-2xl p-8 w-72 text-left relative">
              <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">POPULAR</span>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">Pro</h3>
              <p className="text-4xl font-extrabold mb-1">₹29</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">one-time payment</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <li>✓ Everything in Free</li>
                <li>✓ Unlimited Image Compression</li>
                <li>✓ 3+ Resume Templates</li>
                <li>✓ PDF Compress & Convert</li>
                <li>✓ Priority Support</li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                Get Pro for ₹29
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-45 transition">➕</span>
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Simplify Your Daily Tasks?</h2>
          <p className="text-lg opacity-90 mb-8">Join thousands of happy users. No signup required.</p>
          <a href="#tools" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">
            Start Using Free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <span className="font-bold">ToolBox</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} ToolBox. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}