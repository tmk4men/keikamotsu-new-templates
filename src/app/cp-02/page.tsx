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

/* ─────────────── カラー定数 ─────────────── */
const C = {
  white: "#ffffff",
  bgSub: "#f8f9fb",
  bgBand: "#f1f5f9",
  text: "#1e293b",
  textSub: "#475569",
  accent: "#3b5998",
  cta: "#32373c",
  border: "#e2e8f0",
  borderLight: "#f0f2f5",
};

/* ─────────────── フェードインHook ─────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  return { ref, style };
}

/* ─────────────── タグ色 ─────────────── */
function tagColor(tagStyle: string) {
  switch (tagStyle) {
    case "press":
      return { bg: "#3b5998", color: "#fff" };
    case "new":
      return { bg: "#e8f0fe", color: "#3b5998" };
    default:
      return { bg: "#f1f5f9", color: "#475569" };
  }
}

/* ═══════════════ メインコンポーネント ═══════════════ */
export default function CP02Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  /* ─── Header ─── */
  const renderHeader = () => (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: C.white,
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "14px 20px" : "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ロゴ */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 16 : 18,
            fontWeight: 700,
            color: C.text,
            textDecoration: "none",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          GREEN
          <span style={{ color: C.accent, marginLeft: 4 }}>LOGISTICS</span>
        </a>

        {/* PC ナビ */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.slice(0, 6).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textSub,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textSub)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* 電話 + 問い合わせ */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                letterSpacing: "0.04em",
              }}
            >
              {company.phone}
            </span>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: C.white,
                backgroundColor: C.cta,
                padding: "9px 22px",
                borderRadius: 4,
                textDecoration: "none",
                letterSpacing: "0.05em",
                transition: "opacity 0.15s ease, background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              お問い合わせ
            </a>
          </div>
        )}

        {/* ハンバーガー */}
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
                width: 22,
                height: 2,
                backgroundColor: C.text,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                backgroundColor: C.text,
                transition: "opacity 0.3s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                backgroundColor: C.text,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* モバイルメニュー */}
      {isMobile && menuOpen && (
        <nav
          style={{
            backgroundColor: C.white,
            borderTop: `1px solid ${C.border}`,
            padding: "16px 20px 24px",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              style={{
                display: "block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: C.text,
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: `1px solid ${C.borderLight}`,
                letterSpacing: "0.05em",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {company.phone}
            </span>
          </div>
        </nav>
      )}
    </header>
  );

  /* ─── Hero ─── */
  const renderHero = () => {
    const f = useFadeIn(0.1);
    return (
      <section
        style={{
          position: "relative",
          minHeight: isMobile ? "85vh" : "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url(/images/hero-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: isMobile ? 56 : 64,
        }}
      >
        {/* overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.78)",
          }}
        />
        <div
          ref={f.ref}
          style={{
            ...f.style,
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: isMobile ? "0 24px" : "0 40px",
            maxWidth: 780,
          }}
        >
          <h1
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 28 : 44,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.35,
              letterSpacing: "0.06em",
              marginBottom: 20,
            }}
          >
            {hero.headline}
          </h1>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: isMobile ? 13 : 15,
              color: C.textSub,
              lineHeight: 1.9,
              letterSpacing: "0.05em",
              marginBottom: 36,
            }}
          >
            {hero.subtext.join("\n").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <a
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, "#contact")}
            style={{
              display: "inline-block",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
              backgroundColor: C.cta,
              padding: isMobile ? "14px 36px" : "15px 48px",
              borderRadius: 5,
              textDecoration: "none",
              letterSpacing: "0.05em",
              transition: "opacity 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {hero.cta}
          </a>
        </div>
      </section>
    );
  };

  /* ─── Services ─── */
  const renderServices = () => {
    const f = useFadeIn();
    return (
      <section
        id="services"
        style={{
          padding: isMobile ? "64px 20px 56px" : "140px 40px 100px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          ref={f.ref}
          style={{
            ...f.style,
            display: isMobile ? "block" : "flex",
            gap: 56,
            alignItems: "flex-start",
          }}
        >
          {/* 左カラム */}
          <div style={{ flex: isMobile ? "unset" : "0 0 340px", marginBottom: isMobile ? 36 : 0 }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.accent,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              ─ Services ─
            </p>
            <h2
              style={{
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                fontSize: isMobile ? 22 : 28,
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.4,
                letterSpacing: "0.04em",
                marginBottom: 18,
              }}
            >
              事業内容
            </h2>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14,
                color: C.textSub,
                lineHeight: 1.95,
                letterSpacing: "0.05em",
              }}
            >
              物流を軸に、<br/>車両リース・レンタカー・ロードサービスまで。<br/>
              配送業に関わるすべてを<br/>ワンストップで支える体制を整えています。
            </p>
          </div>

          {/* 右カード */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
              gap: isMobile ? 16 : 20,
            }}
          >
            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: C.bgSub,
                  padding: isMobile ? "24px 20px" : "30px 28px",
                  borderRadius: i === 0 ? 8 : i === 1 ? 6 : i === 2 ? 10 : 5,
                  border: `1px solid ${C.borderLight}`,
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = C.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.borderLight)
                }
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.accent,
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontFamily: "'Zen Kaku Gothic New', sans-serif",
                    fontSize: isMobile ? 16 : 17,
                    fontWeight: 700,
                    color: C.text,
                    margin: "10px 0 12px",
                    lineHeight: 1.45,
                    letterSpacing: "0.04em",
                  }}
                >
                  ■ {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    color: C.textSub,
                    lineHeight: 1.85,
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.text.split("\n").map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < s.text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ─── Strengths ─── */
  const strengthImages = [
    "/keikamotsu-new-templates/images/strength-01.webp",
    "/keikamotsu-new-templates/images/strength-02.webp",
    "/keikamotsu-new-templates/images/strength-03.webp",
  ];

  const renderStrengths = () => {
    const f = useFadeIn();
    return (
      <section
        id="strengths"
        style={{
          backgroundColor: C.bgBand,
          padding: isMobile ? "60px 20px 52px" : "120px 40px 110px",
        }}
      >
        <div ref={f.ref} style={{ ...f.style, maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Strengths ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 32 : 48,
              lineHeight: 1.4,
            }}
          >
            私たちの強み
          </h2>

          <div
            style={{
              display: isMobile ? "block" : "flex",
              gap: 28,
            }}
          >
            {strengths.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: C.white,
                  borderRadius: i === 0 ? 6 : i === 1 ? 8 : 5,
                  marginBottom: isMobile ? 16 : 0,
                  borderTop: `3px solid ${C.accent}`,
                  overflow: "hidden",
                }}
              >
                {/* 強み画像 */}
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={strengthImages[i] || strengthImages[0]}
                    alt={s.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: isMobile ? "28px 22px" : "28px 32px 36px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: C.accent,
                      lineHeight: 1,
                      display: "block",
                      marginBottom: 14,
                      opacity: 0.6,
                    }}
                  >
                    {s.num}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Zen Kaku Gothic New', sans-serif",
                      fontSize: isMobile ? 17 : 18,
                      fontWeight: 700,
                      color: C.text,
                      lineHeight: 1.5,
                      letterSpacing: "0.04em",
                      marginBottom: 14,
                    }}
                  >
                    ─ {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 13,
                      color: C.textSub,
                      lineHeight: 1.9,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.text.split("\n").map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        {j < s.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ─── CEO Message ─── */
  const renderCeoMessage = () => {
    const f = useFadeIn();
    return (
      <section
        id="message"
        style={{
          padding: isMobile ? "64px 20px 56px" : "116px 40px 104px",
          maxWidth: 840,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div ref={f.ref} style={f.style}>
          {/* 装飾線 */}
          <div
            style={{
              width: 48,
              height: 3,
              backgroundColor: C.accent,
              margin: "0 auto 28px",
            }}
          />
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Message ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 21 : 26,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: 32,
              lineHeight: 1.45,
            }}
          >
            代表メッセージ
          </h2>

          {/* 引用符 */}
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 56,
              color: C.accent,
              opacity: 0.25,
              lineHeight: 1,
              display: "block",
              marginBottom: -10,
            }}
          >
            &ldquo;
          </span>

          {ceoMessage.message.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: isMobile ? 13.5 : 14.5,
                color: C.textSub,
                lineHeight: 2,
                letterSpacing: "0.05em",
                marginBottom: i < ceoMessage.message.length - 1 ? 20 : 36,
                textAlign: "left",
              }}
            >
              {para}
            </p>
          ))}

          {/* CEO写真 + 名前 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                overflow: "hidden",
                border: `2px solid ${C.border}`,
              }}
            >
              <img
                src="/keikamotsu-new-templates/images/ceo-portrait.webp"
                alt={ceoMessage.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Zen Kaku Gothic New', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "0.04em",
                }}
              >
                {ceoMessage.name}
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 12,
                  color: C.textSub,
                  letterSpacing: "0.05em",
                  marginTop: 2,
                }}
              >
                {ceoMessage.title}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /* ─── Company ─── */
  const renderCompany = () => {
    const f = useFadeIn();
    return (
      <section
        id="company"
        style={{
          backgroundColor: C.bgSub,
          padding: isMobile ? "60px 20px 52px" : "90px 40px 80px",
        }}
      >
        <div ref={f.ref} style={{ ...f.style, maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Company ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 28 : 40,
              lineHeight: 1.4,
            }}
          >
            会社概要
          </h2>

          <div>
            {companyOverview.map((item, i) => (
              <div
                key={i}
                style={{
                  display: isMobile ? "block" : "flex",
                  backgroundColor: i % 2 === 0 ? C.white : C.bgSub,
                  padding: isMobile ? "14px 16px" : "16px 24px",
                  borderBottom: `1px solid ${C.borderLight}`,
                }}
              >
                <div
                  style={{
                    flex: isMobile ? "unset" : "0 0 180px",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    letterSpacing: "0.05em",
                    lineHeight: 1.7,
                    marginBottom: isMobile ? 4 : 0,
                  }}
                >
                  ▪ {item.dt}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    color: C.textSub,
                    lineHeight: 1.7,
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.dd}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ─── History ─── */
  const renderHistory = () => {
    const f = useFadeIn();
    return (
      <section
        id="history"
        style={{
          padding: isMobile ? "64px 20px 48px" : "96px 40px 84px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div ref={f.ref} style={f.style}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ History ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 28 : 44,
              lineHeight: 1.4,
            }}
          >
            沿革
          </h2>

          {/* 水平タイムライン */}
          <div
            style={{
              overflowX: "auto",
              paddingBottom: 12,
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 0,
                minWidth: isMobile ? 700 : "auto",
                position: "relative",
              }}
            >
              {/* 水平線 */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: C.border,
                }}
              />

              {history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: isMobile ? 140 : 160,
                    position: "relative",
                    paddingTop: 40,
                    paddingRight: 20,
                  }}
                >
                  {/* ドット */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 0,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: C.accent,
                      border: `3px solid ${C.white}`,
                      boxShadow: `0 0 0 2px ${C.accent}`,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.accent,
                      marginBottom: 8,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h.year}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 13,
                      color: C.textSub,
                      lineHeight: 1.75,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  /* ─── Numbers ─── */
  const renderNumbers = () => {
    const f = useFadeIn();
    return (
      <section
        id="numbers"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "52px 20px 44px" : "100px 40px 90px",
        }}
      >
        {/* 背景画像 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/keikamotsu-new-templates/images/delivery.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(59,89,152,0.85)",
          }}
        />
        <div ref={f.ref} style={{ ...f.style, maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Numbers ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 700,
              color: C.white,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 28 : 44,
              lineHeight: 1.4,
            }}
          >
            数字で見る実績
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1fr 1.1fr 0.9fr 1fr",
              gap: isMobile ? 20 : 32,
            }}
          >
            {numbers.map((n, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: isMobile ? 34 : 46,
                    fontWeight: 700,
                    color: C.white,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {n.value}
                  <span
                    style={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 500,
                      marginLeft: 2,
                    }}
                  >
                    {n.suffix}
                  </span>
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.75)",
                    letterSpacing: "0.08em",
                    marginTop: 8,
                  }}
                >
                  {n.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ─── Partners ─── */
  const renderPartners = () => {
    const f = useFadeIn();
    return (
      <section
        id="partners"
        style={{
          padding: isMobile ? "56px 20px 48px" : "70px 40px 60px",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <div ref={f.ref} style={f.style}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Partners ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 24 : 40,
              lineHeight: 1.4,
            }}
          >
            主要取引先
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1.1fr 0.9fr 1fr" : "1fr 1.05fr 0.95fr 1fr 1.05fr 0.95fr",
              gap: isMobile ? 12 : 20,
              alignItems: "center",
            }}
          >
            {partners.map((p, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: C.bgSub,
                  borderRadius: 6,
                  padding: isMobile ? "18px 12px" : "24px 16px",
                  textAlign: "center",
                  border: `1px solid ${C.borderLight}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    color: C.textSub,
                    letterSpacing: "0.05em",
                    lineHeight: 1.5,
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 10,
                    color: "#94a3b8",
                    marginTop: 4,
                    letterSpacing: "0.05em",
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
  };

  /* ─── News ─── */
  const renderNews = () => {
    const f = useFadeIn();
    return (
      <section
        id="news"
        style={{
          backgroundColor: C.bgSub,
          padding: isMobile ? "60px 20px 52px" : "76px 40px 64px",
        }}
      >
        <div ref={f.ref} style={{ ...f.style, maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ News ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 24 : 40,
              lineHeight: 1.4,
            }}
          >
            お知らせ
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
              gap: isMobile ? 14 : 18,
            }}
          >
            {news.map((n, i) => {
              const tc = tagColor(n.tagStyle);
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: C.white,
                    padding: isMobile ? "20px 18px" : "24px 28px",
                    borderRadius: i === 0 ? 7 : i === 1 ? 5 : i === 2 ? 8 : 6,
                    border: `1px solid ${C.borderLight}`,
                    transition: "border-color 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = C.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = C.borderLight)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        color: "#94a3b8",
                        letterSpacing: "0.04em",
                      }}
                    >
                      ─ {n.date}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        color: tc.color,
                        backgroundColor: tc.bg,
                        padding: "3px 10px",
                        borderRadius: 3,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {n.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: C.text,
                      lineHeight: 1.6,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {n.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  /* ─── Recruit ─── */
  const renderRecruit = () => {
    const f = useFadeIn();
    return (
      <section
        id="recruit"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "56px 20px 48px" : "130px 40px 140px",
        }}
      >
        {/* 背景に人物写真 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/keikamotsu-new-templates/images/team.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(50,55,60,0.88)",
          }}
        />
        <div
          ref={f.ref}
          style={{
            ...f.style,
            maxWidth: 800,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Recruit ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 21 : 26,
              fontWeight: 700,
              color: C.white,
              letterSpacing: "0.04em",
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            {recruit.heading}
          </h2>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.95,
              letterSpacing: "0.05em",
              marginBottom: 32,
            }}
          >
            {recruit.text.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < recruit.text.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <a
            href={recruit.link}
            style={{
              display: "inline-block",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: C.cta,
              backgroundColor: C.white,
              padding: "14px 44px",
              borderRadius: 5,
              textDecoration: "none",
              letterSpacing: "0.05em",
              transition: "opacity 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {recruit.cta}
          </a>
        </div>
      </section>
    );
  };

  /* ─── Access ─── */
  const renderAccess = () => {
    const f = useFadeIn();
    return (
      <section
        id="access"
        style={{
          padding: isMobile ? "64px 20px 48px" : "88px 40px 76px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div ref={f.ref} style={f.style}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Access ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: isMobile ? 24 : 40,
              lineHeight: 1.4,
            }}
          >
            {access.heading}
          </h2>

          <div
            style={{
              display: isMobile ? "block" : "flex",
              gap: 40,
            }}
          >
            {/* 左:情報 */}
            <div
              style={{
                flex: isMobile ? "unset" : "0 0 360px",
                marginBottom: isMobile ? 24 : 0,
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.accent,
                    letterSpacing: "0.05em",
                    marginBottom: 6,
                  }}
                >
                  所在地
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 14,
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
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.accent,
                    letterSpacing: "0.05em",
                    marginBottom: 6,
                  }}
                >
                  最寄り駅
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 14,
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
                  fontSize: 13,
                  color: C.textSub,
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              >
                {access.mapNote}
              </p>
            </div>

            {/* 右:マップ */}
            <div style={{ flex: 1 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.9!2d135.637!3d34.762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5aSn6Ziq5bqc5a-d5bGL5bed5biC5rGg55SwMi0xMS01NQ!5e0!3m2!1sja!2sjp!4v1234567890"
                width="100%"
                height={isMobile ? "280" : "340"}
                style={{ border: 0, borderRadius: 6 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  /* ─── Contact ─── */
  const renderContact = () => {
    const f = useFadeIn();
    return (
      <section
        id="contact"
        style={{
          backgroundColor: C.bgSub,
          padding: isMobile ? "60px 20px 52px" : "134px 40px 144px",
        }}
      >
        <div ref={f.ref} style={{ ...f.style, maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ─ Contact ─
          </p>
          <h2
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "0.04em",
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            {contact.heading}
          </h2>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 13,
              color: C.textSub,
              lineHeight: 1.9,
              letterSpacing: "0.05em",
              marginBottom: 32,
            }}
          >
            {contact.intro.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < contact.intro.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* フォームカード */}
          <div
            style={{
              backgroundColor: C.white,
              padding: isMobile ? "28px 22px 32px" : "40px 44px 48px",
              borderRadius: 8,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              {contact.fields.map((field, i) => (
                <div key={i} style={{ marginBottom: 22 }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                      letterSpacing: "0.05em",
                      marginBottom: 7,
                    }}
                  >
                    {field.label}
                    {field.required && (
                      <span
                        style={{
                          color: "#777",
                          fontSize: 12,
                          marginLeft: 6,
                          fontWeight: 600,
                        }}
                      >
                        ＊
                      </span>
                    )}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      rows={5}
                      style={{
                        width: "100%",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 14,
                        color: C.text,
                        padding: "12px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        outline: "none",
                        resize: "vertical",
                        lineHeight: 1.7,
                        boxSizing: "border-box",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      style={{
                        width: "100%",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 14,
                        color: C.text,
                        padding: "11px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s ease",
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
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.white,
                  backgroundColor: C.cta,
                  padding: "14px 0",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  marginTop: 8,
                  transition: "opacity 0.15s ease, background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                送信する
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };

  /* ─── Footer ─── */
  const renderFooter = () => (
    <footer
      style={{
        backgroundColor: C.text,
        padding: isMobile ? "44px 20px 28px" : "64px 40px 36px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: isMobile ? "block" : "flex",
          gap: 48,
        }}
      >
        {/* 左:ロゴ + 住所 */}
        <div style={{ flex: isMobile ? "unset" : "0 0 300px", marginBottom: isMobile ? 32 : 0 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: C.white,
              letterSpacing: "0.02em",
              marginBottom: 14,
            }}
          >
            GREEN
            <span style={{ color: C.accent, marginLeft: 4 }}>LOGISTICS</span>
          </p>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.8,
              letterSpacing: "0.05em",
            }}
          >
            〒{company.postalCode}
            <br />
            {company.address}
          </p>
        </div>

        {/* 中:ナビ */}
        <div style={{ flex: 1, marginBottom: isMobile ? 28 : 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1.05fr 0.95fr" : "1.1fr 0.9fr 1fr",
              gap: isMobile ? "8px 16px" : "8px 24px",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  padding: "5px 0",
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* 右:電話 + メール */}
        <div style={{ flex: isMobile ? "unset" : "0 0 220px" }}>
          <div style={{ marginBottom: 14 }}>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              電話番号
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: C.white,
                letterSpacing: "0.04em",
              }}
            >
              {company.phone}
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              メール
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.02em",
              }}
            >
              {company.email}
            </p>
          </div>
        </div>
      </div>

      {/* コピーライト */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: isMobile ? 28 : 44,
          paddingTop: 20,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.04em",
          }}
        >
          &copy; {new Date().getFullYear()} {company.nameEn} All rights reserved.
        </p>
      </div>
    </footer>
  );

  /* ═══════════════ レンダー ═══════════════ */
  return (
    <>
      {renderHeader()}
      <main>
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
      </main>
      {renderFooter()}
    </>
  );
}
