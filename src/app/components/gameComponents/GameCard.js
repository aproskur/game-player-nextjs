import React, { useContext, useState, memo, useCallback } from "react";
import { manageActions, actionHandlers } from "../../utils/actions";
import { GameScreenContext } from "../../components/GameScreenRenderer";

//added default action empty obeect, and check of onClick handler to avoid errors when gamecard is not clickable

const GameCard = ({ children, id, actions = {}, ...props }) => { // Default actions to an empty object
    const { updateAppState, appState } = useContext(GameScreenContext);

    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = useCallback(() => {
        if (actions.onClick) {
            console.log("CARD handleClick. Passing to actions manager", appState);
            manageActions(actions.onClick, id, actionHandlers, updateAppState, appState);
            setIsFlipped(!isFlipped);
        }
    }, [actions, id, appState, updateAppState, isFlipped]);

    console.log(`GameCard rendered with props:`, { id, ...props });

    const backgroundImageStyle = props.backgroundImage ? { backgroundImage: `url(${props.backgroundImage})` } : {};

    return (
        <div
            className={`default-game-card ${props.cssClass} ${isFlipped ? 'flipped' : ''}`}
            style={backgroundImageStyle}
            onClick={actions.onClick ? handleClick : undefined} // Conditionally add onClick handler
        >
            {props.text}
            {children}
        </div>
    );
};

export default memo(GameCard, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.actions === nextProps.actions &&
        prevProps.cssClass === nextProps.cssClass &&
        prevProps.backgroundImage === nextProps.backgroundImage &&
        prevProps.text === nextProps.text &&
        prevProps.children === nextProps.children
    );
});
