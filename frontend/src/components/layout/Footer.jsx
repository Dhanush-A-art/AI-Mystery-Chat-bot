import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[#232F3E] bg-[#0B0F14] text-[#9AA6B2] text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
          <span>AI Mystery Room &copy; 2026. All generated cases, evidence, and characters are entirely fictional.</span>
        </div>
        <div className="flex items-center space-x-6 text-[#9AA6B2]">
          <span className="hover:text-[#F4F1E8] cursor-pointer">Security Protocol</span>
          <span className="hover:text-[#F4F1E8] cursor-pointer">Case Archives</span>
          <span className="hover:text-[#F4F1E8] cursor-pointer">Spec-Driven Engine</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

