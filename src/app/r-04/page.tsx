"use client";

import React, { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import {
  company,
  navLinks,
  hero,
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
  footer,
  meta,
} from "@/data/siteData";

/* ═══════════════════════════════════════════
   カラー定数
   ═══════════════════════════════════════════ */
const C = {
  bg: "#fafaf9",
  white: "#ffffff",
  dark: "#1a1a1a",
  darkSoft: "#232323",
  text: "#2d2d2d",
  muted: "#888888",
  mutedLight: "#b5b5b5",
  accent: "#32373c",
  accentLight: "#555555",
  cta: "#32373c",
  ctaHover: "#3e444a",
  border: "#e0ddd8",
  borderDark: "#333333",
};

/* ═══════════════════════════════════════════
   フォントスタック
   ═══════════════════════════════════════════ */
const F = {
  heading: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
  sans: "'Noto Sans JP', sans-serif",
  accent: "'Oswald', 'Zen Kaku Gothic New', sans-serif",
};

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
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ═══════════════════════════════════════════
   スクロール方向検知フック
   ═══════════════════════════════════════════ */
function useScrollDirection() {
  const [show, setShow] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 60);
      setShow(y < 60 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { show, atTop };
}

/* ═══════════════════════════════════════════
   パララックスフック
   ═══════════════════════════════════════════ */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * speed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return { ref, offset };
}

/* ═══════════════════════════════════════════
   FadeIn ラッパー
   ═══════════════════════════════════════════ */
