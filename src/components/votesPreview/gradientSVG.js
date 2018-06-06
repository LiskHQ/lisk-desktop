import React from 'react';

const GradientSVG = ({
  startColor, endColor, id, rotation,
}) => {
  const gradientTransform = `rotate(${rotation})`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={id} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientSVG;
