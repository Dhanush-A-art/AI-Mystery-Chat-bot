import React, { useState } from 'react';
import { AlertTriangle, UserCheck, ShieldAlert, X } from 'lucide-react';

const AccusationModal = ({ isOpen, onClose, suspects, onConfirmAccusation, submitting }) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSuspectId) return;
    onConfirmAccusation(selectedSuspectId, reasoning);
  };

  const selectedSuspect = suspects.find(s => s.suspectId === selectedSuspectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#121923] border border-[#232F3E] rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#C95D5D]">
            <ShieldAlert className="w-5 h-5 text-[#C95D5D]" />
            <h3 className="font-heading font-bold text-base text-[#F4F1E8]">
              Official Accusation Protocol
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-[#0B0F14]/60">
          <div className="bg-[#C95D5D]/10 border border-[#C95D5D]/30 rounded-lg p-3.5 flex items-start space-x-3 text-xs text-[#F4F1E8]">
            <AlertTriangle className="w-4 h-4 text-[#C95D5D] flex-shrink-0 mt-0.5" />
            <p>
              Submitting an accusation will <strong className="text-[#C95D5D]">conclude this investigation</strong>. The case records will be sealed, and the true solution and motive will be disclosed.
            </p>
          </div>

          {/* Suspect Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#D6A84F] uppercase tracking-wider block">
              1. Designate the Primary Culprit:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suspects.map((suspect) => {
                const isSelected = selectedSuspectId === suspect.suspectId;
                return (
                  <div
                    key={suspect.suspectId}
                    onClick={() => setSelectedSuspectId(suspect.suspectId)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-[#18212C] border-[#D6A84F] shadow-md shadow-[#D6A84F]/10'
                        : 'bg-[#121923] border-[#232F3E] hover:border-[#8FA7BA]'
                    }`}
                  >
                    <img
                      src={suspect.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={suspect.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#232F3E]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#F4F1E8] truncate">
                        {suspect.name}
                      </div>
                      <div className="text-[10px] text-[#8FA7BA] truncate">
                        {suspect.occupation} &bull; {suspect.suspectId}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reasoning TextArea */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#D6A84F] uppercase tracking-wider block">
              2. Forensic Explanation & Motive (Earns +20 Bonus Points):
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Outline what evidence exposes them, why their alibi fails, and what their true motive was..."
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg p-3 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F] min-h-[90px]"
            />
          </div>

          {/* Confirm Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="confirm-accusation"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-[#232F3E] bg-[#18212C] text-[#D6A84F] focus:ring-0"
            />
            <label htmlFor="confirm-accusation" className="text-xs text-[#8FA7BA] cursor-pointer">
              I have thoroughly examined the evidence and am ready to submit this final deduction.
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-[#232F3E] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors"
            >
              Return to Room
            </button>
            <button
              type="submit"
              disabled={!selectedSuspectId || !confirmed || submitting}
              className="inline-flex items-center space-x-2 bg-[#C95D5D] hover:bg-[#b04f4f] text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md shadow-[#C95D5D]/20 disabled:opacity-50"
            >
              <span>{submitting ? 'Submitting Warrant...' : 'Issue Final Accusation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccusationModal;

