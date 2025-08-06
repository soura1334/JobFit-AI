import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    Mail,
    Phone,
    MapPinned,
    Sparkles,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    ArrowUp
} from 'lucide-react';

// Create MotionLink component for internal navigation
const MotionLink = motion(Link);

// Create MotionA component for external links
const MotionA = motion.a;

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Control button visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px (you can adjust this value)
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Our Team', path: '/team' },
            { name: 'Careers', path: '/careers' },
            { name: 'Press', path: '/press' }
        ],
        // services: [
        //     { name: 'Progress Tracking', path: '/progress' },
        //     { name: 'Skill Gap Analysis', path: '/skill-gap' },
        //     { name: 'Recommendations', path: '/recommendations' },
        //     { name: 'Career Insights', path: '/insights' }
        // ],
        resources: [
            { name: 'Blog', path: '/blog' },
            { name: 'Help Center', path: '/help' }
        ],
        legal: [
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Cookie Policy', path: '/cookies' },
            { name: 'GDPR', path: '/gdpr' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Instagram, href: '#', label: 'Instagram' }
    ];

    const contactInfo = [
        { icon: Mail, text: 'jobfitai@gmail.com', href: 'mailto:jobfitai@gmail.com' },
        { icon: Phone, text: '+91 1800-123-4567', href: 'tel:+911800123456' },
        {
            icon: MapPinned, 
            text: 'Kalyani, West Bengal, India 741235', 
            href: "https://maps.app.goo.gl/PqRhSqFXPsNuJsxf8"
        }
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-600/20"></div>
            </div>

            {/* Main Footer Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {/* Logo */}
                            <Link to="/" className="flex items-center mb-6">
                                <div className="w-fit h-fit p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <img src="logo.png" alt="logo" className="h-10" />
                                </div>
                                <span className="ml-2 text-2xl font-bold tracking-tight">
                                    <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                                        JobFit
                                    </span>
                                    <span className="ml-1 text-2xl font-bold text-purple-400">AI<Sparkles className='w-3 h-3 inline-block mb-5' /></span>
                                </span>
                            </Link>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Empowering careers through AI-driven insights. Discover your potential, bridge skill gaps, and achieve your professional goals.
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-4 justify-evenly">
                                {socialLinks.map((social, index) => (
                                    <MotionA
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center  hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={18} />
                                    </MotionA>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-3 lg:grid-cols-3 lg:col-span-3 gap-0 md:gap-4">
                        {/* Company Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-base md:text-lg font-semibold mb-4 ml-0 md:ml-2 text-white">Company</h3>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <MotionLink
                                            to={link.path}
                                            whileHover={{ x: 4 }}
                                            className="text-gray-300 hover:text-white text-sm md:text-base transition-colors duration-200 flex items-start group"
                                        >
                                            <ChevronRight className="md:w-4 w-3 md:h-4 h-3 mr-1 hidden group-hover:inline-block transition-all" />
                                            {link.name}
                                        </MotionLink>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Services Links */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-semibold mb-4 ml-0 md:ml-2 text-white">Services</h3>
                            <ul className="space-y-2">
                                {footerLinks.services.map((link) => (
                                    <li key={link.name}>
                                        <MotionLink
                                            to={link.path}
                                            whileHover={{ x: 4 }}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <ChevronRight className="md:w-4 w-3 md:h-4 h-3 mr-1 hidden group-hover:inline-block transition-all" />
                                            {link.name}
                                        </MotionLink>
                                    </li>
                                ))}
                            </ul>
                        </motion.div> */}

                        {/* Resources Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-base md:text-lg  font-semibold mb-4 ml-0 md:ml-2 text-white">Resources</h3>
                            <ul className="space-y-2">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <MotionLink
                                            to={link.path}
                                            whileHover={{ x: 4 }}
                                            className="text-gray-300 hover:text-white text-sm md:text-base transition-colors duration-200 flex items-center group"
                                        >
                                            <ChevronRight className="md:w-4 w-3 md:h-4 h-3 mr-1 hidden group-hover:inline-block transition-all" />
                                            {link.name}
                                        </MotionLink>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-base md:text-lg font-semibold mb-4 ml-0 md:ml-2 text-white">Contact</h3>
                            {/* Contact Info */}
                            <div className="space-y-3">
                                {contactInfo.map((contact, index) => (
                                    <MotionA
                                        key={index}
                                        href={contact.href}
                                        target={contact.href.startsWith('http') ? '_blank' : '_self'}
                                        rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        whileHover={{ x: 4 }}
                                        className="flex items-start text-gray-300 hover:text-white text-sm md:text-base transition-colors duration-200"
                                    >
                                        <contact.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-2 md:mr-3 mt-0.5 md:mt-0 text-blue-400 flex-shrink-0" />
                                        <span className="break-words">{contact.text}</span>
                                    </MotionA>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="border-t border-white/70 mt-6 pt-2"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <p className="text-gray-400 text-sm ml-1 md:ml-6">
                            © {new Date().getFullYear()} JobFitAI. All rights reserved.
                        </p>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center md:justify-end space-x-6">
                            {footerLinks.legal.map((link, index) => (
                                <MotionLink
                                    key={link.name}
                                    to={link.path}
                                    whileHover={{ y: -1 }}
                                    className="text-gray-400 hover:text-white text-sm  last:mr-12 transition-colors duration-200"
                                >
                                    {link.name}
                                </MotionLink>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-10 right-8 w-12 h-12 bg-gradient-to-r from-blue-500/90 to-purple-600/80 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer "
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;