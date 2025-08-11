import { Check } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
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
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const rightChildVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};
const listContVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const listVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Mission() {
  return (
    <div className="py-15 flex items-center px-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{once: true, amount: 0.3}}
        className="grid lg:grid-cols-2 gap-15 w-full"
      >
        <HeroImage />
        <motion.div variants={childVariants} className="flex flex-col gap-10">
          <motion.p
            variants={rightChildVariants}
            className="text-5xl font-bold"
          >
            What is JobFit AI?
          </motion.p>
          <motion.p
            variants={rightChildVariants}
            className="text-lg text-gray-800"
          >
            JobFit AI is an intelligent assistant that helps you become
            job-ready — not by guessing, but by understanding. We analyze your
            uploaded resume, identify missing skills for your desired role, and
            recommend exactly what you need to learn to stay ahead. Plus, we
            fetch real-time job openings using the Adzuna API — so you're not
            just preparing, you're applying smartly.
          </motion.p>
          <CheckList />
        </motion.div>
      </motion.div>
    </div>
  );
}

function HeroImage() {
  return (
    <motion.div variants={childVariants} className="flex items-center ">
      <img
        src="/dashboard.png"
        className="shadow-2xl rounded-lg lg:h-90 h-50"
      ></img>
    </motion.div>
  );
}

function CheckList() {
  return (
    <motion.ul variants={listContVariants} className="flex flex-col gap-4">
      <CheckListItem>Skill gap detection</CheckListItem>
      <CheckListItem>Resume analysis</CheckListItem>
      <CheckListItem>Job recommendations</CheckListItem>
    </motion.ul>
  );
}

function CheckListItem({ children }) {
  return (
    <motion.li variants={listVariants} className="flex gap-2">
      <div className="bg-green-500 w-6 h-6 rounded-full flex justify-center items-center">
        <Check size={15} color="white" />
      </div>
      <p className="text-gray-500">{children}</p>
    </motion.li>
  );
}
