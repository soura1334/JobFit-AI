import { Upload } from "lucide-react";
import { motion } from "motion/react";

export default function HeroAbout() {
  return (
    <div className="min-h-[80vh] mt-1.5 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 flex items-center px-10">
      <div className="lg:grid grid-cols-2 mt-20 lg:mt-5 flex flex-col gap-10">
        <div className="flex flex-col gap-5 items-center lg:items-start lg:justify-evenly lg:ml-10">
          <p className="text-white lg:text-5xl text-3xl font-bold text-center lg:text-start">
            Your Personalized
          </p>
          <p className="lg:text-5xl text-3xl font-bold bg-gradient-to-r from-pink-300 to-white bg-clip-text text-transparent text-center lg:text-start">
            AI Career Companion
          </p>
          <p className="text-white lg:text-2xl text-lg text-center lg:text-start">
            Upload your resume, select your goal role, and let our AI guide your
            next move.
          </p>
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2 bg-gradient-to-r from-pink-500 to-red-500 w-fit p-4 lg:px-8 lg:py-4 shadow-xl rounded-full "
          >
            <Upload color="white" />
            <button className="text-white">Upload Resume</button>
          </motion.div>
        </div>
        <div>
          <img
            src="/aiagent.svg"
            className="lg:h-90 h-50 justify-self-center lg:mb-0 mb-10"
          />
        </div>
      </div>
    </div>
  );
}
