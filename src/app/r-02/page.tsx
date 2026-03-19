"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
  navLinks,
  hero,
  marquee,
  reasons,
  jobs,
  benefits,
  daily,
  gallery,
  voices,
  faq,
  news,
  companyInfo,
  cta,
  access,
  footer as footerData,
  meta,
} from "@/data/siteData";

/* ─────────────────────────── Colors ─────────────────────────── */
const C = {
  bg: "#fafaf8",
  bgDark: "#18181b",
  accent: "#6366f1",
  accentLight: "#eef2ff",
  text: "#18181b",
  textSub: "#71717a",
  muted: "#a1a1aa",
  border: "#e4e4e7",
  white: "#ffffff",
};

/* ─────────────────────────── Image Paths ─────────────────────────── */
const IMG = {
  hero: "/keikamotsu-new-templates/images/hero-bg.webp",
  strength: (n: number) => `/keikamotsu-new-templates/images/strength-0${n}.webp`,
  jobs: "/keikamotsu-new-templates/images/jobs.webp",
  benefits: "/keikamotsu-new-templates/images/benefits.webp",
  dailyFlow: "/keikamotsu-new-templates/images/daily-flow.webp",
  vehicle: "/keikamotsu-new-templates/images/vehicle.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
  company: "/keikamotsu-new-templates/images/company.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
};

