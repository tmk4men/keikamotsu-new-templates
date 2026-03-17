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
  text: "#222222",
  sub: "#666666",
  accent: "#333333",
  cta: "#32373c",
  ctaHover: "#454c53",
  line: "#dddddd",
  lineSoft: "#eeeeee",
};

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
   FadeIn ラッパー
   ─────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────────────────────────
   セクションタイトル
   ─────────────────────────────────────────── */
function SectionTitle({
  en,
  ja,
  align = "center",
}: {
  en: string;
  ja: string;
  align?: "center" | "left";
}) {
  return (
    <div style={{ textAlign: align, marginBottom: 56 }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: 4,
          color: C.sub,
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 400,
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
        }}
      >
        {ja}
      </h2>
    </div>
  );
}

/* ───────────────────────────────────────────
   メインコンポーネント
   ─────────────────────────────────────────── */
export default function R03TrustPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const sectionPadWide: React.CSSProperties = {
    padding: "120px 24px",
    maxWidth: 1100,
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
    transition: "background 0.3s",
  };

  return (
    <div style={{ ...bodyFont, background: C.white, overflowX: "hidden" }}>
      {/* ============================================
          HEADER
          ============================================ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: C.white,
          borderBottom: `1px solid ${C.line}`,
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
          {/* ロゴ */}
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
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
            className="hide-sp"
          >
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.sub)}
              >
                {l.label}
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
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "none",
            }}
          >
            <div style={{ width: 22, height: 16, position: "relative" }}>
              {[0, 7, 14].map((top, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: menuOpen
                      ? i === 0
                        ? 7
                        : i === 1
                        ? 7
                        : 7
                      : top,
                    width: 22,
                    height: 1.5,
                    background: C.text,
                    borderRadius: 1,
                    transition: "top 0.3s, transform 0.3s, opacity 0.3s",
                    transform: menuOpen
                      ? i === 0
                        ? "rotate(45deg)"
                        : i === 1
                        ? "scaleX(0)"
                        : "rotate(-45deg)"
                      : "none",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </div>
          </button>
        </div>

        {/* モバイルメニュー */}
        {menuOpen && (
          <div
            style={{
              background: C.white,
              borderTop: `1px solid ${C.line}`,
              padding: "24px",
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  color: C.text,
                  textDecoration: "none",
                  fontSize: 14,
                  borderBottom: `1px solid ${C.lineSoft}`,
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                display: "block",
                padding: "16px 0 0",
                color: C.text,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              TEL {company.phone}
            </a>
          </div>
        )}
      </header>

      {/* ============================================
          HERO
          ============================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `url(/images/team.webp) center/cover no-repeat`,
          marginTop: 64,
        }}
      >
        {/* オーバーレイ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "60px 24px",
            maxWidth: 720,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 42px)",
              fontWeight: 600,
              color: "#fff",
              fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              lineHeight: 1.7,
              marginBottom: 24,
              letterSpacing: 2,
            }}
          >
            {hero.headlineParts.map((line, i) => (
              <span key={i}>
                {line}
                {i < hero.headlineParts.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 15,
              lineHeight: 2,
              marginBottom: 40,
              fontWeight: 400,
            }}
          >
            {hero.subtext[0]}
            <br />
            {hero.subtext[1]}
          </p>
          <a
            href="#apply"
            style={{
              ...btnBase,
              padding: "18px 56px",
              fontSize: 16,
              background: C.cta,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.ctaHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.cta)}
          >
            {hero.cta}
          </a>
        </div>
      </section>

      {/* ============================================
          INTRO STRIP
          ============================================ */}
      <section
        style={{
          background: C.bg,
          padding: "36px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "clamp(14px, 2.8vw, 17px)",
            fontWeight: 600,
            color: C.text,
            letterSpacing: 2,
            margin: 0,
          }}
        >
          学歴・経験いっさい不問。20〜60代活躍中。
        </p>
      </section>

      {/* ============================================
          REASONS（選ばれる理由）
          ============================================ */}
      <section id="reasons" style={{ padding: "130px 0 110px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <SectionTitle en="Reasons" ja="選ばれる理由" />
          </FadeIn>
        </div>
        {reasons.map((r, i) => (
          <FadeIn key={r.num} delay={i * 0.1}>
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
              {/* 写真 */}
              <div
                style={{
                  flex: "1 1 50%",
                  minWidth: 300,
                  aspectRatio: r.num === "01" ? "3/2" : r.num === "02" ? "4/3" : "16/9",
                  background: `url(/keikamotsu-new-templates/images/strength-${r.num}.webp) center/cover no-repeat`,
                  borderRadius: 4,
                }}
              />
              {/* テキスト */}
              <div
                style={{
                  flex: "1 1 50%",
                  minWidth: 300,
                  padding: "48px clamp(24px, 5vw, 64px)",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: 3,
                    color: C.sub,
                    fontWeight: 400,
                  }}
                >
                  ─ REASON {r.num}
                </span>
                <h3
                  style={{
                    fontSize: "clamp(20px, 3.5vw, 26px)",
                    fontWeight: 600,
                    color: C.text,
                    fontFamily:
                      "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                    lineHeight: 1.6,
                    margin: "16px 0 20px",
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: C.sub,
                    lineHeight: 2,
                  }}
                >
                  {typeof r.text === 'string' && r.text.includes('\n')
                    ? r.text.split('\n').map((line, li) => <span key={li}>{line}{li < r.text.split('\n').length - 1 && <br />}</span>)
                    : r.text}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ============================================
          JOBS（求人情報）
          ============================================ */}
      <section id="jobs" style={{ background: C.bg }}>
        <div style={{ padding: "140px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Job Info" ja="求人情報" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              style={{
                textAlign: "center",
                color: C.sub,
                fontSize: 15,
                lineHeight: 2,
                marginBottom: 48,
              }}
            >
              {jobs.intro}
            </p>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 15,
              }}
            >
              <tbody>
                {jobs.rows.map((row) => (
                  <tr key={row.dt}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px 16px 16px 0",
                        borderBottom: `1px solid ${C.line}`,
                        fontWeight: 600,
                        color: C.text,
                        width: "28%",
                        verticalAlign: "top",
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ color: C.accent, marginRight: 8 }}>▪</span>{row.dt}
                    </th>
                    <td
                      style={{
                        padding: "16px 0",
                        borderBottom: `1px solid ${C.line}`,
                        color: row.accent ? C.text : C.sub,
                        fontWeight: row.accent ? 600 : 400,
                        lineHeight: 1.8,
                      }}
                    >
                      {row.dd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 応募要件 */}
            <div style={{ marginTop: 40 }}>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                応募要件
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {jobs.requirements.map((r) => (
                  <li
                    key={r}
                    style={{
                      padding: "6px 0",
                      color: C.sub,
                      fontSize: 14,
                      lineHeight: 1.8,
                    }}
                  >
                    — {r}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          BENEFITS（待遇・福利厚生）
          ============================================ */}
      <section id="benefits">
        <div style={{ padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Benefits" ja="待遇・福利厚生" />
          </FadeIn>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.06}>
                <li
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "20px 0",
                    borderBottom:
                      i < benefits.length - 1
                        ? `1px solid ${C.lineSoft}`
                        : "none",
                  }}
                >
                  {/* チェックマーク */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                      color: C.accent,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    &#x2713;
                  </span>
                  <div>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: C.text,
                        margin: "0 0 6px",
                        fontFamily:
                          "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                      }}
                    >
                      {b.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.sub,
                        margin: 0,
                        lineHeight: 1.9,
                      }}
                    >
                      {typeof b.text === 'string' && b.text.includes('\n')
                        ? b.text.split('\n').map((line, li) => <span key={li}>{line}{li < b.text.split('\n').length - 1 && <br />}</span>)
                        : b.text}
                    </p>
                  </div>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================
          DAILY（1日の流れ）
          ============================================ */}
      <section id="daily" style={{ background: C.bg }}>
        <div style={{ padding: "155px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Daily Schedule" ja="1日の流れ" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              style={{
                textAlign: "center",
                color: C.sub,
                fontSize: 15,
                lineHeight: 2,
                marginBottom: 56,
              }}
            >
              {daily.intro}
            </p>
          </FadeIn>
          <div>
            {daily.steps.map((s, i) => (
              <FadeIn key={s.time} delay={i * 0.06}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "clamp(20px, 4vw, 48px)",
                    padding: "28px 0",
                    borderBottom:
                      i < daily.steps.length - 1
                        ? `1px solid ${C.line}`
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(28px, 5vw, 40px)",
                      fontWeight: 600,
                      color: C.text,
                      fontFamily:
                        "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                      flexShrink: 0,
                      width: "clamp(80px, 12vw, 120px)",
                      letterSpacing: 1,
                      lineHeight: 1.2,
                    }}
                  >
                    <span style={{ fontSize: 10, verticalAlign: "middle", marginRight: 6 }}>●</span>{s.time}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: C.text,
                        margin: "0 0 8px",
                      }}
                    >
                      {s.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.sub,
                        margin: 0,
                        lineHeight: 1.9,
                      }}
                    >
                      {typeof s.desc === 'string' && s.desc.includes('\n')
                        ? s.desc.split('\n').map((line, li) => <span key={li}>{line}{li < s.desc.split('\n').length - 1 && <br />}</span>)
                        : s.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          VOICES（先輩の声）
          ============================================ */}
      <section id="voices">
        <div style={{ padding: "120px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Voices" ja="先輩の声" />
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {voices.map((v, i) => (
              <FadeIn key={v.name} delay={i * 0.08}>
                <div
                  style={{
                    padding: "48px clamp(24px, 5vw, 56px)",
                    background: C.bg,
                    border: "none",
                  }}
                >
                  {/* イニシャル */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 600,
                      marginBottom: 24,
                      fontFamily:
                        "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                    }}
                  >
                    {v.name.charAt(0)}
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.sub,
                      lineHeight: 2.1,
                      marginBottom: 24,
                    }}
                  >
                    {typeof v.text === 'string' && v.text.includes('\n')
                      ? v.text.split('\n').map((line, li) => <span key={li}>{line}{li < v.text.split('\n').length - 1 && <br />}</span>)
                      : v.text}
                  </p>
                  <div
                    style={{
                      fontSize: 13,
                      color: C.sub,
                      borderTop: `1px solid ${C.line}`,
                      paddingTop: 16,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: C.text }}>
                      {v.name}
                    </span>
                    <span style={{ marginLeft: 12 }}>
                      {v.age}・{v.prev}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          GALLERY（職場の雰囲気）
          ============================================ */}
      <section id="gallery" style={{ background: C.bg }}>
        <div style={{ padding: "145px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Gallery" ja={gallery.heading} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              style={{
                textAlign: "center",
                color: C.sub,
                fontSize: 15,
                lineHeight: 2,
                marginBottom: 48,
              }}
            >
              {gallery.intro}
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr 1fr",
                gap: 8,
              }}
            >
              {gallery.images.slice(0, 3).map((img) => (
                <div
                  key={img.src}
                  style={{
                    aspectRatio: "4/3",
                    background: `url(${img.src}) center/cover no-repeat`,
                    filter: "grayscale(20%)",
                    borderRadius: 4,
                  }}
                  title={img.caption}
                />
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 8,
                marginTop: 8,
              }}
            >
              {gallery.images.slice(3, 5).map((img) => (
                <div
                  key={img.src}
                  style={{
                    aspectRatio: "3/2",
                    background: `url(${img.src}) center/cover no-repeat`,
                    filter: "grayscale(20%)",
                    borderRadius: 4,
                  }}
                  title={img.caption}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          FAQ
          ============================================ */}
      <section id="faq">
        <div style={{ padding: "108px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="FAQ" ja="よくある質問" />
          </FadeIn>
          <div>
            {faq.map((item, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <details
                  style={{
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  <summary
                    style={{
                      padding: "22px 0",
                      fontSize: 15,
                      fontWeight: 600,
                      color: C.text,
                      cursor: "pointer",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span><span style={{ color: C.sub, marginRight: 8 }}>&#x25B8;</span>{item.q}</span>
                    <span
                      style={{
                        fontSize: 18,
                        color: C.sub,
                        flexShrink: 0,
                        fontWeight: 300,
                        transition: "transform 0.3s",
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <div
                    style={{
                      padding: "0 0 24px",
                      fontSize: 14,
                      color: C.sub,
                      lineHeight: 2,
                    }}
                  >
                    {typeof item.a === 'string' && item.a.includes('\n')
                      ? item.a.split('\n').map((line, li) => <span key={li}>{line}{li < item.a.split('\n').length - 1 && <br />}</span>)
                      : item.a}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          NEWS（お知らせ）
          ============================================ */}
      <section id="news" style={{ background: C.bg }}>
        <div style={{ padding: "160px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="News" ja="お知らせ" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              {news.map((n, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "18px 0",
                    borderBottom:
                      i < news.length - 1 ? `1px solid ${C.line}` : "none",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: C.sub,
                      flexShrink: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <span style={{ marginRight: 6 }}>─</span>{n.date}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 10px",
                      border: `1px solid ${
                        n.tagStyle === "urgent"
                          ? C.text
                          : n.tagStyle === "new"
                          ? C.accent
                          : C.line
                      }`,
                      color:
                        n.tagStyle === "urgent"
                          ? C.text
                          : n.tagStyle === "new"
                          ? C.accent
                          : C.sub,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {n.tag}
                  </span>
                  <span style={{ fontSize: 14, color: C.text }}>{n.title}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          ACCESS
          ============================================ */}
      <section id="access">
        {/* 全幅マップ */}
        <div style={{ width: "100%", height: 360, background: C.bg }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.123!2d135.6283!3d34.7662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5aSn6Ziq5bqc5a-d5bGL5bed5biC5rGg55SwMi0xMS01NQ!5e0!3m2!1sja!2sjp!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block", filter: "grayscale(30%)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div style={{ padding: "115px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Access" ja={access.heading} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 15, color: C.text, marginBottom: 8 }}>
                {company.address}
              </p>
              <p style={{ fontSize: 14, color: C.sub, marginBottom: 8 }}>
                {access.nearestStation}
              </p>
              <p style={{ fontSize: 14, color: C.sub }}>{access.mapNote}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          COMPANY（会社概要）
          ============================================ */}
      <section id="company" style={{ background: C.bg }}>
        <div style={{ padding: "135px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Company" ja="会社概要" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 15,
              }}
            >
              <tbody>
                {companyInfo.map((row) => (
                  <tr key={row.dt}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px 16px 16px 0",
                        borderBottom: `1px solid ${C.line}`,
                        fontWeight: 600,
                        color: C.text,
                        width: "28%",
                        verticalAlign: "top",
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.dt}
                    </th>
                    <td
                      style={{
                        padding: "16px 0",
                        borderBottom: `1px solid ${C.line}`,
                        color: C.sub,
                        lineHeight: 1.8,
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
      </section>

      {/* ============================================
          APPLY（応募フォーム）
          ============================================ */}
      <section id="apply">
        <div style={{ padding: "150px 24px", maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <SectionTitle en="Apply" ja="応募フォーム" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              style={{
                textAlign: "center",
                color: C.sub,
                fontSize: 15,
                lineHeight: 2,
                marginBottom: 56,
              }}
            >
              下記フォームに必要事項をご記入の上、送信してください。
              <br />
              折り返し担当者よりご連絡いたします。
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              {[
                { label: "お名前", name: "name", type: "text", required: true },
                {
                  label: "ふりがな",
                  name: "kana",
                  type: "text",
                  required: true,
                },
                {
                  label: "年齢",
                  name: "age",
                  type: "select",
                  required: true,
                },
                {
                  label: "電話番号",
                  name: "phone",
                  type: "tel",
                  required: true,
                },
                {
                  label: "メールアドレス",
                  name: "email",
                  type: "email",
                  required: false,
                },
              ].map((f) => (
                <div key={f.name} style={{ marginBottom: 36 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 10,
                    }}
                  >
                    {f.label}
                    {f.required && (
                      <span
                        style={{
                          fontSize: 11,
                          color: C.sub,
                          marginLeft: 8,
                          fontWeight: 400,
                        }}
                      >
                        必須
                      </span>
                    )}
                  </label>
                  {f.type === "select" ? (
                    <select
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      required={f.required}
                      style={{
                        width: "100%",
                        padding: "12px 0",
                        fontSize: 15,
                        border: "none",
                        borderBottom: `1px solid ${C.line}`,
                        background: "transparent",
                        color: C.text,
                        outline: "none",
                        borderRadius: 2,
                        appearance: "none",
                      }}
                    >
                      <option value="">選択してください</option>
                      {["10代", "20代", "30代", "40代", "50代", "60代以上"].map(
                        (a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      required={f.required}
                      style={{
                        width: "100%",
                        padding: "12px 0",
                        fontSize: 15,
                        border: "none",
                        borderBottom: `1px solid ${C.line}`,
                        background: "transparent",
                        color: C.text,
                        outline: "none",
                        borderRadius: 2,
                        boxSizing: "border-box",
                      }}
                    />
                  )}
                </div>
              ))}

              {/* メッセージ */}
              <div style={{ marginBottom: 48 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 10,
                  }}
                >
                  メッセージ・質問
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    fontSize: 15,
                    border: "none",
                    borderBottom: `1px solid ${C.line}`,
                    background: "transparent",
                    color: C.text,
                    outline: "none",
                    borderRadius: 2,
                    resize: "vertical",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  style={{
                    ...btnBase,
                    padding: "18px 72px",
                    fontSize: 15,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.ctaHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = C.cta)
                  }
                >
                  送信する
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(/keikamotsu-new-templates/images/delivery.webp) center/cover no-repeat`,
          padding: "125px 24px",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <p
            style={{
              fontSize: "clamp(18px, 3.5vw, 24px)",
              fontWeight: 600,
              color: "#fff",
              fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            {cta.heading}
          </p>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 2,
              maxWidth: 560,
              margin: "0 auto 40px",
            }}
          >
            {cta.subtext}
          </p>
          <a
            href={`tel:${cta.phone}`}
            style={{
              display: "block",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            {cta.phone}
          </a>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 36,
            }}
          >
            {company.hours}
          </p>
          <a
            href="#apply"
            style={{
              ...btnBase,
              padding: "16px 56px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.ctaHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.cta)}
          >
            {cta.webLabel}
          </a>
        </FadeIn>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer
        style={{
          background: C.text,
          color: "rgba(255,255,255,0.6)",
          padding: "56px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          {company.nameEn}
        </p>
        <p style={{ fontSize: 13, marginBottom: 24, lineHeight: 1.8 }}>
          {company.address}
        </p>
        <p style={{ fontSize: 11, letterSpacing: 1 }}>
          &copy; {new Date().getFullYear()} {company.name} All rights reserved.
        </p>
      </footer>

      {/* ============================================
          レスポンシブ + summary marker 除去
          ============================================ */}
      <style>{`
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
      `}</style>
    </div>
  );
}
