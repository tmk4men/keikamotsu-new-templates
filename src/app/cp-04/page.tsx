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

/* service images */
const SERVICE_IMAGES = [
  "/keikamotsu-new-templates/images/service-b2b.webp",
  "/keikamotsu-new-templates/images/service-ec.webp",
  "/keikamotsu-new-templates/images/service-route.webp",
  "/keikamotsu-new-templates/images/service-spot.webp",
];

/* strength images */
const STRENGTH_IMAGES = [
  "/keikamotsu-new-templates/images/strength-01.webp",
  "/keikamotsu-new-templates/images/strength-02.webp",
  "/keikamotsu-new-templates/images/strength-03.webp",
];

/* history images */
const HISTORY_IMAGES: Record<string, string> = {
  "2021": "/keikamotsu-new-templates/images/history-2021.webp",
  "2022": "/keikamotsu-new-templates/images/history-2022.webp",
  "2023": "/keikamotsu-new-templates/images/history-2023.webp",
  "2024": "/keikamotsu-new-templates/images/history-2024.webp",
  "2025": "/keikamotsu-new-templates/images/history-2025.webp",
};

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

/* ───────────────────── HOOK: Counter Animation ───────────────────── */
function useCounter(end: number, visible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);
  return count;
}

/* ───────────────────── HOOK: Typewriter ───────────────────── */
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
  const heroTyped = useTypewriter(hero.headline, 80, 500);

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

  /* shared text styles */
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
        background: scrolled ? "rgba(13,17,23,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(255,255,255,0.12)` : "none",
        transition: "background .4s, border-color .4s, backdrop-filter .4s",
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
                className="cp04-nav-link"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "color .2s",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  position: "relative",
                  paddingBottom: 4,
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
              className="cp04-cta-btn"
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
                transition: "transform .2s, box-shadow .2s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(50,55,60,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
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
            {/* Noise overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.03,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "128px 128px",
                pointerEvents: "none",
              }}
            />

            {/* Floating geometric triangle */}
            <div
              className="cp04-float-geo"
              style={{
                position: "absolute",
                top: "15%",
                right: "10%",
                width: 0,
                height: 0,
                borderLeft: "30px solid transparent",
                borderRight: "30px solid transparent",
                borderBottom: "52px solid rgba(255,255,255,0.03)",
                pointerEvents: "none",
              }}
            />

            {/* Floating parallelogram */}
            <div
              className="cp04-float-geo-2"
              style={{
                position: "absolute",
                bottom: "20%",
                right: "15%",
                width: 60,
                height: 40,
                background: "rgba(255,255,255,0.02)",
                transform: "skewX(-15deg)",
                pointerEvents: "none",
              }}
            />

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
                fontFamily: "'Oswald', 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? 32 : 56,
                color: LIGHT,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              {heroTyped.displayed}
              {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
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
              className="cp04-hero-cta"
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
                transition: "transform .25s, box-shadow .25s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(50,55,60,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {hero.cta}
            </button>
          </div>

          {/* Right - video */}
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
              poster="/keikamotsu-new-templates/images/hero-bg.webp"
              style={{
                position: "absolute",
                top: 0,
                left: isMobile ? 0 : "-15%",
                width: isMobile ? "100%" : "115%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src="/keikamotsu-new-templates/videos/hero-nightcity.mp4" type="video/mp4" />
            </video>
            {/* Noise texture overlay on video */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "128px 128px",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(13,17,23,0.4) 0%, transparent 40%)",
              }}
            />
            {/* Floating geometric on video side */}
            <div
              className="cp04-float-geo-3"
              style={{
                position: "absolute",
                bottom: "25%",
                left: "20%",
                width: 80,
                height: 80,
                border: "2px solid rgba(255,255,255,0.08)",
                transform: "rotate(45deg)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="cp04-scroll-indicator"
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", fontFamily: "'Inter', sans-serif" }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.2)", position: "relative", overflow: "hidden" }}>
            <div className="cp04-scroll-line" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.7)", position: "absolute", top: -20 }} />
          </div>
        </div>
      </Section>
    );
  })();

  /* ───────── SERVICES ───────── */
  const servicesEl = (() => {
    return (
      <Section id="services" bg={LIGHT} style={{ paddingTop: isMobile ? 80 : 150, paddingBottom: isMobile ? 60 : 100 }}>
        {/* Diagonal divider top */}
        <div style={{
          position: "absolute",
          top: -1,
          left: 0,
          width: "100%",
          height: 100,
          background: DARK,
          clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)",
        }} />
        {/* Decorative diagonal line */}
        <div className="cp04-diag-line" style={{
          position: "absolute",
          top: 80,
          right: 0,
          width: 200,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT})`,
          transform: "rotate(-3deg)",
          opacity: 0.15,
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {services.map((s, i) => {
            const isOdd = i % 2 === 0;
            const bg = isOdd ? DARK : LIGHT;
            const fg = isOdd ? LIGHT : DARK;
            return <ServiceRow key={s.num} s={s} idx={i} isOdd={isOdd} bg={bg} fg={fg} isMobile={isMobile} headingStyle={headingStyle} jpHeading={jpHeading} bodyFont={bodyFont} />;
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
        }}
        clip="polygon(0 0, 100% 4%, 100% 96%, 0 100%)"
      >
        {/* Background image with overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/keikamotsu-new-templates/images/strength-01.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }} />
        {/* Animated diagonal decoration */}
        <div className="cp04-diag-deco" style={{
          position: "absolute",
          top: "10%",
          left: -50,
          width: 300,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          transform: "rotate(-5deg)",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <p
            className="cp04-clip-reveal"
            style={{
              ...headingStyle,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            -- Our Strengths --
          </p>
          <h2
            className="cp04-clip-reveal"
            style={{
              ...jpHeading,
              fontSize: isMobile ? 26 : 36,
              color: LIGHT,
              marginBottom: isMobile ? 48 : 72,
            }}
          >
            私たちの強み
          </h2>
          {strengths.map((st, idx) => (
            <StrengthItem key={st.num} st={st} idx={idx} isMobile={isMobile} headingStyle={headingStyle} jpHeading={jpHeading} bodyFont={bodyFont} />
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
        {/* Geometric triangle decoration */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderTop: "200px solid rgba(13,17,23,0.03)",
          borderLeft: "200px solid transparent",
          pointerEvents: "none",
          zIndex: 1,
        }} />
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
              background: `url(/keikamotsu-new-templates/images/ceo-portrait.webp) center/cover no-repeat`,
              clipPath: isMobile
                ? "polygon(0 0, 100% 0, 100% 90%, 0 100%)"
                : "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0) skewX(0deg)" : "translateX(-40px) skewX(-2deg)",
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
              className="cp04-scaleX-reveal"
              style={{
                width: 40,
                height: 4,
                background: "#555",
                marginBottom: 24,
                transformOrigin: "left",
                transform: vis ? "scaleX(1)" : "scaleX(0)",
                transition: "transform .6s ease .3s",
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
              -- CEO Message --
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
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity .5s ease ${0.4 + i * 0.1}s, transform .5s ease ${0.4 + i * 0.1}s`,
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
        {/* Diagonal divider top */}
        <div style={{
          position: "absolute",
          top: -1,
          left: 0,
          width: "100%",
          height: 80,
          background: LIGHT,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0%)",
          zIndex: 1,
        }} />
        <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 32 : 48 }}>
          {/* Left side: company image */}
          <div style={{
            flex: isMobile ? "none" : "0 0 40%",
            minHeight: isMobile ? 220 : 400,
            background: `url(/keikamotsu-new-templates/images/company.webp) center/cover no-repeat`,
            clipPath: isMobile ? "none" : "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity .7s ease, transform .7s ease",
          }} />
          {/* Right side: table */}
          <div style={{ flex: 1 }}>
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
              -- Company --
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
                transition: "opacity .7s ease .2s, transform .7s ease .2s",
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
                      <span style={{ marginRight: 6 }}>&#9642;</span>{row.dt}
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
        {/* Skewed top divider */}
        <div style={{
          position: "absolute",
          top: -1,
          left: 0,
          width: "100%",
          height: 60,
          background: LIGHT,
          transform: "skewY(-2deg)",
          transformOrigin: "top left",
        }} />
        <div ref={ref} style={{ maxWidth: 940, margin: "0 auto", position: "relative" }}>
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
            -- History --
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
          {history.map((h, i) => {
            const imgSrc = HISTORY_IMAGES[String(h.year)];
            return (
              <div
                key={h.year}
                style={{
                  display: "flex",
                  gap: isMobile ? 16 : 32,
                  marginBottom: 36,
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0) skewY(0deg)" : "translateY(20px) skewY(1deg)",
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
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 16,
                    alignItems: isMobile ? "flex-start" : "center",
                    transition: "box-shadow .3s, transform .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={`${h.year}年`}
                      style={{
                        width: isMobile ? "100%" : 120,
                        height: isMobile ? 120 : 80,
                        objectFit: "cover",
                        clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <p style={{ ...bodyFont, fontSize: 15, color: "#333", margin: 0 }}>
                    {h.event}
                  </p>
                </div>
              </div>
            );
          })}
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
        {/* Background image */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/keikamotsu-new-templates/images/team.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }} />
        {/* Noise texture */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          pointerEvents: "none",
        }} />
        <div
          ref={ref}
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1.1fr 0.9fr" : "0.95fr 1.1fr 0.9fr 1.05fr",
            gap: isMobile ? 32 : 48,
            textAlign: "center",
            position: "relative",
          }}
        >
          {numbers.map((n, i) => (
            <NumberCard key={n.label} n={n} i={i} vis={vis} isMobile={isMobile} headingStyle={headingStyle} jpHeading={jpHeading} />
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
            -- Partners --
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
            {partners.map((p, idx) => (
              <div
                key={p.name}
                className="cp04-partner-card"
                style={{
                  background: "#f8f8f8",
                  padding: "32px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  border: "1px solid #eee",
                  transition: "box-shadow .3s, transform .3s",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${idx * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
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
        {/* Skewed divider */}
        <div style={{
          position: "absolute",
          top: -1,
          left: 0,
          width: "100%",
          height: 80,
          background: LIGHT,
          clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)",
        }} />
        <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
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
            -- News --
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.paddingLeft = "8px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.paddingLeft = "0px";
              }}
            >
              <span
                style={{
                  ...headingStyle,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  minWidth: 100,
                }}
              >
                - {n.date}
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
        {/* Diagonal geometric decoration */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: "polygon(0 0, 30% 0, 25% 100%, 0 100%)",
          background: "rgba(255,255,255,0.02)",
          pointerEvents: "none",
        }} />
        <div
          ref={ref}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            minHeight: isMobile ? "auto" : 420,
          }}
        >
          {/* Left - with delivery image background */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(rgba(13,17,23,0.78), rgba(13,17,23,0.78)), url(/keikamotsu-new-templates/images/delivery.webp) center/cover no-repeat`,
              padding: isMobile ? "64px 24px" : "80px 64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity .7s ease, transform .7s ease",
            }}
          >
            <p
              style={{
                ...headingStyle,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              -- Recruit --
            </p>
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
          {/* Right - CTA */}
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
              className="cp04-recruit-cta"
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
                transition: "transform .25s, box-shadow .25s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
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
        {/* Diagonal top divider */}
        <div style={{
          position: "absolute",
          top: -1,
          left: 0,
          width: "100%",
          height: 70,
          background: DARK,
          clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)",
        }} />
        <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
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
            -- Access --
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
                clipPath: isMobile ? "none" : "polygon(5% 0, 100% 0, 100% 100%, 0 100%)",
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
      transition: "border-color .3s, box-shadow .3s",
      boxSizing: "border-box",
    };
    return (
      <Section
        id="contact"
        bg={DARK}
        style={{ padding: isMobile ? "80px 20px 80px" : "130px 48px 140px" }}
      >
        {/* Geometric decorations */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 120,
          height: 120,
          border: "1px solid rgba(255,255,255,0.04)",
          transform: "rotate(45deg)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          width: 0,
          height: 0,
          borderLeft: "40px solid transparent",
          borderRight: "40px solid transparent",
          borderBottom: "70px solid rgba(255,255,255,0.02)",
          pointerEvents: "none",
        }} />
        <div ref={ref} style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
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
            -- Contact --
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
                        *必須
                      </span>
                    )}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      required={f.required}
                      rows={5}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.08)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.08)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="cp04-submit-btn"
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
                  transition: "transform .25s, box-shadow .25s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(50,55,60,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Footer background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/keikamotsu-new-templates/images/footer-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.06,
      }} />
      <div style={{ position: "relative", padding: isMobile ? "48px 20px 24px" : "64px 48px 28px" }}>
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
                className="cp04-footer-link"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  fontSize: 12,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  cursor: "pointer",
                  transition: "color .2s",
                  position: "relative",
                  paddingBottom: 2,
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

        /* ── Nav link animated underline ── */
        .cp04-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #fff;
          transition: width .3s ease;
        }
        .cp04-nav-link:hover::after {
          width: 100%;
        }

        /* ── Footer link animated underline ── */
        .cp04-footer-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: rgba(255,255,255,0.5);
          transition: width .3s ease;
        }
        .cp04-footer-link:hover::after {
          width: 100%;
        }

        /* ── Hero heading clip-path reveal ── */
        .cp04-hero-heading {
          animation: cp04ClipReveal 1s ease forwards;
          animation-delay: 0.3s;
          clip-path: inset(0 100% 0 0);
        }

        @keyframes cp04ClipReveal {
          to { clip-path: inset(0 0% 0 0); }
        }

        /* ── Scroll indicator animation ── */
        .cp04-scroll-line {
          animation: cp04ScrollLine 1.8s ease-in-out infinite;
        }

        @keyframes cp04ScrollLine {
          0% { top: -20px; }
          100% { top: 40px; }
        }

        /* ── Floating geometric elements ── */
        .cp04-float-geo {
          animation: cp04Float 6s ease-in-out infinite;
        }
        .cp04-float-geo-2 {
          animation: cp04Float 8s ease-in-out infinite reverse;
        }
        .cp04-float-geo-3 {
          animation: cp04Float 7s ease-in-out infinite;
        }

        @keyframes cp04Float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .cp04-float-geo-2 {
          animation: cp04Float2 8s ease-in-out infinite;
        }
        @keyframes cp04Float2 {
          0%, 100% { transform: skewX(-15deg) translateY(0); }
          50% { transform: skewX(-15deg) translateY(-12px); }
        }

        /* ── Button shine sweep ── */
        .cp04-hero-cta::before,
        .cp04-cta-btn::before,
        .cp04-submit-btn::before,
        .cp04-recruit-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left .5s ease;
        }
        .cp04-hero-cta:hover::before,
        .cp04-cta-btn:hover::before,
        .cp04-submit-btn:hover::before,
        .cp04-recruit-cta:hover::before {
          left: 100%;
        }

        /* ── CTA pulse ── */
        .cp04-hero-cta {
          animation: cp04Pulse 3s ease-in-out infinite;
        }

        @keyframes cp04Pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(50,55,60,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(50,55,60,0); }
        }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── Card perspective tilt ── */
        .cp04-service-card {
          transition: transform .4s ease, box-shadow .4s ease;
        }
        .cp04-service-card:hover {
          transform: perspective(800px) rotateY(2deg) rotateX(-1deg);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        /* ── Diagonal decoration animation ── */
        .cp04-diag-deco {
          animation: cp04DiagSlide 4s ease-in-out infinite alternate;
        }
        @keyframes cp04DiagSlide {
          0% { transform: rotate(-5deg) translateX(0); opacity: 0.1; }
          100% { transform: rotate(-5deg) translateX(60px); opacity: 0.3; }
        }

        /* ── Clip-path section headings reveal ── */
        .cp04-clip-reveal {
          animation: cp04ClipRevealGeneric 0.8s ease forwards;
        }
        @keyframes cp04ClipRevealGeneric {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0% 0 0); }
        }

        /* ── Strength image hover ── */
        .cp04-strength-img {
          transition: transform .5s ease, filter .5s ease;
        }
        .cp04-strength-img:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        /* ── prefers-reduced-motion ── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .cp04-hero-heading {
            clip-path: none !important;
          }
          .cp04-clip-reveal {
            clip-path: none !important;
          }
        }
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
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function ServiceRow({
  s,
  idx,
  isOdd,
  bg,
  fg,
  isMobile,
  headingStyle,
  jpHeading,
  bodyFont,
}: {
  s: (typeof services)[number];
  idx: number;
  isOdd: boolean;
  bg: string;
  fg: string;
  isMobile: boolean;
  headingStyle: React.CSSProperties;
  jpHeading: React.CSSProperties;
  bodyFont: React.CSSProperties;
}) {
  const [ref, vis] = useReveal();
  const imgSrc = SERVICE_IMAGES[idx] || SERVICE_IMAGES[0];
  return (
    <div
      ref={ref}
      className="cp04-service-card"
      style={{
        display: "flex",
        flexDirection: isMobile
          ? "column"
          : isOdd
            ? "row"
            : "row-reverse",
        minHeight: isMobile ? "auto" : 380,
        marginBottom: isMobile ? 0 : 4,
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
          <span style={{ marginRight: 8 }}>&#9656;</span>{s.title}
        </h3>
        <div
          style={{
            width: 32,
            height: 3,
            background: "#555",
            marginBottom: 20,
            transform: vis ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform .6s ease .3s",
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

      {/* Image side */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: isMobile ? 240 : 380,
          overflow: "hidden",
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
        <img
          src={imgSrc}
          alt={s.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .6s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* Decorative parallelogram */}
        <div style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 50,
          height: 30,
          border: `1px solid ${isOdd ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          transform: "skewX(-12deg)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

function StrengthItem({
  st,
  idx,
  isMobile,
  headingStyle,
  jpHeading,
  bodyFont,
}: {
  st: (typeof strengths)[number];
  idx: number;
  isMobile: boolean;
  headingStyle: React.CSSProperties;
  jpHeading: React.CSSProperties;
  bodyFont: React.CSSProperties;
}) {
  const [ref, vis] = useReveal();
  const imgSrc = STRENGTH_IMAGES[idx] || STRENGTH_IMAGES[0];
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 12 : 40,
        marginBottom: isMobile ? 48 : 64,
        alignItems: isMobile ? "flex-start" : "center",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0) skewY(0deg)" : "translateY(20px) skewY(1deg)",
        transition: `opacity .7s ease ${idx * 0.15}s, transform .7s ease ${idx * 0.15}s`,
      }}
    >
      {/* Strength image */}
      <div style={{
        flex: isMobile ? "none" : "0 0 200px",
        width: isMobile ? "100%" : 200,
        height: isMobile ? 160 : 160,
        overflow: "hidden",
        clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
        position: "relative",
      }}>
        <img
          src={imgSrc}
          alt={st.title}
          className="cp04-strength-img"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Number */}
      <span
        style={{
          ...headingStyle,
          fontSize: isMobile ? 56 : 80,
          color: "rgba(255,255,255,0.06)",
          lineHeight: 1,
          minWidth: isMobile ? "auto" : 100,
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
            color: "#ffffff",
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
            transform: vis ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: `transform .5s ease ${idx * 0.15 + 0.3}s`,
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

function NumberCard({
  n,
  i,
  vis,
  isMobile,
  headingStyle,
  jpHeading,
}: {
  n: (typeof numbers)[number];
  i: number;
  vis: boolean;
  isMobile: boolean;
  headingStyle: React.CSSProperties;
  jpHeading: React.CSSProperties;
}) {
  const numericValue = parseInt(String(n.value).replace(/[^0-9]/g, ""), 10) || 0;
  const count = useCounter(numericValue, vis);
  return (
    <div
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .6s ease ${i * 0.15}s, transform .6s ease ${i * 0.15}s`,
      }}
    >
      <div
        style={{
          ...headingStyle,
          fontSize: isMobile ? 40 : 56,
          color: "#ffffff",
          lineHeight: 1.1,
        }}
      >
        {vis ? count : 0}
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
  );
}
