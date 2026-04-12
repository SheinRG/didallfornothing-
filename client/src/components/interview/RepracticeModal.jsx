import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSpeech from '../../hooks/useSpeech';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function RepracticeModal({ isOpen, onClose, question, session }) {
  const { transcript, isListening, start, stop, reset } = useSpeech();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setAnalysis(null);
      reset();
    }
  }, [isOpen, question, reset]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // We need to await stop() to get the final Groq transcript if they are still recording
    let finalTranscript = transcript;
    if (isListening) {
      finalTranscript = await stop();
    }
    
    if (!finalTranscript) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch(`${API}/feedback/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question, answer: finalTranscript }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
      } else {
        alert('Failed to analyze answer.');
      }
    } catch (err) {
      console.error(err);
      alert('Error analyzing answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-[#111] rounded-3xl border border-[#333] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333] bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <span className="bg-[#E8563B]/20 text-[#E8563B] px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">Targeted Practice</span>
            <h2 className="text-white font-bold text-lg">Question Re-run</h2>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors bg-white/5 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 active:scale-90">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Question Display */}
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#888] mb-3 uppercase">Interviewer Question</p>
            <h3 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">"{question}"</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recording Area */}
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#888] uppercase">Your New Answer</p>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-5 min-h-[200px] flex flex-col">
                <div className="flex-1 bg-black/30 rounded-xl p-4 text-sm text-zinc-300 font-mono leading-relaxed overflow-y-auto mb-4 border border-white/5">
                  {transcript || <span className="text-zinc-600 italic">Hit record and start speaking...</span>}
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={isListening ? stop : start}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl font-bold text-sm tracking-widest uppercase transition-all ${
                      isListening 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse'
                        : 'bg-[#E8563B] text-white hover:brightness-110 active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{isListening ? 'stop_circle' : 'mic'}</span>
                    {isListening ? 'STOP RECORDING' : 'RECORD ANSWER'}
                  </button>
                  {transcript && !isListening && (
                     <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-16 h-14 bg-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                     >
                       {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">send</span>}
                     </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Feedback Area */}
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#888] uppercase">Instant AI Analysis</p>
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 min-h-[200px]">
                {!analysis && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-10">
                    <span className="material-symbols-outlined text-4xl mb-4">analytics</span>
                    <p className="text-sm font-semibold max-w-[200px]">Record a new answer and submit to get instant feedback.</p>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center h-full pt-10">
                    <div className="w-12 h-12 border-4 border-[#333] border-t-[#E8563B] rounded-full animate-spin mb-4" />
                    <p className="text-[#888] text-xs tracking-widest font-bold uppercase animate-pulse">Analyzing Answer...</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-white">{Math.round(analysis.overallScore)}</span>
                        <span className="text-xl text-[#888] font-bold">/10</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${analysis.overallScore >= 7 ? 'text-[#a3e635] border-[#a3e635]/30 bg-[#a3e635]/10' : 'text-[#facc15] border-[#facc15]/30 bg-[#facc15]/10'}`}>
                        {analysis.overallScore >= 7 ? 'STRONG' : 'DEVELOPING'}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                      {analysis.feedback}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold block mb-1">Structure</span>
                          <span className="text-white font-semibold">{analysis.structure}/10</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold block mb-1">Clarity</span>
                          <span className="text-white font-semibold">{analysis.clarity}/10</span>
                        </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
