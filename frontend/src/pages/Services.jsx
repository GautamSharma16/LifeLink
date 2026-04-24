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
    <div className="w-full bg-[#080810] text-white overflow-x-clip">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Syne:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        * { font-family: 'Syne', sans-serif; }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }
        .text-gradient { background: linear-gradient(135deg, #ff6b6b, #ee0979); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .services-shell { overflow-x: clip; }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .services-shell { overflow-x: hidden; }
          .services-hero { min-height: 56vh !important; }
          .services-section { padding-top: 40px !important; padding-bottom: 40px !important; }
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .services-tab-grid { grid-template-columns: 1fr !important; }
          .services-detail-grid { grid-template-columns: 1fr !important; }
          .services-card-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .process-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; padding: 32px 20px !important; }
          .cta-title { font-size: 32px !important; line-height: 1.2 !important; }
          .services-tabs-list { flex-wrap: nowrap; scrollbar-width: none; -ms-overflow-style: none; }
          .services-tabs-list::-webkit-scrollbar { display: none; }
        }
        
        @media (max-width: 480px) {
          .hero-title { font-size: 42px !important; }
          .section-title { font-size: 32px !important; }
          .process-step-title { font-size: 18px !important; }
          .services-hero { min-height: 50vh !important; }
          .services-content { padding-top: 96px !important; padding-bottom: 40px !important; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="services-hero relative min-h-[62vh] md:h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
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

        <div className="services-content relative w-full px-4 sm:px-6 md:px-12 lg:px-20 pb-12 md:pb-20 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-end">
              <div className="space-y-4 md:space-y-6">
                <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm text-red-300">
                  Our Services
                </motion.span>
                <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.9 }}
                  className="hero-title font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] md:leading-[0.95]">
                  Everything for<br /><em className="text-gradient not-italic">emergency response.</em>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed md:leading-8 max-w-lg">
                  LifeLink supports the full emergency journey — from blood search and transport to volunteer coordination and hospital readiness.
                </motion.p>
              </div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                className="hero-stats-grid grid grid-cols-2 gap-3">
                {[
                  ["24/7", "Operational support", "🕐"],
                  ["4", "Core modules", "⚙️"],
                  ["320+", "Connected institutions", "🏥"],
                  ["12k+", "Active helpers", "👥"],
                ].map(([v, l, i]) => (
                  <motion.div key={l} whileHover={{ scale: 1.04, y: -4 }} transition={{ type: "spring", stiffness: 400 }}
                    className="rounded-2xl md:rounded-3xl border border-white/8 bg-white/5 p-3 md:p-5 backdrop-blur">
                    <span className="text-xl md:text-2xl">{i}</span>
                    <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold font-display">{v}</p>
                    <p className="mt-1 text-xs text-white/40">{l}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Service Selector */}
      <Reveal>
        <section className="services-section w-full px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20">
          <div className="max-w-7xl mx-auto rounded-2xl md:rounded-3xl card-glass overflow-hidden">
            <div className="services-tab-grid grid md:grid-cols-[0.38fr_0.62fr]">
              {/* Tab list - mobile friendly */}
              <div className="border-b border-white/5 p-4 md:p-8 md:border-b-0 md:border-r md:border-white/5">
                <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4 md:mb-6">Select a service</p>
                <div className="services-tabs-list flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                  {services.map((svc, i) => (
                    <motion.button key={svc.title} onClick={() => setActiveService(i)} whileHover={{ x: 0, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`flex-shrink-0 flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-left transition-all ${
                        activeService === i ? "text-white shadow-lg" : "bg-white/5 hover:bg-white/8 text-white/60"
                      }`}
                      style={activeService === i ? { background: `linear-gradient(135deg, ${svc.gradFrom}, ${svc.gradTo})` } : {}}>
                      <span className="text-xl md:text-2xl">{svc.icon}</span>
                      <p className="font-semibold text-xs md:text-sm whitespace-nowrap md:whitespace-normal">{svc.title}</p>
                      {activeService === i && (
                        <motion.div layoutId="activeDot" className="ml-auto h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Detail panel */}
              <AnimatePresence mode="wait">
                <motion.div key={activeService} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex flex-col">
                  <div className="h-48 sm:h-56 md:h-64 overflow-hidden relative">
                    <img src={services[activeService].img} alt={services[activeService].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 md:bottom-4 md:left-8">
                      <span className="text-3xl md:text-4xl">{services[activeService].icon}</span>
                    </div>
                  </div>
                  <div className="p-6 md:p-10">
                    <h3 className="font-display text-2xl md:text-4xl font-bold">{services[activeService].title}</h3>
                    <p className="mt-3 md:mt-4 text-sm md:text-base leading-relaxed md:leading-7 text-white/50">{services[activeService].description}</p>
                    <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {services[activeService].features.map((f) => (
                        <div key={f} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 md:px-4 md:py-3">
                          <span style={{ color: services[activeService].color }} className="text-sm">✓</span>
                          <span className="text-xs md:text-sm text-white/70">{f}</span>
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

      {/* Service Cards */}
      <section className="services-section w-full px-4 sm:px-6 md:px-12 lg:px-20 py-8 md:py-4">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="section-title font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-12">All services</h2>
          </Reveal>
          <div className="services-card-grid grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {services.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 0.08}>
                <motion.article whileHover={{ y: -6 }} onHoverStart={() => setHoveredCard(i)}
                  onHoverEnd={() => setHoveredCard(null)} transition={{ type: "spring", stiffness: 300 }}
                  className="group relative overflow-hidden rounded-2xl md:rounded-3xl card-glass cursor-pointer">
                  <div className="h-40 md:h-48 overflow-hidden relative">
                    <motion.img animate={{ scale: hoveredCard === i ? 1.1 : 1 }} transition={{ duration: 0.6 }}
                      src={svc.img} alt={svc.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 text-2xl md:text-3xl">{svc.icon}</div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-bold text-sm md:text-base">{svc.title}</h3>
                    <p className="mt-1 md:mt-2 text-xs leading-relaxed md:leading-5 text-white/40">{svc.description}</p>
                    <div className="mt-3 md:mt-4 h-px w-0 group-hover:w-full transition-all duration-700"
                      style={{ background: `linear-gradient(90deg, ${svc.color}, transparent)` }} />
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <Reveal>
        <section className="services-section w-full px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20">
          <div className="max-w-7xl mx-auto rounded-2xl md:rounded-3xl card-glass p-6 md:p-10 lg:p-14">
            <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-3 md:mb-4">Process</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12">How service coordination works</h2>
            <div className="process-grid grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  step: "1", title: "Request is created",
                  text: "The patient, family, or partner starts the process with key emergency details.",
                  img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
                  color: "#ef4444",
                },
                {
                  step: "2", title: "Support is aligned",
                  text: "LifeLink brings together the most relevant responders, donors, or institutions.",
                  img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
                  color: "#f59e0b",
                },
                {
                  step: "3", title: "Status stays visible",
                  text: "Families and teams stay updated on next steps instead of operating in confusion.",
                  img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80",
                  color: "#10b981",
                },
              ].map((item, i) => (
                <motion.div key={item.step} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="group overflow-hidden rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="h-32 sm:h-36 md:h-40 overflow-hidden relative">
                    <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810] to-transparent" />
                    <div className="absolute top-3 left-3 flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl font-black text-white text-xs md:text-sm shadow-lg"
                      style={{ background: item.color }}>{item.step}</div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="process-step-title font-bold text-sm md:text-base">{item.title}</h3>
                    <p className="mt-1 md:mt-2 text-xs leading-relaxed md:leading-5 text-white/40">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Stats Section */}
      <Reveal>
        <section className="services-section w-full px-4 sm:px-6 md:px-12 lg:px-20 py-8 md:py-4">
          <div className="stats-grid max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 rounded-2xl md:rounded-3xl p-6 md:p-12"
            style={{ background: "linear-gradient(135deg, #0f0f1a, #1a0a0a)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { value: 12456, suffix: "+", label: "Active donors", color: "#ef4444" },
              { value: 326, suffix: "", label: "Partner hospitals", color: "#3b82f6" },
              { value: 5340, suffix: "+", label: "Volunteers", color: "#10b981" },
              { value: 1820, suffix: "+", label: "Lives impacted", color: "#8b5cf6" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold font-display" style={{ color: s.color }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 md:mt-2 text-xs sm:text-sm text-white/40">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA Banner */}
      <Reveal>
        <section className="services-section w-full px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl md:rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.92), rgba(30,27,75,0.88))" }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -right-20 -top-20 h-48 w-48 md:h-64 md:w-64 rounded-full border border-white/10" />
            <div className="relative flex flex-col items-center justify-center text-center px-6 py-12 md:py-20">
              <h2 className="cta-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Need help choosing the right service?</h2>
              <p className="mt-4 md:mt-5 max-w-xl text-sm md:text-base text-white/60 px-4">Reach out for support, partnerships, onboarding, or guidance on how to use the right module.</p>
              <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
                <Link to="/contact" className="rounded-full bg-white px-6 py-3 md:px-8 md:py-4 font-bold text-red-700 shadow-xl transition hover:-translate-y-1 text-sm md:text-base">Contact Us →</Link>
                <Link to="/about" className="rounded-full border border-white/25 bg-white/10 px-6 py-3 md:px-8 md:py-4 font-semibold text-white backdrop-blur hover:bg-white/20 transition hover:-translate-y-1 text-sm md:text-base">Learn More</Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="h-8 md:h-12" />
    </div>
  );
}
