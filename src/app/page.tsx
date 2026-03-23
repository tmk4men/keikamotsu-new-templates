"use client";

const templates = [
  {
    category: "コーポレートHP",
    items: [
      { id: "cp-01", name: "NOIR", desc: "ダーク×ゴールド。高級感と信頼性を両立", tone: "タブ切替型" },
      { id: "cp-02", name: "DECK", desc: "横スクロールプレゼンデッキ。ブルーアクセントのスライド型", tone: "横スクロール" },
      { id: "cp-03", name: "MONO", desc: "グレースケール。洗練されたエディトリアルスタイル", tone: "サイドバー型" },
      { id: "cp-04", name: "EDGE", desc: "スプリットレイアウト。斜めカットのモダンデザイン", tone: "斜めカット" },
      { id: "cp-05", name: "CLEAN", desc: "ホワイト×ミントグリーン。余白で魅せるミニマルデザイン", tone: "サイドバー型" },
    ],
  },
  {
    category: "採用特化HP",
    items: [
      { id: "r-01", name: "BOLD", desc: "ブルー×大型写真。力強さとインパクトで惹きつける", tone: "左パネル固定" },
      { id: "r-02", name: "FLOAT", desc: "フローティングナビ×フルスクリーン。インディゴの没入型", tone: "フローティング" },
      { id: "r-03", name: "TRUST", desc: "モノトーン×人物写真。誠実さと安心感を伝える", tone: "ミニマル" },
      { id: "r-04", name: "FLOW", desc: "横スクロール×マガジン風。読み物として惹き込む", tone: "マガジン風" },
      { id: "r-05", name: "FRESH", desc: "ホワイト×コーラル。明るく親しみやすい採用HP", tone: "スナップスクロール" },
    ],
  },
];

