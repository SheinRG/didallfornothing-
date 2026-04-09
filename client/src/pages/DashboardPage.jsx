import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const API = 'http://localhost:5000/api';

const roleLabels = { swe: 'SWE', pm: 'PM', design: 'Design', marketing: 'Marketing' };
const levelLabels = { intern: 'Intern', junior: 'Junior', mid: 'Mid', senior: 'Senior' };
const typeLabels = { behavioral: 'Behavioral', technical: 'Technical', 'case-study': 'Case Study' };

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ averageScore: 0, trend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info
        const userRes = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!userRes.ok) {
          navigate('/login');
          return;
        }
        const userData = await userRes.json();
        setUserName(userData.user.name);

        // Fetch sessions
        const sessRes = await fetch(`${API}/sessions`, { credentials: 'include' });
        const sessData = await sessRes.json();
        if (sessRes.ok) {
          setSessions(sessData.sessions || []);
        }

        // Fetch stats
        const statsRes = await fetch(`${API}/feedback/stats`, { credentials: 'include' });
        const statsData = await statsRes.json();
        if (statsRes.ok) {
          setStats(statsData);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <p className="text-surface-400">Loading dashboard...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="px-6 flex items-start justify-center">
      <div className="w-full max-w-4xl py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          MY DASHBOARD
        </h1>
        <p className="text-[#888] leading-relaxed mb-10 border-b border-[#222] pb-8">
          Welcome back, {userName}. Track your progress and start new interview sessions.
        </p>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white tracking-wide">INTERVIEW HISTORY</h2>
          <div className="flex items-center gap-3">
            <Link to="/resume">
              <Button variant="secondary">📄 RESUME</Button>
            </Link>
            <Link to="/resume">
              <Button variant="primary">START INTERVIEW</Button>
            </Link>
          </div>
        </div>

        {/* ── Readiness Score Card ─────────────────────── */}
        {sessions.length > 0 && stats.trend.length > 0 && (
          <Card className="mb-8 p-6 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div>
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#888] mb-2">READINESS SCORE</h3>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-white">{stats.averageScore}<span className="text-2xl text-[#888]">/10</span></span>
                <Badge variant={stats.averageScore >= 8 ? 'success' : stats.averageScore >= 6 ? 'warning' : 'default'}>
                  {stats.averageScore >= 8 ? 'INTERVIEW READY' : stats.averageScore >= 6 ? 'NEEDS PRACTICE' : 'JUST GETTING STARTED'}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 max-w-[200px] md:max-w-xs h-16 flex items-end gap-1">
              {stats.trend.slice(-10).map((score, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 bg-gradient-to-t from-[#E8563B] to-[#C23C23] opacity-80 rounded-t-sm"
                  style={{ height: `${(score / 10) * 100}%` }}
                  title={`Score: ${score}`}
                />
              ))}
            </div>
          </Card>
        )}

        {sessions.length === 0 ? (
          <Card className="flex flex-col items-center py-16">
            <div className="w-16 h-16 rounded-full border border-[rgba(232,86,59,0.3)] bg-[#E8563B]/10 flex items-center justify-center mb-6">
              <span className="text-[#E8563B] font-mono text-xl">00</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">
              NO INTERVIEWS YET
            </h3>
            <p className="text-[#888] mb-8 text-center max-w-sm leading-relaxed">
              Start your first interview session to begin tracking your progress.
            </p>
            <Link to="/onboarding">
              <Button variant="primary">START YOUR FIRST INTERVIEW</Button>
            </Link>
          </Card>
        ) : (
          <motion.div
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {sessions.map((session) => (
              <motion.div key={session._id} variants={itemVariants}>
                <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="default">{roleLabels[session.role] || session.role}</Badge>
                      <Badge variant="success">{levelLabels[session.level] || session.level}</Badge>
                      <Badge variant="warning">{typeLabels[session.interviewType] || session.interviewType}</Badge>
                    </div>
                    <p className="text-[13px] tracking-widest text-[#666] font-mono">
                      DATE: {new Date(session.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      }).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold tracking-[0.2em] text-[#888] mb-1">
                        QUESTIONS
                      </span>
                      <span className="text-2xl font-black text-white leading-none">
                        {session.questions?.length || 0}
                      </span>
                    </div>
                    <Link to={`/feedback/${session._id}`}>
                      <Button variant="secondary" className="scale-90 origin-right">
                        VIEW FEEDBACK
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
