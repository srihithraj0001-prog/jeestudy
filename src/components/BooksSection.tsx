import React, { useState } from "react";
import {
  Library,
  Search,
  ExternalLink,
  BookOpen,
  Folder,
  Tag
} from "lucide-react";

interface BookItem {
  id: string;
  title: string;
  author?: string;
  category: "Physics" | "Chemistry" | "Maths" | "PCM Combined";
  tag: "BOOK" | "NOTES" | "PYQ" | "MODULE" | "TEST" | "PAPER";
  link: string;
}

const JEE_BOOKS_DATA: BookItem[] = [
  // --- FEATURED DRIVE ARCHIVES ---
  { id: "d_phys_notes", title: "Physics Complete Notes Vault Drive", author: "JEE Physics Master", category: "Physics", tag: "NOTES", link: "https://drive.google.com/drive/folders/13N5OKS5F8QortRKHdvP2fKb7EgITcN9I" },
  { id: "d_chem_notes", title: "Chemistry Complete Notes Vault Drive", author: "JEE Chem Master", category: "Chemistry", tag: "NOTES", link: "https://drive.google.com/drive/folders/15UOJHRVyv0WcChqdnFmnk0uRRi_tvnL0" },
  { id: "d_math_notes", title: "Mathematics Complete Notes Vault Drive", author: "JEE Math Master", category: "Maths", tag: "NOTES", link: "https://drive.google.com/drive/folders/1zm17_0SM12SyaBOKLigIE4zsA00JgFDr" },
  { id: "d_pyq_vault", title: "JEE Mains & Advanced PYQs Master Drive", author: "JEE Prep Vault", category: "PCM Combined", tag: "PYQ", link: "https://drive.google.com/drive/folders/1qIuISGPPZRZXoLiFF0XarGRMsm84laGS" },
  { id: "d_cengage_pcm", title: "Cengage Physics Chemistry Maths Complete Drive", author: "G. Tewani / Cengage", category: "PCM Combined", tag: "BOOK", link: "https://drive.google.com/drive/folders/1OoMzQi8UH32nVPa-QOyYMKKdXKy_4Bxr" },
  { id: "d_sri_chaitanya1", title: "Sri Chaitanya Official Test Series Part 1", author: "Sri Chaitanya Techno School", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/1GT3SMcR6YAmKYndte2bGTjbDSAhSDS6q" },
  { id: "d_sri_chaitanya2", title: "Sri Chaitanya Official Test Series Part 2", author: "Sri Chaitanya Techno School", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/15VDRRpuWZ8_qbNemKm_il78N0jrj4l8s" },
  { id: "d_narayana1", title: "Narayana Official Test Series Part 1", author: "Narayana Educational Institutions", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/1Wbq4_YY9--AZJb_g6vja3Mgt6xrEjrIJ" },
  { id: "d_narayana2", title: "Narayana Official Test Series Part 2", author: "Narayana Educational Institutions", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/15Odk5xuFc2ewEEUqsJr1yPJyD57d3JwS" },
  { id: "d_lakshay27", title: "Lakshay JEE 2027 All Latest Modules", author: "Physics Wallah", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/drive/folders/1uuI7WDT00_C8UKiGwD5aVxJPqIKZr1UO" },
  { id: "d_arjuna26", title: "Arjuna JEE 2026 All Latest Modules", author: "Physics Wallah", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/drive/folders/1CSrlLrCDBD72Kx_gE4DIWu8X2B1gXKLo" },
  { id: "d_prayas27", title: "Prayas JEE 2027 All Latest Modules", author: "Physics Wallah", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/drive/folders/1LZOku5eK49I70hqq-QjMSEMs6i_-Dlm_" },
  { id: "d1", title: "ALLEN Maths Class 11th + 12th Complete", author: "ALLEN Career Institute", category: "Maths", tag: "MODULE", link: "https://drive.google.com/drive/folders/1LxpBV0gDUfWxXTQYVwa-bwH3SUZI0Knp" },
  { id: "d2", title: "ALLEN Complete Study Modules Drive", author: "ALLEN Career Institute", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/drive/folders/1qzcv9WQhoDky2qNc7ARP8mbSM6-lr7DY" },
  { id: "d3", title: "ALLEN Official Test Series Drive", author: "ALLEN Career Institute", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/1axFGtTumGQQVyV2SsLTTkNLU_EYHxHMP" },
  { id: "d4", title: "Popular JEE Test Series Vault 1", author: "JEE Test Vault", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/14vNdkg7nSf6G3zD6WmPewmQB2Avgc6bU" },
  { id: "d5", title: "Popular JEE Test Series Vault 2", author: "JEE Test Vault", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/1IqndZq8JD5y7hbVVMHWAF5QpTc3ymZ7e" },
  { id: "d6", title: "Popular JEE Test Series Vault 3", author: "JEE Test Vault", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/1SUir2hhGur6GuNLg0nTjWLzYQMKiUFcs" },
  { id: "d7", title: "Physics Short Notes Complete Drive", author: "Physics Master", category: "Physics", tag: "NOTES", link: "https://drive.google.com/drive/folders/13N5OKS5F8QortRKHdvP2fKb7EgITcN9I" },
  { id: "d8", title: "Advance Level Physics Notes", author: "Top Faculty", category: "Physics", tag: "NOTES", link: "https://drive.google.com/drive/folders/1_8uih-ttA1pS0qravSTxf0adyBqYLGpy" },
  { id: "d9", title: "Handwritten Master Notes Collection", author: "Topper Drive", category: "PCM Combined", tag: "NOTES", link: "https://drive.google.com/drive/folders/1sulVgEQE-FOS5maQZkD2c58_lr4DKayn" },
  { id: "d10", title: "Complete Cengage Series (All Subjects)", author: "G. Tewani / Cengage", category: "PCM Combined", tag: "BOOK", link: "https://drive.google.com/drive/folders/1TlyES6SAYfoulXxCt6DjtE14OYFgIrht" },
  { id: "d11", title: "Organic Chemistry Short Notes Drive", author: "Chemistry Master", category: "Chemistry", tag: "NOTES", link: "https://drive.google.com/drive/u/0/mobile/folders/11wIXKguuUF4t0_BWfA-hX3yonTPtCjAx" },
  { id: "d12", title: "JEE Mains Official Level Mock Tests Drive", author: "Mock Test Vault", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/1-0LxYG3fpHwgO9wi0PO3ENMSDuFbquux" },
  { id: "d13", title: "JEE Advanced Full Mock Tests Drive", author: "Advanced Test Vault", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/drive/folders/10LFPAgfDM_bvxEbGbRDy77jijPa1pkn5" },
  { id: "d14", title: "Physics Galaxy PDF Notes (Ashish Arora)", author: "Ashish Arora Sir", category: "Physics", tag: "NOTES", link: "https://drive.google.com/drive/folders/1Pwy-PNpPlQD5tWlMqyZbhb05msZ08183" },
  { id: "d15", title: "All Textbooks Collection Drive (NCERT + Reference)", author: "JEE Library Vault", category: "PCM Combined", tag: "BOOK", link: "https://drive.google.com/drive/folders/1PG54IwVxDiCsHPU-ir37l8YTs4DxnnP-" },

  // --- PHYSICS ---
  { id: "b1", title: "SWISSPHO", author: "Physics Olympiad Prep", category: "Physics", tag: "PAPER", link: "https://drive.google.com/search?q=SWISSPHO+physics" },
  { id: "b2", title: "Nitin Sachan Sir (Physics) - All Stuff", author: "Nitin Sachan", category: "Physics", tag: "NOTES", link: "https://drive.google.com/search?q=Nitin+Sachan+Physics" },
  { id: "b3", title: "Paper ArXiv", category: "Physics", tag: "PAPER", link: "https://drive.google.com/search?q=JEE+Physics+Paper+ArXiv" },
  { id: "b4", title: "Pathfinder & Irodov Solutions", author: "Ankit Singh", category: "Physics", tag: "BOOK", link: "https://drive.google.com/search?q=Pathfinder+Irodov+Solutions" },
  { id: "b5", title: "PHYSICS NOTES (Class 11 + 12)", category: "Physics", tag: "NOTES", link: "https://drive.google.com/search?q=JEE+Physics+Notes+Class+11+12" },
  { id: "b6", title: "Physics Olympiad (INPhO, IPhO, RPhO)", category: "Physics", tag: "PYQ", link: "https://drive.google.com/search?q=Physics+Olympiad+INPhO+IPhO" },
  { id: "b7", title: "Prof. Walter Lewin Assignments", category: "Physics", tag: "NOTES", link: "https://drive.google.com/search?q=Prof+Walter+Lewin+Assignments" },
  { id: "b8", title: "Rahul Sardana Sir Physics Books", author: "Rahul Sardana", category: "Physics", tag: "BOOK", link: "https://drive.google.com/search?q=Rahul+Sardana+Physics" },
  { id: "b9", title: "Selected Questions in SBT & Irodov", author: "Vinay Uppal Sir", category: "Physics", tag: "BOOK", link: "https://drive.google.com/search?q=SBT+Irodov+Vinay+Uppal" },
  { id: "b10", title: "HC VERMA WITH SOLUTION", author: "H.C. Verma", category: "Physics", tag: "BOOK", link: "https://drive.google.com/search?q=HC+Verma+Concept+of+Physics+Solutions" },
  { id: "b11", title: "DC PANDEY ALL VOLUMES", author: "D.C. Pandey (Arihant)", category: "Physics", tag: "BOOK", link: "https://drive.google.com/search?q=DC+Pandey+Physics+Arihant" },
  { id: "b12", title: "Irodov Advance Physics", author: "I.E. Irodov", category: "Physics", tag: "BOOK", link: "https://drive.google.com/search?q=IE+Irodov+General+Physics" },

  // --- CHEMISTRY ---
  { id: "c1", title: "Solomons Fryhle Snyder", author: "Organic Chemistry for JEE", category: "Chemistry", tag: "BOOK", link: "https://drive.google.com/search?q=Solomons+Fryhle+Snyder+Organic+Chemistry" },
  { id: "c2", title: "M.S. Chouhan Organic Chemistry", author: "M.S. Chouhan", category: "Chemistry", tag: "BOOK", link: "https://drive.google.com/search?q=MS+Chouhan+Organic+Chemistry" },
  { id: "c3", title: "VK Jaiswal Inorganic Chemistry", author: "V.K. Jaiswal", category: "Chemistry", tag: "BOOK", link: "https://drive.google.com/search?q=VK+Jaiswal+Inorganic+Chemistry" },
  { id: "c4", title: "JD Lee Inorganic Chemistry", author: "J.D. Lee", category: "Chemistry", tag: "BOOK", link: "https://drive.google.com/search?q=JD+Lee+Inorganic+Chemistry+JEE" },
  { id: "c5", title: "N. Awasthi Physical Chemistry 18th Ed", author: "N. Awasthi", category: "Chemistry", tag: "BOOK", link: "https://drive.google.com/search?q=N+Awasthi+Physical+Chemistry" },
  { id: "c6", title: "Organic Named Reactions", category: "Chemistry", tag: "NOTES", link: "https://drive.google.com/search?q=Organic+Named+Reactions+JEE" },

  // --- MATHS ---
  { id: "m1", title: "Cengage Mathematics Series (5 Books)", author: "G. Tewani", category: "Maths", tag: "BOOK", link: "https://drive.google.com/search?q=Cengage+Mathematics+Tewani" },
  { id: "m2", title: "A. Das Gupta IIT Mathematics", author: "A. Das Gupta", category: "Maths", tag: "BOOK", link: "https://drive.google.com/search?q=A+Das+Gupta+IIT+Mathematics" },
  { id: "m3", title: "IA Maron Integral Calculus", author: "I.A. Maron", category: "Maths", tag: "BOOK", link: "https://drive.google.com/search?q=IA+Maron+Calculus" },
  { id: "m4", title: "SL Loney Plane Trigonometry & Coordinate", author: "S.L. Loney", category: "Maths", tag: "BOOK", link: "https://drive.google.com/search?q=SL+Loney+Trigonometry+Coordinate" },

  // --- PCM COMBINED / MODULES ---
  { id: "p1", title: "PRAYAS JEE 2027 MODULES", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/search?q=PRAYAS+JEE+2027+Modules" },
  { id: "p2", title: "ARJUNA JEE 2026 MODULES PW", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/search?q=ARJUNA+JEE+2026+Modules" },
  { id: "p3", title: "LAKSHYA JEE 2027 MODULES", category: "PCM Combined", tag: "MODULE", link: "https://drive.google.com/search?q=LAKSHYA+JEE+2027+Modules" },
  { id: "p4", title: "Allen Score 2 & Score 2 Star Series", category: "PCM Combined", tag: "TEST", link: "https://drive.google.com/search?q=Allen+Score+2+JEE+Test+Series" },
  { id: "p5", title: "FIITJEE GMP (Grand Master Package)", category: "PCM Combined", tag: "BOOK", link: "https://drive.google.com/search?q=FIITJEE+GMP+Grand+Master+Package" },
  { id: "p6", title: "Arihant 43 Years Chapterwise Solved Papers", category: "PCM Combined", tag: "PYQ", link: "https://drive.google.com/search?q=Arihant+43+Years+JEE+Main+Advanced" },
];

export const BooksSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Physics" | "Chemistry" | "Maths" | "PCM Combined">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = JEE_BOOKS_DATA.filter((b) => {
    const catMatch = selectedCategory === "All" || b.category === selectedCategory;
    const textMatch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return catMatch && textMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl">
            <Library className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">JEE Book Library</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Explore carefully organized books, modules, and study resources for IIT JEE preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Category Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setSelectedCategory("Physics")}
          className={`cursor-pointer border rounded-2xl p-5 transition-all shadow-lg flex items-center justify-between ${
            selectedCategory === "Physics"
              ? "bg-sky-950/80 border-sky-500/60"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800"
          }`}
        >
          <div>
            <span className="text-sm font-bold text-white block">Physics Books</span>
            <span className="text-xs text-sky-400 font-semibold mt-0.5 block">25 Books Available</span>
          </div>
          <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory("Chemistry")}
          className={`cursor-pointer border rounded-2xl p-5 transition-all shadow-lg flex items-center justify-between ${
            selectedCategory === "Chemistry"
              ? "bg-purple-950/80 border-purple-500/60"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800"
          }`}
        >
          <div>
            <span className="text-sm font-bold text-white block">Chemistry Books</span>
            <span className="text-xs text-purple-400 font-semibold mt-0.5 block">19 Books Available</span>
          </div>
          <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory("Maths")}
          className={`cursor-pointer border rounded-2xl p-5 transition-all shadow-lg flex items-center justify-between ${
            selectedCategory === "Maths"
              ? "bg-emerald-950/80 border-emerald-500/60"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800"
          }`}
        >
          <div>
            <span className="text-sm font-bold text-white block">Maths Books</span>
            <span className="text-xs text-emerald-400 font-semibold mt-0.5 block">20 Books Available</span>
          </div>
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory("PCM Combined")}
          className={`cursor-pointer border rounded-2xl p-5 transition-all shadow-lg flex items-center justify-between ${
            selectedCategory === "PCM Combined"
              ? "bg-indigo-950/80 border-indigo-500/60"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800"
          }`}
        >
          <div>
            <span className="text-sm font-bold text-white block">PCM Combined</span>
            <span className="text-xs text-indigo-400 font-semibold mt-0.5 block">68 Books Available</span>
          </div>
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(["All", "Physics", "Chemistry", "Maths", "PCM Combined"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search book, name, author, or keyword..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((book) => (
          <div
            key={book.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-purple-500/50 transition-all space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                  {book.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">{book.category}</span>
              </div>

              <h3 className="text-sm font-extrabold text-white leading-snug">{book.title}</h3>
              {book.author && <p className="text-xs text-slate-400 font-medium">By {book.author}</p>}
            </div>

            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow"
            >
              <span>Open Book</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};
