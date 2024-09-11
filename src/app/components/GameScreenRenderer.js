'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import renderComponent from '../utils/renderer';

export const GameScreenContext = createContext();

const GameScreenRenderer = ({ children, localDevelopment = false }) => {
    const [appState, setAppState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // DEBUG finding cause of rerenders
    useEffect(() => {
        console.log('AppState changed:', appState);
    }, [appState]);



    // TODO Find cause of multiple rerenders!!!
    useEffect(() => {
        console.log("Starting to load data");
        const loadData = async () => {
            try {
                setLoading(true);  // Triggering rerender
                let appState;
                if (localDevelopment) {
                    const { loadLocalData } = await import('../utils/localDataLoader');
                    appState = loadLocalData();
                } else {
                    const { fetchServerData } = await import('../utils/serverDataLoader');
                    appState = await fetchServerData();
                }
                setAppState(appState);  // Triggering rerender
            } catch (error) {
                setError('Failed to load data');  // Triggering rerender
            } finally {
                setLoading(false);  // Triggering re-render
            }
        };

        loadData();
    }, [localDevelopment]);


    const updateAppState = (newState) => {
        setAppState(newState);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const entryPointKey = appState ? Object.keys(appState)[0] : null;
    const renderedComponent = appState && entryPointKey ? renderComponent(appState[entryPointKey]) : null;

    return (
        <GameScreenContext.Provider value={{ appState, updateAppState }}>
            <div>
                {renderedComponent}
                {children}
            </div>
        </GameScreenContext.Provider>
    );
};

export default GameScreenRenderer;

export const useGameScreenState = () => useContext(GameScreenContext);
