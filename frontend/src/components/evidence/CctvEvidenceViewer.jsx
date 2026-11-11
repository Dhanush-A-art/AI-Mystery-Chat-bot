import React from 'react';
import { Video, AlertTriangle, ShieldCheck, Eye } from 'lucide-react';

const CctvEvidenceViewer = ({ evidence }) => {
  const content = evidence.content || {};

  return (
    <div className="bg-[#121923] border border-[#232F3E] rounded-xl overflow-hidden shadow-2xl">
      {/* CCTV HUD Header */}
      <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#C95D5D]/10 border border-[#C95D5D]/30 flex items-center justify-center text-[#C95D5D]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-[#F4F1E8] text-base">
              {evidence.title}
            </h3>
            <p className="text-xs font-mono text-[#8FA7BA]">
              {content.cameraTag || 'SURVEILLANCE RECORDER'} &bull; {evidence.location || 'Internal Circuit'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#0B0F14] px-3 py-1.5 rounded border border-[#232F3E] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#C95D5D] animate-ping" />
          <span className="text-[#C95D5D] font-bold">REC</span>
          <span className="text-[#9AA6B2] ml-2">{content.recordedTime || evidence.timestamp || '20:30:00'}</span>
        </div>
      </div>

      {/* Screen Frame with Scanlines and Simulated Feed */}
      <div className="relative bg-[#05070A] border-y border-[#232F3E] overflow-hidden min-h-[300px] flex items-center justify-center">
        {evidence.assetUrl ? (
          <img
            src={evidence.assetUrl}
            alt="CCTV Frame Capture"
            className="w-full max-h-[420px] object-cover filter contrast-125 brightness-90 grayscale-[20%]"
          />
        ) : (
          <div className="p-12 text-center text-[#9AA6B2]">
            <Eye className="w-12 h-12 mx-auto text-[#8FA7BA] mb-2 opacity-50" />
            <p className="font-mono text-xs">CCTV FRAME CAPTURED VIA ARCHIVE SENSOR</p>
          </div>
        )}

        {/* Scanline overlay */}
        <div className="absolute inset-0 cctv-scanline pointer-events-none" />

        {/* Camera Overlay HUD Text */}
        <div className="absolute top-3 left-4 font-mono text-[11px] text-[#69A982] tracking-wider drop-shadow-md">
          FEED: {content.cameraTag || 'CAM-01'} [1080p @ 15FPS]
        </div>
        <div className="absolute top-3 right-4 font-mono text-[11px] text-[#69A982] tracking-wider drop-shadow-md">
          {content.recordedTime || 'TIMESTAMP VERIFIED'}
        </div>
        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-[#8FA7BA] tracking-wider bg-black/60 px-2 py-1 rounded">
          LOCATION: {evidence.location || 'RESTRICTED PERIMETER'}
        </div>
      </div>

      {/* Forensic Breakdown */}
      <div className="p-5 space-y-3 bg-[#121923]">
        <div className="text-sm text-[#F4F1E8] leading-relaxed">
          <strong className="text-[#D6A84F] font-mono text-xs block mb-1">RECORDED OBSERVATION:</strong>
          {content.visualDetails || evidence.description}
        </div>

        {content.discrepancy && (
          <div className="bg-[#18212C] border border-[#D6A84F]/30 rounded-lg p-3.5 flex items-start space-x-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-[#D6A84F] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#D6A84F] block mb-0.5">TIMING ANOMALY:</span>
              <span className="text-[#8FA7BA]">{content.discrepancy}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CctvEvidenceViewer;

