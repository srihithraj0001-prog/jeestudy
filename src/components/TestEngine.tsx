import React, { useState, useEffect } from "react";
import { Chapter } from "../types";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award,
  BookOpen
} from "lucide-react";

interface TestEngineProps {
  chapters: Chapter[];
  onUpdateAcc: (id: number, mode: "mains" | "adv", value: number) => void;
  onOpenQuiz: (chapter: Chapter) => void;
}

export const TestEngine: React.FC<TestEngineProps> = ({
  chapters,
  onUpdateAcc,
  onOpenQuiz,
}) => {
  // Timer State
  const [timerMode, setTimerMode] = useState<"stopwatch" | "countdown">("stopwatch");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(3600); // 60 mins default
  const [isRunning, setIsRunning] = useState(false);

  // Test Selection State
  const [selectedChapterId, setSelectedChapterId] = useState<number>(chapters[0]?.id || 1);
  const [examMode, setExamMode] = useState<"mains" | "adv">("mains");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [loggedAccInput, setLoggedAccInput] = useState<string>("");

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === "stopwatch") {
          setSecondsElapsed((prev) => prev + 1);
        } else {
          setCountdownSeconds((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              alert("⏰ Time's up! Submit your 50-PYQ test session accuracy.");
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode]);

  const handleStartTimer = () => setIsRunning(true);
  const handlePauseTimer = () => setIsRunning(false);
  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    setCountdownSeconds(3600);
  };

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Sample Question fallback logic
  const defaultQuestion =
    examMode === "mains"
      ? selectedChapter.qMains || {
          q: `Sample 50-PYQ Mains Question for ${selectedChapter.name}: In this standard pattern, evaluate the foundational principles and key formula application.`,
          opts: ["Option A (Standard Result)", "Option B (Dimensional Check)", "Option C (Edge Case)", "Option D (None)"],
          ans: 0,
          sol: "Apply core chapter formulas and verify boundary values.",
        }
      : selectedChapter.qAdv || {
          q: `Sample 50-PYQ Advanced Question for ${selectedChapter.name}: Multi-concept problem involving rigorous calculus/derivation and boundary constraints.`,
          opts: ["Option A", "Option B", "Option C", "Option D"],
          ans: 0,
          sol: "Integrate multi-variable conditions and simplify step-by-step.",
        };

  const handleSaveAccuracy = () => {
    const val = parseFloat(loggedAccInput);
    if (isNaN(val) || val < 0 || val > 100) {
      alert("Please enter a valid accuracy percentage between 0 and 100.");
      return;
    }
    onUpdateAcc(selectedChapter.id, examMode, val);
    alert(`Logged ${val}% accuracy for [${selectedChapter.sub}] ${selectedChapter.name}! Predicted scores updated.`);
  };

  const handleRedirectToPortal = () => {
    handleStartTimer();
    window.open("https://nlearn.nspira.in/practice/test/previous_year", "_blank");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Timer Control Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Exam Practice Stopwatch & Timer
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={timerMode}
                onChange={(e) => {
                  setTimerMode(e.target.value as any);
                  handleResetTimer();
                }}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none"
              >
                <option value="stopwatch">Stopwatch (Count Up)</option>
                <option value="countdown">60-Min Test Timer (Countdown)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Big Monospace Clock Display */}
        <div className="font-mono text-3xl sm:text-4xl font-extrabold text-sky-400 bg-slate-950 px-6 py-2 border border-slate-800 rounded-xl tracking-wider shadow-inner">
          {timerMode === "stopwatch" ? formatTime(secondsElapsed) : formatTime(countdownSeconds)}
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStartTimer}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Timer
            </button>
          ) : (
            <button
              onClick={handlePauseTimer}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Pause className="w-4 h-4 fill-slate-950" /> Pause
            </button>
          )}

          <button
            onClick={handleResetTimer}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. Official Portal Banner */}
      <div className="bg-gradient-to-r from-sky-950/80 via-indigo-950/60 to-purple-950/80 border border-sky-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-400" />
            Official 50-PYQ Practice Test Integration
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Start timer and launch the official nLearn PYQ Portal in a new tab to practice authentic previous year questions.
          </p>
        </div>
        <button
          onClick={handleRedirectToPortal}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-sky-500/20 transition-all shrink-0"
        >
          Launch 50-PYQ Test ➔
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Chapter Practice Question Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-400" />
              Chapter Sample Question & AI Generator
            </h3>
            <p className="text-xs text-slate-400">
              Select any chapter to view sample PYQ or generate a brand new AI Practice Quiz.
            </p>
          </div>

          {/* AI Quiz Trigger Button */}
          <button
            onClick={() => onOpenQuiz(selectedChapter)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Generate Full AI Quiz
          </button>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Select Exam Mode:
            </label>
            <select
              value={examMode}
              onChange={(e) => {
                setExamMode(e.target.value as any);
                setSelectedOption(null);
                setShowSolution(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
            >
              <option value="mains">JEE Main (50 PYQs)</option>
              <option value="adv">JEE Advanced (50 PYQs)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Select Syllabus Chapter:
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => {
                setSelectedChapterId(Number(e.target.value));
                setSelectedOption(null);
                setShowSolution(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  [{ch.sub}] #{ch.id} {ch.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Question Display Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400">
              {examMode === "mains" ? "JEE Main Level Question" : "JEE Advanced Level Question"}
            </span>
            <span className="text-[11px] text-slate-500">
              Current Logged Accuracy: {examMode === "mains" ? selectedChapter.mainsAcc : selectedChapter.advAcc}%
            </span>
          </div>

          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            {defaultQuestion.q}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {defaultQuestion.opts.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === defaultQuestion.ans;

              let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-sky-500/50";
              if (showSolution) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-rose-950/80 border-rose-500 text-rose-300 font-bold";
                }
              } else if (isSelected) {
                btnStyle = "bg-sky-950 border-sky-500 text-sky-300 font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedOption(idx);
                    setShowSolution(true);
                  }}
                  className={`p-3 rounded-lg border text-xs text-left transition-all ${btnStyle}`}
                >
                  <span className="font-mono text-slate-500 mr-2">
                    {String.fromCharCode(65 + idx)})
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Solution Box */}
          {showSolution && (
            <div className="mt-4 p-3.5 bg-sky-950/40 border-l-4 border-sky-500 rounded-r-lg text-xs space-y-1">
              <span className="font-bold text-sky-300 block">
                Detailed Solution & Concept Breakdown:
              </span>
              <p className="text-slate-300 leading-relaxed">{defaultQuestion.sol}</p>
            </div>
          )}

        </div>

        {/* Log Accuracy Input Section */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Log session accuracy (%) achieved for this 50-PYQ set:
            </label>
            <p className="text-[11px] text-slate-500">
              This updates your predicted JEE Mains / Advanced score live in the top dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 focus-within:border-sky-500">
              <input
                type="number"
                min="0"
                max="100"
                placeholder={String(examMode === "mains" ? selectedChapter.mainsAcc : selectedChapter.advAcc)}
                value={loggedAccInput}
                onChange={(e) => setLoggedAccInput(e.target.value)}
                className="w-16 bg-transparent text-center font-mono font-bold text-sky-400 text-sm focus:outline-none"
              />
              <span className="text-slate-500 text-xs">%</span>
            </div>

            <button
              onClick={handleSaveAccuracy}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-sky-500/20"
            >
              Save & Recalculate Score
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
