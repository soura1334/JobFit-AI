import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { BookOpen } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleClickToDashboard = () => {
    navigate('/dashboard');
  };
  const handleClickToAbout = () => {
    navigate('/about');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-pink-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Background Image */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/55 via-purple-600/55 to-purple-700/55 z-10"></div>
        <img src="https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hero Image" className="w-full h-full object-fit opacity-0% z-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 opacity:90%">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white space-y-8"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span className="block">Bridge Your</span>
              <span className="md:block bg-gradient-to-r from-pink-300 to-white bg-clip-text text-transparent">
                Skill Gap,
              </span>
              <span className="inline md:block">Land Your</span>
              <span className=" block bg-gradient-to-r from-pink-300 to-white bg-clip-text text-transparent">
                Dream Job
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-purple-100 max-w-2xl leading-relaxed"
            >
              AI-powered resume analysis that identifies missing skills and creates
              personalized learning paths for your target role.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                onClick={handleClickToDashboard}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                Get Started Free
              </motion.button>


              <motion.button
                onClick={handleClickToAbout}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm hover:border-white/50 transition-all duration-300 cursor-pointer"
              >
                <BookOpen size={20} />
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Hero Image - Hidden on mobile, visible on desktop */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block relative"
          >
            <motion.div
              animate={floatingAnimation}
              className="relative"
            >
              {/* Main Hero Image */}
              <div className="relative shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Hero Image"
                  className="w-full h-[500px] object-cover rounded-2xl" />

                {/* AI Powered Badge - Floating */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, -5]
                  }}
                  transition={{
                    delay: 1.4,
                    duration: 0.6,
                    rotate: {
                      duration: 3.5,
                      repeat: 0,
                      ease: "easeInOut",
                      delay: 0.5
                    }
                  }}
                  className="absolute top-8 -right-8 px-6 transform bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-4 shadow-xl backdrop-blur-sm bg-opacity-95"
                >
                  <div className="text-white text-center">
                    <div className="text-xl font-bold">AI</div>
                    <div className="text-xs">Powered</div>
                  </div>
                </motion.div>

                {/* Success Rate Badge - Floating */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, 5]
                  }}
                  transition={{
                    delay: 1.6,
                    duration: 0.6,
                    rotate: {
                      duration: 3.5,
                      repeat: 0,
                      ease: "easeInOut",
                      delay: 0.5
                    }

                  }}
                  className="absolute top-20 -left-6 px-6 transform bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-4 shadow-xl backdrop-blur-sm bg-opacity-95"
                >
                  <div className="text-white text-center">
                    <div className="text-xl font-bold">95%</div>
                    <div className="text-xs">Success Rate</div>
                  </div>
                </motion.div>

                {/* Jobs Matched Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, -12]
                  }}
                  transition={{
                    delay: 1.8,
                    duration: 0.6,
                    rotate: {
                      duration: 3.5,
                      repeat: 0,
                      ease: "easeInOut",
                      delay: 0.5
                    }
                  }}
                  className="absolute bottom-16 -right-4 px-6 transform bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 shadow-xl backdrop-blur-sm bg-opacity-95"
                >
                  <div className="text-white text-center">
                    <div className="text-xl font-bold">10K+</div>
                    <div className="text-xs">Jobs Matched</div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements around the image */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20% blur-xl"></div>
              <div className="absolute -bottom-1 -right-6 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20% blur-lg"></div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  x: [0, 10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute top-3/7 -left-8 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-50 blur-sm"
              ></motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-1/4 -right-10 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-25 blur-md"
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile-specific content overlay */}
        <div className="lg:hidden mt-8 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center space-x-4 px-4"
          >
            {/* Success Rate */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-transparent rounded-lg px-4 py-2 "
            >
              <div className="text-2xl font-bold text-white/95 drop-shadow-sm">95%</div>
              <div className="text-sm font-semibold text-green-300">Success Rate</div>
            </motion.div>

            {/* Jobs Matched */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-transparent rounded-lg px-4 py-2 "
            >
              <div className="text-2xl font-bold text-white/95 drop-shadow-sm">10K+</div>
              <div className="text-sm font-semibold text-blue-300">Jobs Matched</div>
            </motion.div>

            {/* AI Powered */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-transparent rounded-lg px-4 py-2"
            >
              <div className="text-2xl font-bold text-white/95 drop-shadow-sm">AI</div>
              <div className="text-sm font-semibold text-red-300">Powered</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;