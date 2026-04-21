import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";
import logo from "../assets/login.png";

export default function Auth() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [socialLoading, setSocialLoading] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    bloodGroup: "O+",
    role: "user",
  });

  // Enhanced healthcare-themed images with better quality
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop",
      title: "Emergency Response Team",
      description: "Rapid response when you need it most",
      gradient: "from-red-600/80 to-orange-600/80"
    },
    {
      url: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1400&auto=format&fit=crop",
      title: "Blood Donation Drive",
      description: "Every drop saves a life",
      gradient: "from-rose-600/80 to-pink-600/80"
    },
    {
      url: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=1771&auto=format&fit=crop",
      title: "Medical Professionals",
      description: "Dedicated healthcare heroes",
      gradient: "from-blue-600/80 to-cyan-600/80"
    },
    {
      url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1632&auto=format&fit=crop",
      title: "Modern Hospital Care",
      description: "State-of-the-art medical facilities",
      gradient: "from-emerald-600/80 to-teal-600/80"
    },
    {
      url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1748&auto=format&fit=crop",
      title: "Ambulance Services",
      description: "24/7 emergency transport",
      gradient: "from-orange-600/80 to-red-600/80"
    },
    {
      url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1740&auto=format&fit=crop",
      title: "Community Support",
      description: "Together we save lives",
      gradient: "from-purple-600/80 to-pink-600/80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Email and password are required");

    try {
      setLoading(true);
      if (isRegister) {
        if (currentStep === 1) {
          setCurrentStep(2);
          setLoading(false);
          return;
        }
        
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          city: form.city,
          bloodGroup: form.bloodGroup,
          role: form.role,
        });
        toast.success("Registration successful! Please login.");
        setIsRegister(false);
        setCurrentStep(1);
        setForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          city: "",
          bloodGroup: "O+",
          role: "user",
        });
        return;
      }

      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      const token = response?.data?.data?.token;
      const user = response?.data?.data?.user;
      if (!token) throw new Error("Token missing in response");

      localStorage.setItem("lifelink_token", token);
      localStorage.setItem("lifelink_user", JSON.stringify(user || {}));
      window.dispatchEvent(new Event("lifelink-auth-changed"));
      toast.success("Welcome to LifeLink");
      navigate("/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    // Simulate social login - Replace with actual implementation
    setTimeout(() => {
      toast.success(`Connected with ${provider}`);
      setSocialLoading(null);
    }, 1500);
  };

  const nextStep = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Floating Particles with better animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -50, -100],
              x: [null, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left Side - Enhanced Image Carousel with Ken Burns Effect */}
        <section className="relative hidden overflow-hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              >
                <img
                  src={carouselImages[currentImageIndex].url}
                  alt="Healthcare"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className={`absolute inset-0 bg-gradient-to-t ${carouselImages[currentImageIndex].gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.img
                  src={logo}
                  alt="LifeLink logo"
                  className="h-14 w-14 rounded-2xl border-2 border-white/30 bg-white/10 object-cover p-1.5 shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <h1 className="text-4xl font-bold text-white tracking-tight">LifeLink</h1>
              </div>
            </motion.div>

            <motion.div
              key={currentImageIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-white mb-12"
            >
              <h2 className="text-6xl font-extrabold mb-4 leading-tight drop-shadow-2xl">
                {carouselImages[currentImageIndex].title}
              </h2>
              <p className="text-xl text-white/95 mb-10 max-w-md leading-relaxed">
                {carouselImages[currentImageIndex].description}
              </p>
              
              {/* Stats Grid with better animations */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "12k+", label: "Blood Donors", icon: "fa-tint", color: "text-red-300" },
                  { value: "1.8k", label: "Emergencies", icon: "fa-ambulance", color: "text-orange-300" },
                  { value: "320", label: "Hospitals", icon: "fa-hospital", color: "text-blue-300" },
                  { value: "24/7", label: "Support", icon: "fa-clock", color: "text-green-300" },
                  { value: "50+", label: "Cities", icon: "fa-city", color: "text-purple-300" },
                  { value: "100%", label: "Verified", icon: "fa-shield-alt", color: "text-yellow-300" },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <i className={`fas ${stat.icon} text-2xl mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-white/80 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Carousel Indicators with better styling */}
            <div className="flex gap-3 justify-center pb-8">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-2 rounded-full transition-all duration-500 ${
                    idx === currentImageIndex ? "w-12 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                  }`}
                >
                  {idx === currentImageIndex && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side - Enhanced Form */}
        <section className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={submit}
              className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20"
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 opacity-20 blur-xl"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="inline-flex items-center justify-center h-20 w-20 overflow-hidden rounded-2xl border-2 border-rose-200 bg-white mb-4 shadow-xl dark:border-slate-700 dark:bg-slate-800 mx-auto"
                  >
                    <img src={logo} alt="LifeLink logo" className="h-full w-full object-cover" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {isRegister ? "Create Account" : "Welcome Back"}
                  </h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    {isRegister
                      ? "Join our life-saving community today"
                      : "Sign in to continue saving lives"}
                  </p>
                </div>

                {/* Progress Steps for Registration */}
                {isRegister && (
                  <div className="mb-8">
                    <div className="flex justify-between mb-3">
                      <span className={`text-sm font-medium transition-colors duration-300 ${currentStep === 1 ? "text-rose-500" : "text-slate-400"}`}>
                        <i className="fas fa-user mr-2" /> Personal Info
                      </span>
                      <span className={`text-sm font-medium transition-colors duration-300 ${currentStep === 2 ? "text-rose-500" : "text-slate-400"}`}>
                        <i className="fas fa-address-card mr-2" /> Contact Details
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <motion.div 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 1 ? "bg-gradient-to-r from-rose-500 to-pink-500" : "bg-slate-200 dark:bg-slate-700"}`}
                        animate={{ width: currentStep >= 1 ? "100%" : "50%" }}
                      />
                      <motion.div 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 2 ? "bg-gradient-to-r from-rose-500 to-pink-500" : "bg-slate-200 dark:bg-slate-700"}`}
                        animate={{ width: currentStep >= 2 ? "100%" : "50%" }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {isRegister && currentStep === 1 && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="relative group">
                          <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <input
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                            placeholder="Full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <input
                            type="email"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-12 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {isRegister && currentStep === 2 && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="relative group">
                          <i className="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <input
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <i className="fas fa-map-marker-alt absolute left-4 top-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <textarea
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                            placeholder="Address"
                            rows="2"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <i className="fas fa-city absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <input
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                            placeholder="City"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <i className="fas fa-tint absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-500" />
                          <select
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 cursor-pointer group-hover:border-rose-300"
                            value={form.bloodGroup}
                            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                          >
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                              <option key={bg} value={bg}>
                                Blood Group: {bg}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="relative group">
                          <i className="fas fa-user-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                          <select
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 cursor-pointer group-hover:border-rose-300"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                          >
                            <option value="user">Role: User</option>
                            <option value="volunteer">Role: Donor / Volunteer</option>
                            <option value="hospital">Role: Hospital</option>
                            <option value="ambulance_driver">Role: Ambulance Driver</option>
                          </select>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {!isRegister && (
                    <div className="space-y-4">
                      <div className="relative group">
                        <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                        <input
                          type="email"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                          placeholder="Email address"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div className="relative group">
                        <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-12 pr-12 py-3 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none dark:bg-slate-800 group-hover:border-rose-300"
                          placeholder="Password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                        </button>
                      </div>
                      <div className="text-right">
                        <Link to="/forgot-password" className="text-xs font-semibold text-rose-500 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  )}

                  {isRegister && currentStep === 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      Next Step <i className="fas fa-arrow-right ml-2" />
                    </motion.button>
                  )}

                  {(isRegister && currentStep === 2) || !isRegister ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60 relative overflow-hidden group"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <>
                            {isRegister ? "Create Account" : "Sign In"}
                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>

                      {isRegister && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={prevStep}
                          className="w-full border-2 border-slate-300 dark:border-slate-700 py-3 rounded-xl font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <i className="fas fa-arrow-left mr-2" /> Back
                        </motion.button>
                      )}
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister((prev) => !prev);
                      setCurrentStep(1);
                      setForm({
                        name: "",
                        email: "",
                        password: "",
                        phone: "",
                        address: "",
                        city: "",
                        bloodGroup: "O+",
                        role: "user",
                      });
                    }}
                    className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors py-2"
                  >
                    {isRegister ? "Already have an account? Sign In" : "New to LifeLink? Create Account"}
                  </button>
                </div>

                {/* Social Login Options with Icons */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white dark:bg-slate-900 text-slate-400">Or continue with</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin("Google")}
                      disabled={socialLoading === "Google"}
                      className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group disabled:opacity-60"
                    >
                      {socialLoading === "Google" ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#EA4335"
                              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l-3.29 3.29c-.844-.58-1.93-.94-3.128-.94-2.64 0-4.88 1.84-5.682 4.366l-3.29-3.29z"
                            />
                            <path
                              fill="#34A853"
                              d="M16.418 6.491c1.21 1.18 1.99 2.85 1.99 4.79 0 1.84-.68 3.49-1.79 4.75l-3.29-3.29c.54-.54.88-1.27.88-2.06 0-.79-.34-1.52-.88-2.06l3.29-3.29z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.266 14.235c-.22-.66-.35-1.36-.35-2.09 0-.73.13-1.43.35-2.09l3.29 3.29c-.14.36-.22.76-.22 1.18 0 .42.08.82.22 1.18l-3.29 3.29z"
                            />
                            <path
                              fill="#4285F4"
                              d="M12 19.091c-1.69 0-3.218-.6-4.418-1.582l3.29-3.29c.844.58 1.93.94 3.128.94 2.64 0 4.88-1.84 5.682-4.366l3.29 3.29c-1.21 1.18-2.85 1.99-4.79 1.99z"
                            />
                          </svg>
                          <span className="text-sm font-medium">Google</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin("Facebook")}
                      disabled={socialLoading === "Facebook"}
                      className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group disabled:opacity-60"
                    >
                      {socialLoading === "Facebook" ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                          </svg>
                          <span className="text-sm font-medium">Facebook</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
