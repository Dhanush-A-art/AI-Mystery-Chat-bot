import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, PlusCircle, User, LogOut, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-[#232F3E] bg-[#0B0F14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#18212C] border border-[#D6A84F]/40 flex items-center justify-center text-[#D6A84F] group-hover:border-[#D6A84F] transition-colors">
              <ShieldAlert className="w-5 h-5 text-[#D6A84F]" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-[#F4F1E8] tracking-wider block">
                AI MYSTERY ROOM
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#D6A84F] uppercase">
                Investigation Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/" className="text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors">
              Home
            </Link>
            <a href="/#how-it-works" className="text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors">
              How It Works
            </a>
            <Link to="/dashboard" className="text-[#9AA6B2] hover:text-[#F4F1E8] transition-colors flex items-center space-x-1">
              <span>My Cases</span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/create')}
              className="hidden sm:inline-flex items-center space-x-2 bg-[#D6A84F] hover:bg-[#C49742] text-[#0B0F14] font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-md transition-all shadow-md shadow-[#D6A84F]/10 hover:shadow-[#D6A84F]/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Mystery</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3 border-l border-[#232F3E] pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#18212C] border border-[#232F3E] flex items-center justify-center text-[#D6A84F] text-xs font-mono font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[#F4F1E8] hidden lg:inline">
                    Det. {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-[#9AA6B2] hover:text-[#C95D5D] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-medium text-[#9AA6B2] hover:text-[#F4F1E8] px-3 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-medium bg-[#18212C] hover:bg-[#232F3E] text-[#D6A84F] border border-[#D6A84F]/30 px-3 py-1.5 rounded transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

