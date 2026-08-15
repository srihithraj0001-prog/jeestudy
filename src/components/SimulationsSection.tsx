import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Flame,
  Sun,
  Eye,
  Atom,
  TestTube,
  Waves,
  Gauge,
  Sliders,
  Maximize2
} from "lucide-react";

type SimType =
  | "projectile"
  | "pendulum"
  | "electrostatics"
  | "optics"
  | "bohr"
  | "ydse"
  | "rlc"
  | "carnot"
  | "photoelectric"
  | "maxwell";

export const SimulationsSection: React.FC = () => {
  const [activeSim, setActiveSim] = useState<SimType>("projectile");

  // --- 1. PROJECTILE MOTION STATE ---
  const [projAngle, setProjAngle] = useState(45); // degrees
  const [projVelocity, setProjVelocity] = useState(40); // m/s
  const [projGravity, setProjGravity] = useState(9.8); // m/s2
  const [projIsRunning, setProjIsRunning] = useState(false);
  const [projTime, setProjTime] = useState(0);

  // --- 2. PENDULUM STATE ---
  const [pendLength, setPendLength] = useState(2.0); // m
  const [pendMass, setPendMass] = useState(1.0); // kg
  const [pendAngleDeg, setPendAngleDeg] = useState(30); // deg initial
  const [pendIsRunning, setPendIsRunning] = useState(true);
  const [pendTime, setPendTime] = useState(0);

  // --- 3. ELECTROSTATICS STATE ---
  const [charge1, setCharge1] = useState(5); // +5 uC
  const [charge2, setCharge2] = useState(-5); // -5 uC
  const [distCm, setDistCm] = useState(10); // 10 cm

  // --- 4. RAY OPTICS LENS STATE ---
  const [lensType, setLensType] = useState<"convex" | "concave">("convex");
  const [focalLength, setFocalLength] = useState(20); // cm
  const [objDistance, setObjDistance] = useState(35); // cm
  const [objHeight, setObjHeight] = useState(15); // cm

  // --- 5. BOHR ATOM STATE ---
  const [nInitial, setNInitial] = useState(3);
  const [nFinal, setNFinal] = useState(2);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- 6. YDSE WAVE OPTICS STATE ---
  const [ydseWavelength, setYdseWavelength] = useState(600); // nm (red/green laser)
  const [ydseSlitDist, setYdseSlitDist] = useState(0.5); // mm
  const [ydseScreenDist, setYdseScreenDist] = useState(1.5); // m

  // --- 7. RLC CIRCUIT STATE ---
  const [rlcR, setRlcR] = useState(10); // Ohms
  const [rlcL, setRlcL] = useState(100); // mH
  const [rlcC, setRlcC] = useState(10); // uF
  const [rlcFreq, setRlcFreq] = useState(160); // Hz

  // --- 8. CARNOT ENGINE STATE ---
  const [carnotTh, setCarnotTh] = useState(600); // Kelvin
  const [carnotTc, setCarnotTc] = useState(300); // Kelvin
  const [carnotVMax, setCarnotVMax] = useState(4); // L

  // --- 9. PHOTOELECTRIC EFFECT STATE ---
  const [photoWavelength, setPhotoWavelength] = useState(300); // nm (UV)
  const [photoIntensity, setPhotoIntensity] = useState(70); // %
  const [metalWorkFunc, setMetalWorkFunc] = useState(2.3); // eV (Sodium = 2.3 eV, Zinc = 4.3 eV)
  const [photoIsRunning, setPhotoIsRunning] = useState(true);

  // --- 10. MAXWELL GAS DISTRIBUTION STATE ---
  const [gasTempK, setGasTempK] = useState(300); // K
  const [gasMolMass, setGasMolMass] = useState(28); // g/mol (N2 = 28, He = 4)

  // --- CANVAS REFS ---
  const projCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const elecCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const optCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bohrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ydseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rlcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const carnotCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maxwellCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ==========================================
  // 1. PROJECTILE MOTION ANIMATION
  // ==========================================
  useEffect(() => {
    if (activeSim !== "projectile") return;

    let animFrame: number;
    const canvas = projCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rad = (projAngle * Math.PI) / 180;
    const vx = projVelocity * Math.cos(rad);
    const vy0 = projVelocity * Math.sin(rad);
    const totalT = (2 * vy0) / projGravity;

    const scale = 4; // pixels per meter
    const startX = 40;
    const startY = canvas.height - 40;

    let currentT = projTime;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid & Ground
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, startY);
      ctx.lineTo(canvas.width, startY);
      ctx.stroke();

      // Draw Ground Hatching
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, startY, canvas.width, canvas.height - startY);

      // Trajectory Path
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let t = 0; t <= totalT; t += 0.05) {
        const x = vx * t;
        const y = vy0 * t - 0.5 * projGravity * t * t;
        const px = startX + x * scale;
        const py = startY - y * scale;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Current Particle Position
      if (projIsRunning) {
        currentT += 0.03;
        if (currentT > totalT) {
          currentT = totalT;
          setProjIsRunning(false);
        }
        setProjTime(currentT);
      }

      const curX = vx * currentT;
      const curY = vy0 * currentT - 0.5 * projGravity * currentT * currentT;
      const curPx = startX + curX * scale;
      const curPy = startY - curY * scale;

      // Cannon
      ctx.save();
      ctx.translate(startX, startY);
      ctx.rotate(-rad);
      ctx.fillStyle = "#64748b";
      ctx.fillRect(-10, -8, 30, 16);
      ctx.restore();

      // Ball
      ctx.beginPath();
      ctx.arc(curPx, curPy, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Max Height & Range Markers
      const Hmax = (vy0 * vy0) / (2 * projGravity);
      const Rmax = vx * totalT;

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(`Max H: ${Hmax.toFixed(1)}m`, startX + (Rmax / 2) * scale - 20, startY - Hmax * scale - 12);
      ctx.fillText(`Range: ${Rmax.toFixed(1)}m`, startX + Rmax * scale - 25, startY + 20);

      if (projIsRunning) {
        animFrame = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [activeSim, projAngle, projVelocity, projGravity, projIsRunning, projTime]);

  // ==========================================
  // 2. PENDULUM ANIMATION
  // ==========================================
  useEffect(() => {
    if (activeSim !== "pendulum") return;

    let animFrame: number;
    const canvas = pendCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = 9.8;
    const omega = Math.sqrt(g / Math.max(0.2, pendLength)); // rad/s
    const thetaMax = (pendAngleDeg * Math.PI) / 180; // rad

    let t = pendTime;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (pendIsRunning) {
        t += 0.02;
        setPendTime(t);
      }

      const currentTheta = thetaMax * Math.cos(omega * t);

      const pivotX = canvas.width / 2;
      const pivotY = 50;
      const pixelLength = pendLength * 60; // scale

      const bobX = pivotX + pixelLength * Math.sin(currentTheta);
      const bobY = pivotY + pixelLength * Math.cos(currentTheta);

      // Support line
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pivotX - 40, pivotY);
      ctx.lineTo(pivotX + 40, pivotY);
      ctx.stroke();

      // String
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Velocity Vector arrow
      const vMagnitude = -pendLength * omega * thetaMax * Math.sin(omega * t);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vMagnitude * 20 * Math.cos(currentTheta), bobY - vMagnitude * 20 * Math.sin(currentTheta));
      ctx.stroke();

      // Bob
      const bobRadius = 12 + pendMass * 3;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ec4899";
      ctx.shadowColor = "#ec4899";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (pendIsRunning) {
        animFrame = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [activeSim, pendLength, pendMass, pendAngleDeg, pendIsRunning, pendTime]);

  // ==========================================
  // 3. ELECTROSTATICS FIELD CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "electrostatics") return;

    const canvas = elecCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const gapPixels = distCm * 15;
    const c1X = canvas.width / 2 - gapPixels / 2;
    const c2X = canvas.width / 2 + gapPixels / 2;

    // Draw field line vectors
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;

    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(c1X, centerY);
      const endX = c1X + 60 * Math.cos(rad);
      const endY = centerY + 60 * Math.sin(rad);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Charge 1
    ctx.beginPath();
    ctx.arc(c1X, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = charge1 >= 0 ? "#ef4444" : "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${charge1 > 0 ? "+" : ""}${charge1}µC`, c1X, centerY);

    // Charge 2
    ctx.beginPath();
    ctx.arc(c2X, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = charge2 >= 0 ? "#ef4444" : "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${charge2 > 0 ? "+" : ""}${charge2}µC`, c2X, centerY);

    // Distance Line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(c1X, centerY + 40);
    ctx.lineTo(c2X, centerY + 40);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "12px monospace";
    ctx.fillText(`r = ${distCm} cm`, canvas.width / 2, centerY + 55);

  }, [activeSim, charge1, charge2, distCm]);

  // ==========================================
  // 4. RAY OPTICS LENS CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "optics") return;

    const canvas = optCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const lensX = canvas.width / 2;

    // Principal Axis
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Lens representation
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (lensType === "convex") {
      ctx.ellipse(lensX, centerY, 8, 80, 0, 0, Math.PI * 2);
    } else {
      ctx.moveTo(lensX - 10, centerY - 80);
      ctx.lineTo(lensX + 10, centerY - 80);
      ctx.lineTo(lensX + 2, centerY);
      ctx.lineTo(lensX + 10, centerY + 80);
      ctx.lineTo(lensX - 10, centerY + 80);
    }
    ctx.stroke();

    // Focal Points
    const fPixels = focalLength * 3;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(lensX - fPixels, centerY, 4, 0, Math.PI * 2);
    ctx.arc(lensX + fPixels, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.fillText("F1", lensX - fPixels - 6, centerY + 15);
    ctx.fillText("F2", lensX + fPixels - 6, centerY + 15);

    // Object Arrow
    const uPixels = objDistance * 3;
    const objX = lensX - uPixels;
    const hPixels = objHeight * 2;

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, centerY - hPixels);
    ctx.stroke();

    // Object Arrowhead
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.moveTo(objX - 4, centerY - hPixels + 8);
    ctx.lineTo(objX + 4, centerY - hPixels + 8);
    ctx.lineTo(objX, centerY - hPixels);
    ctx.fill();

    // Image calculation
    const uVal = -objDistance;
    const fVal = lensType === "convex" ? focalLength : -focalLength;
    const vVal = (uVal * fVal) / (uVal + fVal);
    const m = vVal / uVal;
    const imgHeight = objHeight * m;

    const imgX = lensX + vVal * 3;
    const imgY = centerY - imgHeight * 2;

    // Draw Rays
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(objX, centerY - hPixels);
    ctx.lineTo(lensX, centerY - hPixels);
    ctx.lineTo(lensX + 250, centerY - hPixels + (250 / fPixels) * hPixels);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(objX, centerY - hPixels);
    ctx.lineTo(lensX, centerY);
    ctx.lineTo(lensX + 250, centerY + (250 / (lensX - objX)) * hPixels);
    ctx.stroke();

    if (Math.abs(imgX - lensX) < 300) {
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(imgX, centerY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
    }

  }, [activeSim, lensType, focalLength, objDistance, objHeight]);

  // ==========================================
  // 5. BOHR ATOM CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "bohr") return;

    const canvas = bohrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Nucleus
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Orbits n = 1 to 5
    for (let n = 1; n <= 5; n++) {
      const radius = n * 28;
      ctx.strokeStyle = n === nInitial || n === nFinal ? "#38bdf8" : "#334155";
      ctx.lineWidth = n === nInitial || n === nFinal ? 2 : 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#64748b";
      ctx.font = "10px sans-serif";
      ctx.fillText(`n=${n}`, centerX + radius + 4, centerY);
    }

    // Active Electron
    const electronN = isTransitioning ? nFinal : nInitial;
    const eRadius = electronN * 28;
    const eX = centerX + eRadius * Math.cos(Math.PI / 4);
    const eY = centerY - eRadius * Math.sin(Math.PI / 4);

    ctx.beginPath();
    ctx.arc(eX, eY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [activeSim, nInitial, nFinal, isTransitioning]);

  // ==========================================
  // 6. YDSE WAVE OPTICS CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "ydse") return;

    const canvas = ydseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Screen rendering on the right (width 60px)
    const screenX = w - 80;
    const slitX = 120;
    const centerY = h / 2;

    // Draw Slit Barrier
    ctx.fillStyle = "#334155";
    ctx.fillRect(slitX, 0, 10, h);

    // Slit gap scale
    const dPixels = ydseSlitDist * 40; // gap
    const slit1Y = centerY - dPixels / 2;
    const slit2Y = centerY + dPixels / 2;

    ctx.clearRect(slitX - 2, slit1Y - 3, 14, 6);
    ctx.clearRect(slitX - 2, slit2Y - 3, 14, 6);

    // Laser wavelength to color
    let laserColor = "#ef4444"; // red
    if (ydseWavelength < 450) laserColor = "#8b5cf6"; // violet
    else if (ydseWavelength < 495) laserColor = "#3b82f6"; // blue
    else if (ydseWavelength < 570) laserColor = "#10b981"; // green
    else if (ydseWavelength < 590) laserColor = "#eab308"; // yellow

    // Draw Incident Laser Beam
    ctx.strokeStyle = laserColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, centerY);
    ctx.lineTo(slitX, centerY);
    ctx.stroke();

    // Fringe width beta = (lambda * D) / d
    // lambda in m = ydseWavelength * 1e-9
    // D in m = ydseScreenDist
    // d in m = ydseSlitDist * 1e-3
    const betaMm = (ydseWavelength * 1e-6 * ydseScreenDist) / (ydseSlitDist); // mm scale factor

    // Draw Interference Fringes on Screen
    for (let y = 0; y < h; y++) {
      const distFromCenter = y - centerY;
      // Phase difference delta = (2*pi/lambda) * (d * y / D)
      const phase = (2 * Math.PI * (ydseSlitDist * 1e-3) * (distFromCenter * 0.0001)) / (ydseWavelength * 1e-9 * ydseScreenDist);
      const intensity = Math.pow(Math.cos(phase * 100), 2); // 0 to 1

      ctx.fillStyle = laserColor;
      ctx.globalAlpha = Math.min(1, Math.max(0.05, intensity));
      ctx.fillRect(screenX, y, 40, 1);
    }
    ctx.globalAlpha = 1.0;

    // Draw Screen Line
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenX, 10);
    ctx.lineTo(screenX, h - 10);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "11px monospace";
    ctx.fillText("Interference Pattern", screenX - 30, h - 15);

  }, [activeSim, ydseWavelength, ydseSlitDist, ydseScreenDist]);

  // ==========================================
  // 7. RLC RESONANCE CIRCUIT CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "rlc") return;

    const canvas = rlcCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Resonant Frequency f0 = 1 / (2 * pi * sqrt(L * C))
    const L_henry = rlcL * 1e-3;
    const C_farad = rlcC * 1e-6;
    const f0 = 1 / (2 * Math.PI * Math.sqrt(L_henry * C_farad)); // Hz

    // Draw Frequency vs Current Resonance Curve
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;

    // Axes
    const startX = 50;
    const endX = w - 30;
    const startY = h - 40;
    const topY = 40;

    ctx.beginPath();
    ctx.moveTo(startX, topY);
    ctx.lineTo(startX, startY);
    ctx.lineTo(endX, startY);
    ctx.stroke();

    // Plot I(f) Curve
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxFreq = f0 * 2.5;

    for (let px = startX; px <= endX; px++) {
      const f = ((px - startX) / (endX - startX)) * maxFreq;
      const omega = 2 * Math.PI * f;
      const XL = omega * L_henry;
      const XC = f > 0 ? 1 / (omega * C_farad) : 1e6;
      const Z = Math.sqrt(rlcR * rlcR + (XL - XC) * (XL - XC));
      const I = 100 / Z; // V = 100V peak

      const py = startY - (I / (100 / rlcR)) * (startY - topY - 20);
      if (px === startX) ctx.moveTo(px, py);
      else ctx.lineTo(px, Math.max(topY, py));
    }
    ctx.stroke();

    // Mark Current Frequency Line
    const curPx = startX + (rlcFreq / maxFreq) * (endX - startX);
    if (curPx >= startX && curPx <= endX) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(curPx, topY);
      ctx.lineTo(curPx, startY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(curPx, topY + 20, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label Resonance Point f0
    const f0Px = startX + (f0 / maxFreq) * (endX - startX);
    if (f0Px >= startX && f0Px <= endX) {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`f₀=${f0.toFixed(0)}Hz`, f0Px - 25, startY + 20);
    }

  }, [activeSim, rlcR, rlcL, rlcC, rlcFreq]);

  // ==========================================
  // 8. CARNOT ENGINE PV DIAGRAM CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "carnot") return;

    const canvas = carnotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    const startX = 60;
    const startY = h - 40;
    const endX = w - 40;
    const topY = 40;

    // Draw Axes (P vs V)
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, topY);
    ctx.lineTo(startX, startY);
    ctx.lineTo(endX, startY);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("Pressure P ➔", 10, topY);
    ctx.fillText("Volume V ➔", endX - 60, startY + 25);

    // Points of Carnot Cycle (A -> B -> C -> D)
    // A: (V1, P1 at TH)
    // B: (V2, P2 at TH)
    // C: (V3, P3 at TC)
    // D: (V4, P4 at TC)
    const pA = { x: startX + 40, y: topY + 30 };
    const pB = { x: startX + 160, y: topY + 80 };
    const pC = { x: startX + 280, y: startY - 40 };
    const pD = { x: startX + 100, y: startY - 70 };

    // Fill Work Done Area
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.lineTo(pC.x, pC.y);
    ctx.lineTo(pD.x, pD.y);
    ctx.closePath();
    ctx.fill();

    // Draw Cycle Edges
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.lineTo(pC.x, pC.y);
    ctx.lineTo(pD.x, pD.y);
    ctx.closePath();
    ctx.stroke();

    // Labels A, B, C, D
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("A (Isothermal Exp)", pA.x - 30, pA.y - 10);
    ctx.fillText("B (Adiabatic Exp)", pB.x + 10, pB.y);
    ctx.fillText("C (Isothermal Comp)", pC.x + 10, pC.y + 15);
    ctx.fillText("D (Adiabatic Comp)", pD.x - 50, pD.y + 20);

  }, [activeSim, carnotTh, carnotTc, carnotVMax]);

  // ==========================================
  // 9. PHOTOELECTRIC EFFECT CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "photoelectric") return;

    let animFrame: number;
    const canvas = photoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Photon energy E = hc/lambda
    const photonEnergyEv = 1240 / photoWavelength;
    const keMax = Math.max(0, photonEnergyEv - metalWorkFunc);

    // Particles array
    const electrons: { x: number; y: number; vx: number }[] = [];
    if (keMax > 0 && photoIsRunning) {
      for (let i = 0; i < Math.floor(photoIntensity / 10); i++) {
        electrons.push({
          x: 180 + Math.random() * 10,
          y: 80 + Math.random() * 140,
          vx: Math.sqrt(keMax) * 3 + Math.random() * 2
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Light Beam
      ctx.fillStyle = photoWavelength < 380 ? "rgba(168, 85, 247, 0.3)" : "rgba(56, 189, 248, 0.3)";
      ctx.beginPath();
      ctx.moveTo(30, 20);
      ctx.lineTo(180, 80);
      ctx.lineTo(180, 220);
      ctx.lineTo(30, 160);
      ctx.closePath();
      ctx.fill();

      // Metal Plate
      ctx.fillStyle = "#64748b";
      ctx.fillRect(180, 60, 20, 180);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("Cathode Metal", 150, 255);

      // Anode Collector Plate
      ctx.fillStyle = "#475569";
      ctx.fillRect(w - 100, 60, 20, 180);
      ctx.fillText("Anode Collector", w - 130, 255);

      // Emitted Electrons
      if (keMax > 0) {
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 6;

        electrons.forEach((e) => {
          e.x += e.vx;
          ctx.beginPath();
          ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("❌ No Photoemission (E_photon < Work Function)", 220, 150);
      }

      if (photoIsRunning) {
        animFrame = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [activeSim, photoWavelength, photoIntensity, metalWorkFunc, photoIsRunning]);

  // ==========================================
  // 10. MAXWELL-BOLTZMANN SPEED CANVAS
  // ==========================================
  useEffect(() => {
    if (activeSim !== "maxwell") return;

    const canvas = maxwellCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    const startX = 50;
    const startY = h - 40;
    const endX = w - 30;
    const topY = 40;

    // Speeds: v_mp = sqrt(2RT/M), v_avg = sqrt(8RT/piM), v_rms = sqrt(3RT/M)
    const R = 8.314;
    const M_kg = gasMolMass * 1e-3;
    const v_mp = Math.sqrt((2 * R * gasTempK) / M_kg);
    const v_avg = Math.sqrt((8 * R * gasTempK) / (Math.PI * M_kg));
    const v_rms = Math.sqrt((3 * R * gasTempK) / M_kg);

    // Maxwell Curve Plot
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxV = 2000; // m/s scale

    for (let px = startX; px <= endX; px++) {
      const v = ((px - startX) / (endX - startX)) * maxV;
      // f(v) = 4*pi * (M / 2*pi*R*T)^(3/2) * v^2 * exp(-M*v^2 / 2RT)
      const factor = Math.pow(M_kg / (2 * Math.PI * R * gasTempK), 1.5);
      const f_v = 4 * Math.PI * factor * v * v * Math.exp((-M_kg * v * v) / (2 * R * gasTempK));

      const py = startY - f_v * 1.5e5;
      if (px === startX) ctx.moveTo(px, py);
      else ctx.lineTo(px, Math.max(topY, py));
    }
    ctx.stroke();

    // Mark Speed Lines
    const drawSpeedLine = (vVal: number, color: string, label: string) => {
      const px = startX + (vVal / maxV) * (endX - startX);
      if (px >= startX && px <= endX) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(px, topY);
        ctx.lineTo(px, startY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = color;
        ctx.font = "bold 10px monospace";
        ctx.fillText(`${label}: ${vVal.toFixed(0)}m/s`, px - 30, topY + 15);
      }
    };

    drawSpeedLine(v_mp, "#ef4444", "v_mp");
    drawSpeedLine(v_avg, "#f59e0b", "v_avg");
    drawSpeedLine(v_rms, "#10b981", "v_rms");

  }, [activeSim, gasTempK, gasMolMass]);

  // Calculations for Bohr Model
  const e1 = -13.6 / (nInitial * nInitial);
  const e2 = -13.6 / (nFinal * nFinal);
  const deltaE = Math.abs(e2 - e1);
  const wavelengthNm = deltaE > 0 ? (1240 / deltaE).toFixed(1) : "0";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* SECTION HEADER */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/40 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-2xl flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Interactive Physics & Chemistry Simulation Suite (10 Real-Time Labs) 🔬
            </h2>
            <p className="text-xs text-slate-400">
              Manipulate variables in real-time, view dynamic formulas, and analyze visual concepts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Canvas Engine</span>
        </div>
      </div>

      {/* SIMULATION SELECTOR TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSim("projectile")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "projectile"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          1. Projectile
        </button>

        <button
          onClick={() => setActiveSim("pendulum")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "pendulum"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          2. Pendulum & SHM
        </button>

        <button
          onClick={() => setActiveSim("electrostatics")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "electrostatics"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          3. Electrostatics
        </button>

        <button
          onClick={() => setActiveSim("optics")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "optics"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Eye className="w-4 h-4 text-emerald-400" />
          4. Ray Optics
        </button>

        <button
          onClick={() => setActiveSim("bohr")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "bohr"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Atom className="w-4 h-4 text-purple-400" />
          5. Bohr Atom
        </button>

        <button
          onClick={() => setActiveSim("ydse")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "ydse"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Waves className="w-4 h-4 text-sky-400" />
          6. YDSE Wave Optics
        </button>

        <button
          onClick={() => setActiveSim("rlc")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "rlc"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Gauge className="w-4 h-4 text-amber-400" />
          7. Series RLC AC
        </button>

        <button
          onClick={() => setActiveSim("carnot")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "carnot"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Flame className="w-4 h-4 text-rose-400" />
          8. Carnot Engine
        </button>

        <button
          onClick={() => setActiveSim("photoelectric")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "photoelectric"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Sun className="w-4 h-4 text-yellow-400" />
          9. Photoelectric
        </button>

        <button
          onClick={() => setActiveSim("maxwell")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSim === "maxwell"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <TestTube className="w-4 h-4 text-emerald-400" />
          10. Maxwell Speed
        </button>
      </div>

      {/* ACTIVE SIMULATION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CANVAS DISPLAY (2 COLS) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Live Visualization Canvas
            </span>

            {activeSim === "projectile" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProjIsRunning(!projIsRunning)}
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  {projIsRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{projIsRunning ? "Pause" : "Fire Cannon"}</span>
                </button>
                <button
                  onClick={() => {
                    setProjIsRunning(false);
                    setProjTime(0);
                  }}
                  className="p-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 relative min-h-[320px]">
            {activeSim === "projectile" && <canvas ref={projCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "pendulum" && <canvas ref={pendCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "electrostatics" && <canvas ref={elecCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "optics" && <canvas ref={optCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "bohr" && <canvas ref={bohrCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "ydse" && <canvas ref={ydseCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "rlc" && <canvas ref={rlcCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "carnot" && <canvas ref={carnotCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "photoelectric" && <canvas ref={photoCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
            {activeSim === "maxwell" && <canvas ref={maxwellCanvasRef} width={600} height={320} className="w-full h-auto max-h-[340px]" />}
          </div>

        </div>

        {/* CONTROL SLIDERS & FORMULAS (1 COL) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Simulation Parameters</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              Live Controls
            </span>
          </h3>

          {/* PROJECTILE CONTROLS */}
          {activeSim === "projectile" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Launch Angle (θ):</span>
                  <span className="text-cyan-400 font-mono">{projAngle}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={projAngle}
                  onChange={(e) => {
                    setProjAngle(parseInt(e.target.value));
                    setProjTime(0);
                  }}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Velocity (v₀):</span>
                  <span className="text-cyan-400 font-mono">{projVelocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={projVelocity}
                  onChange={(e) => {
                    setProjVelocity(parseInt(e.target.value));
                    setProjTime(0);
                  }}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Gravity (g):</span>
                  <span className="text-cyan-400 font-mono">{projGravity} m/s²</span>
                </div>
                <select
                  value={projGravity}
                  onChange={(e) => setProjGravity(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                >
                  <option value={9.8}>Earth (9.8 m/s²)</option>
                  <option value={1.6}>Moon (1.6 m/s²)</option>
                  <option value={24.8}>Jupiter (24.8 m/s²)</option>
                </select>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-amber-400 font-bold font-sans">JEE Core Formulas:</div>
                <div>T_flight = 2 v₀ sin(θ) / g</div>
                <div>H_max = v₀² sin²(θ) / (2g)</div>
                <div>Range = v₀² sin(2θ) / g</div>
              </div>
            </div>
          )}

          {/* PENDULUM CONTROLS */}
          {activeSim === "pendulum" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Length (L):</span>
                  <span className="text-cyan-400 font-mono">{pendLength} m</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={pendLength}
                  onChange={(e) => setPendLength(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Release Angle:</span>
                  <span className="text-cyan-400 font-mono">{pendAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={pendAngleDeg}
                  onChange={(e) => setPendAngleDeg(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-amber-400 font-bold font-sans">Calculated Period (T):</div>
                <div className="text-lg font-bold text-emerald-400">
                  {(2 * Math.PI * Math.sqrt(pendLength / 9.8)).toFixed(2)}s
                </div>
                <div>T = 2π √(L / g)</div>
              </div>
            </div>
          )}

          {/* ELECTROSTATICS CONTROLS */}
          {activeSim === "electrostatics" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Charge q₁ (µC):</span>
                  <span className="text-cyan-400 font-mono">{charge1} µC</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={charge1}
                  onChange={(e) => setCharge1(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Charge q₂ (µC):</span>
                  <span className="text-cyan-400 font-mono">{charge2} µC</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={charge2}
                  onChange={(e) => setCharge2(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Distance (r):</span>
                  <span className="text-cyan-400 font-mono">{distCm} cm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={distCm}
                  onChange={(e) => setDistCm(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              {(() => {
                const k = 9e9;
                const q1C = charge1 * 1e-6;
                const q2C = charge2 * 1e-6;
                const rM = distCm * 0.01;
                const forceN = (k * Math.abs(q1C * q2C)) / (rM * rM);
                const isAttractive = (charge1 > 0 && charge2 < 0) || (charge1 < 0 && charge2 > 0);

                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 text-[11px] font-mono text-slate-300">
                    <div className="text-amber-400 font-bold font-sans">Coulomb Force F:</div>
                    <div className="text-lg font-bold text-amber-300">
                      {forceN.toFixed(2)} N
                    </div>
                    <div className={isAttractive ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                      Nature: {isAttractive ? "Attractive" : "Repulsive"}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* OPTICS CONTROLS */}
          {activeSim === "optics" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Lens Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLensType("convex")}
                    className={`py-1.5 rounded-xl font-bold border ${
                      lensType === "convex" ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    Convex
                  </button>
                  <button
                    onClick={() => setLensType("concave")}
                    className={`py-1.5 rounded-xl font-bold border ${
                      lensType === "concave" ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    Concave
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Object Distance (u):</span>
                  <span className="text-cyan-400 font-mono">{objDistance} cm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={objDistance}
                  onChange={(e) => setObjDistance(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Focal Length (f):</span>
                  <span className="text-cyan-400 font-mono">{focalLength} cm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={focalLength}
                  onChange={(e) => setFocalLength(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>
            </div>
          )}

          {/* BOHR MODEL CONTROLS */}
          {activeSim === "bohr" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Initial Orbit (n₁)</label>
                <select
                  value={nInitial}
                  onChange={(e) => setNInitial(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                >
                  <option value={2}>n = 2</option>
                  <option value={3}>n = 3</option>
                  <option value={4}>n = 4</option>
                  <option value={5}>n = 5</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Final Orbit (n₂)</label>
                <select
                  value={nFinal}
                  onChange={(e) => setNFinal(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                >
                  <option value={1}>n = 1 (Lyman Series)</option>
                  <option value={2}>n = 2 (Balmer Series)</option>
                  <option value={3}>n = 3 (Paschen Series)</option>
                </select>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-amber-400 font-bold font-sans">Photon Energy & Wavelength:</div>
                <div className="text-emerald-400 font-bold">ΔE = {deltaE.toFixed(2)} eV</div>
                <div className="text-purple-300 font-bold">λ = {wavelengthNm} nm</div>
              </div>
            </div>
          )}

          {/* YDSE CONTROLS */}
          {activeSim === "ydse" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Wavelength (λ):</span>
                  <span className="text-cyan-400 font-mono">{ydseWavelength} nm</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="700"
                  value={ydseWavelength}
                  onChange={(e) => setYdseWavelength(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Slit Distance (d):</span>
                  <span className="text-cyan-400 font-mono">{ydseSlitDist} mm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={ydseSlitDist}
                  onChange={(e) => setYdseSlitDist(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Screen Distance (D):</span>
                  <span className="text-cyan-400 font-mono">{ydseScreenDist} m</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={ydseScreenDist}
                  onChange={(e) => setYdseScreenDist(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-amber-400 font-bold font-sans">Fringe Width β:</div>
                <div className="text-lg font-bold text-sky-400">
                  {((ydseWavelength * 1e-6 * ydseScreenDist) / ydseSlitDist).toFixed(3)} mm
                </div>
                <div>β = λ D / d</div>
              </div>
            </div>
          )}

          {/* RLC CIRCUIT CONTROLS */}
          {activeSim === "rlc" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Resistance (R):</span>
                  <span className="text-cyan-400 font-mono">{rlcR} Ω</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={rlcR}
                  onChange={(e) => setRlcR(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Inductance (L):</span>
                  <span className="text-cyan-400 font-mono">{rlcL} mH</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={rlcL}
                  onChange={(e) => setRlcL(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Capacitance (C):</span>
                  <span className="text-cyan-400 font-mono">{rlcC} µF</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={rlcC}
                  onChange={(e) => setRlcC(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Frequency (f):</span>
                  <span className="text-cyan-400 font-mono">{rlcFreq} Hz</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  value={rlcFreq}
                  onChange={(e) => setRlcFreq(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              {(() => {
                const L_h = rlcL * 1e-3;
                const C_f = rlcC * 1e-6;
                const f0 = 1 / (2 * Math.PI * Math.sqrt(L_h * C_f));
                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 text-[11px] font-mono text-slate-300">
                    <div className="text-amber-400 font-bold font-sans">Resonant Freq f₀:</div>
                    <div className="text-lg font-bold text-emerald-400">{f0.toFixed(1)} Hz</div>
                    <div>f₀ = 1 / (2π √(LC))</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* CARNOT ENGINE CONTROLS */}
          {activeSim === "carnot" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Hot Reservoir (T_H):</span>
                  <span className="text-cyan-400 font-mono">{carnotTh} K</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1000"
                  value={carnotTh}
                  onChange={(e) => setCarnotTh(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Cold Reservoir (T_C):</span>
                  <span className="text-cyan-400 font-mono">{carnotTc} K</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="400"
                  value={carnotTc}
                  onChange={(e) => setCarnotTc(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="text-amber-400 font-bold font-sans">Max Carnot Efficiency η:</div>
                <div className="text-xl font-bold text-emerald-400">
                  {((1 - carnotTc / carnotTh) * 100).toFixed(1)} %
                </div>
                <div>η = 1 - T_C / T_H</div>
              </div>
            </div>
          )}

          {/* PHOTOELECTRIC CONTROLS */}
          {activeSim === "photoelectric" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Wavelength (λ):</span>
                  <span className="text-cyan-400 font-mono">{photoWavelength} nm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  value={photoWavelength}
                  onChange={(e) => setPhotoWavelength(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Metal Target</label>
                <select
                  value={metalWorkFunc}
                  onChange={(e) => setMetalWorkFunc(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                >
                  <option value={2.3}>Sodium (Φ = 2.3 eV)</option>
                  <option value={2.1}>Potassium (Φ = 2.1 eV)</option>
                  <option value={4.3}>Zinc (Φ = 4.3 eV)</option>
                  <option value={4.7}>Copper (Φ = 4.7 eV)</option>
                </select>
              </div>

              {(() => {
                const eEv = 1240 / photoWavelength;
                const ke = Math.max(0, eEv - metalWorkFunc);
                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 text-[11px] font-mono text-slate-300">
                    <div className="text-amber-400 font-bold font-sans">Max Kinetic Energy K_max:</div>
                    <div className="text-lg font-bold text-amber-300">{ke.toFixed(2)} eV</div>
                    <div>Stopping Potential V₀ = {ke.toFixed(2)} V</div>
                    <div>K_max = hν - Φ</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* MAXWELL SPEED CONTROLS */}
          {activeSim === "maxwell" && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Temperature (T):</span>
                  <span className="text-cyan-400 font-mono">{gasTempK} K</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={gasTempK}
                  onChange={(e) => setGasTempK(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Gas Species</label>
                <select
                  value={gasMolMass}
                  onChange={(e) => setGasMolMass(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                >
                  <option value={4}>Helium (M = 4 g/mol)</option>
                  <option value={28}>Nitrogen N₂ (M = 28 g/mol)</option>
                  <option value={32}>Oxygen O₂ (M = 32 g/mol)</option>
                  <option value={44}>Carbon Dioxide CO₂ (M = 44 g/mol)</option>
                </select>
              </div>

              {(() => {
                const R = 8.314;
                const M_kg = gasMolMass * 1e-3;
                const v_mp = Math.sqrt((2 * R * gasTempK) / M_kg);
                const v_avg = Math.sqrt((8 * R * gasTempK) / (Math.PI * M_kg));
                const v_rms = Math.sqrt((3 * R * gasTempK) / M_kg);

                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 text-[11px] font-mono text-slate-300">
                    <div className="text-amber-400 font-bold font-sans">Speed Ratios:</div>
                    <div className="text-rose-400 font-bold">v_mp = {v_mp.toFixed(0)} m/s</div>
                    <div className="text-amber-300 font-bold">v_avg = {v_avg.toFixed(0)} m/s</div>
                    <div className="text-emerald-400 font-bold">v_rms = {v_rms.toFixed(0)} m/s</div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
