import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Folder,
  Users,
  FileSearch,
  Clock,
  BookOpen,
  Bot,
  ShieldAlert,
  ArrowLeft,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Video,
  FileText,
  Camera,
  Mic
} from 'lucide-react';

import ChatEvidenceViewer from '../components/evidence/ChatEvidenceViewer';
import CctvEvidenceViewer from '../components/evidence/CctvEvidenceViewer';
import DocumentViewer from '../components/evidence/DocumentViewer';
import ImageEvidenceViewer from '../components/evidence/ImageEvidenceViewer';
import WitnessViewer from '../components/evidence/WitnessViewer';

import DetectiveNotes from '../components/investigation/DetectiveNotes';
import AssistantModal from '../components/investigation/AssistantModal';
import AccusationModal from '../components/investigation/AccusationModal';

const InvestigationRoom = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();

  // Core Data State
  const [caseItem, setCaseItem] = useState(null);
  const [suspects, setSuspects] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [investigation, setInvestigation] = useState(null);

  // Active Selections
  const [activeTab, setActiveTab] = useState('evidence'); // 'evidence' | 'suspects' | 'timeline'
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [evidenceFilter, setEvidenceFilter] = useState('all');

  // Modals
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);

  // Loading & Submitting
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingAccusation, setSubmittingAccusation] = useState(false);

  useEffect(() => {
    loadInvestigationData();
  }, [caseId]);

  const loadInvestigationData = async () => {
    try {
      setLoading(true);
      const [caseRes, suspectsRes, evidenceRes, timelineRes, invRes] = await Promise.all([
        api.get(`/cases/${caseId}`),
        api.get(`/cases/${caseId}/suspects`),
        api.get(`/cases/${caseId}/evidence`),
        api.get(`/cases/${caseId}/timeline`),
        api.get(`/investigations/${caseId}`)
      ]);

      if (caseRes.success) setCaseItem(caseRes.data);
      if (suspectsRes.success) {
        setSuspects(suspectsRes.data);
        if (suspectsRes.data.length > 0) setSelectedSuspect(suspectsRes.data[0]);
      }
      if (evidenceRes.success) {
        setEvidenceList(evidenceRes.data);
        if (evidenceRes.data.length > 0) setSelectedEvidence(evidenceRes.data[0]);
      }
      if (timelineRes.success) setTimeline(timelineRes.data.timeline || []);
      if (invRes.success) {
        setInvestigation(invRes.data);
        // If case is already solved or failed, navigate directly to results
        if (invRes.data.status === 'solved' || invRes.data.status === 'failed') {
          navigate(`/cases/${caseId}/result`);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize investigation room');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvidence = async (evidenceItem) => {
    setSelectedEvidence(evidenceItem);
    try {
      // Calling GET evidence details records it as opened in the backend
      const res = await api.get(`/cases/${caseId}/evidence/${evidenceItem.evidenceId}`);
      if (res.success) {
        setSelectedEvidence(res.data);
        setInvestigation(prev => ({
          ...prev,
          openedEvidenceIds: Array.from(new Set([...(prev?.openedEvidenceIds || []), evidenceItem.evidenceId]))
        }));
      }
    } catch (e) {
      console.warn('Failed to mark evidence opened:', e);
    }
  };

  const handleSaveNotes = async (updatedNotes) => {
    const res = await api.put(`/investigations/${caseId}/notes`, { notes: updatedNotes });
    if (res.success) {
      setInvestigation(prev => ({ ...prev, notes: res.data }));
    }
  };

  const handleRequestHint = async (level, question) => {
    const res = await api.post(`/investigations/${caseId}/hints`, { level, question });
    if (res.success) {
      setInvestigation(prev => ({
        ...prev,
        hintsUsed: res.data.hintsUsed,
        hintHistory: [...(prev?.hintHistory || []), { level, question, hint: res.data.hint }]
      }));
      return res.data;
    }
  };

  const handleConfirmAccusation = async (suspectId, reasoning) => {
    setSubmittingAccusation(true);
    try {
      const res = await api.post(`/investigations/${caseId}/accuse`, { suspectId, reasoning });
      if (res.success) {
        setIsAccusationOpen(false);
        navigate(`/cases/${caseId}/result`);
      }
    } catch (err) {
      alert(err.message || 'Accusation failed to submit');
    } finally {
      setSubmittingAccusation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center font-mono text-sm text-[#D6A84F] p-4">
        <div className="w-10 h-10 border-2 border-[#D6A84F] border-t-transparent rounded-full animate-spin mb-4" />
        <div>DECRYPTING INVESTIGATION DOSSIER...</div>
      </div>
    );
  }

  if (error || !caseItem) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-[#C95D5D] mb-4" />
        <h2 className="text-xl font-heading font-bold text-[#F4F1E8] mb-2">Access Restricted</h2>
        <p className="text-xs font-mono text-[#9AA6B2] mb-6">{error || 'Case file unreadable'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 bg-[#18212C] text-[#F4F1E8] border border-[#232F3E] text-xs px-4 py-2 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    );
  }

  const openedCount = investigation?.openedEvidenceIds?.length || 0;
  const filteredEvidence = evidenceList.filter(e => {
    if (evidenceFilter === 'all') return true;
    return e.type === evidenceFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col">
      {/* Top Investigation Bar */}
      <div className="bg-[#121923] border-b border-[#232F3E] px-4 py-3 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded bg-[#18212C] border border-[#232F3E] text-[#9AA6B2] hover:text-[#F4F1E8]"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-base sm:text-lg text-[#F4F1E8] truncate max-w-md">
              {caseItem.title}
            </h1>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8FA7BA]">
              <span className="text-[#D6A84F]">{caseItem.category}</span>
              <span>&bull;</span>
              <span>Difficulty: {caseItem.difficulty}</span>
              <span>&bull;</span>
              <span>Scene: {caseItem.location}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsNotesOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-[#18212C] hover:bg-[#232F3E] text-[#F4F1E8] border border-[#232F3E] text-xs px-3.5 py-2 rounded-lg transition-colors font-mono"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>Notes ({investigation?.notes?.length || 0})</span>
          </button>

          <button
            onClick={() => setIsAssistantOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-[#18212C] hover:bg-[#232F3E] text-[#D6A84F] border border-[#D6A84F]/30 text-xs px-3.5 py-2 rounded-lg transition-colors font-mono"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Assistant</span>
          </button>

          <button
            onClick={() => setIsAccusationOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-[#C95D5D] hover:bg-[#b04f4f] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-[#C95D5D]/20 uppercase tracking-wider"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Accuse</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Suspects, Overview & Timeline (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab Selector */}
          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-1.5 flex items-center space-x-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex-1 py-1.5 rounded text-center transition-all ${
                activeTab === 'evidence'
                  ? 'bg-[#18212C] text-[#D6A84F] font-bold border border-[#232F3E]'
                  : 'text-[#9AA6B2] hover:text-[#F4F1E8]'
              }`}
            >
              Evidence
            </button>
            <button
              onClick={() => setActiveTab('suspects')}
              className={`flex-1 py-1.5 rounded text-center transition-all ${
                activeTab === 'suspects'
                  ? 'bg-[#18212C] text-[#D6A84F] font-bold border border-[#232F3E]'
                  : 'text-[#9AA6B2] hover:text-[#F4F1E8]'
              }`}
            >
              Suspects ({suspects.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-1.5 rounded text-center transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[#18212C] text-[#D6A84F] font-bold border border-[#232F3E]'
                  : 'text-[#9AA6B2] hover:text-[#F4F1E8]'
              }`}
            >
              Timeline
            </button>
          </div>

          {/* Left Panel Content */}
          {activeTab === 'suspects' ? (
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-mono uppercase text-[#D6A84F] tracking-wider mb-2">
                Identified Suspects
              </h3>
              <div className="space-y-2">
                {suspects.map((s) => {
                  const isSelected = selectedSuspect?.suspectId === s.suspectId;
                  return (
                    <div
                      key={s.suspectId}
                      onClick={() => setSelectedSuspect(s)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#18212C] border-[#D6A84F]'
                          : 'bg-[#18212C]/40 border-[#232F3E] hover:border-[#8FA7BA]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={s.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#232F3E]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#F4F1E8] truncate">{s.name}</div>
                          <div className="text-[10px] text-[#8FA7BA] font-mono">{s.occupation} ({s.suspectId})</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#9AA6B2] line-clamp-2">
                        {s.description}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedSuspect && (
                <div className="mt-4 pt-4 border-t border-[#232F3E] space-y-2 text-xs">
                  <div className="font-mono text-[#D6A84F] text-[11px] uppercase">
                    Detailed Dossier: {selectedSuspect.name}
                  </div>
                  <div className="bg-[#18212C] p-3 rounded border border-[#232F3E] space-y-2 text-[11px]">
                    <div>
                      <strong className="text-[#8FA7BA] block">Stated Alibi:</strong>
                      <span className="text-[#F4F1E8]">{selectedSuspect.alibi}</span>
                    </div>
                    <div>
                      <strong className="text-[#8FA7BA] block">Crime Relationship:</strong>
                      <span className="text-[#F4F1E8]">{selectedSuspect.relationship}</span>
                    </div>
                    {selectedSuspect.publicInfo?.length > 0 && (
                      <div>
                        <strong className="text-[#8FA7BA] block">Verified Facts:</strong>
                        <ul className="list-disc list-inside text-[#9AA6B2] space-y-0.5 mt-0.5">
                          {selectedSuspect.publicInfo.map((info, i) => (
                            <li key={i}>{info}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'timeline' ? (
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-mono uppercase text-[#D6A84F] tracking-wider mb-2">
                Public Case Chronology
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {timeline.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-[#D6A84F] pl-3 py-1 space-y-0.5">
                    <div className="text-xs font-mono text-[#D6A84F] font-bold">{item.time}</div>
                    <div className="text-xs text-[#F4F1E8]">{item.event}</div>
                    {item.location && (
                      <div className="text-[10px] font-mono text-[#8FA7BA]">📍 {item.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Evidence Filter List */
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-[#D6A84F] mb-1">
                <span>Evidence Records</span>
                <span>{openedCount}/{evidenceList.length} Examined</span>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#232F3E]">
                {['all', 'chat', 'cctv', 'document', 'image', 'witness_statement'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setEvidenceFilter(filter)}
                    className={`text-[10px] font-mono uppercase px-2 py-1 rounded transition-colors ${
                      evidenceFilter === filter
                        ? 'bg-[#D6A84F] text-[#0B0F14] font-bold'
                        : 'bg-[#18212C] text-[#8FA7BA] hover:text-[#F4F1E8]'
                    }`}
                  >
                    {filter.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredEvidence.map((ev) => {
                  const isSelected = selectedEvidence?.evidenceId === ev.evidenceId;
                  const isOpened = investigation?.openedEvidenceIds?.includes(ev.evidenceId);

                  return (
                    <div
                      key={ev.evidenceId}
                      onClick={() => handleOpenEvidence(ev)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start space-x-2.5 ${
                        isSelected
                          ? 'bg-[#18212C] border-[#D6A84F]'
                          : 'bg-[#18212C]/40 border-[#232F3E] hover:border-[#8FA7BA]'
                      }`}
                    >
                      <div className="mt-0.5 text-[#D6A84F]">
                        {ev.type === 'chat' && <MessageSquare className="w-4 h-4" />}
                        {ev.type === 'cctv' && <Video className="w-4 h-4 text-[#C95D5D]" />}
                        {ev.type === 'document' && <FileText className="w-4 h-4" />}
                        {ev.type === 'image' && <Camera className="w-4 h-4" />}
                        {ev.type === 'witness_statement' && <Mic className="w-4 h-4 text-[#69A982]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-semibold text-[#F4F1E8] truncate">
                            {ev.title}
                          </span>
                          {isOpened && (
                            <span className="w-2 h-2 rounded-full bg-[#69A982] flex-shrink-0" title="Examined" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[#8FA7BA] uppercase">
                          {ev.evidenceId} &bull; {ev.type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Center Column: Active Evidence Inspection Workspace (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {selectedEvidence ? (
            <div>
              {selectedEvidence.type === 'chat' && <ChatEvidenceViewer evidence={selectedEvidence} />}
              {selectedEvidence.type === 'cctv' && <CctvEvidenceViewer evidence={selectedEvidence} />}
              {selectedEvidence.type === 'document' && <DocumentViewer evidence={selectedEvidence} />}
              {selectedEvidence.type === 'image' && <ImageEvidenceViewer evidence={selectedEvidence} />}
              {selectedEvidence.type === 'witness_statement' && <WitnessViewer evidence={selectedEvidence} />}
            </div>
          ) : (
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-16 text-center text-[#9AA6B2] font-mono text-xs">
              Select an evidence item from the catalog to inspect.
            </div>
          )}
        </div>

        {/* Right Column: Case Summary & Accusation Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Investigation Status Widget */}
          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-sm text-[#F4F1E8]">
              Forensic Readiness
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8FA7BA]">Evidence Examined:</span>
                <span className="text-[#D6A84F] font-bold">{openedCount} / {evidenceList.length}</span>
              </div>
              <div className="w-full bg-[#18212C] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#D6A84F] h-full transition-all duration-300"
                  style={{ width: `${(openedCount / Math.max(evidenceList.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="border-t border-[#232F3E] pt-3 text-xs space-y-1">
              <div className="flex justify-between font-mono text-[#8FA7BA]">
                <span>Hints Consulted:</span>
                <span className="text-[#F4F1E8]">{investigation?.hintsUsed || 0}</span>
              </div>
              <div className="flex justify-between font-mono text-[#8FA7BA]">
                <span>Logged Notes:</span>
                <span className="text-[#F4F1E8]">{investigation?.notes?.length || 0}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAccusationOpen(true)}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#C95D5D] hover:bg-[#b04f4f] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-md shadow-[#C95D5D]/20 mt-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Accusation</span>
            </button>
          </div>

          {/* Incident Background */}
          <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-5 space-y-2 text-xs">
            <h4 className="font-mono text-[#D6A84F] text-[11px] uppercase tracking-wider">
              Original Incident Premise
            </h4>
            <p className="text-[#9AA6B2] leading-relaxed">
              {caseItem.scenario}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetectiveNotes
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={investigation?.notes || []}
        onSaveNotes={handleSaveNotes}
        suspects={suspects}
        evidenceList={evidenceList}
      />

      <AssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onRequestHint={handleRequestHint}
        hintHistory={investigation?.hintHistory || []}
      />

      <AccusationModal
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        suspects={suspects}
        onConfirmAccusation={handleConfirmAccusation}
        submitting={submittingAccusation}
      />
    </div>
  );
};

export default InvestigationRoom;

