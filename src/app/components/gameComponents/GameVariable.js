import React, { useState, useEffect, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { manageActions, actionHandlers } from "../../utils/actions";

const GameVariable = React.memo(({ id, cssClass, cssInline, caption, value, description, actions, backgroundImage }) => {
    const [showDescription, setShowDescription] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        console.log(`Animating with value: ${value}`);
        controls.start({
            x: [0, -5, 5, -5, 5, 0],
            transition: { type: 'spring', stiffness: 500, damping: 10 }
        });
    }, [value, controls]);

    const handleClick = () => {
        manageActions(actions.onClick, id, actionHandlers);
    };

    const handleMouseEnter = () => {
        console.log(`Mouse enter on variable ${id}`);
        manageActions(actions.onHover, id, actionHandlers);
        setShowDescription(true);
    };

    const handleMouseLeave = () => {
        console.log(`Mouse leave on variable ${id}`);
        setShowDescription(false);
    };

    console.log(`Component rendered with value: ${value}`);
    console.log(`Rendering GameVariable with backgroundImage URL:`, backgroundImage);

    return (
        <div className={`default-game-variable ${cssClass}`}>
            <motion.button
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ backgroundImage: `url(${backgroundImage})`, ...cssInline }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <motion.span
                    animate={controls}
                    initial={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {value}
                </motion.span>
            </motion.button>
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
}, (prevProps, nextProps) => {
    return (
        prevProps.value === nextProps.value &&
        prevProps.cssClass === nextProps.cssClass &&
        prevProps.cssInline === nextProps.cssInline &&
        prevProps.caption === nextProps.caption &&
        prevProps.description === nextProps.description &&
        prevProps.backgroundImage === nextProps.backgroundImage
    );
});

export default GameVariable;
