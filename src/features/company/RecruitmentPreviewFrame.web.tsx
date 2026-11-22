import { tText, useLocaleVersion } from "@/i18n/display";
export function RecruitmentPreviewFrame({ html }: { html: string }) {
  "use no memo";
  useLocaleVersion();
  return (
    <iframe
      title={tText("postingPreview")}
      srcDoc={html}
      sandbox="allow-scripts"
      style={{ width: "100%", height: 390, border: 0 }}
    />
  );
}
