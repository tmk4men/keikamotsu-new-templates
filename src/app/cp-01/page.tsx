"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
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
} from "@/data/corporateSiteData";

/* ───────────────────────────────────────────
   色定数
   ─────────────────────────────────────────── */
const C = {
  bg1: "#0a0a0a",
  bg2: "#111111",
  bg3: "#181818",
  text: "#e5e5e5",
  white: "#ffffff",
  gold: "#c7a44e",
  goldDark: "#a8893e",
  cta: "#32373c",
  ctaHover: "#3e444a",
  muted: "#888888",
  border: "#2a2a2a",
  borderLight: "#333333",
};

/* ───────────────────────────────────────────
   IntersectionObserver フック
   ─────────────────────────────────────────── */
function useInView(threshold = 0.15) {
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
function useCountUp(target: number, start: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ───────────────────────────────────────────
   セクション見出しコンポーネント
   ─────────────────────────────────────────── */
function SectionHeading({
  en,
  ja,
  align = "left",
}: {
  en: string;
  ja: string;
  align?: "left" | "center";
}) {
  return (
    <div style={{ marginBottom: 48, textAlign: align }}>
      <p
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          color: C.gold,
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 400,
        }}
      >
        {en}
      </p>
      <h2
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.2,
          letterSpacing: "0.05em",
        }}
      >
        {ja}
      </h2>
      <div
        style={{
          width: 48,
          height: 2,
          background: C.gold,
          marginTop: 16,
          marginLeft: align === "center" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
        }}
      />
    </div>
  );
}

/* ───────────────────────────────────────────
   メインページ
   ─────────────────────────────────────────── */
