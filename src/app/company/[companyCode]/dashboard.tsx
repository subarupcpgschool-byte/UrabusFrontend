import { Stack, useLocalSearchParams } from 'expo-router';

import CompanyDashboardScreen from '@components/company/CompanyDashboardScreen';

export default function CompanyDashboardPage() {
  const { companyCode } = useLocalSearchParams<{ companyCode: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '企業ダッシュボード', headerShown: false }} />
      <CompanyDashboardScreen companyCode={companyCode} />
    </>
  );
}
