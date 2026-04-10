import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import PageWrapper from '../components/ui/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const user = await loginWithGoogle(tokenResponse.access_token);
      if (user) {
        navigate('/dashboard');
      }
    },
    onError: () => {
      console.error('Google Sign Up Failed');
    }
  });

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
              Sign Up
            </h1>
            <p className="text-[#888] leading-relaxed">
              Create an account to start practicing for your next interview.
            </p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Your Name"
            name="name"
            placeholder="Marcus Vance"
            required
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="operative@orion.com"
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
          <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
            {loading ? 'SIGNING UP...' : 'SIGN UP'}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#333]"></div>
            <span className="flex-shrink-0 mx-4 text-[#555] text-xs font-bold tracking-widest uppercase">Or</span>
            <div className="flex-grow border-t border-[#333]"></div>
          </div>

          <Button type="button" variant="secondary" onClick={() => handleGoogleLogin()} disabled={loading} className="w-full !py-3 flex items-center justify-center gap-3 hover:bg-[#222]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </Button>
        </form>

        <p className="text-sm text-[#888] mt-8 text-center font-medium">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link to="/login" className="text-[#E8563B] font-bold hover:underline transition-all">
            LOGIN
          </Link>
        </p>
      </motion.div>
    </PageWrapper>
  );
}

// Ready for: wiring useAuth().register to real backend
