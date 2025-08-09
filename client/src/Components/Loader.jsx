import { motion } from "motion/react"

export default function Loader() {
  return (
    <motion.p className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent justify-self-center"
    animate={{rotate: 360}}
    transition={{
        ease: "linear",
        repeat: Infinity,
        duration: 1
    }}></motion.p>
  )
}
