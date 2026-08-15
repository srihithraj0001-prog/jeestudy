import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Chapter } from "../types";
import { X, Zap, Loader2, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { sanitizeMathMarkdown } from "../utils/mathSanitizer";

interface AIStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  mainsScore: number;
  advScore: number;
}

export const AIStrategyModal: React.FC<AIStrategyModalProps> = ({
  isOpen,
  onClose,
  chapters,
  mainsScore,
  advScore,
}) => {
  const [strategyText, setStrategyText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Identify weak high-weightage chapters
  const weakChapters = chapters
    .filter((c) => c.weightCategory === "High" && c.mainsAcc < 60)
    .slice(0, 8)
    .map((c) => ({ name: c.name, sub: c.sub, mainsAcc: c.mainsAcc, weight: c.mainWt }));

  const strongChapters = chapters
    .filter((c) => c.mainsAcc >= 75)
    .slice(0, 5)
    .map((c) => ({ name: c.name, sub: c.sub, mainsAcc: c.mainsAcc }));

  const handleGenerateStrategy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakChapters,
          strongChapters,
          mainsScore: mainsScore.toFixed(1),
          advScore: advScore.toFixed(1),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate strategy");

      setStrategyText(data.strategy);
    } catch (err: any) {
      setStrategyText(`⚠️ **Error**: ${err.message || "Unable to contact AI strategy engine."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                AI Weakness Diagnosis & Score Booster
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  7-Day Plan
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Calculates highest return-on-investment chapters based on your tracked accuracy.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block uppercase font-semibold">
                Current Predicted Mains
              </span>
              <span className="text-xl font-extrabold text-sky-400 font-mono">
                {mainsScore.toFixed(1)} / 300
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block uppercase font-semibold">
                High Wt Weak Chapters
              </span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">
                {weakChapters.length} Detected
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block uppercase font-semibold">
                Target Score Gain
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                +35–50 Marks
              </span>
            </div>
          </div>

          {/* Chapters flagged */}
          {weakChapters.length > 0 && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Priority Attention Required for High Weightage Chapters:
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {weakChapters.map((wc, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-950/80 border border-amber-700/50 text-amber-300 px-2 py-0.5 rounded font-mono text-[11px]"
                  >
                    [{wc.sub}] {wc.name} ({wc.mainsAcc}% acc)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button or Result */}
          {!strategyText && !isLoading && (
            <div className="text-center py-8 bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-6">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-white mb-1">
                Ready to Generate Personalized 7-Day Strategy?
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                Gemini AI will analyze your weak high-weightage chapters and output a customized daily practice schedule, revision tricks, and target goals.
              </p>
              <button
                onClick={handleGenerateStrategy}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all"
              >
                Generate Custom AI Action Plan ✨
              </button>
            </div>
          )}

          {isLoading && (
            <div className="py-12 text-center text-xs text-purple-300 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
              <p>Analyzing chapter weightages, accuracy distribution & generating 7-day plan...</p>
            </div>
          )}

          {strategyText && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-purple-300 prose-headings:text-sky-300">
              <ReactMarkdown>{sanitizeMathMarkdown(strategyText)}</ReactMarkdown>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Targeting JEE Main & Advanced Score Maximization</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
