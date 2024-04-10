import React from "react";

const GameArea = ({ cssClass, children }) => {
    return (
        <div className={`default-area-component ${cssClass}`}>{children}</div>
    )
}

export default GameArea