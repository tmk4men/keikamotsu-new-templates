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

/* ═══════════════════════════════════════════════════
   COLOR CONSTANTS
   ═══════════════════════════════════════════════════ */
const C = {
  bg: "#f8f9fa",
  bgDark: "#1e293b",
  accent: "#3b82f6",
  accentLight: "#eff6ff",
  text: "#0f172a",
  textSub: "#64748b",
  border: "#e2e8f0",
  white: "#ffffff",
};

/* ═══════════════════════════════════════════════════
   IMAGE PATHS
   ═══════════════════════════════════════════════════ */
const IMG = {
  hero: "/keikamotsu-new-templates/images/hero-bg.webp",
  serviceRoute: "/keikamotsu-new-templates/images/service-route.webp",
  serviceEc: "/keikamotsu-new-templates/images/service-ec.webp",
  serviceB2b: "/keikamotsu-new-templates/images/service-b2b.webp",
  serviceSpot: "/keikamotsu-new-templates/images/service-spot.webp",
  strength01: "/keikamotsu-new-templates/images/strength-01.webp",
  strength02: "/keikamotsu-new-templates/images/strength-02.webp",
  strength03: "/keikamotsu-new-templates/images/strength-03.webp",
  ceo: "/keikamotsu-new-templates/images/ceo-portrait.webp",
  team: "/keikamotsu-new-templates/images/team.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
};

const serviceImages = [IMG.serviceRoute, IMG.serviceEc, IMG.serviceB2b, IMG.serviceSpot];
const strengthImages = [IMG.strength01, IMG.strength02, IMG.strength03];

/* ═══════════════════════════════════════════════════
   PANEL DEFINITIONS
   ═══════════════════════════════════════════════════ */
const PANEL_SECTIONS = [
  { id: "hero", label: "TOP" },
  { id: "services", label: "事業内容" },
  { id: "strengths", label: "私たちの強み" },
  { id: "message", label: "代表メッセージ" },
  { id: "company", label: "会社概要" },
  { id: "numbers", label: "実績" },
  { id: "partners", label: "取引先" },
  { id: "news", label: "お知らせ" },
  { id: "recruit", label: "採用情報" },
  { id: "contact", label: "お問い合わせ" },
];
const TOTAL_PANELS = PANEL_SECTIONS.length;

/* ═══════════════════════════════════════════════════
   CSS KEYFRAMES
   ═══════════════════════════════════════════════════ */
const KEYFRAMES = `
@keyframes cp02-fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes cp02-fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes cp02-scrollArrow {
  0%, 100% { opacity: 0.3; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(8px); }
}
@keyframes cp02-underlineGrow {
  0% { width: 0; }
  100% { width: 100%; }
}
@keyframes cp02-truckDrive {
  0% { transform: translateX(-120px); }
  100% { transform: translateX(calc(100vw + 120px)); }
}
@keyframes cp02-counterUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes cp02-typewriter {
  0% { width: 0; }
  100% { width: 100%; }
}
@keyframes cp02-blinkCaret {
  0%, 100% { border-color: transparent; }
  50% { border-color: ${C.accent}; }
}
@keyframes cp02-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
  50% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
}
@keyframes cp02-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes cp02-dotPulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.5); opacity: 1; }
}
`;

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */

