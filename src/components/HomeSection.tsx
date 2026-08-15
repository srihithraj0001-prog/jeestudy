import React from "react";
import {
  Sparkles,
  BookOpen,
  Zap,
  Target,
  GraduationCap,
  FileText,
  Brain,
  CheckSquare,
  Library,
  Users,
  Award,
  ArrowRight,
  Send,
  ExternalLink,
  Flame,
  Globe,
  Video
} from "lucide-react";

interface HomeSectionProps {
  onNavigate: (tab: "home" | "hub" | "matrix" | "lectures" | "notes" | "pyq" | "dpp" | "books" | "focus" | "giveaways" | "about") => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Your Complete JEE Preparation Hub</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
          Crack IIT JEE with <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">JEE MASTER</span> 🚀
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Everything you need — <span className="text-white font-semibold">Notes, DPP, Books & Coaching Material</span>. All free, all in one place.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate("hub")}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://t.me/+hIQCGTm2bjYzNTdl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs sm:text-sm rounded-2xl border border-purple-500/30 shadow-lg flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 text-purple-400" />
            <span>Join Telegram ↗</span>
          </a>

          <a
            href="https://github.com/HostServer001/jee_mains_pyqs_data_base"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm rounded-2xl border border-amber-500/30 shadow-lg flex items-center gap-2 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>14k+ PYQ DB Repo ↗</span>
          </a>
        </div>

      </div>

      {/* 2. PINNED RESOURCES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span>FEATURED BY ADMIN</span>
        </div>

        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>📌 Pinned Resources</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div
            onClick={() => onNavigate("books")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                PCM • BOOKS
              </span>
              <h3 className="text-sm font-extrabold text-white group-hover:text-sky-300 transition-colors mt-2">
                ARJUNA JEE 2026 LATEST MODULES PW
              </h3>
              <p className="text-xs text-slate-400 mt-1">Full PCM modules, chapter-wise problem sets & solutions</p>
            </div>
            <div className="p-2.5 bg-purple-600/20 text-purple-300 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate("books")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                PCM • BOOKS
              </span>
              <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors mt-2">
                LAKSHYA JEE 2027 LATEST MODULES
              </h3>
              <p className="text-xs text-slate-400 mt-1">Complete Class 11 + 12 foundational theory & exercise sheets</p>
            </div>
            <div className="p-2.5 bg-sky-600/20 text-sky-300 rounded-xl border border-sky-500/30 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* 3. EXPLORE RESOURCES GRID */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-white">🚀 Explore Resources</h2>
          <p className="text-xs text-slate-400 mt-0.5">Pick a section and start your preparation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Tile 1: JEE Hub */}
          <div
            onClick={() => onNavigate("hub")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-start gap-4"
          >
            <div className="p-3 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">JEE HUB</h3>
              <p className="text-xs text-slate-400 mt-1">AI tutor, mocks, infinity bank & more</p>
            </div>
          </div>

          {/* Tile 2: AI Lectures */}
          <div
            onClick={() => onNavigate("lectures")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-start gap-4"
          >
            <div className="p-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">AI Lectures</h3>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold px-1.5 rounded">NEW</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Advanced AI Explanations + Side Notes</p>
            </div>
          </div>

          {/* Tile 2: Notes */}
          <div
            onClick={() => onNavigate("notes")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-start gap-4"
          >
            <div className="p-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Notes</h3>
              <p className="text-xs text-slate-400 mt-1">Long, Short & Topper Notes</p>
            </div>
          </div>

          {/* Tile 3: PYQ & Tests */}
          <div
            onClick={() => onNavigate("pyq")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-start gap-4"
          >
            <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">PYQ & Tests</h3>
              <p className="text-xs text-slate-400 mt-1">14,000+ PYQs & Mock Practice Engine</p>
            </div>
          </div>

          {/* Tile 4: DPP */}
          <div
            onClick={() => onNavigate("dpp")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-start gap-4"
          >
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">DPP</h3>
              <p className="text-xs text-slate-400 mt-1">Daily Practice Problems</p>
            </div>
          </div>

          {/* Tile 4: Books */}
          <div
            onClick={() => onNavigate("books")}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all shadow-lg flex items-start gap-4"
          >
            <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
              <Library className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">Books</h3>
              <p className="text-xs text-slate-400 mt-1">Recommended study material</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. COUNTER STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
          <div className="text-2xl sm:text-3xl font-black text-sky-400">200+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Chapters Covered</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">25+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Years of PYQs</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
          <div className="text-2xl sm:text-3xl font-black text-purple-400">1000+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Practice Problems</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Free Forever</div>
        </div>

      </div>

      {/* 5. WHY JEE MASTER SECTION */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">WHY JEE MASTER</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Built for Serious JEE Aspirants</h2>
          <p className="text-xs text-slate-400 mt-2">
            Everything you need for JEE preparation in one clean platform — organized resources, focused practice, regular updates, and a distraction-free experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Curated Study Resources</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access high-quality Notes, PYQs, Formula Sheets, NCERT Resources and important study material organized chapter-wise for faster learning.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Practice with Purpose</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solve topic-wise questions, previous year papers and mock tests designed around the latest JEE pattern.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Fast & Distraction-Free</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quick navigation, clean interface and organized content help students spend more time learning instead of searching.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Always Improving</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              New resources, tests and learning material are added regularly so your preparation stays up to date.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
