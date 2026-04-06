import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/ui/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call useAuth().login(form.email, form.password)
    console.log('Login:', form);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Sign in
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
