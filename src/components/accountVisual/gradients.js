import React from 'react';

const gradientSpecs = [
  {
    id: 'purpleGradient',
    colors: ['#3023AE', '#C86DD7'],
  },
  {
    id: 'lightBlueGradient',
    colors: ['#DBD4FF', '#0792FF'],
  },
  {
    id: 'darkBlueGradient',
    colors: ['#DBD4FF', '#519AEC'],
  },
  {
    id: 'greenBlueGradient',
    colors: ['#3023AE', '#53A0FD', '#B4EC51'],
  },
  {
    id: 'redPurpleGradient',
    colors: ['#FF3537', '#4D04AD'],
  },
];

export const gradientIds = [
  ...gradientSpecs.map(spec => `url(#${spec.id})`),
  ...gradientSpecs.map(spec => `url(#${spec.id})`),
];

export const Gradients = () => (
  <defs>
    {gradientSpecs.map(spec => (
      <linearGradient id={spec.id} key={spec.id}>
        {spec.colors.map((color, i) => (
          <stop stopColor={color} offset={`${i * (100 / (spec.colors.length - 1))}%`} key={i}/>
        ))}
      </linearGradient>
    ))}
  </defs>
);
