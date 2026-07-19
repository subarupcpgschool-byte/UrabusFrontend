// HeroSection.tsx
// GlobalWorkers — Hero Section (React Native / Expo)
//
// Dependencies (install in your Expo project):
//   npx expo install expo-linear-gradient react-native-svg
//
// Fonts (see App.tsx for loading example):
//   npx expo install @expo-google-fonts/zen-kaku-gothic-new @expo-google-fonts/sora expo-font

import { colors, gradients, radii, spacing, typography } from '@constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Defs, Line, Path, RadialGradient, Stop } from 'react-native-svg';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

type Props = {
  onPostJob?: () => void;
  onSearchJobs?: () => void;
};

// ---- rising bubbles: growth motif ------------------------------------
const BUBBLE_CONFIG = [
  { left: '8%', size: 70, duration: 9000, delay: 0 },
  { left: '22%', size: 40, duration: 7000, delay: 1200 },
  { left: '40%', size: 90, duration: 11000, delay: 400 },
  { left: '58%', size: 54, duration: 8200, delay: 2400 },
  { left: '76%', size: 76, duration: 10200, delay: 800 },
  { left: '88%', size: 42, duration: 7600, delay: 3200 },
];

function Bubble({ left, size, duration, delay }: (typeof BUBBLE_CONFIG)[number]) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration, delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_H * 1.15],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.85, 1],
    outputRange: [0, 0.75, 0.35, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left:left as any,
        bottom: -size,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.skyLight,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

// ---- faint global-network accent (nods to "Global") -------------------
function NetworkAccent() {
  return (
    <Svg
      width={200}
      height={150}
      viewBox="0 0 340 260"
      style={styles.network}
      pointerEvents="none"
    >
      <Line x1="30" y1="40" x2="140" y2="90" stroke={colors.blue} strokeWidth={1} opacity={0.4} />
      <Line x1="140" y1="90" x2="250" y2="50" stroke={colors.blue} strokeWidth={1} opacity={0.4} />
      <Line x1="140" y1="90" x2="180" y2="190" stroke={colors.blue} strokeWidth={1} opacity={0.4} />
      <Line x1="180" y1="190" x2="300" y2="160" stroke={colors.blue} strokeWidth={1} opacity={0.4} />
      <Line x1="30" y1="40" x2="60" y2="150" stroke={colors.blue} strokeWidth={1} opacity={0.4} />
      <Circle cx="30" cy="40" r="4" fill={colors.blue} />
      <Circle cx="140" cy="90" r="5" fill={colors.blue} />
      <Circle cx="250" cy="50" r="4" fill={colors.blue} />
      <Circle cx="180" cy="190" r="5" fill={colors.blue} />
      <Circle cx="300" cy="160" r="4" fill={colors.blue} />
      <Circle cx="60" cy="150" r="4" fill={colors.blue} />
    </Svg>
  );
}

// ---- globe orb: soft gradient sphere echoing the logo's globe ---------
function GlobeOrb() {
  const size = SCREEN_W * 0.6; // ~ mirrors the web version's 42vw on a wider canvas
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={[styles.globeOrb, { width: size, height: size }]}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="globeOrb" cx="32%" cy="30%" r="70%">
          <Stop offset="0%" stopColor={colors.skyLight} stopOpacity={0.16} />
          <Stop offset="45%" stopColor={colors.blue} stopOpacity={0.12} />
          <Stop offset="78%" stopColor={colors.blueDeep} stopOpacity={0.08} />
          <Stop offset="100%" stopColor={colors.blueDeep} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="50" fill="url(#globeOrb)" />
    </Svg>
  );
}

