import React from "react";
import {
  Zap,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  Bot,
  Flame,
  Award
} from "lucide-react";

interface JEEHubSectionProps {
  onSelectAction: (action: "infinity" | "chapter_tests" | "pyq_mains" | "pyq_adv" | "ai_tutor" | "mock_mains" | "mock_adv") => void;
}

export const JEEHubSection: React.FC<JEEHubSectionProps> = ({ onSelectAction }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-2xl">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">The JEE Hub</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              One place for adaptive practice, 14,000+ JEE Mains PYQs DB, mock series & AI teacher. Built into JEE MASTER.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="https://github.com/HostServer001/jee_mains_pyqs_data_base"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>GitHub PYQ Database ↗</span>
          </a>
          <a
            href="https://t.me/+hIQCGTm2bjYzNTdl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Telegram Channel ↗</span>
          </a>
        </div>
      </div>

      {/* Grid of Launch Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Tile 1: Infinity Question Bank */}
        <div
          onClick={() => onSelectAction("infinity")}
          className="group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                ADAPTIVE
              </span>
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors">
              Infinity Question Bank — PCM
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adaptive practice engine that keeps serving Maths, Physics & Chemistry problems calibrated to your performance level.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-sky-400 font-bold">
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 2: Chapter-wise Tests & PYQs */}
        <div
          onClick={() => onSelectAction("chapter_tests")}
          className="group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                72 CHAPTERS
              </span>
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
              Chapter-wise Tests & PYQs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drill any chapter, any time. Chapter selection for targeted test series and previous year questions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-bold">
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 3: JEE Mains PYQ — Full Syllabus */}
        <div
          onClick={() => onSelectAction("pyq_mains")}
          className="group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                MAINS
              </span>
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
              JEE Mains PYQ — Full Syllabus (Year-wise)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real papers, real pressure. Year-wise full-syllabus JEE Mains previous year papers from 2002 to 2026.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 4: JEE Advanced PYQ — Full Syllabus */}
        <div
          onClick={() => onSelectAction("pyq_adv")}
          className="group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                ADVANCED
              </span>
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors">
              JEE Advanced PYQ — Full Syllabus (Year-wise)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The toughest, ranked by year. Your year-full-syllabus JEE Advanced previous year papers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-bold">
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 5: AI Personal Tutor */}
        <div
          onClick={() => onSelectAction("ai_tutor")}
          className="group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                AI GEMINI
              </span>
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
              AI Personal Tutor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI teacher that explains, solves, and drills every JEE concept instantly. Embedded Gemini powered.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 6: JEE Mains Mock Tests */}
        <div
          onClick={() => onSelectAction("mock_mains")}
          className="group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                MOCK
              </span>
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              JEE Mains Mock Tests (Non-PYQ)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-length fresh mock papers designed for JEE Mains with real timers and instant score analysis.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-bold">
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
};
