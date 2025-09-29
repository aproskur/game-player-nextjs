'use client';
import React, { memo } from 'react';

const HelperComponent = ({
  text,
  caption,
  cssClass,
  src,         
  alt = '',
  children,
}) => {
  const hasImage = typeof src === 'string' && src.length > 0;

  return (
    <div className={`default-helper ${cssClass || ''}`}>
      {hasImage ? (
        <img
          src={src}
          alt={alt || caption || text || ''}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      ) : (
        <span>{text ?? caption ?? children}</span>
      )}
    </div>
  );
};

export default memo(HelperComponent, (prev, next) =>
  prev.text === next.text &&
  prev.caption === next.caption &&
  prev.cssClass === next.cssClass &&
  prev.src === next.src &&
  prev.alt === next.alt &&
  prev.children === next.children
);
