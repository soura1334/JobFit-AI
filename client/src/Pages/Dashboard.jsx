import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Link } from 'react-router-dom';
import { useAuth } from '../hook/auth';

import {
  BarChart3,
  Briefcase,
  Target,
  Bot,
  User,
  // Bell,
  Search,
  Menu,
  X,
  Sparkles,
  LogOut
} from 'lucide-react';

// import Footer from '../Components/Footer';
import JobSection from '../Components/DashboardParts/JobSection';
import RoadmapSection from '../Components/DashboardParts/RoadmapSection';
import AIAgentSection from '../Components/DashboardParts/AIAgentSection';
import ProfileManagement from '../Components/DashboardParts/ProfileManagement';

const Dashboard = () => {
  const {user, logout } = useAuth();


  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'jobs', name: 'Job Recommendations', icon: Briefcase },
    { id: 'roadmap', name: 'Learning Roadmap', icon: Target },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Bot },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  const LogoutButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={logout}
      className="inline-flex items-center justify-center w-full px-6 py-2 rounded-xl md:rounded-lg bg-gradient-to-br from-rose-400 via-pink-600 to-red-600 text-white text-lg md:text-base font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <LogOut className="w-5 h-5 mr-2 text-white" />
      Logout
    </motion.button>
  );


  const OverviewSection = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'User'}!  👋</h1>
            <p className="text-blue-100 text-lg">Ready to accelerate your career journey today?</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-blue-100">Profile Strength</div>
            </div>
          </div>
        </div>
      </motion.div>

      <JobSection />
      <RoadmapSection />
      <AIAgentSection />


    </div>
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'jobs':
        // return <JobSection />;
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <JobSection />
          </div>
        );
      case 'roadmap':
        // return <RoadmapSection />;
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <RoadmapSection />
          </div>
        );
      case 'ai-assistant':
        // return <AIAgentSection />;
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <AIAgentSection />
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <ProfileManagement />
          </div>
        );
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center ml-2 md:ml-0">
                <Link to="/" className="flex items-center">
                  <img src="logo.png" alt="logo" className="h-10" />
                  <span className="ml-2 text-xl font-bold">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      JobFit
                    </span>
                    <span className="text-purple-500">AI</span>
                    <Sparkles className="w-3 h-3 inline-block mb-4 text-purple-500" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, skills..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button> */}
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)||"U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16"
        >
          <div className="p-6">
            <nav className="space-y-2 fixed">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              <LogoutButton />
            </nav>
          </div>
        </motion.div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 z-50"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="md:hidden fixed left-0 top-0 w-64 h-full bg-white z-50 shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">JF</span>
                      </div>
                      <span className="ml-2 text-xl font-bold">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                          JobFit
                        </span>
                        <span className="text-purple-500">AI</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}
                    <LogoutButton />
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveSection()}
          </motion.div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default Dashboard;