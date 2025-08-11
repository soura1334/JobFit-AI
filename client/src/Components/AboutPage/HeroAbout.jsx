import { CirclePlay } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
      staggerChildren: 1,
      when: "beforeChildren",
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.25,
      ease: "easeIn",
    },
  },
};

const leftChildVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function HeroAbout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100vh] mt-1.5 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 flex items-center px-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:grid grid-cols-2 mt-20 lg:mt-5 flex flex-col gap-10"
      >
        <motion.div
          variants={childVariants}
          className="flex flex-col gap-10 items-center lg:items-start lg:justify-evenly lg:ml-10"
        >
          <motion.p
            variants={leftChildVariants}
            className="text-white lg:text-7xl text-3xl font-bold text-center lg:text-start"
          >
            Your Personalized
          </motion.p>
          <motion.p
            variants={leftChildVariants}
            className="lg:text-7xl text-3xl font-bold bg-gradient-to-r from-pink-300 to-white bg-clip-text text-transparent text-center lg:text-start"
          >
            AI Career Companion
          </motion.p>
          <motion.p
            variants={leftChildVariants}
            className="text-white lg:text-3xl text-lg text-center lg:text-start"
          >
            Upload your resume, select your goal role, and let our AI guide your
            next move.
          </motion.p>
          <motion.div
            variants={leftChildVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2 bg-gradient-to-r from-pink-500 to-red-500 w-fit p-4 lg:px-8 lg:py-4 shadow-xl rounded-full "
            onClick={() => navigate("/dashboard")}
          >
            <CirclePlay color="white" />
            <button className="text-white">Get Started</button>
          </motion.div>
        </motion.div>
        <motion.div variants={childVariants}>
          <motion.img
            animate={{
              y: [-10, 20, -10],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            src="/aiagent.svg"
            className="lg:h-100 h-50 justify-self-center lg:mb-0 mb-10"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
