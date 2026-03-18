/* ===================================================
   コーポレートサイト用 共有コンテンツデータ
   コーポレートHP 5テンプレートがこのファイルからデータを取得する
   参考: kg-54.com（株式会社KG）
   =================================================== */

export const company = {
  name: "グリーンロジスティクス株式会社",
  nameEn: "Green Logistics Co., Ltd.",
  established: "2021年5月",
  capital: "1,000万円",
  ceo: "三木 裕也",
  ceoTitle: "代表取締役",
  employees: "150名（業務委託ドライバー含む）",
  address: "大阪府寝屋川市池田2-11-55",
  postalCode: "572-0039",
  phone: "050-0132-1348",
  fax: "050-0132-1349",
  email: "info@green-logistics.co.jp",
  hours: "平日 9:00〜17:00",
  url: "https://green-logistics.co.jp",
};

export const meta = {
  title: "グリーンロジスティクス株式会社｜物流で未来を変えていく。",
  description:
    "大阪を拠点に軽貨物運送・車両リース・レンタカー・レッカーサービスを展開。大手運輸会社の委託配送と通販サイト荷物配送を中心に、高い技術力と経験で安全迅速な配送を実現します。",
  keywords: [
    "軽貨物運送",
    "物流",
    "大阪",
    "配送サービス",
    "車両リース",
    "レンタカー",
    "レッカーサービス",
    "グリーンロジスティクス",
  ],
};

export const sectionIcons: Record<string, string> = {
  services: "◈",
  strengths: "◆",
  message: "✦",
  company: "■",
  history: "◷",
  numbers: "▲",
  partners: "⬡",
  news: "◉",
  recruit: "★",
  access: "◎",
  contact: "✉",
};

export const navLinks = [
  { href: "#services", label: "事業内容" },
  { href: "#strengths", label: "私たちの強み" },
  { href: "#message", label: "代表メッセージ" },
  { href: "#company", label: "会社概要" },
  { href: "#history", label: "沿革" },
  { href: "#numbers", label: "実績" },
  { href: "#partners", label: "主要取引先" },
  { href: "#news", label: "お知らせ" },
  { href: "#recruit", label: "採用情報" },
  { href: "#access", label: "アクセス" },
  { href: "#contact", label: "お問い合わせ" },
];

export const hero = {
  headline: "物流で未来を変えていく。",
  subtext: [
    "大手運輸会社の委託配送と通販サイト荷物配送を軽自動車でメイン展開。",
    "高い技術力と経験で、安全かつ迅速な配送を実現します。",
    "お客様の荷物を、確実に、丁寧に、お届けします。",
  ],
  cta: "お問い合わせはこちら",
};

export const services = [
  {
    num: "01",
    title: "軽貨物運送",
    text: "大手運輸会社の委託配送業務、大手インターネット通販サイトの荷物配送を軽自動車でメイン展開。\nラストワンマイルを担い、エンドユーザーへ確実にお届けします。\n置き配にも対応し、スピーディーかつ丁寧な配送を実現します。",
    icon: "",
  },
  {
    num: "02",
    title: "事業用車両リース・代車",
    text: "配送業務に必要な車両のリースや代車サービスを提供。\n無駄なコストをカットした当社ならではの価格帯で、事業開始のハードルを下げます。\nメンテナンスサポートも充実しています。",
    icon: "",
  },
  {
    num: "03",
    title: "レンタカー事業",
    text: "法人・個人問わず、軽貨物車両を中心としたレンタカーサービスを展開。\n短期利用から長期利用まで柔軟にご対応。\n急な車両不足にも即座にお応えします。",
    icon: "",
  },
  {
    num: "04",
    title: "レッカー・ロードサービス",
    text: "配送中のトラブルにも安心。\n自社でレッカー・ロードサービスを完備。\n事故や故障時の迅速な対応で、配送業務の中断を最小限に抑えます。\n24時間対応可能です。",
    icon: "",
  },
];

export const strengths = [
  {
    num: "01",
    title: "自社直接契約ドライバー約9割",
    text: "当社のドライバーの約9割が直接契約。\n中間マージンを排除し、ドライバーへの適正な報酬と、お客様への安定した品質を両立。\n責任ある配送体制で、確実・安心なサービスを提供します。",
  },
  {
    num: "02",
    title: "スピーディーな対応力",
    text: "急なご依頼にも社内連携で効率的に対応。\n「今日中に届けたい」「明日から増便したい」\n——そんなお声にもすぐにお応えできる機動力が、当社の強みです。",
  },
  {
    num: "03",
    title: "20〜60代の幅広い人材が活躍",
    text: "若手からベテランまで、幅広い年齢層のドライバーがチームワークを発揮。\n多様な人材が在籍しているからこそ、さまざまなニーズに柔軟に対応できます。",
  },
];

