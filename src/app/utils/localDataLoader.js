import screen from '../data/screen_s1.json';
import screen2 from '../data/screen_leftsidebar.json'
import { findEntryPoint } from './renderUtils';

// Local-only helper that hydrates the renderer with bundled fixtures instead of a live backend.
// These JSON files mirror the remote schema format; findEntryPoint picks the entry child so the
// GameScreenRenderer produces the same tree you would get from fetchServerData.
// Replace with real fetch logic when localDevelopment=false.
export const loadLocalData = () => {
    console.log("I am developing locally, I don't get data from SERVER");

    // Extract the entry point and state data
    const entryPointKey = findEntryPoint(screen);
    const appState = { [entryPointKey]: screen.application.elements[entryPointKey] };

    console.log(appState, "from local loader")

    return appState;
};
