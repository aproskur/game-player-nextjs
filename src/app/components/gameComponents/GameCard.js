'use client'
import React, { useContext } from "react";
import { manageActions, actionHandlers } from "../../utils/actions";
import { GameScreenContext } from "../../components/GameScreenRenderer";


const GameCard = ({ children, id, actions, ...props }) => {


    console.log("PROPS FroM CARD", props)

    const { updateAppState } = useContext(GameScreenContext);


    console.log("actions from card", actions);

    const handleClick = () => {
        console.log("handleClick called int the card", id);
        console.log("actions.onClick passed to handle click", actions.onClick);
        console.log("exstenese of actionsHandler", actionHandlers)
        manageActions(actions.onClick, id, actionHandlers, updateAppState);
    };


    return (
        <div className={`default-game-card ${props.cssClass}`}
            style={{ backgroundImage: `url(${props.backgroundImage})` }}
            onClick={handleClick}>
            {props.text}
            {children}
        </div>
    );
}

export default GameCard