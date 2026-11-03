import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

// A code-driven ellipse keeps the orbit crisp on web and native screens.
const inputRange = Array.from({ length: 65 }, (_, i) => i / 64);
const trail = Array.from({ length: 12 }, (_, i) => ({
  x: inputRange.map(t => 164 * Math.cos(t * Math.PI * 2 - i * .035)),
  y: inputRange.map(t => 63 * Math.sin(t * Math.PI * 2 - i * .035)),
}));

export default function OrbitLoadingScreen() {
  const phase = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const { width } = useWindowDimensions();
  const scale = width > 0 ? Math.min(1, Math.max(.1, (width - 32) / 360)) : 1;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (active) setReduceMotion(value);
    }).catch(() => { if (active) setReduceMotion(false); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (reduceMotion !== false) return;
    phase.setValue(0);
    const animation = Animated.loop(Animated.timing(phase, {
      toValue: 1, duration: 2800, easing: Easing.linear, useNativeDriver: true,
    }));
    animation.start();
    return () => { animation.stop(); };
  }, [phase, reduceMotion]);

  return <View style={s.shell} accessibilityRole="progressbar" accessibilityLabel="画面を読み込んでいます">
    <View style={[s.scene, { transform: [{ scale }] }]}>
      <View style={s.halo}/>
      <View style={s.orbit}/>
      <Image source={require('../../../assets/images/loading-logo.png')} style={s.logo} contentFit="contain" accessibilityLabel="GlobalWorkers"/>
      {trail.map((point, i) => <Animated.View key={i} style={[s.light, {
        opacity: (1 - i / 12) * .9,
        transform: [
          { translateX: phase.interpolate({ inputRange, outputRange: point.x }) },
          { translateY: phase.interpolate({ inputRange, outputRange: point.y }) },
          { scale: 1 - i / 18 },
        ],
      }]}/>)}
    </View>
    <Text style={s.caption}>読み込み中…</Text>
    <Text style={s.sub}>あなたと、新しい働き方をつなぐ。</Text>
  </View>;
}

const s = StyleSheet.create({
  shell: { flex: 1, minHeight: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F8FC', paddingHorizontal: 16 },
  scene: { width: 360, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  halo: { position: 'absolute', width: 290, height: 116, borderRadius: 100, backgroundColor: '#EBF3FF' },
  orbit: { position: 'absolute', width: 328, height: 126, borderRadius: '50%', borderWidth: 1, borderColor: '#C9DDFB' },
  logo: { width: 252, height: 84 },
  light: { position: 'absolute', left: 175, top: 95, width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' },
  caption: { fontSize: 13, letterSpacing: 2, color: '#365D91', fontWeight: '600' },
  sub: { marginTop: 12, fontSize: 11, color: '#7B8FA9' },
});
