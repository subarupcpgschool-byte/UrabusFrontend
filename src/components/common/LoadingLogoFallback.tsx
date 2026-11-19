import { useEffect } from 'react';
import { Text, View } from 'react-native';

export type LoadingLogoProps = { onReady?: () => void };

export default function LoadingLogoFallback({ onReady }: LoadingLogoProps) {
  useEffect(() => { onReady?.(); }, [onReady]);
  return <View style={{ width: 252, height: 84, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#2563EB', fontSize: 28, fontWeight: '700' }}>GlobalWorkers</Text>
  </View>;
}
