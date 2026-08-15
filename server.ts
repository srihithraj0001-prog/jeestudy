import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON payloads up to 10MB to allow image upload for doubts
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client lazily/safely
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    }
    genAI = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// API Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiConfigured: !!process.env.GEMINI_API_KEY });
});

// Helper for resilient Gemini API calls with automatic retries and fast models
async function generateContentWithFallback(
  ai: GoogleGenAI,
  requestParams: { contents: any; config?: any }
) {
  // Use fast supported Gemini models first for sub-second responses
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.5-pro",
    "gemini-flash-latest"
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          ...requestParams,
        });
        if (response && response.text) {
          return response;
        }
      } catch (error: any) {
        lastError = error;
        const errMsg = error?.message || JSON.stringify(error || "");
        console.warn(`[Gemini API] Error on model ${model} (Attempt ${attempt}/2): ${errMsg}`);

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          continue;
        }
        break;
      }
    }
  }

  throw lastError;
}

const MATH_FORMAT_RULE = `\nCRITICAL MATH FORMATTING RULE: Do NOT output raw LaTeX math dollar signs ($ or $$ or \\$ or /$) or raw backslashes. ALWAYS write all equations, variables, and mathematical expressions using clear Unicode characters and plain text formatting (e.g. θ, α, β, π, Δ, √x, x², x³, ∫, ∑, ±, ∞, ×, ÷, ∝, →, A/B, x₁, λ, ω, etc.) so that all equations are 100% human-readable in standard Markdown without unrendered dollar signs.`;

// 1. AI JEE Doubt Solver
app.post("/api/ai/solve-doubt", async (req, res) => {
  try {
    const { question, mode = "detailed", chapter, imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!question && !imageBase64) {
      return res.status(400).json({ error: "Please provide a question or upload an image." });
    }

    const ai = getGenAI();
    let systemInstruction = `You are an elite, highly experienced JEE Main & Advanced Subject Master Coach (Physics, Chemistry, and Mathematics).
Your goal is to explain concepts clearly, accurately, and step-by-step for Indian engineering aspirants.${MATH_FORMAT_RULE}

Structure your response using clean Markdown with the following sections:
### 🎯 Core Concept & Formulas
State the primary concepts, principles, or formulas involved.

### 📝 Step-by-Step Resolution
Provide a logical, mathematically rigorous breakdown with clear steps.

### ⚠️ Common Exam Traps & Mistakes
Highlight sneaky traps, sign mistakes, or misinterpretations students often make in JEE.

### ⚡ Shortcut / Golden Tip
Provide an expert speed trick, dimensional analysis check, or shortcut if applicable.`;

    if (mode === "quick") {
      systemInstruction += "\nKeep the answer concise and direct to save time during revision.";
    } else if (mode === "hint") {
      systemInstruction += "\nDo NOT give the final numeric answer directly first. Give a hint, starting principle, and guiding questions to help the student solve it themselves.";
    }

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          mimeType: mimeType,
        },
      });
    }

    const promptText = `Chapter Context: ${chapter || "General JEE Syllabus"}
Question / Doubt: ${question || "Please analyze the question shown in the attached image."}`;

    parts.push({ text: promptText });

    const response = await generateContentWithFallback(ai, {
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ answer: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Error solving doubt:", error);
    res.status(500).json({
      error: "Failed to generate AI resolution. Please check your query or API configuration.",
      details: error.message,
    });
  }
});

