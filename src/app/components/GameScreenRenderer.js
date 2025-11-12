'use client';
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import renderComponent from '../utils/renderer';
import { appStateActionTypes } from '../utils/stateActions';
import { applyStateUpdates } from '../utils/applyStateUpdates';

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
const initialReducerState = {
    status: 'idle',
    appState: null,
    error: null,
};

const appStateReducer = (state, action) => {
    switch (action.type) {
        case appStateActionTypes.LOAD_START:
            return { ...state, status: 'loading', error: null };
        case appStateActionTypes.LOAD_SUCCESS:
            return { status: 'ready', appState: action.payload ?? null, error: null };
        case appStateActionTypes.LOAD_FAILURE:
            return { status: 'error', appState: null, error: action.payload ?? 'Failed to load data' };
        case appStateActionTypes.REPLACE_STATE:
            return { ...state, appState: action.payload ?? null };
        case appStateActionTypes.APPLY_PATCH:
            if (!state.appState || !action.payload) {
                return state;
            }
            return {
                ...state,
                appState: applyStateUpdates(state.appState, action.payload),
            };
        default:
            return state;
    }
};

const GameScreenRenderer = ({ children, localDevelopment = false }) => {
    const [{ appState, status, error }, dispatch] = useReducer(appStateReducer, initialReducerState);

    useEffect(() => {
        let cancelled = false;
        const loadData = async () => {
            dispatch({ type: appStateActionTypes.LOAD_START });
            try {
                let nextState;
                if (localDevelopment) {
                    const { loadLocalData } = await import('../utils/localDataLoader');
                    nextState = loadLocalData();
                } else {
                    const { fetchServerData } = await import('../utils/serverDataLoader');
                    nextState = await fetchServerData();
                }
                if (!cancelled) {
                    dispatch({ type: appStateActionTypes.LOAD_SUCCESS, payload: nextState });
                }
            } catch (err) {
                if (!cancelled) {
                    dispatch({
                        type: appStateActionTypes.LOAD_FAILURE,
                        payload: err?.message ?? 'Failed to load data',
                    });
                }
            }
        };

        loadData();
        return () => {
            cancelled = true;
        };
    }, [localDevelopment]);


    /**
     * Exposes reducer dispatch so nested components can trigger state transitions.
     */
    const dispatchAppState = useCallback((action) => {
        dispatch(action);
    }, [dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const entryPointKey = appState ? Object.keys(appState)[0] : null;
    const renderedComponent = appState && entryPointKey ? renderComponent(appState[entryPointKey]) : null;

    return (
        <GameScreenContext.Provider value={{ appState, dispatchAppState }}>
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
 * @returns {{ appState: any, dispatchAppState: React.Dispatch }}
 */
export const useGameScreenState = () => useContext(GameScreenContext);
