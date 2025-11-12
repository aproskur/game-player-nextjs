'use client';
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { manageActions, actionHandlers } from '../../utils/actions';
import { GameScreenContext } from '../GameScreenRenderer';

// guard so never produce url(undefined)
const safeBg = (p) =>
  p && typeof p === 'string'
    ? (p.startsWith('url(') ? p : `url(${p})`)
    : undefined;

// shallow style compare for memo
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
};

const GameVariable = React.memo(function GameVariable({
  id,
  cssClass,
  cssInline,
  style,               // NEW: allow new-schema inline styles
  caption,
  value,
  description,
  actions = {},        // guard defaults
  backgroundImage
}) {
  const [showDescription, setShowDescription] = useState(false);
  const controls = useAnimation();
  const { dispatchAppState, appState } = useContext(GameScreenContext); // keep local access to shared game state

  useEffect(() => {
    console.log(`Animating with value: ${value}`);
    controls.start({
      x: [0, -5, 5, -5, 5, 0],
      transition: { type: 'spring', stiffness: 500, damping: 10 }
    });
  }, [value, controls]);

  // Stable callback so memoized children don't rerender while still seeing fresh context data
  const handleClick = useCallback(() => {
    if (actions.onClick) {
      manageActions(actions.onClick, id, actionHandlers, dispatchAppState, appState);
    }
  }, [actions, id, dispatchAppState, appState]);

  const handleMouseEnter = useCallback(() => {
    console.log(`Mouse enter on variable ${id}`);
    if (actions.onHover) {
      manageActions(actions.onHover, id, actionHandlers, dispatchAppState, appState);
    }
    setShowDescription(true);
  }, [actions, id, dispatchAppState, appState]);

  // Only the identifier is logged, so changing `id` is the sole reason to recreate this handler
  const handleMouseLeave = useCallback(() => {
    console.log(`Mouse leave on variable ${id}`);
    setShowDescription(false);
  }, [id]);

  const btnStyle = useMemo(() => {
    // start from old inline CSS, then let new style override it
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

  console.log(`Component rendered with value: ${value}`);
  console.log(`Rendering GameVariable with backgroundImage URL:`, backgroundImage);

  return (
    <div className={`default-game-variable ${cssClass || ''}`}>
      <motion.button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={btnStyle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          animate={controls}
          initial={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.span>
      </motion.button>

      <div>
        <span>{caption}</span>
      </div>

      {showDescription && description && (
        <div className="description-div">
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}, (prev, next) =>
  prev.id === next.id &&
  prev.value === next.value &&
  prev.caption === next.caption &&
  prev.description === next.description &&
  prev.backgroundImage === next.backgroundImage &&
  prev.cssClass === next.cssClass &&
  shallowEqual(prev.cssInline, next.cssInline) &&
  shallowEqual(prev.style, next.style)
);

export default GameVariable;
