import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../css/BloodNeed.css';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const BloodNeed = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    hospitalName: "",
    city: "",
    units: 1,
    bloodGroup: "",
    emergencyLevel: "medium",
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
    if (!formData.patientName.trim()) newErrors.patientName = "Patient Name is required";
    if (!formData.hospitalName.trim()) newErrors.hospitalName = "Hospital name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Please select blood group";
    if (formData.units < 1) newErrors.units = "At least 1 unit is required";

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
      const userStr = localStorage.getItem('lifelink_user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) {
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }

      const res = await api.post('/blood', formData);

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
      const userStr = localStorage.getItem('lifelink_user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user) {
        setFormData({
          patientName: user.name || "",
          city: user.city || "",
          bloodGroup: user.bloodGroup || "",
          hospitalName: formData.hospitalName,
          units: 1,
          emergencyLevel: "medium"
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
      patientName: "",
      hospitalName: "",
      city: "",
      units: 1,
      bloodGroup: "",
      emergencyLevel: "medium"
    });
    setErrors({});
    toast.success("Form reset successfully");
  };

  const bloodGroups = [
    { value: "A+", label: "A+", color: "#e74c3c" },
    { value: "A-", label: "A-", color: "#e67e22" },
    { value: "B+", label: "B+", color: "#3498db" },
    { value: "B-", label: "B-", color: "#2980b9" },
    { value: "O+", label: "O+", color: "#27ae60" },
    { value: "O-", label: "O-", color: "#2ecc71" },
    { value: "AB+", label: "AB+", color: "#9b59b6" },
    { value: "AB-", label: "AB-", color: "#8e44ad" }
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
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    className={`form-input ${errors.patientName ? 'error' : ''}`}
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={handleChange}
                  />
                  {errors.patientName && <span className="error-message">{errors.patientName}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-hospital"></i>
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    className={`form-input ${errors.hospitalName ? 'error' : ''}`}
                    placeholder="Name of the hospital"
                    value={formData.hospitalName}
                    onChange={handleChange}
                  />
                  {errors.hospitalName && <span className="error-message">{errors.hospitalName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-city"></i>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
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

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-cubes"></i>
                    Units Required
                  </label>
                  <input
                    type="number"
                    name="units"
                    min="1"
                    className={`form-input ${errors.units ? 'error' : ''}`}
                    value={formData.units}
                    onChange={handleChange}
                  />
                  {errors.units && <span className="error-message">{errors.units}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-exclamation-triangle"></i>
                    Emergency Level
                  </label>
                  <select
                    name="emergencyLevel"
                    className="form-select"
                    value={formData.emergencyLevel}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
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