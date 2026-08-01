import FooterComponent from '@/components/public/Footer';
import HeaderComponent from '@/components/public/Header';
import { Slot } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';

export default function PublicLayout() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.page}>
                <HeaderComponent />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.body}><Slot /></View>
                    <FooterComponent />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    page: { flex: 1, backgroundColor: COLORS.background },
    scroll: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    body: { flexGrow: 1 },
});
