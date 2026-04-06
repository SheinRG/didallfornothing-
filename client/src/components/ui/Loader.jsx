import { motion } from 'framer-motion';

const dotVariants = {
  initial: { opacity: 0.3, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Loader({ className = '' }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-1.5 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2.5 w-2.5 rounded-full bg-primary-400 dark:bg-primary-200"
          variants={dotVariants}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

// Ready for: no further connections needed
