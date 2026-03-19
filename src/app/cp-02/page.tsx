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
  sectionIcons,
} from "@/data/corporateSiteData";

/* ─────────────── カラー定数 (SLATE - white x steel blue) ─────────────── */
const C = {
  white: "#ffffff",
  bgSub: "#f8f9fb",
  bgBand: "#f1f5f9",
  text: "#1e293b",
  textSub: "#475569",
  accent: "#3b5998",
  accentLight: "#5b79b8",
  accentDark: "#2d4578",
  cta: "#32373c",
  border: "#e2e8f0",
  borderLight: "#f0f2f5",
};

/* ─────────────── CSS Keyframes ─────────────── */
const KEYFRAMES = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@keyframes cp02-heroReveal {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}
@keyframes cp02-headingReveal {
  0% { clip-path: inset(0 100% 0 0); opacity: 0; }
  100% { clip-path: inset(0 0% 0 0); opacity: 1; }
}
@keyframes cp02-scrollChevron {
  0%, 100% { opacity: 0; transform: translateY(-6px); }
  50% { opacity: 1; transform: translateY(6px); }
}
@keyframes cp02-float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-10px, -15px) scale(1.02); }
}
@keyframes cp02-float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(8px, -12px); }
}
@keyframes cp02-float3 {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}
@keyframes cp02-bgTextFloat {
  0%, 100% { transform: translateX(0) translateY(-50%); }
  50% { transform: translateX(15px) translateY(-50%); }
}
@keyframes cp02-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,89,152,0.3); }
  50% { box-shadow: 0 0 0 10px rgba(59,89,152,0); }
}
@keyframes cp02-shine {
  0% { left: -100%; }
  100% { left: 200%; }
}
@keyframes cp02-ripple {
  0% { transform: scale(0); opacity: 0.4; }
  100% { transform: scale(4); opacity: 0; }
}
@keyframes cp02-circleExpand {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes cp02-diagonalSlide {
  0% { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}
@keyframes cp02-softShadow {
  0%, 100% { box-shadow: 0 4px 20px rgba(59,89,152,0.08); }
  50% { box-shadow: 0 8px 32px rgba(59,89,152,0.15); }
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes cp02-underlineReveal {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes cp02-truckDrive {
  0% { left: -100px; }
  100% { left: calc(100% + 100px); }
}
`;

/* ─────────────── Typewriter フック ─────────────── */
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

/* ─────────────── フェードインHook ─────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─────────────── カウントアップフック ─────────────── */
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

/* ─────────────── タグ色 ─────────────── */
function tagColor(tagStyle: string) {
  switch (tagStyle) {
    case "press":
      return { bg: "#3b5998", color: "#fff" };
    case "new":
      return { bg: "#e8f0fe", color: "#3b5998" };
    default:
      return { bg: "#f1f5f9", color: "#475569" };
  }
}

/* ─────────────── SVG Wave Divider ─────────────── */
function WaveDivider({ color = C.bgSub, flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div style={{ lineHeight: 0, overflow: "hidden", transform: flip ? "rotate(180deg)" : "none" }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
        <path d="M0,0 C360,50 720,10 1080,45 C1260,55 1380,20 1440,30 L1440,60 L0,60 Z" fill={color} />
      </svg>
    </div>
  );
}

/* ─────────────── Diagonal Stripe Pattern ─────────────── */
function DiagonalStripes({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          ${C.accent} 10px,
          ${C.accent} 11px
        )`,
        zIndex: 0,
      }}
    />
  );
}

/* ─────────────── Dot Grid Pattern ─────────────── */
function DotGrid({ opacity = 0.04, color = C.accent }: { opacity?: number; color?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        zIndex: 0,
      }}
    />
  );
}

/* ─────────────── Enhanced Section Heading ─────────────── */
function SectionHeading({
  en,
  ja,
  visible = true,
  align = "left",
  icon,
}: {
  en: string;
  ja: string;
  visible?: boolean;
  align?: "left" | "center";
  icon?: string;
}) {
  return (
    <div style={{ marginBottom: isMobileGlobal ? 28 : 40, textAlign: align }}>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: C.accent,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 10,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        {en}
      </p>
      <h2
        style={{
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          fontSize: isMobileGlobal ? 22 : 28,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.4,
          letterSpacing: "0.04em",
          animation: visible ? "cp02-headingReveal 0.8s ease forwards" : "none",
          clipPath: visible ? undefined : "inset(0 100% 0 0)",
        }}
      >
        {icon && <span style={{ marginRight: 8, fontSize: "0.9em", opacity: 0.7 }}>{icon}</span>}{ja}
      </h2>
      <div
        style={{
          width: 48,
          height: 3,
          background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
          marginTop: 14,
          marginLeft: align === "center" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: align === "center" ? "center" : "left",
          transition: "transform 0.6s ease 0.3s",
        }}
      />
    </div>
  );
}

