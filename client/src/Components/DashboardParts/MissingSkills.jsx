"use client";

import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Loader from "../Loader";

const MissingSkills = () => {
  const { token } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("http://localhost:5000/skills", {
          method: "POST", // ✅ FIXED: use POST, not GET
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}) // ✅ dummy body, backend uses JWT
        });

        if (!res.ok) {
          const text = await res.text(); // try reading raw error response
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();

        setSkills(data.skills || []);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to fetch missing skills. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm py-4">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <section className="mb-10">
      <h3 className="text-xl font-semibold text-black mb-2">
        Missing Skills
      </h3>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white shadow-xl text-gray-600 hover:bg-gray-200 transition-all hover:shadow-2xl rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-green-600 dark:text-green-400 text-sm font-medium">
          Great! You have all the required skills for your target job role.
        </div>
      )}
    </section>
  );
};

export default MissingSkills;
