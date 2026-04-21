import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

const AnimatedCounter = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const increment = target / (1800 / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const services = [
  {
    icon: "🩸",
    title: "Blood Request Coordination",
    description: "Locate verified donors faster and reduce delays between request creation and hospital follow-through.",
    color: "from-rose-500 to-pink-600",
    img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80",
    features: ["Rare group request visibility", "Nearby donor coordination", "Hospital-ready response details", "Family-friendly tracking"],
  },
  {
    icon: "🚑",
    title: "Emergency Ambulance Support",
    description: "Connect emergency transport requests with better operational clarity and faster team alignment.",
    color: "from-blue-500 to-cyan-600",
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80",
    features: ["Request prioritization", "Driver-side coordination", "Response visibility", "Critical case support flow"],
  },
  {
    icon: "🤝",
    title: "Volunteer Network",
    description: "Mobilize trusted community responders for transport, support tasks, and urgent coordination needs.",
    color: "from-emerald-500 to-teal-600",
    img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
    features: ["Availability tracking", "Community response support", "Role-based coordination", "Last-mile patient assistance"],
  },
  {
    icon: "🏥",
    title: "Hospital Connectivity",
    description: "Keep hospitals, patients, and families better aligned through shared emergency response information.",
    color: "from-violet-500 to-purple-600",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    features: ["Hospital-side visibility", "Structured intake context", "Partner coordination flow", "Faster handoff readiness"],
  },
];

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

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
            <img src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&q=80" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-700/90 via-pink-800/85 to-blue-900/90" />
          </div>
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-20 h-48 w-48 rounded-full bg-rose-500/25 blur-3xl"
          />

          <div className="relative grid gap-8 px-8 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-14 md:py-20">
            <div className="space-y-5 text-white">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur"
              >
                Our Services
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-5xl font-bold leading-tight md:text-7xl"
              >
                Everything for<br /><span className="italic text-rose-300">emergency response.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-base leading-7 text-white/80 md:text-lg"
              >
                LifeLink supports the full emergency response journey — from blood search and transport to volunteer coordination and hospital readiness.
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["24/7", "Operational support", "🕐"],
                ["4", "Core modules", "⚙️"],
                ["320+", "Connected institutions", "🏥"],
                ["12k+", "Active helpers", "👥"],
              ].map(([value, label, icon], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur"
                >
                  <span className="text-2xl">{icon}</span>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs text-white/70">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE SERVICE SELECTOR ── */}
        <Reveal delay={0.1}>
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="grid md:grid-cols-[0.4fr_0.6fr]">
              {/* Tab list */}
              <div className="border-b border-slate-100 p-6 dark:border-slate-800 md:border-b-0 md:border-r">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Select a service</p>
                <div className="flex flex-col gap-2">
                  {services.map((svc, i) => (
                    <motion.button
                      key={svc.title}
                      onClick={() => setActiveService(i)}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all ${activeService === i ? `bg-gradient-to-r ${svc.color} text-white shadow-lg` : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800"}`}
                    >
                      <span className="text-2xl">{svc.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{svc.title}</p>
                      </div>
                      {activeService === i && (
                        <motion.div layoutId="activeIndicator" className="ml-auto h-2 w-2 rounded-full bg-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Detail panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={services[activeService].img}
                      alt={services[activeService].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display text-3xl font-bold">{services[activeService].title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{services[activeService].description}</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {services[activeService].features.map((f) => (
                        <div key={f} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/70">
                          <span className="text-emerald-500 text-sm">✓</span>
                          <span className="text-sm font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </Reveal>

        {/* ── SERVICE CARDS ── */}
        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
              >
                <div className="h-44 overflow-hidden">
                  <motion.img
                    animate={{ scale: hoveredCard === i ? 1.1 : 1 }}
                    transition={{ duration: 0.5 }}
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-0 left-0 right-0 h-44 bg-gradient-to-b ${service.color} opacity-50 mix-blend-multiply`} />
                  <div className="absolute top-4 left-4 text-3xl">{service.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg">{service.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{service.description}</p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`mt-4 h-1 rounded-full bg-gradient-to-r ${service.color}`}
                  />
                </div>
              </motion.article>
            </Reveal>
          ))}
        </section>

        {/* ── HOW IT WORKS ── */}
        <Reveal delay={0.1}>
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Process</span>
            <h2 className="font-display mt-3 text-3xl font-bold">How service coordination works</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                { step: "1", title: "Request is created", text: "The patient, family, or partner starts the process with key emergency details.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", color: "from-rose-500 to-pink-600" },
                { step: "2", title: "Support is aligned", text: "LifeLink brings together the most relevant responders, donors, or institutions.", img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80", color: "from-amber-500 to-orange-600" },
                { step: "3", title: "Status stays visible", text: "Families and teams stay updated on next steps instead of operating in confusion.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80", color: "from-emerald-500 to-teal-600" },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  whileHover={{ y: -6 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-800/70"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-50`} />
                    <div className={`absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} font-black text-white text-sm shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── STATS BANNER ── */}
        <Reveal delay={0.1}>
          <section className="mt-10 grid gap-6 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl md:grid-cols-4">
            {[
              { value: 12456, suffix: "+", label: "Active donors", color: "text-rose-400" },
              { value: 326, suffix: "", label: "Partner hospitals", color: "text-blue-400" },
              { value: 5340, suffix: "+", label: "Volunteers", color: "text-emerald-400" },
              { value: 1820, suffix: "+", label: "Lives impacted", color: "text-violet-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <p className={`text-4xl font-black ${stat.color}`}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </section>
        </Reveal>

        {/* ── CTA ── */}
        <Reveal delay={0.1}>
          <section className="relative mt-10 overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1400&q=80" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-800/90 to-blue-900/90" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute right-10 top-10 h-64 w-64 rounded-full border border-white/10"
            />
            <div className="relative px-10 py-14 text-center text-white">
              <h2 className="font-display text-4xl font-bold md:text-5xl">Need help choosing the right service?</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
                Reach out for support, partnerships, onboarding, or guidance on how to use the right module.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="rounded-2xl bg-white px-8 py-4 font-bold text-rose-700 shadow-xl transition hover:-translate-y-1">Contact Us →</Link>
                <Link to="/about" className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20">Learn More</Link>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="h-16" />
      </div>
    </div>
  );
}