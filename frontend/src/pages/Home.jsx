import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  KeyRound,
  FileSearch,
  Sparkles,
  Layers,
  Award,
  Video,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F4F1E8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-[#232F3E]">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D6A84F]/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#18212C] border border-[#D6A84F]/30 text-[#D6A84F] text-xs font-mono mb-6 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Spec-Driven Mystery Platform</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#F4F1E8] mb-6 leading-tight">
            Every Mystery Has a Secret. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6A84F] via-[#F4F1E8] to-[#D6A84F]">
              Can You Find It?
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#9AA6B2] mb-10 leading-relaxed">
            Enter the world of digital investigation. Create custom mysteries from your own story ideas, uncover forensic chat logs, analyze CCTV footage, cross-examine witness statements, and discover the truth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/create')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg transition-all shadow-lg shadow-[#D6A84F]/20 hover:scale-[1.02]"
            >
              <span>Start Investigating</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#18212C] hover:bg-[#232F3E] text-[#F4F1E8] border border-[#232F3E] font-medium text-sm px-7 py-4 rounded-lg transition-all"
            >
              <span>Explore How It Works</span>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-b border-[#232F3E] bg-[#0E141B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-[#F4F1E8] tracking-wide mb-3">
              How the Investigation Works
            </h2>
            <p className="text-sm font-mono text-[#D6A84F] uppercase tracking-widest">
              From Concept to Conviction in Three Stages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-8 relative hover:border-[#D6A84F]/50 transition-colors group">
              <div className="text-4xl font-mono font-bold text-[#232F3E] group-hover:text-[#D6A84F]/30 transition-colors mb-4">
                01
              </div>
              <h3 className="font-heading font-semibold text-xl text-[#F4F1E8] mb-3">
                Create Your Mystery
              </h3>
              <p className="text-sm text-[#9AA6B2] leading-relaxed">
                Describe any story scenario or choose a category. Gemini orchestrates the storyline, selects a hidden culprit, and constructs an airtight timeline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-8 relative hover:border-[#D6A84F]/50 transition-colors group">
              <div className="text-4xl font-mono font-bold text-[#232F3E] group-hover:text-[#D6A84F]/30 transition-colors mb-4">
                02
              </div>
              <h3 className="font-heading font-semibold text-xl text-[#F4F1E8] mb-3">
                Investigate the Evidence
              </h3>
              <p className="text-sm text-[#9AA6B2] leading-relaxed">
                Step into the digital investigation room. Inspect WhatsApp-style chats, CCTV stills, door access logs, crime scene photos, and recorded interviews.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-8 relative hover:border-[#D6A84F]/50 transition-colors group">
              <div className="text-4xl font-mono font-bold text-[#232F3E] group-hover:text-[#D6A84F]/30 transition-colors mb-4">
                03
              </div>
              <h3 className="font-heading font-semibold text-xl text-[#F4F1E8] mb-3">
                Find the Culprit
              </h3>
              <p className="text-sm text-[#9AA6B2] leading-relaxed">
                Identify the discrepancies, weed out red herrings, and submit your official accusation. Unlock the full sequence of events and forensic score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="py-24 bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-[#F4F1E8] tracking-wide mb-3">
              Forensic Investigation Capabilities
            </h2>
            <p className="text-sm text-[#9AA6B2]">
              Engineered to feel like a real detective headquarters rather than a trivia quiz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F] mb-4">
                <FileSearch className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-base text-[#F4F1E8] mb-2">
                Multi-Format Evidence
              </h4>
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                Every case includes $\ge 8$ evidence items across chats, surveillance stills, audit logs, and audio transcripts.
              </p>
            </div>

            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#69A982]/10 border border-[#69A982]/30 flex items-center justify-center text-[#69A982] mb-4">
                <KeyRound className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-base text-[#F4F1E8] mb-2">
                Predetermined Culprit
              </h4>
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                The culprit and true motive are strictly locked before evidence generation to ensure logical integrity.
              </p>
            </div>

            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#8FA7BA]/10 border border-[#8FA7BA]/30 flex items-center justify-center text-[#8FA7BA] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-base text-[#F4F1E8] mb-2">
                AI Detective Assistant
              </h4>
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                Consult a tiered forensic assistant that analyzes public facts and offers hints without spoiling solutions.
              </p>
            </div>

            <div className="bg-[#121923] border border-[#232F3E] rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#C95D5D]/10 border border-[#C95D5D]/30 flex items-center justify-center text-[#C95D5D] mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-base text-[#F4F1E8] mb-2">
                Deduction Scoring
              </h4>
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                Earn bonus points for solving cases without hints and submitting detailed forensic reasoning.
              </p>
            </div>
          </div>

          {/* Quick Start Callout */}
          <div className="mt-20 bg-gradient-to-r from-[#18212C] via-[#121923] to-[#18212C] border border-[#D6A84F]/30 rounded-2xl p-10 text-center">
            <h3 className="font-heading text-2xl font-bold text-[#F4F1E8] mb-3">
              Ready to solve your first mystery?
            </h3>
            <p className="text-sm text-[#9AA6B2] max-w-xl mx-auto mb-6">
              No account required. Jump straight into an active guest session or register to save your permanent case history.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-md transition-all shadow-md shadow-[#D6A84F]/20"
            >
              <span>Launch New Case File</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

