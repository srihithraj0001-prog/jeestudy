import React, { useState, useEffect } from "react";
import { FULL_JEE_SYLLABUS } from "./data/syllabus";
import { Chapter, UserProfile } from "./types";
import { Header, AppTab } from "./components/Header";
import { HomeSection } from "./components/HomeSection";
import { JEEHubSection } from "./components/JEEHubSection";
import { NotesSection } from "./components/NotesSection";
import { AILecturesSection } from "./components/AILecturesSection";
import { PYQBankEngine } from "./components/PYQBankEngine";
import { DPPSection } from "./components/DPPSection";
import { BooksSection } from "./components/BooksSection";
import { GiveawaysSection } from "./components/GiveawaysSection";
import { AboutSection } from "./components/AboutSection";
import { ChapterMatrix } from "./components/ChapterMatrix";
import { SimulationsSection } from "./components/SimulationsSection";
import { StudyGroup } from "./components/StudyGroup";
import { AIDoubtSolver } from "./components/AIDoubtSolver";
import { TestEngine } from "./components/TestEngine";
import { AIStrategyModal } from "./components/AIStrategyModal";
import { ChapterNotesModal } from "./components/ChapterNotesModal";
import { AIQuizModal } from "./components/AIQuizModal";
import { UserOnboardingModal } from "./components/UserOnboardingModal";

const STORAGE_KEY = "jee_master_tracker_v2";
const PROFILE_STORAGE_KEY = "jee_user_profile_v2";

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Record<number, { mains: number; adv: number }> = JSON.parse(saved);
        return FULL_JEE_SYLLABUS.map((ch) => ({
          ...ch,
          mainsAcc: parsed[ch.id]?.mains ?? ch.mainsAcc,
          advAcc: parsed[ch.id]?.adv ?? ch.advAcc,
        }));
      }
    } catch (e) {
      console.error("Failed to load saved progress", e);
    }
    return FULL_JEE_SYLLABUS;
  });

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem(PROFILE_STORAGE_KEY);
  });

  const [activeTab, setActiveTab] = useState<AppTab>("home");

  // Modals
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [notesChapter, setNotesChapter] = useState<Chapter | null>(null);
  const [quizChapter, setQuizChapter] = useState<Chapter | null>(null);

  // Selected chapter for pre-filling AI doubt solver
  const [doubtChapterFilter, setDoubtChapterFilter] = useState<string | undefined>();

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setIsOnboardingOpen(false);
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      const saveObj: Record<number, { mains: number; adv: number }> = {};
      chapters.forEach((c) => {
        saveObj[c.id] = { mains: c.mainsAcc, adv: c.advAcc };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveObj));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }, [chapters]);

  const handleUpdateAcc = (id: number, mode: "mains" | "adv", value: number) => {
    const val = Math.min(100, Math.max(0, value));
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return mode === "mains" ? { ...c, mainsAcc: val } : { ...c, advAcc: val };
        }
        return c;
      })
    );
  };

  const handleSendToDoubtSolver = (chapterName: string) => {
    setDoubtChapterFilter(chapterName);
    setActiveTab("hub");
  };

  // Scores for Strategy Modal
  let mainsScore = 0;
  let advScore = 0;
  chapters.forEach((ch) => {
    mainsScore += ch.mainWt * (ch.mainsAcc / 100);
    advScore += ch.advWt * (ch.advAcc / 100);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        aiActive={true}
        onOpenStrategy={() => setIsStrategyOpen(true)}
        userProfile={userProfile}
        onEditProfile={() => setIsOnboardingOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        
        {/* 1. HOME SECTION */}
        {activeTab === "home" && (
          <HomeSection onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* 2. JEE HUB SECTION */}
        {activeTab === "hub" && (
          <JEEHubSection
            onSelectAction={(action) => {
              if (action === "infinity" || action === "chapter_tests") {
                setActiveTab("pyq");
              } else if (action === "pyq_mains" || action === "pyq_adv") {
                setActiveTab("pyq");
              } else if (action === "ai_tutor") {
                setActiveTab("matrix");
              } else if (action === "mock_mains" || action === "mock_adv") {
                setActiveTab("pyq");
              }
            }}
          />
        )}

        {/* 3. 72 CHAPTERS MATRIX */}
        {activeTab === "matrix" && (
          <ChapterMatrix
            chapters={chapters}
            onUpdateAcc={handleUpdateAcc}
            onOpenNotes={(ch) => setNotesChapter(ch)}
            onOpenQuiz={(ch) => setQuizChapter(ch)}
            onSendToDoubtSolver={handleSendToDoubtSolver}
          />
        )}

        {/* 3.5. AI ADVANCED LECTURES & SYNCHRONIZED NOTES */}
        {activeTab === "lectures" && (
          <AILecturesSection />
        )}

        {/* 4. NOTES SECTION */}
        {activeTab === "notes" && (
          <NotesSection />
        )}

        {/* 5. PYQ BANK ENGINE */}
        {activeTab === "pyq" && (
          <PYQBankEngine
            chapters={chapters}
            onUpdateAcc={handleUpdateAcc}
            onSendToDoubtSolver={handleSendToDoubtSolver}
          />
        )}

        {/* 5. DPP SECTION */}
        {activeTab === "dpp" && (
          <DPPSection />
        )}

        {/* 8. BOOKS LIBRARY SECTION */}
        {activeTab === "books" && (
          <BooksSection />
        )}

        {/* 9. INTERACTIVE SIMULATIONS SECTION */}
        {activeTab === "simulations" && (
          <SimulationsSection />
        )}

        {/* 10. REGAIN FOCUS APP & SQUAD ROOM */}
        {activeTab === "focus" && (
          <StudyGroup
            userProfile={userProfile}
            onEditProfile={() => setIsOnboardingOpen(true)}
            onOpenDoubtSolver={(topic) => {
              if (topic) setDoubtChapterFilter(topic);
              setActiveTab("matrix");
            }}
          />
        )}

        {/* 11. GIVEAWAYS SECTION */}
        {activeTab === "giveaways" && (
          <GiveawaysSection />
        )}

        {/* 12. ABOUT US SECTION */}
        {activeTab === "about" && (
          <AboutSection />
        )}

      </main>

      {/* AI Modals */}
      <AIStrategyModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
        chapters={chapters}
        mainsScore={mainsScore}
        advScore={advScore}
      />

      <ChapterNotesModal
        chapter={notesChapter}
        onClose={() => setNotesChapter(null)}
      />

      <AIQuizModal
        chapter={quizChapter}
        onClose={() => setQuizChapter(null)}
        onSaveAccuracy={(chId, mode, acc) => handleUpdateAcc(chId, mode, acc)}
      />

      <UserOnboardingModal
        isOpen={isOnboardingOpen}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onClose={() => setIsOnboardingOpen(false)}
        isRequired={!userProfile}
      />

    </div>
  );
}
