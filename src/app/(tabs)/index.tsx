import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const C = {
  blue: "#2563EB",
  blueDark: "#1748B8",
  blueSoft: "#EAF2FF",
  navy: "#10284B",
  green: "#159A69",
  greenSoft: "#E5F7EF",
  bg: "#F5F8FC",
  white: "#FFFFFF",
  text: "#162033",
  sub: "#61708A",
  muted: "#8995A8",
  border: "#DDE6F1",
  yellow: "#F4B740",
} as const;

type IconName = keyof typeof Ionicons.glyphMap;
type Job = {
  mark: string;
  color: string;
  title: string;
  company: string;
  location: string;
  style: string;
  rating: string;
  salary: string;
  tags: string[];
};

const jobs: Job[] = [
  {
    mark: "IN",
    color: "#367BEA",
    title: "Webデザイナー",
    company: "株式会社イノート",
    location: "大阪府",
    style: "週3リモート可",
    rating: "4.6",
    salary: "月給 28万円〜45万円",
    tags: ["未経験OK", "リモート可", "服装自由"],
  },
  {
    mark: "T",
    color: "#159A69",
    title: "バックエンドエンジニア",
    company: "TechVision株式会社",
    location: "東京都",
    style: "フルリモート",
    rating: "4.8",
    salary: "月給 45万円〜65万円",
    tags: ["TypeScript", "AWS", "裁量労働制"],
  },
  {
    mark: "店",
    color: "#F0A52B",
    title: "店舗運営スタッフ",
    company: "グリーンリーフ株式会社",
    location: "兵庫県神戸市",
    style: "シフト制",
    rating: "4.4",
    salary: "月給 28万円〜35万円",
    tags: ["未経験OK", "接客", "交通費支給"],
  },
];

const notify = (title: string) => {
  if (title === "top" || title === "top") {
    router.push("/" as never);
    return;
  }
  if (title === "求人を探す" || title === "求人検索") {
    router.push("/jobs" as never);
    return;
  }
  if (title === "企業を探す") {
    router.push("/companies" as never);
    return;
  }
  if (title === "ログイン" || title === "無料で始める") {
    router.push("/auth" as never);
    return;
  }
  if (title.includes("詳細")) {
    router.push("/jobs/1" as never);
    return;
  }
  if (title.includes("応募")) {
    router.push("/jobs/1/apply" as never);
    return;
  }
  Alert.alert(title, "検索条件を受け付けました（デモ）。");
};

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <View style={s.logo}>
      <Pressable key="logo" onPress={() => notify("top")} style={s.logoMark}>
        <Image
          source={require("@/assets/images/logo.svg")}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 0,
          }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