/* ─────────────── Global mobile state for SectionHeading ─────────────── */
let isMobileGlobal = false;

/* ═══════════════ メインコンポーネント ═══════════════ */
export default function CP02Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroTyped = useTypewriter(hero.headline, 80, 500);

  useEffect(() => {
    const checkMobile = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      isMobileGlobal = m;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  // Section observers
  const svcRef = useFadeIn(0.1);
  const strRef = useFadeIn(0.1);
  const ceoRef = useFadeIn(0.15);
  const coRef = useFadeIn(0.1);
  const hisRef = useFadeIn(0.1);
  const numRef = useFadeIn(0.1);
  const prtRef = useFadeIn(0.1);
  const newsRef = useFadeIn(0.1);
  const recRef = useFadeIn(0.1);
  const accRef = useFadeIn(0.1);
  const ctRef = useFadeIn(0.1);

  const fadeStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
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
    transform: visible ? "scale(1)" : "scale(0.93)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  /* ─── Header ─── */
  const renderHeader = () => (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : C.white,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "border-color 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "14px 20px" : "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ロゴ */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 16 : 18,
            fontWeight: 700,
            color: C.text,
            textDecoration: "none",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          GREEN
          <span style={{ color: C.accent, marginLeft: 4 }}>LOGISTICS</span>
        </a>

        {/* PC ナビ */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.slice(0, 6).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textSub,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  transition: "color 0.25s ease",
                  position: "relative",
                  paddingBottom: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.accent;
                  const underline = e.currentTarget.querySelector(".cp02-nav-underline") as HTMLElement;
                  if (underline) underline.style.width = "100%";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.textSub;
                  const underline = e.currentTarget.querySelector(".cp02-nav-underline") as HTMLElement;
                  if (underline) underline.style.width = "0%";
                }}
              >
                <><span style={{marginRight:4,fontSize:"0.85em"}}>{link.icon}</span>{link.label}</>
                <span
                  className="cp02-nav-underline"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 2,
                    width: "0%",
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
                    transition: "width 0.3s ease",
                    borderRadius: 1,
                  }}
                />
              </a>
            ))}
          </nav>
        )}

        {/* 電話 + 問い合わせ */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                letterSpacing: "0.04em",
              }}
            >
              {company.phone}
            </span>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: C.white,
                backgroundColor: C.cta,
                padding: "9px 22px",
                borderRadius: 4,
                textDecoration: "none",
                letterSpacing: "0.05em",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(50,55,60,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              お問い合わせ
            </a>
          </div>
        )}

        {/* ハンバーガー */}
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
                width: 22,
                height: 2,
                backgroundColor: C.text,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                backgroundColor: C.text,
                transition: "opacity 0.3s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                backgroundColor: C.text,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* モバイルメニュー */}
      {isMobile && menuOpen && (
        <nav
          style={{
            backgroundColor: C.white,
            borderTop: `1px solid ${C.border}`,
            padding: "16px 20px 24px",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              style={{
                display: "block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: C.text,
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: `1px solid ${C.borderLight}`,
                letterSpacing: "0.05em",
              }}
            >
              <><span style={{marginRight:6,fontSize:"0.9em"}}>{link.icon}</span>{link.label}</>
            </a>
          ))}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {company.phone}
            </span>
          </div>
        </nav>
      )}
    </header>
  );

  /* ─── Hero ─── */
  const renderHero = () => (
    <section
      style={{
        position: "relative",
        minHeight: isMobile ? "85vh" : "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop: isMobile ? 56 : 64,
      }}
    >
      {/* Video background */}
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
        <source src="/keikamotsu-new-templates/videos/hero-daytime.mp4" type="video/mp4" />
      </video>

      {/* White overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(241,245,249,0.82) 50%, rgba(255,255,255,0.85) 100%)",
        }}
      />

      {/* Diagonal stripe pattern */}
      <DiagonalStripes opacity={0.015} />

      {/* Large decorative circle */}
      <div
        style={{
          position: "absolute",
          right: isMobile ? "-30%" : "-5%",
          top: "50%",
          transform: "translateY(-50%)",
          width: isMobile ? "80vw" : "50vw",
          height: isMobile ? "80vw" : "50vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          border: `2px solid rgba(59,89,152,0.08)`,
          animation: "cp02-circleExpand 1.2s ease forwards, cp02-float1 10s ease-in-out infinite 1.2s",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Inner circle */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "15%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            border: `1px solid rgba(59,89,152,0.05)`,
          }}
        />
      </div>

      {/* Floating elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "8%",
          width: 40,
          height: 40,
          background: `linear-gradient(135deg, rgba(59,89,152,0.08), transparent)`,
          borderRadius: "50%",
          animation: "cp02-float2 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "15%",
          width: 60,
          height: 60,
          border: `1px solid rgba(59,89,152,0.06)`,
          transform: "rotate(45deg)",
          animation: "cp02-float3 9s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Large bg text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: isMobile ? "-10%" : "2%",
          transform: "translateY(-50%)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? "15vw" : "10vw",
          fontWeight: 900,
          color: "rgba(59,89,152,0.03)",
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
          pointerEvents: "none",
          animation: "cp02-bgTextFloat 14s ease-in-out infinite",
          zIndex: 0,
        }}
      >
        LOGISTICS
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: isMobile ? "0 24px" : "0 40px",
          maxWidth: 780,
        }}
      >
        <h1
          style={{
            fontFamily: "'Klee One', 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
            fontSize: isMobile ? 28 : 46,
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.5,
            letterSpacing: "0.06em",
            marginBottom: 20,
          }}
        >
          {heroTyped.displayed}
          {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
        </h1>
        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: isMobile ? 13 : 15,
            color: C.textSub,
            lineHeight: 1.9,
            letterSpacing: "0.05em",
            marginBottom: 36,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s",
          }}
        >
          {hero.subtext.join("\n").split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
        {/* CTA with pulse + shine + ripple */}
        <a
          href="#contact"
          onClick={(e) => {
            handleSmoothScroll(e, "#contact");
            const btn = e.currentTarget;
            const ripple = document.createElement("span");
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:20px;height:20px;left:${x}px;top:${y}px;transform:translate(-50%,-50%);animation:cp02-ripple 0.6s ease-out forwards;pointer-events:none;`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
          }}
          style={{
            display: "inline-block",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: C.white,
            backgroundColor: C.cta,
            padding: isMobile ? "14px 36px" : "15px 48px",
            borderRadius: 5,
            textDecoration: "none",
            letterSpacing: "0.05em",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            animation: "cp02-pulse 3s ease-in-out infinite",
            opacity: heroLoaded ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(50,55,60,0.35)";
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
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              animation: "cp02-shine 3s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          {hero.cta}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.6rem",
            color: C.accent,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <svg width="14" height="8" viewBox="0 0 14 8" style={{ animation: "cp02-scrollChevron 2s ease-in-out infinite" }}>
            <path d="M1 1 L7 7 L13 1" stroke={C.accent} strokeWidth="1.5" fill="none" />
          </svg>
          <svg width="14" height="8" viewBox="0 0 14 8" style={{ animation: "cp02-scrollChevron 2s ease-in-out infinite 0.3s" }}>
            <path d="M1 1 L7 7 L13 1" stroke={C.accent} strokeWidth="1.5" fill="none" opacity="0.4" />
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
      style={{
        padding: isMobile ? "64px 20px 56px" : "140px 40px 100px",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={fadeStyle(svcRef.visible)}>
        <SectionHeading en="Services" ja="事業内容" visible={svcRef.visible} icon={sectionIcons.services} />
      </div>
      <div
        style={{
          display: isMobile ? "block" : "flex",
          gap: 56,
          alignItems: "flex-start",
        }}
      >
        {/* 左カラム */}
        <div style={{ flex: isMobile ? "unset" : "0 0 340px", marginBottom: isMobile ? 36 : 0, ...slideInLeft(svcRef.visible, 0.1) }}>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14,
              color: C.textSub,
              lineHeight: 1.95,
              letterSpacing: "0.05em",
            }}
          >
            物流を軸に、<br/>車両リース・レンタカー・ロードサービスまで。<br/>
            配送業に関わるすべてを<br/>ワンストップで支える体制を整えています。
          </p>
        </div>

        {/* 右カード */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
            gap: isMobile ? 16 : 20,
          }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                ...scaleIn(svcRef.visible, 0.15 + i * 0.1),
                backgroundColor: C.bgSub,
                borderRadius: 8,
                border: `1px solid ${C.borderLight}`,
                overflow: "hidden",
                transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,89,152,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.borderLight;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Service image */}
              <div style={{ width: "100%", height: 140, overflow: "hidden", position: "relative" }}>
                <img
                  src={serviceImages[i] || serviceImages[0]}
                  alt={s.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${C.bgSub})` }} />
              </div>
              <div style={{ padding: isMobile ? "20px 20px 24px" : "20px 28px 28px" }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.accent,
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontFamily: "'Zen Kaku Gothic New', sans-serif",
                    fontSize: isMobile ? 16 : 17,
                    fontWeight: 700,
                    color: C.text,
                    margin: "10px 0 12px",
                    lineHeight: 1.45,
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    color: C.textSub,
                    lineHeight: 1.85,
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
      style={{
        backgroundColor: C.bgBand,
        padding: isMobile ? "60px 20px 52px" : "120px 40px 110px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wave divider top */}
      <div style={{ position: "absolute", top: -1, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: "100%", height: 40, display: "block" }}>
          <path d="M0,40 C480,10 960,35 1440,5 L1440,0 L0,0 Z" fill={C.white} />
        </svg>
      </div>
      <DotGrid opacity={0.025} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(strRef.visible)}>
          <SectionHeading en="Strengths" ja="私たちの強み" visible={strRef.visible} icon={sectionIcons.strengths} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 32 : 56,
          }}
        >
          {strengths.map((s, i) => (
            <div
              key={i}
              style={{
                ...(i % 2 === 0 ? slideInLeft(strRef.visible, 0.15 + i * 0.15) : slideInRight(strRef.visible, 0.15 + i * 0.15)),
                display: isMobile ? "flex" : "grid",
                gridTemplateColumns: isMobile ? undefined : "1fr 1fr",
                flexDirection: isMobile ? "column" : undefined,
                backgroundColor: C.white,
                borderRadius: 10,
                overflow: "hidden",
                borderTop: `3px solid ${C.accent}`,
                boxShadow: "8px 8px 0 rgba(139,90,43,0.35)",
                transition: "box-shadow 0.4s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "8px 8px 0 rgba(139,90,43,0.35), 0 12px 40px rgba(59,89,152,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "8px 8px 0 rgba(139,90,43,0.35)";
              }}
            >
              {/* Image */}
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
                    transition: "transform 0.6s ease",
                  }}
                />
              </div>
              {/* Content */}
              <div
                style={{
                  order: isMobile ? 1 : i % 2 === 0 ? 1 : 0,
                  padding: isMobile ? "28px 22px 32px" : "40px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 32,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                    display: "block",
                    marginBottom: 14,
                    opacity: 0.6,
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontFamily: "'Zen Kaku Gothic New', sans-serif",
                    fontSize: isMobile ? 17 : 20,
                    fontWeight: 700,
                    color: C.text,
                    lineHeight: 1.5,
                    letterSpacing: "0.04em",
                    marginBottom: 14,
                  }}
                >
                  {s.title}
                </h3>
                {/* Blue accent line */}
                <div
                  style={{
                    width: 32,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
                    marginBottom: 16,
                    borderRadius: 2,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    color: C.textSub,
                    lineHeight: 1.9,
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
      style={{
        padding: isMobile ? "64px 20px 56px" : "116px 40px 104px",
        maxWidth: 840,
        margin: "0 auto",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div style={fadeStyle(ceoRef.visible)}>
        {/* Accent line on top */}
        <div
          style={{
            width: 48,
            height: 3,
            background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
            margin: "0 auto 28px",
            borderRadius: 2,
          }}
        />
        <SectionHeading en="Message" ja="代表メッセージ" visible={ceoRef.visible} align="center" icon={sectionIcons.message} />

        {/* 引用符 */}
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 56,
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: 0.3,
            lineHeight: 1,
            display: "block",
            marginBottom: -10,
          }}
        >
          &ldquo;
        </span>

        {/* CEO message with left accent border */}
        <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 24, textAlign: "left" }}>
          {ceoMessage.message.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: isMobile ? 13.5 : 14.5,
                color: C.textSub,
                lineHeight: 2,
                letterSpacing: "0.05em",
                marginBottom: i < ceoMessage.message.length - 1 ? 20 : 36,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* CEO写真 + 名前 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, ...scaleIn(ceoRef.visible, 0.3) }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${C.accent}`,
              boxShadow: `0 4px 16px rgba(59,89,152,0.15)`,
            }}
          >
            <img
              src="/keikamotsu-new-templates/images/ceo-portrait.webp"
              alt={ceoMessage.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: C.text,
                letterSpacing: "0.04em",
              }}
            >
              {ceoMessage.name}
            </p>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 12,
                color: C.textSub,
                letterSpacing: "0.05em",
                marginTop: 2,
              }}
            >
              {ceoMessage.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Company ─── */
  const renderCompany = () => (
    <section
      id="company"
      ref={coRef.ref}
      style={{
        backgroundColor: C.bgSub,
        padding: isMobile ? "60px 20px 52px" : "90px 40px 80px",
        position: "relative",
      }}
    >
      <DiagonalStripes opacity={0.012} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(coRef.visible)}>
          <SectionHeading en="Company" ja="会社概要" visible={coRef.visible} icon={sectionIcons.company} />
        </div>
        <div style={fadeStyle(coRef.visible, 0.1)}>
          {companyOverview.map((item, i) => (
            <div
              key={i}
              style={{
                display: isMobile ? "block" : "flex",
                backgroundColor: i % 2 === 0 ? C.white : C.bgSub,
                padding: isMobile ? "14px 16px" : "16px 24px",
                borderBottom: `1px solid ${C.borderLight}`,
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(59,89,152,0.03)";
                e.currentTarget.style.paddingLeft = isMobile ? "20px" : "28px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = i % 2 === 0 ? C.white : C.bgSub;
                e.currentTarget.style.paddingLeft = isMobile ? "16px" : "24px";
              }}
            >
              <div
                style={{
                  flex: isMobile ? "unset" : "0 0 180px",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.accent,
                  letterSpacing: "0.05em",
                  lineHeight: 1.7,
                  marginBottom: isMobile ? 4 : 0,
                }}
              >
                {item.dt}
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  color: C.textSub,
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              >
                {item.dd}
              </div>
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
    const totalItems = history.length;
    return (
    <section
      id="history"
      ref={hisRef.ref}
      style={{
        position: "relative",
        height: isMobile ? "auto" : `${(totalItems + 1) * 100}vh`,
      }}
    >
      <div
        style={{
          position: isMobile ? "relative" : "sticky",
          top: 0,
          height: isMobile ? "auto" : "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "64px 20px 48px" : "0 40px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div style={fadeStyle(hisRef.visible)}>
            <SectionHeading en="History" ja="沿革" visible={hisRef.visible} icon={sectionIcons.history} />
          </div>

          {/* 水平スクロールタイムライン */}
          <div
            style={{
              overflowX: isMobile ? "auto" : "hidden",
              paddingBottom: 12,
              WebkitOverflowScrolling: "touch",
              ...(isMobile ? { scrollSnapType: "x mandatory" } : {}),
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 0,
                minWidth: isMobile ? 700 : `${totalItems * 280}px`,
                position: "relative",
                transition: isMobile ? "none" : "transform 0.6s ease",
                transform: isMobile ? "none" : `translateX(calc(-${100 / totalItems}% * var(--history-progress, 0)))`,
              }}
              ref={(el) => {
                if (!el || isMobile) return;
                const section = document.getElementById("history");
                if (!section) return;
                const handleScroll = () => {
                  const rect = section.getBoundingClientRect();
                  const sectionHeight = section.offsetHeight - window.innerHeight;
                  const scrolled = -rect.top;
                  const progress = Math.max(0, Math.min(totalItems - 1, (scrolled / sectionHeight) * totalItems));
                  el.style.transform = `translateX(-${(progress / totalItems) * (el.scrollWidth - el.parentElement!.clientWidth)}px)`;
                };
                window.addEventListener("scroll", handleScroll, { passive: true });
                handleScroll();
              }}
            >
              {/* 水平線 */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: C.border,
                }}
              />
              {/* Animated progress line */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 0,
                  height: 2,
                  width: hisRef.visible ? "100%" : "0%",
                  background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
                  transition: "width 2s ease",
                  zIndex: 1,
                }}
              />

              {history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    ...fadeStyle(hisRef.visible, 0.2 + i * 0.15),
                    flex: "0 0 auto",
                    width: isMobile ? 160 : 280,
                    position: "relative",
                    paddingTop: 40,
                    paddingRight: 20,
                    ...(isMobile ? { scrollSnapAlign: "start" } : {}),
                  }}
                >
                  {/* ドット */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 0,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: C.accent,
                      border: `3px solid ${C.white}`,
                      boxShadow: `0 0 0 2px ${C.accent}`,
                      zIndex: 2,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 8,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h.year}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 13,
                      color: C.textSub,
                      lineHeight: 1.75,
                      letterSpacing: "0.05em",
                      marginBottom: 10,
                    }}
                  >
                    {h.event}
                  </p>
                  {/* History image */}
                  {historyImages[i] && (
                    <div
                      style={{
                        width: "90%",
                        height: 70,
                        borderRadius: 6,
                        overflow: "hidden",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <img
                        src={historyImages[i]}
                        alt={`${h.year}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
        padding: isMobile ? "52px 20px 44px" : "100px 40px 90px",
      }}
    >
      {/* 背景画像 */}
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          backgroundImage: "url(/keikamotsu-new-templates/images/delivery.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "brightness(0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, rgba(59,89,152,0.88), rgba(45,69,120,0.9))`,
        }}
      />
      {/* Diagonal stripe overlay */}
      <DiagonalStripes opacity={0.04} />
      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={fadeStyle(numRef.visible)}>
          <SectionHeading en="Numbers" ja="数字で見る実績" visible={numRef.visible} align="center" icon={sectionIcons.numbers} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1fr 1.1fr 0.9fr 1fr",
            gap: isMobile ? 20 : 32,
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
      style={{
        padding: isMobile ? "56px 20px 48px" : "70px 40px 60px",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <div style={fadeStyle(prtRef.visible)}>
        <SectionHeading en="Partners" ja="主要取引先" visible={prtRef.visible} icon={sectionIcons.partners} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1.1fr 0.9fr 1fr" : "1fr 1.05fr 0.95fr 1fr 1.05fr 0.95fr",
          gap: isMobile ? 12 : 20,
          alignItems: "center",
        }}
      >
        {partners.map((p, i) => (
          <div
            key={i}
            style={{
              ...scaleIn(prtRef.visible, 0.08 + i * 0.05),
              backgroundColor: C.bgSub,
              borderRadius: 6,
              padding: isMobile ? "18px 12px" : "24px 16px",
              textAlign: "center",
              border: `1px solid ${C.borderLight}`,
              transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.accent;
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,89,152,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.borderLight;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", margin: "0 auto 10px", border: `1px solid ${C.border}` }}>
              <img src={p.logo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: C.textSub,
                letterSpacing: "0.05em",
                lineHeight: 1.5,
              }}
            >
              {p.name}
            </p>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 10,
                color: "#94a3b8",
                marginTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              {p.industry}
            </p>
          </div>
        ))}
      </div>
      {/* Truck animation */}
      <div style={{ position: "relative", height: isMobile ? 40 : 60, marginTop: isMobile ? 16 : 32, overflow: "hidden", opacity: 0.12 }}>
        {/* Cityscape silhouette background */}
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: isMobile ? 28 : 40 }}>
          <rect x="50" y="20" width="30" height="40" fill={C.textSub} />
          <rect x="90" y="10" width="40" height="50" fill={C.textSub} />
          <rect x="140" y="25" width="25" height="35" fill={C.textSub} />
          <rect x="200" y="15" width="35" height="45" fill={C.textSub} />
          <rect x="260" y="30" width="20" height="30" fill={C.textSub} />
          <rect x="310" y="8" width="45" height="52" fill={C.textSub} />
          <rect x="380" y="22" width="28" height="38" fill={C.textSub} />
          <rect x="430" y="12" width="38" height="48" fill={C.textSub} />
          <rect x="500" y="28" width="22" height="32" fill={C.textSub} />
          <rect x="550" y="5" width="50" height="55" fill={C.textSub} />
          <rect x="620" y="18" width="32" height="42" fill={C.textSub} />
          <rect x="680" y="25" width="26" height="35" fill={C.textSub} />
          <rect x="740" y="10" width="42" height="50" fill={C.textSub} />
          <rect x="810" y="20" width="30" height="40" fill={C.textSub} />
          <rect x="870" y="30" width="24" height="30" fill={C.textSub} />
          <rect x="920" y="14" width="36" height="46" fill={C.textSub} />
          <rect x="980" y="22" width="28" height="38" fill={C.textSub} />
          <rect x="1030" y="8" width="44" height="52" fill={C.textSub} />
          <rect x="1100" y="18" width="32" height="42" fill={C.textSub} />
          <polygon points="170,25 185,10 200,25" fill={C.textSub} />
          <polygon points="460,28 472,15 484,28" fill={C.textSub} />
          <polygon points="770,10 782,0 794,10" fill={C.textSub} />
        </svg>
        {/* Truck SVG */}
        <div style={{ position: "absolute", bottom: isMobile ? 2 : 4, animation: `cp02-truckDrive ${isMobile ? 10 : 15}s linear infinite` }}>
          <svg viewBox="0 0 80 32" style={{ width: isMobile ? 56 : 80, height: isMobile ? 22 : 32 }}>
            <rect x="0" y="4" width="50" height="24" rx="3" fill={C.accent} />
            <rect x="50" y="10" width="22" height="18" rx="2" fill={C.accentLight} />
            <rect x="54" y="13" width="14" height="9" rx="1" fill={C.white} opacity="0.5" />
            <circle cx="14" cy="28" r="5" fill={C.text} />
            <circle cx="14" cy="28" r="2.5" fill={C.textSub} />
            <circle cx="60" cy="28" r="5" fill={C.text} />
            <circle cx="60" cy="28" r="2.5" fill={C.textSub} />
          </svg>
        </div>
      </div>
    </section>
  );

  /* ─── News ─── */
  const renderNews = () => (
    <section
      id="news"
      ref={newsRef.ref}
      style={{
        backgroundColor: C.bgSub,
        padding: isMobile ? "60px 20px 52px" : "76px 40px 64px",
        position: "relative",
      }}
    >
      <WaveDivider color={C.white} flip />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(newsRef.visible)}>
          <SectionHeading en="News" ja="お知らせ" visible={newsRef.visible} icon={sectionIcons.news} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
            gap: isMobile ? 14 : 18,
          }}
        >
          {news.map((n, i) => {
            const tc = tagColor(n.tagStyle);
            return (
              <div
                key={i}
                style={{
                  ...fadeStyle(newsRef.visible, 0.1 + i * 0.08),
                  backgroundColor: C.white,
                  padding: isMobile ? "20px 18px" : "24px 28px",
                  borderRadius: 8,
                  border: `1px solid ${C.borderLight}`,
                  transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,89,152,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.borderLight;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: "#94a3b8",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {n.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      color: tc.color,
                      backgroundColor: tc.bg,
                      padding: "3px 10px",
                      borderRadius: 3,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {n.tag}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: C.text,
                    lineHeight: 1.6,
                    letterSpacing: "0.05em",
                  }}
                >
                  {n.title}
                </p>
              </div>
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
        position: "relative",
        overflow: "hidden",
        padding: isMobile ? "56px 20px 48px" : "130px 40px 140px",
      }}
    >
      {/* 背景に人物写真 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/keikamotsu-new-templates/images/team.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "brightness(0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(50,55,60,0.88)",
        }}
      />
      <DiagonalStripes opacity={0.03} />
      <div
        style={{
          ...scaleIn(recRef.visible, 0.1),
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Recruit
        </p>
        <h2
          style={{
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            fontSize: isMobile ? 21 : 26,
            fontWeight: 700,
            color: C.white,
            letterSpacing: "0.04em",
            marginBottom: 20,
            lineHeight: 1.5,
            position: "relative",
            display: "inline-block",
          }}
        >
          {recruit.heading}
          <span
            style={{
              position: "absolute",
              bottom: -4,
              left: 0,
              height: 3,
              background: `linear-gradient(90deg, ${C.accentLight}, ${C.white})`,
              borderRadius: 2,
              width: recRef.visible ? "100%" : "0%",
              transition: "width 0.8s ease 0.3s",
            }}
          />
        </h2>
        {/* Decorative gradient line */}
        <div
          style={{
            width: 48,
            height: 3,
            background: `linear-gradient(90deg, ${C.accentLight}, ${C.white})`,
            margin: "0 auto 24px",
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.95,
            letterSpacing: "0.05em",
            marginBottom: 32,
          }}
        >
          {recruit.text.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < recruit.text.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <a
          href={recruit.link}
          style={{
            display: "inline-block",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: C.cta,
            backgroundColor: C.white,
            padding: "14px 44px",
            borderRadius: 5,
            textDecoration: "none",
            letterSpacing: "0.05em",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,255,255,0.2)";
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
              background: "linear-gradient(90deg, transparent, rgba(59,89,152,0.1), transparent)",
              animation: "cp02-shine 3s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          {recruit.cta}
        </a>
      </div>
    </section>
  );

  /* ─── Access ─── */
  const renderAccess = () => (
    <section
      id="access"
      ref={accRef.ref}
      style={{
        padding: isMobile ? "64px 20px 48px" : "88px 40px 76px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={fadeStyle(accRef.visible)}>
        <SectionHeading en="Access" ja={access.heading} visible={accRef.visible} icon={sectionIcons.access} />
      </div>

      <div
        style={{
          display: isMobile ? "block" : "flex",
          gap: 40,
          ...fadeStyle(accRef.visible, 0.1),
        }}
      >
        {/* 左:情報 */}
        <div
          style={{
            flex: isMobile ? "unset" : "0 0 360px",
            marginBottom: isMobile ? 24 : 0,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.accent,
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              所在地
            </p>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14,
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
                fontSize: 12,
                fontWeight: 600,
                color: C.accent,
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              最寄り駅
            </p>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14,
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
              fontSize: 13,
              color: C.textSub,
              lineHeight: 1.7,
              letterSpacing: "0.05em",
            }}
          >
            {access.mapNote}
          </p>
        </div>

        {/* 右:マップ */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              border: `2px solid ${C.accent}`,
              boxShadow: "0 4px 20px rgba(59,89,152,0.1)",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.9!2d135.637!3d34.762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5aSn6Ziq5bqc5a-d5bGL5bed5biC5rGg55SwMi0xMS01NQ!5e0!3m2!1sja!2sjp!4v1234567890"
              width="100%"
              height={isMobile ? "280" : "340"}
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
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
      style={{
        backgroundColor: C.bgSub,
        padding: isMobile ? "60px 20px 52px" : "134px 40px 144px",
        position: "relative",
      }}
    >
      <DotGrid opacity={0.02} />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={fadeStyle(ctRef.visible)}>
          <SectionHeading en="Contact" ja={contact.heading} visible={ctRef.visible} align="center" icon={sectionIcons.contact} />
        </div>
        <div style={fadeStyle(ctRef.visible, 0.1)}>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 13,
              color: C.textSub,
              lineHeight: 1.9,
              letterSpacing: "0.05em",
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            {contact.intro.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < contact.intro.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* フォームカード */}
          <div
            style={{
              backgroundColor: C.white,
              padding: isMobile ? "28px 22px 32px" : "40px 44px 48px",
              borderRadius: 8,
              boxShadow: "0 4px 24px rgba(59,89,152,0.08)",
              border: `1px solid ${C.borderLight}`,
            }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              {contact.fields.map((field, i) => {
                const placeholders: Record<string, string> = {
                  company: "例）グリーンロジスティクス株式会社",
                  name: "例）山田 太郎",
                  email: "例）info@example.co.jp",
                  phone: "例）090-1234-5678",
                  message: "例）配送サービスについてお見積もりをお願いしたいです。",
                };
                return (
                <div key={i} style={{ marginBottom: 22 }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                      letterSpacing: "0.05em",
                      marginBottom: 7,
                    }}
                  >
                    {field.label}
                    {field.required && (
                      <span
                        style={{
                          color: C.white,
                          background: C.accent,
                          fontSize: 10,
                          padding: "1px 8px",
                          borderRadius: 3,
                          marginLeft: 8,
                          fontWeight: 600,
                        }}
                      >
                        必須
                      </span>
                    )}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      placeholder={placeholders[field.name] || ""}
                      rows={5}
                      style={{
                        width: "100%",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 14,
                        color: C.text,
                        padding: "12px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        outline: "none",
                        resize: "vertical",
                        lineHeight: 1.7,
                        boxSizing: "border-box",
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = C.accent;
                        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(59,89,152,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      placeholder={placeholders[field.name] || ""}
                      style={{
                        width: "100%",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 14,
                        color: C.text,
                        padding: "11px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = C.accent;
                        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(59,89,152,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  )}
                </div>
                );
              })}

              <button
                type="submit"
                style={{
                  width: "100%",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.white,
                  backgroundColor: C.cta,
                  padding: "14px 0",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  marginTop: 8,
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(50,55,60,0.25)";
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
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                    animation: "cp02-shine 3s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
                送信する
              </button>
            </form>
          </div>
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
        padding: isMobile ? "44px 20px 28px" : "64px 40px 36px",
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
          filter: "grayscale(100%) brightness(0.1)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(30,41,59,0.95)" }} />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: isMobile ? "block" : "flex",
          gap: 48,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* 左:ロゴ + 住所 */}
        <div style={{ flex: isMobile ? "unset" : "0 0 300px", marginBottom: isMobile ? 32 : 0 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: C.white,
              letterSpacing: "0.02em",
              marginBottom: 14,
            }}
          >
            GREEN
            <span style={{ color: C.accentLight, marginLeft: 4 }}>LOGISTICS</span>
          </p>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.8,
              letterSpacing: "0.05em",
            }}
          >
            〒{company.postalCode}
            <br />
            {company.address}
          </p>
        </div>

        {/* 中:ナビ */}
        <div style={{ flex: 1, marginBottom: isMobile ? 28 : 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1.1fr 0.9fr 1fr",
              gap: isMobile ? "8px 16px" : "8px 24px",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  padding: "5px 0",
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                <><span style={{marginRight:4,fontSize:"0.85em"}}>{link.icon}</span>{link.label}</>
              </a>
            ))}
          </div>
        </div>

        {/* 右:電話 + メール */}
        <div style={{ flex: isMobile ? "unset" : "0 0 220px" }}>
          <div style={{ marginBottom: 14 }}>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              電話番号
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: C.white,
                letterSpacing: "0.04em",
              }}
            >
              {company.phone}
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              メール
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.02em",
              }}
            >
              {company.email}
            </p>
          </div>
        </div>
      </div>

      {/* コピーライト */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: isMobile ? 28 : 44,
          paddingTop: 20,
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.04em",
          }}
        >
          &copy; {new Date().getFullYear()} {company.nameEn} All rights reserved.
        </p>
      </div>
    </footer>
  );

  /* ═══════════════ レンダー ═══════════════ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      {renderHeader()}
      <main>
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
      </main>
      {renderFooter()}
    </>
  );
}

/* ───────────────────────────────────────────
   Number Card with count-up animation
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
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobileGlobal ? 34 : 46,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {displayValue}
        <span
          style={{
            fontSize: isMobileGlobal ? 16 : 20,
            fontWeight: 500,
            marginLeft: 2,
            opacity: 0.8,
          }}
        >
          {suffix}
        </span>
      </p>
      <p
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.08em",
          marginTop: 8,
        }}
      >
        {label}
      </p>
    </div>
  );
}
