import React, { useState, useEffect } from "react";
import { Chapter, AIQuizQuestion } from "../types";
import { X, Sparkles, Loader2, CheckCircle, AlertCircle, Award } from "lucide-react";
import { sanitizeMathMarkdown } from "../utils/mathSanitizer";

interface AIQuizModalProps {
  chapter: Chapter | null;
  onClose: () => void;
  onSaveAccuracy: (chapterId: number, mode: "mains" | "adv", accuracy: number) => void;
}

export const AIQuizModal: React.FC<AIQuizModalProps> = ({
  chapter,
  onClose,
  onSaveAccuracy,
}) => {
  const [questions, setQuestions] = useState<AIQuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [examType, setExamType] = useState<"mains" | "adv">("mains");

  useEffect(() => {
    if (chapter) {
      generateQuiz("mains");
    } else {
      setQuestions([]);
      setUserAnswers({});
      setShowResults(false);
    }
  }, [chapter]);

  const generateQuiz = async (type: "mains" | "adv") => {
    if (!chapter) return;
    setIsLoading(true);
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setExamType(type);

    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterName: chapter.name,
          subject: chapter.sub,
          examType: type,
          count: 3,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate quiz");

      setQuestions(data.questions || []);
    } catch (err: any) {
      alert(`Error generating quiz: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!chapter) return null;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    }
  });

  const accuracyPct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const handleLogToTracker = () => {
    onSaveAccuracy(chapter.id, examType, accuracyPct);
    alert(`Logged ${accuracyPct}% accuracy for ${chapter.name} in tracker!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                [{chapter.sub}] {chapter.name}
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  AI Dynamic Practice Quiz
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Authentic AI-generated PYQ level test questions with step-by-step solutions
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

        {/* Exam Type Selector & Regenerate */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Level:</span>
            <button
              onClick={() => generateQuiz("mains")}
              disabled={isLoading}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                examType === "mains"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              JEE Main
            </button>
            <button
              onClick={() => generateQuiz("adv")}
              disabled={isLoading}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                examType === "adv"
                  ? "bg-purple-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              JEE Advanced
            </button>
          </div>

          <button
            onClick={() => generateQuiz(examType)}
            disabled={isLoading}
            className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Regenerate Questions
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {isLoading && (
            <div className="py-16 text-center text-xs text-purple-300 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
              <p>Generating 3 authentic {examType.toUpperCase()} practice questions for {chapter.name}...</p>
            </div>
          )}

          {!isLoading && questions.length > 0 && (
            <div className="space-y-6">
              {questions.map((q, qIdx) => {
                const userSelected = userAnswers[qIdx];
                const isCorrect = userSelected === q.correctAnswerIndex;

                return (
                  <div
                    key={qIdx}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
                      <span>Question {qIdx + 1} of {questions.length}</span>
                      {showResults && (
                        <span>
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Correct (+4)
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Incorrect (-1)
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-100 font-medium leading-relaxed">
                      {sanitizeMathMarkdown(q.question)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = userSelected === optIdx;
                        const isThisCorrect = optIdx === q.correctAnswerIndex;

                        let style = "bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500/50";
                        if (showResults) {
                          if (isThisCorrect) {
                            style = "bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold";
                          } else if (isThisSelected) {
                            style = "bg-rose-950/90 border-rose-500 text-rose-300 font-bold";
                          }
                        } else if (isThisSelected) {
                          style = "bg-purple-950 border-purple-500 text-purple-300 font-bold";
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`p-3 rounded-lg border text-xs text-left transition-all ${style}`}
                          >
                            <span className="font-mono text-slate-500 mr-2">
                              {String.fromCharCode(65 + optIdx)})
                            </span>
                            {sanitizeMathMarkdown(opt)}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="p-3 bg-purple-950/30 border-l-4 border-purple-500 rounded-r-lg text-xs space-y-1 mt-2">
                        <span className="font-bold text-purple-300 block">Step-by-Step Solution:</span>
                        <p className="text-slate-300">{sanitizeMathMarkdown(q.solution)}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit / Results Footer Box */}
              {!showResults ? (
                <button
                  onClick={handleFinishQuiz}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all"
                >
                  Submit Quiz & Reveal Solutions
                </button>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Quiz Accuracy Score: {accuracyPct}%
                      </span>
                      <p className="text-slate-400 text-xs">
                        {correctCount} out of {questions.length} questions answered correctly.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogToTracker}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all"
                  >
                    Save {accuracyPct}% Accuracy to Tracker Live
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>AI-generated practice set for {chapter.name}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold"
          >
            Close Quiz
          </button>
        </div>

      </div>
    </div>
  );
};