/* --- useIsMobile --- */
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* --- useTypewriter --- */
function useTypewriter(text: string, speed = 40, startDelay = 300) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const delayTimer = setTimeout(() => {
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
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/* ═══════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════ */

/* --- FadeIn --- */
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const translateMap = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(30px)",
    right: "translateX(-30px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translateMap[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* --- CounterNum --- */
function CounterNum({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: string;
  suffix: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState("0");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const numericStr = value.replace(/,/g, "");
    const target = parseFloat(numericStr);
    const isFloat = numericStr.includes(".");
    const duration = 2000;
    const startTime = performance.now();

    const timer = setTimeout(() => {
      const animate = (now: number) => {
        const elapsed = now - startTime - delay * 1000;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        if (isFloat) {
          setCount(current.toFixed(1));
        } else {
          const formatted = Math.floor(current).toLocaleString();
          setCount(formatted);
        }
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [started, value, delay]);

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        animation: started ? "cp02-counterUp 0.6s ease forwards" : "none",
        animationDelay: `${delay}s`,
      }}
    >
      <div
        style={{
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          fontWeight: 800,
          color: C.white,
          lineHeight: 1.1,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {count}
        <span style={{ fontSize: "0.5em", fontWeight: 600, marginLeft: 4, color: C.accent }}>
          {suffix}
        </span>
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 8, letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

/* --- Inline SVG Icons (stroke only, currentColor) --- */
const SvgArrowRight = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SvgPhone = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const SvgMail = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4l-10 8L2 4" />
  </svg>
);

const SvgMapPin = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SvgClock = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SvgSend = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SvgUsers = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const SvgExternalLink = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* --- Cityscape SVG (single-stroke) --- */
const CityscapeSvg = ({ color = "rgba(255,255,255,0.15)", height = 60 }: { color?: string; height?: number }) => (
  <svg
    viewBox="0 0 1440 120"
    style={{ width: "100%", height, display: "block" }}
    preserveAspectRatio="none"
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="0,120 0,90 30,90 30,60 50,60 50,90 70,90 70,40 90,40 90,90 120,90 120,70 140,70 140,50 160,50 160,70 180,70 180,90 210,90 210,30 230,30 230,90 260,90 260,80 280,80 280,55 300,55 300,80 330,80 330,90 360,90 360,20 370,20 380,20 380,90 410,90 410,75 430,75 430,45 450,45 450,75 470,75 470,90 500,90 500,65 520,65 520,35 540,35 540,65 560,65 560,90 590,90 590,50 610,50 610,90 640,90 640,70 660,70 660,25 680,25 680,70 700,70 700,90 730,90 730,80 750,80 750,60 770,60 770,80 790,80 790,90 820,90 820,45 840,45 840,90 870,90 870,55 890,55 890,30 910,30 910,55 930,55 930,90 960,90 960,70 980,70 980,40 1000,40 1000,70 1020,70 1020,90 1050,90 1050,60 1070,60 1070,20 1090,20 1090,60 1110,60 1110,90 1140,90 1140,75 1160,75 1160,50 1180,50 1180,75 1200,75 1200,90 1230,90 1230,35 1250,35 1250,90 1280,90 1280,80 1300,80 1300,65 1320,65 1320,80 1340,80 1340,90 1370,90 1370,55 1390,55 1390,90 1420,90 1420,120 1440,120" />
  </svg>
);

/* --- Truck SVG for animation --- */
const TruckSvg = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 120 72" fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="12" width="70" height="40" rx="4" />
    <path d="M72 30h20l14 18v4H72V30z" />
    <circle cx="24" cy="58" r="10" />
    <circle cx="24" cy="58" r="4" />
    <circle cx="94" cy="58" r="10" />
    <circle cx="94" cy="58" r="4" />
    <line x1="34" y1="52" x2="84" y2="52" />
  </svg>
);

/* ═══════════════════════════════════════════════════
   SECTION HEADING
   ═══════════════════════════════════════════════════ */
function SectionHeading({
  title,
  sub,
  light = false,
  align = "left",
}: {
  title: string;
  sub?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
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
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ textAlign: align, marginBottom: 32 }}>
      {sub && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 8,
          }}
        >
          {sub}
        </div>
      )}
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 800,
          color: light ? C.white : C.text,
          lineHeight: 1.3,
          margin: 0,
          position: "relative",
          display: align === "center" ? "inline-block" : "block",
        }}
      >
        {title}
        <span
          style={{
            position: "absolute",
            bottom: -4,
            left: 0,
            height: 3,
            background: C.accent,
            borderRadius: 2,
            width: visible ? "100%" : 0,
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1) 0.3s",
          }}
        />
      </h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function CP02Page() {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePanel, setActivePanel] = useState(0);
  const { displayed: heroTyped, done: heroTypeDone } = useTypewriter(hero.headline, 60, 600);

  /* --- Contact Form State --- */
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  /* --- Horizontal Scroll Logic --- */
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
      setScrollProgress(progress);
      const panelIdx = Math.min(
        TOTAL_PANELS - 1,
        Math.floor(progress * TOTAL_PANELS)
      );
      setActivePanel(panelIdx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  /* --- Scroll to panel (dots navigation) --- */
  const scrollToPanel = useCallback(
    (panelIndex: number) => {
      if (isMobile) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperTop = wrapper.offsetTop;
      const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
      const targetScroll = wrapperTop + (panelIndex / TOTAL_PANELS) * scrollableHeight;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [isMobile]
  );

  /* --- translateX for horizontal panels --- */
  const translateX = isMobile ? 0 : -(scrollProgress * (TOTAL_PANELS - 1) * 100);

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <>
      <style>{KEYFRAMES}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Zen+Kurenaido&display=swap"
        rel="stylesheet"
      />

      {/* ─── FIXED UI (desktop only) ─── */}
      {!isMobile && (
        <>
          {/* Logo top-left */}
          <div
            style={{
              position: "fixed",
              top: 20,
              left: 24,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="6" width="15" height="13" rx="2" />
                <path d="M16 10h4l3 4v5h-7V10z" />
                <circle cx="7" cy="21" r="2" />
                <circle cx="20" cy="21" r="2" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: activePanel === 0 || activePanel === 5 ? C.white : C.text,
                letterSpacing: "0.02em",
                transition: "color 0.4s ease",
              }}
            >
              GL
            </span>
          </div>

          {/* Section indicator top-right */}
          <div
            style={{
              position: "fixed",
              top: 20,
              right: 24,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: activePanel === 0 || activePanel === 5 ? "rgba(255,255,255,0.7)" : C.textSub,
                transition: "color 0.4s ease",
              }}
            >
              {PANEL_SECTIONS[activePanel]?.label}
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: activePanel === 0 || activePanel === 5 ? C.white : C.text,
                fontFamily: "'Inter', sans-serif",
                transition: "color 0.4s ease",
              }}
            >
              {String(activePanel + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Bottom progress bar */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              height: 3,
              background: "rgba(0,0,0,0.08)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${scrollProgress * 100}%`,
                background: C.accent,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Bottom dot navigation */}
          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 10,
              zIndex: 1000,
            }}
          >
            {PANEL_SECTIONS.map((sec, i) => (
              <button
                key={sec.id}
                onClick={() => scrollToPanel(i)}
                aria-label={sec.label}
                style={{
                  width: activePanel === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activePanel === i ? C.accent : (activePanel === 0 || activePanel === 5) ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.15)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ═══════ HORIZONTAL SCROLL WRAPPER ═══════ */}
      <div
        ref={wrapperRef}
        style={{
          height: isMobile ? "auto" : `${TOTAL_PANELS * 100}vh`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: isMobile ? "relative" : "sticky",
            top: 0,
            height: isMobile ? "auto" : "100vh",
            overflow: isMobile ? "visible" : "hidden",
          }}
        >
          <div
            style={{
              display: isMobile ? "block" : "flex",
              width: isMobile ? "100%" : "fit-content",
              transform: isMobile ? "none" : `translateX(${translateX}vw)`,
              transition: "none",
              willChange: "transform",
            }}
          >
            {/* ═══════════════════════════════════════
               PANEL 1: HERO
               ═══════════════════════════════════════ */}
            <section
              id="hero"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "100vh" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* BG Image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${IMG.hero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.3) 100%)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: isMobile ? "0 24px" : "0 80px",
                  maxWidth: 700,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: C.accent,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    animation: "cp02-fadeIn 1s ease 0.3s both",
                  }}
                >
                  {company.nameEn}
                </div>

                <h1
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.6rem)",
                    fontWeight: 900,
                    color: C.white,
                    lineHeight: 1.2,
                    margin: 0,
                    marginBottom: 20,
                    minHeight: "1.2em",
                    borderRight: heroTypeDone ? "none" : `3px solid ${C.accent}`,
                    animation: heroTypeDone ? "none" : "cp02-blinkCaret 0.8s step-end infinite",
                    display: "inline-block",
                  }}
                >
                  {heroTyped}
                </h1>

                <div style={{ animation: "cp02-fadeIn 1s ease 1.5s both" }}>
                  {hero.subtext.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: isMobile ? 13 : 15,
                        color: "rgba(255,255,255,0.75)",
                        lineHeight: 1.8,
                        margin: "0 0 4px",
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div style={{ marginTop: 36, animation: "cp02-fadeIn 1s ease 2s both" }}>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isMobile) scrollToPanel(9);
                      else {
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 32px",
                      background: C.accent,
                      color: C.white,
                      borderRadius: 6,
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: "none",
                      letterSpacing: "0.03em",
                      animation: "cp02-pulse 2s ease infinite",
                    }}
                  >
                    {hero.cta}
                    <SvgArrowRight size={18} />
                  </a>
                </div>
              </div>

              {/* Scroll arrow right */}
              {!isMobile && (
                <div
                  style={{
                    position: "absolute",
                    right: 40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(255,255,255,0.5)",
                    animation: "cp02-scrollArrow 2s ease infinite",
                  }}
                >
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", writingMode: "vertical-rl" }}>
                    SCROLL
                  </span>
                  <SvgArrowRight size={28} />
                </div>
              )}
            </section>

            {/* ═══════════════════════════════════════
               PANEL 2: SERVICES
               ═══════════════════════════════════════ */}
            <section
              id="services"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: C.bg,
                padding: isMobile ? "80px 20px" : "0 80px",
              }}
            >
              <FadeIn>
                <SectionHeading title="事業内容" sub="SERVICES" />
              </FadeIn>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? 16 : 20,
                  maxWidth: 900,
                  marginTop: 12,
                }}
              >
                {services.map((svc, i) => (
                  <FadeIn key={svc.num} delay={i * 0.12}>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 12,
                        overflow: "hidden",
                        height: isMobile ? 180 : 220,
                        cursor: "default",
                      }}
                    >
                      {/* Card BG image */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${serviceImages[i]})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.5s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                      />
                      {/* Gradient */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%)",
                        }}
                      />
                      {/* Text */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: isMobile ? "16px 18px" : "20px 24px",
                          zIndex: 2,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: C.accent,
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {svc.num}
                        </div>
                        <h3
                          style={{
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 800,
                            color: C.white,
                            margin: 0,
                            marginBottom: 6,
                          }}
                        >
                          {svc.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.6,
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {svc.text.replace(/\n/g, " ")}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 3: STRENGTHS
               ═══════════════════════════════════════ */}
            <section
              id="strengths"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: C.white,
                padding: isMobile ? "80px 20px" : "0 80px",
              }}
            >
              <FadeIn>
                <SectionHeading title="私たちの強み" sub="STRENGTHS" />
              </FadeIn>

              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 16 : 20,
                  maxWidth: 1000,
                  height: isMobile ? "auto" : "60vh",
                  marginTop: 12,
                }}
              >
                {strengths.map((str, i) => (
                  <FadeIn key={str.num} delay={i * 0.15} style={{ flex: 1 }}>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 12,
                        overflow: "hidden",
                        height: isMobile ? 240 : "100%",
                      }}
                    >
                      {/* BG */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${strengthImages[i]})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.6s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                      />
                      {/* Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%)",
                        }}
                      />
                      {/* Number */}
                      <div
                        style={{
                          position: "absolute",
                          top: 20,
                          left: 20,
                          fontSize: "clamp(3rem, 6vw, 5rem)",
                          fontWeight: 900,
                          color: "rgba(255,255,255,0.15)",
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1,
                        }}
                      >
                        {str.num}
                      </div>
                      {/* Text */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "24px 20px",
                          zIndex: 2,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 800,
                            color: C.white,
                            margin: 0,
                            marginBottom: 8,
                            lineHeight: 1.4,
                          }}
                        >
                          {str.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {str.text.replace(/\n/g, " ")}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 4: CEO MESSAGE
               ═══════════════════════════════════════ */}
            <section
              id="message"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                background: C.bg,
              }}
            >
              {/* Left: CEO portrait */}
              <div
                style={{
                  width: isMobile ? "100%" : "50%",
                  height: isMobile ? 350 : "100%",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${IMG.ceo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isMobile
                      ? "linear-gradient(to bottom, transparent 60%, rgba(248,249,250,1) 100%)"
                      : "linear-gradient(to right, transparent 70%, rgba(248,249,250,1) 100%)",
                  }}
                />
              </div>

              {/* Right: Quote */}
              <div
                style={{
                  width: isMobile ? "100%" : "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "0 24px 60px" : "0 60px",
                  position: "relative",
                }}
              >
                <FadeIn>
                  {/* Decorative quote mark */}
                  <div
                    style={{
                      position: "absolute",
                      top: isMobile ? -20 : "15%",
                      left: isMobile ? 20 : 40,
                      fontSize: "clamp(6rem, 12vw, 10rem)",
                      fontWeight: 900,
                      color: "rgba(59,130,246,0.08)",
                      lineHeight: 1,
                      fontFamily: "Georgia, serif",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    &ldquo;
                  </div>

                  <SectionHeading title="代表メッセージ" sub="MESSAGE" />

                  {ceoMessage.message.map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: isMobile ? 14 : 15,
                        lineHeight: 2,
                        color: C.text,
                        margin: "0 0 16px",
                        fontStyle: i === 0 ? "italic" : "normal",
                        fontWeight: i === 0 ? 600 : 400,
                      }}
                    >
                      {para}
                    </p>
                  ))}

                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 1,
                        background: C.accent,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 11, color: C.textSub, letterSpacing: "0.05em" }}>
                        {ceoMessage.title}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
                        {ceoMessage.name}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 5: COMPANY + HISTORY
               ═══════════════════════════════════════ */}
            <section
              id="company"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                background: C.white,
                padding: isMobile ? "80px 20px 60px" : 0,
              }}
            >
              {/* Left: Company Overview */}
              <div
                style={{
                  width: isMobile ? "100%" : "55%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? 0 : "0 60px",
                }}
              >
                <FadeIn>
                  <SectionHeading title="会社概要" sub="COMPANY" />

                  <table
                    style={{
                      width: "100%",
                      maxWidth: 560,
                      borderCollapse: "collapse",
                      fontSize: isMobile ? 13 : 14,
                    }}
                  >
                    <tbody>
                      {companyOverview.map((row, i) => (
                        <tr key={i}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "10px 16px 10px 0",
                              fontWeight: 700,
                              color: C.text,
                              whiteSpace: "nowrap",
                              borderBottom: `1px solid ${C.border}`,
                              verticalAlign: "top",
                              width: isMobile ? 80 : 100,
                              fontSize: isMobile ? 12 : 13,
                            }}
                          >
                            {row.dt}
                          </th>
                          <td
                            style={{
                              padding: "10px 0",
                              color: C.textSub,
                              borderBottom: `1px solid ${C.border}`,
                              lineHeight: 1.6,
                              fontSize: isMobile ? 12 : 13,
                            }}
                          >
                            {row.dd}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </FadeIn>
              </div>

              {/* Right: History Timeline */}
              <div
                id="history"
                style={{
                  width: isMobile ? "100%" : "45%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "40px 0 0" : "0 60px",
                  borderLeft: isMobile ? "none" : `1px solid ${C.border}`,
                }}
              >
                <FadeIn>
                  <SectionHeading title="沿革" sub="HISTORY" />

                  <div style={{ position: "relative", paddingLeft: 28 }}>
                    {/* Vertical line */}
                    <div
                      style={{
                        position: "absolute",
                        left: 7,
                        top: 4,
                        bottom: 4,
                        width: 2,
                        background: C.border,
                      }}
                    />

                    {history.map((item, i) => (
                      <FadeIn key={item.year} delay={i * 0.1}>
                        <div
                          style={{
                            position: "relative",
                            marginBottom: 28,
                            display: "flex",
                            gap: 16,
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Dot */}
                          <div
                            style={{
                              position: "absolute",
                              left: -24,
                              top: 4,
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              background: C.accent,
                              border: `3px solid ${C.white}`,
                              boxShadow: `0 0 0 2px ${C.accent}`,
                              zIndex: 1,
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: C.accent,
                                fontFamily: "'Inter', sans-serif",
                                lineHeight: 1,
                                marginBottom: 4,
                              }}
                            >
                              {item.year}
                            </div>
                            <p
                              style={{
                                fontSize: 13,
                                color: C.textSub,
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {item.event}
                            </p>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 6: NUMBERS
               ═══════════════════════════════════════ */}
            <section
              id="numbers"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: isMobile ? "80px 20px" : "0 80px",
              }}
            >
              {/* BG */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${IMG.team})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(15,23,42,0.88)",
                }}
              />

              <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%", maxWidth: 800 }}>
                <FadeIn>
                  <SectionHeading title="数字で見る実績" sub="NUMBERS" light align="center" />
                </FadeIn>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                    gap: isMobile ? "40px 20px" : 40,
                    marginTop: 48,
                  }}
                >
                  {numbers.map((n, i) => (
                    <CounterNum
                      key={n.label}
                      value={n.value}
                      suffix={n.suffix}
                      label={n.label}
                      delay={i * 0.2}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 7: PARTNERS
               ═══════════════════════════════════════ */}
            <section
              id="partners"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: C.bg,
                padding: isMobile ? "80px 20px" : "0 80px",
              }}
            >
              <FadeIn>
                <SectionHeading title="主要取引先" sub="PARTNERS" align="center" />
              </FadeIn>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                  gap: 16,
                  maxWidth: 700,
                  margin: "20px auto 0",
                  width: "100%",
                }}
              >
                {partners.map((p, i) => (
                  <FadeIn key={p.name} delay={i * 0.08}>
                    <div
                      style={{
                        background: C.white,
                        borderRadius: 10,
                        padding: "24px 16px",
                        textAlign: "center",
                        border: `1px solid ${C.border}`,
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: C.accentLight,
                          margin: "0 auto 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                        </svg>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
                        {p.name}
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                          fontSize: 10,
                          fontWeight: 600,
                          color: C.accent,
                          background: C.accentLight,
                          padding: "2px 10px",
                          borderRadius: 99,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {p.industry}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Truck animation */}
              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? 10 : 30,
                  left: 0,
                  width: "100%",
                  overflow: "hidden",
                  height: 60,
                  pointerEvents: "none",
                }}
              >
                {/* Cityscape silhouette */}
                <div style={{ position: "absolute", bottom: 10, left: 0, width: "100%" }}>
                  <CityscapeSvg color="rgba(0,0,0,0.06)" height={40} />
                </div>
                {/* Truck */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    animation: "cp02-truckDrive 12s linear infinite",
                  }}
                >
                  <TruckSvg size={60} />
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 8: NEWS
               ═══════════════════════════════════════ */}
            <section
              id="news"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: C.white,
                padding: isMobile ? "80px 20px" : "0 80px",
              }}
            >
              <FadeIn>
                <SectionHeading title="お知らせ" sub="NEWS" />
              </FadeIn>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
                  gap: 24,
                  maxWidth: 900,
                  marginTop: 12,
                }}
              >
                {/* Featured news */}
                {news.length > 0 && (
                  <FadeIn>
                    <div
                      style={{
                        background: C.accentLight,
                        borderRadius: 14,
                        padding: isMobile ? 24 : 36,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minHeight: isMobile ? 160 : 280,
                        border: `1px solid ${C.border}`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Decorative large number */}
                      <div
                        style={{
                          position: "absolute",
                          top: -10,
                          right: 10,
                          fontSize: "8rem",
                          fontWeight: 900,
                          color: "rgba(59,130,246,0.06)",
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1,
                          pointerEvents: "none",
                        }}
                      >
                        01
                      </div>
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.white,
                              background: news[0].tagStyle === "press" ? "#ef4444" : news[0].tagStyle === "new" ? "#22c55e" : C.accent,
                              padding: "3px 10px",
                              borderRadius: 4,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {news[0].tag}
                          </span>
                          <span style={{ fontSize: 12, color: C.textSub }}>{news[0].date}</span>
                        </div>
                        <h3
                          style={{
                            fontSize: isMobile ? 18 : 22,
                            fontWeight: 800,
                            color: C.text,
                            lineHeight: 1.4,
                            margin: 0,
                          }}
                        >
                          {news[0].title}
                        </h3>
                      </div>
                    </div>
                  </FadeIn>
                )}

                {/* Other news items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {news.slice(1).map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div
                        style={{
                          padding: "18px 20px",
                          borderRadius: 10,
                          border: `1px solid ${C.border}`,
                          background: C.bg,
                          transition: "box-shadow 0.3s ease",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.white,
                              background: item.tagStyle === "press" ? "#ef4444" : item.tagStyle === "new" ? "#22c55e" : C.accent,
                              padding: "2px 8px",
                              borderRadius: 3,
                            }}
                          >
                            {item.tag}
                          </span>
                          <span style={{ fontSize: 11, color: C.textSub }}>{item.date}</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.5 }}>
                          {item.title}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 9: RECRUIT
               ═══════════════════════════════════════ */}
            <section
              id="recruit"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* BG image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${IMG.delivery})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(15,23,42,0.5)",
                  backdropFilter: "blur(2px)",
                }}
              />

              {/* Frosted glass card */}
              <FadeIn style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 600, padding: isMobile ? "80px 20px" : 0 }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: 20,
                    padding: isMobile ? "40px 28px" : "56px 48px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: C.accent,
                      marginBottom: 16,
                    }}
                  >
                    RECRUIT
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Zen Kurenaido', sans-serif",
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
                      fontWeight: 400,
                      color: C.white,
                      lineHeight: 1.6,
                      margin: 0,
                      marginBottom: 8,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    {recruit.heading}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: 0,
                        width: "100%",
                        height: 2,
                        background: C.accent,
                        animation: "cp02-underlineGrow 1.2s ease 0.5s both",
                        transformOrigin: "left",
                      }}
                    />
                  </h2>

                  <p
                    style={{
                      fontSize: isMobile ? 13 : 14,
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.9,
                      margin: "20px 0 32px",
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
                      padding: "14px 36px",
                      background: C.accent,
                      color: C.white,
                      borderRadius: 6,
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = C.accent; }}
                  >
                    {recruit.cta}
                    <SvgExternalLink size={16} />
                  </a>
                </div>
              </FadeIn>
            </section>

            {/* ═══════════════════════════════════════
               PANEL 10: CONTACT
               ═══════════════════════════════════════ */}
            <section
              id="contact"
              style={{
                width: isMobile ? "100%" : "100vw",
                height: isMobile ? "auto" : "100vh",
                flexShrink: 0,
                position: "relative",
                overflow: isMobile ? "visible" : "auto",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                background: C.bg,
              }}
            >
              {/* Left: Company info + map */}
              <div
                id="access"
                style={{
                  width: isMobile ? "100%" : "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "80px 20px 40px" : "0 48px",
                }}
              >
                <FadeIn>
                  <SectionHeading title="アクセス" sub="ACCESS" />

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SvgMapPin size={18} />
                      <span style={{ fontSize: 14, color: C.text }}>{access.address}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SvgPhone size={18} />
                      <span style={{ fontSize: 14, color: C.text }}>{company.phone}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SvgMail size={18} />
                      <span style={{ fontSize: 14, color: C.text }}>{company.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SvgClock size={18} />
                      <span style={{ fontSize: 14, color: C.text }}>{company.hours}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: C.textSub, marginBottom: 16 }}>
                    {access.nearestStation}
                  </p>

                  {/* Google Maps */}
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      border: `1px solid ${C.border}`,
                      height: isMobile ? 200 : 240,
                    }}
                  >
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(access.address)}&output=embed&z=15`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps"
                    />
                  </div>
                </FadeIn>
              </div>

              {/* Right: Contact form */}
              <div
                style={{
                  width: isMobile ? "100%" : "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "20px 20px 60px" : "0 48px",
                  borderLeft: isMobile ? "none" : `1px solid ${C.border}`,
                }}
              >
                <FadeIn>
                  <SectionHeading title="お問い合わせ" sub="CONTACT" />

                  <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, marginBottom: 24, whiteSpace: "pre-line" }}>
                    {contact.intro}
                  </p>

                  {formSubmitted ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        background: C.accentLight,
                        borderRadius: 12,
                      }}
                    >
                      <div style={{ marginBottom: 12 }}>
                        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                        送信完了
                      </div>
                      <p style={{ fontSize: 13, color: C.textSub }}>
                        お問い合わせありがとうございます。担当者より折り返しご連絡いたします。
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {/* Company */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                          会社名 <span style={{ color: "#ef4444", fontSize: 10 }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="company"
                          required
                          placeholder="例）グリーンロジスティクス株式会社"
                          value={form.company}
                          onChange={handleFormChange}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 6,
                            border: `1px solid ${C.border}`,
                            fontSize: 14,
                            outline: "none",
                            background: C.white,
                            boxSizing: "border-box",
                            transition: "border-color 0.2s ease",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        />
                      </div>

                      {/* Name */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                          ご担当者名 <span style={{ color: "#ef4444", fontSize: 10 }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="例）山田 太郎"
                          value={form.name}
                          onChange={handleFormChange}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 6,
                            border: `1px solid ${C.border}`,
                            fontSize: 14,
                            outline: "none",
                            background: C.white,
                            boxSizing: "border-box",
                            transition: "border-color 0.2s ease",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                          メールアドレス <span style={{ color: "#ef4444", fontSize: 10 }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="例）info@example.com"
                          value={form.email}
                          onChange={handleFormChange}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 6,
                            border: `1px solid ${C.border}`,
                            fontSize: 14,
                            outline: "none",
                            background: C.white,
                            boxSizing: "border-box",
                            transition: "border-color 0.2s ease",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                          電話番号
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="例）050-0132-1348"
                          value={form.phone}
                          onChange={handleFormChange}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 6,
                            border: `1px solid ${C.border}`,
                            fontSize: 14,
                            outline: "none",
                            background: C.white,
                            boxSizing: "border-box",
                            transition: "border-color 0.2s ease",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                          お問い合わせ内容 <span style={{ color: "#ef4444", fontSize: 10 }}>*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          placeholder="例）配送サービスについてお見積もりをお願いしたいです。"
                          value={form.message}
                          onChange={handleFormChange}
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 6,
                            border: `1px solid ${C.border}`,
                            fontSize: 14,
                            outline: "none",
                            background: C.white,
                            boxSizing: "border-box",
                            resize: "vertical",
                            fontFamily: "inherit",
                            transition: "border-color 0.2s ease",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        />
                      </div>

                      <button
                        type="submit"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          padding: "13px 0",
                          background: C.accent,
                          color: C.white,
                          borderRadius: 6,
                          border: "none",
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: "pointer",
                          width: "100%",
                          transition: "background 0.3s ease",
                          marginTop: 4,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = C.accent; }}
                      >
                        <SvgSend size={16} />
                        送信する
                      </button>
                    </form>
                  )}
                </FadeIn>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
         FOOTER (outside horizontal scroll)
         ═══════════════════════════════════════════════ */}
      <footer
        style={{
          position: "relative",
          overflow: "hidden",
          background: C.bgDark,
          padding: isMobile ? "60px 20px 32px" : "80px 60px 36px",
        }}
      >
        {/* BG image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.footerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(30,41,59,1) 0%, rgba(30,41,59,0.9) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Zen Kurenaido catchphrase */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                color: "rgba(255,255,255,0.9)",
                margin: 0,
                whiteSpace: "nowrap",
                letterSpacing: "0.1em",
              }}
            >
              {footer.catchphrase}
            </p>
          </div>

          {/* Cityscape SVG */}
          <div style={{ marginBottom: 40 }}>
            <CityscapeSvg color="rgba(255,255,255,0.1)" height={50} />
          </div>

          {/* Footer info */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "center" : "flex-end",
              gap: 20,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 24,
            }}
          >
            <div style={{ textAlign: isMobile ? "center" : "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: isMobile ? "center" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: C.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="15" height="13" rx="2" />
                    <path d="M16 10h4l3 4v5h-7V10z" />
                    <circle cx="7" cy="21" r="2" />
                    <circle cx="20" cy="21" r="2" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                  {company.name}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "flex", flexDirection: "column", gap: 3 }}>
                <span>{access.address}</span>
                <span>TEL: {company.phone}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? 12 : 20,
                  justifyContent: isMobile ? "center" : "flex-end",
                }}
              >
                {navLinks.slice(0, 6).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.accent; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
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
              textAlign: "center",
              marginTop: 28,
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em",
            }}
          >
            &copy; {new Date().getFullYear()} {company.name} All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
