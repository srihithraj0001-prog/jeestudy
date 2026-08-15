import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Chapter } from "../types";
import { X, BookOpen, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { sanitizeMathMarkdown } from "../utils/mathSanitizer";

interface ChapterNotesModalProps {
  chapter: Chapter | null;
  onClose: () => void;
}

export const ChapterNotesModal: React.FC<ChapterNotesModalProps> = ({
  chapter,
  onClose,
}) => {
  const [notes, setNotes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (chapter) {
      fetchNotes();
    } else {
      setNotes(null);
    }
  }, [chapter]);

  const fetchNotes = async () => {
    if (!chapter) return;
    setIsLoading(true);
    setNotes(null);
    try {
      const response = await fetch("/api/ai/chapter-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterName: chapter.name,
          subject: chapter.sub,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch notes");

      setNotes(data.notes);
    } catch (err: any) {
      setNotes(`⚠️ **Failed to generate notes**: ${err.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!chapter) return null;

  const handleCopy = () => {
    if (notes) {
      navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                [{chapter.sub}] {chapter.name}
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono">
                  AI Revision Cheat Sheet
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Key Formulas, Definitions, Mnemonics & Top 5 Problem Types
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notes && (
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
                title="Copy notes"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {isLoading && (
            <div className="py-16 text-center text-xs text-sky-300 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-400" />
              <p>Generating master revision notes and key formulas for {chapter.name}...</p>
            </div>
          )}

          {notes && !isLoading && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-sky-300 prose-headings:text-sky-300">
              <ReactMarkdown>{sanitizeMathMarkdown(notes)}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Targeting JEE Main & Advanced Quick Revision</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold"
          >
            Done Reading
          </button>
        </div>

      </div>
    </div>
  );
};
