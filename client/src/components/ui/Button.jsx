import { motion } from 'framer-motion';

const variants = {
  primary:
    'btn-primary bg-gradient-to-b from-[#E8563B] to-[#C23C23] text-white tracking-widest font-bold border-none transition-all',
  secondary:
    'btn-secondary bg-[#1C1C1C] text-white border border-[#333] tracking-[0.12em] font-bold transition-all',
  danger:
    'btn-danger bg-red-500 text-white border-none font-bold',
};

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[13px] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8563B]/50 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Ready for: no further connections needed
