import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  BrainCircuit,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  'Theft',
  'Murder Mystery',
  'Missing Person',
  'Corporate Secrets',
  'Cyber Mystery',
  'Historical Mystery',
  'Custom Mystery'
];

const SAMPLE_SCENARIOS = [
  {
    title: "Blackwood Diamond Heist",
    category: "Theft",
    scenario: "A priceless blue diamond disappeared from the private vault of the Blackwood Archive during the evening gala. Four employees were in the sub-basement when the CCTV network mysteriously glitched for 14 minutes."
  },
  {
    title: "The Midnight Boardroom Sabotage",
    category: "Corporate Secrets",
    scenario: "Proprietary AI source code was exported from the server room of NovaTech Industries at 11:42 PM. Three senior software executives claim they were in an off-site video conference, but network logs reveal local physical terminal override."
  },
  {
    title: "The Vanishing Diplomat",
    category: "Missing Person",
    scenario: "A foreign envoy failed to report for their morning security briefing from the luxury suites of Grand Continental Hotel. Room service tray was found untouched, but the patio door lock was picked from the inside."
  }
];

const CreateMystery = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [scenario, setScenario] = useState('');
  const [category, setCategory] = useState('Theft');
  const [difficulty, setDifficulty] = useState('Medium');
  const [suspectCount, setSuspectCount] = useState(4);
  const [evidenceComplexity, setEvidenceComplexity] = useState('Intermediate');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const loadingMessages = [
    "Analyzing narrative premises and crime dynamics...",
    "Profiling fictional suspects, backgrounds, and alibis...",
    "Predetermining solitary culprit and motive in private vault...",
    "Synthesizing forensic timeline and electronic access logs...",
    "Generating multi-format evidence: chats, CCTV, and forensic captures...",
    "Performing strict logical consistency validation...",
    "Securing the investigation room..."
  ];

  const handleUseSample = (sample) => {
    setTitle(sample.title);
    setCategory(sample.category);
    setScenario(sample.scenario);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scenario.trim() || scenario.trim().length < 15) {
      setError('Please provide a detailed scenario (at least 15 characters)');
      return;
    }

    setError('');
    setLoading(true);

    // Staged loading effect
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await api.post('/cases', {
        title,
        scenario,
        category,
        difficulty,
        suspectCount,
        evidenceComplexity
      });

      clearInterval(interval);
      if (res.success && res.data.caseId) {
        navigate(`/investigate/${res.data.caseId}`);
      }
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Failed to generate investigation case');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-[#0B0F14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#18212C] border border-[#D6A84F] flex items-center justify-center text-[#D6A84F] mb-6 animate-pulse">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-[#F4F1E8] mb-2">
              Gemini Investigation Architect
            </h3>

            <p className="font-mono text-sm text-[#D6A84F] h-6 mb-8 transition-all">
              {loadingMessages[loadingStep]}
            </p>

            <div className="w-full max-w-md bg-[#18212C] border border-[#232F3E] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D6A84F] to-[#69A982] h-full transition-all duration-700"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-[#8FA7BA] mt-3">
              Building airtight clues, red herrings, and suspect alibis...
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#18212C] border border-[#D6A84F]/30 text-[#D6A84F] text-xs font-mono mb-4 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Investigation Builder</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#F4F1E8]">
            Commission a New Case File
          </h1>

          <p className="text-sm text-[#9AA6B2] mt-2 max-w-xl mx-auto">
            Provide the foundation of a crime. The AI engine will architect suspects, evidence records, and a predetermined truth for you to uncover.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#C95D5D]/15 border border-[#C95D5D]/40 text-[#C95D5D] text-xs font-mono">
            {error}
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="mb-8">
          <div className="text-xs font-mono text-[#8FA7BA] uppercase tracking-wider mb-3">
            Quick Start Scenarios (Click to Load):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_SCENARIOS.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleUseSample(s)}
                className="bg-[#121923] hover:bg-[#18212C] border border-[#232F3E] hover:border-[#D6A84F]/40 rounded-lg p-3.5 cursor-pointer transition-all"
              >
                <div className="text-xs font-semibold text-[#D6A84F] mb-1">
                  {s.title}
                </div>
                <div className="text-[11px] text-[#9AA6B2] line-clamp-2">
                  {s.scenario}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-[#121923] border border-[#232F3E] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Case Title */}
          <div>
            <label className="text-xs font-mono text-[#8FA7BA] block mb-2 uppercase">
              Case Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Midnight Disappearance"
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg px-4 py-3 text-sm text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F]"
            />
          </div>

          {/* Scenario Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-[#D6A84F] uppercase tracking-wider">
                Crime Scenario / Story Prompt (Required)
              </label>
              <span className="text-[11px] text-[#8FA7BA] font-mono">
                Min 15 characters
              </span>
            </div>
            <textarea
              required
              rows={5}
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="A valuable prototype was taken from the laboratory on Friday night. Three engineers were working late. The security cameras experienced an unexplained 15-minute outage right before the fire alarm sounded..."
              className="w-full bg-[#18212C] border border-[#232F3E] rounded-lg p-4 text-sm text-[#F4F1E8] placeholder-[#9AA6B2] focus:outline-none focus:border-[#D6A84F] leading-relaxed"
            />
          </div>

          {/* Category & Difficulty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono text-[#8FA7BA] block mb-2 uppercase">
                Mystery Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#18212C] border border-[#232F3E] text-sm text-[#F4F1E8] rounded-lg p-3 focus:outline-none focus:border-[#D6A84F]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#8FA7BA] block mb-2 uppercase">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Easy', 'Medium', 'Hard', 'Expert'].map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-3 rounded-lg border text-xs font-mono font-medium transition-all ${
                      difficulty === diff
                        ? 'bg-[#18212C] border-[#D6A84F] text-[#D6A84F]'
                        : 'bg-[#18212C]/40 border-[#232F3E] text-[#9AA6B2] hover:border-[#8FA7BA]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Suspect Count & Complexity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="text-xs font-mono text-[#8FA7BA] block mb-2 uppercase">
                Suspect Count ({suspectCount} Suspects)
              </label>
              <div className="flex items-center space-x-2">
                {[3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSuspectCount(num)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                      suspectCount === num
                        ? 'bg-[#18212C] border-[#D6A84F] text-[#D6A84F]'
                        : 'bg-[#18212C]/40 border-[#232F3E] text-[#9AA6B2]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#8FA7BA] block mb-2 uppercase">
                Evidence Complexity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(comp => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setEvidenceComplexity(comp)}
                    className={`py-2.5 rounded-lg border text-[11px] font-mono transition-all ${
                      evidenceComplexity === comp
                        ? 'bg-[#18212C] border-[#D6A84F] text-[#D6A84F]'
                        : 'bg-[#18212C]/40 border-[#232F3E] text-[#9AA6B2]'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#232F3E]">
            <button
              type="submit"
              disabled={loading || !scenario.trim()}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-sm uppercase tracking-wider py-4 rounded-lg transition-all shadow-lg shadow-[#D6A84F]/15 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Mystery Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMystery;

