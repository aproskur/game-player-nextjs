'use client'
import React, { useContext, useState, useEffect } from "react";
import { manageActions, actionHandlers } from "../../utils/actions";
import { GameScreenContext } from "../../components/GameScreenRenderer";


const GameCard = ({ children, id, actions, ...props }) => {


    const { updateAppState, appState } = useContext(GameScreenContext);

    //FOR ANIMATIONS!!!
    const [isFlipped, setIsFlipped] = useState(false);


    //Redefine handleClick to setIt in useEffect, useEffect will contrall that appState is upto bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdate
    //Not sure if I need this
    const [handleClick, setHandleClick] = useState(() => () => {
        console.log("Initial handleClick, appState should not be used here");
    });



    useEffect(() => {
        const newHandleClick = () => {
            console.log("CARD handleClick.Passing to actions manager", appState)
            manageActions(actions.onClick, id, actionHandlers, updateAppState, appState);
            setIsFlipped(!isFlipped);
        };
        setHandleClick(() => newHandleClick);
    }, [appState, isFlipped]);




    return (
        <div className={`default-game-card ${props.cssClass} ${isFlipped ? 'flipped' : ''}`}
            style={{ backgroundImage: `url(${props.backgroundImage})` }}
            onClick={handleClick}>
            {props.text}
            {children}
        </div>

    );
}

export default GameCard