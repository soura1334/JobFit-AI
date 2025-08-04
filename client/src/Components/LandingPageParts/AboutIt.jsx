import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Upload, Target, BookOpen, Zap, Users, TrendingUp, Calendar, Gift } from 'lucide-react';

const AboutIt = () => {
    const [visibleCards, setVisibleCards] = useState([]);

    useEffect(() => {
        // Stagger the appearance of cards
        const timer = setInterval(() => {
            setVisibleCards(prev => {
                if (prev.length < 3) {
                    return [...prev, prev.length];
                }
                clearInterval(timer);
                return prev;
            });
        }, 300);

        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            id: 1,
            title: "Upload Resume",
            description: "Upload your resume in PDF or DOCX format. Our AI extracts skills, experience, and projects.",
            Icon: Upload,
            color: "from-pink-400 to-pink-600"
        },
        {
            id: 2,
            title: "Select Target Role",
            description: "Choose your desired job role. We analyze real job postings to identify required skills.",
            Icon: Target,
            color: "from-purple-400 to-purple-600"
        },
        {
            id: 3,
            title: "Get Learning Path",
            description: "Receive personalized course recommendations and a weekly upskilling roadmap.",
            Icon: BookOpen,
            color: "from-blue-400 to-blue-600"
        }
    ];

    const benefits = [
        {
            icon: Zap,
            title: "AI-powered skill matching with 95% accuracy",
            color: "text-yellow-500"
        },
        {
            icon: Users,
            title: "Access to 10,000+ curated learning resources",
            color: "text-blue-500"
        },
        {
            icon: TrendingUp,
            title: "Real-time job market insights and trends",
            color: "text-green-500"
        },
        {
            icon: Calendar,
            title: "Personalized weekly study plans and progress tracking",
            color: "text-purple-500"
        },
        {
            icon: Gift,
            title: "Free for students and job seekers",
            color: "text-pink-500"
        }
    ];

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const benefitVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* How It Works Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        How It Works
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Simple steps to identify and bridge your skill gaps
                    </p>
                </motion.div>

                {/* Steps Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, index) => (
                        <AnimatePresence key={step.id}>
                            {visibleCards.includes(index) && (
                                <motion.div
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                                        {/* Step Number */}
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto`}>
                                            <span className="text-2xl font-bold text-white">{step.id}</span>
                                        </div>

                                        {/* Icon */}
                                        <div className="flex justify-center mb-4">
                                            <step.Icon className="w-12 h-12 text-gray-600" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-center leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Hover Effect */}
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 rounded-2xl`}
                                            whileHover={{ opacity: 0.05 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ))}
                </div>

                {/* Connecting Lines Animation */}
                <motion.div
                    className="hidden md:flex justify-center items-center mb-20 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 transform -translate-y-1/2" />
                    <motion.div
                        className="absolute top-1/2 left-1/4 w-3 h-3 bg-pink-400 rounded-full transform -translate-y-1/2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-400 rounded-full transform -translate-y-1/2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                </motion.div>

                {/* Why Choose Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Why Choose SkillGap Analyzer?
                    </h2>
                </motion.div>


                {/* Benefits Section */}
                <motion.div
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 grid lg:grid-cols-2 gap-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                >
                    {/* Benifit Hero Image */}
                    <motion.div
                        className="mb-8 md:mb-0 flex items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                    >
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Benefits" className="w-full rounded-3xl shadow-lg" />
                    </motion.div>

                    {/* Divider */}
                    <div className="relative md:hidden">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>

                    </div>

                    {/* Benefits List */}
                    <motion.div><div className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                custom={index}
                                variants={benefitVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                                        {benefit.title}
                                    </p>
                                </div>
                                <motion.div
                                    className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                    </motion.div>

                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Ready to Elevate Your Career?
                    </h2>
                    <motion.button
                        className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started Today
                    </motion.button>
                    <p className="text-gray-600 mt-4">
                        Join thousands of driven professionals transforming their futures.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutIt;