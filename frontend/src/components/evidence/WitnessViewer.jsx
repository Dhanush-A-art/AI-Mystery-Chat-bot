import React from 'react';
import { Mic, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';

const WitnessViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const transcript = content.transcript || [];

  return (
    <div className="bg-[#121923] border border-[#232F3E] rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#69A982]/10 border border-[#69A982]/30 flex items-center justify-center text-[#69A982]">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-[#F4F1E8] text-base">
              {evidence.title}
            </h3>
            <p className="text-xs font-mono text-[#8FA7BA]">
              Witness: {content.interviewee || 'Subject under oath'}
            </p>
          </div>
        </div>

        {content.credibilityRating && (
          <div className="flex items-center space-x-1.5 text-xs font-mono text-[#69A982] bg-[#69A982]/10 border border-[#69A982]/30 px-3 py-1 rounded">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{content.credibilityRating}</span>
          </div>
        )}
      </div>

      {/* Transcript Audio-Tape Styled Body */}
      <div className="p-6 bg-[#0B0F14]/50 space-y-4 max-h-[460px] overflow-y-auto">
        {transcript.length === 0 ? (
          <div className="text-sm text-[#F4F1E8] leading-relaxed font-sans">
            {evidence.description}
          </div>
        ) : (
          transcript.map((line, idx) => {
            const isDetective = line.speaker?.toLowerCase().includes('detective');

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                  isDetective
                    ? 'bg-[#18212C] border-[#232F3E] text-[#8FA7BA]'
                    : 'bg-[#121923] border-[#D6A84F]/30 text-[#F4F1E8]'
                }`}
              >
                <span className={`font-mono text-xs font-bold block mb-1 uppercase tracking-wider ${
                  isDetective ? 'text-[#8FA7BA]' : 'text-[#D6A84F]'
                }`}>
                  [{line.speaker}]
                </span>
                <p>{line.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-[#18212C] border-t border-[#232F3E] text-xs text-[#9AA6B2] flex items-center justify-between font-mono">
        <span>Recorded at: {evidence.location || 'On-Site Examination'}</span>
        <span>Exhibit ID: {evidence.evidenceId}</span>
      </div>
    </div>
  );
};

export default WitnessViewer;

