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

/* ═══════════════════════════════════════════
   カラー定数 — Clean / Fresh
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   フォントスタック
   ═══════════════════════════════════════════ */
const F = {
  heading: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
  sans: "'Noto Sans JP', sans-serif",
  accent: "'Poppins', 'Zen Kaku Gothic New', sans-serif",
};

/* ═══════════════════════════════════════════
   キーフレーム注入
   ═══════════════════════════════════════════ */
const KEYFRAMES = `
@keyframes r05marqueeLeft { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes r05marqueeRight { from{transform:translateX(-50%)} to{transform:translateX(0)} }
@keyframes r05TruckDrive {
  from { transform: translateX(-60px); }
  to { transform: translateX(calc(100vw + 60px)); }
}
@keyframes r05underline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes r05fadeInUp {
  from { opacity:0; transform:translateY(20px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes r05pulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
`;

/* ═══════════════════════════════════════════
   IntersectionObserver フック
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   useTypewriter フック
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   FadeIn ラッパー
   ═══════════════════════════════════════════ */
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
    up: "translateY(24px)",
    left: "translateX(-24px)",
    right: "translateX(24px)",
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

/* ═══════════════════════════════════════════
   CounterNum — 数値カウントアップ
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   SalaryCountUp コンポーネント
   ═══════════════════════════════════════════ */
function SalaryCountUp() {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
      <CounterNum
        target={hero.salaryMin}
        style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: F.accent, color: C.accent }}
      />
      <span style={{ fontSize: "1rem", color: C.textSub, margin: "0 4px" }}>万〜</span>
      <CounterNum
        target={hero.salaryMax}
        style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: F.accent, color: C.accent }}
      />
      <span style={{ fontSize: "1rem", color: C.textSub, marginLeft: 4 }}>万円</span>
    </span>
  );
}

/* ═══════════════════════════════════════════
   セクション見出しコンポーネント
   ═══════════════════════════════════════════ */