/* --- OGP-style preview thumbnails (inline SVG wireframes) --- */
const previews: Record<string, React.ReactNode> = {
  /* CP-01: Tab navigation, gold accent, white bg */
  "cp-01": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#faf9f6" />
      {/* hero image area */}
      <rect x="0" y="0" width="320" height="90" rx="4" fill="#1e3a5f" />
      <rect x="0" y="0" width="320" height="90" rx="4" fill="url(#cp01grad)" opacity="0.5" />
      {/* tab bar */}
      <rect x="0" y="90" width="320" height="20" fill="#ffffff" />
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={10 + i * 50} y={94} width="40" height="12" rx="2" fill={i === 0 ? "#b8942e" : "#e5e0d4"} />
      ))}
      {/* hero text */}
      <rect x="24" y="30" width="140" height="8" rx="2" fill="#b8942e" />
      <rect x="24" y="46" width="200" height="6" rx="2" fill="#ffffff" opacity="0.8" />
      <rect x="24" y="58" width="160" height="6" rx="2" fill="#ffffff" opacity="0.5" />
      {/* content area */}
      <rect x="20" y="120" width="80" height="44" rx="3" fill="#f5f0e0" />
      <rect x="110" y="120" width="80" height="44" rx="3" fill="#f5f0e0" />
      <rect x="200" y="120" width="80" height="44" rx="3" fill="#f5f0e0" />
      {/* gold line */}
      <rect x="24" y="130" width="30" height="3" rx="1" fill="#b8942e" />
      <rect x="114" y="130" width="30" height="3" rx="1" fill="#b8942e" />
      <rect x="204" y="130" width="30" height="3" rx="1" fill="#b8942e" />
      <defs>
        <linearGradient id="cp01grad" x1="0" y1="0" x2="320" y2="90">
          <stop stopColor="#b8942e" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1e3a5f" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),

  /* CP-02: Horizontal scroll deck, blue accent */
  "cp-02": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#f0f4f8" />
      {/* slide panels */}
      <rect x="10" y="20" width="140" height="140" rx="6" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="160" y="20" width="140" height="140" rx="6" fill="#ffffff" stroke="#dbeafe" strokeWidth="1" />
      <rect x="310" y="20" width="40" height="140" rx="6" fill="#ffffff" stroke="#dbeafe" strokeWidth="1" opacity="0.4" />
      {/* slide 1 content */}
      <rect x="20" y="34" width="60" height="6" rx="2" fill="#3b82f6" />
      <rect x="20" y="48" width="110" height="4" rx="1" fill="#1e293b" opacity="0.6" />
      <rect x="20" y="58" width="90" height="4" rx="1" fill="#1e293b" opacity="0.4" />
      <rect x="20" y="74" width="120" height="50" rx="3" fill="#eff6ff" />
      <rect x="30" y="84" width="40" height="4" rx="1" fill="#3b82f6" opacity="0.5" />
      <rect x="30" y="94" width="80" height="3" rx="1" fill="#94a3b8" />
      <rect x="30" y="102" width="60" height="3" rx="1" fill="#94a3b8" />
      {/* slide 2 content (partially visible) */}
      <rect x="170" y="34" width="60" height="6" rx="2" fill="#93c5fd" />
      <rect x="170" y="48" width="110" height="4" rx="1" fill="#1e293b" opacity="0.3" />
      <rect x="170" y="74" width="120" height="50" rx="3" fill="#eff6ff" opacity="0.5" />
      {/* scroll arrows */}
      <polygon points="155,90 150,85 150,95" fill="#3b82f6" opacity="0.6" />
      <polygon points="305,90 310,85 310,95" fill="#3b82f6" opacity="0.4" />
      {/* dots indicator */}
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={140 + i * 10} cy={170} r={i === 0 ? 3 : 2} fill={i === 0 ? "#3b82f6" : "#cbd5e1"} />
      ))}
    </svg>
  ),

  /* CP-03: Sidebar with icons, monochrome/cyan */
  "cp-03": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#ffffff" />
      {/* sidebar */}
      <rect x="0" y="0" width="50" height="180" fill="#fafafa" />
      <rect x="0" y="0" width="50" height="180" stroke="#e5e5e5" strokeWidth="0.5" fill="none" />
      {/* sidebar icons */}
      {[0,1,2,3,4,5,6].map(i => (
        <g key={i}>
          <circle cx="25" cy={24 + i * 22} r="6" stroke={i === 0 ? "#00e5ff" : "#ccc"} strokeWidth="1.2" fill="none" />
          {i === 0 && <circle cx="25" cy={24} r="2" fill="#00e5ff" />}
        </g>
      ))}
      {/* hero area */}
      <rect x="50" y="0" width="270" height="80" fill="#f5f5f5" />
      <rect x="70" y="24" width="120" height="7" rx="2" fill="#333" />
      <rect x="70" y="38" width="180" height="4" rx="1" fill="#999" />
      <rect x="70" y="48" width="150" height="4" rx="1" fill="#999" opacity="0.6" />
      {/* content blocks */}
      <rect x="60" y="90" width="115" height="70" rx="3" fill="#f8f8f8" />
      <rect x="185" y="90" width="115" height="70" rx="3" fill="#f8f8f8" />
      <rect x="70" y="100" width="40" height="4" rx="1" fill="#333" />
      <rect x="70" y="110" width="90" height="3" rx="1" fill="#bbb" />
      <rect x="195" y="100" width="40" height="4" rx="1" fill="#333" />
      <rect x="195" y="110" width="90" height="3" rx="1" fill="#bbb" />
      {/* cyan accent line */}
      <rect x="50" y="80" width="270" height="2" fill="#00e5ff" opacity="0.4" />
    </svg>
  ),

  /* CP-04: Dark bg, cyan accent, diagonal cuts */
  "cp-04": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#0d1117" />
      {/* diagonal divider */}
      <polygon points="0,70 320,50 320,90 0,110" fill="#161b22" />
      <line x1="0" y1="70" x2="320" y2="50" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
      <line x1="0" y1="110" x2="320" y2="90" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
      {/* hero text */}
      <rect x="24" y="20" width="140" height="8" rx="2" fill="#00e5ff" />
      <rect x="24" y="34" width="200" height="5" rx="1" fill="#8b949e" />
      {/* nav bar */}
      <rect x="180" y="10" width="30" height="4" rx="1" fill="#8b949e" opacity="0.5" />
      <rect x="220" y="10" width="30" height="4" rx="1" fill="#8b949e" opacity="0.5" />
      <rect x="260" y="10" width="30" height="4" rx="1" fill="#8b949e" opacity="0.5" />
      {/* content cards below diagonal */}
      <rect x="20" y="120" width="85" height="44" rx="3" fill="#161b22" stroke="#00e5ff" strokeWidth="0.5" opacity="0.8" />
      <rect x="115" y="120" width="85" height="44" rx="3" fill="#161b22" stroke="#00e5ff" strokeWidth="0.5" opacity="0.8" />
      <rect x="210" y="120" width="85" height="44" rx="3" fill="#161b22" stroke="#00e5ff" strokeWidth="0.5" opacity="0.8" />
      {/* card accents */}
      <rect x="28" y="130" width="25" height="3" rx="1" fill="#00e5ff" />
      <rect x="123" y="130" width="25" height="3" rx="1" fill="#00e5ff" />
      <rect x="218" y="130" width="25" height="3" rx="1" fill="#00e5ff" />
      <rect x="28" y="138" width="60" height="2" rx="1" fill="#8b949e" opacity="0.4" />
      <rect x="123" y="138" width="60" height="2" rx="1" fill="#8b949e" opacity="0.4" />
      <rect x="218" y="138" width="60" height="2" rx="1" fill="#8b949e" opacity="0.4" />
    </svg>
  ),

  /* CP-05: Teal sidebar, white, minimal */
  "cp-05": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#ffffff" />
      {/* left sidebar */}
      <rect x="0" y="0" width="55" height="180" fill="#f7f7f5" />
      <rect x="0" y="0" width="3" height="180" fill="#2d8a6e" />
      {/* sidebar icons */}
      {[0,1,2,3,4,5,6].map(i => (
        <g key={i}>
          <rect x="14" y={18 + i * 22} width="28" height="12" rx="3" fill={i === 0 ? "#e8f5f0" : "transparent"} />
          <circle cx="22" cy={24 + i * 22} r="3" stroke={i === 0 ? "#2d8a6e" : "#bbb"} strokeWidth="1" fill="none" />
        </g>
      ))}
      {/* hero */}
      <rect x="55" y="0" width="265" height="80" fill="#f7f7f5" />
      <rect x="75" y="24" width="100" height="7" rx="2" fill="#1a1a1a" />
      <rect x="75" y="38" width="180" height="4" rx="1" fill="#888" />
      <rect x="75" y="48" width="70" height="16" rx="3" fill="#2d8a6e" />
      <rect x="82" y="53" width="56" height="6" rx="1" fill="#ffffff" />
      {/* content grid */}
      <rect x="65" y="92" width="75" height="72" rx="4" fill="#f7f7f5" />
      <rect x="150" y="92" width="75" height="72" rx="4" fill="#f7f7f5" />
      <rect x="235" y="92" width="75" height="72" rx="4" fill="#f7f7f5" />
      {/* teal accents */}
      <rect x="65" y="92" width="75" height="3" rx="1" fill="#2d8a6e" opacity="0.3" />
      <rect x="150" y="92" width="75" height="3" rx="1" fill="#2d8a6e" opacity="0.3" />
      <rect x="235" y="92" width="75" height="3" rx="1" fill="#2d8a6e" opacity="0.3" />
      <rect x="73" y="106" width="35" height="4" rx="1" fill="#1a1a1a" />
      <rect x="73" y="116" width="55" height="3" rx="1" fill="#bbb" />
      <rect x="158" y="106" width="35" height="4" rx="1" fill="#1a1a1a" />
      <rect x="158" y="116" width="55" height="3" rx="1" fill="#bbb" />
      <rect x="243" y="106" width="35" height="4" rx="1" fill="#1a1a1a" />
      <rect x="243" y="116" width="55" height="3" rx="1" fill="#bbb" />
    </svg>
  ),

  /* R-01: Left fixed panel, blue accent */
  "r-01": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#f8f9fb" />
      {/* left fixed panel */}
      <rect x="0" y="0" width="80" height="180" rx="4" fill="#ffffff" />
      <rect x="79" y="0" width="1" height="180" fill="#eef2ff" />
      {/* profile area */}
      <circle cx="40" cy="36" r="16" fill="#eef2ff" />
      <circle cx="40" cy="32" r="5" fill="#2563eb" opacity="0.3" />
      <rect x="35" y="40" width="10" height="6" rx="2" fill="#2563eb" opacity="0.2" />
      <rect x="18" y="60" width="44" height="4" rx="1" fill="#1a2b3c" />
      <rect x="24" y="70" width="32" height="3" rx="1" fill="#94a3b8" />
      {/* nav items */}
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="10" y={86 + i * 18} width="60" height="12" rx="2" fill={i === 0 ? "#eef2ff" : "transparent"} />
          <circle cx="20" cy={92 + i * 18} r="3" stroke={i === 0 ? "#2563eb" : "#cbd5e1"} strokeWidth="1" fill="none" />
          <rect x="28" y={90 + i * 18} width="32" height="3" rx="1" fill={i === 0 ? "#2563eb" : "#94a3b8"} />
        </g>
      ))}
      {/* right content */}
      <rect x="95" y="15" width="210" height="70" rx="5" fill="#eef2ff" />
      <rect x="110" y="30" width="120" height="7" rx="2" fill="#1a2b3c" />
      <rect x="110" y="44" width="170" height="4" rx="1" fill="#64748b" />
      <rect x="110" y="54" width="80" height="16" rx="3" fill="#2563eb" />
      <rect x="117" y="59" width="66" height="6" rx="1" fill="#ffffff" />
      {/* right cards */}
      <rect x="95" y="100" width="100" height="65" rx="4" fill="#ffffff" />
      <rect x="205" y="100" width="100" height="65" rx="4" fill="#ffffff" />
      <rect x="103" y="110" width="40" height="4" rx="1" fill="#1a2b3c" />
      <rect x="103" y="120" width="75" height="3" rx="1" fill="#94a3b8" />
      <rect x="213" y="110" width="40" height="4" rx="1" fill="#1a2b3c" />
      <rect x="213" y="120" width="75" height="3" rx="1" fill="#94a3b8" />
    </svg>
  ),

  /* R-02: Floating nav, indigo, immersive */
  "r-02": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#fafaf8" />
      {/* full screen hero */}
      <rect x="0" y="0" width="320" height="100" rx="4" fill="#1e1b4b" />
      <rect x="0" y="0" width="320" height="100" rx="4" fill="url(#r02grad)" />
      {/* hero text */}
      <rect x="30" y="30" width="160" height="9" rx="2" fill="#ffffff" />
      <rect x="30" y="48" width="220" height="4" rx="1" fill="#c7d2fe" opacity="0.7" />
      <rect x="30" y="58" width="180" height="4" rx="1" fill="#c7d2fe" opacity="0.5" />
      <rect x="30" y="72" width="70" height="16" rx="8" fill="#6366f1" />
      <rect x="42" y="77" width="46" height="6" rx="1" fill="#ffffff" />
      {/* floating nav dots (right side) */}
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx="300" cy={30 + i * 16} r={i === 0 ? 5 : 3} fill={i === 0 ? "#6366f1" : "#a5b4fc"} opacity={i === 0 ? 1 : 0.5} />
      ))}
      {/* content area */}
      <rect x="20" y="110" width="130" height="55" rx="4" fill="#ffffff" />
      <rect x="160" y="110" width="140" height="55" rx="4" fill="#ffffff" />
      <rect x="30" y="120" width="50" height="4" rx="1" fill="#1e1b4b" />
      <rect x="30" y="130" width="100" height="3" rx="1" fill="#71717a" />
      <rect x="30" y="138" width="80" height="3" rx="1" fill="#71717a" opacity="0.5" />
      <rect x="170" y="120" width="50" height="4" rx="1" fill="#1e1b4b" />
      <rect x="170" y="130" width="110" height="3" rx="1" fill="#71717a" />
      {/* marquee strip */}
      <rect x="0" y="100" width="320" height="6" fill="#6366f1" opacity="0.1" />
      <defs>
        <linearGradient id="r02grad" x1="0" y1="0" x2="320" y2="100">
          <stop stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="1" stopColor="#1e1b4b" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),

  /* R-03: Monochrome, minimal, warm grain */
  "r-03": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#faf9f7" />
      {/* top nav */}
      <rect x="0" y="0" width="320" height="28" fill="#faf9f7" />
      <rect x="20" y="10" width="50" height="5" rx="1" fill="#333" />
      <rect x="200" y="10" width="25" height="4" rx="1" fill="#999" />
      <rect x="235" y="10" width="25" height="4" rx="1" fill="#999" />
      <rect x="270" y="10" width="25" height="4" rx="1" fill="#999" />
      <line x1="0" y1="28" x2="320" y2="28" stroke="#e8e4df" strokeWidth="0.5" />
      {/* hero with warm minimal feel */}
      <rect x="0" y="28" width="160" height="90" fill="#f0ece6" />
      <rect x="160" y="28" width="160" height="90" fill="#e8e4df" />
      <rect x="20" y="50" width="120" height="8" rx="2" fill="#222" />
      <rect x="20" y="66" width="100" height="4" rx="1" fill="#666" />
      <rect x="20" y="76" width="80" height="4" rx="1" fill="#666" opacity="0.5" />
      {/* person silhouette placeholder */}
      <circle cx="240" cy="62" r="18" fill="#d5d0c8" />
      <rect x="224" y="80" width="32" height="20" rx="4" fill="#d5d0c8" />
      {/* content */}
      <rect x="20" y="130" width="280" height="3" rx="1" fill="#e8e4df" />
      <rect x="20" y="140" width="80" height="5" rx="1" fill="#333" />
      <rect x="20" y="152" width="260" height="3" rx="1" fill="#999" />
      <rect x="20" y="162" width="200" height="3" rx="1" fill="#999" opacity="0.5" />
    </svg>
  ),

  /* R-04: Magazine style, editorial typography */
  "r-04": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#fafaf9" />
      {/* top nav */}
      <rect x="0" y="0" width="320" height="24" fill="#1a1a1a" />
      <rect x="20" y="8" width="40" height="5" rx="1" fill="#ffffff" />
      <rect x="230" y="8" width="20" height="4" rx="1" fill="#888" />
      <rect x="260" y="8" width="20" height="4" rx="1" fill="#888" />
      <rect x="290" y="8" width="20" height="4" rx="1" fill="#888" />
      {/* magazine hero - large image + text overlay */}
      <rect x="0" y="24" width="320" height="90" fill="#f4f3f0" />
      <rect x="0" y="24" width="180" height="90" fill="#e8e5de" />
      {/* editorial text */}
      <rect x="195" y="40" width="110" height="10" rx="2" fill="#1a1a1a" />
      <text x="195" y="49" fontSize="9" fill="#1a1a1a" fontFamily="serif" fontStyle="italic" opacity="0.15">Magazine</text>
      <rect x="195" y="58" width="100" height="3" rx="1" fill="#888" />
      <rect x="195" y="66" width="80" height="3" rx="1" fill="#888" opacity="0.6" />
      <rect x="195" y="80" width="60" height="14" rx="2" fill="#32373c" />
      <rect x="203" y="84" width="44" height="6" rx="1" fill="#ffffff" />
      {/* multi-column content below */}
      <rect x="15" y="124" width="88" height="44" rx="3" fill="#ffffff" />
      <rect x="113" y="124" width="88" height="44" rx="3" fill="#ffffff" />
      <rect x="211" y="124" width="88" height="44" rx="3" fill="#ffffff" />
      {/* column content */}
      <rect x="23" y="132" width="30" height="4" rx="1" fill="#2d2d2d" />
      <rect x="23" y="140" width="70" height="2" rx="1" fill="#bbb" />
      <rect x="23" y="146" width="60" height="2" rx="1" fill="#bbb" />
      <rect x="121" y="132" width="30" height="4" rx="1" fill="#2d2d2d" />
      <rect x="121" y="140" width="70" height="2" rx="1" fill="#bbb" />
      <rect x="219" y="132" width="30" height="4" rx="1" fill="#2d2d2d" />
      <rect x="219" y="140" width="70" height="2" rx="1" fill="#bbb" />
    </svg>
  ),

  /* R-05: Snap scroll, coral accent, friendly */
  "r-05": (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <rect width="320" height="180" rx="4" fill="#ffffff" />
      {/* snap section 1 (hero) */}
      <rect x="0" y="0" width="320" height="88" fill="#fff5f0" />
      <rect x="30" y="20" width="140" height="9" rx="2" fill="#1a1a1a" />
      <rect x="30" y="36" width="200" height="4" rx="1" fill="#888" />
      <rect x="30" y="46" width="160" height="4" rx="1" fill="#888" opacity="0.5" />
      <rect x="30" y="60" width="80" height="18" rx="9" fill="#e8734a" />
      <rect x="42" y="66" width="56" height="6" rx="1" fill="#ffffff" />
      {/* coral marquee strip */}
      <rect x="0" y="88" width="320" height="8" fill="#e8734a" opacity="0.1" />
      <rect x="10" y="89" width="30" height="4" rx="1" fill="#e8734a" opacity="0.3" />
      <rect x="50" y="89" width="30" height="4" rx="1" fill="#e8734a" opacity="0.2" />
      <rect x="90" y="89" width="30" height="4" rx="1" fill="#e8734a" opacity="0.3" />
      <rect x="130" y="89" width="30" height="4" rx="1" fill="#e8734a" opacity="0.2" />
      <rect x="170" y="89" width="30" height="4" rx="1" fill="#e8734a" opacity="0.3" />
      {/* snap section 2 */}
      <rect x="0" y="96" width="320" height="84" fill="#fafafa" />
      <rect x="30" y="108" width="80" height="6" rx="2" fill="#1a1a1a" />
      <rect x="30" y="120" width="120" height="48" rx="4" fill="#ffffff" />
      <rect x="160" y="120" width="120" height="48" rx="4" fill="#ffffff" />
      <rect x="38" y="128" width="40" height="4" rx="1" fill="#e8734a" />
      <rect x="38" y="138" width="90" height="3" rx="1" fill="#aaa" />
      <rect x="168" y="128" width="40" height="4" rx="1" fill="#e8734a" />
      <rect x="168" y="138" width="90" height="3" rx="1" fill="#aaa" />
      {/* right dot nav */}
      {[0,1,2,3].map(i => (
        <circle key={i} cx="308" cy={44 + i * 14} r={i === 0 ? 4 : 2.5} fill={i === 0 ? "#e8734a" : "#ddd"} />
      ))}
    </svg>
  ),
};

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e5e5e5",
      fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
    }}>
      <header style={{
        padding: "3rem 2rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#666", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Keikamotsu Templates
        </p>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          軽貨物HP テンプレート集
        </h1>
        <p style={{ marginTop: "0.75rem", color: "#888", fontSize: "0.9375rem", lineHeight: 1.7 }}>
          コーポレートHP 5種 + 採用特化HP 5種。<br />
          それぞれ異なるレイアウト・トンマナで設計。
        </p>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        {templates.map((group) => (
          <section key={group.category} style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "#555",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid #222",
            }}>
              {group.category}
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}>
              {group.items.map((t) => (
                <a
                  key={t.id}
                  href={`/keikamotsu-new-templates/${t.id}`}
                  style={{
                    display: "block",
                    background: "#141414",
                    border: "1px solid #222",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    transition: "border-color 0.2s, background 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#444";
                    e.currentTarget.style.background = "#1a1a1a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#222";
                    e.currentTarget.style.background = "#141414";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* OGP-style preview thumbnail */}
                  <div style={{
                    borderBottom: "1px solid #222",
                    lineHeight: 0,
                  }}>
                    {previews[t.id]}
                  </div>
                  {/* Card info */}
                  <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>
                        {t.id}
                      </span>
                      <span style={{
                        fontSize: "0.6875rem",
                        padding: "0.2rem 0.5rem",
                        background: "#1f1f1f",
                        borderRadius: "0.25rem",
                        color: "#888",
                      }}>
                        {t.tone}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "0.375rem" }}>
                      {t.name}
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "#888", lineHeight: 1.6 }}>
                      {t.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
