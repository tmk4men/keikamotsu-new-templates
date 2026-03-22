"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  company,
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
  contact,
  footer,
  access,
} from "@/data/corporateSiteData";

/* =============================================
   COLOR SCHEME
   ============================================= */
const C = {
  bg: "#ffffff",
  bgSub: "#faf9f6",
  accent: "#b8942e",
  accentLight: "#f5f0e0",
  navy: "#1e3a5f",
  text: "#1e3a5f",
  textSub: "#6b7b8d",
  border: "#e0ddd4",
  white: "#ffffff",
};

/* =============================================
   IMAGE PATHS
   ============================================= */
const IMG = {
  hero: "/keikamotsu-new-templates/images/hero-bg.webp",
  serviceRoute: "/keikamotsu-new-templates/images/service-route.webp",
  serviceEc: "/keikamotsu-new-templates/images/service-ec.webp",
  serviceB2b: "/keikamotsu-new-templates/images/service-b2b.webp",
  serviceSpot: "/keikamotsu-new-templates/images/service-spot.webp",
  strength01: "/keikamotsu-new-templates/images/strength-01.webp",
  strength02: "/keikamotsu-new-templates/images/strength-02.webp",
  strength03: "/keikamotsu-new-templates/images/strength-03.webp",
  ceo: "/keikamotsu-new-templates/images/ceo-portrait.webp",
  team: "/keikamotsu-new-templates/images/team.webp",
  delivery: "/keikamotsu-new-templates/images/delivery.webp",
  footerBg: "/keikamotsu-new-templates/images/footer-bg.webp",
  history2021: "/keikamotsu-new-templates/images/history-2021.webp",
  history2022: "/keikamotsu-new-templates/images/history-2022.webp",
  history2023: "/keikamotsu-new-templates/images/history-2023.webp",
  history2024: "/keikamotsu-new-templates/images/history-2024.webp",
  history2025: "/keikamotsu-new-templates/images/history-2025.webp",
  cityscape: "/keikamotsu-new-templates/images/cityscape.webp",
};

const historyImages: Record<string, string> = {
  "2021": IMG.history2021,
  "2022": IMG.history2022,
  "2023": IMG.history2023,
  "2024": IMG.history2024,
  "2025": IMG.history2025,
};

const serviceImages = [IMG.serviceRoute, IMG.serviceEc, IMG.serviceB2b, IMG.serviceSpot];
const strengthImages = [IMG.strength01, IMG.strength02, IMG.strength03];

/* =============================================
   TAB DEFINITIONS
   ============================================= */
const tabs = [
  { id: "services", label: "事業内容" },
  { id: "strengths", label: "強み" },
  { id: "message", label: "代表メッセージ" },
  { id: "company", label: "会社概要" },
  { id: "history", label: "沿革" },
  { id: "numbers", label: "実績" },
  { id: "partners", label: "取引先" },
  { id: "news", label: "お知らせ" },
  { id: "recruit", label: "採用情報" },
  { id: "contact", label: "お問い合わせ" },
];

/* =============================================
   HOOKS
   ============================================= */

/* --- useTypewriter --- */
function useTypewriter(text: string, speed = 60, startDelay = 400): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const timeout = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return displayed;
}

