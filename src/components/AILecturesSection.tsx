import React, { useState, useEffect, useRef } from "react";
import { AILecture, Subject } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  FileText,
  Brain,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Search,
  Zap,
  GraduationCap,
  Sliders,
  ChevronRight,
  Maximize2,
  List,
  Edit3,
  Save,
  Atom,
  Flame,
  Send,
  Plus,
  Link,
  Video,
  ExternalLink,
  Tv,
  Info,
  X,
  Layers,
  Film,
  CheckCircle2
} from "lucide-react";

interface CustomTelegramLecture {
  id: string;
  topic: string;
  subject: Subject;
  level: "JEE Main" | "JEE Advanced" | "Olympiad Level";
  lectureTitle: string;
  videoUrl: string;
  videoType: "telegram_post" | "direct_mp4" | "gdrive" | "youtube";
  summary: string;
  createdAt: string;
}

// Pre-built Advanced Lectures for Instant Offline/Fast Loading
const PREBUILT_LECTURES: AILecture[] = [
  {
    id: "lec_rotational",
    topic: "Rotational Dynamics & Rolling Mechanics",
    subject: "Physics",
    level: "JEE Advanced",
    lectureTitle: "Mastering Torque, Angular Momentum & Pure Rolling without Slipping",
    durationMinutes: 28,
    summary: "Deep dive into Rigid Body Dynamics: Instantaneous Centre of Rotation (ICOR), Conservation of Angular Momentum about moving points, and work-energy theorem for rolling bodies.",
    transcript: [
      {
        sectionTitle: "1. Core Physical Intuition: Kinematics of Rigid Bodies",
        content: "In rigid body dynamics, every particle has the same angular velocity ω about any line perpendicular to the plane of motion. Pure rolling on a stationary surface requires that the point of contact has zero net velocity: v_cm - ωR = 0.",
        keyFormulaHighlight: "v_cm = ωR (Condition for Pure Rolling)"
      },
      {
        sectionTitle: "2. Instantaneous Centre of Rotation (ICOR)",
        content: "The ICOR is a point in space (or on the body) about which the body can be treated as undergoing pure rotation at any instant. For a rolling wheel on a flat ground, the ICOR is exactly at the bottom contact point P. Thus, v_top = ω(2R) = 2 v_cm.",
        keyFormulaHighlight: "v_P = 0, v_top = 2 v_cm"
      },
      {
        sectionTitle: "3. Conservation of Angular Momentum about a Point",
        content: "When applying L_initial = L_final, always select a fixed reference point P on the ground where net external torque τ_ext,P = 0. About point P on ground: L_P = I_cm ω + m(v_cm × r_P).",
        keyFormulaHighlight: "L_P = I_cm ω + m v_cm R"
      },
      {
        sectionTitle: "4. Multi-Concept Trap: Friction Direction in Accelerated Rolling",
        content: "Static friction is self-adjusting! If a forward force F is applied at the top rim of a cylinder, friction can actually act FORWARD if F is applied above the center of mass above a critical height h_crit = k²/R.",
        keyFormulaHighlight: "f_static = F (m R h - I_cm) / (I_cm + m R²)"
      }
    ],
    notes: {
      coreFormulas: [
        "Torque Equation: τ_ext = I α = dL/dt",
        "Kinetic Energy in Rolling: K_total = ½ m v_cm² + ½ I_cm ω² = ½ m v_cm² (1 + k²/R²)",
        "Angular Momentum: L_P = I_cm ω + m (r_cm × v_cm)",
        "Acceleration down an Incline (Angle θ): a_cm = (g sin θ) / (1 + k²/R²)",
        "Minimum Friction Coefficient for No Slipping: μ_min = (tan θ) / (1 + R²/k²)"
      ],
      keyDerivations: [
        "Derivation of a_cm down an inclined plane using τ = I α and F_net = m a",
        "Proof that work done by static friction during pure rolling is ZERO because displacement of point of contact is zero.",
        "Derivation of critical force application height h = R + I_cm/(m R) for zero friction force."
      ],
      trapsAndExceptions: [
        "⚠️ Trap 1: NEVER use τ = I α about a moving point unless that point is the Center of Mass OR the Instantaneous Center of Zero Acceleration.",
        "⚠️ Trap 2: Assuming static friction ALWAYS opposes motion. In rolling with top-force application, static friction can act forward!",
        "⚠️ Trap 3: Forgetting that kinetic friction f_k = μ_k N does NOT obey pure rolling constraint v = ω R."
      ],
      mindmapPoints: [
        "Rigid Body → Translational (v_cm) + Rotational (ω)",
        "Pure Rolling → Point of Contact at Rest (v_C = 0)",
        "Torque Balance → Choose Origin with Max Unknown Forces",
        "Angular Momentum → Fixed Point vs Moving CM"
      ],
      aiMasterNotesMarkdown: `### 📌 Master Executive Summary: Rotational Dynamics

#### 1. Fundamental Equations
- **Newton-Euler Formulation**:
  $$\\vec{F}_{ext} = m \\vec{a}_{cm}$$
  $$\\vec{\\tau}_{cm} = I_{cm} \\vec{\\alpha}$$

#### 2. Pure Rolling Mechanics
For a sphere/cylinder rolling without slipping on a surface with velocity $v_{cm}$ and angular velocity $\\omega$:
1. $v_{cm} = R \\omega$
2. $a_{cm} = R \\alpha$
3. Contact point velocity $v_{contact} = 0$.

#### 3. Energy Considerations
Total Kinetic Energy:
$$K = \\frac{1}{2} m v_{cm}^2 \\left(1 + \\frac{k^2}{R^2}\\right)$$
Where $k$ is the radius of gyration:
- Ring/Hollow Cylinder: $k^2/R^2 = 1$
- Solid Disc/Cylinder: $k^2/R^2 = 1/2$
- Solid Sphere: $k^2/R^2 = 2/5$
- Hollow Sphere: $k^2/R^2 = 2/3$`
    }
  },
  {
    id: "lec_electrochemistry",
    topic: "Electrochemistry & Nernst Equation",
    subject: "Chemistry",
    level: "JEE Advanced",
    lectureTitle: "Advanced Galvanic Cells, Nernst Equation & Concentration Cells",
    durationMinutes: 25,
    summary: "Comprehensive breakdown of cell EMF, Gibbs free energy relation, temperature coefficient of cell EMF, and concentration cells with transference.",
    transcript: [
      {
        sectionTitle: "1. Cell Potential & Gibbs Free Energy Thermodynamics",
        content: "The non-PV work done by an electrochemical cell is equal to the decrease in Gibbs Free Energy: ΔG = -nFE_cell. Under standard conditions: ΔG° = -nFE°_cell.",
        keyFormulaHighlight: "ΔG = -n F E_cell and ΔG° = -n F E°_cell"
      },
      {
        sectionTitle: "2. The Nernst Equation & Non-Standard States",
        content: "For a general redox process aA + bB ⇌ cC + dD, the cell EMF varies with reaction quotient Q: E_cell = E°_cell - (RT / nF) ln Q. At 298 K, E_cell = E°_cell - (0.0591 / n) log10 Q.",
        keyFormulaHighlight: "E_cell = E°_cell - (0.0591 / n) log Q"
      },
      {
        sectionTitle: "3. Concentration Cells without Transference",
        content: "Concentration cells have E°_cell = 0. The EMF arises purely from concentration differences: E_cell = (0.0591 / n) log (C_cathode / C_anode).",
        keyFormulaHighlight: "E_cell = (0.0591 / n) log (C2 / C1) > 0 for spontaneity"
      },
      {
        sectionTitle: "4. Temperature Coefficient of Cell EMF (dE/dT)",
        content: "Using Maxwell relations: ΔS = nF (dE/dT)_P. Thus the heat released during cell operation is q = nFT (dE/dT).",
        keyFormulaHighlight: "ΔH = -nFE + nFT(dE/dT)_P"
      }
    ],
    notes: {
      coreFormulas: [
        "Nernst Equation (298 K): E_cell = E°_cell - (0.0591 / n) log10 Q",
        "Equilibrium Constant K_eq: log K_eq = (n E°_cell) / 0.0591",
        "Molar Conductivity: Λ_m = (κ × 1000) / M",
        "Kohlrausch Law: Λ°_m = ν_pos λ°_pos + ν_neg λ°_neg",
        "Temperature Coefficient: ΔS = n F (dE / dT)_P"
      ],
      keyDerivations: [
        "Derivation of Nernst equation from thermodynamic relation ΔG = ΔG° + RT ln Q",
        "Derivation of relation between solubility product K_sp and E° for sparingly soluble salt electrodes."
      ],
      trapsAndExceptions: [
        "⚠️ Trap 1: Multiplying E° values when balancing reaction coefficients. E° is an INTENSIVE property and NEVER changes when multiplying equations by stoichiometric numbers!",
        "⚠️ Trap 2: Mixing cathode and anode conventions in Nernst equation. ALWAYS write oxidation at anode and reduction at cathode.",
        "⚠️ Trap 3: Units of conductivity κ (S cm⁻¹ vs S m⁻¹)."
      ],
      mindmapPoints: [
        "Galvanic Cell → Anode (-ve, Oxidation), Cathode (+ve, Reduction)",
        "Nernst Equation → Q = [Products] / [Reactants]",
        "Equilibrium → E_cell = 0, Q = K_eq",
        "Conductance → κ = (1/R) × (l/A)"
      ],
      aiMasterNotesMarkdown: `### 🧪 Master Executive Summary: Electrochemistry

#### 1. Electrochemical Cell Conventions (ANOX / REDCAT)
- **Anode**: Oxidation occurs here. Negative terminal in Galvanic cell.
- **Cathode**: Reduction occurs here. Positive terminal in Galvanic cell.

#### 2. Thermodynamics
$$\\Delta G = -n F E_{cell}$$
$$\\Delta G^\\circ = -n F E^\\circ_{cell} = -RT \\ln K_{eq}$$

#### 3. Nernst Equation Analysis
For $aA + bB \\rightleftharpoons cC + dD$:
$$E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n} \\log_{10} \\left(\\frac{[C]^c [D]^d}{[A]^a [B]^b}\\right)$$`
    }
  },
  {
    id: "lec_calculus",
    topic: "Definite Integrals & Advanced Leibniz Rule",
    subject: "Maths",
    level: "JEE Advanced",
    lectureTitle: "Definite Integration Properties, Reduction Formulas & Differentiation Under Integral Sign",
    durationMinutes: 30,
    summary: "Master King's property, Queen's property, Newton-Leibniz formula for variable limits, and limit of sum integration methods.",
    transcript: [
      {
        sectionTitle: "1. King's Property & Symmetry Hacks",
        content: "King's Property states: ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx. This is crucial for eliminating difficult trigonometric terms like sin x / (sin x + cos x).",
        keyFormulaHighlight: "∫[a to b] f(x) dx = ∫[a to b] f(a+b-x) dx"
      },
      {
        sectionTitle: "2. Newton-Leibniz Rule for Differentiation under Integral Sign",
        content: "If g(x) = ∫[u(x) to v(x)] f(t) dt, then g'(x) = f(v(x)) · v'(x) - f(u(x)) · u'(x). This is frequently tested in JEE Advanced when limits are variable functions.",
        keyFormulaHighlight: "d/dx [∫[u(x) to v(x)] f(t)dt] = f(v(x)) v'(x) - f(u(x)) u'(x)"
      },
      {
        sectionTitle: "3. Limit of a Sum as Definite Integration",
        content: "Convert Riemann sums: lim (n->∞) (1/n) ∑ f(r/n) = ∫[0 to 1] f(x) dx. Replace r/n -> x and 1/n -> dx.",
        keyFormulaHighlight: "lim (1/n) ∑ f(r/n) = ∫[0 to 1] f(x) dx"
      },
      {
        sectionTitle: "4. Fractional Part & Periodic Functions in Integration",
        content: "If f(x) is periodic with fundamental period T, then ∫[0 to nT] f(x) dx = n ∫[0 to T] f(x) dx. For fractional part {x}, period T = 1.",
        keyFormulaHighlight: "∫[a + nT to b + nT] f(x) dx = ∫[a to b] f(x) dx"
      }
    ],
    notes: {
      coreFormulas: [
        "King's Rule: ∫[a to b] f(x) dx = ∫[a to b] f(a+b-x) dx",
        "Queen's Rule: ∫[0 to 2a] f(x) dx = ∫[0 to a] [f(x) + f(2a-x)] dx",
        "Newton-Leibniz: d/dx [∫[u(x) to v(x)] f(t) dt] = f(v(x)) v'(x) - f(u(x)) u'(x)",
        "Riemann Sum: lim (1/n) ∑_{r=1}^n f(r/n) = ∫[0 to 1] f(x) dx",
        "Wallis' Formula: ∫[0 to π/2] sinⁿ(x) dx"
      ],
      keyDerivations: [
        "Proof of King's Rule using substitution t = a + b - x.",
        "Derivation of Newton-Leibniz Rule using Fundamental Theorem of Calculus and Chain Rule."
      ],
      trapsAndExceptions: [
        "⚠️ Trap 1: Applying King's Property without checking if function is defined on the entire interval [a, b].",
        "⚠️ Trap 2: In Leibniz differentiation, forgetting to multiply by the derivative of upper and lower limit functions v'(x) and u'(x)!",
        "⚠️ Trap 3: Discontinuous integrand inside interval — MUST split integral at points of discontinuity."
      ],
      mindmapPoints: [
        "Integrals → Algebraic vs Symmetry Properties",
        "King's Rule → Add original & transformed integral 2I = ...",
        "Leibniz Rule → Differential Equations with Integrals",
        "Periodic Integrals → Pull out integer multiples of Period T"
      ],
      aiMasterNotesMarkdown: `### 📐 Master Executive Summary: Definite Integration

#### 1. King's Property
$$I = \\int_{a}^{b} f(x) dx = \\int_{a}^{b} f(a+b-x) dx$$
*Trick*: If $I + I = 2I = \\int_{a}^{b} [f(x) + f(a+b-x)] dx = \\text{constant}$, then $I = \\frac{\\text{constant} \\cdot (b-a)}{2}$.

#### 2. Newton-Leibniz Integration Differentiation
$$\\frac{d}{dx} \\left[ \\int_{g(x)}^{h(x)} f(t) dt \\right] = f(h(x)) \\cdot h'(x) - f(g(x)) \\cdot g'(x)$$`
    }
  }
];

