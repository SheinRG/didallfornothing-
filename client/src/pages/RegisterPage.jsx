import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await register(form.name, form.email, form.password);
    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111]/80 backdrop-blur-md border border-[#222] rounded-3xl p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
              Request Clearance
            </h1>
            <p className="text-[#888] leading-relaxed">
              Create an operative profile to start running advanced AI simulation scenarios.
            </p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Operative Designation"
            name="name"
            placeholder="Marcus Vance"
            required
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Authorization Email"
            name="email"
            type="email"
            placeholder="operative@orion.com"
            required
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Passphrase"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
            {loading ? 'PROCESSING...' : 'REQUEST ACCESS'}
          </Button>
        </form>

        <p className="text-sm text-[#888] mt-8 text-center font-medium">
          ALREADY AUTHORIZED?{' '}
          <Link to="/login" className="text-[#E8563B] font-bold hover:underline transition-all">
            INITIALIZE CONNECTION
          </Link>
        </p>
      </motion.div>
    </PageWrapper>
  );
}

// Ready for: wiring useAuth().register to real backend
