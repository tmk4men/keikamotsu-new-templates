"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
   BOLD (R-01) — 黒背景×大型写真 採用HP（無彩色）
   ──────────────────────────────────────── */

const ACCENT = "#32373c";
const ACCENT_LIGHT = "#555";
const BG_DARK = "#0a0a0a";
const BG_CARD = "#111";
const TEXT_W = "#ffffff";
const TEXT_G = "#ccc";
const CTA_BG = "#32373c";
const BP = 768;

const benefitIcons = ["🚛", "🎁", "💰", "🏠", "📚", "📱"];

/* ─── 画像パス ─── */
const IMG = {
  strength: (n: number) => `/keikamotsu-new-templates/images/strength-0${n}.webp`,
  workplace: "/keikamotsu-new-templates/images/workplace.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
};

export default function R01Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

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

  // IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll("[data-anim]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const animStyle = (delay = 0): React.CSSProperties => ({
    opacity: 0,
    transform: "translateY(12px)",
    transition: `opacity 0.7s ${delay}s ease-out, transform 0.7s ${delay}s ease-out`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("送信が完了しました。担当者より折り返しご連絡いたします。");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  /** テキスト内の \n を <br/> に変換 */
  const nl2br = (text: string) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background:${BG_DARK}; color:${TEXT_W}; font-family:'Noto Sans JP',sans-serif; font-weight:400; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        a { color:inherit; text-decoration:none; }
        @keyframes marqueeLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes marqueeRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        @keyframes heroFade { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes counterPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(2deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px) rotate(-1.5deg)} }
        @keyframes scrollChevron { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(10px)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(50,55,60,0.4)} 50%{box-shadow:0 0 0 12px rgba(50,55,60,0)} }
        @keyframes grainShift { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,-2%)} 50%{transform:translate(2%,1%)} 75%{transform:translate(-1%,2%)} }
        @keyframes neonGlow { 0%,100%{box-shadow:0 0 8px rgba(85,85,85,0.3), inset 0 0 8px rgba(85,85,85,0.05)} 50%{box-shadow:0 0 20px rgba(85,85,85,0.5), inset 0 0 12px rgba(85,85,85,0.1)} }
        @keyframes clipRevealLTR { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0 0 0)} }
        details summary { cursor:pointer; list-style:none; }
        details summary::-webkit-details-marker { display:none; }
        details[open] summary .faq-arrow { transform:rotate(180deg); }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
      `}</style>

      {/* ===== HEADER ===== */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          background: scrolled ? "#0a0a0a" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
          transition: "background 0.35s ease, border-bottom 0.35s ease",
          padding: isMobile ? "12px 16px" : "14px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a href="#" style={{ fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800, fontSize: isMobile ? "20px" : "24px", letterSpacing: "0.08em", color: TEXT_W }}>
          {company.nameEn}
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} style={{ fontSize: "13px", letterSpacing: "0.05em", color: TEXT_G, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_W)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_G)}
              >
                {l.label}
              </a>
            ))}
            <a href={`tel:${company.phone}`} style={{
              background: CTA_BG, color: TEXT_W, padding: "8px 22px", borderRadius: "4px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.04em",
            }}>
              {company.phone}
            </a>
          </nav>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
            <div style={{ width: "24px", height: "2px", background: TEXT_W, marginBottom: "6px", transition: "transform 0.3s", transform: menuOpen ? "rotate(45deg) translate(4px,5px)" : "none" }} />
            <div style={{ width: "24px", height: "2px", background: TEXT_W, marginBottom: "6px", transition: "opacity 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: "24px", height: "2px", background: TEXT_W, transition: "transform 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4px,-5px)" : "none" }} />
          </button>
        )}

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          <div style={{
            position: "fixed", top: "56px", left: 0, width: "100%", background: "rgba(10,10,10,0.98)",
            padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: "18px",
            borderBottom: `2px solid ${ACCENT_LIGHT}`,
          }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "15px", color: TEXT_G, letterSpacing: "0.05em" }}>
                {l.label}
              </a>
            ))}
            <a href={`tel:${company.phone}`} style={{
              background: CTA_BG, color: TEXT_W, padding: "12px", borderRadius: "4px", textAlign: "center", fontWeight: 700, fontSize: "15px", marginTop: "8px",
            }}>
              {company.phone}
            </a>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        <video
          autoPlay muted loop playsInline
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          src="/keikamotsu-new-templates/videos/hero-nightcity.mp4"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.85) 100%)" }} />

        {/* ノイズテクスチャ */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04, zIndex: 1,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px", animation: "grainShift 8s steps(10) infinite", pointerEvents: "none",
        }} />

        {/* 浮遊装飾要素 */}
        <div style={{ position: "absolute", top: "12%", left: "5%", width: 100, height: 100, border: "1px solid rgba(255,255,255,0.06)", borderRadius: "50%", animation: "float1 9s ease-in-out infinite", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "18%", right: "8%", width: 160, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)", animation: "float2 7s ease-in-out infinite", zIndex: 1 }} />
        <div style={{ position: "absolute", top: "35%", right: "12%", width: 8, height: 8, background: "rgba(255,255,255,0.12)", borderRadius: "50%", animation: "float1 11s ease-in-out infinite 3s", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "30%", left: "15%", width: 4, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: "50%", animation: "float2 8s ease-in-out infinite 1s", zIndex: 1 }} />

        {/* 大きな背景テキスト */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          fontSize: isMobile ? "80px" : "220px", fontWeight: 900, color: "rgba(255,255,255,0.02)",
          fontFamily: "'Oswald',sans-serif", letterSpacing: "0.15em", whiteSpace: "nowrap",
          zIndex: 1, pointerEvents: "none", textTransform: "uppercase",
        }}>
          RECRUIT
        </div>

        <div style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: isMobile ? "0 20px" : "0 8%", maxWidth: "1200px", margin: "0 auto",
        }}>
          {hero.headlineParts.map((line, i) => (
            <h1 key={i} style={{
              fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
              fontSize: isMobile ? "28px" : "52px", lineHeight: 1.1, letterSpacing: "0.05em",
              color: TEXT_W, animation: `heroFade 0.9s ${0.3 + i * 0.35}s both`,
              marginBottom: i === 0 ? "8px" : "0",
            }}>
              {line}
            </h1>
          ))}

          <div style={{ marginTop: "28px", animation: "heroFade 0.9s 1.1s both" }}>
            <span style={{ fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800, color: TEXT_W, fontSize: isMobile ? "18px" : "22px", letterSpacing: "0.04em" }}>
              月収
            </span>
            <CounterNum target={hero.salaryMin} style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, color: TEXT_W, fontSize: isMobile ? "64px" : "96px", lineHeight: 1 }} />
            <span style={{ fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800, color: TEXT_W, fontSize: isMobile ? "18px" : "22px" }}>
              万〜
            </span>
            <CounterNum target={hero.salaryMax} style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, color: TEXT_W, fontSize: isMobile ? "64px" : "96px", lineHeight: 1 }} />
            <span style={{ fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800, color: TEXT_W, fontSize: isMobile ? "18px" : "22px" }}>
              万円
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "22px", animation: "heroFade 0.9s 1.5s both" }}>
            {hero.badges.map((b) => (
              <span key={b} style={{
                background: ACCENT, border: `1px solid ${ACCENT_LIGHT}`, color: TEXT_W,
                padding: "6px 16px", borderRadius: "2px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em",
              }}>
                {b}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "36px", animation: "heroFade 0.9s 1.8s both" }}>
            <a href={`tel:${company.phone}`} style={{
              background: CTA_BG, color: TEXT_W, padding: isMobile ? "14px 28px" : "16px 40px",
              borderRadius: "4px", fontWeight: 800, fontSize: isMobile ? "16px" : "18px", letterSpacing: "0.04em",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ fontSize: "20px" }}>&#9742;</span> {company.phone}
            </a>
            <a href="#apply" style={{
              border: `2px solid ${TEXT_W}`, color: TEXT_W, padding: isMobile ? "14px 28px" : "16px 40px",
              borderRadius: "4px", fontWeight: 700, fontSize: isMobile ? "14px" : "16px", letterSpacing: "0.04em",
              transition: "background 0.2s, color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = TEXT_W; e.currentTarget.style.color = BG_DARK; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEXT_W; }}
            >
              {hero.cta}
            </a>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "heroFade 0.9s 2.2s both",
        }}>
          <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ animation: "scrollChevron 2s ease-in-out infinite" }}>
            <path d="M8 0v18M2 14l6 6 6-6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section style={{ background: ACCENT, padding: "20px 0", overflow: "hidden", borderTop: `3px solid ${ACCENT_LIGHT}`, borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        {/* グラデーションフェードエッジ */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 80, height: "100%", background: `linear-gradient(to right, ${ACCENT}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: "100%", background: `linear-gradient(to left, ${ACCENT}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        {[marquee.top, marquee.bottom].map((row, ri) => (
          <div key={ri} style={{ overflow: "hidden", whiteSpace: "nowrap", marginBottom: ri === 0 ? "10px" : 0 }}>
            <div style={{
              display: "inline-flex", gap: "48px",
              animation: `${ri === 0 ? "marqueeLeft" : "marqueeRight"} ${ri === 0 ? 30 : 35}s linear infinite`,
            }}>
              {[...row, ...row, ...row, ...row].map((t, i) => (
                <span key={i} style={{
                  fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
                  fontSize: isMobile ? "15px" : "20px", letterSpacing: "0.06em", color: TEXT_W,
                  paddingRight: "48px",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── SVG三角区切り ── */}
      <div style={{ lineHeight: 0, background: ACCENT }}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: "100%", height: 40, display: "block" }}>
          <polygon points="0,0 720,40 1440,0 1440,40 0,40" fill={BG_DARK} />
        </svg>
      </div>

      {/* ===== REASONS ===== */}
      <section id="reasons" style={{ padding: isMobile ? "48px 0 40px" : "60px 0 60px", background: BG_DARK }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>
          <SectionTitle label="WHY US" title="選ばれる理由" num="01" />
        </div>

        <div style={{
          marginTop: "48px", display: "flex", flexDirection: "column", gap: "24px",
          padding: isMobile ? "0 20px" : "0 48px", maxWidth: "1200px", margin: "48px auto 0",
        }}>
          {reasons.map((r, i) => (
            <div key={i} data-anim style={{
              ...animStyle(i * 0.15),
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "16px" : "28px",
              background: BG_CARD,
              borderRadius: "6px",
              padding: isMobile ? "28px 20px" : "36px 32px",
              borderTop: `4px solid ${ACCENT_LIGHT}`,
              position: "relative",
              alignItems: "stretch",
            }}>
              {/* 画像 */}
              <div style={{
                flex: isMobile ? "none" : "0 0 200px",
                height: isMobile ? "180px" : "auto",
                minHeight: isMobile ? "auto" : "160px",
                borderRadius: "4px",
                overflow: "hidden",
              }}>
                <img
                  src={IMG.strength(i + 1)}
                  alt={r.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              {/* テキスト */}
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{
                  fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: isMobile ? "56px" : "72px",
                  color: "rgba(255,255,255,0.06)", position: "absolute", top: "-8px", right: "0", lineHeight: 1,
                }}>
                  {r.num}
                </span>
                <h3 style={{
                  fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
                  fontSize: isMobile ? "18px" : "21px", lineHeight: 1.35, letterSpacing: "0.05em",
                  color: TEXT_W, marginBottom: "16px",
                }}>
                  ─ {r.title}
                </h3>
                <p style={{ fontSize: "14px", lineHeight: 1.8, color: TEXT_G, letterSpacing: "0.05em" }}>
                  {nl2br(r.text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 区切り ── */}
      <div style={{ lineHeight: 0, background: BG_DARK }}>
        <svg viewBox="0 0 1440 32" preserveAspectRatio="none" style={{ width: "100%", height: 32, display: "block" }}>
          <polygon points="0,0 1440,32 1440,32 0,32" fill={BG_CARD} />
        </svg>
      </div>

      {/* ===== JOBS ===== */}
      <section id="jobs" style={{ padding: isMobile ? "72px 20px 56px" : "110px 48px 90px", background: BG_CARD }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="RECRUIT" title="求人情報" num="02" />
          <p data-anim style={{ ...animStyle(0.1), fontSize: "14px", lineHeight: 1.8, color: TEXT_G, marginTop: "20px", letterSpacing: "0.05em", maxWidth: "700px" }}>
            {nl2br(jobs.intro)}
          </p>

          <div style={{
            marginTop: "40px",
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "40px",
            alignItems: "start",
          }}>
            {/* Left: dl */}
            <dl data-anim style={{ ...animStyle(0.15) }}>
              {jobs.rows.map((row, i) => (
                <div key={i} style={{
                  display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)",
                  padding: "16px 0",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "4px" : "0",
                }}>
                  <dt style={{
                    width: isMobile ? "auto" : "140px", flexShrink: 0,
                    fontWeight: 700, fontSize: "13px", color: TEXT_W, letterSpacing: "0.05em",
                  }}>
                    ▪ {row.dt}
                  </dt>
                  <dd style={{
                    fontSize: "14px", lineHeight: 1.7, color: row.accent ? TEXT_W : TEXT_G, letterSpacing: "0.05em",
                    fontWeight: row.accent ? 700 : 400,
                  }}>
                    {nl2br(row.dd)}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Right: salary callout */}
            <div data-anim style={{
              ...animStyle(0.3),
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: isMobile ? "32px 24px" : "44px 32px",
              textAlign: "center",
              marginTop: isMobile ? "32px" : "0",
            }}>
              <p style={{ fontSize: "14px", color: TEXT_G, letterSpacing: "0.05em", marginBottom: "8px" }}>月収目安</p>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, color: TEXT_W }}>
                <span style={{ fontSize: isMobile ? "56px" : "72px", lineHeight: 1 }}>{hero.salaryMin}</span>
                <span style={{ fontSize: isMobile ? "20px" : "24px", margin: "0 4px" }}>万〜</span>
                <span style={{ fontSize: isMobile ? "56px" : "72px", lineHeight: 1 }}>{hero.salaryMax}</span>
                <span style={{ fontSize: isMobile ? "20px" : "24px" }}>万円</span>
              </div>
              <p style={{ fontSize: "12px", color: TEXT_G, marginTop: "12px", lineHeight: 1.7, letterSpacing: "0.05em" }}>
                日給18,000円〜 or 個数制150〜180円/個
              </p>
              <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {jobs.requirements.map((r, i) => (
                  <span key={i} style={{
                    fontSize: "11px", color: TEXT_G, background: "rgba(255,255,255,0.06)",
                    padding: "4px 12px", borderRadius: "20px", letterSpacing: "0.04em",
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 区切り ── */}
      <div style={{ lineHeight: 0, background: BG_CARD }}>
        <svg viewBox="0 0 1440 32" preserveAspectRatio="none" style={{ width: "100%", height: 32, display: "block" }}>
          <polygon points="0,32 1440,0 1440,32 0,32" fill={BG_DARK} />
        </svg>
      </div>

      {/* ===== BENEFITS ===== */}
      <section id="benefits" style={{
        padding: isMobile ? "72px 20px 60px" : "110px 48px 90px",
        background: BG_DARK,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 背景画像 */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${IMG.workplace})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08,
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="BENEFITS" title="✓ 待遇・福利厚生" num="03" />
          <div style={{
            marginTop: "44px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.85fr 1.05fr",
            gap: isMobile ? "16px" : "20px",
          }}>
            {benefits.map((b, i) => (
              <div key={i} data-anim style={{
                ...animStyle(i * 0.08),
                background: BG_CARD,
                padding: isMobile ? "28px 22px" : "36px 30px",
                borderRadius: i % 3 === 0 ? "8px" : i % 3 === 1 ? "4px" : "12px",
                borderLeft: `3px solid ${ACCENT_LIGHT}`,
                textAlign: "left",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(85,85,85,0.25), inset 0 0 12px rgba(85,85,85,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{benefitIcons[i]}</div>
                <h4 style={{
                  fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
                  fontSize: "16px", lineHeight: 1.4, letterSpacing: "0.05em", color: TEXT_W, marginBottom: "10px",
                }}>
                  ✓ {b.title}
                </h4>
                <p style={{ fontSize: "13px", lineHeight: 1.8, color: TEXT_G, letterSpacing: "0.05em" }}>
                  {nl2br(b.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 区切り ── */}
      <div style={{ lineHeight: 0, background: BG_DARK }}>
        <svg viewBox="0 0 1440 32" preserveAspectRatio="none" style={{ width: "100%", height: 32, display: "block" }}>
          <polygon points="0,0 1440,32 1440,32 0,32" fill={BG_CARD} />
        </svg>
      </div>

      {/* ===== DAILY ===== */}
      <section id="daily" style={{ padding: isMobile ? "64px 20px 52px" : "100px 48px 80px", background: BG_CARD }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionTitle label="DAILY" title="1日の流れ" num="04" />
          <p data-anim style={{ ...animStyle(0.1), fontSize: "14px", lineHeight: 1.8, color: TEXT_G, marginTop: "16px", letterSpacing: "0.05em" }}>
            {nl2br(daily.intro)}
          </p>

          <div style={{ marginTop: "44px", position: "relative", paddingLeft: isMobile ? "36px" : "48px" }}>
            {/* vertical line */}
            <div style={{
              position: "absolute", left: isMobile ? "14px" : "18px", top: "8px", bottom: "8px",
              width: "2px", background: "linear-gradient(to bottom, #555, rgba(85,85,85,0.15))",
            }} />

            {daily.steps.map((s, i) => (
              <div key={i} data-anim style={{
                ...animStyle(i * 0.1),
                marginBottom: i < daily.steps.length - 1 ? "36px" : 0,
                position: "relative",
              }}>
                {/* dot */}
                <div style={{
                  position: "absolute",
                  left: isMobile ? "-29px" : "-39px",
                  top: "4px",
                  width: "12px", height: "12px",
                  background: i === 0 ? TEXT_W : BG_DARK,
                  border: "2px solid #555",
                  borderRadius: "50%",
                }} />
                {/* ● 区切り記号 */}
                <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                  <span style={{
                    fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: isMobile ? "20px" : "24px",
                    color: TEXT_W, letterSpacing: "0.04em", minWidth: "60px",
                  }}>
                    {s.time}
                  </span>
                  <h4 style={{
                    fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
                    fontSize: isMobile ? "15px" : "17px", color: TEXT_W, letterSpacing: "0.05em",
                  }}>
                    ● {s.title}
                  </h4>
                </div>
                <p style={{ fontSize: "13px", lineHeight: 1.8, color: TEXT_G, letterSpacing: "0.05em", marginTop: "6px" }}>
                  {nl2br(s.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" style={{ padding: isMobile ? "56px 0 48px" : "80px 0 70px", background: BG_DARK }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>
          <SectionTitle label="GALLERY" title={gallery.heading} num="05" />
          <p data-anim style={{ ...animStyle(0.1), fontSize: "14px", lineHeight: 1.8, color: TEXT_G, marginTop: "16px", letterSpacing: "0.05em" }}>
            {nl2br(gallery.intro)}
          </p>
        </div>

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
          <div style={{
            display: "flex", transition: "transform 0.6s ease",
            transform: `translateX(calc(-${galleryIdx * (isMobile ? 85 : 60)}vw + ${isMobile ? 7.5 : 20}vw))`,
          }}>
            {gallery.images.map((img, i) => (
              <div key={i} style={{
                flex: `0 0 ${isMobile ? "85vw" : "60vw"}`,
                padding: "0 8px",
                transition: "opacity 0.4s",
                opacity: i === galleryIdx ? 1 : 0.4,
              }}>
                <div style={{
                  position: "relative", borderRadius: "6px", overflow: "hidden",
                  aspectRatio: "16/9", background: "#1a1a1a",
                }}>
                  <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                    padding: "20px 16px 14px",
                  }}>
                    <p style={{ fontSize: "13px", color: TEXT_G, letterSpacing: "0.05em" }}>{img.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
            {gallery.images.map((_, i) => (
              <button key={i} onClick={() => setGalleryIdx(i)} style={{
                width: i === galleryIdx ? "24px" : "8px", height: "8px",
                borderRadius: "4px", border: "none", cursor: "pointer",
                background: i === galleryIdx ? TEXT_W : "rgba(255,255,255,0.25)",
                transition: "width 0.3s, background 0.3s",
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== VOICES ===== */}
      <section id="voices" style={{ padding: isMobile ? "60px 20px 48px" : "95px 48px 75px", background: BG_CARD }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle label="VOICES" title="先輩の声" num="06" />

          <div style={{
            marginTop: "44px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
            gap: isMobile ? "20px" : "28px",
          }}>
            {voices.map((v, i) => (
              <div key={i} data-anim style={{
                ...animStyle(i * 0.12),
                background: BG_DARK,
                padding: isMobile ? "28px 22px" : "40px 36px",
                borderRadius: i % 2 === 0 ? "6px" : "10px",
                position: "relative",
              }}>
                <span style={{
                  fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: "48px",
                  color: "rgba(255,255,255,0.08)", position: "absolute", top: "12px", left: "20px", lineHeight: 1,
                }}>
                  &ldquo;
                </span>
                <blockquote style={{ fontSize: "14px", lineHeight: 1.85, color: TEXT_G, letterSpacing: "0.05em", marginBottom: "16px", paddingTop: "8px" }}>
                  {nl2br(v.text)}
                </blockquote>
                <p style={{
                  display: "inline-block",
                  background: ACCENT, border: "1px solid rgba(255,255,255,0.15)",
                  padding: "4px 14px", borderRadius: "2px",
                  fontSize: "13px", fontWeight: 700, color: TEXT_W, letterSpacing: "0.04em",
                  marginBottom: "14px",
                }}>
                  {v.highlight}
                </p>
                <div style={{ fontSize: "13px", color: TEXT_G, letterSpacing: "0.05em" }}>
                  <span style={{ color: TEXT_W, fontWeight: 700, marginRight: "8px" }}>{v.name}</span>
                  {v.age}・{v.prev}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" style={{ padding: isMobile ? "60px 20px 56px" : "90px 48px 85px", background: BG_DARK }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <SectionTitle label="FAQ" title="よくある質問" num="07" />

          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {faq.map((f, i) => (
              <details key={i} data-anim style={{
                ...animStyle(i * 0.06),
                background: BG_CARD,
                borderRadius: i % 2 === 0 ? "6px" : "4px",
                overflow: "hidden",
              }}>
                <summary style={{
                  padding: isMobile ? "18px 16px" : "22px 28px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  fontSize: "14px", fontWeight: 700, color: TEXT_W, letterSpacing: "0.05em", lineHeight: 1.5,
                }}>
                  <span style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: TEXT_G, fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>▸ Q.</span>
                    {f.q}
                  </span>
                  <span className="faq-arrow" style={{ color: TEXT_G, fontSize: "12px", transition: "transform 0.3s", flexShrink: 0 }}>&#9660;</span>
                </summary>
                <div style={{
                  padding: isMobile ? "0 16px 18px 42px" : "0 28px 22px 58px",
                  fontSize: "13px", lineHeight: 1.85, color: TEXT_G, letterSpacing: "0.05em",
                }}>
                  {nl2br(f.a)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section id="news" style={{ padding: isMobile ? "52px 20px 44px" : "75px 48px 65px", background: BG_CARD }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <SectionTitle label="NEWS" title="お知らせ" />

          <div style={{ marginTop: "36px" }}>
            {news.map((n, i) => (
              <div key={i} data-anim style={{
                ...animStyle(i * 0.08),
                display: "flex", alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "6px" : "20px",
                padding: "18px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: "13px", color: TEXT_G, letterSpacing: "0.04em", flexShrink: 0 }}>
                  ─ {n.date}
                </span>
                <span style={{
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", padding: "2px 10px", borderRadius: "2px",
                  flexShrink: 0,
                  background: n.tagStyle === "urgent" ? "rgba(220,50,50,0.2)" : n.tagStyle === "new" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
                  color: n.tagStyle === "urgent" ? "#e55" : TEXT_G,
                  border: `1px solid ${n.tagStyle === "urgent" ? "rgba(220,50,50,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}>
                  {n.tag}
                </span>
                <span style={{ fontSize: "14px", color: TEXT_W, letterSpacing: "0.05em", lineHeight: 1.5 }}>
                  {n.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACCESS ===== */}
      <section id="access" style={{ padding: isMobile ? "64px 20px 48px" : "85px 48px 70px", background: BG_DARK }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <SectionTitle label="ACCESS" title={access.heading} />
          <div data-anim style={{ ...animStyle(0.1), marginTop: "28px" }}>
            <p style={{ fontSize: "14px", color: TEXT_G, lineHeight: 1.8, letterSpacing: "0.05em", marginBottom: "6px" }}>
              〒{company.postalCode} {company.address}
            </p>
            <p style={{ fontSize: "13px", color: TEXT_G, letterSpacing: "0.05em", marginBottom: "6px" }}>
              {access.nearestStation}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", marginBottom: "24px" }}>
              {access.mapNote}
            </p>
            <div style={{ borderRadius: "8px", overflow: "hidden", aspectRatio: isMobile ? "4/3" : "21/9" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5!2d135.6281!3d34.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzAwLjAiTiAxMzXCsDM3JzQxLjAiRQ!5e0!3m2!1sja!2sjp!4v1"
                width="100%" height="100%" style={{ border: 0, display: "block", filter: "invert(0.9) hue-rotate(180deg) brightness(0.95) contrast(1.1)" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPANY ===== */}
      <section id="company" style={{ padding: isMobile ? "56px 20px 44px" : "88px 48px 72px", background: BG_CARD }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <SectionTitle label="COMPANY" title="会社概要" />
          <dl data-anim style={{ ...animStyle(0.15), marginTop: "36px" }}>
            {companyInfo.map((row, i) => (
              <div key={i} style={{
                display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "16px 0",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "4px" : "0",
              }}>
                <dt style={{ width: isMobile ? "auto" : "140px", flexShrink: 0, fontWeight: 700, fontSize: "13px", color: TEXT_W, letterSpacing: "0.05em" }}>
                  {row.dt}
                </dt>
                <dd style={{ fontSize: "14px", lineHeight: 1.7, color: TEXT_G, letterSpacing: "0.05em" }}>
                  {nl2br(row.dd)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== APPLY ===== */}
      <section id="apply" style={{ padding: isMobile ? "68px 20px 52px" : "105px 48px 82px", background: BG_DARK }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <SectionTitle label="APPLY" title="Web応募フォーム" />
          <form onSubmit={handleSubmit} data-anim style={{ ...animStyle(0.15), marginTop: "36px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { key: "name" as const, label: "お名前", type: "text", required: true },
              { key: "phone" as const, label: "電話番号", type: "tel", required: true },
              { key: "email" as const, label: "メールアドレス", type: "email", required: false },
            ].map((field) => (
              <div key={field.key}>
                <label style={{ display: "block", fontSize: "13px", color: TEXT_G, marginBottom: "6px", letterSpacing: "0.05em" }}>
                  {field.label}{field.required && <span style={{ color: "#e55", marginLeft: "4px" }}>*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  style={{
                    width: "100%", padding: "14px 16px",
                    background: BG_CARD, border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "4px", color: TEXT_W, fontSize: "14px",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#888")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: "13px", color: TEXT_G, marginBottom: "6px", letterSpacing: "0.05em" }}>
                メッセージ
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: "100%", padding: "14px 16px", resize: "vertical",
                  background: BG_CARD, border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px", color: TEXT_W, fontSize: "14px",
                  outline: "none", fontFamily: "'Noto Sans JP',sans-serif", transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#888")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
            <button type="submit" style={{
              background: CTA_BG, color: TEXT_W, padding: "16px",
              border: "none", borderRadius: "4px", cursor: "pointer",
              fontWeight: 800, fontSize: "16px", letterSpacing: "0.06em",
              fontFamily: "'Noto Sans JP',sans-serif",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              送信する
            </button>
          </form>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{
        padding: isMobile ? "80px 20px 88px" : "120px 48px 130px",
        background: BG_CARD,
        textAlign: "center",
        borderTop: `3px solid ${ACCENT_LIGHT}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 背景画像 */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${IMG.delivery})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.1,
        }} />
        <div data-anim style={{ ...animStyle(0), maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
            fontSize: isMobile ? "20px" : "28px", lineHeight: 1.4, letterSpacing: "0.05em",
            color: TEXT_W, marginBottom: "20px",
          }}>
            {cta.heading}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.85, color: TEXT_G, letterSpacing: "0.05em", marginBottom: "32px" }}>
            {nl2br(cta.subtext)}
          </p>
          <a href={`tel:${cta.phone}`} style={{
            display: "inline-block",
            fontFamily: "'Oswald',sans-serif", fontWeight: 800,
            fontSize: isMobile ? "36px" : "52px", color: TEXT_W, letterSpacing: "0.04em",
            marginBottom: "8px",
          }}>
            {cta.phone}
          </a>
          <p style={{ fontSize: "12px", color: TEXT_G, letterSpacing: "0.05em", marginBottom: "28px" }}>
            {company.hours}
          </p>
          <a href="#apply" style={{
            display: "inline-block", background: CTA_BG, color: TEXT_W,
            padding: isMobile ? "14px 36px" : "16px 52px",
            borderRadius: "4px", fontWeight: 800, fontSize: "16px", letterSpacing: "0.06em",
            transition: "transform 0.3s, box-shadow 0.3s, background 0.3s",
            position: "relative", overflow: "hidden",
            animation: "pulse 2.5s ease-in-out 2s infinite",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.5)";
              e.currentTarget.style.background = "#3e444a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = CTA_BG;
            }}
          >
            <span style={{
              position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              animation: "shimmer 3s ease-in-out infinite 1s",
            }} />
            <span style={{ position: "relative", zIndex: 1 }}>{cta.webLabel}</span>
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: BG_DARK, padding: isMobile ? "48px 20px 28px" : "60px 48px 32px",
        borderTop: "none",
        position: "relative", overflow: "hidden",
      }}>
        {/* グラデーショントップライン */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${ACCENT_LIGHT}, transparent)` }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
            fontSize: isMobile ? "16px" : "18px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em",
            marginBottom: "28px", lineHeight: 1.5,
          }}>
            {footer.catchphrase}
          </p>

          <nav style={{
            display: "flex", flexWrap: "wrap", gap: isMobile ? "10px 16px" : "12px 28px",
            marginBottom: "32px",
          }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} style={{ fontSize: "12px", color: TEXT_G, letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_W)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_G)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
            &copy; {new Date().getFullYear()} {company.name} All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}


/* ─── Sub-components ─── */

function SectionTitle({ label, title, num }: { label: string; title: string; num?: string }) {
  return (
    <div data-anim style={{ opacity: 0, transform: "translateY(12px)", transition: "opacity 0.7s ease-out, transform 0.7s ease-out", position: "relative" }}>
      {/* 大きな背景番号 */}
      {num && (
        <span style={{
          position: "absolute", top: -28, left: 0,
          fontSize: 100, fontWeight: 900, color: "rgba(255,255,255,0.03)",
          fontFamily: "'Oswald',sans-serif", lineHeight: 1, pointerEvents: "none",
        }}>
          {num}
        </span>
      )}
      <span style={{
        fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "12px",
        letterSpacing: "0.2em", color: TEXT_G, textTransform: "uppercase",
        display: "block", marginBottom: "6px", position: "relative", zIndex: 1,
      }}>
        ─ {label} ─
      </span>
      <h2 style={{
        fontFamily: "'Oswald','Noto Sans JP',sans-serif", fontWeight: 800,
        fontSize: "28px", lineHeight: 1.2, letterSpacing: "0.05em", color: TEXT_W,
        position: "relative", zIndex: 1,
        textShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}>
        {title}
      </h2>
      <div style={{
        width: "48px", height: "3px",
        background: `linear-gradient(to right, ${ACCENT_LIGHT}, transparent)`,
        marginTop: "12px", borderRadius: "2px",
      }} />
    </div>
  );
}

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
          let start = 0;
          const duration = 1800;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = String(current);
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
