"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
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

/* ───────────────────────────────────────────
   色定数（NOIR - dark x gold）
   ─────────────────────────────────────────── */
const C = {
  bg1: "#0a0a0a",
  bg2: "#111111",
  bg3: "#181818",
  text: "#e5e5e5",
  white: "#ffffff",
  gold: "#c8a960",
  goldLight: "#d4bb7a",
  goldDark: "#a88b3d",
  accent: "#32373c",
  accentLight: "#555555",
  cta: "#c8a960",
  ctaHover: "#d4bb7a",
  muted: "#888888",
  label: "#999999",
  border: "#2a2a2a",
  borderLight: "#333333",
  decorLine: "#c8a960",
};

/* ───────────────────────────────────────────
   CSS Keyframes (injected via style tag)
   ─────────────────────────────────────────── */
const KEYFRAMES = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@keyframes cp01-float1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}
@keyframes cp01-float2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-2deg); }
}
@keyframes cp01-float3 {
  0%, 100% { transform: translate(0,0) rotate(0deg); }
  33% { transform: translate(10px,-12px) rotate(2deg); }
  66% { transform: translate(-5px,-8px) rotate(-1deg); }
}
@keyframes cp01-scrollChevron {
  0%, 100% { opacity: 0; transform: translateY(-6px); }
  50% { opacity: 1; transform: translateY(6px); }
}
@keyframes cp01-heroTextReveal {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}
@keyframes cp01-headingReveal {
  0% { clip-path: inset(0 100% 0 0); opacity: 0; }
  100% { clip-path: inset(0 0% 0 0); opacity: 1; }
}
@keyframes cp01-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes cp01-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,169,96,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(200,169,96,0); }
}
@keyframes cp01-shine {
  0% { left: -100%; }
  100% { left: 200%; }
}
@keyframes cp01-grain {
  0%, 100% { transform: translate(0,0); }
  10% { transform: translate(-5%,-10%); }
  30% { transform: translate(3%,-15%); }
  50% { transform: translate(12%,9%); }
  70% { transform: translate(9%,4%); }
  90% { transform: translate(-1%,7%); }
}
@keyframes cp01-countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cp01-slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes cp01-slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes cp01-scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes cp01-borderGlow {
  0%, 100% { border-color: #2a2a2a; }
  50% { border-color: #c8a960; }
}
@keyframes cp01-ripple {
  0% { transform: scale(0); opacity: 0.5; }
  100% { transform: scale(4); opacity: 0; }
}
@keyframes cp01-focusBorder {
  0% { background-size: 0% 2px; }
  100% { background-size: 100% 2px; }
}
@keyframes cp01-bgTextFloat {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-20px); }
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
`;

/* ───────────────────────────────────────────
   Typewriter フック
   ─────────────────────────────────────────── */
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

/* ───────────────────────────────────────────
   IntersectionObserver フック
   ─────────────────────────────────────────── */
function useInView(threshold = 0.15) {
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
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ───────────────────────────────────────────
   カウントアップフック
   ─────────────────────────────────────────── */
function useCountUp(target: number, start: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ───────────────────────────────────────────
   SVG Wave Divider
   ─────────────────────────────────────────── */
function WaveDivider({ color = C.bg2, flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div style={{ lineHeight: 0, overflow: "hidden", transform: flip ? "rotate(180deg)" : "none" }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
        <path d="M0,0 C480,60 960,0 1440,40 L1440,60 L0,60 Z" fill={color} />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────
   Noise/Grain Overlay
   ─────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "150px 150px",
        animation: "cp01-grain 8s steps(10) infinite",
        zIndex: 1,
      }}
    />
  );
}

/* ───────────────────────────────────────────
   Dot Grid Pattern
   ─────────────────────────────────────────── */
function DotGrid({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${C.gold} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        zIndex: 0,
      }}
    />
  );
}

/* ───────────────────────────────────────────
   セクション見出しコンポーネント (Enhanced)
   ─────────────────────────────────────────── */
function SectionHeading({
  en,
  ja,
  align = "left",
  visible = true,
}: {
  en: string;
  ja: string;
  align?: "left" | "center";
  visible?: boolean;
}) {
  return (
    <div style={{ marginBottom: 48, textAlign: align }}>
      <p
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          color: C.gold,
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 400,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
        }}
      >
        {en}
      </p>
      <h2
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.2,
          letterSpacing: "0.05em",
          animation: visible ? "cp01-headingReveal 0.8s ease forwards" : "none",
          clipPath: visible ? undefined : "inset(0 100% 0 0)",
        }}
      >
        {ja}
      </h2>
      <div
        style={{
          width: 48,
          height: 2,
          background: `linear-gradient(90deg, ${C.gold}, ${C.goldDark})`,
          marginTop: 16,
          marginLeft: align === "center" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.6s ease 0.3s",
        }}
      />
    </div>
  );
}

/* ───────────────────────────────────────────
   メインページ
   ─────────────────────────────────────────── */
export default function CP01Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroTyped = useTypewriter(hero.headline, 80, 500);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    const onScroll = () => setScrolled(window.scrollY > 60);
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    const timer = setTimeout(() => setHeroLoaded(true), 300);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  // IntersectionObservers for sections
  const svcRef = useInView(0.1);
  const strRef = useInView(0.1);
  const ceoRef = useInView(0.15);
  const coRef = useInView(0.1);
  const hisRef = useInView(0.1);
  const numRef = useInView(0.1);
  const prtRef = useInView(0.1);
  const newsRef = useInView(0.1);
  const recRef = useInView(0.1);
  const accRef = useInView(0.1);
  const ctRef = useInView(0.1);

  const fadeStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const slideInLeft = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-40px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const slideInRight = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(40px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const scaleIn = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.92)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  const wrap = (mobile: boolean): React.CSSProperties => ({
    maxWidth: 1100,
    margin: "0 auto",
    padding: mobile ? "0 20px" : "0 40px",
  });

  /* ─── Header ─── */
  const renderHeader = () => (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <div
        style={{
          ...wrap(isMobile),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: isMobile ? 60 : 72,
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: C.gold,
              letterSpacing: "0.05em",
            }}
          >
            GL
          </span>
          {!isMobile && (
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.7rem",
                color: C.text,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Green Logistics
            </span>
          )}
        </a>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.slice(0, 6).map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.78rem",
                  color: C.text,
                  letterSpacing: "0.05em",
                  transition: "color 0.3s",
                  position: "relative",
                  paddingBottom: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.gold;
                  const underline = e.currentTarget.querySelector(".nav-underline") as HTMLElement;
                  if (underline) underline.style.width = "100%";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.text;
                  const underline = e.currentTarget.querySelector(".nav-underline") as HTMLElement;
                  if (underline) underline.style.width = "0%";
                }}
              >
                {l.label}
                <span
                  className="nav-underline"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 1,
                    width: "0%",
                    background: C.gold,
                    transition: "width 0.3s ease",
                  }}
                />
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                textDecoration: "none",
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.9rem",
                color: C.gold,
                letterSpacing: "0.08em",
                borderLeft: `1px solid ${C.border}`,
                paddingLeft: 24,
                marginLeft: 4,
              }}
            >
              {company.phone}
            </a>
          </nav>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
            aria-label="メニュー"
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: C.gold,
                transition: "transform 0.3s, opacity 0.3s",
                transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: C.gold,
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: C.gold,
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <nav
          style={{
            background: "rgba(10,10,10,0.98)",
            backdropFilter: "blur(16px)",
            padding: "24px 20px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.95rem",
                color: C.text,
                letterSpacing: "0.05em",
                paddingBottom: 12,
                borderBottom: `1px solid ${C.border}`,
                transition: "color 0.3s",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${company.phone}`}
            style={{
              textDecoration: "none",
              fontFamily: "'Oswald', sans-serif",
              fontSize: "1.1rem",
              color: C.gold,
              letterSpacing: "0.08em",
              marginTop: 8,
            }}
          >
            TEL {company.phone}
          </a>
        </nav>
      )}
    </header>
  );

  /* ─── Hero ─── */
  const renderHero = () => (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-bg.webp"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/keikamotsu-new-templates/videos/hero-nightcity.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `linear-gradient(${C.gold} 1px, transparent 1px), linear-gradient(90deg, ${C.gold} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <GrainOverlay />

      {/* Floating geometric elements */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          width: 120,
          height: 120,
          border: `1px solid rgba(200,169,96,0.15)`,
          transform: "rotate(45deg)",
          animation: "cp01-float1 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 80,
          height: 80,
          border: `1px solid rgba(200,169,96,0.1)`,
          borderRadius: "50%",
          animation: "cp01-float2 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "5%",
          width: 60,
          height: 60,
          border: `1px solid rgba(200,169,96,0.08)`,
          animation: "cp01-float3 10s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Large semi-transparent background text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: isMobile ? "-20%" : "-2%",
          transform: "translateY(-50%)",
          fontFamily: "'Oswald', sans-serif",
          fontSize: isMobile ? "12vw" : "10vw",
          fontWeight: 900,
          color: "rgba(200,169,96,0.04)",
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
          pointerEvents: "none",
          animation: "cp01-bgTextFloat 12s ease-in-out infinite",
          zIndex: 1,
        }}
      >
        LOGISTICS
      </div>

      {/* Content */}
      <div style={{ ...wrap(isMobile), position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 640 }}>
          <h1
            style={{
              fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              fontSize: isMobile ? "2rem" : "3rem",
              fontWeight: 700,
              color: C.white,
              lineHeight: 1.1,
              letterSpacing: "0.05em",
              marginBottom: 28,
            }}
          >
            {heroTyped.displayed}
            {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
          </h1>
          {hero.subtext.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                color: C.text,
                lineHeight: 1.8,
                letterSpacing: "0.05em",
                marginBottom: 6,
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.7s ease ${0.8 + i * 0.15}s, transform 0.7s ease ${0.8 + i * 0.15}s`,
              }}
            >
              {line}
            </p>
          ))}
          {/* CTA Button with shine sweep + pulse */}
          <div style={{ position: "relative", display: "inline-block", marginTop: 36 }}>
            <a
              href="#contact"
              style={{
                display: "inline-block",
                padding: "16px 48px",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                color: C.bg1,
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textDecoration: "none",
                borderRadius: "0.375rem",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                animation: "cp01-pulse 3s ease-in-out infinite",
                opacity: heroLoaded ? 1 : 0,
                transformOrigin: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(200,169,96,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={(e) => {
                const btn = e.currentTarget;
                const ripple = document.createElement("span");
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:20px;height:20px;left:${x}px;top:${y}px;transform:translate(-50%,-50%);animation:cp01-ripple 0.6s ease-out forwards;pointer-events:none;`;
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }}
            >
              {/* Shine sweep */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  animation: "cp01-shine 3s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
              {hero.cta}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator with animated chevron */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "0.6rem",
            color: C.gold,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <svg width="16" height="10" viewBox="0 0 16 10" style={{ animation: "cp01-scrollChevron 2s ease-in-out infinite" }}>
            <path d="M1 1 L8 8 L15 1" stroke={C.gold} strokeWidth="1.5" fill="none" />
          </svg>
          <svg width="16" height="10" viewBox="0 0 16 10" style={{ animation: "cp01-scrollChevron 2s ease-in-out infinite 0.3s" }}>
            <path d="M1 1 L8 8 L15 1" stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>
    </section>
  );

  /* ─── Services ─── */
  const serviceImages = [
    "/keikamotsu-new-templates/images/service-b2b.webp",
    "/keikamotsu-new-templates/images/service-ec.webp",
    "/keikamotsu-new-templates/images/service-route.webp",
    "/keikamotsu-new-templates/images/service-spot.webp",
  ];

  const renderServices = () => (
    <section
      id="services"
      ref={svcRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 60px" : "140px 0 100px", position: "relative" }}
    >
      <GrainOverlay />
      <div style={{ ...wrap(isMobile), maxWidth: 1100, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(svcRef.visible)}>
          <SectionHeading en="Services" ja="事業内容" visible={svcRef.visible} />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "1.2fr 0.8fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 20 : 24,
            marginTop: 16,
          }}
        >
          {/* Left - main card with image */}
          <div
            style={{
              ...scaleIn(svcRef.visible, 0.1),
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: "1rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: isMobile ? "auto" : 420,
              transition: "border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.gold;
              e.currentTarget.style.boxShadow = `0 4px 24px rgba(200,169,96,0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ width: "100%", height: 200, overflow: "hidden", position: "relative" }}>
              <img
                src={serviceImages[0]}
                alt={services[0].title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.7) contrast(1.1)",
                  transition: "transform 0.6s ease",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${C.bg2})` }} />
            </div>
            <div style={{ padding: isMobile ? 28 : 40, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: C.gold,
                  lineHeight: 1,
                  marginBottom: 16,
                  opacity: 0.3,
                }}
              >
                {services[0].num}
              </span>
              <h3
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: isMobile ? "1.3rem" : "1.5rem",
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1.2,
                  letterSpacing: "0.05em",
                  marginBottom: 20,
                }}
              >
                {services[0].title}
              </h3>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.9rem",
                  color: C.text,
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                }}
              >
                {services[0].text.split("\n").map((line, j) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < services[0].text.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
          {/* Right - 3 stacked with images */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 24 }}>
            {services.slice(1).map((s, i) => (
              <div
                key={s.num}
                style={{
                  ...fadeStyle(svcRef.visible, 0.2 + i * 0.12),
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.625rem",
                  overflow: "hidden",
                  transition: "border-color 0.4s ease, transform 0.3s ease, box-shadow 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.gold;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(200,169,96,0.08)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ width: 100, minHeight: 90, overflow: "hidden", flexShrink: 0 }}>
                    <img
                      src={serviceImages[i + 1] || serviceImages[0]}
                      alt={s.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }}
                    />
                  </div>
                  <div style={{ padding: isMobile ? "16px 20px" : "20px 24px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                      <span
                        style={{
                          fontFamily: "'Oswald', sans-serif",
                          fontSize: "1.3rem",
                          fontWeight: 700,
                          color: C.gold,
                          opacity: 0.4,
                          lineHeight: 1,
                        }}
                      >
                        {s.num}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Noto Sans JP', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: C.white,
                          lineHeight: 1.2,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "0.8rem",
                        color: C.text,
                        lineHeight: 1.7,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {s.text.split("\n").map((line, j) => (
                        <React.Fragment key={j}>
                          {line}
                          {j < s.text.split("\n").length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Strengths ─── */
  const strengthImages = [
    "/keikamotsu-new-templates/images/strength-01.webp",
    "/keikamotsu-new-templates/images/strength-02.webp",
    "/keikamotsu-new-templates/images/strength-03.webp",
  ];

  const renderStrengths = () => (
    <section
      id="strengths"
      ref={strRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 70px" : "120px 0 110px", position: "relative", overflow: "hidden" }}
    >
      {/* Diagonal SVG divider top */}
      <div style={{ position: "absolute", top: -1, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: "100%", height: 40, display: "block" }}>
          <path d="M0,40 L1440,0 L1440,40 Z" fill={C.bg1} />
        </svg>
      </div>
      <DotGrid opacity={0.04} />
      <div style={{ ...wrap(isMobile), maxWidth: 1100, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(strRef.visible)}>
          <SectionHeading en="Strengths" ja="私たちの強み" visible={strRef.visible} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 40 : 64,
            marginTop: 8,
          }}
        >
          {strengths.map((s, i) => (
            <div
              key={s.num}
              style={{
                ...(i % 2 === 0 ? slideInLeft(strRef.visible, 0.15 + i * 0.15) : slideInRight(strRef.visible, 0.15 + i * 0.15)),
                display: isMobile ? "flex" : "grid",
                gridTemplateColumns: isMobile ? undefined : i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
                flexDirection: isMobile ? "column" : undefined,
                gap: isMobile ? 0 : 0,
                alignItems: "stretch",
                borderRadius: "0.75rem",
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                transition: "border-color 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.gold;
                e.currentTarget.style.boxShadow = `0 4px 24px rgba(200,169,96,0.08)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image side */}
              <div
                style={{
                  order: isMobile ? 0 : i % 2 === 0 ? 0 : 1,
                  height: isMobile ? 200 : "auto",
                  minHeight: isMobile ? 200 : 280,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={strengthImages[i] || strengthImages[0]}
                  alt={s.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(30%) brightness(0.7)",
                    transition: "transform 0.6s ease, filter 0.6s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: i % 2 === 0
                      ? `linear-gradient(90deg, transparent 50%, ${C.bg2})`
                      : `linear-gradient(270deg, transparent 50%, ${C.bg2})`,
                  }}
                />
              </div>
              {/* Content side */}
              <div
                style={{
                  order: isMobile ? 1 : i % 2 === 0 ? 1 : 0,
                  padding: isMobile ? "24px 20px 28px" : "40px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: C.bg2,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: C.gold,
                    lineHeight: 1,
                    opacity: 0.25,
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: isMobile ? "1.1rem" : "1.25rem",
                    fontWeight: 700,
                    color: C.white,
                    lineHeight: 1.3,
                    letterSpacing: "0.05em",
                    margin: "16px 0 14px",
                  }}
                >
                  {s.title}
                </h3>
                {/* Gold accent line */}
                <div style={{ width: 32, height: 2, background: C.gold, marginBottom: 16 }} />
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.85rem",
                    color: C.text,
                    lineHeight: 1.8,
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.text.split("\n").map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < s.text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─── CEO Message ─── */
  const renderCeoMessage = () => (
    <section
      id="message"
      ref={ceoRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 70px" : "120px 0 100px", position: "relative" }}
    >
      <GrainOverlay />
      {/* Decorative gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: 60,
          background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
        }}
      />
      <div style={{ ...wrap(isMobile), maxWidth: 840, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(ceoRef.visible)}>
          <SectionHeading en="CEO Message" ja="代表メッセージ" visible={ceoRef.visible} />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "0.4fr 0.6fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 32 : 56,
            alignItems: "start",
            ...fadeStyle(ceoRef.visible, 0.15),
          }}
        >
          {/* Photo */}
          <div
            style={{
              position: "relative",
              maxWidth: isMobile ? 280 : "100%",
            }}
          >
            <div
              style={{
                transform: "rotate(-2deg)",
                overflow: "hidden",
                borderRadius: "0.625rem",
                border: `2px solid ${C.gold}`,
                boxShadow: `0 8px 32px rgba(200,169,96,0.15)`,
              }}
            >
              <img
                src="/keikamotsu-new-templates/images/ceo-portrait.webp"
                alt={`${ceoMessage.name} ${ceoMessage.title}`}
                style={{ width: "100%", display: "block", filter: "grayscale(20%)" }}
              />
            </div>
            <div
              style={{
                marginTop: 20,
                textAlign: isMobile ? "left" : "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.75rem",
                  color: C.gold,
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                {ceoMessage.title}
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.white,
                  letterSpacing: "0.08em",
                }}
              >
                {ceoMessage.name}
              </p>
            </div>
          </div>
          {/* Text with accent line */}
          <div>
            {/* Gold accent line on left */}
            <div
              style={{
                borderLeft: `3px solid ${C.gold}`,
                paddingLeft: 24,
              }}
            >
              {ceoMessage.message.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.92rem",
                    color: C.text,
                    lineHeight: 2,
                    letterSpacing: "0.05em",
                    marginBottom: 24,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Company Overview ─── */
  const renderCompany = () => (
    <section
      id="company"
      ref={coRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 60px" : "90px 0 80px", position: "relative" }}
    >
      <DotGrid opacity={0.03} />
      <div style={{ ...wrap(isMobile), maxWidth: 1100, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(coRef.visible)}>
          <SectionHeading en="Company" ja="会社概要" visible={coRef.visible} />
        </div>
        <div style={{ ...fadeStyle(coRef.visible, 0.1), maxWidth: 800 }}>
          {companyOverview.map((item, i) => (
            <div
              key={i}
              style={{
                display: isMobile ? "flex" : "grid",
                gridTemplateColumns: isMobile ? undefined : "160px 1fr",
                flexDirection: isMobile ? "column" : undefined,
                borderBottom: `1px solid ${C.border}`,
                padding: isMobile ? "16px 0" : "20px 0",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,169,96,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <dt
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: C.gold,
                  letterSpacing: "0.08em",
                  marginBottom: isMobile ? 6 : 0,
                  paddingTop: 2,
                }}
              >
                {item.dt}
              </dt>
              <dd
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.88rem",
                  color: C.text,
                  lineHeight: 1.8,
                  letterSpacing: "0.04em",
                  margin: 0,
                }}
              >
                {item.dd}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─── History ─── */
  const historyImages = [
    "/keikamotsu-new-templates/images/history-2021.webp",
    "/keikamotsu-new-templates/images/history-2022.webp",
    "/keikamotsu-new-templates/images/history-2023.webp",
    "/keikamotsu-new-templates/images/history-2024.webp",
    "/keikamotsu-new-templates/images/history-2025.webp",
  ];

  const renderHistory = () => {
    const total = history.length;
    return (
      <section
        id="history"
        ref={hisRef.ref}
        style={{ background: C.bg1, padding: isMobile ? "80px 0 70px" : "96px 0 84px", position: "relative" }}
      >
        <GrainOverlay />
        <div style={{ ...wrap(isMobile), maxWidth: 1100, position: "relative", zIndex: 2 }}>
          <div style={fadeStyle(hisRef.visible)}>
            <SectionHeading en="History" ja="沿革" visible={hisRef.visible} />
          </div>
          <div style={{ position: "relative", marginTop: 8, paddingLeft: isMobile ? 32 : 48 }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: isMobile ? 6 : 12,
                top: 0,
                bottom: 0,
                width: 2,
                background: C.border,
              }}
            />
            {/* Progress bar */}
            <div
              style={{
                position: "absolute",
                left: isMobile ? 6 : 12,
                top: 0,
                width: 2,
                height: hisRef.visible ? "100%" : "0%",
                background: `linear-gradient(to bottom, ${C.gold}, ${C.goldDark})`,
                transition: "height 1.8s ease",
              }}
            />
            {history.map((h, i) => (
              <div
                key={h.year}
                style={{
                  ...fadeStyle(hisRef.visible, 0.15 + i * 0.12),
                  position: "relative",
                  paddingBottom: i < total - 1 ? 40 : 0,
                  display: isMobile ? "block" : "flex",
                  gap: 24,
                  alignItems: "flex-start",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: isMobile ? -32 : -42,
                    top: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: C.gold,
                    border: `3px solid ${C.bg1}`,
                    boxShadow: `0 0 0 2px ${C.gold}`,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      color: C.gold,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h.year}
                  </span>
                  <p
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "0.88rem",
                      color: C.text,
                      lineHeight: 1.8,
                      letterSpacing: "0.05em",
                      marginTop: 8,
                    }}
                  >
                    {h.event}
                  </p>
                </div>
                {/* History image */}
                {!isMobile && historyImages[i] && (
                  <div
                    style={{
                      width: 160,
                      height: 100,
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={historyImages[i]}
                      alt={`${h.year}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%) brightness(0.7)" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ─── Numbers ─── */
  const renderNumbers = () => (
    <section
      id="numbers"
      ref={numRef.ref}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: isMobile ? "70px 0" : "100px 0 90px",
      }}
    >
      {/* 背景画像 with parallax feel */}
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          backgroundImage: "url(/keikamotsu-new-templates/images/team.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "grayscale(100%) brightness(0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,10,10,0.85)",
        }}
      />
      {/* Gold gradient line top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
      />
      <div style={{ ...wrap(isMobile), maxWidth: 960, position: "relative", zIndex: 1 }}>
        <div style={fadeStyle(numRef.visible)}>
          <SectionHeading en="Numbers" ja="実績" align="center" visible={numRef.visible} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1fr 1.1fr 0.9fr 1fr",
            gap: isMobile ? 24 : 40,
            marginTop: 8,
          }}
        >
          {numbers.map((n, i) => {
            const numericValue = parseFloat(n.value.replace(/,/g, ""));
            return (
              <NumberCard
                key={i}
                label={n.label}
                target={numericValue}
                suffix={n.suffix}
                started={numRef.visible}
                delay={0.1 + i * 0.1}
                visible={numRef.visible}
                hasComma={n.value.includes(",")}
              />
            );
          })}
        </div>
      </div>
    </section>
  );

  /* ─── Partners ─── */
  const renderPartners = () => (
    <section
      id="partners"
      ref={prtRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 60px" : "70px 0 60px", position: "relative" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 960, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(prtRef.visible)}>
          <SectionHeading en="Partners" ja="主要取引先" align="center" visible={prtRef.visible} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1fr 1.2fr 0.8fr",
            gap: isMobile ? 16 : 24,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {partners.map((p, i) => (
            <div
              key={i}
              style={{
                ...scaleIn(prtRef.visible, 0.08 + i * 0.06),
                background: C.bg2,
                border: `1px solid ${C.border}`,
                borderRadius: "0.625rem",
                padding: isMobile ? "24px 16px" : "32px 24px",
                textAlign: "center",
                transition: "border-color 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.gold;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(200,169,96,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: C.bg3,
                  border: `1px solid ${C.gold}`,
                  margin: "0 auto 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "0.9rem",
                  color: C.gold,
                  fontWeight: 600,
                }}
              >
                {p.name.charAt(p.name.length - 2)}社
              </div>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.78rem",
                  color: C.text,
                  lineHeight: 1.5,
                  letterSpacing: "0.04em",
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.68rem",
                  color: C.muted,
                  marginTop: 6,
                }}
              >
                {p.industry}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─── News ─── */
  const renderNews = () => (
    <section
      id="news"
      ref={newsRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 60px" : "76px 0 64px", position: "relative" }}
    >
      <WaveDivider color={C.bg1} flip />
      <div style={{ ...wrap(isMobile), maxWidth: 1100, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(newsRef.visible)}>
          <SectionHeading en="News" ja="お知らせ" visible={newsRef.visible} />
        </div>
        <div style={{ maxWidth: 820, ...fadeStyle(newsRef.visible, 0.1) }}>
          {news.map((n, i) => {
            const tagColors: Record<string, string> = {
              press: C.gold,
              new: C.goldDark,
              default: "#3a3a3a",
            };
            return (
              <a
                key={i}
                href="#"
                style={{
                  display: isMobile ? "block" : "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom: `1px solid ${C.border}`,
                  textDecoration: "none",
                  transition: "background-color 0.3s, padding-left 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(200,169,96,0.04)";
                  e.currentTarget.style.paddingLeft = "12px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "0.8rem",
                    color: C.muted,
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                    marginBottom: isMobile ? 8 : 0,
                    display: "block",
                  }}
                >
                  {n.date}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.68rem",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    color: C.bg1,
                    background: tagColors[n.tagStyle] || tagColors.default,
                    padding: "3px 12px",
                    borderRadius: "0.375rem",
                    letterSpacing: "0.06em",
                    flexShrink: 0,
                    marginBottom: isMobile ? 8 : 0,
                    marginRight: isMobile ? 8 : 0,
                  }}
                >
                  {n.tag}
                </span>
                <span
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.88rem",
                    color: C.text,
                    letterSpacing: "0.04em",
                    display: "block",
                  }}
                >
                  {n.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );

  /* ─── Recruit ─── */
  const renderRecruit = () => (
    <section
      id="recruit"
      ref={recRef.ref}
      style={{
        background: C.bg1,
        padding: isMobile ? "80px 0 60px" : "130px 0 140px",
        position: "relative",
      }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div
          style={{
            ...scaleIn(recRef.visible, 0.1),
            position: "relative",
            overflow: "hidden",
            borderRadius: "1rem",
          }}
        >
          {/* 背景に配送写真 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(/keikamotsu-new-templates/images/delivery.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(40%) brightness(0.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,10,0.75)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              border: `1px solid ${C.border}`,
              borderRadius: "1rem",
              padding: isMobile ? "40px 24px" : "64px 56px",
            }}
          >
            {/* Gold top line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${C.gold}, transparent)`,
              }}
            />
            <p
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Recruit
            </p>
            <h2
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: isMobile ? "1.3rem" : "1.6rem",
                fontWeight: 700,
                color: C.white,
                lineHeight: 1.3,
                letterSpacing: "0.05em",
                marginBottom: 20,
              }}
            >
              {recruit.heading}
            </h2>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.88rem",
                color: C.text,
                lineHeight: 1.9,
                letterSpacing: "0.05em",
                marginBottom: 32,
                maxWidth: 560,
              }}
            >
              {recruit.text.split("\n").map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < recruit.text.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <a
              href={recruit.link}
              style={{
                display: "inline-block",
                padding: "14px 44px",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                color: C.bg1,
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textDecoration: "none",
                borderRadius: "0.375rem",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 6px 24px rgba(200,169,96,0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  animation: "cp01-shine 3s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
              {recruit.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Access ─── */
  const renderAccess = () => (
    <section
      id="access"
      ref={accRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 60px" : "88px 0 76px", position: "relative" }}
    >
      <DotGrid opacity={0.03} />
      <div style={{ ...wrap(isMobile), maxWidth: 1100, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(accRef.visible)}>
          <SectionHeading en="Access" ja={access.heading} visible={accRef.visible} />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "1.3fr 0.7fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 28 : 40,
            ...fadeStyle(accRef.visible, 0.1),
          }}
        >
          <div
            style={{
              borderRadius: "0.625rem",
              overflow: "hidden",
              border: `1px solid ${C.gold}`,
              boxShadow: `0 0 0 1px ${C.border}`,
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5!2d135.6281!3d34.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzAwLjAiTiAxMzXCsDM3JzQxLjAiRQ!5e0!3m2!1sja!2sjp!4v1"
              width="100%"
              height={isMobile ? "260" : "320"}
              style={{ border: 0, display: "block", filter: "grayscale(30%) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div>
            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.75rem",
                  color: C.gold,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                所在地
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.92rem",
                  color: C.text,
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              >
                〒{company.postalCode}
                <br />
                {access.address}
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.75rem",
                  color: C.gold,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                最寄り駅
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.88rem",
                  color: C.text,
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              >
                {access.nearestStation}
              </p>
            </div>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.82rem",
                color: C.muted,
                lineHeight: 1.7,
                letterSpacing: "0.04em",
                marginTop: 16,
                paddingTop: 16,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {access.mapNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Contact ─── */
  const renderContact = () => (
    <section
      id="contact"
      ref={ctRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 70px" : "134px 0 144px", position: "relative" }}
    >
      <GrainOverlay />
      {/* Decorative gradient lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
      />
      <div style={{ ...wrap(isMobile), maxWidth: 720, position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(ctRef.visible)}>
          <SectionHeading en="Contact" ja={contact.heading} align="center" visible={ctRef.visible} />
        </div>
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            ...fadeStyle(ctRef.visible, 0.1),
          }}
        >
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.88rem",
              color: C.text,
              lineHeight: 1.8,
              letterSpacing: "0.05em",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            {contact.intro.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < contact.intro.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {contact.fields.map((f) => (
              <div key={f.name}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.82rem",
                    color: C.text,
                    letterSpacing: "0.05em",
                    marginBottom: 8,
                  }}
                >
                  {f.label}
                  {f.required && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: C.bg1,
                        background: C.gold,
                        padding: "1px 8px",
                        borderRadius: 3,
                        fontWeight: 600,
                        marginLeft: 4,
                      }}
                    >
                      必須
                    </span>
                  )}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    required={f.required}
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: C.bg2,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.375rem",
                      color: C.white,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "0.88rem",
                      lineHeight: 1.7,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = C.gold;
                      e.currentTarget.style.boxShadow = `0 0 0 2px rgba(200,169,96,0.15)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                ) : (
                  <input
                    type={f.type}
                    name={f.name}
                    required={f.required}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: C.bg2,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.375rem",
                      color: C.white,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = C.gold;
                      e.currentTarget.style.boxShadow = `0 0 0 2px rgba(200,169,96,0.15)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                )}
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                type="submit"
                style={{
                  padding: "16px 64px",
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                  color: C.bg1,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 6px 24px rgba(200,169,96,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "50%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    animation: "cp01-shine 3s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
                送信する
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

  /* ─── Footer ─── */
  const renderFooter = () => (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${C.border}`,
        padding: isMobile ? "48px 0 32px" : "64px 0 40px",
      }}
    >
      {/* Footer background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/keikamotsu-new-templates/images/footer-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) brightness(0.08)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,5,0.92)" }} />
      <div style={{ ...wrap(isMobile), position: "relative", zIndex: 2 }}>
        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.08em",
            marginBottom: 28,
          }}
        >
          {footer.catchphrase}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 14 : 24,
            marginBottom: 40,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                textDecoration: "none",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.75rem",
                color: C.muted,
                letterSpacing: "0.04em",
                transition: "color 0.3s",
                position: "relative",
                paddingBottom: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.muted;
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div
          style={{
            display: isMobile ? "block" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.72rem",
              color: C.muted,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 8 : 0,
            }}
          >
            {company.name}
          </p>
          <p
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.68rem",
              color: "#555",
              letterSpacing: "0.1em",
            }}
          >
            &copy; {new Date().getFullYear()} {company.nameEn} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div style={{ background: C.bg1, color: C.text, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      {renderHeader()}
      {renderHero()}
      {renderServices()}
      {renderStrengths()}
      {renderCeoMessage()}
      {renderCompany()}
      {renderHistory()}
      {renderNumbers()}
      {renderPartners()}
      {renderNews()}
      {renderRecruit()}
      {renderAccess()}
      {renderContact()}
      {renderFooter()}
    </div>
  );
}

/* ───────────────────────────────────────────
   Number Card (カウントアップ with gold gradient)
   ─────────────────────────────────────────── */
function NumberCard({
  label,
  target,
  suffix,
  started,
  delay,
  visible,
  hasComma,
}: {
  label: string;
  target: number;
  suffix: string;
  started: boolean;
  delay: number;
  visible: boolean;
  hasComma: boolean;
}) {
  const count = useCountUp(target, started, 2200);
  const displayValue = hasComma ? count.toLocaleString() : count;

  return (
    <div
      style={{
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "2.8rem",
            fontWeight: 700,
            fontFeatureSettings: "'tnum'",
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: "0.85rem",
            color: C.gold,
            fontWeight: 500,
          }}
        >
          {suffix}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: "0.78rem",
          color: C.text,
          marginTop: 10,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}
