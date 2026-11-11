import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FolderOpen,
  Award,
  CheckCircle,
  XCircle,
  PlusCircle,
  ArrowRight,
  Clock,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cases');
      if (res.success) {
        setCases(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load case files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDeleteCase = async (e, caseId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently purge this case file?')) return;
    try {
      await api.delete(`/cases/${caseId}`);
      setCases(prev => prev.filter(c => c._id !== caseId));
    } catch (err) {
      alert(err.message || 'Failed to delete case');
    }
  };

  const totalCreated = cases.length;
  const solvedCount = cases.filter(c => c.status === 'solved').length;
  const failedCount = cases.filter(c => c.status === 'failed').length;
  const winRate = totalCreated > 0 ? Math.round((solvedCount / totalCreated) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0B0F14] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="text-xs font-mono text-[#D6A84F] uppercase tracking-wider mb-1">
              Active Precinct Terminal &bull; {isGuest ? 'Guest Session' : 'Registered Investigator'}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F4F1E8]">
              Welcome back, Detective {user ? user.name : 'Guest'}
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">
              Your case history and ongoing forensic investigations are synchronized below.
            </p>
          </div>

          <button
            onClick={() => navigate('/create')}
            className="inline-flex items-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all shadow-md shadow-[#D6A84F]/10 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch New Case</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-5">
            <div className="flex items-center justify-between text-[#8FA7BA] mb-2">
              <span className="text-xs font-mono uppercase">Cases Handled</span>
              <FolderOpen className="w-4 h-4 text-[#D6A84F]" />
            </div>
            <div className="text-2xl font-mono font-bold text-[#F4F1E8]">
              {totalCreated}
            </div>
          </div>

          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-5">
            <div className="flex items-center justify-between text-[#8FA7BA] mb-2">
              <span className="text-xs font-mono uppercase">Solved Cases</span>
              <CheckCircle className="w-4 h-4 text-[#69A982]" />
            </div>
            <div className="text-2xl font-mono font-bold text-[#69A982]">
              {solvedCount}
            </div>
          </div>

          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-5">
            <div className="flex items-center justify-between text-[#8FA7BA] mb-2">
              <span className="text-xs font-mono uppercase">Unsolved / Cold</span>
              <XCircle className="w-4 h-4 text-[#C95D5D]" />
            </div>
            <div className="text-2xl font-mono font-bold text-[#C95D5D]">
              {failedCount}
            </div>
          </div>

          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-5">
            <div className="flex items-center justify-between text-[#8FA7BA] mb-2">
              <span className="text-xs font-mono uppercase">Resolution Rate</span>
              <Award className="w-4 h-4 text-[#D6A84F]" />
            </div>
            <div className="text-2xl font-mono font-bold text-[#D6A84F]">
              {winRate}%
            </div>
          </div>
        </div>

        {/* Case List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[#F4F1E8]">
              Investigation Dossiers
            </h2>
            <span className="text-xs font-mono text-[#8FA7BA]">
              {cases.length} Recorded File{cases.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16 font-mono text-xs text-[#9AA6B2]">
              Accessing central database records...
            </div>
          ) : cases.length === 0 ? (
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-12 text-center space-y-4">
              <FolderOpen className="w-12 h-12 text-[#232F3E] mx-auto" />
              <h3 className="font-heading font-semibold text-lg text-[#F4F1E8]">
                No Active Investigations On File
              </h3>
              <p className="text-xs text-[#9AA6B2] max-w-sm mx-auto">
                Ready to take on your first assignment? Submit a scenario to generate an investigation room.
              </p>
              <button
                onClick={() => navigate('/create')}
                className="inline-flex items-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-semibold text-xs px-5 py-2.5 rounded-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Case Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cases.map((c) => {
                const isSolved = c.status === 'solved';
                const isFailed = c.status === 'failed';
                const isActive = c.status === 'active';

                return (
                  <div
                    key={c._id}
                    onClick={() => {
                      if (isSolved || isFailed) {
                        navigate(`/cases/${c._id}/result`);
                      } else {
                        navigate(`/investigate/${c._id}`);
                      }
                    }}
                    className="bg-[#121923] border border-[#232F3E] hover:border-[#D6A84F]/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-xl group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase bg-[#18212C] text-[#D6A84F] px-2 py-0.5 rounded border border-[#232F3E]">
                          {c.category}
                        </span>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              isSolved
                                ? 'bg-[#69A982]/15 text-[#69A982] border border-[#69A982]/30'
                                : isFailed
                                ? 'bg-[#C95D5D]/15 text-[#C95D5D] border border-[#C95D5D]/30'
                                : 'bg-[#D6A84F]/15 text-[#D6A84F] border border-[#D6A84F]/30'
                            }`}
                          >
                            {c.status}
                          </span>

                          <button
                            onClick={(e) => handleDeleteCase(e, c._id)}
                            className="text-[#9AA6B2] hover:text-[#C95D5D] p-1 transition-colors"
                            title="Purge Case File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-semibold text-base text-[#F4F1E8] group-hover:text-[#D6A84F] transition-colors line-clamp-2 mb-2">
                        {c.title}
                      </h3>

                      <p className="text-xs text-[#8FA7BA] font-mono mb-4">
                        Difficulty: {c.difficulty} &bull; {c.suspectCount || 4} Suspects
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#232F3E] flex items-center justify-between text-xs text-[#9AA6B2] font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-[#D6A84F] font-semibold">
                        <span>{isSolved || isFailed ? 'Review File' : 'Enter Room'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

