import React from 'react';

const GlassPanel = ({ children, className = '', hoverEffect = false, ...props }) => {
    return (
        <div
            className={`glass-panel rounded-2xl ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassPanel;
