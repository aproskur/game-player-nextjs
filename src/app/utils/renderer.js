import React from 'react';
import GameScreen from '../components/gameComponents/GameScreen';
import GameArea from '../components/gameComponents/GameArea'
import GameVariable from '../components/gameComponents/GameVariable'
import GameCard from '../components/gameComponents/GameCard'
import GameButton from '../components/gameComponents/GameButton'


function renderComponent(componentData) {
    const { component: ComponentType, elements, cssClass, ...props } = componentData;

    switch (ComponentType) {
        case 'screenComponent':
            return (
                <GameScreen
                    cssClass={cssClass}
                    backgroundImage={props.backgroundImage}
                >
                    {renderElements(elements)}
                </GameScreen>
            );
        case 'areaComponent':
            return (
                <GameArea
                    cssClass={cssClass}
                >
                    {renderElements(elements)}
                </GameArea>
            );
        case 'gameVariableComponent':
            return (
                <GameVariable
                    cssClass={cssClass}
                    backgroundImage={props.backgroundImage}
                    caption={props.caption}
                    description={props.description}
                    value={props.value}
                >
                </GameVariable>
            );
        case 'cardComponent':
            return (
                <GameCard
                    cssClass={cssClass}
                    text={props.text}

                >
                    {renderElements(elements)}

                </GameCard>
            );
        case 'buttonComponent':
            return (
                <GameButton
                    cssClass={cssClass}
                    caption={props.caption}

                >
                    {renderElements(elements)}

                </GameButton>
            );
        default:
            return null;
    }
}

function renderElements(elements) {
    if (!elements || Object.keys(elements).length === 0) {
        return null;
    }

    return Object.values(elements).map((element, index) => (
        <React.Fragment key={index}>
            {renderComponent(element)}
        </React.Fragment>
    ));
}




export default renderComponent;

