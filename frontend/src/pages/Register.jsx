import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from "../lib/api";
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [role, setRole] = useState("user");
  // Role specific states
  const [hospitalName, setHospitalName] = useState("");
  const [availableBeds, setAvailableBeds] = useState("");
  const [icuBeds, setIcuBeds] = useState("");
  const [oxygenCylinders, setOxygenCylinders] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=1771&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1748&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584515979956-1c81e0f1c4d9?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1740&auto=format&fit=crop",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name, email, password, phone, address, city, role,
        ...(role === "user" || role === "volunteer" ? { bloodGroup } : {}),
        ...(role === "hospital" ? { hospitalName, availableBeds: Number(availableBeds) || 0, icuBeds: Number(icuBeds) || 0, oxygenCylinders: Number(oxygenCylinders) || 0 } : {}),
        ...(role === "ambulance_driver" ? { vehicleNumber } : {})
      };
      const res = await api.post('/auth/register', payload);

      if (res.data.success) {
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
        successMessage.textContent = res.data.message;
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);

        setTimeout(() => navigate('/login'), 1500);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
      errorMessage.textContent = "Registration failed. Please try again.";
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!name || !email || !password)) {
      alert("Please fill in all basic fields");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const roleOptions = [
    { id: "user", label: "General User", icon: "👤", desc: "Request and donate blood" },
    { id: "volunteer", label: "Volunteer", icon: "🤝", desc: "Help with logistics and awareness" },
    { id: "hospital", label: "Hospital", icon: "🏥", desc: "Manage beds and incoming patients" },
    { id: "ambulance_driver", label: "Ambulance Driver", icon: "🚑", desc: "Respond to emergency requests" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950 flex overflow-hidden font-sans">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-rose-600 to-pink-600"
      >
        <motion.div
          key={currentImageIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentImageIndex]}
            alt="Healthcare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 p-12 text-white z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <i className="fas fa-hand-holding-heart text-5xl mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2 font-serif">Join Our Community</h2>
          <p className="text-white/90 text-lg">Become a part of LifeLink's life-saving network</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className={`text-xs uppercase tracking-wide ${currentStep === 1 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>Step 1</span>
              <span className={`text-xs uppercase tracking-wide ${currentStep === 2 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>Step 2</span>
              <span className={`text-xs uppercase tracking-wide ${currentStep === 3 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>Step 3</span>
            </div>
            <div className="flex gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${currentStep >= 1 ? 'bg-gradient-to-r from-rose-500 to-pink-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all ${currentStep >= 2 ? 'bg-gradient-to-r from-rose-500 to-pink-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all ${currentStep >= 3 ? 'bg-gradient-to-r from-rose-500 to-pink-600' : 'bg-slate-200'}`} />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white" style={{ fontFamily: "'Instrument Serif',serif" }}>Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Join LifeLink's emergency response network</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {currentStep === 1 && (
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={nextStep} className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-rose-500/30">Next Step</motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((r) => (
                    <div key={r.id} onClick={() => setRole(r.id)} className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${role === r.id ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 hover:border-rose-300 bg-white dark:bg-slate-800 dark:border-slate-700'}`}>
                      <div className="text-2xl mb-2">{r.icon}</div>
                      <div className={`font-bold ${role === r.id ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-white'}`}>{r.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{r.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl">Back</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={nextStep} className="flex-[2] bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/30">Continue</motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="+91 1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Address</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="Your full address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="Your City" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>

                  {(role === "user" || role === "volunteer") && (
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Blood Group</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </select>
                    </div>
                  )}

                  {role === "hospital" && (
                    <>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hospital Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="e.g. Apollo Hospital" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Beds</label>
                        <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="0" value={availableBeds} onChange={(e) => setAvailableBeds(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">ICU Beds</label>
                        <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="0" value={icuBeds} onChange={(e) => setIcuBeds(e.target.value)} required />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Oxygen Cylinders</label>
                        <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="0" value={oxygenCylinders} onChange={(e) => setOxygenCylinders(e.target.value)} required />
                      </div>
                    </>
                  )}

                  {role === "ambulance_driver" && (
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Vehicle Registration Number</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="e.g. DL 1C AB 1234" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl">Back</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="flex-[2] bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/30">
                    {isLoading ? "Creating Account..." : "Complete Registration"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account? <Link to="/login" className="text-rose-500 font-bold">Sign In</Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Register;