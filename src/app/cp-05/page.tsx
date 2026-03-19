"use client";

import React, { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import {
  company,
  meta,
  navLinks,
  hero,
  services,
  strengths,
  ceoMessage,
  companyOverview,
  history,
  numbers,
  partners,
  news,
  recruit,
  access,
  contact,
  footer,
} from "@/data/corporateSiteData";

/* ───────────────────── COLOR SCHEME ───────────────────── */
const C = {
  bg: "#ffffff",
  bgSub: "#f7f7f5",
  accent: "#2d8a6e",
  accentLight: "#e8f5f0",
  text: "#1a1a1a",
  textSub: "#6b7280",
  border: "#e5e7eb",
  white: "#ffffff",
};

const BP = 768;
const IMG = "/keikamotsu-new-templates/images";

/* ───────────────────── SVG ICONS (stroke only) ───────────────────── */
const Icons = {
  truck: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 4v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  shield: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  quote: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
    </svg>
  ),
  building: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  ),
  clock: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  barChart: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  handshake: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
  ),
  newspaper: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
    </svg>
  ),
  users: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  mapPin: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  mail: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
    </svg>
  ),
  car: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  ),
  key: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  wrench: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  chevronRight: (size = 16, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  arrowDown: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  phone: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

const SERVICE_ICONS = [Icons.truck, Icons.car, Icons.key, Icons.wrench];
const SERVICE_IMAGES = [
  `${IMG}/service-route.webp`,
  `${IMG}/service-ec.webp`,
  `${IMG}/service-b2b.webp`,
  `${IMG}/service-spot.webp`,
];

/* ───────────────────── HOOK: isMobile ───────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < BP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ───────────────────── COMPONENT: FadeIn ───────────────────── */
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const translateMap = {
    up: "translateY(32px)",
    down: "translateY(-32px)",
    left: "translateX(32px)",
    right: "translateX(-32px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translateMap[direction],
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────── HOOK: useTypewriter ───────────────────── */
function useTypewriter(text: string, speed = 80, delay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const timeout = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);
  return { displayed, done };
}

/* ───────────────────── COMPONENT: CounterNum ───────────────────── */
function CounterNum({
  end,
  suffix,
  label,
  visible,
  delay = 0,
}: {
  end: number;
  suffix: string;
  label: string;
  visible: boolean;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [visible, delay]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end]);

  return (
    <div style={{ textAlign: "center", flex: 1, minWidth: 140 }}>
      <div style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 200,
            fontSize: 56,
            color: C.white,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {count.toLocaleString()}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 16,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {suffix}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 400,
          fontSize: 13,
          color: "rgba(255,255,255,0.7)",
          marginTop: 8,
          margin: "8px 0 0",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* =================================================================
   MAIN PAGE COMPONENT
   ================================================================= */
export default function CP05Page() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroTyped = useTypewriter(hero.headline, 80, 600);

  /* form state */
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formSent, setFormSent] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  /* numbers reveal */
  const numRef = useRef<HTMLDivElement | null>(null);
  const [numVis, setNumVis] = useState(false);
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNumVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* recruit underline reveal */
  const recruitRef = useRef<HTMLHeadingElement | null>(null);
  const [recruitVis, setRecruitVis] = useState(false);
  useEffect(() => {
    const el = recruitRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRecruitVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

  /* history horizontal scroll */
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

  /* ─── Font shortcuts ─── */
  const sans: React.CSSProperties = {
    fontFamily: "'Inter', 'Helvetica Neue', 'Noto Sans JP', sans-serif",
  };
  const body: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 400,
    lineHeight: 1.9,
  };

  /* ─── CSS Keyframes ─── */
  const cssKeyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

    @keyframes cp05Blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @keyframes cp05TruckDrive {
      from { transform: translateX(-80px); }
      to { transform: translateX(calc(100vw + 80px)); }
    }

    @keyframes cp05UnderlineExpand {
      from { width: 0; }
      to { width: 100%; }
    }

    @keyframes cp05Marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes cp05ScrollHint {
      0%, 100% { opacity: 0; transform: translateY(-8px); }
      50% { opacity: 1; transform: translateY(8px); }
    }

    @keyframes cp05PulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(45,138,110,0.4); }
      50% { box-shadow: 0 0 0 16px rgba(45,138,110,0); }
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; }
    * { box-sizing: border-box; }

    .cp05-nav-link {
      position: relative;
      text-decoration: none;
      color: ${C.textSub};
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: color 0.3s;
      padding-bottom: 2px;
    }
    .cp05-nav-link:hover {
      color: ${C.accent};
    }
    .cp05-nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1.5px;
      background: ${C.accent};
      transition: width 0.3s ease;
    }
    .cp05-nav-link:hover::after {
      width: 100%;
    }

    .cp05-recruit-heading {
      position: relative;
      display: inline;
    }
    .cp05-recruit-heading::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 3px;
      background: ${C.accent};
      transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .cp05-recruit-heading.visible::after {
      width: 100%;
    }

    .cp05-btn {
      cursor: pointer;
      border: none;
      transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
    }
    .cp05-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(45, 138, 110, 0.3);
    }
    .cp05-btn:active {
      transform: translateY(0);
    }

    .cp05-history-scroll::-webkit-scrollbar {
      height: 4px;
    }
    .cp05-history-scroll::-webkit-scrollbar-track {
      background: ${C.border};
      border-radius: 2px;
    }
    .cp05-history-scroll::-webkit-scrollbar-thumb {
      background: ${C.accent};
      border-radius: 2px;
    }

    .cp05-glass {
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .cp05-glass-dark {
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .cp05-service-card {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      cursor: pointer;
    }
    .cp05-service-card img {
      transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .cp05-service-card:hover img {
      transform: scale(1.08);
    }

    .cp05-strength-panel {
      position: relative;
      overflow: hidden;
    }
    .cp05-strength-panel img {
      transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);
    }
    .cp05-strength-panel:hover img {
      transform: scale(1.05);
    }

    .cp05-form-input {
      width: 100%;
      padding: 14px 16px;
      background: ${C.bgSub};
      border: 1.5px solid ${C.border};
      border-radius: 8px;
      color: ${C.text};
      font-size: 15px;
      font-family: 'Noto Sans JP', sans-serif;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .cp05-form-input:focus {
      border-color: ${C.accent};
      box-shadow: 0 0 0 3px ${C.accentLight};
    }
    .cp05-form-textarea {
      width: 100%;
      padding: 14px 16px;
      background: ${C.bgSub};
      border: 1.5px solid ${C.border};
      border-radius: 8px;
      color: ${C.text};
      font-size: 15px;
      font-family: 'Noto Sans JP', sans-serif;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
      resize: vertical;
      min-height: 120px;
    }
    .cp05-form-textarea:focus {
      border-color: ${C.accent};
      box-shadow: 0 0 0 3px ${C.accentLight};
    }

    .cp05-marquee-track {
      display: flex;
      animation: cp05Marquee 30s linear infinite;
    }
    .cp05-marquee-track:hover {
      animation-play-state: paused;
    }

    .cp05-news-featured {
      transition: transform 0.3s ease;
    }
    .cp05-news-featured:hover {
      transform: translateY(-4px);
    }
  `;

  /* ─── Placeholders ─── */
  const placeholders: Record<string, string> = {
    company: "例）株式会社サンプル",
    name: "例）山田 太郎",
    email: "例）info@example.co.jp",
    phone: "例）090-1234-5678",
    message: "例）配送サービスについてお見積もりをお願いしたいです。",
  };

  /* ─── Section heading with SVG icon ─── */
  const SectionHeading = ({
    icon,
    enTitle,
    jpTitle,
    light = false,
  }: {
    icon: React.ReactNode;
    enTitle: string;
    jpTitle: string;
    light?: boolean;
  }) => (
    <FadeIn style={{ marginBottom: isMobile ? 40 : 56, textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `1.5px solid ${light ? "rgba(255,255,255,0.3)" : C.border}`,
          marginBottom: 16,
          color: light ? C.white : C.accent,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          ...sans,
          fontWeight: 500,
          fontSize: 11,
          color: light ? "rgba(255,255,255,0.6)" : C.accent,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          margin: "0 0 8px",
        }}
      >
        {enTitle}
      </p>
      <h2
        style={{
          ...body,
          fontWeight: 700,
          fontSize: isMobile ? 24 : 32,
          color: light ? C.white : C.text,
          margin: 0,
          letterSpacing: "0.04em",
        }}
      >
        {jpTitle}
      </h2>
    </FadeIn>
  );

  /* =================================================================
     HEADER - Transparent overlay, becomes solid on scroll
     ================================================================= */
  const headerEl = (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.4s ease",
        padding: scrolled ? "10px 0" : "16px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: C.white, fontSize: 15, fontWeight: 700, ...sans }}>G</span>
          </div>
          <span
            style={{
              ...sans,
              fontWeight: 600,
              fontSize: 15,
              color: scrolled ? C.text : C.white,
              letterSpacing: "0.01em",
              transition: "color 0.4s",
            }}
          >
            {company.nameEn.split(" ")[0]}
          </span>
        </div>

        {!isMobile && (
          <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {navLinks.slice(0, 6).map((l) => (
              <a
                key={l.href}
                className="cp05-nav-link"
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href);
                }}
                style={{
                  ...sans,
                  color: scrolled ? C.textSub : "rgba(255,255,255,0.85)",
                }}
              >
                {l.label}
              </a>
            ))}
            <button
              className="cp05-btn"
              onClick={() => scrollTo("#contact")}
              style={{
                ...sans,
                fontWeight: 600,
                fontSize: 13,
                background: C.accent,
                color: C.white,
                padding: "9px 22px",
                borderRadius: 6,
                letterSpacing: "0.02em",
              }}
            >
              {hero.cta}
            </button>
          </nav>
        )}

        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? C.text : C.white} strokeWidth="1.5" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Mobile menu overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            zIndex: 999,
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "absolute",
              top: 16,
              right: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(l.href);
              }}
              style={{
                ...body,
                fontWeight: 500,
                fontSize: 18,
                color: C.text,
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );

  /* =================================================================
     HERO - Full-width image with frosted glass centered card
     ================================================================= */
  const heroEl = (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={`${IMG}/hero-bg.webp`}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
          zIndex: 1,
        }}
      />

      {/* Frosted glass card */}
      <div
        className="cp05-glass"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: isMobile ? "92%" : 640,
          width: "100%",
          padding: isMobile ? "40px 28px" : "56px 52px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <p
          style={{
            ...sans,
            fontWeight: 500,
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.12em",
            marginBottom: 20,
            margin: "0 0 20px",
            textTransform: "uppercase" as const,
          }}
        >
          {company.nameEn}
        </p>
        <h1
          style={{
            ...body,
            fontWeight: 700,
            fontSize: isMobile ? 28 : 44,
            color: C.white,
            lineHeight: 1.4,
            margin: "0 0 24px",
            letterSpacing: "0.04em",
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {heroTyped.displayed}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: isMobile ? 28 : 42,
              background: C.white,
              marginLeft: 4,
              verticalAlign: "middle",
              animation: "cp05Blink 1s step-end infinite",
            }}
          />
        </h1>
        <div style={{ marginBottom: 32 }}>
          {hero.subtext.map((line, i) => (
            <p
              key={i}
              style={{
                ...body,
                fontSize: isMobile ? 13 : 15,
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 4px",
                lineHeight: 1.8,
              }}
            >
              {line}
            </p>
          ))}
        </div>
        <button
          className="cp05-btn"
          onClick={() => scrollTo("#contact")}
          style={{
            ...sans,
            fontWeight: 600,
            fontSize: 15,
            background: C.accent,
            color: C.white,
            padding: "14px 40px",
            borderRadius: 8,
            letterSpacing: "0.02em",
          }}
        >
          {hero.cta}
        </button>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "cp05ScrollHint 2s ease-in-out infinite",
        }}
      >
        <span style={{ ...sans, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>SCROLL</span>
        {Icons.arrowDown(16, "rgba(255,255,255,0.6)")}
      </div>
    </section>
  );

  /* =================================================================
     SERVICES - 2x2 grid with background images and gradient text overlay
     ================================================================= */
  const servicesEl = (
    <section
      id="services"
      style={{
        background: C.bg,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.truck(22)} enTitle="Services" jpTitle="事業内容" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 20 : 24,
          }}
        >
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div
                className="cp05-service-card"
                style={{
                  height: isMobile ? 260 : 320,
                  borderRadius: 16,
                }}
              >
                <img
                  src={SERVICE_IMAGES[i]}
                  alt={s.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "70%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                    zIndex: 1,
                  }}
                />
                {/* Number badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    color: C.white,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ ...sans, fontWeight: 200, fontSize: 36, lineHeight: 1, opacity: 0.5 }}>{s.num}</span>
                </div>
                {/* Icon */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 2,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {SERVICE_ICONS[i](20, "rgba(255,255,255,0.9)")}
                </div>
                {/* Text content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: isMobile ? "20px 20px" : "24px 28px",
                    zIndex: 2,
                  }}
                >
                  <h3
                    style={{
                      ...body,
                      fontWeight: 700,
                      fontSize: isMobile ? 18 : 20,
                      color: C.white,
                      margin: "0 0 8px",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...body,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      margin: 0,
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {s.text.replace(/\n/g, " ")}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* =================================================================
     STRENGTHS - Horizontal 3-panel with full-height images
     ================================================================= */
  const STRENGTH_IMAGES = [
    `${IMG}/strength-01.webp`,
    `${IMG}/strength-02.webp`,
    `${IMG}/strength-03.webp`,
  ];

  const strengthsEl = (
    <section
      id="strengths"
      style={{
        background: C.bgSub,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.shield(22)} enTitle="Strengths" jpTitle="私たちの強み" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: isMobile ? 24 : 20,
          }}
        >
          {strengths.map((s, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div
                className="cp05-strength-panel"
                style={{
                  position: "relative",
                  height: isMobile ? 360 : 480,
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <img
                  src={STRENGTH_IMAGES[i]}
                  alt={s.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Full overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
                  }}
                />
                {/* Large number */}
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      ...sans,
                      fontWeight: 200,
                      fontSize: isMobile ? 72 : 96,
                      color: "rgba(255,255,255,0.15)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {s.num}
                  </span>
                </div>
                {/* Content at bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: isMobile ? "24px" : "32px 28px",
                    zIndex: 1,
                  }}
                >
                  <h3
                    style={{
                      ...body,
                      fontWeight: 700,
                      fontSize: isMobile ? 18 : 20,
                      color: C.white,
                      margin: "0 0 12px",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...body,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      margin: 0,
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* =================================================================
     CEO MESSAGE - Side-by-side photo and quote with large quote marks
     ================================================================= */
  const ceoEl = (
    <section
      id="message"
      style={{
        background: C.bg,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.quote(22)} enTitle="CEO Message" jpTitle="代表メッセージ" />
        <FadeIn>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "stretch",
              gap: 0,
              borderRadius: 20,
              overflow: "hidden",
              background: C.bgSub,
            }}
          >
            {/* CEO Photo - 40% width */}
            <div
              style={{
                width: isMobile ? "100%" : "40%",
                minHeight: isMobile ? 320 : 500,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={`${IMG}/ceo-portrait.webp`}
                alt={ceoMessage.name}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Quote & Message - 60% */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "36px 24px" : "48px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Large decorative quote mark */}
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? 12 : 24,
                  left: isMobile ? 16 : 32,
                  opacity: 0.08,
                }}
              >
                <svg width="80" height="60" viewBox="0 0 80 60" fill={C.accent}>
                  <path d="M0 40V20C0 8.95 8.95 0 20 0h4v12h-4c-4.42 0-8 3.58-8 8v4h16v16H0zm48 0V20C48 8.95 56.95 0 68 0h4v12h-4c-4.42 0-8 3.58-8 8v4h16v16H48z" />
                </svg>
              </div>

              {/* Leading quote */}
              <p
                style={{
                  ...body,
                  fontWeight: 600,
                  fontSize: isMobile ? 18 : 22,
                  color: C.text,
                  margin: "0 0 28px",
                  lineHeight: 1.7,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {ceoMessage.message[0]}
              </p>

              {ceoMessage.message.slice(1).map((p, i) => (
                <FadeIn key={i} delay={200 + i * 120}>
                  <p
                    style={{
                      ...body,
                      fontSize: 14,
                      color: C.textSub,
                      margin: "0 0 16px",
                      lineHeight: 1.9,
                    }}
                  >
                    {p}
                  </p>
                </FadeIn>
              ))}

              {/* Name & title */}
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background: C.accent,
                  }}
                />
                <div>
                  <p
                    style={{
                      ...sans,
                      fontWeight: 500,
                      fontSize: 11,
                      color: C.accent,
                      margin: "0 0 4px",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {ceoMessage.title}
                  </p>
                  <p
                    style={{
                      ...body,
                      fontWeight: 700,
                      fontSize: 18,
                      color: C.text,
                      margin: 0,
                    }}
                  >
                    {ceoMessage.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );

  /* =================================================================
     COMPANY INFO - With company.webp image
     ================================================================= */
  const companyEl = (
    <section
      id="company"
      style={{
        background: C.bgSub,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.building(22)} enTitle="Company" jpTitle="会社概要" />
        <FadeIn>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 32 : 48,
              alignItems: "stretch",
            }}
          >
            {/* Image side */}
            <div
              style={{
                width: isMobile ? "100%" : "40%",
                minHeight: isMobile ? 240 : "auto",
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={`${IMG}/company.webp`}
                alt="会社"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {/* Table side */}
            <div
              style={{
                flex: 1,
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                background: C.white,
              }}
            >
              {companyOverview.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    padding: isMobile ? "12px 16px" : "14px 24px",
                    borderBottom: i < companyOverview.length - 1 ? `1px solid ${C.border}` : "none",
                    background: i % 2 === 0 ? C.white : C.bgSub,
                  }}
                >
                  <dt
                    style={{
                      ...body,
                      fontWeight: 600,
                      fontSize: 13,
                      color: C.accent,
                      width: isMobile ? "100%" : 140,
                      flexShrink: 0,
                      marginBottom: isMobile ? 2 : 0,
                    }}
                  >
                    {item.dt}
                  </dt>
                  <dd
                    style={{
                      ...body,
                      fontSize: 14,
                      color: C.text,
                      margin: 0,
                    }}
                  >
                    {item.dd}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );

  /* =================================================================
     HISTORY - Horizontal scrollable timeline cards with images
     ================================================================= */
  const HISTORY_IMAGES: Record<string, string> = {
    "2021": `${IMG}/history-2021.webp`,
    "2022": `${IMG}/history-2022.webp`,
    "2023": `${IMG}/history-2023.webp`,
    "2024": `${IMG}/history-2024.webp`,
    "2025": `${IMG}/history-2025.webp`,
  };

  const historyEl = (
    <section
      id="history"
      style={{
        background: C.bg,
        padding: isMobile ? "72px 0 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.clock(22)} enTitle="History" jpTitle="沿革" />
      </div>
      {/* Horizontal scroll track */}
      <div
        ref={historyScrollRef}
        className="cp05-history-scroll"
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          padding: isMobile ? "0 20px 24px" : "0 calc((100vw - 1200px) / 2 + 24px) 24px",
          scrollSnapType: "x mandatory",
        }}
      >
        {history.map((h, i) => (
          <FadeIn key={i} delay={i * 100} direction="right" style={{ flexShrink: 0 }}>
            <div
              style={{
                width: isMobile ? 280 : 300,
                borderRadius: 16,
                overflow: "hidden",
                background: C.white,
                border: `1px solid ${C.border}`,
                scrollSnapAlign: "start",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                <img
                  src={HISTORY_IMAGES[h.year] || `${IMG}/history-2021.webp`}
                  alt={`${h.year}年`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Year badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 20,
                    background: C.accent,
                    color: C.white,
                    padding: "6px 16px",
                    borderRadius: "8px 8px 0 0",
                    ...sans,
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "0.02em",
                  }}
                >
                  {h.year}
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: "24px 20px 20px" }}>
                <p
                  style={{
                    ...body,
                    fontSize: 14,
                    color: C.text,
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {h.event}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      {/* Timeline connector line */}
      <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {history.map((_, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: C.accent,
                  flexShrink: 0,
                }}
              />
              {i < history.length - 1 && (
                <div style={{ flex: 1, height: 2, background: C.accentLight }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );

  /* =================================================================
     NUMBERS - Full-width team.webp background with dark overlay
     ================================================================= */
  const numbersEl = (
    <section
      id="numbers"
      style={{
        position: "relative",
        padding: isMobile ? "80px 20px" : "120px 0",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={`${IMG}/team.webp`}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.72)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.barChart(22)} enTitle="Numbers" jpTitle="数字で見る実績" light />
        <div
          ref={numRef}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 40 : 0,
          }}
        >
          {numbers.map((n, i) => {
            const numVal = parseFloat(n.value.replace(/,/g, ""));
            return (
              <React.Fragment key={i}>
                {i > 0 && !isMobile && (
                  <div
                    style={{
                      width: 1,
                      height: 64,
                      background: "rgba(255,255,255,0.15)",
                      flexShrink: 0,
                      margin: "0 20px",
                    }}
                  />
                )}
                <CounterNum
                  end={numVal}
                  suffix={n.suffix}
                  label={n.label}
                  visible={numVis}
                  delay={i * 200}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );

  /* =================================================================
     PARTNERS - Scrolling marquee logo strip + truck animation
     ================================================================= */
  const partnersEl = (
    <section
      id="partners"
      style={{
        background: C.bg,
        padding: isMobile ? "72px 0 40px" : "100px 0 60px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.handshake(22)} enTitle="Partners" jpTitle="主要取引先" />
      </div>

      {/* Marquee track */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className="cp05-marquee-track">
          {/* Duplicate items for seamless loop */}
          {[...partners, ...partners, ...partners, ...partners].map((p, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: isMobile ? 140 : 180,
                height: isMobile ? 60 : 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 16px",
                opacity: 0.5,
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.5";
              }}
            >
              <img
                src={p.logo}
                alt={p.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: "grayscale(100%)",
                  transition: "filter 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLImageElement).style.filter = "grayscale(0%)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLImageElement).style.filter = "grayscale(100%)";
                }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  if (el.parentElement) {
                    el.parentElement.innerHTML = `<span style="font-size:12px;color:${C.textSub};font-family:'Noto Sans JP',sans-serif;text-align:center">${p.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Truck animation */}
      <div
        style={{
          position: "relative",
          height: isMobile ? 44 : 56,
          overflow: "hidden",
          marginTop: isMobile ? 32 : 48,
          maxWidth: 1200,
          margin: `${isMobile ? 32 : 48}px auto 0`,
          padding: "0 24px",
        }}
      >
        {/* Ground line */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: 0,
            width: "100%",
            height: 1,
            background: C.border,
          }}
        />
        {/* Dashes on ground */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            width: "100%",
            height: 1,
            background: `repeating-linear-gradient(to right, ${C.border} 0px, ${C.border} 12px, transparent 12px, transparent 24px)`,
          }}
        />
        {/* Truck */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 8,
            animation: `cp05TruckDrive ${isMobile ? 12 : 20}s linear infinite`,
          }}
        >
          <svg
            width={isMobile ? 44 : 56}
            height={isMobile ? 24 : 32}
            viewBox="0 0 56 32"
            fill="none"
            stroke={C.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="6" width="30" height="18" rx="2" />
            <path d="M31 14h10l6 5v5H31V14z" />
            <circle cx="11" cy="27" r="4" />
            <circle cx="42" cy="27" r="4" />
            <line x1="4" y1="12" x2="12" y2="12" />
            <line x1="4" y1="16" x2="10" y2="16" />
          </svg>
        </div>
      </div>
    </section>
  );

  /* =================================================================
     NEWS - Magazine-style: large first item, grid for rest
     ================================================================= */
  const tagColors: Record<string, { bg: string; text: string }> = {
    press: { bg: "#fff3e0", text: "#e65100" },
    new: { bg: C.accentLight, text: C.accent },
    default: { bg: "#f3f4f6", text: C.textSub },
  };

  const newsEl = (
    <section
      id="news"
      style={{
        background: C.bgSub,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.newspaper(22)} enTitle="News" jpTitle="お知らせ" />

        {news.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 20 : 24,
            }}
          >
            {/* Featured first item */}
            <FadeIn>
              <div
                className="cp05-news-featured"
                style={{
                  background: C.white,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                  gridRow: isMobile ? "auto" : "span 2",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
              >
                {/* Featured image */}
                <div style={{ position: "relative", height: isMobile ? 180 : 240, overflow: "hidden" }}>
                  <img
                    src={`${IMG}/vehicle.webp`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                    }}
                  >
                    {(() => {
                      const ts = tagColors[news[0].tagStyle] || tagColors.default;
                      return (
                        <span
                          style={{
                            ...sans,
                            fontWeight: 600,
                            fontSize: 11,
                            color: ts.text,
                            background: ts.bg,
                            padding: "4px 12px",
                            borderRadius: 6,
                          }}
                        >
                          {news[0].tag}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div style={{ padding: isMobile ? "20px" : "28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      ...sans,
                      fontWeight: 400,
                      fontSize: 13,
                      color: C.textSub,
                      marginBottom: 8,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {news[0].date}
                  </span>
                  <h3
                    style={{
                      ...body,
                      fontWeight: 600,
                      fontSize: isMobile ? 16 : 18,
                      color: C.text,
                      margin: "0 0 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {news[0].title}
                  </h3>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 4, color: C.accent }}>
                    <span style={{ ...sans, fontSize: 13, fontWeight: 500 }}>Read more</span>
                    {Icons.chevronRight(14, C.accent)}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Remaining items */}
            {news.slice(1).map((n, i) => {
              const ts = tagColors[n.tagStyle] || tagColors.default;
              return (
                <FadeIn key={i} delay={100 + i * 80}>
                  <div
                    style={{
                      background: C.white,
                      borderRadius: 12,
                      padding: "20px 24px",
                      border: `1px solid ${C.border}`,
                      cursor: "pointer",
                      transition: "box-shadow 0.3s, transform 0.3s",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          ...sans,
                          fontWeight: 400,
                          fontSize: 12,
                          color: C.textSub,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {n.date}
                      </span>
                      <span
                        style={{
                          ...sans,
                          fontWeight: 600,
                          fontSize: 10,
                          color: ts.text,
                          background: ts.bg,
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {n.tag}
                      </span>
                    </div>
                    <p
                      style={{
                        ...body,
                        fontSize: 14,
                        color: C.text,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {n.title}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  /* =================================================================
     RECRUIT - Full-width CTA with delivery.webp and frosted glass
     ================================================================= */
  const recruitEl = (
    <section
      id="recruit"
      style={{
        position: "relative",
        padding: isMobile ? "80px 20px" : "120px 0",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={`${IMG}/delivery.webp`}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.65) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.2)",
              padding: isMobile ? "40px 24px" : "56px 48px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              {Icons.users(28, "rgba(255,255,255,0.7)")}
            </div>
            <p
              style={{
                ...sans,
                fontWeight: 500,
                fontSize: 11,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                margin: "0 0 16px",
              }}
            >
              Recruit
            </p>
            <h2
              ref={recruitRef}
              className={`cp05-recruit-heading${recruitVis ? " visible" : ""}`}
              style={{
                ...body,
                fontWeight: 700,
                fontSize: isMobile ? 22 : 30,
                color: C.white,
                margin: "0 0 24px",
                lineHeight: 1.5,
              }}
            >
              {recruit.heading}
            </h2>
            <p
              style={{
                ...body,
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                whiteSpace: "pre-line",
                margin: "0 0 28px",
                lineHeight: 1.9,
              }}
            >
              {recruit.text}
            </p>
            <p
              style={{
                ...body,
                fontSize: 16,
                color: C.white,
                margin: "0 0 32px",
                lineHeight: 1.7,
              }}
            >
              「ちょっと話を聞いてみたい」
              <br />
              ----それだけで大丈夫です。
            </p>
            <a
              href={recruit.link}
              className="cp05-btn"
              style={{
                display: "inline-block",
                ...sans,
                fontWeight: 600,
                fontSize: 15,
                background: C.accent,
                color: C.white,
                padding: "14px 44px",
                borderRadius: 8,
                textDecoration: "none",
                letterSpacing: "0.02em",
                border: "none",
              }}
            >
              {recruit.cta}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );

  /* =================================================================
     ACCESS
     ================================================================= */
  const accessEl = (
    <section
      id="access"
      style={{
        background: C.bgSub,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.mapPin(22)} enTitle="Access" jpTitle="アクセス" />
        <FadeIn>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 40,
              alignItems: "stretch",
            }}
          >
            {/* Info */}
            <div style={{ width: isMobile ? "100%" : "40%" }}>
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    ...body,
                    fontWeight: 600,
                    fontSize: 16,
                    color: C.text,
                    margin: "0 0 12px",
                  }}
                >
                  {company.name}
                </p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  {Icons.mapPin(16, C.accent)}
                  <p
                    style={{
                      ...body,
                      fontSize: 14,
                      color: C.text,
                      margin: 0,
                    }}
                  >
                    〒{company.postalCode} {access.address}
                  </p>
                </div>
                <p
                  style={{
                    ...body,
                    fontSize: 13,
                    color: C.textSub,
                    margin: "0 0 6px",
                    paddingLeft: 24,
                  }}
                >
                  {access.nearestStation}
                </p>
                <p
                  style={{
                    ...body,
                    fontSize: 13,
                    color: C.textSub,
                    margin: "0 0 16px",
                    paddingLeft: 24,
                  }}
                >
                  {access.mapNote}
                </p>
              </div>
              <div
                style={{
                  padding: "16px 0",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  {Icons.phone(16, C.accent)}
                  <p style={{ ...body, fontSize: 14, color: C.text, margin: 0 }}>
                    TEL: {company.phone}
                  </p>
                </div>
                <p style={{ ...body, fontSize: 13, color: C.textSub, margin: 0, paddingLeft: 24 }}>
                  {company.hours}
                </p>
              </div>
            </div>
            {/* Map */}
            <div
              style={{
                width: isMobile ? "100%" : "60%",
                minHeight: 300,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
              }}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(access.address)}&output=embed`}
                style={{ width: "100%", height: "100%", minHeight: 300, border: "none" }}
                loading="lazy"
                title="Google Map"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );

  /* =================================================================
     CONTACT - Clean 2-column: info left, form right
     ================================================================= */
  const contactEl = (
    <section
      id="contact"
      style={{
        background: C.bg,
        padding: isMobile ? "72px 20px 80px" : "100px 0 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeading icon={Icons.mail(22)} enTitle="Contact" jpTitle="お問い合わせ" />

        {formSent ? (
          <FadeIn>
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                background: C.accentLight,
                borderRadius: 16,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              <div style={{ marginBottom: 16 }}>
                {Icons.mail(32, C.accent)}
              </div>
              <p
                style={{
                  ...body,
                  fontWeight: 700,
                  fontSize: 22,
                  color: C.accent,
                  margin: "0 0 12px",
                }}
              >
                送信完了
              </p>
              <p
                style={{
                  ...body,
                  fontSize: 14,
                  color: C.textSub,
                  margin: 0,
                }}
              >
                お問い合わせありがとうございます。担当より折り返しご連絡いたします。
              </p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={100}>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 36 : 56,
                alignItems: "flex-start",
              }}
            >
              {/* Left: info */}
              <div style={{ width: isMobile ? "100%" : "35%", flexShrink: 0 }}>
                <p
                  style={{
                    ...body,
                    fontSize: 14,
                    color: C.textSub,
                    whiteSpace: "pre-line",
                    margin: "0 0 28px",
                    lineHeight: 1.9,
                  }}
                >
                  {contact.intro}
                </p>
                <div
                  style={{
                    padding: "20px 0",
                    borderTop: `1px solid ${C.border}`,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    {Icons.phone(18, C.accent)}
                    <div>
                      <p style={{ ...sans, fontWeight: 500, fontSize: 11, color: C.textSub, margin: "0 0 2px", letterSpacing: "0.05em" }}>TEL</p>
                      <p style={{ ...body, fontWeight: 600, fontSize: 16, color: C.text, margin: 0 }}>{company.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {Icons.mail(18, C.accent)}
                    <div>
                      <p style={{ ...sans, fontWeight: 500, fontSize: 11, color: C.textSub, margin: "0 0 2px", letterSpacing: "0.05em" }}>EMAIL</p>
                      <p style={{ ...body, fontWeight: 600, fontSize: 14, color: C.text, margin: 0 }}>{company.email}</p>
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    ...body,
                    fontSize: 12,
                    color: C.textSub,
                    margin: "16px 0 0",
                  }}
                >
                  {company.hours}
                </p>
              </div>

              {/* Right: form */}
              <div style={{ flex: 1, width: "100%" }}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  {contact.fields.map((f) => (
                    <div key={f.name}>
                      <label
                        htmlFor={`cp05-${f.name}`}
                        style={{
                          ...body,
                          fontWeight: 500,
                          fontSize: 13,
                          color: C.text,
                          marginBottom: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {f.label}
                        {f.required && (
                          <span
                            style={{
                              fontSize: 10,
                              color: C.white,
                              background: C.accent,
                              padding: "1px 6px",
                              borderRadius: 3,
                              fontWeight: 600,
                              ...sans,
                            }}
                          >
                            必須
                          </span>
                        )}
                      </label>
                      {f.type === "textarea" ? (
                        <textarea
                          id={`cp05-${f.name}`}
                          className="cp05-form-textarea"
                          rows={5}
                          required={f.required}
                          value={formData[f.name] || ""}
                          placeholder={placeholders[f.name]}
                          onChange={(e) =>
                            setFormData({ ...formData, [f.name]: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          id={`cp05-${f.name}`}
                          className="cp05-form-input"
                          type={f.type}
                          required={f.required}
                          value={formData[f.name] || ""}
                          placeholder={placeholders[f.name]}
                          onChange={(e) =>
                            setFormData({ ...formData, [f.name]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div style={{ textAlign: isMobile ? "center" : "left", marginTop: 8 }}>
                    <button
                      type="submit"
                      className="cp05-btn"
                      style={{
                        ...sans,
                        fontWeight: 600,
                        fontSize: 15,
                        background: C.accent,
                        color: C.white,
                        padding: "14px 56px",
                        borderRadius: 8,
                        letterSpacing: "0.03em",
                      }}
                    >
                      送信する
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );

  /* =================================================================
     FOOTER - footer-bg.webp background with dark overlay
     ================================================================= */
  const footerEl = (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={`${IMG}/footer-bg.webp`}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.82)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "56px 24px 28px" : "72px 24px 32px",
        }}
      >
        {/* Top row: logo + nav */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            gap: isMobile ? 32 : 0,
            marginBottom: 40,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: C.white, fontSize: 15, fontWeight: 700, ...sans }}>G</span>
            </div>
            <span
              style={{
                ...sans,
                fontWeight: 600,
                fontSize: 15,
                color: C.white,
              }}
            >
              {company.nameEn.split(" ")[0]}
            </span>
          </div>

          {/* Nav links */}
          {!isMobile && (
            <nav style={{ display: "flex", gap: 24 }}>
              {navLinks.slice(0, 6).map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(l.href);
                  }}
                  style={{
                    ...sans,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Catchphrase */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p
            style={{
              ...body,
              fontWeight: 700,
              fontSize: isMobile ? 18 : 26,
              color: C.white,
              margin: "0 0 0",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}
          >
            {footer.catchphrase}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.1)",
            marginBottom: 24,
          }}
        />

        {/* Bottom row: info + copyright */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-end",
            gap: isMobile ? 12 : 0,
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <div>
            <p
              style={{
                ...body,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                margin: "0 0 4px",
              }}
            >
              {company.name}
            </p>
            <p
              style={{
                ...body,
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              〒{company.postalCode} {company.address} / TEL: {company.phone}
            </p>
          </div>
          <p
            style={{
              ...sans,
              fontWeight: 400,
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            &copy; {new Date().getFullYear()} {company.nameEn}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  /* =================================================================
     RENDER
     ================================================================= */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssKeyframes }} />
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
        {headerEl}
        {heroEl}
        {servicesEl}
        {strengthsEl}
        {ceoEl}
        {companyEl}
        {historyEl}
        {numbersEl}
        {partnersEl}
        {newsEl}
        {recruitEl}
        {accessEl}
        {contactEl}
        {footerEl}
      </div>
    </>
  );
}
