"use client";

const templates = [
  {
    category: "コーポレートHP",
    items: [
      { id: "cp-01", name: "NOIR", desc: "ダーク×ゴールド。高級感と信頼性を両立", tone: "ダーク系" },
      { id: "cp-02", name: "DECK", desc: "横スクロールプレゼンデッキ。ブルーアクセントのスライド型", tone: "横スクロール系" },
      { id: "cp-03", name: "MONO", desc: "グレースケール。洗練されたエディトリアルスタイル", tone: "モノトーン系" },
      { id: "cp-04", name: "EDGE", desc: "スプリットレイアウト。斜めカットのモダンデザイン", tone: "モダン系" },
      { id: "cp-05", name: "CLEAN", desc: "ホワイト×ミントグリーン。余白で魅せるミニマルデザイン", tone: "クリーン系" },
    ],
  },
  {
    category: "採用特化HP",
    items: [
      { id: "r-01", name: "BOLD", desc: "黒背景×大型写真。力強さとインパクトで惹きつける", tone: "ダーク系" },
      { id: "r-02", name: "FLOAT", desc: "フローティングナビ×フルスクリーン。インディゴの没入型", tone: "フローティング系" },
      { id: "r-03", name: "TRUST", desc: "モノトーン×人物写真。誠実さと安心感を伝える", tone: "モノトーン系" },
      { id: "r-04", name: "FLOW", desc: "横スクロール×マガジン風。読み物として惹き込む", tone: "マガジン系" },
      { id: "r-05", name: "FRESH", desc: "ホワイト×コーラル。明るく親しみやすい採用HP", tone: "クリーン系" },
    ],
  },
];

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
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}>
              {group.items.map((t) => (
                <a
                  key={t.id}
                  href={`/keikamotsu-new-templates/${t.id}`}
                  style={{
                    display: "block",
                    padding: "1.5rem",
                    background: "#141414",
                    border: "1px solid #222",
                    borderRadius: "0.5rem",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#444";
                    e.currentTarget.style.background = "#1a1a1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#222";
                    e.currentTarget.style.background = "#141414";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
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
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
                    {t.name}
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "#888", lineHeight: 1.6 }}>
                    {t.desc}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
