import React, { memo } from 'react';

const JournalVariable = ({ cssClass, previousValue, value, caption, children, ...props }) => {
    const difference = value - previousValue;
    const sign = difference > 0 ? '+' : '';

    console.log('Journal Variable rendered');

    // Define inline styles. TODO Find another solution
    const wrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',

    };

    const valueStyle = {
        fontWeight: 'bold',
        fontSize: '2rem'

    };

    const differenceStyle = {
        fontWeight: 'bold',
        fontSize: '1.5rem'

    };

    const mainWrapperStyle = {
        marginTop: "1em",
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        justifyContent: "center",
        alignItems: "center"
    }


    return (

        <div style={mainWrapperStyle}>
            <div style={wrapperStyle}>
                <div style={valueStyle}>{value}</div>
                {difference !== 0 && (
                    <div style={differenceStyle}>
                        <sup>{sign}{difference}</sup>
                    </div>
                )}
            </div>
            <div className={`default-journal-variable-component ${cssClass}`}>{caption}</div>
        </div>
    );
};

export default memo(JournalVariable);


