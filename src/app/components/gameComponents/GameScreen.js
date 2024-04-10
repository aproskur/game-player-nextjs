import React from 'react';

const GameScreen = ({ cssClass, backgroundImage, children }) => {
  return (
    <div className={`default-main-screen ${cssClass}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
      {children}
    </div>
  );
};

export default GameScreen;
