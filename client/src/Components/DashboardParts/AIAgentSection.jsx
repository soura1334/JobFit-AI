import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  Clock,
  Lightbulb
} from 'lucide-react';

const AIAgentSection = ({ initialMessages = null }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const defaultMessages = [
    {
      type: 'ai',
      message: 'Hello! I\'m your AI career assistant. I can help you with job recommendations, skill development, interview prep, and career planning. What would you like to know?',
      timestamp: new Date(Date.now() - 5000),
      suggestions: ['Analyze my resume', 'Find similar jobs', 'Interview tips', 'Skill recommendations']
    }
  ];

  const [chatHistory, setChatHistory] = useState(initialMessages || defaultMessages);


  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = {
      type: 'user',
      message: chatMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatMessage);
      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let response = '';
    let suggestions = [];

    if (input.includes('resume') || input.includes('cv')) {
      response = 'I\'d be happy to help analyze your resume! Based on current job market trends, I can identify missing skills and suggest improvements. Upload your resume and I\'ll provide a detailed analysis with actionable recommendations.';
      suggestions = ['Upload resume', 'Skill gap analysis', 'Resume templates', 'ATS optimization'];
    } else if (input.includes('job') || input.includes('career')) {
      response = 'Great! I can help you find the perfect job opportunities. Based on your profile, you have a strong match with frontend development roles. Would you like me to show you the latest openings or help refine your job search criteria?';
      suggestions = ['Show job matches', 'Salary insights', 'Company research', 'Application tips'];
    } else if (input.includes('skill') || input.includes('learn')) {
      response = 'Excellent! Continuous learning is key to career growth. I can create a personalized learning roadmap based on your target roles. Currently, React and TypeScript skills are in high demand for frontend positions.';
      suggestions = ['Create roadmap', 'Skill assessments', 'Course recommendations', 'Practice projects'];
    } else if (input.includes('interview')) {
      response = 'Interview preparation is crucial! I can help you practice common questions, understand company culture, and prepare technical challenges. Would you like to start with behavioral questions or technical prep?';
      suggestions = ['Mock interview', 'Common questions', 'Technical prep', 'Company insights'];
    } else if (input.includes('salary') || input.includes('negotiate')) {
      response = 'Salary negotiation is an important skill! Based on current market data, frontend developers in your area earn between £45k-75k. I can help you research fair compensation and prepare negotiation strategies.';
      suggestions = ['Salary benchmarks', 'Negotiation tips', 'Market trends', 'Counter offers'];
    } else {
      response = 'I understand you\'re looking for career guidance. I\'m here to help with job searching, skill development, resume optimization, interview preparation, and career planning. What specific area would you like to focus on?';
      suggestions = ['Job recommendations', 'Skill development', 'Resume review', 'Interview prep'];
    }

    return {
      type: 'ai',
      message: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setChatMessage(suggestion);
    handleSendMessage();
  };

  const quickActions = [
    { icon: Target, label: 'Job Match Analysis', description: 'Find your compatibility score' },
    { icon: BookOpen, label: 'Skill Roadmap', description: 'Personalized learning path' },
    { icon: Briefcase, label: 'Resume Review', description: 'AI-powered optimization' },
    { icon: TrendingUp, label: 'Market Insights', description: 'Industry trends & salaries' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Career Assistant</h2>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized career guidance, job recommendations, and skill development advice powered by advanced AI
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {quickActions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => handleSuggestionClick(action.label)}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <action.icon className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{action.label}</h3>
            </div>
            <p className="text-xs text-gray-600">{action.description}</p>
          </button>
        ))}
      </motion.div>

      {/* Chat Container */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Career Assistant</h3>
              <p className="text-xs text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </p>
            </div>
          </div>
          <MessageCircle className="w-5 h-5 text-gray-400" />
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {msg.type === 'user' ? 
                        <User className="w-4 h-4 text-white" /> : 
                        <Bot className="w-4 h-4 text-white" />
                      }
                    </div>
                    
                    <div className={`px-4 py-3 rounded-lg max-w-full ${
                      msg.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      {msg.timestamp && (
                        <p className={`text-xs mt-1 ${
                          msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {msg.type === 'ai' && msg.suggestions && (
                    <div className="mt-3 ml-10">
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, suggestionIndex) => (
                          <button
                            key={suggestionIndex}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-lg border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex space-x-3">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your career..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500 flex items-center">
              <Lightbulb className="w-3 h-3 mr-1" />
              Try asking about salary trends, skill recommendations, or interview tips
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Response time: ~2s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentSection;