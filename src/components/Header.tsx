import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  Sparkles,
  ExternalLink,
  GraduationCap,
  Zap,
  Edit3,
  Home,
  Layers,
  Table,
  FileText,
  Brain,
  CheckSquare,
  BookOpen,
  Library,
  Users,
  Gift,
  Info,
  Menu,
  X,
  Send,
  Atom,
  Video
} from "lucide-react";

export type AppTab =
  | "home"
  | "hub"
  | "matrix"
  | "lectures"
  | "notes"
  | "pyq"
  | "dpp"
  | "books"
  | "simulations"
  | "focus"
  | "giveaways"
  | "about";

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  aiActive: boolean;
  onOpenStrategy: () => void;
  userProfile?: UserProfile | null;
  onEditProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  aiActive,
  onOpenStrategy,
  userProfile,
  onEditProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "hub", label: "JEE Hub", icon: <Zap className="w-4 h-4 text-sky-400" /> },
    { id: "lectures", label: "AI Lectures", icon: <Video className="w-4 h-4 text-purple-400" />, badge: "AI" },
    { id: "matrix", label: "72 Ch. Matrix", icon: <Table className="w-4 h-4" /> },
    { id: "notes", label: "Notes", icon: <FileText className="w-4 h-4" /> },
    { id: "pyq", label: "PYQ & Tests", icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { id: "dpp", label: "DPP", icon: <CheckSquare className="w-4 h-4 text-emerald-400" /> },
    { id: "books", label: "Books", icon: <Library className="w-4 h-4 text-cyan-400" /> },
    { id: "simulations", label: "Simulations", icon: <Atom className="w-4 h-4 text-pink-400" /> },
    { id: "focus", label: "Focus & Squad", icon: <Users className="w-4 h-4 text-emerald-400" /> },
    { id: "giveaways", label: "Giveaways", icon: <Gift className="w-4 h-4 text-amber-300" /> },
    { id: "about", label: "About Us", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white text-center py-1.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b border-purple-500/30">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Join our Telegram for more free resources & live updates!</span>
        <a
          href="https://t.me/+hIQCGTm2bjYzNTdl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full text-[11px] hover:bg-amber-300 transition-colors shadow-sm ml-1"
        >
          <Send className="w-3 h-3" />
          <span>Join Telegram ↗</span>
        </a>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => onTabChange("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                JEE MASTER
              </h1>
              <span className="bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                HUB 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Your Place for JEE Preparation 🚀</p>
          </div>
        </div>

        {/* Right Action Controls: AI Strategy & User Profile */}
        <div className="flex items-center gap-2.5">
          
          {userProfile && (
            <button
              onClick={onEditProfile}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs transition-all text-slate-200"
              title="Edit Profile"
            >
              <span className="text-base">{userProfile.avatar}</span>
              <div className="text-left">
                <span className="font-bold text-white block leading-none">{userProfile.name}</span>
                <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">{userProfile.userClass}</span>
              </div>
              <Edit3 className="w-3 h-3 text-slate-400 ml-1" />
            </button>
          )}

          <button
            onClick={onOpenStrategy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition-all border border-purple-400/30 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>AI Strategy</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* 3. PRIMARY NAVIGATION BAR (Desktop Horizontal Scrollable Bar) */}
      <div className="border-t border-slate-900 bg-slate-950/80 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? "bg-sky-500 text-slate-950 font-black shadow"
                      : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {userProfile && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{userProfile.avatar}</span>
                <div>
                  <span className="text-xs font-bold text-white block">{userProfile.name}</span>
                  <span className="text-[10px] text-emerald-400">{userProfile.userClass}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onEditProfile) onEditProfile();
                }}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-semibold"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}

    </header>
  );
};
