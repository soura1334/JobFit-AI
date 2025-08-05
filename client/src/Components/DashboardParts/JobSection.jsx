import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Star,
  ArrowRight,
  Building,
  ExternalLink
} from 'lucide-react';

const JobSection = ({ jobsData = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState(new Set());

  // Mock data for development - replace with actual API data
  const mockJobs = {
    results: [
      {
        id: "126977586",
        title: "Senior Developer Python",
        company: {
          display_name: "Exposed Solutions Limited"
        },
        location: {
          display_name: "The City, Central London",
          area: ["UK", "London", "Central London", "The City"]
        },
        salary_min: 55000,
        salary_max: 75000,
        contract_type: "permanent",
        contract_time: "full_time",
        created: "2013-10-23T19:32:43Z",
        description: "Senior Python developer role with experience in scaling applications. Knowledge of python/ruby/javascript is required...",
        category: {
          label: "IT Jobs",
          tag: "it-jobs"
        },
        redirect_url: "http://example.com"
      },
      {
        id: "126977587",
        title: "Frontend React Developer",
        company: {
          display_name: "Tech Innovations Ltd"
        },
        location: {
          display_name: "Remote, UK",
          area: ["UK", "Remote"]
        },
        salary_min: 45000,
        salary_max: 65000,
        contract_type: "permanent",
        contract_time: "full_time",
        created: "2023-10-20T10:15:30Z",
        description: "Exciting opportunity for a React developer to join our growing team. Experience with TypeScript and modern frontend tools required...",
        category: {
          label: "IT Jobs",
          tag: "it-jobs"
        },
        redirect_url: "http://example.com"
      },
      {
        id: "126977588",
        title: "Full Stack JavaScript Developer",
        company: {
          display_name: "Digital Solutions Inc"
        },
        location: {
          display_name: "Manchester, UK",
          area: ["UK", "Manchester"]
        },
        salary_min: 40000,
        salary_max: 55000,
        contract_type: "permanent",
        contract_time: "full_time",
        created: "2023-10-18T14:22:15Z",
        description: "Join our team as a Full Stack developer working with Node.js, React, and MongoDB. Great opportunity for career growth...",
        category: {
          label: "IT Jobs",
          tag: "it-jobs"
        },
        redirect_url: "http://example.com"
      }
    ]
  };

  // Use provided data or fallback to mock data
  const jobs = jobsData || mockJobs;

  const filteredJobs = useMemo(() => {
  if (!jobs?.results) return [];
  const query = searchQuery.toLowerCase();

  return jobs.results.filter(job =>
    job.title.toLowerCase().includes(query) ||
    job.company.display_name.toLowerCase().includes(query) ||
    job.location.display_name.toLowerCase().includes(query)
  );
}, [jobs, searchQuery]);


  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `£${(min / 1000).toFixed(0)}k - £${(max / 1000).toFixed(0)}k`;
    } else if (min) {
      return `£${(min / 1000).toFixed(0)}k+`;
    }
    return 'Salary not specified';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const calculateMatchScore = (job) => {
    // Simple match calculation based on keywords
    const keywords = ['react', 'javascript', 'typescript', 'python', 'frontend', 'backend'];
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const matches = keywords.filter(keyword => jobText.includes(keyword));
    return Math.min(95, 60 + (matches.length * 8));
  };

  const extractSkills = (description) => {
    const skillKeywords = ['React', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 'MongoDB', 'SQL', 'AWS', 'Docker'];
    return skillKeywords.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 4);
  };

  const getCompanyInitials = (companyName) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Recommendations</h2>
          <p className="text-gray-600">
            {filteredJobs.length} jobs found {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const matchScore = calculateMatchScore(job);
            const skills = extractSkills(job.description);
            const companyInitials = getCompanyInitials(job.company.display_name);

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Company Logo/Initials */}
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                      {companyInitials}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2 flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {job.company.display_name}
                          </p>
                        </div>
                        
                        {/* Match Score - Mobile/Desktop */}
                        <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-green-600 fill-current" />
                          <span className="text-sm font-bold text-green-600">{matchScore}% Match</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location.display_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(job.created)}</span>
                        </div>
                      </div>
                      
                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Job Description Preview */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {job.description.slice(0, 150)}...
                      </p>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {job.contract_type}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {job.contract_time.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {job.category.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-auto">
                    <div className="flex items-center space-x-2 sm:order-2 lg:order-1">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 rounded-lg hover:border-blue-200"
                        title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                      >
                        {savedJobs.has(job.id) ? 
                          <BookmarkCheck className="w-5 h-5 text-blue-600" /> :
                          <Bookmark className="w-5 h-5" />
                        }
                      </button>
                      
                      <a
                        href={job.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Load More Button */}
      {filteredJobs.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default JobSection;