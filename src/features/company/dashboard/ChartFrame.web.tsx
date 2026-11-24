import { useEffect, useRef } from "react";
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
  const ref = useRef<HTMLIFrameElement>(null),
    callbacks = useRef({ onPoint, onError });
  callbacks.current = { onPoint, onError };
  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (
        event.source !== ref.current?.contentWindow ||
        typeof event.data !== "string"
      )
        return;
      try {
        const p = JSON.parse(event.data);
        if (p.source !== "globalworkers-chart") return;
        if (p.type === "point" && Number.isInteger(p.index))
          callbacks.current.onPoint(p.index);
        if (p.type === "error") callbacks.current.onError();
      } catch {}
    };
    window.addEventListener("message", listen);
    return () => window.removeEventListener("message", listen);
  }, []);
  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      sandbox="allow-scripts"
      onError={() => callbacks.current.onError()}
      style={{
        width: "100%",
        height,
        border: 0,
        display: "block",
        backgroundColor: "white",
      }}
    />
  );
}
