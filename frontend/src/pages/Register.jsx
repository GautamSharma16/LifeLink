import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Array of rotating images for the left side
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
      const payload = { name, email, password, phone, address, bloodGroup };
      const res = await axios.post('http://localhost:8080/api/v1/auth/register', payload);
      
      if (res.data.success) {
        // Show success message
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
    if (currentStep === 1 && (!name || !email)) {
      alert("Please fill in your name and email");
      return;
    }
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950 flex overflow-hidden">
      {/* Left Side - Image Slider */}
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
          <h2 className="text-3xl font-bold mb-2">Join Our Community</h2>
          <p className="text-white/90 text-lg">Become a part of LifeLink's life-saving network</p>
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-400" />
              <span className="text-sm">Save lives as a donor or volunteer</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-400" />
              <span className="text-sm">Get emergency help when needed</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-400" />
              <span className="text-sm">Join a trusted healthcare network</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Registration Form */}
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
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${currentStep === 1 ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>
                Basic Info
              </span>
              <span className={`text-sm ${currentStep === 2 ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>
                Additional Details
              </span>
            </div>
            <div className="flex gap-2">
              <div className={`h-1 flex-1 rounded-full transition-all ${currentStep >= 1 ? 'bg-rose-500' : 'bg-slate-200'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${currentStep >= 2 ? 'bg-rose-500' : 'bg-slate-200'}`} />
            </div>
          </div>

          {/* Logo/Brand */}
          <div className="text-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white mb-4"
            >
              <i className="fas fa-user-plus text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Join LifeLink's emergency response network</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {currentStep === 1 ? (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Next Step <i className="fas fa-arrow-right ml-2" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <i className="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="+91 1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <i className="fas fa-map-marker-alt absolute left-3 top-3 text-slate-400" />
                    <textarea
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Your full address"
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Blood Group
                  </label>
                  <div className="relative">
                    <i className="fas fa-tint absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500" />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all cursor-pointer"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="AP">A+</option>
                      <option value="AN">A-</option>
                      <option value="BP">B+</option>
                      <option value="BN">B-</option>
                      <option value="OP">O+</option>
                      <option value="ON">O-</option>
                      <option value="ABP">AB+</option>
                      <option value="ABN">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-rose-500 text-rose-500 font-semibold py-3 rounded-xl hover:bg-rose-50 transition-all duration-300"
                  >
                    <i className="fas fa-arrow-left mr-2" /> Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 relative overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        Register <i className="fas fa-user-plus ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-rose-500 hover:text-rose-600 font-semibold">
                Sign In
              </Link>
            </p>
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-center text-slate-400 mt-6"
          >
            By registering, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;