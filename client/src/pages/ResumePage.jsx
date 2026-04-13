import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';
import { authFetch } from '../utils/authFetch';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);

  // Check if user already has resume data
  useEffect(() => {
    const checkResume = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/resume`);
        const data = await response.json();
        if (data.hasResume) {
          setResumeData(data.resumeData);
        }
      } catch (err) {
        // Silently continue — resume is optional
      }
    };
    checkResume();
  }, []);

  const handleFile = useCallback((selectedFile) => {
    setError(null);

    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPEG, or PNG file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }

    setFile(selectedFile);

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      setUploadProgress('Extracting text from resume...');

      const response = await authFetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      setUploadProgress('Analyzing with AI...');

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      setResumeData(data.resumeData);
      setUploadProgress('');
    } catch (err) {
      setError(err.message);
      setUploadProgress('');
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    navigate('/onboarding');
  };

  const handleClearResume = async () => {
    try {
      await authFetch(`${API_BASE_URL}/resume`, {
        method: 'DELETE',
      });
      setResumeData(null);
      setFile(null);
      setPreview(null);
    } catch (err) {
      // Continue anyway
    }
  };

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // ── If resume is already analyzed, show summary ────────
  if (resumeData) {
    return (
      <PageWrapper className="flex flex-col items-center px-6 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <motion.div variants={item} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-green-400">
                RESUME ANALYZED
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Here's What We Found
            </h1>
            <p className="text-[#888] text-sm">
              Your interview questions will be personalized based on this data.
            </p>
          </motion.div>

          {/* Summary Card */}
          <motion.div variants={item} className="bg-[#111] border border-[#222] rounded-3xl p-8 space-y-6">
            {/* Name & Role */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {resumeData.name || 'Candidate'}
                </h2>
                <p className="text-[#E8563B] font-semibold text-sm mt-1">
                  {resumeData.detectedRole || 'Role not detected'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8563B]/10 border border-[#E8563B]/30 text-[#E8563B] text-[10px] font-bold tracking-wider">
                {(resumeData.experienceLevel || 'MID').toUpperCase()} LEVEL
              </span>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#666] block mb-2">
                  SUMMARY
                </label>
                <p className="text-sm text-[#ccc] leading-relaxed">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills?.length > 0 && (
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#666] block mb-3">
                  KEY SKILLS
                </label>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#333] text-xs font-semibold text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects?.length > 0 && (
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#666] block mb-3">
                  NOTABLE PROJECTS
                </label>
                <div className="space-y-2">
                  {resumeData.projects.map((project, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]"
                    >
                      <span className="text-[#E8563B] font-bold text-sm">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-[#ccc]">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="primary" className="flex-1" onClick={handleContinue}>
              📄 START INTERVIEW
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleClearResume}>
              UPLOAD DIFFERENT RESUME
            </Button>
          </motion.div>

          <button
            onClick={() => {
              handleClearResume();
              navigate('/onboarding');
            }}
            className="w-full mt-4 text-center text-[11px] font-bold tracking-[0.15em] text-[#666] hover:text-[#888] transition-colors py-3"
          >
            SKIP — USE STANDARD QUESTIONS
          </button>
        </motion.div>
      </PageWrapper>
    );
  }

  // ── Upload / Skip view ─────────────────────────────────
  return (
    <PageWrapper className="flex flex-col items-center px-6 py-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Upload Your Resume
          </h1>
          <p className="text-[#888] text-sm max-w-md mx-auto">
            Our AI will analyze your resume and tailor interview questions to your
            specific experience, skills, and projects.
          </p>
        </motion.div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!uploading) document.getElementById('resume-input').click();
          }}
          className={`relative w-full min-h-[280px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
            dragging
              ? 'border-[#E8563B] bg-[#E8563B]/5 shadow-[0_0_30px_rgba(232,86,59,0.15)]'
              : file
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-[#333] bg-[#111] hover:border-[#555] hover:bg-[#151515]'
          }`}
        >
          <input
            id="resume-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) handleFile(e.target.files[0]);
            }}
          />

          {file ? (
            <div className="flex flex-col items-center gap-4 p-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Resume preview"
                  className="max-h-40 rounded-xl border border-[#333] shadow-lg"
                />
              ) : (
                <div className="w-16 h-20 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#E8563B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-bold text-white">{file.name}</p>
                <p className="text-[11px] text-[#888] mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">
                  Drop your resume here or click to browse
                </p>
                <p className="text-[11px] text-[#666] mt-2">
                  PDF, JPEG, or PNG • Max 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400 text-center mt-4"
          >
            {error}
          </motion.p>
        )}

        {/* Upload Progress */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#111] border border-[#222] rounded-full">
              <div className="w-4 h-4 border-2 border-[#E8563B] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-[#aaa]">{uploadProgress}</span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {!uploading && (
          <motion.div variants={item} className="flex flex-col gap-4 mt-8">
            {file && (
              <Button variant="primary" onClick={handleUpload}>
                🚀 ANALYZE RESUME
              </Button>
            )}
            <button
              onClick={handleContinue}
              className="w-full text-center text-[11px] font-bold tracking-[0.15em] text-[#666] hover:text-[#888] transition-colors py-4 border border-[#222] rounded-2xl hover:border-[#333]"
            >
              SKIP — CONTINUE WITHOUT RESUME
            </button>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
