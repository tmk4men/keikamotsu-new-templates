"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
  navLinks,
  hero,
  marquee,
  reasons,
  jobs,
  benefits,
  daily,
  gallery,
  voices,
  faq,
  news,
  companyInfo,
  cta,
  access,
  footer as footerData,
  meta,
} from "@/data/siteData";

/* ─── カラー定数（無彩色） ─── */
const C = {
  white: "#ffffff",
  bg: "#f7f8fa",
  text: "#1a1a2e",
  textSub: "#555555",
  accent: "#32373c",
  accentHover: "#3e444a",
  accentPale: "#eee",
  accentPaleBorder: "#ddd",
  cta: "#32373c",
  ctaHover: "#3e444a",
  dark: "#1a1a2e",
  border: "#e2e5ea",
};

/* ─── 影 ─── */
const shadowMain = "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)";
const shadowMainHover = "0 3px 10px rgba(0,0,0,0.07), 0 10px 28px rgba(0,0,0,0.1)";
const shadowSub = "0 1px 3px rgba(0,0,0,0.04)";
const shadowSubHover = "0 1px 5px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)";

/* ─── 画像パス ─── */
const IMG = {
  strength: (n: number) => `/keikamotsu-new-templates/images/strength-0${n}.webp`,
  workplace: "/keikamotsu-new-templates/images/workplace.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
  heroBg: "/keikamotsu-new-templates/images/hero-bg.webp",
  reasons: "/keikamotsu-new-templates/images/reasons.webp",
  jobs: "/keikamotsu-new-templates/images/jobs.webp",
  benefits: "/keikamotsu-new-templates/images/benefits.webp",
  dailyFlow: "/keikamotsu-new-templates/images/daily-flow.webp",
  voices: "/keikamotsu-new-templates/images/voices.webp",
  faq: "/keikamotsu-new-templates/images/faq.webp",
  company: "/keikamotsu-new-templates/images/company.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
};

/* ─── IntersectionObserver フック ─── */
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

/* ─── カウントアップフック ─── */
function useCountUp(target: number, visible: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return count;
}

/* ─── アニメーション スタイル ─── */
function slideUp(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(.23,1,.32,1) ${delay}s, transform 0.7s cubic-bezier(.23,1,.32,1) ${delay}s`,
  };
}

function slideLeft(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-20px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  };
}

function slideRight(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(20px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  };
}

function bounceIn(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.85)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}s`,
  };
}

