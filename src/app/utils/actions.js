import { useContext } from 'react';
import { GameScreenContext } from '../components/GameScreenRenderer';
import { findEntryPoint } from './renderUtils';

export const actionTypes = {
    changeColor: "changeColor",
    showDescription: "showDescription",
    requestServer: "requestServer"
};


/*
    changeColorById: (props) => {
        const { id, color } = props;
        const element = document.Element.getElementById(id);
        if (element) {
            element.style.color = color
        }
    },

*/

/*
const applyUpdates = (currentState, updates) => {
    Object.keys(updates).forEach(key => {
        if (key === 'elements' && typeof updates[key] === 'object') {
            applyUpdates(currentState[key], updates[key]);
        } else if (typeof updates[key] === 'object' && updates[key] !== null && currentState[key]) {
            applyUpdates(currentState[key], updates[key]);
        } else {
            currentState[key] = updates[key];
        }
    });
}; */

/*
const applyUpdates = (currentState, updates) => {
    console.log("CURRENT STATE from applyUPDATES", currentState)
    console.log("UPDATES from applyUpdates", updates)
    Object.keys(updates).forEach(key => {
        console.log(`Processing key: ${key}`);
        if (typeof updates[key] === 'object' && updates[key] !== null) {
            if (!currentState[key])
                currentState[key] = {};
            applyUpdates(currentState[key], updates[key]);
        } else {
            console.log(`Updating key ${key} from ${currentState[key]} to ${updates[key]}`); // Debugging line
            currentState[key] = updates[key];
        }
    });
}; */
/*
const applyUpdates = (currentState, updates) => {
    return Object.keys(updates).reduce((newState, key) => {
        console.log(`Applying updates to key: ${key}`);
        if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
            // If the current key is an object, recurse into it
            newState[key] = applyUpdates(currentState[key] || {}, updates[key]);
        } else {
            newState[key] = updates[key];
        }
        return newState;
    }, { ...currentState });
};

*/

//needs obect with all fields
const applyUpdates = (currentState, updates) => {
    const applyRecursive = (current, updates) => {
        Object.keys(current).forEach(key => {
            if (current[key] !== null && typeof current[key] === 'object' && !Array.isArray(current[key])) {
                //Continue searching recursively through objects
                applyRecursive(current[key], updates);
            }
            //Check if the current key is one of the keys that needs to be updated
            if (updates.hasOwnProperty(key)) {
                console.log(`Updating key: ${key} from`, current[key], `to`, updates[key]);
                current[key] = updates[key];
            }
        });
    };

    // Create a deep copy of the current state to mutate
    let newState = JSON.parse(JSON.stringify(currentState));
    applyRecursive(newState, updates);
    return newState;
};




function applyDeepUpdates(state, updates) {
    const findAndUpdate = (current, updates) => {
        if (!current || typeof current !== 'object') {
            return;
        }

        //apply updates to existing keys
        Object.keys(updates).forEach(key => {
            if (current.hasOwnProperty(key)) {
                if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
                    if (typeof current[key] === 'object' && current[key] !== null) {
                        findAndUpdate(current[key], updates[key]);
                    } else {
                        current[key] = updates[key];
                    }
                } else {
                    current[key] = updates[key];
                }
            } else if (!current.hasOwnProperty(key)) {
                //If the key does not exist in current, add it
                current[key] = updates[key];
            }
        });

        //recursively update nested objects even if not in updates
        Object.keys(current).forEach(key => {
            if (typeof current[key] === 'object' && current[key] !== null && !updates.hasOwnProperty(key)) {
                findAndUpdate(current[key], updates);
            }
        });
    };

    let newState = JSON.parse(JSON.stringify(state));
    findAndUpdate(newState, updates);
    return newState;
}







export const actionHandlers = {
    changeColor: (props) => {
        console.log(`Changing color: ${props.color}`)
    },
    showDescription: (props) => {
        console.log(`Showing description: ${props.description}`);
    },
    requestServer: (props, updateAppState, appState) => {
        console.log(`Component requests server`);
        console.log("APPSTATE passed to reques server", appState);



        const serverResponse = {
            "updates": {
                "pro": {
                    "value": 10,
                },
                "rep": {
                    "value": 6,
                },
                "score": {
                    "value": 55,
                },
                "C1": {
                    "backgroundImage": "./images/ledyanoy-fon.png",
                    "text": ""
                },
            },
        }


        /*
                const newState = { ...appState }; //shallow copy
        */

        let stateToUpdate;
        if (appState) {
            stateToUpdate = JSON.parse(JSON.stringify(appState));  //deep copy 
            console.log("stateTuUpdate", stateToUpdate);

        } else {
            //Handle if appState is undefined
            console.log("APPstate is undefined!!!!")
            stateToUpdate = {};
        }
        console.log("stateTuUpdate BEFORE UPDATES", stateToUpdate);
        console.log("Current appState before applying updates:", JSON.parse(JSON.stringify(appState)));
        const newState = applyDeepUpdates(stateToUpdate, serverResponse.updates);
        console.log("appState after applying updates:", JSON.stringify(newState));
        updateAppState(newState);
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


