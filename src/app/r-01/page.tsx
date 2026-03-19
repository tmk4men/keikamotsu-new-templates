"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
  meta,
  navLinks,
  hero,
  marquee,
  reasons,
  jobs,
  benefits,
  daily,
  voices,
  gallery,
  news,
  companyInfo,
  cta,
  faq,
  access,
  footer,
} from "@/data/siteData";

/* ════════════════════════════════════════════════════════════
   R-01 — LEFT FIXED PROFILE CARD + RIGHT SCROLLING CONTENT
   Split-panel dashboard layout
   ════════════════════════════════════════════════════════════ */

/* ─── Color Scheme ─── */
const C = {
  bg: "#ffffff",
  bgSub: "#f8f9fb",
  accent: "#2563eb",
  accentLight: "#eef2ff",
  accentDark: "#1d4ed8",
  navy: "#1a2b3c",
  text: "#1a2b3c",
  textSub: "#6b7280",
  border: "#e5e7eb",
  white: "#ffffff",
};

const BP = 768;
const LEFT_W = 320;

/* ─── Image Paths ─── */
const IMG = {
  strength: (n: number) => `/keikamotsu-new-templates/images/strength-0${n}.webp`,
  heroBg: "/keikamotsu-new-templates/images/hero-bg.webp",
  jobs: "/keikamotsu-new-templates/images/jobs.webp",
  benefits: "/keikamotsu-new-templates/images/benefits.webp",
  workplace: "/keikamotsu-new-templates/images/workplace.webp",
  dailyFlow: "/keikamotsu-new-templates/images/daily-flow.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
  voices: "/keikamotsu-new-templates/images/voices.webp",
  faq: "/keikamotsu-new-templates/images/faq.webp",
  company: "/keikamotsu-new-templates/images/company.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
  vehicle: "/keikamotsu-new-templates/images/vehicle.webp",
  loading: "/keikamotsu-new-templates/images/loading.webp",
  team: "/keikamotsu-new-templates/images/team.webp",
};

/* ─── Section IDs for scrollspy ─── */
const SECTION_IDS = [
  "reasons",
  "jobs",
  "benefits",
  "daily",
  "gallery",
  "voices",
  "faq",
  "news",
  "company",
];

/* ─── Nav SVG Icons (stroke only, currentColor) ─── */
const NavIcons: Record<string, React.ReactNode> = {
  reasons: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  jobs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  benefits: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  daily: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  voices: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  news: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M18 18h-8M10 6h8" />
    </svg>
  ),
  company: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      <path d="M9 9h1M9 13h1M9 17h1" />
    </svg>
  ),
};

/* ─── Nav label map ─── */
const NAV_LABELS: Record<string, string> = {
  reasons: "選ばれる理由",
  jobs: "求人情報",
  benefits: "待遇",
  daily: "1日の流れ",
  gallery: "職場の雰囲気",
  voices: "先輩の声",
  faq: "FAQ",
  news: "お知らせ",
  company: "会社概要",
};

/* ─── Benefit SVG Icons ─── */
const benefitIcons = [
  <svg key="b0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" /></svg>,
  <svg key="b1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>,
  <svg key="b2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M16 14h2" /></svg>,
  <svg key="b3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  <svg key="b4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M22 10l-10-5L2 10l10 5 10-5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg>,
  <svg key="b5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>,
];

/* ─── Section Heading Icons ─── */
const SectionIcons: Record<string, React.ReactNode> = {
  reasons: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
  ),
  jobs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
  ),
  benefits: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
  ),
  daily: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
  ),
  voices: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
  ),
  news: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M18 18h-8M10 6h8" /></svg>
  ),
  company: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9h1M9 13h1M9 17h1" /></svg>
  ),
  apply: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
  ),
};

/* ═══════════════════════════════════════════════
   Hooks & Utility Components
   ═══════════════════════════════════════════════ */

/* ─── isMobile hook ─── */
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

