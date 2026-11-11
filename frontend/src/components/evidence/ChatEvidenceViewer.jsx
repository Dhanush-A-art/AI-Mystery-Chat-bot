import React from 'react';
import { MessageSquare, Clock, UserCheck, ShieldAlert } from 'lucide-react';

const ChatEvidenceViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const messages = content.messages || [];
  const participants = content.participants || [];

  return (
    <div className="bg-[#121923] border border-[#232F3E] rounded-xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-[#F4F1E8] text-base">
              {evidence.title}
            </h3>
            <p className="text-xs text-[#8FA7BA] font-mono">
              Recreated {content.platform || 'Encrypted Messaging'} Session
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#9AA6B2] bg-[#0B0F14] px-3 py-1.5 rounded border border-[#232F3E]">
          <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span>{evidence.timestamp ? new Date(evidence.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged Record'}</span>
        </div>
      </div>

      {/* Participants Banner */}
      {participants.length > 0 && (
        <div className="bg-[#0B0F14]/70 px-4 py-2 border-b border-[#232F3E] flex items-center space-x-2 text-xs font-mono text-[#9AA6B2]">
          <span className="text-[#8FA7BA]">Participants:</span>
          {participants.map((p, idx) => (
            <span key={idx} className="bg-[#18212C] text-[#F4F1E8] px-2 py-0.5 rounded border border-[#232F3E]">
              {p}
            </span>
          ))}
        </div>
      )}

      {/* Message Stream */}
      <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto bg-[#0B0F14]/40">
        {messages.length === 0 ? (
          <p className="text-xs font-mono text-[#9AA6B2] text-center py-8">No readable message threads recovered from cache.</p>
        ) : (
          messages.map((msg, index) => {
            const isFirstParticipant = participants.length > 0 && msg.sender === participants[0];

            return (
              <div
                key={index}
                className={`flex flex-col ${isFirstParticipant ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center space-x-2 mb-1 px-1">
                  <span className="text-xs font-mono font-medium text-[#8FA7BA]">
                    {msg.sender}
                  </span>
                  <span className="text-[10px] font-mono text-[#9AA6B2]">
                    {msg.time}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed border ${
                    isFirstParticipant
                      ? 'bg-[#18212C] text-[#F4F1E8] border-[#232F3E] rounded-tl-sm'
                      : 'bg-[#D6A84F]/15 text-[#F4F1E8] border-[#D6A84F]/30 rounded-tr-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Investigator Note Footer */}
      {content.investigatorNote && (
        <div className="bg-[#18212C] border-t border-[#232F3E] p-3.5 flex items-start space-x-2.5 text-xs text-[#8FA7BA]">
          <ShieldAlert className="w-4 h-4 text-[#D6A84F] flex-shrink-0 mt-0.5" />
          <span><strong className="text-[#F4F1E8]">Forensic Note:</strong> {content.investigatorNote}</span>
        </div>
      )}
    </div>
  );
};

export default ChatEvidenceViewer;

