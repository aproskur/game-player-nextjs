'use client';
import React, { useContext, useCallback, useMemo, memo } from 'react';
import { manageActions, actionHandlers } from '../../utils/actions';
import { GameScreenContext } from '../GameScreenRenderer';

// avoid url(undefined)
const safeBg = (p) =>
  p && typeof p === 'string'
    ? (p.startsWith('url(') ? p : `url(${p})`)
    : undefined;

const GameButton = ({
  id,
  cssClass,
  caption,
  backgroundImage, // plain path like "/images/foo.png" or "url(...)"
  actions = {},
  style,            // new schema: css
  cssInline,        // old schema: cssInline
  children,
  ...rest
}) => {
  const { dispatchAppState, appState } = useContext(GameScreenContext);
  const clickable = Boolean(actions.onClick);

  const handleClick = useCallback(() => {
    if (!clickable) return;
    console.log('BUTTON handleClick. Passing to actions manager', appState);
    manageActions(actions.onClick, id, actionHandlers, dispatchAppState, appState);
  }, [clickable, actions, id, appState, dispatchAppState]);

  const mergedStyle = useMemo(() => {
    const s = { ...(cssInline || {}), ...(style || {}) };
    const bg = safeBg(backgroundImage);
    if (bg && !s.background && !s.backgroundImage) {
      s.backgroundImage = bg;
      s.backgroundSize ||= 'cover';
      s.backgroundRepeat ||= 'no-repeat';
      s.backgroundPosition ||= 'center';
    }
    return s;
  }, [cssInline, style, backgroundImage]);

  return (
    <button
      type="button"
      className={`default-game-button ${cssClass || ''}`}
      style={mergedStyle}
      onClick={clickable ? handleClick : undefined}
      aria-disabled={!clickable || undefined}
      {...rest}
    >
      {caption ?? children}
    </button>
  );
};

export default memo(GameButton, (a, b) =>
  a.id === b.id &&
  a.caption === b.caption &&
  a.cssClass === b.cssClass &&
  a.backgroundImage === b.backgroundImage &&
  a.actions === b.actions && 
  a.style === b.style &&
  a.cssInline === b.cssInline &&
  a.children === b.children
);