// 2. AI Quiz Generator
app.post("/api/ai/generate-quiz", async (req, res) => {
  try {
    const { chapterName, subject, examType = "mains", count = 3 } = req.body;
    const ai = getGenAI();

    const response = await generateContentWithFallback(ai, {
      contents: `Generate ${count} authentic ${examType.toUpperCase()} level multiple-choice PYQ style practice questions for the chapter "${chapterName}" in ${subject}.`,
      config: {
        systemInstruction: `You are a Senior JEE Test Setter. Create realistic, challenging ${examType.toUpperCase()} questions for physics, chemistry, or mathematics.${MATH_FORMAT_RULE}
For each question, provide 4 options (A, B, C, D), specify the 0-based index of the correct option (0 for A, 1 for B, 2 for C, 3 for D), and write a concise, step-by-step solution.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of generated JEE practice questions",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Question statement with formulas" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 multiple choice options",
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Index 0 to 3 of correct answer" },
              solution: { type: Type.STRING, description: "Step-by-step explanation" },
            },
            required: ["question", "options", "correctAnswerIndex", "solution"],
          },
        },
      },
    });

    const jsonStr = response.text || "[]";
    const questions = JSON.parse(jsonStr);
    res.json({ questions });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate AI quiz.", details: error.message });
  }
});

// 3. AI Exam Strategy & Weakness Analyzer
app.post("/api/ai/analyze-strategy", async (req, res) => {
  try {
    const { weakChapters, strongChapters, mainsScore, advScore } = req.body;
    const ai = getGenAI();

    const prompt = `Student Current Predicted Scores:
- JEE Main: ${mainsScore} / 300
- JEE Advanced: ${advScore} / 180

Weak/Low Accuracy High Weightage Chapters:
${JSON.stringify(weakChapters || [], null, 2)}

Strong/High Accuracy Chapters:
${JSON.stringify(strongChapters || [], null, 2)}

Provide a high-impact, actionable 7-Day Strategy Plan to maximize score gain. Include:
1. Top 5 Highest Return-on-Investment (ROI) Chapters to prioritize immediately.
2. Subject-Wise Quick Fixes (Physics, Chemistry, Maths).
3. Daily Practice Schedule (hours allocation for PYQs, revision, mock tests).
4. Mindset & Exam Technique Advice (time management, negative marking control).`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: `You are a master JEE mentor and rank booster strategist. Deliver crisp, inspiring, and data-driven preparation strategies in Markdown format.${MATH_FORMAT_RULE}`,
        temperature: 0.5,
      },
    });

    res.json({ strategy: response.text || "Strategy analysis unavailable." });
  } catch (error: any) {
    console.error("Error generating strategy:", error);
    res.status(500).json({ error: "Failed to generate strategy recommendation.", details: error.message });
  }
});

// 4. AI Chapter Formula Sheet & Key Notes
app.post("/api/ai/chapter-notes", async (req, res) => {
  try {
    const { chapterName, subject } = req.body;
    const ai = getGenAI();

    const prompt = `Create a master revision cheat sheet for the chapter "${chapterName}" (${subject}) for JEE Main & Advanced revision.
Include:
1. Key Mathematical Formulas & Equations
2. Fundamental Laws & Definitions
3. High-Probability Question Types
4. Important Reagents / Reactions / Graphs (if applicable)
5. Quick Memory Mnemonics / Shortcuts`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: `You are an expert JEE revision material creator. Format output cleanly in Markdown with tables or bullet points for fast reading.${MATH_FORMAT_RULE}`,
        temperature: 0.3,
      },
    });

    res.json({ notes: response.text || "Revision notes unavailable." });
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to generate revision notes.", details: error.message });
  }
});

// 5. AI Live Dynamic PYQ Batch Generator for Chapters
app.post("/api/ai/generate-pyq-batch", async (req, res) => {
  try {
    const { chapterName, subject, exam = "JEE Main", year = 2024, count = 5 } = req.body;
    const ai = getGenAI();

    const prompt = `Generate ${count} authentic, real-exam level ${exam} Previous Year Questions (PYQ) for the chapter "${chapterName}" in ${subject}. Include real paper years/shifts between 2018 and 2025.
For each question, provide 4 options, 0-based index of the correct option, detailed step-by-step mathematical/concept solution, and key formula used.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: `You are a Senior JEE Test Setter and IIT Professor. Generate realistic, high-yield ${exam} questions. Format as JSON array.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              solution: { type: Type.STRING },
              keyFormula: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              exam: { type: Type.STRING },
              year: { type: Type.INTEGER },
              shift: { type: Type.STRING }
            },
            required: ["questionText", "options", "correctAnswer", "solution", "difficulty"]
          }
        }
      }
    });

    const pyqs = JSON.parse(response.text || "[]");
    res.json({ pyqs });
  } catch (error: any) {
    console.error("Error generating PYQ batch:", error);
    res.status(500).json({ error: "Failed to generate AI PYQ batch.", details: error.message });
  }
});

// 6. AI Advanced Lecture & Synchronized Notes Generator
app.post("/api/ai/generate-lecture", async (req, res) => {
  try {
    const { topic, subject = "Physics", level = "JEE Advanced" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required for generating AI lecture." });
    }

    const ai = getGenAI();
    const prompt = `Deliver a top-tier, highly detailed, advanced IIT JEE Master Lecture and comprehensive synchronized lecture notes on the topic: "${topic}" in ${subject} at ${level} level.

Make sure the lecture covers:
1. Deep physical/mathematical intuition and foundational axioms.
2. Advanced derivations, boundary conditions, and proofs.
3. Multi-concept problem solving strategies (Irodov/Pathfinder/JEE Advanced level).
4. Critical exam traps, dimensional checks, and speed hacks.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: `You are an elite IITian Master Professor and JEE Advanced Top Ranker Coach.${MATH_FORMAT_RULE}
Format the response strictly as a JSON object with comprehensive lecture commentary sections and detailed side-by-side lecture notes.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lectureTitle: { type: Type.STRING },
            durationMinutes: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            transcript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionTitle: { type: Type.STRING },
                  content: { type: Type.STRING },
                  keyFormulaHighlight: { type: Type.STRING }
                },
                required: ["sectionTitle", "content"]
              }
            },
            notes: {
              type: Type.OBJECT,
              properties: {
                coreFormulas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                keyDerivations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                trapsAndExceptions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                mindmapPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                aiMasterNotesMarkdown: { type: Type.STRING }
              },
              required: ["coreFormulas", "keyDerivations", "trapsAndExceptions", "mindmapPoints", "aiMasterNotesMarkdown"]
            }
          },
          required: ["lectureTitle", "durationMinutes", "summary", "transcript", "notes"]
        }
      }
    });

    const lectureData = JSON.parse(response.text || "{}");
    res.json({ lecture: lectureData });
  } catch (error: any) {
    console.error("Error generating AI lecture:", error);
    res.status(500).json({ error: "Failed to generate AI Lecture.", details: error.message });
  }
});

// --- REAL-TIME MULTI-USER STUDY ROOM STORE (Multi-Group Supported) ---
interface ServerMember {
  id: string;
  name: string;
  userClass: string;
  avatar: string;
  status: "studying" | "break" | "solving_quiz" | "offline";
  currentTopic: string;
  todaySeconds: number;
  streakDays: number;
  lastActive: number;
}

interface ServerChatMessage {
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

interface RoomData {
  id: string;
  code: string;
  name: string;
  targetExam: string;
  targetHours: number;
  members: Record<string, ServerMember>;
  messages: ServerChatMessage[];
}

// In-memory multi-room database initialized with default groups
const roomsStore: Record<string, RoomData> = {
  "JEE_2026_MAIN": {
    id: "JEE_2026_MAIN",
    code: "JEE2026",
    name: "JEE 2026 Official Squad",
    targetExam: "JEE Main & Advanced 2026",
    targetHours: 6,
    members: {},
    messages: [
      {
        id: "sys_welcome_1",
        senderId: "system",
        senderName: "Study System",
        senderAvatar: "🔒",
        text: "🔒 Group 'JEE 2026 Official Squad' connected. Live study times and chat are synchronized across all group members!",
        timestamp: "TODAY",
        isSystem: true,
      },
    ],
  },
  "PHYSICS_SPRINT": {
    id: "PHYSICS_SPRINT",
    code: "PHY100",
    name: "Physics Mastery & HC Verma Squad",
    targetExam: "JEE Physics 100 Percentile",
    targetHours: 5,
    members: {},
    messages: [
      {
        id: "sys_welcome_2",
        senderId: "system",
        senderName: "Study System",
        senderAvatar: "🚀",
        text: "⚡ Welcome to Physics Mastery Squad! Track live HC Verma & Irodov study times here.",
        timestamp: "TODAY",
        isSystem: true,
      },
    ],
  },
  "CHEMISTRY_CRASH": {
    id: "CHEMISTRY_CRASH",
    code: "CHEM2026",
    name: "Organic & Inorganic Revision Group",
    targetExam: "JEE Chemistry Fast Track",
    targetHours: 4,
    members: {},
    messages: [
      {
        id: "sys_welcome_3",
        senderId: "system",
        senderName: "Study System",
        senderAvatar: "🧪",
        text: "🧪 Welcome to Chemistry Revision Group! Ask @ai for NCERT & reaction mechanisms.",
        timestamp: "TODAY",
        isSystem: true,
      },
    ],
  },
};

// Helper: Ensure room exists
function getOrCreateRoom(roomId: string, name?: string, code?: string): RoomData {
  const normId = (roomId || "JEE_2026_MAIN").toUpperCase().replace(/[^A_Z0-9_]/g, "_");
  if (!roomsStore[normId]) {
    roomsStore[normId] = {
      id: normId,
      code: code || normId.substring(0, 8),
      name: name || `Study Squad (${normId})`,
      targetExam: "JEE Main & Advanced",
      targetHours: 6,
      members: {},
      messages: [
        {
          id: `sys_welcome_${Date.now()}`,
          senderId: "system",
          senderName: "Study System",
          senderAvatar: "🎉",
          text: `🎉 New study group created! Share link with friends to watch each other's live study time!`,
          timestamp: "TODAY",
          isSystem: true,
        },
      ],
    };
  }
  return roomsStore[normId];
}

// Clean stale members inactive for > 25 seconds across all rooms
function cleanupStaleMembers() {
  const now = Date.now();
  for (const rId in roomsStore) {
    const room = roomsStore[rId];
    for (const mId in room.members) {
      if (now - room.members[mId].lastActive > 25000) {
        delete room.members[mId];
      }
    }
  }
}

// Endpoint: List all active groups
app.get("/api/room/groups", (_req, res) => {
  cleanupStaleMembers();
  const groupsList = Object.values(roomsStore).map((r) => ({
    id: r.id,
    code: r.code,
    name: r.name,
    targetExam: r.targetExam,
    targetHours: r.targetHours,
    onlineCount: Object.keys(r.members).length,
  }));
  res.json({ groups: groupsList });
});

// Endpoint: Create a custom study group
app.post("/api/room/create", (req, res) => {
  try {
    const { name, targetExam, targetHours, code } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }
    const generatedId = `GROUP_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const generatedCode = code || Math.random().toString(36).substring(2, 8).toUpperCase();

    roomsStore[generatedId] = {
      id: generatedId,
      code: generatedCode,
      name: name.trim(),
      targetExam: targetExam || "JEE 2026",
      targetHours: targetHours || 6,
      members: {},
      messages: [
        {
          id: `sys_${Date.now()}`,
          senderId: "system",
          senderName: "Study System",
          senderAvatar: "🌟",
          text: `🌟 Group '${name}' initialized. Welcome aspirants!`,
          timestamp: "TODAY",
          isSystem: true,
        },
      ],
    };

    res.json({ group: roomsStore[generatedId] });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create room", details: err.message });
  }
});

// 5. Room Presence Heartbeat
app.post("/api/room/presence", (req, res) => {
  try {
    const { roomId, id, name, userClass, avatar, status, currentTopic, todaySeconds, streakDays } = req.body;
    const room = getOrCreateRoom(roomId);

    if (id && name) {
      room.members[id] = {
        id,
        name,
        userClass: userClass || "Class 12",
        avatar: avatar || "👨‍🎓",
        status: status || "studying",
        currentTopic: currentTopic || "JEE Preparation",
        todaySeconds: todaySeconds || 0,
        streakDays: streakDays || 1,
        lastActive: Date.now(),
      };
    }
    cleanupStaleMembers();
    res.json({
      roomId: room.id,
      roomName: room.name,
      members: Object.values(room.members),
      messages: room.messages,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Presence heartbeat error", details: err.message });
  }
});

// 6. Get Room State
app.get("/api/room/state", (req, res) => {
  cleanupStaleMembers();
  const roomId = (req.query.roomId as string) || "JEE_2026_MAIN";
  const room = getOrCreateRoom(roomId);
  res.json({
    roomId: room.id,
    roomName: room.name,
    members: Object.values(room.members),
    messages: room.messages,
  });
});

// 7. Post Room Chat Message
app.post("/api/room/chat", async (req, res) => {
  try {
    const { roomId, id, senderId, senderName, senderClass, senderAvatar, text, timestamp } = req.body;
    const room = getOrCreateRoom(roomId);

    if (!text) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const newMsg: ServerChatMessage = {
      id: id || Date.now().toString(),
      senderId,
      senderName,
      senderClass,
      senderAvatar,
      text,
      timestamp: timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    room.messages.push(newMsg);
    if (room.messages.length > 100) {
      room.messages.shift();
    }

    // Check if asking AI
    if (text.toLowerCase().includes("@ai")) {
      try {
        const ai = getGenAI();
        const questionText = text.replace(/@ai/i, "").trim();
        const response = await generateContentWithFallback(ai, {
          contents: `A JEE aspirant in study squad "${room.name}" asked: "${questionText}". Provide a concise, clear 2-3 sentence answer or hint with key formulas if applicable.`,
          config: {
            systemInstruction: "You are a friendly AI JEE mentor participating in a live group study chat.",
            temperature: 0.4,
          },
        });

        const aiMsg: ServerChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: "ai_bot",
          senderName: "AI JEE Mentor",
          senderClass: "Bot",
          senderAvatar: "🤖",
          text: response.text || "Here is a hint for your question!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAI: true,
        };
        room.messages.push(aiMsg);
      } catch (aiErr) {
        console.error("Group AI doubt error", aiErr);
      }
    }

    res.json({ messages: room.messages });
  } catch (err: any) {
    res.status(500).json({ error: "Chat message error", details: err.message });
  }
});

// Vite middleware for dev / static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
