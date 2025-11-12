'use client';
import React, { useContext, useState, useCallback, useMemo, memo } from 'react';
import { manageActions, actionHandlers } from '../../utils/actions';
import { GameScreenContext } from '../../components/GameScreenRenderer';

// tiny guard so we never produce url(undefined)
const safeBg = (p) => (p && typeof p === 'string'
  ? (p.startsWith('url(') ? p : `url(${p})`)
  : undefined);

// shallow compare for style objects
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a); const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
};

const GameCard = ({ id, actions = {}, cssClass, text, backgroundImage, style, cssInline, children, ...rest }) => {
  const { dispatchAppState, appState } = useContext(GameScreenContext);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = useCallback(() => {
    if (!actions.onClick) return;
    console.log('CARD handleClick. Passing to actions manager', appState);
    manageActions(actions.onClick, id, actionHandlers, dispatchAppState, appState);
    setIsFlipped((v) => !v);
  }, [actions, id, appState, dispatchAppState]);

  const mergedStyle = useMemo(() => {
    const s = { ...(cssInline || {}), ...(style || {}) };
    const bg = safeBg(backgroundImage);
    // only set backgroundImage if caller didn't already set background/backgroundImage
    if (bg && !s.background && !s.backgroundImage) {
      s.backgroundImage = bg;
      s.backgroundSize ||= 'cover';
      s.backgroundRepeat ||= 'no-repeat';
      s.backgroundPosition ||= 'center';
    }
    return s;
  }, [cssInline, style, backgroundImage]);

  console.log('GameCard rendered with props:', { id, cssClass, text });

  return (
    <div
      className={`default-game-card ${cssClass || ''} ${isFlipped ? 'flipped' : ''}`}
      style={mergedStyle}
      onClick={actions.onClick ? handleClick : undefined}
      {...rest}
    >
      {text}
      {children}
    </div>
  );
};

export default memo(GameCard, (prev, next) =>
  prev.id === next.id &&
  prev.text === next.text &&
  prev.cssClass === next.cssClass &&
  prev.backgroundImage === next.backgroundImage &&
  prev.actions === next.actions &&                       
  shallowEqual(prev.style, next.style) &&
  shallowEqual(prev.cssInline, next.cssInline) &&
  prev.children === next.children
);
