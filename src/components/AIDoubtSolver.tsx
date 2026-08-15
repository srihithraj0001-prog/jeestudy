import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { DoubtMessage } from "../types";
import { sanitizeMathMarkdown } from "../utils/mathSanitizer";
import {
  Send,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Bot,
  User,
  Loader2,
  Copy,
  Check,
  Zap,
  HelpCircle,
  FileCode,
  X
} from "lucide-react";

interface AIDoubtSolverProps {
  initialChapterFilter?: string;
  onSendComplete?: () => void;
}

const CHAT_STORAGE_KEY = "jee_ai_chat_history_v2";

export const AIDoubtSolver: React.FC<AIDoubtSolverProps> = ({
  initialChapterFilter,
}) => {
  const [messages, setMessages] = useState<DoubtMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: "welcome",
        sender: "ai",
        text: `### 🤖 Welcome to your AI JEE Main & Advanced Assistant!
I am trained on the complete JEE syllabus across **Physics**, **Chemistry**, and **Mathematics**.

**How I can help you:**
1. **Solve Complex Doubts**: Paste numerical problems, reaction mechanisms, or theoretical derivations.
2. **Analyze Question Photos**: Click the 📷 image icon to upload a photo or diagram of any question.
3. **Learn Shortcuts & Traps**: Request exam tricks, dimensional checks, or common mistakes to avoid.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const [inputQuestion, setInputQuestion] = useState("");
  const [selectedMode, setSelectedMode] = useState<"detailed" | "quick" | "hint">("detailed");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const lastAutoQueryRef = useRef<string | null>(null);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Auto-fill and send doubt when user clicks "Ask AI" from any question/chapter
  useEffect(() => {
    if (initialChapterFilter && initialChapterFilter !== lastAutoQueryRef.current) {
      lastAutoQueryRef.current = initialChapterFilter;
      const autoQuery = initialChapterFilter.startsWith("Question") || initialChapterFilter.startsWith("Chapter:")
        ? initialChapterFilter
        : `Explain high-yield formulas, key concepts, and 3 problem patterns for chapter: ${initialChapterFilter}`;
      
      handleSendMessage(autoQuery);
    }
  }, [initialChapterFilter]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image size should be less than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuestion.trim();
    if (!query && !imagePreview) return;

    const userMsgId = Date.now().toString();
    const userMsg: DoubtMessage = {
      id: userMsgId,
      sender: "user",
      text: query || "Uploaded question image for resolution.",
      image: imagePreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    const currentImg = imagePreview;
    setImagePreview(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/solve-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          mode: selectedMode,
          imageBase64: currentImg,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to solve doubt");
      }

      const aiMsg: DoubtMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.answer || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `⚠️ **AI Service Error**: ${err.message || "Something went wrong while resolving your doubt."}\n\n*Please ensure your prompt is clear or try asking again.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear chat history?")) {
      setMessages([
        {
          id: "welcome",
          sender: "ai",
          text: "Chat cleared. Ready for your next JEE doubt!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const presetQueries = [
    "Work done in adiabatic process derivation & formula",
    "How to identify Saytzeff vs Hofmann major product in E2 elimination",
    "Shortcut for shortest distance between 3D skew lines",
    "Rolling without slipping condition on an inclined plane",
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[650px] shadow-xl">
      
      {/* Header */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-3.5 flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Embedded Gemini AI Doubt Engine
              <span className="bg-sky-500/20 text-sky-300 text-[10px] px-1.5 py-0.2 rounded border border-sky-500/30 font-mono">
                gemini-3.6-flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Instant step-by-step solutions for Physics, Chemistry & Maths
            </p>
          </div>
        </div>

        {/* Mode Selector & Clear */}
        <div className="flex items-center gap-2">
          
          <div className="hidden sm:flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSelectedMode("detailed")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                selectedMode === "detailed"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Step-by-Step
            </button>
            <button
              onClick={() => setSelectedMode("quick")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                selectedMode === "quick"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Quick Summary
            </button>
            <button
              onClick={() => setSelectedMode("hint")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                selectedMode === "hint"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Hint Only
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Preset Query Chips */}
      <div className="bg-slate-950/40 px-3 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-500 text-[11px] font-semibold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Quick Prompts:
        </span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(pq)}
            className="bg-slate-800/90 hover:bg-sky-950/80 hover:text-sky-300 border border-slate-700/80 rounded-full px-2.5 py-0.5 text-[11px] text-slate-300 whitespace-nowrap transition-all"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-sky-950 border border-sky-700/50 text-sky-400"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed relative group ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white border border-indigo-500/50 rounded-tr-none shadow-md"
                  : "bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg"
              }`}
            >
              {/* Copy Button */}
              {msg.sender === "ai" && (
                <button
                  onClick={() => handleCopyText(msg.text, msg.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/80 rounded"
                  title="Copy response"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* User Attached Image */}
              {msg.image && (
                <div className="mb-2.5 overflow-hidden rounded-lg border border-indigo-400/30 max-w-xs">
                  <img src={msg.image} alt="Question uploaded" className="w-full object-cover" />
                </div>
              )}

              {/* Message Content */}
              {msg.sender === "user" ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-strong:text-sky-300">
                  <ReactMarkdown>{sanitizeMathMarkdown(msg.text)}</ReactMarkdown>
                </div>
              )}

              <div className="mt-2 text-[10px] text-slate-400 opacity-70 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-700/50 flex items-center justify-center text-sky-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-sky-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing JEE principles & deriving step-by-step resolution...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Image Preview Thumbnail */}
      {imagePreview && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-400">
            <ImageIcon className="w-4 h-4" />
            <span>Image attached ready for AI vision analysis</span>
          </div>
          <button
            onClick={() => setImagePreview(null)}
            className="p-1 text-slate-400 hover:text-rose-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* File Upload Hidden Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
            title="Upload photo of question"
          >
            <ImageIcon className="w-4 h-4 text-sky-400" />
          </button>

          <textarea
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type or paste your JEE doubt here... (e.g., How to find work done in adiabatic process?)"
            rows={1}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
          />

          <button
            type="submit"
            disabled={isLoading || (!inputQuestion.trim() && !imagePreview)}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Solve</span>
          </button>
        </form>
      </div>

    </div>
  );
};
