"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
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

/* ─────────────────── helpers ─────────────────── */

const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
};

const useInView = (threshold = 0.15) => {
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
};

/* clip-path reveal animation */
const revealStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
  transition: `clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
});

const fadeUpStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(12px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});

/* ─────────────────── fonts ─────────────────── */
const fontMincho = "'Shippori Mincho B1', 'Noto Serif JP', serif";
const fontPlayfair = "'Playfair Display', serif";
const fontBody = "'Noto Sans JP', sans-serif";

/* ─────────────────── colors ─────────────────── */
const C = {
  bg: "#fafafa",
  white: "#ffffff",
  text: "#1a1a1a",
  sub: "#555555",
  accent: "#333333",
  cta: "#32373c",
  line: "#e0e0e0",
  muted: "#999999",
  light: "#f0f0f0",
};

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function CP03() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  /* font load */
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Sans+JP:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  /* close menu on resize */
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  /* sectionPy removed: each section has unique padding */

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />

      <div
        style={{
          fontFamily: fontBody,
          fontWeight: 300,
          color: C.text,
          background: C.bg,
          overflowX: "hidden",
          lineHeight: 1.9,
          fontSize: isMobile ? 14 : 15,
          letterSpacing: "0.04em",
        }}
      >
        {/* ───── HEADER ───── */}
        <Header
          isMobile={isMobile}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        {/* ───── HERO ───── */}
        <HeroSection isMobile={isMobile} />

        {/* ───── SERVICES ───── */}
        <ServicesSection isMobile={isMobile} />

        {/* ───── STRENGTHS ───── */}
        <StrengthsSection isMobile={isMobile} />

        {/* ───── CEO MESSAGE ───── */}
        <CeoSection isMobile={isMobile} />

        {/* ───── COMPANY ───── */}
        <CompanySection isMobile={isMobile} />

        {/* ───── HISTORY ───── */}
        <HistorySection isMobile={isMobile} />

        {/* ───── NUMBERS ───── */}
        <NumbersSection isMobile={isMobile} />

        {/* ───── PARTNERS ───── */}
        <PartnersSection isMobile={isMobile} />

        {/* ───── NEWS ───── */}
        <NewsSection isMobile={isMobile} />

        {/* ───── RECRUIT ───── */}
        <RecruitSection isMobile={isMobile} />

        {/* ───── ACCESS ───── */}
        <AccessSection isMobile={isMobile} />

        {/* ───── CONTACT ───── */}
        <ContactSection isMobile={isMobile} />

        {/* ───── FOOTER ───── */}
        <FooterSection />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════ */

function Header({
  isMobile,
  menuOpen,
  setMenuOpen,
}: {
  isMobile: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "#fafafa" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.line}` : "none",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "16px 24px" : "20px 48px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            textDecoration: "none",
            color: C.text,
            fontFamily: fontMincho,
            fontSize: isMobile ? 16 : 18,
            fontWeight: 500,
            letterSpacing: "0.15em",
          }}
        >
          {company.name}
        </a>

        {/* Nav (desktop) */}
        {!isMobile && (
          <nav
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: `1px solid ${C.line}`,
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  color: C.sub,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.text)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.sub)
                }
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
            style={{
              position: "absolute",
              right: 24,
              top: 16,
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 28,
              height: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: C.text,
                transition: "transform 0.3s, opacity 0.3s",
                transform: menuOpen
                  ? "rotate(45deg) translateY(3.5px)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: C.text,
                transition: "transform 0.3s, opacity 0.3s",
                transform: menuOpen
                  ? "rotate(-45deg) translateY(-3.5px)"
                  : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(250,250,250,0.98)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            transition: "opacity 0.4s",
            zIndex: 999,
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: C.text,
                fontFamily: fontMincho,
                fontSize: 16,
                letterSpacing: "0.12em",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════ */

function HeroSection({ isMobile }: { isMobile: boolean }) {
  const iv = useInView(0.1);

  return (
    <section
      id="hero"
      ref={iv.ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "120px 24px 80px" : "160px 64px 120px",
        background: C.bg,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <h1
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 36 : 72,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "0.08em",
            color: C.text,
            margin: 0,
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          {hero.headline}
        </h1>

        <div
          style={{
            marginTop: isMobile ? 40 : 64,
            textAlign: "right",
            maxWidth: isMobile ? "100%" : 480,
            marginLeft: "auto",
            ...fadeUpStyle(iv.visible, 0.6),
          }}
        >
          {hero.subtext.map((s, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: isMobile ? 12 : 13,
                color: C.sub,
                lineHeight: 2,
              }}
            >
              {s}
            </p>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          ...fadeUpStyle(iv.visible, 1.0),
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            color: C.muted,
            fontFamily: fontPlayfair,
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: C.line,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1,
              height: "100%",
              background: C.accent,
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
        <style>{`@keyframes scrollLine { 0% { transform: translateY(-100%); } 50% { transform: translateY(0); } 100% { transform: translateY(100%); } }`}</style>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════ */

function ServicesSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="services"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 80 : 150,
        paddingBottom: isMobile ? 60 : 100,
        maxWidth: 1100,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="Services" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        事業内容
      </h2>

      {services.map((s, i) => (
        <ServiceItem key={i} s={s} isMobile={isMobile} index={i} />
      ))}
    </section>
  );
}

function ServiceItem({
  s,
  isMobile,
  index,
}: {
  s: (typeof services)[0];
  isMobile: boolean;
  index: number;
}) {
  const iv = useInView();

  return (
    <div
      ref={iv.ref}
      style={{
        display: isMobile ? "block" : "flex",
        alignItems: "flex-start",
        gap: 48,
        padding: isMobile ? "32px 0" : "48px 0",
        borderTop: `1px solid ${C.line}`,
        ...(index === services.length - 1
          ? { borderBottom: `1px solid ${C.line}` }
          : {}),
      }}
    >
      <span
        style={{
          fontFamily: fontPlayfair,
          fontSize: isMobile ? 48 : 72,
          fontWeight: 400,
          color: C.light,
          lineHeight: 1,
          flexShrink: 0,
          display: "block",
          marginBottom: isMobile ? 16 : 0,
          width: isMobile ? "auto" : 100,
          ...fadeUpStyle(iv.visible, 0.1),
        }}
      >
        {s.num}
      </span>
      <div style={{ flex: 1, ...fadeUpStyle(iv.visible, 0.25) }}>
        <h3
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 18 : 20,
            fontWeight: 500,
            marginBottom: 16,
            letterSpacing: "0.06em",
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            color: C.sub,
            margin: 0,
            lineHeight: 2.0,
            whiteSpace: "pre-line",
            fontSize: isMobile ? 13 : 14,
          }}
        >
          {s.text}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STRENGTHS
   ═══════════════════════════════════════════════ */

function StrengthsSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="strengths"
      style={{
        paddingTop: isMobile ? 72 : 120,
        paddingBottom: isMobile ? 64 : 110,
        background: C.white,
      }}
    >
      <div
        ref={iv.ref}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          paddingLeft: isMobile ? 24 : 48,
          paddingRight: isMobile ? 24 : 48,
        }}
      >
        <SectionLabel label="Strengths" visible={iv.visible} />
        <h2
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          私たちの強み
        </h2>
      </div>

      {strengths.map((s, i) => (
        <StrengthItem key={i} s={s} index={i} isMobile={isMobile} />
      ))}
    </section>
  );
}