function SectionHeading({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
}) {
  const { ref, visible } = useInView(0.15);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
        <h2
          style={{
            fontFamily: F.heading,
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: C.text,
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
        <p style={{ fontFamily: F.sans, fontSize: 14, color: C.textSub, margin: 0 }}>{sub}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Benefits 用 SVG アイコン
   ═══════════════════════════════════════════ */
const benefitIcons = [
  // 車
  <svg key="car" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4z"/></svg>,
  // 祝い金
  <svg key="gift" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M3 12h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7zM7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8"/></svg>,
  // お金
  <svg key="money" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-5a3 3 0 000 6h2a3 3 0 010 6H8M12 2v2m0 16v2"/></svg>,
  // 時計
  <svg key="clock" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  // 学習
  <svg key="learn" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  // スマホ
  <svg key="phone" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
];

/* ═══════════════════════════════════════════
   Reasons 用 SVG アイコン
   ═══════════════════════════════════════════ */
const reasonIcons = [
  // 握手
  <svg key="handshake" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0A5.4 5.4 0 003.58 12L12 20.42 20.42 12a5.4 5.4 0 000-7.42z"/></svg>,
  // シンプル配達
  <svg key="box" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  // 上昇
  <svg key="trending" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
];

/* ═══════════════════════════════════════════
   メインコンポーネント
   ═══════════════════════════════════════════ */
export default function R05Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* レスポンシブ */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* スクロール検知 */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* タイプライター */
  const heroText = hero.headlineParts.join("");
  const { displayed: typedHero, done: typeDone } = useTypewriter(heroText, 55, 300);

  /* フォーム送信 */
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    alert("送信が完了しました。担当者より折り返しご連絡いたします。");
    formRef.current?.reset();
  }, []);

  /* ── レンダリング ── */
  return (
    <>
      {/* Global style injection */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div style={{ fontFamily: F.sans, color: C.text, background: C.bg, overflowX: "hidden" }}>

        {/* ═══════════════════════════════════════════
           ナビゲーション — 白い薄型スティッキーヘッダー
           ═══════════════════════════════════════════ */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: isMobile ? "12px 16px" : "14px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
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
                  fontSize: 14,
                }}
              >
                GL
              </span>
              <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 15, color: C.text }}>
                {company.name}
              </span>
            </a>

            {/* Desktop nav */}
            {!isMobile && (
              <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {navLinks.slice(0, 6).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      textDecoration: "none",
                      fontSize: 13,
                      color: C.textSub,
                      fontWeight: 500,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textSub)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#apply"
                  style={{
                    background: C.accent,
                    color: C.white,
                    padding: "8px 20px",
                    borderRadius: 24,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                >
                  応募する
                </a>
              </nav>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="メニュー"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  padding: 4,
                }}
              >
                <span style={{ width: 22, height: 2, background: C.text, borderRadius: 1, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(3.5px,3.5px)" : "none" }} />
                <span style={{ width: 22, height: 2, background: C.text, borderRadius: 1, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
                <span style={{ width: 22, height: 2, background: C.text, borderRadius: 1, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(3.5px,-3.5px)" : "none" }} />
              </button>
            )}
          </div>

          {/* Mobile menu */}
          {isMobile && menuOpen && (
            <nav
              style={{
                background: C.white,
                borderTop: `1px solid ${C.border}`,
                padding: "16px 0",
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 24px",
                    fontSize: 14,
                    color: C.text,
                    textDecoration: "none",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ padding: "16px 24px" }}>
                <a
                  href="#apply"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    background: C.accent,
                    color: C.white,
                    padding: "12px 0",
                    borderRadius: 24,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  応募する
                </a>
              </div>
            </nav>
          )}
        </header>

        {/* ═══════════════════════════════════════════
           ヒーロー — 明るい白背景 + 左テキスト + 右サラリーバッジ
           ═══════════════════════════════════════════ */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            background: C.bg,
            position: "relative",
            overflow: "hidden",
            paddingTop: isMobile ? 80 : 70,
          }}
        >
          {/* 幾何学的アクセント */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: C.accentLight,
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: C.accentLight,
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "15%",
              width: 120,
              height: 120,
              border: `2px solid ${C.accent}`,
              borderRadius: 16,
              opacity: 0.12,
              transform: "rotate(15deg)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: isMobile ? "40px 20px" : "60px 40px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: isMobile ? 40 : 60,
              width: "100%",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* 左：テキスト */}
            <div style={{ flex: 1, maxWidth: isMobile ? "100%" : "60%" }}>
              <div
                style={{
                  display: "inline-flex",
                  gap: 8,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                {hero.badges.map((badge, i) => (
                  <span
                    key={i}
                    style={{
                      background: C.accentLight,
                      color: C.accent,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "5px 14px",
                      borderRadius: 20,
                      border: `1px solid ${C.accent}20`,
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <h1
                style={{
                  fontFamily: F.heading,
                  fontSize: isMobile ? "clamp(1.8rem, 7vw, 2.4rem)" : "clamp(2.2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1.4,
                  color: C.text,
                  margin: "0 0 20px",
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
                      animation: "r05pulse 0.8s ease infinite",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </h1>

              <div style={{ marginBottom: 28 }}>
                {hero.subtext.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: isMobile ? 14 : 15,
                      color: C.textSub,
                      lineHeight: 1.9,
                      margin: "0 0 4px",
                      opacity: typeDone ? 1 : 0,
                      transform: typeDone ? "none" : "translateY(8px)",
                      transition: `opacity 0.5s ease ${0.2 + i * 0.15}s, transform 0.5s ease ${0.2 + i * 0.15}s`,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <a
                href="#apply"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accent,
                  color: C.white,
                  padding: isMobile ? "14px 32px" : "16px 40px",
                  borderRadius: 32,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: `0 4px 20px ${C.accent}40`,
                  opacity: typeDone ? 1 : 0,
                  transform: typeDone ? "none" : "translateY(12px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.accentDark;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.accent;
                  e.currentTarget.style.transform = "none";
                }}
              >
                {hero.cta}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            {/* 右：サラリーバッジ */}
            <div
              style={{
                flex: isMobile ? "none" : "0 0 auto",
                textAlign: "center",
                opacity: typeDone ? 1 : 0,
                transform: typeDone ? "none" : "translateY(20px) scale(0.95)",
                transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
              }}
            >
              <div
                style={{
                  background: C.white,
                  borderRadius: 24,
                  padding: isMobile ? "32px 28px" : "40px 44px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                  border: `1px solid ${C.border}`,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 8px", fontWeight: 500 }}>月収</p>
                <SalaryCountUp />
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, color: C.muted }}>日給 18,000円〜</span>
                  <span style={{ fontSize: 12, color: C.muted }}>個数制 150〜180円/個</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           マーキー — 薄い帯
           ═══════════════════════════════════════════ */}
        <div style={{ background: C.accentLight, overflow: "hidden", padding: "12px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", animation: "r05marqueeLeft 20s linear infinite", width: "max-content" }}>
            {[...marquee.top, ...marquee.top].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.accent,
                  whiteSpace: "nowrap",
                  padding: "0 24px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{ background: C.bgSub, overflow: "hidden", padding: "10px 0" }}>
          <div style={{ display: "flex", animation: "r05marqueeRight 22s linear infinite", width: "max-content" }}>
            {[...marquee.bottom, ...marquee.bottom].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.muted,
                  whiteSpace: "nowrap",
                  padding: "0 24px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
           選ばれる理由 — 3カラム + アイコン + ナンバーバッジ
           ═══════════════════════════════════════════ */}
        <section id="reasons" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
              label="選ばれる理由"
              sub="Why Choose Us"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 32,
              }}
            >
              {reasons.map((r, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: 32,
                      background: C.bgSub,
                      borderRadius: 16,
                      transition: "box-shadow 0.3s ease, transform 0.3s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      {reasonIcons[i] || reasonIcons[0]}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        background: C.accent,
                        color: C.white,
                        fontFamily: F.accent,
                        fontWeight: 700,
                        fontSize: 13,
                        width: 36,
                        height: 36,
                        lineHeight: "36px",
                        borderRadius: "50%",
                        marginBottom: 16,
                      }}
                    >
                      {r.num}
                    </span>
                    <h3
                      style={{
                        fontFamily: F.heading,
                        fontSize: 17,
                        fontWeight: 700,
                        color: C.text,
                        margin: "0 0 12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {r.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: C.textSub,
                        lineHeight: 1.8,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {r.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           求人情報 — テーブルスタイル + 交互色
           ═══════════════════════════════════════════ */}
        <section id="jobs" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>}
              label="求人情報"
              sub="Job Information"
            />

            <FadeIn>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 32, whiteSpace: "pre-line" }}>
                {jobs.intro}
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div
                style={{
                  background: C.card,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                }}
              >
                {jobs.rows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      background: i % 2 === 0 ? C.white : C.bgSub,
                      borderBottom: i < jobs.rows.length - 1 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div
                      style={{
                        flex: isMobile ? "none" : "0 0 160px",
                        padding: isMobile ? "12px 20px 4px" : "16px 24px",
                        fontWeight: 600,
                        fontSize: 13,
                        color: C.accent,
                        background: i % 2 === 0 ? C.accentLight : `${C.accentLight}80`,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {row.dt}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: isMobile ? "4px 20px 12px" : "16px 24px",
                        fontSize: 14,
                        color: row.accent ? C.accent : C.text,
                        fontWeight: row.accent ? 700 : 400,
                        lineHeight: 1.7,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {row.accent ? (
                        <span style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
                          月収{" "}
                          <CounterNum target={hero.salaryMin} style={{ fontSize: 22, fontWeight: 800, fontFamily: F.accent, color: C.accent }} />
                          万〜
                          <CounterNum target={hero.salaryMax} style={{ fontSize: 22, fontWeight: 800, fontFamily: F.accent, color: C.accent }} />
                          万円
                          <span style={{ fontSize: 12, color: C.textSub, fontWeight: 400, marginLeft: 8 }}>
                            （日給18,000円〜 or 個数制150〜180円/個）
                          </span>
                        </span>
                      ) : (
                        row.dd
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* 応募資格 */}
            <FadeIn delay={0.2}>
              <div style={{ marginTop: 32, textAlign: "center" }}>
                <h3 style={{ fontFamily: F.heading, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>
                  応募資格
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                  {jobs.requirements.map((req, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 13,
                        color: C.textSub,
                        background: C.white,
                        border: `1px solid ${C.border}`,
                        borderRadius: 20,
                        padding: "6px 16px",
                      }}
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           待遇・福利厚生 — アイコングリッド 2x3
           ═══════════════════════════════════════════ */}
        <section id="benefits" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>}
              label="待遇・福利厚生"
              sub="Benefits"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 20,
              }}
            >
              {benefits.map((b, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div
                    style={{
                      background: C.card,
                      borderRadius: 14,
                      padding: 28,
                      border: `1px solid ${C.border}`,
                      transition: "all 0.3s ease",
                      cursor: "default",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.accent;
                      e.currentTarget.style.boxShadow = `0 4px 20px ${C.accent}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ marginBottom: 14 }}>{benefitIcons[i] || benefitIcons[0]}</div>
                    <h3
                      style={{
                        fontFamily: F.heading,
                        fontSize: 15,
                        fontWeight: 700,
                        color: C.text,
                        margin: "0 0 10px",
                      }}
                    >
                      {b.title}
                    </h3>
                    <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>
                      {b.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           1日の流れ — 水平ステッパー/タイムライン
           ═══════════════════════════════════════════ */}
        <section id="daily" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
              label="1日の流れ"
              sub="Daily Schedule"
            />

            <FadeIn>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 40, whiteSpace: "pre-line" }}>
                {daily.intro}
              </p>
            </FadeIn>

            {/* 水平タイムライン（モバイルでは縦に切り替え） */}
            {isMobile ? (
              /* モバイル: 縦タイムライン */
              <div style={{ position: "relative", paddingLeft: 28 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 8,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: C.border,
                  }}
                />
                {daily.steps.map((step, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div style={{ position: "relative", marginBottom: 28 }}>
                      <div
                        style={{
                          position: "absolute",
                          left: -24,
                          top: 4,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: C.accent,
                          border: `3px solid ${C.white}`,
                          boxShadow: `0 0 0 2px ${C.accent}40`,
                        }}
                      />
                      <span style={{ fontFamily: F.accent, fontSize: 14, fontWeight: 700, color: C.accent }}>
                        {step.time}
                      </span>
                      <h4 style={{ fontFamily: F.heading, fontSize: 15, fontWeight: 700, color: C.text, margin: "4px 0 6px" }}>
                        {step.title}
                      </h4>
                      <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, margin: 0 }}>
                        {step.desc}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              /* デスクトップ: 水平タイムライン */
              <div style={{ position: "relative" }}>
                {/* ライン */}
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: "8%",
                    right: "8%",
                    height: 2,
                    background: C.border,
                  }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${daily.steps.length}, 1fr)`,
                    gap: 12,
                  }}
                >
                  {daily.steps.map((step, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div style={{ textAlign: "center", position: "relative" }}>
                        {/* ドット */}
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: C.accent,
                            border: `3px solid ${C.white}`,
                            boxShadow: `0 0 0 2px ${C.accent}40`,
                            margin: "0 auto 12px",
                            position: "relative",
                            zIndex: 1,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: F.accent,
                            fontSize: 16,
                            fontWeight: 700,
                            color: C.accent,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          {step.time}
                        </span>
                        <h4
                          style={{
                            fontFamily: F.heading,
                            fontSize: 14,
                            fontWeight: 700,
                            color: C.text,
                            margin: "0 0 6px",
                            lineHeight: 1.5,
                          }}
                        >
                          {step.title}
                        </h4>
                        <p style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7, margin: 0 }}>
                          {step.desc}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           職場の雰囲気 — クリーングリッド + 角丸 + ホバーズーム
           ═══════════════════════════════════════════ */}
        <section id="gallery" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
              label={gallery.heading}
              sub="Gallery"
            />

            <FadeIn>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 40 }}>
                {gallery.intro}
              </p>
            </FadeIn>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {gallery.images.map((img, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 14,
                      aspectRatio: i === 0 && !isMobile ? "auto" : "4/3",
                      gridRow: i === 0 && !isMobile ? "1 / 3" : "auto",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        display: "block",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                        padding: "20px 16px 12px",
                      }}
                    >
                      <p style={{ fontSize: 12, color: C.white, margin: 0, fontWeight: 500 }}>
                        {img.caption}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           先輩の声 — 吹き出しカード
           ═══════════════════════════════════════════ */}
        <section id="voices" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
              label="先輩の声"
              sub="Voices"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: 24,
              }}
            >
              {voices.map((v, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div
                    style={{
                      background: C.card,
                      borderRadius: 20,
                      padding: 28,
                      position: "relative",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {/* 吹き出し三角 */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: -10,
                        left: 40,
                        width: 20,
                        height: 20,
                        background: C.card,
                        borderRight: `1px solid ${C.border}`,
                        borderBottom: `1px solid ${C.border}`,
                        transform: "rotate(45deg)",
                      }}
                    />

                    {/* ハイライト */}
                    <div
                      style={{
                        background: C.accentLight,
                        color: C.accent,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 12px",
                        borderRadius: 12,
                        display: "inline-block",
                        marginBottom: 12,
                      }}
                    >
                      {v.highlight}
                    </div>

                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.9, margin: "0 0 16px", whiteSpace: "pre-line" }}>
                      {v.text}
                    </p>

                    {/* プロフィール */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${C.accentLight}, ${C.accent}30)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.accent,
                          fontFamily: F.accent,
                          flexShrink: 0,
                        }}
                      >
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>
                          {v.name}（{v.age}）
                        </p>
                        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{v.prev}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           お知らせ
           ═══════════════════════════════════════════ */}
        <section id="news" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>}
              label="お知らせ"
              sub="News"
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {news.map((n, i) => {
                const tagColor =
                  n.tagStyle === "urgent" ? "#dc2626" : n.tagStyle === "new" ? C.accent : C.muted;
                return (
                  <FadeIn key={i} delay={i * 0.08}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: isMobile ? "flex-start" : "center",
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? 6 : 16,
                        padding: "16px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <span style={{ fontSize: 13, color: C.muted, fontFamily: F.accent, flexShrink: 0, minWidth: 100 }}>
                        {n.date}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: C.white,
                          background: tagColor,
                          padding: "2px 10px",
                          borderRadius: 10,
                          flexShrink: 0,
                        }}
                      >
                        {n.tag}
                      </span>
                      <span style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{n.title}</span>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           よくある質問 — アコーディオン
           ═══════════════════════════════════════════ */}
        <section id="faq" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>}
              label="よくある質問"
              sub="FAQ"
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faq.map((item, i) => {
                const isOpen = faqOpen === i;
                return (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: C.card,
                      }}
                    >
                      <button
                        onClick={() => setFaqOpen(isOpen ? null : i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "20px 24px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          gap: 16,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: C.accent,
                              flexShrink: 0,
                            }}
                          >
                            Q.
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.6 }}>
                            {item.q}
                          </span>
                        </span>
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: `1.5px solid ${C.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.3s ease",
                            transform: isOpen ? "rotate(45deg)" : "none",
                            color: C.textSub,
                            fontSize: 18,
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
                          transition: "max-height 0.35s ease",
                        }}
                      >
                        <div style={{ padding: "0 24px 20px 52px" }}>
                          <p
                            style={{
                              fontSize: 14,
                              color: C.textSub,
                              lineHeight: 1.9,
                              margin: 0,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           アクセス
           ═══════════════════════════════════════════ */}
        <section id="access" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
              label={access.heading}
              sub="Access"
            />

            <FadeIn>
              <div
                style={{
                  background: C.card,
                  borderRadius: 16,
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>
                  {company.name}
                </p>
                <p style={{ fontSize: 14, color: C.textSub, margin: "0 0 4px" }}>
                  〒{company.postalCode} {company.address}
                </p>
                <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>
                  {access.nearestStation}
                </p>
                <div
                  style={{
                    width: "100%",
                    height: 280,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: C.bgSub,
                    marginBottom: 16,
                  }}
                >
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Google Map"
                  />
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{access.mapNote}</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           会社概要
           ═══════════════════════════════════════════ */}
        <section id="company" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              label="会社概要"
              sub="Company"
            />

            <FadeIn>
              <div
                style={{
                  background: C.card,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                }}
              >
                {companyInfo.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      borderBottom: i < companyInfo.length - 1 ? `1px solid ${C.border}` : "none",
                      background: i % 2 === 0 ? C.white : C.bgSub,
                    }}
                  >
                    <div
                      style={{
                        flex: isMobile ? "none" : "0 0 140px",
                        padding: isMobile ? "12px 20px 4px" : "14px 24px",
                        fontWeight: 600,
                        fontSize: 13,
                        color: C.accent,
                      }}
                    >
                      {row.dt}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: isMobile ? "4px 20px 12px" : "14px 24px",
                        fontSize: 14,
                        color: C.text,
                        lineHeight: 1.7,
                      }}
                    >
                      {row.dd}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           CTA — ライトコーラル背景
           ═══════════════════════════════════════════ */}
        <section style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.accentLight }}>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <FadeIn>
              <h2
                style={{
                  fontFamily: F.heading,
                  fontSize: isMobile ? "clamp(1.3rem, 5vw, 1.7rem)" : "clamp(1.6rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.6,
                  margin: "0 0 8px",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                「ちょっと話を聞いてみたい」
                <br />
                ——それだけで大丈夫です。
                <span
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: 2,
                    background: C.accent,
                    animation: "r05underline 1s ease 0.5s both",
                    transformOrigin: "left",
                  }}
                />
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p
                style={{
                  fontSize: 14,
                  color: C.textSub,
                  lineHeight: 1.9,
                  margin: "20px 0 32px",
                  whiteSpace: "pre-line",
                }}
              >
                {cta.subtext}
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                }}
              >
                <a
                  href={`tel:${cta.phone}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.white,
                    color: C.text,
                    padding: "14px 32px",
                    borderRadius: 32,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    border: `1px solid ${C.border}`,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  {cta.phone}
                </a>
                <a
                  href="#apply"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.accent,
                    color: C.white,
                    padding: "14px 32px",
                    borderRadius: 32,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.3s",
                    boxShadow: `0 4px 20px ${C.accent}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.accentDark;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.accent;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {cta.webLabel}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           応募フォーム — フローティングラベル
           ═══════════════════════════════════════════ */}
        <section id="apply" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>}
              label="応募フォーム"
              sub="Apply Now"
            />

            <FadeIn>
              <p style={{ fontSize: 14, color: C.textSub, textAlign: "center", marginBottom: 32, lineHeight: 1.8 }}>
                下記フォームに必要事項をご記入ください。<br />
                担当者より折り返しご連絡いたします。
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                style={{
                  background: C.card,
                  borderRadius: 20,
                  padding: isMobile ? 24 : 40,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {/* 名前 */}
                <FormField label="お名前" placeholder="例：山田 太郎" required type="text" name="name" />
                {/* フリガナ */}
                <FormField label="フリガナ" placeholder="例：ヤマダ タロウ" required type="text" name="kana" />
                {/* 電話番号 */}
                <FormField label="電話番号" placeholder="例：090-1234-5678" required type="tel" name="phone" />
                {/* メール */}
                <FormField label="メールアドレス" placeholder="例：yamada@example.com" type="email" name="email" />
                {/* 年齢 */}
                <FormField label="年齢" placeholder="例：35" type="text" name="age" />
                {/* 希望エリア */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    希望勤務エリア
                  </label>
                  <select
                    name="area"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      fontSize: 14,
                      color: C.text,
                      background: C.white,
                      outline: "none",
                      transition: "border-color 0.2s",
                      appearance: "none",
                      WebkitAppearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
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
                {/* 備考 */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                    ご質問・ご要望
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="例：週3日からの勤務を希望しています"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      fontSize: 14,
                      color: C.text,
                      background: C.white,
                      outline: "none",
                      resize: "vertical",
                      fontFamily: F.sans,
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: C.accent,
                    color: C.white,
                    padding: "16px 0",
                    borderRadius: 32,
                    border: "none",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 20px ${C.accent}40`,
                    fontFamily: F.sans,
                    marginTop: 8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.accentDark;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.accent;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  この内容で送信する
                </button>
              </form>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           トラックアニメーション — 都市シルエット
           ═══════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            height: 120,
            overflow: "hidden",
            background: C.bgSub,
          }}
        >
          {/* 都市シルエット背景 */}
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              bottom: 30,
              left: 0,
              width: "100%",
              height: 60,
              opacity: 0.08,
            }}
          >
            <path
              d="M0,80 L0,55 L30,55 L30,35 L50,35 L50,45 L70,45 L70,25 L85,25 L85,40 L100,40 L100,30 L115,30 L115,15 L130,15 L130,30 L145,30 L145,50 L170,50 L170,35 L190,35 L190,20 L210,20 L210,40 L230,40 L230,55 L260,55 L260,30 L275,30 L275,10 L290,10 L290,35 L310,35 L310,50 L340,50 L340,40 L355,40 L355,20 L375,20 L375,45 L400,45 L400,30 L420,30 L420,50 L450,50 L450,35 L470,35 L470,15 L490,15 L490,40 L520,40 L520,55 L550,55 L550,25 L570,25 L570,45 L600,45 L600,30 L620,30 L620,50 L650,50 L650,20 L670,20 L670,40 L700,40 L700,55 L730,55 L730,35 L750,35 L750,10 L770,10 L770,35 L800,35 L800,50 L830,50 L830,40 L850,40 L850,25 L870,25 L870,45 L900,45 L900,30 L920,30 L920,55 L950,55 L950,35 L975,35 L975,20 L1000,20 L1000,45 L1030,45 L1030,30 L1050,30 L1050,50 L1080,50 L1080,40 L1100,40 L1100,25 L1120,25 L1120,50 L1150,50 L1150,55 L1200,55 L1200,80 Z"
              fill={C.text}
            />
          </svg>

          {/* 道路ライン */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 0,
              width: "100%",
              height: 2,
              background: C.border,
            }}
          />
          {/* 破線 */}
          <div
            style={{
              position: "absolute",
              bottom: 33,
              left: 0,
              width: "100%",
              height: 1,
              backgroundImage: `repeating-linear-gradient(90deg, ${C.muted} 0px, ${C.muted} 16px, transparent 16px, transparent 32px)`,
              opacity: 0.4,
            }}
          />

          {/* トラック */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              animation: "r05TruckDrive 12s linear infinite",
            }}
          >
            <svg width="60" height="36" viewBox="0 0 60 36">
              {/* 荷台 */}
              <rect x="0" y="4" width="34" height="22" rx="2" fill={C.accent} />
              <rect x="2" y="6" width="30" height="18" rx="1" fill={C.white} opacity="0.3" />
              {/* キャブ */}
              <rect x="34" y="10" width="20" height="16" rx="2" fill={C.accentDark} />
              {/* フロントガラス */}
              <rect x="40" y="12" width="12" height="8" rx="1" fill="#b0d4f1" opacity="0.7" />
              {/* タイヤ */}
              <circle cx="14" cy="28" r="5" fill={C.text} />
              <circle cx="14" cy="28" r="2.5" fill={C.muted} />
              <circle cx="46" cy="28" r="5" fill={C.text} />
              <circle cx="46" cy="28" r="2.5" fill={C.muted} />
              {/* ロゴテキスト */}
              <text x="8" y="18" fontSize="5" fill={C.white} fontWeight="700" fontFamily={F.accent}>GL</text>
            </svg>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
           「一緒に物流の未来を変えていく仲間を募集」下線アニメーション
           ═══════════════════════════════════════════ */}
        <section style={{ padding: isMobile ? "60px 20px" : "80px 40px", background: C.bg, textAlign: "center" }}>
          <FadeIn>
            <p
              style={{
                fontFamily: F.heading,
                fontSize: isMobile ? 16 : 20,
                fontWeight: 700,
                color: C.text,
                position: "relative",
                display: "inline-block",
                lineHeight: 1.8,
              }}
            >
              一緒に物流の未来を変えていく仲間を募集
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: "100%",
                  height: 2,
                  background: C.accent,
                  animation: "r05underline 1.2s ease 0.3s both",
                  transformOrigin: "left",
                }}
              />
            </p>
          </FadeIn>
        </section>

        {/* ═══════════════════════════════════════════
           フッター
           ═══════════════════════════════════════════ */}
        <footer
          style={{
            background: C.bgSub,
            borderTop: `1px solid ${C.border}`,
            padding: isMobile ? "48px 20px 32px" : "64px 40px 40px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "center" : "flex-start",
                gap: 32,
                marginBottom: 40,
              }}
            >
              {/* 左: ロゴ + キャッチ */}
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, justifyContent: isMobile ? "center" : "flex-start" }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: C.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontFamily: F.accent,
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    GL
                  </span>
                  <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 14, color: C.text }}>
                    {company.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: C.muted,
                    margin: 0,
                    whiteSpace: "nowrap",
                    fontStyle: "italic",
                  }}
                >
                  {footer.catchphrase}
                </p>
              </div>

              {/* 右: ナビリンク */}
              <nav
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? 12 : 20,
                  justifyContent: "center",
                }}
              >
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: 12,
                      color: C.textSub,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textSub)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* 下部 */}
            <div
              style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: 24,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>
                〒{company.postalCode} {company.address}
                <span style={{ margin: "0 8px" }}>|</span>
                <a href={`tel:${company.phone}`} style={{ color: C.muted, textDecoration: "none" }}>
                  {company.phone}
                </a>
                <span style={{ margin: "0 8px" }}>|</span>
                {company.hours}
              </div>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   フォームフィールド コンポーネント
   ═══════════════════════════════════════════ */
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
  const [hasValue, setHasValue] = useState(false);
  return (
    <div style={{ position: "relative" }}>
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
        required={required}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: `1px solid ${focused ? C.accent : C.border}`,
          fontSize: 14,
          color: C.text,
          background: C.white,
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: F.sans,
          boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px ${C.accent}15` : "none",
        }}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
      />
    </div>
  );
}
