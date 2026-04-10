import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';

const steps = [
  {
    title: 'What role are you preparing for?',
    options: [
      { value: 'swe', label: 'Software Engineer', icon: '💻' },
      { value: 'pm', label: 'Product Manager', icon: '📋' },
      { value: 'design', label: 'Designer', icon: '🎨' },
      { value: 'marketing', label: 'Marketing', icon: '📣' },
    ],
  },
  {
    title: 'What level are you targeting?',
    options: [
      { value: 'intern', label: 'Intern', icon: '🌱' },
      { value: 'junior', label: 'Junior', icon: '🚀' },
      { value: 'mid', label: 'Mid-Level', icon: '⚡' },
      { value: 'senior', label: 'Senior', icon: '🏆' },
    ],
  },
  {
    title: 'What type of interview?',
    options: [
      { value: 'behavioral', label: 'Behavioral', icon: '🗣️' },
      { value: 'technical', label: 'Technical', icon: '🧠' },
      { value: 'case-study', label: 'Case Study', icon: '📊' },
    ],
  },
  {
    title: 'Select Difficulty Level',
    options: [
      { value: 'easy', label: 'Easy', icon: '🟢' },
      { value: 'medium', label: 'Medium', icon: '🟡' },
      { value: 'hard', label: 'Hard', icon: '🟠' },
      { value: 'expert', label: 'Expert', icon: '🔴' },
    ],
  },
  {
    title: 'Job Description (Optional)',
    type: 'textarea',
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const [loading, setLoading] = useState(false);

  const handleSelect = async (value) => {
    const keys = ['role', 'level', 'interviewType', 'difficulty', 'jobDescription'];
    const updated = { ...selections, [keys[currentStep]]: value };
    setSelections(updated);
    
    // For text area step, value is maintained in local state before proceeding
    if (currentStep + 1 < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitOnboarding(updated);
    }
  };

  const submitOnboarding = async (finalSelections) => {
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(finalSelections),
      });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Onboarding failed');

        navigate('/interview', { state: { sessionId: data.session._id } });
    } catch (err) {
      console.error('Onboarding session error:', err);
      alert('Failed to start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [jdText, setJdText] = useState('');

  return (
    <PageWrapper className="flex flex-col items-center px-6 py-16">
      {/* ── Progress bar ──────────────────────────────── */}
      <div className="w-full max-w-md mb-12">
        <div className="h-2 w-full rounded-full bg-[#1A1A1A] overflow-hidden border border-[#333]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#E8563B] to-[#C23C23]"
            layoutId="progress"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#888] mt-4 text-center">
          STEP {currentStep + 1} OF {steps.length}
        </p>
      </div>

      {/* ── Step content ──────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-[#111]/80 backdrop-blur-md border border-[#222] rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white text-center mb-8">
            {step.title.toUpperCase()}
          </h2>

          {step.type === 'textarea' ? (
            <div className="flex flex-col gap-4">
              <textarea
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl p-4 text-white resize-none focus:outline-none focus:border-[#E8563B] transition-colors"
                rows={6}
                placeholder="Paste the job description here to get highly targeted questions (or leave blank to skip)..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
              <Button 
                variant="primary" 
                onClick={() => handleSelect(jdText)}
                disabled={loading}
              >
                {loading ? 'STARTING...' : (jdText ? 'USE THIS JD & START' : 'SKIP & START')}
              </Button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {step.options.map((option) => (
                <motion.button
                  key={option.value}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(option.value)}
                  className={`flex flex-col items-center gap-4 rounded-2xl border p-8 transition-colors cursor-pointer ${
                    selections[['role', 'level', 'interviewType', 'difficulty'][currentStep]] === option.value
                      ? 'border-[#E8563B] bg-[#E8563B]/10 shadow-[0_0_15px_rgba(232,86,59,0.2)]'
                      : 'border-[#333] bg-[#1a1a1a] hover:border-[#666]'
                  }`}
                >
                  <span className="text-4xl drop-shadow-xl">{option.icon}</span>
                  <span className="text-sm font-bold tracking-wide text-white">
                    {option.label.toUpperCase()}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Back button ───────────────────────────────── */}
      {currentStep > 0 && (
        <Button
          variant="secondary"
          className="mt-8"
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          ← Back
        </Button>
      )}
    </PageWrapper>
  );
}

// Ready for: POST to /api/sessions with selection data
