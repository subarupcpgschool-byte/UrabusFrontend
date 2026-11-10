import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IconButtonTooltipProps } from './AppIconButton';

type Position = { x: number; y: number; above: boolean };

export function IconButtonTooltip({ anchor, id, text, visible }: IconButtonTooltipProps) {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (!visible) {
      setPosition(null);
      return;
    }
    let active = true;
    const update = () => {
      anchor.current?.measureInWindow((x, y, width, height) => {
        if (!active) return;
        const inset = Math.min(108, window.innerWidth / 2);
        const center = Math.min(window.innerWidth - inset, Math.max(inset, x + width / 2));
        const above = y >= 60;
        setPosition({ x: center, y: above ? y - 7 : y + height + 7, above });
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      active = false;
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchor, visible]);

  if (!visible || !position || typeof document === 'undefined') return null;
  return createPortal(
    <div id={id} role="tooltip" style={{
      position: 'fixed', left: position.x, top: position.y,
      transform: position.above ? 'translate(-50%, -100%)' : 'translateX(-50%)',
      zIndex: 10000, pointerEvents: 'none',
      maxWidth: 'min(200px, calc(100vw - 16px))',
      background: '#172E49', color: '#FFF', borderRadius: 6,
      padding: '6px 9px', fontSize: 12, lineHeight: 1.4,
      fontFamily: 'system-ui, sans-serif', textAlign: 'center',
      boxShadow: '0 2px 8px rgba(16,35,60,.2)',
    }}>{text}</div>, document.body,
  );
}
