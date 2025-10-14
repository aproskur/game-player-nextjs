'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import renderComponent from '../utils/renderer';

/**
 * Provides the current game screen state and updater to the component tree.
 */
export const GameScreenContext = createContext();

/**
 * Hydrates the game screen by loading state data, rendering the entry component,
 * and exposing a context for downstream components to read and update the state.
 * @param {object} props
 * @param {React.ReactNode} props.children - Optional children rendered alongside the game screen.
 * @param {boolean} [props.localDevelopment=false] - Switches data loading between local fixtures and the server.
 * @returns {JSX.Element}
 */
const GameScreenRenderer = ({ children, localDevelopment = false }) => {
    const [{ appState, loading, error }, setState] = useState({
        appState: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        console.log("Starting to load data");
        let cancelled = false;
        const loadData = async () => {
            try {
                setState((prev) => {
                    if (cancelled) {
                        return prev;
                    }
                    return { ...prev, loading: true, error: null };
                });
                let appState;
                if (localDevelopment) {
                    const { loadLocalData } = await import('../utils/localDataLoader');
                    appState = loadLocalData();
                } else {
                    const { fetchServerData } = await import('../utils/serverDataLoader');
                    appState = await fetchServerData();
                }
                if (!cancelled) {
                    setState({ appState, loading: false, error: null });
                }
            } catch (error) {
                if (!cancelled) {
                    setState({ appState: null, loading: false, error: 'Failed to load data' });
                }
            } finally {
            }
        };

        loadData();
        return () => {
            cancelled = true;
        };
    }, [localDevelopment]);


    /**
     * Replaces the current app state with the provided value.
     * @param {unknown} newState - Fully updated application state tree.
     */
    const updateAppState = (newState) => {
        setState((prev) => ({ ...prev, appState: newState }));
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

/**
 * Convenience hook for consumers that need the game screen context.
 * @returns {{ appState: any, updateAppState: (newState: unknown) => void }}
 */
export const useGameScreenState = () => useContext(GameScreenContext);
