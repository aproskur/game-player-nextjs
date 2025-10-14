import React from 'react';
import GameScreen from '../components/gameComponents/GameScreen';
import GameArea from '../components/gameComponents/GameArea';
import GameVariable from '../components/gameComponents/GameVariable';
import GameCard from '../components/gameComponents/GameCard';
import GameButton from '../components/gameComponents/GameButton';
import JournalVariable from '../components/gameComponents/JournalVariable';
import HelperComponent from '../components/gameComponents/HelperComponent';

// Fallback renderer for schema nodes the lookup table does not understand.
// Keeps the tree rendering instead of crashing when new component types appear.
const renderFallbackComponent = ({ id, cssClass, elements, children, props }) => (
    <div id={id} className={cssClass} key={id}>
        {elements ? renderElements(elements) : (children ?? props.text ?? null)}
    </div>
);

// Every entry maps a schema "component" identifier to a real React component.
// The renderer deconstructs the normalized props so legacy `cssInline` and the
// newer `css` field are both supported while walking child `elements`.
const componentRenderers = {
    screenComponent: ({ id, cssClass, elements, props }) => {
        console.log(`Rendering GameScreen with ID: ${id}`);
        return (
            <GameScreen
                id={id}
                cssClass={cssClass}
                cssInline={props.cssInline}
                style={props.css}
                backgroundImage={props.backgroundImage}
                key={id}
            >
                {renderElements(elements)}
            </GameScreen>
        );
    },
    areaComponent: ({ id, cssClass, elements, props }) => (
        <GameArea
            id={id}
            cssClass={cssClass}
            style={props.css}          // new schema
            cssInline={props.cssInline} // old schema
            backgroundImage={props.backgroundImage}
            key={id}
        >
            {renderElements(elements)}
        </GameArea>
    ),
    gameVariableComponent: ({ id, cssClass, props }) => {
        console.log(`Rendering GameScreen with ID: ${id}`);
        return (
            <GameVariable
                id={id}
                cssClass={cssClass}
                cssInline={props.cssInline}
                style={props.css}
                backgroundImage={props.backgroundImage}
                caption={props.caption}
                description={props.description}
                value={props.value}
                actions={props.actions}
                key={id}
            />
        );
    },
    journalVariableComponent: ({ id, cssClass, props }) => (
        <JournalVariable
            id={id}
            cssClass={cssClass}
            style={props.css}        // new schema
            cssInline={props.cssInline} // old schema
            caption={props.caption}
            value={props.value}
            previousValue={props.previousValue}
            actions={props.actions}
            key={id}
        />
    ),
    cardComponent: ({ id, cssClass, props }) => {
        console.log(`Rendering GameScreen with ID: ${id}`);
        return (
            <GameCard
                id={id}
                cssClass={cssClass}
                key={id}
                text={props.text}
                actions={props.actions}
                backgroundImage={props.backgroundImage}
                style={props.css}            // new schema
                cssInline={props.cssInline}  // old schema
            />
        );
    },
    buttonComponent: ({ id, cssClass, props }) => {
        console.log(`Rendering GameScreen with ID: ${id}`);
        return (
            <GameButton
                id={id}
                cssClass={cssClass}
                style={props.css}            // NEW
                cssInline={props.cssInline}  // OLD
                caption={props.caption}
                key={id}
                backgroundImage={props.backgroundImage}
                actions={props.actions}
            />
        );
    },
    helperComponent: ({ id, cssClass, props }) => (
        <HelperComponent
            id={id}
            cssClass={cssClass}
            text={props.text ?? props.caption}
            caption={props.caption}
            src={props.src}
            backgroundImage={props.backgroundImage}
            cssInline={props.cssInline}  // old schema
            style={props.css}            // new schema
            alt={props.alt ?? props.caption ?? props.text ?? ''}
            key={id}
        />
    ),
};

/**
 * Resolves a schema node into the matching React component instance.
 * The schema originates from the server/fixtures and describes a component type,
 * its styling, and potential child elements keyed by id.
 *
 * @param {Object} componentData - Schema node describing the component to render.
 * @param {string} componentData.component - Identifier for the target component type.
 * @param {Object<string, Object>} [componentData.elements] - Child nodes keyed by element id.
 * @param {string} [componentData.id] - Stable identifier assigned during preprocessing.
 * @param {string} [componentData.cssClass] - Optional className applied to the rendered component.
 * @returns {React.ReactNode}
 */
function renderComponent(componentData) {
    if (!componentData) {
        return null;
    }


    const { component: ComponentType, elements, id, cssClass, children, ...props } = componentData;

    console.log(`Rendering component: ${ComponentType} with ID: ${id}`, componentData);

    // Gracefully fall back to a generic div when the schema references an unknown component.
    const renderer = componentRenderers[ComponentType] ?? renderFallbackComponent;
    return renderer({ id, cssClass, elements, children, props, componentType: ComponentType });
}

/**
 * Maps child schema objects to rendered React elements while preserving their keys.
 * Elements arrive as a dictionary; this function turns them into an array and ensures
 * each child inherits a stable `id` (falling back to the dictionary key) before delegating
 * back to `renderComponent`.
 *
 * @param {Object<string, Object>} elements - Collection of child nodes keyed by schema id.
 * @returns {React.ReactNode[] | null}
 */
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

        const newValue = { ...value, id: value.id ?? key };
        console.log('New value with id:', newValue);
        console.log("render elements func END");

        return renderComponent(newValue);
    });
}

export default renderComponent;
