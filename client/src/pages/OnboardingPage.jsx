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

  const handleSelect = (value) => {
    const keys = ['role', 'level', 'interviewType'];
    const updated = { ...selections, [keys[currentStep]]: value };
    setSelections(updated);

    if (currentStep + 1 < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // TODO: POST to /api/sessions with selections
      console.log('Onboarding complete:', updated);
      navigate('/interview');
    }
  };

  return (
    <PageWrapper className="flex flex-col items-center px-6 py-16">
      {/* ── Progress bar ──────────────────────────────── */}
      <div className="w-full max-w-md mb-12">
        <div className="h-1.5 w-full rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary-600"
            layoutId="progress"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-surface-400 dark:text-surface-200 mt-2 text-right">
          Step {currentStep + 1} of {steps.length}
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
          className="w-full max-w-lg"
        >
          <h2 className="text-xl font-medium text-surface-900 dark:text-surface-50 text-center mb-8">
            {step.title}
          </h2>

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
                className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-colors cursor-pointer ${
                  selections[['role', 'level', 'interviewType'][currentStep]] === option.value
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                    : 'border-primary-200/20 bg-white hover:border-primary-200/50 dark:bg-surface-800 dark:border-primary-200/10 dark:hover:border-primary-200/30'
                }`}
              >
                <span className="text-3xl">{option.icon}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-surface-50">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
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
