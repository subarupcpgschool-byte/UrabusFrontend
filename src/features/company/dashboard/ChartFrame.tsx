import { View } from "react-native";
import { WebView } from "react-native-webview";
export function ChartFrame({
  html,
  title,
  onPoint,
  onError,
  height = 320,
}: {
  height?: number;
  html: string;
  title: string;
  onPoint: (index: number) => void;
  onError: () => void;
}) {
  return (
    <View style={{ height, width: "100%" }}>
      <WebView
        accessibilityLabel={title}
        source={{ html }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled={false}
        allowFileAccess={false}
        mixedContentMode="never"
        scrollEnabled={false}
        onShouldStartLoadWithRequest={(request) =>
          request.url === "about:blank"
        }
        onError={onError}
        onMessage={(event) => {
          try {
            const p = JSON.parse(event.nativeEvent.data);
            if (p.source !== "globalworkers-chart") return;
            if (p.type === "point" && Number.isInteger(p.index))
              onPoint(p.index);
            if (p.type === "error") onError();
          } catch {}
        }}
      />
    </View>
  );
}
