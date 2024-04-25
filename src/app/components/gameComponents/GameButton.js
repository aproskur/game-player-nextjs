'use client'
import React from "react";

const GameButton = ({ cssClass, caption, props, onClick }) => {
    return (
        <button className={`default-game-button ${cssClass}`}>
            {caption}
        </button>
    );
}

export default GameButton