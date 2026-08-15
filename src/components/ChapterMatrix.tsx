import React, { useState } from "react";
import { Chapter, Subject } from "../types";
import { Search, Filter, BookOpen, Sparkles, HelpCircle, CheckCircle } from "lucide-react";

interface ChapterMatrixProps {
  chapters: Chapter[];
  onUpdateAcc: (id: number, mode: "mains" | "adv", value: number) => void;
  onOpenNotes: (chapter: Chapter) => void;
  onOpenQuiz: (chapter: Chapter) => void;
  onSendToDoubtSolver: (chapterName: string) => void;
}

export const ChapterMatrix: React.FC<ChapterMatrixProps> = ({
  chapters,
  onUpdateAcc,
  onOpenNotes,
  onOpenQuiz,
  onSendToDoubtSolver,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<"All" | Subject>("All");
  const [selectedWeight, setSelectedWeight] = useState<"All" | "High" | "Medium" | "Low">("All");

  const filteredChapters = chapters.filter((ch) => {
    const matchesSearch = ch.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSub = selectedSubject === "All" || ch.sub === selectedSubject;
    const matchesWeight = selectedWeight === "All" || ch.weightCategory === selectedWeight;
    return matchesSearch && matchesSub && matchesWeight;
  });

  const getSubTagClass = (sub: Subject) => {
    switch (sub) {
      case "Physics":
        return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      case "Chemistry":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "Maths":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    }
  };

  const getWeightBadge = (weight?: string) => {
    if (weight === "High") {
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    }
    if (weight === "Medium") {
      return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    }
    return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/50">
        
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(["All", "Physics", "Chemistry", "Maths"] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === sub
                  ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
              }`}
            >
              {sub === "All" ? "All 72 Chapters" : sub}
            </button>
          ))}
        </div>

        {/* Search & Weightage Filters */}
        <div className="flex items-center gap-2">
          
          {/* Weightage Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Weightages</option>
              <option value="High" className="bg-slate-900">High Weightage 🔥</option>
              <option value="Medium" className="bg-slate-900">Medium Weightage</option>
              <option value="Low" className="bg-slate-900">Low Weightage</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chapter or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/90 text-slate-400 text-xs uppercase font-semibold sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3">Subject</th>
              <th className="py-3 px-3 min-w-[220px]">Chapter Name</th>
              <th className="py-3 px-3 text-center">Main Wt</th>
              <th className="py-3 px-3 text-center">Adv Wt</th>
              <th className="py-3 px-3 text-center min-w-[120px]">50-Mains Acc (%)</th>
              <th className="py-3 px-3 text-center min-w-[120px]">50-Adv Acc (%)</th>
              <th className="py-3 px-3 text-right">AI Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredChapters.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No chapters found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredChapters.map((ch) => {
                const isTested = ch.mainsAcc > 0 || ch.advAcc > 0;
                return (
                  <tr
                    key={ch.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isTested ? "bg-slate-900/30" : ""
                    }`}
                  >
                    {/* ID */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 font-semibold">
                      {ch.id}
                    </td>

                    {/* Subject Tag */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${getSubTagClass(
                          ch.sub
                        )}`}
                      >
                        {ch.sub}
                      </span>
                    </td>

                    {/* Name & Weight Badge */}
                    <td className="py-2.5 px-3 font-medium text-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{ch.name}</span>
                        {ch.weightCategory && (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] rounded border font-semibold ${getWeightBadge(
                              ch.weightCategory
                            )}`}
                          >
                            {ch.weightCategory === "High" ? "High Wt 🔥" : ch.weightCategory}
                          </span>
                        )}
                        {isTested && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
                        )}
                      </div>
                    </td>

                    {/* Main Wt */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                      ~{ch.mainWt} M
                    </td>

                    {/* Adv Wt */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                      ~{ch.advWt} M
                    </td>

                    {/* Mains Acc Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 focus-within:border-sky-500">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={ch.mainsAcc || ""}
                          placeholder="0"
                          onChange={(e) =>
                            onUpdateAcc(ch.id, "mains", parseFloat(e.target.value) || 0)
                          }
                          className="w-12 text-center bg-transparent text-sky-400 font-mono font-bold focus:outline-none"
                        />
                        <span className="text-slate-500 text-[10px]">%</span>
                      </div>
                    </td>

                    {/* Adv Acc Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 focus-within:border-purple-500">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={ch.advAcc || ""}
                          placeholder="0"
                          onChange={(e) =>
                            onUpdateAcc(ch.id, "adv", parseFloat(e.target.value) || 0)
                          }
                          className="w-12 text-center bg-transparent text-purple-400 font-mono font-bold focus:outline-none"
                        />
                        <span className="text-slate-500 text-[10px]">%</span>
                      </div>
                    </td>

                    {/* AI Tools */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Formula Cheat Sheet */}
                        <button
                          onClick={() => onOpenNotes(ch)}
                          className="p-1.5 bg-slate-800 hover:bg-sky-900/60 text-sky-400 border border-slate-700 hover:border-sky-500/50 rounded transition-all"
                          title="Generate AI Formula Sheet & Notes"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>

                        {/* AI Quiz */}
                        <button
                          onClick={() => onOpenQuiz(ch)}
                          className="p-1.5 bg-slate-800 hover:bg-purple-900/60 text-purple-400 border border-slate-700 hover:border-purple-500/50 rounded transition-all"
                          title="Generate AI Custom Practice Quiz"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {/* Ask AI Doubt */}
                        <button
                          onClick={() => onSendToDoubtSolver(`Chapter: ${ch.name} (${ch.sub}). Please explain top 3 high-probability question patterns, key formulas, and exam traps for this chapter.`)}
                          className="p-1.5 bg-slate-800 hover:bg-emerald-900/60 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 rounded transition-all"
                          title="Ask AI Doubt regarding this chapter"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          Showing <strong>{filteredChapters.length}</strong> of {chapters.length} chapters
        </span>
        <span className="text-slate-500 text-[11px]">
          💡 Tip: Click the AI icons beside any chapter to generate custom formula sheets, practice quizzes, or ask specific doubts.
        </span>
      </div>

    </div>
  );
};
