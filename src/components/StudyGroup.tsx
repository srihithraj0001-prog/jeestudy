import React, { useState, useEffect, useRef } from "react";
import { StudyMember, GroupChatMessage, StudyGoal, StudyRoom, Subject, UserProfile } from "../types";
import { StudyCalendarModal, calculateRealStreak } from "./StudyCalendarModal";
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Flame,
  Award,
  Send,
  Plus,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Share2,
  Target,
  BookOpen,
  MessageSquare,
  Globe,
  Radio,
  Calendar as CalendarIcon,
  ChevronDown,
  Layers
} from "lucide-react";

interface StudyGroupProps {
  onOpenDoubtSolver?: (topic?: string) => void;
  userProfile?: UserProfile | null;
  onEditProfile?: () => void;
}

interface ServerGroupInfo {
  id: string;
  code: string;
  name: string;
  targetExam: string;
  targetHours: number;
  onlineCount: number;
}

export const StudyGroup: React.FC<StudyGroupProps> = ({ onOpenDoubtSolver, userProfile, onEditProfile }) => {
  // --- Active Group ID State ---
  const [currentRoomId, setCurrentRoomId] = useState<string>(() => {
    return localStorage.getItem("jee_active_room_id") || "JEE_2026_MAIN";
  });

  const [availableGroups, setAvailableGroups] = useState<ServerGroupInfo[]>([]);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState<boolean>(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState<boolean>(false);
  const [newGroupNameInput, setNewGroupNameInput] = useState<string>("");
  const [newGroupExamInput, setNewGroupExamInput] = useState<string>("JEE 2026");

  // --- Calendar & Streak State ---
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [dailyRecords, setDailyRecords] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("jee_daily_study_records");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default seed with today and yesterday
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    return {
      [todayStr]: 3600,
      [yesterdayStr]: 7200,
    };
  });

  // Calculate real consecutive calendar streak
  const { currentStreak: realStreakDays } = calculateRealStreak(dailyRecords);

  // --- Room State ---
  const [room, setRoom] = useState<StudyRoom>(() => ({
    id: currentRoomId,
    code: "JEE2026",
    name: "JEE 2026 Official Squad",
    targetExam: "JEE Main & Advanced 2026",
    targetHours: 6,
    activeSubject: "All",
  }));

  // --- Timer State ---
  const [timerMode, setTimerMode] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [pomodoroMinutes, setPomodoroMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(() => {
    const savedSec = localStorage.getItem("jee_my_seconds_today");
    return savedSec ? parseInt(savedSec, 10) : 0;
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentTopic, setCurrentTopic] = useState<string>("Physics: Rotational Dynamics");
  const [todayStudiedSec, setTodayStudiedSec] = useState<number>(() => {
    const savedSec = localStorage.getItem("jee_my_seconds_today");
    return savedSec ? parseInt(savedSec, 10) : 1800; // default 30m
  });

  // Fetch available groups on load
  const fetchGroupsList = async () => {
    try {
      const res = await fetch("/api/room/groups");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setAvailableGroups(data.groups);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch groups", e);
    }
  };

  useEffect(() => {
    fetchGroupsList();
  }, []);

  // Sync daily study seconds into dailyRecords
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setDailyRecords((prev) => {
      const updated = { ...prev, [todayStr]: todayStudiedSec };
      localStorage.setItem("jee_daily_study_records", JSON.stringify(updated));
      return updated;
    });
  }, [todayStudiedSec]);

  // --- Real-Time Online Server Members ---
  const [onlineServerMembers, setOnlineServerMembers] = useState<StudyMember[]>([]);

  // --- Members State (Saved to localStorage) ---
  const [members, setMembers] = useState<StudyMember[]>(() => {
    const saved = localStorage.getItem("jee_squad_members_v3");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "self",
        name: userProfile?.name || "Anirudh (You)",
        userClass: userProfile?.userClass || "Class 12 (JEE 2026)",
        avatar: userProfile?.avatar || "👨‍🎓",
        status: "studying",
        currentTopic: "Physics: Rotational Dynamics",
        todaySeconds: 1800,
        streakDays: realStreakDays,
        isSelf: true,
      },
      {
        id: "m1",
        name: "Rohan Sharma",
        userClass: "Class 12 (JEE 2026)",
        avatar: "🚀",
        status: "studying",
        currentTopic: "Chemistry: Organic Mechanisms",
        todaySeconds: 7800,
        streakDays: 18,
      },
      {
        id: "m2",
        name: "Priya Patel",
        userClass: "Class 12 (JEE 2026)",
        avatar: "👩‍🔬",
        status: "solving_quiz",
        currentTopic: "Maths: Definite Integration",
        todaySeconds: 5400,
        streakDays: 9,
      },
    ];
  });

  // --- Permanent Group Chat State (WhatsApp Style) ---
  const [messages, setMessages] = useState<GroupChatMessage[]>(() => [
    {
      id: "c0",
      senderId: "system",
      senderName: "Study System",
      senderAvatar: "🔒",
      text: "🔒 Group chat and live member study times connected. Syncing across devices!",
      timestamp: "TODAY",
      isSystem: true,
    },
  ]);

  const [inputChat, setInputChat] = useState<string>("");
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);

  // --- REAL-TIME BACKEND HEARTBEAT POLL (Every 3 seconds) ---
  useEffect(() => {
    const sendHeartbeatAndFetch = async () => {
      try {
        const selfMember = {
          roomId: currentRoomId,
          id: userProfile?.id || "self",
          name: userProfile?.name || "Aspirant",
          userClass: userProfile?.userClass || "Class 12",
          avatar: userProfile?.avatar || "👨‍🎓",
          status: isTimerRunning ? "studying" : "break",
          currentTopic,
          todaySeconds: todayStudiedSec,
          streakDays: realStreakDays,
        };

        const res = await fetch("/api/room/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selfMember),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.roomName) {
            setRoom((r) => ({ ...r, name: data.roomName, id: currentRoomId }));
          }

          if (Array.isArray(data.members)) {
            const mappedServerMembers: StudyMember[] = data.members.map((m: any) => ({
              id: m.id,
              name: m.id === selfMember.id ? `${m.name} (You)` : m.name,
              userClass: m.userClass || "Class 12",
              avatar: m.avatar || "👨‍🎓",
              status: m.status || "studying",
              currentTopic: m.currentTopic || "JEE Prep",
              todaySeconds: m.todaySeconds || 0,
              streakDays: m.streakDays || 1,
              isSelf: m.id === selfMember.id,
              lastActive: m.lastActive,
            }));
            setOnlineServerMembers(mappedServerMembers);
          }

          if (Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.warn("Presence heartbeat error", err);
      }
    };

    sendHeartbeatAndFetch();
    const interval = setInterval(sendHeartbeatAndFetch, 3000);
    return () => clearInterval(interval);
  }, [userProfile, isTimerRunning, currentTopic, todayStudiedSec, currentRoomId, realStreakDays]);

  // --- Group Goals State ---
  const [goals, setGoals] = useState<StudyGoal[]>([
    { id: "g1", title: "Solve 20 PYQs of Rotational Motion", chapter: "Physics", completed: true },
    { id: "g2", title: "Revise Organic Reaction Mechanisms", chapter: "Chemistry", completed: false },
    { id: "g3", title: "Complete 2 Hours Continuous Focus Timer", chapter: "General", completed: false },
  ]);
  const [newGoalText, setNewGoalText] = useState<string>("");

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  const chatFeedContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCountRef = useRef<number>(messages.length);

  // --- Timer Interval ---
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerMode === "stopwatch") {
          setSeconds((prev) => {
            const next = prev + 1;
            setTodayStudiedSec((t) => {
              const updated = t + 1;
              localStorage.setItem("jee_my_seconds_today", updated.toString());
              return updated;
            });
            return next;
          });
        } else {
          // Pomodoro count down
          setSeconds((prev) => {
            if (prev <= 1) {
              setIsTimerRunning(false);
              if (soundEnabled) {
                try {
                  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
                  audio.play();
                } catch (e) {}
              }
              alert("🔔 Pomodoro Focus Session Complete! Take a 5-minute break.");
              return 0;
            }
            setTodayStudiedSec((t) => {
              const updated = t + 1;
              localStorage.setItem("jee_my_seconds_today", updated.toString());
              return updated;
            });
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode, soundEnabled]);

  // Keep self member study seconds updated
  useEffect(() => {
    setMembers((prev) =>
      prev.map((m) =>
        m.isSelf
          ? {
              ...m,
              todaySeconds: todayStudiedSec,
              status: isTimerRunning ? "studying" : "break",
              currentTopic,
            }
          : m
      )
    );
  }, [todayStudiedSec, isTimerRunning, currentTopic]);

  // Internal chat scroll ONLY when message count increases (never scrolls the browser window)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      if (chatFeedContainerRef.current) {
        chatFeedContainerRef.current.scrollTop = chatFeedContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // Handle Pomodoro setup
  const handleStartPomodoro = (mins: number) => {
    setTimerMode("pomodoro");
    setPomodoroMinutes(mins);
    setSeconds(mins * 60);
    setIsTimerRunning(true);
  };

  const handleStartStopwatch = () => {
    setTimerMode("stopwatch");
    setSeconds(0);
    setIsTimerRunning(true);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad = (num: number) => String(num).padStart(2, "0");
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const formatHoursShort = (totalSec: number) => {
    const hrs = (totalSec / 3600).toFixed(1);
    return `${hrs}h`;
  };

  // Send Group Chat Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputChat.trim()) return;

    const userText = inputChat.trim();
    setInputChat("");

    const newMsg: GroupChatMessage = {
      id: Date.now().toString(),
      senderId: userProfile?.id || "self",
      senderName: userProfile?.name || "Aspirant",
      senderClass: userProfile?.userClass || "Class 12",
      senderAvatar: userProfile?.avatar || "👨‍🎓",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Send to backend room chat for live sync across devices
    try {
      if (userText.toLowerCase().includes("@ai")) {
        setIsAskingAI(true);
      }

      const res = await fetch("/api/room/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: currentRoomId, ...newMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Failed to post chat message", err);
    } finally {
      setIsAskingAI(false);
    }
  };

  // Handle Create New Custom Study Group
  const handleCreateNewGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupNameInput.trim()) return;

    try {
      const res = await fetch("/api/room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupNameInput.trim(),
          targetExam: newGroupExamInput.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.group) {
          setCurrentRoomId(data.group.id);
          localStorage.setItem("jee_active_room_id", data.group.id);
          setRoom({
            id: data.group.id,
            code: data.group.code,
            name: data.group.name,
            targetExam: data.group.targetExam,
            targetHours: data.group.targetHours,
            activeSubject: "All",
          });
          fetchGroupsList();
        }
      }
    } catch (err) {
      console.error("Failed to create new group", err);
    } finally {
      setIsCreateGroupOpen(false);
      setNewGroupNameInput("");
    }
  };

  // Switch Active Group
  const handleSelectGroup = (groupId: string) => {
    setCurrentRoomId(groupId);
    localStorage.setItem("jee_active_room_id", groupId);
    setIsGroupDropdownOpen(false);
  };

  // Toggle Goal
  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  // Add Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newGoalText.trim(),
        chapter: "Squad Goal",
        completed: false,
      },
    ]);
    setNewGoalText("");
  };

  // Add New Friend to Squad
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const avatars = ["⚡", "🔥", "🎯", "🧬", "🏆", "🎓"];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const newM: StudyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      avatar: randomAvatar,
      status: "studying",
      currentTopic: "JEE Preparation",
      todaySeconds: 3600,
      streakDays: 5,
    };
    setMembers((prev) => [...prev, newM]);

    // System announce
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: "system",
        senderName: "Study Bot",
        senderAvatar: "🤖",
        text: `🎉 **${newMemberName.trim()}** joined the online study group! Welcome to the squad!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: true,
      },
    ]);

    setNewMemberName("");
    setShowAddMember(false);
  };

  // Remove member from group
  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Copy Room Link or Direct WhatsApp Share using real app URL
  const handleCopyCode = () => {
    const shareableUrl = window.location.href;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const shareableUrl = window.location.href;
    const text = encodeURIComponent(
      `🔥 Join our JEE 2026 Online Study Group & Live Counter!\n\nApp Link: ${shareableUrl}\n\nLet's study together online, solve doubts, and track study time!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Group combined time
  const groupTotalSec = members.reduce((acc, m) => acc + m.todaySeconds, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* GROUP SWITCHER BAR & SQUAD CREATION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg flex-wrap">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-bold text-slate-300">Active Study Squad:</span>
          
          {/* Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
              className="bg-slate-950 hover:bg-slate-800 text-white border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span className="text-sky-300">{room.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isGroupDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-30 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider border-b border-slate-800">
                  Switch Active Group
                </div>
                {availableGroups.map((grp) => (
                  <button
                    key={grp.id}
                    onClick={() => handleSelectGroup(grp.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentRoomId === grp.id
                        ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{grp.name}</div>
                      <div className="text-[10px] text-slate-400">{grp.targetExam}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-mono">
                      {grp.onlineCount} Online
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    setIsGroupDropdownOpen(false);
                    setIsCreateGroupOpen(true);
                  }}
                  className="w-full mt-1 p-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-dashed border-sky-500/40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Group</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar & Streak Trigger */}
        <button
          onClick={() => setIsCalendarOpen(true)}
          className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow"
        >
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <span>📅 Study Calendar</span>
          <span className="bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
            <Flame className="w-3 h-3 fill-amber-400 text-amber-400 animate-pulse" />
            {realStreakDays} Days Streak
          </span>
        </button>
      </div>

      {/* Top Banner: Study Room Header & Share Link */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-800/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="p-3 bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{room.name}</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {members.filter((m) => m.status !== "offline").length} Online
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Online Study Squad • Room Code: <span className="font-mono text-sky-300 font-bold">{room.code}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto z-10">
          
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 md:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
            title="Invite Real Friends via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span>Invite via WhatsApp</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex-1 md:flex-none px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
            <span>{copiedCode ? "Copied!" : "Copy Link"}</span>
          </button>

          <button
            onClick={() => setShowAddMember(true)}
            className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Friend</span>
          </button>

        </div>

      </div>

      {/* Main Grid: Timer on Left, Squad & Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Study Timer & Personal Focus Counter (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* DIGITAL STUDY TIMER CARD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            
            {/* Header / Mode Toggles */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Live Study Time Counter</h3>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    setTimerMode("stopwatch");
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    timerMode === "stopwatch"
                      ? "bg-sky-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Stopwatch
                </button>
                <button
                  onClick={() => handleStartPomodoro(25)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    timerMode === "pomodoro"
                      ? "bg-purple-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Pomodoro (25m)
                </button>
              </div>
            </div>

            {/* Current Study Subject / Topic Banner */}
            <div className="mb-6 bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300 overflow-hidden">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-semibold truncate">Focus Subject:</span>
                <input
                  type="text"
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-sky-300 font-medium focus:outline-none focus:border-sky-500 text-xs w-full sm:w-64"
                  placeholder="e.g., Physics: Rotational Motion"
                />
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                title="Toggle Timer Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            {/* DIGITAL CLOCK DISPLAY */}
            <div className="py-6 text-center">
              <div className="inline-block relative">
                
                {/* Glowing Aura when Running */}
                {isTimerRunning && (
                  <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full animate-pulse" />
                )}

                <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white drop-shadow-md">
                  {formatTime(seconds)}
                </div>

                <div className="mt-2 text-xs font-semibold text-sky-400 uppercase tracking-widest">
                  {isTimerRunning
                    ? timerMode === "stopwatch"
                      ? "⚡ Focus Timer Running • Keep Grind Alive!"
                      : "🎯 Pomodoro Sprint In Progress"
                    : "⏸ Timer Paused"}
                </div>

              </div>
            </div>

            {/* TIMER CONTROLS */}
            <div className="flex items-center justify-center gap-3 mt-4">
              
              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Start Study Session</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105"
                >
                  <Pause className="w-5 h-5 fill-slate-950" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setSeconds(timerMode === "pomodoro" ? pomodoroMinutes * 60 : 0);
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl flex items-center gap-1.5 transition-all"
                title="Reset Session Timer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

            </div>

            {/* Quick Pomodoro Presets */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold mr-1">Presets:</span>
              <button
                onClick={() => handleStartPomodoro(25)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-sky-950 border border-slate-800 text-slate-300 rounded-lg transition-all"
              >
                25m Focus
              </button>
              <button
                onClick={() => handleStartPomodoro(50)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-sky-950 border border-slate-800 text-slate-300 rounded-lg transition-all"
              >
                50m Sprint
              </button>
              <button
                onClick={() => handleStartPomodoro(5)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-emerald-950 border border-slate-800 text-emerald-300 rounded-lg transition-all"
              >
                5m Break
              </button>
            </div>

          </div>

          {/* SQUAD STUDY STATS DASHBOARD */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Your Study Today</span>
                <span className="text-lg font-bold text-white font-mono">{formatTime(todayStudiedSec)}</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Current Streak</span>
                <span className="text-lg font-bold text-amber-300 font-mono">12 Days 🔥</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Group Combined</span>
                <span className="text-lg font-bold text-purple-300 font-mono">{formatHoursShort(groupTotalSec)}</span>
              </div>
            </div>

          </div>

          {/* SQUAD GOALS & TARGET CHECKLIST */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Group Session Goals</h3>
              </div>
              <span className="text-xs text-slate-400">
                {goals.filter((g) => g.completed).length} / {goals.length} Completed
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              {goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    g.completed
                      ? "bg-slate-950/60 border-slate-800/60 text-slate-500 line-through"
                      : "bg-slate-950 border-slate-800 text-slate-200 hover:border-sky-500/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {g.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span>{g.title}</span>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                    {g.chapter}
                  </span>
                </div>
              ))}
            </div>

            {/* Add new goal form */}
            <form onSubmit={handleAddGoal} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add a new group study goal for today..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!newGoalText.trim()}
                className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50 transition-all"
              >
                Add Goal
              </button>
            </form>

          </div>

        </div>

        {/* RIGHT COLUMN: Live Friends Grid & Group Chat (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ONLINE FRIENDS SQUAD PANEL */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Squad Members ({members.length})</h3>
              </div>
              <button
                onClick={() => setShowAddMember(true)}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Member List */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {(() => {
                // Combine real server online members with local list
                const combinedMembersMap: Record<string, StudyMember> = {};

                // Add local members first
                members.forEach((m) => {
                  combinedMembersMap[m.id] = m;
                });

                // Override / add real server online members
                onlineServerMembers.forEach((sm) => {
                  combinedMembersMap[sm.id] = sm;
                });

                const displayList = Object.values(combinedMembersMap);

                return displayList.map((m) => {
                  let statusBadge = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                  let statusText = "Studying";
                  if (m.status === "break") {
                    statusBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30";
                    statusText = "In Break";
                  } else if (m.status === "solving_quiz") {
                    statusBadge = "bg-purple-500/20 text-purple-300 border-purple-500/30";
                    statusText = "Solving PYQs";
                  }

                  const isLiveOnline = onlineServerMembers.some((sm) => sm.id === m.id);

                  return (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0 relative">
                          {m.avatar}
                          {isLiveOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" title="Live Connected" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white truncate">
                              {m.name}
                            </span>
                            {m.userClass && (
                              <span className="text-[9px] bg-sky-950 text-sky-300 border border-sky-800/80 px-1.5 py-0.2 rounded font-semibold">
                                {m.userClass}
                              </span>
                            )}
                            <span className={`text-[9px] border px-1.5 py-0.2 rounded-full font-semibold ${statusBadge}`}>
                              {statusText}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.currentTopic}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-bold text-sky-300 block">{formatTime(m.todaySeconds)}</span>
                          <span className="text-[10px] text-amber-400 font-semibold">{m.streakDays}d streak 🔥</span>
                        </div>
                        {!m.isSelf && (
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                            title="Remove member"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>

          {/* GROUP LIVE CHAT & AI MENTOR IN SQUAD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[460px] shadow-xl">
            
            {/* Chat Header */}
            <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">WhatsApp Squad Chat</h3>
                  <p className="text-[10px] text-emerald-400 font-medium">History Saved Permanently • @ai supported</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                WhatsApp Mode
              </span>
            </div>

            {/* Chat Feed */}
            <div ref={chatFeedContainerRef} className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-slate-950/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    msg.isSystem
                      ? "justify-center"
                      : msg.senderId === "self"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {msg.isSystem ? (
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-1.5 text-[10px] text-amber-200 text-center max-w-xs shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {msg.senderAvatar}
                      </div>

                      <div
                        className={`max-w-[80%] rounded-xl p-2.5 leading-relaxed shadow ${
                          msg.isAI
                            ? "bg-purple-950/90 border border-purple-500/40 text-purple-100"
                            : msg.senderId === "self"
                            ? "bg-emerald-700 text-white font-medium rounded-tr-none"
                            : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] opacity-80 mb-1 gap-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{msg.senderName}</span>
                            {msg.senderClass && (
                              <span className="text-[9px] bg-slate-950/60 border border-slate-700 px-1 py-0.1 rounded font-normal text-sky-200">
                                {msg.senderClass}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{msg.timestamp}</span>
                            {msg.senderId === "self" && (
                              <span className="text-sky-300 font-black text-[11px]" title="Delivered & Saved">✓✓</span>
                            )}
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {isAskingAI && (
                <div className="flex items-center gap-2 text-xs text-purple-400 p-2 bg-purple-950/30 rounded-xl border border-purple-500/20">
                  <Bot className="w-4 h-4 animate-spin text-purple-400" />
                  <span>AI Mentor Bot is formulating answer for the squad...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Chat with squad or type doubt (@ai)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputChat.trim()}
                className="px-3 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* MODAL: ADD FRIEND TO SQUAD */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                Invite / Add Friend to Squad
              </h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Share room code <span className="font-mono text-sky-300 font-bold">{room.code}</span> with your study partner, or add their profile below:
            </p>

            <form onSubmit={handleAddFriend} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Friend's Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMemberName.trim()}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  Add Friend
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM STUDY GROUP */}
      {isCreateGroupOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                Create New Study Group
              </h3>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewGroup} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Group Name</label>
                <input
                  type="text"
                  value={newGroupNameInput}
                  onChange={(e) => setNewGroupNameInput(e.target.value)}
                  placeholder="e.g. Organic Chem Speed Demons"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Target Exam / Focus</label>
                <input
                  type="text"
                  value={newGroupExamInput}
                  onChange={(e) => setNewGroupExamInput(e.target.value)}
                  placeholder="e.g. JEE Main 2026 / HC Verma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupNameInput.trim()}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALENDAR & REAL STREAK MODAL */}
      <StudyCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        dailyRecords={dailyRecords}
      />

    </div>
  );
};
