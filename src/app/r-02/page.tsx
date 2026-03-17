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

/* ─── カラー定数 ─── */
const C = {
  white: "#ffffff",
  bg: "#f7f8fa",
  text: "#1a1a2e",
  textSub: "#555555",
  blue: "#0077b6",
  blueLight: "#00b4d8",
  bluePale: "#e8f4f8",
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

/* ─── アニメーション スタイル ─── */
function slideUp(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s cubic-bezier(.23,1,.32,1) ${delay}s, transform 0.7s cubic-bezier(.23,1,.32,1) ${delay}s`,
  };
}

function slideLeft(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-12px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  };
}

function slideRight(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(12px)",
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

/* ───────────────────────────────────────
   メインコンポーネント
   ─────────────────────────────────────── */
export default function R02Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <>
      {/* ─── Google Fonts ─── */}
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
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }

        input:focus, textarea:focus, select:focus {
          outline: 2px solid ${C.blue};
          outline-offset: 1px;
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
          background: C.white,
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "border-color 0.3s",
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
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`,
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
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textSub,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.blue)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textSub)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#apply"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.white,
                background: C.blue,
                padding: "8px 20px",
                borderRadius: 50,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.blueLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}
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
                background: C.blue,
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
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/videos/hero-bright.mp4" type="video/mp4" />
          </video>
          {/* 明るいオーバーレイ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(232,244,248,0.82) 100%)",
            }}
          />

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
            {/* バッジ */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 28,
                ...slideUp(heroRef.visible, 0),
              }}
            >
              {hero.badges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    background: C.bluePale,
                    color: C.blue,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "6px 18px",
                    borderRadius: 50,
                    border: `1px solid ${C.blue}22`,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            {/* キャッチコピー */}
            {hero.headlineParts.map((line, i) => (
              <h1
                key={i}
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 5vw, 52px)",
                  lineHeight: 1.3,
                  color: C.text,
                  marginBottom: i === hero.headlineParts.length - 1 ? 24 : 4,
                  ...slideLeft(heroRef.visible, 0.1 + i * 0.15),
                }}
              >
                {line}
              </h1>
            ))}

            {/* サブテキスト */}
            <div style={{ marginBottom: 32, ...slideUp(heroRef.visible, 0.35) }}>
              {hero.subtext.map((t, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(14px, 2vw, 16px)",
                    color: C.textSub,
                    lineHeight: 1.9,
                  }}
                >
                  {t}
                </p>
              ))}
            </div>

            {/* 月収 */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 6,
                marginBottom: 36,
                ...bounceIn(heroRef.visible, 0.5),
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
                  color: C.blue,
                  lineHeight: 1,
                }}
              >
                {hero.salaryMin}
              </span>
              <span style={{ fontSize: 20, color: C.textSub, fontWeight: 500 }}>
                万〜
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(48px, 8vw, 72px)",
                  color: C.blue,
                  lineHeight: 1,
                }}
              >
                {hero.salaryMax}
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
                ...slideUp(heroRef.visible, 0.65),
              }}
            >
              <a
                href="#apply"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.blue,
                  color: C.white,
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "16px 36px",
                  borderRadius: 50,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.blueLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.blue;
                }}
              >
                {hero.cta}
                <span style={{ fontSize: 20 }}>→</span>
              </a>
              <a
                href={`tel:${company.phone.replace(/-/g, "")}`}
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
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                {company.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            3. MARQUEE
            ═══════════════════════════════════ */}
        <section
          ref={marqueeRef.ref}
          style={{
            background: C.blue,
            padding: "14px 0",
            overflow: "hidden",
            ...slideUp(marqueeRef.visible),
          }}
        >
          {[marquee.top, marquee.bottom].map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                animation: `marqueeScroll ${28 + ri * 6}s linear infinite`,
                animationDirection: ri === 1 ? "reverse" : "normal",
                marginBottom: ri === 0 ? 6 : 0,
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
                    padding: "0 32px",
                    opacity: 0.95,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </section>

        {/* ═══════════════════════════════════
            4. REASONS
            ═══════════════════════════════════ */}
        <section
          id="reasons"
          ref={reasonsRef.ref}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 24px 60px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(reasonsRef.visible) }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.blue,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Why Choose Us
            </p>
            <h2
              style={{
                fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.text,
              }}
            >
              選ばれる<span style={{ color: C.blue }}>3つ</span>の理由
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
                style={{
                  display: "flex",
                  gap: 24,
                  background: C.white,
                  borderRadius: "0.75rem",
                  padding: "36px 32px",
                  boxShadow: shadowMain,
                  border: `1px solid ${C.border}`,
                  transition: "box-shadow 0.3s, border-color 0.3s",
                  cursor: "default",
                  ...slideRight(reasonsRef.visible, 0.1 + i * 0.15),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadowMainHover;
                  e.currentTarget.style.borderColor = C.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = shadowMain;
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(40px, 5vw, 56px)",
                    color: `${C.blue}18`,
                    lineHeight: 1,
                    minWidth: 70,
                    flexShrink: 0,
                  }}
                >
                  {r.num}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(18px, 2.5vw, 22px)",
                      color: C.text,
                      marginBottom: 10,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textSub,
                      lineHeight: 1.85,
                    }}
                  >
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════
            5. JOBS
            ═══════════════════════════════════ */}
        <section
          id="jobs"
          ref={jobsRef.ref}
          style={{
            background: C.bg,
            padding: "110px 24px 90px",
          }}
        >
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(jobsRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Recruit
              </p>
              <h2
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                求人情報
              </h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8 }}>
                {jobs.intro}
              </p>
            </div>

            <div
              style={{
                background: C.white,
                borderRadius: "1.25rem",
                boxShadow: shadowMain,
                overflow: "hidden",
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
                          background: row.accent ? `${C.blue}10` : "transparent",
                          borderBottom: `1px solid ${C.border}`,
                          width: "28%",
                          verticalAlign: "top",
                        }}
                      >
                        {row.dt}
                      </th>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 14,
                          color: row.accent ? C.blue : C.textSub,
                          fontWeight: row.accent ? 700 : 400,
                          background: row.accent ? `${C.blue}10` : "transparent",
                          borderBottom: `1px solid ${C.border}`,
                          lineHeight: 1.7,
                        }}
                      >
                        {row.dd}
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
                        background: C.bluePale,
                        color: C.blue,
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

        {/* ═══════════════════════════════════
            6. BENEFITS
            ═══════════════════════════════════ */}
        <section
          id="benefits"
          ref={benefitsRef.ref}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "105px 24px 88px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(benefitsRef.visible) }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.blue,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Benefits
            </p>
            <h2
              style={{
                fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.text,
              }}
            >
              待遇・福利厚生
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
                style={{
                  background: C.white,
                  borderRadius: "0.75rem",
                  padding: "32px 24px",
                  boxShadow: shadowSub,
                  border: `1px solid ${C.border}`,
                  transition: "box-shadow 0.3s, border-color 0.3s",
                  ...bounceIn(benefitsRef.visible, 0.08 * i),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadowSubHover;
                  e.currentTarget.style.borderColor = C.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = shadowSub;
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: C.bluePale,
                    color: C.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
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
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════
            7. DAILY
            ═══════════════════════════════════ */}
        <section
          id="daily"
          ref={dailyRef.ref}
          style={{
            background: C.bg,
            padding: "100px 24px 80px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(dailyRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Daily Schedule
              </p>
              <h2
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                1日の流れ
              </h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
                {daily.intro}
              </p>
            </div>

            {/* 水平タイムライン */}
            <div
              style={{
                position: "relative",
                overflowX: "auto",
                paddingBottom: 16,
              }}
            >
              {/* 接続ライン（デスクトップ） */}
              <div
                className="timeline-line"
                style={{
                  position: "absolute",
                  top: 28,
                  left: 40,
                  right: 40,
                  height: 3,
                  background: `${C.blue}30`,
                  borderRadius: 2,
                }}
              />
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
                      ...slideUp(dailyRef.visible, 0.1 + i * 0.1),
                    }}
                  >
                    {/* ドット */}
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: C.blue,
                        border: `3px solid ${C.white}`,
                        boxShadow: `0 0 0 3px ${C.blue}40`,
                        margin: "0 auto 18px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 22,
                        color: C.blue,
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
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            8. GALLERY
            ═══════════════════════════════════ */}
        <section
          id="gallery"
          ref={galleryRef.ref}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 70px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(galleryRef.visible) }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.blue,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Workplace
            </p>
            <h2
              style={{
                fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.text,
                marginBottom: 16,
              }}
            >
              {gallery.heading}
            </h2>
            <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8 }}>
              {gallery.intro}
            </p>
          </div>

          {/* 不均等グリッド: 大1枚 + 小4枚 */}
          <div
            className="gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gridTemplateRows: "240px 240px",
              gap: 16,
              ...slideUp(galleryRef.visible, 0.15),
            }}
          >
            <style>{`
              @media (max-width: 768px) {
                .gallery-grid {
                  grid-template-columns: 1fr !important;
                  grid-template-rows: auto !important;
                }
                .gallery-grid > div:first-child {
                  grid-row: span 1 !important;
                }
              }
            `}</style>
            {gallery.images.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: i === 0 ? "1.25rem" : "0.75rem",
                  overflow: "hidden",
                  cursor: "pointer",
                  ...(i === 0 ? { gridRow: "span 2" } : {}),
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
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                {/* ホバーオーバーレイ+キャプション */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 20,
                    opacity: 0,
                    transition: "opacity 0.35s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  <p
                    style={{
                      color: C.white,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════
            9. VOICES
            ═══════════════════════════════════ */}
        <section
          id="voices"
          ref={voicesRef.ref}
          style={{
            background: C.bg,
            padding: "95px 24px 75px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(voicesRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Voices
              </p>
              <h2
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                先輩ドライバーの声
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
                    background: C.white,
                    borderRadius: "0.75rem",
                    padding: "32px 28px",
                    boxShadow: shadowSub,
                    border: `1px solid ${C.border}`,
                    position: "relative",
                    transition: "box-shadow 0.3s, border-color 0.3s",
                    ...slideUp(voicesRef.visible, 0.1 + i * 0.1),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = shadowSubHover;
                    e.currentTarget.style.borderColor = C.blue;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = shadowSub;
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  {/* 大きなクォート */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 20,
                      fontFamily: "'DM Sans', serif",
                      fontSize: 72,
                      lineHeight: 1,
                      color: `${C.blue}15`,
                      fontWeight: 700,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    &ldquo;
                  </div>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`,
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

                    <p
                      style={{
                        fontSize: 14,
                        color: C.textSub,
                        lineHeight: 1.85,
                        marginBottom: 14,
                      }}
                    >
                      {v.text}
                    </p>

                    <div
                      style={{
                        display: "inline-block",
                        background: C.bluePale,
                        color: C.blue,
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "5px 14px",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {v.highlight}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            10. FAQ
            ═══════════════════════════════════ */}
        <section
          id="faq"
          ref={faqRef.ref}
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "90px 24px 85px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56, ...slideUp(faqRef.visible) }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.blue,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              FAQ
            </p>
            <h2
              style={{
                fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.text,
              }}
            >
              よくある質問
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    background: C.white,
                    borderRadius: "0.75rem",
                    boxShadow: shadowSub,
                    border: `1px solid ${C.border}`,
                    overflow: "hidden",
                    ...slideUp(faqRef.visible, 0.05 * i),
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
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: 16,
                          color: C.blue,
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
                        background: isOpen ? C.blue : C.bluePale,
                        color: isOpen ? C.white : C.blue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 500,
                        flexShrink: 0,
                        transition: "background 0.2s, color 0.2s, transform 0.3s",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(.23,1,.32,1)",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 24px 20px 54px",
                        fontSize: 14,
                        color: C.textSub,
                        lineHeight: 1.85,
                      }}
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════
            11. NEWS
            ═══════════════════════════════════ */}
        <section
          id="news"
          ref={newsRef.ref}
          style={{
            background: C.bg,
            padding: "75px 24px 65px",
          }}
        >
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(newsRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                News
              </p>
              <h2
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                }}
              >
                お知らせ
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {news.map((n, i) => {
                const tagColors: Record<string, { bg: string; color: string }> = {
                  urgent: { bg: "#fee2e2", color: "#dc2626" },
                  new: { bg: C.bluePale, color: C.blue },
                  default: { bg: "#f3f4f6", color: C.textSub },
                };
                const tc = tagColors[n.tagStyle] || tagColors.default;
                return (
                  <div
                    key={i}
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
                      transition: "border-color 0.2s",
                      ...slideLeft(newsRef.visible, 0.08 * i),
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: C.textSub,
                        flexShrink: 0,
                      }}
                    >
                      {n.date}
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

        {/* ═══════════════════════════════════
            12. ACCESS
            ═══════════════════════════════════ */}
        <section
          id="access"
          ref={accessRef.ref}
          style={{
            background: C.blue,
            padding: "84px 24px 76px",
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
                Access
              </p>
              <h2
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.white,
                }}
              >
                {access.heading}
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
                        color: C.blue,
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

        {/* ═══════════════════════════════════
            13. COMPANY
            ═══════════════════════════════════ */}
        <section
          id="company"
          ref={companyRef.ref}
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "88px 24px 72px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(companyRef.visible) }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.blue,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Company
            </p>
            <h2
              style={{
                fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.text,
              }}
            >
              会社概要
            </h2>
          </div>

          <div
            style={{
              background: C.white,
              borderRadius: "1.25rem",
              boxShadow: shadowMain,
              overflow: "hidden",
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
                      {row.dd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════
            14. APPLY FORM
            ═══════════════════════════════════ */}
        <section
          id="apply"
          ref={applyRef.ref}
          style={{
            background: C.bg,
            padding: "92px 24px 78px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...slideUp(applyRef.visible) }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Entry
              </p>
              <h2
                style={{
                  fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  color: C.text,
                  marginBottom: 12,
                }}
              >
                応募フォーム
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
                  { label: "お名前", type: "text", name: "name", required: true },
                  { label: "電話番号", type: "tel", name: "phone", required: true },
                  { label: "メールアドレス", type: "email", name: "email", required: false },
                  { label: "年齢", type: "text", name: "age", required: false },
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
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        fontSize: 15,
                        border: `1px solid ${C.border}`,
                        borderRadius: "0.5rem",
                        background: C.bg,
                        color: C.text,
                        fontFamily: "'Noto Sans JP', sans-serif",
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
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      background: C.bg,
                      color: C.text,
                      fontFamily: "'Noto Sans JP', sans-serif",
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
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 15,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      background: C.bg,
                      color: C.text,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.white,
                    background: C.blue,
                    border: "none",
                    borderRadius: 50,
                    cursor: "pointer",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.blueLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.blue;
                  }}
                >
                  送信する
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            15. CTA SECTION
            ═══════════════════════════════════ */}
        <section
          ref={ctaRef.ref}
          style={{
            background: C.blue,
            padding: "120px 24px 130px",
          }}
        >
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
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
              {cta.heading}
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
              {cta.subtext}
            </p>

            <a
              href={`tel:${cta.phone.replace(/-/g, "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: C.white,
                color: C.blue,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 36px)",
                padding: "18px 44px",
                borderRadius: 50,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.2s",
                marginBottom: 20,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                style={{
                  display: "inline-block",
                  background: "transparent",
                  color: C.white,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 40px",
                  borderRadius: 50,
                  border: `2px solid ${C.white}`,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${C.white}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
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
        }}
      >
        <div
          className="footer-cols"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.5fr 1.05fr 0.95fr",
            gap: 48,
            marginBottom: 48,
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
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`,
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.blueLight)}
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
                    color: C.blueLight,
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
          }}
        >
          &copy; {new Date().getFullYear()} {company.name} All rights reserved.
        </div>
      </footer>
    </>
  );
}
