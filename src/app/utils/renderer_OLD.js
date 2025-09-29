import React from 'react';
import GameScreen from '../components/gameComponents/GameScreen';
import GameArea from '../components/gameComponents/GameArea';
import GameVariable from '../components/gameComponents/GameVariable';
import GameCard from '../components/gameComponents/GameCard';
import GameButton from '../components/gameComponents/GameButton';
import JournalVariable from '../components/gameComponents/JournalVariable';
import HelperComponent from '../components/gameComponents/HelperComponent';

function renderComponent(componentData) {
    if (!componentData) {
        return null;
    }

    const { component: ComponentType, elements, id, cssClass, children, ...props } = componentData;

    console.log(`Rendering component: ${ComponentType} with ID: ${id}`, componentData);

    switch (ComponentType) {
        case 'screenComponent':
            console.log(`Rendering GameScreen with ID: ${id}`);
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
            console.log(`Rendering GameScreen with ID: ${id}`);
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
            console.log(`Rendering GameScreen with ID: ${id}`);
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
        case 'journalVariableComponent':
            console.log(`Rendering GameScreen with ID: ${id}`);
            return (
                <JournalVariable
                    id={id}
                    cssClass={cssClass}
                    cssInline={props.cssInline}
                    caption={props.caption}
                    value={props.value}
                    previousValue={props.previousValue}
                    actions={props.actions}
                    key={id}
                />
            );
        case 'cardComponent':
            console.log(`Rendering GameScreen with ID: ${id}`);
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
            console.log(`Rendering GameScreen with ID: ${id}`);
            return (
                <GameButton
                    id={id}
                    cssClass={cssClass}
                    caption={props.caption}
                    key={id}
                    backgroundImage={props.backgroundImage}
                    actions={props.actions}
                />
            );
            case 'helperComponent':
            console.log(`Rendering helperComonent with ID: ${id}`);
            return (
                 <HelperComponent
          id={id}
          cssClass={cssClass}
          text={props.text ?? props.caption}
          src={props.src || props.backgroundImage}   // supports either prop
          alt={props.alt ?? props.caption ?? props.text ?? ''}
          key={id}
        />
            );
        default:
            console.log(`Rendering GameScreen with ID: ${id}`);
            return (
                <div id={id} className={cssClass} key={id}>
                    {elements ? renderElements(elements) : children || props.text || null}
                </div>
            );
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
