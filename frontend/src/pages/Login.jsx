import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, initGuestSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestQuickStart = async () => {
    await initGuestSession();
    navigate('/create');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#121923] border border-[#232F3E] rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#18212C] border border-[#D6A84F]/40 flex items-center justify-center text-[#D6A84F] mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F4F1E8]">
            Investigator Access
          </h2>
          <p className="text-xs text-[#9AA6B2] mt-1 font-mono">
            Enter your credentials to access active case files
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-[#C95D5D]/15 border border-[#C95D5D]/40 text-[#C95D5D] text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-[#8FA7BA] block mb-1.5 uppercase">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="detective@agency.com"
                className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-[#8FA7BA] block mb-1.5 uppercase">
              Badge Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-md shadow-[#D6A84F]/10 disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Verifying Credentials...' : 'Authenticate'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#232F3E] text-center space-y-4">
          <button
            onClick={handleGuestQuickStart}
            className="w-full bg-[#18212C] hover:bg-[#232F3E] text-[#8FA7BA] hover:text-[#F4F1E8] border border-[#232F3E] text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 font-mono"
          >
            <UserCheck className="w-4 h-4 text-[#D6A84F]" />
            <span>Continue as Guest Investigator</span>
          </button>

          <p className="text-xs text-[#9AA6B2]">
            Need a badge?{' '}
            <Link to="/register" className="text-[#D6A84F] hover:underline font-medium">
              Create New Investigator Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

