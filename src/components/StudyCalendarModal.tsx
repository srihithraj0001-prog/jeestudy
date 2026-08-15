import React, { useState } from "react";
import { Calendar as CalendarIcon, Flame, Trophy, Clock, ChevronLeft, ChevronRight, X, Award, CheckCircle2 } from "lucide-react";

interface StudyCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyRecords: Record<string, number>; // "YYYY-MM-DD" -> seconds studied
  targetDailySeconds?: number; // e.g. 14400 (4 hours)
}

export function calculateRealStreak(records: Record<string, number>): { currentStreak: number; maxStreak: number } {
  const dates = Object.keys(records).sort();
  if (dates.length === 0) return { currentStreak: 0, maxStreak: 0 };

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let streak = 0;
  let checkDate = new Date();

  // If didn't study today, check if studied yesterday to keep streak active
  if (!records[todayStr] || records[todayStr] < 60) {
    checkDate = yesterday;
  }

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (records[dateStr] && records[dateStr] >= 60) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate Max Streak ever
  let maxStreak = 0;
  let tempStreak = 0;

  // Generate date list from earliest to today
  if (dates.length > 0) {
    const firstDate = new Date(dates[0]);
    const today = new Date();
    const curr = new Date(firstDate);

    while (curr <= today) {
      const dStr = curr.toISOString().split("T")[0];
      if (records[dStr] && records[dStr] >= 60) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
      curr.setDate(curr.getDate() + 1);
    }
  }

  return { currentStreak: streak, maxStreak: Math.max(streak, maxStreak) };
}

export const StudyCalendarModal: React.FC<StudyCalendarModalProps> = ({
  isOpen,
  onClose,
  dailyRecords,
  targetDailySeconds = 14400, // 4 hours default target
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  if (!isOpen) return null;

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Month info
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-6 (Sun-Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const { currentStreak, maxStreak } = calculateRealStreak(dailyRecords);

  // Month total calculation
  let monthTotalSec = 0;
  let monthActiveDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const sec = dailyRecords[dateStr] || 0;
    monthTotalSec += sec;
    if (sec >= 60) monthActiveDays++;
  }

  const formatHours = (sec: number) => {
    const hrs = (sec / 3600).toFixed(1);
    return `${hrs} hrs`;
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 rounded-xl transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Study Calendar & Real Streak Tracker
            </h2>
            <p className="text-xs text-slate-400">
              Verified daily study hours logged on your calendar
            </p>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Active Streak */}
          <div className="bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Current Streak</span>
            </div>
            <div className="text-2xl font-black text-amber-200 font-mono">
              {currentStreak} <span className="text-xs font-normal text-amber-400/80">Days</span>
            </div>
          </div>

          {/* Max Streak */}
          <div className="bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-500/30 rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Best Streak</span>
            </div>
            <div className="text-2xl font-black text-purple-200 font-mono">
              {maxStreak} <span className="text-xs font-normal text-purple-400/80">Days</span>
            </div>
          </div>

          {/* Monthly Hours */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30 rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Month Hours</span>
            </div>
            <div className="text-2xl font-black text-emerald-200 font-mono">
              {formatHours(monthTotalSec)}
            </div>
          </div>

        </div>

        {/* Calendar Navigation */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-100 text-sm">
              {monthNames[month]} {year}
            </h3>

            <button
              onClick={handleNextMonth}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid Header (Days of week) */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1 border-b border-slate-800/60">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots for offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty_${idx}`} className="h-10 rounded-xl bg-slate-950/30" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const sec = dailyRecords[dateStr] || 0;
              const isToday = dateStr === todayStr;
              const isSelected = selectedDayStr === dateStr;

              let bgClass = "bg-slate-900/60 text-slate-400 border-slate-800/50 hover:border-slate-700";
              if (sec >= targetDailySeconds) {
                // Met full target
                bgClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold shadow-sm shadow-emerald-500/10";
              } else if (sec >= 1800) {
                // Partial study (> 30 mins)
                bgClass = "bg-sky-500/20 text-sky-300 border-sky-500/50 font-semibold";
              } else if (sec > 0) {
                // Small study
                bgClass = "bg-slate-800 text-slate-200 border-slate-700";
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDayStr(dateStr)}
                  className={`h-11 rounded-xl border flex flex-col items-center justify-center p-1 transition-all relative ${bgClass} ${
                    isToday ? "ring-2 ring-amber-400/80" : ""
                  } ${isSelected ? "scale-105 ring-2 ring-white" : ""}`}
                >
                  <span className="text-xs">{dayNum}</span>
                  {sec > 0 && (
                    <span className="text-[9px] font-mono opacity-90 leading-none mt-0.5">
                      {(sec / 3600).toFixed(1)}h
                    </span>
                  )}
                  {isToday && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Day Details */}
        {selectedDayStr && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div>
              <span className="text-slate-400 block font-medium">Selected Date: <strong className="text-white">{selectedDayStr}</strong></span>
              <span className="text-slate-300 font-semibold">
                Studied: <span className="text-emerald-400 font-mono font-bold">{formatHours(dailyRecords[selectedDayStr] || 0)}</span>
              </span>
            </div>
            {(dailyRecords[selectedDayStr] || 0) >= 1800 ? (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Streak Counted
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">No major session recorded</span>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
