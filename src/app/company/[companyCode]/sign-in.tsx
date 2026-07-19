import { Stack, useLocalSearchParams } from 'expo-router';

import { CompanyAuthScreen } from '@components/auth/CompanyAuthScreen';

export default function CompanySignInPage() {
    const { companyCode } = useLocalSearchParams<{ companyCode: string }>();

    return (
        <>
            <Stack.Screen options={{ title: '企業サインイン', headerShown: false }} />
            <CompanyAuthScreen mode="sign-in" companyCode={companyCode} />
        </>
    );
}
