import { findEntryPoint } from './renderUtils';
import journal from '../data/screen_j.json';
import screenWithCard from '../data/screen_hint.json';
import screen2 from '../data/screen_leftsidebar.json';
import screen_s1 from '../data/screen_s1.json';
import { appStateActionTypes } from './stateActions';

// Local fixtures mirror backend payloads so actions can swap screens offline during dev.

// Catalog of action identifiers shared between schema payloads and client handlers.
export const actionTypes = {
    changeColor: "changeColor",
    showDescription: "showDescription",
    requestServer: "requestServer",
    showHistory: "showHistory",
    showHint: "showHint",
    showScreenLeft: "showScreenWithLeftSideBar",
    showTopBar: "showTopBar"
};


// Declarative map tying action names to concrete UI transitions or side effects.
export const actionHandlers = {
    changeColor: (props) => {
        console.log(`Changing color: ${props.color}`)
    },
    showScreenLeft: (props, dispatchAppState) => {
        const screen = screen2;
        const entryPointKey = findEntryPoint(screen2);
        const newAppState = { [entryPointKey]: screen2.application.elements[entryPointKey] };
        dispatchAppState({
            type: appStateActionTypes.REPLACE_STATE,
            payload: newAppState,
        });

    },
       showTopBar: (props, dispatchAppState) => {
        const screen = screen_s1;
        const entryPointKey = findEntryPoint(screen);
        const newAppState = { [entryPointKey]: screen.application.elements[entryPointKey] };
        dispatchAppState({
            type: appStateActionTypes.REPLACE_STATE,
            payload: newAppState,
        });

    },
        showHint: (props, dispatchAppState) => {
        console.log(`Showing hint: HI`)
        const hint = screenWithCard;
        const entryPointKey = findEntryPoint(hint);
        const newAppState = { [entryPointKey]: hint.application.elements[entryPointKey] };
        dispatchAppState({
            type: appStateActionTypes.REPLACE_STATE,
            payload: newAppState,
        });
    },
    showDescription: (props) => {
        console.log("DESCRIPTION CLICKED")
        console.log(`Showing description: ${props.description}`);
    },
    showHistory: (props, dispatchAppState) => {
        console.log("ЖУРНАЛ ХОДОВ clicked");
        console.log(props.actions)

        // Use fixtures so the journal view can render without calling the live backend.
        const history = journal;
        const entryPointKey = findEntryPoint(history);
        console.log("HISTORY entry", entryPointKey);
        const newAppState = { [entryPointKey]: history.application.elements[entryPointKey] };
        dispatchAppState({
            type: appStateActionTypes.REPLACE_STATE,
            payload: newAppState,
        });
    },
    requestServer: async (props, dispatchAppState, appState) => {
        console.log(`Component requests server`);
        console.log("APPSTATE passed to request server", appState);



        try {
            const bodyData = {
                action: 'Clicked'
            };

            // Proxy player actions to the remote engine, expecting a diff can merge locally.
            const response = await fetch('http://188.120.246.243:3000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const serverResponse = await response.json();

            dispatchAppState({
                type: appStateActionTypes.APPLY_PATCH,
                payload: serverResponse.updates,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
};


// Lightweight dispatcher invoked by components, shielding them from handler lookup details.
export const manageActions = (actionData, id, actionHandlers, dispatchAppState, appState) => {
    if (!actionData || !actionData.proc) return;

    const innerAction = actionData.proc;
    const actionHandler = actionHandlers[innerAction];
    if (actionHandler) {
        actionHandler(actionData.props || id, dispatchAppState, appState);
    }
};
