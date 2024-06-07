import React, { useContext, useState, memo, useCallback } from "react";
import { manageActions, actionHandlers } from "../../utils/actions";
import { GameScreenContext } from "../../components/GameScreenRenderer";

const GameCard = ({ children, id, actions, ...props }) => {
    const { updateAppState, appState } = useContext(GameScreenContext);

    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = useCallback(() => {
        console.log("CARD handleClick. Passing to actions manager", appState);
        manageActions(actions.onClick, id, actionHandlers, updateAppState, appState);
        setIsFlipped(!isFlipped);
    }, [actions, id, appState, updateAppState]);

    console.log(`GameCard rendered with props:`, { id, ...props });

    const backgroundImageStyle = props.backgroundImage ? { backgroundImage: `url(${props.backgroundImage})` } : {};

    return (
        <div
            className={`default-game-card ${props.cssClass} ${isFlipped ? 'flipped' : ''}`}
            style={backgroundImageStyle}
            onClick={handleClick}
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
