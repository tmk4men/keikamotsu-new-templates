"use client";

import React, { useState, useEffect, useRef, useCallback, FormEvent } from "react";
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
  news,
  companyInfo,
  cta,
  faq,
  access,
  gallery,
  footer,
} from "@/data/siteData";

/* ==========================================================
   R-05 SNAP-SCROLL — フル画面スナップスクロール プレゼン型
   各セクションが100vhを占め、スクロールスナップで切り替わる
   ========================================================== */

const C = {
  bg: "#ffffff",
  bgSub: "#fafafa",
  accent: "#e8734a",
  accentLight: "#fff5f0",
  accentDark: "#c45a35",
  text: "#1a1a1a",
  textSub: "#6b7280",
  muted: "#9ca3af",
  border: "#e5e7eb",
  card: "#ffffff",
  white: "#ffffff",
};

const F = {
  heading: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
  sans: "'Noto Sans JP', sans-serif",
  accent: "'Poppins', 'Zen Kaku Gothic New', sans-serif",
};

const IMG = {
  heroBg: "/keikamotsu-new-templates/images/hero-bg.webp",
  strength: (n: number) => `/keikamotsu-new-templates/images/strength-0${n}.webp`,
  jobs: "/keikamotsu-new-templates/images/jobs.webp",
  benefits: "/keikamotsu-new-templates/images/benefits.webp",
  dailyFlow: "/keikamotsu-new-templates/images/daily-flow.webp",
  vehicle: "/keikamotsu-new-templates/images/vehicle.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
  workplace: "/keikamotsu-new-templates/images/workplace.webp",
  loading: "/keikamotsu-new-templates/images/loading.webp",
  team: "/keikamotsu-new-templates/images/team.webp",
  company: "/keikamotsu-new-templates/images/company.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
};

/* ==========================================================
   キーフレーム
   ========================================================== */
const KEYFRAMES = `
@keyframes r05marqueeLeft { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes r05TruckDrive {
  from { transform: translateX(-60px); }
  to { transform: translateX(calc(100vw + 60px)); }
}
@keyframes r05underline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes r05fadeInUp {
  from { opacity:0; transform:translateY(24px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes r05pulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes r05float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes r05scrollArrow {
  0%,100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(8px); }
}
@keyframes r05typewriterCursor {
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
}
.r05-snap-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
.r05-snap-section {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.r05-snap-section-top {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
}
.r05-marquee-strip {
  height: 60px;
  scroll-snap-align: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}
`;

/* ==========================================================
   IntersectionObserver
   ========================================================== */
