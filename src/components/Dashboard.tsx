import React from "react";
import { Chapter } from "../types";
import { Award, Target, TrendingUp, CheckCircle2, RotateCcw } from "lucide-react";

interface DashboardProps {
  chapters: Chapter[];
  onResetProgress: () => void;
  onOpenStrategy: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ chapters, onResetProgress, onOpenStrategy }) => {
  // Calculate predicted scores
  let mainsScore = 0;
  let advScore = 0;
  let mainsMaxPossible = 0;
  let advMaxPossible = 0;
  let chaptersPracticed = 0;

  chapters.forEach((ch) => {
    mainsScore += ch.mainWt * (ch.mainsAcc / 100);
    advScore += ch.advWt * (ch.advAcc / 100);
    mainsMaxPossible += ch.mainWt;
    advMaxPossible += ch.advWt;
    if (ch.mainsAcc > 0 || ch.advAcc > 0) {
      chaptersPracticed++;
    }
  });

  const completionPercentage = Math.round((chaptersPracticed / chapters.length) * 100);

  // Subject breakdowns
  const getSubjectStats = (subName: "Physics" | "Chemistry" | "Maths") => {
    const subChs = chapters.filter((c) => c.sub === subName);
    const count = subChs.length;
    const practiced = subChs.filter((c) => c.mainsAcc > 0 || c.advAcc > 0).length;
    const avgMainsAcc = subChs.reduce((acc, c) => acc + c.mainsAcc, 0) / (count || 1);
    return { count, practiced, avgMainsAcc: Math.round(avgMainsAcc) };
  };

  const phy = getSubjectStats("Physics");
  const chem = getSubjectStats("Chemistry");
  const math = getSubjectStats("Maths");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: JEE Main Predicted Score */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-sky-500/50 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Award className="w-20 h-20 text-sky-400" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Predicted JEE Main
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Out of 300
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {mainsScore.toFixed(1)}{" "}
            <span className="text-sm font-normal text-slate-400">/ 300</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Weighted accuracy sum</span>
          <span className="text-sky-400 font-mono font-semibold">
            {Math.round((mainsScore / (mainsMaxPossible || 300)) * 100)}% Effective
          </span>
        </div>
      </div>

      {/* Card 2: JEE Advanced Predicted Score */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-20 h-20 text-purple-400" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Predicted JEE Advanced
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Out of 180
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {advScore.toFixed(1)}{" "}
            <span className="text-sm font-normal text-slate-400">/ 180</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Weighted accuracy sum</span>
          <span className="text-purple-400 font-mono font-semibold">
            {Math.round((advScore / (advMaxPossible || 180)) * 100)}% Effective
          </span>
        </div>
      </div>

      {/* Card 3: Syllabus Coverage Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Syllabus Practiced
            </span>
            <span className="text-xs font-bold text-white font-mono">
              {chaptersPracticed}/{chapters.length}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {completionPercentage}%{" "}
            <span className="text-xs font-normal text-slate-400">Chapters Tested</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-sky-500 via-emerald-400 to-teal-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Log accuracy for score calculation</span>
          <button
            onClick={onResetProgress}
            className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            title="Reset logged accuracies"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Card 4: Subject Stats Quick Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Subject Accuracy Breakdown
          </span>
          
          <div className="space-y-2 mt-2.5 text-xs">
            {/* Physics */}
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-medium">Physics ({phy.count})</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{phy.practiced} logged</span>
                <span className="font-mono bg-sky-950/80 text-sky-300 border border-sky-800/50 px-1.5 py-0.5 rounded font-bold">
                  {phy.avgMainsAcc}%
                </span>
              </div>
            </div>

            {/* Chemistry */}
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-medium">Chemistry ({chem.count})</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{chem.practiced} logged</span>
                <span className="font-mono bg-rose-950/80 text-rose-300 border border-rose-800/50 px-1.5 py-0.5 rounded font-bold">
                  {chem.avgMainsAcc}%
                </span>
              </div>
            </div>

            {/* Mathematics */}
            <div className="flex items-center justify-between">
              <span className="text-purple-400 font-medium">Maths ({math.count})</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{math.practiced} logged</span>
                <span className="font-mono bg-purple-950/80 text-purple-300 border border-purple-800/50 px-1.5 py-0.5 rounded font-bold">
                  {math.avgMainsAcc}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenStrategy}
          className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold transition-all text-center"
        >
          View AI Priority Recommendations →
        </button>
      </div>

    </div>
  );
};
