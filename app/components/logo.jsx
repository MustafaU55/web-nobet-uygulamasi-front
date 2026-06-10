import React from 'react';

const Logo = () => {
    return (
        <svg
            viewBox="0 0 100 50" 
            width="100px"
            height="50px"
        >
            <defs>
                <style>
                    {`
                        .logo-text {
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 38px;
                            font-weight: bold;
                            fill: #4E4FEB;
                        }
                    `}
                </style>
            </defs>
            
            <g opacity="0.1">
                <circle
                    cx="50"
                    cy="25"
                    r="12"
                    fill="none"
                    stroke="#4E4FEB"
                    strokeWidth="4"
                />
            </g>

            <text x="10" y="38" className="logo-text">R</text>

            <circle
                id="loading-circle"
                cx="50"
                cy="25"
                r="12"
            />
            
            <text x="70" y="38" className="logo-text">3</text>
        </svg>
    );
};

export default Logo;