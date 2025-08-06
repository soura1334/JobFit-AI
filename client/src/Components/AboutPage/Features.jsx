import { Bot, ClipboardCheck, Network, Target } from "lucide-react";

export default function Features() {
  return (
    <div className="">
      <p className="text-center font-bold text-5xl bg-transparent">
        What JobFit AI Offers
      </p>
      <div className="flex justify-center mt-8">
        <div className="grid lg:grid-cols-4 p-5 gap-10">
          <FeatureCard
            title="AI-Powered Skill Gap Analysis"
            icon={<Bot color="#9e51a9" size={20}/>}
            desc="Upload your resume and let our AI agent identify the missing skills for
        your dream job instantly."
          />
          <FeatureCard
            title="Role-Specific Suggestions"
            icon={<Target color="#9e51a9" size={20} />}
            desc="Select a job role and get personalized upskilling recommendations mapped to industry demands."
          />
          <FeatureCard
            title="Real-Time Job Recommendations"
            icon={<Network color="#9e51a9" size={20}/>}
            desc="Discover curated job opportunities based on your resume and skill profile using real-time Adzuna API integration."
          />
          <FeatureCard
            title="Insightful Resume Feedback"
            icon={<ClipboardCheck color="#9e51a9" size={20}/>}
            desc="Get feedback on structure, relevance, and optimization areas for better visibility in job searches."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, icon, desc }) {
  return (
    <div className="rounded-lg shadow-xl h-[40vh] flex flex-col justify-around bg-white p-5">
      <div className="border-2 border-purple-500 rounded-full h-10 w-10 flex justify-center items-center bg-purple-100">
        {icon}
      </div>
      <p className="font-semibold text-lg">{title}</p>
      <p className="text-gray-800">{desc}</p>
    </div>
  );
}
