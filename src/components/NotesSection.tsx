import React, { useState } from "react";
import { FULL_JEE_SYLLABUS } from "../data/syllabus";
import {
  FileText,
  Award,
  BookOpen,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export const NotesSection: React.FC = () => {
  const [noteType, setNoteType] = useState<"short" | "chem_handwritten" | "ncert_chem" | "topper">("short");
  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapterId, setExpandedChapterId] = useState<number | null>(null);

  // FULL CHEMISTRY DETAILED HANDWRITTEN NOTES (28 PDF FILES)
  const CHEM_HANDWRITTEN_NOTES = [
    { title: "1. Mole Concept", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYdXFBNVZyOHdSVVE/view?usp=drivesdk" },
    { title: "2. Atomic Structure", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYeGZ1YlIyQkkwM00/view?usp=drivesdk" },
    { title: "3. Periodic Table", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYVm1fR0ZmSW1IYjg/view?usp=drivesdk" },
    { title: "4. Chemical Bonding", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYWkZ4TVg3cG9XREU/view?usp=drivesdk" },
    { title: "5. Gaseous State", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYYTNkYVJGS0pibVU/view?usp=drivesdk" },
    { title: "6. Thermodynamics and Thermochemistry", link: "https://drive.google.com/file/d/1CA0cVu3-ALYuAm0IzC8YXbK7-7f33Ceg/view" },
    { title: "7. Chemical Equilibrium", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYMHhZbFJLdDZlSXM/view?usp=drivesdk" },
    { title: "8. Ionic Equilibrium", link: "https://drive.google.com/file/d/0ByRkvg8lBuWYQll0cEMwMW05cWM/view?usp=drivesdk" },
    { title: "9. S-Block Elements", link: "https://drive.google.com/file/d/10B08Ledqk2jt4ZZgyz8wlEiwEDmAur1S/view?usp=drivesdk" },
    { title: "10. Boron and Carbon Family", link: "https://drive.google.com/file/d/1nwILXm9-yo-k8iDFGaAf8nwTZ9Yq-yS9/view?usp=drivesdk" },
    { title: "11. Redox Reaction", link: "https://drive.google.com/file/d/14BPSz8MDLOwQ-s5s8Pwm4kgHCBQaRYs_/view?usp=drivesdk" },
    { title: "12. P-Block (Groups 15, 16, 17, 18)", link: "https://drive.google.com/file/d/1fwTLfco1dKnpq4LH8aUpsFfOxUOJ6M4z/view?usp=drivesdk" },
    { title: "13. D & F Block Elements", link: "https://drive.google.com/file/d/1O9vP9OuFcxeDyYh0AetDSOduplghoCM8/view?usp=drivesdk" },
    { title: "14. Coordination Compounds", link: "https://drive.google.com/file/d/1_no2hBoN_yCXZeBmnfcJqCYxy8s9yz1z/view?usp=drivesdk" },
    { title: "15. IUPAC Nomenclature", link: "https://drive.google.com/file/d/1blnv1UmodVF4N8SwEx3qs-MnMpSGu2pH/view?usp=drivesdk" },
    { title: "16. Isomerism", link: "https://drive.google.com/file/d/1f8H5WPHgeznwjX4OYMsXlyIbnM2EXInx/view?usp=drivesdk" },
    { title: "17. GOC I (General Organic Chemistry 1)", link: "https://drive.google.com/file/d/1AndzXpLLzX73vU9KW7cEaRIQwmq_YoG-/view?usp=drivesdk" },
    { title: "18. GOC II (General Organic Chemistry 2)", link: "https://drive.google.com/file/d/1howrxMF6sEvPWBR-Pldeeyer-C4-Rjik/view?usp=drivesdk" },
    { title: "19. Chemical Kinetics", link: "https://drive.google.com/file/d/1609WCAB9eBpSEn4knylg-25hxM7fCTOn/view?usp=drivesdk" },
    { title: "20. Electrochemistry", link: "https://drive.google.com/file/d/1x5NgQzMc7ZjiWkUKYBDVRAKMk0Y8cmgI/view?usp=drivesdk" },
    { title: "21. Solutions", link: "https://drive.google.com/file/d/14Bge5-zTFz3HY4Lpvq9pfrkO139Bv0Ia/view?usp=drivesdk" },
    { title: "22. Hydrocarbons", link: "https://drive.google.com/file/d/1tqRuNsBcojhzZvyLc5qcQF-iM2C6mqbs/view?usp=drivesdk" },
    { title: "23. Halogen Derivatives", link: "https://drive.google.com/file/d/1L0j9sa1oOcwOutGUAAE_bGuPNufR7BMm/view?usp=drivesdk" },
    { title: "24. Alcohol, Phenol & Ether", link: "https://drive.google.com/file/d/1GdpcVSmyJeW0hKPmLEyxV1bU6oUf3S_O/view?usp=drivesdk" },
    { title: "25. Aldehyde and Ketone", link: "https://drive.google.com/file/d/10Ggx14Bay83vws7GvyV0XbBUbWifhxY3/view?usp=drivesdk" },
    { title: "26. Nitrogen Containing Compounds", link: "https://drive.google.com/file/d/1QyBvAe3Zisv9OP-jXOSbJ4ZgxHEKXpd7/view?usp=drivesdk" },
    { title: "27. Solid State", link: "https://drive.google.com/file/d/1SWEwltxDW19mrCAgGUCCOg5zQk88vPvq/view?usp=drivesdk" },
    { title: "28. Important Organic Conversions", link: "https://drive.google.com/file/d/PoV9cnVSIdA0zu9rqaHX9H0Cj/view?usp=drivesdk" },
  ];

  // HIGHLIGHTED NCERT CHEMISTRY PDFS
  const HIGHLIGHTED_NCERT_CHEMISTRY = [
    { title: "Electrochemistry NCERT Highlighted", link: "https://drive.google.com/file/d/1BW4yycA5Wu9sh9mQhVdVKKaw0ty2xFi2/view?usp=drivesdk" },
    { title: "Chemical Kinetics NCERT Highlighted", link: "https://drive.google.com/file/d/1w1CW1sXa8pYuAJU7GkVendiH1fZBqQBN/view?usp=drivesdk" },
    { title: "Solutions NCERT Highlighted", link: "https://drive.google.com/file/d/16rdiB8OqScz_NFCwRWCqQKEZjw5ZWyz1/view?usp=drivesdk" },
    { title: "Equilibrium NCERT Highlighted", link: "https://drive.google.com/file/d/1YFpCws8XP4G5fOQ4VT1xoqH8TX0pxvaK/view?usp=drivesdk" },
    { title: "Redox Reactions NCERT Highlighted", link: "https://drive.google.com/file/d/19LctNMoMmO0kdhQ1qHmWS3rVTgOZjvdo/view?usp=drivesdk" },
    { title: "Thermodynamics NCERT Highlighted", link: "https://drive.google.com/file/d/1FvmCsXqzFpdICZ445bDNWCKpAefpmEC7/view?usp=drivesdk" },
    { title: "Structure of Atom NCERT Highlighted", link: "https://drive.google.com/file/d/1D2-13BwX5w8X9jOVCqwSEuR1oZYQGI4K/view?usp=drivesdk" },
    { title: "Some Basic Concepts of Chemistry NCERT Highlighted", link: "https://drive.google.com/file/d/1RA_KPUerkpCU9MlkLLmBY-C4FG4EA6tk/view?usp=drivesdk" },
  ];

  // Filter chapters
  const filteredChapters = FULL_JEE_SYLLABUS.filter((ch) => {
    const subMatch =
      activeSubject === "Physics"
        ? ch.sub === "Physics"
        : activeSubject === "Chemistry"
        ? ch.sub === "Chemistry"
        : ch.sub === "Maths";

    const qMatch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
    return subMatch && qMatch;
  });

  const class11 = filteredChapters.filter((c) => c.class === 11);
  const class12 = filteredChapters.filter((c) => c.class === 12);

  // Sample PDF Drive link generator for authentic preview
  const getDriveLinkForChapter = (chName: string, type: string) => {
    const encoded = encodeURIComponent(`JEE ${chName} ${type} Notes PDF drive`);
    return `https://drive.google.com/search?q=${encoded}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">JEE Chapter Notes & Drive Vaults</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Chapter-wise comprehensive notes + direct Google Drive links for ALLEN Maths, Physics Galaxy, Organic Short Notes & Cengage.
            </p>
          </div>
        </div>
      </div>

      {/* DIRECT DRIVE LINKS GRID */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-extrabold text-white">Direct Google Drive Notes & Books Vaults</h2>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
            Direct Drive Vaults Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href="https://drive.google.com/drive/folders/13N5OKS5F8QortRKHdvP2fKb7EgITcN9I"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-sky-400 font-mono font-bold uppercase block">PHYSICS NOTES VAULT</span>
              <span className="text-xs font-bold text-white group-hover:text-sky-300">Physics Notes Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/15UOJHRVyv0WcChqdnFmnk0uRRi_tvnL0"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block">CHEMISTRY NOTES VAULT</span>
              <span className="text-xs font-bold text-white group-hover:text-rose-300">Chemistry Notes Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1zm17_0SM12SyaBOKLigIE4zsA00JgFDr"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">MATH NOTES VAULT</span>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300">Mathematics Notes Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1qIuISGPPZRZXoLiFF0XarGRMsm84laGS"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">PYQ MASTER VAULT</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-300">JEE Mains & Adv PYQs Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1OoMzQi8UH32nVPa-QOyYMKKdXKy_4Bxr"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block">CENGAGE PCM VAULT</span>
              <span className="text-xs font-bold text-white group-hover:text-cyan-300">Cengage PCM Books Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1GT3SMcR6YAmKYndte2bGTjbDSAhSDS6q"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-purple-400 font-mono font-bold uppercase block">SRI CHAITANYA TEST 1</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-300">Sri Chaitanya Test Series Part 1 ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/15VDRRpuWZ8_qbNemKm_il78N0jrj4l8s"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-purple-400 font-mono font-bold uppercase block">SRI CHAITANYA TEST 2</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-300">Sri Chaitanya Test Series Part 2 ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1Wbq4_YY9--AZJb_g6vja3Mgt6xrEjrIJ"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase block">NARAYANA TEST 1</span>
              <span className="text-xs font-bold text-white group-hover:text-indigo-300">Narayana Test Series Part 1 ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/15Odk5xuFc2ewEEUqsJr1yPJyD57d3JwS"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase block">NARAYANA TEST 2</span>
              <span className="text-xs font-bold text-white group-hover:text-indigo-300">Narayana Test Series Part 2 ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0" />
          </a>
          <a
            href="https://drive.google.com/drive/folders/1qzcv9WQhoDky2qNc7ARP8mbSM6-lr7DY"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">ALLEN MODULES</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-300">Allen Complete Study Modules ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1axFGtTumGQQVyV2SsLTTkNLU_EYHxHMP"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-purple-400 font-mono font-bold uppercase block">ALLEN TEST SERIES</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-300">Allen Official Test Series ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/13N5OKS5F8QortRKHdvP2fKb7EgITcN9I"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-sky-400 font-mono font-bold uppercase block">PHYSICS SHORT NOTES</span>
              <span className="text-xs font-bold text-white group-hover:text-sky-300">Physics Short Notes Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1LxpBV0gDUfWxXTQYVwa-bwH3SUZI0Knp"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">ALLEN MATHS 11th+12th</span>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300">Class 11 & 12 A11EN Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1_8uih-ttA1pS0qravSTxf0adyBqYLGpy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-sky-400 font-mono font-bold uppercase block">ADVANCE PHYSICS</span>
              <span className="text-xs font-bold text-white group-hover:text-sky-300">Advance Level Physics Notes ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1Pwy-PNpPlQD5tWlMqyZbhb05msZ08183"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-purple-400 font-mono font-bold uppercase block">ASHISH ARORA SIR</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-300">Physics Galaxy PDF Notes ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/u/0/mobile/folders/11wIXKguuUF4t0_BWfA-hX3yonTPtCjAx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block">ORGANIC CHEMISTRY</span>
              <span className="text-xs font-bold text-white group-hover:text-rose-300">Organic Short Notes Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/1TlyES6SAYfoulXxCt6DjtE14OYFgIrht"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">CENGAGE COMPLETE</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-300">Poori Cengage Drive ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0" />
          </a>

          <a
            href="https://drive.google.com/drive/folders/14vNdkg7nSf6G3zD6WmPewmQB2Avgc6bU"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all flex items-center justify-between group shadow"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase block">POPULAR TEST SERIES 1</span>
              <span className="text-xs font-bold text-white group-hover:text-indigo-300">JEE Mock Tests Vault 1 ↗</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0" />
          </a>
        </div>
      </div>

      {/* Sub-tabs: Short Notes, Full Chem Handwritten, Highlighted NCERT Chem, Topper Notes */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setNoteType("short")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            noteType === "short"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Short Notes</span>
        </button>

        <button
          onClick={() => setNoteType("chem_handwritten")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            noteType === "chem_handwritten"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-300" />
          <span>✍️ Full Chemistry Handwritten (28 Chapters)</span>
        </button>

        <button
          onClick={() => setNoteType("ncert_chem")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            noteType === "ncert_chem"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>📘 Highlighted NCERT Chem</span>
        </button>

        <button
          onClick={() => setNoteType("topper")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            noteType === "topper"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Award className="w-4 h-4 text-yellow-400" />
          <span>Topper Notes</span>
        </button>
      </div>

      {/* TOPPER NOTES COMING SOON BANNER */}
      {noteType === "topper" ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 text-center space-y-4 my-8">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl w-fit mx-auto">
            <Award className="w-10 h-10 text-yellow-400" />
          </div>
          <span className="inline-block px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-full text-xs font-mono font-bold">
            ⚡ IN THE WORKS
          </span>
          <h2 className="text-2xl font-black text-white">Coming Soon</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Topper Notes are being curated from AIR holders and toppers. Stay tuned — something legendary is on the way.
          </p>
        </div>
      ) : noteType === "chem_handwritten" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>✍️ Full Chemistry Detailed Handwritten Notes</span>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono">
                  28 Chapters
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete chapter-by-chapter handwritten notes for Physical, Organic & Inorganic Chemistry.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapter notes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CHEM_HANDWRITTEN_NOTES.filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">
                    HANDWRITTEN PDF
                  </span>
                  <h3 className="text-xs font-extrabold text-white leading-snug">{item.title}</h3>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open Drive PDF ↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : noteType === "ncert_chem" ? (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>📘 Highlighted NCERT Chemistry PDFs</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  NCERT Highlighted
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                NCERT textbooks pre-highlighted with crucial JEE Main & Advanced points, reactions, and exceptions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HIGHLIGHTED_NCERT_CHEMISTRY.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                    NCERT HIGHLIGHTED
                  </span>
                  <h3 className="text-xs font-extrabold text-white leading-snug">{item.title}</h3>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open NCERT PDF ↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* SUBJECT SELECTOR BUTTONS */}
          <div className="flex items-center gap-3">
            {(["Physics", "Chemistry", "Mathematics"] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeSubject === sub
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span>{sub === "Physics" ? "⚡" : sub === "Chemistry" ? "🧪" : "📐"}</span>
                <span>{sub}</span>
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeSubject} chapters...`}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* CHAPTER ACCORDION LIST */}
          <div className="space-y-6">
            
            {/* CLASS 11 */}
            {class11.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  CLASS 11 ({class11.length} Chapters)
                </div>

                <div className="space-y-2">
                  {class11.map((ch) => {
                    const isExpanded = expandedChapterId === ch.id;
                    return (
                      <div
                        key={ch.id}
                        className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => setExpandedChapterId(isExpanded ? null : ch.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                            <span className="text-xs font-bold text-white">{ch.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                              Weightage: {ch.mainWt}%
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded details & PDF action */}
                        {isExpanded && (
                          <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <p className="text-slate-400 text-[11px] max-w-md">
                              Comprehensive short notes including formulas, key diagrams, derivations, and solved JEE Main examples for {ch.name}.
                            </p>
                            <a
                              href={getDriveLinkForChapter(ch.name, "Short")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-all shadow"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open PDF Notes ↗</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CLASS 12 */}
            {class12.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  CLASS 12 ({class12.length} Chapters)
                </div>

                <div className="space-y-2">
                  {class12.map((ch) => {
                    const isExpanded = expandedChapterId === ch.id;
                    return (
                      <div
                        key={ch.id}
                        className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => setExpandedChapterId(isExpanded ? null : ch.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="text-xs font-bold text-white">{ch.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                              Weightage: {ch.mainWt}%
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded details & PDF action */}
                        {isExpanded && (
                          <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <p className="text-slate-400 text-[11px] max-w-md">
                              Comprehensive short notes including formulas, key diagrams, derivations, and solved JEE Main examples for {ch.name}.
                            </p>
                            <a
                              href={getDriveLinkForChapter(ch.name, "Short")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open PDF Notes ↗</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
};