/* ─────────────────────────── Keyframes (injected once) ─────────────────────────── */
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes marqueeScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes truckDrive {
  0%   { transform: translateX(-80px); }
  100% { transform: translateX(calc(100vw + 60px)); }
}
@keyframes underlineGrow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes typeCursor {
  0%, 100% { border-right-color: ${C.accent}; }
  50%      { border-right-color: transparent; }
}
@keyframes pulseRing {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
@keyframes radialIn {
  from { opacity: 0; transform: scale(0.85) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes chevronBounce {
  0%, 100% { transform: rotate(0deg); }
  50%      { transform: rotate(180deg); }
}
`;

/* ─────────────────────────── Hooks ─────────────────────────── */

/* FadeIn observer */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* Typewriter */
function useTypewriter(texts: string[], speed = 60, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let idx = 0;
    let charIdx = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const full = texts.join("");
    const tick = () => {
      if (charIdx <= full.length) {
        setDisplay(full.slice(0, charIdx));
        charIdx++;
        timeout = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };
    tick();
    return () => clearTimeout(timeout);
  }, []);
  return { display, done };
}

/* isMobile */
function useIsMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [bp]);
  return m;
}

/* CounterNum */
function CounterNum({ end, suffix = "", prefix = "", duration = 1600 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* SalaryCountUp */
function SalaryCountUp() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "baseline", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.4rem)", color: C.accent }}>
      <CounterNum end={hero.salaryMin} prefix="" suffix="" />
      <span style={{ fontSize: "0.6em", color: C.textSub }}>万</span>
      <span style={{ color: C.muted, margin: "0 2px" }}>~</span>
      <CounterNum end={hero.salaryMax} prefix="" suffix="" />
      <span style={{ fontSize: "0.6em", color: C.textSub }}>万円</span>
    </span>
  );
}

/* ─────────────────────────── Inline SVG Icons ─────────────────────────── */
const MenuIcon = (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);
const CloseIcon = (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
const ChevronDown = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ArrowRight = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const PhoneIcon = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const StarIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const TruckIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const ClockIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const BriefcaseIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);
const GiftIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
  </svg>
);
const CameraIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
);
const UsersIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const HelpCircleIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const BellIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const BuildingIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="1" /><line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" /><line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" /><line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" /><line x1="9" y1="18" x2="15" y2="18" />
  </svg>
);
const MailIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const SendIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const MapPinIcon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

/* ─────────────────────────── Stats Data ─────────────────────────── */
const STATS = [
  { label: "月収", value: 100, suffix: "万円~", prefix: "" },
  { label: "直接契約率", value: 90, suffix: "%", prefix: "" },
  { label: "活躍年齢層", value: 60, suffix: "代まで", prefix: "20~" },
  { label: "入社祝い金", value: 5, suffix: "万円", prefix: "" },
];

/* ─────────────────────────── Benefit Icons Map ─────────────────────────── */
const benefitIcons = [
  /* 0: car icon */
  <svg key="b0" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M5 17h2m10 0h2M3 11l2-6h14l2 6M3 11v6h18v-6M3 11h18" />
    <circle cx="7.5" cy="17" r="1.5" />
    <circle cx="16.5" cy="17" r="1.5" />
  </svg>,
  /* 1: gift */
  <svg key="b1" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
  </svg>,
  /* 2: wallet */
  <svg key="b2" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 10h20" />
    <circle cx="17" cy="14" r="1" />
  </svg>,
  /* 3: home */
  <svg key="b3" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>,
  /* 4: book */
  <svg key="b4" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>,
  /* 5: smartphone */
  <svg key="b5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>,
];

/* ─────────────────────────── Decorative Pattern SVG ─────────────────────────── */
function DecorativeDots({ color = "rgba(99,102,241,0.07)", size = 400 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", pointerEvents: "none" }} fill={color}>
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * (size / 12) + size / 24}
            cy={row * (size / 12) + size / 24}
            r={2}
          />
        ))
      )}
    </svg>
  );
}

/* ─────────────────────────── Scroll to Top Button ─────────────────────────── */
function ScrollToTop({ visible }: { visible: boolean }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="ページトップへ"
      style={{
        position: "fixed",
        bottom: 90,
        right: 24,
        zIndex: 9998,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: C.white,
        color: C.accent,
        border: `1px solid ${C.border}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.3s, transform 0.3s",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

/* ─────────────────────────── Sub-Components ─────────────────────────── */

/* FadeIn wrapper */
function FadeIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.7s ${delay}s cubic-bezier(.22,1,.36,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Section heading with underline animation */
function SectionHeading({ icon, title, sub, light }: { icon: React.ReactNode; title: string; sub: string; light?: boolean }) {
  const { ref, visible } = useFadeIn();
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 56 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8, color: C.accent }}>
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{sub}</span>
      </div>
      <h2 style={{
        fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: light ? C.white : C.text,
        lineHeight: 1.4, margin: "0 0 12px",
      }}>
        {title}
      </h2>
      <div style={{
        width: 48, height: 3, background: C.accent, borderRadius: 2, margin: "0 auto",
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "center",
        transition: "transform 0.6s 0.3s cubic-bezier(.22,1,.36,1)",
      }} />
    </div>
  );
}

/* Cityscape SVG */
function CityscapeSVG() {
  return (
    <svg viewBox="0 0 1440 120" style={{ display: "block", width: "100%", height: 80 }} preserveAspectRatio="none" fill="none">
      <rect x="60" y="40" width="40" height="80" fill="rgba(255,255,255,0.06)" />
      <rect x="110" y="55" width="30" height="65" fill="rgba(255,255,255,0.04)" />
      <rect x="160" y="20" width="50" height="100" fill="rgba(255,255,255,0.07)" />
      <rect x="230" y="50" width="35" height="70" fill="rgba(255,255,255,0.05)" />
      <rect x="290" y="30" width="45" height="90" fill="rgba(255,255,255,0.06)" />
      <rect x="360" y="60" width="30" height="60" fill="rgba(255,255,255,0.04)" />
      <rect x="420" y="15" width="55" height="105" fill="rgba(255,255,255,0.08)" />
      <rect x="500" y="45" width="35" height="75" fill="rgba(255,255,255,0.05)" />
      <rect x="560" y="25" width="40" height="95" fill="rgba(255,255,255,0.06)" />
      <rect x="630" y="55" width="30" height="65" fill="rgba(255,255,255,0.04)" />
      <rect x="690" y="10" width="60" height="110" fill="rgba(255,255,255,0.07)" />
      <rect x="780" y="40" width="40" height="80" fill="rgba(255,255,255,0.05)" />
      <rect x="850" y="30" width="50" height="90" fill="rgba(255,255,255,0.06)" />
      <rect x="930" y="50" width="35" height="70" fill="rgba(255,255,255,0.04)" />
      <rect x="1000" y="20" width="45" height="100" fill="rgba(255,255,255,0.07)" />
      <rect x="1080" y="55" width="30" height="65" fill="rgba(255,255,255,0.05)" />
      <rect x="1140" y="35" width="50" height="85" fill="rgba(255,255,255,0.06)" />
      <rect x="1220" y="45" width="40" height="75" fill="rgba(255,255,255,0.04)" />
      <rect x="1300" y="15" width="55" height="105" fill="rgba(255,255,255,0.08)" />
      <rect x="1380" y="50" width="30" height="70" fill="rgba(255,255,255,0.05)" />
      {/* windows */}
      {[70,170,300,430,570,700,860,1010,1150,1310].map((x,i) => (
        <React.Fragment key={i}>
          <rect x={x} y={i%2===0?35:50} width="6" height="6" fill="rgba(255,255,200,0.15)" />
          <rect x={x+12} y={i%2===0?35:50} width="6" height="6" fill="rgba(255,255,200,0.1)" />
          <rect x={x} y={i%2===0?48:63} width="6" height="6" fill="rgba(255,255,200,0.08)" />
        </React.Fragment>
      ))}
    </svg>
  );
}

/* Truck animation SVG */
function TruckAnimation() {
  return (
    <div style={{ position: "relative", height: 50, overflow: "hidden", marginTop: 24 }}>
      {/* road line */}
      <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, height: 2, background: C.border }} />
      <div style={{
        position: "absolute", bottom: 12,
        animation: "truckDrive 8s linear infinite",
      }}>
        <svg width="60" height="36" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 60 36">
          <rect x="2" y="6" width="32" height="22" rx="2" />
          <polygon points="34,14 46,14 52,20 52,28 34,28" />
          <circle cx="14" cy="30" r="4" fill={C.accentLight} />
          <circle cx="44" cy="30" r="4" fill={C.accentLight} />
          <line x1="6" y1="14" x2="28" y2="14" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */
export default function R02Page() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { display: heroText, done: heroDone } = useTypewriter(hero.headlineParts, 55, 2000);

  /* scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close menu on scroll */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [menuOpen]);

  /* form state */
  const [form, setForm] = useState({ name: "", kana: "", phone: "", email: "", age: "", area: "", message: "" });
  const updateForm = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const sectionNavItems = [
    { href: "#hero", label: "TOP" },
    { href: "#reasons", label: "選ばれる理由" },
    { href: "#jobs", label: "求人情報" },
    { href: "#benefits", label: "待遇" },
    { href: "#daily", label: "1日の流れ" },
    { href: "#gallery", label: "雰囲気" },
    { href: "#voices", label: "先輩の声" },
    { href: "#faq", label: "FAQ" },
    { href: "#news", label: "お知らせ" },
    { href: "#company", label: "会社概要" },
    { href: "#apply", label: "応募" },
  ];

  /* ─────── render ─────── */
  return (
    <>
      {/* injected keyframes */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* scroll-snap container */}
      <div style={{
        scrollSnapType: "y proximity",
        overflowY: "auto",
        background: C.bg,
        color: C.text,
        fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif",
        lineHeight: 1.8,
      }}>

        {/* ───── PROGRESS BAR (left edge) ───── */}
        <div style={{
          position: "fixed", top: 0, left: 0, zIndex: 9998,
          width: 4, height: "100vh",
          background: C.border,
        }}>
          <div style={{
            width: "100%",
            height: `${scrollProgress * 100}%`,
            background: `linear-gradient(to bottom, ${C.accent}, #a78bfa)`,
            borderRadius: "0 0 2px 2px",
            transition: "height 0.1s linear",
          }} />
        </div>

        {/* ───── FLOATING NAV BUTTON ───── */}
        <button
          onClick={() => setMenuOpen(p => !p)}
          aria-label="ナビゲーション"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            width: 56, height: 56, borderRadius: "50%",
            background: C.accent, color: C.white, border: "none",
            cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.25s",
            transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          {menuOpen ? CloseIcon : MenuIcon}
        </button>

        {/* pulse ring behind button */}
        {!menuOpen && (
          <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9997,
            width: 56, height: 56, borderRadius: "50%",
            border: `2px solid ${C.accent}`,
            animation: "pulseRing 2s ease-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* scroll to top */}
        <ScrollToTop visible={scrollProgress > 0.15} />

        {/* ───── NAV OVERLAY ───── */}
        {menuOpen && (
          <>
            {/* backdrop */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 9990,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                animation: "fadeIn 0.25s ease",
              }}
            />
            {/* card */}
            <div style={{
              position: "fixed", bottom: 96, right: 24, zIndex: 9995,
              width: isMobile ? "calc(100vw - 48px)" : 320,
              maxHeight: "70vh", overflowY: "auto",
              background: C.white, borderRadius: 16,
              boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
              padding: "20px 0",
              animation: "radialIn 0.3s ease",
            }}>
              <div style={{ padding: "0 20px 12px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{company.name}</span>
              </div>
              {sectionNavItems.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 20px", textDecoration: "none",
                    color: C.text, fontSize: 14, fontWeight: 500,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent }}>
                    {i + 1}
                  </span>
                  {item.label}
                </a>
              ))}
              <div style={{ padding: "12px 20px 4px", borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
                <a href={`tel:${company.phone}`} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  color: C.accent, textDecoration: "none", fontWeight: 600, fontSize: 14,
                }}>
                  {PhoneIcon} {company.phone}
                </a>
              </div>
            </div>
          </>
        )}

        {/* ═══════════ SECTION 1: HERO ═══════════ */}
        <section id="hero" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* bg image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.hero})`,
            backgroundSize: "cover", backgroundPosition: "center",
            filter: "brightness(0.55)",
          }} />
          {/* gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(24,24,27,0.5) 100%)",
          }} />

          {/* decorative dot pattern - top right */}
          <div style={{ position: "absolute", top: -40, right: -40, zIndex: 1, opacity: 0.5 }}>
            <DecorativeDots color="rgba(255,255,255,0.04)" size={300} />
          </div>
          {/* decorative dot pattern - bottom left */}
          <div style={{ position: "absolute", bottom: -60, left: -60, zIndex: 1, opacity: 0.4 }}>
            <DecorativeDots color="rgba(255,255,255,0.03)" size={250} />
          </div>

          {/* scroll indicator at bottom */}
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2 }}>SCROLL</span>
            <div style={{
              width: 1, height: 40,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            }} />
          </div>

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720, padding: "0 24px" }}>
            {/* badges */}
            <FadeIn delay={0.1}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {hero.badges.map((b, i) => (
                  <span key={i} style={{
                    padding: "6px 16px", borderRadius: 999,
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                    color: C.white, fontSize: 13, fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>{b}</span>
                ))}
              </div>
            </FadeIn>

            {/* typewriter headline */}
            <h1 style={{
              fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 900, color: C.white,
              lineHeight: 1.35, marginBottom: 16, minHeight: "3em",
              borderRight: heroDone ? "none" : `3px solid ${C.accent}`,
              display: "inline-block", paddingRight: 4,
              animation: heroDone ? "none" : "typeCursor 0.7s step-end infinite",
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}>
              {heroText}
            </h1>

            {/* salary */}
            <FadeIn delay={0.4}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                background: "rgba(255,255,255,0.95)", borderRadius: 12,
                padding: "12px 28px", marginBottom: 20,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}>
                <span style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>月収</span>
                <SalaryCountUp />
              </div>
            </FadeIn>

            {/* subtext */}
            <FadeIn delay={0.55}>
              <div style={{ marginBottom: 32 }}>
                {hero.subtext.map((line, i) => (
                  <p key={i} style={{
                    color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "6px 0",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}>{line}</p>
                ))}
              </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.7}>
              <a href="#apply" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 40px", borderRadius: 999,
                background: C.accent, color: C.white, textDecoration: "none",
                fontWeight: 700, fontSize: 16,
                boxShadow: "0 4px 24px rgba(99,102,241,0.5)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.5)"; }}
              >
                {hero.cta} {ArrowRight}
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════ SECTION 2: MARQUEE STRIP ═══════════ */}
        <div style={{
          background: C.accent, overflow: "hidden",
          position: "relative", padding: "4px 0",
        }}>
          {/* row 1: left-to-right */}
          <div style={{
            height: 28, display: "flex", alignItems: "center",
            overflow: "hidden", marginBottom: 2,
          }}>
            <div style={{
              display: "flex", whiteSpace: "nowrap",
              animation: "marqueeScroll 25s linear infinite",
            }}>
              {[...marquee.top, ...marquee.top, ...marquee.top, ...marquee.top].map((t, i) => (
                <span key={`top-${i}`} style={{
                  padding: "0 28px", fontSize: 13, fontWeight: 700,
                  color: C.white, letterSpacing: 1,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {/* row 2: right-to-left (reverse) */}
          <div style={{
            height: 28, display: "flex", alignItems: "center",
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex", whiteSpace: "nowrap",
              animation: "marqueeScroll 30s linear infinite reverse",
            }}>
              {[...marquee.bottom, ...marquee.bottom, ...marquee.bottom, ...marquee.bottom].map((t, i) => (
                <span key={`btm-${i}`} style={{
                  padding: "0 28px", fontSize: 13, fontWeight: 600,
                  color: "rgba(255,255,255,0.75)", letterSpacing: 1,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ STATS STRIP ═══════════ */}
        <div style={{
          padding: isMobile ? "40px 24px" : "56px 60px",
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: isMobile ? 24 : 40,
          }}>
            {STATS.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  textAlign: "center",
                  padding: "16px 0",
                  position: "relative",
                }}>
                  {/* decorative top line */}
                  <div style={{
                    width: 32,
                    height: 3,
                    background: C.accent,
                    borderRadius: 2,
                    margin: "0 auto 16px",
                    opacity: 0.5,
                  }} />
                  <div style={{
                    fontSize: "clamp(1.4rem,4vw,2.2rem)",
                    fontWeight: 900,
                    color: C.accent,
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}>
                    {stat.prefix && (
                      <span style={{ fontSize: "0.6em", color: C.textSub }}>{stat.prefix}</span>
                    )}
                    <CounterNum end={stat.value} suffix="" />
                    <span style={{ fontSize: "0.5em", color: C.textSub, marginLeft: 2 }}>{stat.suffix}</span>
                  </div>
                  <span style={{
                    fontSize: 12,
                    color: C.muted,
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}>
                    {stat.label}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* ═══════════ SECTION 3: REASONS ═══════════ */}
        <section id="reasons" style={{ minHeight: "100vh", scrollSnapAlign: "start", padding: "100px 0" }}>
          <SectionHeading icon={StarIcon} title="選ばれる理由" sub="REASONS" />

          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {reasons.map((r, i) => (
              <FadeIn key={i} delay={i * 0.12} style={{ marginBottom: i < reasons.length - 1 ? 2 : 0 }}>
                <div style={{
                  position: "relative", width: "100%",
                  minHeight: isMobile ? 320 : 400, overflow: "hidden",
                  borderRadius: 0,
                }}>
                  {/* full-width image bg */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${IMG.strength(i + 1)})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    filter: "brightness(0.45)",
                  }} />

                  {/* large number overlay */}
                  <div style={{
                    position: "absolute", top: isMobile ? 16 : 24, right: isMobile ? 16 : 40,
                    fontSize: "clamp(5rem,15vw,12rem)", fontWeight: 900, color: "rgba(255,255,255,0.08)",
                    lineHeight: 1, userSelect: "none",
                  }}>
                    {r.num}
                  </div>

                  {/* text overlaid on bottom with gradient */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                    padding: isMobile ? "80px 24px 32px" : "120px 60px 48px",
                  }}>
                    <span style={{
                      display: "inline-block", fontSize: 13, fontWeight: 700,
                      color: C.accent, background: "rgba(99,102,241,0.15)",
                      padding: "4px 12px", borderRadius: 4, marginBottom: 12,
                    }}>
                      REASON {r.num}
                    </span>
                    <h3 style={{
                      fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 800,
                      color: C.white, marginBottom: 12, lineHeight: 1.4,
                    }}>
                      {r.title}
                    </h3>
                    <p style={{
                      color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.9,
                      maxWidth: 600, whiteSpace: "pre-line",
                    }}>
                      {r.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══════════ SECTION 4: JOBS ═══════════ */}
        <section id="jobs" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          display: "flex", flexDirection: isMobile ? "column" : "row",
        }}>
          {/* left: image */}
          <div style={{
            flex: isMobile ? "none" : "0 0 50%",
            minHeight: isMobile ? 300 : "100vh",
            backgroundImage: `url(${IMG.jobs})`,
            backgroundSize: "cover", backgroundPosition: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(0,0,0,0.2))",
            }} />
          </div>

          {/* right: details */}
          <div style={{
            flex: 1, padding: isMobile ? "48px 24px" : "80px 60px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            background: C.white,
          }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, color: C.accent }}>
                {BriefcaseIcon}
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>JOB INFO</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, marginBottom: 16 }}>求人情報</h2>
              <div style={{ width: 40, height: 3, background: C.accent, borderRadius: 2, marginBottom: 24 }} />
            </FadeIn>

            <FadeIn delay={0.1}>
              <p style={{ color: C.textSub, fontSize: 14, lineHeight: 1.9, marginBottom: 32, whiteSpace: "pre-line" }}>
                {jobs.intro}
              </p>
            </FadeIn>

            {/* salary counter */}
            <FadeIn delay={0.15}>
              <div style={{
                background: C.accentLight, borderRadius: 12, padding: "20px 24px",
                marginBottom: 32, textAlign: "center",
                border: `1px solid rgba(99,102,241,0.1)`,
              }}>
                <span style={{ fontSize: 13, color: C.textSub, fontWeight: 600, display: "block", marginBottom: 8 }}>月収</span>
                <SalaryCountUp />
              </div>
            </FadeIn>

            {/* job details table */}
            <FadeIn delay={0.2}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
                <tbody>
                  {jobs.rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{
                        padding: "14px 16px", fontWeight: 700, fontSize: 13,
                        color: C.accent, whiteSpace: "nowrap", verticalAlign: "top",
                        width: isMobile ? 80 : 120, background: C.accentLight,
                      }}>{row.dt}</td>
                      <td style={{
                        padding: "14px 16px", fontSize: 14, color: C.text,
                        fontWeight: row.accent ? 700 : 400,
                      }}>{row.dd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>

            {/* requirements */}
            <FadeIn delay={0.3}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {jobs.requirements.map((r, i) => (
                  <span key={i} style={{
                    padding: "6px 14px", borderRadius: 6,
                    background: C.bg, border: `1px solid ${C.border}`,
                    fontSize: 13, color: C.textSub, fontWeight: 500,
                  }}>{r}</span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════ SECTION 5: BENEFITS ═══════════ */}
        <section id="benefits" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          background: C.bgDark, position: "relative",
          padding: isMobile ? "80px 24px" : "100px 60px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* faded bg image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.benefits})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.06,
          }} />

          <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
            <SectionHeading icon={GiftIcon} title="待遇・福利厚生" sub="BENEFITS" light />

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 20,
            }}>
              {benefits.map((b, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.06)", borderRadius: 14,
                      padding: 28, border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                      transition: "background 0.25s, transform 0.25s",
                      cursor: "default", height: "100%",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "rgba(99,102,241,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#a78bfa", marginBottom: 16,
                    }}>
                      {benefitIcons[i] || GiftIcon}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 10 }}>{b.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{b.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 6: DAILY SCHEDULE ═══════════ */}
        <section id="daily" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          padding: 0,
        }}>
          {/* daily-flow banner */}
          <div style={{
            height: isMobile ? 200 : 320,
            backgroundImage: `url(${IMG.dailyFlow})`,
            backgroundSize: "cover", backgroundPosition: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(250,250,248,1))",
            }} />
          </div>

          <div style={{ maxWidth: 800, margin: "-60px auto 0", padding: "0 24px 80px", position: "relative", zIndex: 2 }}>
            <SectionHeading icon={ClockIcon} title="1日の流れ" sub="DAILY SCHEDULE" />

            <FadeIn>
              <p style={{ textAlign: "center", color: C.textSub, fontSize: 14, marginBottom: 48, marginTop: -32, whiteSpace: "pre-line" }}>
                {daily.intro}
              </p>
            </FadeIn>

            {/* vertical timeline */}
            <div style={{ position: "relative", paddingLeft: 40 }}>
              {/* connecting line */}
              <div style={{
                position: "absolute", left: 15, top: 8, bottom: 8,
                width: 2, background: `linear-gradient(to bottom, ${C.accent}, #a78bfa)`,
                borderRadius: 1,
              }} />

              {daily.steps.map((s, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div style={{ position: "relative", marginBottom: 36 }}>
                    {/* dot */}
                    <div style={{
                      position: "absolute", left: -32, top: 4,
                      width: 14, height: 14, borderRadius: "50%",
                      background: C.accent, border: `3px solid ${C.bg}`,
                      boxShadow: `0 0 0 3px rgba(99,102,241,0.2)`,
                    }} />
                    {/* time */}
                    <span style={{
                      display: "inline-block", fontSize: 13, fontWeight: 700,
                      color: C.accent, background: C.accentLight,
                      padding: "3px 10px", borderRadius: 4, marginBottom: 6,
                    }}>
                      {s.time}
                    </span>
                    <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.text }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8 }}>
                      {s.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ MID-PAGE CTA BANNER ═══════════ */}
        <div style={{
          background: `linear-gradient(135deg, ${C.accent}, #8b5cf6)`,
          padding: isMobile ? "40px 24px" : "48px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* decorative circles */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40,
            width: 150, height: 150, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }} />

          <FadeIn>
            <h3 style={{
              fontSize: "clamp(1.2rem,3vw,1.6rem)",
              fontWeight: 800,
              color: C.white,
              marginBottom: 8,
              position: "relative",
            }}>
              あなたも一緒に、始めてみませんか？
            </h3>
            <p style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 24,
              position: "relative",
            }}>
              未経験でも、車がなくても大丈夫。まずはお気軽にご相談ください。
            </p>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              position: "relative",
            }}>
              <a href="#apply" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 32px", borderRadius: 999,
                background: C.white, color: C.accent,
                textDecoration: "none", fontWeight: 700, fontSize: 14,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {SendIcon} Webから応募する
              </a>
              <a href={`tel:${company.phone}`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 32px", borderRadius: 999,
                background: "rgba(255,255,255,0.15)", color: C.white,
                textDecoration: "none", fontWeight: 600, fontSize: 14,
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                {PhoneIcon} {company.phone}
              </a>
            </div>
          </FadeIn>
        </div>

        {/* ═══════════ SECTION 7: GALLERY ═══════════ */}
        <section id="gallery" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          padding: isMobile ? "80px 24px" : "100px 60px",
          background: C.bg,
        }}>
          <SectionHeading icon={CameraIcon} title="職場の雰囲気" sub="GALLERY" />

          <FadeIn>
            <p style={{ textAlign: "center", color: C.textSub, fontSize: 14, marginBottom: 48, marginTop: -32 }}>
              {gallery.intro}
            </p>
          </FadeIn>

          {/* 3-col masonry grid */}
          <div style={{
            maxWidth: 1100, margin: "0 auto",
            columnCount: isMobile ? 1 : 3,
            columnGap: 16,
          }}>
            {gallery.images.map((img, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  breakInside: "avoid", marginBottom: 16,
                  borderRadius: 14, overflow: "hidden",
                  background: C.white,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      style={{
                        width: "100%", display: "block",
                        height: i % 3 === 0 ? 280 : i % 3 === 1 ? 220 : 250,
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(.22,1,.36,1)",
                      }}
                    />
                    {/* overlay on hover */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(to top, rgba(99,102,241,0.3), transparent)`,
                      opacity: 0,
                      transition: "opacity 0.3s",
                      pointerEvents: "none",
                    }} />
                    {/* category badge */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(4px)",
                      color: C.white,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {img.alt}
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 13, color: C.textSub, margin: 0, lineHeight: 1.6 }}>{img.caption}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══════════ SECTION 8: VOICES ═══════════ */}
        <section id="voices" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          padding: isMobile ? "80px 0" : "100px 0",
          background: C.accentLight,
        }}>
          <div style={{ padding: "0 24px" }}>
            <SectionHeading icon={UsersIcon} title="先輩の声" sub="VOICES" />
          </div>

          {/* horizontal scrollable */}
          <div style={{
            overflowX: "auto", WebkitOverflowScrolling: "touch",
            padding: "0 24px 24px",
            display: "flex", gap: 20,
            scrollSnapType: "x mandatory",
          }}>
            {voices.map((v, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  flexShrink: 0,
                  width: isMobile ? "85vw" : 340,
                  scrollSnapAlign: "center",
                  background: C.white, borderRadius: 18,
                  padding: "28px 24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  position: "relative",
                }}>
                  {/* speech bubble tail */}
                  <div style={{
                    position: "absolute", bottom: -10, left: 32,
                    width: 0, height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: `10px solid ${C.white}`,
                  }} />

                  {/* header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: C.accent, color: C.white,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 16,
                    }}>
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{v.name}({v.age})</div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{v.prev}</div>
                    </div>
                  </div>

                  {/* quote */}
                  <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9, whiteSpace: "pre-line", marginBottom: 16 }}>
                    {v.text}
                  </p>

                  {/* highlight */}
                  <div style={{
                    background: C.accentLight, borderRadius: 8,
                    padding: "8px 14px", fontSize: 13, fontWeight: 700,
                    color: C.accent, border: `1px solid rgba(99,102,241,0.15)`,
                  }}>
                    {v.highlight}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══════════ SECTION 9: FAQ ═══════════ */}
        <section id="faq" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          padding: isMobile ? "80px 24px" : "100px 60px",
          background: C.white,
        }}>
          <SectionHeading icon={HelpCircleIcon} title="よくある質問" sub="FAQ" />

          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {faq.map((f, i) => {
              const isOpen = faqOpen === i;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div style={{
                    borderBottom: `1px solid ${C.border}`,
                    marginBottom: 0,
                  }}>
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : i)}
                      style={{
                        width: "100%", textAlign: "left", background: "none", border: "none",
                        padding: "20px 0", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <span style={{
                        display: "flex", alignItems: "center", gap: 12,
                        fontSize: 15, fontWeight: 600, color: C.text,
                      }}>
                        <span style={{
                          flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                          background: C.accentLight, color: C.accent,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 13,
                        }}>Q</span>
                        {f.q}
                      </span>
                      <span style={{
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        color: C.muted,
                      }}>
                        {ChevronDown}
                      </span>
                    </button>

                    <div style={{
                      maxHeight: isOpen ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(.22,1,.36,1)",
                    }}>
                      <div style={{
                        padding: "0 0 20px 40px",
                        fontSize: 14, color: C.textSub, lineHeight: 1.9,
                        whiteSpace: "pre-line",
                      }}>
                        {f.a}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* ═══════════ SECTION 10: NEWS ═══════════ */}
        <section id="news" style={{
          minHeight: "auto", scrollSnapAlign: "start",
          padding: isMobile ? "80px 24px" : "100px 60px",
          background: C.bg,
        }}>
          <SectionHeading icon={BellIcon} title="お知らせ" sub="NEWS" />

          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {news.map((n, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{
                  display: "flex", alignItems: isMobile ? "flex-start" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 8 : 16,
                  padding: "20px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, color: C.muted, fontWeight: 500, minWidth: 90 }}>{n.date}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                      background: n.tagStyle === "urgent" ? "#fef2f2" : n.tagStyle === "new" ? C.accentLight : "#f4f4f5",
                      color: n.tagStyle === "urgent" ? "#ef4444" : n.tagStyle === "new" ? C.accent : C.textSub,
                      border: `1px solid ${n.tagStyle === "urgent" ? "#fecaca" : n.tagStyle === "new" ? "rgba(99,102,241,0.2)" : C.border}`,
                    }}>
                      {n.tag}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{n.title}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══════════ SECTION 11: COMPANY ═══════════ */}
        <section id="company" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* company.webp bg */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.company})`,
            backgroundSize: "cover", backgroundPosition: "center",
          }} />
          {/* dark overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(24,24,27,0.85)",
          }} />

          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 800, padding: isMobile ? "80px 24px" : "100px 60px" }}>
            <SectionHeading icon={BuildingIcon} title="会社概要" sub="COMPANY" light />

            <FadeIn>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {companyInfo.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <td style={{
                        padding: "16px 20px", fontWeight: 700, fontSize: 14,
                        color: "#a78bfa", whiteSpace: "nowrap", verticalAlign: "top",
                        width: isMobile ? 80 : 130,
                      }}>{row.dt}</td>
                      <td style={{
                        padding: "16px 20px", fontSize: 14, color: "rgba(255,255,255,0.85)",
                      }}>{row.dd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>

            {/* access info */}
            <FadeIn delay={0.15}>
              <div style={{
                marginTop: 40,
                padding: "24px 20px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  color: "rgba(255,255,255,0.6)", fontSize: 14,
                  marginBottom: 8,
                }}>
                  {MapPinIcon}
                  <span style={{ fontWeight: 600 }}>{access.nearestStation}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, paddingLeft: 30, marginBottom: 0 }}>
                  {access.mapNote}
                </p>
              </div>
            </FadeIn>

            {/* recruitment areas */}
            <FadeIn delay={0.25}>
              <div style={{ marginTop: 32 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  color: "#a78bfa", fontSize: 13, fontWeight: 600,
                  marginBottom: 16, letterSpacing: 1,
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  対応エリア
                </div>
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 8,
                }}>
                  {["大阪", "東京", "兵庫", "鳥取", "島根", "沖縄"].map((area, i) => (
                    <span key={i} style={{
                      padding: "6px 16px",
                      borderRadius: 6,
                      background: "rgba(99,102,241,0.12)",
                      color: "#a78bfa",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════ SECTION 12: APPLY FORM ═══════════ */}
        <section id="apply" style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          display: "flex", flexDirection: isMobile ? "column" : "row",
        }}>
          {/* left: vehicle.webp */}
          <div style={{
            flex: isMobile ? "none" : "0 0 45%",
            minHeight: isMobile ? 240 : "auto",
            backgroundImage: `url(${IMG.vehicle})`,
            backgroundSize: "cover", backgroundPosition: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(0,0,0,0.3))",
            }} />
            <div style={{
              position: "absolute", bottom: isMobile ? 20 : 60, left: isMobile ? 20 : 40,
              zIndex: 2,
            }}>
              <h3 style={{
                fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 800, color: C.white,
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
                応募・お問い合わせ
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 8 }}>
                まずはお気軽にご連絡ください
              </p>
            </div>
          </div>

          {/* right: form */}
          <div style={{
            flex: 1, padding: isMobile ? "48px 24px" : "60px 48px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            background: C.white,
          }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, color: C.accent }}>
                {MailIcon}
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>APPLY</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 800, marginBottom: 8 }}>応募フォーム</h2>
              <div style={{ width: 40, height: 3, background: C.accent, borderRadius: 2, marginBottom: 32 }} />
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* name */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    お名前 <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>
                  </label>
                  <input
                    placeholder="例：山田 太郎"
                    value={form.name}
                    onChange={e => updateForm("name", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, fontSize: 14,
                      outline: "none", transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = C.accent}
                    onBlur={e => e.currentTarget.style.borderColor = C.border}
                  />
                </div>

                {/* kana */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    フリガナ <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>
                  </label>
                  <input
                    placeholder="例：ヤマダ タロウ"
                    value={form.kana}
                    onChange={e => updateForm("kana", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, fontSize: 14,
                      outline: "none", transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = C.accent}
                    onBlur={e => e.currentTarget.style.borderColor = C.border}
                  />
                </div>

                {/* phone */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    電話番号 <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>
                  </label>
                  <input
                    placeholder="例：090-1234-5678"
                    type="tel"
                    value={form.phone}
                    onChange={e => updateForm("phone", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, fontSize: 14,
                      outline: "none", transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = C.accent}
                    onBlur={e => e.currentTarget.style.borderColor = C.border}
                  />
                </div>

                {/* email */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    メールアドレス
                  </label>
                  <input
                    placeholder="例：yamada@example.com"
                    type="email"
                    value={form.email}
                    onChange={e => updateForm("email", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, fontSize: 14,
                      outline: "none", transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = C.accent}
                    onBlur={e => e.currentTarget.style.borderColor = C.border}
                  />
                </div>

                {/* age */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    年齢
                  </label>
                  <input
                    placeholder="例：35"
                    value={form.age}
                    onChange={e => updateForm("age", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, fontSize: 14,
                      outline: "none", transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = C.accent}
                    onBlur={e => e.currentTarget.style.borderColor = C.border}
                  />
                </div>

                {/* area */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    希望エリア
                  </label>
                  <select
                    value={form.area}
                    onChange={e => updateForm("area", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, fontSize: 14,
                      outline: "none", background: C.white,
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">例：大阪</option>
                    <option value="大阪">大阪</option>
                    <option value="東京">東京</option>
                    <option value="兵庫">兵庫</option>
                    <option value="鳥取">鳥取</option>
                    <option value="島根">島根</option>
                    <option value="沖縄">沖縄</option>
                  </select>
                </div>
              </div>

              {/* message */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                  メッセージ・ご質問
                </label>
                <textarea
                  placeholder="例：週3日から始めたいのですが可能ですか？"
                  value={form.message}
                  onChange={e => updateForm("message", e.target.value)}
                  rows={4}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 8,
                    border: `1px solid ${C.border}`, fontSize: 14,
                    outline: "none", resize: "vertical",
                    fontFamily: "inherit", lineHeight: 1.7,
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = C.accent}
                  onBlur={e => e.currentTarget.style.borderColor = C.border}
                />
              </div>

              {/* submit */}
              <button style={{
                width: "100%", padding: "16px 0", borderRadius: 10,
                background: C.accent, color: C.white, border: "none",
                fontWeight: 700, fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}
              >
                {SendIcon} 応募する
              </button>

              {/* phone info */}
              <div style={{
                textAlign: "center", marginTop: 20, fontSize: 13, color: C.textSub,
              }}>
                お電話でもお気軽にどうぞ
                <a href={`tel:${company.phone}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  color: C.accent, textDecoration: "none", fontWeight: 700,
                  fontSize: 18, marginTop: 6,
                }}>
                  {PhoneIcon} {company.phone}
                </a>
                <span style={{ fontSize: 12, color: C.muted }}>{company.hours}</span>
              </div>
            </FadeIn>

            {/* truck animation */}
            <TruckAnimation />
          </div>
        </section>

        {/* ═══════════ SECTION 13: CTA ═══════════ */}
        <section style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* delivery.webp bg */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.delivery})`,
            backgroundSize: "cover", backgroundPosition: "center",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(24,24,27,0.5)",
          }} />

          <FadeIn>
            <div style={{
              position: "relative", zIndex: 2,
              maxWidth: 600, margin: "0 auto", padding: isMobile ? "48px 24px" : "56px 48px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.18)",
              textAlign: "center",
            }}>
              <h2 style={{
                fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                color: C.white, lineHeight: 1.6, marginBottom: 20,
                whiteSpace: "pre-line",
              }}>
                {cta.heading}
              </h2>
              <p style={{
                color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.9,
                marginBottom: 32, whiteSpace: "pre-line",
              }}>
                {cta.subtext}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
                <a href="#apply" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 40px", borderRadius: 999,
                  background: C.accent, color: C.white, textDecoration: "none",
                  fontWeight: 700, fontSize: 15,
                  boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {MailIcon} {cta.webLabel}
                </a>

                <a href={`tel:${cta.phone}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 32px", borderRadius: 999,
                  background: "rgba(255,255,255,0.15)", color: C.white,
                  textDecoration: "none", fontWeight: 600, fontSize: 15,
                  border: "1px solid rgba(255,255,255,0.25)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                >
                  {PhoneIcon} {cta.phone}
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ═══════════ SECTION 14: FOOTER ═══════════ */}
        <footer style={{
          position: "relative", overflow: "hidden",
          scrollSnapAlign: "end",
        }}>
          {/* footer-bg.webp */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.footerBg})`,
            backgroundSize: "cover", backgroundPosition: "center",
          }} />
          {/* dark overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(24,24,27,0.92)",
          }} />

          <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "60px 24px 0" : "80px 60px 0" }}>
            {/* decorative accent line */}
            <div style={{
              width: 60,
              height: 3,
              background: `linear-gradient(to right, ${C.accent}, #a78bfa)`,
              borderRadius: 2,
              margin: "0 auto 40px",
            }} />

            {/* catchphrase in Zen Kurenaido */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontSize: "clamp(1rem,2.5vw,1.4rem)",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {footerData.catchphrase}
              </p>
              {/* subtle subline */}
              <p style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: 3,
                marginTop: 12,
                textTransform: "uppercase",
              }}>
                {company.nameEn}
              </p>
            </div>

            {/* footer grid: 3 columns on desktop */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              gap: isMobile ? 32 : 48,
              marginBottom: 48,
              textAlign: isMobile ? "center" : "left",
            }}>
              {/* col 1: company info */}
              <div>
                <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  letterSpacing: 2,
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}>
                  Company
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 12 }}>
                  {company.name}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 2 }}>
                  <p style={{ margin: "2px 0", display: "flex", alignItems: isMobile ? "center" : "flex-start", gap: 6, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {company.address}
                  </p>
                  <p style={{ margin: "2px 0", display: "flex", alignItems: "center", gap: 6, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {company.phone}
                  </p>
                  <p style={{ margin: "2px 0", display: "flex", alignItems: "center", gap: 6, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {company.hours}
                  </p>
                </div>
              </div>

              {/* col 2: site links */}
              <div>
                <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  letterSpacing: 2,
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}>
                  Navigation
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px 16px",
                }}>
                  {navLinks.map((link, i) => (
                    <a key={i} href={link.href} style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      padding: "5px 0",
                      transition: "color 0.2s",
                      display: "block",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = C.white}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* col 3: quick apply CTA */}
              <div>
                <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  letterSpacing: 2,
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}>
                  Contact
                </div>
                <p style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 20,
                  lineHeight: 1.8,
                }}>
                  お気軽にお問い合わせください。
                  <br />
                  電話・Webどちらからでもご応募いただけます。
                </p>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: isMobile ? "center" : "flex-start",
                }}>
                  <a href="#apply" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 8,
                    background: C.accent,
                    color: C.white,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 13,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {MailIcon}
                    <span>Webから応募</span>
                  </a>
                  <a href={`tel:${company.phone}`} style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 13,
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  >
                    {PhoneIcon}
                    <span>電話で問い合わせ</span>
                  </a>
                </div>
              </div>
            </div>

            {/* divider */}
            <div style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 0,
            }} />
          </div>

          {/* cityscape SVG */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <CityscapeSVG />
          </div>

          {/* copyright bar */}
          <div style={{
            position: "relative", zIndex: 2,
            background: "rgba(0,0,0,0.3)",
            padding: "14px 24px",
            textAlign: "center",
            fontSize: 11, color: "rgba(255,255,255,0.35)",
          }}>
            &copy; {new Date().getFullYear()} {company.name} All rights reserved.
          </div>
        </footer>

      </div>
    </>
  );
}
