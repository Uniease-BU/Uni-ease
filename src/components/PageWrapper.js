import { motion } from "framer-motion";

export default function PageWrapper({ children, direction }) {
  const variants = {
    initial: {
      x: direction === "right" ? "100vw" : direction === "left" ? "-100vw" : 0,
      y: direction === "up" ? "100vh" : direction === "down" ? "-100vh" : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      x: direction === "right" ? "-100vw" : direction === "left" ? "100vw" : 0,
      y: direction === "up" ? "-100vh" : direction === "down" ? "100vh" : 0,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
