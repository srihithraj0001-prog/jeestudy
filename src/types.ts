export type Subject = "Physics" | "Chemistry" | "Maths";

export interface SampleQuestion {
  q: string;
  opts: string[];
  ans: number;
  sol: string;
}

export interface Chapter {
  id: number;
  sub: Subject;
  name: string;
  class?: number; // 11 or 12
  mainWt: number; // approximate marks in JEE Main
  advWt: number;  // approximate marks in JEE Advanced
  mainsAcc: number; // accuracy %
  advAcc: number;   // accuracy %
  weightCategory?: "High" | "Medium" | "Low";
  qMains?: SampleQuestion;
  qAdv?: SampleQuestion;
}

export interface DoubtMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  image?: string;
  timestamp: string;
}

export interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  solution: string;
}

export interface UserProfile {
  id: string;
  name: string;
  userClass: string; // e.g. "Class 12", "Class 11", "Dropper", "Class 10"
  avatar: string;
}

export interface StudyMember {
  id: string;
  name: string;
  userClass?: string;
  avatar: string;
  status: "studying" | "break" | "solving_quiz" | "offline";
  currentTopic: string;
  todaySeconds: number;
  streakDays: number;
  isSelf?: boolean;
  lastActive?: number;
}

export interface GroupChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderClass?: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isAI?: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  chapter: string;
  completed: boolean;
  assignedTo?: string;
}

export interface StudyRoom {
  id: string;
  code: string;
  name: string;
  targetExam: string;
  targetHours: number;
  activeSubject: Subject | "All";
}

export interface AILectureSection {
  sectionTitle: string;
  content: string;
  keyFormulaHighlight?: string;
}

export interface AILectureNotes {
  coreFormulas: string[];
  keyDerivations: string[];
  trapsAndExceptions: string[];
  mindmapPoints: string[];
  aiMasterNotesMarkdown: string;
}

export interface AILecture {
  id: string;
  topic: string;
  subject: Subject;
  level: "JEE Main" | "JEE Advanced" | "Olympiad Level";
  lectureTitle: string;
  durationMinutes: number;
  summary: string;
  transcript: AILectureSection[];
  notes: AILectureNotes;
  videoUrl?: string;
  videoType?: "telegram_post" | "direct_mp4" | "gdrive" | "youtube";
  isCustomTelegram?: boolean;
}
