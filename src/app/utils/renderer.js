import React from 'react';
import GameScreen from '../components/gameComponents/GameScreen';
import GameArea from '../components/gameComponents/GameArea'
import GameVariable from '../components/gameComponents/GameVariable'
import GameCard from '../components/gameComponents/GameCard'
import GameButton from '../components/gameComponents/GameButton'


function renderComponent(componentData) {
    const { component: ComponentType, elements, id, cssClass, ...props } = componentData;

    switch (ComponentType) {
        case 'screenComponent':
            return (
                <GameScreen
                    id={id}
                    cssClass={cssClass}
                    backgroundImage={props.backgroundImage}
                    key={id}
                >
                    {renderElements(elements)}
                </GameScreen>
            );
        case 'areaComponent':
            return (
                <GameArea
                    id={id}
                    cssClass={cssClass}
                    key={id}
                >
                    {renderElements(elements)}
                </GameArea>
            );
        case 'gameVariableComponent':
            return (
                <GameVariable
                    id={id}
                    cssClass={cssClass}
                    cssInline={props.cssInline}
                    backgroundImage={props.backgroundImage}
                    caption={props.caption}
                    description={props.description}
                    value={props.value}
                    actions={props.actions}
                    key={id}
                >
                </GameVariable>
            );
        case 'cardComponent':
            return (
                <GameCard
                    id={id}
                    cssClass={cssClass}
                    key={id}
                    text={props.text}
                    actions={props.actions}
                    backgroundImage={props.backgroundImage}
                >
                    {renderElements(elements)}
                </GameCard>
            );
        case 'buttonComponent':
            return (
                <GameButton
                    id={id}
                    cssClass={cssClass}
                    caption={props.caption}
                    key={id}
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

    return Object.entries(elements).map(([key, value]) => {

        const newValue = { ...value, id: key };
        return (
            <React.Fragment key={key}>
                {renderComponent(newValue)}
            </React.Fragment>
        );
    });
}

export default renderComponent;
