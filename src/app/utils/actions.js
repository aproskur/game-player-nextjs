import { useContext } from 'react';
import { GameScreenContext } from '../components/GameScreenRenderer';
import { findEntryPoint } from './renderUtils';

export const actionTypes = {
    changeColor: "changeColor",
    showDescription: "showDescription",
    requestServer: "requestServer"
};


function applyDeepUpdates(state, updates) {
    const findAndUpdate = (current, updates) => {
        if (!current || typeof current !== 'object') {
            return;
        }

        console.log('Current state:', JSON.stringify(current, null, 2));
        console.log('Updates to apply:', JSON.stringify(updates, null, 2));

        Object.keys(updates).forEach(key => {
            if (current.hasOwnProperty(key)) {
                if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
                    if (typeof current[key] === 'object' && current[key] !== null) {
                        console.log(`Recursively updating key: ${key}`);
                        findAndUpdate(current[key], updates[key]);
                    } else {
                        console.log(`Updating key: ${key} with value:`, updates[key]);
                        current[key] = updates[key];
                    }
                } else {
                    console.log(`Updating key: ${key} with value:`, updates[key]);
                    current[key] = updates[key];
                }
            } else {
                console.log(`Adding new key: ${key} with value:`, updates[key]);
                current[key] = updates[key];
            }
        });
    };

    console.log('Initial state:', JSON.stringify(state, null, 2));
    console.log('Initial updates:', JSON.stringify(updates, null, 2));

    let newState = JSON.parse(JSON.stringify(state));

    const traverseAndFind = (currentState, updateKey) => {
        if (!currentState || typeof currentState !== 'object') {
            return null;
        }

        if (currentState.hasOwnProperty(updateKey)) {
            return currentState;
        }

        for (const key in currentState) {
            if (currentState.hasOwnProperty(key)) {
                const result = traverseAndFind(currentState[key], updateKey);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    };

    Object.keys(updates).forEach(updateKey => {
        const targetObject = traverseAndFind(newState, updateKey);
        if (targetObject) {
            console.log(`Found target object for key: ${updateKey}`);
            findAndUpdate(targetObject, { [updateKey]: updates[updateKey] });
        } else {
            console.warn(`Target object for key: ${updateKey} not found.`);
        }
    });

    console.log('Updated state:', JSON.stringify(newState, null, 2));
    return newState;
}






export const actionHandlers = {
    changeColor: (props) => {
        console.log(`Changing color: ${props.color}`)
    },
    showDescription: (props) => {
        console.log(`Showing description: ${props.description}`);
    },
    requestServer: async (props, updateAppState, appState) => {
        console.log(`Component requests server`);
        console.log("APPSTATE passed to request server", appState);

        try {
            const bodyData = {
                action: 'Clicked'
            };

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

            let stateToUpdate;
            if (appState) {
                stateToUpdate = JSON.parse(JSON.stringify(appState)); // deep copy 
                console.log("stateToUpdate", stateToUpdate);
            } else {
                console.log("APPstate is undefined!!!!")
                stateToUpdate = {};
            }

            console.log("stateToUpdate BEFORE UPDATES", stateToUpdate);
            console.log("Current appState before applying updates:", JSON.parse(JSON.stringify(appState)));
            const newState = applyDeepUpdates(stateToUpdate, serverResponse.updates);
            console.log("appState after applying updates:", JSON.stringify(newState));
            updateAppState(newState);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
};


export const manageActions = (actionData, id, actionHandlers, updateAppState, appState) => {
    if (!actionData || !actionData.proc) return;

    const innerAction = actionData.proc;
    const actionHandler = actionHandlers[innerAction];
    if (actionHandler) {
        actionHandler(actionData.props || id, updateAppState, appState);
    }
};

