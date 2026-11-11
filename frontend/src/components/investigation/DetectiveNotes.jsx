import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Save, X } from 'lucide-react';

const DetectiveNotes = ({ notes, onSaveNotes, suspects, evidenceList, isOpen, onClose }) => {
  const [currentNotes, setCurrentNotes] = useState(notes || []);
  const [newText, setNewText] = useState('');
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddNote = () => {
    if (!newText.trim()) return;
    const newNote = {
      noteId: 'note_' + Date.now(),
      text: newText.trim(),
      suspectId: selectedSuspect || null,
      evidenceId: selectedEvidence || null,
      createdAt: new Date().toISOString()
    };
    const updated = [newNote, ...currentNotes];
    setCurrentNotes(updated);
    setNewText('');
    setSelectedSuspect('');
    setSelectedEvidence('');
  };

  const handleDeleteNote = (noteId) => {
    const updated = currentNotes.filter(n => n.noteId !== noteId);
    setCurrentNotes(updated);
  };

  const handleSaveAndClose = async () => {
    setSaving(true);
    try {
      await onSaveNotes(currentNotes);
      onClose();
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121923] border border-[#232F3E] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#18212C] border-b border-[#232F3E] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#D6A84F]">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-heading font-bold text-base text-[#F4F1E8]">
              Detective Case Notebook
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9AA6B2] hover:text-[#F4F1E8] p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Note Input */}
        <div className="p-4 bg-[#0B0F14]/70 border-b border-[#232F3E] space-y-3">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Record your forensic deductions, contradictory statements, or alibi discrepancies..."
            className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg p-3 text-xs text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F] min-h-[80px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSuspect}
                onChange={(e) => setSelectedSuspect(e.target.value)}
                className="bg-[#18212C] border border-[#232F3E] text-xs text-[#F4F1E8] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#D6A84F]"
              >
                <option value="">Tag Suspect (Optional)</option>
                {suspects.map(s => (
                  <option key={s.suspectId} value={s.suspectId}>
                    {s.name} ({s.suspectId})
                  </option>
                ))}
              </select>

              <select
                value={selectedEvidence}
                onChange={(e) => setSelectedEvidence(e.target.value)}
                className="bg-[#18212C] border border-[#232F3E] text-xs text-[#F4F1E8] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#D6A84F]"
              >
                <option value="">Tag Evidence (Optional)</option>
                {evidenceList.map(e => (
                  <option key={e.evidenceId} value={e.evidenceId}>
                    {e.evidenceId}: {e.title.slice(0, 25)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddNote}
              disabled={!newText.trim()}
              className="inline-flex items-center space-x-1.5 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-semibold text-xs px-3.5 py-1.5 rounded transition-all disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Existing Notes List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#121923]">
          {currentNotes.length === 0 ? (
            <div className="text-center py-10 text-[#9AA6B2] font-mono text-xs">
              Notebook is empty. Record suspicious behaviors as you inspect evidence.
            </div>
          ) : (
            currentNotes.map((note) => (
              <div
                key={note.noteId}
                className="bg-[#18212C] border border-[#232F3E] rounded-lg p-3.5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <p className="text-[#F4F1E8] whitespace-pre-line leading-relaxed">
                    {note.text}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#8FA7BA]">
                    {note.suspectId && (
                      <span className="bg-[#0B0F14] text-[#D6A84F] px-2 py-0.5 rounded border border-[#232F3E]">
                        👤 {note.suspectId}
                      </span>
                    )}
                    {note.evidenceId && (
                      <span className="bg-[#0B0F14] text-[#69A982] px-2 py-0.5 rounded border border-[#232F3E]">
                        📄 {note.evidenceId}
                      </span>
                    )}
                    <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNote(note.noteId)}
                  className="text-[#9AA6B2] hover:text-[#C95D5D] p-1 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#18212C] border-t border-[#232F3E] p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndClose}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-semibold text-xs px-4 py-2 rounded transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Sync Notebook'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectiveNotes;

