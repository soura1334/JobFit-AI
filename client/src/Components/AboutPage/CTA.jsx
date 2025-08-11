import { delay, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 1,
    },
  },
};

export default function CTA() {
  const navigate = useNavigate();
  const handleClickToDashboard = () => {
    navigate("/dashboard");
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, amount: 0.7}}
      className="p-5 my-10 flex flex-col items-center gap-10"
    >
      <div className="lg:text-5xl text-4xl font-bold text-center">
        <p className="mb-5">Bridge your gap</p>
        <p>Land your dream job today</p>
      </div>
      <motion.button
        className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={handleClickToDashboard}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
