
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LoginPage.css';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Calendar, 
  Users, 
  Building,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      // Redirect based on role
      switch (result.data.user.role) {
        case 'user':
          navigate('/dashboard');
          break;
        case 'organizer':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      setFormError(result.error);
    }
  };

  // 3D floating elements animations
  const floatingElements = [
    { icon: Calendar, delay: 0, x: -50, y: -30 },
    { icon: Users, delay: 0.5, x: 60, y: -50 },
    { icon: Building, delay: 1, x: -30, y: 40 },
    { icon: User, delay: 1.5, x: 50, y: 30 }
  ];


  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-background">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="background-particle"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="login-content">

        {/* Left Side - 3D Animated Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="login-illustration"
        >
          <div className="relative h-96">
            {/* Central Logo */}
            <motion.div
              className="login-logo-3d"
              animate={{ 
                rotateY: [0, 360],
                rotateX: [0, 15, 0]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              SS
            </motion.div>

            {/* Floating Elements */}
            {floatingElements.map(({ icon: Icon, delay, x, y }, index) => (
              <motion.div
                key={index}
                className="floating-element"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: [0, x, 0],
                  y: [0, y, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  delay,
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ left: '50%', top: '50%' }}
              >
                <Icon className="floating-icon" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="illustration-text"
          >
            <h1 className="illustration-title">
              Welcome to SkillSphere
            </h1>
            <p className="illustration-subtitle">
              Your professional event management platform
            </p>
          </motion.div>
        </motion.div>


        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="login-form-section"
        >
          <div className="login-form-container">
            {/* Header */}
            <div className="mobile-header">
              <div className="mobile-logo">SS</div>
              <h1 className="mobile-title">SkillSphere</h1>
            </div>
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to your account</p>
            </div>


            {/* Error Messages */}
            <AnimatePresence>
              {(error || formError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="error-message"
                >
                  {error || formError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>
                <div className="input-container">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>


              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">
                  Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>


              {/* Role Selector */}
              <div className="form-group">
                <label className="form-label">
                  Select Role
                </label>
                <div className="role-selector">
                  {[
                    { value: 'user', label: 'User', icon: User },
                    { value: 'organizer', label: 'Organizer', icon: Building }
                  ].map(({ value, label, icon: Icon }) => (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: value }))}
                      className={`role-button ${formData.role === value ? 'active' : 'inactive'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="role-icon" />
                      <div>{label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>


              {/* Remember Me & Forgot Password */}
              <div className="remember-forgot">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="remember-checkbox"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>
              </div>


              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="submit-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="loading-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="register-link">
              <p className="register-text">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="register-button"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
