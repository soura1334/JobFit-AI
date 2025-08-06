import React from 'react';
import { motion } from "motion/react";
import {
  CheckCircle,
  Calendar,
  Clock,
  Zap,
  BookOpen,
  Target,
  Trophy,
  PlayCircle
} from 'lucide-react';

const RoadmapSection = ({ roadmapData = null }) => {
  // Default roadmap data if none provided
  const defaultRoadmapData = [
    {
      week: 'Week 1-2',
      title: 'TypeScript Fundamentals',
      status: 'completed',
      progress: 100,
      hours: '15 hours',
      totalHours: 15,
      completedHours: 15,
      description: 'Master TypeScript basics and advanced concepts',
      topics: ['Basic Types', 'Interfaces', 'Classes', 'Generics'],
      resources: 3
    },
    {
      week: 'Week 3-4',
      title: 'React with TypeScript',
      status: 'in-progress',
      progress: 60,
      hours: '12/20 hours',
      totalHours: 20,
      completedHours: 12,
      description: 'Build modern React applications with TypeScript',
      topics: ['Components', 'Hooks', 'Context API', 'Props Types'],
      resources: 5
    },
    {
      week: 'Week 5-6',
      title: 'Testing & State Management',
      status: 'upcoming',
      progress: 0,
      hours: '18 hours',
      totalHours: 18,
      completedHours: 0,
      description: 'Jest, Redux.js and React Testing Library',
      topics: ['Unit Testing', 'Integration Testing', 'Redux', 'Context'],
      resources: 4
    },
    {
      week: 'Week 7',
      title: 'Portfolio Projects & Deployment',
      status: 'upcoming',
      progress: 0,
      hours: '15 hours',
      totalHours: 15,
      completedHours: 0,
      description: 'Build 2 projects and deploy them',
      topics: ['Project Planning', 'CI/CD', 'Deployment', 'Documentation'],
      resources: 6
    }
  ];

  const roadmap = roadmapData || defaultRoadmapData;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'in-progress':
        return <Zap className="w-5 h-5 text-white" />;
      default:
        return <Calendar className="w-5 h-5 text-white" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'in-progress':
        return 'from-orange-500 to-yellow-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCardGradient = (status) => {
    switch (status) {
      case 'completed':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'in-progress':
        return 'from-orange-50 to-yellow-50 border-orange-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const totalHours = roadmap.reduce((sum, item) => sum + item.totalHours, 0);
  const completedHours = roadmap.reduce((sum, item) => sum + item.completedHours, 0);
  const overallProgress = Math.round((completedHours / totalHours) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Overall Progress */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-gray-900">Learning Roadmap</h2>
          <p className="text-gray-600 text-lg">Your personalized 7-week journey to land your dream job</p>
          
          {/* Overall Progress Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedHours}h</div>
                <div className="text-sm text-gray-600">Hours Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalHours}h</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Roadmap Items */}
      <div className="space-y-6">
        {roadmap.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${getCardGradient(item.status)}`}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Section - Status and Week */}
              <div className="flex items-center space-x-4 lg:flex-col lg:items-center lg:space-x-0 lg:space-y-2 lg:w-32">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{item.week}</div>
                  <div className="text-sm text-gray-600 capitalize">{item.status.replace('-', ' ')}</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-4">
                {/* Title and Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>

                {/* Topics */}
                {item.topics && (
                  <div className="flex flex-wrap gap-2">
                    {item.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-3 py-1 bg-white/60 text-gray-700 rounded-full text-sm font-medium border border-white/40"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{item.progress}% complete</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2 border border-white/40">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 bg-gradient-to-r ${
                        item.status === 'completed' ? 'from-green-500 to-emerald-500' :
                        item.status === 'in-progress' ? 'from-orange-500 to-yellow-500' :
                        'from-gray-400 to-gray-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Right Section - Stats and Actions */}
              <div className="lg:w-48 space-y-4">
                {/* Time Stats */}
                <div className="bg-white/60 rounded-lg p-4 border border-white/40">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Time</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.hours}</span>
                    </div>
                    
                    {item.resources && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Resources</span>
                        </div>
                        <span className="text-sm text-gray-600">{item.resources}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="space-y-2">
                  {item.status === 'completed' && (
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <Trophy className="w-4 h-4" />
                      <span>Review</span>   
                    </button>
                  )}
                  
                  {item.status === 'in-progress' && (
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                      <PlayCircle className="w-4 h-4" />
                      <span>Continue</span>
                    </button>
                  )}
                  
                  {item.status === 'upcoming' && (
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Target className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default RoadmapSection;