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
  bgSub: "#f9fafb",
  accent: "#2d8a6e",
  accentLight: "#e8f5f0",
  text: "#1a1a1a",
  textSub: "#6b7280",
  border: "#e5e7eb",
  white: "#ffffff",
};

const BP = 768;
const IMG = "/keikamotsu-new-templates/images";

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
    up: "translateY(24px)",
    down: "translateY(-24px)",
    left: "translateX(24px)",
    right: "translateX(-24px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translateMap[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
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
    <div style={{ textAlign: "center", flex: 1, minWidth: 120 }}>
      <div style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 300,
            fontSize: 48,
            color: C.accent,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {count.toLocaleString()}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 16,
            color: C.accent,
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
          color: C.textSub,
          marginTop: 6,
          margin: "6px 0 0",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function CP05Page() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const heroTyped = useTypewriter(hero.headline, 80, 600);

  /* form state */
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formSent, setFormSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
  }, []);

  /* services scroll ref */
  const servicesScrollRef = useRef<HTMLDivElement | null>(null);

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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

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

    .cp05-recruit-heading {
      position: relative;
      display: inline;
    }
    .cp05-recruit-heading::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${C.accent};
      transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .cp05-recruit-heading.visible::after {
      width: 100%;
    }

    .cp05-form-group {
      position: relative;
    }
    .cp05-form-input {
      width: 100%;
      padding: 16px 0 8px;
      background: transparent;
      border: none;
      border-bottom: 1px solid ${C.border};
      color: ${C.text};
      font-size: 15px;
      font-family: 'Noto Sans JP', sans-serif;
      outline: none;
      transition: border-color 0.3s;
    }
    .cp05-form-input:focus {
      border-bottom-color: ${C.accent};
    }
    .cp05-form-textarea {
      width: 100%;
      padding: 16px 0 8px;
      background: transparent;
      border: none;
      border-bottom: 1px solid ${C.border};
      color: ${C.text};
      font-size: 15px;
      font-family: 'Noto Sans JP', sans-serif;
      outline: none;
      transition: border-color 0.3s;
      resize: vertical;
      min-height: 100px;
    }
    .cp05-form-textarea:focus {
      border-bottom-color: ${C.accent};
    }
    .cp05-floating-label {
      position: absolute;
      left: 0;
      top: 16px;
      font-size: 15px;
      color: ${C.textSub};
      pointer-events: none;
      transition: all 0.3s ease;
      font-family: 'Noto Sans JP', sans-serif;
    }
    .cp05-floating-label.active {
      top: -4px;
      font-size: 11px;
      color: ${C.accent};
    }

    .cp05-btn {
      cursor: pointer;
      border: none;
      transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
    }
    .cp05-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(45, 138, 110, 0.25);
    }
    .cp05-btn:active {
      transform: translateY(0);
    }

    .cp05-services-scroll::-webkit-scrollbar {
      height: 4px;
    }
    .cp05-services-scroll::-webkit-scrollbar-track {
      background: ${C.border};
      border-radius: 2px;
    }
    .cp05-services-scroll::-webkit-scrollbar-thumb {
      background: ${C.accent};
      border-radius: 2px;
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
        background: scrolled ? "rgba(255,255,255,0.97)" : C.white,
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all 0.3s ease",
        padding: scrolled ? "12px 0" : "18px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: C.white, fontSize: 14, fontWeight: 700, ...sans }}>G</span>
          </div>
          <span
            style={{
              ...sans,
              fontWeight: 600,
              fontSize: 15,
              color: C.text,
              letterSpacing: "0.01em",
            }}
          >
            {company.nameEn.split(" ")[0]}
          </span>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.slice(0, 6).map((l) => (
              <a
                key={l.href}
                className="cp05-nav-link"
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href);
                }}
                style={{ ...sans }}
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
                padding: "8px 20px",
                borderRadius: 6,
                letterSpacing: "0.02em",
              }}
            >
              {hero.cta}
            </button>
          </nav>
        )}

        {/* Mobile: simple contact button */}
        {isMobile && (
          <button
            className="cp05-btn"
            onClick={() => scrollTo("#contact")}
            style={{
              ...sans,
              fontWeight: 600,
              fontSize: 12,
              background: C.accent,
              color: C.white,
              padding: "7px 16px",
              borderRadius: 6,
            }}
          >
            お問い合わせ
          </button>
        )}
      </div>
    </header>
  );

  /* ═══════════════ HERO - SPLIT LAYOUT ═══════════════ */
  const heroEl = (
    <section
      style={{
        background: C.bg,
        paddingTop: isMobile ? 100 : 120,
        paddingBottom: isMobile ? 60 : 80,
        minHeight: isMobile ? "auto" : "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? 40 : 60,
        }}
      >
        {/* Left side - Text */}
        <div style={{ flex: 1, maxWidth: isMobile ? "100%" : 520 }}>
          <p
            style={{
              ...sans,
              fontWeight: 500,
              fontSize: 13,
              color: C.accent,
              letterSpacing: "0.08em",
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            {company.nameEn}
          </p>
          <h1
            style={{
              ...body,
              fontWeight: 700,
              fontSize: isMobile ? 28 : 42,
              color: C.text,
              lineHeight: 1.4,
              margin: "0 0 24px",
              letterSpacing: "0.02em",
            }}
          >
            {heroTyped.displayed}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: isMobile ? 28 : 40,
                background: C.accent,
                marginLeft: 3,
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
                  fontSize: 14,
                  color: C.textSub,
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
              padding: "14px 36px",
              borderRadius: 8,
              letterSpacing: "0.02em",
            }}
          >
            {hero.cta}
          </button>
        </div>

        {/* Right side - Geometric pattern */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: isMobile ? 240 : 360,
          }}
        >
          {/* Abstract geometric illustration */}
          <svg
            viewBox="0 0 400 360"
            fill="none"
            style={{ width: "100%", maxWidth: isMobile ? 300 : 400, height: "auto" }}
          >
            {/* Large circle */}
            <circle cx="200" cy="180" r="140" fill={C.accentLight} />
            {/* Smaller overlapping circle */}
            <circle cx="260" cy="140" r="80" fill={C.accent} opacity="0.12" />
            {/* Rectangle */}
            <rect x="120" y="200" width="160" height="100" rx="8" fill={C.accent} opacity="0.08" />
            {/* Delivery truck icon */}
            <g transform="translate(155, 140)">
              <rect x="0" y="20" width="50" height="35" rx="3" fill={C.accent} opacity="0.6" />
              <rect x="50" y="30" width="30" height="25" rx="2" fill={C.accent} opacity="0.45" />
              <polygon points="80,35 90,42 80,42" fill={C.accent} opacity="0.45" />
              <circle cx="18" cy="58" r="7" fill={C.accent} opacity="0.7" />
              <circle cx="18" cy="58" r="3.5" fill={C.white} />
              <circle cx="65" cy="58" r="7" fill={C.accent} opacity="0.7" />
              <circle cx="65" cy="58" r="3.5" fill={C.white} />
            </g>
            {/* Dots pattern */}
            {[0, 1, 2, 3, 4].map((row) =>
              [0, 1, 2, 3, 4].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={310 + col * 16}
                  cy={60 + row * 16}
                  r="2"
                  fill={C.accent}
                  opacity="0.2"
                />
              ))
            )}
            {/* Small accent lines */}
            <line x1="60" y1="100" x2="100" y2="100" stroke={C.accent} strokeWidth="2" opacity="0.3" />
            <line x1="60" y1="110" x2="85" y2="110" stroke={C.accent} strokeWidth="2" opacity="0.2" />
            <line x1="60" y1="120" x2="75" y2="120" stroke={C.accent} strokeWidth="2" opacity="0.15" />
          </svg>
        </div>
      </div>
    </section>
  );

  /* ═══════════════ SECTION HEADING (clean) ═══════════════ */
  const SectionTitle = ({
    enTitle,
    jpTitle,
    center = true,
  }: {
    enTitle: string;
    jpTitle: string;
    center?: boolean;
  }) => (
    <FadeIn style={{ marginBottom: 48, textAlign: center ? "center" : "left" }}>
      <p
        style={{
          ...sans,
          fontWeight: 500,
          fontSize: 12,
          color: C.accent,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          margin: "0 0 6px",
        }}
      >
        {enTitle}
      </p>
      <h2
        style={{
          ...body,
          fontWeight: 700,
          fontSize: isMobile ? 24 : 30,
          color: C.text,
          margin: 0,
          letterSpacing: "0.02em",
        }}
      >
        {jpTitle}
      </h2>
      <div
        style={{
          width: 40,
          height: 2,
          background: C.accent,
          margin: center ? "16px auto 0" : "16px 0 0",
          borderRadius: 1,
        }}
      />
    </FadeIn>
  );

  /* ═══════════════ SERVICES - HORIZONTAL SCROLL ═══════════════ */
  const servicesEl = (
    <section
      id="services"
      style={{
        background: C.bgSub,
        padding: isMobile ? "60px 0 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Services" jpTitle="事業内容" />
      </div>
      <div
        ref={servicesScrollRef}
        className="cp05-services-scroll"
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          padding: isMobile ? "0 20px 20px" : "0 calc((100vw - 1100px) / 2 + 24px) 20px",
          scrollSnapType: "x mandatory",
        }}
      >
        {services.map((s, i) => (
          <FadeIn key={i} delay={i * 100} style={{ flexShrink: 0 }}>
            <div
              style={{
                width: isMobile ? 280 : 260,
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "32px 24px",
                scrollSnapAlign: "start",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: C.accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 20, color: C.accent }}>
                  {i === 0 ? "🚛" : i === 1 ? "🚗" : i === 2 ? "📋" : "🔧"}
                </span>
              </div>
              <div
                style={{
                  ...sans,
                  fontWeight: 500,
                  fontSize: 12,
                  color: C.accent,
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                {s.num}
              </div>
              <h3
                style={{
                  ...body,
                  fontWeight: 700,
                  fontSize: 17,
                  color: C.text,
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
                  color: C.textSub,
                  margin: 0,
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                }}
              >
                {s.text}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );

  /* ═══════════════ STRENGTHS - LARGE NUMBERS ═══════════════ */
  const strengthsEl = (
    <section
      id="strengths"
      style={{
        background: C.bg,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Strengths" jpTitle="私たちの強み" />
        {strengths.map((s, i) => {
          const isEven = i % 2 === 0;
          return (
            <FadeIn key={i} delay={i * 120}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : isEven ? "row" : "row-reverse",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? 16 : 48,
                  marginBottom: i < strengths.length - 1 ? (isMobile ? 48 : 64) : 0,
                  padding: isMobile ? "0" : "0",
                }}
              >
                {/* Large number */}
                <div
                  style={{
                    flexShrink: 0,
                    width: isMobile ? "auto" : 120,
                    textAlign: isMobile ? "left" : isEven ? "right" : "left",
                  }}
                >
                  <span
                    style={{
                      ...sans,
                      fontWeight: 300,
                      fontSize: isMobile ? 60 : 80,
                      color: C.accentLight,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      WebkitTextStroke: `1px ${C.accent}`,
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.num}
                  </span>
                </div>
                {/* Description */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      ...body,
                      fontWeight: 700,
                      fontSize: isMobile ? 18 : 20,
                      color: C.text,
                      margin: "0 0 12px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...body,
                      fontSize: 14,
                      color: C.textSub,
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              </div>
              {i < strengths.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: C.border,
                    margin: isMobile ? "48px 0 0" : "64px 0 0",
                  }}
                />
              )}
            </FadeIn>
          );
        })}
      </div>
    </section>
  );

  /* ═══════════════ CEO MESSAGE ═══════════════ */
  const ceoEl = (
    <section
      id="message"
      style={{
        background: C.bgSub,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="CEO Message" jpTitle="代表メッセージ" />
        <FadeIn>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "flex-start",
              gap: isMobile ? 32 : 56,
            }}
          >
            {/* CEO Photo */}
            <div
              style={{
                width: isMobile ? "100%" : "35%",
                maxWidth: 320,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 12,
                  aspectRatio: "3/4",
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
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <p
                  style={{
                    ...sans,
                    fontWeight: 500,
                    fontSize: 12,
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

            {/* Quote & Message */}
            <div style={{ flex: 1 }}>
              {/* Leading quote */}
              <p
                style={{
                  ...body,
                  fontWeight: 500,
                  fontSize: isMobile ? 17 : 20,
                  color: C.text,
                  margin: "0 0 28px",
                  lineHeight: 1.7,
                  borderLeft: `3px solid ${C.accent}`,
                  paddingLeft: 20,
                }}
              >
                {ceoMessage.message[0]}
              </p>
              {ceoMessage.message.slice(1).map((p, i) => (
                <FadeIn key={i} delay={200 + i * 100}>
                  <p
                    style={{
                      ...body,
                      fontSize: 14,
                      color: C.textSub,
                      margin: "0 0 16px",
                    }}
                  >
                    {p}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );

  /* ═══════════════ COMPANY INFO - CLEAN TABLE ═══════════════ */
  const companyEl = (
    <section
      id="company"
      style={{
        background: C.bg,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Company" jpTitle="会社概要" />
        <FadeIn>
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
            }}
          >
            {companyOverview.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  background: i % 2 === 0 ? C.white : C.bgSub,
                  padding: isMobile ? "14px 20px" : "16px 28px",
                  borderBottom: i < companyOverview.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <dt
                  style={{
                    ...body,
                    fontWeight: 600,
                    fontSize: 13,
                    color: C.accent,
                    width: isMobile ? "100%" : 160,
                    flexShrink: 0,
                    marginBottom: isMobile ? 4 : 0,
                    display: "flex",
                    alignItems: "center",
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
        </FadeIn>
      </div>
    </section>
  );

  /* ═══════════════ HISTORY - VERTICAL TIMELINE ═══════════════ */
  const historyEl = (
    <section
      id="history"
      style={{
        background: C.bgSub,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="History" jpTitle="沿革" />
        <div style={{ position: "relative", paddingLeft: isMobile ? 40 : 56 }}>
          {/* Connecting line */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? 11 : 15,
              top: 8,
              bottom: 8,
              width: 1,
              background: C.border,
            }}
          />
          {history.map((h, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div
                style={{
                  position: "relative",
                  marginBottom: i < history.length - 1 ? 36 : 0,
                  paddingBottom: i < history.length - 1 ? 36 : 0,
                  borderBottom: i < history.length - 1 ? "none" : "none",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: isMobile ? -33 : -45,
                    top: 6,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: C.accent,
                    border: `2px solid ${C.white}`,
                    boxShadow: `0 0 0 3px ${C.accentLight}`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 6 : 24,
                  }}
                >
                  <span
                    style={{
                      ...sans,
                      fontWeight: 600,
                      fontSize: 16,
                      color: C.accent,
                      flexShrink: 0,
                      width: isMobile ? "auto" : 60,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {h.year}
                  </span>
                  <p
                    style={{
                      ...body,
                      fontSize: 14,
                      color: C.text,
                      margin: 0,
                    }}
                  >
                    {h.event}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* ═══════════════ NUMBERS - HORIZONTAL COUNTERS ═══════════════ */
  const numbersEl = (
    <section
      id="numbers"
      style={{
        background: C.bg,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Numbers" jpTitle="数字で見る実績" />
        <FadeIn>
          <div
            ref={numRef}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {numbers.map((n, i) => {
              const numVal = parseFloat(n.value.replace(/,/g, ""));
              return (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div
                      style={{
                        width: isMobile ? 60 : 1,
                        height: isMobile ? 1 : 60,
                        background: C.border,
                        flexShrink: 0,
                        margin: isMobile ? "20px 0" : "0",
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
        </FadeIn>
      </div>
    </section>
  );

  /* ═══════════════ PARTNERS - LOGO ROW ═══════════════ */
  const partnersEl = (
    <section
      id="partners"
      style={{
        background: C.bgSub,
        padding: isMobile ? "60px 20px 40px" : "80px 0 60px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Partners" jpTitle="主要取引先" />
        <FadeIn>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: isMobile ? 24 : 40,
            }}
          >
            {partners.map((p, i) => (
              <div
                key={i}
                style={{
                  opacity: 0.5,
                  transition: "opacity 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? 100 : 120,
                  height: isMobile ? 50 : 60,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.85";
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
        </FadeIn>

        {/* ─── Truck Animation ─── */}
        <div
          style={{
            position: "relative",
            height: isMobile ? 40 : 56,
            overflow: "hidden",
            marginTop: isMobile ? 32 : 48,
            opacity: 0.12,
          }}
        >
          {/* Cityscape silhouette */}
          <svg
            viewBox="0 0 800 56"
            fill="none"
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: isMobile ? 40 : 56,
            }}
          >
            <path
              d="M0,54 L40,54 L40,40 L45,35 L50,40 L50,54 L80,54 L80,28 L90,28 L90,54 L120,54 L120,20 L125,15 L130,20 L130,54 L170,54 L170,32 L180,28 L190,32 L190,54 L230,54 L230,42 L235,38 L240,42 L240,54 L280,54 L280,18 L290,12 L300,18 L300,54 L340,54 L340,36 L350,30 L360,36 L360,54 L400,54 L400,24 L410,18 L420,24 L420,54 L460,54 L460,44 L470,40 L480,44 L480,54 L520,54 L520,14 L530,8 L540,14 L540,54 L580,54 L580,34 L590,28 L600,34 L600,54 L640,54 L640,22 L650,16 L660,22 L660,54 L700,54 L700,38 L710,32 L720,38 L720,54 L760,54 L760,26 L770,20 L780,26 L780,54 L800,54"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            {/* Ground line */}
            <line x1="0" y1="55" x2="800" y2="55" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Truck */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 2,
              animation: `cp05TruckDrive ${isMobile ? 14 : 22}s linear infinite`,
            }}
          >
            <svg
              width={isMobile ? 36 : 48}
              height={isMobile ? 20 : 28}
              viewBox="0 0 48 28"
              fill="currentColor"
              opacity="0.8"
            >
              <rect x="0" y="4" width="28" height="18" rx="2" />
              <rect x="28" y="10" width="16" height="12" rx="1" />
              <circle cx="10" cy="24" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="38" cy="24" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );

  /* ═══════════════ NEWS - SIMPLE LIST ═══════════════ */
  const newsEl = (
    <section
      id="news"
      style={{
        background: C.bg,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="News" jpTitle="お知らせ" />
        {news.map((n, i) => {
          const tagColors: Record<string, { bg: string; text: string }> = {
            press: { bg: "#fff3e0", text: "#e65100" },
            new: { bg: C.accentLight, text: C.accent },
            default: { bg: "#f3f4f6", text: C.textSub },
          };
          const tagStyle = tagColors[n.tagStyle] || tagColors.default;
          return (
            <FadeIn key={i} delay={i * 80}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? 6 : 20,
                  padding: "16px 0",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = C.bgSub;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span
                  style={{
                    ...sans,
                    fontWeight: 400,
                    fontSize: 13,
                    color: C.textSub,
                    flexShrink: 0,
                    width: isMobile ? "auto" : 100,
                    letterSpacing: "0.02em",
                  }}
                >
                  {n.date}
                </span>
                <span
                  style={{
                    ...sans,
                    fontWeight: 600,
                    fontSize: 11,
                    color: tagStyle.text,
                    background: tagStyle.bg,
                    padding: "2px 10px",
                    borderRadius: 4,
                    flexShrink: 0,
                    letterSpacing: "0.03em",
                  }}
                >
                  {n.tag}
                </span>
                <span
                  style={{
                    ...body,
                    fontSize: 14,
                    color: C.text,
                    flex: 1,
                  }}
                >
                  {n.title}
                </span>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );

  /* ═══════════════ RECRUIT - CLEAN CTA BANNER ═══════════════ */
  const recruitEl = (
    <section
      id="recruit"
      style={{
        background: C.accentLight,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <FadeIn>
          <p
            style={{
              ...sans,
              fontWeight: 500,
              fontSize: 12,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              margin: "0 0 12px",
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
              fontSize: isMobile ? 22 : 28,
              color: C.text,
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
              color: C.textSub,
              whiteSpace: "pre-line",
              margin: "0 0 32px",
              lineHeight: 1.9,
            }}
          >
            {recruit.text}
          </p>
          <p
            style={{
              ...body,
              fontSize: 15,
              color: C.text,
              margin: "0 0 32px",
              lineHeight: 1.7,
            }}
          >
            「ちょっと話を聞いてみたい」
            <br />
            ——それだけで大丈夫です。
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
              padding: "14px 40px",
              borderRadius: 8,
              textDecoration: "none",
              letterSpacing: "0.02em",
              border: "none",
            }}
          >
            {recruit.cta}
          </a>
        </FadeIn>
      </div>
    </section>
  );

  /* ═══════════════ ACCESS ═══════════════ */
  const accessEl = (
    <section
      id="access"
      style={{
        background: C.bg,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Access" jpTitle="アクセス" />
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
                    margin: "0 0 8px",
                  }}
                >
                  {company.name}
                </p>
                <p
                  style={{
                    ...body,
                    fontSize: 14,
                    color: C.text,
                    margin: "0 0 6px",
                  }}
                >
                  〒{company.postalCode} {access.address}
                </p>
                <p
                  style={{
                    ...body,
                    fontSize: 14,
                    color: C.textSub,
                    margin: "0 0 6px",
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
                <p style={{ ...body, fontSize: 14, color: C.text, margin: "0 0 4px" }}>
                  TEL: {company.phone}
                </p>
                <p style={{ ...body, fontSize: 14, color: C.text, margin: "0 0 4px" }}>
                  FAX: {company.fax}
                </p>
                <p style={{ ...body, fontSize: 13, color: C.textSub, margin: 0 }}>
                  {company.hours}
                </p>
              </div>
            </div>
            {/* Map */}
            <div
              style={{
                width: isMobile ? "100%" : "60%",
                minHeight: 300,
                borderRadius: 12,
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

  /* ═══════════════ CONTACT - FLOATING LABELS ═══════════════ */
  const placeholders: Record<string, string> = {
    company: "例）株式会社サンプル",
    name: "例）山田 太郎",
    email: "例）info@example.co.jp",
    phone: "例）090-1234-5678",
    message: "例）配送サービスについてお見積もりをお願いしたいです。",
  };

  const contactEl = (
    <section
      id="contact"
      style={{
        background: C.bgSub,
        padding: isMobile ? "60px 20px 70px" : "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle enTitle="Contact" jpTitle="お問い合わせ" />
        <FadeIn>
          <p
            style={{
              ...body,
              fontSize: 14,
              color: C.textSub,
              whiteSpace: "pre-line",
              marginBottom: 36,
              textAlign: "center",
              margin: "0 0 36px",
            }}
          >
            {contact.intro}
          </p>
        </FadeIn>

        {formSent ? (
          <FadeIn>
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: C.accentLight,
                borderRadius: 12,
              }}
            >
              <p
                style={{
                  ...body,
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.accent,
                  margin: "0 0 8px",
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
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
                background: C.white,
                padding: isMobile ? "28px 20px" : "40px 36px",
                borderRadius: 12,
                border: `1px solid ${C.border}`,
              }}
            >
              {contact.fields.map((f) => {
                const isActive =
                  focusedField === f.name || (formData[f.name] && formData[f.name].length > 0);
                return (
                  <div key={f.name} className="cp05-form-group">
                    <label
                      className={`cp05-floating-label${isActive ? " active" : ""}`}
                      htmlFor={`cp05-${f.name}`}
                    >
                      {f.label}
                      {f.required && (
                        <span
                          style={{
                            fontSize: 10,
                            color: C.white,
                            background: C.accent,
                            padding: "1px 5px",
                            borderRadius: 3,
                            marginLeft: 6,
                            fontWeight: 600,
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
                        rows={4}
                        required={f.required}
                        value={formData[f.name] || ""}
                        placeholder={isActive ? placeholders[f.name] : ""}
                        onFocus={() => setFocusedField(f.name)}
                        onBlur={() => setFocusedField(null)}
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
                        placeholder={isActive ? placeholders[f.name] : ""}
                        onFocus={() => setFocusedField(f.name)}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormData({ ...formData, [f.name]: e.target.value })
                        }
                      />
                    )}
                  </div>
                );
              })}
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <button
                  type="submit"
                  className="cp05-btn"
                  style={{
                    ...sans,
                    fontWeight: 600,
                    fontSize: 15,
                    background: C.accent,
                    color: C.white,
                    padding: "14px 48px",
                    borderRadius: 8,
                    letterSpacing: "0.03em",
                  }}
                >
                  送信する
                </button>
              </div>
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );

  /* ═══════════════ FOOTER - CENTERED, LIGHT GRAY ═══════════════ */
  const footerEl = (
    <footer
      style={{
        background: C.bgSub,
        padding: isMobile ? "48px 20px 24px" : "56px 0 28px",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        {/* Catchphrase */}
        <p
          style={{
            ...body,
            fontWeight: 700,
            fontSize: isMobile ? 16 : 22,
            color: C.text,
            margin: "0 0 20px",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {footer.catchphrase}
        </p>

        {/* Divider */}
        <div
          style={{
            width: 40,
            height: 2,
            background: C.accent,
            margin: "0 auto 24px",
            borderRadius: 1,
          }}
        />

        {/* Company info */}
        <p
          style={{
            ...body,
            fontSize: 13,
            color: C.textSub,
            margin: "0 0 4px",
          }}
        >
          {company.name}
        </p>
        <p
          style={{
            ...body,
            fontSize: 12,
            color: C.textSub,
            margin: "0 0 4px",
          }}
        >
          〒{company.postalCode} {company.address}
        </p>
        <p
          style={{
            ...body,
            fontSize: 12,
            color: C.textSub,
            margin: "0 0 24px",
          }}
        >
          TEL: {company.phone} / {company.hours}
        </p>

        {/* Cityscape silhouette */}
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto 20px", opacity: 0.1, lineHeight: 0 }}>
          <svg viewBox="0 0 800 50" fill="none" style={{ width: "100%", height: "auto" }}>
            <path
              d="M0,48 L50,48 L50,36 L55,30 L60,36 L60,48 L100,48 L100,24 L110,24 L110,48 L150,48 L150,18 L155,12 L160,18 L160,48 L200,48 L200,28 L210,22 L220,28 L220,48 L260,48 L260,38 L270,32 L280,38 L280,48 L320,48 L320,14 L330,8 L340,14 L340,48 L380,48 L380,32 L390,26 L400,32 L400,48 L440,48 L440,40 L450,34 L460,40 L460,48 L500,48 L500,10 L510,4 L520,10 L520,48 L560,48 L560,30 L570,24 L580,30 L580,48 L620,48 L620,20 L630,14 L640,20 L640,48 L680,48 L680,34 L690,28 L700,34 L700,48 L740,48 L740,24 L750,18 L760,24 L760,48 L800,48"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        {/* Copyright */}
        <p
          style={{
            ...sans,
            fontWeight: 400,
            fontSize: 11,
            color: C.textSub,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          &copy; {new Date().getFullYear()} {company.nameEn}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );

  /* ═══════════════ RENDER ═══════════════ */
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
