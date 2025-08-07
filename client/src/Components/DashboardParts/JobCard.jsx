import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Star,
  ArrowRight,
  Building,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { use, useState } from "react";

export default function JobCard({ job, index, companyInitials }) {
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `£${(min / 1000).toFixed(0)}k - £${(max / 1000).toFixed(0)}k`;
    } else if (min) {
      return `£${(min / 1000).toFixed(0)}k+`;
    }
    return "Salary not specified";
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

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
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-600 mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {job.company.display_name}
                </p>
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

            {/* Job Description Preview */}
            <div className="text-gray-600 text-sm mb-2">
              {isExpanded ? (
                <div>
                  <div>{job.description}</div>
                </div>
              ) : (
                <div>
                  <div>{job.description.slice(0, 150)}...</div>
                </div>
              )}
            </div>
            <button
              className={`${isExpanded ? 'text-purple-600' : 'text-blue-500'} text-sm mb-4`}
              onClick={() => setIsExpanded((curr) => !curr)}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>

            {/* Job Details */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span
                className={`${
                  job.contract_type ? "" : "hidden"
                } px-2 py-1 bg-gray-100 rounded`}
              >
                {job.contract_type}
              </span>
              <span
                className={`${
                  job.contract_time ? "" : "hidden"
                } px-2 py-1 bg-gray-100 rounded`}
              >
                {job.contract_time?.replace("_", " ")}
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
              title={savedJobs.has(job.id) ? "Remove from saved" : "Save job"}
            >
              {savedJobs.has(job.id) ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
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
}
