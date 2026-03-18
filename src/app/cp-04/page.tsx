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

/* ───────────────────── CONSTANTS ───────────────────── */
const ACCENT = "#00e5ff";
const DARK = "#0d1117";
const LIGHT = "#ffffff";
const CTA_BG = "#00e5ff";
const SUB_DARK = "#161b22";
const GRAY = "#8b949e";
const BP = 768;

/* image paths */
const IMG = "/keikamotsu-new-templates/images";
const VID = "/keikamotsu-new-templates/videos";

const SERVICE_IMAGES = [
  `${IMG}/service-b2b.webp`,
  `${IMG}/service-ec.webp`,
  `${IMG}/service-route.webp`,
  `${IMG}/service-spot.webp`,
];
const STRENGTH_IMAGES = [
  `${IMG}/strength-01.webp`,
  `${IMG}/strength-02.webp`,
  `${IMG}/strength-03.webp`,
];
const HISTORY_IMAGES: Record<string, string> = {
  "2021": `${IMG}/history-2021.webp`,
  "2022": `${IMG}/history-2022.webp`,
  "2023": `${IMG}/history-2023.webp`,
  "2024": `${IMG}/history-2024.webp`,
  "2025": `${IMG}/history-2025.webp`,
};

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

/* ───────────────────── HOOK: IntersectionObserver ───────────────────── */
function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

/* ───────────────────── HOOK: Counter Animation ───────────────────── */
function useCounter(end: number, visible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);
  return count;
}

/* ───────────────────── HOOK: Typewriter ───────────────────── */
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

/* ───────────────────── DIAGONAL DIVIDER ───────────────────── */
function DiagDivider({
  from,
  to,
  direction = "left",
  height = 80,
}: {
  from: string;
  to: string;
  direction?: "left" | "right";
  height?: number;
}) {
  const clip =
    direction === "left"
      ? `polygon(0 0, 100% ${height}px, 100% 100%, 0 100%)`
      : `polygon(0 ${height}px, 100% 0, 100% 100%, 0 100%)`;
  return (
    <div
      style={{
        height,
        background: to,
        clipPath: clip,
        marginTop: -1,
        position: "relative",
        zIndex: 2,
      }}
    />
  );
}

