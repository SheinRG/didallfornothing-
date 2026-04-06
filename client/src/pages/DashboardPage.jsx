import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const mockSessions = [
  {
    id: '1',
    role: 'SWE',
    level: 'Mid',
    type: 'Behavioral',
    date: '2026-04-05',
    overallScore: 7.5,
  },
  {
    id: '2',
    role: 'PM',
    level: 'Senior',
    type: 'Case Study',
    date: '2026-04-03',
    overallScore: 8.2,
  },
  {
    id: '3',
    role: 'Design',
    level: 'Junior',
    type: 'Behavioral',
    date: '2026-04-01',
    overallScore: 6.8,
  },
];

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const userName = 'Demo User'; // TODO: replace with useAuth().user.name

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

        <motion.div
          className="flex flex-col gap-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {mockSessions.map((session) => (
            <motion.div key={session.id} variants={itemVariants}>
              <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">{session.role}</Badge>
                    <Badge variant="success">{session.level}</Badge>
                    <Badge variant="warning">{session.type}</Badge>
                  </div>
                  <p className="text-xs text-surface-400 dark:text-surface-200">
                    {new Date(session.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-medium text-surface-900 dark:text-surface-50">
                      {session.overallScore}
                    </span>
                    <span className="text-xs text-surface-400 dark:text-surface-200">
                      overall
                    </span>
                  </div>
                  <Link to={`/feedback/${session.id}`}>
                    <Button variant="secondary" className="text-xs">
                      View Feedback
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
}

// Ready for: real session data from /api/sessions and user name from useAuth
