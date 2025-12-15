
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/RegisterPage.css';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Building,
  GraduationCap,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Star,
  FileText,
  Calendar,
  Target,
  BookOpen,
  Award,
  MapPin,
  Users,
  Globe
} from 'lucide-react';

export function RegisterPage() {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    
    // Step 2: Role Specific Data
    // User fields
    skills: [],
    educationLevel: '',
    resume: null,
    interests: [],
    
    // Organizer fields
    organizationName: '',
    organizationType: '',
    organizationDescription: '',
    organizationLogo: null,
    officialEmailDomain: '',
    
    // Step 3: Terms
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  // Available options
  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Vue.js', 'Angular',
    'UI/UX Design', 'Graphic Design', 'Photography', 'Video Editing',
    'Data Analysis', 'Machine Learning', 'AI', 'Blockchain',
    'Project Management', 'Leadership', 'Communication', 'Marketing'
  ];

  const interestOptions = [
    'Technology', 'Sports', 'Cultural', 'Hackathon', 'Research', 'Music',
    'Art', 'Literature', 'Entrepreneurship', 'Social Impact', 'Environment'
  ];

  const organizationTypes = [
    { value: 'university', label: 'University' },
    { value: 'college', label: 'College' },
    { value: 'school', label: 'School' },
    { value: 'club', label: 'Club' }
  ];

  const educationLevels = [
    'High School',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Professional Certification',
    'Bootcamp Graduate'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormError('');
  };

  const handleArrayChange = (field, value, action = 'toggle') => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (action === 'toggle') {
        return {
          ...prev,
          [field]: currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value]
        };
      }
      return prev;
    });
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
          return 'Please fill in all fields';
        }
        if (formData.password !== formData.confirmPassword) {
          return 'Passwords do not match';
        }
        if (formData.password.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;
      case 2:
        if (formData.role === 'user') {
          if (formData.skills.length === 0 || !formData.educationLevel || formData.interests.length === 0) {
            return 'Please complete all user fields';
          }
        } else {
          if (!formData.organizationName || !formData.organizationType || !formData.organizationDescription || !formData.officialEmailDomain) {
            return 'Please complete all organization fields';
          }
        }
        return null;
      case 3:
        if (!formData.acceptTerms) {
          return 'Please accept the terms and conditions';
        }
        return null;
      default:
        return null;
    }
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setFormError(error);
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      setFormError('');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFormError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const error = validateStep(currentStep);
    if (error) {
      setFormError(error);
      return;
    }

    // Prepare user data based on role
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'user' ? {
        skills: formData.skills,
        educationLevel: formData.educationLevel,
        interests: formData.interests
      } : {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        organizationDescription: formData.organizationDescription,
        officialEmailDomain: formData.officialEmailDomain
      })
    };

    const result = await register(userData);

    if (result.success) {
      // Show success message briefly, then redirect
      setCurrentStep(4); // Success step
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setFormError(result.error);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step < currentStep
                ? 'bg-green-500 text-white'
                : step === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-blue-200'
            }`}
            animate={{
              scale: step === currentStep ? 1.1 : 1,
              boxShadow: step === currentStep ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 0px rgba(59, 130, 246, 0)'
            }}
          >
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </motion.div>
          {step < 3 && (
            <div className={`w-8 h-1 mx-2 rounded transition-all ${
              step < currentStep ? 'bg-green-500' : 'bg-white/20'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );


  const renderStep1 = () => (
    <motion.div
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="form-step"
    >
      <div className="step-title">Create Your Account</div>
      <div className="step-subtitle">Let's start with your basic information</div>

      {/* Full Name */}
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <div className="input-container">
          <User className="input-icon" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>


      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email Address</label>
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

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="input-container">
          <Lock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Create a password"
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

      {/* Confirm Password */}
      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <div className="input-container">
          <Lock className="input-icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="password-toggle"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>


      {/* Role Selection */}
      <div className="form-group">
        <label className="form-label">Select Your Role</label>
        <div className="role-selection">
          {[
            { value: 'user', label: 'User', icon: User, desc: 'Participate in events' },
            { value: 'organization', label: 'Organizer', icon: Building, desc: 'Manage events & organizations' }
          ].map(({ value, label, icon: Icon, desc }) => (
            <motion.button
              key={value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: value }))}
              className={`role-button ${formData.role === value ? 'active' : 'inactive'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="role-icon" />
              <div className="role-description">{label}</div>
              <div className="role-description">{desc}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {formData.role === 'user' ? 'Your Profile Details' : 'Organization Details'}
        </h2>
        <p className="text-blue-200">
          {formData.role === 'user' 
            ? 'Help us personalize your experience' 
            : 'Tell us about your organization'
          }
        </p>
      </div>

      {formData.role === 'user' ? (
        // User Fields
        <>
          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">
              Skills (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {skillOptions.map((skill) => (
                <motion.button
                  key={skill}
                  type="button"
                  onClick={() => handleArrayChange('skills', skill)}
                  className={`p-2 rounded-lg text-sm border transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-blue-500/30 border-blue-400 text-white'
                      : 'bg-white/5 border-white/20 text-blue-200 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Education Level
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select your education level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level} className="bg-slate-800">{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Upload Resume (PDF)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 transition-all"
              />
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-3">
              Interests (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => handleArrayChange('interests', interest)}
                  className={`p-2 rounded-lg text-sm border transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-purple-500/30 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-blue-200 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Organizer Fields
        <>
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Organization Name
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter organization name"
                required
              />
            </div>
          </div>

          {/* Organization Type */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Organization Type
            </label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select organization type</option>
                {organizationTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-800">{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Organization Description */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Organization Description
            </label>
            <textarea
              name="organizationDescription"
              value={formData.organizationDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
              placeholder="Describe your organization and its mission"
              required
            />
          </div>

          {/* Organization Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Upload Organization Logo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'organizationLogo')}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 transition-all"
              />
              <Upload className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            </div>
          </div>

          {/* Official Email Domain */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Official Email Domain
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="email"
                name="officialEmailDomain"
                value={formData.officialEmailDomain}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="your-organization.edu"
                required
              />
            </div>
            <p className="text-xs text-blue-300 mt-1">
              This will be used for intra-event verification
            </p>
          </div>
        </>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Almost Done!</h2>
        <p className="text-blue-200">Review and accept our terms to complete registration</p>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Terms and Conditions</h3>
        <div className="text-sm text-blue-200 space-y-2 max-h-32 overflow-y-auto">
          <p>By creating an account, you agree to our terms and conditions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>You will provide accurate and truthful information</li>
            <li>You will respect other users and maintain professional conduct</li>
            <li>You will comply with all applicable laws and regulations</li>
            <li>Your data will be handled according to our privacy policy</li>
            <li>You will not use the platform for any illegal activities</li>
          </ul>
        </div>
      </div>

      {/* Accept Terms */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleInputChange}
          className="w-5 h-5 mt-1 bg-white/10 border border-white/20 rounded text-blue-500 focus:ring-blue-400"
        />
        <label className="text-sm text-blue-200">
          I have read and agree to the{' '}
          <button className="text-blue-300 hover:text-white underline">
            Terms and Conditions
          </button>{' '}
          and{' '}
          <button className="text-blue-300 hover:text-white underline">
            Privacy Policy
          </button>
        </label>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 1 }}
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to SkillSphere!</h2>
        <p className="text-blue-200">
          Your account has been created successfully. Redirecting to dashboard...
        </p>
      </div>
    </motion.div>
  );


  return (
    <div className="register-page">
      {/* Animated background elements */}
      <div className="register-background">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="register-particle"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="register-content">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="register-form-container"
        >
          {/* Header */}
          <div className="register-header">
            <div className="register-mobile-header">
              <div className="register-logo">SS</div>
              <h1 className="register-title">SkillSphere</h1>
            </div>
          </div>


          {/* Step Indicator */}
          {currentStep <= 3 && (
            <div className="step-indicator">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <motion.div
                    className={`step-circle ${
                      step < currentStep
                        ? 'completed'
                        : step === currentStep
                        ? 'active'
                        : 'pending'
                    }`}
                    animate={{
                      scale: step === currentStep ? 1.1 : 1,
                      boxShadow: step === currentStep ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 0px rgba(59, 130, 246, 0)'
                    }}
                  >
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </motion.div>
                  {step < 3 && (
                    <div className={`step-connector ${
                      step < currentStep ? 'completed' : 'pending'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}


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

          {/* Form Steps */}
          <form onSubmit={handleSubmit} className="register-form">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderSuccess()}
            </AnimatePresence>


            {/* Navigation Buttons */}
            {currentStep <= 3 && (
              <div className="navigation-buttons">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="nav-button back"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                )}
                
                <motion.button
                  type={currentStep === 3 ? 'submit' : 'button'}
                  onClick={currentStep < 3 ? nextStep : undefined}
                  disabled={isLoading}
                  className="nav-button next"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : currentStep === 3 ? (
                    'Create Account'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </form>

          {/* Login Link */}
          {currentStep <= 3 && (
            <div className="login-link">
              <p className="login-text">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="login-button"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
