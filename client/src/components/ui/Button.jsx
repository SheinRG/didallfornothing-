import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-primary-600 text-white border border-primary-600 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-800',
  secondary:
    'bg-transparent text-primary-600 border border-primary-200/30 hover:bg-primary-50 dark:text-primary-200 dark:border-primary-200/20 dark:hover:bg-surface-800',
  danger:
    'bg-danger-400 text-white border border-danger-400 hover:bg-danger-600 dark:bg-danger-400 dark:hover:bg-danger-600',
};

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400/50 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Ready for: no further connections needed
