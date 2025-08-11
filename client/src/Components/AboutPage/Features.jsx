import { Bot, ClipboardCheck, Network, Target } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 1,
      staggerChildren: 1,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const cardContVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function Features() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.p
        variants={childVariants}
        className="text-center font-bold text-5xl bg-transparent"
      >
        What JobFit AI Offers
      </motion.p>
      <motion.div variants={childVariants} className="flex justify-center mt-8">
        <motion.div
          variants={cardContVariants}
          className="grid lg:grid-cols-4 p-5 gap-10"
        >
          <FeatureCard
            title="AI-Powered Skill Gap Analysis"
            icon={<Bot color="#9e51a9" size={20} />}
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
            icon={<Network color="#9e51a9" size={20} />}
            desc="Discover curated job opportunities based on your resume and skill profile using real-time Adzuna API integration."
          />
          <FeatureCard
            title="Insightful Resume Feedback"
            icon={<ClipboardCheck color="#9e51a9" size={20} />}
            desc="Get feedback on structure, relevance, and optimization areas for better visibility in job searches."
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function FeatureCard({ title, icon, desc }) {
  return (
    <motion.div
      variants={cardVariants}
      className="rounded-lg shadow-xl h-[40vh] flex flex-col justify-around bg-white p-5 hover:shadow-2xl hover:bg-purple-50"
    >
      <div className="border-2 border-purple-500 rounded-full h-10 w-10 flex justify-center items-center bg-purple-100">
        {icon}
      </div>
      <p className="font-semibold text-lg">{title}</p>
      <p className="text-gray-800">{desc}</p>
    </motion.div>
  );
}
