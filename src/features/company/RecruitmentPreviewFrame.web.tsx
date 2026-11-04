export function RecruitmentPreviewFrame({ html }: { html: string }) {
  return <iframe title="募集内容プレビュー" srcDoc={html} sandbox="allow-scripts"
    style={{ width: '100%', height: 390, border: 0 }} />;
}
