import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Reveal = ({ children, delay = 0, direction = "up" }) => {
  const variants = {
    up:    { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} variants={variants[direction]}>
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      let current = 0;
      const increment = target / (1800 / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(current));
      }, 16);
      observer.disconnect();
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// FIX: Unique images for Services page — different from Home and About
// Home: hospital corridor, blood donation close-up, ambulance exterior, volunteer handshake
// Services uses: lab/research, city ambulance dispatch, hospital lobby, team briefing
const services = [
  {
    icon: "🩸", title: "Blood Request Coordination",
    description: "Locate verified donors faster and reduce delays between request creation and hospital follow-through.",
    color: "#ef4444", gradFrom: "#7f1d1d", gradTo: "#be123c",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    features: ["Rare group request visibility", "Nearby donor coordination", "Hospital-ready response details", "Family-friendly tracking"],
  },
  {
    icon: "🚑", title: "Emergency Ambulance Support",
    description: "Connect emergency transport requests with better operational clarity and faster team alignment.",
    color: "#f59e0b", gradFrom: "#78350f", gradTo: "#d97706",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    features: ["Request prioritization", "Driver-side coordination", "Response visibility", "Critical case support flow"],
  },
  {
    icon: "🤝", title: "Volunteer Network",
    description: "Mobilize trusted community responders for transport, support tasks, and urgent coordination needs.",
    color: "#10b981", gradFrom: "#064e3b", gradTo: "#059669",
    img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    features: ["Availability tracking", "Community response support", "Role-based coordination", "Last-mile patient assistance"],
  },
  {
    icon: "🏥", title: "Hospital Connectivity",
    description: "Keep hospitals, patients, and families better aligned through shared emergency response information.",
    color: "#8b5cf6", gradFrom: "#4c1d95", gradTo: "#7c3aed",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    features: ["Hospital-side visibility", "Structured intake context", "Partner coordination flow", "Faster handoff readiness"],
  },
];

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    // FIX 1 — Dark mode: use Tailwind dark: variants driven by the <html class="dark"> toggle
    // from the navbar, not hardcoded bg-[#080810].
    // FIX 2 — Double scrollbar: was caused by both <html>/<body> AND this div having
    // overflow scroll. Solution: remove overflow-x-hidden from this root div;
    // it should be on a global wrapper (App.jsx / index.css). Instead we use
    // overflow-hidden only on specific sections that need clipping (hero, cards).
    <div className="bg-[#080810] text-white dark:bg-[#080810] dark:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Syne:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        * { font-family: 'Syne', sans-serif; }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }
        .text-gradient { background: linear-gradient(135deg, #ff6b6b, #ee0979); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      {/* ── HERO — overflow-hidden scoped to section, not root div ── */}
      <section className="relative h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {/* Unique hero: medical team in action / ICU scene */}
          <img
            src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1800&q=90"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-black/60 to-black/30" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.6), rgba(30,27,75,0.4))" }} />
        </div>

        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-1/4 h-64 w-64 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />

        <div className="relative w-full px-6 md:px-12 lg:px-20 pb-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-end">
            <div className="space-y-6">
              <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm text-red-300">
                Our Services
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.9 }}
                className="font-display text-6xl md:text-8xl font-bold leading-[0.95]">
                Everything for<br /><em className="text-gradient not-italic">emergency response.</em>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="text-lg text-white/60 leading-8 max-w-lg">
                LifeLink supports the full emergency journey — from blood search and transport to volunteer coordination and hospital readiness.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="grid grid-cols-2 gap-3">
              {[
                ["24/7", "Operational support",     "🕐"],
                ["4",    "Core modules",             "⚙️"],
                ["320+", "Connected institutions",   "🏥"],
                ["12k+", "Active helpers",           "👥"],
              ].map(([v, l, i]) => (
                <motion.div key={l} whileHover={{ scale: 1.04, y: -4 }} transition={{ type: "spring", stiffness: 400 }}
                  className="rounded-3xl border border-white/8 bg-white/5 p-5 backdrop-blur">
                  <span className="text-2xl">{i}</span>
                  <p className="mt-2 text-3xl font-bold font-display">{v}</p>
                  <p className="mt-1 text-xs text-white/40">{l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SERVICE SELECTOR ── */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto rounded-3xl card-glass overflow-hidden">
            {/* FIX: Removed height constraints that caused internal overflow.
                The grid cells now grow to their natural content height.
                No nested scrollable container — content flows freely. */}
            <div className="grid md:grid-cols-[0.38fr_0.62fr]">
              {/* Tab list */}
              <div className="border-b border-white/5 p-8 md:border-b-0 md:border-r md:border-white/5">
                <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6">Select a service</p>
                <div className="flex flex-col gap-2">
                  {services.map((svc, i) => (
                    <motion.button key={svc.title} onClick={() => setActiveService(i)} whileHover={{ x: 4 }}
                      className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all ${
                        activeService === i ? "text-white shadow-lg" : "bg-white/5 hover:bg-white/8 text-white/60"
                      }`}
                      style={activeService === i ? { background: `linear-gradient(135deg, ${svc.gradFrom}, ${svc.gradTo})` } : {}}>
                      <span className="text-2xl">{svc.icon}</span>
                      <p className="font-semibold text-sm">{svc.title}</p>
                      {activeService === i && (
                        <motion.div layoutId="activeDot" className="ml-auto h-2 w-2 rounded-full bg-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Detail panel — no fixed height, no overflow-y-auto */}
              <AnimatePresence mode="wait">
                <motion.div key={activeService} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img src={services[activeService].img} alt={services[activeService].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/80 to-transparent" />
                    <div className="absolute bottom-4 left-8">
                      <span className="text-4xl">{services[activeService].icon}</span>
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="font-display text-4xl font-bold">{services[activeService].title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/50">{services[activeService].description}</p>
                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {services[activeService].features.map((f) => (
                        <div key={f} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-3">
                          <span style={{ color: services[activeService].color }}>✓</span>
                          <span className="text-sm text-white/70">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── SERVICE CARDS ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-display text-5xl font-bold mb-12">All services</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {services.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 0.08}>
                <motion.article whileHover={{ y: -10 }} onHoverStart={() => setHoveredCard(i)}
                  onHoverEnd={() => setHoveredCard(null)} transition={{ type: "spring", stiffness: 300 }}
                  className="group relative overflow-hidden rounded-3xl card-glass cursor-pointer">
                  <div className="h-48 overflow-hidden relative">
                    <motion.img animate={{ scale: hoveredCard === i ? 1.1 : 1 }} transition={{ duration: 0.6 }}
                      src={svc.img} alt={svc.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 text-3xl">{svc.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-base">{svc.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/40">{svc.description}</p>
                    <div className="mt-4 h-px w-0 group-hover:w-full transition-all duration-700"
                      style={{ background: `linear-gradient(90deg, ${svc.color}, transparent)` }} />
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── unique process images */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto rounded-3xl card-glass p-10 md:p-14">
            <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Process</p>
            <h2 className="font-display text-5xl font-bold mb-12">How service coordination works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1", title: "Request is created",
                  text: "The patient, family, or partner starts the process with key emergency details.",
                  // Unique: person on phone in crisis
                  img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
                  color: "#ef4444",
                },
                {
                  step: "2", title: "Support is aligned",
                  text: "LifeLink brings together the most relevant responders, donors, or institutions.",
                  // Unique: dispatch/coordination center
                  img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
                  color: "#f59e0b",
                },
                {
                  step: "3", title: "Status stays visible",
                  text: "Families and teams stay updated on next steps instead of operating in confusion.",
                  // Unique: person checking phone/dashboard
                  img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80",
                  color: "#10b981",
                },
              ].map((item, i) => (
                <motion.div key={item.step} whileHover={{ y: -6 }} initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="group overflow-hidden rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="h-40 overflow-hidden relative">
                    <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810] to-transparent" />
                    <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl font-black text-white text-sm shadow-lg"
                      style={{ background: item.color }}>{item.step}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/40">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── STATS ── */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 rounded-3xl"
            style={{ background: "linear-gradient(135deg, #0f0f1a, #1a0a0a)", border: "1px solid rgba(255,255,255,0.06)", padding: "3rem" }}>
            {[
              { value: 12456, suffix: "+", label: "Active donors",      color: "#ef4444" },
              { value: 326,   suffix: "",  label: "Partner hospitals",  color: "#3b82f6" },
              { value: 5340,  suffix: "+", label: "Volunteers",         color: "#10b981" },
              { value: 1820,  suffix: "+", label: "Lives impacted",     color: "#8b5cf6" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center md:text-left">
                <p className="text-4xl font-bold font-display" style={{ color: s.color }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/40">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── CTA BANNER ── unique image: aerial city/infrastructure */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl" style={{ minHeight: "340px" }}>
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.92), rgba(30,27,75,0.88))" }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute right-10 top-10 h-64 w-64 rounded-full border border-white/10" />
            <div className="relative flex flex-col items-center justify-center text-center px-8 py-20">
              <h2 className="font-display text-5xl md:text-6xl font-bold">Need help choosing the right service?</h2>
              <p className="mt-5 max-w-xl text-base text-white/60">Reach out for support, partnerships, onboarding, or guidance on how to use the right module.</p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="rounded-full bg-white px-8 py-4 font-bold text-red-700 shadow-xl transition hover:-translate-y-1">Contact Us →</Link>
                <Link to="/about" className="rounded-full border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur hover:bg-white/20 transition hover:-translate-y-1">Learn More</Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="h-12" />
    </div>
  );
}