"use client";

import React, { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import {
  company,
  meta,
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

/* ───────────────────── CONSTANTS ───────────────────── */
const ACCENT = "#32373c";
const DARK = "#0d1117";
const LIGHT = "#ffffff";
const CTA_BG = "#32373c";
const SUB_DARK = "#2d2d2d";
const BP = 768;

/* ───────────────────── HOOK: isMobile ───────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < BP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ───────────────────── HOOK: IntersectionObserver ───────────────────── */
function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

/* ───────────────────── SECTION WRAPPER ───────────────────── */
function Section({
  id,
  bg,
  children,
  style,
  clip,
}: {
  id?: string;
  bg: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  clip?: string;
}) {
  return (
    <section
      id={id}
      style={{
        background: bg,
        position: "relative",
        overflow: "hidden",
        clipPath: clip || "none",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function CP04Page() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ─── shared text styles ─── */
  const headingStyle: React.CSSProperties = {
    fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
    fontWeight: 800,
    margin: 0,
  };
  const bodyFont: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 400,
    lineHeight: 1.85,
  };
  const jpHeading: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
  };

  /* ───────── HEADER ───────── */
  const headerEl = (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: scrolled ? DARK : "transparent",
        borderBottom: scrolled ? `1px solid rgba(255,255,255,0.12)` : "none",
        transition: "background .4s, border-color .4s",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "14px 20px" : "16px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{
            ...headingStyle,
            fontSize: isMobile ? 18 : 22,
            color: LIGHT,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {company.name.slice(0, 8)}
          <span style={{ color: "#888", marginLeft: 2 }}>.</span>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.slice(0, 6).map((l) => (
              <a
                key={l.href}
                onClick={() => scrollTo(l.href)}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "color .2s",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = LIGHT)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
                }
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                background: CTA_BG,
                color: LIGHT,
                border: "none",
                padding: "10px 26px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
                clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
                transition: "opacity .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              お問い合わせ
            </button>
          </nav>
        )}

        {/* Mobile hamburger */}
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
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 24,
                  height: 2,
                  background: LIGHT,
                  transition: "transform .3s, opacity .3s",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translate(5px,5px)"
                      : menuOpen && i === 2
                        ? "rotate(-45deg) translate(5px,-5px)"
                        : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <nav
          style={{
            background: "rgba(13,17,23,0.98)",
            padding: "20px 24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              onClick={() => scrollTo(l.href)}
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                fontSize: 15,
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 14,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );

  /* ───────── HERO ───────── */
  const heroEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section bg={DARK} style={{ minHeight: "100vh" }}>
        <div
          ref={ref}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            minHeight: "100vh",
          }}
        >
          {/* Left */}
          <div
            style={{
              flex: isMobile ? "none" : 1,
              background: DARK,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: isMobile ? "120px 24px 48px" : "0 64px",
              position: "relative",
              zIndex: 2,
              clipPath: isMobile
                ? "none"
                : "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0)" : "translateX(-60px)",
              transition: "opacity .8s ease, transform .8s ease",
            }}
          >
            <div
              style={{
                width: 48,
                height: 4,
                background: "#555",
                marginBottom: 28,
              }}
            />
            <h1
              style={{
                ...headingStyle,
                fontSize: isMobile ? 32 : 56,
                color: LIGHT,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              {hero.headline}
            </h1>
            <p
              style={{
                ...bodyFont,
                color: "rgba(255,255,255,0.7)",
                fontSize: isMobile ? 14 : 16,
                maxWidth: 480,
                marginBottom: 40,
              }}
            >
              {hero.subtext[0]}
            </p>
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                background: CTA_BG,
                color: LIGHT,
                border: "none",
                padding: isMobile ? "16px 32px" : "18px 44px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
                clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                alignSelf: "flex-start",
                transition: "opacity .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {hero.cta}
            </button>
          </div>

          {/* Right — video */}
          <div
            style={{
              flex: isMobile ? "none" : 1,
              position: "relative",
              minHeight: isMobile ? 300 : "100vh",
              overflow: "hidden",
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
                left: isMobile ? 0 : "-15%",
                width: isMobile ? "100%" : "115%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src="/keikamotsu-new-templates/videos/hero-daytime.mp4" type="video/mp4" />
            </video>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(13,17,23,0.4) 0%, transparent 40%)",
              }}
            />
          </div>
        </div>
      </Section>
    );
  })();

  /* ───────── SERVICES ───────── */
  const servicesEl = (() => {
    return (
      <Section id="services" bg={LIGHT} style={{ paddingTop: isMobile ? 80 : 150, paddingBottom: isMobile ? 60 : 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {services.map((s, i) => {
            const isOdd = i % 2 === 0;
            const bg = isOdd ? DARK : LIGHT;
            const fg = isOdd ? LIGHT : DARK;
            return <ServiceRow key={s.num} s={s} isOdd={isOdd} bg={bg} fg={fg} isMobile={isMobile} headingStyle={headingStyle} jpHeading={jpHeading} bodyFont={bodyFont} />;
          })}
        </div>
      </Section>
    );
  })();

  /* ───────── STRENGTHS ───────── */
  const strengthsEl = (() => {
    return (
      <Section
        id="strengths"
        bg={DARK}
        style={{
          padding: isMobile ? "72px 20px" : "120px 48px 110px",
          backgroundImage: "url(/keikamotsu-new-templates/images/strength-01.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── Our Strengths ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: LIGHT,
              marginBottom: isMobile ? 48 : 72,
            }}
          >
            私たちの強み
          </h2>
          {strengths.map((st) => (
            <StrengthItem key={st.num} st={st} isMobile={isMobile} headingStyle={headingStyle} jpHeading={jpHeading} bodyFont={bodyFont} />
          ))}
        </div>
      </Section>
    );
  })();

  /* ───────── CEO MESSAGE ───────── */
  const ceoEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section id="message" bg={LIGHT}>
        <div
          ref={ref}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            minHeight: isMobile ? "auto" : 600,
          }}
        >
          {/* Left photo */}
          <div
            style={{
              flex: isMobile ? "none" : "0 0 45%",
              minHeight: isMobile ? 320 : 600,
              background: `url(/images/ceo-portrait.webp) center/cover no-repeat`,
              clipPath: isMobile
                ? "polygon(0 0, 100% 0, 100% 90%, 0 100%)"
                : "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity .8s ease, transform .8s ease",
            }}
          />

          {/* Right text */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: isMobile ? "40px 24px 64px" : "60px 64px 60px 80px",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0)" : "translateX(40px)",
              transition: "opacity .8s ease .2s, transform .8s ease .2s",
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "#555",
                marginBottom: 24,
              }}
            />
            <p
              style={{
                ...headingStyle,
                fontSize: 12,
                color: ACCENT,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              ── CEO Message ──
            </p>
            <h2
              style={{
                ...jpHeading,
                fontSize: isMobile ? 24 : 32,
                color: DARK,
                marginBottom: 32,
              }}
            >
              代表メッセージ
            </h2>
            {ceoMessage.message.map((p, i) => (
              <p
                key={i}
                style={{
                  ...bodyFont,
                  color: "#444",
                  fontSize: 15,
                  marginBottom: 18,
                }}
              >
                {p}
              </p>
            ))}
            <p
              style={{
                ...jpHeading,
                fontSize: 16,
                color: DARK,
                marginTop: 16,
              }}
            >
              {ceoMessage.title}
              <span style={{ marginLeft: 16 }}>{ceoMessage.name}</span>
            </p>
          </div>
        </div>
      </Section>
    );
  })();

  /* ───────── COMPANY ───────── */
  const companyEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section
        id="company"
        bg={LIGHT}
        style={{ padding: isMobile ? "64px 20px 56px" : "85px 48px 75px" }}
      >
        <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 12,
              color: ACCENT,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── Company ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: DARK,
              marginBottom: 48,
            }}
          >
            会社概要
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(12px)",
              transition: "opacity .7s ease, transform .7s ease",
            }}
          >
            <tbody>
              {companyOverview.map((row) => (
                <tr
                  key={row.dt}
                  style={{ borderBottom: `1px solid #e8e8e8` }}
                >
                  <td
                    style={{
                      ...jpHeading,
                      fontSize: 14,
                      color: DARK,
                      padding: isMobile ? "16px 8px" : "20px 24px",
                      whiteSpace: "nowrap",
                      width: isMobile ? 100 : 160,
                      verticalAlign: "top",
                    }}
                  >
                    <span style={{ marginRight: 6 }}>▪</span>{row.dt}
                  </td>
                  <td
                    style={{
                      ...bodyFont,
                      fontSize: 14,
                      color: "#444",
                      padding: isMobile ? "16px 8px" : "20px 24px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {typeof row.dd === "string" ? row.dd.split("\n").map((line: string, li: number) => <span key={li}>{line}{li < row.dd.split("\n").length - 1 && <br />}</span>) : row.dd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    );
  })();

  /* ───────── HISTORY ───────── */
  const historyEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section
        id="history"
        bg="#f5f5f5"
        style={{
          padding: isMobile ? "48px 20px 40px" : "65px 48px 55px",
        }}
      >
        <div ref={ref} style={{ maxWidth: 840, margin: "0 auto" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 12,
              color: ACCENT,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── History ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: DARK,
              marginBottom: 56,
            }}
          >
            沿革
          </h2>
          {history.map((h, i) => (
            <div
              key={h.year}
              style={{
                display: "flex",
                gap: isMobile ? 16 : 32,
                marginBottom: 36,
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(12px)",
                transition: `opacity .6s ease ${i * 0.12}s, transform .6s ease ${i * 0.12}s`,
              }}
            >
              <div
                style={{
                  ...headingStyle,
                  fontSize: isMobile ? 28 : 40,
                  color: ACCENT,
                  minWidth: isMobile ? 70 : 100,
                  lineHeight: 1,
                }}
              >
                {h.year}
              </div>
              <div
                style={{
                  flex: 1,
                  background: LIGHT,
                  padding: isMobile ? "18px 20px" : "24px 32px",
                  borderLeft: `4px solid #555`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <p style={{ ...bodyFont, fontSize: 15, color: "#333", margin: 0 }}>
                  {h.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  })();

  /* ───────── NUMBERS ───────── */
  const numbersEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section
        id="numbers"
        bg={CTA_BG}
        style={{ padding: isMobile ? "72px 20px 56px" : "105px 48px 90px" }}
        clip="polygon(0 8%, 100% 0, 100% 92%, 0 100%)"
      >
        <div
          ref={ref}
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1.1fr 0.9fr" : "0.95fr 1.1fr 0.9fr 1.05fr",
            gap: isMobile ? 32 : 48,
            textAlign: "center",
          }}
        >
          {numbers.map((n, i) => (
            <div
              key={n.label}
              style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(12px)",
                transition: `opacity .6s ease ${i * 0.12}s, transform .6s ease ${i * 0.12}s`,
              }}
            >
              <div
                style={{
                  ...headingStyle,
                  fontSize: isMobile ? 40 : 56,
                  color: LIGHT,
                  lineHeight: 1.1,
                }}
              >
                {n.value}
                <span style={{ fontSize: isMobile ? 18 : 22, marginLeft: 4 }}>
                  {n.suffix}
                </span>
              </div>
              <p
                style={{
                  ...jpHeading,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                  marginTop: 8,
                }}
              >
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </Section>
    );
  })();

  /* ───────── PARTNERS ───────── */
  const partnersEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section
        id="partners"
        bg={LIGHT}
        style={{ padding: isMobile ? "56px 20px 48px" : "75px 48px 65px" }}
      >
        <div ref={ref} style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 12,
              color: ACCENT,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── Partners ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: DARK,
              marginBottom: 56,
            }}
          >
            主要取引先
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1.15fr 0.85fr 1fr",
              gap: 24,
              opacity: vis ? 1 : 0,
              transition: "opacity .8s ease",
            }}
          >
            {partners.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "#f8f8f8",
                  padding: "32px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  border: "1px solid #eee",
                  transition: "box-shadow .3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: DARK,
                    clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{ ...headingStyle, fontSize: 18, color: LIGHT }}
                  >
                    {p.name.charAt(p.name.length - 2)}
                  </span>
                </div>
                <p
                  style={{
                    ...jpHeading,
                    fontSize: 13,
                    color: "#555",
                    margin: 0,
                  }}
                >
                  {p.name}
                </p>
                <span
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}
                >
                  {p.industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    );
  })();

  /* ───────── NEWS ───────── */
  const newsEl = (() => {
    const [ref, vis] = useReveal();
    const tagColors: Record<string, string> = {
      press: "#555",
      new: "#555",
      default: CTA_BG,
    };
    return (
      <Section
        id="news"
        bg={DARK}
        style={{ padding: isMobile ? "52px 20px 44px" : "70px 48px 60px" }}
      >
        <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── News ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: LIGHT,
              marginBottom: 48,
            }}
          >
            お知らせ
          </h2>
          {news.map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 8 : 24,
                padding: "22px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                opacity: vis ? 1 : 0,
                transform: vis ? "translateX(0)" : "translateX(-24px)",
                transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottomColor =
                  "rgba(255,255,255,0.08)")
              }
            >
              <span
                style={{
                  ...headingStyle,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  minWidth: 100,
                }}
              >
                ─ {n.date}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: LIGHT,
                  background: tagColors[n.tagStyle] || CTA_BG,
                  padding: "3px 12px",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
              >
                {n.tag}
              </span>
              <span
                style={{
                  ...bodyFont,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                  flex: 1,
                }}
              >
                {n.title}
              </span>
            </div>
          ))}
        </div>
      </Section>
    );
  })();

  /* ───────── RECRUIT ───────── */
  const recruitEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section id="recruit" bg={DARK}>
        <div
          ref={ref}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            minHeight: isMobile ? "auto" : 420,
          }}
        >
          {/* Left — dark with bg image */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(rgba(13,17,23,0.85), rgba(13,17,23,0.85)), url(/keikamotsu-new-templates/images/team.webp) center/cover no-repeat`,
              padding: isMobile ? "64px 24px" : "80px 64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity .7s ease, transform .7s ease",
            }}
          >
            <h2
              style={{
                ...jpHeading,
                fontSize: isMobile ? 24 : 32,
                color: LIGHT,
                marginBottom: 24,
              }}
            >
              {recruit.heading}
            </h2>
            <p
              style={{
                ...bodyFont,
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                whiteSpace: "pre-line",
              }}
            >
              {recruit.text}
            </p>
          </div>
          {/* Right — dark */}
          <div
            style={{
              flex: isMobile ? "none" : "0 0 40%",
              background: SUB_DARK,
              clipPath: isMobile
                ? "polygon(0 8%, 100% 0, 100% 100%, 0 100%)"
                : "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "64px 24px" : "80px 48px",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0)" : "translateX(40px)",
              transition: "opacity .7s ease .15s, transform .7s ease .15s",
            }}
          >
            <button
              onClick={() => window.open(recruit.link, "_blank")}
              style={{
                background: LIGHT,
                color: DARK,
                border: "none",
                padding: "20px 48px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
                clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                transition: "transform .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {recruit.cta}
            </button>
          </div>
        </div>
      </Section>
    );
  })();

  /* ───────── ACCESS ───────── */
  const accessEl = (() => {
    const [ref, vis] = useReveal();
    return (
      <Section
        id="access"
        bg="#f5f5f5"
        style={{ padding: isMobile ? "64px 20px 56px" : "95px 48px 80px" }}
      >
        <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 12,
              color: ACCENT,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── Access ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: DARK,
              marginBottom: 48,
            }}
          >
            {access.heading}
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 32 : 48,
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(12px)",
              transition: "opacity .7s ease, transform .7s ease",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    ...jpHeading,
                    fontSize: 14,
                    color: DARK,
                    marginBottom: 6,
                  }}
                >
                  所在地
                </p>
                <p style={{ ...bodyFont, fontSize: 15, color: "#444", margin: 0 }}>
                  〒{company.postalCode}
                  <br />
                  {access.address}
                </p>
              </div>
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    ...jpHeading,
                    fontSize: 14,
                    color: DARK,
                    marginBottom: 6,
                  }}
                >
                  最寄り駅
                </p>
                <p style={{ ...bodyFont, fontSize: 15, color: "#444", margin: 0 }}>
                  {access.nearestStation}
                </p>
              </div>
              <div>
                <p
                  style={{
                    ...jpHeading,
                    fontSize: 14,
                    color: DARK,
                    marginBottom: 6,
                  }}
                >
                  駐車場
                </p>
                <p style={{ ...bodyFont, fontSize: 15, color: "#444", margin: 0 }}>
                  {access.mapNote}
                </p>
              </div>
              <div style={{ marginTop: 28 }}>
                <p style={{ ...jpHeading, fontSize: 14, color: DARK, marginBottom: 6 }}>
                  電話番号
                </p>
                <p style={{ ...headingStyle, fontSize: 22, color: DARK, margin: 0 }}>
                  {company.phone}
                </p>
                <p style={{ ...bodyFont, fontSize: 12, color: "#999", marginTop: 4 }}>
                  {company.hours}
                </p>
              </div>
            </div>
            <div
              style={{
                flex: isMobile ? "none" : "0 0 55%",
                minHeight: 320,
                overflow: "hidden",
              }}
            >
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.123456789!2d135.636!3d34.766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5aSn6Ziq5bqc5a-d5bGL5bed5biC5rGg55SwMi0xMS01NQ!5e0!3m2!1sja!2sjp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 320 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Section>
    );
  })();

  /* ───────── CONTACT ───────── */
  const contactEl = (() => {
    const [ref, vis] = useReveal();
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    };
    const inputStyle: React.CSSProperties = {
      width: "100%",
      padding: "14px 16px",
      fontSize: 15,
      fontFamily: "'Noto Sans JP', sans-serif",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: LIGHT,
      outline: "none",
      transition: "border-color .2s",
      boxSizing: "border-box",
    };
    return (
      <Section
        id="contact"
        bg={DARK}
        style={{ padding: isMobile ? "80px 20px 80px" : "130px 48px 140px" }}
      >
        <div ref={ref} style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              ...headingStyle,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ── Contact ──
          </p>
          <h2
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: LIGHT,
              marginBottom: 20,
            }}
          >
            {contact.heading}
          </h2>
          <p
            style={{
              ...bodyFont,
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              whiteSpace: "pre-line",
              marginBottom: 48,
            }}
          >
            {contact.intro}
          </p>
          {submitted ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(255,255,255,0.2)`,
              }}
            >
              <p style={{ ...jpHeading, fontSize: 20, color: LIGHT }}>
                送信ありがとうございます
              </p>
              <p
                style={{
                  ...bodyFont,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 12,
                }}
              >
                担当者より折り返しご連絡いたします。
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(12px)",
                transition: "opacity .7s ease, transform .7s ease",
              }}
            >
              {contact.fields.map((f) => (
                <div key={f.name}>
                  <label
                    style={{
                      ...jpHeading,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {f.label}
                    {f.required && (
                      <span
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: 11,
                          marginLeft: 8,
                        }}
                      >
                        ＊必須
                      </span>
                    )}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      required={f.required}
                      rows={5}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.15)")
                      }
                    />
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.15)")
                      }
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                style={{
                  background: CTA_BG,
                  color: LIGHT,
                  border: "none",
                  padding: "18px 0",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  clipPath:
                    "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                  marginTop: 8,
                  transition: "opacity .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                送信する
              </button>
            </form>
          )}
        </div>
      </Section>
    );
  })();

  /* ───────── FOOTER ───────── */
  const footerEl = (
    <footer
      style={{
        background: "#000",
        padding: isMobile ? "48px 20px 24px" : "64px 48px 28px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 32,
          marginBottom: 48,
        }}
      >
        <div>
          <div
            style={{
              ...headingStyle,
              fontSize: 20,
              color: LIGHT,
              marginBottom: 8,
            }}
          >
            {company.name.slice(0, 8)}
            <span style={{ color: "#888" }}>.</span>
          </div>
          <p
            style={{
              ...bodyFont,
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            {footer.catchphrase}
          </p>
        </div>
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 14 : 24,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              onClick={() => scrollTo(l.href)}
              style={{
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                fontSize: 12,
                fontFamily: "'Noto Sans JP', sans-serif",
                cursor: "pointer",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 20,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Inter', sans-serif",
            margin: 0,
          }}
        >
          &copy; {new Date().getFullYear()} {company.nameEn} All rights
          reserved.
        </p>
      </div>
    </footer>
  );

  /* ───────── RENDER ───────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        ::selection { background:${CTA_BG}; color:#fff; }
      `}</style>
      {headerEl}
      <main>
        {heroEl}
        {servicesEl}
        {strengthsEl}
        {ceoEl}
        {companyEl}
        {historyEl}
        {numbersEl}
        {partnersEl}
        {newsEl}
        {recruitEl}
        {accessEl}
        {contactEl}
      </main>
      {footerEl}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS (avoid hook issues with inline IIFEs)
   ═══════════════════════════════════════════════════════════ */

function ServiceRow({
  s,
  isOdd,
  bg,
  fg,
  isMobile,
  headingStyle,
  jpHeading,
  bodyFont,
}: {
  s: (typeof services)[number];
  isOdd: boolean;
  bg: string;
  fg: string;
  isMobile: boolean;
  headingStyle: React.CSSProperties;
  jpHeading: React.CSSProperties;
  bodyFont: React.CSSProperties;
}) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: isMobile
          ? "column"
          : isOdd
            ? "row"
            : "row-reverse",
        minHeight: isMobile ? "auto" : 380,
      }}
    >
      {/* Text side */}
      <div
        style={{
          flex: 1,
          background: bg,
          padding: isMobile ? "56px 24px" : "72px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          clipPath:
            !isMobile && isOdd
              ? "polygon(0 0, 100% 0, 90% 100%, 0 100%)"
              : !isMobile && !isOdd
                ? "polygon(10% 0, 100% 0, 100% 100%, 0 100%)"
                : "none",
          opacity: vis ? 1 : 0,
          transform: vis
            ? "translateX(0)"
            : `translateX(${isOdd ? "-40px" : "40px"})`,
          transition: "opacity .7s ease, transform .7s ease",
        }}
      >
        <span
          style={{
            ...headingStyle,
            fontSize: isMobile ? 48 : 64,
            color:
              isOdd ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
            lineHeight: 1,
            marginBottom: -10,
          }}
        >
          {s.num}
        </span>
        <h3
          style={{
            ...jpHeading,
            fontSize: isMobile ? 22 : 28,
            color: fg,
            marginBottom: 18,
            marginTop: 16,
          }}
        >
          <span style={{ marginRight: 8 }}>▸</span>{s.title}
        </h3>
        <div
          style={{
            width: 32,
            height: 3,
            background: "#555",
            marginBottom: 20,
          }}
        />
        <p
          style={{
            ...bodyFont,
            fontSize: 14,
            color:
              isOdd ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
            whiteSpace: "pre-line",
          }}
        >
          {s.text}
        </p>
      </div>

      {/* Image / visual side */}
      <div
        style={{
          flex: 1,
          background: isOdd ? "#1a1f26" : "#f0f0f0",
          minHeight: isMobile ? 200 : 380,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          clipPath:
            !isMobile && isOdd
              ? "polygon(0 0, 100% 0, 100% 100%, 10% 100%)"
              : !isMobile && !isOdd
                ? "polygon(0 0, 90% 0, 100% 100%, 0 100%)"
                : isMobile
                  ? "polygon(0 8%, 100% 0, 100% 100%, 0 100%)"
                  : "none",
          opacity: vis ? 1 : 0,
          transition: "opacity .7s ease .15s",
        }}
      >
        <span
          style={{
            ...headingStyle,
            fontSize: isMobile ? 60 : 100,
            color: isOdd
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.04)",
          }}
        >
          {s.num}
        </span>
      </div>
    </div>
  );
}