export const AILecturesSection: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLecture, setSelectedLecture] = useState<AILecture>(PREBUILT_LECTURES[0]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Telegram Custom Lectures state & Importer modal state
  const [customTelegramLectures, setCustomTelegramLectures] = useState<AILecture[]>(() => {
    try {
      const saved = localStorage.getItem("jee_custom_telegram_lectures");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse custom telegram lectures", e);
    }
    return [];
  });

  const [showImportModal, setShowImportModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Form state
  const [importTitle, setImportTitle] = useState("");
  const [importTopic, setImportTopic] = useState("");
  const [importSubject, setImportSubject] = useState<Subject>("Physics");
  const [importLevel, setImportLevel] = useState<"JEE Main" | "JEE Advanced" | "Olympiad Level">("JEE Advanced");
  const [importVideoUrl, setImportVideoUrl] = useState("");
  const [importType, setImportType] = useState<"telegram_post" | "direct_mp4" | "gdrive" | "youtube">("telegram_post");
  const [importSummary, setImportSummary] = useState("");

  const handleSaveImportedLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTitle.trim() || !importVideoUrl.trim()) return;

    let detectedType = importType;
    if (importVideoUrl.includes("drive.google.com")) detectedType = "gdrive";
    else if (importVideoUrl.includes("youtube.com") || importVideoUrl.includes("youtu.be")) detectedType = "youtube";
    else if (importVideoUrl.includes("t.me/")) detectedType = "telegram_post";
    else if (importVideoUrl.match(/\.(mp4|webm|m3u8|mkv)(\?.*)?$/i)) detectedType = "direct_mp4";

    const newLec: AILecture = {
      id: `custom_tg_${Date.now()}`,
      topic: importTopic.trim() || importTitle.trim(),
      subject: importSubject,
      level: importLevel,
      lectureTitle: importTitle.trim(),
      durationMinutes: 45,
      summary: importSummary.trim() || "Uploaded custom video lecture from Telegram / Drive.",
      videoUrl: importVideoUrl.trim(),
      videoType: detectedType,
      isCustomTelegram: true,
      transcript: [
        {
          sectionTitle: "1. Lecture Overview & Video Stream",
          content: importSummary.trim() || `Lecture video stream loaded from ${detectedType.toUpperCase()}. Use side notes to write down key equations and concepts.`,
          keyFormulaHighlight: `Source: ${detectedType.toUpperCase()} Video Stream`
        }
      ],
      notes: {
        coreFormulas: [
          "⚡ Write down core formulas derived in this video in student notes."
        ],
        keyDerivations: [
          "🔬 Key derivation steps from Telegram video lecture."
        ],
        trapsAndExceptions: [
          "⚠️ Exam traps and edge cases covered in this video."
        ],
        mindmapPoints: [
          `Topic: ${importTitle}`,
          `Source: ${detectedType.toUpperCase()}`
        ],
        aiMasterNotesMarkdown: `### 📱 ${importTitle}\n\nVideo Source: ${importVideoUrl}`
      }
    };

    const updatedList = [newLec, ...customTelegramLectures];
    setCustomTelegramLectures(updatedList);
    localStorage.setItem("jee_custom_telegram_lectures", JSON.stringify(updatedList));
    setSelectedLecture(newLec);
    setShowImportModal(false);

    setImportTitle("");
    setImportTopic("");
    setImportVideoUrl("");
    setImportSummary("");
  };

  const handleDeleteCustomLecture = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTelegramLectures.filter((l) => l.id !== id);
    setCustomTelegramLectures(updated);
    localStorage.setItem("jee_custom_telegram_lectures", JSON.stringify(updated));
    if (selectedLecture.id === id) {
      setSelectedLecture(PREBUILT_LECTURES[0]);
    }
  };

  // AI Generator state
  const [customTopic, setCustomTopic] = useState("");
  const [customSubject, setCustomSubject] = useState<Subject>("Physics");
  const [customLevel, setCustomLevel] = useState<"JEE Main" | "JEE Advanced" | "Olympiad Level">("JEE Advanced");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Side Notes & Student Notes
  const [notesActiveTab, setNotesActiveTab] = useState<"formulas" | "derivations" | "traps" | "mindmap" | "student_notes" | "markdown">("formulas");
  const [studentNotesText, setStudentNotesText] = useState<string>("");
  const [savedNotesSuccess, setSavedNotesSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load student personal notes from LocalStorage whenever lecture changes
  useEffect(() => {
    const key = `jee_lecture_notes_${selectedLecture.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setStudentNotesText(saved);
    } else {
      setStudentNotesText(
        `# My Lecture Notes: ${selectedLecture.topic}\n\n## Key Takeaways:\n- ${selectedLecture.transcript[0]?.content || ""}\n\n## Personal Weak Spots & Doubts:\n- Need to re-solve numerical on this concept!`
      );
    }
    setCurrentSectionIndex(0);
    stopAudio();
  }, [selectedLecture]);

  // Handle Save Student Notes
  const handleSaveStudentNotes = () => {
    const key = `jee_lecture_notes_${selectedLecture.id}`;
    localStorage.setItem(key, studentNotesText);
    setSavedNotesSuccess(true);
    setTimeout(() => setSavedNotesSuccess(false), 2000);
  };

  // Audio Speech Handler using Browser Web Speech API
  const handleToggleAudio = () => {
    if (!("speechSynthesis" in window)) {
      alert("Audio narration is not supported in this browser environment.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Construct lecture speech transcript text
    const activeSection = selectedLecture.transcript[currentSectionIndex];
    const textToSpeak = `${activeSection.sectionTitle}. ${activeSection.content} Key Formula: ${activeSection.keyFormulaHighlight || ""}`;

    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      // Auto advance to next section if available
      if (currentSectionIndex < selectedLecture.transcript.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
      }
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const stopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Generate Custom AI Lecture via Backend API
  const handleGenerateCustomLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    setGenerateError(null);
    stopAudio();

    try {
      const res = await fetch("/api/ai/generate-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic.trim(),
          subject: customSubject,
          level: customLevel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate AI lecture.");
      }

      const data = await res.json();
      if (data.lecture && data.lecture.lectureTitle) {
        const newLec: AILecture = {
          id: `ai_gen_${Date.now()}`,
          topic: customTopic.trim(),
          subject: customSubject,
          level: customLevel,
          lectureTitle: data.lecture.lectureTitle,
          durationMinutes: data.lecture.durationMinutes || 20,
          summary: data.lecture.summary || "AI-generated masterclass lecture.",
          transcript: data.lecture.transcript || [],
          notes: data.lecture.notes || {
            coreFormulas: [],
            keyDerivations: [],
            trapsAndExceptions: [],
            mindmapPoints: [],
            aiMasterNotesMarkdown: "",
          },
        };

        setSelectedLecture(newLec);
        setCustomTopic("");
      } else {
        throw new Error("Invalid lecture format returned by AI.");
      }
    } catch (err: any) {
      console.error("AI Lecture Error:", err);
      setGenerateError(err.message || "Could not generate AI lecture. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Notes as File
  const handleDownloadNotes = () => {
    const fullText = `=====================================================
IIT JEE ADVANCED MASTER LECTURE NOTES
Topic: ${selectedLecture.topic} (${selectedLecture.subject} - ${selectedLecture.level})
Title: ${selectedLecture.lectureTitle}
=====================================================

--- CORE FORMULAS & EQUATIONS ---
${selectedLecture.notes.coreFormulas.map((f, i) => `${i + 1}. ${f}`).join("\n")}

--- KEY DERIVATIONS & PROOFS ---
${selectedLecture.notes.keyDerivations.map((d, i) => `${i + 1}. ${d}`).join("\n")}

--- CRITICAL EXAM TRAPS & EXCEPTIONS ---
${selectedLecture.notes.trapsAndExceptions.map((t, i) => `${i + 1}. ${t}`).join("\n")}

--- CONCEPT MIND MAP ---
${selectedLecture.notes.mindmapPoints.map((m) => `• ${m}`).join("\n")}

--- STUDENT PERSONAL NOTES ---
${studentNotesText}
`;

    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JEE_Lecture_Notes_${selectedLecture.topic.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(studentNotesText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const allAvailableLectures = [...customTelegramLectures, ...PREBUILT_LECTURES];

  const filteredLectures = allAvailableLectures.filter((lec) => {
    const matchSub = selectedSubject === "All" || lec.subject === selectedSubject;
    const matchSearch =
      lec.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.lectureTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSub && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* CUSTOM AI LECTURE GENERATOR BAR & VIDEO IMPORTER CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-extrabold text-white">Generate Instant AI Advanced Lecture or Import Video</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import Telegram / Drive Video</span>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Guide</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleGenerateCustomLecture} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Collision Mechanics, Aldehydes & Ketones, Complex Numbers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
              disabled={isGenerating}
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value as Subject)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
              disabled={isGenerating}
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Maths">Mathematics</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={customLevel}
              onChange={(e) => setCustomLevel(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
              disabled={isGenerating}
            >
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="JEE Main">JEE Main</option>
              <option value="Olympiad Level">Olympiad Level</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating || !customTopic.trim()}
              className="w-full h-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Lecture</span>
                </>
              )}
            </button>
          </div>
        </form>

        {generateError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{generateError}</span>
          </div>
        )}
      </div>

      {/* 4. MAIN SPLIT SCREEN: LECTURE PLAYER (LEFT) + SYNCHRONIZED NOTES (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LECTURE SCREEN & PLAYER (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase">
                    {selectedLecture.subject}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                    {selectedLecture.level}
                  </span>
                  {selectedLecture.isCustomTelegram && (
                    <span className="text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Send className="w-3 h-3 text-sky-400" />
                      <span>TELEGRAM / DRIVE VIDEO</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    ⏱️ {selectedLecture.durationMinutes} mins
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {selectedLecture.lectureTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{selectedLecture.topic}</p>
              </div>

              {/* Speech Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleToggleAudio}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow ${
                    isPlayingAudio
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                      : "bg-purple-600 hover:bg-purple-500 text-white"
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause AI Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Listen AI Voice</span>
                    </>
                  )}
                </button>

                {isPlayingAudio && (
                  <select
                    value={speechRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value);
                      setSpeechRate(rate);
                      if (isPlayingAudio) {
                        handleToggleAudio(); // Restart with new rate
                      }
                    }}
                    className="bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 rounded-xl px-2 py-2 focus:outline-none"
                  >
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2.0x</option>
                  </select>
                )}
              </div>
            </div>

            {/* VIDEO PLAYER EMBED (IF CUSTOM VIDEO LECTURE) */}
            {selectedLecture.videoUrl && (
              <div className="space-y-3 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sky-400" />
                    <span>Imported Video Stream ({selectedLecture.videoType?.toUpperCase() || "VIDEO"})</span>
                  </div>
                  <a
                    href={selectedLecture.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
                  >
                    <span>Open External Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {selectedLecture.videoType === "direct_mp4" && (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full rounded-xl bg-black max-h-[360px] border border-slate-800 shadow-inner"
                  />
                )}

                {selectedLecture.videoType === "gdrive" && (
                  <iframe
                    src={
                      selectedLecture.videoUrl.includes("/preview")
                        ? selectedLecture.videoUrl
                        : selectedLecture.videoUrl.replace(/\/view(\?.*)?$/, "/preview")
                    }
                    className="w-full h-[320px] rounded-xl border border-slate-800"
                    allow="autoplay"
                    title={selectedLecture.lectureTitle}
                  />
                )}

                {selectedLecture.videoType === "youtube" && (
                  <iframe
                    src={
                      selectedLecture.videoUrl.includes("embed")
                        ? selectedLecture.videoUrl
                        : `https://www.youtube.com/embed/${
                            selectedLecture.videoUrl.includes("v=")
                              ? selectedLecture.videoUrl.split("v=")[1]?.split("&")[0]
                              : selectedLecture.videoUrl.split("youtu.be/")[1]?.split("?")[0]
                          }`
                    }
                    className="w-full h-[320px] rounded-xl border border-slate-800"
                    allowFullScreen
                    title={selectedLecture.lectureTitle}
                  />
                )}

                {selectedLecture.videoType === "telegram_post" && (
                  <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                      <Send className="w-4 h-4 text-sky-400" />
                      <span>Telegram Private Channel Lecture Post</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      This video is linked from your Telegram private channel message: <code className="text-sky-300 font-mono text-[11px] bg-slate-900 px-1 py-0.5 rounded">{selectedLecture.videoUrl}</code>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={selectedLecture.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 transition-all shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Launch Telegram Post & Watch</span>
                      </a>
                      <button
                        onClick={() => setShowGuideModal(true)}
                        className="px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl text-xs font-medium inline-flex items-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5 text-amber-400" />
                        <span>How to get Direct MP4 Stream Link</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lecture Summary Box */}
            <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-2xl text-xs text-purple-200/90 leading-relaxed">
              <span className="font-bold text-amber-300 block mb-0.5">🎯 Lecture Objective & Executive Overview:</span>
              {selectedLecture.summary}
            </div>

            {/* Interactive Section Navigator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Lecture Commentary Sections ({selectedLecture.transcript.length})</span>
                <span>Section {currentSectionIndex + 1} / {selectedLecture.transcript.length}</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selectedLecture.transcript.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSectionIndex(idx);
                      if (isPlayingAudio) stopAudio();
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      currentSectionIndex === idx
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                        : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    <span>Part {idx + 1}</span>
                    {currentSectionIndex === idx && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Section Blackboard Content */}
            {selectedLecture.transcript[currentSectionIndex] && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="text-purple-400">#Part {currentSectionIndex + 1}:</span>
                    <span>{selectedLecture.transcript[currentSectionIndex].sectionTitle}</span>
                  </h3>
                  {isPlayingAudio && (
                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Narrating...
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                  <p>{selectedLecture.transcript[currentSectionIndex].content}</p>
                </div>

                {selectedLecture.transcript[currentSectionIndex].keyFormulaHighlight && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-mono font-bold text-amber-300 flex items-center justify-between">
                    <span>⚡ {selectedLecture.transcript[currentSectionIndex].keyFormulaHighlight}</span>
                  </div>
                )}
              </div>
            )}

            {/* Part Prev/Next Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentSectionIndex === 0}
                onClick={() => {
                  setCurrentSectionIndex((p) => Math.max(0, p - 1));
                  if (isPlayingAudio) stopAudio();
                }}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 rounded-xl text-xs text-slate-300 font-bold"
              >
                ← Previous Part
              </button>

              <button
                disabled={currentSectionIndex === selectedLecture.transcript.length - 1}
                onClick={() => {
                  setCurrentSectionIndex((p) => Math.min(selectedLecture.transcript.length - 1, p + 1));
                  if (isPlayingAudio) stopAudio();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl text-xs text-white font-bold shadow"
              >
                Next Part →
              </button>
            </div>
          </div>

          {/* Quick Pre-built & Telegram Lectures Selector Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Available Masterclass Catalogue ({filteredLectures.length})</span>
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {(["All", "Physics", "Chemistry", "Maths"] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedSubject === sub
                        ? "bg-purple-600 text-white shadow"
                        : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {sub}
                  </button>
                ))}

                <div className="relative w-36">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLectures.map((lec) => (
                <div
                  key={lec.id}
                  onClick={() => setSelectedLecture(lec)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                    selectedLecture.id === lec.id
                      ? "bg-purple-950/40 border-purple-500/60 shadow-lg"
                      : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">{lec.subject}</span>
                        {lec.isCustomTelegram && (
                          <span className="text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded">
                            TELEGRAM
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">⏱️ {lec.durationMinutes}m</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-white leading-snug line-clamp-2">{lec.lectureTitle}</h4>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{lec.level}</span>
                    <span className="text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
                      Open Lecture →
                    </span>
                  </div>

                  {/* Delete button for user custom lectures */}
                  {lec.isCustomTelegram && (
                    <button
                      onClick={(e) => handleDeleteCustomLecture(lec.id, e)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 bg-slate-950/80 rounded-lg hover:bg-rose-950/40 transition-all"
                      title="Delete uploaded lecture"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYNCHRONIZED MASTER NOTES (5 COLS) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            {/* Header with Download & Copy */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">Synchronized Lecture Notes</h3>
                  <p className="text-[10px] text-slate-400">Live cheat sheet beside lecture</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDownloadNotes}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs transition-all"
                  title="Download Full Notes TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Synchronized Notes Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
              <button
                onClick={() => setNotesActiveTab("formulas")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  notesActiveTab === "formulas"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚡ Formulas
              </button>

              <button
                onClick={() => setNotesActiveTab("derivations")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  notesActiveTab === "derivations"
                    ? "bg-sky-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🔬 Derivations
              </button>

              <button
                onClick={() => setNotesActiveTab("traps")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  notesActiveTab === "traps"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚠️ Traps
              </button>

              <button
                onClick={() => setNotesActiveTab("mindmap")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  notesActiveTab === "mindmap"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🧠 Mindmap
              </button>

              <button
                onClick={() => setNotesActiveTab("student_notes")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  notesActiveTab === "student_notes"
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>My Notes</span>
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="min-h-[380px] max-h-[500px] overflow-y-auto pr-1 space-y-3">
              {/* TAB 1: FORMULAS */}
              {notesActiveTab === "formulas" && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡ Key Equations & Physical Laws</span>
                  </h4>
                  {selectedLecture.notes.coreFormulas.map((formula, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 leading-relaxed shadow-sm hover:border-emerald-500/40 transition-all"
                    >
                      {formula}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: DERIVATIONS */}
              {notesActiveTab === "derivations" && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    🔬 Derivation Outlines & Axioms
                  </h4>
                  {selectedLecture.notes.keyDerivations.map((der, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed shadow-sm hover:border-sky-500/40 transition-all"
                    >
                      <span className="font-bold text-sky-400 mr-1.5">Step {idx + 1}:</span>
                      {der}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: TRAPS & EXCEPTIONS */}
              {notesActiveTab === "traps" && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    ⚠️ JEE Advanced Exam Traps & Tricky Pitfalls
                  </h4>
                  {selectedLecture.notes.trapsAndExceptions.map((trap, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-200 leading-relaxed shadow-sm"
                    >
                      {trap}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: MIND MAP */}
              {notesActiveTab === "mindmap" && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    🧠 Visual Concept Mind Map
                  </h4>
                  <div className="space-y-2">
                    {selectedLecture.notes.mindmapPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-purple-200 flex items-start gap-2"
                      >
                        <span className="p-1 bg-purple-500/20 text-purple-400 rounded shrink-0 text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STUDENT PERSONAL INTERACTIVE NOTES */}
              {notesActiveTab === "student_notes" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">📝 Interactive Student Notepad</span>
                    <button
                      onClick={handleSaveStudentNotes}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savedNotesSuccess ? "Saved!" : "Save Notes"}</span>
                    </button>
                  </div>

                  <textarea
                    value={studentNotesText}
                    onChange={(e) => setStudentNotesText(e.target.value)}
                    rows={12}
                    placeholder="Type your personal insights, formulas, and questions while listening to the AI lecture..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleCopyNotes}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? "Copied!" : "Copy to Clipboard"}</span>
                    </button>

                    <span className="text-[10px] text-slate-500 font-mono">Auto-saved locally</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL 1: IMPORT TELEGRAM / DRIVE VIDEO LECTURE */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-300 text-xs font-bold uppercase">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Private Channel & Cloud Importer</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Upload Telegram / Drive Video Lecture</h2>
              <p className="text-xs text-slate-400">
                Paste your private Telegram channel post link, direct MP4 video link, or Google Drive URL to add it to your personal web lecture catalogue.
              </p>
            </div>

            <form onSubmit={handleSaveImportedLecture} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="e.g. Physics Mechanics - Rotational Motion Lec 01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subject</label>
                  <select
                    value={importSubject}
                    onChange={(e) => setImportSubject(e.target.value as Subject)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Level</label>
                  <select
                    value={importLevel}
                    onChange={(e) => setImportLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="JEE Main">JEE Main</option>
                    <option value="Olympiad Level">Olympiad Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Video Source URL / Link *
                </label>
                <input
                  type="url"
                  required
                  value={importVideoUrl}
                  onChange={(e) => setImportVideoUrl(e.target.value)}
                  placeholder="e.g. https://t.me/c/12345/678 or https://drive.google.com/file/d/... or http://.../video.mp4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Supports Telegram message URLs (<code className="text-sky-400">t.me/c/...</code>), Google Drive (<code className="text-sky-400">drive.google.com</code>), direct <code className="text-sky-400">.mp4</code> links, and YouTube.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Video Format Type</label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="telegram_post">Telegram Channel Post Link (t.me/...)</option>
                  <option value="direct_mp4">Direct MP4 Video Stream (plays in HTML5 player)</option>
                  <option value="gdrive">Google Drive Video Link (embedded player)</option>
                  <option value="youtube">YouTube Video / Unlisted Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Topic / Brief Description</label>
                <textarea
                  value={importSummary}
                  onChange={(e) => setImportSummary(e.target.value)}
                  rows={3}
                  placeholder="Key concepts covered in this lecture video..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                >
                  Save & Add Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: HOW TO UPLOAD TELEGRAM CHANNEL VIDEOS GUIDE */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold uppercase">
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Complete Telegram Video Upload Guide</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                How to Upload & Play Telegram Private Channel Lectures
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Since Telegram private channels require permissions to view media, here are the 3 most effective methods to bring your private Telegram videos directly to this website:
              </p>
            </div>

            <div className="space-y-4">
              {/* Method 1 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-sky-400">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Method 1: Direct Telegram Message Link (Easiest)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Open your private Telegram channel and right-click or tap on the video message.
                  <br />
                  2. Select <strong className="text-white">"Copy Message Link"</strong> (looks like <code className="text-sky-300">https://t.me/c/123456789/45</code>).
                  <br />
                  3. Click <strong className="text-white">"Import Telegram / Drive Video"</strong> on this web app and paste the link!
                  <br />
                  4. Clicking the video card will launch Telegram Web/App directly, letting you watch while taking side-notes in real time.
                </p>
              </div>

              {/* Method 2 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Method 2: Convert Telegram Video to HTML5 Streaming Link (Recommended for In-Browser Video Player)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Add a free Telegram Direct Link Bot (e.g. <strong className="text-emerald-300">@GetPublicLinkBot</strong>, <strong className="text-emerald-300">@FilesToLinkBot</strong>, or <strong className="text-emerald-300">@DirectLinkGeneratorBot</strong>) to your channel or forward the video to it.
                  <br />
                  2. The bot generates an instant streaming HTTP URL ending in <code className="text-emerald-300">.mp4</code>.
                  <br />
                  3. Paste that stream URL into our website importer and set format to <strong className="text-white">"Direct MP4 Video Stream"</strong>.
                  <br />
                  4. Your video will stream in a full inline HTML5 video player right on your web screen!
                </p>
              </div>

              {/* Method 3 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Method 3: Google Drive / Cloud Sync</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Forward your Telegram videos to a Google Drive folder.
                  <br />
                  2. Set the Google Drive file share setting to <strong className="text-white">"Anyone with the link can view"</strong>.
                  <br />
                  3. Copy the file URL (e.g., <code className="text-purple-300">https://drive.google.com/file/d/FILE_ID/view</code>) and paste it into our importer.
                  <br />
                  4. The web app automatically embeds the Google Drive video player side-by-side with your AI formula sheets and student notepad!
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowGuideModal(false);
                  setShowImportModal(true);
                }}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
              >
                Got It! Import Video Now →
              </button>

              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