function FadeIn({ children, delay = 0, direction = "up", style = {} }: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView(0.1);
  const transforms: Record<string, string> = {
    up: "translateY(12px)",
    left: "translateX(-12px)",
    right: "translateX(12px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   メインコンポーネント
   ═══════════════════════════════════════════ */
export default function R04Flow() {
  const { show, atTop } = useScrollDirection();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const sectionPadding = "140px 0 160px";
  const sectionPaddingMobile = "80px 0 90px";

  /* レスポンシブ判定 */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pad = isMobile ? sectionPaddingMobile : sectionPadding;
  const containerW = isMobile ? "90%" : "min(1080px, 88%)";

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;600;700&family=Oswald:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        details summary { cursor: pointer; list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <div style={{ fontFamily: F.sans, fontWeight: 300, color: C.text, background: C.bg, lineHeight: 1.9 }}>

        {/* ════════════════════════════════════════
           HEADER
           ════════════════════════════════════════ */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            transform: show ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
            background: atTop ? "transparent" : C.bg,
            borderBottom: atTop ? "none" : `1px solid ${C.border}`,
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: isMobile ? "14px 20px" : "18px 48px",
          }}>
            <a href="#" style={{
              fontFamily: F.heading, fontSize: isMobile ? "16px" : "18px",
              fontWeight: 600, color: atTop ? "#fff" : C.text,
              letterSpacing: "0.08em", transition: "color 0.3s",
            }}>
              {company.nameEn}
            </a>

            {/* Desktop Nav */}
            {!isMobile && (
              <nav style={{ display: "flex", gap: "28px" }}>
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} style={{
                    fontSize: "12px", color: atTop ? "rgba(255,255,255,0.7)" : C.muted,
                    letterSpacing: "0.06em", transition: "color 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = atTop ? "rgba(255,255,255,0.7)" : C.muted)}
                  >
                    {l.label}
                  </a>
                ))}
                <a href="#apply" style={{
                  fontSize: "12px", color: atTop ? "#fff" : C.cta,
                  fontWeight: 500, letterSpacing: "0.06em", transition: "color 0.3s",
                  borderBottom: `1px solid ${atTop ? "rgba(255,255,255,0.4)" : C.accent}`,
                  paddingBottom: "2px",
                }}>
                  応募する
                </a>
              </nav>
            )}

            {/* Mobile Burger */}
            {isMobile && (
              <button
                onClick={() => setMobileNav(!mobileNav)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: "5px", padding: "4px",
                }}
                aria-label="メニュー"
              >
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: "block", width: "22px", height: "1.5px",
                    background: atTop ? "#fff" : C.text,
                    transition: "transform 0.3s, opacity 0.3s",
                    transform: mobileNav
                      ? i === 0 ? "rotate(45deg) translate(4px, 4px)" : i === 2 ? "rotate(-45deg) translate(4px, -4px)" : "scaleX(0)"
                      : "none",
                  }} />
                ))}
              </button>
            )}
          </div>

          {/* Mobile Drawer */}
          {isMobile && mobileNav && (
            <nav style={{
              background: C.bg,
              padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: "18px",
              borderBottom: `1px solid ${C.border}`,
            }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileNav(false)}
                  style={{ fontFamily: F.heading, fontSize: "15px", color: C.text, letterSpacing: "0.04em" }}>
                  {l.label}
                </a>
              ))}
              <a href="#apply" onClick={() => setMobileNav(false)}
                style={{
                  fontFamily: F.heading, fontSize: "15px", color: C.accent,
                  borderBottom: `1px solid ${C.accent}`, alignSelf: "flex-start", paddingBottom: "2px",
                }}>
                応募する
              </a>
            </nav>
          )}
        </header>

        {/* ════════════════════════════════════════
           HERO
           ════════════════════════════════════════ */}
        <section style={{
          position: "relative", height: "100vh", minHeight: "600px",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <video
            autoPlay muted loop playsInline
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              objectFit: "cover", zIndex: 0,
            }}
          >
            <source src="/keikamotsu-new-templates/videos/hero-daytime.mp4" type="video/mp4" />
          </video>
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)",
          }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
            <FadeIn delay={0.3}>
              <p style={{
                fontFamily: F.accent, fontSize: isMobile ? "11px" : "13px",
                color: "rgba(255,255,255,0.6)", letterSpacing: "0.3em",
                marginBottom: isMobile ? "16px" : "24px", textTransform: "uppercase",
              }}>
                Green Logistics Recruiting
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <h1 style={{
                fontFamily: F.heading, fontSize: isMobile ? "28px" : "52px",
                fontWeight: 700, color: "#fff", lineHeight: 1.3,
                letterSpacing: "0.08em",
              }}>
                物流で、未来を<br />変えていく。
              </h1>
            </FadeIn>
            <FadeIn delay={0.9}>
              <p style={{
                fontFamily: F.sans, fontSize: isMobile ? "12px" : "14px",
                color: "rgba(255,255,255,0.6)", marginTop: isMobile ? "20px" : "32px",
                letterSpacing: "0.06em", fontWeight: 300,
              }}>
                学歴不問・未経験歓迎。月収40万〜100万円。
              </p>
            </FadeIn>
          </div>

          {/* Scroll Arrow */}
          <div style={{
            position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
            zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          }}>
            <span style={{
              fontFamily: F.accent, fontSize: "10px", color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.2em", textTransform: "uppercase",
            }}>
              Scroll
            </span>
            <div style={{
              width: "1px", height: "40px", background: "rgba(255,255,255,0.3)",
              animation: "scrollPulse 2s infinite",
            }} />
            <style>{`
              @keyframes scrollPulse {
                0%, 100% { opacity: 0.3; transform: scaleY(1); }
                50% { opacity: 1; transform: scaleY(1.2); }
              }
            `}</style>
          </div>
        </section>

        {/* ════════════════════════════════════════
           LEAD
           ════════════════════════════════════════ */}
        <section style={{ padding: isMobile ? "100px 0 80px" : "185px 0 140px", background: C.bg }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "32px",
              }}>
                ── About This Work ──
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "24px" : "40px",
                fontWeight: 700, lineHeight: 1.3, color: C.text,
                letterSpacing: "0.04em",
                maxWidth: isMobile ? "100%" : "70%",
              }}>
                学歴・経験いっさい不問——
              </h2>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p style={{
                fontFamily: F.sans, fontSize: isMobile ? "15px" : "18px",
                lineHeight: 1.9, color: C.muted, marginTop: "32px",
                maxWidth: isMobile ? "100%" : "60%",
                marginLeft: isMobile ? "0" : "80px",
              }}>
                頑張り次第でどんどん稼げる。<br />
                配達車無料貸出、リース料・加盟料ゼロ。<br />
                普通免許（AT可）だけで、<br />
                月収40万〜100万円が目指せます。
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ════════════════════════════════════════
           REASONS
           ════════════════════════════════════════ */}
        <section id="reasons" style={{ padding: isMobile ? "80px 0 90px" : "160px 0 140px", background: C.white }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Why Choose Us ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                選ばれる理由
              </h2>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "60px" : "100px" }}>
              {reasons.map((r, i) => (
                <FadeIn key={r.num} delay={i * 0.12}>
                  <div style={{
                    display: isMobile ? "block" : "flex",
                    alignItems: "stretch",
                    padding: isMobile ? "40px 0" : "60px 0",
                    borderBottom: i < reasons.length - 1 ? `1px solid ${C.border}` : "none",
                    gap: "48px",
                  }}>
                    {/* Image */}
                    <div style={{
                      flex: isMobile ? undefined : "0 0 38%",
                      marginBottom: isMobile ? "20px" : 0,
                      overflow: "hidden",
                    }}>
                      <img
                        src={`/keikamotsu-new-templates/images/strength-${r.num}.webp`}
                        alt={r.title}
                        style={{
                          width: "100%",
                          height: isMobile ? "200px" : "100%",
                          objectFit: "cover",
                          display: "block",
                          filter: "grayscale(15%)",
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}>
                      <span style={{
                        fontFamily: F.accent, fontSize: isMobile ? "48px" : "72px",
                        fontWeight: 300, color: C.border, lineHeight: 1,
                        display: "block",
                      }}>
                        ─ {r.num}
                      </span>
                      <h3 style={{
                        fontFamily: F.heading, fontSize: isMobile ? "18px" : "22px",
                        fontWeight: 600, color: C.text, marginTop: "16px",
                        lineHeight: 1.6, letterSpacing: "0.03em",
                      }}>
                        {r.title}
                      </h3>
                      <p style={{
                        fontSize: isMobile ? "13px" : "15px", color: C.muted,
                        lineHeight: 1.9, letterSpacing: "0.02em",
                        marginTop: "16px",
                      }}>
                        {typeof r.text === 'string' && r.text.includes('\n')
                          ? r.text.split('\n').map((line, li) => <span key={li}>{line}{li < r.text.split('\n').length - 1 && <br />}</span>)
                          : r.text}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           JOBS
           ════════════════════════════════════════ */}
        <section id="jobs" style={{ padding: isMobile ? "80px 0 90px" : "180px 0 150px", background: C.bg }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Recruitment ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                求人情報
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p style={{
                fontFamily: F.sans, fontSize: isMobile ? "13px" : "15px",
                color: C.muted, marginTop: "32px", lineHeight: 1.9, maxWidth: "640px",
              }}>
                {jobs.intro}
              </p>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "40px" : "64px" }}>
              {jobs.rows.map((row, i) => (
                <FadeIn key={row.dt} delay={i * 0.08}>
                  <div style={{
                    display: isMobile ? "block" : "flex",
                    padding: isMobile ? "20px 0" : "24px 0",
                    borderBottom: `1px solid ${C.border}`,
                    gap: "40px",
                  }}>
                    <dt style={{
                      fontFamily: F.heading, fontSize: "13px", color: C.muted,
                      flex: isMobile ? undefined : "0 0 160px",
                      letterSpacing: "0.06em",
                      marginBottom: isMobile ? "8px" : 0,
                    }}>
                      <span style={{ color: C.accent, marginRight: "8px" }}>▪</span>{row.dt}
                    </dt>
                    <dd style={{
                      fontSize: row.accent ? (isMobile ? "18px" : "22px") : (isMobile ? "14px" : "15px"),
                      fontFamily: row.accent ? F.heading : F.sans,
                      fontWeight: row.accent ? 600 : 300,
                      color: row.accent ? C.accent : C.text,
                      lineHeight: 1.9,
                      letterSpacing: row.accent ? "0.04em" : "0.01em",
                    }}>
                      {row.dd}
                    </dd>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Requirements */}
            <FadeIn delay={0.2}>
              <div style={{ marginTop: isMobile ? "40px" : "56px" }}>
                <p style={{
                  fontFamily: F.heading, fontSize: "13px", color: C.muted,
                  letterSpacing: "0.06em", marginBottom: "20px",
                }}>
                  応募資格
                </p>
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: isMobile ? "8px" : "12px",
                }}>
                  {jobs.requirements.map((req) => (
                    <span key={req} style={{
                      fontSize: "12px", color: C.muted,
                      border: `1px solid ${C.border}`,
                      padding: "6px 16px", letterSpacing: "0.03em",
                    }}>
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ════════════════════════════════════════
           BENEFITS
           ════════════════════════════════════════ */}
        <section id="benefits" style={{ padding: isMobile ? "80px 0 90px" : "145px 0 170px", background: C.white }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Benefits ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                待遇・福利厚生
              </h2>
            </FadeIn>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
              gap: isMobile ? "32px" : "48px 64px",
              marginTop: isMobile ? "48px" : "80px",
            }}>
              {benefits.map((b, i) => (
                <FadeIn key={b.title} delay={i * 0.08}>
                  <div style={{
                    padding: isMobile ? "0" : "0 0 0 24px",
                    borderLeft: isMobile ? "none" : `2px solid ${C.border}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px" }}>
                      <span style={{
                        fontSize: "16px", fontWeight: 700,
                        color: C.accent, lineHeight: 1,
                      }}>
                        ✓
                      </span>
                      <h3 style={{
                        fontFamily: F.heading, fontSize: isMobile ? "16px" : "17px",
                        fontWeight: 600, color: C.text, letterSpacing: "0.03em",
                      }}>
                        {b.title}
                      </h3>
                    </div>
                    <p style={{
                      fontSize: "13px", color: C.muted, lineHeight: 1.9,
                      marginLeft: isMobile ? "0" : "30px",
                    }}>
                      {typeof b.text === 'string' && b.text.includes('\n')
                        ? b.text.split('\n').map((line, li) => <span key={li}>{line}{li < b.text.split('\n').length - 1 && <br />}</span>)
                        : b.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           DAILY
           ════════════════════════════════════════ */}
        <section id="daily" style={{ padding: isMobile ? "80px 0 90px" : "200px 0 160px", background: C.bg }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: isMobile ? "left" : "right" }}>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── Daily Schedule ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                }}>
                  一日の流れ
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p style={{
                fontFamily: F.sans, fontSize: isMobile ? "13px" : "15px",
                color: C.muted, marginTop: "32px", lineHeight: 1.9,
                textAlign: isMobile ? "left" : "right",
                maxWidth: isMobile ? "100%" : "50%",
                marginLeft: "auto",
              }}>
                {daily.intro}
              </p>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "48px" : "80px", position: "relative" }}>
              {/* Timeline Line */}
              {!isMobile && (
                <div style={{
                  position: "absolute", left: "120px", top: 0, bottom: 0,
                  width: "1px", background: C.border,
                }} />
              )}

              {daily.steps.map((step, i) => (
                <FadeIn key={step.time} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                  <div style={{
                    display: isMobile ? "block" : "flex",
                    alignItems: "flex-start",
                    marginBottom: isMobile ? "32px" : "48px",
                    gap: "40px",
                    paddingLeft: isMobile ? "0" : "0",
                  }}>
                    {/* Time */}
                    <div style={{
                      flex: isMobile ? undefined : "0 0 100px",
                      textAlign: isMobile ? "left" : "right",
                      marginBottom: isMobile ? "8px" : 0,
                    }}>
                      <span style={{
                        fontFamily: F.accent, fontSize: isMobile ? "24px" : "32px",
                        fontWeight: 300, color: C.accentLight, letterSpacing: "0.04em",
                      }}>
                        <span style={{ fontSize: "10px", verticalAlign: "middle", marginRight: "6px" }}>●</span>{step.time}
                      </span>
                    </div>

                    {/* Dot */}
                    {!isMobile && (
                      <div style={{
                        flex: "0 0 40px", display: "flex", justifyContent: "center",
                        paddingTop: "12px",
                      }}>
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: C.accent, position: "relative", zIndex: 1,
                        }} />
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: F.heading, fontSize: isMobile ? "16px" : "17px",
                        fontWeight: 600, color: C.text, marginBottom: "8px",
                        letterSpacing: "0.03em",
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: "13px", color: C.muted, lineHeight: 1.9,
                      }}>
                        {typeof step.desc === 'string' && step.desc.includes('\n')
                          ? step.desc.split('\n').map((line, li) => <span key={li}>{line}{li < step.desc.split('\n').length - 1 && <br />}</span>)
                          : step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           GALLERY
           ════════════════════════════════════════ */}
        <section id="gallery" style={{ padding: isMobile ? "80px 0 90px" : "155px 0 180px", background: C.white, overflow: "hidden" }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Gallery ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                {gallery.heading}
              </h2>
            </FadeIn>

            {/* Magazine Spread Layout */}
            {isMobile ? (
              <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {gallery.images.map((img, i) => (
                  <FadeIn key={img.src} delay={i * 0.1}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={img.src} alt={img.alt}
                        style={{
                          width: "100%", height: "220px", objectFit: "cover",
                          display: "block", filter: "grayscale(15%)",
                        }}
                      />
                      <p style={{
                        fontFamily: F.heading, fontSize: "11px", color: C.muted,
                        marginTop: "8px", letterSpacing: "0.03em",
                      }}>
                        {img.caption}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div style={{
                marginTop: "72px",
                display: "grid",
                gridTemplateColumns: "1.1fr 0.85fr 1.05fr",
                gridTemplateRows: "280px 220px",
                gap: "16px",
              }}>
                {gallery.images.map((img, i) => {
                  const spans: Record<number, React.CSSProperties> = {
                    0: { gridColumn: "1 / 3", gridRow: "1 / 2" },
                    1: { gridColumn: "3 / 4", gridRow: "1 / 2" },
                    2: { gridColumn: "1 / 2", gridRow: "2 / 3" },
                    3: { gridColumn: "2 / 3", gridRow: "2 / 3" },
                    4: { gridColumn: "3 / 4", gridRow: "2 / 3" },
                  };
                  return (
                    <FadeIn key={img.src} delay={i * 0.1} style={{ ...spans[i], position: "relative", overflow: "hidden" }}>
                      <img
                        src={img.src} alt={img.alt}
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          display: "block", filter: "grayscale(15%)",
                          transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        padding: "32px 16px 14px",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.45))",
                      }}>
                        <p style={{
                          fontFamily: F.heading, fontSize: "12px", color: "rgba(255,255,255,0.85)",
                          letterSpacing: "0.03em",
                        }}>
                          {img.caption}
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════
           VOICES
           ════════════════════════════════════════ */}
        <section id="voices" style={{ padding: isMobile ? "80px 0 90px" : "170px 0 145px", background: C.bg }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Interviews ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                先輩の声
              </h2>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "48px" : "80px" }}>
              {voices.map((v, i) => (
                <FadeIn key={v.name} delay={i * 0.12}>
                  <div style={{
                    padding: isMobile ? "40px 0" : "64px 0",
                    borderBottom: i < voices.length - 1 ? `1px solid ${C.border}` : "none",
                    display: isMobile ? "block" : "flex",
                    gap: "60px",
                    flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                  }}>
                    {/* Quote */}
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontFamily: F.accent, fontSize: "72px", lineHeight: 1,
                        color: C.border, display: "block", marginBottom: "-16px",
                      }}>
                        &ldquo;
                      </span>
                      <p style={{
                        fontFamily: F.heading, fontSize: isMobile ? "18px" : "22px",
                        fontWeight: 600, color: C.text, lineHeight: 1.6,
                        letterSpacing: "0.02em", marginBottom: "24px",
                      }}>
                        {v.highlight}
                      </p>
                      <p style={{
                        fontSize: "13px", color: C.muted, lineHeight: 1.9,
                      }}>
                        {typeof v.text === 'string' && v.text.includes('\n')
                          ? v.text.split('\n').map((line, li) => <span key={li}>{line}{li < v.text.split('\n').length - 1 && <br />}</span>)
                          : v.text}
                      </p>
                    </div>

                    {/* Profile */}
                    <div style={{
                      flex: isMobile ? undefined : "0 0 200px",
                      marginTop: isMobile ? "24px" : "40px",
                      textAlign: i % 2 === 0 ? "right" : "left",
                    }}>
                      <p style={{
                        fontFamily: F.heading, fontSize: "16px", fontWeight: 600,
                        color: C.text, letterSpacing: "0.04em",
                      }}>
                        {v.name}
                      </p>
                      <p style={{
                        fontSize: "12px", color: C.muted, marginTop: "4px",
                      }}>
                        {v.age}｜{v.prev}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           FAQ
           ════════════════════════════════════════ */}
        <section id="faq" style={{ padding: isMobile ? "80px 0 90px" : "140px 0 155px", background: C.white }}>
          <div style={{ width: containerW, margin: "0 auto", maxWidth: "780px" }}>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── FAQ ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                }}>
                  よくある質問
                </h2>
              </div>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "48px" : "72px" }}>
              {faq.map((item, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <details style={{
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <summary style={{
                      padding: isMobile ? "20px 0" : "28px 0",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: "16px",
                    }}>
                      <span style={{
                        fontFamily: F.heading, fontSize: isMobile ? "14px" : "16px",
                        color: C.text, letterSpacing: "0.03em", lineHeight: 1.6,
                      }}>
                        <span style={{ color: C.accentLight, marginRight: "8px" }}>&#x25B8;</span>{item.q}
                      </span>
                      <span style={{
                        fontFamily: F.accent, fontSize: "20px", color: C.muted,
                        flex: "0 0 20px", textAlign: "center", transition: "transform 0.3s",
                      }}>
                        +
                      </span>
                    </summary>
                    <div style={{
                      padding: "0 0 24px 0",
                    }}>
                      <p style={{
                        fontSize: "13px", color: C.muted, lineHeight: 1.9,
                        paddingLeft: isMobile ? "0" : "16px",
                      }}>
                        {typeof item.a === 'string' && item.a.includes('\n')
                          ? item.a.split('\n').map((line, li) => <span key={li}>{line}{li < item.a.split('\n').length - 1 && <br />}</span>)
                          : item.a}
                      </p>
                    </div>
                  </details>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           NEWS
           ════════════════════════════════════════ */}
        <section id="news" style={{ padding: isMobile ? "80px 0 90px" : "190px 0 165px", background: C.bg }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── News ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                お知らせ
              </h2>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "40px" : "56px" }}>
              {news.map((n, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div style={{
                    display: "flex", alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? "12px" : "32px",
                    padding: isMobile ? "16px 0" : "20px 0",
                    borderBottom: `1px solid ${C.border}`,
                    flexDirection: isMobile ? "column" : "row",
                  }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <time style={{
                        fontFamily: F.accent, fontSize: "13px", color: C.muted,
                        letterSpacing: "0.04em", flex: "0 0 auto",
                      }}>
                        <span style={{ marginRight: "6px" }}>─</span>{n.date}
                      </time>
                      <span style={{
                        fontSize: "10px", padding: "2px 10px",
                        letterSpacing: "0.06em",
                        color: n.tagStyle === "urgent" ? "#c0392b" : n.tagStyle === "new" ? C.accent : C.muted,
                        border: `1px solid ${n.tagStyle === "urgent" ? "#c0392b" : n.tagStyle === "new" ? C.accent : C.border}`,
                      }}>
                        {n.tag}
                      </span>
                    </div>
                    <p style={{
                      fontSize: isMobile ? "13px" : "14px", color: C.text,
                      letterSpacing: "0.02em", lineHeight: 1.6,
                    }}>
                      {n.title}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           ACCESS
           ════════════════════════════════════════ */}
        <section id="access" style={{ padding: isMobile ? "80px 0 90px" : "150px 0 175px", background: C.white }}>
          <div style={{ width: containerW, margin: "0 auto" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Access ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
              }}>
                {access.heading}
              </h2>
            </FadeIn>

            <div style={{
              marginTop: isMobile ? "40px" : "64px",
              position: "relative",
            }}>
              <FadeIn>
                <div style={{
                  width: "100%", height: isMobile ? "280px" : "400px",
                  position: "relative",
                }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.5!2d135.6367!3d34.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5a-d5bGL5bed5biC5rGg55SwMi0xMS01NQ!5e0!3m2!1sja!2sjp!4v1"
                    width="100%" height="100%"
                    style={{ border: "none", filter: "grayscale(30%)" }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="アクセスマップ"
                  />

                  {/* Overlay Info Card */}
                  <div style={{
                    position: isMobile ? "relative" : "absolute",
                    bottom: isMobile ? undefined : "24px",
                    left: isMobile ? undefined : "24px",
                    background: C.white,
                    padding: isMobile ? "24px 0 0" : "28px 32px",
                    maxWidth: isMobile ? "100%" : "360px",
                  }}>
                    <p style={{
                      fontFamily: F.heading, fontSize: "14px", color: C.text,
                      lineHeight: 1.9, marginBottom: "8px",
                    }}>
                      {company.address}
                    </p>
                    <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.9 }}>
                      {access.nearestStation}
                    </p>
                    <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.9, marginTop: "4px" }}>
                      {access.mapNote}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           COMPANY
           ════════════════════════════════════════ */}
        <section id="company" style={{ padding: isMobile ? "80px 0 90px" : "175px 0 185px", background: C.bg }}>
          <div style={{ width: containerW, margin: "0 auto", maxWidth: "680px" }}>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── Company ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                }}>
                  会社概要
                </h2>
              </div>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "40px" : "56px" }}>
              {companyInfo.map((row, i) => (
                <FadeIn key={row.dt} delay={i * 0.06}>
                  <div style={{
                    display: isMobile ? "block" : "flex",
                    padding: isMobile ? "16px 0" : "20px 0",
                    borderBottom: `1px solid ${C.border}`,
                    gap: "40px",
                  }}>
                    <dt style={{
                      fontFamily: F.heading, fontSize: "13px", color: C.muted,
                      flex: isMobile ? undefined : "0 0 120px",
                      letterSpacing: "0.06em",
                      marginBottom: isMobile ? "4px" : 0,
                    }}>
                      {row.dt}
                    </dt>
                    <dd style={{
                      fontSize: "14px", color: C.text, lineHeight: 1.9,
                    }}>
                      {row.dd}
                    </dd>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           APPLY (FORM)
           ════════════════════════════════════════ */}
        <section id="apply" style={{ padding: isMobile ? "80px 0 90px" : "165px 0 195px", background: C.white }}>
          <div style={{ width: containerW, margin: "0 auto", maxWidth: "640px" }}>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── Apply ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                }}>
                  応募フォーム
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p style={{
                fontFamily: F.heading, fontSize: isMobile ? "13px" : "14px",
                color: C.muted, textAlign: "center", marginTop: "24px", lineHeight: 1.9,
              }}>
                下記フォームに必要事項をご入力ください。<br />
                折り返しご連絡いたします。
              </p>
            </FadeIn>

            {submitted ? (
              <FadeIn>
                <div style={{
                  textAlign: "center", marginTop: "64px", padding: "48px 0",
                }}>
                  <p style={{
                    fontFamily: F.heading, fontSize: isMobile ? "18px" : "22px",
                    color: C.text, marginBottom: "16px",
                  }}>
                    送信ありがとうございます。
                  </p>
                  <p style={{ fontSize: "13px", color: C.muted }}>
                    担当者より折り返しご連絡いたします。
                  </p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={0.25}>
                <form onSubmit={handleSubmit} style={{ marginTop: isMobile ? "40px" : "56px" }}>
                  {[
                    { label: "お名前", name: "name", type: "text", required: true },
                    { label: "電話番号", name: "phone", type: "tel", required: true },
                    { label: "メールアドレス", name: "email", type: "email", required: false },
                  ].map((field) => (
                    <div key={field.name} style={{ marginBottom: isMobile ? "32px" : "40px" }}>
                      <label style={{
                        fontFamily: F.heading, fontSize: "13px", color: C.text,
                        letterSpacing: "0.06em", display: "block", marginBottom: "12px",
                      }}>
                        {field.label}
                        {field.required && (
                          <span style={{ fontSize: "10px", color: C.accent, marginLeft: "8px" }}>必須</span>
                        )}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        style={{
                          width: "100%", padding: "12px 0",
                          border: "none", borderBottom: `1px solid ${C.border}`,
                          background: "transparent", fontSize: "15px",
                          fontFamily: F.sans, fontWeight: 300, color: C.text,
                          outline: "none", transition: "border-color 0.3s",
                        }}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = C.accent)}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = C.border)}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: isMobile ? "32px" : "40px" }}>
                    <label style={{
                      fontFamily: F.heading, fontSize: "13px", color: C.text,
                      letterSpacing: "0.06em", display: "block", marginBottom: "12px",
                    }}>
                      備考・ご質問
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: "100%", padding: "12px 0",
                        border: "none", borderBottom: `1px solid ${C.border}`,
                        background: "transparent", fontSize: "15px",
                        fontFamily: F.sans, fontWeight: 300, color: C.text,
                        outline: "none", resize: "vertical", transition: "border-color 0.3s",
                      }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = C.accent)}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = C.border)}
                    />
                  </div>

                  <div style={{ textAlign: "center", marginTop: isMobile ? "40px" : "56px" }}>
                    <button type="submit" style={{
                      fontFamily: F.heading, fontSize: "15px", letterSpacing: "0.08em",
                      color: "#fff", background: C.cta,
                      border: "none", padding: isMobile ? "16px 48px" : "18px 72px",
                      cursor: "pointer", transition: "background 0.3s, transform 0.3s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = C.ctaHover;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = C.cta;
                      e.currentTarget.style.transform = "none";
                    }}
                    >
                      送信する
                    </button>
                  </div>
                </form>
              </FadeIn>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════
           CTA SECTION
           ════════════════════════════════════════ */}
        <section style={{
          padding: isMobile ? "100px 0" : "160px 0",
          background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/keikamotsu-new-templates/images/delivery.webp) center/cover no-repeat`,
          color: "#fff",
        }}>
          <div style={{ width: containerW, margin: "0 auto", textAlign: "center" }}>
            <FadeIn>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "36px",
                fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.06em",
                color: "#fff",
              }}>
                ちょっと話を<br />聞いてみたい。
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{
                fontSize: "13px", color: "rgba(255,255,255,0.5)",
                marginTop: "28px", lineHeight: 1.9,
                maxWidth: "480px", margin: "28px auto 0",
              }}>
                {cta.subtext}
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div style={{ marginTop: "48px" }}>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px",
                  color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em",
                  textTransform: "uppercase", marginBottom: "12px",
                }}>
                  Phone
                </p>
                <a href={`tel:${cta.phone}`} style={{
                  fontFamily: F.accent, fontSize: isMobile ? "28px" : "40px",
                  fontWeight: 400, color: "#fff", letterSpacing: "0.06em",
                  display: "inline-block",
                }}>
                  {cta.phone}
                </a>
                <p style={{
                  fontSize: "12px", color: "rgba(255,255,255,0.35)",
                  marginTop: "8px",
                }}>
                  {company.hours}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.45}>
              <a href="#apply" style={{
                display: "inline-block", marginTop: "48px",
                fontFamily: F.heading, fontSize: "14px", letterSpacing: "0.1em",
                color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
                padding: isMobile ? "14px 40px" : "16px 56px",
                transition: "background 0.4s, border-color 0.4s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              >
                {cta.webLabel}
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ════════════════════════════════════════
           FOOTER
           ════════════════════════════════════════ */}
        <footer style={{
          padding: isMobile ? "48px 0 32px" : "64px 0 40px",
          background: C.dark, borderTop: `1px solid ${C.borderDark}`,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: F.heading, fontSize: isMobile ? "12px" : "14px",
            color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", lineHeight: 1.9,
            maxWidth: "480px", margin: "0 auto",
          }}>
            {footer.catchphrase}
          </p>
          <p style={{
            fontFamily: F.accent, fontSize: "12px",
            color: "rgba(255,255,255,0.2)", marginTop: "32px",
            letterSpacing: "0.1em",
          }}>
            {company.nameEn}
          </p>
          <p style={{
            fontSize: "10px", color: "rgba(255,255,255,0.15)", marginTop: "12px",
          }}>
            &copy; {new Date().getFullYear()} {company.name}
          </p>
        </footer>

      </div>
    </>
  );
}