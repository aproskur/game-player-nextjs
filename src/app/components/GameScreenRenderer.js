'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import renderComponent from '../utils/renderer';
import { findEntryPoint } from '../utils/renderUtils';
import screen from '../data/screen_s1.json'; // Import local JSON data

export const GameScreenContext = createContext();

const GameScreenRenderer = ({ children, localDevelopment = false }) => {
    const [appState, setAppState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (localDevelopment) {
                console.log("I am developing locally, I don't get data from SERVER");

                // Directly set the appState from local JSON data
                const entryPointKey = findEntryPoint(screen);
                setAppState({ [entryPointKey]: screen.application.elements[entryPointKey] });

                // CSS
                // for local dvelopment css is taken from global.css file that is directly imported into page.js

                setLoading(false);
            } else {
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

                    // Inject CSS dynamically
                    const cssFile = jsonData.application.cssFile;
                    if (cssFile) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = cssFile;

                        link.onload = () => console.log('CSS file loaded successfully');
                        link.onerror = (err) => console.error('Error loading CSS file:', err);

                        document.head.appendChild(link);
                    }
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
            }
        };

        fetchData();
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
