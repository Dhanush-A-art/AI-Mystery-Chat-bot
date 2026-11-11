import React from 'react';
import { FileText, KeyRound, Receipt, CheckCircle, AlertOctagon } from 'lucide-react';

const DocumentViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const entries = content.entries || [];
  const items = content.items || [];

  return (
    <div className="bg-[#121923] border border-[#232F3E] rounded-xl overflow-hidden shadow-2xl">
      {/* Document Header */}
      <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-[#F4F1E8] text-base">
              {evidence.title}
            </h3>
            <p className="text-xs font-mono text-[#8FA7BA]">
              {content.documentType || 'Official Document Record'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono bg-[#0B0F14] text-[#D6A84F] border border-[#D6A84F]/30 px-2.5 py-1 rounded uppercase tracking-wider">
          Exhibit #{evidence.evidenceId}
        </span>
      </div>

      {/* Document Sheet Styling */}
      <div className="p-6 bg-[#0B0F14]/60">
        <div className="bg-[#18212C] border border-[#232F3E] rounded-lg p-5 font-mono text-xs text-[#F4F1E8] shadow-inner space-y-4">
          {content.header && (
            <div className="border-b border-[#232F3E] pb-2 text-center text-[#D6A84F] font-bold tracking-widest uppercase">
              {content.header}
            </div>
          )}

          {content.storeName && (
            <div className="text-center border-b border-[#232F3E] pb-2 text-[#F4F1E8]">
              <div className="text-sm font-bold">{content.storeName}</div>
              <div className="text-[10px] text-[#9AA6B2]">{content.date}</div>
            </div>
          )}

          {/* Audit Log Entries Table */}
          {entries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#232F3E] text-[#8FA7BA] text-[11px]">
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Identifier / Badge</th>
                    <th className="py-2 px-3">Authentication Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232F3E]">
                  {entries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-[#121923]/50">
                      <td className="py-2.5 px-3 text-[#D6A84F]">{entry.time}</td>
                      <td className="py-2.5 px-3">{entry.badgeId}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            entry.status.includes('GRANTED')
                              ? 'bg-[#69A982]/20 text-[#69A982]'
                              : 'bg-[#C95D5D]/20 text-[#C95D5D]'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Itemized Receipt Items */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] text-[#8FA7BA] uppercase tracking-wider mb-1">Items Purchased:</div>
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-[#232F3E]/40 text-[#F4F1E8]">
                  <span>{item}</span>
                </div>
              ))}
              {content.paymentMethod && (
                <div className="pt-2 text-right text-[11px] text-[#8FA7BA]">
                  Payment Tender: <strong className="text-[#D6A84F]">{content.paymentMethod}</strong>
                </div>
              )}
            </div>
          )}

          {/* Freeform Description if no entries */}
          {entries.length === 0 && items.length === 0 && (
            <div className="text-sm leading-relaxed text-[#F4F1E8] whitespace-pre-line font-sans">
              {evidence.description}
            </div>
          )}

          {content.notes && (
            <div className="pt-3 border-t border-[#232F3E] text-[11px] text-[#8FA7BA] italic">
              * Archive Annotation: {content.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;

