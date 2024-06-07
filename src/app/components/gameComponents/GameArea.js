'use client';
import React, { memo } from "react";

const GameArea = ({ cssClass, children }) => {
    console.log('GameArea rendered');
    return (
        <div className={`default-area-component ${cssClass}`}>{children}</div>
    );
};

export default memo(GameArea);
