"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
  meta,
  navLinks,
  hero,
  reasons,
  jobs,
  benefits,
  daily,
  voices,
  gallery,
  faq,
  news,
  access,
  companyInfo,
  cta,
  footer,
} from "@/data/siteData";

/* ───────────────────────────────────────────
   色定数
   ─────────────────────────────────────────── */
const C = {
  white: "#ffffff",
  bg: "#f5f5f5",
  bgWarm: "#faf9f7",
  text: "#222222",
  sub: "#666666",
  accent: "#333333",
  accentSoft: "#4a4a4a",
  cta: "#32373c",
  ctaHover: "#454c53",
  line: "#dddddd",
  lineSoft: "#eeeeee",
  warm: "#e8e4df",
};

/* ───────────────────────────────────────────
   CSS Keyframes (style tag inserted in JSX)
   ─────────────────────────────────────────── */
const keyframesCSS = `
  @keyframes float1 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(3deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(-2deg); }
  }
  @keyframes scrollChevron {
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(8px); }
  }
  @keyframes clipRevealLTR {
    from { clip-path: inset(0 100% 0 0); }
    to { clip-path: inset(0 0 0 0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(50,55,60,0.3); }
    50% { box-shadow: 0 0 0 10px rgba(50,55,60,0); }
  }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.6); opacity: 0.6; }
  }
  @keyframes lineGrow {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
  }
  @keyframes grainShift {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -2%); }
    20% { transform: translate(2%, 2%); }
    30% { transform: translate(-1%, 3%); }
    40% { transform: translate(3%, -1%); }
    50% { transform: translate(-3%, 1%); }
    60% { transform: translate(1%, -3%); }
    70% { transform: translate(-2%, 2%); }
    80% { transform: translate(3%, -2%); }
    90% { transform: translate(-1%, 1%); }
  }
  @keyframes checkPop {
    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
    60% { transform: scale(1.2) rotate(0deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes heroTextReveal {
    from { clip-path: inset(0 0 100% 0); opacity: 0; }
    to { clip-path: inset(0 0 0 0); opacity: 1; }
  }
  @keyframes marqueeSmoothLeft {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  details summary::-webkit-details-marker { display: none; }
  details summary::marker { display: none; content: ''; }
  details[open] summary span:last-child { transform: rotate(45deg); }

  @media (max-width: 768px) {
    .hide-sp { display: none !important; }
    .show-sp { display: block !important; }
  }
  @media (min-width: 769px) {
    .show-sp { display: none !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/* ───────────────────────────────────────────
   IntersectionObserver フック
   ─────────────────────────────────────────── */
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

/* ───────────────────────────────────────────
   カウントアップフック
   ─────────────────────────────────────────── */
function useCountUp(target: number, visible: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return value;
}

/* ───────────────────────────────────────────
   FadeIn ラッパー（方向指定対応）
   ─────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(24px)",
    down: "translateY(-24px)",
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
        transition: `opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────────────────────────
   セクション区切り - 繊細な二重線 + 中央ドット
   ─────────────────────────────────────────── */
function SectionDivider({ bg = "transparent", style: extraStyle }: { bg?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background: bg, padding: "0", position: "relative", ...extraStyle }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, padding: "0 24px" }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.line}, transparent)` }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", border: `1.5px solid ${C.sub}`, flexShrink: 0 }} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.line}, transparent)` }} />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   セクションタイトル（強化版）
   ─────────────────────────────────────────── */
function SectionTitle({
  en,
  ja,
  align = "center",
  num,
}: {
  en: string;
  ja: string;
  align?: "center" | "left";
  num?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ textAlign: align, marginBottom: 56, position: "relative" }}>
      {/* 背景の大きな番号 */}
      {num && (
        <span style={{
          position: "absolute",
          top: -36,
          left: align === "center" ? "50%" : 0,
          transform: align === "center" ? "translateX(-50%)" : "none",
          fontSize: 120,
          fontWeight: 800,
          color: C.lineSoft,
          fontFamily: "'Oswald', sans-serif",
          lineHeight: 1,
          pointerEvents: "none",
          opacity: visible ? 0.5 : 0,
          transition: "opacity 1s ease 0.2s",
          zIndex: 0,
        }}>
          {num}
        </span>
      )}
      <p
        style={{
          fontSize: 11,
          letterSpacing: visible ? 6 : 2,
          color: C.sub,
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 400,
          transition: "letter-spacing 0.8s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        ── {en} ──
      </p>
      <h2
        style={{
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 600,
          color: C.text,
          fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
          lineHeight: 1.5,
          margin: 0,
          position: "relative",
          zIndex: 1,
          clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 0.9s cubic-bezier(0.77,0,0.175,1) 0.1s",
        }}
      >
        {ja}
      </h2>
      {/* グラデーションライン */}
      <div style={{
        width: visible ? 48 : 0,
        height: 2,
        background: `linear-gradient(to right, ${C.accent}, transparent)`,
        margin: align === "center" ? "16px auto 0" : "16px 0 0",
        transition: "width 0.6s ease 0.4s",
        borderRadius: 1,
      }} />
    </div>
  );
}

