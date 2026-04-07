import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/ui/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(form.email, form.password);
    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-medium text-surface-900 dark:text-surface-50 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-surface-400 dark:text-surface-200 mb-8">
          Sign in to continue your interview practice.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-surface-400 dark:text-surface-200 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}

// Ready for: wiring useAuth().login to real backend