function Button({
  label,
  outline = false,
  onPress,
}: {
  label: string;
  outline?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress ?? (() => notify(label))}
      style={({ pressed }) => [
        s.button,
        outline && s.buttonOutline,
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.buttonText, outline && s.buttonTextOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Header({ desktop }: { desktop: boolean }) {
  const [open, setOpen] = useState(false);
  const items = [
    {
      path: "/jobs",
      text: "求人を探す",
    },
    {
      path: "/companies",
      text: "企業を探す",
    },
    {
      path: "/ssss",
      text: "評価について",
    },
    {
      path: "/price",
      text: "料金",
    },
    {
      path: "/guide",
      text: "ご利用ガイド",
    },
  ];
  return (
    <View style={s.header}>
      <View style={s.headerInner}>
        <Logo />
        {desktop ? (
          <>
            <View style={s.nav}>
              {items.map((x) => (
                <Pressable key={x.path} onPress={() => notify(x.text)}>
                  <Text style={s.navText}>{x.text}</Text>
                </Pressable>
              ))}
            </View>
            <View style={s.headerActions}>
              <Pressable onPress={() => notify("ログイン")}>
                <Text style={s.login}>ログイン</Text>
              </Pressable>
              <Button label="無料で始める" />
            </View>
          </>
        ) : (
          <Pressable onPress={() => setOpen((v) => !v)} style={s.menu}>
            <Ionicons name={open ? "close" : "menu"} size={29} color={C.navy} />
          </Pressable>
        )}
      </View>
      {!desktop && open && (
        <View style={s.mobileMenu}>
          {items.map((x) => (
            <Pressable
              key={x.path}
              onPress={() => notify(x.text)}
              style={s.mobileItem}
            >
              <Text style={s.navText}>{x.text}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.muted} />
            </Pressable>
          ))}
          <Button label="無料で始める" />
        </View>
      )}
    </View>
  );
}

function Search({ mobile }: { mobile: boolean }) {
  return (
    <View style={[s.search, mobile && s.searchMobile]}>
      <View style={s.searchField}>
        <Ionicons name="search" size={20} color={C.sub} />
        <TextInput
          placeholder="職種・スキル・企業名"
          placeholderTextColor={C.muted}
          style={s.input}
        />
      </View>
      <View style={[s.divider, mobile && s.dividerMobile]} />
      <View style={s.searchField}>
        <Ionicons name="location-outline" size={21} color={C.sub} />
        <TextInput
          placeholder="勤務地・リモート"
          placeholderTextColor={C.muted}
          style={s.input}
        />
      </View>
      <Pressable
        onPress={() => notify("求人検索")}
        style={({ pressed }) => [
          s.searchButton,
          mobile && { width: "100%" },
          pressed && s.pressed,
        ]}
      >
        <Ionicons name="search" size={18} color={C.white} />
        <Text style={s.searchButtonText}>求人を検索</Text>
      </Pressable>
    </View>
  );
}

function Flow({ tablet }: { tablet: boolean }) {
  const items: [IconName, string, string][] = [
    ["document-text-outline", "求人掲載", "魅力を伝えて応募を待つ"],
    ["chatbubbles-outline", "直接チャット", "気になることを確認"],
    ["checkmark-circle", "採用決定", "納得してスムーズに採用"],
    ["star-outline", "相互評価", "信頼を次のつながりへ"],
  ];
  return (
    <View style={s.visual}>
      <Text style={s.visualTitle}>評価がつくから、ミスマッチを減らせる</Text>
      <View style={s.flow}>
        {items.map(([icon, title, text], i) => (
          <View key={title} style={s.flowGroup}>
            <View style={s.flowCard}>
              <View
                style={[s.flowIcon, i === 2 && { backgroundColor: C.green }]}
              >
                <Ionicons
                  name={icon}
                  size={21}
                  color={i === 2 ? C.white : C.blue}
                />
              </View>
              <Text style={s.flowTitle}>{title}</Text>
              <Text style={s.flowText}>{text}</Text>
            </View>
            {tablet && i < 3 && (
              <Ionicons name="arrow-forward" size={22} color={C.blueDark} />
            )}
          </View>
        ))}
      </View>
      <View style={[s.proofRow, !tablet && { flexDirection: "column" }]}>
        <Review company />
        <View style={s.chat}>
          <Text style={s.chatText}>
            仕事内容について、もう少し聞いてもいいですか？
          </Text>
          <Text style={[s.chatText, s.chatReply]}>
            もちろんです！気になる点をお話しします。
          </Text>
        </View>
        <Review />
      </View>
    </View>
  );
}

function Review({ company = false }: { company?: boolean }) {
  return (
    <View style={s.review}>
      <View style={s.reviewHead}>
        <View style={[s.reviewAvatar, company && { backgroundColor: C.blue }]}>
          <Ionicons
            name={company ? "business" : "person"}
            size={18}
            color={C.white}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.reviewType}>{company ? "企業" : "ワーカー"}</Text>
          <Text style={s.reviewName}>
            {company ? "TechVision株式会社" : "山田 太郎さん"}
          </Text>
        </View>
        <Text style={s.verified}>本人確認済み</Text>
      </View>
      <View style={s.rating}>
        <Text style={s.ratingNo}>{company ? "4.6" : "4.8"}</Text>
        <Text style={s.stars}>★★★★★</Text>
      </View>
      <Text style={s.quote}>“誠実で丁寧な対応に安心できました。”</Text>
    </View>
  );
}

function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);
  return (
    <View style={s.jobCard}>
      <View style={s.jobHead}>
        <View style={[s.jobMark, { backgroundColor: job.color }]}>
          <Text style={s.jobMarkText}>{job.mark}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.jobTitle}>{job.title}</Text>
          <Text style={s.company}>{job.company}</Text>
        </View>
        <Pressable onPress={() => setSaved((v) => !v)} style={s.save}>
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={21}
            color={C.blue}
          />
        </Pressable>
      </View>
      <View style={s.meta}>
        <Ionicons name="location-outline" size={15} color={C.sub} />
        <Text style={s.metaText}>
          {job.location}　•　{job.style}　•　正社員
        </Text>
      </View>
      <View style={s.salaryRow}>
        <Text style={s.salary}>{job.salary}</Text>
        <Text style={s.jobRating}>★ {job.rating}</Text>
      </View>
      <View style={s.tags}>
        {job.tags.map((x, i) => (
          <View key={x} style={[s.tag, i === 1 && s.tagPurple]}>
            <Text style={[s.tagText, i === 1 && { color: "#7357C8" }]}>
              {x}
            </Text>
          </View>
        ))}
      </View>
      <View style={s.jobButtons}>
        <Button label="詳細を見る" outline />
        <Button label="応募する" />
      </View>
    </View>
  );
}

