import React, { useState } from "react";
import { FULL_JEE_SYLLABUS } from "../data/syllabus";
import { CheckSquare, ExternalLink, Search } from "lucide-react";

export const DPPSection: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = FULL_JEE_SYLLABUS.filter((ch) => {
    const subMatch =
      activeSubject === "Physics"
        ? ch.sub === "Physics"
        : activeSubject === "Chemistry"
        ? ch.sub === "Chemistry"
        : ch.sub === "Maths";
    return subMatch && ch.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const class11 = filtered.filter((c) => c.class === 11);
  const class12 = filtered.filter((c) => c.class === 12);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Daily Practice Problems (DPP)</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Topic-wise DPPs with complete step-by-step solutions for consistent problem solving.
            </p>
          </div>
        </div>
      </div>

      {/* Subject Buttons */}
      <div className="flex items-center gap-3">
        {(["Physics", "Chemistry", "Mathematics"] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubject === sub
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>{sub === "Physics" ? "⚡" : sub === "Chemistry" ? "🧪" : "📐"}</span>
            <span>{sub}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeSubject} DPPs...`}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Chapter Cards Grid */}
      <div className="space-y-6">
        {class11.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">CLASS 11</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {class11.map((ch) => (
                <div key={ch.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-white">{ch.name}</span>
                  </div>
                  <a
                    href={`https://drive.google.com/search?q=${encodeURIComponent(`JEE ${ch.name} DPP sheet PDF`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-colors"
                    title="Open DPP Sheet"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {class12.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">CLASS 12</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {class12.map((ch) => (
                <div key={ch.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-sky-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs font-bold text-white">{ch.name}</span>
                  </div>
                  <a
                    href={`https://drive.google.com/search?q=${encodeURIComponent(`JEE ${ch.name} DPP sheet PDF`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-sky-500/20 text-sky-300 rounded-xl hover:bg-sky-500/30 transition-colors"
                    title="Open DPP Sheet"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
