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

const team = [
  {
    name: "Dr. Priya Sharma",
    role: "Founder & Emergency Strategist",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    specialty: "Critical care systems and hospital coordination",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Rahul Mehta",
    role: "Chief Product Officer",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    specialty: "Real-time dispatch workflows and response automation",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Anita Desai",
    role: "Community Network Lead",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    specialty: "Volunteer programs, blood camps, and donor retention",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Vikram Singh",
    role: "Head of Hospital Partnerships",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    specialty: "Building India's largest emergency hospital network",
    color: "from-amber-500 to-orange-600",
  },
];

const values = [
  { title: "Faster Decisions", description: "One place for blood, ambulance, hospital, and volunteer support during emergencies.", icon: "⚡", color: "from-red-400 to-orange-500" },
  { title: "Verified Support", description: "Every part of the ecosystem is built around trust, verification, and clear response ownership.", icon: "🛡️", color: "from-blue-500 to-cyan-500" },
  { title: "Human-Centered Care", description: "Designed for patients and families under pressure, with clear updates and compassionate comms.", icon: "❤️", color: "from-rose-500 to-pink-500" },
];

const timeline = [
  { year: "2023", title: "First city launch", text: "Started as a donor coordination network with rapid-response matching in Mumbai.", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&q=80" },
  { year: "2024", title: "Emergency modules added", text: "Ambulance, hospital, and volunteer coordination became part of a single workflow.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80" },
  { year: "2025", title: "Regional expansion", text: "Expanded to 9 cities with stronger hospital and blood bank partnerships across India.", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=300&q=80" },
];

export default function About() {
  const [hoveredMember, setHoveredMember] = useState(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "20%"]);

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
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1800&h=1000&fit=crop"
            alt="Healthcare team"
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

        <div className="relative w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-red-400" />
                </span>
                Built for emergency coordination
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.9 }}
                className="font-display text-6xl md:text-8xl font-bold leading-[0.95]"
              >
                About<br /><em className="text-gradient not-italic">LifeLink</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-lg text-white/60 leading-8 max-w-xl"
              >
                LifeLink connects donors, hospitals, ambulance teams, and volunteers into one response network so families can act quickly when every minute matters.
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
                  Contact Team
                </Link>
              </motion.div>
            </div>
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
            { label: "Hospital Partners",value: 326,   suffix: "+", color: "text-blue-400" },
            { label: "Cities Covered",   value: 9,     suffix: "",  color: "text-emerald-400" },
            { label: "Avg Response",     value: 9,     suffix: " min", color: "text-amber-400" },
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

      {/* ── Our Mission Section ── */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Our Mission</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                Make urgent care coordination<br /><em className="text-white/40">clear, fast, and humane.</em>
              </h2>
              <p className="mt-6 text-white/60 leading-7">
                We help people move from panic to action by giving them one place to request help, 
                understand progress, and reach trusted responders. Every second saved is a life better served.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">✓</div>
                  <span className="text-sm">Real-time updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">✓</div>
                  <span className="text-sm">Verified partners</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden h-80 md:h-96">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                alt="Emergency response team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Values Section ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">What We Believe</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold">
                Our core <em className="text-white/40">values</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative overflow-hidden rounded-3xl card-glass p-8 h-full"
                >
                  <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/20 to-transparent blur-2xl" />
                  <span className="text-5xl">{value.icon}</span>
                  <h3 className="mt-4 text-2xl font-bold">{value.title}</h3>
                  <p className="mt-3 text-white/50 leading-6">{value.description}</p>
                  <div className={`mt-6 h-0.5 w-12 group-hover:w-24 transition-all duration-500 bg-gradient-to-r ${value.color}`} />
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Journey Timeline ── */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Our Journey</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold">
                From vision to <em className="text-white/40">impact</em>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl card-glass overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <p className="text-3xl font-bold text-red-400 font-display">{item.year}</p>
                    <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                    <p className="mt-2 text-white/50 text-sm leading-6">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── What We Coordinate ── */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <div>
                <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Our Ecosystem</p>
                <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                  Everything you need<br /><em className="text-white/40">in one place</em>
                </h2>
                <p className="mt-4 text-white/50">
                  We've built a comprehensive emergency response ecosystem that connects every critical service.
                </p>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Rare blood donor search",       icon: "🩸", color: "border-red-500/20 bg-red-500/5" },
                  { label: "Emergency ambulance requests",  icon: "🚑", color: "border-amber-500/20 bg-amber-500/5" },
                  { label: "Hospital & bed visibility",     icon: "🏥", color: "border-blue-500/20 bg-blue-500/5" },
                  { label: "Volunteer transport support",   icon: "🤝", color: "border-emerald-500/20 bg-emerald-500/5" },
                  { label: "Family progress updates",       icon: "📱", color: "border-purple-500/20 bg-purple-500/5" },
                  { label: "Post-emergency follow-up",      icon: "✅", color: "border-teal-500/20 bg-teal-500/5" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className={`rounded-2xl border p-4 ${item.color}`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="mt-2 text-sm font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Image Strip ── */}
      <Reveal delay={0.1}>
        <section className="w-full px-6 md:px-12 lg:px-20 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop", label: "Community Outreach" },
                { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop", label: "Medical Camps" },
                { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop", label: "Training Sessions" },
                { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop", label: "Urban Coverage" },
              ].map((img, i) => (
                <motion.div
                  key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-2xl h-56 md:h-64"
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

      {/* ── Leadership Team ── */}
      <Reveal>
        <section className="w-full px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Leadership</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold">
                The team behind <em className="text-white/40">LifeLink</em>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  onHoverStart={() => setHoveredMember(i)}
                  onHoverEnd={() => setHoveredMember(null)}
                  className="group relative overflow-hidden rounded-3xl card-glass"
                >
                  <div className="h-64 overflow-hidden">
                    <motion.img
                      src={member.photo}
                      alt={member.name}
                      animate={{ scale: hoveredMember === i ? 1.08 : 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${member.color} opacity-0 transition-opacity duration-300 ${hoveredMember === i ? "opacity-20" : ""}`} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                    <p className="mt-2 text-xs text-white/40 leading-5">{member.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA Banner ── */}
      <Reveal>
        <section className="relative w-full overflow-hidden" style={{ height: "400px" }}>
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1800&h=500&fit=crop"
            alt="Emergency response"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3))" }} />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto w-full">
              <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Join Our Mission</p>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-tight max-w-2xl">
                Ready to make a<br /><em>difference?</em>
              </h2>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/contact"
                  className="rounded-full bg-red-600 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] transition hover:-translate-y-0.5"
                >
                  Get Involved →
                </Link>
                <Link
                  to="/services"
                  className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="h-20" />
    </div>
  );
}