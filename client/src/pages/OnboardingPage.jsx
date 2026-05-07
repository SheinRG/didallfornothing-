import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';
import { authFetch } from '../utils/authFetch';

const formSections = [
  {
    id: 'role',
    label: 'Role',
    options: [
      { value: 'swe', label: 'Software Engineer' },
      { value: 'pm', label: 'Product Manager' },
      { value: 'design', label: 'Designer' },
      { value: 'marketing', label: 'Marketing' },
    ],
  },
  {
    id: 'level',
    label: 'Level',
    options: [
      { value: 'intern', label: 'Intern' },
      { value: 'junior', label: 'Junior' },
      { value: 'mid', label: 'Mid-Level' },
      { value: 'senior', label: 'Senior' },
    ],
  },
  {
    id: 'interviewType',
    label: 'Interview Type',
    options: [
      { value: 'behavioral', label: 'Behavioral' },
      { value: 'technical', label: 'Technical' },
      { value: 'case-study', label: 'Case Study' },
    ],
  },
  {
    id: 'difficulty',
    label: 'Difficulty',
    options: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
      { value: 'expert', label: 'Expert' },
    ],
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const personality = location.state?.personality || 'standard';

  const [selections, setSelections] = useState({
    role: '',
    level: '',
    interviewType: '',
    difficulty: '',
    jobDescription: ''
  });
  
  const [expandedSection, setExpandedSection] = useState('role');
  const [loading, setLoading] = useState(false);

  const handleSelect = (sectionId, value) => {
    setSelections(prev => ({ ...prev, [sectionId]: value }));
    
    // Auto-advance to next section
    const currentIndex = formSections.findIndex(s => s.id === sectionId);
    if (currentIndex < formSections.length - 1) {
      setExpandedSection(formSections[currentIndex + 1].id);
    } else if (currentIndex === formSections.length - 1) {
      setExpandedSection('jobDescription');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const submitOnboarding = async () => {
    if (!selections.role || !selections.level || !selections.interviewType || !selections.difficulty) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await authFetch(`${API}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selections, personality }),
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

  return (
    <PageWrapper className="flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
          CUSTOMIZE YOUR INTERVIEW
        </h1>
        <p className="text-[#888] text-lg">
          Select your preferences to generate highly targeted questions.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {formSections.map((section) => (
          <div 
            key={section.id} 
            className="w-full bg-[#111]/80 backdrop-blur-md border border-[#222] rounded-2xl overflow-hidden shadow-lg transition-all"
          >
            <button 
              onClick={() => toggleSection(section.id)}
              className="w-full flex justify-between items-center p-6 bg-[#1a1a1a] hover:bg-[#222] transition-colors"
            >
              <span className="text-xl font-bold text-white uppercase tracking-wider">
                {section.label}
              </span>
              <div className="flex items-center gap-4">
                {selections[section.id] && (
                  <span className="text-sm text-[#E8563B] font-semibold">
                    {section.options.find(o => o.value === selections[section.id])?.label}
                  </span>
                )}
                <motion.div 
                  animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#888]"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.div>
              </div>
            </button>
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="p-6 border-t border-[#333] flex flex-col gap-3">
                    {section.options.map(option => (
                      <motion.button
                        key={option.value}
                        whileHover={{ x: 10 }}
                        onClick={() => handleSelect(section.id, option.value)}
                        className={`text-left p-4 rounded-xl border transition-colors ${
                          selections[section.id] === option.value
                            ? 'border-[#E8563B] bg-[#E8563B]/10 text-[#E8563B] font-bold shadow-[0_0_15px_rgba(232,86,59,0.15)]'
                            : 'border-[#333] bg-transparent text-white hover:border-[#666]'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Job Description Section */}
        <div className="w-full bg-[#111]/80 backdrop-blur-md border border-[#222] rounded-2xl overflow-hidden shadow-lg transition-all mt-2">
          <button 
            onClick={() => toggleSection('jobDescription')}
            className="w-full flex justify-between items-center p-6 bg-[#1a1a1a] hover:bg-[#222] transition-colors"
          >
            <span className="text-xl font-bold text-white uppercase tracking-wider">
              Job Description <span className="text-[#888] text-sm ml-2">(Optional)</span>
            </span>
            <div className="flex items-center gap-4">
              {selections.jobDescription && (
                <span className="text-sm text-[#E8563B] font-semibold">
                  Added
                </span>
              )}
              <motion.div 
                animate={{ rotate: expandedSection === 'jobDescription' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-[#888]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.div>
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'jobDescription' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="p-6 border-t border-[#333]">
                  <textarea
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl p-4 text-white resize-none focus:outline-none focus:border-[#E8563B] transition-colors"
                    rows={6}
                    placeholder="Paste the job description here to get highly targeted questions (or leave blank to skip)..."
                    value={selections.jobDescription}
                    onChange={(e) => setSelections(prev => ({ ...prev, jobDescription: e.target.value }))}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <div className="w-full mt-6">
          <Button 
            variant="primary" 
            onClick={submitOnboarding}
            disabled={loading || !selections.role || !selections.level || !selections.interviewType || !selections.difficulty}
            className="w-full py-5 text-xl font-bold uppercase tracking-wider"
          >
            {loading ? 'PREPARING SESSION...' : 'START INTERVIEW'}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

// Ready for: POST to /api/sessions with selection data
