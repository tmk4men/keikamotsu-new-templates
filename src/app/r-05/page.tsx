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
   R-05 PHOTOGRAPHIC — 写真主導のフルワイド交互レイアウト
   完全に独自構造: 大画像背景ヒーロー + 交互行Reasons
   + スプリットJobs + マソンリーGallery + 横スクロールVoices
   + 縦タイムライン + 背景画像Company + トラックアニメーション
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
   キーフレーム注入
   ========================================================== */
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
@keyframes r05shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

/* ==========================================================
   IntersectionObserver フック
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
   useTypewriter フック
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
   FadeIn ラッパー
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
   SectionHeading --- SVGアイコン + アンダーラインアニメーション
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
   Benefits用SVGアイコン (stroke only, no fill, currentColor)
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
   メインコンポーネント
   ========================================================== */
export default function R05Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroText = hero.headlineParts.join("");
  const { displayed: typedHero, done: typeDone } = useTypewriter(heroText, 55, 300);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    alert("送信が完了しました。担当者より折り返しご連絡いたします。");
    formRef.current?.reset();
  }, []);

  const strengthImages = [IMG.strength(1), IMG.strength(2), IMG.strength(3)];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div style={{ fontFamily: F.sans, color: C.text, background: C.bg, overflowX: "hidden" }}>

        {/* ==========================================================
           ナビゲーション --- グラス風スティッキーヘッダー
           ========================================================== */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
            transition: "all 0.4s ease",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: isMobile ? "14px 16px" : "16px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
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
              <span
                style={{
                  fontFamily: F.heading,
                  fontWeight: 700,
                  fontSize: 15,
                  color: scrolled ? C.text : C.white,
                  transition: "color 0.4s",
                }}
              >
                {company.name}
              </span>
            </a>

            {!isMobile && (
              <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {navLinks.slice(0, 6).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      textDecoration: "none",
                      fontSize: 13,
                      color: scrolled ? C.textSub : "rgba(255,255,255,0.85)",
                      fontWeight: 500,
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? C.textSub : "rgba(255,255,255,0.85)")}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#apply"
                  style={{
                    background: C.accent,
                    color: C.white,
                    padding: "9px 24px",
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
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    style={{
                      width: 22,
                      height: 2,
                      background: scrolled ? C.text : C.white,
                      borderRadius: 1,
                      transition: "all 0.3s",
                      transform:
                        menuOpen && n === 0
                          ? "rotate(45deg) translate(3.5px,3.5px)"
                          : menuOpen && n === 2
                          ? "rotate(-45deg) translate(3.5px,-3.5px)"
                          : "none",
                      opacity: menuOpen && n === 1 ? 0 : 1,
                    }}
                  />
                ))}
              </button>
            )}
          </div>

          {isMobile && menuOpen && (
            <nav style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "16px 0" }}>
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

        {/* ==========================================================
           ヒーロー --- フルワイド hero-bg.webp + 明るいオーバーレイ
           ========================================================== */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
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
          {/* 明るいオーバーレイ */}
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
              margin: "0 auto",
              padding: isMobile ? "120px 20px 60px" : "140px 40px 80px",
              textAlign: "center",
            }}
          >
            {/* バッジピル群 */}
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

            {/* タイプライターヘッドライン */}
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
                    animation: "r05pulse 0.8s ease infinite",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </h1>

            {/* サブテキスト */}
            <div style={{ marginBottom: 32 }}>
              {hero.subtext.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: isMobile ? 14 : 16,
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

            {/* 月収カウンター */}
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                padding: isMobile ? "24px 20px" : "28px 44px",
                display: "inline-block",
                boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                border: `1px solid ${C.border}`,
                marginBottom: 36,
                opacity: typeDone ? 1 : 0,
                transform: typeDone ? "none" : "translateY(16px) scale(0.96)",
                transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
              }}
            >
              <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 6px", fontWeight: 500 }}>月収</p>
              <SalaryCountUp large />
              <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 16 }}>
                <span style={{ fontSize: 12, color: C.muted }}>日給 18,000円~</span>
                <span style={{ fontSize: 12, color: C.muted }}>個数制 150~180円/個</span>
              </div>
            </div>

            {/* CTAボタン */}
            <div>
              <a
                href="#apply"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accent,
                  color: C.white,
                  padding: isMobile ? "15px 36px" : "17px 48px",
                  borderRadius: 32,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: `0 6px 24px ${C.accent}50`,
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

            {/* 下スクロール矢印 */}
            <div
              style={{
                marginTop: 48,
                animation: "r05float 2s ease-in-out infinite",
                opacity: typeDone ? 0.5 : 0,
                transition: "opacity 0.5s ease 1s",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
        </section>

        {/* ==========================================================
           マーキー --- 薄いスクロールストリップ
           ========================================================== */}
        <div style={{ background: C.accentLight, overflow: "hidden", padding: "11px 0", borderTop: `1px solid ${C.accent}15`, borderBottom: `1px solid ${C.accent}15` }}>
          <div style={{ display: "flex", animation: "r05marqueeLeft 18s linear infinite", width: "max-content" }}>
            {[...marquee.top, ...marquee.top, ...marquee.top].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.accent,
                  whiteSpace: "nowrap",
                  padding: "0 28px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke={C.accent} strokeWidth="1.5"><circle cx="3" cy="3" r="2"/></svg>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{ background: C.bgSub, overflow: "hidden", padding: "9px 0" }}>
          <div style={{ display: "flex", animation: "r05marqueeRight 22s linear infinite", width: "max-content" }}>
            {[...marquee.bottom, ...marquee.bottom, ...marquee.bottom].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.muted,
                  whiteSpace: "nowrap",
                  padding: "0 28px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ==========================================================
           選ばれる理由 --- フルワイド交互行 (画像左/テキスト右 → 反転)
           ========================================================== */}
        <section id="reasons" style={{ padding: isMobile ? "80px 0" : "100px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
              label="選ばれる理由"
              sub="Why Choose Us"
            />
          </div>

          {reasons.map((r, i) => {
            const isReversed = i % 2 === 1;
            return (
              <FadeIn key={i} delay={0.1} direction={isReversed ? "right" : "left"}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : isReversed ? "row-reverse" : "row",
                    alignItems: "stretch",
                    minHeight: isMobile ? "auto" : 420,
                    background: i % 2 === 0 ? C.bg : C.bgSub,
                  }}
                >
                  {/* 画像側 */}
                  <div
                    style={{
                      flex: isMobile ? "none" : "0 0 50%",
                      position: "relative",
                      overflow: "hidden",
                      minHeight: isMobile ? 240 : 420,
                    }}
                  >
                    <img
                      src={strengthImages[i]}
                      alt={r.title}
                      loading="lazy"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* ナンバーバッジ */}
                    <div
                      style={{
                        position: "absolute",
                        top: isMobile ? 16 : 28,
                        left: isReversed && !isMobile ? "auto" : (isMobile ? 16 : 28),
                        right: isReversed && !isMobile ? 28 : "auto",
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: C.accent,
                        color: C.white,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: F.accent,
                        fontWeight: 800,
                        fontSize: 20,
                        boxShadow: `0 4px 16px ${C.accent}60`,
                      }}
                    >
                      {r.num}
                    </div>
                  </div>

                  {/* テキスト側 */}
                  <div
                    style={{
                      flex: isMobile ? "none" : "0 0 50%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: isMobile ? "36px 24px" : "48px 56px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: F.heading,
                        fontSize: isMobile ? 20 : 24,
                        fontWeight: 700,
                        color: C.text,
                        margin: "0 0 16px",
                        lineHeight: 1.4,
                      }}
                    >
                      {r.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.textSub,
                        lineHeight: 2,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {r.text}
                    </p>
                    {/* 小さい装飾ライン */}
                    <div
                      style={{
                        width: 48,
                        height: 3,
                        background: C.accent,
                        borderRadius: 2,
                        marginTop: 24,
                      }}
                    />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </section>

        {/* ==========================================================
           求人情報 --- スプリットレイアウト (画像40% + テーブル60%)
           ========================================================== */}
        <section id="jobs" style={{ background: C.bgSub }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              maxWidth: 1280,
              margin: "0 auto",
              minHeight: isMobile ? "auto" : 600,
            }}
          >
            {/* 左: 画像 */}
            <div
              style={{
                flex: isMobile ? "none" : "0 0 40%",
                position: "relative",
                minHeight: isMobile ? 280 : 600,
                overflow: "hidden",
              }}
            >
              <img
                src={IMG.jobs}
                alt="求人情報"
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, transparent 60%, rgba(250,250,250,0.95) 100%)",
                  display: isMobile ? "none" : "block",
                }}
              />
            </div>

            {/* 右: データテーブル */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "48px 20px" : "60px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <SectionHeading
                icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>}
                label="求人情報"
                sub="Job Information"
              />

              <FadeIn>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 28, whiteSpace: "pre-line" }}>
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
                          flex: isMobile ? "none" : "0 0 140px",
                          padding: isMobile ? "10px 18px 3px" : "14px 20px",
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
                          padding: isMobile ? "3px 18px 10px" : "14px 20px",
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
                            万~
                            <CounterNum target={hero.salaryMax} style={{ fontSize: 22, fontWeight: 800, fontFamily: F.accent, color: C.accent }} />
                            万円
                            <span style={{ fontSize: 11, color: C.textSub, fontWeight: 400, marginLeft: 6 }}>
                              (日給18,000円~ or 個数制150~180円/個)
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
                <div style={{ marginTop: 28 }}>
                  <h3 style={{ fontFamily: F.heading, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14, textAlign: "center" }}>
                    応募資格
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                    {jobs.requirements.map((req, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          color: C.textSub,
                          background: C.white,
                          border: `1px solid ${C.border}`,
                          borderRadius: 20,
                          padding: "5px 14px",
                        }}
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ==========================================================
           待遇・福利厚生 --- 大画像バナー + 3x2アイコンカード
           ========================================================== */}
        <section id="benefits" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>}
              label="待遇・福利厚生"
              sub="Benefits"
            />

            {/* 大画像バナー */}
            <FadeIn>
              <div
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 36,
                  height: isMobile ? 200 : 320,
                }}
              >
                <img
                  src={IMG.benefits}
                  alt="待遇・福利厚生"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: isMobile ? 16 : 28,
                    left: isMobile ? 16 : 32,
                  }}
                >
                  <p style={{ color: C.white, fontSize: isMobile ? 18 : 24, fontWeight: 700, fontFamily: F.heading, margin: 0 }}>
                    安心して働ける環境を整えています
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* 3x2 カードグリッド */}
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
                      borderRadius: 16,
                      padding: 28,
                      border: `1px solid ${C.border}`,
                      transition: "all 0.3s ease",
                      cursor: "default",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.accent;
                      e.currentTarget.style.boxShadow = `0 6px 24px ${C.accent}15`;
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: C.accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.accent,
                        marginBottom: 16,
                      }}
                    >
                      {benefitIcons[i] || benefitIcons[0]}
                    </div>
                    <h3 style={{ fontFamily: F.heading, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>
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

        {/* ==========================================================
           1日の流れ --- 画像バナー + 縦タイムライン (接続線 + 時刻ドット)
           ========================================================== */}
        <section id="daily" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
              label="1日の流れ"
              sub="Daily Schedule"
            />

            {/* 画像バナー */}
            <FadeIn>
              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 40,
                  position: "relative",
                  height: isMobile ? 180 : 280,
                }}
              >
                <img
                  src={IMG.dailyFlow}
                  alt="1日の流れ"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%)",
                  }}
                />
                <div style={{ position: "absolute", bottom: isMobile ? 16 : 24, left: isMobile ? 16 : 28 }}>
                  <p style={{ color: C.white, fontSize: 14, margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>
                    {daily.intro}
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* 縦タイムライン */}
            <div style={{ position: "relative", paddingLeft: isMobile ? 36 : 52 }}>
              {/* 接続線 */}
              <div
                style={{
                  position: "absolute",
                  left: isMobile ? 14 : 20,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: `linear-gradient(to bottom, ${C.accent}, ${C.border})`,
                  borderRadius: 1,
                }}
              />

              {daily.steps.map((step, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div
                    style={{
                      position: "relative",
                      marginBottom: i < daily.steps.length - 1 ? 36 : 0,
                      paddingBottom: i < daily.steps.length - 1 ? 0 : 0,
                    }}
                  >
                    {/* タイムドット */}
                    <div
                      style={{
                        position: "absolute",
                        left: isMobile ? -28 : -40,
                        top: 2,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: C.accent,
                        border: `3px solid ${C.white}`,
                        boxShadow: `0 0 0 3px ${C.accent}30`,
                        zIndex: 1,
                      }}
                    />

                    {/* カード */}
                    <div
                      style={{
                        background: C.card,
                        borderRadius: 14,
                        padding: isMobile ? "16px 18px" : "20px 28px",
                        border: `1px solid ${C.border}`,
                        transition: "box-shadow 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                      <span
                        style={{
                          fontFamily: F.accent,
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.accent,
                          marginRight: 12,
                        }}
                      >
                        {step.time}
                      </span>
                      <span style={{ fontFamily: F.heading, fontSize: 15, fontWeight: 700, color: C.text }}>
                        {step.title}
                      </span>
                      <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, margin: "8px 0 0" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
           職場の雰囲気 --- マソンリー風グリッド (高さバリエーション)
           ========================================================== */}
        <section id="gallery" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
              label={gallery.heading}
              sub="Gallery"
            />

            <FadeIn>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, textAlign: "center", marginBottom: 36 }}>
                {gallery.intro}
              </p>
            </FadeIn>

            {/* マソンリー風グリッド */}
            {isMobile ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {gallery.images.map((img, i) => (
                  <FadeIn key={i} delay={i * 0.08}>
                    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                      />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "24px 14px 10px" }}>
                        <p style={{ fontSize: 12, color: C.white, margin: 0, fontWeight: 500 }}>{img.caption}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: 10, gap: 14 }}>
                {gallery.images.map((img, i) => {
                  const heights = [28, 22, 24, 20, 26];
                  const spanH = heights[i % heights.length];
                  return (
                    <FadeIn key={i} delay={i * 0.08}>
                      <div
                        style={{
                          gridRow: `span ${spanH}`,
                          position: "relative",
                          borderRadius: 14,
                          overflow: "hidden",
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
                            display: "block",
                            transition: "transform 0.5s ease",
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
                            background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                            padding: "28px 16px 12px",
                          }}
                        >
                          <p style={{ fontSize: 12, color: C.white, margin: 0, fontWeight: 500 }}>{img.caption}</p>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            )}

            {/* 追加: workplace, loading, team 画像バー */}
            <FadeIn delay={0.2}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: 14,
                  marginTop: 20,
                }}
              >
                {[
                  { src: IMG.workplace, caption: "清潔なオフィス環境" },
                  { src: IMG.loading, caption: "荷物の積み込み作業" },
                  { src: IMG.team, caption: "笑顔あふれるチーム" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      borderRadius: 14,
                      overflow: "hidden",
                      height: isMobile ? 180 : 200,
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.caption}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.45))", padding: "20px 14px 10px" }}>
                      <p style={{ fontSize: 12, color: C.white, margin: 0, fontWeight: 500 }}>{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ==========================================================
           先輩の声 --- 横スクロール吹き出しカード
           ========================================================== */}
        <section id="voices" style={{ padding: isMobile ? "80px 0" : "100px 0", background: C.bgSub }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
              label="先輩の声"
              sub="Voices"
            />
          </div>

          <FadeIn>
            <div
              style={{
                display: "flex",
                gap: 24,
                overflowX: "auto",
                padding: isMobile ? "0 20px 20px" : "0 40px 20px",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {voices.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: `0 0 ${isMobile ? "85%" : "340px"}`,
                    scrollSnapAlign: "start",
                  }}
                >
                  {/* 吹き出しバブル */}
                  <div
                    style={{
                      background: C.card,
                      borderRadius: 20,
                      padding: isMobile ? "22px 20px" : "28px 28px",
                      border: `1px solid ${C.border}`,
                      position: "relative",
                      marginBottom: 20,
                    }}
                  >
                    {/* 吹き出し三角 */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: -12,
                        left: 36,
                        width: 24,
                        height: 24,
                        background: C.card,
                        borderRight: `1px solid ${C.border}`,
                        borderBottom: `1px solid ${C.border}`,
                        transform: "rotate(45deg)",
                      }}
                    />

                    {/* ハイライトタグ */}
                    <div
                      style={{
                        background: C.accentLight,
                        color: C.accent,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 14px",
                        borderRadius: 12,
                        display: "inline-block",
                        marginBottom: 14,
                      }}
                    >
                      {v.highlight}
                    </div>

                    <p
                      style={{
                        fontSize: 14,
                        color: C.text,
                        lineHeight: 1.9,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {v.text}
                    </p>
                  </div>

                  {/* プロフィール (バブルの外、下部) */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 8 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.accentLight}, ${C.accent}30)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
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
                        {v.name}({v.age})
                      </p>
                      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{v.prev}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ==========================================================
           よくある質問 --- アコーディオン + SVGシェブロン
           ========================================================== */}
        <section id="faq" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>}
              label="よくある質問"
              sub="FAQ"
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faq.map((item, i) => {
                const isOpen = faqOpen === i;
                return (
                  <FadeIn key={i} delay={i * 0.04}>
                    <div style={{ borderBottom: `1px solid ${C.border}` }}>
                      <button
                        onClick={() => setFaqOpen(isOpen ? null : i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "20px 0",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          gap: 16,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.accent, flexShrink: 0 }}>Q.</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.6 }}>{item.q}</span>
                        </span>
                        {/* SVGシェブロン */}
                        <span
                          style={{
                            flexShrink: 0,
                            transition: "transform 0.3s ease",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            color: C.muted,
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </span>
                      </button>
                      <div
                        style={{
                          maxHeight: isOpen ? 400 : 0,
                          overflow: "hidden",
                          transition: "max-height 0.35s ease",
                        }}
                      >
                        <div style={{ padding: "0 0 20px 36px" }}>
                          <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
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

        {/* ==========================================================
           お知らせ --- シンプルリスト + 日付タグ
           ========================================================== */}
        <section id="news" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bgSub }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>}
              label="お知らせ"
              sub="News"
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {news.map((n, i) => {
                const tagColor = n.tagStyle === "urgent" ? "#dc2626" : n.tagStyle === "new" ? C.accent : C.muted;
                return (
                  <FadeIn key={i} delay={i * 0.06}>
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
                      <span
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          fontFamily: F.accent,
                          flexShrink: 0,
                          minWidth: 100,
                          background: C.bgSub,
                          padding: "3px 10px",
                          borderRadius: 6,
                          border: `1px solid ${C.border}`,
                        }}
                      >
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

        {/* ==========================================================
           アクセス
           ========================================================== */}
        <section id="access" style={{ padding: isMobile ? "80px 20px" : "100px 40px", background: C.bg }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
              label={access.heading}
              sub="Access"
            />

            <FadeIn>
              <div
                style={{
                  background: C.card,
                  borderRadius: 20,
                  padding: isMobile ? 24 : 36,
                  border: `1px solid ${C.border}`,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>{company.name}</p>
                <p style={{ fontSize: 14, color: C.textSub, margin: "0 0 4px" }}>
                  〒{company.postalCode} {company.address}
                </p>
                <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px" }}>{access.nearestStation}</p>
                <div
                  style={{
                    width: "100%",
                    height: isMobile ? 220 : 300,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: C.bgSub,
                    marginBottom: 14,
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

        {/* ==========================================================
           会社概要 --- company.webp 背景 + ダークオーバーレイ + 白テーブル
           ========================================================== */}
        <section
          id="company"
          style={{
            position: "relative",
            padding: isMobile ? "80px 20px" : "100px 40px",
            minHeight: 500,
          }}
        >
          <img
            src={IMG.company}
            alt=""
            loading="lazy"
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
              background: "rgba(0,0,0,0.72)",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto" }}>
            <SectionHeading
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              label="会社概要"
              sub="Company"
              light
            />

            <FadeIn>
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {companyInfo.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      borderBottom: i < companyInfo.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                    }}
                  >
                    <div
                      style={{
                        flex: isMobile ? "none" : "0 0 140px",
                        padding: isMobile ? "12px 20px 4px" : "16px 24px",
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
                        padding: isMobile ? "4px 20px 12px" : "16px 24px",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.9)",
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

        {/* ==========================================================
           CTA --- delivery.webp背景 + フロストガラスオーバーレイカード
           ========================================================== */}
        <section
          style={{
            position: "relative",
            padding: isMobile ? "80px 20px" : "100px 40px",
            minHeight: 400,
          }}
        >
          <img
            src={IMG.delivery}
            alt=""
            loading="lazy"
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
              background: "rgba(0,0,0,0.35)",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
            <FadeIn>
              <div
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 24,
                  padding: isMobile ? "36px 24px" : "48px 48px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: F.heading,
                    fontSize: isMobile ? "clamp(1.3rem, 5vw, 1.7rem)" : "clamp(1.6rem, 3vw, 2rem)",
                    fontWeight: 700,
                    color: C.white,
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

                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.9,
                    margin: "20px 0 32px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {cta.subtext}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
                  <a
                    href={`tel:${cta.phone}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(255,255,255,0.92)",
                      color: C.text,
                      padding: "13px 28px",
                      borderRadius: 32,
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.white)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.92)")}
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
                      padding: "13px 28px",
                      borderRadius: 32,
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.3s",
                      boxShadow: `0 4px 20px ${C.accent}50`,
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
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ==========================================================
           応募フォーム --- クリーンフォーム + vehicle.webp背景サイド
           ========================================================== */}
        <section id="apply" style={{ background: C.bg }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              maxWidth: 1280,
              margin: "0 auto",
              minHeight: isMobile ? "auto" : 700,
            }}
          >
            {/* 左サイド: 画像 (デスクトップのみ) */}
            {!isMobile && (
              <div
                style={{
                  flex: "0 0 38%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={IMG.vehicle}
                  alt="配達車両"
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, transparent 50%, rgba(255,255,255,0.95) 100%)",
                  }}
                />
              </div>
            )}

            {/* 右: フォーム */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "60px 20px" : "72px 56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <SectionHeading
                icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>}
                label="応募フォーム"
                sub="Apply Now"
              />

              <FadeIn>
                <p style={{ fontSize: 14, color: C.textSub, textAlign: "center", marginBottom: 28, lineHeight: 1.8 }}>
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
                    padding: isMobile ? 24 : 36,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    maxWidth: 560,
                    margin: "0 auto",
                    width: "100%",
                  }}
                >
                  <FormField label="お名前" placeholder="例：山田 太郎" required type="text" name="name" />
                  <FormField label="フリガナ" placeholder="例：ヤマダ タロウ" required type="text" name="kana" />
                  <FormField label="電話番号" placeholder="例：090-1234-5678" required type="tel" name="phone" />
                  <FormField label="メールアドレス" placeholder="例：yamada@example.com" type="email" name="email" />
                  <FormField label="年齢" placeholder="例：35" type="text" name="age" />

                  {/* エリア */}
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
                        boxSizing: "border-box",
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
                      marginTop: 4,
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
          </div>
        </section>

        {/* ==========================================================
           トラックアニメーション + シティスケープSVG
           ========================================================== */}
        <div
          style={{
            position: "relative",
            height: 130,
            overflow: "hidden",
            background: C.bgSub,
          }}
        >
          {/* シティスケープSVG */}
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              bottom: 34,
              left: 0,
              width: "100%",
              height: 60,
              opacity: 0.07,
            }}
          >
            <path
              d="M0,80 L0,55 L30,55 L30,35 L50,35 L50,45 L70,45 L70,25 L85,25 L85,40 L100,40 L100,30 L115,30 L115,15 L130,15 L130,30 L145,30 L145,50 L170,50 L170,35 L190,35 L190,20 L210,20 L210,40 L230,40 L230,55 L260,55 L260,30 L275,30 L275,10 L290,10 L290,35 L310,35 L310,50 L340,50 L340,40 L355,40 L355,20 L375,20 L375,45 L400,45 L400,30 L420,30 L420,50 L450,50 L450,35 L470,35 L470,15 L490,15 L490,40 L520,40 L520,55 L550,55 L550,25 L570,25 L570,45 L600,45 L600,30 L620,30 L620,50 L650,50 L650,20 L670,20 L670,40 L700,40 L700,55 L730,55 L730,35 L750,35 L750,10 L770,10 L770,35 L800,35 L800,50 L830,50 L830,40 L850,40 L850,25 L870,25 L870,45 L900,45 L900,30 L920,30 L920,55 L950,55 L950,35 L975,35 L975,20 L1000,20 L1000,45 L1030,45 L1030,30 L1050,30 L1050,50 L1080,50 L1080,40 L1100,40 L1100,25 L1120,25 L1120,50 L1150,50 L1150,55 L1200,55 L1200,80 Z"
              fill={C.text}
            />
          </svg>

          {/* 道路ライン */}
          <div style={{ position: "absolute", bottom: 32, left: 0, width: "100%", height: 2, background: C.border }} />
          <div
            style={{
              position: "absolute",
              bottom: 37,
              left: 0,
              width: "100%",
              height: 1,
              backgroundImage: `repeating-linear-gradient(90deg, ${C.muted} 0px, ${C.muted} 16px, transparent 16px, transparent 32px)`,
              opacity: 0.35,
            }}
          />

          {/* トラック */}
          <div
            style={{
              position: "absolute",
              bottom: 36,
              animation: "r05TruckDrive 14s linear infinite",
            }}
          >
            <svg width="60" height="36" viewBox="0 0 60 36">
              <rect x="0" y="4" width="34" height="22" rx="2" fill={C.accent} />
              <rect x="2" y="6" width="30" height="18" rx="1" fill={C.white} opacity="0.3" />
              <rect x="34" y="10" width="20" height="16" rx="2" fill={C.accentDark} />
              <rect x="40" y="12" width="12" height="8" rx="1" fill="#b0d4f1" opacity="0.7" />
              <circle cx="14" cy="28" r="5" fill={C.text} />
              <circle cx="14" cy="28" r="2.5" fill={C.muted} />
              <circle cx="46" cy="28" r="5" fill={C.text} />
              <circle cx="46" cy="28" r="2.5" fill={C.muted} />
              <text x="8" y="18" fontSize="5" fill={C.white} fontWeight="700" fontFamily={F.accent}>GL</text>
            </svg>
          </div>
        </div>

        {/* ==========================================================
           下線アニメーション付きキャッチフレーズ
           ========================================================== */}
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

        {/* ==========================================================
           フッター --- footer-bg.webp背景 + ダークオーバーレイ
           ========================================================== */}
        <footer
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={IMG.footerBg}
            alt=""
            loading="lazy"
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
              background: "rgba(0,0,0,0.78)",
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
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
                        width: 30,
                        height: 30,
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
                  <p
                    style={{
                      fontFamily: "'Zen Kurenaido', 'Yomogi', sans-serif",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                      whiteSpace: "nowrap",
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
                </nav>
              </div>

              {/* 下部 */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  paddingTop: 24,
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                  〒{company.postalCode} {company.address}
                  <span style={{ margin: "0 8px" }}>|</span>
                  <a href={`tel:${company.phone}`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                    {company.phone}
                  </a>
                  <span style={{ margin: "0 8px" }}>|</span>
                  {company.hours}
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                  &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ==========================================================
   FormField コンポーネント
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
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
