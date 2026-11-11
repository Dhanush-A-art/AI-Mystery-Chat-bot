import React, { useState } from 'react';
import { Bot, HelpCircle, Sparkles, AlertCircle, X, Send } from 'lucide-react';

const AssistantModal = ({ isOpen, onClose, onRequestHint, hintHistory }) => {
  const [level, setLevel] = useState('gentle');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestHint, setLatestHint] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await onRequestHint(level, question);
      setLatestHint(res.hint);
      setQuestion('');
    } catch (err) {
      console.error('Failed to request hint:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121923] border border-[#232F3E] rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#D6A84F]">
            <Bot className="w-5 h-5" />
            <h3 className="font-heading font-bold text-base text-[#F4F1E8]">
              AI Detective Assistant
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9AA6B2] hover:text-[#F4F1E8] p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 bg-[#0B0F14]/50">
          <p className="text-xs text-[#8FA7BA] leading-relaxed">
            The Assistant analyzes public case files and statements to guide your reasoning. It will <strong className="text-[#F4F1E8]">never reveal the culprit outright</strong>. Higher hint tiers apply small deductions to your final forensic score.
          </p>

          {/* Tier Selection */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { id: 'gentle', label: 'Gentle Hint', cost: '-5 pts', desc: 'Subtle direction' },
              { id: 'evidence_based', label: 'Evidence Hint', cost: '-10 pts', desc: 'Points to discrepancies' },
              { id: 'strong', label: 'Strong Hint', cost: '-15 pts', desc: 'Deep technical analysis' }
            ].map(tier => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setLevel(tier.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  level === tier.id
                    ? 'bg-[#18212C] border-[#D6A84F] text-[#F4F1E8]'
                    : 'bg-[#0B0F14] border-[#232F3E] text-[#9AA6B2] hover:border-[#8FA7BA]'
                }`}
              >
                <div className="font-semibold text-xs text-[#D6A84F]">{tier.label}</div>
                <div className="text-[10px] font-mono text-[#8FA7BA]">{tier.cost}</div>
                <div className="text-[10px] text-[#9AA6B2] mt-1">{tier.desc}</div>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask specific question or leave empty for general guidance..."
                className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-3.5 py-2.5 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-semibold text-xs py-2.5 rounded-lg transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Consulting Files...' : `Request ${level.replace('_', ' ')} Hint`}</span>
            </button>
          </form>

          {/* Latest or Past Hints */}
          {latestHint && (
            <div className="bg-[#18212C] border border-[#D6A84F]/40 rounded-lg p-4 space-y-2 mt-4 animate-fade-in">
              <div className="flex items-center space-x-2 text-[#D6A84F] text-xs font-mono font-bold">
                <Bot className="w-4 h-4" />
                <span>ASSISTANT DEDUCTION:</span>
              </div>
              <p className="text-xs text-[#F4F1E8] leading-relaxed">
                {latestHint}
              </p>
            </div>
          )}

          {hintHistory && hintHistory.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#232F3E]">
              <div className="text-xs font-mono text-[#8FA7BA] uppercase">Case Consultation History</div>
              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {hintHistory.map((h, i) => (
                  <div key={i} className="bg-[#18212C]/60 border border-[#232F3E] rounded p-2.5 text-[11px] text-[#9AA6B2]">
                    <span className="text-[#D6A84F] font-mono capitalize">[{h.level}]</span> {h.hint}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;