/* ───────────────────── SECTION HEADING ───────────────────── */
function SectionHeading({
  num,
  enTitle,
  jpTitle,
  light = false,
}: {
  num: string;
  enTitle: string;
  jpTitle: string;
  light?: boolean;
}) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        marginBottom: 48,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: ACCENT,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            WebkitTextStroke: light ? `1px ${ACCENT}` : "none",
            WebkitTextFillColor: light ? "transparent" : ACCENT,
          }}
        >
          {num}
        </span>
        <div
          style={{
            width: 60,
            height: 3,
            background: ACCENT,
            transform: "skewX(-20deg)",
          }}
        />
      </div>
      <p
        style={{
          fontFamily: "'Oswald', 'Zen Kaku Gothic New', sans-serif",
          fontSize: 13,
          fontWeight: 300,
          textTransform: "uppercase" as const,
          letterSpacing: "0.2em",
          color: light ? "rgba(255,255,255,0.5)" : GRAY,
          margin: "0 0 4px",
        }}
      >
        {enTitle}
      </p>
      <h2
        style={{
          fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
          fontWeight: 900,
          fontSize: 32,
          color: light ? LIGHT : DARK,
          margin: 0,
          letterSpacing: "0.04em",
        }}
      >
        {jpTitle}
      </h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function CP04Page() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroTyped = useTypewriter(hero.headline, 80, 600);

  /* form */
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formSent, setFormSent] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* reveal refs for every section */
  const [servRef, servVis] = useReveal();
  const [strRef, strVis] = useReveal();
  const [ceoRef, ceoVis] = useReveal();
  const [compRef, compVis] = useReveal();
  const [histRef, histVis] = useReveal();
  const [numRef, numVis] = useReveal();
  const [partRef, partVis] = useReveal();
  const [newsRef, newsVis] = useReveal();
  const [recRef, recVis] = useReveal();
  const [accRef, accVis] = useReveal();
  const [contRef, contVis] = useReveal();

  /* ─── STYLES ─── */
  const oswald: React.CSSProperties = {
    fontFamily: "'Oswald', sans-serif",
  };
  const zenKaku: React.CSSProperties = {
    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
  };
  const bodyFont: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 400,
    lineHeight: 1.85,
  };

  /* CSS keyframes */
  const cssKeyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;700&family=Zen+Kaku+Gothic+New:wght@400;700;900&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes slideInLeft {
      from { transform: translateX(-80px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInRight {
      from { transform: translateX(80px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes diagonalSlide {
      from { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
      to { transform: translateX(0) skewX(-20deg); opacity: 1; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.4); }
      50% { box-shadow: 0 0 20px 8px rgba(0,229,255,0.15); }
    }
    @keyframes shineSweep {
      0% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes drawLine {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    @keyframes floatTriangle {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes expandWidth {
      from { width: 0; }
      to { width: 100%; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; }
    * { box-sizing: border-box; }

    .edge-btn {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: none;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .edge-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 32px rgba(0,229,255,0.3);
    }
    .edge-btn::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      transition: none;
    }
    .edge-btn:hover::after {
      animation: shineSweep 0.6s ease-out;
    }

    .edge-card {
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
    }
    .edge-card:hover {
      transform: perspective(800px) rotateY(-3deg) rotateX(2deg) translateY(-6px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .nav-link {
      position: relative;
      text-decoration: none;
      color: rgba(255,255,255,0.7);
      font-size: 13px;
      letter-spacing: 0.05em;
      transition: color 0.3s;
      padding-bottom: 4px;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: ${ACCENT};
      transition: width 0.3s;
    }
    .nav-link:hover { color: ${ACCENT}; }
    .nav-link:hover::after { width: 100%; }

    .form-input {
      width: 100%;
      padding: 14px 16px;
      background: ${SUB_DARK};
      border: 2px solid transparent;
      color: ${LIGHT};
      font-size: 15px;
      font-family: 'Noto Sans JP', sans-serif;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .form-input:focus {
      border-color: ${ACCENT};
      box-shadow: 0 0 0 3px rgba(0,229,255,0.15);
    }

    .cta-pulse {
      animation: pulseGlow 2s ease-in-out infinite;
    }
  `;

  /* ═══════════════ HEADER ═══════════════ */
  const headerEl = (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: scrolled ? "rgba(13,17,23,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(0,229,255,0.15)` : "none",
        transition: "all 0.4s",
        padding: scrolled ? "12px 0" : "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: ACCENT,
              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <span
            style={{
              ...oswald,
              fontWeight: 700,
              fontSize: 18,
              color: LIGHT,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
            }}
          >
            {company.nameEn.split(" ")[0]}
          </span>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: 24 }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                className="nav-link"
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href);
                }}
                style={{ ...oswald, fontWeight: 300, textTransform: "uppercase" as const }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile hamburger */}
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
                width: 28,
                height: 2,
                background: ACCENT,
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
              }}
            />
            <span
              style={{
                width: 28,
                height: 2,
                background: ACCENT,
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: 28,
                height: 2,
                background: ACCENT,
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <nav
          style={{
            background: "rgba(13,17,23,0.98)",
            padding: "24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(l.href);
              }}
              style={{
                color: LIGHT,
                textDecoration: "none",
                fontSize: 15,
                ...zenKaku,
                fontWeight: 400,
                padding: "4px 0",
                borderLeft: `3px solid ${ACCENT}`,
                paddingLeft: 12,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );

  /* ═══════════════ HERO - TRUE SPLIT SCREEN ═══════════════ */
  const heroEl = (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        background: DARK,
      }}
    >
      {/* LEFT DARK PANEL - content */}
      <div
        style={{
          width: isMobile ? "100%" : "50%",
          minHeight: isMobile ? "50vh" : "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "120px 24px 40px" : "0 60px 0 80px",
          position: "relative",
          zIndex: 3,
          background: DARK,
          clipPath: isMobile ? "none" : "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
        }}
      >
        {/* Decorative triangle */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 100 : 120,
            left: isMobile ? 20 : 60,
            width: 80,
            height: 80,
            border: `2px solid rgba(0,229,255,0.2)`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            animation: "floatTriangle 6s ease-in-out infinite",
          }}
        />
        {/* Decorative parallelogram */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 40 : 140,
            right: isMobile ? 20 : 80,
            width: 120,
            height: 40,
            background: `rgba(0,229,255,0.06)`,
            transform: "skewX(-20deg)",
          }}
        />

        <p
          style={{
            ...oswald,
            fontWeight: 300,
            fontSize: 13,
            textTransform: "uppercase" as const,
            letterSpacing: "0.3em",
            color: ACCENT,
            marginBottom: 16,
          }}
        >
          {company.nameEn}
        </p>
        <h1
          style={{
            fontFamily: "'Klee One', 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
            fontWeight: 600,
            fontSize: isMobile ? 32 : 50,
            color: LIGHT,
            lineHeight: 1.4,
            margin: "0 0 24px",
            letterSpacing: "0.06em",
          }}
        >
          {heroTyped.displayed}
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: isMobile ? 32 : 48,
              background: ACCENT,
              marginLeft: 4,
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
            }}
          />
        </h1>
        {hero.subtext.map((line, i) => (
          <p
            key={i}
            style={{
              ...bodyFont,
              color: "rgba(255,255,255,0.65)",
              fontSize: 14,
              margin: "0 0 6px",
              maxWidth: 440,
            }}
          >
            {line}
          </p>
        ))}
        <div style={{ marginTop: 32 }}>
          <button
            className="edge-btn cta-pulse"
            onClick={() => scrollTo("#contact")}
            style={{
              background: ACCENT,
              color: DARK,
              padding: "16px 40px",
              fontSize: 15,
              fontWeight: 700,
              ...oswald,
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 100%, 16px 100%)",
            }}
          >
            {hero.cta}
          </button>
        </div>
      </div>

      {/* RIGHT VIDEO PANEL */}
      <div
        style={{
          position: isMobile ? "relative" : "absolute",
          top: 0,
          right: 0,
          width: isMobile ? "100%" : "60%",
          height: isMobile ? "50vh" : "100%",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={`${IMG}/hero-bg.webp`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={`${VID}/hero-nightcity.mp4`} type="video/mp4" />
        </video>
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isMobile
              ? "linear-gradient(to bottom, rgba(13,17,23,0.4), rgba(13,17,23,0.7))"
              : "linear-gradient(to right, rgba(13,17,23,0.6) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ ...oswald, fontSize: 11, color: ACCENT, letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
      </div>
    </section>
  );

  /* ═══════════════ SERVICES - SKEWED BG ═══════════════ */
  const servicesEl = (
    <>
      <DiagDivider from={DARK} to={LIGHT} direction="left" height={90} />
      <section
        id="services"
        style={{
          background: LIGHT,
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
        }}
      >
        {/* Decorative diagonal lines */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: -40,
            width: 300,
            height: 4,
            background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
            transform: "rotate(-6deg)",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 70,
            right: -20,
            width: 200,
            height: 2,
            background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
            transform: "rotate(-6deg)",
            opacity: 0.1,
          }}
        />

        <div ref={servRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading num="01" enTitle="Services" jpTitle="事業内容" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 32,
            }}
          >
            {services.map((s, i) => {
              const delay = i * 150;
              return (
                <div
                  key={i}
                  className="edge-card"
                  style={{
                    background: LIGHT,
                    border: `1px solid #e0e0e0`,
                    overflow: "hidden",
                    opacity: servVis ? 1 : 0,
                    transform: servVis
                      ? "translateY(0)"
                      : i % 2 === 0
                      ? "translateX(-40px)"
                      : "translateX(40px)",
                    transition: `all 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
                  }}
                >
                  {/* Image with diagonal overlay */}
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img
                      src={SERVICE_IMAGES[i]}
                      alt={s.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        background: LIGHT,
                        clipPath: "polygon(0 100%, 100% 30%, 100% 100%)",
                      }}
                    />
                    {/* Number badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        background: ACCENT,
                        color: DARK,
                        padding: "6px 16px",
                        ...oswald,
                        fontWeight: 700,
                        fontSize: 18,
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
                      }}
                    >
                      {s.num}
                    </div>
                  </div>
                  <div style={{ padding: "20px 24px 28px" }}>
                    <h3
                      style={{
                        ...zenKaku,
                        fontWeight: 700,
                        fontSize: 18,
                        color: DARK,
                        margin: "0 0 12px",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        ...bodyFont,
                        fontSize: 14,
                        color: "#555",
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {s.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ STRENGTHS - SKEWED DARK BG ═══════════════ */
  const strengthsEl = (
    <>
      <DiagDivider from={LIGHT} to={DARK} direction="right" height={90} />
      <section
        id="strengths"
        style={{
          background: DARK,
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
        }}
      >
        {/* Large decorative triangle */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            border: `1px solid rgba(0,229,255,0.08)`,
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div ref={strRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading num="02" enTitle="Strengths" jpTitle="私たちの強み" light />
          {strengths.map((s, i) => {
            const isEven = i % 2 === 0;
            const delay = i * 200;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : isEven ? "row" : "row-reverse",
                  gap: isMobile ? 0 : 0,
                  marginBottom: i < strengths.length - 1 ? 60 : 0,
                  opacity: strVis ? 1 : 0,
                  transform: strVis
                    ? "translateY(0)"
                    : `translateY(50px)`,
                  transition: `all 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
                  overflow: "hidden",
                }}
              >
                {/* Image - 60% */}
                <div
                  style={{
                    width: isMobile ? "100%" : "60%",
                    height: isMobile ? 220 : 320,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={STRENGTH_IMAGES[i]}
                    alt={s.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      clipPath: isMobile
                        ? "none"
                        : isEven
                        ? "polygon(0 0, 95% 0, 100% 100%, 0 100%)"
                        : "polygon(5% 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                  {/* Geometric numbered frame */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      ...(isEven ? { right: isMobile ? 20 : 40 } : { left: isMobile ? 20 : 40 }),
                      background: "rgba(13,17,23,0.9)",
                      border: `2px solid ${ACCENT}`,
                      padding: "8px 20px",
                      ...oswald,
                      fontWeight: 700,
                      fontSize: 28,
                      color: ACCENT,
                      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)",
                    }}
                  >
                    {s.num}
                  </div>
                </div>
                {/* Text - 40% */}
                <div
                  style={{
                    width: isMobile ? "100%" : "40%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: isMobile ? "28px 8px" : isEven ? "32px 32px 32px 48px" : "32px 48px 32px 32px",
                  }}
                >
                  <h3
                    style={{
                      ...zenKaku,
                      fontWeight: 700,
                      fontSize: 22,
                      color: LIGHT,
                      margin: "0 0 16px",
                      borderLeft: `4px solid ${ACCENT}`,
                      paddingLeft: 16,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...bodyFont,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );

  /* ═══════════════ CEO MESSAGE - SPLIT LAYOUT ═══════════════ */
  const ceoEl = (
    <>
      <DiagDivider from={DARK} to={LIGHT} direction="left" height={90} />
      <section
        id="message"
        style={{
          background: LIGHT,
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
        }}
      >
        <div ref={ceoRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading num="03" enTitle="CEO Message" jpTitle="代表メッセージ" />
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 32 : 0,
              opacity: ceoVis ? 1 : 0,
              transform: ceoVis ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* CEO Image - 40% */}
            <div
              style={{
                width: isMobile ? "100%" : "40%",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: isMobile ? 320 : 480,
                  overflow: "hidden",
                  clipPath: isMobile
                    ? "none"
                    : "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
                }}
              >
                <img
                  src={`${IMG}/ceo-portrait.webp`}
                  alt={ceoMessage.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Name plate */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  background: DARK,
                  padding: "16px 32px",
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)",
                }}
              >
                <p style={{ ...oswald, fontWeight: 300, fontSize: 12, color: ACCENT, margin: "0 0 2px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                  {ceoMessage.title}
                </p>
                <p style={{ ...zenKaku, fontWeight: 700, fontSize: 20, color: LIGHT, margin: 0 }}>
                  {ceoMessage.name}
                </p>
              </div>
            </div>
            {/* Message - 60% */}
            <div
              style={{
                width: isMobile ? "100%" : "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: isMobile ? "0" : "24px 0 24px 48px",
              }}
            >
              {ceoMessage.message.map((p, i) => (
                <p
                  key={i}
                  style={{
                    ...bodyFont,
                    fontSize: 15,
                    color: "#333",
                    margin: "0 0 20px",
                    opacity: ceoVis ? 1 : 0,
                    transform: ceoVis ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.6s ease ${300 + i * 150}ms`,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ COMPANY OVERVIEW - SKEWED ═══════════════ */
  const companyEl = (
    <>
      <DiagDivider from={LIGHT} to={DARK} direction="right" height={90} />
      <section
        id="company"
        style={{
          background: DARK,
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
        }}
      >
        {/* Skewed decorative bg strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${SUB_DARK} 0%, transparent 50%)`,
            transform: "skewY(-3deg)",
            transformOrigin: "top left",
          }}
        />
        <div ref={compRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <SectionHeading num="04" enTitle="Company" jpTitle="会社概要" light />
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 40,
              opacity: compVis ? 1 : 0,
              transform: compVis ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* Company image */}
            <div style={{ width: isMobile ? "100%" : "40%", overflow: "hidden" }}>
              <img
                src={`${IMG}/company.webp`}
                alt="会社外観"
                style={{
                  width: "100%",
                  height: isMobile ? 220 : 360,
                  objectFit: "cover",
                  clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
                }}
              />
            </div>
            {/* Table */}
            <div style={{ width: isMobile ? "100%" : "60%" }}>
              <dl style={{ margin: 0 }}>
                {companyOverview.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      borderBottom: `1px solid rgba(255,255,255,0.08)`,
                      padding: "14px 0",
                      opacity: compVis ? 1 : 0,
                      transform: compVis ? "translateX(0)" : "translateX(20px)",
                      transition: `all 0.5s ease ${i * 80}ms`,
                    }}
                  >
                    <dt
                      style={{
                        ...oswald,
                        fontWeight: 400,
                        fontSize: 13,
                        color: ACCENT,
                        width: isMobile ? "100%" : 140,
                        flexShrink: 0,
                        letterSpacing: "0.05em",
                        marginBottom: isMobile ? 4 : 0,
                      }}
                    >
                      {item.dt}
                    </dt>
                    <dd
                      style={{
                        ...bodyFont,
                        fontSize: 14,
                        color: "rgba(255,255,255,0.85)",
                        margin: 0,
                      }}
                    >
                      {item.dd}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ HISTORY - DIAGONAL TIMELINE ═══════════════ */
  const historyEl = (
    <>
      <DiagDivider from={DARK} to={LIGHT} direction="left" height={90} />
      <section
        id="history"
        style={{
          background: LIGHT,
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
        }}
      >
        {/* Decorative parallelogram */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: -40,
            width: 200,
            height: 100,
            background: "rgba(0,229,255,0.04)",
            transform: "skewX(-15deg)",
          }}
        />
        <div ref={histRef} style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading num="05" enTitle="History" jpTitle="沿革" />
          <div style={{ position: "relative", paddingLeft: isMobile ? 40 : 60 }}>
            {/* Vertical timeline line */}
            <div
              style={{
                position: "absolute",
                left: isMobile ? 16 : 24,
                top: 0,
                bottom: 0,
                width: 3,
                background: `linear-gradient(to bottom, ${ACCENT}, rgba(0,229,255,0.1))`,
                transformOrigin: "top",
                transform: histVis ? "scaleY(1)" : "scaleY(0)",
                transition: "transform 1.2s cubic-bezier(.22,1,.36,1)",
              }}
            />
            {history.map((h, i) => {
              const delay = 300 + i * 250;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 12 : 24,
                    marginBottom: 40,
                    position: "relative",
                    opacity: histVis ? 1 : 0,
                    transform: histVis ? "translateX(0)" : "translateX(-30px)",
                    transition: `all 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: isMobile ? -32 : -44,
                      top: 8,
                      width: 14,
                      height: 14,
                      background: ACCENT,
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                  />
                  <div style={{ flexShrink: 0 }}>
                    <span
                      style={{
                        ...oswald,
                        fontWeight: 700,
                        fontSize: 32,
                        color: DARK,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {h.year}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20, flex: 1 }}>
                    {HISTORY_IMAGES[h.year] && (
                      <img
                        src={HISTORY_IMAGES[h.year]}
                        alt={h.year}
                        style={{
                          width: isMobile ? "100%" : 200,
                          height: isMobile ? 160 : 120,
                          objectFit: "cover",
                          flexShrink: 0,
                          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
                        }}
                      />
                    )}
                    <p
                      style={{
                        ...bodyFont,
                        fontSize: 15,
                        color: "#444",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {h.event}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ NUMBERS - PARALLAX DARK ═══════════════ */
  const numbersEl = (
    <>
      <DiagDivider from={LIGHT} to={DARK} direction="right" height={90} />
      <section
        id="numbers"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "80px 20px" : "100px 0",
        }}
      >
        {/* Parallax BG */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG}/team.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: isMobile ? "scroll" : "fixed",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(13,17,23,0.88)" }} />
        {/* Skewed accent strip */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 120,
            background: `rgba(0,229,255,0.04)`,
            transform: "skewY(-4deg)",
          }}
        />
        <div ref={numRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ ...oswald, fontWeight: 300, fontSize: 13, color: ACCENT, letterSpacing: "0.2em", textTransform: "uppercase" as const, margin: "0 0 8px" }}>
              Numbers
            </p>
            <h2 style={{ ...zenKaku, fontWeight: 900, fontSize: 28, color: LIGHT, margin: 0 }}>
              数字で見る実績
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: 32,
            }}
          >
            {numbers.map((n, i) => {
              const numVal = parseFloat(n.value.replace(/,/g, ""));
              const count = useCounter(numVal, numVis);
              const delay = i * 150;
              return (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    opacity: numVis ? 1 : 0,
                    transform: numVis ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
                    transition: `all 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        ...oswald,
                        fontWeight: 700,
                        fontSize: isMobile ? 40 : 56,
                        color: ACCENT,
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                      }}
                    >
                      {count.toLocaleString()}
                    </span>
                    <span
                      style={{
                        ...oswald,
                        fontWeight: 400,
                        fontSize: 18,
                        color: ACCENT,
                      }}
                    >
                      {n.suffix}
                    </span>
                  </div>
                  <p
                    style={{
                      ...bodyFont,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      marginTop: 8,
                    }}
                  >
                    {n.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ PARTNERS ═══════════════ */
  const partnersEl = (
    <>
      <DiagDivider from={DARK} to={LIGHT} direction="left" height={80} />
      <section
        id="partners"
        style={{
          background: LIGHT,
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div ref={partRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading num="06" enTitle="Partners" jpTitle="主要取引先" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {partners.map((p, i) => (
              <div
                key={i}
                className="edge-card"
                style={{
                  background: LIGHT,
                  border: "1px solid #e8e8e8",
                  padding: 24,
                  textAlign: "center",
                  opacity: partVis ? 1 : 0,
                  transform: partVis ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.6s cubic-bezier(.22,1,.36,1) ${i * 100}ms`,
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 12px",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    style={{ maxWidth: 50, maxHeight: 50, objectFit: "contain" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <p style={{ ...zenKaku, fontWeight: 700, fontSize: 14, color: DARK, margin: "0 0 4px" }}>
                  {p.name}
                </p>
                <p style={{ ...oswald, fontWeight: 300, fontSize: 12, color: GRAY, margin: 0, textTransform: "uppercase" as const }}>
                  {p.industry}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ NEWS ═══════════════ */
  const newsEl = (
    <>
      <DiagDivider from={LIGHT} to={SUB_DARK} direction="right" height={80} />
      <section
        id="news"
        style={{
          background: SUB_DARK,
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Skewed bg accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `linear-gradient(135deg, rgba(0,229,255,0.03), transparent 60%)`,
            transform: "skewY(3deg)",
            transformOrigin: "top right",
          }}
        />
        <div ref={newsRef} style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <SectionHeading num="07" enTitle="News" jpTitle="お知らせ" light />
          {news.map((n, i) => {
            const tagColors: Record<string, string> = {
              press: "#ff6b35",
              new: "#00e5ff",
              default: "#8b949e",
            };
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? 8 : 24,
                  padding: "20px 0",
                  borderBottom: `1px solid rgba(255,255,255,0.06)`,
                  opacity: newsVis ? 1 : 0,
                  transform: newsVis ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.6s ease ${i * 120}ms`,
                  cursor: "pointer",
                }}
              >
                <span style={{ ...oswald, fontSize: 14, color: GRAY, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                  {n.date}
                </span>
                <span
                  style={{
                    ...oswald,
                    fontSize: 11,
                    fontWeight: 700,
                    color: DARK,
                    background: tagColors[n.tagStyle] || tagColors.default,
                    padding: "3px 12px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
                    flexShrink: 0,
                  }}
                >
                  {n.tag}
                </span>
                <span style={{ ...bodyFont, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                  {n.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );

  /* ═══════════════ RECRUIT - BOLD BG ═══════════════ */
  const recruitEl = (
    <>
      <DiagDivider from={SUB_DARK} to={DARK} direction="left" height={80} />
      <section
        id="recruit"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "80px 20px" : "100px 0",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG}/delivery.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(13,17,23,0.85)" }} />
        {/* Diagonal accent strips */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "20%", left: "-5%", width: "110%", height: 3, background: `rgba(0,229,255,0.1)`, transform: "rotate(-6deg)" }} />
          <div style={{ position: "absolute", top: "60%", left: "-5%", width: "110%", height: 2, background: `rgba(0,229,255,0.06)`, transform: "rotate(-6deg)" }} />
        </div>
        <div ref={recRef} style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              opacity: recVis ? 1 : 0,
              transform: recVis ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <p style={{ ...oswald, fontWeight: 300, fontSize: 13, color: ACCENT, letterSpacing: "0.2em", textTransform: "uppercase" as const, margin: "0 0 12px" }}>
              Recruit
            </p>
            <h2 style={{ ...zenKaku, fontWeight: 900, fontSize: isMobile ? 24 : 32, color: LIGHT, margin: "0 0 24px" }}>
              {recruit.heading}
            </h2>
            <p style={{ ...bodyFont, fontSize: 15, color: "rgba(255,255,255,0.75)", whiteSpace: "pre-line", margin: "0 0 36px" }}>
              {recruit.text}
            </p>
            <a
              href={recruit.link}
              className="edge-btn cta-pulse"
              style={{
                display: "inline-block",
                background: ACCENT,
                color: DARK,
                padding: "18px 56px",
                fontSize: 16,
                fontWeight: 700,
                ...oswald,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                textDecoration: "none",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)",
              }}
            >
              {recruit.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ ACCESS ═══════════════ */
  const accessEl = (
    <>
      <DiagDivider from={DARK} to={LIGHT} direction="right" height={80} />
      <section
        id="access"
        style={{
          background: LIGHT,
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div ref={accRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading num="08" enTitle="Access" jpTitle="アクセス" />
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 40,
              opacity: accVis ? 1 : 0,
              transform: accVis ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div style={{ width: isMobile ? "100%" : "40%" }}>
              <div style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: 20, marginBottom: 24 }}>
                <p style={{ ...bodyFont, fontSize: 16, color: DARK, margin: "0 0 8px", fontWeight: 500 }}>
                  {access.address}
                </p>
                <p style={{ ...bodyFont, fontSize: 14, color: "#666", margin: "0 0 8px" }}>
                  {access.nearestStation}
                </p>
                <p style={{ ...bodyFont, fontSize: 13, color: "#888", margin: 0 }}>
                  {access.mapNote}
                </p>
              </div>
              <div style={{ ...bodyFont, fontSize: 14, color: "#555" }}>
                <p style={{ margin: "0 0 4px" }}>TEL: {company.phone}</p>
                <p style={{ margin: "0 0 4px" }}>FAX: {company.fax}</p>
                <p style={{ margin: 0 }}>{company.hours}</p>
              </div>
            </div>
            <div
              style={{
                width: isMobile ? "100%" : "60%",
                height: 320,
                background: "#f0f0f0",
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                overflow: "hidden",
              }}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(access.address)}&output=embed`}
                style={{ width: "100%", height: "100%", border: "none" }}
                loading="lazy"
                title="Google Map"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );

  /* ═══════════════ CONTACT - DARK SKEWED ═══════════════ */
  const contactEl = (
    <>
      <DiagDivider from={LIGHT} to={DARK} direction="left" height={90} />
      <section
        id="contact"
        style={{
          background: DARK,
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 80px" : "80px 0 100px",
        }}
      >
        {/* Skewed accent bg */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: SUB_DARK,
            clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div ref={contRef} style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <SectionHeading num="09" enTitle="Contact" jpTitle="お問い合わせ" light />
          <p
            style={{
              ...bodyFont,
              fontSize: 14,
              color: "rgba(255,255,255,0.65)",
              whiteSpace: "pre-line",
              marginBottom: 32,
              opacity: contVis ? 1 : 0,
              transition: "opacity 0.6s ease 0.2s",
            }}
          >
            {contact.intro}
          </p>
          {formSent ? (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                border: `1px solid rgba(0,229,255,0.3)`,
                background: "rgba(0,229,255,0.05)",
              }}
            >
              <p style={{ ...zenKaku, fontWeight: 700, fontSize: 20, color: ACCENT, margin: "0 0 8px" }}>
                送信完了
              </p>
              <p style={{ ...bodyFont, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                お問い合わせありがとうございます。担当より折り返しご連絡いたします。
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                opacity: contVis ? 1 : 0,
                transform: contVis ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(.22,1,.36,1) 0.3s",
              }}
            >
              {contact.fields.map((f) => (
                <div key={f.name}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      ...oswald,
                      fontWeight: 300,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                    {f.required && (
                      <span
                        style={{
                          fontSize: 10,
                          color: DARK,
                          background: ACCENT,
                          padding: "1px 6px",
                          fontWeight: 700,
                        }}
                      >
                        REQUIRED
                      </span>
                    )}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      className="form-input"
                      rows={5}
                      required={f.required}
                      value={formData[f.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                      style={{ resize: "vertical" }}
                    />
                  ) : (
                    <input
                      className="form-input"
                      type={f.type}
                      required={f.required}
                      value={formData[f.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="edge-btn"
                style={{
                  background: ACCENT,
                  color: DARK,
                  padding: "18px 48px",
                  fontSize: 16,
                  fontWeight: 700,
                  ...oswald,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  alignSelf: "center",
                  marginTop: 12,
                  clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 100%, 16px 100%)",
                }}
              >
                送信する
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );

  /* ═══════════════ FOOTER ═══════════════ */
  const footerEl = (
    <>
      <footer
        style={{
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "60px 20px 32px" : "80px 0 32px",
        }}
      >
        {/* BG image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG}/footer-bg.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(13,17,23,0.92)" }} />
        {/* Diagonal top edge */}
        <div
          style={{
            position: "absolute",
            top: -1,
            left: 0,
            right: 0,
            height: 60,
            background: DARK,
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)",
          }}
        />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* Footer catchphrase */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p
              style={{
                ...zenKaku,
                fontWeight: 900,
                fontSize: isMobile ? 20 : 28,
                color: LIGHT,
                margin: "0 0 8px",
                letterSpacing: "0.06em",
              }}
            >
              {footer.catchphrase}
            </p>
            <div
              style={{
                width: 60,
                height: 3,
                background: ACCENT,
                margin: "0 auto",
                transform: "skewX(-20deg)",
              }}
            />
          </div>

          {/* Footer nav */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: isMobile ? 12 : 24,
              marginBottom: 40,
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href);
                }}
                style={{
                  ...oswald,
                  fontWeight: 300,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = ACCENT)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Company info */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ ...bodyFont, fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>
              {company.name}
            </p>
            <p style={{ ...bodyFont, fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "0 0 4px" }}>
              〒{company.postalCode} {company.address}
            </p>
            <p style={{ ...bodyFont, fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
              TEL: {company.phone} / {company.hours}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 20px" }} />

          {/* Copyright */}
          <p
            style={{
              ...oswald,
              fontWeight: 300,
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              textAlign: "center",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            &copy; {new Date().getFullYear()} {company.nameEn}. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssKeyframes }} />
      <div style={{ minHeight: "100vh", background: DARK, color: LIGHT }}>
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
