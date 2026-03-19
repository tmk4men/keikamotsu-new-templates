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
  dark: "#1a1a1a",
};

const BP = 768;
const IMG = "/keikamotsu-new-templates/images";
const SIDEBAR_W = 240;

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
  phone: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  chevronDown: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  menu: (size = 24, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (size = 24, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  send: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  arrowRight: (size = 20, color = "currentColor") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

const navIcons: Record<string, (s?: number, c?: string) => React.ReactNode> = {
  services: Icons.truck,
  strengths: Icons.shield,
  message: Icons.quote,
  company: Icons.building,
  history: Icons.clock,
  numbers: Icons.barChart,
  partners: Icons.handshake,
  news: Icons.newspaper,
  recruit: Icons.users,
  access: Icons.mapPin,
  contact: Icons.mail,
};

/* ───────────────────── HOOKS ───────────────────── */
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < BP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

function useTypewriter(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
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
  }, [text, speed]);
  return { displayed, done };
}

/* ───────────────────── COMPONENTS ───────────────────── */
function FadeIn({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
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
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ${delay}s ease-out, transform 0.7s ${delay}s ease-out`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CounterNum({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const numericStr = value.replace(/,/g, "");
          const target = parseFloat(numericStr);
          const isFloat = numericStr.includes(".");
          const duration = 2000;
          const steps = 60;
          const inc = target / steps;
          let current = 0;
          const iv = setInterval(() => {
            current += inc;
            if (current >= target) {
              current = target;
              clearInterval(iv);
            }
            if (isFloat) {
              setDisplay(current.toFixed(1));
            } else {
              const rounded = Math.floor(current);
              setDisplay(rounded.toLocaleString());
            }
          }, duration / steps);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ───────────────────── HISTORY HORIZONTAL SCROLL ───────────────────── */
function HistoryHScroll({ items, mobile }: { items: typeof history; mobile: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("history");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / sectionH));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalW = items.length * (mobile ? 280 : 320) + 80;
  const viewW = typeof window !== "undefined" ? window.innerWidth - (mobile ? 0 : SIDEBAR_W) : 1000;
  const maxTranslate = Math.max(0, totalW - viewW);
  const translateX = -progress * maxTranslate;

  return (
    <div style={{ overflow: "hidden", height: "calc(100vh - 120px)", display: "flex", alignItems: "center" }}>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          gap: 20,
          padding: mobile ? "0 16px" : "0 60px",
          transform: `translateX(${translateX}px)`,
          transition: "transform 0.1s linear",
          willChange: "transform",
        }}
      >
        {items.map((h, i) => (
          <div
            key={i}
            style={{
              minWidth: mobile ? 260 : 300,
              borderRadius: 16,
              overflow: "hidden",
              background: C.white,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              flexShrink: 0,
              opacity: progress > 0 ? 1 : 0,
              transform: progress > 0 ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
            }}
          >
            <div style={{ height: 160, position: "relative", overflow: "hidden" }}>
              <img
                src={`${IMG}/history-${2021 + i}.webp`}
                alt={h.year}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: 12, left: 16, fontSize: 32, fontWeight: 800, color: C.white, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                {h.year}
              </div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{h.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── SIDEBAR NAV ───────────────────── */
function Sidebar({
  activeSection,
  mobile,
  onClose,
}: {
  activeSection: string;
  mobile: boolean;
  onClose?: () => void;
}) {
  const sidebarLinks = navLinks.map((l) => ({
    id: l.href.replace("#", ""),
    label: l.label,
  }));

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        width: mobile ? "100%" : SIDEBAR_W,
        height: mobile ? "100vh" : "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        background: C.white,
        borderRight: mobile ? "none" : `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        boxShadow: mobile ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 20px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.accent,
              letterSpacing: 1,
            }}
          >
            GREEN LOGISTICS
          </div>
          <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>
            {company.nameEn}
          </div>
        </div>
        {mobile && onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.text,
            }}
          >
            {Icons.close(24)}
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {sidebarLinks.map((link) => {
          const isActive = activeSection === link.id;
          const iconFn = navIcons[link.id];
          return (
            <button
              key={link.id}
              onClick={() => handleClick(link.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 20px",
                border: "none",
                background: isActive ? C.accentLight : "transparent",
                cursor: "pointer",
                borderLeft: isActive
                  ? `3px solid ${C.accent}`
                  : "3px solid transparent",
                color: isActive ? C.accent : C.textSub,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              {iconFn && iconFn(16)}
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Phone at bottom */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: C.accent,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {Icons.phone(16, C.accent)}
          {company.phone}
        </div>
        <div style={{ fontSize: 10, color: C.textSub, marginTop: 4 }}>
          {company.hours}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── MOBILE BOTTOM BAR ───────────────────── */
function MobileBottomBar({
  activeSection,
  onMenuOpen,
}: {
  activeSection: string;
  onMenuOpen: () => void;
}) {
  const quickLinks = [
    { id: "services", label: "事業", icon: Icons.truck },
    { id: "strengths", label: "強み", icon: Icons.shield },
    { id: "recruit", label: "採用", icon: Icons.users },
    { id: "contact", label: "連絡", icon: Icons.mail },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "6px 0",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
      }}
    >
      {quickLinks.map((link) => {
        const isActive = activeSection === link.id;
        return (
          <button
            key={link.id}
            onClick={() => {
              const el = document.getElementById(link.id);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? C.accent : C.textSub,
              fontSize: 10,
              padding: "4px 8px",
            }}
          >
            {link.icon(20, isActive ? C.accent : C.textSub)}
            {link.label}
          </button>
        );
      })}
      <button
        onClick={onMenuOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.textSub,
          fontSize: 10,
          padding: "4px 8px",
        }}
      >
        {Icons.menu(20, C.textSub)}
        全て
      </button>
    </div>
  );
}

/* ───────────────────── MAIN PAGE ───────────────────── */
export default function CP05() {
  const mobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { displayed: heroText, done: heroDone } = useTypewriter(
    hero.headline,
    60
  );
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const historyScrollRef = useRef<HTMLDivElement>(null);

  /* ---- Scrollspy ---- */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    },
    []
  );

  const placeholders: Record<string, string> = {
    company: "例）グリーンロジスティクス株式会社",
    name: "例）山田 太郎",
    email: "例）info@example.com",
    phone: "例）090-1234-5678",
    message: "例）配送サービスについて詳しく知りたいです。",
  };

  const contentLeft = mobile ? 0 : SIDEBAR_W;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kurenaido&family=Yomogi&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif; color: ${C.text}; background: ${C.bg}; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }
        @keyframes scrollArrow { 0%,100% { transform: translateY(0); opacity:1; } 50% { transform: translateY(12px); opacity:0.3; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes truckDrive { 0% { transform: translateX(-200px); } 100% { transform: translateX(calc(100vw)); } }
        @keyframes underlineGrow { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        @keyframes fadeInUp { 0% { opacity:0; transform:translateY(24px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes handwrite { 0% { width: 0; opacity: 0; } 10% { opacity: 1; } 100% { width: 100%; opacity: 1; } }
        .bento-card:hover { transform: scale(1.02); }
        .cp05-h-ul { position: relative; display: inline-flex; align-items: center; gap: 12px; padding-bottom: 8px; }
        .cp05-h-ul::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: ${C.accent}; transform: scaleX(0); transform-origin: left; animation: underlineGrow 0.8s ease 0.3s forwards; }
        .news-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-4px); }
        input:focus, textarea:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentLight}; }
      `}</style>

      {/* ---- SIDEBAR (desktop) ---- */}
      {!mobile && <Sidebar activeSection={activeSection} mobile={false} />}

      {/* ---- MOBILE BOTTOM BAR ---- */}
      {mobile && (
        <MobileBottomBar
          activeSection={activeSection}
          onMenuOpen={() => setMenuOpen(true)}
        />
      )}

      {/* ---- MOBILE SIDEBAR OVERLAY ---- */}
      {mobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar
              activeSection={activeSection}
              mobile={true}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ════════════════════ CONTENT AREA ════════════════════ */}
      <main style={{ marginLeft: contentLeft }}>
        {/* ──── HERO ──── */}
        <section
          id="hero"
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <img
            src={`${IMG}/hero-bg.webp`}
            alt="Hero background"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: mobile ? "0 24px" : "0 80px",
            }}
          >
            <h1
              style={{
                fontSize: mobile ? 32 : 56,
                fontWeight: 800,
                color: C.white,
                textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                lineHeight: 1.3,
                letterSpacing: 2,
              }}
            >
              {heroText}
              {!heroDone && (
                <span
                  style={{
                    borderRight: `3px solid ${C.white}`,
                    marginLeft: 2,
                    animation: "fadeInUp 0.5s infinite alternate",
                  }}
                />
              )}
            </h1>
            <div style={{ marginTop: 24 }}>
              {hero.subtext.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: mobile ? 14 : 18,
                    color: "rgba(255,255,255,0.9)",
                    textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                    lineHeight: 1.8,
                    maxWidth: 640,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          {/* Scroll arrow */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              animation: "scrollArrow 2s infinite",
              color: C.white,
              zIndex: 2,
            }}
          >
            {Icons.chevronDown(32, C.white)}
          </div>
        </section>

        {/* ──── SERVICES (Bento Grid) ──── */}
        <section
          id="services"
          style={{ padding: mobile ? "64px 16px" : "100px 60px" }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                marginBottom: 48,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                position: "relative" as const,
                paddingBottom: 8,
              }}
            >
              {Icons.truck(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>事業</span>内容
              </span>
            </h2>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gridTemplateRows: mobile ? "auto" : "200px 200px",
              gap: 16,
            }}
          >
            {services.map((s, i) => (
              <FadeIn
                key={i}
                delay={i * 0.1}
                className="bento-card"
                style={{
                  gridRow: !mobile && i === 0 ? "1 / 3" : undefined,
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  minHeight: mobile ? 200 : i === 0 ? "auto" : 200,
                  cursor: "default",
                  transition: "transform 0.3s",
                }}
              >
                <img
                  src={`${IMG}/service-${["route","ec","b2b","spot"][i]}.webp`}
                  alt={s.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: mobile ? 20 : 28,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: C.accent,
                      fontWeight: 700,
                      letterSpacing: 2,
                    }}
                  >
                    {s.num}
                  </span>
                  <h3
                    style={{
                      fontSize: mobile ? 18 : 22,
                      fontWeight: 700,
                      color: C.white,
                      marginTop: 4,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.7,
                      marginTop: 8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ──── STRENGTHS (Alternating full-bleed rows) ──── */}
        <section id="strengths" style={{ padding: mobile ? "64px 0" : "100px 0" }}>
          <FadeIn style={{ padding: mobile ? "0 16px" : "0 60px", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {Icons.shield(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>私たちの</span>強み
              </span>
            </h2>
          </FadeIn>

          {strengths.map((s, i) => {
            const imgLeft = i % 2 === 0;
            return (
              <FadeIn key={i} delay={i * 0.15}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: mobile
                      ? "column"
                      : imgLeft
                      ? "row"
                      : "row-reverse",
                    minHeight: mobile ? "auto" : 360,
                  }}
                >
                  <div
                    style={{
                      width: mobile ? "100%" : "60%",
                      position: "relative",
                      minHeight: mobile ? 220 : 360,
                    }}
                  >
                    <img
                      src={`${IMG}/strength-0${i+1}.webp`}
                      alt={s.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: mobile ? "100%" : "40%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: mobile ? "32px 24px" : "48px 56px",
                      background: i % 2 === 0 ? C.bgSub : C.white,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 48,
                        fontWeight: 800,
                        color: C.accentLight,
                        lineHeight: 1,
                      }}
                    >
                      {s.num}
                    </span>
                    <h3
                      style={{
                        fontSize: mobile ? 20 : 26,
                        fontWeight: 700,
                        marginTop: 8,
                        lineHeight: 1.4,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.9,
                        color: C.textSub,
                        marginTop: 16,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {s.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </section>

        {/* ──── CEO MESSAGE (Quote style) ──── */}
        <section
          id="message"
          style={{
            padding: mobile ? "64px 24px" : "100px 60px",
            background: C.bgSub,
            textAlign: "center",
          }}
        >
          <FadeIn>
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 40px",
                border: `4px solid ${C.accent}`,
              }}
            >
              <img
                src={`${IMG}/ceo-portrait.webp`}
                alt={ceoMessage.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Decorative quote mark */}
            <div
              style={{
                fontSize: 72,
                color: C.accent,
                opacity: 0.2,
                lineHeight: 1,
                fontFamily: "Georgia, serif",
                marginBottom: -20,
              }}
            >
              &ldquo;
            </div>
            <div
              style={{
                maxWidth: 720,
                margin: "0 auto",
              }}
            >
              {ceoMessage.message.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: mobile ? 15 : 17,
                    lineHeight: 2,
                    color: C.text,
                    fontStyle: "italic",
                    marginBottom: 20,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
            <div
              style={{
                fontSize: 72,
                color: C.accent,
                opacity: 0.2,
                lineHeight: 1,
                fontFamily: "Georgia, serif",
                marginTop: -20,
              }}
            >
              &rdquo;
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {ceoMessage.name}
              </div>
              <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>
                {ceoMessage.title}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ──── COMPANY OVERVIEW ──── */}
        <section
          id="company"
          style={{ padding: mobile ? "64px 16px" : "100px 60px" }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                marginBottom: 48,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                position: "relative" as const,
                paddingBottom: 8,
              }}
            >
              {Icons.building(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>会社</span>概要
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div
              style={{
                maxWidth: 800,
                borderTop: `2px solid ${C.accent}`,
              }}
            >
              {companyOverview.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: mobile ? "column" : "row",
                    borderBottom: `1px solid ${C.border}`,
                    padding: mobile ? "14px 0" : "16px 0",
                  }}
                >
                  <div
                    style={{
                      width: mobile ? "100%" : 160,
                      fontWeight: 600,
                      fontSize: 14,
                      color: C.accent,
                      flexShrink: 0,
                      marginBottom: mobile ? 4 : 0,
                    }}
                  >
                    {item.dt}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.7 }}>{item.dd}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ──── HISTORY (Sticky horizontal scroll) ──── */}
        <section
          id="history"
          style={{
            background: C.bgSub,
            height: `${(history.length + 1) * 100}vh`,
            position: "relative",
          }}
        >
          <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
            <div style={{ padding: mobile ? "40px 16px 20px" : "60px 60px 20px" }}>
              <h2 className="cp05-heading-underline visible" style={{ fontSize: mobile ? 24 : 36, fontWeight: 700, display: "flex", alignItems: "center", gap: 12 }}>
                {Icons.clock(28, C.accent)}
                <span><span style={{ color: C.accent }}>沿</span>革</span>
              </h2>
            </div>
            <HistoryHScroll items={history} mobile={mobile} />
          </div>
        </section>

        {/* ──── NUMBERS (Dark section, 2x2 grid) ──── */}
        <section
          id="numbers"
          style={{
            padding: mobile ? "64px 16px" : "100px 60px",
            background: C.dark,
            color: C.white,
          }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                marginBottom: 56,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {Icons.barChart(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>数字で</span>見る実績
              </span>
            </h2>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            {numbers.map((n, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  style={{
                    padding: mobile ? "32px 16px" : "48px 40px",
                    textAlign: "center",
                    borderRight:
                      !mobile && i % 2 === 0
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",
                    borderBottom:
                      i < 2
                        ? "1px solid rgba(255,255,255,0.15)"
                        : mobile && i < 3
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: mobile ? 40 : 56,
                      fontWeight: 800,
                      color: C.accent,
                      lineHeight: 1,
                    }}
                  >
                    <CounterNum value={n.value} suffix={n.suffix} />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.7)",
                      marginTop: 12,
                    }}
                  >
                    {n.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ──── PARTNERS (Marquee + Truck) ──── */}
        <section
          id="partners"
          style={{ padding: mobile ? "64px 0" : "100px 0", overflow: "hidden" }}
        >
          <FadeIn
            style={{
              padding: mobile ? "0 16px" : "0 60px",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {Icons.handshake(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>主要</span>取引先
              </span>
            </h2>
          </FadeIn>

          {/* Logo Marquee */}
          <div
            style={{
              overflow: "hidden",
              padding: "24px 0",
              background: C.bgSub,
            }}
          >
            <div
              style={{
                display: "flex",
                animation: "marquee 25s linear infinite",
                width: "fit-content",
              }}
            >
              {[...partners, ...partners].map((p, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: 180,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 24px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 48,
                      objectFit: "contain",
                      opacity: 0.6,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Truck animation with cityscape */}
          <div
            style={{
              position: "relative",
              height: 120,
              marginTop: 32,
              overflow: "hidden",
            }}
          >
            {/* Cityscape silhouette */}
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: 0,
                right: 0,
                height: 60,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                opacity: 0.06,
              }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: `${3 + Math.random() * 4}%`,
                    height: `${30 + Math.random() * 70}%`,
                    background: C.text,
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              ))}
            </div>
            {/* Road */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                height: 2,
                background: C.border,
              }}
            />
            {/* Truck */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 0,
                animation: "truckDrive 8s linear infinite",
                color: C.accent,
              }}
            >
              {Icons.truck(40, C.accent)}
            </div>
          </div>
        </section>

        {/* ──── NEWS (Card grid, first large) ──── */}
        <section
          id="news"
          style={{
            padding: mobile ? "64px 16px" : "100px 60px",
            background: C.bgSub,
          }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                marginBottom: 48,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                position: "relative" as const,
                paddingBottom: 8,
              }}
            >
              {Icons.newspaper(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>お知</span>らせ
              </span>
            </h2>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gap: 20,
            }}
          >
            {news.map((n, i) => {
              const isFirst = i === 0;
              const tagColors: Record<string, string> = {
                press: "#e74c3c",
                new: C.accent,
                default: "#6b7280",
              };
              return (
                <FadeIn
                  key={i}
                  delay={i * 0.1}
                  className="news-card"
                  style={{
                    gridColumn:
                      !mobile && isFirst ? "1 / 3" : undefined,
                    background: C.white,
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {isFirst && (
                    <div
                      style={{
                        height: mobile ? 160 : 200,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`${IMG}/vehicle.webp`}
                        alt={n.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      padding: isFirst ? "20px 24px" : "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: C.textSub,
                        }}
                      >
                        {n.date}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 10px",
                          borderRadius: 99,
                          color: C.white,
                          background: tagColors[n.tagStyle] || tagColors.default,
                        }}
                      >
                        {n.tag}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: isFirst ? 18 : 15,
                        fontWeight: 600,
                        lineHeight: 1.6,
                      }}
                    >
                      {n.title}
                    </h3>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* ──── RECRUIT (Accent banner + underline animation) ──── */}
        <section
          id="recruit"
          style={{
            padding: mobile ? "64px 16px" : "100px 60px",
            background: C.accent,
            color: C.white,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.08,
            }}
          >
            <img
              src={`${IMG}/delivery.webp`}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <FadeIn>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {Icons.users(28, C.white)}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Recruit
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Zen Kurenaido', 'Yomogi', sans-serif",
                  fontSize: mobile ? 24 : 42,
                  fontWeight: 700,
                  lineHeight: 1.5,
                  position: "relative",
                  display: "inline-block",
                  paddingBottom: 8,
                  overflow: "hidden",
                }}
              >
                <span style={{ display: "inline-block", animation: "handwrite 1.5s ease-out forwards", whiteSpace: "nowrap", overflow: "hidden" }}>
                  {recruit.heading}
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                    background: C.white,
                    borderRadius: 2,
                    transformOrigin: "left",
                    animation: "underlineGrow 1.2s ease-out 0.5s forwards",
                    transform: "scaleX(0)",
                  }}
                />
              </h2>
              <p
                style={{
                  fontSize: mobile ? 14 : 16,
                  lineHeight: 2,
                  marginTop: 24,
                  maxWidth: 640,
                  opacity: 0.9,
                  whiteSpace: "pre-line",
                }}
              >
                {recruit.text}
              </p>
              <a
                href={recruit.link}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 32,
                  padding: "14px 36px",
                  background: C.white,
                  color: C.accent,
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: 15,
                  transition: "transform 0.2s",
                }}
              >
                {recruit.cta}
                {Icons.arrowRight(18, C.accent)}
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ──── ACCESS ──── */}
        <section
          id="access"
          style={{ padding: mobile ? "64px 16px" : "100px 60px" }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                marginBottom: 48,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                position: "relative" as const,
                paddingBottom: 8,
              }}
            >
              {Icons.mapPin(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>アク</span>セス
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div
              style={{
                display: "flex",
                flexDirection: mobile ? "column" : "row",
                gap: 40,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.accent,
                        marginBottom: 4,
                      }}
                    >
                      住所
                    </div>
                    <div style={{ fontSize: 15 }}>
                      〒{company.postalCode} {access.address}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.accent,
                        marginBottom: 4,
                      }}
                    >
                      最寄り駅
                    </div>
                    <div style={{ fontSize: 15 }}>{access.nearestStation}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.accent,
                        marginBottom: 4,
                      }}
                    >
                      駐車場
                    </div>
                    <div style={{ fontSize: 15 }}>{access.mapNote}</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  minHeight: 280,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5!2d135.6281!3d34.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzAwLjAiTiAxMzXCsDM3JzQxLjAiRQ!5e0!3m2!1sja!2sjp!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 280, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ──── CONTACT (2-col form) ──── */}
        <section
          id="contact"
          style={{
            padding: mobile ? "64px 16px" : "100px 60px",
            background: C.bgSub,
          }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: mobile ? 24 : 36,
                fontWeight: 700,
                marginBottom: 48,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                position: "relative" as const,
                paddingBottom: 8,
              }}
            >
              {Icons.mail(28, C.accent)}
              <span>
                <span style={{ color: C.accent }}>お問い</span>合わせ
              </span>
            </h2>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  background: C.white,
                  borderRadius: 16,
                }}
              >
                <div style={{ color: C.accent, marginBottom: 16 }}>
                  {Icons.mail(48, C.accent)}
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  送信ありがとうございます
                </h3>
                <p style={{ fontSize: 14, color: C.textSub }}>
                  内容を確認の上、担当者よりご連絡いたします。
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <div
                style={{
                  display: "flex",
                  flexDirection: mobile ? "column" : "row",
                  gap: mobile ? 32 : 60,
                  background: C.white,
                  borderRadius: 16,
                  padding: mobile ? 24 : 48,
                  boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                }}
              >
                {/* Left: Company Info */}
                <div
                  style={{
                    flex: mobile ? "none" : "0 0 280px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 20,
                      color: C.accent,
                    }}
                  >
                    {company.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.9,
                      color: C.textSub,
                      whiteSpace: "pre-line",
                      marginBottom: 24,
                    }}
                  >
                    {contact.intro}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      fontSize: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: C.textSub,
                      }}
                    >
                      {Icons.phone(16, C.accent)}
                      {company.phone}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: C.textSub,
                      }}
                    >
                      {Icons.mail(16, C.accent)}
                      {company.email}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: C.textSub,
                      }}
                    >
                      {Icons.mapPin(16, C.accent)}
                      {company.address}
                    </div>
                  </div>
                </div>

                {/* Right: Form */}
                <form
                  onSubmit={handleSubmit}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  {contact.fields.map((f) => {
                    const isTextarea = f.type === "textarea";
                    const Tag = isTextarea ? "textarea" : "input";
                    return (
                      <div key={f.name}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 6,
                            color: C.text,
                          }}
                        >
                          {f.label}
                          {f.required && (
                            <span
                              style={{
                                color: "#e74c3c",
                                fontSize: 11,
                                marginLeft: 4,
                              }}
                            >
                              *
                            </span>
                          )}
                        </label>
                        <Tag
                          name={f.name}
                          type={isTextarea ? undefined : f.type}
                          required={f.required}
                          placeholder={placeholders[f.name] || ""}
                          value={formData[f.name] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            setFormData((prev) => ({
                              ...prev,
                              [f.name]: e.target.value,
                            }))
                          }
                          rows={isTextarea ? 5 : undefined}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            fontSize: 14,
                            background: C.bgSub,
                            color: C.text,
                            resize: isTextarea ? "vertical" : undefined,
                            transition: "border-color 0.2s, box-shadow 0.2s",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    );
                  })}
                  <button
                    type="submit"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 40px",
                      background: C.accent,
                      color: C.white,
                      border: "none",
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                      alignSelf: mobile ? "stretch" : "flex-start",
                    }}
                  >
                    {Icons.send(18, C.white)}
                    送信する
                  </button>
                </form>
              </div>
            </FadeIn>
          )}
        </section>

        {/* ──── FOOTER ──── */}
        <footer
          style={{
            padding: mobile ? "40px 16px 80px" : "48px 60px",
            background: C.dark,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Zen Kurenaido', 'Yomogi', sans-serif",
              fontSize: mobile ? 20 : 28,
              color: C.white,
              marginBottom: 16,
              whiteSpace: "nowrap",
            }}
          >
            {footer.catchphrase}
          </div>
          {/* 一筆書きシティスケープ */}
          <div style={{ width: "100%", maxWidth: 800, margin: "16px auto 20px", opacity: 0.15, lineHeight: 0 }}>
            <svg viewBox="0 0 800 40" fill="none" style={{ width: "100%", height: 40 }}>
              <path d="M0,38 L40,38 L40,22 L35,18 L30,14 L25,18 L20,22 L20,38 L80,38 L80,10 L90,10 L90,38 L120,38 L120,6 L130,2 L140,6 L140,38 L180,38 L180,16 L190,12 L200,16 L200,38 L240,38 L250,20 L255,8 L260,8 L265,20 L265,38 L320,38 L320,26 L310,22 L320,26 L320,38 L370,38 L370,12 L365,8 L370,12 L370,38 L420,38 L420,18 L430,18 L430,38 L470,38 L470,6 L465,2 L470,6 L470,38 L520,38 L520,24 L515,20 L520,24 L520,38 L570,38 L570,30 L565,26 L570,30 L570,38 L620,38 L620,14 L615,10 L620,14 L620,38 L680,38 L680,32 L670,26 L680,32 L680,38 L730,38 L730,18 L730,38 L760,38 L760,28 L760,38 L800,38" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
              <path d="M390,38 L395,38 L395,30 L400,28 L405,30 L410,28 L415,30 L415,38 L420,38" stroke="rgba(255,255,255,0.8)" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <div style={{ fontSize: 12, color: C.accent, marginBottom: 8 }}>
            {company.name}
          </div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>
            &copy; {new Date().getFullYear()} {company.nameEn} All Rights
            Reserved.
          </div>
        </footer>
      </main>
    </>
  );
}