// ---- check icon for chips ----------------------------------------------
function CheckIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={colors.blueDeep}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ---- scrolling benefit chips ---------------------------------------
const BENEFITS = [
  '最短即日で掲載',
  '掲載費用0円プランあり',
  '全国47都道府県対応',
  '採用担当がサポート',
];

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <CheckIcon />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function BenefitTicker() {
  const translateX = useRef(new Animated.Value(0)).current;
  const [rowWidth, setRowWidth] = useState(0);

  const onRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== rowWidth) setRowWidth(w);
  };

  useEffect(() => {
    if (!rowWidth) return;
    const distance = rowWidth / 2; // row is duplicated x2, scroll exactly one copy
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -distance,
          duration: distance * 24, // ~speed; tune to taste
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [rowWidth, translateX]);

  const items = [...BENEFITS, ...BENEFITS];

  return (
    <View style={styles.tickerWrap}>
      <Animated.View
        style={[styles.tickerRow, { transform: [{ translateX }] }]}
        onLayout={onRowLayout}
      >
        {items.map((label, i) => (
          <Chip key={`${label}-${i}`} label={label} />
        ))}
      </Animated.View>
    </View>
  );
}

// ---- main hero section -------------------------------------------------
export default function HeroSection({ onPostJob, onSearchJobs }: Props) {
  return (
    <LinearGradient colors={gradients.pageBackdrop} style={styles.hero}>
      <GlobeOrb />
      {BUBBLE_CONFIG.map((cfg, i) => (
        <Bubble key={i} {...cfg} />
      ))}
      <NetworkAccent />

      <View style={styles.content}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>
            GLOBALWORKERS — 中小企業のための採用プラットフォーム
          </Text>
        </View>

        <Text style={styles.h1}>
          小さな会社に、{'\n'}
          <Text style={styles.h1Accent}>大きな採用力を。</Text>
        </Text>

        <Text style={styles.sub}>
          掲載も、応募も、驚くほどシンプルに。中小企業が"人を増やす力"を持てば、会社はもっと大きくなれる。GlobalWorkersは、その最初の一歩を支えます。
        </Text>

        <View style={styles.ctas}>
          <Pressable onPress={onPostJob} >
            <LinearGradient colors={gradients.primaryButton} style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>求人を掲載する</Text>
              <Text style={styles.btnArrowLight}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onSearchJobs}
            style={({ pressed }) => [styles.btnGhost, pressed && { borderColor: colors.blue }]}
          >
            <Text style={styles.btnGhostText}>求人をさがす</Text>
            <Text style={styles.btnArrowDark}>→</Text>
          </Pressable>
        </View>

        <BenefitTicker />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 30,
    paddingBottom: 40,
    overflow: 'hidden',
    height:"100%",
    width:"100%"
  },
  network: {
    position: 'absolute',
    top: 32,
    right: 12,
    opacity: 0.5,
  },
  globeOrb: {
    position: 'absolute',
    top: -SCREEN_W * 0.35,
    right: -SCREEN_W * 0.25,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.skyLight,
    marginRight: spacing.sm,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.latin,
    fontSize: typography.size.eyebrow,
    letterSpacing: 1.2,
    color: colors.blueDeep,
    flexShrink: 1,
  },
  h1: {
    fontFamily: typography.fontFamily.displayBlack,
    fontSize: typography.size.h1,
    lineHeight: typography.lineHeight.h1,
    color: colors.ink,
  },
  h1Accent: {
    color: colors.blue,
  },
  sub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sub,
    lineHeight: typography.lineHeight.sub,
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    maxWidth: 650,
    //textWrapStyle:"balance"
  },
  ctas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: radii.pill,
  },
  btnPrimaryText: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.size.button,
    color: colors.white,
  },
  btnArrowLight: {
    color: colors.white,
    fontFamily: typography.fontFamily.displayBold,
  },
  btnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.white,
  },
  btnGhostText: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.size.button,
    color: colors.ink,
  },
  btnArrowDark: {
    color: colors.ink,
    fontFamily: typography.fontFamily.displayBold,
  },
  tickerWrap: {
    overflow: 'hidden',
    width: '100%',
  },
  tickerRow: {
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.chipBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    marginRight: spacing.sm,
  },
  chipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.chip,
    color: colors.blueDeep,
    //whiteSpace: 'nowrap' as any, // no-op on native, harmless
  },
});
