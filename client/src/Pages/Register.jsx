import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register=()=> {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
        >
          {/* Full Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <motion.div
              variants={inputVariants}
              animate={focusedField === 'fullName' ? 'focused' : 'unfocused'}
              className="relative"
            >
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter your full name"
                required
              />
            </motion.div>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <motion.div
              variants={inputVariants}
              animate={focusedField === 'email' ? 'focused' : 'unfocused'}
              className="relative"
            >
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <motion.div
              variants={inputVariants}
              animate={focusedField === 'password' ? 'focused' : 'unfocused'}
              className="relative"
            >
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <motion.div
              variants={inputVariants}
              animate={focusedField === 'confirmPassword' ? 'focused' : 'unfocused'}
              className="relative"
            >
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField('')}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          >
            Create Account
            <motion.div
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>

          {/* Login Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-600 mt-6"
          >
            Already have an account?{' '}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Sign in
            </motion.a>
          </motion.p>
        </motion.form>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-6"
        >
          By creating an account, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms</a> and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Register;