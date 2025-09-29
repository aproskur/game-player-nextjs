'use client';
import React, { memo, useMemo } from 'react';

// avoid url(undefined)
const safeBg = (p) =>
  p && typeof p === 'string'
    ? (p.startsWith('url(') ? p : `url(${p})`)
    : undefined;

// shallow compare style objects to keep memo effective
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
};

const HelperComponent = ({
  text,
  caption,
  cssClass = '',
  src,                 // <img> src (optional)
  alt = '',
  cssInline,           // old schema inline styles
  style,               // new schema inline styles
  backgroundImage,     // old schema bg image on the wrapper
  children,
  ...rest
}) => {
  const hasImage = typeof src === 'string' && src.length > 0;

  const mergedStyle = useMemo(() => {
    const s = { ...(cssInline || {}), ...(style || {}) };
    const bg = safeBg(backgroundImage);
    if (bg && !s.background && !s.backgroundImage) {
      s.backgroundImage = bg;
      s.backgroundSize ??= 'contain';
      s.backgroundRepeat ??= 'no-repeat';
      s.backgroundPosition ??= 'center';
    }
    return s;
  }, [cssInline, style, backgroundImage]);

  return (
    <div className={`default-helper ${cssClass}`} style={mergedStyle} {...rest}>
      {hasImage ? (
        <img
          src={src}
          alt={alt || caption || text || ''}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      ) : (
        <span>{(text && text.trim()) ? text : (caption ?? children)}</span>
      )}
    </div>
  );
};

export default memo(HelperComponent, (a, b) =>
  a.text === b.text &&
  a.caption === b.caption &&
  a.cssClass === b.cssClass &&
  a.src === b.src &&
  a.alt === b.alt &&
  a.backgroundImage === b.backgroundImage &&
  shallowEqual(a.cssInline, b.cssInline) &&
  shallowEqual(a.style, b.style) &&
  a.children === b.children
);
