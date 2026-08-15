import React from "react";
import { Info, Heart, CheckCircle2, Send, ShieldAlert } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl sm:text-4xl font-black text-white">About Us</h1>
        <p className="text-xs sm:text-sm text-slate-400">JEE MASTER Hub — Free Learning for Every Aspirant</p>
      </div>

      {/* Main Mission Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">JEE Master Hub</strong> is built with a simple mission — to provide free and quality education to every IIT JEE aspirant.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          In this app, you will find all essential study resources in one place, including Notes, DPPs, PYQs, Books, Mind Maps, and Coaching Materials — all organized in a structured and easy-to-use format.
        </p>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>✨ Why this app?</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% free study resources</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Well-organized chapter-wise content</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Designed for Class 11 & Class 12 (PCM)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Saves time by bringing everything in one place</span>
            </div>
          </div>
        </div>

        {/* Databases & Resources Credits */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Open-Source PYQ & Test Database:</span>
          </div>
          <p>
            Test questions and PYQ database powered & structured by{" "}
            <a
              href="https://github.com/HostServer001/jee_mains_pyqs_data_base"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300 font-medium"
            >
              HostServer001/jee_mains_pyqs_data_base
            </a>{" "}
            (14,000+ cached JEE Mains questions & embeddings).
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Disclaimer:</span>
          </div>
          <p>
            We do not own any of the external resources provided in this app. All materials belong to their respective owners and are shared solely for educational purposes.
          </p>
        </div>

        <p className="text-xs text-slate-400 italic text-center border-t border-slate-800 pt-4">
          This app is made with dedication by <strong className="text-purple-400">Team Phoenix</strong> to support students and promote free education for all.
        </p>

        <div className="pt-2 text-center flex flex-wrap justify-center gap-3">
          <a
            href="https://t.me/+hIQCGTm2bjYzNTdl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram Channel ➔</span>
          </a>
          <a
            href="https://github.com/HostServer001/jee_mains_pyqs_data_base"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl text-xs transition-all border border-slate-700 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>View GitHub PYQ Database ➔</span>
          </a>
        </div>

      </div>

    </div>
  );
};
