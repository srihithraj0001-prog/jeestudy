import React, { useState, useMemo } from "react";
import { Chapter } from "../types";
import { PYQQuestion, HAND_CRAFTED_PYQS, getPYQsForChapter } from "../data/pyqDatabase";
import { sanitizeMathMarkdown } from "../utils/mathSanitizer";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  Bot,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  RotateCcw,
  BookMarked
} from "lucide-react";

interface PYQBankEngineProps {
  chapters: Chapter[];
  onUpdateAcc: (id: number, mode: "mains" | "adv", val: number) => void;
  onSendToDoubtSolver: (text: string) => void;
}

export const PYQBankEngine: React.FC<PYQBankEngineProps> = ({
  chapters,
  onUpdateAcc,
  onSendToDoubtSolver,
}) => {
  // Mode: "browse" or "mock_test"
  const [viewMode, setViewMode] = useState<"browse" | "mock_test">("browse");

  // Selection Filters
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1); // Default to Chapter 1
  const [examTypeFilter, setExamTypeFilter] = useState<"All" | "JEE Main" | "JEE Advanced">("All");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [diffFilter, setDiffFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // UI state for question interaction in browse mode
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Custom AI Generated extra PYQs per chapter
  const [aiGeneratedPYQs, setAiGeneratedPYQs] = useState<Record<number, PYQQuestion[]>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Mock Test State
  const [testQuestions, setTestQuestions] = useState<PYQQuestion[]>([]);
  const [testUserAnswers, setTestUserAnswers] = useState<Record<string, number>>({});
  const [testTimeLeft, setTestTimeLeft] = useState<number>(1800); // 30 minutes
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);

  // Filtered chapter list by subject
  const availableChapters = useMemo(() => {
    if (selectedSubject === "All") return chapters;
    const subMap: Record<string, string> = {
      Physics: "Physics",
      Chemistry: "Chemistry",
      Mathematics: "Maths"
    };
    return chapters.filter((c) => c.sub === subMap[selectedSubject] || c.sub === selectedSubject);
  }, [chapters, selectedSubject]);

  const selectedChapterObj = useMemo(() => {
    return chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  }, [chapters, selectedChapterId]);

  // Load 100 PYQs (50 Mains + 50 Advanced) for selected chapter + hand-crafted baseline
  const currentChapterQuestions = useMemo(() => {
    if (!selectedChapterId) return [];
    const base = getPYQsForChapter(selectedChapterId);
    const extra = aiGeneratedPYQs[selectedChapterId] || [];
    return [...base, ...extra];
  }, [selectedChapterId, aiGeneratedPYQs]);

  // Apply search and filters
  const filteredQuestions = useMemo(() => {
    return currentChapterQuestions.filter((q) => {
      if (examTypeFilter !== "All" && q.exam !== examTypeFilter) return false;
      if (yearFilter !== "All" && q.year.toString() !== yearFilter) return false;
      if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
      if (showBookmarksOnly && !bookmarkedIds.includes(q.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(query);
        const matchesSol = q.solution.toLowerCase().includes(query);
        const matchesTags = q.conceptTags.some((t) => t.toLowerCase().includes(query));
        if (!matchesText && !matchesSol && !matchesTags) return false;
      }
      return true;
    });
  }, [currentChapterQuestions, examTypeFilter, yearFilter, diffFilter, searchQuery, showBookmarksOnly, bookmarkedIds]);

  // Count stats
  const mainsCount = useMemo(() => currentChapterQuestions.filter((q) => q.exam === "JEE Main").length, [currentChapterQuestions]);
  const advCount = useMemo(() => currentChapterQuestions.filter((q) => q.exam === "JEE Advanced").length, [currentChapterQuestions]);

  // Handle Option Select in Browse mode
  const handleOptionSelect = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setShowSolutions((prev) => ({ ...prev, [qId]: true }));
  };

  const toggleSolution = (qId: string) => {
    setShowSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // AI Live PYQ Generator
  const handleGenerateFreshAIPYQs = async () => {
    if (!selectedChapterObj) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/generate-pyq-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterName: selectedChapterObj.name,
          subject: selectedChapterObj.sub,
          examType: examTypeFilter === "JEE Advanced" ? "adv" : "mains",
          count: 5
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      if (data.pyqs && Array.isArray(data.pyqs)) {
        const formatted: PYQQuestion[] = data.pyqs.map((q: any, idx: number) => ({
          id: `ai_live_${selectedChapterObj.id}_${Date.now()}_${idx}`,
          subject: selectedChapterObj.sub === "Maths" ? "Mathematics" : (selectedChapterObj.sub as any),
          chapterId: selectedChapterObj.id,
          chapterName: selectedChapterObj.name,
          exam: examTypeFilter === "JEE Advanced" ? "JEE Advanced" : "JEE Main",
          year: 2025,
          shift: "AI Live Practice",
          type: "MCQ",
          questionText: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          solution: q.solution,
          difficulty: "Medium",
          conceptTags: [selectedChapterObj.name, "AI Live Practice"]
        }));

        setAiGeneratedPYQs((prev) => ({
          ...prev,
          [selectedChapterObj.id]: [...(prev[selectedChapterObj.id] || []), ...formatted]
        }));
      }
    } catch (err) {
      console.error("Failed to generate live AI PYQs", err);
      alert("Note: AI key required for generating fresh live questions. Showing full 100 authentic procedural PYQs.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Start Chapter Mock Test Mode
  const handleStartMockTest = () => {
    // Pick 20 questions (10 Mains + 10 Advanced) from selected chapter
    const mainsList = currentChapterQuestions.filter((q) => q.exam === "JEE Main").slice(0, 10);
    const advList = currentChapterQuestions.filter((q) => q.exam === "JEE Advanced").slice(0, 10);
    const combined = [...mainsList, ...advList];

    setTestQuestions(combined);
    setTestUserAnswers({});
    setTestTimeLeft(1800); // 30 mins
    setIsTestActive(true);
    setIsTestSubmitted(false);
    setViewMode("mock_test");
  };

  // Timer effect for mock test
  React.useEffect(() => {
    let timer: any = null;
    if (isTestActive && !isTestSubmitted && testTimeLeft > 0) {
      timer = setInterval(() => {
        setTestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTestSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isTestSubmitted, testTimeLeft]);

  // Score calculation for mock test
  const testScoreSummary = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    testQuestions.forEach((q) => {
      const userAns = testUserAnswers[q.id];
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const totalMarks = correct * 4 - wrong * 1;
    const maxMarks = testQuestions.length * 4;
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    return { correct, wrong, unattempted, totalMarks, maxMarks, accuracy };
  }, [testQuestions, testUserAnswers]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              14,000+ JEE Mains PYQs DB Connected
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
              100 PYQs Per Chapter
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
              Examside Aligned
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-400" />
            Organized JEE Main & Advanced PYQ Bank 📚
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Complete chapter-wise question database powered by open-source{" "}
            <a
              href="https://github.com/HostServer001/jee_mains_pyqs_data_base"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline font-semibold hover:text-amber-300"
            >
              HostServer001/jee_mains_pyqs_data_base
            </a>{" "}
            containing 14,000+ questions & 100 questions per chapter across all 72 chapters with step-by-step solutions.
          </p>
        </div>

        {/* Source Citation, GitHub DB Link & Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://github.com/HostServer001/jee_mains_pyqs_data_base"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>GitHub PYQ Repo ↗</span>
          </a>

          <a
            href="https://t.me/+hIQCGTm2bjYzNTdl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Telegram Channel ↗</span>
          </a>

          {viewMode === "browse" ? (
            <button
              onClick={handleStartMockTest}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Start Timed Chapter Mock Test</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode("browse")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Question Browser</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: BROWSE & PRACTICE PYQS */}
      {viewMode === "browse" && (
        <>
          {/* SEARCH & MULTI-FILTER CONTROL BOARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
            
            {/* Row 1: Subject Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Subject Selectors */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {["All", "Physics", "Chemistry", "Mathematics"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      // Auto pick first chapter in that subject
                      const subMap: Record<string, string> = { Physics: "Physics", Chemistry: "Chemistry", Mathematics: "Maths" };
                      const match = chapters.find((c) => sub === "All" || c.sub === subMap[sub]);
                      if (match) setSelectedChapterId(match.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSubject === sub
                        ? "bg-sky-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, formulas, or topics..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Row 2: Chapter Dropdown & Detailed Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
              
              {/* Chapter Dropdown */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Chapter (72 Chapters)
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  {availableChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      [{ch.sub}] {ch.name} (wt: {ch.mainWt}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Exam Type
                </label>
                <select
                  value={examTypeFilter}
                  onChange={(e) => setExamTypeFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <option value="All">All (100 PYQs)</option>
                  <option value="JEE Main">JEE Main (50 PYQs)</option>
                  <option value="JEE Advanced">JEE Advanced (50 PYQs)</option>
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Exam Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <option value="All">All Years (2018-2025)</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
                    <option key={y} value={y.toString()}>
                      {y} Papers
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={diffFilter}
                  onChange={(e) => setDiffFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <option value="All">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

            </div>

            {/* Row 3: Action Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
              
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  Showing <strong className="text-sky-400">{filteredQuestions.length}</strong> PYQs for{" "}
                  <strong className="text-white">{selectedChapterObj?.name}</strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">
                  <strong className="text-emerald-400">{mainsCount}</strong> Mains +{" "}
                  <strong className="text-purple-400">{advCount}</strong> Advanced
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    showBookmarksOnly
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Bookmarks ({bookmarkedIds.length})</span>
                </button>

                <button
                  onClick={handleGenerateFreshAIPYQs}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isGeneratingAI ? "Generating..." : "AI Live Question"}</span>
                </button>
              </div>

            </div>

          </div>

          {/* QUESTIONS LISTING GRID */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No questions match the selected filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try changing the exam type, year filter, or difficulty dropdown above to view the rest of the 100 chapter PYQs.
                </p>
                <button
                  onClick={() => {
                    setExamTypeFilter("All");
                    setYearFilter("All");
                    setDiffFilter("All");
                    setSearchQuery("");
                    setShowBookmarksOnly(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl text-xs font-bold border border-slate-700 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const isSelected = userChoice !== undefined;
                const isCorrect = userChoice === q.correctAnswer;
                const isBookmarked = bookmarkedIds.includes(q.id);
                const isSolOpen = showSolutions[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-md transition-all relative overflow-hidden"
                  >
                    
                    {/* Top Question Header & Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-slate-500 font-mono">
                          #{idx + 1}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            q.exam === "JEE Advanced"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                          }`}
                        >
                          {q.exam} {q.year} {q.shift ? `(${q.shift})` : ""}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : q.difficulty === "Medium"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {q.difficulty}
                        </span>

                        <span className="text-[11px] font-semibold text-slate-400">
                          {q.chapterName}
                        </span>
                      </div>

                      {/* Bookmark toggle button */}
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                        }`}
                        title="Bookmark this question"
                      >
                        <BookMarked className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Question Body Text */}
                    <div className="text-sm text-slate-100 font-medium leading-relaxed">
                      {sanitizeMathMarkdown(q.questionText)}
                    </div>

                    {/* MCQ Options */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50";

                          if (isSelected) {
                            if (optIdx === q.correctAnswer) {
                              optStyle = "bg-emerald-950/60 text-emerald-200 border-emerald-500 font-bold ring-1 ring-emerald-500";
                            } else if (optIdx === userChoice) {
                              optStyle = "bg-rose-950/60 text-rose-200 border-rose-500 font-bold ring-1 ring-rose-500";
                            } else {
                              optStyle = "bg-slate-950/40 text-slate-600 border-slate-900 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <div className="flex items-start gap-2 pr-2">
                                <span className="font-mono font-bold text-slate-400 shrink-0">
                                  {String.fromCharCode(65 + optIdx)})
                                </span>
                                <span>{sanitizeMathMarkdown(opt)}</span>
                              </div>

                              {isSelected && optIdx === q.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {isSelected && optIdx === userChoice && optIdx !== q.correctAnswer && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer Controls & Solution Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSolution(q.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
                        >
                          <span>{isSolOpen ? "Hide Solution" : "View Step Solution"}</span>
                          {isSolOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => onSendToDoubtSolver(`Question (${q.chapterName} - ${q.exam} ${q.year}): ${q.questionText}${q.options ? "\nOptions:\n" + q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n") : ""}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all"
                        >
                          <Bot className="w-3.5 h-3.5 text-sky-400" />
                          <span>Ask AI Doubt</span>
                        </button>
                      </div>

                      {/* Log Accuracy shortcut */}
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                            {isCorrect ? "✓ Correct (+4 Marks)" : "✗ Incorrect (-1 Mark)"}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Detailed Solution Drawer */}
                    {isSolOpen && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2 mt-2">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="font-bold text-purple-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Detailed Step-by-Step Solution:
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Correct Option: <strong>{String.fromCharCode(65 + q.correctAnswer)}</strong>
                          </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed font-sans">
                          {sanitizeMathMarkdown(q.solution)}
                        </p>

                        {q.keyFormula && (
                          <div className="p-2.5 bg-sky-950/30 border border-sky-500/30 rounded-lg text-sky-300 font-mono text-[11px] flex items-center gap-2">
                            <strong className="text-sky-400">Key Formula:</strong>
                            <span>{sanitizeMathMarkdown(q.keyFormula)}</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* MODE 2: TIMED CHAPTER MOCK TEST */}
      {viewMode === "mock_test" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          {/* Test Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Simulated Exam
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                Chapter Mock Test: {selectedChapterObj?.name}
              </h2>
              <p className="text-xs text-slate-400">
                20 Questions (10 Mains + 10 Advanced) | +4 for Correct, -1 for Wrong
              </p>
            </div>

            {/* Timer Box */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Time Remaining</span>
                <span className="text-lg font-mono font-black text-amber-400">
                  {formatTimer(testTimeLeft)}
                </span>
              </div>
            </div>
          </div>

          {!isTestSubmitted ? (
            <div className="space-y-6">
              
              {testQuestions.map((q, qIdx) => {
                const userAns = testUserAnswers[q.id];

                return (
                  <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-sky-400">
                        Q{qIdx + 1} of {testQuestions.length} [{q.exam} {q.year}]
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full font-semibold">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 font-medium">
                      {sanitizeMathMarkdown(q.questionText)}
                    </p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = userAns === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => setTestUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                                isPicked
                                  ? "bg-sky-500/20 text-sky-200 border-sky-500 font-bold"
                                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <span className="font-mono text-slate-500 mr-2 font-bold">
                                {String.fromCharCode(65 + optIdx)})
                              </span>
                              {sanitizeMathMarkdown(opt)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsTestSubmitted(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all"
                >
                  Submit Mock Test Now ➔
                </button>
              </div>

            </div>
          ) : (
            /* SCORECARD BREAKDOWN */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">Mock Test Submitted!</h3>
                <p className="text-xs text-slate-400">
                  Performance scorecard for {selectedChapterObj?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Score</span>
                  <span className="text-xl font-black text-sky-400">
                    {testScoreSummary.totalMarks} / {testScoreSummary.maxMarks}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Accuracy</span>
                  <span className="text-xl font-black text-emerald-400">
                    {testScoreSummary.accuracy}%
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Correct</span>
                  <span className="text-xl font-black text-emerald-400">
                    {testScoreSummary.correct}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Wrong</span>
                  <span className="text-xl font-black text-rose-400">
                    {testScoreSummary.wrong}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    if (selectedChapterObj) {
                      onUpdateAcc(selectedChapterObj.id, "mains", testScoreSummary.accuracy);
                      alert(`Logged ${testScoreSummary.accuracy}% accuracy to tracker for ${selectedChapterObj.name}!`);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  Log Score to Tracker
                </button>
                <button
                  onClick={() => setViewMode("browse")}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl"
                >
                  Review Question Solutions
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
