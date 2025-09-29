'use client';
import React, { memo, useMemo } from 'react';

const GameScreen = ({
  cssClass = '',
  style,         // new schema: pass JSON.css -> style
  cssInline,     // old schema: pass cssInline (optional)
  backgroundImage,
  children,
  ...divProps
}) => {
  const mergedStyle = useMemo(() => {
    // 1) start from old inline CSS, then let new style override it
    const s = { ...(cssInline || {}), ...(style || {}) };

    // 2) only add backgroundImage if caller didn't already set background/backgroundImage
    if (backgroundImage && !s.background && !s.backgroundImage) {
      const bg = backgroundImage.startsWith('url(')
        ? backgroundImage
        : `url(${backgroundImage})`;
      s.backgroundImage = bg;
      s.backgroundSize ||= 'cover';
      s.backgroundRepeat ||= 'no-repeat';
      s.backgroundPosition ||= 'center';
    }
    return s;
  }, [cssInline, style, backgroundImage]);

  return (
    <div
      className={`default-main-screen ${cssClass}`}
      style={mergedStyle}
      {...divProps}
    >
      {children}
    </div>
  );
};

export default memo(GameScreen);
