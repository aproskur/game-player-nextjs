import React, { useContext, useState, memo, useCallback } from "react";
import { manageActions, actionHandlers } from "../../utils/actions";
import { GameScreenContext } from "../../components/GameScreenRenderer";



const GameButton = ({ cssClass, id, caption, backgroundImage, children, actions, ...props }) => {
    const { updateAppState, appState } = useContext(GameScreenContext);


    // this just sends data to the upper level. (the type of proc, id etc)
    const handleClick = useCallback(() => {
        console.log("BUTTON handleClick. Passing to actions manager", appState);
        manageActions(actions.onClick, id, actionHandlers, updateAppState, appState);
    }, [actions, id, appState, updateAppState]);

    return (
        <button className={`default-game-button ${cssClass}`}
            style={{ backgroundImage: `url(${backgroundImage})` }}
            onClick={handleClick}>
            {caption}
        </button>
    );
}

export default GameButton