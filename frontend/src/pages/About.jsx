import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
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

const ParallaxImage = ({ src, alt, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-full object-cover scale-125" />
    </div>
  );
};

const team = [
  {
    name: "Dr. Priya Sharma",
    role: "Founder & Emergency Strategist",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80",
    specialty: "Critical care systems and hospital coordination",
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Rahul Mehta",
    role: "Chief Product Officer",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    specialty: "Real-time dispatch workflows and response automation",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Anita Desai",
    role: "Community Network Lead",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    specialty: "Volunteer programs, blood camps, and donor retention",
    color: "from-emerald-500 to-teal-600",
  },
];

const values = [
  { title: "Faster Decisions", description: "One place for blood, ambulance, hospital, and volunteer support during emergencies.", icon: "⚡", color: "from-amber-400 to-orange-500" },
  { title: "Verified Support", description: "Every part of the ecosystem is built around trust, verification, and clear response ownership.", icon: "🛡️", color: "from-blue-500 to-cyan-500" },
  { title: "Human-Centered Care", description: "Designed for patients and families under pressure, with clear updates and compassionate comms.", icon: "❤️", color: "from-rose-500 to-pink-500" },
];

const timeline = [
  { year: "2023", title: "First city launch", text: "Started as a donor coordination network with rapid-response matching.", img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=300&q=80" },
  { year: "2024", title: "Emergency modules added", text: "Ambulance, hospital, and volunteer coordination became part of a single workflow.", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&q=80" },
  { year: "2025", title: "Regional expansion", text: "Expanded to multiple cities with stronger hospital and blood bank partnerships.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=80" },
];

export default function About() {
  const [hoveredMember, setHoveredMember] = useState(null);

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
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-rose-900/80 to-pink-900/85" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl"
          />

          <div className="relative grid gap-10 px-8 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-14 md:py-20">
            <div className="space-y-6 text-white">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur"
              >
                Built for emergency coordination
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="font-display text-5xl font-bold leading-tight md:text-7xl"
              >
                About<br /><span className="italic text-rose-300">LifeLink</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-base leading-7 text-white/80 md:text-lg"
              >
                LifeLink connects donors, hospitals, ambulance teams, and volunteers into one response network so families can act quickly when every minute matters.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/services" className="rounded-2xl bg-white px-6 py-3 font-bold text-rose-700 shadow-lg transition hover:-translate-y-1">Explore Services →</Link>
                <Link to="/contact" className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">Contact Team</Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["12k+", "Active donors", "🩸"],
                ["320+", "Hospital partners", "🏥"],
                ["24/7", "Dispatch availability", "🚑"],
                ["9 min", "Avg. response", "⚡"],
              ].map(([value, label, icon], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-3xl bg-white/12 p-5 backdrop-blur border border-white/15"
                >
                  <p className="text-2xl">{icon}</p>
                  <p className="mt-2 text-3xl font-black text-white">{value}</p>
                  <p className="mt-1 text-xs text-white/70">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMAGE STRIP ── */}
        <Reveal delay={0.1}>
          <section className="mt-8 grid h-48 grid-cols-3 gap-3 md:h-60">
            {[
              "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80",
              "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
            ].map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="overflow-hidden rounded-3xl"
              >
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </motion.div>
            ))}
          </section>
        </Reveal>

        {/* ── VALUES ── */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${value.color} opacity-10 blur-xl`} />
                <span className="text-4xl">{value.icon}</span>
                <h2 className="mt-4 text-xl font-bold">{value.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{value.description}</p>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "35%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`mt-5 h-1 rounded-full bg-gradient-to-r ${value.color}`}
                />
              </motion.article>
            </Reveal>
          ))}
        </section>

        {/* ── MISSION + TIMELINE ── */}
        <section className="mt-10 grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
          <Reveal direction="left">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 h-full">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Our Mission</span>
              <h2 className="font-display mt-3 text-3xl font-bold">Make urgent care coordination<br /><span className="italic text-rose-500">clear, fast, and humane.</span></h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                We help people move from panic to action by giving them one place to request help, understand progress, and reach trusted responders.
              </p>
              <div className="mt-8 space-y-4">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ x: 5 }}
                    className="flex gap-4 overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/70"
                  >
                    <img src={item.img} alt="" className="h-auto w-24 shrink-0 object-cover" />
                    <div className="p-4">
                      <p className="text-sm font-bold text-rose-500">{item.year}</p>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="space-y-6 h-full flex flex-col">
              {/* What we coordinate */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">What we coordinate</span>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {[
                    { label: "Rare blood donor search", icon: "🩸" },
                    { label: "Emergency ambulance requests", icon: "🚑" },
                    { label: "Hospital & bed visibility", icon: "🏥" },
                    { label: "Volunteer transport support", icon: "🤝" },
                    { label: "Family progress updates", icon: "📱" },
                    { label: "Post-emergency follow-up", icon: "✅" },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ scale: 1.03, x: 3 }}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Parallax impact image */}
              <div className="relative h-44 overflow-hidden rounded-3xl">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80"
                  alt="Community impact"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-800/70 to-transparent flex items-center px-8">
                  <div className="text-white">
                    <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">Our reach</p>
                    <p className="font-display text-3xl font-bold mt-1">9 cities & growing</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── TEAM ── */}
        <Reveal delay={0.1}>
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500">The Team</span>
              <h2 className="font-display mt-3 text-3xl font-bold">People building LifeLink</h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -6 }}
                  onHoverStart={() => setHoveredMember(i)}
                  onHoverEnd={() => setHoveredMember(null)}
                  className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-800/70"
                >
                  <div className="h-56 overflow-hidden">
                    <motion.img
                      src={member.photo}
                      alt={member.name}
                      animate={{ scale: hoveredMember === i ? 1.08 : 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className={`absolute top-0 left-0 right-0 h-56 bg-gradient-to-b ${member.color} opacity-0 transition-opacity duration-300 ${hoveredMember === i ? "opacity-30" : ""}`} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold">{member.name}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>{member.role}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{member.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        <div className="h-16" />
      </div>
    </div>
  );
}