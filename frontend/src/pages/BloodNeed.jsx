import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../css/BloodNeed.css';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const BloodNeed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hospital: "",
    phone: "",
    address: "",
    email: "",
    bloodGroup: ""
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    if (!formData.hospital.trim()) newErrors.hospital = "Hospital name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Please select blood group";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBloodNeed = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('token'));
      if (!user || !user.existingUser) {
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }

      const id = user.existingUser._id;
      const payload = {
        ...formData,
        isConfirmed: false,
        createdBy: id,
        isAccepted: false
      };

      const res = await axios.post('http://localhost:8080/api/v1/blood/blood-need', payload);
      
      if (res.data.success) {
        toast.success(res.data.message || "Blood request submitted successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/donate-blood');
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleYourself = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('token'));
      if (user && user.existingUser) {
        setFormData({
          address: user.existingUser.address || "",
          name: user.existingUser.name || "",
          bloodGroup: user.existingUser.bloodGroup || "",
          email: user.existingUser.email || "",
          phone: user.existingUser.phone || "",
          hospital: formData.hospital // Preserve hospital field
        });
        toast.success("Profile details loaded successfully!");
      } else {
        toast.error("User not found. Please login again.");
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user data");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      hospital: "",
      phone: "",
      address: "",
      email: "",
      bloodGroup: ""
    });
    setErrors({});
    toast.success("Form reset successfully");
  };

  const bloodGroups = [
    { value: "AP", label: "A+", color: "#e74c3c" },
    { value: "AN", label: "A-", color: "#e67e22" },
    { value: "BP", label: "B+", color: "#3498db" },
    { value: "BN", label: "B-", color: "#2980b9" },
    { value: "OP", label: "O+", color: "#27ae60" },
    { value: "ON", label: "O-", color: "#2ecc71" },
    { value: "ABP", label: "AB+", color: "#9b59b6" },
    { value: "ABN", label: "AB-", color: "#8e44ad" }
  ];

  return (
    <>
      <Navbar />
      <div className="blood-need-container">
        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="success-overlay"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="success-card"
              >
                <i className="fas fa-check-circle"></i>
                <h3>Request Submitted!</h3>
                <p>Your blood request has been submitted successfully. You will be notified when someone responds.</p>
                <div className="loader"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="blood-need-wrapper">
          {/* Left Side - Image Section */}
          <motion.div 
            className="blood-need-image-section"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="image-content">
              <motion.div 
                className="floating-image"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <img 
                  src="https://img.freepik.com/free-vector/flat-design-volunteer-donating-blood_23-2148273548.jpg" 
                  alt="Blood Donation" 
                />
              </motion.div>
              <div className="image-stats">
                <div className="stat-card">
                  <i className="fas fa-tint"></i>
                  <div>
                    <h4>Emergency Response</h4>
                    <p>Average response time: 30 mins</p>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-users"></i>
                  <div>
                    <h4>Active Donors</h4>
                    <p>12,000+ ready to help</p>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-hospital"></i>
                  <div>
                    <h4>Partner Hospitals</h4>
                    <p>320+ across the city</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form Section */}
          <motion.div 
            className="blood-need-form-section"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="form-header">
              <div className="header-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h2>Request Blood</h2>
              <p>Fill in the details below to request blood. Our team will connect you with donors nearby.</p>
            </div>

            <div className="action-buttons">
              <motion.button 
                className="action-btn reset-btn"
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-undo-alt"></i>
                Reset Form
              </motion.button>
              <motion.button 
                className="action-btn self-btn"
                onClick={handleYourself}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-user-check"></i>
                For Yourself
              </motion.button>
            </div>

            <form onSubmit={handleBloodNeed} className="blood-need-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-user"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-phone-alt"></i>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-tint"></i>
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    className={`form-select ${errors.bloodGroup ? 'error' : ''}`}
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(bg => (
                      <option key={bg.value} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-hospital"></i>
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospital"
                  className={`form-input ${errors.hospital ? 'error' : ''}`}
                  placeholder="Name of the hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                />
                {errors.hospital && <span className="error-message">{errors.hospital}</span>}
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-map-marker-alt"></i>
                  Address
                </label>
                <textarea
                  name="address"
                  className={`form-textarea ${errors.address ? 'error' : ''}`}
                  placeholder="Full address for delivery/emergency"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Submit Blood Request
                  </>
                )}
              </motion.button>
            </form>

            {/* Important Note */}
            <div className="important-note">
              <i className="fas fa-info-circle"></i>
              <div>
                <strong>Important Note:</strong>
                <p>Your request will be shared with verified donors in your area. Please keep your phone accessible for immediate confirmation.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BloodNeed;