function StrengthItem({
  s,
  index,
  isMobile,
}: {
  s: (typeof strengths)[0];
  index: number;
  isMobile: boolean;
}) {
  const iv = useInView();
  const isEven = index % 2 === 1;

  return (
    <div
      ref={iv.ref}
      style={{
        display: isMobile ? "block" : "flex",
        flexDirection: isEven && !isMobile ? "row-reverse" : "row",
        alignItems: "center",
        maxWidth: 1100,
        margin: "0 auto",
        marginBottom: isMobile ? 48 : 100,
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        gap: isMobile ? 0 : 64,
      }}
    >
      {/* Image */}
      <div
        style={{
          flex: "0 0 48%",
          marginBottom: isMobile ? 24 : 0,
          ...fadeUpStyle(iv.visible, 0.1),
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "66%",
            background: C.light,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={`/images/strength-0${index + 1}.webp`}
            alt={s.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(30%)",
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, ...fadeUpStyle(iv.visible, 0.3) }}>
        <span
          style={{
            fontFamily: fontPlayfair,
            fontSize: isMobile ? 40 : 64,
            color: C.light,
            lineHeight: 1,
            display: "block",
            marginBottom: 16,
          }}
        >
          {s.num}
        </span>
        <h3
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 20 : 24,
            fontWeight: 500,
            marginBottom: 20,
            letterSpacing: "0.06em",
            lineHeight: 1.5,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            color: C.sub,
            margin: 0,
            lineHeight: 2.0,
            whiteSpace: "pre-line",
            fontSize: isMobile ? 13 : 14,
          }}
        >
          {s.text}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CEO MESSAGE
   ═══════════════════════════════════════════════ */

function CeoSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="message"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 56 : 85,
        paddingBottom: isMobile ? 48 : 75,
        maxWidth: 840,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        position: "relative",
      }}
    >
      <SectionLabel label="Message" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        代表メッセージ
      </h2>

      <div style={{ position: "relative" }}>
        {/* large quotation mark */}
        <span
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 80 : 140,
            color: C.light,
            position: "absolute",
            top: isMobile ? -40 : -60,
            left: isMobile ? -8 : -20,
            lineHeight: 1,
            userSelect: "none",
            ...fadeUpStyle(iv.visible, 0.2),
          }}
        >
          「
        </span>

        <div
          style={{
            paddingLeft: isMobile ? 16 : 40,
            ...fadeUpStyle(iv.visible, 0.35),
          }}
        >
          {ceoMessage.message.map((m, i) => (
            <p
              key={i}
              style={{
                fontFamily: fontMincho,
                fontSize: isMobile ? 15 : 17,
                lineHeight: 2.2,
                color: C.text,
                marginBottom: 24,
                fontWeight: 400,
              }}
            >
              {m}
            </p>
          ))}
        </div>

        {/* closing quote */}
        <span
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 80 : 140,
            color: C.light,
            position: "absolute",
            bottom: isMobile ? 40 : 20,
            right: isMobile ? -8 : 60,
            lineHeight: 1,
            userSelect: "none",
            ...fadeUpStyle(iv.visible, 0.4),
          }}
        >
          」
        </span>

        {/* CEO info */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: 24,
            marginTop: 48,
            ...fadeUpStyle(iv.visible, 0.5),
          }}
        >
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: C.muted,
                letterSpacing: "0.1em",
              }}
            >
              {ceoMessage.title}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontFamily: fontMincho,
                fontSize: isMobile ? 18 : 22,
                fontWeight: 500,
                letterSpacing: "0.12em",
              }}
            >
              {ceoMessage.name}
            </p>
          </div>
          <div
            style={{
              width: isMobile ? 72 : 96,
              height: isMobile ? 96 : 128,
              background: C.light,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src="/images/ceo.webp"
              alt={ceoMessage.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(40%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPANY
   ═══════════════════════════════════════════════ */

function CompanySection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="company"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 64 : 95,
        paddingBottom: isMobile ? 56 : 80,
        background: C.white,
        maxWidth: 1100,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="Company" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        会社概要
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          ...fadeUpStyle(iv.visible, 0.3),
        }}
      >
        <tbody>
          {companyOverview.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <th
                style={{
                  textAlign: "left",
                  fontWeight: 400,
                  fontFamily: fontMincho,
                  fontSize: isMobile ? 13 : 14,
                  color: C.sub,
                  padding: isMobile ? "16px 8px 16px 0" : "20px 24px 20px 0",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                  width: isMobile ? 90 : 140,
                  letterSpacing: "0.06em",
                }}
              >
                {row.dt}
              </th>
              <td
                style={{
                  padding: isMobile ? "16px 0" : "20px 0",
                  fontSize: isMobile ? 13 : 14,
                  color: C.text,
                }}
              >
                {row.dd}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HISTORY
   ═══════════════════════════════════════════════ */

function HistorySection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="history"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 48 : 65,
        paddingBottom: isMobile ? 40 : 55,
        maxWidth: 840,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="History" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        沿革
      </h2>

      <div style={fadeUpStyle(iv.visible, 0.3)}>
        {history.map((h, i) => (
          <HistoryItem key={i} h={h} isMobile={isMobile} index={i} />
        ))}
      </div>
    </section>
  );
}

function HistoryItem({
  h,
  isMobile,
  index,
}: {
  h: (typeof history)[0];
  isMobile: boolean;
  index: number;
}) {
  const iv = useInView();

  return (
    <div
      ref={iv.ref}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: isMobile ? 20 : 48,
        padding: isMobile ? "24px 0" : "32px 0",
        borderBottom:
          index < history.length - 1 ? `1px solid ${C.line}` : "none",
        ...fadeUpStyle(iv.visible, 0.15),
      }}
    >
      {/* Year - vertical-inspired large number */}
      <div
        style={{
          flexShrink: 0,
          width: isMobile ? 60 : 100,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: fontPlayfair,
            fontSize: isMobile ? 28 : 40,
            fontWeight: 400,
            color: C.accent,
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          {h.year}
        </span>
      </div>

      {/* timeline dot + line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: isMobile ? 10 : 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.accent,
          }}
        />
      </div>

      {/* Event */}
      <p
        style={{
          margin: 0,
          color: C.sub,
          fontSize: isMobile ? 13 : 15,
          lineHeight: 1.9,
          paddingTop: isMobile ? 4 : 8,
        }}
      >
        {h.event}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NUMBERS
   ═══════════════════════════════════════════════ */

function NumbersSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="numbers"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 72 : 105,
        paddingBottom: isMobile ? 56 : 90,
        background: C.white,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          paddingLeft: isMobile ? 24 : 48,
          paddingRight: isMobile ? 24 : 48,
        }}
      >
        <SectionLabel label="Numbers" visible={iv.visible} />
        <h2
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500,
            marginBottom: isMobile ? 48 : 80,
            letterSpacing: "0.08em",
            ...revealStyle(iv.visible, 0.2),
          }}
        >
          数字で見る実績
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1.1fr 0.9fr"
              : "0.95fr 1.1fr 0.9fr 1.05fr",
            gap: isMobile ? 32 : 0,
            borderTop: isMobile ? "none" : `1px solid ${C.line}`,
            borderBottom: isMobile ? "none" : `1px solid ${C.line}`,
            padding: isMobile ? 0 : "48px 0",
          }}
        >
          {numbers.map((n, i) => (
            <NumberItem key={i} n={n} isMobile={isMobile} index={i} visible={iv.visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NumberItem({
  n,
  isMobile,
  index,
  visible,
}: {
  n: (typeof numbers)[0];
  isMobile: boolean;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        borderRight:
          !isMobile && index < numbers.length - 1
            ? `1px solid ${C.line}`
            : "none",
        ...fadeUpStyle(visible, 0.2 + index * 0.1),
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: fontPlayfair,
            fontSize: isMobile ? 36 : 56,
            fontWeight: 400,
            color: C.text,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {n.value}
        </span>
        <span
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 14 : 16,
            color: C.sub,
            marginLeft: 4,
          }}
        >
          {n.suffix}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? 11 : 12,
          color: C.muted,
          letterSpacing: "0.1em",
        }}
      >
        {n.label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PARTNERS
   ═══════════════════════════════════════════════ */

function PartnersSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="partners"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 56 : 75,
        paddingBottom: isMobile ? 48 : 65,
        maxWidth: 960,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="Partners" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        取引先
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1.05fr 0.95fr"
            : "1.15fr 0.85fr 1fr",
          gap: isMobile ? 24 : 40,
          ...fadeUpStyle(iv.visible, 0.3),
        }}
      >
        {partners.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "24px 16px" : "32px 24px",
              border: `1px solid ${C.line}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                background: C.light,
                borderRadius: "50%",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: "grayscale(100%)",
              }}
            >
              <span
                style={{
                  fontFamily: fontPlayfair,
                  fontSize: isMobile ? 16 : 20,
                  color: C.muted,
                }}
              >
                {p.name.slice(-2, -1)}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? 12 : 13,
                color: C.text,
                fontFamily: fontMincho,
                letterSpacing: "0.04em",
              }}
            >
              {p.name}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 11,
                color: C.muted,
              }}
            >
              {p.industry}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   NEWS
   ═══════════════════════════════════════════════ */

function NewsSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="news"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 52 : 70,
        paddingBottom: isMobile ? 44 : 60,
        background: C.white,
        maxWidth: 1100,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="News" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: isMobile ? 48 : 80,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        お知らせ
      </h2>

      <div style={fadeUpStyle(iv.visible, 0.3)}>
        {news.map((n, i) => (
          <a
            key={i}
            href="#"
            style={{
              display: isMobile ? "block" : "flex",
              alignItems: "baseline",
              gap: 32,
              padding: isMobile ? "20px 0" : "24px 0",
              borderBottom: `1px solid ${C.line}`,
              textDecoration: "none",
              color: C.text,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.opacity = "0.6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            <span
              style={{
                fontFamily: fontPlayfair,
                fontSize: isMobile ? 12 : 13,
                color: C.muted,
                flexShrink: 0,
                letterSpacing: "0.06em",
                display: "block",
                marginBottom: isMobile ? 6 : 0,
              }}
            >
              {n.date}
            </span>
            <span
              style={{
                fontSize: isMobile ? 13 : 14,
                lineHeight: 1.7,
              }}
            >
              {n.title}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   RECRUIT
   ═══════════════════════════════════════════════ */

function RecruitSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();

  return (
    <section
      id="recruit"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 80 : 130,
        paddingBottom: isMobile ? 80 : 140,
        maxWidth: 840,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
        textAlign: "center",
      }}
    >
      <div style={revealStyle(iv.visible, 0.2)}>
        <h2
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 20 : 28,
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: isMobile ? 40 : 64,
              display: "block",
              lineHeight: 1.3,
              letterSpacing: "0.1em",
            }}
          >
            一緒に
          </span>
          物流の未来を変えていく仲間を募集
        </h2>
      </div>

      <div style={fadeUpStyle(iv.visible, 0.4)}>
        <p
          style={{
            color: C.sub,
            whiteSpace: "pre-line",
            lineHeight: 2.2,
            marginBottom: 48,
            fontSize: isMobile ? 13 : 14,
          }}
        >
          {recruit.text}
        </p>
        <a
          href={recruit.link}
          style={{
            display: "inline-block",
            padding: isMobile ? "14px 48px" : "16px 64px",
            background: C.cta,
            color: "#fff",
            textDecoration: "none",
            fontSize: 13,
            letterSpacing: "0.12em",
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.opacity = "0.8")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.opacity = "1")
          }
        >
          {recruit.cta}
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ACCESS
   ═══════════════════════════════════════════════ */

function AccessSection({ isMobile }: { isMobile: boolean }) {
  const iv = useInView(0.1);

  return (
    <section
      id="access"
      ref={iv.ref}
      style={{
        position: "relative",
        background: C.white,
      }}
    >
      {/* Full-width map */}
      <div style={{ width: "100%", height: isMobile ? 360 : 500 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.5!2d135.6283!3d34.7658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzU3LjAiTiAxMzXCsDM3JzQxLjkiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(90%)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="アクセスマップ"
        />
      </div>

      {/* Info overlay */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? 24 : 40,
          left: isMobile ? 24 : 48,
          background: "#ffffff",
          padding: isMobile ? "24px 28px" : "32px 40px",
          maxWidth: isMobile ? "calc(100% - 48px)" : 400,
          ...fadeUpStyle(iv.visible, 0.3),
        }}
      >
        <h2
          style={{
            fontFamily: fontMincho,
            fontSize: isMobile ? 18 : 22,
            fontWeight: 500,
            marginBottom: 16,
            letterSpacing: "0.08em",
          }}
        >
          {access.heading}
        </h2>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: isMobile ? 13 : 14,
            color: C.text,
          }}
        >
          {access.address}
        </p>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: isMobile ? 12 : 13,
            color: C.sub,
          }}
        >
          {access.nearestStation}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? 11 : 12,
            color: C.muted,
          }}
        >
          {access.mapNote}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════ */

function ContactSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const iv = useInView();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  return (
    <section
      id="contact"
      ref={iv.ref}
      style={{
        paddingTop: isMobile ? 72 : 110,
        paddingBottom: isMobile ? 64 : 95,
        maxWidth: 720,
        margin: "0 auto",
        paddingLeft: isMobile ? 24 : 48,
        paddingRight: isMobile ? 24 : 48,
      }}
    >
      <SectionLabel label="Contact" visible={iv.visible} />
      <h2
        style={{
          fontFamily: fontMincho,
          fontSize: isMobile ? 24 : 32,
          fontWeight: 500,
          marginBottom: 24,
          letterSpacing: "0.08em",
          ...revealStyle(iv.visible, 0.2),
        }}
      >
        {contact.heading}
      </h2>
      <p
        style={{
          color: C.sub,
          whiteSpace: "pre-line",
          lineHeight: 2,
          marginBottom: isMobile ? 48 : 64,
          fontSize: isMobile ? 13 : 14,
          ...fadeUpStyle(iv.visible, 0.3),
        }}
      >
        {contact.intro}
      </p>

      {submitted ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            ...fadeUpStyle(true, 0),
          }}
        >
          <p
            style={{
              fontFamily: fontMincho,
              fontSize: isMobile ? 18 : 22,
              marginBottom: 16,
            }}
          >
            送信が完了しました
          </p>
          <p style={{ color: C.sub, fontSize: 14 }}>
            お問い合わせいただきありがとうございます。
            <br />
            担当者より折り返しご連絡いたします。
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={fadeUpStyle(iv.visible, 0.4)}
        >
          {contact.fields.map((f) => (
            <div key={f.name} style={{ marginBottom: 36 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: C.muted,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  fontFamily: fontMincho,
                }}
              >
                {f.label}
                {f.required && (
                  <span
                    style={{
                      color: C.accent,
                      marginLeft: 4,
                      fontSize: 10,
                    }}
                  >
                    *
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
                    border: "none",
                    borderBottom: `1px solid ${C.line}`,
                    background: "transparent",
                    padding: "8px 0",
                    fontSize: 14,
                    fontFamily: fontBody,
                    fontWeight: 300,
                    color: C.text,
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.8,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.accent)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.line)
                  }
                />
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  required={f.required}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: `1px solid ${C.line}`,
                    background: "transparent",
                    padding: "8px 0",
                    fontSize: 14,
                    fontFamily: fontBody,
                    fontWeight: 300,
                    color: C.text,
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.accent)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.line)
                  }
                />
              )}
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              type="submit"
              style={{
                padding: isMobile ? "14px 48px" : "16px 72px",
                background: C.cta,
                color: "#fff",
                border: "none",
                fontSize: 13,
                letterSpacing: "0.12em",
                cursor: "pointer",
                fontFamily: fontBody,
                fontWeight: 400,
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "0.8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              送信する
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */

function FooterSection() {
  return (
    <footer
      style={{
        padding: "80px 24px",
        textAlign: "center",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <p
        style={{
          fontFamily: fontMincho,
          fontSize: 14,
          letterSpacing: "0.12em",
          marginBottom: 12,
          fontWeight: 500,
        }}
      >
        {company.name}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: C.muted,
          letterSpacing: "0.08em",
          fontFamily: fontPlayfair,
        }}
      >
        &copy; {new Date().getFullYear()} {company.nameEn}
      </p>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: Section Label
   ═══════════════════════════════════════════════ */

function SectionLabel({
  label,
  visible,
}: {
  label: string;
  visible: boolean;
}) {
  return (
    <span
      style={{
        fontFamily: fontPlayfair,
        fontSize: 11,
        letterSpacing: "0.2em",
        color: C.muted,
        display: "block",
        marginBottom: 16,
        ...fadeUpStyle(visible, 0.05),
      }}
    >
      {label}
    </span>
  );
}
