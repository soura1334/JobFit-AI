"use client";

import React, { useEffect, useState, useContext } from "react";
import {
  Clock,
  BookOpen,
  PlayCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

const RoadmapSection = () => {
  const { token } = useContext(AuthContext);
  const [roadmapData, setRoadmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch("http://localhost:5000/skills", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          console.log(data)
          setSkills(data.skills || []);
          setRoadmapData(data.roadmap || []);
        } else {
          console.error("Failed to fetch roadmap:", data.msg || data.error);
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-8 text-lg">Loading roadmap...</div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Personalized Learning Roadmap
        </h2>

        {skills.length > 0 && (
          <div className="mb-6 text-gray-700 dark:text-gray-300">
            <strong>Skills you need to learn:</strong>{" "}
            {skills.join(", ")}
          </div>
        )}

        {/* 🟡 No Data Available Case */}
        {!roadmapData.length ? (
          <div className="text-center text-gray-600 dark:text-gray-300 py-10 text-lg border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            🚀 No roadmap data available. You might already have all the required knowledge!
          </div>
        ) : (
          <div className="space-y-6">
            {roadmapData.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border shadow-sm dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    Day {index + 1}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    1 hour
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.Notes}
                </h3>

                {item.Resource && (
                  <a
                    href={item.Resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Resource <ExternalLink className="ml-1 w-4 h-4" />
                  </a>
                )}

                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm mt-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>1 hour</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>1 topic</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>1 resource</span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center">
                  Explore more <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoadmapSection;