/* ─── Typewriter hook ─── */
function useTypewriter(text: string, speed = 80, delay = 500) {
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

/* ─── CounterNum ─── */
function CounterNum({ end, suffix = "", duration = 2000, style }: { end: number; suffix?: string; duration?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);
  return (
    <span ref={ref} style={style}>
      {val}{suffix}
    </span>
  );
}

/* ─── SalaryCountUp ─── */
function SalaryCountUp({ min, max, style }: { min: number; max: number; style?: React.CSSProperties }) {
  return (
    <span style={style}>
      <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800 }}>
        <CounterNum end={min} suffix="" style={{ fontSize: "inherit", color: "inherit" }} />
        <span style={{ fontSize: "0.5em", margin: "0 2px" }}>~</span>
        <CounterNum end={max} suffix="" style={{ fontSize: "inherit", color: "inherit" }} />
      </span>
      <span style={{ fontSize: "0.4em", marginLeft: 2 }}>万円</span>
    </span>
  );
}

/* ─── FadeIn (IntersectionObserver) ─── */
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const transforms = {
    up: "translateY(24px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
    scale: "scale(0.92)",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── SectionTitle with SVG icon + underline animation ─── */
function SectionTitle({
  id,
  label,
  title,
  onDark,
}: {
  id: string;
  label: string;
  title: string;
  onDark?: boolean;
}) {
  const icon = SectionIcons[id];
  return (
    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        {icon && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: onDark ? "rgba(255,255,255,0.1)" : C.accentLight,
              color: onDark ? C.white : C.accent,
              marginBottom: 12,
            }}
          >
            {icon}
          </div>
        )}
        <p
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.2em",
            color: onDark ? "rgba(255,255,255,0.5)" : C.textSub,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: 26,
            color: onDark ? C.white : C.text,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: 48,
            height: 3,
            background: C.accent,
            borderRadius: 2,
            margin: "12px auto 0",
          }}
        />
      </div>
    </FadeIn>
  );
}

