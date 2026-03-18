"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
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
  sectionIcons,
} from "@/data/corporateSiteData";

/* ─────────────────── helpers ─────────────────── */

const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
};

const useInView = (threshold = 0.15) => {
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
};

/* counter hook for number animations */
const useCounter = (end: number, visible: boolean, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);
  return count;
};

/* clip-path reveal animation */
const revealStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
  transition: `clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
});

const fadeUpStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});

const fadeLeftStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateX(0)" : "translateX(-30px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});

const fadeRightStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateX(0)" : "translateX(30px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});

const scaleInStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "scale(1)" : "scale(0.9)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});

/* ─────────────────── Typewriter フック ─────────────────── */
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

/* ─────────────────── fonts ─────────────────── */
const fontGothic = "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif";
const fontOswald = "'Oswald', sans-serif";
const fontBody = "'Noto Sans JP', sans-serif";
const fontSerif = "'Shippori Mincho', 'Playfair Display', serif";

/* ─────────────────── colors ─────────────────── */
const C = {
  bg: "#fafafa",
  white: "#ffffff",
  text: "#1a1a1a",
  sub: "#555555",
  accent: "#333333",
  cta: "#32373c",
  line: "#e0e0e0",
  muted: "#999999",
  light: "#f0f0f0",
};

/* service images mapping */
const serviceImages = [
  "/keikamotsu-new-templates/images/service-b2b.webp",
  "/keikamotsu-new-templates/images/service-ec.webp",
  "/keikamotsu-new-templates/images/service-route.webp",
  "/keikamotsu-new-templates/images/service-spot.webp",
];

/* history images mapping */
const historyImages: Record<string, string> = {
  "2021": "/keikamotsu-new-templates/images/history-2021.webp",
  "2022": "/keikamotsu-new-templates/images/history-2022.webp",
  "2023": "/keikamotsu-new-templates/images/history-2023.webp",
  "2024": "/keikamotsu-new-templates/images/history-2024.webp",
  "2025": "/keikamotsu-new-templates/images/history-2025.webp",
};

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════ */

function GlobalStyles() {
  return (
    <style>{`
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      @keyframes scrollLine {
        0% { transform: translateY(-100%); }
        50% { transform: translateY(0); }
        100% { transform: translateY(100%); }
      }

      @keyframes chevronBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }

      @keyframes heroTextFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes noiseAnim {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -5%); }
        20% { transform: translate(-10%, 5%); }
        30% { transform: translate(5%, -10%); }
        40% { transform: translate(-5%, 15%); }
        50% { transform: translate(-10%, 5%); }
        60% { transform: translate(15%, 0); }
        70% { transform: translate(0, 10%); }
        80% { transform: translate(-15%, 0); }
        90% { transform: translate(10%, 5%); }
        100% { transform: translate(5%, 0); }
      }

      @keyframes geoFloat1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(15px, -20px) rotate(90deg); }
        50% { transform: translate(-10px, -35px) rotate(180deg); }
        75% { transform: translate(20px, -15px) rotate(270deg); }
      }

      @keyframes geoFloat2 {
        0%, 100% { transform: translate(0, 0) rotate(45deg); }
        33% { transform: translate(-20px, 15px) rotate(135deg); }
        66% { transform: translate(15px, -25px) rotate(225deg); }
      }

      @keyframes geoFloat3 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.15; }
        50% { transform: translate(-15px, 20px) rotate(180deg); opacity: 0.25; }
      }

      @keyframes shineBtn {
        0% { left: -100%; }
        100% { left: 200%; }
      }

      @keyframes pulseBtn {
        0%, 100% { box-shadow: 0 0 0 0 rgba(50,55,60,0.3); }
        50% { box-shadow: 0 0 0 12px rgba(50,55,60,0); }
      }

      @keyframes clipRevealHeading {
        from { clip-path: inset(0 100% 0 0); }
        to { clip-path: inset(0 0 0 0); }
      }

      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

      .cp03-nav-link {
        position: relative;
        text-decoration: none;
        color: ${C.sub};
        font-size: 12px;
        letter-spacing: 0.1em;
        transition: color 0.3s;
        padding-bottom: 2px;
      }
      .cp03-nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 1px;
        background: ${C.text};
        transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .cp03-nav-link:hover::after {
        width: 100%;
      }
      .cp03-nav-link:hover {
        color: ${C.text};
      }

      .cp03-card-hover {
        transition: transform 0.4s ease, box-shadow 0.4s ease;
      }
      .cp03-card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.08);
      }

      .cp03-btn {
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: pulseBtn 3s ease-in-out infinite;
      }
      .cp03-btn:hover {
        transform: scale(1.04);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        animation: none;
      }
      .cp03-btn::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: none;
      }
      .cp03-btn:hover::after {
        animation: shineBtn 0.6s ease forwards;
      }

      .cp03-photo-frame {
        transition: transform 0.5s ease, box-shadow 0.5s ease;
        box-shadow: 4px 4px 16px rgba(0,0,0,0.06);
      }
      .cp03-photo-frame:hover {
        transform: rotate(-1deg) scale(1.02);
        box-shadow: 8px 8px 32px rgba(0,0,0,0.1);
      }

      .cp03-input-animated {
        position: relative;
        border: none;
        border-bottom: 1px solid ${C.line};
        background: transparent;
        padding: 8px 0;
        font-size: 14px;
        color: ${C.text};
        outline: none;
        width: 100%;
        transition: border-color 0.4s ease;
      }
      .cp03-input-animated:focus {
        border-bottom-color: ${C.accent};
        border-bottom-width: 2px;
      }

      .cp03-paper-texture {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════
   SECTION DIVIDER
   ═══════════════════════════════════════════════ */

function SectionDivider({ variant = "diamond" }: { variant?: "diamond" | "line" | "dots" }) {
  if (variant === "line") {
    return (
      <div style={{ textAlign: "center", padding: "0 48px" }}>
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.line}, ${C.muted}, ${C.line}, transparent)`,
          maxWidth: 600,
          margin: "0 auto",
        }} />
      </div>
    );
  }
  if (variant === "dots") {
    return (
      <div style={{ textAlign: "center", padding: "20px 0", letterSpacing: "0.5em", color: C.muted, fontSize: 10 }}>
        . . .
      </div>
    );
  }
  return (
    <div style={{
      textAlign: "center",
      padding: "16px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      maxWidth: 300,
      margin: "0 auto",
    }}>
      <div style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.line})`,
      }} />
      <span style={{ color: C.muted, fontSize: 8, lineHeight: 1 }}>&#9670;</span>
      <div style={{
        width: 40,
        height: 1,
        background: C.line,
      }} />
      <span style={{ color: C.muted, fontSize: 8, lineHeight: 1 }}>&#9670;</span>
      <div style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(270deg, transparent, ${C.line})`,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function CP03() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  /* font load */
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Oswald:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500&family=Shippori+Mincho:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  /* close menu on resize */
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <GlobalStyles />

      <div
        style={{
          fontFamily: fontBody,
          fontWeight: 300,
          color: C.text,
          background: C.bg,
          overflowX: "hidden",
          lineHeight: 1.9,
          fontSize: isMobile ? 14 : 15,
          letterSpacing: "0.04em",
        }}
      >
        {/* ───── HEADER ───── */}
        <Header
          isMobile={isMobile}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        {/* ───── HERO ───── */}
        <HeroSection isMobile={isMobile} />

        <SectionDivider variant="diamond" />

        {/* ───── SERVICES ───── */}
        <ServicesSection isMobile={isMobile} />

        <SectionDivider variant="line" />

        {/* ───── STRENGTHS ───── */}
        <StrengthsSection isMobile={isMobile} />

        <SectionDivider variant="dots" />

        {/* ───── CEO MESSAGE ───── */}
        <CeoSection isMobile={isMobile} />

        <SectionDivider variant="diamond" />

        {/* ───── COMPANY ───── */}
        <CompanySection isMobile={isMobile} />

        <SectionDivider variant="line" />

        {/* ───── HISTORY ───── */}
        <HistorySection isMobile={isMobile} />

        <SectionDivider variant="dots" />

        {/* ───── NUMBERS ───── */}
        <NumbersSection isMobile={isMobile} />

        <SectionDivider variant="diamond" />

        {/* ───── PARTNERS ───── */}
        <PartnersSection isMobile={isMobile} />

        <SectionDivider variant="line" />

        {/* ───── NEWS ───── */}
        <NewsSection isMobile={isMobile} />

        <SectionDivider variant="dots" />

        {/* ───── RECRUIT ───── */}
        <RecruitSection isMobile={isMobile} />

        <SectionDivider variant="diamond" />

        {/* ───── ACCESS ───── */}
        <AccessSection isMobile={isMobile} />

        {/* ───── CONTACT ───── */}
        <ContactSection isMobile={isMobile} />

        {/* ───── FOOTER ───── */}
        <FooterSection isMobile={isMobile} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════ */

function Header({
  isMobile,
  menuOpen,
  setMenuOpen,
}: {
  isMobile: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(250,250,250,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.line}` : "none",
        transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "16px 24px" : "20px 48px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            textDecoration: "none",
            color: scrolled ? C.text : "#fff",
            fontFamily: fontGothic,
            fontSize: isMobile ? 16 : 18,
            fontWeight: 500,
            letterSpacing: "0.15em",
            transition: "color 0.4s",
          }}
        >
          {company.name}
        </a>

        {/* Nav (desktop) */}
        {!isMobile && (
          <nav
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: `1px solid ${scrolled ? C.line : "rgba(255,255,255,0.2)"}`,
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
              transition: "border-color 0.4s",
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="cp03-nav-link"
                style={{
                  color: scrolled ? C.sub : "rgba(255,255,255,0.7)",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
            style={{
              position: "absolute",
              right: 24,
              top: 16,
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 28,
              height: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: scrolled ? C.text : "#fff",
                transition: "transform 0.3s, opacity 0.3s, background 0.4s",
                transform: menuOpen
                  ? "rotate(45deg) translateY(3.5px)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: scrolled ? C.text : "#fff",
                transition: "transform 0.3s, opacity 0.3s, background 0.4s",
                transform: menuOpen
                  ? "rotate(-45deg) translateY(-3.5px)"
                  : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(250,250,250,0.98)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            transition: "opacity 0.4s",
            zIndex: 999,
          }}
        >
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: C.text,
                fontFamily: fontGothic,
                fontSize: 16,
                letterSpacing: "0.12em",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.4s ease ${0.1 + i * 0.05}s, transform 0.4s ease ${0.1 + i * 0.05}s`,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════
   HERO - Video background with grayscale + noise
   ═══════════════════════════════════════════════ */

function HeroSection({ isMobile }: { isMobile: boolean }) {
  const iv = useInView(0.1);
  const heroTyped = useTypewriter(hero.headline, 80, 500);

  return (
    <section
      id="hero"
      ref={iv.ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/keikamotsu-new-templates/images/hero-bg.webp"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(100%) brightness(0.4)",
          zIndex: 0,
        }}
      >
        <source src="/keikamotsu-new-templates/videos/hero-daytime.mp4" type="video/mp4" />
      </video>

      {/* Noise Texture Overlay */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          zIndex: 1,
          opacity: 0.06,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          animation: "noiseAnim 0.5s steps(10) infinite",
        }}
      />

      {/* Large Background Text "LOGISTICS" */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: fontSerif,
          fontSize: isMobile ? 80 : 200,
          fontWeight: 900,
          color: "rgba(255,255,255,0.04)",
          letterSpacing: "0.15em",
          whiteSpace: "nowrap",
          zIndex: 1,
          userSelect: "none",
          animation: "heroTextFloat 8s ease-in-out infinite",
        }}
      >
        LOGISTICS
      </div>

      {/* Floating Geometric Elements */}
      <div style={{ position: "absolute", top: "15%", right: "10%", zIndex: 1, pointerEvents: "none" }}>
        <div style={{
          width: isMobile ? 30 : 60,
          height: isMobile ? 30 : 60,
          border: "1px solid rgba(255,255,255,0.12)",
          animation: "geoFloat1 12s ease-in-out infinite",
        }} />
      </div>
      <div style={{ position: "absolute", bottom: "25%", left: "8%", zIndex: 1, pointerEvents: "none" }}>
        <div style={{
          width: isMobile ? 20 : 40,
          height: isMobile ? 20 : 40,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "50%",
          animation: "geoFloat2 10s ease-in-out infinite",
        }} />
      </div>
      <div style={{ position: "absolute", top: "60%", right: "25%", zIndex: 1, pointerEvents: "none" }}>
        <div style={{
          width: 0,
          height: 0,
          borderLeft: `${isMobile ? 15 : 25}px solid transparent`,
          borderRight: `${isMobile ? 15 : 25}px solid transparent`,
          borderBottom: `${isMobile ? 26 : 43}px solid rgba(255,255,255,0.06)`,
          animation: "geoFloat3 14s ease-in-out infinite",
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: isMobile ? "120px 24px 80px" : "160px 64px 120px",
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
      }}>
        <h1
          style={{
            fontFamily: "'Zen Kurenaido', 'Shippori Mincho B1', 'Noto Sans JP', serif",
            fontSize: isMobile ? 36 : 72,
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: "0.1em",
            color: "#fff",
            margin: 0,
          }}
        >
          {heroTyped.displayed}
          {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
        </h1>

        <div
          style={{
            marginTop: isMobile ? 40 : 64,
            textAlign: "right",
            maxWidth: isMobile ? "100%" : 480,
            marginLeft: "auto",
            ...fadeUpStyle(iv.visible, 0.8),
          }}
        >
          {hero.subtext.map((s, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: isMobile ? 12 : 13,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 2,
              }}
            >
              {s}
            </p>
          ))}
        </div>
      </div>

      {/* Scroll Chevron */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 2,
          ...fadeUpStyle(iv.visible, 1.2),
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.5)",
            fontFamily: fontOswald,
          }}
        >
          SCROLL
        </span>
        <div style={{ animation: "chevronBounce 2s ease-in-out infinite" }}>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M1 1L10 10L19 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{
          width: 1,
          height: 40,
          background: "rgba(255,255,255,0.15)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1,
            height: "100%",
            background: "rgba(255,255,255,0.5)",
            animation: "scrollLine 2s ease-in-out infinite",
          }} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════ */

function ServicesSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="services"
      ref={iv.ref}
      className="cp03-paper-texture"
      style={{
        paddingTop: isMobile ? 80 : 150,
        paddingBottom: isMobile ? 60 : 100,
        maxWidth: 1100,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="Services" num="01" visible={iv.visible} icon={sectionIcons.services} />
      <h2
        style={{
          fontFamily: fontGothic,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        事業内容
      </h2>

      {services.map((s, i) => (
        <ServiceItem key={i} s={s} isMobile={isMobile} index={i} />
      ))}
    </section>
  );
}

function ServiceItem({
  s,
  isMobile,
  index,
}: {
  s: (typeof services)[0];
  isMobile: boolean;
  index: number;
}) {
  const iv = useInView();
  const imgSrc = serviceImages[index] || serviceImages[0];

  return (
    <div
      ref={iv.ref}
      style={{
        display: isMobile ? "block" : "flex",
        alignItems: "flex-start",
        gap: 48,
        padding: isMobile ? "32px 0" : "48px 0",
        borderTop: `1px solid ${C.line}`,
        ...(index === services.length - 1
          ? { borderBottom: `1px solid ${C.line}` }
          : {}),
      }}
    >
      {/* Service Image */}
      <div
        className="cp03-photo-frame"
        style={{
          flex: "0 0 240px",
          marginBottom: isMobile ? 20 : 0,
          ...(isMobile ? {} : (index % 2 === 1 ? fadeRightStyle(iv.visible, 0.1) : fadeLeftStyle(iv.visible, 0.1))),
          ...(isMobile ? fadeUpStyle(iv.visible, 0.1) : {}),
        }}
      >
        <div style={{
          width: isMobile ? "100%" : 240,
          height: isMobile ? 180 : 160,
          overflow: "hidden",
          position: "relative",
        }}>
          <img
            src={imgSrc}
            alt={s.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(60%)",
              transition: "filter 0.5s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(20%)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(60%)")}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 16 : 32, flex: 1 }}>
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: isMobile ? 48 : 72,
            fontWeight: 400,
            color: C.light,
            lineHeight: 1,
            flexShrink: 0,
            display: "block",
            marginBottom: isMobile ? 16 : 0,
            width: isMobile ? "auto" : 100,
            ...fadeUpStyle(iv.visible, 0.15),
          }}
        >
          {s.num}
        </span>
        <div style={{ flex: 1, ...fadeUpStyle(iv.visible, 0.25) }}>
          <h3
            style={{
              fontFamily: fontGothic,
              fontSize: isMobile ? 18 : 20,
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ color: C.accent, marginRight: 8 }}>&#9656;</span>{s.title}
          </h3>
          <p
            style={{
              color: C.sub,
              margin: 0,
              lineHeight: 2.0,
              whiteSpace: "pre-line",
              fontSize: isMobile ? 13 : 14,
            }}
          >
            {s.text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STRENGTHS
   ═══════════════════════════════════════════════ */

function StrengthsSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="strengths"
      style={{
        paddingTop: isMobile ? 72 : 120,
        paddingBottom: isMobile ? 64 : 110,
        background: C.white,
      }}
    >
      <div
        ref={iv.ref}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          paddingLeft: isMobile ? 24 : 48,
          paddingRight: isMobile ? 24 : 48,
        }}
      >
        <SectionLabel label="Strengths" num="02" visible={iv.visible} icon={sectionIcons.strengths} />
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          私たちの強み
        </h2>
      </div>

      {strengths.map((s, i) => (
        <StrengthItem key={i} s={s} index={i} isMobile={isMobile} />
      ))}
    </section>
  );
}

function StrengthItem({
  s,
  index,
  isMobile,
}: {
  s: (typeof strengths)[0];
  index: number;
  isMobile: boolean;
}) {
  const iv = useInView();
  const isEven = index % 2 === 1;

  return (
    <div
      ref={iv.ref}
      style={{
        display: isMobile ? "block" : "flex",
        flexDirection: isEven && !isMobile ? "row-reverse" : "row",
        alignItems: "center",
        maxWidth: 1100,
        margin: "0 auto",
        marginBottom: isMobile ? 48 : 100,
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        gap: isMobile ? 0 : 64,
      }}
    >
      {/* Image */}
      <div
        className="cp03-photo-frame"
        style={{
          flex: "0 0 48%",
          marginBottom: isMobile ? 24 : 0,
          ...(isMobile ? fadeUpStyle(iv.visible, 0.1) : (isEven ? fadeRightStyle(iv.visible, 0.1) : fadeLeftStyle(iv.visible, 0.1))),
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "66%",
            background: C.light,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={`/keikamotsu-new-templates/images/strength-0${index + 1}.webp`}
            alt={s.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(30%)",
              transition: "transform 0.6s ease, filter 0.5s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.filter = "grayscale(10%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "grayscale(30%)";
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div style={{
        flex: 1,
        ...(isMobile ? fadeUpStyle(iv.visible, 0.3) : (isEven ? fadeLeftStyle(iv.visible, 0.3) : fadeRightStyle(iv.visible, 0.3))),
      }}>
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: isMobile ? 48 : 72,
            color: C.light,
            lineHeight: 1,
            display: "block",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          {s.num}
        </span>
        <h3
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 20 : 24,
            fontWeight: 700,
            marginBottom: 20,
            letterSpacing: "0.06em",
            lineHeight: 1.5,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            color: C.sub,
            margin: 0,
            lineHeight: 2.0,
            whiteSpace: "pre-line",
            fontSize: isMobile ? 13 : 14,
          }}
        >
          {s.text}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CEO MESSAGE
   ═══════════════════════════════════════════════ */

function CeoSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="message"
      ref={iv.ref}
      className="cp03-paper-texture"
      style={{
        paddingTop: isMobile ? 56 : 100,
        paddingBottom: isMobile ? 48 : 90,
        background: C.bg,
      }}
    >
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        display: isMobile ? "block" : "flex",
        gap: 64,
        alignItems: "flex-start",
      }}>
        {/* CEO Portrait */}
        <div
          className="cp03-photo-frame"
          style={{
            flex: "0 0 240px",
            marginBottom: isMobile ? 40 : 0,
            ...scaleInStyle(iv.visible, 0.2),
          }}
        >
          <img
            src="/keikamotsu-new-templates/images/ceo-portrait.webp"
            alt={ceoMessage.name}
            style={{
              width: isMobile ? "60%" : 240,
              height: "auto",
              aspectRatio: "3/4",
              objectFit: "cover",
              filter: "grayscale(40%)",
              display: "block",
              margin: isMobile ? "0 auto" : 0,
            }}
          />
          <div style={{
            textAlign: isMobile ? "center" : "left",
            marginTop: 20,
          }}>
            <p style={{
              margin: 0,
              fontSize: 11,
              color: C.muted,
              letterSpacing: "0.1em",
            }}>
              {ceoMessage.title}
            </p>
            <p style={{
              margin: "6px 0 0",
              fontFamily: fontGothic,
              fontSize: isMobile ? 18 : 22,
              fontWeight: 500,
              letterSpacing: "0.12em",
            }}>
              {ceoMessage.name}
            </p>
          </div>
        </div>

        {/* Message Content */}
        <div style={{ flex: 1 }}>
          <SectionLabel label="Message" num="03" visible={iv.visible} icon={sectionIcons.message} />
          <h2
            style={{
              fontFamily: fontGothic,
              fontSize: isMobile ? 24 : 32,
              fontWeight: 500,
              marginBottom: isMobile ? 48 : 56,
              letterSpacing: "0.08em",
              ...revealStyle(iv.visible, 0.2),
            }}
          >
            代表メッセージ
          </h2>

          <div style={{ position: "relative" }}>
            {/* Large decorative opening quotation mark */}
            <span
              style={{
                fontFamily: fontSerif,
                fontSize: isMobile ? 120 : 200,
                color: "rgba(0,0,0,0.04)",
                position: "absolute",
                top: isMobile ? -60 : -90,
                left: isMobile ? -16 : -30,
                lineHeight: 1,
                userSelect: "none",
                ...fadeUpStyle(iv.visible, 0.2),
              }}
            >
              {"\u201C"}
            </span>

            <div
              style={{
                paddingLeft: isMobile ? 8 : 24,
                position: "relative",
                ...fadeUpStyle(iv.visible, 0.35),
              }}
            >
              {/* Pull quote - first paragraph highlighted */}
              {ceoMessage.message.map((m, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: i === 0 ? fontSerif : fontGothic,
                    fontSize: i === 0 ? (isMobile ? 17 : 20) : (isMobile ? 15 : 16),
                    lineHeight: i === 0 ? 2.4 : 2.2,
                    color: C.text,
                    marginBottom: 24,
                    fontWeight: i === 0 ? 500 : 400,
                    borderLeft: i === 0 ? `2px solid ${C.accent}` : "none",
                    paddingLeft: i === 0 ? 20 : 0,
                  }}
                >
                  {m}
                </p>
              ))}
            </div>

            {/* Large decorative closing quotation mark */}
            <span
              style={{
                fontFamily: fontSerif,
                fontSize: isMobile ? 120 : 200,
                color: "rgba(0,0,0,0.04)",
                position: "absolute",
                bottom: isMobile ? 20 : 0,
                right: isMobile ? -8 : 20,
                lineHeight: 1,
                userSelect: "none",
                ...fadeUpStyle(iv.visible, 0.4),
              }}
            >
              {"\u201D"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPANY
   ═══════════════════════════════════════════════ */

function CompanySection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="company"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 64 : 95,
        paddingBottom: isMobile ? 56 : 80,
        background: C.white,
      }}
    >
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        display: isMobile ? "block" : "flex",
        gap: 64,
        alignItems: "flex-start",
      }}>
        {/* Company Image */}
        <div
          className="cp03-photo-frame"
          style={{
            flex: "0 0 360px",
            marginBottom: isMobile ? 40 : 0,
            ...fadeLeftStyle(iv.visible, 0.2),
          }}
        >
          <img
            src="/keikamotsu-new-templates/images/company.webp"
            alt="会社外観"
            style={{
              width: "100%",
              height: isMobile ? 200 : 320,
              objectFit: "cover",
              filter: "grayscale(30%)",
              display: "block",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <SectionLabel label="Company" num="04" visible={iv.visible} icon={sectionIcons.company} />
          <h2
            style={{
              fontFamily: fontGothic,
              fontSize: isMobile ? 24 : 32,
              fontWeight: 500,
              marginBottom: isMobile ? 48 : 56,
              letterSpacing: "0.08em",
              ...revealStyle(iv.visible, 0.2),
            }}
          >
            会社概要
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              ...fadeUpStyle(iv.visible, 0.3),
            }}
          >
            <tbody>
              {companyOverview.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      fontWeight: 400,
                      fontFamily: fontGothic,
                      fontSize: isMobile ? 13 : 14,
                      color: C.sub,
                      padding: isMobile ? "16px 8px 16px 0" : "20px 24px 20px 0",
                      whiteSpace: "nowrap",
                      verticalAlign: "top",
                      width: isMobile ? 90 : 140,
                      letterSpacing: "0.06em",
                    }}
                  >
                    <span style={{ marginRight: 6 }}>&#9642;</span>{row.dt}
                  </th>
                  <td
                    style={{
                      padding: isMobile ? "16px 0" : "20px 0",
                      fontSize: isMobile ? 13 : 14,
                      color: C.text,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {typeof row.dd === "string" ? row.dd.split("\n").map((line: string, li: number) => <span key={li}>{line}{li < row.dd.split("\n").length - 1 && <br />}</span>) : row.dd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HISTORY
   ═══════════════════════════════════════════════ */

function HistorySection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="history"
      ref={iv.ref}
      className="cp03-paper-texture"
      style={{
        paddingTop: isMobile ? 48 : 80,
        paddingBottom: isMobile ? 40 : 70,
        background: C.bg,
      }}
    >
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <SectionLabel label="History" num="05" visible={iv.visible} icon={sectionIcons.history} />
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          沿革
        </h2>

        <div style={fadeUpStyle(iv.visible, 0.3)}>
          {history.map((h, i) => (
            <HistoryItem key={i} h={h} isMobile={isMobile} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HistoryItem({
  h,
  isMobile,
  index,
}: {
  h: (typeof history)[0];
  isMobile: boolean;
  index: number;
}) {
  const iv = useInView();
  const yearStr = String(h.year);
  const imgSrc = historyImages[yearStr];

  return (
    <div
      ref={iv.ref}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: isMobile ? 20 : 48,
        padding: isMobile ? "24px 0" : "36px 0",
        borderBottom:
          index < history.length - 1 ? `1px solid ${C.line}` : "none",
        ...fadeUpStyle(iv.visible, 0.15),
      }}
    >
      {/* Year */}
      <div
        style={{
          flexShrink: 0,
          width: isMobile ? 60 : 100,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: isMobile ? 28 : 40,
            fontWeight: 600,
            color: C.accent,
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          {h.year}
        </span>
      </div>

      {/* timeline dot */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: isMobile ? 10 : 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.accent,
            border: `2px solid ${C.bg}`,
            boxShadow: `0 0 0 1px ${C.accent}`,
          }}
        />
        {index < history.length - 1 && (
          <div style={{
            width: 1,
            flex: 1,
            minHeight: 30,
            background: `linear-gradient(to bottom, ${C.accent}, transparent)`,
            marginTop: 4,
          }} />
        )}
      </div>

      {/* Event + optional image */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            color: C.sub,
            fontSize: isMobile ? 13 : 15,
            lineHeight: 1.9,
            paddingTop: isMobile ? 4 : 8,
          }}
        >
          {h.event}
        </p>
        {imgSrc && (
          <div
            className="cp03-photo-frame"
            style={{
              marginTop: 16,
              width: isMobile ? "100%" : 200,
              height: isMobile ? 120 : 120,
              overflow: "hidden",
            }}
          >
            <img
              src={imgSrc}
              alt={`${h.year}年`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(50%)",
                transition: "filter 0.4s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(10%)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(50%)")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NUMBERS - with counter animation and bg image
   ═══════════════════════════════════════════════ */

function NumbersSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="numbers"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 72 : 105,
        paddingBottom: isMobile ? 56 : 90,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/keikamotsu-new-templates/images/team.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "grayscale(100%)",
        opacity: 0.08,
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: C.white,
        opacity: 0.92,
        zIndex: 0,
      }} />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          paddingLeft: isMobile ? 24 : 48,
          paddingRight: isMobile ? 24 : 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        <SectionLabel label="Numbers" num="06" visible={iv.visible} icon={sectionIcons.numbers} />
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          数字で見る実績
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "1fr 1fr 1fr 1fr",
            gap: isMobile ? 32 : 0,
            borderTop: isMobile ? "none" : `1px solid ${C.line}`,
            borderBottom: isMobile ? "none" : `1px solid ${C.line}`,
            padding: isMobile ? 0 : "48px 0",
          }}
        >
          {numbers.map((n, i) => (
            <NumberItem key={i} n={n} isMobile={isMobile} index={i} visible={iv.visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NumberItem({
  n,
  isMobile,
  index,
  visible,
}: {
  n: (typeof numbers)[0];
  isMobile: boolean;
  index: number;
  visible: boolean;
}) {
  const numericValue = parseInt(n.value.replace(/[^0-9]/g, ""), 10) || 0;
  const count = useCounter(numericValue, visible, 2000 + index * 200);
  const prefix = n.value.match(/^[^0-9]*/)?.[0] || "";

  return (
    <div
      style={{
        textAlign: "center",
        borderRight:
          !isMobile && index < numbers.length - 1
            ? `1px solid ${C.line}`
            : "none",
        ...fadeUpStyle(visible, 0.2 + index * 0.15),
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: isMobile ? 40 : 64,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {prefix}{count}
        </span>
        <span
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 14 : 16,
            color: C.sub,
            marginLeft: 4,
          }}
        >
          {n.suffix}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? 11 : 12,
          color: C.muted,
          letterSpacing: "0.1em",
        }}
      >
        {n.label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PARTNERS
   ═══════════════════════════════════════════════ */

function PartnersSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="partners"
      ref={iv.ref}
      className="cp03-paper-texture"
      style={{
        paddingTop: isMobile ? 56 : 75,
        paddingBottom: isMobile ? 48 : 65,
        background: C.bg,
      }}
    >
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <SectionLabel label="Partners" num="07" visible={iv.visible} icon={sectionIcons.partners} />
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          主要取引先
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "1fr 1fr 1fr",
            gap: isMobile ? 16 : 24,
            ...fadeUpStyle(iv.visible, 0.3),
          }}
        >
          {partners.map((p, i) => (
            <div
              key={i}
              className="cp03-card-hover"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "24px 16px" : "32px 24px",
                border: `1px solid ${C.line}`,
                textAlign: "center",
                background: C.white,
                ...scaleInStyle(iv.visible, 0.3 + i * 0.08),
              }}
            >
              <div
                style={{
                  width: isMobile ? 56 : 72,
                  height: isMobile ? 56 : 72,
                  borderRadius: "50%",
                  marginBottom: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.line}`,
                  filter: "grayscale(40%)",
                  transition: "filter 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = "grayscale(0%)"}
                onMouseLeave={(e) => e.currentTarget.style.filter = "grayscale(40%)"}
              >
                <img src={p.logo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>


              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? 12 : 13,
                  color: C.text,
                  fontFamily: fontGothic,
                  letterSpacing: "0.04em",
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 11,
                  color: C.muted,
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
}

/* ═══════════════════════════════════════════════
   NEWS - newspaper-style columns
   ═══════════════════════════════════════════════ */

function NewsSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="news"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 52 : 70,
        paddingBottom: isMobile ? 44 : 60,
        background: C.white,
      }}
    >
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <SectionLabel label="News" num="08" visible={iv.visible} icon={sectionIcons.news} />
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          お知らせ
        </h2>

        {/* Newspaper-style: 2-column on desktop */}
        <div style={{
          ...fadeUpStyle(iv.visible, 0.3),
          columnCount: isMobile ? 1 : 2,
          columnGap: 48,
          columnRule: `1px solid ${C.line}`,
        }}>
          {news.map((n, i) => (
            <a
              key={i}
              href="#"
              style={{
                display: "block",
                padding: isMobile ? "20px 0" : "20px 0",
                borderBottom: `1px solid ${C.line}`,
                textDecoration: "none",
                color: C.text,
                transition: "opacity 0.3s, transform 0.3s",
                breakInside: "avoid" as const,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span
                style={{
                  fontFamily: fontOswald,
                  fontSize: isMobile ? 11 : 12,
                  color: C.muted,
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                ─ {n.date}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 13 : 14,
                  lineHeight: 1.7,
                }}
              >
                {n.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   RECRUIT - with delivery image
   ═══════════════════════════════════════════════ */

function RecruitSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="recruit"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 80 : 130,
        paddingBottom: isMobile ? 80 : 140,
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background - delivery image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/keikamotsu-new-templates/images/delivery.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "grayscale(100%)",
        zIndex: 0,
      }} />
      {/* overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(250,250,250,0.88)", zIndex: 0 }} />

      {/* Noise overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 840, margin: "0 auto" }}>
        <SectionLabel label="Recruit" num="09" visible={iv.visible} icon={sectionIcons.recruit} />

        <div style={revealStyle(iv.visible, 0.2)}>
          <h2
            style={{
              fontFamily: fontGothic,
              fontSize: isMobile ? 20 : 28,
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: fontSerif,
                fontSize: isMobile ? 40 : 64,
                display: "block",
                lineHeight: 1.3,
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              一緒に
            </span>
            物流の未来を変えていく仲間を募集
          </h2>
        </div>

        <div style={fadeUpStyle(iv.visible, 0.4)}>
          <p
            style={{
              color: C.sub,
              whiteSpace: "pre-line",
              lineHeight: 2.2,
              marginBottom: 48,
              fontSize: isMobile ? 13 : 14,
            }}
          >
            {recruit.text}
          </p>
          <a
            href={recruit.link}
            className="cp03-btn"
            style={{
              display: "inline-block",
              padding: isMobile ? "14px 48px" : "16px 64px",
              background: C.cta,
              color: "#fff",
              textDecoration: "none",
              fontSize: 13,
              letterSpacing: "0.12em",
            }}
          >
            {recruit.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ACCESS
   ═══════════════════════════════════════════════ */

function AccessSection({ isMobile }: { isMobile: boolean }) {
  const iv = useInView(0.1);

  return (
    <section
      id="access"
      ref={iv.ref}
      style={{
        position: "relative",
        background: C.white,
      }}
    >
      {/* Full-width map */}
      <div style={{ width: "100%", height: isMobile ? 360 : 500 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.5!2d135.6283!3d34.7658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzU3LjAiTiAxMzXCsDM3JzQxLjkiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(90%)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="アクセスマップ"
        />
      </div>

      {/* Info overlay */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? 24 : 40,
          left: isMobile ? 24 : 48,
          background: "#ffffff",
          padding: isMobile ? "24px 28px" : "32px 40px",
          maxWidth: isMobile ? "calc(100% - 48px)" : 400,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          ...fadeUpStyle(iv.visible, 0.3),
        }}
      >
        <span style={{
          fontFamily: fontOswald,
          fontSize: 10,
          letterSpacing: "0.2em",
          color: C.muted,
          display: "block",
          marginBottom: 12,
        }}>
          ── Access ──
        </span>
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 18 : 22,
            fontWeight: 500,
            marginBottom: 16,
            letterSpacing: "0.08em",
          }}
        >
          {access.heading}
        </h2>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: isMobile ? 13 : 14,
            color: C.text,
          }}
        >
          {access.address}
        </p>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: isMobile ? 12 : 13,
            color: C.sub,
          }}
        >
          {access.nearestStation}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? 11 : 12,
            color: C.muted,
          }}
        >
          {access.mapNote}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════ */

function ContactSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  return (
    <section
      id="contact"
      ref={iv.ref}
      className="cp03-paper-texture"
      style={{
        paddingTop: isMobile ? 72 : 110,
        paddingBottom: isMobile ? 64 : 95,
        background: C.bg,
      }}
    >
      <div style={{
        maxWidth: 720,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}>
        <SectionLabel label="Contact" num="10" visible={iv.visible} icon={sectionIcons.contact} />
        <h2
          style={{
            fontFamily: fontGothic,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: 24,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          {contact.heading}
        </h2>
        <p
          style={{
            color: C.sub,
            whiteSpace: "pre-line",
            lineHeight: 2,
            marginBottom: isMobile ? 48 : 64,
            fontSize: isMobile ? 13 : 14,
            ...fadeUpStyle(iv.visible, 0.3),
          }}
        >
          {contact.intro}
        </p>

        {submitted ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              ...fadeUpStyle(true, 0),
            }}
          >
            <p
              style={{
                fontFamily: fontGothic,
                fontSize: isMobile ? 18 : 22,
                marginBottom: 16,
              }}
            >
              送信が完了しました
            </p>
            <p style={{ color: C.sub, fontSize: 14 }}>
              お問い合わせいただきありがとうございます。
              <br />
              担当者より折り返しご連絡いたします。
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={fadeUpStyle(iv.visible, 0.4)}
          >
            {contact.fields.map((f) => (
              <div key={f.name} style={{ marginBottom: 36 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: C.muted,
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                    fontFamily: fontGothic,
                  }}
                >
                  {f.label}
                  {f.required && (
                    <span
                      style={{
                        color: C.accent,
                        marginLeft: 4,
                        fontSize: 10,
                      }}
                    >
                      *
                    </span>
                  )}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    required={f.required}
                    rows={5}
                    className="cp03-input-animated"
                    style={{
                      fontFamily: fontBody,
                      fontWeight: 300,
                      lineHeight: 1.8,
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <input
                    type={f.type}
                    name={f.name}
                    required={f.required}
                    className="cp03-input-animated"
                    style={{
                      fontFamily: fontBody,
                      fontWeight: 300,
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: 48 }}>
              <button
                type="submit"
                className="cp03-btn"
                style={{
                  padding: isMobile ? "14px 48px" : "16px 72px",
                  background: C.cta,
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: fontBody,
                  fontWeight: 400,
                }}
              >
                送信する
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER - with background image
   ═══════════════════════════════════════════════ */

function FooterSection({ isMobile }: { isMobile: boolean }) {
  return (
    <footer
      style={{
        position: "relative",
        padding: "80px 24px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Footer background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/keikamotsu-new-templates/images/footer-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "grayscale(100%)",
        opacity: 0.06,
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        borderTop: `1px solid ${C.line}`,
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Editorial ornament */}
        <div style={{
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}>
          <div style={{ width: 40, height: 1, background: C.line }} />
          <span style={{ color: C.muted, fontSize: 8 }}>&#9670;</span>
          <div style={{ width: 40, height: 1, background: C.line }} />
        </div>

        {/* Nav links in footer */}
        {!isMobile && (
          <nav style={{
            display: "flex",
            justifyContent: "center",
            gap: 28,
            marginBottom: 32,
            flexWrap: "wrap",
          }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="cp03-nav-link"
                style={{ fontSize: 11, color: C.muted }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <p
          style={{
            fontFamily: fontGothic,
            fontSize: 14,
            letterSpacing: "0.12em",
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          {company.name}
        </p>
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: C.muted,
            letterSpacing: "0.08em",
            fontFamily: fontOswald,
          }}
        >
          &copy; {new Date().getFullYear()} {company.nameEn}
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: Section Label with editorial number
   ═══════════════════════════════════════════════ */

function SectionLabel({
  label,
  num,
  visible,
  icon,
}: {
  label: string;
  num?: string;
  visible: boolean;
  icon?: string;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "baseline",
      gap: 16,
      marginBottom: 16,
      ...fadeUpStyle(visible, 0.05),
    }}>
      {num && (
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: 40,
            fontWeight: 700,
            color: "rgba(0,0,0,0.04)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {num}
        </span>
      )}
      <span
        style={{
          fontFamily: fontOswald,
          fontSize: 11,
          letterSpacing: "0.2em",
          color: C.muted,
        }}
      >
        {icon && <span style={{ marginRight: 8, fontSize: "0.9em", opacity: 0.7 }}>{icon}</span>}── {label} ──
      </span>
    </div>
  );
}
