import { tText, useLocaleVersion } from "@/i18n/display";
import { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import { mapHtml } from "./mapHtml";
import type { GeoMapProps } from "./types";
export default function GeoMap({ area, onCenter }: GeoMapProps) {
  "use no memo";
  const language = useLocaleVersion();
  const ref = useRef<WebView>(null);
  const source = useRef({ html: mapHtml(area) });
  useEffect(() => {
    ref.current?.injectJavaScript(
      `document.getElementById('status').textContent=${JSON.stringify(tText("loadingMap"))};true;`,
    );
  }, [language]);
  const update = () =>
    ref.current?.injectJavaScript(
      `window.updateSearchArea&&window.updateSearchArea(${JSON.stringify(area)});true;`,
    );
  useEffect(update, [area.latitude, area.longitude, area.radiusKm]);
  return (
    <WebView
      ref={ref}
      source={source.current}
      originWhitelist={["*"]}
      javaScriptEnabled
      style={{ height: 280, flex: 0 }}
      onMessage={(e) => {
        try {
          const d = JSON.parse(e.nativeEvent.data);
          if (d.type === "ready") update();
          if (
            d.type === "center" &&
            Number.isFinite(d.latitude) &&
            Number.isFinite(d.longitude)
          )
            onCenter(d.latitude, d.longitude);
        } catch {}
      }}
    />
  );
}