/* ───────────────────────────────────────────
   SVG 波形セクションディバイダー
   ─────────────────────────────────────────── */
function WaveDivider({ topColor, bottomColor, flip = false }: { topColor: string; bottomColor: string; flip?: boolean }) {
  return (
    <div style={{ lineHeight: 0, transform: flip ? "scaleY(-1)" : "none" }}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ width: "100%", height: 48, display: "block" }}>
        <path
          d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,48 1440,32 L1440,48 L0,48 Z"
          fill={bottomColor}
        />
        <rect width="1440" height="48" fill={topColor} style={{ opacity: 0 }} />
      </svg>
    </div>
  );
}

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
   メインコンポーネント
   ─────────────────────────────────────────── */
export default function R03TrustPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const heroTyped = useTypewriter(hero.headlineParts[0], 80, 500);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // フォーム
  const [form, setForm] = useState({
    name: "",
    kana: "",
    age: "",
    phone: "",
    email: "",
    message: "",
  });
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    },
    []
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      alert("送信しました（デモ）");
    },
    []
  );

  /* ─── 共通スタイル ─── */
  const bodyFont: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 400,
    color: C.text,
    lineHeight: 1.85,
  };

  const sectionPad: React.CSSProperties = {
    padding: "120px 24px",
    maxWidth: 960,
    margin: "0 auto",
  };

  const btnBase: React.CSSProperties = {
    display: "inline-block",
    padding: "16px 48px",
    background: C.cta,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 3,
    cursor: "pointer",
    textDecoration: "none",
    letterSpacing: 1,
    transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
    position: "relative" as const,
    overflow: "hidden" as const,
  };

  /* ─── ノイズテクスチャSVG ─── */
  const noiseOverlay: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: "128px 128px",
    animation: "grainShift 8s steps(10) infinite",
    pointerEvents: "none",
    zIndex: 0,
  };

  return (
    <div style={{ ...bodyFont, background: C.white, overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: keyframesCSS }} />

      {/* ============================================
          HEADER（透明→白のトランジション）
          ============================================ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? C.white : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? `1px solid ${C.line}` : "1px solid transparent",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="#"
            style={{
              textDecoration: "none",
              fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: C.text,
              letterSpacing: 1,
            }}
          >
            {company.nameEn}
          </a>

          {/* デスクトップナビ */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="hide-sp">
            {navLinks.slice(0, 5).map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  fontSize: 13,
                  color: C.sub,
                  fontWeight: 400,
                  letterSpacing: 0.5,
                  transition: "color 0.2s",
                  position: "relative",
                  paddingBottom: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.text;
                  const line = e.currentTarget.querySelector('.nav-line') as HTMLElement;
                  if (line) line.style.transform = "scaleX(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.sub;
                  const line = e.currentTarget.querySelector('.nav-line') as HTMLElement;
                  if (line) line.style.transform = "scaleX(0)";
                }}
              >
                {l.label}
                <span className="nav-line" style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                  background: C.text, transform: "scaleX(0)", transformOrigin: "left",
                  transition: "transform 0.3s ease",
                }} />
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                textDecoration: "none",
                fontSize: 14,
                color: C.text,
                fontWeight: 600,
                letterSpacing: 1,
                fontFeatureSettings: "'tnum'",
              }}
            >
              {company.phone}
            </a>
          </nav>

          {/* ハンバーガー */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
            className="show-sp"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
          >
            <div style={{ width: 22, height: 16, position: "relative" }}>
              {[0, 7, 14].map((top, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute", left: 0,
                    top: menuOpen ? 7 : top,
                    width: 22, height: 1.5, background: C.text, borderRadius: 1,
                    transition: "top 0.3s, transform 0.3s, opacity 0.3s",
                    transform: menuOpen ? (i === 0 ? "rotate(45deg)" : i === 1 ? "scaleX(0)" : "rotate(-45deg)") : "none",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </div>
          </button>
        </div>

        {/* モバイルメニュー */}
        {menuOpen && (
          <div style={{ background: C.white, borderTop: `1px solid ${C.line}`, padding: "24px" }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", padding: "12px 0", color: C.text,
                  textDecoration: "none", fontSize: 14, borderBottom: `1px solid ${C.lineSoft}`,
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                display: "block", padding: "16px 0 0", color: C.text,
                textDecoration: "none", fontSize: 16, fontWeight: 600, letterSpacing: 1,
              }}
            >
              TEL {company.phone}
            </a>
          </div>
        )}
      </header>

      {/* ============================================
          HERO（動画背景 + テキストリビール）
          ============================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 64,
          overflow: "hidden",
        }}
      >
        {/* 動画背景 */}
        <video
          autoPlay muted loop playsInline
          poster="/keikamotsu-new-templates/images/hero-bg.webp"
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0,
          }}
        >
          <source src="/keikamotsu-new-templates/videos/hero-daytime.mp4" type="video/mp4" />
        </video>

        {/* オーバーレイ */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.30), rgba(0,0,0,0.50))", zIndex: 1 }} />

        {/* ノイズテクスチャ */}
        <div style={{ ...noiseOverlay, zIndex: 2, opacity: 0.03 }} />

        {/* 浮遊装飾要素 */}
        <div style={{
          position: "absolute", top: "15%", left: "8%", width: 80, height: 80,
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%",
          animation: "float1 8s ease-in-out infinite", zIndex: 2,
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "10%", width: 120, height: 1,
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
          animation: "float2 6s ease-in-out infinite", zIndex: 2,
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "15%", width: 6, height: 6,
          background: "rgba(255,255,255,0.2)", borderRadius: "50%",
          animation: "float1 10s ease-in-out infinite 2s", zIndex: 2,
        }} />

        {/* 大きな背景テキスト */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          fontSize: "clamp(80px, 18vw, 220px)", fontWeight: 800, color: "rgba(255,255,255,0.03)",
          fontFamily: "'Oswald', sans-serif", letterSpacing: 16, whiteSpace: "nowrap",
          zIndex: 2, pointerEvents: "none", textTransform: "uppercase",
        }}>
          JOIN US
        </div>

        {/* コンテンツ */}
        <div
          style={{
            position: "relative", zIndex: 3, textAlign: "center",
            padding: "60px 24px", maxWidth: 720,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 44px)",
              fontWeight: 400,
              color: "#fff",
              fontFamily: "'Klee One', 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              lineHeight: 1.7,
              marginBottom: 24,
              letterSpacing: 3,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ display: "block" }}>
              {heroTyped.displayed}
              {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
            </span>
            {heroTyped.done && (
              <span style={{
                display: "block",
                animation: "heroTextReveal 0.9s cubic-bezier(0.77,0,0.175,1) 0.1s both",
              }}>
                {hero.headlineParts[1]}
              </span>
            )}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 15, lineHeight: 2, marginBottom: 16, fontWeight: 400,
              animation: "fadeInUp 0.8s ease 1s both",
            }}
          >
            {hero.subtext[0]}<br />{hero.subtext[1]}
          </p>

          {/* バッジ */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 36 }}>
            {hero.badges.map((badge, i) => (
              <span key={badge} style={{
                padding: "6px 18px", fontSize: 12, fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
                borderRadius: 20, backdropFilter: "blur(4px)",
                background: "rgba(255,255,255,0.08)",
                animation: `fadeInUp 0.5s ease ${1.2 + i * 0.12}s both`,
              }}>
                {badge}
              </span>
            ))}
          </div>

          <a
            href="#apply"
            style={{
              ...btnBase,
              padding: "18px 56px", fontSize: 16, background: C.cta,
              animation: `fadeInUp 0.6s ease 1.6s both, pulse 2.5s ease-in-out 3s infinite`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.ctaHover;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.cta;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* シャインエフェクト */}
            <span style={{
              position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              animation: "shimmer 3s ease-in-out infinite 2s",
            }} />
            <span style={{ position: "relative", zIndex: 1 }}>{hero.cta}</span>
          </a>
        </div>

        {/* スクロールインジケーター */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ animation: "scrollChevron 2s ease-in-out infinite" }}>
            <path d="M8 0v18M2 14l6 6 6-6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </section>

      {/* ============================================
          MARQUEE STRIP（流れるテキスト）
          ============================================ */}
      <section style={{ background: C.bg, padding: "18px 0", overflow: "hidden", position: "relative" }}>
        {/* 左右グラデーションフェード */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 80, height: "100%", background: `linear-gradient(to right, ${C.bg}, transparent)`, zIndex: 2 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: "100%", background: `linear-gradient(to left, ${C.bg}, transparent)`, zIndex: 2 }} />
        <div style={{ display: "flex", animation: "marqueeSmoothLeft 25s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} style={{ display: "flex", gap: 0, flexShrink: 0 }}>
              {["未経験OK", "月収40万〜100万円", "配達車 無料貸出", "リース料・加盟料ゼロ", "入社祝い金5万円", "20〜60代活躍中", "週払い対応可"].map((text, i) => (
                <span key={i} style={{
                  padding: "0 32px", fontSize: "clamp(13px, 2.5vw, 16px)",
                  fontWeight: 600, color: C.text, letterSpacing: 2,
                }}>
                  {text}
                  <span style={{ margin: "0 24px", color: C.line }}>|</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── セクション区切り ── */}
      <SectionDivider />

      {/* ============================================
          REASONS（選ばれる理由）
          ============================================ */}
      <section id="reasons" style={{ padding: "130px 0 110px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <SectionTitle en="Reasons" ja="選ばれる理由" num="01" />
          </FadeIn>
        </div>
        {reasons.map((r, i) => (
          <FadeIn key={r.num} delay={i * 0.15} direction={i % 2 === 0 ? "left" : "right"}>
            <div
              style={{
                display: "flex",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                flexWrap: "wrap",
                maxWidth: 1100,
                margin: "0 auto 80px",
                alignItems: "center",
              }}
            >
              {/* 写真（clip-path reveal） */}
              <div
                style={{
                  flex: "1 1 50%", minWidth: 300, position: "relative",
                  aspectRatio: r.num === "01" ? "3/2" : r.num === "02" ? "4/3" : "16/9",
                  overflow: "hidden", borderRadius: 4,
                }}
              >
                <div style={{
                  width: "100%", height: "100%",
                  background: `url(/keikamotsu-new-templates/images/strength-${r.num}.webp) center/cover no-repeat`,
                  transition: "transform 0.6s ease",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              {/* テキスト */}
              <div
                style={{
                  flex: "1 1 50%", minWidth: 300,
                  padding: "48px clamp(24px, 5vw, 64px)", boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: 12, letterSpacing: 3, color: C.sub, fontWeight: 400 }}>
                  ─ REASON {r.num}
                </span>
                <h3
                  style={{
                    fontSize: "clamp(20px, 3.5vw, 26px)",
                    fontWeight: 600, color: C.text,
                    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                    lineHeight: 1.6, margin: "16px 0 20px",
                  }}
                >
                  {r.title}
                </h3>
                <p style={{ fontSize: 15, color: C.sub, lineHeight: 2 }}>
                  {typeof r.text === "string" && r.text.includes("\n")
                    ? r.text.split("\n").map((line, li) => (
                        <span key={li}>{line}{li < r.text.split("\n").length - 1 && <br />}</span>
                      ))
                    : r.text}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ── 波形区切り ── */}
      <WaveDivider topColor={C.white} bottomColor={C.bg} />

      {/* ============================================
          JOBS（求人情報）- 画像付き
          ============================================ */}
      <section id="jobs" style={{ background: C.bg, position: "relative" }}>
        <div style={{ padding: "100px 24px 140px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Job Info" ja="求人情報" num="02" />
          </FadeIn>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
            {/* 画像 */}
            <FadeIn delay={0.15} direction="left" style={{ flex: "1 1 340px", minWidth: 280 }}>
              <div style={{
                aspectRatio: "3/4", borderRadius: 6, overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}>
                <img
                  src="/keikamotsu-new-templates/images/jobs.webp"
                  alt="求人"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </FadeIn>

            {/* テーブル */}
            <FadeIn delay={0.2} direction="right" style={{ flex: "1 1 480px", minWidth: 300 }}>
              <p style={{ color: C.sub, fontSize: 15, lineHeight: 2, marginBottom: 32 }}>
                {jobs.intro}
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                <tbody>
                  {jobs.rows.map((row) => (
                    <tr key={row.dt}>
                      <th style={{
                        textAlign: "left", padding: "16px 16px 16px 0",
                        borderBottom: `1px solid ${C.line}`, fontWeight: 600,
                        color: C.text, width: "28%", verticalAlign: "top",
                        fontSize: 14, whiteSpace: "nowrap",
                      }}>
                        <span style={{ color: C.accent, marginRight: 8 }}>▪</span>{row.dt}
                      </th>
                      <td style={{
                        padding: "16px 0", borderBottom: `1px solid ${C.line}`,
                        color: row.accent ? C.text : C.sub,
                        fontWeight: row.accent ? 600 : 400, lineHeight: 1.8,
                        fontFeatureSettings: "'tnum'",
                      }}>
                        {row.dd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 応募要件 */}
              <div style={{ marginTop: 40 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>応募要件</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {jobs.requirements.map((r, i) => (
                    <FadeIn key={r} delay={0.3 + i * 0.05}>
                      <li style={{ padding: "6px 0", color: C.sub, fontSize: 14, lineHeight: 1.8, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: C.accent, fontSize: 14 }}>✓</span> {r}
                      </li>
                    </FadeIn>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.bg} bottomColor={C.white} flip />

      {/* ============================================
          BENEFITS（待遇・福利厚生）
          ============================================ */}
      <section id="benefits" style={{ position: "relative" }}>
        <div style={{ padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Benefits" ja="待遇・福利厚生" num="03" />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.08} direction="scale">
                <div
                  style={{
                    padding: "32px 28px", background: C.bgWarm, borderRadius: 8,
                    border: `1px solid ${C.lineSoft}`,
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = C.line;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = C.lineSoft;
                  }}
                >
                  {/* アニメチェックマーク */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: C.accent, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, marginBottom: 16,
                  }}>
                    ✓
                  </div>
                  <h4 style={{
                    fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 10px",
                    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                  }}>
                    {b.title}
                  </h4>
                  <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.9 }}>
                    {typeof b.text === "string" && b.text.includes("\n")
                      ? b.text.split("\n").map((line, li) => <span key={li}>{line}{li < b.text.split("\n").length - 1 && <br />}</span>)
                      : b.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── セクション区切り ── */}
      <SectionDivider bg={C.white} />

      {/* ============================================
          DAILY（1日の流れ）- 縦タイムライン
          ============================================ */}
      <section id="daily" style={{ background: C.bg, position: "relative" }}>
        {/* 背景画像 */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: "35%", height: "100%",
          background: `url(/keikamotsu-new-templates/images/daily-flow.webp) center/cover no-repeat`,
          opacity: 0.06, pointerEvents: "none",
        }} />
        <div style={{ padding: "130px 24px", maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <SectionTitle en="Daily Schedule" ja="1日の流れ" num="04" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ textAlign: "center", color: C.sub, fontSize: 15, lineHeight: 2, marginBottom: 56 }}>
              {daily.intro}
            </p>
          </FadeIn>

          {/* タイムライン */}
          <div style={{ position: "relative", paddingLeft: 48 }}>
            {/* 縦線 */}
            <div style={{
              position: "absolute", left: 16, top: 8, bottom: 8, width: 2,
              background: `linear-gradient(to bottom, ${C.line}, ${C.accent}, ${C.line})`,
              transformOrigin: "top", animation: "lineGrow 1.2s ease-out forwards",
            }} />

            {daily.steps.map((s, i) => (
              <FadeIn key={s.time} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "up"}>
                <div style={{ position: "relative", marginBottom: i < daily.steps.length - 1 ? 40 : 0, paddingLeft: 24 }}>
                  {/* タイムラインドット */}
                  <div style={{
                    position: "absolute", left: -40, top: 4,
                    width: 12, height: 12, borderRadius: "50%",
                    background: C.white, border: `3px solid ${C.accent}`,
                    zIndex: 2,
                  }} />
                  <div style={{
                    display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6,
                  }}>
                    <span style={{
                      fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700,
                      color: C.text, fontFamily: "'Oswald', sans-serif",
                      fontFeatureSettings: "'tnum'", letterSpacing: 1,
                    }}>
                      {s.time}
                    </span>
                    <h4 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>
                      {s.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.9 }}>
                    {typeof s.desc === "string" && s.desc.includes("\n")
                      ? s.desc.split("\n").map((line, li) => <span key={li}>{line}{li < s.desc.split("\n").length - 1 && <br />}</span>)
                      : s.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* インライン動画 */}
          <FadeIn delay={0.4} style={{ marginTop: 56 }}>
            <div style={{
              borderRadius: 8, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}>
              <video
                autoPlay muted loop playsInline
                style={{ width: "100%", display: "block" }}
              >
                <source src="/keikamotsu-new-templates/videos/delivery-scene.mp4" type="video/mp4" />
              </video>
            </div>
            <p style={{ textAlign: "center", fontSize: 13, color: C.sub, marginTop: 12 }}>
              配達の様子をご覧ください
            </p>
          </FadeIn>
        </div>
      </section>

      <WaveDivider topColor={C.bg} bottomColor={C.white} />

      {/* ============================================
          VOICES（先輩の声）- 温かいデザイン
          ============================================ */}
      <section id="voices">
        <div style={{ padding: "120px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Voices" ja="先輩の声" num="05" />
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {voices.map((v, i) => (
              <FadeIn key={v.name} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <div
                  style={{
                    padding: "48px clamp(24px, 5vw, 56px)",
                    background: `linear-gradient(135deg, ${C.bgWarm}, ${C.bg})`,
                    borderRadius: 12,
                    border: `1px solid ${C.lineSoft}`,
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* 大きな引用符 */}
                  <span style={{
                    position: "absolute", top: 16, left: 24,
                    fontSize: 96, fontFamily: "Georgia, serif", color: C.lineSoft,
                    lineHeight: 1, pointerEvents: "none", fontWeight: 700,
                  }}>"</span>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* イニシャル + 名前 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, fontWeight: 600,
                        fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}>
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{v.name}</span>
                        <span style={{ display: "block", fontSize: 12, color: C.sub }}>{v.age}・{v.prev}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: 15, color: C.sub, lineHeight: 2.1, marginBottom: 16 }}>
                      {typeof v.text === "string" && v.text.includes("\n")
                        ? v.text.split("\n").map((line, li) => <span key={li}>{line}{li < v.text.split("\n").length - 1 && <br />}</span>)
                        : v.text}
                    </p>

                    {/* ハイライト */}
                    {v.highlight && (
                      <div style={{
                        display: "inline-block", padding: "6px 16px",
                        background: C.accent, color: "#fff", fontSize: 13,
                        fontWeight: 600, borderRadius: 4,
                      }}>
                        {v.highlight}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── セクション区切り ── */}
      <SectionDivider />

      {/* ============================================
          GALLERY（職場の雰囲気）
          ============================================ */}
      <section id="gallery" style={{ background: C.bg }}>
        <div style={{ padding: "120px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Gallery" ja={gallery.heading} num="06" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ textAlign: "center", color: C.sub, fontSize: 15, lineHeight: 2, marginBottom: 48 }}>
              {gallery.intro}
            </p>
          </FadeIn>
          <FadeIn delay={0.15} direction="scale">
            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr 1fr", gap: 8 }}>
              {gallery.images.slice(0, 3).map((img, idx) => (
                <div
                  key={img.src}
                  style={{
                    aspectRatio: "4/3", overflow: "hidden", borderRadius: 6,
                    position: "relative", cursor: "pointer",
                  }}
                >
                  <img
                    src={img.src} alt={img.alt}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      filter: "grayscale(20%)",
                      transition: "transform 0.5s ease, filter 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                      e.currentTarget.style.filter = "grayscale(0%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.filter = "grayscale(20%)";
                    }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "24px 12px 10px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                    color: "#fff", fontSize: 12, fontWeight: 500,
                  }}>
                    {img.caption}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 8, marginTop: 8 }}>
              {gallery.images.slice(3, 5).map((img) => (
                <div
                  key={img.src}
                  style={{
                    aspectRatio: "3/2", overflow: "hidden", borderRadius: 6,
                    position: "relative", cursor: "pointer",
                  }}
                >
                  <img
                    src={img.src} alt={img.alt}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      filter: "grayscale(20%)",
                      transition: "transform 0.5s ease, filter 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                      e.currentTarget.style.filter = "grayscale(0%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.filter = "grayscale(20%)";
                    }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "24px 12px 10px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                    color: "#fff", fontSize: 12, fontWeight: 500,
                  }}>
                    {img.caption}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <WaveDivider topColor={C.bg} bottomColor={C.white} flip />

      {/* ============================================
          FAQ（スムーズアコーディオン）
          ============================================ */}
      <section id="faq">
        <div style={{ padding: "108px 24px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
            {/* 左：画像 */}
            <FadeIn direction="left" style={{ flex: "0 0 200px", display: "none" }}>
              <div style={{
                aspectRatio: "1/1", borderRadius: 8, overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}>
                <img src="/keikamotsu-new-templates/images/faq.webp" alt="FAQ" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </FadeIn>

            {/* 右：FAQ */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <FadeIn>
                <SectionTitle en="FAQ" ja="よくある質問" num="07" />
              </FadeIn>
              <div>
                {faq.map((item, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <FadeIn key={i} delay={i * 0.04}>
                      <div style={{ borderBottom: `1px solid ${C.line}` }}>
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                          style={{
                            width: "100%", textAlign: "left",
                            padding: "22px 0", fontSize: 15, fontWeight: 600,
                            color: C.text, cursor: "pointer", border: "none",
                            background: "none", display: "flex",
                            justifyContent: "space-between", alignItems: "center",
                            gap: 16, fontFamily: "'Noto Sans JP', sans-serif",
                          }}
                        >
                          <span>
                            <span style={{ color: C.sub, marginRight: 8, fontSize: 13 }}>Q.</span>
                            {item.q}
                          </span>
                          <span style={{
                            fontSize: 18, color: C.sub, flexShrink: 0,
                            fontWeight: 300, transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          }}>
                            +
                          </span>
                        </button>
                        <div style={{
                          maxHeight: isOpen ? 300 : 0,
                          overflow: "hidden",
                          transition: "max-height 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
                          opacity: isOpen ? 1 : 0,
                        }}>
                          <div style={{ padding: "0 0 24px 24px", fontSize: 14, color: C.sub, lineHeight: 2 }}>
                            <span style={{ color: C.accent, fontWeight: 600, marginRight: 8 }}>A.</span>
                            {typeof item.a === "string" && item.a.includes("\n")
                              ? item.a.split("\n").map((line, li) => <span key={li}>{line}{li < item.a.split("\n").length - 1 && <br />}</span>)
                              : item.a}
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── セクション区切り ── */}
      <SectionDivider />

      {/* ============================================
          NEWS（お知らせ）
          ============================================ */}
      <section id="news" style={{ background: C.bg }}>
        <div style={{ padding: "120px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="News" ja="お知らせ" num="08" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              {news.map((n, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 16,
                    padding: "18px 0",
                    borderBottom: i < news.length - 1 ? `1px solid ${C.line}` : "none",
                    flexWrap: "wrap",
                    transition: "background 0.2s",
                  }}
                >
                  <span style={{
                    fontSize: 13, color: C.sub, flexShrink: 0,
                    fontVariantNumeric: "tabular-nums", fontFeatureSettings: "'tnum'",
                  }}>
                    <span style={{ marginRight: 6 }}>─</span>{n.date}
                  </span>
                  <span style={{
                    fontSize: 11, padding: "2px 10px",
                    border: `1px solid ${n.tagStyle === "urgent" ? C.text : n.tagStyle === "new" ? C.accent : C.line}`,
                    color: n.tagStyle === "urgent" ? C.text : n.tagStyle === "new" ? C.accent : C.sub,
                    fontWeight: 600, flexShrink: 0,
                  }}>
                    {n.tag}
                  </span>
                  <span style={{ fontSize: 14, color: C.text }}>{n.title}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <WaveDivider topColor={C.bg} bottomColor={C.white} />

      {/* ============================================
          ACCESS
          ============================================ */}
      <section id="access">
        <div style={{ width: "100%", height: 360, background: C.bg }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.123!2d135.6283!3d34.7662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5aSn6Ziq5bqc5a-d5bGL5bed5biC5rGg55SwMi0xMS01NQ!5e0!3m2!1sja!2sjp!4v1234567890"
            width="100%" height="100%"
            style={{ border: 0, display: "block", filter: "grayscale(30%)" }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div style={{ padding: "80px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Access" ja={access.heading} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 15, color: C.text, marginBottom: 8 }}>{company.address}</p>
              <p style={{ fontSize: 14, color: C.sub, marginBottom: 8 }}>{access.nearestStation}</p>
              <p style={{ fontSize: 14, color: C.sub }}>{access.mapNote}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── セクション区切り ── */}
      <SectionDivider />

      {/* ============================================
          COMPANY（会社概要）- 画像付き
          ============================================ */}
      <section id="company" style={{ background: C.bg }}>
        <div style={{ padding: "120px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Company" ja="会社概要" />
          </FadeIn>
          {/* 会社画像 */}
          <FadeIn delay={0.1} direction="scale">
            <div style={{
              width: "100%", aspectRatio: "21/9", borderRadius: 8, overflow: "hidden",
              marginBottom: 48, boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              <img
                src="/keikamotsu-new-templates/images/company.webp"
                alt="会社"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, maxWidth: 800, margin: "0 auto" }}>
              <tbody>
                {companyInfo.map((row) => (
                  <tr key={row.dt}>
                    <th style={{
                      textAlign: "left", padding: "16px 16px 16px 0",
                      borderBottom: `1px solid ${C.line}`, fontWeight: 600,
                      color: C.text, width: "28%", verticalAlign: "top",
                      fontSize: 14, whiteSpace: "nowrap",
                    }}>
                      {row.dt}
                    </th>
                    <td style={{
                      padding: "16px 0", borderBottom: `1px solid ${C.line}`,
                      color: C.sub, lineHeight: 1.8,
                    }}>
                      {row.dd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </div>
      </section>

      <WaveDivider topColor={C.bg} bottomColor={C.white} />

      {/* ============================================
          APPLY（応募フォーム）
          ============================================ */}
      <section id="apply">
        <div style={{ padding: "120px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Apply" ja="応募フォーム" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ textAlign: "center", color: C.sub, fontSize: 15, lineHeight: 2, marginBottom: 56 }}>
              下記フォームに必要事項をご記入の上、送信してください。<br />
              折り返し担当者よりご連絡いたします。
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
              {[
                { label: "お名前", name: "name", type: "text", required: true },
                { label: "ふりがな", name: "kana", type: "text", required: true },
                { label: "年齢", name: "age", type: "select", required: true },
                { label: "電話番号", name: "phone", type: "tel", required: true },
                { label: "メールアドレス", name: "email", type: "email", required: false },
              ].map((f) => (
                <div key={f.name} style={{ marginBottom: 36, position: "relative" }}>
                  <label style={{
                    display: "block", fontSize: 13, fontWeight: 600,
                    color: C.text, marginBottom: 10,
                    transition: "color 0.3s",
                  }}>
                    {f.label}
                    {f.required && (
                      <span style={{ fontSize: 11, color: C.sub, marginLeft: 8, fontWeight: 400 }}>必須</span>
                    )}
                  </label>
                  {f.type === "select" ? (
                    <select
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      required={f.required}
                      style={{
                        width: "100%", padding: "12px 0", fontSize: 15,
                        border: "none", borderBottom: `2px solid ${C.line}`,
                        background: "transparent", color: C.text,
                        outline: "none", borderRadius: 0, appearance: "none" as const,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => e.currentTarget.style.borderBottomColor = C.accent}
                      onBlur={(e) => e.currentTarget.style.borderBottomColor = C.line}
                    >
                      <option value="">選択してください</option>
                      {["10代", "20代", "30代", "40代", "50代", "60代以上"].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      required={f.required}
                      style={{
                        width: "100%", padding: "12px 0", fontSize: 15,
                        border: "none", borderBottom: `2px solid ${C.line}`,
                        background: "transparent", color: C.text,
                        outline: "none", borderRadius: 0, boxSizing: "border-box" as const,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => e.currentTarget.style.borderBottomColor = C.accent}
                      onBlur={(e) => e.currentTarget.style.borderBottomColor = C.line}
                    />
                  )}
                </div>
              ))}

              <div style={{ marginBottom: 48 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
                  メッセージ・質問
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    width: "100%", padding: "12px 0", fontSize: 15,
                    border: "none", borderBottom: `2px solid ${C.line}`,
                    background: "transparent", color: C.text,
                    outline: "none", borderRadius: 0, resize: "vertical",
                    fontFamily: "'Noto Sans JP', sans-serif", boxSizing: "border-box" as const,
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderBottomColor = C.accent}
                  onBlur={(e) => e.currentTarget.style.borderBottomColor = C.line}
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  style={{
                    ...btnBase, padding: "18px 72px", fontSize: 15,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.ctaHover;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.cta;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{
                    position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    animation: "shimmer 3s ease-in-out infinite",
                  }} />
                  <span style={{ position: "relative", zIndex: 1 }}>送信する</span>
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          CTA SECTION（背景画像 + ノイズ）
          ============================================ */}
      <section style={{
        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(/keikamotsu-new-templates/images/footer-bg.webp) center/cover no-repeat`,
        padding: "120px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={noiseOverlay} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <FadeIn>
            <p style={{
              fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 600, color: "#fff",
              fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              lineHeight: 1.7, marginBottom: 20,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              {cta.heading}
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 2, maxWidth: 560, margin: "0 auto 40px" }}>
              {cta.subtext}
            </p>
            <a
              href={`tel:${cta.phone}`}
              style={{
                display: "block",
                fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 600, color: "#fff",
                textDecoration: "none",
                fontFamily: "'Oswald', 'Zen Kaku Gothic New', sans-serif",
                letterSpacing: 4, marginBottom: 8,
                fontFeatureSettings: "'tnum'",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {cta.phone}
            </a>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 36 }}>
              {company.hours}
            </p>
            <a
              href="#apply"
              style={{
                ...btnBase, padding: "16px 56px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {cta.webLabel}
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer style={{
        background: C.text, color: "rgba(255,255,255,0.6)",
        padding: "56px 24px 40px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* グラデーションライン */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(to right, transparent, ${C.accentSoft}, transparent)`,
        }} />
        <p style={{
          fontSize: 15, fontWeight: 600, color: "#fff",
          fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
          marginBottom: 6, letterSpacing: 1,
        }}>
          {company.nameEn}
        </p>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.35)",
          fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
          marginBottom: 12, letterSpacing: 2,
        }}>
          {footer.catchphrase}
        </p>
        <p style={{ fontSize: 13, marginBottom: 24, lineHeight: 1.8 }}>{company.address}</p>
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
        <p style={{ fontSize: 11, letterSpacing: 1 }}>
          &copy; {new Date().getFullYear()} {company.name} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
