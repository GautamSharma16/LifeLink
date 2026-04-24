import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

const testimonials = [
  { name: "Neha R.", city: "Delhi", quote: "LifeLink found a rare AB- donor in under 8 minutes. I can't thank them enough.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop" },
  { name: "Arjun S.", city: "Mumbai", quote: "The hospital coordination feature saved us hours of phone calls during a critical moment.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
  { name: "Priya M.", city: "Bangalore", quote: "As a volunteer, the platform makes it so easy to know exactly where I'm needed.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "25%"]);
  const [activeTest, setActiveTest] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTest(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Syne:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        * { font-family: 'Syne', sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #ff6b6b, #ee0979, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }
        .hero-glow { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,38,38,0.25) 0%, transparent 70%); }
      `}</style>

      {/* ── Hero Section ── */}
      {/* FIX: Changed min-h-screen to h-screen so it fits exactly one viewport,
          and replaced pt-32 with items-center so content is vertically centred
          relative to the full screen height — no extra top gap vs the navbar. */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=1800&h=1000&fit=crop"
            alt=""
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#080810]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
        </motion.div>
        <div className="hero-glow absolute inset-0" />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, delay: 2 }}
          className="absolute bottom-40 left-1/3 h-80 w-80 rounded-full bg-pink-600/15 blur-3xl pointer-events-none"
        />

        {/* FIX: Removed pt-32 pb-20 — content now centres naturally inside h-screen */}
        <div className="relative w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-red-400" />
                </span>
                24/7 Emergency Coordination Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-6xl md:text-8xl font-bold leading-[0.95]"
              >
                One network.<br /><em className="text-gradient not-italic">Every lifeline.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
                className="text-lg text-white/60 leading-8 max-w-lg"
              >
                Blood. Ambulance. Hospital. Volunteer. LifeLink unifies every critical service so families can act in seconds, not hours.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/services"
                  className="group relative overflow-hidden rounded-full bg-red-600 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:-translate-y-0.5"
                >
                  Explore Services →
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
              className="hidden md:grid grid-cols-2 gap-3"
            >
              {[
                { v: "12k+", l: "Active Donors",  i: "🩸", c: "border-red-500/20 bg-red-500/5" },
                { v: "9 min", l: "Avg Response",  i: "⚡", c: "border-amber-500/20 bg-amber-500/5" },
                { v: "320+", l: "Hospitals",       i: "🏥", c: "border-blue-500/20 bg-blue-500/5" },
                { v: "24/7", l: "Dispatch",        i: "🚑", c: "border-emerald-500/20 bg-emerald-500/5" },
              ].map(({ v, l, i, c }) => (
                <motion.div
                  key={l} whileHover={{ scale: 1.04, y: -4 }} transition={{ type: "spring", stiffness: 400 }}
                  className={`rounded-3xl border p-6 backdrop-blur ${c}`}
                >
                  <p className="text-2xl mb-3">{i}</p>
                  <p className="text-4xl font-bold font-display">{v}</p>
                  <p className="text-sm text-white/50 mt-1">{l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          >
            <p className="text-xs tracking-[0.3em] uppercase">Scroll</p>
            <motion.div
              animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="w-full border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Donors",    value: 12456, suffix: "+", color: "text-red-400" },
            { label: "Emergency Cases",  value: 1820,  suffix: "+", color: "text-amber-400" },
            { label: "Partner Hospitals",value: 326,   suffix: "",  color: "text-blue-400" },
            { label: "Volunteers Active",value: 5340,  suffix: "+", color: "text-emerald-400" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="text-center md:text-left">
                <p className={`text-4xl font-bold font-display ${s.color}`}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-white/40 mt-2 tracking-wide">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Image Strip ── */}
      {/* FIX: All four images now share a fixed uniform height (h-64 md:h-72).
          Removed the alternating h-80/h-48 sizing that made images uneven. */}
      <Reveal delay={0.1}>
        <section className="w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Our work<br /><em className="text-white/40">in action</em>
              </h2>
              <Link to="/about" className="text-sm text-red-400 hover:text-red-300 transition border-b border-red-400/30 pb-0.5">
                View all →
              </Link>
            </div>

            {/* FIX: Uniform grid — all cells same height, overflow hidden clips images cleanly */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { src: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&h=400&fit=crop", label: "Blood Donation Drive" },
                { src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop", label: "Emergency Response" },
                { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop", label: "Hospital Coordination" },
                { src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=400&fit=crop", label: "Volunteer Network" },
              ].map((img, i) => (
                <motion.div
                  key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-2xl h-64 md:h-72"
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

      {/* ── Services Section ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">What We Do</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                Everything for<br /><em className="text-white/40">emergency response</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Blood Matching",      desc: "Find verified donors nearby and reduce delays between request, response, and hospital coordination.", img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&h=350&fit=crop", color: "#ef4444", icon: "🩸" },
              { title: "Emergency Transport", desc: "Connect patients with ambulance teams and monitor response with better visibility.",                    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=350&fit=crop", color: "#f59e0b", icon: "🚑" },
              { title: "Hospital Network",    desc: "Help families identify hospitals, departments, and next steps without starting from zero.",            img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=350&fit=crop", color: "#3b82f6", icon: "🏥" },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <motion.article
                  whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}
                  className="group relative overflow-hidden rounded-3xl card-glass cursor-pointer"
                >
                  <div className="h-52 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-black/20 to-transparent" />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{s.icon}</span>
                      <h3 className="text-xl font-bold">{s.title}</h3>
                    </div>
                    <p className="text-sm text-white/50 leading-7">{s.desc}</p>
                    <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-700" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works + Testimonials ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <Reveal direction="left">
            <div className="rounded-3xl card-glass p-10 h-full">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-6">How It Works</p>
              <h2 className="font-display text-4xl font-bold mb-10">
                A calmer process<br /><em className="text-white/40">in critical moments</em>
              </h2>
              <div className="space-y-5">
                {[
                  { step: "01", title: "Create a request",      desc: "Submit key emergency details in seconds from any device.",                                    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=150&fit=crop" },
                  { step: "02", title: "Surface nearby support", desc: "LifeLink identifies the most relevant donors, hospitals, and responders.",                    img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=200&h=150&fit=crop" },
                  { step: "03", title: "Stay informed",          desc: "Families and response teams get live status throughout the process.",                         img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=200&h=150&fit=crop" },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ x: 5 }}
                    className="flex gap-4 rounded-2xl bg-white/5 p-4 border border-white/5 hover:border-red-500/20 transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-400 font-bold text-sm border border-red-500/20">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-white/40">{item.desc}</p>
                    </div>
                    <img src={item.img} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover opacity-70" />
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="flex flex-col gap-6 h-full">
              <div className="rounded-3xl card-glass p-8 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-full blur-3xl" />
                <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6">What People Say</p>
                <div className="relative h-44">
                  <AnimatePresence mode="wait">
                    {testimonials.map((t, i) => i === activeTest ? (
                      <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }} className="absolute inset-0"
                      >
                        <p className="font-display text-2xl italic text-white/80 leading-relaxed">"{t.quote}"</p>
                        <div className="mt-6 flex items-center gap-3">
                          <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-red-500/30" />
                          <div>
                            <p className="font-semibold text-sm">{t.name}</p>
                            <p className="text-xs text-white/40">{t.city}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null)}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2 mt-4">
                  {testimonials.map((_, i) => (
                    <button
                      key={i} onClick={() => setActiveTest(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${i === activeTest ? "w-8 bg-red-500" : "w-2 bg-white/20"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl p-8" style={{ background: "linear-gradient(135deg, #7f1d1d, #be123c)" }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/15" />
                <h3 className="text-2xl font-bold relative">Need direct help?</h3>
                <p className="mt-2 text-sm text-white/70 relative">Our team is available 24/7 for emergency coordination.</p>
                <Link
                  to="/contact"
                  className="mt-6 relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <Reveal>
        <section className="relative w-full overflow-hidden" style={{ height: "420px" }}>
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1800&h=500&fit=crop"
            alt="" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3))" }} />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto w-full">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Our Impact</p>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-tight max-w-2xl">
                Every response begins with<br /><em>one request.</em>
              </h2>
              <Link
                to="/services"
                className="mt-8 inline-flex rounded-full bg-red-600 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] transition hover:-translate-y-0.5"
              >
                See Our Services →
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="h-20" />
    </div>
  );
}