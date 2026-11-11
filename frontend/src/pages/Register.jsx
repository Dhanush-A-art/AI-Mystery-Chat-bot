import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#121923] border border-[#232F3E] rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#18212C] border border-[#D6A84F]/40 flex items-center justify-center text-[#D6A84F] mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F4F1E8]">
            Investigator Registry
          </h2>
          <p className="text-xs text-[#9AA6B2] mt-1 font-mono">
            Register your credentials to track solved cases and scores
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
              Investigator Name / Alias
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Detective Vance"
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#8FA7BA] block mb-1.5 uppercase">
              Official Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="detective@agency.com"
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
            />
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
              placeholder="Minimum 6 characters"
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#8FA7BA] block mb-1.5 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-md shadow-[#D6A84F]/10 disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Registering...' : 'Complete Registry'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#232F3E] text-center">
          <p className="text-xs text-[#9AA6B2]">
            Already an active investigator?{' '}
            <Link to="/login" className="text-[#D6A84F] hover:underline font-medium">
              Login to Your File
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

