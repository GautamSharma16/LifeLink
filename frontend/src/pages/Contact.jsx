import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Reveal = ({ children, delay = 0, direction = "up" }) => {
  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },   visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },   visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants[direction]}
    >
      {children}
    </motion.div>
  );
};

const contactCards = [
  {
    title: "Emergency Coordination Desk",
    detail: "+91-11-1234-5678",
    note: "For urgent platform coordination and active emergency support.",
    icon: "📞",
    accent: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&q=80",
  },
  {
    title: "Partnership & Hospital Onboarding",
    detail: "partners@lifelink.org",
    note: "For hospitals, NGOs, blood banks, and institutional partnerships.",
    icon: "🏥",
    accent: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80",
  },
  {
    title: "Volunteer & Community Team",
    detail: "community@lifelink.org",
    note: "For volunteer onboarding, blood camp coordination, and outreach.",
    icon: "🤝",
    accent: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&q=80",
  },
];

const faqs = [
  {
    question: "How quickly does LifeLink respond?",
    answer: "Response speed depends on the request type, city coverage, and available partners, but the platform is designed to reduce coordination delay immediately.",
  },
  {
    question: "Can hospitals or blood banks partner with LifeLink?",
    answer: "Yes. We support onboarding for hospitals, blood banks, emergency teams, and volunteer organizations.",
  },
  {
    question: "Do you support volunteer programs?",
    answer: "Yes. We help communities organize donors, transport volunteers, and structured response support.",
  },
];

const inputClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-rose-500 dark:focus:ring-rose-900/30";

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", type: "General Inquiry", message: "" });

  const handleSubmit = () => {
    if (formData.name && formData.email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F4F0] text-slate-800 dark:bg-[#0D0D0F] dark:text-slate-200 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        .font-display { font-family: 'Instrument Serif', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* ── HERO ── */}
        <section className="mt-6 overflow-hidden rounded-[2.5rem] relative">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1600&q=80" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-rose-900/85 to-pink-900/90" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute right-0 top-0 h-80 w-80 rounded-full bg-pink-500/25 blur-3xl"
          />

          <div className="relative px-8 py-16 md:px-14 md:py-20">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 text-white">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur"
                >
                  Contact LifeLink
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-5xl font-bold leading-tight md:text-7xl"
                >
                  Talk to the<br /><span className="italic text-rose-300">right team.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-lg text-base leading-7 text-white/80"
                >
                  Whether you need onboarding help, community support, or want to discuss emergency coordination, reach the right people without guesswork.
                </motion.p>
              </div>

              {/* Right: image collage */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                {[
                  "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400&q=80",
                  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80",
                  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
                  "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80",
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="h-28 overflow-hidden rounded-2xl"
                  >
                    <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT CARDS ── */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {contactCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -8 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                transition={{ type: "spring", stiffness: 300 }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-40 overflow-hidden relative">
                  <motion.img
                    animate={{ scale: hovered === i ? 1.1 : 1 }}
                    transition={{ duration: 0.5 }}
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-50 mix-blend-multiply`} />
                  <div className="absolute top-4 left-4 text-3xl">{card.icon}</div>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-bold">{card.title}</h2>
                  <p className={`mt-2 font-semibold text-sm bg-gradient-to-r ${card.accent} bg-clip-text text-transparent`}>{card.detail}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{card.note}</p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </section>

        {/* ── FORM + SIDEBAR ── */}
        <section className="mt-10 grid gap-8 md:grid-cols-[1fr_0.95fr]">
          <Reveal direction="left">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Send a message</span>
              <h2 className="font-display mt-3 text-3xl font-bold">Tell us what you need</h2>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 flex flex-col items-center justify-center rounded-3xl bg-emerald-50 py-14 text-center dark:bg-emerald-950/30"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white"
                    >
                      ✓
                    </motion.div>
                    <h3 className="mt-5 text-2xl font-bold text-emerald-700 dark:text-emerald-400">Message Sent!</h3>
                    <p className="mt-2 text-sm text-slate-500">Our team will get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="relative">
                        <input
                          className={inputClass}
                          placeholder="Full name"
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Email address"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    />
                    <select
                      className={inputClass}
                      value={formData.type}
                      onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                    >
                      <option>General Inquiry</option>
                      <option>Emergency Help</option>
                      <option>Hospital Partnership</option>
                      <option>Volunteer Program</option>
                    </select>
                    <textarea
                      rows={5}
                      className={inputClass}
                      placeholder="Describe your request..."
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    />
                    <motion.button
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 font-bold text-white shadow-lg"
                    >
                      <motion.span
                        className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100"
                        whileHover={{ opacity: 1 }}
                      />
                      Send Inquiry →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="flex flex-col gap-6 h-full">
              {/* Availability */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Availability</span>
                <div className="mt-5 space-y-3">
                  {[
                    { title: "Emergency support", desc: "24/7 coordination for active emergency use cases.", icon: "🔴", avail: "Always on" },
                    { title: "Partnership desk", desc: "Mon–Sat, 9:00 AM to 7:00 PM", icon: "🟡", avail: "Weekdays" },
                    { title: "Volunteer support", desc: "Daily onboarding and community guidance windows.", icon: "🟢", avail: "Daily" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold dark:bg-slate-700">{item.avail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Photo strip */}
              <div className="grid grid-cols-2 gap-3 h-36">
                {["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
                  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&q=80"].map((src, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.04 }} className="overflow-hidden rounded-3xl">
                    <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  </motion.div>
                ))}
              </div>

              {/* FAQs */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">FAQ</span>
                <h2 className="font-display mt-2 text-2xl font-bold">Frequently asked</h2>
                <div className="mt-5 space-y-3">
                  {faqs.map((faq, i) => (
                    <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between p-4 text-left"
                      >
                        <span className="text-sm font-semibold">{faq.question}</span>
                        <motion.span
                          animate={{ rotate: openFaq === i ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 shrink-0 text-rose-500 font-bold"
                        >
                          +
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-xs leading-6 text-slate-500 dark:text-slate-400">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="h-16" />
      </div>
    </div>
  );
}