/* --- useIsMobile --- */
function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* --- CounterNum --- */
function CounterNum({
  target,
  suffix = "",
  duration = 2000,
  trigger,
}: {
  target: string;
  suffix?: string;
  duration?: number;
  trigger: boolean;
}) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!trigger) {
      setDisplay("0");
      return;
    }
    const numericStr = target.replace(/,/g, "");
    const isFloat = numericStr.includes(".");
    const end = parseFloat(numericStr);
    if (isNaN(end)) {
      setDisplay(target);
      return;
    }
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;
      if (isFloat) {
        setDisplay(current.toFixed(1));
      } else {
        const rounded = Math.floor(current);
        setDisplay(rounded >= 1000 ? rounded.toLocaleString() : String(rounded));
      }
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* --- FadeIn component --- */
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const translateMap = {
    up: "translateY(32px)",
    down: "translateY(-32px)",
    left: "translateX(32px)",
    right: "translateX(-32px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translateMap[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* =============================================
   INLINE SVG ICONS (stroke only, no emoji)
   ============================================= */
function IconTruck({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16,8 20,8 23,11 23,16 16,16" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconBuilding({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <rect x="9" y="18" width="6" height="4" />
    </svg>
  );
}

function IconMail({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,4 12,13 2,4" />
    </svg>
  );
}

function IconClock({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

function IconChart({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconHandshake({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11H17l-3-3-4 4-3-3H3.5" />
      <path d="M3.5 11V7h3l3 3 4-4 3 3h3v4" />
      <path d="M3.5 11l4 6h9l4-6" />
    </svg>
  );
}

function IconBell({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconBriefcase({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function IconStar({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function IconQuote({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
    </svg>
  );
}

function IconMap({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconArrowRight({ size = 20, color = C.white }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

function IconChevronDown({ size = 20, color = C.textSub }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

/* =============================================
   CITYSCAPE SVG (one-stroke style)
   ============================================= */
function CityscapeSVG() {
  return (
    <svg
      viewBox="0 0 1440 120"
      style={{ width: "100%", height: "80px", display: "block" }}
      fill="none"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
    >
      <polyline points="
        0,120 0,90 20,90 20,60 35,60 35,90 50,90 50,70 60,70 60,50 75,50 75,70
        90,70 90,40 100,40 100,30 110,30 110,40 120,40 120,70 140,70 140,55
        160,55 160,70 180,70 180,45 190,45 190,35 200,35 200,45 210,45 210,70
        230,70 230,85 250,85 250,60 260,60 260,40 275,40 275,25 290,25 290,40
        300,40 300,60 320,60 320,85 340,85 340,70 360,70 360,50 380,50
        380,35 395,35 395,50 410,50 410,70 430,70 430,55 450,55 450,75
        470,75 470,90 490,90 490,65 500,65 500,45 515,45 515,30 530,30
        530,45 540,45 540,65 560,65 560,80 580,80 580,60 600,60 600,42
        615,42 615,28 630,28 630,42 640,42 640,60 660,60 660,75 680,75
        680,50 700,50 700,35 715,35 715,20 730,20 730,35 740,35 740,50
        760,50 760,72 780,72 780,88 800,88 800,65 820,65 820,48 835,48
        835,32 850,32 850,48 860,48 860,65 880,65 880,80 900,80 900,58
        920,58 920,40 935,40 935,55 950,55 950,72 970,72 970,85 990,85
        990,60 1010,60 1010,42 1025,42 1025,28 1040,28 1040,42 1050,42
        1050,60 1070,60 1070,78 1090,78 1090,55 1110,55 1110,38 1125,38
        1125,55 1140,55 1140,72 1160,72 1160,85 1180,85 1180,62 1200,62
        1200,45 1215,45 1215,30 1230,30 1230,45 1240,45 1240,62 1260,62
        1260,78 1280,78 1280,90 1300,90 1300,70 1320,70 1320,52 1335,52
        1335,38 1350,38 1350,52 1360,52 1360,70 1380,70 1380,85 1400,85
        1400,65 1420,65 1420,90 1440,90 1440,120
      " />
    </svg>
  );
}

/* =============================================
   SECTION HEADING
   ============================================= */
function SectionHeading({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
}) {
  return (
    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ marginBottom: 12 }}>{icon}</div>
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: C.navy,
            margin: 0,
            letterSpacing: "0.04em",
            position: "relative",
            display: "inline-block",
            paddingBottom: 12,
          }}
        >
          {title}
          <span
            className="heading-underline"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              background: C.accent,
              borderRadius: 2,
            }}
          />
        </h2>
        {sub && (
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: C.textSub,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

/* =============================================
   TAB CONTENT COMPONENTS
   ============================================= */

/* --- SERVICES TAB --- */
function ServicesContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconTruck size={32} />} title="事業内容" sub="Services" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}
      >
        {services.map((s, i) => (
          <FadeIn key={s.num} delay={i * 120}>
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                height: isMobile ? 240 : 300,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${serviceImages[i]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.5s ease",
                }}
                className="service-card-img"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(30,58,95,0.85) 0%, rgba(30,58,95,0.3) 50%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: isMobile ? 20 : 28,
                  color: C.white,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.accent,
                    letterSpacing: "0.12em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontSize: isMobile ? 18 : 22,
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: 0,
                    opacity: 0.9,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.text.replace(/\n/g, " ")}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

/* --- STRENGTHS TAB --- */
function StrengthsContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconStar size={32} />} title="私たちの強み" sub="Strengths" />
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        {strengths.map((s, i) => {
          const isReversed = i % 2 === 1;
          return (
            <FadeIn key={s.num} delay={i * 150} direction={isReversed ? "right" : "left"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : isReversed ? "row-reverse" : "row",
                  gap: isMobile ? 24 : 40,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flex: "0 0 50%",
                    position: "relative",
                    padding: isReversed ? "0 15px 15px 0" : "0 0 15px 15px",
                  }}
                >
                  {/* Color panel behind image */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      ...(isReversed ? { left: 0 } : { right: 0 }),
                      width: "100%",
                      height: "100%",
                      borderRadius: 12,
                      background: C.accent,
                      opacity: 0.18,
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        paddingTop: "60%",
                        backgroundImage: `url(${strengthImages[i]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: isReversed ? "auto" : 16,
                        right: isReversed ? 16 : "auto",
                        background: C.accent,
                        color: C.white,
                        padding: "6px 16px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                      }}
                    >
                      STRENGTH {s.num}
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: isMobile ? 20 : 26,
                      fontWeight: 700,
                      color: C.navy,
                      margin: "0 0 16px 0",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 2,
                      color: C.text,
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

/* --- CEO MESSAGE TAB --- */
function MessageContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconQuote size={32} />} title="代表メッセージ" sub="Message" />
      <FadeIn>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 32 : 48,
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: isMobile ? 220 : 280,
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: isMobile ? 200 : 260,
                height: isMobile ? 260 : 340,
                margin: "0 auto",
              }}
            >
              {/* Color panel behind image */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  background: C.accent,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(30,58,95,0.12)",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${IMG.ceo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
              </div>
            </div>
            <p
              style={{
                marginTop: 16,
                fontSize: 14,
                color: C.textSub,
                letterSpacing: "0.06em",
              }}
            >
              {ceoMessage.title}
            </p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.navy,
                margin: "4px 0 0 0",
                letterSpacing: "0.08em",
              }}
            >
              {ceoMessage.name}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                borderLeft: `3px solid ${C.accent}`,
                paddingLeft: 24,
              }}
            >
              {ceoMessage.message.map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 15,
                    lineHeight: 2,
                    color: C.text,
                    margin: i === 0 ? 0 : "20px 0 0 0",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

/* --- COMPANY INFO TAB --- */
function CompanyContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconBuilding size={32} />} title="会社概要" sub="Company" />
      <FadeIn>
        <div
          style={{
            background: C.white,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
            marginBottom: 48,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: isMobile ? 14 : 15,
            }}
          >
            <tbody>
              {companyOverview.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < companyOverview.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <th
                    style={{
                      padding: isMobile ? "14px 12px" : "16px 24px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: C.navy,
                      background: C.accentLight,
                      width: isMobile ? "30%" : "22%",
                      verticalAlign: "top",
                      whiteSpace: isMobile ? "normal" : "nowrap",
                      fontSize: isMobile ? 13 : 15,
                    }}
                  >
                    {row.dt}
                  </th>
                  <td
                    style={{
                      padding: isMobile ? "14px 12px" : "16px 24px",
                      color: C.text,
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
      </FadeIn>

      {/* Access / Google Maps */}
      <FadeIn delay={200}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <IconMap size={24} color={C.accent} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>
              {access.heading}
            </h3>
          </div>
          <p style={{ fontSize: 14, color: C.textSub, margin: "4px 0 0 0" }}>
            {access.address}
          </p>
          <p style={{ fontSize: 13, color: C.textSub, margin: "4px 0 0 0" }}>
            {access.nearestStation}
          </p>
        </div>
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.8!2d135.636!3d34.773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5aSn6Ziq5bqc5a-d5bGL5bed5biC5rGg55Sw!5e0!3m2!1sja!2sjp!4v1700000000000"
            width="100%"
            height={isMobile ? "280" : "380"}
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        </div>
        <p style={{ fontSize: 13, color: C.textSub, marginTop: 12, textAlign: "center" }}>
          {access.mapNote}
        </p>
      </FadeIn>
    </div>
  );
}

/* --- HISTORY TAB --- */
function HistoryContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconClock size={32} />} title="沿革" sub="History" />
      <div style={{ position: "relative", paddingLeft: isMobile ? 32 : 48 }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: isMobile ? 12 : 20,
            top: 0,
            bottom: 0,
            width: 2,
            background: `linear-gradient(to bottom, ${C.accent}, ${C.border})`,
          }}
        />
        {history.map((h, i) => (
          <FadeIn key={h.year} delay={i * 150}>
            <div
              style={{
                position: "relative",
                marginBottom: i < history.length - 1 ? 48 : 0,
              }}
            >
              {/* Dot */}
              <div
                style={{
                  position: "absolute",
                  left: isMobile ? -26 : -34,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: C.accent,
                  border: `3px solid ${C.white}`,
                  boxShadow: `0 0 0 2px ${C.accent}`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 16 : 24,
                  alignItems: isMobile ? "stretch" : "center",
                }}
              >
                {/* Year badge */}
                <div
                  style={{
                    flex: "0 0 auto",
                    background: C.navy,
                    color: C.white,
                    padding: "8px 20px",
                    borderRadius: 6,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textAlign: "center",
                    minWidth: 100,
                  }}
                >
                  {h.year}
                </div>
                {/* Image */}
                <div
                  style={{
                    flex: "0 0 auto",
                    width: isMobile ? "100%" : 180,
                    height: isMobile ? 140 : 110,
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${historyImages[h.year] || ""})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* Top fade */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "30%",
                      background: "linear-gradient(to bottom, rgba(250,249,246,0.7) 0%, transparent 100%)",
                      zIndex: 1,
                    }}
                  />
                  {/* Bottom fade */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "30%",
                      background: "linear-gradient(to top, rgba(250,249,246,0.7) 0%, transparent 100%)",
                      zIndex: 1,
                    }}
                  />
                </div>
                {/* Text */}
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: C.text,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {h.event}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

/* --- NUMBERS TAB --- */
function NumbersContent({ isMobile }: { isMobile: boolean }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTriggered(false);
    const timer = setTimeout(() => setTriggered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.team})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "64px 20px" : "80px 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <IconChart size={32} color={C.accent} />
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: C.white,
              margin: "12px 0 0 0",
              letterSpacing: "0.04em",
            }}
          >
            実績
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8, letterSpacing: "0.08em" }}>
            NUMBERS
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: isMobile ? 20 : 32,
          }}
        >
          {numbers.map((n, i) => (
            <FadeIn key={i} delay={i * 200}>
              <div
                style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 12,
                  padding: isMobile ? "28px 12px" : "40px 20px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? 36 : 52,
                    fontWeight: 800,
                    color: C.accent,
                    lineHeight: 1.1,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <CounterNum
                    target={n.value}
                    suffix={n.suffix}
                    trigger={triggered}
                    duration={2200}
                  />
                </div>
                <p
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    color: "rgba(255,255,255,0.85)",
                    marginTop: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  {n.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- PARTNERS TAB --- */
function PartnersContent({ isMobile }: { isMobile: boolean }) {
  const [truckStarted, setTruckStarted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTruckStarted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconHandshake size={32} />} title="主要取引先" sub="Partners" />
      <FadeIn>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 56,
          }}
        >
          {partners.map((p, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: isMobile ? "20px 12px" : "28px 20px",
                textAlign: "center",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(184,148,46,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: "0 auto 12px",
                  borderRadius: 8,
                  background: C.accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundImage: p.logo ? `url(${p.logo})` : undefined,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {!p.logo && <IconBuilding size={28} color={C.accent} />}
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: "0 0 4px 0" }}>
                {p.name}
              </p>
              <span
                style={{
                  fontSize: 11,
                  color: C.textSub,
                  background: C.bgSub,
                  padding: "2px 10px",
                  borderRadius: 10,
                }}
              >
                {p.industry}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Truck animation with cityscape */}
      <div
        style={{
          position: "relative",
          height: 100,
          overflow: "hidden",
          borderRadius: 8,
          background: `linear-gradient(135deg, ${C.navy} 0%, #2a4f7a 100%)`,
        }}
      >
        {/* Cityscape background */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.2 }}>
          <CityscapeSVG />
        </div>
        {/* Road line */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 0,
            right: 0,
            height: 2,
            background: "rgba(255,255,255,0.25)",
          }}
        />
        {/* Dashed road markings */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 0,
            right: 0,
            height: 1,
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 12px, transparent 12px, transparent 24px)",
          }}
        />
        {/* Truck */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            transform: truckStarted ? "translateX(calc(100vw))" : "translateX(-100px)",
            transition: "transform 30s linear",
          }}
        >
          <IconTruck size={36} color={C.accent} />
        </div>
      </div>
    </div>
  );
}

/* --- NEWS TAB --- */
function NewsContent({ isMobile }: { isMobile: boolean }) {
  const tagColors: Record<string, { bg: string; text: string }> = {
    press: { bg: "#e8f0fe", text: "#1a56db" },
    new: { bg: "#fef3c7", text: "#92400e" },
    default: { bg: C.accentLight, text: C.accent },
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconBell size={32} />} title="お知らせ" sub="News" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}
      >
        {news.map((n, i) => {
          const tc = tagColors[n.tagStyle] || tagColors.default;
          return (
            <FadeIn key={i} delay={i * 120}>
              <article
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: isMobile ? "20px 16px" : "24px",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,58,95,0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <time style={{ fontSize: 13, color: C.textSub, fontFamily: "'Montserrat', sans-serif" }}>
                    {n.date}
                  </time>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 4,
                      background: tc.bg,
                      color: tc.text,
                    }}
                  >
                    {n.tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? 15 : 16,
                    fontWeight: 600,
                    color: C.navy,
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {n.title}
                </h3>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>
                    Read more
                  </span>
                  <IconArrowRight size={14} color={C.accent} />
                </div>
              </article>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

/* --- RECRUIT TAB --- */
function RecruitContent({ isMobile }: { isMobile: boolean }) {
  const [underlineWidth, setUnderlineWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setUnderlineWidth(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.delivery})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.25)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 800,
          margin: "0 auto",
          padding: isMobile ? "64px 20px" : "80px 20px",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <IconBriefcase size={36} color={C.accent} />
          <h2
            style={{
              fontFamily: "'Zen Kurenaido', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: C.white,
              margin: "16px 0",
              lineHeight: 1.4,
              position: "relative",
              display: "inline-block",
              whiteSpace: isMobile ? "normal" : "nowrap",
            }}
          >
            {recruit.heading}
            <span
              style={{
                position: "absolute",
                bottom: -6,
                left: 0,
                width: `${underlineWidth}%`,
                height: 3,
                background: C.accent,
                transition: "width 1.2s ease",
                borderRadius: 2,
              }}
            />
          </h2>
          <div
            style={{
              fontSize: 15,
              lineHeight: 2,
              color: "rgba(255,255,255,0.9)",
              marginTop: 24,
              whiteSpace: "pre-line",
            }}
          >
            {recruit.text}
          </div>
          <a
            href={recruit.link}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 32,
              padding: "14px 40px",
              background: C.accent,
              color: C.white,
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(184,148,46,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {recruit.cta}
            <IconArrowRight size={18} color={C.white} />
          </a>
        </FadeIn>
      </div>
    </div>
  );
}

/* --- CONTACT TAB --- */
function ContactContent({ isMobile }: { isMobile: boolean }) {
  const placeholders: Record<string, string> = {
    company: "例）グリーンロジスティクス株式会社",
    name: "例）山田 太郎",
    email: "例）info@example.co.jp",
    phone: "例）050-0000-0000",
    message: "例）配送サービスについて詳しく知りたいです。見積もりをお願いできますでしょうか。",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <SectionHeading icon={<IconMail size={32} />} title={contact.heading} sub="Contact" />
      <FadeIn>
        <p
          style={{
            fontSize: 15,
            lineHeight: 2,
            color: C.text,
            textAlign: "center",
            marginBottom: 40,
            whiteSpace: "pre-line",
          }}
        >
          {contact.intro}
        </p>
      </FadeIn>
      <FadeIn delay={200}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 0 : 0,
          }}
        >
          {/* Left: Contact info */}
          <div
            style={{
              background: C.navy,
              borderRadius: isMobile ? "12px 12px 0 0" : "12px 0 0 12px",
              padding: isMobile ? "32px 24px" : "40px 32px",
              color: C.white,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 24px 0" }}>
              {company.name}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <IconMap size={20} color={C.accent} />
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 4px 0" }}>
                    住所
                  </p>
                  <p style={{ fontSize: 14, margin: 0 }}>{company.address}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <IconPhone size={20} color={C.accent} />
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 4px 0" }}>
                    電話番号
                  </p>
                  <p style={{ fontSize: 14, margin: 0 }}>{company.phone}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <IconMail size={20} color={C.accent} />
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 4px 0" }}>
                    メール
                  </p>
                  <p style={{ fontSize: 14, margin: 0 }}>{company.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <IconClock size={20} color={C.accent} />
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 4px 0" }}>
                    営業時間
                  </p>
                  <p style={{ fontSize: 14, margin: 0 }}>{company.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            style={{
              background: C.white,
              borderRadius: isMobile ? "0 0 12px 12px" : "0 12px 12px 0",
              padding: isMobile ? "32px 24px" : "40px 32px",
              border: `1px solid ${C.border}`,
              borderLeft: isMobile ? `1px solid ${C.border}` : "none",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("お問い合わせありがとうございます。内容を確認の上、ご連絡いたします。");
              }}
            >
              {contact.fields.map((f) => (
                <div key={f.name} style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.navy,
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                    {f.required && (
                      <span
                        style={{
                          fontSize: 10,
                          color: C.white,
                          background: "#c0392b",
                          padding: "1px 6px",
                          borderRadius: 3,
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
                      placeholder={placeholders[f.name] || ""}
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        fontSize: 14,
                        lineHeight: 1.7,
                        resize: "vertical",
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                    />
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      placeholder={placeholders[f.name] || ""}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        fontSize: 14,
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: C.accent,
                  color: C.white,
                  border: "none",
                  borderRadius: 6,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                  transition: "background 0.3s, transform 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#a6832a";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.accent;
                  e.currentTarget.style.transform = "none";
                }}
              >
                送信する
                <IconArrowRight size={16} color={C.white} />
              </button>
            </form>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

/* =============================================
   MAIN PAGE COMPONENT
   ============================================= */
export default function CorporatePage01() {
  const [activeTab, setActiveTab] = useState("services");
  const [fadeKey, setFadeKey] = useState(0);
  const isMobile = useIsMobile();
  const headlineText = useTypewriter(hero.headline, 80, 600);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [tabBarStuck, setTabBarStuck] = useState(false);

  /* Track sticky state */
  useEffect(() => {
    const handleScroll = () => {
      if (tabBarRef.current) {
        const rect = tabBarRef.current.getBoundingClientRect();
        setTabBarStuck(rect.top <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Tab switch with fade */
  const switchTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;
      setActiveTab(tabId);
      setFadeKey((k) => k + 1);
      /* Scroll tab into view on mobile */
      if (isMobile && tabBarRef.current) {
        const btn = tabBarRef.current.querySelector(`[data-tab="${tabId}"]`) as HTMLElement;
        if (btn) {
          btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }
    },
    [activeTab, isMobile]
  );

  /* Render active tab content */
  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return <ServicesContent isMobile={isMobile} />;
      case "strengths":
        return <StrengthsContent isMobile={isMobile} />;
      case "message":
        return <MessageContent isMobile={isMobile} />;
      case "company":
        return <CompanyContent isMobile={isMobile} />;
      case "history":
        return <HistoryContent isMobile={isMobile} />;
      case "numbers":
        return <NumbersContent isMobile={isMobile} />;
      case "partners":
        return <PartnersContent isMobile={isMobile} />;
      case "news":
        return <NewsContent isMobile={isMobile} />;
      case "recruit":
        return <RecruitContent isMobile={isMobile} />;
      case "contact":
        return <ContactContent isMobile={isMobile} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Zen+Kurenaido&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Noto Sans JP', sans-serif;
          background: ${C.bg};
          color: ${C.text};
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .service-card-img:hover {
          transform: scale(1.05) !important;
        }

        .heading-underline {
          animation: underlineGrow 0.8s ease forwards;
        }

        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 60px; }
        }

        @keyframes fadeContentIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tab-content-fade {
          animation: fadeContentIn 0.45s ease forwards;
        }

        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,148,46,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(184,148,46,0); }
        }

        @keyframes typewriterCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Scrollbar for tab bar */
        .tab-scroll::-webkit-scrollbar { height: 0; }
        .tab-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Remove default focus outline, add custom */
        button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 2px;
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* ================================================
            HERO BAND (50vh)
            ================================================ */}
        <header
          style={{
            position: "relative",
            height: "50vh",
            minHeight: 360,
            maxHeight: 600,
            overflow: "hidden",
          }}
        >
          {/* Background image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG.hero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Navy overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(30,58,95,0.75) 0%, rgba(30,58,95,0.55) 100%)",
            }}
          />
          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 20px",
              textAlign: "center",
            }}
          >
            {/* Company name */}
            <p
              style={{
                fontSize: isMobile ? 12 : 14,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.2em",
                marginBottom: 12,
                fontFamily: "'Montserrat', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {company.nameEn}
            </p>

            {/* Headline (typewriter) */}
            <h1
              style={{
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                fontWeight: 700,
                color: C.white,
                letterSpacing: "0.08em",
                lineHeight: 1.3,
                minHeight: "1.3em",
                textAlign: "center",
                whiteSpace: "pre-line",
              }}
            >
              {headlineText}
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: "0.9em",
                  background: C.accent,
                  marginLeft: 4,
                  verticalAlign: "text-bottom",
                  animation: "typewriterCursor 0.8s step-end infinite",
                }}
              />
            </h1>

            {/* Sub text */}
            <div
              style={{
                marginTop: 20,
                maxWidth: 640,
              }}
            >
              {hero.subtext.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.9,
                    margin: "4px 0",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                switchTab("contact");
              }}
              style={{
                marginTop: 28,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "12px 28px" : "14px 36px",
                background: C.accent,
                color: C.white,
                borderRadius: 50,
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.06em",
                animation: "ctaPulse 2.5s ease infinite",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              {hero.cta}
              <IconArrowRight size={16} color={C.white} />
            </a>

            {/* Scroll hint */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                opacity: 0.6,
              }}
            >
              <span style={{ fontSize: 10, color: C.white, letterSpacing: "0.1em" }}>SCROLL</span>
              <IconChevronDown size={16} color={C.white} />
            </div>
          </div>
        </header>

        {/* ================================================
            STICKY TAB BAR
            ================================================ */}
        <nav
          ref={tabBarRef}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: C.white,
            borderBottom: `1px solid ${C.border}`,
            boxShadow: tabBarStuck ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
            transition: "box-shadow 0.3s",
          }}
        >
          <div
            className="tab-scroll"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              overflowX: "auto",
              padding: "0 8px",
            }}
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => switchTab(tab.id)}
                  style={{
                    flex: isMobile ? "0 0 auto" : "1 1 0",
                    padding: isMobile ? "14px 16px" : "16px 8px",
                    background: "none",
                    border: "none",
                    borderBottom: `3px solid ${isActive ? C.accent : "transparent"}`,
                    color: isActive ? C.navy : C.textSub,
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    transition: "color 0.25s, border-color 0.25s",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.04em",
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = C.navy;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = C.textSub;
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ================================================
            TAB CONTENT AREA
            ================================================ */}
        <main style={{ flex: 1, background: C.bgSub }}>
          <div key={fadeKey} className="tab-content-fade">
            {renderTabContent()}
          </div>
        </main>

        {/* ================================================
            FOOTER (always visible)
            ================================================ */}
        <footer
          style={{
            position: "relative",
            background: C.navy,
            color: C.white,
            overflow: "hidden",
          }}
        >
          {/* Footer background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG.footerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.08,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Cityscape SVG */}
            <CityscapeSVG />

            <div
              style={{
                maxWidth: 1100,
                margin: "0 auto",
                padding: isMobile ? "32px 20px" : "40px 20px",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "center" : "flex-start",
                  gap: 32,
                  marginBottom: 32,
                }}
              >
                {/* Left: Catchphrase + company */}
                <div style={{ textAlign: isMobile ? "center" : "left" }}>
                  <p
                    style={{
                      fontFamily: "'Zen Kurenaido', sans-serif",
                      fontSize: isMobile ? 22 : 28,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      margin: "0 0 12px 0",
                      whiteSpace: "nowrap",
                      color: C.white,
                    }}
                  >
                    {footer.catchphrase}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                    }}
                  >
                    {company.name}
                  </p>
                </div>

                {/* Right: Contact info */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    textAlign: isMobile ? "center" : "right",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: isMobile ? "center" : "flex-end" }}>
                    <IconMap size={14} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                      {company.address}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: isMobile ? "center" : "flex-end" }}>
                    <IconPhone size={14} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                      {company.phone}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: isMobile ? "center" : "flex-end" }}>
                    <IconMail size={14} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                      {company.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer nav */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: isMobile ? 8 : 4,
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {tabs.map((tab, i) => (
                  <React.Fragment key={tab.id}>
                    <button
                      onClick={() => {
                        switchTab(tab.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "4px 8px",
                        transition: "color 0.3s",
                        fontFamily: "'Noto Sans JP', sans-serif",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >
                      {tab.label}
                    </button>
                    {i < tabs.length - 1 && (
                      <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, lineHeight: "28px" }}>
                        |
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Copyright */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em",
                }}
              >
                &copy; {new Date().getFullYear()} {company.name} All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
