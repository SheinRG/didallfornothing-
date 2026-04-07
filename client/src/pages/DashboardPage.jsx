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
    <PageWrapper className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-medium text-surface-900 dark:text-surface-50 mb-1">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-sm text-surface-400 dark:text-surface-200 mb-10">
          Here are your recent interview sessions.
        </p>

        <div className="flex justify-end mb-6">
          <Link to="/onboarding">
            <Button variant="primary">New Session</Button>
          </Link>
        </div>

        {sessions.length === 0 ? (
          <Card className="flex flex-col items-center py-12">
            <span className="text-4xl mb-4">🎯</span>
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50 mb-2">
              No sessions yet
            </h3>
            <p className="text-sm text-surface-400 dark:text-surface-200 mb-6 text-center max-w-sm">
              Start your first mock interview to see your history here.
            </p>
            <Link to="/onboarding">
              <Button variant="primary">Start First Interview</Button>
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
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default">{roleLabels[session.role] || session.role}</Badge>
                      <Badge variant="success">{levelLabels[session.level] || session.level}</Badge>
                      <Badge variant="warning">{typeLabels[session.interviewType] || session.interviewType}</Badge>
                    </div>
                    <p className="text-xs text-surface-400 dark:text-surface-200">
                      {new Date(session.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-surface-400 dark:text-surface-200">
                        {session.questions?.length || 0} questions
                      </span>
                    </div>
                    <Link to={`/feedback/${session._id}`}>
                      <Button variant="secondary" className="text-xs">
                        View Feedback
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
