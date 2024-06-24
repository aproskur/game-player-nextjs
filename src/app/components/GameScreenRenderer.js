'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import renderComponent from '../utils/renderer';
import { findEntryPoint } from '../utils/renderUtils';

export const GameScreenContext = createContext();

const GameScreenRenderer = ({ children }) => {
    true
    const [appState, setAppState] = useState(null);
    const [loading, setLoading] = useState();
    const [error, setError] = useState(null);


    //SEND START AND token. POST
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'hiiamhardcodedtoken';
                const bodyData = {
                    action: 'StartGame',
                    token: token
                };

                console.log('Making fetch call with body:', bodyData);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch('http://188.120.246.243:3000/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                console.log('Fetch call completed');

                if (!response.ok) {
                    console.error('Response not OK:', response.status, response.statusText);
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const jsonData = await response.json();
                console.log("JSONDATA", jsonData);

                const entryPointKey = findEntryPoint(jsonData);
                setAppState({ [entryPointKey]: jsonData.application.elements[entryPointKey] });
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error('Fetch request timed out');
                } else {
                    console.error('Error in fetchData:', error.message);
                }
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);





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
