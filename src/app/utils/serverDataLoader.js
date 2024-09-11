
import { findEntryPoint } from './renderUtils';

export const fetchServerData = async () => {
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
        const appState = { [entryPointKey]: jsonData.application.elements[entryPointKey] };

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

        return appState;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Fetch request timed out');
        } else {
            console.error('Error in fetchServerData:', error.message);
        }
        throw error;
    }
};
