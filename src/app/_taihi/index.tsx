import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type Job = {
  id: string;
  avatar: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  rating: number;
  pay: string;
  tags: string[];
};

type Feature = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};
type NavItem = {
  label: string;
  route: Href;
}
const COLORS = {
  navy: '#14284D',
  blue: '#2F6FCB',
  blueDark: '#245CA9',
  blueLight: '#EAF3FF',
  sky: '#6FC0F0',
  green: '#14865C',
  greenLight: '#E6F6EF',
  purple: '#7655C5',
  purpleLight: '#F0EBFF',
  ink: '#101C2C',
  muted: '#5B6B85',
  border: '#D8E2EF',
  surface: '#FFFFFF',
  background: '#F5F8FC',
  soft: '#EFF5FC',
  warning: '#F4A340',
};

const jobs: Job[] = [
  {
    id: '1',
    avatar: '株',
    title: 'バックエンドエンジニア',
    company: '株式会社ブルースカイ',
    location: '東京都／フルリモート',
    employmentType: '正社員',
    rating: 4.8,
    pay: '月給 45万〜65万円',
    tags: ['未経験OK', '副業可', '評価率90%以上'],
  },
  {
    id: '2',
    avatar: '合',
    title: 'Webデザイナー',
    company: '合同会社ノード',
    location: '大阪府／週3リモート',
    employmentType: '業務委託',
    rating: 4.6,
    pay: '時給 2,500円〜',
    tags: ['柔軟な勤務', '副業可', '評価率90%以上'],
  },
  {
    id: '3',
    avatar: 'グ',
    title: '店舗運営スタッフ',
    company: 'グリーンリーフ株式会社',
    location: '兵庫県神戸市',
    employmentType: '正社員',
    rating: 4.4,
    pay: '月給 28万〜35万円',
    tags: ['未経験OK', '研修制度', '評価公開中'],
  },
];

const features: Feature[] = [
  {
    icon: 'chatbubble-ellipses-outline',
    title: '直接チャット',
    description: '応募前の質問から採用後の連絡まで、企業と直接やり取りできます。',
  },
  {
    icon: 'star-outline',
    title: '相互評価',
    description: '勤務実績に基づく評価で、企業とユーザー双方の信頼を可視化します。',
  },
  {
    icon: 'shield-checkmark-outline',
    title: '透明な料金',
    description: '成功報酬は不要。評価協力率が高い企業ほど月額料金を優遇します。',
  },
];

export default function TopScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1040;
  const isTablet = width >= 720;

  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const pagePadding = useMemo(() => {
    if (width >= 1280) return 48;
    if (width >= 720) return 28;
    return 18;
  }, [width]);

  const goToSearch = () => {
    router.push({
      pathname: '/jobs',
      params: {
        keyword: keyword.trim(),
        location: location.trim(),
      },
    });
  };

  const toggleFavorite = (jobId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <PublicHeader
          isDesktop={isDesktop}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((value) => !value)}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { paddingHorizontal: pagePadding }]}>
            <HeroSection
              isDesktop={isDesktop}
              keyword={keyword}
              location={location}
              onKeywordChange={setKeyword}
              onLocationChange={setLocation}
              onSearch={goToSearch}
            />

            <View style={styles.section}>
              <SectionHeader
                title="評価の高い新着求人"
                description="実際に働いた人の評価を確認して応募できます。"
                buttonLabel="求人をもっと見る"
                onPress={() => router.push('/jobs')}
                compact={!isTablet}
              />

              <View style={styles.jobGrid}>
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    favorite={favorites.has(job.id)}
                    width={isDesktop ? '31.8%' : isTablet ? '48.5%' : '100%'}
                    onToggleFavorite={() => toggleFavorite(job.id)}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.featureStrip, !isTablet && styles.featureStripMobile]}>
              {features.map((feature) => (
                <View key={feature.title} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon} size={26} color={COLORS.blue} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureText}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <PublicFooter />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function PublicHeader({
  isDesktop,
  menuOpen,
  onToggleMenu,
}: {
  isDesktop: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const navItems: NavItem[] = [
    { label: '求人を探す', route: '/jobs' as Href },
    { label: '企業を探す', route: '/companies' as Href },
    { label: '評価について', route: '/reviews' as Href },
    { label: '料金', route: '/pricing' as Href },
  ];

  return (
    <View style={styles.headerWrap}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="トップページへ移動"
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.brand, pressed && styles.pressed]}
        >
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>GW</Text>
          </View>
          <Text style={styles.brandText}>GlobalWorkers</Text>
        </Pressable>

        {isDesktop ? (
          <>
            <View style={styles.navigation}>
              {navItems.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.route)}
                  style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
                >
                  <Text style={styles.navText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => router.push('/login' as Href)}
                style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
              >
                <Text style={styles.linkButtonText}>ログイン</Text>
              </Pressable>
              <PrimaryButton label="無料で始める" onPress={() => router.push('/signup/user' as Href)} />
            </View>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            onPress={onToggleMenu}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          >
            <Ionicons name={menuOpen ? 'close' : 'menu'} size={25} color={COLORS.navy} />
          </Pressable>
        )}
      </View>

      {!isDesktop && menuOpen ? (
        <View style={styles.mobileMenu}>
          {navItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                onToggleMenu();
                router.push(item.route);
              }}
              style={({ pressed }) => [styles.mobileMenuItem, pressed && styles.pressed]}
            >
              <Text style={styles.mobileMenuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
            </Pressable>
          ))}
          <View style={styles.mobileMenuActions}>
            <SecondaryButton label="ログイン" onPress={() => router.push('/login' as Href)} />
            <PrimaryButton label="無料で始める" onPress={() => router.push('/signup/user' as Href)} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