function Feature({
  icon,
  title,
  text,
  green = false,
}: {
  icon: IconName;
  title: string;
  text: string;
  green?: boolean;
}) {
  return (
    <View style={s.feature}>
      <View style={[s.featureIcon, green && { backgroundColor: C.greenSoft }]}>
        <Ionicons name={icon} size={30} color={green ? C.green : C.blue} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.featureTitle}>{title}</Text>
        <Text style={s.featureText}>{text}</Text>
      </View>
    </View>
  );
}

function Footer({ desktop }: { desktop: boolean }) {
  const cols = [
    ["サービス", "求人を探す", "企業を探す", "評価について"],
    ["ご利用者様へ", "ログイン", "よくある質問", "お問い合わせ"],
    ["企業様へ", "求人掲載の流れ", "料金について", "採用成功事例"],
    ["運営会社", "会社概要", "利用規約", "プライバシーポリシー"],
  ];
  return (
    <View style={s.footer}>
      <View style={[s.footerInner, !desktop && { flexDirection: "column" }]}>
        <View style={s.footerBrand}>
          <Logo inverse />
          <Text style={s.footerDesc}>
            評価でつながる直接雇用プラットフォーム。企業と働く人の信頼をつなぎ、より良い雇用の未来をつくります。
          </Text>
        </View>
        <View style={s.footerCols}>
          {cols.map((col) => (
            <View key={col[0]} style={s.footerCol}>
              <Text style={s.footerTitle}>{col[0]}</Text>
              {col.slice(1).map((x) => (
                <Pressable key={x} onPress={() => notify(x)}>
                  <Text style={s.footerLink}>{x}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
      <Text style={s.copy}>© 2026 GlobalWorkers</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1024;
  const tablet = width >= 720;
  const padding = desktop ? 28 : tablet ? 24 : 16;
  return (
    <SafeAreaView style={s.safe}>
      <Header desktop={desktop} />
      <ScrollView style={s.page} showsVerticalScrollIndicator={false}>
        <View style={[s.content, { paddingHorizontal: padding }]}>
          <View style={[s.hero, desktop && s.heroDesktop]}>
            <View style={[s.heroCopy, desktop && { flex: 1 }]}>
              <Text style={s.badge}>採用成功報酬 0円</Text>
              <Text style={[s.heroTitle, desktop && s.heroTitleDesktop]}>
                評価でつながる、{"\n"}
                <Text style={s.accent}>直接雇用</Text>の新しいかたち。
              </Text>
              <Text style={s.heroText}>
                求人掲載から直接チャット、採用後の従業員・勤怠管理まで。信頼できる評価をもとに、企業と働く人が直接つながります。
              </Text>
              <Search mobile={!tablet} />
              <View style={s.metrics}>
                {[
                  "12,480件の公開求人",
                  "8,260社が利用中",
                  "94%が評価協力済み",
                ].map((x) => (
                  <View key={x} style={s.metric}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={C.green}
                    />
                    <Text style={s.metricText}>{x}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={[s.visualWrap, desktop && { flex: 1.05 }]}>
              <Flow tablet={tablet} />
            </View>
          </View>
          <View style={s.section}>
            <View
              style={[
                s.sectionHead,
                !tablet && {
                  flexDirection: "column",
                  alignItems: "flex-start",
                },
              ]}
            >
              <View>
                <Text style={s.sectionTitle}>評価の高い新着求人</Text>
                <Text style={s.sectionSub}>
                  実際に働いた人の評価を確認して応募できます。
                </Text>
              </View>
              <Pressable onPress={() => notify("求人一覧")} style={s.more}>
                <Text style={s.moreText}>求人をもっと見る</Text>
                <Ionicons name="arrow-forward" size={18} color={C.blueDark} />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.filters}
            >
              {["すべて", "未経験OK", "リモート可", "正社員", "業務委託"].map(
                (x, i) => (
                  <View key={x} style={[s.filter, i === 0 && s.filterActive]}>
                    <Text style={[s.filterText, i === 0 && { color: C.white }]}>
                      {x}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
            <View style={[s.jobGrid, !desktop && { flexDirection: "column" }]}>
              {jobs.map((x) => (
                <JobCard key={x.title} job={x} />
              ))}
            </View>
          </View>
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              信頼できる採用を、もっとシンプルに
            </Text>
            <Text style={s.sectionSub}>
              応募前から採用後まで、安心してつながれる仕組みを用意しています。
            </Text>
            <View style={[s.features, !desktop && { flexDirection: "column" }]}>
              <Feature
                icon="chatbubbles-outline"
                title="直接チャット"
                text="応募前の質問から採用後の連絡まで、企業と直接やり取りできます。"
              />
              <Feature
                icon="ribbon-outline"
                title="相互評価"
                text="企業とユーザー双方が評価し合い、信頼できる情報を可視化します。"
                green
              />
              <Feature
                icon="wallet-outline"
                title="透明な料金"
                text="採用成功報酬は不要。わかりやすい料金で採用を支援します。"
              />
            </View>
          </View>
          <View style={s.process}>
            <Text style={s.processHeading}>利用の流れ</Text>
            <View style={[s.steps, !tablet && { flexDirection: "column" }]}>
              {[
                ["search-outline", "求人を探す", "条件や評価を参考に検索"],
                ["chatbubbles-outline", "企業と話す", "直接チャットで質問"],
                ["people-outline", "採用・評価", "働いた後は評価を共有"],
              ].map(([icon, title, text], i) => (
                <View key={title} style={s.step}>
                  <Text style={s.stepNo}>{i + 1}</Text>
                  <Ionicons
                    name={icon as IconName}
                    size={27}
                    color={C.blueDark}
                  />
                  <View>
                    <Text style={s.stepTitle}>{title}</Text>
                    <Text style={s.stepText}>{text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View
            style={[
              s.cta,
              !tablet && { flexDirection: "column", alignItems: "stretch" },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.ctaTitle}>新しい働き方を、ここから。</Text>
              <Text style={s.ctaText}>
                あなたに合った働き方や人材を、信頼できるつながりから見つけましょう。
              </Text>
            </View>
            <View
              style={[s.ctaButtons, !tablet && { flexDirection: "column" }]}
            >
              <Button label="無料で求人を探す　→" />
              <Button label="無料で求人を掲載する　→" outline />
            </View>
          </View>
        </View>
        <Footer desktop={desktop} />
      </ScrollView>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: "#23436D",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.07,
  shadowRadius: 16,
  elevation: 2,
};
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  page: { flex: 1, backgroundColor: C.bg },
  content: { width: "100%", maxWidth: 1320, alignSelf: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    zIndex: 5,
  },
  headerInner: {
    width: "100%",
    maxWidth: 1320,
    minHeight: 72,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { flexDirection: "row", alignItems: "center", gap: 10, height: "100%" },
  logoMark: {
    width: 200,
    height: 58,
    borderRadius: 11,
    borderColor: "transparent",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoLetters: { color: C.white, fontWeight: "900", fontSize: 14 },
  logoName: {
    color: C.text,
    fontWeight: "700",
    fontSize: 19,
    letterSpacing: -0.4,
  },
  nav: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 27 },
  navText: { color: C.text, fontSize: 14, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  login: { color: C.blue, fontWeight: "800" },
  menu: {
    marginLeft: "auto",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileMenu: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  mobileItem: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  button: {
    minHeight: 44,
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.blue,
    borderWidth: 1,
    borderColor: C.blue,
  },
  buttonOutline: { backgroundColor: C.white },
  buttonText: { color: C.white, fontSize: 14, fontWeight: "800" },
  buttonTextOutline: { color: C.blue },
  hero: { paddingTop: 38, paddingBottom: 34, gap: 24 },
  heroDesktop: {
    minHeight: 500,
    flexDirection: "row",
    alignItems: "center",
    gap: 48,
  },
  heroCopy: { width: "100%" },
  badge: {
    alignSelf: "flex-start",
    color: C.green,
    backgroundColor: C.greenSoft,
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 14,
    fontSize: 12,
    fontWeight: "900",
  },
  heroTitle: {
    color: C.text,
    fontSize: 35,
    lineHeight: 49,
    fontWeight: "900",
    letterSpacing: -1.1,
  },
  heroTitleDesktop: { fontSize: 51, lineHeight: 66, letterSpacing: -2 },
  accent: {
    color: C.blue,
    textDecorationLine: "underline",
    textDecorationColor: "#9BC0FF",
  },
  heroText: {
    maxWidth: 630,
    marginTop: 14,
    color: C.sub,
    fontSize: 15,
    lineHeight: 25,
  },
  search: {
    marginTop: 22,
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 13,
    padding: 6,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  searchMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    padding: 10,
    gap: 4,
  },
  searchField: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
  },
  input: { flex: 1, color: C.text, fontSize: 14 },
  divider: { width: 1, height: 32, backgroundColor: C.border },
  dividerMobile: { width: "100%", height: 1 },
  searchButton: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.blue,
  },
  searchButtonText: { color: C.white, fontWeight: "900" },
  metrics: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  metric: { flexDirection: "row", alignItems: "center", gap: 6 },
  metricText: { color: C.sub, fontSize: 12.5 },
  visualWrap: { width: "100%" },
  visual: {
    backgroundColor: C.blueSoft,
    borderRadius: 19,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C9DAF3",
    ...shadow,
  },
  visualTitle: {
    textAlign: "center",
    color: C.navy,
    fontWeight: "900",
    marginBottom: 12,
  },
  flow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 7,
  },
  flowGroup: {
    flex: 1,
    minWidth: 110,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flowCard: {
    flex: 1,
    minHeight: 104,
    padding: 10,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  flowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  flowTitle: { marginTop: 7, color: C.navy, fontWeight: "900", fontSize: 12 },
  flowText: {
    marginTop: 3,
    textAlign: "center",
    color: C.sub,
    fontSize: 9.5,
    lineHeight: 13,
  },
  proofRow: { marginTop: 14, flexDirection: "row", gap: 10 },
  review: {
    flex: 1,
    minWidth: 0,
    backgroundColor: C.white,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: C.border,
    padding: 11,
  },
  reviewHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#6B8FD9",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewType: { color: C.muted, fontSize: 8 },
  reviewName: { color: C.text, fontSize: 9.5, fontWeight: "800" },
  verified: {
    color: C.green,
    backgroundColor: C.greenSoft,
    borderRadius: 8,
    padding: 3,
    fontSize: 6.5,
    fontWeight: "900",
  },
  rating: { marginTop: 8, flexDirection: "row", gap: 7 },
  ratingNo: { fontWeight: "900" },
  stars: { color: C.green, fontSize: 11 },
  quote: { marginTop: 5, color: C.sub, fontSize: 8, lineHeight: 12 },
  chat: { width: 150, justifyContent: "center", gap: 7 },
  chatText: {
    backgroundColor: C.white,
    borderRadius: 8,
    padding: 7,
    color: C.sub,
    fontSize: 8,
    lineHeight: 12,
  },
  chatReply: { backgroundColor: "#DCEAFF", color: C.blueDark },
  section: { paddingTop: 28, paddingBottom: 18 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "900",
  },
  sectionSub: { marginTop: 4, color: C.sub, fontSize: 13, lineHeight: 20 },
  more: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 7,
  },
  moreText: { color: C.blueDark, fontSize: 13, fontWeight: "800" },
  filters: { marginTop: 14, gap: 8 },
  filter: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterActive: { backgroundColor: C.blue, borderColor: C.blue },
  filterText: { color: C.sub, fontSize: 12, fontWeight: "700" },
  jobGrid: { marginTop: 14, flexDirection: "row", gap: 14 },
  jobCard: {
    flex: 1,
    padding: 16,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  jobHead: { flexDirection: "row", alignItems: "center", gap: 11 },
  jobMark: {
    width: 45,
    height: 45,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  jobMarkText: { color: C.white, fontSize: 16, fontWeight: "900" },
  jobTitle: { color: C.text, fontSize: 16, fontWeight: "900" },
  company: { color: C.sub, fontSize: 12, marginTop: 3 },
  save: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { marginTop: 13, flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: C.sub, fontSize: 11.5, flexShrink: 1 },
  salaryRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  salary: { color: C.text, fontSize: 13, fontWeight: "800" },
  jobRating: { color: "#B77A08", fontSize: 12, fontWeight: "800" },
  tags: { marginTop: 13, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: C.blueSoft,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagPurple: { backgroundColor: "#F1EDFF" },
  tagText: { color: C.blueDark, fontSize: 9.5, fontWeight: "800" },
  jobButtons: { marginTop: 16, flexDirection: "row", gap: 9 },
  features: { marginTop: 16, flexDirection: "row", gap: 14 },
  feature: {
    flex: 1,
    minHeight: 122,
    padding: 18,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { color: C.text, fontSize: 17, fontWeight: "900" },
  featureText: { marginTop: 5, color: C.sub, fontSize: 12, lineHeight: 18 },
  process: { marginTop: 18, marginBottom: 22 },
  processHeading: {
    color: C.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },
  steps: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  step: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  stepNo: {
    width: 28,
    height: 28,
    lineHeight: 28,
    borderRadius: 14,
    textAlign: "center",
    color: C.white,
    backgroundColor: C.blue,
    fontWeight: "900",
  },
  stepTitle: { color: C.text, fontSize: 13, fontWeight: "900" },
  stepText: { marginTop: 3, color: C.sub, fontSize: 10.5 },
  cta: {
    marginTop: 12,
    marginBottom: 44,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#C7DAF6",
    backgroundColor: C.blueSoft,
    padding: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  ctaTitle: { color: C.navy, fontSize: 26, lineHeight: 34, fontWeight: "900" },
  ctaText: { marginTop: 7, color: C.sub, fontSize: 13, lineHeight: 20 },
  ctaButtons: { flex: 1.25, flexDirection: "row", gap: 12 },
  footer: { backgroundColor: C.navy, padding: 28, paddingBottom: 18 },
  footerInner: {
    width: "100%",
    maxWidth: 1264,
    alignSelf: "center",
    flexDirection: "row",
    gap: 50,
  },
  footerBrand: { flex: 0.8, maxWidth: 320 },
  footerDesc: { marginTop: 13, color: "#BDCAE0", fontSize: 11, lineHeight: 18 },
  footerCols: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 22,
  },
  footerCol: { minWidth: 125, gap: 8 },
  footerTitle: {
    color: C.white,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },
  footerLink: { color: "#BDCAE0", fontSize: 11 },
  copy: {
    marginTop: 24,
    textAlign: "center",
    color: "#91A3BF",
    fontSize: 10.5,
  },
});