function scaleIn(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(16px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.7s cubic-bezier(.34,1.3,.64,1) ${delay}s`,
  };
}

/* ─── Wave Divider コンポーネント ─── */
function WaveDivider({ from, to, flip }: { from: string; to: string; flip?: boolean }) {
  return (
    <div style={{ position: "relative", height: 60, marginTop: -1, marginBottom: -1, overflow: "hidden", background: to, transform: flip ? "scaleY(-1)" : undefined }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`wg-${from.replace('#','')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={from} stopOpacity="1" />
            <stop offset="50%" stopColor={from} stopOpacity="0.85" />
            <stop offset="100%" stopColor={from} stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d="M0,0 C360,48 720,12 1080,36 C1260,48 1380,24 1440,0 L1440,60 L0,60 Z" fill={`url(#wg-${from.replace('#','')})`} />
      </svg>
    </div>
  );
}

/* ─── BenefitアイコンSVG ─── */
const benefitIcons = [
  /* 車 */
  <svg key="b0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" /></svg>,
  /* お金 */
  <svg key="b1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>,
  /* ウォレット */
  <svg key="b2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M16 14h2" /></svg>,
  /* 時計 */
  <svg key="b3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  /* 学帽 */
  <svg key="b4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M22 10l-10-5L2 10l10 5 10-5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg>,
  /* スマホ */
  <svg key="b5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>,
];

/** テキスト内の \n を <br/> に変換 */
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

export default function R02Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const heroTyped = useTypewriter(hero.headlineParts[0], 80, 500);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* IntersectionObserver refs */
  const heroRef = useInView(0.1);
  const marqueeRef = useInView(0.1);
  const reasonsRef = useInView(0.1);
  const jobsRef = useInView(0.1);
  const benefitsRef = useInView(0.1);
  const dailyRef = useInView(0.08);
  const galleryRef = useInView(0.1);
  const voicesRef = useInView(0.1);
  const faqRef = useInView(0.1);
  const newsRef = useInView(0.1);
  const accessRef = useInView(0.1);
  const companyRef = useInView(0.1);
  const applyRef = useInView(0.1);
  const ctaRef = useInView(0.1);

  /* counter for salary */
  const salaryMinCount = useCountUp(Number(hero.salaryMin) || 30, heroRef.visible, 1400);
  const salaryMaxCount = useCountUp(Number(hero.salaryMax) || 50, heroRef.visible, 1600);

  /* Timeline animation */
  useEffect(() => {
    if (!dailyRef.visible) return;
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 2000, 1);
      setTimelineProgress(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [dailyRef.visible]);

  return (
    <>
      {/* ─── Google Fonts + Animations ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Noto Sans JP', sans-serif; color: ${C.text}; background: ${C.white}; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes floatGeo1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(12px, -18px) rotate(45deg); }
          50% { transform: translate(-8px, -30px) rotate(90deg); }
          75% { transform: translate(16px, -12px) rotate(135deg); }
        }
        @keyframes floatGeo2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-20px, 15px) rotate(-30deg); }
          66% { transform: translate(10px, -20px) rotate(30deg); }
        }
        @keyframes floatGeo3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -25px) scale(1.15); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes shineSweep {
          0% { left: -80%; }
          100% { left: 180%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(50,55,60,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(50,55,60,0); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes badgeStagger {
          from { opacity: 0; transform: translateY(10px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes navUnderline {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes underlineReveal { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes truckDrive { 0%{left:-80px} 100%{left:calc(100% + 80px)} }
        .section-heading-underline { position: relative; display: inline-block; }
        .section-heading-underline::after { content:''; position:absolute; bottom:-6px; left:0; width:100%; height:3px; background:${C.accent}; border-radius:2px; transform:scaleX(0); transform-origin:left; }
        .section-heading-underline.visible::after { animation: underlineReveal 0.8s cubic-bezier(.23,1,.32,1) forwards; }

        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: ${C.accent} !important;
          box-shadow: 0 0 0 3px ${C.accent}20;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .nav-link-drive {
          position: relative;
        }
        .nav-link-drive::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: ${C.accent};
          border-radius: 1px;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
          transform-origin: center;
        }
        .nav-link-drive:hover::after {
          transform: scaleX(1);
        }

        .btn-drive {
          position: relative;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(.34,1.3,.64,1), box-shadow 0.25s ease, background 0.2s;
        }
        .btn-drive:hover {
          transform: scale(1.04) translateY(-1px);
          box-shadow: 0 6px 20px rgba(50,55,60,0.22);
        }
        .btn-drive::after {
          content: '';
          position: absolute;
          top: 0;
          left: -80%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
        }
        .btn-drive:hover::after {
          animation: shineSweep 0.6s ease forwards;
        }

        .card-drive {
          transition: transform 0.3s cubic-bezier(.34,1.3,.64,1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-drive:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          border-color: ${C.accent} !important;
        }

        .cta-pulse {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .icon-bounce:hover svg {
          animation: iconBounce 0.5s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════
          1. HEADER
          ═══════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? `${C.white}f0` : C.white,
          backdropFilter: scrolled ? "blur(12px)" : undefined,
          WebkitBackdropFilter: scrolled ? "blur(12px)" : undefined,
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "border-color 0.3s, background 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ロゴ */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "0.5rem",
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              GL
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: C.text,
                  lineHeight: 1.2,
                }}
              >
                {company.nameEn}
              </div>
              <div style={{ fontSize: 10, color: C.textSub, lineHeight: 1.2 }}>
                採用情報
              </div>
            </div>
          </div>

          {/* デスクトップナビ */}
          <nav
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            <style>{`
              @media (max-width: 768px) {
                .desktop-nav { display: none !important; }
              }
            `}</style>
            {navLinks.slice(0, 6).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link-drive"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textSub,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textSub)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#apply"
              className="btn-drive"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.white,
                background: C.accent,
                padding: "8px 20px",
                borderRadius: 50,
              }}
            >
              応募する
            </a>
          </nav>

          {/* ハンバーガー */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
            className="hamburger-btn"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            <style>{`
              @media (max-width: 768px) {
                .hamburger-btn { display: flex !important; flex-direction: column; gap: 5px; }
              }
            `}</style>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: C.text,
                  borderRadius: 2,
                  transition: "transform 0.3s, opacity 0.3s",
                  ...(menuOpen && i === 0
                    ? { transform: "translateY(7px) rotate(45deg)" }
                    : {}),
                  ...(menuOpen && i === 1 ? { opacity: 0 } : {}),
                  ...(menuOpen && i === 2
                    ? { transform: "translateY(-7px) rotate(-45deg)" }
                    : {}),
                }}
              />
            ))}
          </button>
        </div>

        {/* モバイルメニュー */}
        {menuOpen && (
          <div
            style={{
              background: C.white,
              borderTop: `1px solid ${C.border}`,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 15, fontWeight: 500, color: C.text }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#apply"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: C.white,
                background: C.accent,
                padding: "12px 0",
                borderRadius: 50,
                textAlign: "center",
              }}
            >
              応募する
            </a>
          </div>
        )}
      </header>

      <main>
        {/* ═══════════════════════════════════
            2. HERO
            ═══════════════════════════════════ */}
        <section
          ref={heroRef.ref}
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            paddingTop: 68,
          }}
        >
          {/* 背景動画 */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={IMG.heroBg}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/keikamotsu-new-templates/videos/hero-bright.mp4" type="video/mp4" />
          </video>
          {/* 明るいオーバーレイ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(245,245,245,0.85) 100%)",
            }}
          />

          {/* Floating geometric elements */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden",
          }}>
            {/* Circle */}
            <div style={{
              position: "absolute", top: "15%", right: "12%",
              width: 80, height: 80, borderRadius: "50%",
              border: `3px solid ${C.accent}15`,
              animation: "floatGeo1 8s ease-in-out infinite",
            }} />
            {/* Square */}
            <div style={{
              position: "absolute", top: "55%", right: "8%",
              width: 50, height: 50, borderRadius: 8,
              background: `${C.accent}08`,
              border: `2px solid ${C.accent}12`,
              animation: "floatGeo2 10s ease-in-out infinite",
            }} />
            {/* Triangle */}
            <div style={{
              position: "absolute", top: "30%", right: "25%",
              width: 0, height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderBottom: `35px solid ${C.accent}10`,
              animation: "floatGeo3 7s ease-in-out infinite",
            }} />
            {/* Small dots */}
            {[
              { top: "20%", left: "8%", size: 12, delay: "0s" },
              { top: "70%", left: "5%", size: 8, delay: "2s" },
              { top: "80%", right: "15%", size: 10, delay: "4s" },
              { top: "40%", left: "15%", size: 6, delay: "1s" },
            ].map((dot, i) => (
              <div key={i} style={{
                position: "absolute",
                top: dot.top,
                left: (dot as any).left,
                right: (dot as any).right,
                width: dot.size,
                height: dot.size,
                borderRadius: "50%",
                background: `${C.accent}18`,
                animation: `floatGeo${(i % 3) + 1} ${6 + i * 2}s ease-in-out infinite`,
                animationDelay: dot.delay,
              }} />
            ))}
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 1200,
              margin: "0 auto",
              padding: "60px 24px 80px",
              width: "100%",
            }}
          >
            {/* バッジ with stagger */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 28,
              }}
            >
              {hero.badges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    background: C.accentPale,
                    color: C.accent,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "6px 18px",
                    borderRadius: 50,
                    border: `1px solid ${C.accentPaleBorder}`,
                    opacity: heroLoaded ? 1 : 0,
                    transform: heroLoaded ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
                    transition: `opacity 0.5s cubic-bezier(.34,1.56,.64,1) ${0.2 + i * 0.1}s, transform 0.5s cubic-bezier(.34,1.56,.64,1) ${0.2 + i * 0.1}s`,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            {/* キャッチコピー with typewriter */}
            <h1
              style={{
                fontFamily: "'Yomogi', 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 5vw, 52px)",
                lineHeight: 1.5,
                color: C.text,
                marginBottom: 4,
              }}
            >
              {heroTyped.displayed}
              {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
            </h1>
            {heroTyped.done && (
              <h1
                style={{
                  fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 5vw, 52px)",
                  lineHeight: 1.3,
                  color: C.text,
                  marginBottom: 24,
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.97)",
                  transition: "opacity 0.7s cubic-bezier(.34,1.56,.64,1) 0.15s, transform 0.7s cubic-bezier(.34,1.56,.64,1) 0.15s",
                }}
              >
                {hero.headlineParts[1]}
              </h1>
            )}

            {/* サブテキスト */}
            <div style={{
              marginBottom: 32,
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
            }}>
              {hero.subtext.map((t, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(14px, 2vw, 16px)",
                    color: C.textSub,
                    lineHeight: 1.9,
                  }}
                >
                  {nl2br(t)}
                </p>
              ))}
            </div>

            {/* 月収 with gradient text and counter */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 6,
                marginBottom: 36,
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.6s cubic-bezier(.34,1.56,.64,1) 0.65s, transform 0.7s cubic-bezier(.34,1.56,.64,1) 0.65s",
              }}
            >
              <span style={{ fontSize: 15, color: C.textSub, fontWeight: 500 }}>
                月収
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(48px, 8vw, 72px)",
                  background: `linear-gradient(135deg, ${C.text} 0%, ${C.accent} 50%, #5a6068 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                {salaryMinCount}
              </span>
              <span style={{ fontSize: 20, color: C.textSub, fontWeight: 500 }}>
                万〜
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(48px, 8vw, 72px)",
                  background: `linear-gradient(135deg, ${C.text} 0%, ${C.accent} 50%, #5a6068 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                {salaryMaxCount}
              </span>
              <span style={{ fontSize: 20, color: C.textSub, fontWeight: 500 }}>
                万円
              </span>
            </div>

            {/* CTA */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s",
              }}
            >
              <a
                href="#apply"
                className="btn-drive cta-pulse"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accent,
                  color: C.white,
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "16px 36px",
                  borderRadius: 50,
                }}
              >
                {hero.cta}
                <span style={{ fontSize: 20 }}>→</span>
              </a>
              <a
                href={`tel:${company.phone.replace(/-/g, "")}`}
                className="btn-drive"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  color: C.text,
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "16px 32px",
                  borderRadius: 50,
                  border: `2px solid ${C.text}`,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                {company.phone}
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: heroLoaded ? 0.6 : 0,
            transition: "opacity 1s ease 1.2s",
          }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.textSub,
              fontFamily: "'DM Sans', sans-serif",
            }}>Scroll</span>
            <div style={{
              width: 24,
              height: 40,
              borderRadius: 12,
              border: `2px solid ${C.accent}40`,
              position: "relative",
            }}>
              <div style={{
                width: 4,
                height: 8,
                borderRadius: 2,
                background: C.accent,
                position: "absolute",
                top: 6,
                left: "50%",
                marginLeft: -2,
                animation: "scrollBounce 1.8s ease-in-out infinite",
              }} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            3. MARQUEE
            ═══════════════════════════════════ */}
        <section
          ref={marqueeRef.ref}
          style={{
            background: C.accent,
            padding: "14px 0",
            overflow: "hidden",
            position: "relative",
            ...slideUp(marqueeRef.visible),
          }}
        >
          {/* Gradient fade edges */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 80,
            background: `linear-gradient(to right, ${C.accent}, transparent)`,
            zIndex: 2, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
            background: `linear-gradient(to left, ${C.accent}, transparent)`,
            zIndex: 2, pointerEvents: "none",
          }} />

          {[marquee.top, marquee.bottom].map((row, ri) => (
            <div
              key={ri}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                marginBottom: ri === 0 ? 6 : 0,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  gap: 48,
                  animation: `marqueeScroll ${28 + ri * 6}s linear infinite`,
                  animationDirection: ri === 1 ? "reverse" : "normal",
                }}
              >
                {[...row, ...row, ...row, ...row].map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      color: C.white,
                      fontSize: 14,
                      fontWeight: 700,
                      paddingRight: 48,
                      opacity: 0.95,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Wave: accent -> white */}
        <WaveDivider from={C.accent} to={C.white} />

        {/* ═══════════════════════════════════
            4. REASONS
            ═══════════════════════════════════ */}
        <section
          id="reasons"
          ref={reasonsRef.ref}
          style={{
            background: C.white,
            position: "relative",
          }}
        >
          {/* Section background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.reasons})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.03, pointerEvents: "none",
          }} />

          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 24px 60px",
            position: "relative",
            zIndex: 1,
          }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(reasonsRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Why Choose Us ─
              </p>
              <h2
                className={`section-heading-underline${reasonsRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                ⚑ 選ばれる<span style={{ color: C.accent }}>3つ</span>の理由
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="card-drive"
                  style={{
                    display: "flex",
                    gap: 24,
                    background: C.white,
                    borderRadius: "0.75rem",
                    padding: "36px 32px",
                    boxShadow: shadowMain,
                    border: `1px solid ${C.border}`,
                    cursor: "default",
                    ...scaleIn(reasonsRef.visible, 0.1 + i * 0.15),
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(40px, 5vw, 56px)",
                      color: `${C.accent}18`,
                      lineHeight: 1,
                      minWidth: 70,
                      flexShrink: 0,
                    }}
                  >
                    {r.num}
                  </div>
                  {/* 画像 */}
                  <div style={{
                    flex: "0 0 180px",
                    height: 140,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    <img
                      src={IMG.strength(i + 1)}
                      alt={r.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3
                      style={{
                        fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(18px, 2.5vw, 22px)",
                        color: C.text,
                        marginBottom: 10,
                      }}
                    >
                      ─ {r.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        color: C.textSub,
                        lineHeight: 1.85,
                      }}
                    >
                      {nl2br(r.text)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave: white -> bg */}
        <WaveDivider from={C.white} to={C.bg} />

        {/* ═══════════════════════════════════
            5. JOBS
            ═══════════════════════════════════ */}
        <section
          id="jobs"
          ref={jobsRef.ref}
          style={{
            background: C.bg,
            padding: "60px 24px 90px",
            position: "relative",
          }}
        >
          {/* Section background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.jobs})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.03, pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(jobsRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Recruit ─
              </p>
              <h2
                className={`section-heading-underline${jobsRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                ☰ 求人情報
              </h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8 }}>
                {nl2br(jobs.intro)}
              </p>
            </div>

            <div
              className="card-drive"
              style={{
                background: C.white,
                borderRadius: "1.25rem",
                boxShadow: shadowMain,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                ...slideUp(jobsRef.visible, 0.15),
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {jobs.rows.map((row, i) => (
                    <tr key={i}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "16px 20px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.text,
                          background: row.accent ? `${C.accent}10` : "transparent",
                          borderBottom: `1px solid ${C.border}`,
                          width: "28%",
                          verticalAlign: "top",
                        }}
                      >
                        ▪ {row.dt}
                      </th>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 14,
                          color: row.accent ? C.text : C.textSub,
                          fontWeight: row.accent ? 700 : 400,
                          background: row.accent ? `${C.accent}10` : "transparent",
                          borderBottom: `1px solid ${C.border}`,
                          lineHeight: 1.7,
                        }}
                      >
                        {nl2br(row.dd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 応募資格 */}
              <div style={{ padding: "24px 20px 28px" }}>
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 12,
                  }}
                >
                  応募資格
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {jobs.requirements.map((req, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        background: C.accentPale,
                        color: C.accent,
                        fontSize: 13,
                        fontWeight: 500,
                        padding: "6px 16px",
                        borderRadius: 50,
                      }}
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave: bg -> white */}
        <WaveDivider from={C.bg} to={C.white} />

        {/* ═══════════════════════════════════
            6. BENEFITS
            ═══════════════════════════════════ */}
        <section
          id="benefits"
          ref={benefitsRef.ref}
          style={{
            background: C.white,
            position: "relative",
          }}
        >
          {/* 背景画像 */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.benefits})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.04, pointerEvents: "none",
          }} />
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 24px 88px",
            position: "relative",
            zIndex: 1,
          }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(benefitsRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Benefits ─
              </p>
              <h2
                className={`section-heading-underline${benefitsRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                ✓ 待遇・福利厚生
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.85fr 1.05fr",
                gap: 24,
              }}
              className="benefits-grid"
            >
              <style>{`
                @media (max-width: 768px) {
                  .benefits-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="card-drive icon-bounce"
                  style={{
                    background: C.white,
                    borderRadius: "0.75rem",
                    padding: "32px 24px",
                    boxShadow: shadowSub,
                    border: `1px solid ${C.border}`,
                    ...scaleIn(benefitsRef.visible, 0.08 * i),
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: C.accentPale,
                      color: C.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                      transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
                    }}
                  >
                    {benefitIcons[i]}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: C.text,
                      marginBottom: 8,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textSub,
                      lineHeight: 1.8,
                    }}
                  >
                    {nl2br(b.text)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave: white -> bg */}
        <WaveDivider from={C.white} to={C.bg} />

        {/* ═══════════════════════════════════
            7. DAILY
            ═══════════════════════════════════ */}
        <section
          id="daily"
          ref={dailyRef.ref}
          style={{
            background: C.bg,
            padding: "60px 24px 80px",
            position: "relative",
          }}
        >
          {/* Section background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.dailyFlow})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.03, pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(dailyRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Daily Schedule ─
              </p>
              <h2
                className={`section-heading-underline${dailyRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                ⏱ 1日の流れ
              </h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
                {nl2br(daily.intro)}
              </p>
            </div>

            {/* 水平タイムライン with animated line */}
            <div
              style={{
                position: "relative",
                overflowX: "auto",
                paddingBottom: 16,
              }}
            >
              {/* Animated connecting line */}
              <div
                className="timeline-line"
                style={{
                  position: "absolute",
                  top: 28,
                  left: 40,
                  right: 40,
                  height: 3,
                  background: `${C.accent}15`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${C.accent}, ${C.accent}80)`,
                  borderRadius: 2,
                  width: `${timelineProgress * 100}%`,
                  transition: "width 0.05s linear",
                }} />
              </div>
              <style>{`
                @media (max-width: 768px) {
                  .timeline-line { display: none !important; }
                  .timeline-h { flex-direction: column !important; }
                  .timeline-step { min-width: auto !important; flex: none !important; width: 100% !important; }
                }
              `}</style>

              <div
                className="timeline-h"
                style={{
                  display: "flex",
                  gap: 0,
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                {daily.steps.map((s, i) => (
                  <div
                    key={i}
                    className="timeline-step"
                    style={{
                      flex: 1,
                      minWidth: 150,
                      textAlign: "center",
                      position: "relative",
                      ...bounceIn(dailyRef.visible, 0.25 + i * 0.2),
                    }}
                  >
                    {/* ドット with pulse on appear */}
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: C.accent,
                        border: `3px solid ${C.white}`,
                        boxShadow: `0 0 0 3px ${C.accent}40`,
                        margin: "0 auto 18px",
                        position: "relative",
                        zIndex: 2,
                        transform: dailyRef.visible ? "scale(1)" : "scale(0)",
                        transition: `transform 0.6s cubic-bezier(.34,1.56,.64,1) ${0.4 + i * 0.2}s`,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 22,
                        color: C.text,
                        marginBottom: 6,
                      }}
                    >
                      {s.time}
                    </div>
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.text,
                        marginBottom: 8,
                      }}
                    >
                      {s.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 13,
                        color: C.textSub,
                        lineHeight: 1.7,
                        padding: "0 8px",
                      }}
                    >
                      {nl2br(s.desc)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline delivery scene video */}
            <div style={{
              marginTop: 48,
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: shadowMain,
              maxWidth: 700,
              margin: "48px auto 0",
              ...slideUp(dailyRef.visible, 0.6),
            }}>
              <video
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  display: "block",
                }}
              >
                <source src="/keikamotsu-new-templates/videos/delivery-scene.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* Wave: bg -> white */}
        <WaveDivider from={C.bg} to={C.white} />

        {/* ═══════════════════════════════════
            8. GALLERY
            ═══════════════════════════════════ */}
        <section
          id="gallery"
          ref={galleryRef.ref}
          style={{
            background: C.white,
            padding: "60px 24px 70px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(galleryRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Workplace ─
              </p>
              <h2
                className={`section-heading-underline${galleryRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                {"⌂ "}{gallery.heading}
              </h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8 }}>
                {nl2br(gallery.intro)}
              </p>
            </div>

            {/* Stylish overlapping gallery */}
            <div
              className="gallery-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 0.85fr 1.15fr",
                gridTemplateRows: "220px 200px",
                gap: 14,
                ...slideUp(galleryRef.visible, 0.15),
              }}
            >
              <style>{`
                @media (max-width: 768px) {
                  .gallery-grid {
                    grid-template-columns: 1fr !important;
                    grid-template-rows: auto !important;
                  }
                  .gallery-grid > div { transform: none !important; margin: 0 !important; }
                }
                .gallery-item { transition: transform 0.4s cubic-bezier(.34,1.3,.64,1), box-shadow 0.4s ease !important; }
                .gallery-item:hover { transform: rotate(0deg) scale(1.04) !important; box-shadow: 0 12px 36px rgba(0,0,0,0.18) !important; z-index: 5 !important; }
              `}</style>
              {gallery.images.map((img, i) => {
                const rotations = [-2, 1.5, -1, 2, -1.5];
                const spans: React.CSSProperties[] = [
                  { gridRow: "span 2", marginRight: -8 },
                  { marginTop: 12 },
                  { marginLeft: -6 },
                  { marginTop: -10, marginRight: -4 },
                  { marginLeft: -8, marginTop: 8 },
                ];
                return (
                  <div
                    key={i}
                    className="gallery-item"
                    style={{
                      position: "relative",
                      borderRadius: i === 0 ? "1.25rem" : "0.75rem",
                      overflow: "hidden",
                      cursor: "pointer",
                      transform: `rotate(${rotations[i]}deg)`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                      zIndex: i === 0 ? 3 : 1,
                      ...spans[i],
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
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* ホバーオーバーレイ+キャプション */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: 16,
                        opacity: 0,
                        transition: "opacity 0.35s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    >
                      <p style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>
                        {img.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wave: white -> bg */}
        <WaveDivider from={C.white} to={C.bg} />

        {/* ═══════════════════════════════════
            9. VOICES - Speech bubble design
            ═══════════════════════════════════ */}
        <section
          id="voices"
          ref={voicesRef.ref}
          style={{
            background: C.bg,
            padding: "60px 24px 75px",
            position: "relative",
          }}
        >
          {/* Section background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.voices})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.03, pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(voicesRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Voices ─
              </p>
              <h2
                className={`section-heading-underline${voicesRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                {"\u301D "}先輩ドライバーの声
              </h2>
            </div>

            <div
              className="voices-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr",
                gap: 24,
              }}
            >
              <style>{`
                @media (max-width: 768px) {
                  .voices-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>
              {voices.map((v, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    ...bounceIn(voicesRef.visible, 0.1 + i * 0.12),
                  }}
                >
                  {/* Speech bubble card */}
                  <div
                    className="card-drive"
                    style={{
                      background: C.white,
                      borderRadius: "1rem",
                      padding: "28px 24px 24px",
                      boxShadow: shadowSub,
                      border: `1px solid ${C.border}`,
                      position: "relative",
                      marginBottom: 16,
                    }}
                  >
                    {/* Large quote */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 18,
                        fontFamily: "'DM Sans', serif",
                        fontSize: 72,
                        lineHeight: 1,
                        color: `${C.accent}12`,
                        fontWeight: 700,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      &ldquo;
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p
                        style={{
                          fontSize: 14,
                          color: C.textSub,
                          lineHeight: 1.85,
                          marginBottom: 14,
                          paddingTop: 4,
                        }}
                      >
                        {nl2br(v.text)}
                      </p>

                      <div
                        style={{
                          display: "inline-block",
                          background: C.accentPale,
                          color: C.accent,
                          fontSize: 13,
                          fontWeight: 700,
                          padding: "5px 14px",
                          borderRadius: "0.5rem",
                        }}
                      >
                        {v.highlight}
                      </div>
                    </div>

                    {/* Speech bubble tail */}
                    <div style={{
                      position: "absolute",
                      bottom: -10,
                      left: 32,
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderTop: `10px solid ${C.white}`,
                      filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.04))",
                    }} />
                  </div>

                  {/* Person info below bubble */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      paddingLeft: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: C.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                        {v.name}
                        <span style={{ fontWeight: 400, fontSize: 13, color: C.textSub, marginLeft: 8 }}>
                          {v.age}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{v.prev}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave: bg -> white */}
        <WaveDivider from={C.bg} to={C.white} />

        {/* ═══════════════════════════════════
            10. FAQ - Smooth controlled accordion
            ═══════════════════════════════════ */}
        <section
          id="faq"
          ref={faqRef.ref}
          style={{
            background: C.white,
            position: "relative",
          }}
        >
          {/* Section background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.faq})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.03, pointerEvents: "none",
          }} />

          <div style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "60px 24px 85px",
            position: "relative",
            zIndex: 1,
          }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(faqRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ FAQ ─
              </p>
              <h2
                className={`section-heading-underline${faqRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                ? よくある質問
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faq.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="card-drive"
                    style={{
                      background: C.white,
                      borderRadius: "0.75rem",
                      boxShadow: shadowSub,
                      border: `1px solid ${isOpen ? C.accent : C.border}`,
                      overflow: "hidden",
                      ...scaleIn(faqRef.visible, 0.05 * i),
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                        padding: "20px 24px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${C.accent}05`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 16,
                            color: C.accent,
                            flexShrink: 0,
                          }}
                        >
                          Q.
                        </span>
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: C.text,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.q}
                        </span>
                      </div>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: isOpen ? C.accent : C.accentPale,
                          color: isOpen ? C.white : C.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          fontWeight: 500,
                          flexShrink: 0,
                          transition: "background 0.3s, color 0.3s, transform 0.4s cubic-bezier(.34,1.56,.64,1)",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          lineHeight: 1,
                        }}
                      >
                        +
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? 400 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.5s cubic-bezier(.23,1,.32,1)",
                      }}
                    >
                      <div
                        style={{
                          padding: "0 24px 20px 54px",
                          fontSize: 14,
                          color: C.textSub,
                          lineHeight: 1.85,
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? "translateY(0)" : "translateY(-8px)",
                          transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
                        }}
                      >
                        {nl2br(item.a)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wave: white -> bg */}
        <WaveDivider from={C.white} to={C.bg} />

        {/* ═══════════════════════════════════
            11. NEWS
            ═══════════════════════════════════ */}
        <section
          id="news"
          ref={newsRef.ref}
          style={{
            background: C.bg,
            padding: "60px 24px 65px",
          }}
        >
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(newsRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ News ─
              </p>
              <h2
                className={`section-heading-underline${newsRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                {"\u2398 "}お知らせ
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {news.map((n, i) => {
                const tagColors: Record<string, { bg: string; color: string }> = {
                  urgent: { bg: "#fee2e2", color: "#dc2626" },
                  new: { bg: C.accentPale, color: C.accent },
                  default: { bg: "#f3f4f6", color: C.textSub },
                };
                const tc = tagColors[n.tagStyle] || tagColors.default;
                return (
                  <div
                    key={i}
                    className="card-drive"
                    style={{
                      background: C.white,
                      borderRadius: "0.75rem",
                      padding: "20px 24px",
                      boxShadow: shadowSub,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                      ...slideLeft(newsRef.visible, 0.08 * i),
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: C.textSub,
                        flexShrink: 0,
                      }}
                    >
                      ─ {n.date}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        background: tc.bg,
                        color: tc.color,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 12px",
                        borderRadius: 50,
                        flexShrink: 0,
                      }}
                    >
                      {n.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: C.text,
                        fontWeight: 500,
                      }}
                    >
                      {n.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wave: bg -> accent */}
        <WaveDivider from={C.bg} to={C.accent} />

        {/* ═══════════════════════════════════
            12. ACCESS
            ═══════════════════════════════════ */}
        <section
          id="access"
          ref={accessRef.ref}
          style={{
            background: C.accent,
            padding: "60px 24px 76px",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(accessRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: `${C.white}aa`,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Access ─
              </p>
              <h2
                className={`section-heading-underline${accessRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.white,
                }}
              >
                {"⌖ "}{access.heading}
              </h2>
            </div>

            <div
              style={{
                background: C.white,
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                ...slideUp(accessRef.visible, 0.15),
              }}
            >
              <div
                className="access-inner"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 0.9fr",
                }}
              >
                <style>{`
                  @media (max-width: 768px) {
                    .access-inner { grid-template-columns: 1fr !important; }
                  }
                `}</style>
                <div style={{ padding: "36px 32px" }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: C.text,
                      marginBottom: 20,
                    }}
                  >
                    {company.name}
                  </h3>
                  <div style={{ fontSize: 14, color: C.textSub, lineHeight: 2.2 }}>
                    <p>
                      <span style={{ fontWeight: 600, color: C.text }}>住所</span>
                      <br />
                      〒{company.postalCode} {company.address}
                    </p>
                    <p style={{ marginTop: 8 }}>
                      <span style={{ fontWeight: 600, color: C.text }}>最寄り駅</span>
                      <br />
                      {access.nearestStation}
                    </p>
                    <p style={{ marginTop: 8 }}>
                      <span style={{ fontWeight: 600, color: C.text }}>電話番号</span>
                      <br />
                      {company.phone}（{company.hours}）
                    </p>
                    <p
                      style={{
                        marginTop: 16,
                        fontSize: 13,
                        color: C.accent,
                        fontWeight: 500,
                      }}
                    >
                      {access.mapNote}
                    </p>
                  </div>
                </div>
                <div style={{ minHeight: 300 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.8!2d135.63!3d34.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzEyLjAiTiAxMzXCsDM3JzQ4LjAiRQ!5e0!3m2!1sja!2sjp!4v1"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: 300,
                      border: 0,
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="アクセスマップ"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave: accent -> white */}
        <WaveDivider from={C.accent} to={C.white} />

        {/* ═══════════════════════════════════
            13. COMPANY
            ═══════════════════════════════════ */}
        <section
          id="company"
          ref={companyRef.ref}
          style={{
            background: C.white,
            position: "relative",
          }}
        >
          {/* Section background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.company})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.03, pointerEvents: "none",
          }} />

          <div style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "60px 24px 72px",
            position: "relative",
            zIndex: 1,
          }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(companyRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Company ─
              </p>
              <h2
                className={`section-heading-underline${companyRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                ⌂ 会社概要
              </h2>
            </div>

            <div
              className="card-drive"
              style={{
                background: C.white,
                borderRadius: "1.25rem",
                boxShadow: shadowMain,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                ...slideUp(companyRef.visible, 0.12),
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {companyInfo.map((row, i) => (
                    <tr key={i}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "18px 24px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.text,
                          background: C.bg,
                          borderBottom: `1px solid ${C.border}`,
                          width: "30%",
                          verticalAlign: "top",
                        }}
                      >
                        {row.dt}
                      </th>
                      <td
                        style={{
                          padding: "18px 24px",
                          fontSize: 14,
                          color: C.textSub,
                          borderBottom: `1px solid ${C.border}`,
                          lineHeight: 1.7,
                        }}
                      >
                        {nl2br(row.dd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Wave: white -> bg */}
        <WaveDivider from={C.white} to={C.bg} />

        {/* ═══════════════════════════════════
            14. APPLY FORM
            ═══════════════════════════════════ */}
        <section
          id="apply"
          ref={applyRef.ref}
          style={{
            background: C.bg,
            padding: "60px 24px 78px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(applyRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textSub,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ─ Entry ─
              </p>
              <h2
                className={`section-heading-underline${applyRef.visible ? " visible" : ""}`}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 12,
                }}
              >
                ✎ 応募フォーム
              </h2>
              <p style={{ fontSize: 15, color: C.textSub }}>
                お気軽にお問い合わせください。担当者より折り返しご連絡いたします。
              </p>
            </div>

            <div
              style={{
                background: C.white,
                borderRadius: "1.25rem",
                padding: "40px 36px",
                boxShadow: shadowMain,
                ...slideUp(applyRef.visible, 0.12),
              }}
            >
              <form onSubmit={(e) => e.preventDefault()}>
                {[
                  { label: "お名前", type: "text", name: "name", required: true, placeholder: "例）山田 太郎" },
                  { label: "電話番号", type: "tel", name: "phone", required: true, placeholder: "例）090-1234-5678" },
                  { label: "メールアドレス", type: "email", name: "email", required: false, placeholder: "例）info@example.co.jp" },
                  { label: "年齢", type: "text", name: "age", required: false, placeholder: "" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 22 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.text,
                        marginBottom: 6,
                      }}
                    >
                      {f.label}
                      {f.required && (
                        <span style={{ color: "#dc2626", marginLeft: 4, fontSize: 12 }}>
                          必須
                        </span>
                      )}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      placeholder={f.placeholder}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        fontSize: 15,
                        border: `2px solid ${C.border}`,
                        borderRadius: "0.5rem",
                        background: C.bg,
                        color: C.text,
                        fontFamily: "'Noto Sans JP', sans-serif",
                        transition: "border-color 0.3s, box-shadow 0.3s",
                      }}
                    />
                  </div>
                ))}

                {/* 希望エリア */}
                <div style={{ marginBottom: 22 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 6,
                    }}
                  >
                    希望エリア
                  </label>
                  <select
                    name="area"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 15,
                      border: `2px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      background: C.bg,
                      color: C.text,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                  >
                    <option value="">選択してください</option>
                    {["大阪", "東京", "兵庫", "鳥取", "島根", "沖縄", "その他"].map(
                      (a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* 備考 */}
                <div style={{ marginBottom: 28 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 6,
                    }}
                  >
                    ご質問・備考
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="例）応募を検討しています。詳しい話を聞きたいです。"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 15,
                      border: `2px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      background: C.bg,
                      color: C.text,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      resize: "vertical",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-drive cta-pulse"
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.white,
                    background: C.accent,
                    border: "none",
                    borderRadius: 50,
                    cursor: "pointer",
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}
                >
                  送信する
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── Truck animation ── */}
        <div style={{ background: C.bg, overflow: "hidden", position: "relative", height: 80 }}>
          {/* Faint cityscape */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.06, lineHeight: 0 }}>
            <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: 60 }}>
              <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58" stroke={C.textSub} strokeWidth="1" />
            </svg>
          </div>
          {/* Road line */}
          <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${C.accent}30, transparent)` }} />
          {/* Truck SVG */}
          <div style={{ position: "absolute", bottom: 14, animation: "truckDrive 12s linear infinite" }}>
            <svg width="64" height="36" viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="4" width="36" height="24" rx="3" fill={C.accent} opacity="0.4" />
              <rect x="36" y="12" width="22" height="16" rx="2" fill={C.accent} opacity="0.6" />
              <circle cx="14" cy="30" r="5" fill={C.textSub} opacity="0.4" />
              <circle cx="14" cy="30" r="2.5" fill={C.bg} />
              <circle cx="50" cy="30" r="5" fill={C.textSub} opacity="0.4" />
              <circle cx="50" cy="30" r="2.5" fill={C.bg} />
              <rect x="40" y="16" width="8" height="6" rx="1" fill={`${C.accent}30`} />
            </svg>
          </div>
        </div>

        {/* Wave: bg -> accent */}
        <WaveDivider from={C.bg} to={C.accent} />

        {/* ═══════════════════════════════════
            15. CTA SECTION
            ═══════════════════════════════════ */}
        <section
          ref={ctaRef.ref}
          style={{
            background: C.accent,
            padding: "80px 24px 100px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 背景画像 */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${IMG.delivery})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.1,
          }} />
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              ...slideUp(ctaRef.visible),
            }}
          >
            <h2
              style={{
                fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(22px, 3.5vw, 32px)",
                color: C.white,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              {nl2br(cta.heading)}
            </h2>
            <p
              style={{
                fontSize: 15,
                color: `${C.white}cc`,
                lineHeight: 1.85,
                marginBottom: 36,
                maxWidth: 600,
                margin: "0 auto 36px",
              }}
            >
              {nl2br(cta.subtext)}
            </p>

            <a
              href={`tel:${cta.phone.replace(/-/g, "")}`}
              className="btn-drive"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: C.white,
                color: C.accent,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                padding: "18px 44px",
                borderRadius: 50,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                marginBottom: 20,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              {cta.phone}
            </a>
            <p style={{ fontSize: 13, color: `${C.white}99` }}>
              {company.hours}
            </p>

            <div style={{ marginTop: 28 }}>
              <a
                href="#apply"
                className="btn-drive"
                style={{
                  display: "inline-block",
                  background: "transparent",
                  color: C.white,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 40px",
                  borderRadius: 50,
                  border: `2px solid ${C.white}`,
                }}
              >
                {cta.webLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════
          16. FOOTER
          ═══════════════════════════════════ */}
      <footer
        style={{
          background: C.dark,
          color: `${C.white}cc`,
          padding: "60px 24px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Footer background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${IMG.footerBg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.05, pointerEvents: "none",
        }} />

        <div
          className="footer-cols"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.5fr 1.05fr 0.95fr",
            gap: 48,
            marginBottom: 48,
            position: "relative",
            zIndex: 1,
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .footer-cols { grid-template-columns: 1fr !important; gap: 32px !important; }
            }
          `}</style>

          {/* Col 1: ブランド */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "0.5rem",
                  background: C.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                GL
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: C.white,
                }}
              >
                {company.nameEn}
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: `${C.white}88`,
              }}
            >
              {footerData.catchphrase}
            </p>
          </div>

          {/* Col 2: リンク */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.white,
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Pages
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {navLinks.slice(0, 6).map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: 13,
                    color: `${C.white}88`,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = `${C.white}88`)}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: お問い合わせ */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.white,
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Contact
            </h4>
            <div style={{ fontSize: 13, color: `${C.white}88`, lineHeight: 2 }}>
              <p>{company.name}</p>
              <p>〒{company.postalCode}</p>
              <p>{company.address}</p>
              <p style={{ marginTop: 8 }}>
                <a
                  href={`tel:${company.phone.replace(/-/g, "")}`}
                  style={{
                    color: C.white,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {company.phone}
                </a>
              </p>
              <p style={{ fontSize: 12 }}>{company.hours}</p>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div
          style={{
            borderTop: `1px solid ${C.white}15`,
            paddingTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: `${C.white}55`,
            position: "relative",
            zIndex: 1,
          }}
        >
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          &copy; {new Date().getFullYear()} {company.name} All rights reserved.
        </div>
      </footer>
    </>
  );
}
