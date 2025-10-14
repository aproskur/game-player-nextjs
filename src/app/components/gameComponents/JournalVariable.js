import React, { memo, useMemo } from 'react';

const JournalVariable = ({
  cssClass = '',
  value = 0,
  previousValue = 0,
  caption,
  cssInline,
  style,
  children,
  ...rest
}) => {
  const safeValue = Number(value ?? 0);
  const safePrev = Number(previousValue ?? 0);
  const diff = Number.isFinite(safeValue - safePrev) ? safeValue - safePrev : null;

  const mergedStyle = useMemo(
    () => ({ ...(cssInline || {}), ...(style || {}) }),
    [cssInline, style],
  );

  return (
    <div className={`default-journal-variable-component ${cssClass}`} style={mergedStyle} {...rest}>
      <div className="journal-variable__row">
        <div className="journal-variable__value">{safeValue}</div>
        {diff ? (
          <div className="journal-variable__diff">
            <sup>{diff > 0 ? '+' : ''}{diff}</sup>
          </div>
        ) : null}
      </div>
      <div className="journal-variable__caption">{caption}</div>
      {children}
    </div>
  );
};

export default memo(JournalVariable);
