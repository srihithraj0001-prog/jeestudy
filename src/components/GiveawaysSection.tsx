import React from "react";
import { Gift, Award, ExternalLink, Sparkles, Send } from "lucide-react";

export const GiveawaysSection: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Win Free Goodies</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Every few weeks, tell us why you should win, and we'll pick lucky aspirants live.
            </p>
          </div>
        </div>
      </div>

      {/* Giveaway Card */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
          PAST & CURRENT GIVEAWAYS
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 rounded-full font-bold">
                🏆 WINNER ANNOUNCED
              </span>
              <span className="text-xs text-slate-400 font-semibold">10+ Winners</span>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">Phase 1</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">Mega JEE Giveaway Pack 2026 | Phase 1</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              🎁 PW Batches (Offline & Online), PW Pro Access, Unacademy Batches (Offline & Online), Vibrant Resources, Mission Jeet, Science & Fun, Just Padhle, PW Offline Centres & Tests, Next Toppers, Premium Test Series, Handbooks Collection, Modules & Study Material, Revision Packages, Question Banks & DPP Collection, Premium Short Notes Collection.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-amber-400">FOLLOW THESE RULES OTHERWISE YOU WILL GET DISQUALIFIED:</p>
            <p>1. Join our Official Telegram Channel for live updates and winner tags.</p>
            <p>2. Keep practicing daily on JEE MASTER!</p>
          </div>

          <a
            href="https://t.me/+hIQCGTm2bjYzNTdl"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram for Giveaway Entry ➔</span>
          </a>

        </div>
      </div>

    </div>
  );
};
