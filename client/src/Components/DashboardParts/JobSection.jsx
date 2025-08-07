import { useState, useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import JobCard from "./JobCard";

const BASE_URL = "https://api.adzuna.com/v1/api/jobs/";

const REGION = "in";
const APP_ID = "958e0e1a";
const APP_KEY = "e4711b094a6de8d3f144f5d7ebdd6791";

const JobSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [loadCounter, setLoadCounter] = useState(5);

  const getCompanyInitials = (companyName) => {
    return companyName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      async function fetchJobs() {
        if (searchQuery.trim().length === 0) return;

        const res = await fetch(
          `${BASE_URL}${REGION}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(
            searchQuery
          )}&results_per_page=50`
        );
        const data = await res.json();
        setJobsData(data.results);
      }

      fetchJobs();
    }, 600);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const visibleJobs = jobsData
    .sort((a, b) => {
      const aDate = new Date(a.created);
      const bDate = new Date(b.created);

      return bDate - aDate;
    })
    .slice(0, loadCounter);

  function handleLoadJobs() {
    setLoadCounter((curr) => curr + 5);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Job Recommendations
          </h2>
          <p className="text-gray-600">
            {visibleJobs.length} jobs found{" "}
            {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your desired job role"
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
        {jobsData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          visibleJobs.map((job, index) => {
            const companyInitials = getCompanyInitials(
              job.company.display_name
            );

            return (
              <JobCard
                job={job}
                index={index}
                key={job.id}
                companyInitials={companyInitials}
              />
            );
          })
        )}
      </div>

      {/* Load More Button */}
      {jobsData.length > 0 && (
        <div className="text-center">
          <button
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleLoadJobs}
          >
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default JobSection;
