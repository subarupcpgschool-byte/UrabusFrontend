import { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export function RecruitmentPreviewFrame({ html }: { html: string }) {
  const source = useMemo(() => ({ html }), [html]);
  return <View style={{ height: 390 }}>
    <WebView source={source} originWhitelist={['*']} onMessage={() => undefined}
      onShouldStartLoadWithRequest={request => request.url === 'about:blank'}
      allowFileAccess={false} mixedContentMode="never" />
  </View>;
}
