import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isThemeLight, setIsThemeLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsThemeLight(true);
      document.documentElement.classList.add('theme-light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isThemeLight;
    setIsThemeLight(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm border-b border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-white theme-light:text-zinc-900 transition-colors">ORION</span>
          </Link>
        </div>

        {/* Auth & Theme */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="material-symbols-outlined text-zinc-400 hover:text-[#E8563B] transition-colors p-2"
          >
            {isThemeLight ? 'light_mode' : 'dark_mode'}
          </button>
          
          <Link to="/login" className="hidden sm:block text-[11px] font-bold tracking-widest text-[#aaa] hover:text-white transition-colors">
            LOGIN
          </Link>
          
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-[#E8563B] text-white text-[11px] font-bold tracking-widest rounded-full transition-all uppercase shadow-lg shadow-[#E8563B]/20"
            >
              START SESSION
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
