import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'About', href: '/about' },
    {
      name: 'Services',
      dropdown: [
        { name: ' Progress Tracking', href: '/progress' },
        { name: ' Skill Gap Analysis', href: '/skill-gap' },
        { name: 'Recommendations', href: '/Recommendations' }
      ]
    },
    { name: 'Contact', href: '#contact' }
  ];

  const toggleMobile = () => setIsOpen(!isOpen);
  const closeMobile = () => setIsOpen(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 rounded-b-xl shadow-md'
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <a href="#" className="flex items-center">
              <div className="w-fit h-fit p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LOGO</span>
              </div>
              <span className={`ml-2 text-2xl font-bold transition-colors tracking-tight ${isScrolled ? 'text-gray-900' : 'text-sky-600'
                }`}>
                <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                  JobFit
                </span>
                <span className="ml-1 text-2xl font-bold text-purple-800">AI</span>
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ">
            <div className="flex items-center space-x-1">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  <motion.a
                    href={item.href}
                    whileHover={{ y: -2 }}
                    onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center  hover:font-bold   ${isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-white/10'
                      }`}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className="ml-1 mt-0.5 w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </motion.a>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.dropdown && activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setActiveDropdown(index)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                      >
                        {item.dropdown.map((dropItem) => (
                          <motion.a
                            key={dropItem.name}
                            href={dropItem.href}
                            whileHover={{ x: 4 }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <ChevronRight className="mr-1 w-4 h-4 inline" />  {dropItem.name}
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobile}
              className={`p-2 rounded-lg transition-colors ${isScrolled
                ? 'text-gray-700 hover:bg-violate-50 hover:text-100'
                : 'text-slate-500 hover:bg-white/10'
                }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.name}>
                    <motion.a
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      href={item.href}
                      onClick={closeMobile}
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                    >
                      {item.name}
                    </motion.a>

                    {/* Mobile Dropdown */}
                    {item.dropdown && (
                      <div className="ml-4 space-y-1">
                        {item.dropdown.map((dropItem, dropIndex) => (
                          <motion.a
                            key={dropItem.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.1) + (dropIndex * 0.05) }}
                            href={dropItem.href}
                            onClick={closeMobile}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          ><ChevronRight className="mr-1 w-4 h-4 inline" />  {dropItem.name}
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg mx-4"
                  onClick={closeMobile}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;