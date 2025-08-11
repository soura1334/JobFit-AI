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
      staggerChildren: 0.5,
      delayChildren: 0.5,
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
      delayChildren: 0.5,
    },
  },
};

const cardVariants = {
  hidden: {
    x: -20,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
};

export default function Testimonials() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-5 p-5 flex flex-col items-center"
    >
      <motion.div
        variants={childVariants}
        className="text-center flex flex-col gap-5"
      >
        <h2 className="text-5xl font-bold">What Our Users Say</h2>
        <p className="text-lg text-gray-800">
          Real feedback from people who transformed their job search with JobFit
          AI
        </p>
      </motion.div>
      <motion.div
        variants={childVariants}
        className="grid lg:grid-cols-3 w-full gap-5 mt-12"
      >
        <TestimonialCard
          name="Aarav Mehta"
          role="Frontend Developer"
          quote="JobFit AI helped me identify exactly which skills I needed to land my first developer job. The recommendations were spot-on!"
          imgn="men/65.jpg"
        />
        <TestimonialCard
          name="Debra Morgan"
          role="Data Analyst Intern"
          quote="I uploaded my resume and selected my dream role—within seconds, I had a clear roadmap of what I was missing. Loved the job recommendations too!"
          imgn="women/76.jpg"
        />
        <TestimonialCard
          name="Rahul Verma"
          role="Final Year CS Student"
          quote="As a fresher, I wasn't sure where I stood. JobFit AI made everything clearer and helped me focus my learning."
          imgn="men/69.jpg"
        />
      </motion.div>
    </motion.div>
  );
}

function TestimonialCard({ name, role, quote, imgn }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-lg shadow-xl p-5 flex flex-col justify-evenly gap-5  h-[40vh] hover:shadow-2xl hover:bg-purple-50"
    >
      <div className="flex gap-4 items-center">
        <img
          src={`https://randomuser.me/api/portraits/${imgn}`}
          alt="User avatar"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <p className="text-xl font-semibold">{name}</p>
          <p className="text-gray-700">{role}</p>
        </div>
      </div>
      <p className="text-gray-600">{quote}</p>
    </motion.div>
  );
}
