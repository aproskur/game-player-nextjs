import React from 'react';
import GameScreen from '../components/gameComponents/GameScreen';
import GameArea from '../components/gameComponents/GameArea';
import GameVariable from '../components/gameComponents/GameVariable';
import GameCard from '../components/gameComponents/GameCard';
import GameButton from '../components/gameComponents/GameButton';

function renderComponent(componentData) {
    if (!componentData) {
        return null;
    }

    const { component: ComponentType, elements, id, cssClass, ...props } = componentData;

    console.log(`Rendering component: ${ComponentType} with ID: ${id}`, componentData);

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
                />
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
                />
            );
        case 'buttonComponent':
            return (
                <GameButton
                    id={id}
                    cssClass={cssClass}
                    caption={props.caption}
                    key={id}
                />
            );
        default:
            return null;
    }
}

function renderElements(elements) {
    console.log("render elements func START");
    console.log('Input elements:', elements);

    if (!elements || Object.keys(elements).length === 0) {
        return null;
    }

    const entries = Object.entries(elements);
    console.log('Entries:', entries);

    return entries.map(([key, value]) => {
        console.log('Processing entry:', { key, value });

        const newValue = { ...value, id: key };
        console.log('New value with id:', newValue);
        console.log("render elements func END");

        return renderComponent(newValue);
    });
}

export default renderComponent;
