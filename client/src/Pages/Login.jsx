import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    
    // Create MotionLink component
    const MotionLink = motion(Link);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const validateField = (name, value) => {
        const errors = { ...fieldErrors };

        switch (name) {
            case 'email':
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!value.trim()) {
                    errors[name] = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    errors[name] = 'Please enter a valid email address';
                } else {
                    delete errors[name];
                }
                break;
            
            case 'password':
                if (!value) {
                    errors[name] = 'Password is required';
                } else if (value.length < 6) {
                    errors[name] = 'Password must be at least 6 characters';
                } else {
                    delete errors[name];
                }
                break;
            
            default:
                break;
        }

        setFieldErrors(errors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear general error when user starts typing
        if (error) setError('');
        
        // Validate field in real-time
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate all fields before submission
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key]);
        });

        // Check if there are any validation errors
        if (Object.keys(fieldErrors).length > 0) {
            setError('Please fix all validation errors before submitting');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Login successful! Redirecting...');
                
                // Use the auth context to log the user in
                login(data.token, data.user);
                
                // Redirect after a brief delay to show success message
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const getFieldBorderColor = (fieldName) => {
        if (fieldErrors[fieldName]) return 'border-red-300 focus:ring-red-500 focus:border-red-500';
        if (formData[fieldName] && !fieldErrors[fieldName]) return 'border-green-300 focus:ring-green-500 focus:border-green-500';
        return 'border-gray-200 focus:ring-blue-500 focus:border-transparent';
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
                    <motion.div
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <LogIn className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue to your account</p>
                </motion.div>

                {/* Alert Messages */}
                {error && (
                    <motion.div
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <p className="text-green-700 text-sm">{success}</p>
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSubmit}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                >
                    {/* Email Field */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address:
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <motion.input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField('')}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 bg-white/50 shadow-sm ${getFieldBorderColor('email')}`}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                        </div>
                        {fieldErrors.email && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                        )}
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password:
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <motion.input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField('')}
                                className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 bg-white/50 shadow-sm ${getFieldBorderColor('password')}`}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={loading}
                            >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </motion.button>
                        </div>
                        {fieldErrors.password && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                        )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading || Object.keys(fieldErrors).length > 0}
                        className={`w-full py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group ${
                            loading || Object.keys(fieldErrors).length > 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                        }`}
                        whileHover={loading ? {} : { scale: 1.02, y: -2 }}
                        whileTap={loading ? {} : { scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        {loading ? (
                            <>
                                <motion.div
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <motion.div
                                    className="ml-2"
                                    animate={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </>
                        )}
                    </motion.button>

                    {/* Register Link */}
                    <motion.p
                        className="text-center text-gray-600 mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        Don't have an account?{' '}
                        <MotionLink
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Create one
                        </MotionLink>
                    </motion.p>
                </motion.form>

                {/* Footer */}
                <motion.p
                    className="text-center text-sm text-gray-500 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    By continuing, you agree to our{' '}
                    <MotionLink
                        to="/terms"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Terms
                    </MotionLink> and{' '}
                    <MotionLink
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Privacy Policy
                    </MotionLink>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;