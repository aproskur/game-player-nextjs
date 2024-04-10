import React from 'react';
import GameScreen from '../components/gameComponents/GameScreen';
import GameArea from '../components/gameComponents/GameArea'

function renderComponent(componentData) {
    const { component: ComponentType, elements, cssClass, ...props } = componentData;

    switch (ComponentType) {
        case 'screenComponent':
            return (
                <GameScreen
                    key={props.id}
                    cssClass={cssClass}
                    backgroundImage={props.backgroundImage}
                >
                    {renderElements(elements)}
                </GameScreen>
            );
        case 'areaComponent':
            return (
                <GameArea
                    key={props.id}
                    cssClass={cssClass}
                >
                    {renderElements(elements)}
                </GameArea>
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

