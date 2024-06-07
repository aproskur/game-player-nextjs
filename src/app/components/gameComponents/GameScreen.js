'use client';
import React, { memo } from 'react';

const GameScreen = ({ cssClass, backgroundImage, children }) => {
  console.log('GameScreen rendered');
  return (
    <div className={`default-main-screen ${cssClass}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
      {children}
    </div>
  );
};

export default memo(GameScreen);
