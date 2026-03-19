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
  altBg: "#f4f3f0",
};

/* ═══════════════════════════════════════════
   フォントスタック
   ═══════════════════════════════════════════ */
const F = {
  heading: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
  sans: "'Noto Sans JP', sans-serif",
  accent: "'Oswald', 'Zen Kaku Gothic New', sans-serif",
  editorial: "'Playfair Display', 'Zen Kaku Gothic New', serif",
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
   FadeIn ラッパー (enhanced with scale variant)
   ═══════════════════════════════════════════ */
function FadeIn({ children, delay = 0, direction = "up", scale = false, style = {} }: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  scale?: boolean;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView(0.1);
  const transforms: Record<string, string> = {
    up: "translateY(12px)",
    left: "translateX(-12px)",
    right: "translateX(12px)",
    none: "none",
  };
  const baseTransform = scale ? `${transforms[direction]} scale(0.96)` : transforms[direction];
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : baseTransform,
        transition: `opacity 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ClipReveal - clip-path image reveal on scroll
   ═══════════════════════════════════════════ */
function ClipReveal({ children, delay = 0, direction = "left", style = {} }: {
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right" | "bottom";
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView(0.1);
  const clipMap: Record<string, { hidden: string; visible: string }> = {
    left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
    right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
    bottom: { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0% 0)" },
  };
  return (
    <div
      ref={ref}
      style={{
        clipPath: visible ? clipMap[direction].visible : clipMap[direction].hidden,
        transition: `clip-path 1.2s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CounterNum - 数値カウントアップ
   ═══════════════════════════════════════════ */
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
          const duration = 1800;
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

/* ═══════════════════════════════════════════
   Section Divider - editorial line with number
   ═══════════════════════════════════════════ */
function SectionDivider({ number }: { number: string }) {
  return (
    <div style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      height: "1px",
    }}>
      <div style={{
        position: "absolute",
        left: "10%",
        right: "10%",
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Section Number - decorative page number
   ═══════════════════════════════════════════ */
function SectionNumber({ number, align = "left" }: { number: string; align?: "left" | "right" | "center" }) {
  return (
    <div style={{
      fontFamily: F.accent,
      fontSize: "120px",
      fontWeight: 300,
      color: "rgba(0,0,0,0.03)",
      lineHeight: 1,
      textAlign: align,
      marginBottom: "-40px",
      userSelect: "none",
      pointerEvents: "none",
    }}>
      {number}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Accordion Item (controlled, smooth)
   ═══════════════════════════════════════════ */
function AccordionItem({ question, answer, isOpen, onToggle, index, isMobile }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isMobile: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, answer]);

  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: isMobile ? "20px 0" : "28px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={isOpen}
      >
        <span style={{
          fontFamily: F.heading,
          fontSize: isMobile ? "14px" : "16px",
          color: C.text,
          letterSpacing: "0.03em",
          lineHeight: 1.6,
        }}>
          <span style={{
            fontFamily: F.accent,
            fontSize: "14px",
            color: C.accentLight,
            marginRight: "12px",
            fontWeight: 400,
          }}>Q{String(index + 1).padStart(2, "0")}</span>
          {question}
        </span>
        <span style={{
          fontFamily: F.accent,
          fontSize: "20px",
          color: C.muted,
          flex: "0 0 20px",
          textAlign: "center",
          transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          display: "inline-block",
        }}>
          +
        </span>
      </button>
      <div style={{
        overflow: "hidden",
        maxHeight: isOpen ? `${height}px` : "0px",
        transition: "max-height 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        <div ref={contentRef} style={{ padding: "0 0 24px 0" }}>
          <p style={{
            fontSize: "13px",
            color: C.muted,
            lineHeight: 1.9,
            paddingLeft: isMobile ? "0" : "36px",
          }}>
            {typeof answer === 'string' && answer.includes('\n')
              ? answer.split('\n').map((line: string, li: number) => <span key={li}>{line}{li < answer.split('\n').length - 1 && <br />}</span>)
              : answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Full-bleed image band between sections
   ═══════════════════════════════════════════ */
function ImageBand({ src, alt, height = "340px" }: { src: string; alt: string; height?: string }) {
  const pRef = useParallax(0.15);
  return (
    <div ref={pRef.ref} style={{
      width: "100%",
      height,
      overflow: "hidden",
      position: "relative",
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "130%",
          objectFit: "cover",
          display: "block",
          transform: `translateY(${pRef.offset}px)`,
          filter: "grayscale(20%) brightness(0.85)",
        }}
      />
    </div>
  );
}


/* ═══════════════════════════════════════════
   Typewriter フック
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   セクション見出しアイコン（line-art style）
   ═══════════════════════════════════════════ */
const sectionIcons: Record<string, React.ReactNode> = {
  "Why Choose Us": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>,
  Recruitment: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>,
  Benefits: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>,
  "Daily Schedule": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  Gallery: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
  Interviews: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  FAQ: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>,
  News: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9h4" /><path d="M18 14h-8M18 18h-8M10 6h8" /></svg>,
  Access: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Company: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9h1M9 13h1M9 17h1" /></svg>,
  Apply: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
};

/* ═══════════════════════════════════════════
   メインコンポーネント
   ═══════════════════════════════════════════ */
export default function R04Flow() {
  const { show, atTop } = useScrollDirection();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroTyped = useTypewriter("物流で、未来を", 80, 500);

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
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;600;700&family=Oswald:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        a { text-decoration: none; color: inherit; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }

        @keyframes floatGeo1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(12px, -18px) rotate(90deg); }
        }
        @keyframes floatGeo2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 12px) rotate(-60deg); }
        }
        @keyframes floatGeo3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(8px, 15px) rotate(45deg); }
        }

        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(50,55,60,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(50,55,60,0); }
        }

        @keyframes shineSweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        @keyframes truckDrive {
          0% { left: -60px; }
          100% { left: calc(100% + 60px); }
        }

        @keyframes underlineReveal {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes r04marqueeLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes r04marqueeRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }

        /* Nav animated underline */
        .flow-nav-link {
          position: relative;
        }
        .flow-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 1px;
          background: currentColor;
          transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .flow-nav-link:hover::after {
          width: 100%;
        }

        /* Form focus animated border */
        .flow-input-wrap {
          position: relative;
        }
        .flow-input-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0%;
          height: 2px;
          background: #32373c;
          transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), left 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .flow-input-wrap:focus-within::after {
          width: 100%;
          left: 0%;
        }

        /* Image hover interaction */
        .flow-img-hover {
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.6s ease;
        }
        .flow-img-hover:hover {
          transform: scale(1.04);
          filter: grayscale(0%) !important;
        }

        /* Button shine sweep */
        .flow-btn-shine {
          position: relative;
          overflow: hidden;
        }
        .flow-btn-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: none;
        }
        .flow-btn-shine:hover::after {
          animation: shineSweep 0.6s ease forwards;
        }
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
            transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s, border-color 0.3s",
            background: atTop ? "transparent" : `rgba(250,250,249,0.95)`,
            backdropFilter: atTop ? "none" : "blur(12px)",
            borderBottom: atTop ? "1px solid transparent" : `1px solid ${C.border}`,
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
              <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href}
                    className="flow-nav-link"
                    style={{
                      fontSize: "12px", color: atTop ? "rgba(255,255,255,0.7)" : C.muted,
                      letterSpacing: "0.06em", transition: "color 0.3s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = atTop ? "#fff" : C.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = atTop ? "rgba(255,255,255,0.7)" : C.muted)}
                  >
                    {l.label}
                  </a>
                ))}
                <a href="#apply"
                  className="flow-nav-link"
                  style={{
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
          {isMobile && (
            <nav style={{
              background: C.bg,
              padding: "24px 20px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              borderBottom: `1px solid ${C.border}`,
              maxHeight: mobileNav ? "400px" : "0px",
              overflow: "hidden",
              opacity: mobileNav ? 1 : 0,
              transition: "max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease, padding 0.3s ease",
              ...(mobileNav ? {} : { padding: "0 20px" }),
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
           HERO (enhanced with noise, geometric, FLOW text)
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

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)",
          }} />

          {/* Noise texture overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            pointerEvents: "none",
          }} />

          {/* Large background FLOW text decoration */}
          <div style={{
            position: "absolute",
            zIndex: 2,
            fontFamily: F.accent,
            fontSize: isMobile ? "28vw" : "18vw",
            fontWeight: 600,
            color: "rgba(255,255,255,0.03)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}>
            FLOW
          </div>

          {/* Floating geometric elements */}
          {!isMobile && (
            <>
              <div style={{
                position: "absolute", top: "18%", left: "8%", zIndex: 2,
                width: "60px", height: "60px",
                border: "1px solid rgba(255,255,255,0.08)",
                animation: "floatGeo1 8s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: "65%", right: "12%", zIndex: 2,
                width: "40px", height: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "50%",
                animation: "floatGeo2 10s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: "25%", left: "15%", zIndex: 2,
                width: "0", height: "0",
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: "34px solid rgba(255,255,255,0.04)",
                animation: "floatGeo3 12s ease-in-out infinite",
                pointerEvents: "none",
              }} />
            </>
          )}

          <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "0 24px" }}>
            <FadeIn delay={0.3}>
              <p style={{
                fontFamily: F.accent, fontSize: isMobile ? "11px" : "13px",
                color: "rgba(255,255,255,0.6)", letterSpacing: "0.3em",
                marginBottom: isMobile ? "16px" : "24px", textTransform: "uppercase",
              }}>
                Green Logistics Recruiting
              </p>
            </FadeIn>
            <div>
              <h1 style={{
                fontFamily: "'Zen Kurenaido', 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
                fontSize: isMobile ? "28px" : "54px",
                fontWeight: 400, color: "#fff", lineHeight: 1.4,
                letterSpacing: "0.1em",
              }}>
                {heroTyped.displayed}
                {!heroTyped.done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
                {heroTyped.done && <><br />変えていく。</>}
              </h1>
            </div>
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
            zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
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
          </div>
        </section>

        {/* ── Marquee ── */}
        <div style={{ background: C.bg, overflow: "hidden", padding: "20px 0" }}>
          {[
            ["迅速配達", "未経験歓迎", "車両無料貸出", "月収40万〜100万円", "週払いOK", "入社祝い金5万円"],
            ["大阪・東京・兵庫", "20〜60代活躍", "リース料ゼロ", "AT限定OK", "スマホ完結", "集荷なし"],
          ].map((row, ri) => (
            <div key={ri} style={{ overflow: "hidden", whiteSpace: "nowrap", marginBottom: ri === 0 ? 10 : 0 }}>
              <div style={{
                display: "inline-flex", gap: 48,
                animation: `${ri === 0 ? "r04marqueeLeft" : "r04marqueeRight"} ${28 + ri * 6}s linear infinite`,
              }}>
                {[...row, ...row, ...row, ...row].map((t, ti) => (
                  <span key={ti} style={{
                    fontFamily: F.accent, fontSize: "12px", letterSpacing: "0.15em",
                    color: C.mutedLight, textTransform: "uppercase", fontWeight: 300,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════
           LEAD
           ════════════════════════════════════════ */}
        <section style={{ padding: isMobile ? "100px 0 80px" : "185px 0 140px", background: C.bg, position: "relative" }}>
          <SectionNumber number="01" align="left" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "32px",
              }}>
                ── About This Work ──
              </p>
            </FadeIn>
            <FadeIn delay={0.15} scale>
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
                月収<CounterNum target={40} style={{ display: "inline-block" }} />万〜<CounterNum target={100} style={{ display: "inline-block" }} />万円が目指せます。
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── Editorial divider ── */}
        <SectionDivider number="02" />

        {/* ════════════════════════════════════════
           REASONS
           ════════════════════════════════════════ */}
        <section id="reasons" style={{ padding: isMobile ? "80px 0 90px" : "160px 0 140px", background: C.white, position: "relative" }}>
          <SectionNumber number="02" align="right" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["Why Choose Us"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Why Choose Us ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                選ばれる理由
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
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
                    flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                  }}>
                    {/* Image with clip reveal */}
                    <ClipReveal direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.1} style={{
                      flex: isMobile ? undefined : "0 0 38%",
                      marginBottom: isMobile ? "20px" : 0,
                      overflow: "hidden",
                      position: "relative",
                    }}>
                      <img
                        src={`/keikamotsu-new-templates/images/strength-${r.num}.webp`}
                        alt={r.title}
                        className="flow-img-hover"
                        style={{
                          width: "100%",
                          height: isMobile ? "200px" : "100%",
                          objectFit: "cover",
                          display: "block",
                          filter: "grayscale(15%)",
                        }}
                      />
                      {/* Editorial caption */}
                      <p style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "12px",
                        fontFamily: F.accent,
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}>
                        Fig. {r.num}
                      </p>
                    </ClipReveal>

                    {/* Text */}
                    <div style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      position: "relative",
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

        {/* ── Full-bleed image band ── */}
        <ImageBand src="/keikamotsu-new-templates/images/reasons.webp" alt="選ばれる理由" height={isMobile ? "200px" : "340px"} />

        {/* ════════════════════════════════════════
           JOBS
           ════════════════════════════════════════ */}
        <section id="jobs" style={{ padding: isMobile ? "80px 0 90px" : "180px 0 150px", background: C.altBg, position: "relative" }}>
          <SectionNumber number="03" align="left" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            {/* Jobs section image */}
            {!isMobile && (
              <ClipReveal direction="right" style={{
                position: "absolute",
                top: "-40px",
                right: "-5%",
                width: "320px",
                height: "220px",
                zIndex: 1,
              }}>
                <img
                  src="/keikamotsu-new-templates/images/jobs.webp"
                  alt="求人情報"
                  className="flow-img-hover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(15%)",
                  }}
                />
                <p style={{
                  fontFamily: F.accent,
                  fontSize: "10px",
                  color: C.mutedLight,
                  letterSpacing: "0.08em",
                  marginTop: "8px",
                }}>
                  Recruitment details
                </p>
              </ClipReveal>
            )}

            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["Recruitment"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Recruitment ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                求人情報
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
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

            {isMobile && (
              <FadeIn delay={0.1}>
                <div style={{ margin: "24px 0", overflow: "hidden" }}>
                  <img
                    src="/keikamotsu-new-templates/images/jobs.webp"
                    alt="求人情報"
                    style={{ width: "100%", height: "180px", objectFit: "cover", display: "block", filter: "grayscale(15%)" }}
                  />
                </div>
              </FadeIn>
            )}

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
                      <span style={{ color: C.accent, marginRight: "8px" }}>&#x25AA;</span>{row.dt}
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
                      transition: "border-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Editorial divider ── */}
        <SectionDivider number="04" />

        {/* ════════════════════════════════════════
           BENEFITS
           ════════════════════════════════════════ */}
        <section id="benefits" style={{ padding: isMobile ? "80px 0 90px" : "145px 0 170px", background: C.white, position: "relative" }}>
          <SectionNumber number="04" align="center" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["Benefits"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Benefits ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                待遇・福利厚生
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
              </h2>
            </FadeIn>

            {/* Benefits hero image */}
            <FadeIn delay={0.1}>
              <ClipReveal direction="bottom" delay={0.15} style={{ marginTop: isMobile ? "32px" : "56px" }}>
                <img
                  src="/keikamotsu-new-templates/images/benefits.webp"
                  alt="待遇・福利厚生"
                  className="flow-img-hover"
                  style={{
                    width: "100%",
                    height: isMobile ? "200px" : "320px",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(15%)",
                  }}
                />
              </ClipReveal>
            </FadeIn>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
              gap: isMobile ? "32px" : "48px 64px",
              marginTop: isMobile ? "48px" : "80px",
            }}>
              {benefits.map((b, i) => (
                <FadeIn key={b.title} delay={i * 0.08} scale>
                  <div style={{
                    padding: isMobile ? "0" : "0 0 0 24px",
                    borderLeft: isMobile ? "none" : `2px solid ${C.border}`,
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={e => { if (!isMobile) (e.currentTarget as HTMLElement).style.borderLeftColor = C.accent; }}
                  onMouseLeave={e => { if (!isMobile) (e.currentTarget as HTMLElement).style.borderLeftColor = C.border; }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px" }}>
                      <span style={{
                        fontFamily: F.accent,
                        fontSize: "28px",
                        fontWeight: 300,
                        color: "rgba(0,0,0,0.06)",
                        lineHeight: 1,
                      }}>
                        {String(i + 1).padStart(2, "0")}
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
                      marginLeft: isMobile ? "0" : "42px",
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

        {/* ── Full-bleed image band ── */}
        <ImageBand src="/keikamotsu-new-templates/images/daily-flow.webp" alt="一日の流れ" height={isMobile ? "200px" : "340px"} />

        {/* ════════════════════════════════════════
           DAILY (with inline video)
           ════════════════════════════════════════ */}
        <section id="daily" style={{ padding: isMobile ? "80px 0 90px" : "200px 0 160px", background: C.altBg, position: "relative" }}>
          <SectionNumber number="05" align="right" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ textAlign: isMobile ? "left" : "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight, justifyContent: isMobile ? "flex-start" : "flex-end" }}>
                  {sectionIcons["Daily Schedule"]}
                </div>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── Daily Schedule ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                  position: "relative", display: "inline-block", paddingBottom: 8,
                }}>
                  一日の流れ
                  <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
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

            {/* Inline delivery video */}
            <FadeIn delay={0.2}>
              <ClipReveal direction="left" delay={0.1} style={{ marginTop: isMobile ? "32px" : "56px" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <video
                    autoPlay muted loop playsInline
                    style={{
                      width: "100%",
                      height: isMobile ? "220px" : "360px",
                      objectFit: "cover",
                      display: "block",
                      filter: "grayscale(10%)",
                    }}
                  >
                    <source src="/keikamotsu-new-templates/videos/delivery-scene.mp4" type="video/mp4" />
                  </video>
                  {/* Editorial caption overlay */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px 16px 12px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                  }}>
                    <p style={{
                      fontFamily: F.accent,
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}>
                      Delivery Scene — A Day in the Life
                    </p>
                  </div>
                </div>
              </ClipReveal>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "48px" : "80px", position: "relative" }}>
              {/* Timeline Line */}
              {!isMobile && (
                <div style={{
                  position: "absolute", left: "120px", top: 0, bottom: 0,
                  width: "1px", background: `linear-gradient(${C.border}, transparent)`,
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
                        <span style={{ fontSize: "10px", verticalAlign: "middle", marginRight: "6px" }}>&#x25CF;</span>{step.time}
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

        {/* ── Editorial divider ── */}
        <SectionDivider number="06" />

        {/* ════════════════════════════════════════
           GALLERY
           ════════════════════════════════════════ */}
        <section id="gallery" style={{ padding: isMobile ? "80px 0 90px" : "155px 0 180px", background: C.white, overflow: "hidden", position: "relative" }}>
          <SectionNumber number="06" align="center" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["Gallery"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Gallery ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                {gallery.heading}
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
              </h2>
            </FadeIn>

            {/* Magazine Spread Layout */}
            {isMobile ? (
              <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {gallery.images.map((img, i) => (
                  <FadeIn key={img.src} delay={i * 0.1}>
                    <ClipReveal direction={i % 2 === 0 ? "left" : "right"}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={img.src} alt={img.alt}
                          className="flow-img-hover"
                          style={{
                            width: "100%", height: "220px", objectFit: "cover",
                            display: "block", filter: "grayscale(15%)",
                          }}
                        />
                        {/* Editorial caption */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginTop: "8px",
                        }}>
                          <p style={{
                            fontFamily: F.heading, fontSize: "11px", color: C.muted,
                            letterSpacing: "0.03em",
                          }}>
                            {img.caption}
                          </p>
                          <span style={{
                            fontFamily: F.accent,
                            fontSize: "10px",
                            color: C.mutedLight,
                            letterSpacing: "0.08em",
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </ClipReveal>
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
                    <ClipReveal key={img.src} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.08} style={{ ...spans[i], position: "relative", overflow: "hidden" }}>
                      <img
                        src={img.src} alt={img.alt}
                        className="flow-img-hover"
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          display: "block", filter: "grayscale(15%)",
                        }}
                      />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        padding: "32px 16px 14px",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.45))",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <p style={{
                            fontFamily: F.heading, fontSize: "12px", color: "rgba(255,255,255,0.85)",
                            letterSpacing: "0.03em",
                          }}>
                            {img.caption}
                          </p>
                          <span style={{
                            fontFamily: F.accent,
                            fontSize: "10px",
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.08em",
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </ClipReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Full-bleed image band ── */}
        <ImageBand src="/keikamotsu-new-templates/images/voices.webp" alt="先輩の声" height={isMobile ? "200px" : "340px"} />

        {/* ════════════════════════════════════════
           VOICES (with pull quotes & Playfair Display)
           ════════════════════════════════════════ */}
        <section id="voices" style={{ padding: isMobile ? "80px 0 90px" : "170px 0 145px", background: C.bg, position: "relative" }}>
          <SectionNumber number="07" align="left" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["Interviews"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Interviews ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                先輩の声
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
              </h2>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "48px" : "80px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "32px" }}>
              {voices.map((v, i) => (
                <FadeIn key={v.name} delay={i * 0.12}>
                  <div style={{
                    background: "#f8f8f6",
                    borderRadius: i % 2 === 0 ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    padding: "32px",
                    position: "relative",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    marginBottom: "24px",
                  }}>
                    {/* Highlight quote */}
                    <p style={{
                      fontSize: isMobile ? "16px" : "18px",
                      fontWeight: 600,
                      color: C.text,
                      lineHeight: 1.6,
                      marginBottom: 16,
                    }}>
                      {v.highlight}
                    </p>
                    {/* Full text */}
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9 }}>
                      {typeof v.text === 'string' && v.text.includes('\n')
                        ? v.text.split('\n').map((line, li) => <span key={li}>{line}{li < v.text.split('\n').length - 1 && <br />}</span>)
                        : v.text}
                    </p>
                    {/* Profile inside bubble */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accent + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 18 }}>👤</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{v.name}</p>
                        <p style={{ fontSize: 12, color: C.muted }}>{v.age} / {v.prev}</p>
                      </div>
                    </div>
                    {/* Triangle tail */}
                    <div style={{
                      position: "absolute",
                      bottom: -10,
                      ...(i % 2 === 0 ? { left: 32 } : { right: 32 }),
                      width: 0, height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderTop: "10px solid #f8f8f6",
                    }} />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Editorial divider ── */}
        <SectionDivider number="08" />

        {/* ════════════════════════════════════════
           FAQ (controlled accordion)
           ════════════════════════════════════════ */}
        <section id="faq" style={{
          padding: isMobile ? "80px 0 90px" : "140px 0 155px",
          background: C.white,
          position: "relative",
        }}>
          <SectionNumber number="08" align="center" />
          {/* Decorative FAQ image */}
          {!isMobile && (
            <div style={{
              position: "absolute",
              top: "80px",
              right: "5%",
              width: "200px",
              height: "280px",
              overflow: "hidden",
              opacity: 0.12,
              pointerEvents: "none",
            }}>
              <img
                src="/keikamotsu-new-templates/images/faq.webp"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
          <div style={{ width: containerW, margin: "0 auto", maxWidth: "780px", position: "relative" }}>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                  {sectionIcons["FAQ"]}
                </div>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── FAQ ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                  position: "relative", display: "inline-block", paddingBottom: 8,
                }}>
                  よくある質問
                  <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
                </h2>
              </div>
            </FadeIn>

            <div style={{ marginTop: isMobile ? "48px" : "72px" }}>
              {faq.map((item, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <AccordionItem
                    question={item.q}
                    answer={item.a}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                    index={i}
                    isMobile={isMobile}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           NEWS
           ════════════════════════════════════════ */}
        <section id="news" style={{ padding: isMobile ? "80px 0 90px" : "190px 0 165px", background: C.altBg, position: "relative" }}>
          <SectionNumber number="09" align="right" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["News"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── News ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                お知らせ
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
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
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.01)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <time style={{
                        fontFamily: F.accent, fontSize: "13px", color: C.muted,
                        letterSpacing: "0.04em", flex: "0 0 auto",
                      }}>
                        <span style={{ marginRight: "6px" }}>&#x2500;</span>{n.date}
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

        {/* ── Editorial divider ── */}
        <SectionDivider number="10" />

        {/* ════════════════════════════════════════
           ACCESS
           ════════════════════════════════════════ */}
        <section id="access" style={{ padding: isMobile ? "80px 0 90px" : "150px 0 175px", background: C.white, position: "relative" }}>
          <SectionNumber number="10" align="left" />
          <div style={{ width: containerW, margin: "0 auto", position: "relative" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                {sectionIcons["Access"]}
              </div>
              <p style={{
                fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                ── Access ──
              </p>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                {access.heading}
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
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
           COMPANY (with image)
           ════════════════════════════════════════ */}
        <section id="company" style={{ padding: isMobile ? "80px 0 90px" : "175px 0 185px", background: C.altBg, position: "relative" }}>
          <SectionNumber number="11" align="center" />
          <div style={{ width: containerW, margin: "0 auto", maxWidth: "780px", position: "relative" }}>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                  {sectionIcons["Company"]}
                </div>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── Company ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                  position: "relative", display: "inline-block", paddingBottom: 8,
                }}>
                  会社概要
                  <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
                </h2>
              </div>
            </FadeIn>

            {/* Company image */}
            <FadeIn delay={0.1}>
              <ClipReveal direction="bottom" delay={0.1} style={{ marginTop: isMobile ? "32px" : "48px" }}>
                <img
                  src="/keikamotsu-new-templates/images/company.webp"
                  alt="会社概要"
                  className="flow-img-hover"
                  style={{
                    width: "100%",
                    height: isMobile ? "200px" : "300px",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(15%)",
                  }}
                />
              </ClipReveal>
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

        {/* ── Editorial divider ── */}
        <SectionDivider number="12" />

        {/* ════════════════════════════════════════
           APPLY (FORM) with animated focus
           ════════════════════════════════════════ */}
        <section id="apply" style={{ padding: isMobile ? "80px 0 90px" : "165px 0 195px", background: C.white, position: "relative" }}>
          <SectionNumber number="12" align="right" />
          <div style={{ width: containerW, margin: "0 auto", maxWidth: "640px", position: "relative" }}>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 8, color: C.mutedLight }}>
                  {sectionIcons["Apply"]}
                </div>
                <p style={{
                  fontFamily: F.accent, fontSize: "11px", color: C.mutedLight,
                  letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px",
                }}>
                  ── Apply ──
                </p>
                <h2 style={{
                  fontFamily: F.heading, fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700, color: C.text, letterSpacing: "0.06em",
                  position: "relative", display: "inline-block", paddingBottom: 8,
                }}>
                  応募フォーム
                  <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.4s forwards" }} />
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
                    { label: "お名前", name: "name", type: "text", required: true, placeholder: "例：山田 太郎" },
                    { label: "電話番号", name: "phone", type: "tel", required: true, placeholder: "例：090-1234-5678" },
                    { label: "メールアドレス", name: "email", type: "email", required: false, placeholder: "例：taro@example.com" },
                  ].map((field) => (
                    <div key={field.name} style={{ marginBottom: isMobile ? "32px" : "40px" }} className="flow-input-wrap">
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
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        style={{
                          width: "100%", padding: "12px 0",
                          border: "none", borderBottom: `1px solid ${C.border}`,
                          background: "transparent", fontSize: "15px",
                          fontFamily: F.sans, fontWeight: 300, color: C.text,
                          outline: "none", transition: "border-color 0.3s",
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: isMobile ? "32px" : "40px" }} className="flow-input-wrap">
                    <label style={{
                      fontFamily: F.heading, fontSize: "13px", color: C.text,
                      letterSpacing: "0.06em", display: "block", marginBottom: "12px",
                    }}>
                      備考・ご質問
                    </label>
                    <textarea
                      rows={4}
                      placeholder="ご質問やご要望があればお書きください"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: "100%", padding: "12px 0",
                        border: "none", borderBottom: `1px solid ${C.border}`,
                        background: "transparent", fontSize: "15px",
                        fontFamily: F.sans, fontWeight: 300, color: C.text,
                        outline: "none", resize: "vertical", transition: "border-color 0.3s",
                      }}
                    />
                  </div>

                  <div style={{ textAlign: "center", marginTop: isMobile ? "40px" : "56px" }}>
                    <button type="submit"
                      className="flow-btn-shine"
                      style={{
                        fontFamily: F.heading, fontSize: "15px", letterSpacing: "0.08em",
                        color: "#fff", background: C.cta,
                        border: "none", padding: isMobile ? "16px 48px" : "18px 72px",
                        cursor: "pointer",
                        transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = C.ctaHover;
                        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = C.cta;
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      送信する
                    </button>
                  </div>
                </form>
              </FadeIn>
            )}

            {/* トラックアニメーション */}
            <div style={{ position: "relative", height: isMobile ? 40 : 60, overflow: "hidden", marginTop: isMobile ? 12 : 20, opacity: 0.1 }}>
              <svg viewBox="0 0 800 60" fill="none" style={{ position: "absolute", bottom: 0, width: "100%", height: isMobile ? 40 : 60 }}>
                <path d="M0,58 L60,58 L60,40 L55,35 L50,30 L45,35 L40,40 L40,58 L100,58 L100,28 L110,28 L110,58 L160,58 L160,20 L150,15 L160,20 L160,58 L230,58 L230,30 L220,25 L230,30 L230,58 L310,58 L310,35 L300,12 L310,35 L310,58 L420,58 L420,22 L410,18 L420,22 L420,58 L530,58 L530,15 L520,7 L530,15 L530,58 L630,58 L630,45 L620,40 L630,45 L630,58 L770,58 L770,30 L770,58 L800,58" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
              <div style={{ position: "absolute", bottom: isMobile ? 2 : 4, animation: `truckDrive ${isMobile ? 12 : 20}s linear infinite` }}>
                <svg width={isMobile ? 30 : 40} height={isMobile ? 18 : 24} viewBox="0 0 48 28" fill="currentColor" opacity="0.7">
                  <rect x="0" y="4" width="28" height="18" rx="2" />
                  <rect x="28" y="10" width="16" height="12" rx="1" />
                  <circle cx="10" cy="24" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="38" cy="24" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
           CTA SECTION (with pulse animation)
           ════════════════════════════════════════ */}
        <section style={{
          padding: isMobile ? "100px 0" : "160px 0",
          background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/keikamotsu-new-templates/images/delivery.webp) center/cover no-repeat`,
          color: "#fff",
          position: "relative",
        }}>
          {/* Noise overlay on CTA */}
          <div style={{
            position: "absolute", inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            pointerEvents: "none",
          }} />
          <div style={{ width: containerW, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <FadeIn scale>
              <h2 style={{
                fontFamily: F.heading, fontSize: isMobile ? "22px" : "36px",
                fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.06em",
                color: "#fff",
                position: "relative", display: "inline-block", paddingBottom: 8,
              }}>
                ちょっと話を<br />聞いてみたい。
                <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: "linear-gradient(to right, rgba(255,255,255,0.7), transparent)", transformOrigin: "left", transform: "scaleX(0)", animation: "underlineReveal 0.8s ease 0.5s forwards" }} />
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
                  transition: "transform 0.3s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
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
              <a href="#apply"
                className="flow-btn-shine"
                style={{
                  display: "inline-block", marginTop: "48px",
                  fontFamily: F.heading, fontSize: "14px", letterSpacing: "0.1em",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
                  padding: isMobile ? "14px 40px" : "16px 56px",
                  transition: "background 0.4s, border-color 0.4s, transform 0.3s, box-shadow 0.3s",
                  animation: "ctaPulse 2.5s infinite",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.animationPlayState = "paused";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.animationPlayState = "running";
                }}
              >
                {cta.webLabel}
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ════════════════════════════════════════
           FOOTER (with footer-bg image)
           ════════════════════════════════════════ */}
        <footer style={{
          padding: isMobile ? "48px 0 32px" : "64px 0 40px",
          background: `linear-gradient(rgba(26,26,26,0.92), rgba(26,26,26,0.96)), url(/keikamotsu-new-templates/images/footer-bg.webp) center/cover no-repeat`,
          borderTop: `1px solid ${C.borderDark}`,
          textAlign: "center",
          position: "relative",
        }}>
          <p style={{
            fontFamily: F.heading, fontSize: isMobile ? "12px" : "14px",
            color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", lineHeight: 1.9,
            maxWidth: "480px", margin: "0 auto",
          }}>
            {footer.catchphrase}
          </p>
          {/* Thin editorial line */}
          <div style={{
            width: "40px",
            height: "1px",
            background: "rgba(255,255,255,0.1)",
            margin: "24px auto",
          }} />
          <p style={{
            fontFamily: F.accent, fontSize: "12px",
            color: "rgba(255,255,255,0.2)", marginTop: "8px",
            letterSpacing: "0.1em",
          }}>
            {company.nameEn}
          </p>
            {/* 一筆書きシティスケープ */}
            <div style={{ width: "100%", maxWidth: 800, margin: "0 auto 20px", opacity: 0.15, lineHeight: 0 }}>
              <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <path d="M0,58 L60,58 L60,40 L55,40 L55,35 L50,30 L45,35 L45,40 L40,40 L40,58 L80,58 L80,28 L85,28 L85,22 L90,22 L90,28 L100,28 L100,58 L120,58 L125,45 L130,58 L140,58 L140,20 L145,20 L145,15 L150,15 L150,20 L160,20 L160,58 L200,58 L200,30 L210,30 L210,25 L220,25 L220,30 L230,30 L230,58 L250,58 L255,48 L260,52 L265,46 L270,58 L290,58 L290,35 L295,35 L295,12 L300,12 L305,12 L305,35 L310,35 L310,58 L340,58 L340,42 L350,42 L350,38 L355,34 L360,38 L360,42 L370,42 L370,58 L400,58 L400,22 L405,22 L410,18 L415,22 L420,22 L420,58 L440,58 L445,50 L450,45 L455,50 L460,58 L480,58 L480,30 L490,30 L490,58 L510,58 L510,15 L515,15 L515,10 L520,7 L525,10 L525,15 L530,15 L530,58 L560,58 L560,38 L565,38 L570,32 L575,38 L580,38 L580,58 L600,58 L600,45 L610,45 L610,40 L620,40 L620,45 L630,45 L630,58 L650,58 L650,25 L660,20 L670,25 L670,58 L700,58 L700,48 L705,48 L705,42 L710,38 L715,35 L720,38 L720,42 L730,42 L730,48 L735,48 L735,58 L760,58 L760,30 L770,30 L770,58 L800,58"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
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
