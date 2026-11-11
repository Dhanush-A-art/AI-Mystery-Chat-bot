import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  PlusCircle
} from 'lucide-react';

const CaseResult = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/investigations/${caseId}/result`);
        if (res.success) {
          setResult(res.data);
        }
      } catch (err) {
        setError(err.message || 'Unable to retrieve case resolution file');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center font-mono text-sm text-[#D6A84F] p-4">
        <div className="w-10 h-10 border-2 border-[#D6A84F] border-t-transparent rounded-full animate-spin mb-4" />
        <div>UNSEALING CASE SOLUTION...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-[#C95D5D] mb-4" />
        <h2 className="text-xl font-heading font-bold text-[#F4F1E8] mb-2">Solution Sealed</h2>
        <p className="text-xs font-mono text-[#9AA6B2] mb-6">{error || 'An accusation has not yet been logged.'}</p>
        <button
          onClick={() => navigate(`/investigate/${caseId}`)}
          className="inline-flex items-center space-x-2 bg-[#D6A84F] text-[#0B0F14] font-semibold text-xs px-4 py-2 rounded"
        >
          <span>Return to Investigation Room</span>
        </button>
      </div>
    );
  }

  const isCorrect = result.isCorrect;
  const breakdown = result.scoreBreakdown || {};

  return (
    <div className="min-h-screen bg-[#0B0F14] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Outcome Header Banner */}
        <div
          className={`rounded-2xl border p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden ${
            isCorrect
              ? 'bg-gradient-to-b from-[#18212C] to-[#121923] border-[#69A982]/40'
              : 'bg-gradient-to-b from-[#18212C] to-[#121923] border-[#C95D5D]/40'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4">
            {isCorrect ? (
              <CheckCircle2 className="w-16 h-16 text-[#69A982]" />
            ) : (
              <XCircle className="w-16 h-16 text-[#C95D5D]" />
            )}
          </div>

          <h1
            className={`font-heading text-3xl sm:text-5xl font-bold tracking-wider mb-2 ${
              isCorrect ? 'text-[#69A982]' : 'text-[#C95D5D]'
            }`}
          >
            {isCorrect ? 'CASE SOLVED!' : 'CASE CLOSED'}
          </h1>

          <p className="font-mono text-sm uppercase tracking-widest text-[#9AA6B2] mb-6">
            {isCorrect
              ? 'The perpetrator has been unmasked with conclusive evidence.'
              : 'The truth remains concealed. The accused was innocent.'}
          </p>

          <div className="inline-flex items-center space-x-3 bg-[#0B0F14] border border-[#232F3E] rounded-xl px-6 py-3 font-mono">
            <Award className="w-5 h-5 text-[#D6A84F]" />
            <span className="text-xs text-[#8FA7BA] uppercase">Final Forensic Score:</span>
            <span className="text-2xl font-bold text-[#D6A84F]">{result.score} pts</span>
          </div>
        </div>

        {/* Scoring Breakdown & Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Culprit Identification Card */}
          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6 space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#F4F1E8]">
              Perpetrator Identification
            </h3>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-[#18212C] border border-[#232F3E]">
              <img
                src={result.trueCulprit?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                alt="True Culprit"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#D6A84F]"
              />
              <div>
                <div className="text-xs font-mono text-[#D6A84F] uppercase">Actual Culprit</div>
                <div className="font-heading font-bold text-lg text-[#F4F1E8]">
                  {result.trueCulprit?.name} ({result.trueCulprit?.suspectId})
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-mono text-[#8FA7BA] block uppercase">Your Accusation:</span>
              <div className="p-3 rounded bg-[#18212C]/60 border border-[#232F3E] text-[#F4F1E8]">
                {result.accusedSuspect?.name} ({result.accusedSuspect?.suspectId})
              </div>
            </div>

            {result.userReasoning && (
              <div className="text-xs space-y-1">
                <span className="font-mono text-[#8FA7BA] block uppercase">Your Stated Reasoning:</span>
                <div className="p-3 rounded bg-[#18212C]/60 border border-[#232F3E] text-[#9AA6B2] italic">
                  "{result.userReasoning}"
                </div>
              </div>
            )}
          </div>

          {/* Forensic Score Breakdown Table */}
          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6 space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#F4F1E8]">
              Score Breakdown
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-[#232F3E] text-[#8FA7BA]">
                <span>Base Conviction Points:</span>
                <span className="text-[#F4F1E8] font-bold">+{breakdown.basePoints || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#232F3E] text-[#8FA7BA]">
                <span>Reasoning & No-Hint Bonuses:</span>
                <span className="text-[#69A982] font-bold">+{breakdown.reasoningBonus || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#232F3E] text-[#8FA7BA]">
                <span>Assistant Consultation Deductions:</span>
                <span className="text-[#C95D5D] font-bold">-{breakdown.hintPenalty || 0}</span>
              </div>
              <div className="flex justify-between py-3 pt-4 text-sm font-bold text-[#D6A84F]">
                <span>TOTAL SCORE:</span>
                <span>{result.score} PTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unsealed Master Explanation */}
        <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#232F3E] pb-4">
            <div className="text-xs font-mono text-[#D6A84F] uppercase tracking-wider mb-1">
              Forensic Case Summary
            </div>
            <h2 className="font-heading font-bold text-xl text-[#F4F1E8]">
              How the Incident Was Executed
            </h2>
          </div>

          {/* Motive & Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
            <div className="bg-[#18212C] border border-[#232F3E] rounded-lg p-4 space-y-2">
              <strong className="text-[#D6A84F] font-mono block uppercase">True Motive:</strong>
              <p className="text-[#F4F1E8]">{result.solution?.motive}</p>
            </div>
            <div className="bg-[#18212C] border border-[#232F3E] rounded-lg p-4 space-y-2">
              <strong className="text-[#D6A84F] font-mono block uppercase">Method of Execution:</strong>
              <p className="text-[#F4F1E8]">{result.solution?.methodOfInvolvement}</p>
            </div>
          </div>

          {/* Full Narrative Explanation */}
          <div className="space-y-2 text-sm leading-relaxed text-[#F4F1E8] bg-[#0B0F14]/40 p-5 rounded-lg border border-[#232F3E]">
            <strong className="text-[#D6A84F] font-mono text-xs block uppercase mb-1">Detailed Case Deduction:</strong>
            <p className="whitespace-pre-line text-[#F4F1E8]">{result.solution?.explanation}</p>
          </div>

          {/* True Chronological Sequence */}
          {result.solution?.actualTimeline?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#232F3E]">
              <h4 className="text-xs font-mono text-[#D6A84F] uppercase tracking-wider">
                Actual Incident Timeline (Unsealed)
              </h4>
              <div className="space-y-2.5">
                {result.solution.actualTimeline.map((step, idx) => (
                  <div key={idx} className="bg-[#18212C] p-3 rounded-lg border border-[#232F3E] text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[#D6A84F]">
                      <span className="font-bold">{step.time}</span>
                      <span className="text-[10px] text-[#8FA7BA]">Step {idx + 1}</span>
                    </div>
                    <div className="text-[#F4F1E8]">{step.event}</div>
                    {step.culpritAction && (
                      <div className="text-[11px] text-[#C95D5D] font-mono">
                        Perpetrator Action: {step.culpritAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Herring Explanations */}
          {result.solution?.redHerringExplanations?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#232F3E]">
              <h4 className="text-xs font-mono text-[#8FA7BA] uppercase tracking-wider">
                Misleading Evidence Explained
              </h4>
              <div className="space-y-2">
                {result.solution.redHerringExplanations.map((rh, idx) => (
                  <div key={idx} className="bg-[#18212C]/60 p-3 rounded border border-[#232F3E] text-xs">
                    <span className="text-[#D6A84F] font-mono mr-2">[{rh.evidenceId}]:</span>
                    <span className="text-[#9AA6B2]">{rh.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#18212C] hover:bg-[#232F3E] text-[#F4F1E8] border border-[#232F3E] text-xs font-semibold px-6 py-3 rounded-lg transition-colors font-mono"
          >
            <span>Review Case Dossiers in Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-all shadow-md shadow-[#D6A84F]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Another Investigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseResult;