export const ceoMessage = {
  name: "三木 裕也",
  title: "代表取締役",
  message: [
    "お客様の荷物を迅速に、安全にお届けすること。それが私たちの使命です。",
    "小さな荷物一つひとつにも、送り主の想いと届け先の期待が込められています。だからこそ、丁寧に、確実に、届ける。その当たり前を徹底することが、物流の原点だと考えています。",
    "当社は大手運輸会社の委託配送と通販サイト荷物配送を中心に事業を展開してまいりました。近年は車両リース・レンタカー・ロードサービスにも事業を拡大し、配送業を「始めたい人」から「続けたい人」まで、トータルでサポートできる体制を整えています。",
    "物流で未来を変えていく——その想いを胸に、これからもお客様のニーズに合わせた最適な解決策を提供し続けてまいります。",
  ],
};

export const companyOverview = [
  { dt: "社名", dd: "グリーンロジスティクス株式会社" },
  { dt: "英文社名", dd: "Green Logistics Co., Ltd." },
  { dt: "設立", dd: "2021年5月" },
  { dt: "資本金", dd: "1,000万円" },
  { dt: "代表者", dd: "代表取締役 三木 裕也" },
  { dt: "従業員数", dd: "150名（業務委託ドライバー含む）" },
  { dt: "事業内容", dd: "軽貨物運送事業、事業用車両リース・代車、レンタカー事業、レッカー・ロードサービス" },
  { dt: "所在地", dd: "大阪府寝屋川市池田2-11-55" },
  { dt: "電話番号", dd: "050-0132-1348" },
  { dt: "対応エリア", dd: "大阪・東京・兵庫・鳥取・島根・沖縄（他エリアも相談可）" },
  { dt: "許認可", dd: "貨物軽自動車運送事業届出済" },
];

export const history = [
  { year: "2021", event: "大阪府寝屋川市にて設立。大手運輸会社の委託配送業務を開始" },
  { year: "2022", event: "大手通販サイトの配送業務を受託。ドライバー50名体制に拡大" },
  { year: "2023", event: "事業用車両リース・代車サービスを開始。兵庫エリアに進出" },
  { year: "2024", event: "レンタカー事業・レッカーサービスを開始。東京・鳥取・島根へエリア拡大" },
  { year: "2025", event: "沖縄エリア進出。ドライバー150名体制。年間配送件数80万件を突破" },
];

export const numbers = [
  { value: "800,000", suffix: "件+", label: "年間配送件数" },
  { value: "150", suffix: "名+", label: "ドライバー数" },
  { value: "99.5", suffix: "%", label: "配送完了率" },
  { value: "6", suffix: "エリア", label: "全国対応拠点" },
];

export const partners = [
  { name: "大手運輸会社A社", industry: "物流", logo: "/keikamotsu-new-templates/images/partner-a.png" },
  { name: "大手EC通販プラットフォームB社", industry: "EC・通販", logo: "/keikamotsu-new-templates/images/partner-b.png" },
  { name: "大手ネット通販C社", industry: "EC・通販", logo: "/keikamotsu-new-templates/images/partner-c.png" },
  { name: "食品メーカーD社", industry: "食品", logo: "/keikamotsu-new-templates/images/partner-d.png" },
  { name: "医療機器メーカーE社", industry: "医療", logo: "/keikamotsu-new-templates/images/partner-e.png" },
  { name: "アパレルブランドF社", industry: "アパレル", logo: "/keikamotsu-new-templates/images/partner-f.png" },
];

export const news = [
  {
    date: "2025.03.01",
    tag: "プレスリリース",
    tagStyle: "press" as const,
    title: "沖縄エリアでの配送業務を開始しました",
  },
  {
    date: "2025.02.15",
    tag: "お知らせ",
    tagStyle: "default" as const,
    title: "年間配送件数80万件突破のお知らせ",
  },
  {
    date: "2025.01.10",
    tag: "拠点情報",
    tagStyle: "new" as const,
    title: "レンタカー事業を本格スタートしました",
  },
  {
    date: "2024.12.01",
    tag: "CSR",
    tagStyle: "default" as const,
    title: "安全運転講習会・地域清掃ボランティア活動を実施",
  },
];

export const recruit = {
  heading: "一緒に物流の未来を変えていく仲間を募集",
  text: "学歴・経験不問。配達車無料貸出、リース料・加盟料ゼロ。\n月収40万〜100万円が目指せます。\n20〜60代の幅広い年齢層が活躍中。\nまずはお気軽にご応募ください。",
  cta: "採用情報を見る",
  link: "/",
};

export const access = {
  heading: "アクセス",
  address: "大阪府寝屋川市池田2-11-55",
  nearestStation: "京阪本線「寝屋川市駅」よりバス10分",
  mapNote: "お車でお越しの場合は、敷地内駐車場をご利用いただけます。",
};

export const contact = {
  heading: "お問い合わせ",
  intro:
    "配送サービス・車両リース・レンタカー・ロードサービスに関するご相談・お見積もりなど、お気軽にお問い合わせください。\nメールは24時間365日受付しています。",
  fields: [
    { name: "company", label: "会社名", type: "text", required: true },
    { name: "name", label: "ご担当者名", type: "text", required: true },
    { name: "email", label: "メールアドレス", type: "email", required: true },
    { name: "phone", label: "電話番号", type: "tel", required: false },
    { name: "message", label: "お問い合わせ内容", type: "textarea", required: true },
  ],
};

export const footer = {
  catchphrase: "物流で未来を変えていく。",
};
