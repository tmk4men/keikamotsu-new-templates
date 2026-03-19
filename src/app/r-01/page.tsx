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

/* ────────────────────────────────────────
   BRIGHT (R-01) — 明るく親しみやすい物流会社採用HP
   ──────────────────────────────────────── */

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const ACCENT_LIGHT = "#3b82f6";
const BG_DARK = "#ffffff";
const BG_CARD = "#f8f9fb";
const BG_ALT = "#f0f4f8";
const TEXT_W = "#1a2b3c";
const TEXT_G = "#6b7280";
const CTA_BG = "#2563eb";
const NAVY = "#1a2b3c";
const BP = 768;

/* ─── 画像パス ─── */
const IMG = {
  strength: (n: number) => `/keikamotsu-new-templates/images/strength-0${n}.webp`,
  heroBg: "/keikamotsu-new-templates/images/hero-bg.webp",
  heroVideo: "/keikamotsu-new-templates/videos/hero-nightcity.mp4",
  jobs: "/keikamotsu-new-templates/images/jobs.webp",
  benefits: "/keikamotsu-new-templates/images/benefits.webp",
  workplace: "/keikamotsu-new-templates/images/workplace.webp",
  dailyFlow: "/keikamotsu-new-templates/images/daily-flow.webp",
  deliveryVideo: "/keikamotsu-new-templates/videos/delivery-scene.mp4",
  voices: "/keikamotsu-new-templates/images/voices.webp",
  faq: "/keikamotsu-new-templates/images/faq.webp",
  company: "/keikamotsu-new-templates/images/company.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
};

/* ─── Benefit SVG アイコン ─── */
const benefitIcons = [
  <svg key="b0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" /></svg>,
  <svg key="b1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>,
  <svg key="b2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M16 14h2" /></svg>,
  <svg key="b3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  <svg key="b4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M22 10l-10-5L2 10l10 5 10-5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg>,
  <svg key="b5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>,
];

/* ─── Typewriter フック ─── */
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

/* ─── FadeIn コンポーネント（IntersectionObserver） ─── */
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

/* ─── SVG 三角区切りコンポーネント ─── */
function TriangleDivider({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div style={{ lineHeight: 0, background: fromColor }}>
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 40, display: "block" }}
      >
        <polygon points="0,0 720,40 1440,0 1440,40 0,40" fill={toColor} />
      </svg>
    </div>
  );
}

/* ─── セクションタイトル ─── */
function SectionTitle({ label, title, num, onDark }: { label: string; title: string; num?: string; onDark?: boolean }) {
  return (
    <FadeIn>
      <div style={{ position: "relative" }}>
        {num && (
          <span
            style={{
              position: "absolute",
              top: -32,
              left: 0,
              fontSize: 110,
              fontWeight: 900,
              color: onDark ? "rgba(255,255,255,0.05)" : "rgba(26,43,60,0.04)",
              fontFamily: "'Oswald',sans-serif",
              lineHeight: 1,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {num}
          </span>
        )}
        <span
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: onDark ? "rgba(255,255,255,0.6)" : TEXT_G,
            textTransform: "uppercase",
            display: "block",
            marginBottom: "6px",
            position: "relative",
            zIndex: 1,
          }}
        >
          ─ {label} ─
        </span>
        <h2
          style={{
            fontFamily: "'Oswald','Noto Sans JP',sans-serif",
            fontWeight: 800,
            fontSize: "28px",
            lineHeight: 1.2,
            letterSpacing: "0.05em",
            color: onDark ? "#ffffff" : TEXT_W,
            position: "relative",
            zIndex: 1,
            textShadow: "none",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: "48px",
            height: "3px",
            background: `linear-gradient(to right, ${ACCENT_LIGHT}, transparent)`,
            marginTop: "12px",
            borderRadius: "2px",
          }}
        />
      </div>
    </FadeIn>
  );
}

/* ─── カウンターコンポーネント ─── */
function CounterNum({ target, style }: { target: number; style: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 1800;
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

/* ─── テキスト改行変換 ─── */
const nl2br = (text: string) =>
  text.split("\n").map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));

/* ───────────────────────────────────────
   メインコンポーネント
   ─────────────────────────────────────── */