export default function CP01Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    const onScroll = () => setScrolled(window.scrollY > 60);
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // IntersectionObservers for sections
  const svcRef = useInView(0.1);
  const strRef = useInView(0.1);
  const ceoRef = useInView(0.15);
  const coRef = useInView(0.1);
  const hisRef = useInView(0.1);
  const numRef = useInView(0.1);
  const prtRef = useInView(0.1);
  const newsRef = useInView(0.1);
  const recRef = useInView(0.1);
  const accRef = useInView(0.1);
  const ctRef = useInView(0.1);

  const fadeStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const wrap = (mobile: boolean): React.CSSProperties => ({
    maxWidth: 1100,
    margin: "0 auto",
    padding: mobile ? "0 20px" : "0 40px",
  });

  /* ─── Header ─── */
  const renderHeader = () => (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? C.bg1 : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          ...wrap(isMobile),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: isMobile ? 60 : 72,
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: C.gold,
              letterSpacing: "0.05em",
            }}
          >
            GL
          </span>
          {!isMobile && (
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.7rem",
                color: C.text,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Green Logistics
            </span>
          )}
        </a>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.slice(0, 6).map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.78rem",
                  color: C.text,
                  letterSpacing: "0.05em",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone}`}
              style={{
                textDecoration: "none",
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.9rem",
                color: C.gold,
                letterSpacing: "0.08em",
                borderLeft: `1px solid ${C.border}`,
                paddingLeft: 24,
                marginLeft: 4,
              }}
            >
              {company.phone}
            </a>
          </nav>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
            aria-label="メニュー"
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: C.gold,
                transition: "transform 0.3s, opacity 0.3s",
                transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: C.gold,
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: C.gold,
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <nav
          style={{
            background: "rgba(10,10,10,0.98)",
            padding: "24px 20px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.95rem",
                color: C.text,
                letterSpacing: "0.05em",
                paddingBottom: 12,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${company.phone}`}
            style={{
              textDecoration: "none",
              fontFamily: "'Oswald', sans-serif",
              fontSize: "1.1rem",
              color: C.gold,
              letterSpacing: "0.08em",
              marginTop: 8,
            }}
          >
            TEL {company.phone}
          </a>
        </nav>
      )}
    </header>
  );

  /* ─── Hero ─── */
  const renderHero = () => (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/videos/hero-nightcity.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 100%)",
        }}
      />
      <div style={{ ...wrap(isMobile), position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 640 }}>
          <h1
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: isMobile ? "2rem" : "3rem",
              fontWeight: 800,
              color: C.white,
              lineHeight: 1.1,
              letterSpacing: "0.05em",
              marginBottom: 28,
            }}
          >
            {hero.headline}
          </h1>
          {hero.subtext.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                color: C.text,
                lineHeight: 1.8,
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              {line}
            </p>
          ))}
          <a
            href="#contact"
            style={{
              display: "inline-block",
              marginTop: 36,
              padding: "16px 48px",
              background: C.gold,
              color: C.bg1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textDecoration: "none",
              borderRadius: "0.375rem",
              transition: "opacity 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {hero.cta}
          </a>
        </div>
      </div>
      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "0.6rem",
            color: C.muted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
          }}
        />
      </div>
    </section>
  );

  /* ─── Services ─── */
  const renderServices = () => (
    <section
      id="services"
      ref={svcRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 60px" : "140px 0 100px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div style={fadeStyle(svcRef.visible)}>
          <SectionHeading en="Services" ja="事業内容" />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "1.2fr 0.8fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 20 : 24,
            marginTop: 16,
          }}
        >
          {/* Left – main card */}
          <div
            style={{
              ...fadeStyle(svcRef.visible, 0.1),
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: "1rem",
              padding: isMobile ? 28 : 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: isMobile ? "auto" : 420,
            }}
          >
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "3rem",
                fontWeight: 700,
                color: C.gold,
                lineHeight: 1,
                marginBottom: 16,
                opacity: 0.3,
              }}
            >
              {services[0].num}
            </span>
            <h3
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: isMobile ? "1.3rem" : "1.5rem",
                fontWeight: 700,
                color: C.white,
                lineHeight: 1.2,
                letterSpacing: "0.05em",
                marginBottom: 20,
              }}
            >
              {services[0].title}
            </h3>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.9rem",
                color: C.text,
                lineHeight: 1.8,
                letterSpacing: "0.05em",
                whiteSpace: "pre-line",
              }}
            >
              {services[0].text}
            </p>
          </div>
          {/* Right – 3 stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 24 }}>
            {services.slice(1).map((s, i) => (
              <div
                key={s.num}
                style={{
                  ...fadeStyle(svcRef.visible, 0.15 + i * 0.1),
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.625rem",
                  padding: isMobile ? 24 : 28,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: C.gold,
                      opacity: 0.4,
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: C.white,
                      lineHeight: 1.2,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.82rem",
                    color: C.text,
                    lineHeight: 1.8,
                    letterSpacing: "0.05em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Strengths ─── */
  const renderStrengths = () => (
    <section
      id="strengths"
      ref={strRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 70px" : "120px 0 110px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div style={fadeStyle(strRef.visible)}>
          <SectionHeading en="Strengths" ja="私たちの強み" />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "1.1fr 0.9fr 1fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 28 : 36,
            marginTop: 8,
          }}
        >
          {strengths.map((s, i) => (
            <div
              key={s.num}
              style={{
                ...fadeStyle(strRef.visible, 0.1 + i * 0.12),
                paddingTop: 24,
                borderTop: `3px solid ${C.gold}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: C.gold,
                  lineHeight: 1,
                  opacity: 0.35,
                }}
              >
                {s.num}
              </span>
              <h3
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1.3,
                  letterSpacing: "0.05em",
                  margin: "16px 0 14px",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.85rem",
                  color: C.text,
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                  whiteSpace: "pre-line",
                }}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─── CEO Message ─── */
  const renderCeoMessage = () => (
    <section
      id="message"
      ref={ceoRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 70px" : "120px 0 100px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 840 }}>
        <div style={fadeStyle(ceoRef.visible)}>
          <SectionHeading en="CEO Message" ja="代表メッセージ" />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "0.4fr 0.6fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 32 : 56,
            alignItems: "start",
            ...fadeStyle(ceoRef.visible, 0.15),
          }}
        >
          {/* Photo */}
          <div
            style={{
              position: "relative",
              maxWidth: isMobile ? 280 : "100%",
            }}
          >
            <div
              style={{
                transform: "rotate(-2deg)",
                overflow: "hidden",
                borderRadius: "0.625rem",
                border: `1px solid ${C.border}`,
              }}
            >
              <img
                src="/images/ceo-portrait.webp"
                alt={`${ceoMessage.name} ${ceoMessage.title}`}
                style={{ width: "100%", display: "block", filter: "grayscale(20%)" }}
              />
            </div>
            <div
              style={{
                marginTop: 20,
                textAlign: isMobile ? "left" : "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.75rem",
                  color: C.muted,
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                {ceoMessage.title}
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.white,
                  letterSpacing: "0.08em",
                }}
              >
                {ceoMessage.name}
              </p>
            </div>
          </div>
          {/* Text */}
          <div>
            {ceoMessage.message.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.92rem",
                  color: C.text,
                  lineHeight: 2,
                  letterSpacing: "0.05em",
                  marginBottom: 24,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Company Overview ─── */
  const renderCompany = () => (
    <section
      id="company"
      ref={coRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 60px" : "90px 0 80px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div style={fadeStyle(coRef.visible)}>
          <SectionHeading en="Company" ja="会社概要" />
        </div>
        <div style={{ ...fadeStyle(coRef.visible, 0.1), maxWidth: 800 }}>
          {companyOverview.map((item, i) => (
            <div
              key={i}
              style={{
                display: isMobile ? "flex" : "grid",
                gridTemplateColumns: isMobile ? undefined : "160px 1fr",
                flexDirection: isMobile ? "column" : undefined,
                borderBottom: `1px solid ${C.border}`,
                padding: isMobile ? "16px 0" : "20px 0",
              }}
            >
              <dt
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: C.gold,
                  letterSpacing: "0.08em",
                  marginBottom: isMobile ? 6 : 0,
                  paddingTop: 2,
                }}
              >
                {item.dt}
              </dt>
              <dd
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.88rem",
                  color: C.text,
                  lineHeight: 1.8,
                  letterSpacing: "0.04em",
                  margin: 0,
                }}
              >
                {item.dd}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─── History ─── */
  const renderHistory = () => {
    const total = history.length;
    return (
      <section
        id="history"
        ref={hisRef.ref}
        style={{ background: C.bg1, padding: isMobile ? "80px 0 70px" : "96px 0 84px" }}
      >
        <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
          <div style={fadeStyle(hisRef.visible)}>
            <SectionHeading en="History" ja="沿革" />
          </div>
          <div style={{ position: "relative", marginTop: 8, paddingLeft: isMobile ? 32 : 48 }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: isMobile ? 6 : 12,
                top: 0,
                bottom: 0,
                width: 2,
                background: C.border,
              }}
            />
            {/* Progress bar */}
            <div
              style={{
                position: "absolute",
                left: isMobile ? 6 : 12,
                top: 0,
                width: 2,
                height: hisRef.visible ? "100%" : "0%",
                background: C.gold,
                transition: "height 1.5s ease",
              }}
            />
            {history.map((h, i) => (
              <div
                key={h.year}
                style={{
                  ...fadeStyle(hisRef.visible, 0.15 + i * 0.12),
                  position: "relative",
                  paddingBottom: i < total - 1 ? 40 : 0,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: isMobile ? -32 : -42,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.gold,
                    border: `3px solid ${C.bg1}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    color: C.gold,
                    letterSpacing: "0.05em",
                  }}
                >
                  {h.year}
                </span>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.88rem",
                    color: C.text,
                    lineHeight: 1.8,
                    letterSpacing: "0.05em",
                    marginTop: 8,
                  }}
                >
                  {h.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ─── Numbers ─── */
  const renderNumbers = () => (
    <section
      id="numbers"
      ref={numRef.ref}
      style={{
        background: `linear-gradient(135deg, ${C.bg2} 0%, #1a1810 100%)`,
        padding: isMobile ? "70px 0" : "100px 0 90px",
      }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 960 }}>
        <div style={fadeStyle(numRef.visible)}>
          <SectionHeading en="Numbers" ja="実績" align="center" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1fr 1.1fr 0.9fr 1fr",
            gap: isMobile ? 24 : 40,
            marginTop: 8,
          }}
        >
          {numbers.map((n, i) => {
            const numericValue = parseFloat(n.value.replace(/,/g, ""));
            return (
              <NumberCard
                key={i}
                label={n.label}
                target={numericValue}
                suffix={n.suffix}
                started={numRef.visible}
                delay={0.1 + i * 0.1}
                visible={numRef.visible}
                hasComma={n.value.includes(",")}
              />
            );
          })}
        </div>
      </div>
    </section>
  );

  /* ─── Partners ─── */
  const renderPartners = () => (
    <section
      id="partners"
      ref={prtRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 60px" : "70px 0 60px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 960 }}>
        <div style={fadeStyle(prtRef.visible)}>
          <SectionHeading en="Partners" ja="主要取引先" align="center" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1fr 1.2fr 0.8fr",
            gap: isMobile ? 16 : 24,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {partners.map((p, i) => (
            <div
              key={i}
              style={{
                ...fadeStyle(prtRef.visible, 0.08 + i * 0.06),
                background: C.bg2,
                border: `1px solid ${C.border}`,
                borderRadius: "0.625rem",
                padding: isMobile ? "24px 16px" : "32px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: C.bg3,
                  border: `1px solid ${C.borderLight}`,
                  margin: "0 auto 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "0.9rem",
                  color: C.gold,
                  fontWeight: 600,
                }}
              >
                {p.name.charAt(p.name.length - 2)}社
              </div>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.78rem",
                  color: C.text,
                  lineHeight: 1.5,
                  letterSpacing: "0.04em",
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.68rem",
                  color: C.muted,
                  marginTop: 6,
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

  /* ─── News ─── */
  const renderNews = () => (
    <section
      id="news"
      ref={newsRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 60px" : "76px 0 64px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div style={fadeStyle(newsRef.visible)}>
          <SectionHeading en="News" ja="お知らせ" />
        </div>
        <div style={{ maxWidth: 820, ...fadeStyle(newsRef.visible, 0.1) }}>
          {news.map((n, i) => {
            const tagColors: Record<string, string> = {
              press: "#8b6914",
              new: "#2d5a3d",
              default: "#3a3a3a",
            };
            return (
              <a
                key={i}
                href="#"
                style={{
                  display: isMobile ? "block" : "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom: `1px solid ${C.border}`,
                  textDecoration: "none",
                  transition: "opacity 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "0.8rem",
                    color: C.muted,
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                    marginBottom: isMobile ? 8 : 0,
                    display: "block",
                  }}
                >
                  {n.date}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.68rem",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    color: C.white,
                    background: tagColors[n.tagStyle] || tagColors.default,
                    padding: "3px 12px",
                    borderRadius: "0.375rem",
                    letterSpacing: "0.06em",
                    flexShrink: 0,
                    marginBottom: isMobile ? 8 : 0,
                    marginRight: isMobile ? 8 : 0,
                  }}
                >
                  {n.tag}
                </span>
                <span
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.88rem",
                    color: C.text,
                    letterSpacing: "0.04em",
                    display: "block",
                  }}
                >
                  {n.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );

  /* ─── Recruit ─── */
  const renderRecruit = () => (
    <section
      id="recruit"
      ref={recRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 60px" : "130px 0 140px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div
          style={{
            ...fadeStyle(recRef.visible, 0.1),
            background: `linear-gradient(135deg, ${C.bg3} 0%, #1a1a14 100%)`,
            border: `1px solid ${C.border}`,
            borderRadius: "1rem",
            padding: isMobile ? "40px 24px" : "64px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative gold line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${C.gold}, transparent)`,
            }}
          />
          <p
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Recruit
          </p>
          <h2
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: isMobile ? "1.3rem" : "1.6rem",
              fontWeight: 700,
              color: C.white,
              lineHeight: 1.3,
              letterSpacing: "0.05em",
              marginBottom: 20,
            }}
          >
            {recruit.heading}
          </h2>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.88rem",
              color: C.text,
              lineHeight: 1.9,
              letterSpacing: "0.05em",
              whiteSpace: "pre-line",
              marginBottom: 32,
              maxWidth: 560,
            }}
          >
            {recruit.text}
          </p>
          <a
            href={recruit.link}
            style={{
              display: "inline-block",
              padding: "14px 44px",
              background: C.gold,
              color: C.bg1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.88rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textDecoration: "none",
              borderRadius: "0.375rem",
              transition: "opacity 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {recruit.cta}
          </a>
        </div>
      </div>
    </section>
  );

  /* ─── Access ─── */
  const renderAccess = () => (
    <section
      id="access"
      ref={accRef.ref}
      style={{ background: C.bg2, padding: isMobile ? "80px 0 60px" : "88px 0 76px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 1100 }}>
        <div style={fadeStyle(accRef.visible)}>
          <SectionHeading en="Access" ja={access.heading} />
        </div>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? undefined : "1.3fr 0.7fr",
            flexDirection: isMobile ? "column" : undefined,
            gap: isMobile ? 28 : 40,
            ...fadeStyle(accRef.visible, 0.1),
          }}
        >
          <div
            style={{
              borderRadius: "0.625rem",
              overflow: "hidden",
              border: `1px solid ${C.border}`,
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5!2d135.6281!3d34.7667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzAwLjAiTiAxMzXCsDM3JzQxLjAiRQ!5e0!3m2!1sja!2sjp!4v1"
              width="100%"
              height={isMobile ? "260" : "320"}
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div>
            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.75rem",
                  color: C.gold,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                所在地
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.92rem",
                  color: C.text,
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              >
                〒{company.postalCode}
                <br />
                {access.address}
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.75rem",
                  color: C.gold,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                最寄り駅
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.88rem",
                  color: C.text,
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              >
                {access.nearestStation}
              </p>
            </div>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.82rem",
                color: C.muted,
                lineHeight: 1.7,
                letterSpacing: "0.04em",
                marginTop: 16,
                paddingTop: 16,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {access.mapNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Contact ─── */
  const renderContact = () => (
    <section
      id="contact"
      ref={ctRef.ref}
      style={{ background: C.bg1, padding: isMobile ? "80px 0 70px" : "134px 0 144px" }}
    >
      <div style={{ ...wrap(isMobile), maxWidth: 720 }}>
        <div style={fadeStyle(ctRef.visible)}>
          <SectionHeading en="Contact" ja={contact.heading} align="center" />
        </div>
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            ...fadeStyle(ctRef.visible, 0.1),
          }}
        >
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.88rem",
              color: C.text,
              lineHeight: 1.8,
              letterSpacing: "0.05em",
              textAlign: "center",
              marginBottom: 40,
              whiteSpace: "pre-line",
            }}
          >
            {contact.intro}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {contact.fields.map((f) => (
              <div key={f.name}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.82rem",
                    color: C.text,
                    letterSpacing: "0.05em",
                    marginBottom: 8,
                  }}
                >
                  {f.label}
                  {f.required && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: C.bg1,
                        background: C.gold,
                        padding: "1px 8px",
                        borderRadius: "0.25rem",
                        fontWeight: 600,
                      }}
                    >
                      必須
                    </span>
                  )}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    required={f.required}
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: C.bg2,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.375rem",
                      color: C.white,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "0.88rem",
                      lineHeight: 1.7,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                ) : (
                  <input
                    type={f.type}
                    name={f.name}
                    required={f.required}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: C.bg2,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.375rem",
                      color: C.white,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                )}
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                type="submit"
                style={{
                  padding: "16px 64px",
                  background: C.cta,
                  color: C.white,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  transition: "opacity 0.15s ease, background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                送信する
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

  /* ─── Footer ─── */
  const renderFooter = () => (
    <footer
      style={{
        background: "#050505",
        borderTop: `1px solid ${C.border}`,
        padding: isMobile ? "48px 0 32px" : "64px 0 40px",
      }}
    >
      <div style={wrap(isMobile)}>
        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            fontWeight: 700,
            color: C.white,
            letterSpacing: "0.08em",
            marginBottom: 28,
          }}
        >
          {footer.catchphrase}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 14 : 24,
            marginBottom: 40,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                textDecoration: "none",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "0.75rem",
                color: C.muted,
                letterSpacing: "0.04em",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div
          style={{
            display: isMobile ? "block" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "0.72rem",
              color: C.muted,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 8 : 0,
            }}
          >
            {company.name}
          </p>
          <p
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.68rem",
              color: "#555",
              letterSpacing: "0.1em",
            }}
          >
            &copy; {new Date().getFullYear()} {company.nameEn} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div style={{ background: C.bg1, color: C.text, minHeight: "100vh" }}>
      {renderHeader()}
      {renderHero()}
      {renderServices()}
      {renderStrengths()}
      {renderCeoMessage()}
      {renderCompany()}
      {renderHistory()}
      {renderNumbers()}
      {renderPartners()}
      {renderNews()}
      {renderRecruit()}
      {renderAccess()}
      {renderContact()}
      {renderFooter()}
    </div>
  );
}

/* ───────────────────────────────────────────
   Number Card (カウントアップ)
   ─────────────────────────────────────────── */
function NumberCard({
  label,
  target,
  suffix,
  started,
  delay,
  visible,
  hasComma,
}: {
  label: string;
  target: number;
  suffix: string;
  started: boolean;
  delay: number;
  visible: boolean;
  hasComma: boolean;
}) {
  const count = useCountUp(target, started, 2200);
  const displayValue = hasComma ? count.toLocaleString() : count;

  return (
    <div
      style={{
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "2.8rem",
            fontWeight: 700,
            color: C.gold,
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: "0.85rem",
            color: C.gold,
            fontWeight: 500,
          }}
        >
          {suffix}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: "0.78rem",
          color: C.text,
          marginTop: 10,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}