function useInView(threshold = 0.12) {
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

/* ==========================================================
   useTypewriter
   ========================================================== */
function useTypewriter(text: string, speed = 60, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let idx = 0;
    const timer = setTimeout(() => {
      const iv = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/* ==========================================================
   FadeIn
   ========================================================== */
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView(0.08);
  const transforms: Record<string, string> = {
    up: "translateY(28px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ==========================================================
   CounterNum / SalaryCountUp
   ========================================================== */
function CounterNum({ target, style }: { target: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 1600;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} style={style}>0</span>;
}

function SalaryCountUp({ large = false }: { large?: boolean }) {
  const sz = large ? "3.2rem" : "2.2rem";
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
      <CounterNum
        target={hero.salaryMin}
        style={{ fontSize: sz, fontWeight: 800, fontFamily: F.accent, color: C.accent }}
      />
      <span style={{ fontSize: large ? "1.1rem" : "0.9rem", color: C.textSub, margin: "0 4px" }}>万~</span>
      <CounterNum
        target={hero.salaryMax}
        style={{ fontSize: sz, fontWeight: 800, fontFamily: F.accent, color: C.accent }}
      />
      <span style={{ fontSize: large ? "1.1rem" : "0.9rem", color: C.textSub, marginLeft: 4 }}>万円</span>
    </span>
  );
}

/* ==========================================================
   SectionHeading
   ========================================================== */
function SectionHeading({
  icon,
  label,
  sub,
  light = false,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  light?: boolean;
}) {
  const { ref, visible } = useInView(0.15);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ lineHeight: 1 }}>{icon}</span>
        <h2
          style={{
            fontFamily: F.heading,
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: light ? C.white : C.text,
            margin: 0,
            position: "relative",
            display: "inline-block",
          }}
        >
          {label}
          <span
            style={{
              position: "absolute",
              bottom: -4,
              left: 0,
              width: "100%",
              height: 3,
              background: C.accent,
              borderRadius: 2,
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.8s ease 0.2s",
            }}
          />
        </h2>
      </div>
      {sub && (
        <p style={{ fontFamily: F.accent, fontSize: 13, color: light ? "rgba(255,255,255,0.6)" : C.muted, margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ==========================================================
   Benefit SVG Icons (stroke only)
   ========================================================== */
const benefitIcons = [
  <svg key="car" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4z"/></svg>,
  <svg key="gift" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M3 12h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7zM7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8"/></svg>,
  <svg key="money" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-5a3 3 0 000 6h2a3 3 0 010 6H8M12 2v2m0 16v2"/></svg>,
  <svg key="clock" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  <svg key="learn" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  <svg key="phone" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
];

/* ==========================================================
   FormField
   ========================================================== */
function FormField({
  label,
  placeholder,
  required = false,
  type = "text",
  name,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  name: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.text,
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 6,
        }}
      >
        {label}
        {required && (
          <span
            style={{
              fontSize: 10,
              color: C.white,
              background: C.accent,
              padding: "1px 6px",
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            必須
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 14,
          border: `2px solid ${focused ? C.accent : C.border}`,
          borderRadius: 8,
          outline: "none",
          transition: "border-color 0.3s",
          fontFamily: F.sans,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ==========================================================
   Section labels for progress indicator
   ========================================================== */
const SECTION_IDS = [
  "hero",
  "marquee-strip",
  "reason-1",
  "reason-2",
  "reason-3",
  "jobs",
  "benefits",
  "daily",
  "gallery",
  "voices",
  "faq",
  "apply",
  "cta-section",
  "footer-section",
];

/* ==========================================================
   Main Component
   ========================================================== */
export default function R05Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* IntersectionObserver for progress tracking */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setCurrentSlide(idx);
          }
        });
      },
      { root: container, threshold: 0.4 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const heroText = hero.headlineParts.join("");
  const { displayed: typedHero, done: typeDone } = useTypewriter(heroText, 55, 300);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    alert("送信が完了しました。担当者より折り返しご連絡いたします。");
    formRef.current?.reset();
  }, []);

  const setSectionRef = (idx: number) => (el: HTMLElement | null) => {
    sectionRefs.current[idx] = el;
  };

  const marqueeItems = [...marquee.top, ...marquee.bottom];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ============================================================
          Progress Indicator (fixed right dots)
          ============================================================ */}
      <div
        style={{
          position: "fixed",
          right: isMobile ? 10 : 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 8 : 12,
          alignItems: "center",
        }}
      >
        {SECTION_IDS.map((_, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            {currentSlide === i && !isMobile && (
              <span
                style={{
                  position: "absolute",
                  right: 18,
                  fontSize: 10,
                  fontFamily: F.accent,
                  fontWeight: 700,
                  color: C.accent,
                  whiteSpace: "nowrap",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <div
              style={{
                width: currentSlide === i ? (isMobile ? 8 : 10) : (isMobile ? 4 : 6),
                height: currentSlide === i ? (isMobile ? 8 : 10) : (isMobile ? 4 : 6),
                borderRadius: "50%",
                background: currentSlide === i ? C.accent : "rgba(0,0,0,0.2)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onClick={() => {
                const sec = sectionRefs.current[i];
                if (sec) sec.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        ))}
      </div>

      {/* ============================================================
          Snap Container
          ============================================================ */}
      <div
        ref={containerRef}
        className="r05-snap-container"
        style={{ fontFamily: F.sans, color: C.text, background: C.bg }}
      >

        {/* ============================================================
            HERO (100vh snap section)
            ============================================================ */}
        <section
          ref={setSectionRef(0)}
          className="r05-snap-section"
          id="hero"
          style={{ overflow: "hidden" }}
        >
          <img
            src={IMG.heroBg}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,245,240,0.82) 0%, rgba(255,255,255,0.65) 50%, rgba(232,115,74,0.18) 100%)",
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 900,
              padding: isMobile ? "0 20px" : "0 40px",
              textAlign: "center",
            }}
          >
            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 28 }}>
              {hero.badges.map((badge, i) => (
                <span
                  key={i}
                  style={{
                    background: C.white,
                    color: C.accent,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 18px",
                    borderRadius: 24,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: `1px solid ${C.accent}30`,
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Typewriter headline */}
            <h1
              style={{
                fontFamily: F.heading,
                fontSize: isMobile ? "clamp(1.8rem, 7vw, 2.6rem)" : "clamp(2.4rem, 4.5vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1.35,
                color: C.text,
                margin: "0 0 24px",
                letterSpacing: "-0.02em",
              }}
            >
              {typedHero}
              {!typeDone && (
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: "1em",
                    background: C.accent,
                    marginLeft: 2,
                    animation: "r05typewriterCursor 0.8s infinite",
                  }}
                />
              )}
            </h1>

            {/* Salary badges */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 14, color: C.textSub, marginRight: 8 }}>月収</span>
              <SalaryCountUp large />
            </div>

            {/* Subtext */}
            <div style={{ marginBottom: 32 }}>
              {hero.subtext.map((line, i) => (
                <p key={i} style={{ fontSize: isMobile ? 13 : 15, color: C.textSub, margin: "4px 0", lineHeight: 1.7 }}>
                  {line}
                </p>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                const sec = sectionRefs.current[11];
                if (sec) sec.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-block",
                background: C.accent,
                color: C.white,
                padding: "16px 48px",
                borderRadius: 32,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(232,115,74,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(232,115,74,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,115,74,0.35)";
              }}
            >
              {hero.cta}
            </a>
          </div>

          {/* Scroll down arrow */}
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
              gap: 4,
              animation: "r05scrollArrow 2s infinite",
            }}
          >
            <span style={{ fontSize: 10, color: C.textSub, letterSpacing: 2 }}>SCROLL</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* ============================================================
            MARQUEE STRIP (thin, not full height)
            ============================================================ */}
        <div
          ref={setSectionRef(1)}
          className="r05-marquee-strip"
          id="marquee-strip"
          style={{ background: C.accent }}
        >
          <div
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              animation: "r05marqueeLeft 20s linear infinite",
            }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                style={{
                  padding: "0 32px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.white,
                  letterSpacing: 1,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ============================================================
            REASONS (each reason = 1 full snap page)
            ============================================================ */}
        {reasons.map((reason, i) => {
          const isEven = i % 2 === 0;
          return (
            <section
              key={i}
              ref={setSectionRef(2 + i)}
              className="r05-snap-section"
              id={i === 0 ? "reasons" : `reason-${i + 1}`}
              style={{ overflow: "hidden", background: i % 2 === 0 ? C.white : C.bgSub }}
            >
              {/* Image side */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  [isEven ? "left" : "right"]: 0,
                  width: isMobile ? "100%" : "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={IMG.strength(i + 1)}
                  alt={reason.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {isMobile && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)",
                    }}
                  />
                )}
              </div>

              {/* Text side */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  width: isMobile ? "100%" : "50%",
                  marginLeft: isMobile ? 0 : (isEven ? "50%" : 0),
                  marginRight: isMobile ? 0 : (isEven ? 0 : "50%"),
                  padding: isMobile ? "0 24px" : "0 80px",
                  boxSizing: "border-box",
                }}
              >
                <FadeIn delay={0.1} direction={isEven ? "right" : "left"}>
                  <span
                    style={{
                      fontFamily: F.accent,
                      fontSize: isMobile ? "4rem" : "6rem",
                      fontWeight: 800,
                      color: isMobile ? "rgba(255,255,255,0.15)" : `${C.accent}15`,
                      lineHeight: 1,
                      display: "block",
                      marginBottom: -16,
                    }}
                  >
                    {reason.num}
                  </span>
                  <h3
                    style={{
                      fontFamily: F.heading,
                      fontSize: isMobile ? "clamp(1.3rem, 5vw, 1.8rem)" : "clamp(1.5rem, 2.5vw, 2rem)",
                      fontWeight: 700,
                      color: isMobile ? C.white : C.text,
                      margin: "0 0 20px",
                      lineHeight: 1.4,
                    }}
                  >
                    {reason.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMobile ? 13 : 15,
                      lineHeight: 1.9,
                      color: isMobile ? "rgba(255,255,255,0.9)" : C.textSub,
                      whiteSpace: "pre-line",
                      margin: 0,
                    }}
                  >
                    {reason.text}
                  </p>
                </FadeIn>
              </div>
            </section>
          );
        })}

        {/* ============================================================
            JOBS (100vh split screen)
            ============================================================ */}
        <section
          ref={setSectionRef(5)}
          className="r05-snap-section"
          id="jobs"
          style={{ overflow: "hidden" }}
        >
          {/* Left image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: isMobile ? "100%" : "45%",
              overflow: "hidden",
            }}
          >
            <img
              src={IMG.jobs}
              alt="求人情報"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {isMobile && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
            )}
          </div>

          {/* Right content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: isMobile ? "100%" : "55%",
              marginLeft: isMobile ? 0 : "45%",
              padding: isMobile ? "80px 20px 40px" : "60px 60px 60px 80px",
              boxSizing: "border-box",
              overflowY: "auto",
              maxHeight: "100vh",
            }}
          >
            <FadeIn>
              <SectionHeading
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isMobile ? C.white : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                }
                label="求人情報"
                sub="JOB INFO"
                light={isMobile}
              />
            </FadeIn>

            <FadeIn delay={0.15}>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: isMobile ? "rgba(255,255,255,0.7)" : C.textSub }}>月収</span>
                <div><SalaryCountUp /></div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: isMobile ? 13 : 14,
                }}
              >
                <tbody>
                  {jobs.rows.map((row, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontWeight: 600,
                          color: isMobile ? C.white : C.text,
                          borderBottom: `1px solid ${isMobile ? "rgba(255,255,255,0.15)" : C.border}`,
                          whiteSpace: "nowrap",
                          verticalAlign: "top",
                          width: "30%",
                        }}
                      >
                        {row.dt}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: row.accent ? C.accent : (isMobile ? "rgba(255,255,255,0.9)" : C.textSub),
                          fontWeight: row.accent ? 600 : 400,
                          borderBottom: `1px solid ${isMobile ? "rgba(255,255,255,0.15)" : C.border}`,
                          lineHeight: 1.6,
                        }}
                      >
                        {row.dd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {jobs.requirements.map((req, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      padding: "5px 14px",
                      borderRadius: 20,
                      background: isMobile ? "rgba(255,255,255,0.12)" : C.accentLight,
                      color: isMobile ? C.white : C.accent,
                      fontWeight: 500,
                    }}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================================
            BENEFITS (100vh, grid on dark image bg)
            ============================================================ */}
        <section
          ref={setSectionRef(6)}
          className="r05-snap-section"
          id="benefits"
          style={{ overflow: "hidden" }}
        >
          <img
            src={IMG.benefits}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 1 }} />

          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1100, padding: isMobile ? "60px 16px" : "60px 40px", boxSizing: "border-box" }}>
            <FadeIn>
              <SectionHeading
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                }
                label="待遇・福利厚生"
                sub="BENEFITS"
                light
              />
            </FadeIn>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 16 : 24,
              }}
            >
              {benefits.map((b, i) => (
                <FadeIn key={i} delay={0.08 * i}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 14,
                      padding: isMobile ? "20px 18px" : "28px 24px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      height: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ color: C.accent, marginBottom: 12 }}>
                      {benefitIcons[i]}
                    </div>
                    <h4
                      style={{
                        fontFamily: F.heading,
                        fontSize: isMobile ? 15 : 16,
                        fontWeight: 700,
                        color: C.white,
                        margin: "0 0 10px",
                      }}
                    >
                      {b.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.75)",
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {b.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            DAILY FLOW (100vh, background image, 2-col card grid)
            ============================================================ */}
        <section
          ref={setSectionRef(7)}
          className="r05-snap-section"
          id="daily"
          style={{ overflow: "hidden" }}
        >
          <img
            src={IMG.dailyFlow}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />

          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1000, padding: isMobile ? "60px 16px" : "60px 40px", boxSizing: "border-box" }}>
            <FadeIn>
              <SectionHeading
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                }
                label="1日の流れ"
                sub="DAILY FLOW"
                light
              />
            </FadeIn>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 14 : 20,
              }}
            >
              {daily.steps.map((step, i) => (
                <FadeIn key={i} delay={0.08 * i}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: 12,
                      padding: isMobile ? "16px" : "20px 24px",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        background: C.accent,
                        color: C.white,
                        fontFamily: F.accent,
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "6px 12px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {step.time}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontFamily: F.heading,
                          fontSize: 15,
                          fontWeight: 700,
                          color: C.text,
                          margin: "0 0 6px",
                        }}
                      >
                        {step.title}
                      </h4>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub, margin: 0 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            GALLERY (100vh masonry grid, photos only)
            ============================================================ */}
        <section
          ref={setSectionRef(8)}
          className="r05-snap-section"
          id="gallery"
          style={{ overflow: "hidden", padding: 0 }}
        >
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
              gridTemplateRows: isMobile ? "repeat(3, 1fr)" : "1fr 1fr",
              gap: 4,
            }}
          >
            {gallery.images.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  ...(i === 0 && !isMobile ? { gridRow: "1 / 3" } : {}),
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.5s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px 16px 12px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                  }}
                >
                  <span style={{ fontSize: 12, color: C.white, fontWeight: 500 }}>
                    {img.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            VOICES (100vh, horizontal scrollable speech bubbles)
            ============================================================ */}
        <section
          ref={setSectionRef(9)}
          className="r05-snap-section"
          id="voices"
          style={{ overflow: "hidden", background: C.bgSub }}
        >
          <div style={{ width: "100%", padding: isMobile ? "60px 0" : "60px 0", boxSizing: "border-box" }}>
            <FadeIn>
              <SectionHeading
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                }
                label="先輩の声"
                sub="VOICES"
              />
            </FadeIn>

            <div
              style={{
                display: "flex",
                gap: isMobile ? 16 : 28,
                overflowX: "auto",
                padding: isMobile ? "0 16px 16px" : "0 60px 20px",
                scrollSnapType: "x mandatory",
              }}
            >
              {voices.map((v, i) => (
                <FadeIn key={i} delay={0.1 * i} style={{ flexShrink: 0, width: isMobile ? "85vw" : 360, scrollSnapAlign: "center" }}>
                  <div
                    style={{
                      background: C.white,
                      borderRadius: 20,
                      padding: isMobile ? "24px 20px" : "32px 28px",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                      position: "relative",
                    }}
                  >
                    {/* Speech bubble tail */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: -12,
                        left: 36,
                        width: 0,
                        height: 0,
                        borderLeft: "12px solid transparent",
                        borderRight: "12px solid transparent",
                        borderTop: `14px solid ${C.white}`,
                      }}
                    />
                    {/* Profile */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: `${C.accent}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{v.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{v.age} / {v.prev}</div>
                      </div>
                    </div>
                    {/* Highlight */}
                    <div
                      style={{
                        background: C.accentLight,
                        color: C.accent,
                        fontWeight: 600,
                        fontSize: 13,
                        padding: "8px 14px",
                        borderRadius: 8,
                        marginBottom: 14,
                        borderLeft: `3px solid ${C.accent}`,
                      }}
                    >
                      {v.highlight}
                    </div>
                    {/* Text */}
                    <p style={{ fontSize: 13, lineHeight: 1.8, color: C.textSub, margin: 0, whiteSpace: "pre-line" }}>
                      {v.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            FAQ (min-height 100vh, can exceed)
            ============================================================ */}
        <section
          ref={setSectionRef(10)}
          className="r05-snap-section-top"
          id="faq"
          style={{ background: C.white, padding: isMobile ? "80px 16px 60px" : "100px 40px 80px" }}
        >
          <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
            <FadeIn>
              <SectionHeading
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
                  </svg>
                }
                label="よくある質問"
                sub="FAQ"
              />
            </FadeIn>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faq.map((item, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <div
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      transition: "box-shadow 0.3s",
                      boxShadow: faqOpen === i ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    <button
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      style={{
                        width: "100%",
                        padding: "18px 20px",
                        background: faqOpen === i ? C.accentLight : C.white,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        textAlign: "left",
                        transition: "background 0.3s",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: F.accent,
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.accent,
                          flexShrink: 0,
                        }}
                      >
                        Q.
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text, flex: 1, fontFamily: F.sans }}>
                        {item.q}
                      </span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={C.muted}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          flexShrink: 0,
                          transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s",
                        }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div
                      style={{
                        maxHeight: faqOpen === i ? 400 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.4s ease",
                      }}
                    >
                      <div
                        style={{
                          padding: "16px 20px 20px",
                          display: "flex",
                          gap: 14,
                          background: C.white,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: F.accent,
                            fontSize: 14,
                            fontWeight: 700,
                            color: C.accent,
                            flexShrink: 0,
                          }}
                        >
                          A.
                        </span>
                        <p style={{ fontSize: 14, lineHeight: 1.8, color: C.textSub, margin: 0, whiteSpace: "pre-line" }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            APPLY FORM (min-height 100vh, split: image left + form right)
            ============================================================ */}
        <section
          ref={setSectionRef(11)}
          className="r05-snap-section-top"
          id="apply"
          style={{ overflow: "hidden", background: C.bgSub }}
        >
          <div
            style={{
              width: "100%",
              minHeight: "100vh",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {/* Left image */}
            {!isMobile && (
              <div
                style={{
                  width: "42%",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "100vh",
                }}
              >
                <img
                  src={IMG.vehicle}
                  alt="配送車両"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    inset: 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(232,115,74,0.2) 0%, rgba(0,0,0,0.3) 100%)",
                  }}
                />
              </div>
            )}

            {/* Right form */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "80px 20px 40px" : "80px 60px 60px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FadeIn>
                <SectionHeading
                  icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  }
                  label="応募・お問い合わせ"
                  sub="APPLY"
                />
              </FadeIn>

              <FadeIn delay={0.1}>
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  style={{
                    background: C.white,
                    borderRadius: 16,
                    padding: isMobile ? "24px 20px" : "36px 32px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  <FormField label="お名前" placeholder="例：山田 太郎" required type="text" name="name" />
                  <FormField label="フリガナ" placeholder="例：ヤマダ タロウ" required type="text" name="kana" />
                  <FormField label="電話番号" placeholder="例：090-1234-5678" required type="tel" name="phone" />
                  <FormField label="メールアドレス" placeholder="例：yamada@example.com" type="email" name="email" />
                  <FormField label="年齢" placeholder="例：35" type="text" name="age" />

                  {/* Area select */}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.text,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      希望エリア
                    </label>
                    <select
                      name="area"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: 14,
                        border: `2px solid ${C.border}`,
                        borderRadius: 8,
                        outline: "none",
                        fontFamily: F.sans,
                        boxSizing: "border-box",
                        background: C.white,
                      }}
                    >
                      <option value="">選択してください</option>
                      <option value="大阪">大阪</option>
                      <option value="東京">東京</option>
                      <option value="兵庫">兵庫</option>
                      <option value="鳥取">鳥取</option>
                      <option value="島根">島根</option>
                      <option value="沖縄">沖縄</option>
                    </select>
                  </div>

                  {/* Free text */}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.text,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      備考・質問など
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="例：週3日からの勤務を希望しています"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: 14,
                        border: `2px solid ${C.border}`,
                        borderRadius: 8,
                        outline: "none",
                        fontFamily: F.sans,
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: C.accent,
                      color: C.white,
                      padding: "16px 0",
                      borderRadius: 28,
                      border: "none",
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background 0.2s, transform 0.2s",
                      fontFamily: F.sans,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.accentDark;
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.accent;
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    送信する
                  </button>
                </form>
              </FadeIn>

              {/* Truck animation */}
              <div
                style={{
                  marginTop: 32,
                  height: 50,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 0,
                    width: "100%",
                    height: 2,
                    background: C.border,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    animation: "r05TruckDrive 6s linear infinite",
                  }}
                >
                  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="28" height="20" rx="2" />
                    <path d="M29 12h8l6 8v4h-14V12z" />
                    <circle cx="12" cy="26" r="3" />
                    <circle cx="37" cy="26" r="3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CTA (100vh, delivery.webp full bg, frosted glass card)
            ============================================================ */}
        <section
          ref={setSectionRef(12)}
          className="r05-snap-section"
          id="cta-section"
          style={{ overflow: "hidden" }}
        >
          <img
            src={IMG.delivery}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 640,
              width: "100%",
              margin: "0 auto",
              padding: isMobile ? "0 20px" : "0 40px",
              boxSizing: "border-box",
            }}
          >
            <FadeIn>
              <div
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 24,
                  padding: isMobile ? "40px 24px" : "56px 48px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: F.heading,
                    fontSize: isMobile ? "clamp(1.2rem, 5vw, 1.6rem)" : "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 700,
                    color: C.white,
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                  }}
                >
                  {cta.heading.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </h2>

                <p
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.8)",
                    margin: "0 0 32px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {cta.subtext}
                </p>

                {/* Phone */}
                <div style={{ marginBottom: 20 }}>
                  <a
                    href={`tel:${cta.phone}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      color: C.white,
                      textDecoration: "none",
                      fontSize: isMobile ? 20 : 24,
                      fontFamily: F.accent,
                      fontWeight: 700,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {cta.phone}
                  </a>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                    {company.hours}
                  </div>
                </div>

                {/* Web apply button */}
                <a
                  href="#apply"
                  onClick={(e) => {
                    e.preventDefault();
                    const sec = sectionRefs.current[11];
                    if (sec) sec.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-block",
                    background: C.accent,
                    color: C.white,
                    padding: "14px 48px",
                    borderRadius: 28,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(232,115,74,0.4)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {cta.webLabel}
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================================
            FOOTER (NOT full screen, normal footer)
            ============================================================ */}
        <footer
          ref={setSectionRef(13)}
          id="footer-section"
          style={{
            position: "relative",
            scrollSnapAlign: "end",
            overflow: "hidden",
          }}
        >
          <img
            src={IMG.footerBg}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1 }} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 1100,
              margin: "0 auto",
              padding: isMobile ? "48px 20px 24px" : "64px 40px 32px",
            }}
          >
            {/* Catchphrase */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p
                style={{
                  fontFamily: "'Zen Kurenaido', 'Yomogi', sans-serif",
                  fontSize: isMobile ? "clamp(1rem, 4vw, 1.4rem)" : "clamp(1.2rem, 2vw, 1.8rem)",
                  color: "rgba(255,255,255,0.85)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  letterSpacing: 2,
                }}
              >
                {footer.catchphrase}
              </p>
            </div>

            {/* Footer grid */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                gap: 32,
                marginBottom: 32,
              }}
            >
              {/* Company info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: C.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontFamily: F.accent,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    GL
                  </span>
                  <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 14, color: C.white }}>
                    {company.name}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                  <div>{company.postalCode}</div>
                  <div>{company.address}</div>
                  <div>{company.phone}</div>
                  <div>{company.hours}</div>
                </div>
              </div>

              {/* Navigation links */}
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
                    gap: "8px 24px",
                  }}
                >
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 20,
                textAlign: "center",
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              &copy; {new Date().getFullYear()} {company.name} All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
