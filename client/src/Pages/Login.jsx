import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

const Login = () => {

    // Create MotionLink component
    const MotionLink = motion(Link);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sign in submitted:', formData);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue to your account</p>
                </motion.div>

                {/* Form */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSubmit}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                >
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
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
                                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </motion.div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    {/* <div className="flex items-center justify-between mb-6">
                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </motion.label>
                        <MotionLink
                            to="#"
                            whileHover={{ scale: 1.05 }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Forgot password?
                        </MotionLink>
                    </div> */}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group mb-6"
                    >
                        Sign In
                        <motion.div
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.div>
                    </motion.button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>

                    </div>


                    {/* Register Link */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center text-gray-600"
                    >
                        Don't have an account?{' '}
                        <MotionLink
                            to="/register"
                            whileHover={{ scale: 1.05 }}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Create one
                        </MotionLink>
                    </motion.p>
                </motion.form>

                {/* Footer */}
                <motion.p
                    variants={itemVariants}
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    By signMotionLinking in, you agree to our{' '}
                    <MotionLink to="/Terms" className="text-blue-600 hover:text-blue-700">Terms</MotionLink> and{' '}
                    <MotionLink to="/Privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</MotionLink>
                </motion.p>
            </motion.div>
        </div>
    );
}

export default Login;