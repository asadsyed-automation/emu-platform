import React from 'react';

export const EmuLogo = ({ size = 40, className = '', style = {} }) => {
  return (
    <img
      src="/logo.png"
      alt="EMU Platform Logo"
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        borderRadius: '6px',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};