function HeroSection({
  isDesktop,
  keyword,
  location,
  onKeywordChange,
  onLocationChange,
  onSearch,
}: {
  isDesktop: boolean;
  keyword: string;
  location: string;
  onKeywordChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <View style={[styles.hero, !isDesktop && styles.heroMobile]}>
      <View style={[styles.heroCopy, !isDesktop && styles.heroCopyMobile]}>
        <View style={styles.badgeGreen}>
          <Text style={styles.badgeGreenText}>採用成功報酬 0円</Text>
        </View>

        <Text style={[styles.heroTitle, !isDesktop && styles.heroTitleMobile]}>
          評価でつながる、{isDesktop ? '\n' : ' '}
          <Text style={styles.heroAccent}>直接雇用</Text>
          の新しいかたち。
        </Text>

        <Text style={styles.heroDescription}>
          求人掲載からチャット、採用後の従業員・勤怠管理まで。信頼できる評価をもとに企業と働く人が直接つながります。
        </Text>

        <View style={[styles.searchPanel, !isDesktop && styles.searchPanelMobile]}>
          <SearchInput
            icon="search-outline"
            value={keyword}
            placeholder="職種・スキル・企業名"
            onChangeText={onKeywordChange}
            onSubmitEditing={onSearch}
          />
          <SearchInput
            icon="location-outline"
            value={location}
            placeholder="勤務地・リモート"
            onChangeText={onLocationChange}
            onSubmitEditing={onSearch}
          />
          <Pressable
            accessibilityRole="button"
            onPress={onSearch}
            style={({ pressed }) => [styles.searchButton, pressed && styles.primaryPressed]}
          >
            <Ionicons name="search" size={19} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>求人を検索</Text>
          </Pressable>
        </View>

        <View style={[styles.heroNumbers, !isDesktop && styles.heroNumbersMobile]}>
          <Metric value="12,480" label="公開求人" />
          <Metric value="8,260" label="評価済み採用" />
          <Metric value="94%" label="評価協力率" />
        </View>
      </View>

      <View style={[styles.heroVisual, !isDesktop && styles.heroVisualMobile]}>
        <View style={[styles.floatingCard, styles.ratingCard]}>
          <Ionicons name="star" size={20} color={COLORS.warning} />
          <Text style={styles.floatingStrong}>4.8</Text>
          <Text style={styles.floatingText}>信頼できる企業評価</Text>
        </View>

        <View style={styles.personCard}>
          <View style={styles.portrait}>
            <Text style={styles.portraitText}>GW</Text>
          </View>
          <Text style={styles.personTitle}>直接雇用が成立</Text>
          <Text style={styles.personRole}>バックエンドエンジニア</Text>
          <View style={styles.successLine}>
            <Ionicons name="checkmark-circle" size={19} color={COLORS.green} />
            <Text style={styles.successText}>中間手数料なし</Text>
          </View>
        </View>

        <View style={[styles.floatingCard, styles.hiredCard]}>
          <Ionicons name="briefcase" size={20} color={COLORS.blue} />
          <Text style={styles.floatingStrong}>採用決定</Text>
          <Text style={styles.floatingText}>チャットから直接契約</Text>
        </View>
      </View>
    </View>
  );
}