export default function R01Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const heroTyped = useTypewriter(hero.headlineParts[0], 80, 500);

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll header
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Gallery auto rotate
  useEffect(() => {
    const iv = setInterval(() => {
      setGalleryIdx((p) => (p + 1) % gallery.images.length);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("送信が完了しました。担当者より折り返しご連絡いたします。");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background:${BG_DARK}; color:${TEXT_W}; font-family:'Noto Sans JP',sans-serif; font-weight:400; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        a { color:inherit; text-decoration:none; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.4)} 50%{box-shadow:0 0 0 12px rgba(37,99,235,0)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(2deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px) rotate(-1.5deg)} }
        @keyframes grainShift { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,-2%)} 50%{transform:translate(2%,1%)} 75%{transform:translate(-1%,2%)} }
        @keyframes scrollChevron { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(10px)} }
        @keyframes neonGlow { 0%,100%{box-shadow:0 0 8px rgba(59,130,246,0.3), inset 0 0 8px rgba(59,130,246,0.05)} 50%{box-shadow:0 0 20px rgba(59,130,246,0.5), inset 0 0 12px rgba(59,130,246,0.1)} }
        @keyframes heroFade { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes counterPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes marqueeLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes marqueeRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        @keyframes navUnderline { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes truckDrive { from{transform:translateX(-80px)} to{transform:translateX(calc(100vw + 80px))} }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:100%; height:1px; background:${ACCENT}; transform:scaleX(0); transform-origin:left; transition:transform 0.3s ease; }
        .nav-link:hover::after { transform:scaleX(1); }
      `}</style>

      {/* ===== HEADER ===== */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none",
          transition: "background 0.35s ease, border-bottom 0.35s ease, backdrop-filter 0.35s ease",
          padding: isMobile ? "12px 16px" : "14px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "'Oswald','Noto Sans JP',sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? "20px" : "24px",
            letterSpacing: "0.08em",
            color: scrolled ? TEXT_W : "#ffffff",
            transition: "color 0.35s ease",
          }}
        >
          {company.nameEn}
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link"
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  color: scrolled ? TEXT_G : "rgba(255,255,255,0.85)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? TEXT_W : "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? TEXT_G : "rgba(255,255,255,0.85)")}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                background: CTA_BG,
                color: "#ffffff",
                padding: "8px 22px",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.04em",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = ACCENT_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.background = CTA_BG)}
            >
              {company.phone}
            </a>
          </nav>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          >
            <div
              style={{
                width: "24px",
                height: "2px",
                background: scrolled ? TEXT_W : "#ffffff",
                marginBottom: "6px",
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(45deg) translate(4px,5px)" : "none",
              }}
            />
            <div
              style={{
                width: "24px",
                height: "2px",
                background: scrolled ? TEXT_W : "#ffffff",
                marginBottom: "6px",
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <div
              style={{
                width: "24px",
                height: "2px",
                background: scrolled ? TEXT_W : "#ffffff",
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(-45deg) translate(4px,-5px)" : "none",
              }}
            />
          </button>
        )}

        {/* Mobile menu */}
        {isMobile && (
          <div
            style={{
              position: "fixed",
              top: "56px",
              left: 0,
              width: "100%",
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(16px)",
              padding: "24px 20px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              borderBottom: `2px solid ${ACCENT_LIGHT}`,
              transform: menuOpen ? "translateY(0)" : "translateY(-120%)",
              opacity: menuOpen ? 1 : 0,
              transition: "transform 0.35s ease, opacity 0.35s ease",
              pointerEvents: menuOpen ? "auto" : "none",
            }}
          >
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "15px",
                  color: TEXT_G,
                  letterSpacing: "0.05em",
                  transform: menuOpen ? "translateX(0)" : "translateX(-20px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.3s ease ${i * 0.04}s, opacity 0.3s ease ${i * 0.04}s`,
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                background: CTA_BG,
                color: "#ffffff",
                padding: "12px",
                borderRadius: "4px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "15px",
                marginTop: "8px",
              }}
            >
              {company.phone}
            </a>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={IMG.heroBg}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src={IMG.heroVideo}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.6) 100%)",
          }}
        />

        {/* Noise texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            zIndex: 1,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
            animation: "grainShift 8s steps(10) infinite",
            pointerEvents: "none",
          }}
        />

        {/* Floating geometric elements */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "5%",
            width: 100,
            height: 100,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "50%",
            animation: "float1 9s ease-in-out infinite",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            right: "8%",
            width: 160,
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
            animation: "float2 7s ease-in-out infinite",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "35%",
            right: "12%",
            width: 8,
            height: 8,
            background: "rgba(255,255,255,0.12)",
            borderRadius: "50%",
            animation: "float1 11s ease-in-out infinite 3s",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: "15%",
            width: 4,
            height: 4,
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            animation: "float2 8s ease-in-out infinite 1s",
            zIndex: 1,
          }}
        />
        {/* Diamond shape */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            right: "22%",
            width: 40,
            height: 40,
            border: "1px solid rgba(255,255,255,0.04)",
            transform: "rotate(45deg)",
            animation: "float2 10s ease-in-out infinite 2s",
            zIndex: 1,
          }}
        />

        {/* Large "RECRUIT" background text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: isMobile ? "80px" : "220px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.05)",
            fontFamily: "'Oswald',sans-serif",
            letterSpacing: "0.15em",
            whiteSpace: "nowrap",
            zIndex: 1,
            pointerEvents: "none",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          RECRUIT
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "0 20px" : "0 8%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Typewriter headline */}
          <h1
            style={{
              fontFamily: "'Zen Kurenaido', 'Oswald', 'Noto Sans JP', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "30px" : "54px",
              lineHeight: 1.3,
              letterSpacing: "0.08em",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            {heroTyped.displayed}
            {!heroTyped.done && (
              <span style={{ animation: "blink 1s step-end infinite", color: ACCENT_LIGHT }}>|</span>
            )}
          </h1>
          {heroTyped.done && (
            <h1
              style={{
                fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? "28px" : "52px",
                lineHeight: 1.1,
                letterSpacing: "0.05em",
                color: "#ffffff",
                animation: "heroFade 0.9s 0.1s both",
                marginBottom: "0",
              }}
            >
              {hero.headlineParts[1]}
            </h1>
          )}

          {/* Sub text */}
          <div style={{ marginTop: "20px", animation: "heroFade 0.9s 0.8s both" }}>
            {hero.subtext.map((t, i) => (
              <p
                key={i}
                style={{
                  fontSize: isMobile ? "13px" : "15px",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.05em",
                  lineHeight: 1.8,
                }}
              >
                {t}
              </p>
            ))}
          </div>

          {/* Salary counter */}
          <div style={{ marginTop: "28px", animation: "heroFade 0.9s 1.1s both" }}>
            <span
              style={{
                fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: isMobile ? "18px" : "22px",
                letterSpacing: "0.04em",
              }}
            >
              月収
            </span>
            <CounterNum
              target={hero.salaryMin}
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: isMobile ? "64px" : "96px",
                lineHeight: 1,
              }}
            />
            <span
              style={{
                fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: isMobile ? "18px" : "22px",
              }}
            >
              万〜
            </span>
            <CounterNum
              target={hero.salaryMax}
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: isMobile ? "64px" : "96px",
                lineHeight: 1,
              }}
            />
            <span
              style={{
                fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: isMobile ? "18px" : "22px",
              }}
            >
              万円
            </span>
          </div>

          {/* Badge stagger animation */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "22px",
            }}
          >
            {hero.badges.map((b, i) => (
              <span
                key={b}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#ffffff",
                  padding: "6px 16px",
                  borderRadius: "2px",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  backdropFilter: "blur(4px)",
                  animation: `heroFade 0.6s ${1.4 + i * 0.15}s both`,
                }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "36px",
              animation: "heroFade 0.9s 2s both",
            }}
          >
            <a
              href={`tel:${company.phone}`}
              style={{
                background: CTA_BG,
                color: "#ffffff",
                padding: isMobile ? "14px 28px" : "16px 40px",
                borderRadius: "4px",
                fontWeight: 800,
                fontSize: isMobile ? "16px" : "18px",
                letterSpacing: "0.04em",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
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
                  animation: "shimmer 3s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "20px", position: "relative", zIndex: 1 }}>&#9742;</span>
              <span style={{ position: "relative", zIndex: 1 }}>{company.phone}</span>
            </a>
            <a
              href="#apply"
              style={{
                border: "2px solid #ffffff",
                color: "#ffffff",
                padding: isMobile ? "14px 28px" : "16px 40px",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: isMobile ? "14px" : "16px",
                letterSpacing: "0.04em",
                transition: "background 0.25s, color 0.25s, transform 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = NAVY;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {hero.cta}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "heroFade 0.9s 2.4s both",
          }}
        >
          <span
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            style={{ animation: "scrollChevron 2s ease-in-out infinite" }}
          >
            <path d="M8 0v18M2 14l6 6 6-6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section
        style={{
          background: "#eef2ff",
          padding: "20px 0",
          overflow: "hidden",
          borderTop: `3px solid ${ACCENT_LIGHT}`,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          position: "relative",
        }}
      >
        {/* Gradient fade edges */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 100,
            height: "100%",
            background: "linear-gradient(to right, #eef2ff, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 100,
            height: "100%",
            background: "linear-gradient(to left, #eef2ff, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {[marquee.top, marquee.bottom].map((row, ri) => (
          <div key={ri} style={{ overflow: "hidden", whiteSpace: "nowrap", marginBottom: ri === 0 ? "10px" : 0 }}>
            <div
              style={{
                display: "inline-flex",
                gap: "48px",
                animation: `${ri === 0 ? "marqueeLeft" : "marqueeRight"} ${ri === 0 ? 30 : 35}s linear infinite`,
              }}
            >
              {[...row, ...row, ...row, ...row].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                    fontWeight: 800,
                    fontSize: isMobile ? "15px" : "20px",
                    letterSpacing: "0.06em",
                    color: ACCENT,
                    paddingRight: "48px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Marquee -> Reasons divider ── */}
      <TriangleDivider fromColor={"#eef2ff"} toColor={BG_DARK} />

      {/* ===== REASONS ===== */}
      <section
        id="reasons"
        style={{
          padding: isMobile ? "60px 0 48px" : "80px 0 72px",
          background: BG_DARK,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>
          <SectionTitle label="WHY US" title="⚑ 選ばれる理由" num="01" />
        </div>

        <div
          style={{
            marginTop: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: isMobile ? "0 20px" : "0 48px",
            maxWidth: "1200px",
            margin: "48px auto 0",
          }}
        >
          {reasons.map((r, i) => (
            <FadeIn key={i} delay={i * 0.15} direction={i % 2 === 0 ? "left" : "right"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "16px" : "28px",
                  background: "#ffffff",
                  borderRadius: "6px",
                  padding: isMobile ? "28px 20px" : "36px 32px",
                  borderTop: `4px solid ${ACCENT_LIGHT}`,
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderTopWidth: "4px",
                  borderTopColor: ACCENT_LIGHT,
                  position: "relative",
                  alignItems: "stretch",
                  transition: "box-shadow 0.4s ease, transform 0.3s ease",
                  cursor: "default",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div
                  style={{
                    flex: isMobile ? "none" : "0 0 200px",
                    height: isMobile ? "180px" : "auto",
                    minHeight: isMobile ? "auto" : "160px",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={IMG.strength(i + 1)}
                    alt={r.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)" }}
                  />
                </div>
                {/* Text */}
                <div style={{ flex: 1, position: "relative" }}>
                  <span
                    style={{
                      fontFamily: "'Oswald',sans-serif",
                      fontWeight: 800,
                      fontSize: isMobile ? "56px" : "72px",
                      color: "rgba(26,43,60,0.05)",
                      position: "absolute",
                      top: "-8px",
                      right: "0",
                      lineHeight: 1,
                      pointerEvents: "none",
                    }}
                  >
                    {r.num}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                      fontWeight: 800,
                      fontSize: isMobile ? "18px" : "21px",
                      lineHeight: 1.35,
                      letterSpacing: "0.05em",
                      color: TEXT_W,
                      marginBottom: "16px",
                    }}
                  >
                    ─ {r.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, color: TEXT_G, letterSpacing: "0.05em" }}>
                    {nl2br(r.text)}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Reasons -> Jobs divider ── */}
      <TriangleDivider fromColor={BG_DARK} toColor={BG_CARD} />

      {/* ===== JOBS ===== */}
      <section
        id="jobs"
        style={{
          padding: isMobile ? "60px 20px 56px" : "80px 48px 72px",
          background: BG_CARD,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.jobs})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle label="RECRUIT" title="☰ 求人情報" num="02" />
          <FadeIn delay={0.1}>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: TEXT_G,
                marginTop: "20px",
                letterSpacing: "0.05em",
                maxWidth: "700px",
              }}
            >
              {nl2br(jobs.intro)}
            </p>
          </FadeIn>

          <div
            style={{
              marginTop: "40px",
              display: isMobile ? "block" : "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* Left: dl */}
            <FadeIn delay={0.15}>
              <dl>
                {jobs.rows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                      padding: "16px 0",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "4px" : "0",
                    }}
                  >
                    <dt
                      style={{
                        width: isMobile ? "auto" : "140px",
                        flexShrink: 0,
                        fontWeight: 700,
                        fontSize: "13px",
                        color: TEXT_W,
                        letterSpacing: "0.05em",
                      }}
                    >
                      ▪ {row.dt}
                    </dt>
                    <dd
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.7,
                        color: row.accent ? TEXT_W : TEXT_G,
                        letterSpacing: "0.05em",
                        fontWeight: row.accent ? 700 : 400,
                      }}
                    >
                      {nl2br(row.dd)}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>

            {/* Right: salary callout */}
            <FadeIn delay={0.3} direction="scale">
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  padding: isMobile ? "32px 24px" : "44px 32px",
                  textAlign: "center",
                  marginTop: isMobile ? "32px" : "0",
                  transition: "box-shadow 0.4s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                <p style={{ fontSize: "14px", color: TEXT_G, letterSpacing: "0.05em", marginBottom: "8px" }}>
                  月収目安
                </p>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, color: TEXT_W }}>
                  <CounterNum target={hero.salaryMin} style={{ fontSize: isMobile ? "56px" : "72px", lineHeight: 1, fontFamily: "'Oswald',sans-serif", fontWeight: 800, color: TEXT_W }} />
                  <span style={{ fontSize: isMobile ? "20px" : "24px", margin: "0 4px" }}>万〜</span>
                  <CounterNum target={hero.salaryMax} style={{ fontSize: isMobile ? "56px" : "72px", lineHeight: 1, fontFamily: "'Oswald',sans-serif", fontWeight: 800, color: TEXT_W }} />
                  <span style={{ fontSize: isMobile ? "20px" : "24px" }}>万円</span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: TEXT_G,
                    marginTop: "12px",
                    lineHeight: 1.7,
                    letterSpacing: "0.05em",
                  }}
                >
                  日給18,000円〜 or 個数制150〜180円/個
                </p>
                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  {jobs.requirements.map((r, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        color: TEXT_G,
                        background: "rgba(37,99,235,0.06)",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Jobs -> Benefits divider ── */}
      <TriangleDivider fromColor={BG_CARD} toColor={BG_DARK} />

      {/* ===== BENEFITS ===== */}
      <section
        id="benefits"
        style={{
          padding: isMobile ? "60px 20px 56px" : "80px 48px 72px",
          background: BG_DARK,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Parallax background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.benefits})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: isMobile ? "scroll" : "fixed",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />
        {/* Workplace overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "35%",
            height: "100%",
            backgroundImage: `url(${IMG.workplace})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.04,
            pointerEvents: "none",
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.5), transparent)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="BENEFITS" title="✓ 待遇・福利厚生" num="03" />
          <div
            style={{
              marginTop: "44px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? "16px" : "20px",
            }}
          >
            {benefits.map((b, i) => (
              <FadeIn key={i} delay={i * 0.1} direction={i % 2 === 0 ? "up" : "scale"}>
                <div
                  style={{
                    background: "#ffffff",
                    padding: isMobile ? "28px 22px" : "36px 30px",
                    borderRadius: "6px",
                    borderLeft: `3px solid ${ACCENT_LIGHT}`,
                    textAlign: "left",
                    transition: "transform 0.3s, box-shadow 0.4s",
                    cursor: "default",
                    height: "100%",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderLeftWidth: "3px",
                    borderLeftColor: ACCENT_LIGHT,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  }}
                >
                  <div style={{ color: ACCENT_LIGHT, marginBottom: "14px" }}>{benefitIcons[i]}</div>
                  <h4
                    style={{
                      fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                      fontWeight: 800,
                      fontSize: "16px",
                      lineHeight: 1.4,
                      letterSpacing: "0.05em",
                      color: TEXT_W,
                      marginBottom: "10px",
                    }}
                  >
                    {b.title}
                  </h4>
                  <p style={{ fontSize: "13px", lineHeight: 1.8, color: TEXT_G, letterSpacing: "0.05em" }}>
                    {nl2br(b.text)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits -> Daily divider ── */}
      <TriangleDivider fromColor={BG_DARK} toColor={BG_ALT} />

      {/* ===== DAILY ===== */}
      <section
        id="daily"
        style={{
          padding: isMobile ? "60px 20px 52px" : "80px 48px 72px",
          background: BG_ALT,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.dailyFlow})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle label="DAILY" title="⏱ 1日の流れ" num="04" />
          <FadeIn delay={0.1}>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: TEXT_G,
                marginTop: "16px",
                letterSpacing: "0.05em",
              }}
            >
              {nl2br(daily.intro)}
            </p>
          </FadeIn>

          <div style={{ marginTop: "44px", position: "relative", paddingLeft: isMobile ? "36px" : "48px" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: isMobile ? "14px" : "18px",
                top: "8px",
                bottom: "8px",
                width: "2px",
                background: `linear-gradient(to bottom, ${ACCENT_LIGHT}, rgba(59,130,246,0.15))`,
              }}
            />

            {daily.steps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.18} direction={i % 2 === 0 ? "left" : "right"}>
                <div
                  style={{
                    marginBottom: i < daily.steps.length - 1 ? "36px" : "48px",
                    position: "relative",
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: isMobile ? "-29px" : "-39px",
                      top: "4px",
                      width: "12px",
                      height: "12px",
                      background: i === 0 ? TEXT_W : BG_ALT,
                      border: `2px solid ${ACCENT_LIGHT}`,
                      borderRadius: "50%",
                    }}
                  />
                  <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                    <span
                      style={{
                        fontFamily: "'Oswald',sans-serif",
                        fontWeight: 700,
                        fontSize: isMobile ? "20px" : "24px",
                        color: TEXT_W,
                        letterSpacing: "0.04em",
                        minWidth: "60px",
                      }}
                    >
                      {s.time}
                    </span>
                    <h4
                      style={{
                        fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                        fontWeight: 800,
                        fontSize: isMobile ? "15px" : "17px",
                        color: TEXT_W,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {s.title}
                    </h4>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.8,
                      color: TEXT_G,
                      letterSpacing: "0.05em",
                      marginTop: "6px",
                    }}
                  >
                    {nl2br(s.desc)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Inline delivery video */}
          <FadeIn delay={0.3} direction="scale">
            <div style={{ marginTop: "16px", borderRadius: "8px", overflow: "hidden" }}>
              <video
                autoPlay
                muted
                playsInline
                style={{ width: "100%", display: "block", filter: "brightness(0.9)" }}
              >
                <source src={IMG.deliveryVideo} type="video/mp4" />
              </video>
              <p
                style={{
                  fontSize: "12px",
                  color: TEXT_G,
                  letterSpacing: "0.05em",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                実際の配達風景
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Daily -> Gallery divider ── */}
      <TriangleDivider fromColor={BG_ALT} toColor={BG_DARK} />

      {/* ===== GALLERY ===== */}
      <section
        id="gallery"
        style={{
          padding: isMobile ? "56px 0 48px" : "80px 0 70px",
          background: BG_DARK,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>
          <SectionTitle label="GALLERY" title={`⌂ ${gallery.heading}`} num="05" />
          <FadeIn delay={0.1}>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: TEXT_G,
                marginTop: "16px",
                letterSpacing: "0.05em",
              }}
            >
              {nl2br(gallery.intro)}
            </p>
          </FadeIn>
        </div>

        {/* Swipe carousel */}
        <FadeIn delay={0.2}>
          <div
            style={{ marginTop: "40px", position: "relative", overflow: "hidden" }}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const diff = touchStart - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) {
                setGalleryIdx((p) =>
                  diff > 0
                    ? (p + 1) % gallery.images.length
                    : (p - 1 + gallery.images.length) % gallery.images.length
                );
              }
            }}
          >
            <div
              style={{
                display: "flex",
                transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                transform: `translateX(calc(-${galleryIdx * (isMobile ? 85 : 60)}vw + ${isMobile ? 7.5 : 20}vw))`,
              }}
            >
              {gallery.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    flex: `0 0 ${isMobile ? "85vw" : "60vw"}`,
                    padding: "0 8px",
                    transition: "opacity 0.4s, transform 0.4s",
                    opacity: i === galleryIdx ? 1 : 0.4,
                    transform: i === galleryIdx ? "scale(1)" : "scale(0.95)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "6px",
                      overflow: "hidden",
                      aspectRatio: "16/9",
                      background: "#e5e7eb",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                        padding: "20px 16px 14px",
                      }}
                    >
                      <p style={{ fontSize: "13px", color: TEXT_G, letterSpacing: "0.05em" }}>{img.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            {!isMobile && (
              <>
                <button
                  onClick={() =>
                    setGalleryIdx((p) => (p - 1 + gallery.images.length) % gallery.images.length)
                  }
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.85)",
                    border: `1px solid ${ACCENT_LIGHT}`,
                    color: NAVY,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    zIndex: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.85)")}
                >
                  &#8249;
                </button>
                <button
                  onClick={() => setGalleryIdx((p) => (p + 1) % gallery.images.length)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.85)",
                    border: `1px solid ${ACCENT_LIGHT}`,
                    color: NAVY,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    zIndex: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.85)")}
                >
                  &#8250;
                </button>
              </>
            )}

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
              {gallery.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  style={{
                    width: i === galleryIdx ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    background: i === galleryIdx ? ACCENT : "rgba(0,0,0,0.15)",
                    transition: "width 0.3s, background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Gallery -> Voices divider ── */}
      <TriangleDivider fromColor={BG_DARK} toColor={BG_CARD} />

      {/* ===== VOICES ===== */}
      <section
        id="voices"
        style={{
          padding: isMobile ? "60px 20px 48px" : "80px 48px 72px",
          background: BG_CARD,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Section decoration image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "30%",
            height: "100%",
            backgroundImage: `url(${IMG.voices})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.04,
            pointerEvents: "none",
            maskImage: "linear-gradient(to right, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.5), transparent)",
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle label="VOICES" title={`\u301D 先輩の声`} num="06" />

          <div
            style={{
              marginTop: "44px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "20px" : "28px",
            }}
          >
            {voices.map((v, i) => (
              <FadeIn key={i} delay={i * 0.12} direction={i % 2 === 0 ? "left" : "right"}>
                <div style={{ position: "relative" }}>
                  {/* Speech bubble */}
                  <div
                    style={{
                      background: "#ffffff",
                      padding: isMobile ? "28px 22px" : "40px 36px",
                      borderRadius: i % 2 === 0 ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                      position: "relative",
                      transition: "box-shadow 0.4s, transform 0.3s",
                      cursor: "default",
                      marginBottom: "20px",
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Oswald',sans-serif",
                        fontWeight: 800,
                        fontSize: "48px",
                        color: "rgba(37,99,235,0.1)",
                        position: "absolute",
                        top: "12px",
                        left: "20px",
                        lineHeight: 1,
                        pointerEvents: "none",
                      }}
                    >
                      &ldquo;
                    </span>
                    <blockquote
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.85,
                        color: TEXT_G,
                        letterSpacing: "0.05em",
                        marginBottom: "16px",
                        paddingTop: "8px",
                      }}
                    >
                      {nl2br(v.text)}
                    </blockquote>
                    <p
                      style={{
                        display: "inline-block",
                        background: ACCENT,
                        border: "none",
                        padding: "4px 14px",
                        borderRadius: "2px",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {v.highlight}
                    </p>
                    {/* Speech bubble tail */}
                    <div style={{
                      position: "absolute",
                      bottom: -10,
                      [i % 2 === 0 ? "left" : "right"]: 28,
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderTop: "10px solid #ffffff",
                    }} />
                  </div>
                  {/* Person info below bubble */}
                  <div style={{ fontSize: "13px", color: TEXT_G, letterSpacing: "0.05em", paddingLeft: i % 2 === 0 ? "16px" : "0", paddingRight: i % 2 !== 0 ? "16px" : "0", textAlign: i % 2 === 0 ? "left" : "right" }}>
                    <span style={{ color: TEXT_W, fontWeight: 700, marginRight: "8px" }}>{v.name}</span>
                    {v.age}・{v.prev}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Voices -> FAQ divider ── */}
      <TriangleDivider fromColor={BG_CARD} toColor={BG_DARK} />

      {/* ===== FAQ ===== */}
      <section
        id="faq"
        style={{
          padding: isMobile ? "60px 20px 56px" : "80px 48px 72px",
          background: BG_DARK,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* FAQ decoration image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "25%",
            height: "60%",
            backgroundImage: `url(${IMG.faq})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.04,
            pointerEvents: "none",
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)",
          }}
        />
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle label="FAQ" title="? よくある質問" num="07" />

          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {faq.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "6px",
                      overflow: "hidden",
                      transition: "box-shadow 0.3s",
                      boxShadow: isOpen ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      style={{
                        width: "100%",
                        padding: isMobile ? "18px 16px" : "22px 28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: TEXT_W,
                        letterSpacing: "0.05em",
                        lineHeight: 1.5,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'Noto Sans JP',sans-serif",
                      }}
                    >
                      <span style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span
                          style={{
                            color: TEXT_G,
                            fontFamily: "'Oswald',sans-serif",
                            fontWeight: 700,
                            fontSize: "16px",
                            flexShrink: 0,
                          }}
                        >
                          Q.
                        </span>
                        {f.q}
                      </span>
                      <span
                        style={{
                          color: TEXT_G,
                          fontSize: "12px",
                          transition: "transform 0.3s ease",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          flexShrink: 0,
                        }}
                      >
                        &#9660;
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? "400px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div
                        style={{
                          padding: isMobile ? "0 16px 18px 42px" : "0 28px 22px 58px",
                          fontSize: "13px",
                          lineHeight: 1.85,
                          color: TEXT_G,
                          letterSpacing: "0.05em",
                        }}
                      >
                        <span
                          style={{
                            color: ACCENT_LIGHT,
                            fontFamily: "'Oswald',sans-serif",
                            fontWeight: 700,
                            marginRight: "8px",
                          }}
                        >
                          A.
                        </span>
                        {nl2br(f.a)}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ -> News divider ── */}
      <TriangleDivider fromColor={BG_DARK} toColor={BG_CARD} />

      {/* ===== NEWS ===== */}
      <section
        id="news"
        style={{
          padding: isMobile ? "52px 20px 44px" : "72px 48px 64px",
          background: BG_CARD,
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <SectionTitle label="NEWS" title={`\u2398 お知らせ`} num="08" />

          <div style={{ marginTop: "36px" }}>
            {news.map((n, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  style={{
                    display: "flex",
                    alignItems: isMobile ? "flex-start" : "center",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "6px" : "20px",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37,99,235,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    style={{
                      fontFamily: "'Oswald',sans-serif",
                      fontSize: "13px",
                      color: TEXT_G,
                      letterSpacing: "0.04em",
                      flexShrink: 0,
                    }}
                  >
                    ─ {n.date}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      padding: "2px 10px",
                      borderRadius: "2px",
                      flexShrink: 0,
                      background:
                        n.tagStyle === "urgent"
                          ? "rgba(220,50,50,0.1)"
                          : n.tagStyle === "new"
                          ? "rgba(37,99,235,0.08)"
                          : "rgba(0,0,0,0.04)",
                      color: n.tagStyle === "urgent" ? "#dc2626" : n.tagStyle === "new" ? ACCENT : TEXT_G,
                      border: `1px solid ${
                        n.tagStyle === "urgent" ? "rgba(220,50,50,0.3)" : "rgba(0,0,0,0.08)"
                      }`,
                    }}
                  >
                    {n.tag}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: TEXT_W,
                      letterSpacing: "0.05em",
                      lineHeight: 1.5,
                    }}
                  >
                    {n.title}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── News -> Access divider ── */}
      <TriangleDivider fromColor={BG_CARD} toColor={BG_DARK} />

      {/* ===== ACCESS ===== */}
      <section
        id="access"
        style={{
          padding: isMobile ? "56px 20px 48px" : "72px 48px 64px",
          background: BG_DARK,
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <SectionTitle label="ACCESS" title={`⌖ ${access.heading}`} num="09" />
          <FadeIn delay={0.1}>
            <div style={{ marginTop: "28px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: TEXT_G,
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                〒{company.postalCode} {company.address}
              </p>
              <p style={{ fontSize: "13px", color: TEXT_G, letterSpacing: "0.05em", marginBottom: "6px" }}>
                {access.nearestStation}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(0,0,0,0.4)",
                  letterSpacing: "0.05em",
                  marginBottom: "24px",
                }}
              >
                {access.mapNote}
              </p>
              <div style={{ borderRadius: "8px", overflow: "hidden", aspectRatio: isMobile ? "4/3" : "21/9" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5!2d135.6281!3d34.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzAwLjAiTiAxMzXCsDM3JzQxLjAiRQ!5e0!3m2!1sja!2sjp!4v1"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    display: "block",
                    filter: "none",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Access -> Company divider ── */}
      <TriangleDivider fromColor={BG_DARK} toColor={NAVY} />

      {/* ===== COMPANY ===== */}
      <section
        id="company"
        style={{
          padding: isMobile ? "56px 20px 44px" : "72px 48px 64px",
          background: `url(${IMG.company}) center/cover no-repeat`,
          position: "relative",
        }}
      >
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(26,43,60,0.85)" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1, color: "#ffffff" }}>
          <SectionTitle label="COMPANY" title="⌂ 会社概要" num="10" onDark />
          <FadeIn delay={0.15}>
            <dl style={{ marginTop: "36px" }}>
              {companyInfo.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                    padding: "16px 0",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "4px" : "0",
                  }}
                >
                  <dt
                    style={{
                      width: isMobile ? "auto" : "140px",
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#ffffff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {row.dt}
                  </dt>
                  <dd
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {nl2br(row.dd)}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      {/* ── Company -> Apply divider ── */}
      <TriangleDivider fromColor={NAVY} toColor={BG_DARK} />

      {/* ===== APPLY FORM ===== */}
      <section
        id="apply"
        style={{
          padding: isMobile ? "60px 20px 52px" : "80px 48px 72px",
          background: BG_DARK,
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <SectionTitle label="APPLY" title="✎ Web応募フォーム" num="11" />
          <FadeIn delay={0.15}>
            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: "36px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {[
                { key: "name" as const, label: "お名前", type: "text", required: true, placeholder: "例）山田 太郎" },
                { key: "phone" as const, label: "電話番号", type: "tel", required: true, placeholder: "例）090-1234-5678" },
                { key: "email" as const, label: "メールアドレス", type: "email", required: false, placeholder: "例）info@example.co.jp" },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: TEXT_G,
                      marginBottom: "6px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {field.label}
                    {field.required && <span style={{ color: "#e55", marginLeft: "4px" }}>*</span>}
                  </label>
                  <input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      color: TEXT_W,
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      fontFamily: "'Noto Sans JP',sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = ACCENT_LIGHT;
                      e.currentTarget.style.boxShadow = `0 0 12px rgba(37,99,235,0.15)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: TEXT_G,
                    marginBottom: "6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  メッセージ
                </label>
                <textarea
                  rows={4}
                  placeholder="例）応募を検討しています。詳しい話を聞きたいです。"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    resize: "vertical",
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "4px",
                    color: TEXT_W,
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "'Noto Sans JP',sans-serif",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = ACCENT_LIGHT;
                    e.currentTarget.style.boxShadow = `0 0 12px rgba(37,99,235,0.15)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: CTA_BG,
                  color: "#ffffff",
                  padding: "16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  fontFamily: "'Noto Sans JP',sans-serif",
                  transition: "transform 0.3s, box-shadow 0.3s, background 0.3s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
                  e.currentTarget.style.background = ACCENT_HOVER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = CTA_BG;
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
                    animation: "shimmer 3s ease-in-out infinite",
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>送信する</span>
              </button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ── Truck animation ── */}
      <div style={{ background: BG_DARK, overflow: "hidden", position: "relative", height: isMobile ? 50 : 80, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        {/* Faint cityscape */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.08, lineHeight: 0 }}>
          <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: isMobile ? 40 : 60 }}>
            <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58" stroke={TEXT_G} strokeWidth="1" />
          </svg>
        </div>
        {/* Road line */}
        <div style={{ position: "absolute", bottom: isMobile ? 6 : 12, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)` }} />
        {/* Truck SVG */}
        <div style={{ position: "absolute", left: 0, bottom: isMobile ? 8 : 14, animation: `truckDrive ${isMobile ? 8 : 12}s linear infinite` }}>
          <svg width={isMobile ? 48 : 64} height={isMobile ? 27 : 36} viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="4" width="36" height="24" rx="3" fill={ACCENT_LIGHT} opacity="0.6" />
            <rect x="36" y="12" width="22" height="16" rx="2" fill={ACCENT} opacity="0.7" />
            <circle cx="14" cy="30" r="5" fill={TEXT_G} opacity="0.5" />
            <circle cx="14" cy="30" r="2.5" fill={BG_DARK} />
            <circle cx="50" cy="30" r="5" fill={TEXT_G} opacity="0.5" />
            <circle cx="50" cy="30" r="2.5" fill={BG_DARK} />
            <rect x="40" y="16" width="8" height="6" rx="1" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
      </div>

      {/* ── Apply -> CTA divider ── */}
      <TriangleDivider fromColor={BG_DARK} toColor={NAVY} />

      {/* ===== CTA SECTION ===== */}
      <section
        style={{
          padding: isMobile ? "80px 20px 88px" : "110px 48px 120px",
          background: NAVY,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.workplace})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />
        {/* Noise overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
            animation: "grainShift 8s steps(10) infinite",
            pointerEvents: "none",
          }}
        />
        <FadeIn direction="scale">
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontFamily: "'Oswald','Noto Sans JP',sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? "20px" : "28px",
                lineHeight: 1.4,
                letterSpacing: "0.05em",
                color: "#ffffff",
                marginBottom: "20px",
                position: "relative",
                display: "inline-block",
                paddingBottom: 8,
              }}
            >
              {nl2br(cta.heading)}
              <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${ACCENT_LIGHT}, transparent)`, transformOrigin: "left", animation: "navUnderline 0.8s ease 0.5s forwards", transform: "scaleX(0)" }} />
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.05em",
                marginBottom: "32px",
              }}
            >
              {nl2br(cta.subtext)}
            </p>
            <a
              href={`tel:${cta.phone}`}
              style={{
                display: "inline-block",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? "36px" : "52px",
                color: "#ffffff",
                letterSpacing: "0.04em",
                marginBottom: "8px",
                transition: "text-shadow 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textShadow = "0 0 20px rgba(255,255,255,0.3)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
            >
              {cta.phone}
            </a>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.05em",
                marginBottom: "28px",
              }}
            >
              {company.hours}
            </p>
            <a
              href="#apply"
              style={{
                display: "inline-block",
                background: "#ffffff",
                color: NAVY,
                padding: isMobile ? "14px 36px" : "16px 52px",
                borderRadius: "4px",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.06em",
                transition: "transform 0.3s, box-shadow 0.3s, background 0.3s",
                position: "relative",
                overflow: "hidden",
                animation: "pulse 2.5s ease-in-out 2s infinite",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)";
                e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.08), transparent)",
                  animation: "shimmer 3s ease-in-out infinite 1s",
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>{cta.webLabel}</span>
            </a>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA -> Footer divider ── */}
      <TriangleDivider fromColor={NAVY} toColor={NAVY} />

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          background: NAVY,
          padding: isMobile ? "48px 20px 28px" : "60px 48px 32px",
          borderTop: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.footerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        />
        {/* Gradient top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(to right, transparent, ${ACCENT_LIGHT}, transparent)`,
          }}
        />
        <FadeIn>
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontFamily: "'Zen Kurenaido', 'Yomogi', sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? "12px" : "18px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.05em",
                marginBottom: "28px",
                lineHeight: 1.5,
                whiteSpace: "nowrap",
              }}
            >
              {footer.catchphrase}
            </p>

            <nav
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: isMobile ? "10px 16px" : "12px 28px",
                marginBottom: "32px",
              }}
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="nav-link"
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: "0.05em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
              &copy; {new Date().getFullYear()} {company.name} All rights reserved.
            </p>
          </div>
        </FadeIn>
      </footer>
    </>
  );
}
