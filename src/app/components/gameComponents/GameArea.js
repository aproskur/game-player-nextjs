'use client';
import React, { memo, useMemo } from 'react';

const toBg = (v) => (typeof v === 'string' && v ? (v.startsWith('url(') ? v : `url(${v})`) : undefined);

const GameArea = ({
  cssClass = '',
  style,       // from new schema: node.css
  cssInline,   // from old schema: node.cssInline
  backgroundImage, // optional (old schema convenience)
  children,
  ...divProps
}) => {
  console.log('GameArea rendered');

  const mergedStyle = useMemo(() => {
    // start with old inline, then let new style override it
    const s = { ...(cssInline || {}), ...(style || {}) };

    // only add backgroundImage if caller didn't already set background/backgroundImage
    if (!s.background && !s.backgroundImage) {
      const bg = toBg(backgroundImage);
      if (bg) {
        s.backgroundImage = bg;
        s.backgroundSize ||= 'cover';
        s.backgroundRepeat ||= 'no-repeat';
        s.backgroundPosition ||= 'center';
      }
    }
    return s;
  }, [cssInline, style, backgroundImage]);

  return (
    <div className={`default-area-component ${cssClass}`} style={mergedStyle} {...divProps}>
      {children}
    </div>
  );
};

export default memo(GameArea);