/* ─── Scrollspy Hook ─── */
function useScrollspy(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handler = () => {
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) current = id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function R01Page() {
  const isMobile = useIsMobile();
  const activeSection = useScrollspy(SECTION_IDS);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { displayed: heroTyped, done: heroDone } = useTypewriter(hero.headlineParts[0], 70, 600);

  /* ─── Form State ─── */
  const [formData, setFormData] = useState({ name: "", kana: "", phone: "", email: "", age: "", message: "" });
  const handleForm = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert("送信しました（デモ）");
  }, []);

  /* ─── Scroll to section ─── */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileNavOpen(false);
    }
  }, []);

  /* ─── Keyframes (injected once) ─── */
  useEffect(() => {
    if (document.getElementById("r01-keyframes")) return;
    const style = document.createElement("style");
    style.id = "r01-keyframes";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700;900&family=Zen+Kurenaido&display=swap');
      @keyframes r01marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes r01truckDrive {
        0% { transform: translateX(-80px); }
        100% { transform: translateX(calc(100vw + 60px)); }
      }
      @keyframes r01pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes r01underline {
        0% { width: 0; }
        100% { width: 48px; }
      }
      @keyframes r01fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes r01scrollArrow {
        0%, 100% { opacity: 0.3; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(8px); }
      }
      @keyframes r01heroGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(37,99,235,0.3); }
        50% { box-shadow: 0 0 40px rgba(37,99,235,0.6); }
      }
      html { scroll-behavior: smooth; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'Noto Sans JP', sans-serif; }
    `;
    document.head.appendChild(style);
  }, []);

  /* ═══════════════════════════════════════════════
     LEFT PANEL (Fixed / Mobile Sticky Top)
     ═══════════════════════════════════════════════ */
  const LeftPanel = () => {
    if (isMobile) {
      /* Mobile: compact sticky top bar */
      return (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: C.white,
              borderBottom: `1px solid ${C.border}`,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontFamily: "'Oswald',sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                GL
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                  月収 <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, color: C.accent }}>
                    <SalaryCountUp min={hero.salaryMin} max={hero.salaryMax} style={{ fontSize: 16 }} />
                  </span>
                </div>
              </div>
            </div>

            {/* CTA + Hamburger */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a
                href={`tel:${company.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: C.accent,
                  color: C.white,
                  textDecoration: "none",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </a>
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                style={{
                  width: 36,
                  height: 36,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.white,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: 0,
                }}
              >
                {mobileNavOpen ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <>
                    <span style={{ width: 16, height: 2, background: C.text, borderRadius: 1 }} />
                    <span style={{ width: 16, height: 2, background: C.text, borderRadius: 1 }} />
                    <span style={{ width: 16, height: 2, background: C.text, borderRadius: 1 }} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav Overlay */}
          {mobileNavOpen && (
            <div
              style={{
                position: "fixed",
                top: 60,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255,255,255,0.98)",
                zIndex: 999,
                padding: "24px 20px",
                overflowY: "auto",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <a
                  href={`tel:${company.phone}`}
                  style={{
                    display: "block",
                    padding: "14px 0",
                    textAlign: "center",
                    background: C.accent,
                    color: C.white,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    marginBottom: 10,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, verticalAlign: "middle", marginRight: 6 }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  電話する
                </a>
                <button
                  onClick={() => { scrollTo("apply"); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "14px 0",
                    textAlign: "center",
                    background: C.white,
                    color: C.accent,
                    border: `2px solid ${C.accent}`,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, verticalAlign: "middle", marginRight: 6 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" />
                  </svg>
                  Web応募
                </button>
              </div>
              {SECTION_IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "14px 16px",
                    background: activeSection === id ? C.accentLight : "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: activeSection === id ? 700 : 500,
                    color: activeSection === id ? C.accent : C.text,
                    textAlign: "left",
                  }}
                >
                  <span style={{ color: activeSection === id ? C.accent : C.textSub }}>{NavIcons[id]}</span>
                  {NAV_LABELS[id]}
                </button>
              ))}
            </div>
          )}
        </>
      );
    }

    /* Desktop: Fixed left panel */
    return (
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: LEFT_W,
          height: "100vh",
          background: C.white,
          borderRight: `1px solid ${C.border}`,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "2px 0 16px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo Area */}
        <div style={{ padding: "28px 24px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              GL
            </div>
            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 13, color: C.text, letterSpacing: "0.05em" }}>
                Green Logistics
              </div>
              <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>
                {company.name}
              </div>
            </div>
          </div>

          {/* Job Title */}
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            軽貨物ドライバー
          </div>

          {/* Salary */}
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: C.textSub }}>月収</span>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 36, color: C.accent, lineHeight: 1.1 }}>
              <SalaryCountUp min={hero.salaryMin} max={hero.salaryMax} style={{ fontSize: 36 }} />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
          <a
            href={`tel:${company.phone}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "12px 0",
              background: C.accent,
              color: C.white,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              marginBottom: 8,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            電話する
          </a>
          <button
            onClick={() => scrollTo("apply")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "12px 0",
              background: C.white,
              color: C.accent,
              border: `2px solid ${C.accent}`,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.accentLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.white;
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            Web応募
          </button>
        </div>

        {/* Nav Links with scrollspy */}
        <nav style={{ padding: "12px 12px", flex: 1 }}>
          {SECTION_IDS.map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                background: activeSection === id ? C.accentLight : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: activeSection === id ? 700 : 500,
                color: activeSection === id ? C.accent : C.text,
                textAlign: "left",
                transition: "all 0.15s",
                borderLeft: activeSection === id ? `3px solid ${C.accent}` : "3px solid transparent",
                marginBottom: 2,
              }}
              onMouseEnter={(e) => {
                if (activeSection !== id) e.currentTarget.style.background = C.bgSub;
              }}
              onMouseLeave={(e) => {
                if (activeSection !== id) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ color: activeSection === id ? C.accent : C.textSub, flexShrink: 0 }}>
                {NavIcons[id]}
              </span>
              {NAV_LABELS[id]}
            </button>
          ))}
        </nav>

        {/* Bottom phone info */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, background: C.bgSub }}>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: C.text, letterSpacing: "0.05em" }}>
            {company.phone}
          </div>
          <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>
            受付 9:00-18:00
          </div>
        </div>
      </aside>
    );
  };

  /* ═══════════════════════════════════════════════
     RIGHT CONTENT (Scrollable)
     ═══════════════════════════════════════════════ */

  const contentML = isMobile ? 0 : LEFT_W;
  const contentPT = isMobile ? 60 : 0;
  const secPad = isMobile ? "60px 16px" : "80px 48px";
  const maxW = 960;

  return (
    <>
      <LeftPanel />

      {/* Main scrollable right content */}
      <main
        style={{
          marginLeft: contentML,
          paddingTop: contentPT,
          minHeight: "100vh",
          background: C.bg,
        }}
      >
        {/* ═══ 1. HERO ═══ */}
        <section
          style={{
            position: "relative",
            minHeight: isMobile ? 480 : 560,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG.heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(37,99,235,0.3) 0%, rgba(26,43,60,0.5) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: isMobile ? "0 20px" : "0 48px",
              maxWidth: 720,
            }}
          >
            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              {hero.badges.map((b, i) => (
                <FadeIn key={i} delay={0.2 + i * 0.1}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.white,
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {b}
                  </span>
                </FadeIn>
              ))}
            </div>

            {/* Headline */}
            <FadeIn delay={0.3}>
              <h1
                style={{
                  fontWeight: 900,
                  fontSize: isMobile ? 28 : 42,
                  color: C.white,
                  lineHeight: 1.3,
                  marginBottom: 8,
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                  textAlign: "center",
                  whiteSpace: "pre-line",
                }}
              >
                {heroTyped}
                {!heroDone && (
                  <span style={{ borderRight: "2px solid white", marginLeft: 2, animation: "r01pulse 1s infinite" }} />
                )}
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p
                style={{
                  fontSize: isMobile ? 14 : 16,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.8,
                  marginBottom: 24,
                }}
              >
                {hero.headlineParts[1]}
              </p>
            </FadeIn>

            {/* Salary */}
            <FadeIn delay={0.7}>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.2)",
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>月収</span>
                <div
                  style={{
                    fontFamily: "'Oswald',sans-serif",
                    fontWeight: 800,
                    fontSize: isMobile ? 40 : 56,
                    color: C.white,
                    lineHeight: 1,
                  }}
                >
                  <SalaryCountUp min={hero.salaryMin} max={hero.salaryMax} style={{ fontSize: isMobile ? 40 : 56 }} />
                </div>
              </div>
            </FadeIn>

            {/* Subtext */}
            <FadeIn delay={0.9}>
              <div style={{ fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                {hero.subtext.map((t, i) => (
                  <span key={i}>{t}<br /></span>
                ))}
              </div>
            </FadeIn>

            {/* Scroll arrow */}
            <div style={{ marginTop: 32, animation: "r01scrollArrow 2s infinite" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24, opacity: 0.6 }}>
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </div>
          </div>
        </section>

        {/* ═══ 2. MARQUEE ═══ */}
        <div style={{ background: C.accent, padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap" as const }}>
          <div style={{ display: "inline-block", animation: "r01marquee 25s linear infinite" }}>
            {[...marquee.top, ...marquee.top].map((t, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: C.white, marginRight: 32 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ background: C.navy, padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap" as const }}>
          <div style={{ display: "inline-block", animation: "r01marquee 30s linear infinite reverse" }}>
            {[...marquee.bottom, ...marquee.bottom].map((t, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginRight: 32 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ 3. REASONS ═══ */}
        <section id="reasons" style={{ padding: secPad, background: C.bg }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="reasons" label="REASONS" title="選ばれる理由" />
            {reasons.map((r, i) => (
              <FadeIn key={i} delay={i * 0.15} direction={i % 2 === 0 ? "left" : "right"}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : i % 2 === 0 ? "row" : "row-reverse",
                    gap: isMobile ? 20 : 40,
                    marginBottom: 56,
                    alignItems: "center",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: isMobile ? "100%" : "45%",
                      flexShrink: 0,
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img
                      src={IMG.strength(i + 1)}
                      alt={r.title}
                      style={{ width: "100%", height: isMobile ? 200 : 260, objectFit: "cover", display: "block" }}
                    />
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Oswald',sans-serif",
                        fontWeight: 900,
                        fontSize: 64,
                        color: C.accentLight,
                        lineHeight: 1,
                        marginBottom: -12,
                      }}
                    >
                      {r.num}
                    </div>
                    <h3 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.4 }}>
                      {r.title}
                    </h3>
                    <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, whiteSpace: "pre-line" }}>
                      {r.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══ 4. JOBS ═══ */}
        <section id="jobs" style={{ padding: secPad, background: C.bgSub }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="jobs" label="JOBS" title="求人情報" />

            {/* Banner */}
            <FadeIn>
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  marginBottom: 32,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                <img src={IMG.jobs} alt="求人情報" style={{ width: "100%", height: isMobile ? 180 : 280, objectFit: "cover", display: "block" }} />
              </div>
            </FadeIn>

            {/* Intro */}
            <FadeIn delay={0.1}>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 32, whiteSpace: "pre-line" }}>
                {jobs.intro}
              </p>
            </FadeIn>

            {/* Data Table */}
            <FadeIn delay={0.2}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  border: `1px solid ${C.border}`,
                }}
              >
                {jobs.rows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      borderBottom: i < jobs.rows.length - 1 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "100%" : 140,
                        flexShrink: 0,
                        padding: "14px 20px",
                        background: C.accentLight,
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.accent,
                      }}
                    >
                      {row.dt}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        fontSize: 14,
                        color: row.accent ? C.accent : C.text,
                        fontWeight: row.accent ? 700 : 400,
                        lineHeight: 1.6,
                      }}
                    >
                      {row.accent ? (
                        <span>
                          月収
                          <CounterNum end={hero.salaryMin} suffix="" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 22, color: C.accent, margin: "0 2px" }} />
                          ~
                          <CounterNum end={hero.salaryMax} suffix="" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 22, color: C.accent, margin: "0 2px" }} />
                          万円（日給18,000円~ or 個数制150~180円/個）
                        </span>
                      ) : row.dd}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Requirements */}
            <FadeIn delay={0.3}>
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, textAlign: "center" }}>応募資格</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {jobs.requirements.map((req, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        background: C.white,
                        borderRadius: 8,
                        fontSize: 13,
                        color: C.text,
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 5. BENEFITS ═══ */}
        <section id="benefits" style={{ padding: secPad, background: C.accentLight }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="benefits" label="BENEFITS" title="待遇・福利厚生" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 20,
              }}
            >
              {benefits.map((b, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="scale">
                  <div
                    style={{
                      background: C.white,
                      borderRadius: 16,
                      padding: 28,
                      boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                      border: `1px solid ${C.border}`,
                      height: "100%",
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)";
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 12,
                        background: C.accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.accent,
                        marginBottom: 16,
                      }}
                    >
                      {benefitIcons[i]}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.4 }}>
                      {b.title}
                    </h3>
                    <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, whiteSpace: "pre-line", margin: 0 }}>
                      {b.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. DAILY ═══ */}
        <section id="daily" style={{ padding: secPad, background: C.bg }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="daily" label="DAILY SCHEDULE" title="1日の流れ" />

            {/* Banner */}
            <FadeIn>
              <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 32 }}>
                <img src={IMG.dailyFlow} alt="1日の流れ" style={{ width: "100%", height: isMobile ? 160 : 240, objectFit: "cover", display: "block" }} />
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 40, whiteSpace: "pre-line" }}>
                {daily.intro}
              </p>
            </FadeIn>

            {/* Vertical Timeline */}
            <div style={{ position: "relative", paddingLeft: isMobile ? 40 : 60 }}>
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: isMobile ? 16 : 24,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: C.border,
                }}
              />
              {daily.steps.map((step, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div style={{ position: "relative", marginBottom: 36, paddingBottom: i === daily.steps.length - 1 ? 0 : 0 }}>
                    {/* Dot */}
                    <div
                      style={{
                        position: "absolute",
                        left: isMobile ? -32 : -44,
                        top: 4,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: C.accent,
                        border: `3px solid ${C.white}`,
                        boxShadow: `0 0 0 2px ${C.accent}`,
                      }}
                    />
                    {/* Time */}
                    <div
                      style={{
                        fontFamily: "'Oswald',sans-serif",
                        fontWeight: 700,
                        fontSize: 20,
                        color: C.accent,
                        marginBottom: 4,
                      }}
                    >
                      {step.time}
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 7. GALLERY ═══ */}
        <section id="gallery" style={{ padding: secPad, background: C.bgSub }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="gallery" label="GALLERY" title="職場の雰囲気" />
            <FadeIn delay={0.1}>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 32 }}>
                {gallery.intro}
              </p>
            </FadeIn>

            {/* Masonry Grid */}
            <div
              style={{
                columnCount: isMobile ? 1 : 2,
                columnGap: 16,
              }}
            >
              {gallery.images.map((img, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="scale">
                  <div
                    style={{
                      breakInside: "avoid" as const,
                      marginBottom: 16,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: C.white,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: i % 3 === 0 ? 280 : 200,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: 12, color: C.textSub, margin: 0 }}>{img.caption}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 8. VOICES ═══ */}
        <section id="voices" style={{ padding: secPad, background: C.bg }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="voices" label="VOICES" title="先輩の声" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 24,
              }}
            >
              {voices.map((v, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <div
                    style={{
                      position: "relative",
                      background: C.white,
                      borderRadius: 16,
                      padding: 28,
                      boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {/* Speech bubble triangle */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: -10,
                        left: 32,
                        width: 0,
                        height: 0,
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderTop: `10px solid ${C.white}`,
                        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.04))",
                      }}
                    />
                    {/* Quote icon */}
                    <svg viewBox="0 0 24 24" fill={C.accentLight} style={{ width: 32, height: 32, marginBottom: 8, opacity: 0.8 }}>
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    </svg>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${C.accentLight}, ${C.accent}20)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 16,
                          color: C.accent,
                        }}
                      >
                        {v.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{v.name}（{v.age}）</div>
                        <div style={{ fontSize: 11, color: C.textSub }}>{v.prev}</div>
                      </div>
                    </div>
                    {/* Text */}
                    <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9, whiteSpace: "pre-line", margin: "0 0 12px" }}>
                      {v.text}
                    </p>
                    {/* Highlight */}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        background: C.accentLight,
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.accent,
                      }}
                    >
                      {v.highlight}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 9. FAQ ═══ */}
        <section id="faq" style={{ padding: secPad, background: C.bgSub }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="faq" label="FAQ" title="よくある質問" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faq.map((item, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div
                    style={{
                      background: C.white,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: `1px solid ${faqOpen === i ? C.accent : C.border}`,
                      transition: "border-color 0.3s",
                    }}
                  >
                    <button
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "18px 20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <span
                          style={{
                            fontFamily: "'Oswald',sans-serif",
                            fontWeight: 700,
                            fontSize: 18,
                            color: C.accent,
                            flexShrink: 0,
                          }}
                        >
                          Q
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.5 }}>
                          {item.q}
                        </span>
                      </div>
                      {/* Chevron */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={C.textSub}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          width: 20,
                          height: 20,
                          flexShrink: 0,
                          transform: faqOpen === i ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.3s",
                        }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {faqOpen === i && (
                      <div
                        style={{
                          padding: "0 20px 20px",
                          animation: "r01fadeInUp 0.3s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            padding: "16px",
                            background: C.accentLight,
                            borderRadius: 8,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Oswald',sans-serif",
                              fontWeight: 700,
                              fontSize: 18,
                              color: C.accent,
                              flexShrink: 0,
                            }}
                          >
                            A
                          </span>
                          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.9, whiteSpace: "pre-line", margin: 0 }}>
                            {item.a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 10. NEWS ═══ */}
        <section id="news" style={{ padding: secPad, background: C.bg }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="news" label="NEWS" title="お知らせ" />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {news.map((n, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: isMobile ? "flex-start" : "center",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? 8 : 16,
                      padding: "20px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, color: C.textSub, letterSpacing: "0.05em" }}>
                        {n.date}
                      </span>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.white,
                          background:
                            n.tagStyle === "urgent"
                              ? "#ef4444"
                              : n.tagStyle === "new"
                              ? C.accent
                              : C.textSub,
                        }}
                      >
                        {n.tag}
                      </span>
                    </div>
                    <span style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                      {n.title}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 11. COMPANY ═══ */}
        <section
          id="company"
          style={{
            position: "relative",
            padding: secPad,
            minHeight: 360,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG.company})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.35)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(26,43,60,0.7)" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: maxW, margin: "0 auto" }}>
            <SectionTitle id="company" label="COMPANY" title="会社概要" onDark />
            <FadeIn>
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {companyInfo.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      borderBottom: i < companyInfo.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "100%" : 140,
                        flexShrink: 0,
                        padding: "14px 20px",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {row.dt}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        fontSize: 14,
                        color: C.white,
                        lineHeight: 1.6,
                      }}
                    >
                      {row.dd}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 12. APPLY FORM ═══ */}
        <section id="apply" style={{ padding: secPad, background: C.bgSub }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <SectionTitle id="apply" label="APPLY" title="応募フォーム" />
            <FadeIn>
              <form
                onSubmit={handleSubmit}
                style={{
                  background: C.white,
                  borderRadius: 16,
                  padding: isMobile ? 24 : 40,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  border: `1px solid ${C.border}`,
                }}
              >
                {[
                  { name: "name", label: "お名前", placeholder: "例：山田 太郎", type: "text", required: true },
                  { name: "kana", label: "フリガナ", placeholder: "例：ヤマダ タロウ", type: "text", required: true },
                  { name: "phone", label: "電話番号", placeholder: "例：090-1234-5678", type: "tel", required: true },
                  { name: "email", label: "メールアドレス", placeholder: "例：yamada@example.com", type: "email", required: false },
                ].map((field) => (
                  <div key={field.name} style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>
                      {field.label}
                      {field.required && <span style={{ color: "#ef4444", marginLeft: 4, fontSize: 11 }}>*</span>}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleForm}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        fontSize: 14,
                        color: C.text,
                        outline: "none",
                        transition: "border-color 0.2s",
                        background: C.bgSub,
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                    />
                  </div>
                ))}

                {/* Age Select */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>
                    年齢
                  </label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleForm}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 14,
                      color: C.text,
                      outline: "none",
                      background: C.bgSub,
                      appearance: "none" as const,
                    }}
                  >
                    <option value="">例：30代</option>
                    <option value="10代">10代</option>
                    <option value="20代">20代</option>
                    <option value="30代">30代</option>
                    <option value="40代">40代</option>
                    <option value="50代">50代</option>
                    <option value="60代以上">60代以上</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>
                    メッセージ
                  </label>
                  <textarea
                    name="message"
                    placeholder="例：週3日から始めたいのですが可能ですか？"
                    rows={4}
                    value={formData.message}
                    onChange={handleForm}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 14,
                      color: C.text,
                      outline: "none",
                      resize: "vertical" as const,
                      fontFamily: "inherit",
                      background: C.bgSub,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: C.accent,
                    color: C.white,
                    border: "none",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                >
                  送信する
                </button>
              </form>
            </FadeIn>

            {/* Truck Animation */}
            <div style={{ marginTop: 40, overflow: "hidden", height: 60 }}>
              <div style={{ animation: "r01truckDrive 8s linear infinite" }}>
                <svg viewBox="0 0 80 40" fill="none" style={{ width: 60, height: 40 }}>
                  <rect x="0" y="8" width="48" height="24" rx="3" fill={C.accent} />
                  <rect x="48" y="16" width="20" height="16" rx="2" fill={C.accentDark} />
                  <circle cx="16" cy="34" r="5" fill={C.navy} />
                  <circle cx="16" cy="34" r="2" fill={C.white} />
                  <circle cx="58" cy="34" r="5" fill={C.navy} />
                  <circle cx="58" cy="34" r="2" fill={C.white} />
                  <rect x="52" y="20" width="10" height="6" rx="1" fill="rgba(255,255,255,0.3)" />
                  <path d="M2 14h20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M2 20h16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 13. CTA ═══ */}
        <section
          style={{
            position: "relative",
            padding: isMobile ? "60px 16px" : "80px 48px",
            minHeight: 320,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG.delivery})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.5)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,0.3)" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
            <FadeIn>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 20,
                  padding: isMobile ? 32 : 48,
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <h2
                  style={{
                    fontWeight: 800,
                    fontSize: isMobile ? 22 : 28,
                    color: C.white,
                    lineHeight: 1.5,
                    marginBottom: 16,
                    whiteSpace: "pre-line",
                  }}
                >
                  {cta.heading}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.9,
                    whiteSpace: "pre-line",
                    marginBottom: 28,
                  }}
                >
                  {cta.subtext}
                </p>
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, justifyContent: "center" }}>
                  <a
                    href={`tel:${company.phone}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 32px",
                      background: C.white,
                      color: C.accent,
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {company.phone}
                  </a>
                  <button
                    onClick={() => scrollTo("apply")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 32px",
                      background: "transparent",
                      color: C.white,
                      border: `2px solid ${C.white}`,
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                    {cta.webLabel}
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 14. FOOTER ═══ */}
        <footer
          style={{
            position: "relative",
            padding: isMobile ? "60px 16px 24px" : "80px 48px 24px",
            overflow: "hidden",
          }}
        >
          {/* Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG.footerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.3)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: `rgba(26,43,60,0.85)` }} />

          <div style={{ position: "relative", zIndex: 2, maxWidth: maxW, margin: "0 auto" }}>
            {/* Catchphrase */}
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <p
                  style={{
                    fontFamily: "'Zen Kurenaido', sans-serif",
                    fontSize: isMobile ? 18 : 24,
                    color: C.white,
                    lineHeight: 1.6,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {footer.catchphrase}
                </p>
              </div>
            </FadeIn>

            {/* Footer content */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "center" : "flex-start",
                gap: 32,
                marginBottom: 40,
              }}
            >
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, justifyContent: isMobile ? "center" : "flex-start" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontFamily: "'Oswald',sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    GL
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, color: C.white }}>
                      Green Logistics
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                      {company.name}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  <div>{company.address}</div>
                  <div>TEL: {company.phone}</div>
                  <div>{company.hours}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: isMobile ? "center" : "flex-end" }}>
                {SECTION_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    style={{
                      padding: "6px 14px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 6,
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.color = C.white;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }}
                  >
                    {NAV_LABELS[id]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cityscape SVG */}
            <div style={{ marginBottom: 24, opacity: 0.15 }}>
              <svg viewBox="0 0 960 80" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
                {/* Buildings */}
                <rect x="0" y="30" width="30" height="50" fill="white" />
                <rect x="35" y="20" width="20" height="60" fill="white" />
                <rect x="60" y="35" width="25" height="45" fill="white" />
                <rect x="90" y="10" width="35" height="70" fill="white" />
                <rect x="130" y="25" width="20" height="55" fill="white" />
                <rect x="155" y="40" width="30" height="40" fill="white" />
                <rect x="190" y="15" width="25" height="65" fill="white" />
                <rect x="220" y="30" width="40" height="50" fill="white" />
                <rect x="265" y="20" width="20" height="60" fill="white" />
                <rect x="290" y="5" width="30" height="75" fill="white" />
                <rect x="325" y="35" width="25" height="45" fill="white" />
                <rect x="355" y="25" width="35" height="55" fill="white" />
                <rect x="395" y="40" width="20" height="40" fill="white" />
                <rect x="420" y="10" width="40" height="70" fill="white" />
                <rect x="465" y="30" width="25" height="50" fill="white" />
                <rect x="495" y="20" width="30" height="60" fill="white" />
                <rect x="530" y="35" width="20" height="45" fill="white" />
                <rect x="555" y="15" width="35" height="65" fill="white" />
                <rect x="595" y="25" width="25" height="55" fill="white" />
                <rect x="625" y="40" width="30" height="40" fill="white" />
                <rect x="660" y="10" width="20" height="70" fill="white" />
                <rect x="685" y="30" width="40" height="50" fill="white" />
                <rect x="730" y="20" width="25" height="60" fill="white" />
                <rect x="760" y="35" width="30" height="45" fill="white" />
                <rect x="795" y="5" width="35" height="75" fill="white" />
                <rect x="835" y="25" width="20" height="55" fill="white" />
                <rect x="860" y="40" width="30" height="40" fill="white" />
                <rect x="895" y="15" width="25" height="65" fill="white" />
                <rect x="925" y="30" width="35" height="50" fill="white" />
                {/* Windows */}
                {[0, 35, 90, 130, 190, 220, 290, 355, 420, 495, 555, 625, 685, 760, 795, 860, 925].map((x, idx) => (
                  <React.Fragment key={idx}>
                    <rect x={x + 4} y={45} width="4" height="4" fill="rgba(255,255,200,0.6)" />
                    <rect x={x + 12} y={45} width="4" height="4" fill="rgba(255,255,200,0.4)" />
                    <rect x={x + 4} y={55} width="4" height="4" fill="rgba(255,255,200,0.3)" />
                    <rect x={x + 12} y={55} width="4" height="4" fill="rgba(255,255,200,0.5)" />
                  </React.Fragment>
                ))}
              </svg>
            </div>

            {/* Copyright */}
            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 16,
              }}
            >
              &copy; {new Date().getFullYear()} {company.name} All Rights Reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
