import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, GraduationCap, Sparkles, Check, BookOpen } from "lucide-react";

interface UserOnboardingModalProps {
  isOpen: boolean;
  currentProfile?: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onClose?: () => void;
  isRequired?: boolean;
}

const AVATARS = ["👨‍🎓", "👩‍🎓", "🚀", "⚡", "🔬", "🎯", "🔥", "🏆", "💻", "🧠", "🧬"];
const CLASS_PRESETS = ["Class 12 (JEE 2026)", "Class 11 (JEE 2027)", "Dropper / Repeater", "Class 10"];

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  currentProfile,
  onSaveProfile,
  onClose,
  isRequired = true,
}) => {
  const [name, setName] = useState(currentProfile?.name || "");
  const [userClass, setUserClass] = useState(currentProfile?.userClass || "Class 12 (JEE 2026)");
  const [avatar, setAvatar] = useState(currentProfile?.avatar || "👨‍🎓");
  const [customClass, setCustomClass] = useState("");
  const [showCustomClassInput, setShowCustomClassInput] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalClass = showCustomClassInput && customClass.trim() ? customClass.trim() : userClass;

    const profile: UserProfile = {
      id: currentProfile?.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      userClass: finalClass,
      avatar,
    };

    onSaveProfile(profile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-1.5 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-sky-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-lg shadow-sky-500/20 text-slate-950">
            🎓
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Welcome to JEE Study Squad!
          </h2>
          <p className="text-xs text-slate-300">
            Please enter your name and class to join live study sessions with your friends.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Avatar Selector */}
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-2">
              Choose Profile Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center shrink-0 transition-all ${
                    avatar === emoji
                      ? "bg-sky-500 text-slate-950 scale-110 shadow-md shadow-sky-500/30 border-2 border-white"
                      : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              Your Real Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Anirudh Sharma"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
              autoFocus
            />
          </div>

          {/* Class / Grade Selector */}
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Class / Target Exam Year <span className="text-rose-400">*</span>
            </label>

            <div className="grid grid-cols-2 gap-2 mb-2">
              {CLASS_PRESETS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setUserClass(cls);
                    setShowCustomClassInput(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${
                    !showCustomClassInput && userClass === cls
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="truncate">{cls}</span>
                  {!showCustomClassInput && userClass === cls && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Option for custom class input */}
            {!showCustomClassInput ? (
              <button
                type="button"
                onClick={() => setShowCustomClassInput(true)}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
              >
                + Type custom class or target
              </button>
            ) : (
              <input
                type="text"
                value={customClass}
                onChange={(e) => setCustomClass(e.target.value)}
                placeholder="e.g., Class 12 Dropper / Target JEE 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center gap-2">
            {!isRequired && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Join Live Study Squad</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
