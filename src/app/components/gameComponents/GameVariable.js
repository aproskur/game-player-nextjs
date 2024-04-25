'use client'
import React, { useState } from "react";
import { manageActions, actionTypes, actionHandlers } from "../../utils/actions";

const GameVariable = ({ id, cssClass, cssInline, caption, value, description, actions, backgroundImage }) => {
    const [showDescription, setShowDescription] = useState(false);
    const [color, setColor] = useState();
    const [buttonColor, setButtonColor] = useState(); //
    const handleButtonColor = (color) => {
        setButtonColor(color)
    }

    /*
    const updatedActionHandlers = {
        ...actionHandlers,
        changeColor: (props) => {
            handleButtonColor(props.color)
        }
    }
    */

    const handleClick = () => {
        console.log('actions onClick from GameVariabel', actions.onClick);
        manageActions(actions.onClick, id, actionHandlers);
    };

    const handleMouseEnter = () => {
        manageActions(actions.onHover, id, actionHandlers);
        setShowDescription(true);
    };

    const handleMouseLeave = () => {
        setShowDescription(false);
    };

    return (
        <div className={`default-game-variable ${cssClass}`}>
            <button
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ backgroundImage: `url(${backgroundImage})`, color: buttonColor, ...cssInline }}
            >
                <span>{value}</span>
            </button>
            <div>
                <span>{caption}</span>
            </div>
            {showDescription && description && (
                <div className="description-div">
                    <span>{description}</span>
                </div>
            )}
        </div>
    );
};

export default GameVariable;
