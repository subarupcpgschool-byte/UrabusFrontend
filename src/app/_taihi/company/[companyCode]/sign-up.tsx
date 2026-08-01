import { Stack, useLocalSearchParams } from 'expo-router';

import { CompanyAuthScreen } from '@/components/_taihi/auth/CompanyAuthScreen';

export default function CompanySignUpPage() {
  const { companyCode } = useLocalSearchParams<{ companyCode: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '企業登録', headerShown: false }} />
      <CompanyAuthScreen mode="sign-up" companyCode={companyCode} />
    </>
  );
}
