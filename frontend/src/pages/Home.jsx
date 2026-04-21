import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ─── Animated Counter ──────────────────────────────────────────────── */
const AnimatedCounter = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 16);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Scroll Reveal ─────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, direction = "up" }) => {
  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },   visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },   visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants[direction]}
    >
      {children}
    </motion.div>
  );
};

/* ─── Parallax Image ────────────────────────────────────────────────── */
const ParallaxImage = ({ src, alt, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-full object-cover scale-125" />
    </div>
  );
};

/* ─── Floating Badge ────────────────────────────────────────────────── */
const FloatingBadge = ({ icon, label, value, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={`absolute z-20 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-2xl backdrop-blur dark:bg-slate-900/95 ${className}`}
  >
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="text-sm font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

/* ─── Testimonial Card ──────────────────────────────────────────────── */
const testimonials = [
  { name: "Neha R.", city: "Delhi", quote: "LifeLink found a rare AB- donor in under 8 minutes. I can't thank them enough.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80" },
  { name: "Arjun S.", city: "Mumbai", quote: "The hospital coordination feature saved us hours of phone calls during a critical moment.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" },
  { name: "Priya M.", city: "Bangalore", quote: "As a volunteer, the platform makes it so easy to know exactly where I'm needed.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80" },
];

/* ─── Main Component ────────────────────────────────────────────────── */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleHero = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: "Active Donors", value: 12456, suffix: "+", icon: "🩸", accent: "from-rose-500 to-pink-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
    { label: "Emergency Cases", value: 1820, suffix: "+", icon: "🚑", accent: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Partner Hospitals", value: 326, suffix: "", icon: "🏥", accent: "from-blue-500 to-cyan-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Volunteers", value: 5340, suffix: "+", icon: "🤝", accent: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
  ];

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80", label: "Blood Donation Drive" },
    { src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80", label: "Emergency Response Team" },
    { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", label: "Hospital Coordination" },
    { src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80", label: "Volunteer Network" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4F0] text-slate-800 dark:bg-[#0D0D0F] dark:text-slate-200 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        .font-display { font-family: 'Instrument Serif', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        * { font-family: 'DM Sans', sans-serif; }
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .glow-red { box-shadow: 0 0 80px rgba(239,68,68,0.25); }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* ── HERO ── */}
        <motion.section
          style={{ scale: scaleHero }}
          className="relative mt-6 overflow-hidden rounded-[2.5rem] noise"
        >
          {/* Background with layered images */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&q=80"
              alt="hero bg"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-700/90 via-red-800/85 to-slate-900/95" />
          </div>

          {/* Animated orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl"
          />

          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-7 text-white">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
                  </span>
                  24/7 Emergency Coordination Platform
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="font-display text-5xl font-bold leading-[1.1] md:text-7xl"
                >
                  One network.<br />
                  <span className="italic text-rose-300">Every lifeline.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="max-w-xl text-base leading-7 text-white/80 md:text-lg"
                >
                  Blood. Ambulance. Hospital. Volunteer. LifeLink brings every critical service together so families can act fast when every second counts.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to="/services"
                    className="group relative overflow-hidden rounded-2xl bg-white px-7 py-3.5 font-bold text-rose-700 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <motion.span className="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative">Explore Services →</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/20"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>

              {/* Right: image mosaic with floating badges */}
              <div className="relative hidden md:block">
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-2 h-48 overflow-hidden rounded-3xl"
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=700&q=80"
                      alt="Blood donation"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {["https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80",
                    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80"].map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="h-36 overflow-hidden rounded-2xl"
                    >
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                        src={src}
                        alt="healthcare"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>

                <FloatingBadge icon="🩸" label="Matching now" value="Rare B- found" delay={0.8} className="-left-8 top-10" />
                <FloatingBadge icon="🚑" label="ETA" value="4 minutes" delay={1.0} className="-bottom-4 right-4" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── STATS ── */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 ${stat.bg}`}
              >
                <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${stat.accent} opacity-10 blur-xl`} />
                <span className="text-3xl">{stat.icon}</span>
                <p className={`mt-4 bg-gradient-to-r ${stat.accent} bg-clip-text text-4xl font-black text-transparent`}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            </Reveal>
          ))}
        </section>

        {/* ── GALLERY STRIP ── */}
        <Reveal delay={0.1}>
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold">Our work in action</h2>
              <Link to="/about" className="text-sm font-semibold text-rose-500 hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-48 overflow-hidden rounded-2xl"
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-sm font-semibold text-white">{img.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── PILLARS ── */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Blood matching in minutes",
              description: "Find verified donors nearby and reduce the delay between request, response, and hospital coordination.",
              img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80",
              color: "from-rose-500 to-pink-600",
            },
            {
              title: "Emergency transport support",
              description: "Connect patients with ambulance teams and monitor the response path with better visibility.",
              img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80",
              color: "from-orange-500 to-red-600",
            },
            {
              title: "Hospital coordination",
              description: "Help families identify hospitals, departments, and next steps without starting from zero every time.",
              img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
              color: "from-blue-500 to-cyan-600",
            },
          ].map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.12} direction="up">
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-48 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    src={pillar.img}
                    alt={pillar.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${pillar.color} opacity-40 mix-blend-multiply`} />
                </div>
                <div className="p-7">
                  <h2 className="text-xl font-bold">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{pillar.description}</p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`mt-5 h-1 rounded-full bg-gradient-to-r ${pillar.color}`}
                  />
                </div>
              </motion.article>
            </Reveal>
          ))}
        </section>

        {/* ── HOW IT WORKS + TRUST ── */}
        <section className="mt-10 grid gap-6 md:grid-cols-[1fr_0.95fr]">
          <Reveal direction="left">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 h-full">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500">How it works</span>
              <h2 className="font-display mt-3 text-3xl font-bold">A calmer process<br />during critical moments</h2>
              <div className="mt-8 space-y-4">
                {[
                  { step: "01", title: "Create a request", desc: "A patient or family member submits the key emergency details in seconds.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
                  { step: "02", title: "Surface nearby support", desc: "LifeLink identifies the most relevant donors, hospitals, and responders.", img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=200&q=80" },
                  { step: "03", title: "Stay informed", desc: "Families and response teams get clear, live status throughout the process.", img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=200&q=80" },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ x: 4 }}
                    className="flex gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 font-black text-white text-sm">{item.step}</div>
                    <div className="flex-1">
                      <p className="font-bold">{item.title}</p>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <img src={item.img} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="flex flex-col gap-6 h-full">
              {/* Testimonial carousel */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">What people say</span>
                <h2 className="font-display mt-3 text-2xl font-bold">Real stories, real impact</h2>
                <div className="mt-6 relative h-36">
                  <AnimatePresence mode="wait">
                    {testimonials.map((t, i) =>
                      i === activeTestimonial ? (
                        <motion.div
                          key={t.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 italic">"{t.quote}"</p>
                          <div className="mt-4 flex items-center gap-3">
                            <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-bold">{t.name}</p>
                              <p className="text-xs text-slate-400">{t.city}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : null
                    )}
                  </AnimatePresence>
                </div>
                <div className="mt-4 flex gap-2">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setActiveTestimonial(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeTestimonial ? "w-8 bg-rose-500" : "w-2 bg-slate-200 dark:bg-slate-700"}`}
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-pink-700 p-7 text-white shadow-xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-white/15"
                />
                <h3 className="text-xl font-black">Need direct help?</h3>
                <p className="mt-2 text-sm text-white/80">Our team is available 24/7 for emergency coordination and partnership inquiries.</p>
                <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-rose-600 transition hover:-translate-y-0.5">
                  Contact Us →
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── IMPACT PARALLAX BANNER ── */}
        <Reveal delay={0.1}>
          <section className="relative mt-10 h-72 overflow-hidden rounded-3xl md:h-80">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1400&q=80"
              alt="Team impact"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-rose-900/60" />
            <div className="relative flex h-full flex-col items-start justify-center px-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">Our impact</p>
              <h2 className="font-display mt-3 max-w-lg text-4xl font-bold text-white md:text-5xl">Every response begins with one request</h2>
              <Link to="/services" className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-rose-700 transition hover:-translate-y-1">
                See Our Services →
              </Link>
            </div>
          </section>
        </Reveal>

        {/* bottom padding */}
        <div className="h-16" />
      </div>
    </div>
  );
}