function SearchInput({
  icon,
  value,
  placeholder,
  onChangeText,
  onSubmitEditing,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  onSubmitEditing: () => void;
}) {
  return (
    <View style={styles.searchInputWrap}>
      <Ionicons name={icon} size={20} color={COLORS.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="#8492A8"
        returnKeyType="search"
        style={styles.searchInput}
      />
    </View>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  description,
  buttonLabel,
  onPress,
  compact,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  compact: boolean;
}) {
  return (
    <View style={[styles.sectionHeader, compact && styles.sectionHeaderMobile]}>
      <View style={styles.sectionHeaderCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      <PrimaryButton label={buttonLabel} icon="add" onPress={onPress} />
    </View>
  );
}

function JobCard({
  job,
  favorite,
  width,
  onToggleFavorite,
}: {
  job: Job;
  favorite: boolean;
  width: `${number}%`;
  onToggleFavorite: () => void;
}) {
  return (
    <View style={[styles.jobCard, { width }]}>
      <View style={styles.jobCardHead}>
        <View style={styles.companyAvatar}>
          <Text style={styles.companyAvatarText}>{job.avatar}</Text>
        </View>
        <View style={styles.jobTitleWrap}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.companyName} numberOfLines={1}>{job.company}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          onPress={onToggleFavorite}
          style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
        >
          <Ionicons
            name={favorite ? 'star' : 'star-outline'}
            size={21}
            color={favorite ? COLORS.warning : COLORS.muted}
          />
        </Pressable>
      </View>

      <View style={styles.jobMetaList}>
        <MetaRow icon="location-outline" text={job.location} />
        <MetaRow icon="briefcase-outline" text={job.employmentType} />
        <MetaRow icon="star-outline" text={`評価 ${job.rating.toFixed(1)}`} />
      </View>

      <Text style={styles.jobPay}>{job.pay}</Text>

      <View style={styles.tagRow}>
        {job.tags.map((tag, index) => (
          <View
            key={tag}
            style={[
              styles.tag,
              index === 0 ? styles.tagBlue : index === 1 ? styles.tagPurple : styles.tagGreen,
            ]}
          >
            <Text
              style={[
                styles.tagText,
                index === 0
                  ? styles.tagBlueText
                  : index === 1
                    ? styles.tagPurpleText
                    : styles.tagGreenText,
              ]}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.jobActions}>
        <SecondaryButton label="詳細を見る" onPress={() => router.push(`/jobs/${job.id}` as Href)} />
        <PrimaryButton label="応募する" onPress={() => router.push(`/jobs/${job.id}/apply` as Href)} />
      </View>
    </View>
  );
}

function MetaRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={16} color={COLORS.muted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
    >
      {icon ? <Ionicons name={icon} size={17} color="#FFFFFF" /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function PublicFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerBrand}>
        <View style={styles.logoMarkSmall}>
          <Text style={styles.logoTextSmall}>GW</Text>
        </View>
        <Text style={styles.footerBrandText}>GlobalWorkers</Text>
      </View>
      <Text style={styles.footerDescription}>評価でつながる直接雇用プラットフォーム</Text>
      <Text style={styles.copyright}>© 2026 GlobalWorkers</Text>
    </View>
  );
}

const cardShadow = Platform.select({
  web: {
    shadowColor: '#14284D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  default: {
    shadowColor: '#14284D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
}) ?? {};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingBottom: 72,
  },
  headerWrap: {
    zIndex: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    minHeight: 72,
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  brandText: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  navigation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  navButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navText: {
    color: '#35435A',
    fontSize: 14,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkButton: {
    minHeight: 42,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
  },
  menuButton: {
    marginLeft: 'auto',
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenu: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  mobileMenuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mobileMenuText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  mobileMenuActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  hero: {
    minHeight: 580,
    marginTop: 28,
    borderRadius: 30,
    backgroundColor: COLORS.soft,
    paddingHorizontal: 54,
    paddingVertical: 54,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroMobile: {
    minHeight: 0,
    paddingHorizontal: 20,
    paddingVertical: 34,
    flexDirection: 'column',
    borderRadius: 22,
  },
  heroCopy: {
    flex: 1.12,
    paddingRight: 34,
    alignItems: 'flex-start',
  },
  heroCopyMobile: {
    width: '100%',
    paddingRight: 0,
  },
  badgeGreen: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginBottom: 18,
  },
  badgeGreenText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: '800',
  },
  heroTitle: {
    color: COLORS.navy,
    fontSize: 49,
    lineHeight: 65,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  heroTitleMobile: {
    fontSize: 34,
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  heroAccent: {
    color: COLORS.blue,
  },
  heroDescription: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 29,
    marginTop: 18,
    maxWidth: 680,
  },
  searchPanel: {
    width: '100%',
    marginTop: 28,
    padding: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...cardShadow,
  },
  searchPanelMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 10,
  },
  searchInputWrap: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    color: COLORS.ink,
    fontSize: 15,
  },
  searchButton: {
    minHeight: 50,
    borderRadius: 11,
    paddingHorizontal: 22,
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  heroNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
    marginTop: 24,
  },
  heroNumbersMobile: {
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  metric: {
    alignItems: 'flex-start',
  },
  metricValue: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '800',
  },
  metricLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  heroVisual: {
    flex: 0.88,
    minHeight: 440,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroVisualMobile: {
    width: '100%',
    minHeight: 400,
    marginTop: 24,
  },
  personCard: {
    width: '76%',
    minWidth: 260,
    maxWidth: 360,
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderRadius: 28,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...cardShadow,
  },
  portrait: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: COLORS.blueLight,
  },
  portraitText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  personTitle: {
    marginTop: 20,
    color: COLORS.ink,
    fontSize: 21,
    fontWeight: '800',
  },
  personRole: {
    marginTop: 7,
    color: COLORS.muted,
    fontSize: 14,
  },
  successLine: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: COLORS.greenLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  successText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: '800',
  },
  floatingCard: {
    position: 'absolute',
    zIndex: 4,
    minWidth: 180,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
    ...cardShadow,
  },
  ratingCard: {
    top: 12,
    left: 0,
  },
  hiredCard: {
    bottom: 18,
    right: 0,
  },
  floatingStrong: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '800',
  },
  floatingText: {
    width: '100%',
    color: COLORS.muted,
    fontSize: 12,
  },
  section: {
    marginTop: 72,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 24,
  },
  sectionHeaderMobile: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  sectionHeaderCopy: {
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 23,
    marginTop: 7,
  },
  jobGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  jobCard: {
    minWidth: 0,
    padding: 22,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...cardShadow,
  },
  jobCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyAvatarText: {
    color: COLORS.blue,
    fontSize: 18,
    fontWeight: '800',
  },
  jobTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  jobTitle: {
    color: COLORS.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
  },
  companyName: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  jobMetaList: {
    gap: 9,
    marginTop: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 13,
  },
  jobPay: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 19,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagBlue: {
    backgroundColor: COLORS.blueLight,
  },
  tagBlueText: {
    color: COLORS.blue,
  },
  tagPurple: {
    backgroundColor: COLORS.purpleLight,
  },
  tagPurpleText: {
    color: COLORS.purple,
  },
  tagGreen: {
    backgroundColor: COLORS.greenLight,
  },
  tagGreenText: {
    color: COLORS.green,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 22,
  },
  primaryButton: {
    minHeight: 43,
    paddingHorizontal: 17,
    borderRadius: 11,
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    flexShrink: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 43,
    paddingHorizontal: 17,
    borderRadius: 11,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  secondaryButtonText: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '700',
  },
  featureStrip: {
    marginTop: 72,
    paddingVertical: 36,
    paddingHorizontal: 34,
    borderRadius: 24,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    gap: 24,
  },
  featureStripMobile: {
    flexDirection: 'column',
  },
  featureItem: {
    flex: 1,
    minWidth: 0,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },
  featureText: {
    color: '#C8D4E7',
    fontSize: 13,
    lineHeight: 22,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 38,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoMarkSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextSmall: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  footerBrandText: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  footerDescription: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  copyright: {
    color: '#8A98AC',
    fontSize: 11,
    marginTop: 12,
  },
  pressed: {
    opacity: 0.65,
  },
  primaryPressed: {
    opacity: 0.82,
    backgroundColor: COLORS.blueDark,
  },
});
