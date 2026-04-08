import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-orion-dark/80 backdrop-blur-md border-b border-orion-border/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-white font-sans">ORION</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/scenarios" className="text-xs font-medium tracking-widest text-orion-muted hover:text-orion-text transition-colors">
            SCENARIOS
          </Link>
          <Link to="/feedback" className="text-xs font-medium tracking-widest text-orion-muted hover:text-orion-text transition-colors">
            FEEDBACK
          </Link>
          <Link to="/workbench" className="text-xs font-medium tracking-widest text-orion-muted hover:text-orion-text transition-colors">
            WORKBENCH
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-xs font-medium tracking-widest text-orion-muted hover:text-orion-text transition-colors">
            LOGIN
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-b from-[#E8563B] to-[#C23C23] text-white text-xs font-bold tracking-widest rounded-full transition-all uppercase"
            >
              START SESSION
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
