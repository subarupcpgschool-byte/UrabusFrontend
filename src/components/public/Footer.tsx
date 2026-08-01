import { COLORS } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function FooterComponent() {
    return (
        <View style={styles.footer}>
            <View style={styles.brand}>
                <View style={styles.logoMark}><Text style={styles.logoText}>GW</Text></View>
                <Text style={styles.brandText}>GlobalWorkers</Text>
            </View>
            <Text style={styles.description}>評価でつながる直接雇用プラットフォーム</Text>
            <Text style={styles.copyright}>© 2026 GlobalWorkers</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: { width: '100%', paddingHorizontal: 24, paddingVertical: 38, alignItems: 'center', backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    logoMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
    logoText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    brandText: { color: COLORS.navy, fontSize: 18, fontWeight: '800' },
    description: { color: COLORS.muted, fontSize: 13, marginTop: 12, textAlign: 'center' },
    copyright: { color: '#8A98AC', fontSize: 11, marginTop: 12 },
});
