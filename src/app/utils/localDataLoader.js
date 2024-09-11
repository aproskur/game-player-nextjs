import screen from '../data/screen_s1.json';
import { findEntryPoint } from './renderUtils';

export const loadLocalData = () => {
    console.log("I am developing locally, I don't get data from SERVER");

    // Extract the entry point and state data
    const entryPointKey = findEntryPoint(screen);
    const appState = { [entryPointKey]: screen.application.elements[entryPointKey] };

    console.log(appState, "from local loader")

    return appState;
};
