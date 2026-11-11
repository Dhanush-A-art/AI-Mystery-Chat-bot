import React, { useState } from 'react';
import { Camera, ZoomIn, ZoomOut, Maximize2, ShieldAlert } from 'lucide-react';

const ImageEvidenceViewer = ({ evidence }) => {
  const [zoom, setZoom] = useState(1);
  const content = evidence.content || {};

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="bg-[#121923] border border-[#232F3E] rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-[#F4F1E8] text-base">
              {evidence.title}
            </h3>
            <p className="text-xs font-mono text-[#8FA7BA]">
              Forensic Photographic Capture &bull; {evidence.location || 'Crime Scene'}
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-[#0B0F14] border border-[#232F3E] rounded-lg p-1 text-xs">
          <button
            onClick={handleZoomOut}
            className="p-1 text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[#D6A84F] px-2 text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors ml-1"
            title="Reset"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Stage */}
      <div className="relative bg-[#05070A] overflow-hidden min-h-[350px] max-h-[500px] flex items-center justify-center p-4">
        {evidence.assetUrl ? (
          <div
            className="transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={evidence.assetUrl}
              alt={evidence.title}
              className="max-h-[460px] max-w-full rounded border border-[#232F3E] shadow-2xl object-contain"
            />
          </div>
        ) : (
          <div className="text-center text-[#9AA6B2] font-mono text-xs">
            <Camera className="w-12 h-12 mx-auto text-[#8FA7BA] mb-2 opacity-50" />
            NO RECOVERABLE FORENSIC IMAGE FILE FOUND
          </div>
        )}
      </div>

      {/* Forensic Report */}
      <div className="p-5 bg-[#18212C] border-t border-[#232F3E] space-y-3">
        <div className="text-sm text-[#F4F1E8] leading-relaxed">
          {evidence.description}
        </div>

        {content.forensicNotes && (
          <div className="bg-[#121923] border border-[#232F3E] rounded-lg p-3.5 text-xs text-[#8FA7BA] space-y-1">
            <strong className="text-[#D6A84F] font-mono block">LAB ANALYSIS:</strong>
            <p>{content.forensicNotes}</p>
            {content.clue && (
              <p className="text-[#F4F1E8] pt-1 border-t border-[#232F3E]/50 font-medium">
                🔎 <span className="text-[#D6A84F]">Discrepancy:</span> {content.clue}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEvidenceViewer;

