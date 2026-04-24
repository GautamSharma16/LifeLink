import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const Reveal = ({ children, delay = 0, direction = "up" }) => {
  const variants = {
    up:    { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
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
    note: "For urgent platform coordination and active emergency support. Available 24/7.",
    icon: "📞",
    color: "from-red-500 to-pink-600",
    bg: "bg-red-500/5",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
  },
  {
    title: "Partnership & Hospital Onboarding",
    detail: "partners@lifelink.org",
    note: "For hospitals, NGOs, blood banks, and institutional partnerships.",
    icon: "🏥",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/5",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  },
  {
    title: "Volunteer & Community Team",
    detail: "community@lifelink.org",
    note: "For volunteer onboarding, blood camp coordination, and outreach programs.",
    icon: "🤝",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/5",
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80",
  },
];

const faqs = [
  {
    question: "How quickly does LifeLink respond?",
    answer: "Response speed depends on the request type and city coverage, but the platform is designed to reduce coordination delay from hours to minutes.",
  },
  {
    question: "Can hospitals or blood banks partner with LifeLink?",
    answer: "Yes. We actively partner with hospitals, blood banks, emergency teams, and volunteer organizations across India.",
  },
  {
    question: "Do you support volunteer programs?",
    answer: "Yes. We help communities organize donors, transport volunteers, and provide structured response support.",
  },
  {
    question: "Is LifeLink available 24/7?",
    answer: "Our emergency coordination desk operates 24/7. Partnership and general inquiries are responded to within 24 hours.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General Inquiry",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Syne:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        * { font-family: 'Syne', sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #ff6b6b, #ee0979, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }
        .hero-glow { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,38,38,0.25) 0%, transparent 70%); }
        input, select, textarea { transition: all 0.2s ease; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
      `}</style>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1800&h=800&fit=crop"
            alt="Emergency contact center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#080810]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />
        </div>
        <div className="hero-glow absolute inset-0" />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none"
        />

        <div className="relative w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-red-400" />
                </span>
                24/7 Support Available
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.9 }}
                className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95]"
              >
                Talk to the<br /><em className="text-gradient not-italic">right team.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-white/60 leading-8 max-w-xl"
              >
                Whether you need onboarding help, community support, or want to discuss emergency coordination, reach the right people without guesswork.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="tel:+911112345678"
                  className="group relative overflow-hidden rounded-full bg-red-600 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:-translate-y-0.5"
                >
                  Emergency Call →
                </a>
                <Link
                  to="/services"
                  className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Explore Services
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredCard(i)}
                  onHoverEnd={() => setHoveredCard(null)}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative overflow-hidden rounded-3xl card-glass"
                >
                  <motion.div
                    animate={{ scale: hoveredCard === i ? 1.1 : 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-70`} />
                  </motion.div>
                  <div className="relative p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{card.icon}</span>
                      <h3 className="text-xl font-bold">{card.title}</h3>
                    </div>
                    <p className={`text-lg font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.detail}
                    </p>
                    <p className="mt-2 text-sm text-white/60 leading-5">{card.note}</p>
                    <div className={`mt-4 h-px w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${card.color}`} />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Strip ── */}
      <Reveal delay={0.1}>
        <section className="w-full px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop", label: "Coordination Center" },
                { src: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&h=400&fit=crop", label: "Support Team" },
                { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop", label: "Partnership Meeting" },
                { src: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop", label: "Community Outreach" },
              ].map((img, i) => (
                <motion.div
                  key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-2xl h-48 md:h-56"
                >
                  <img
                    src={img.src} alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-semibold text-white">{img.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Form + Sidebar ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Contact Form */}
            <Reveal direction="left">
              <div className="rounded-3xl card-glass p-8">
                <div className="mb-6">
                  <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-2">Get in Touch</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold">
                    Send us a <em className="text-white/40">message</em>
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-4xl"
                      >
                        ✓
                      </motion.div>
                      <h3 className="mt-5 text-2xl font-bold text-white">Message Sent!</h3>
                      <p className="mt-2 text-white/50">Our team will get back to you within 24 hours.</p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", type: "General Inquiry", message: "" });
                        }}
                        className="mt-6 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Full name *"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder="Email address *"
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          />
                        </div>
                        <div>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          >
                            <option className="bg-[#080810]">General Inquiry</option>
                            <option className="bg-[#080810]">Emergency Help</option>
                            <option className="bg-[#080810]">Hospital Partnership</option>
                            <option className="bg-[#080810]">Volunteer Program</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <textarea
                          rows={5}
                          placeholder="Describe your request..."
                          value={formData.message}
                          onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 font-bold text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all hover:shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                      >
                        Send Inquiry →
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Sidebar Info */}
            <Reveal direction="right" delay={0.1}>
              <div className="space-y-6">
                {/* Availability */}
                <div className="rounded-3xl card-glass p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🕒</span>
                    <p className="text-red-400 text-xs tracking-[0.3em] uppercase">Availability</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Emergency Support", desc: "24/7 coordination for active emergency cases", icon: "🔴", avail: "Always" },
                      { title: "Partnership Desk", desc: "Mon–Sat, 9:00 AM to 7:00 PM IST", icon: "🟡", avail: "Weekdays" },
                      { title: "Volunteer Support", desc: "Daily onboarding and community guidance", icon: "🟢", avail: "Daily" },
                    ].map((item) => (
                      <motion.div
                        key={item.title}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-xs text-white/40">{item.desc}</p>
                        </div>
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/60">
                          {item.avail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="rounded-3xl card-glass p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">⚡</span>
                    <p className="text-red-400 text-xs tracking-[0.3em] uppercase">Quick Contact</p>
                  </div>
                  <div className="space-y-3">
                    <a
                      href="tel:+911112345678"
                      className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5 hover:border-red-500/30 transition-all"
                    >
                      <span className="text-sm font-medium">Emergency Hotline</span>
                      <span className="text-red-400 font-bold">+91-11-1234-5678</span>
                    </a>
                    <a
                      href="mailto:partners@lifelink.org"
                      className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5 hover:border-red-500/30 transition-all"
                    >
                      <span className="text-sm font-medium">Partnerships</span>
                      <span className="text-blue-400 text-sm">partners@lifelink.org</span>
                    </a>
                    <a
                      href="mailto:community@lifelink.org"
                      className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5 hover:border-red-500/30 transition-all"
                    >
                      <span className="text-sm font-medium">Volunteer Team</span>
                      <span className="text-emerald-400 text-sm">community@lifelink.org</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">FAQ</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Frequently asked <em className="text-white/40">questions</em>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="overflow-hidden rounded-2xl card-glass"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-2 shrink-0 text-red-500 text-xl font-bold"
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
                        <p className="px-6 pb-6 text-white/50 leading-6">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA Banner ── */}
      <Reveal>
        <section className="relative w-full overflow-hidden" style={{ height: "350px" }}>
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1800&h=400&fit=crop"
            alt="Emergency response"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto w-full">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Urgent Help</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl">
                Need immediate<br /><em>assistance?</em>
              </h2>
              <p className="mt-4 text-white/60 max-w-md">Our emergency coordination desk is available 24/7.</p>
              <a
                href="tel:+911112345678"
                className="mt-8 inline-flex rounded-full bg-red-600 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] transition hover:-translate-y-0.5"
              >
                Call Emergency Desk →
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="h-20" />
    </div>
  );
}