function StrengthItem({
  st,
  isMobile,
  headingStyle,
  jpHeading,
  bodyFont,
}: {
  st: (typeof strengths)[number];
  isMobile: boolean;
  headingStyle: React.CSSProperties;
  jpHeading: React.CSSProperties;
  bodyFont: React.CSSProperties;
}) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 12 : 40,
        marginBottom: isMobile ? 48 : 64,
        alignItems: isMobile ? "flex-start" : "flex-start",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .7s ease, transform .7s ease",
      }}
    >
      <span
        style={{
          ...headingStyle,
          fontSize: isMobile ? 56 : 80,
          color: "rgba(255,255,255,0.06)",
          lineHeight: 1,
          minWidth: isMobile ? "auto" : 120,
          WebkitTextStroke: `1px rgba(255,255,255,0.12)`,
        }}
      >
        {st.num}
      </span>
      <div style={{ flex: 1 }}>
        <h3
          style={{
            ...jpHeading,
            fontSize: isMobile ? 20 : 24,
            color: LIGHT,
            marginBottom: 14,
            marginTop: 0,
          }}
        >
          {st.title}
        </h3>
        <div
          style={{
            width: 28,
            height: 3,
            background: "#555",
            marginBottom: 16,
          }}
        />
        <p
          style={{
            ...bodyFont,
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "pre-line",
          }}
        >
          {st.text}
        </p>
      </div>
    </div>
  );
}
