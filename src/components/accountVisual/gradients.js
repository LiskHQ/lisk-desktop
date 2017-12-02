import React from 'react';

const gradientSpecs = [
  {
    id: 'purpleGradient',
    colors: ['#3023AE', '#C86DD7'],
    rotate: 0,
  }, {
    id: 'lightBlueGradient',
    colors: ['#DBD4FF', '#0792FF'],
    rotate: 10,
  }, {
    id: 'darkBlueGradient',
    colors: ['#DBD4FF', '#519AEC'],
    rotate: 20,
  }, {
    id: 'greenBlueGradient',
    colors: ['#3023AE', '#53A0FD', '#B4EC51'],
    rotate: 30,
  }, {
    id: 'redPurpleGradient',
    colors: ['#FF3537', '#4D04AD'],
    rotate: 40,
  }, {
    id: 'orangeGradient',
    colors: ['#C80039', '#FF6236'],
    rotate: 50,
  }, {
    id: 'blueOrangeGradient',
    colors: ['#3023AE', '#FF6236'],
    rotate: 60,
  }, {
    id: 'greenPurpleGradient',
    colors: ['#B4EC51', '#3023AE'],
    rotate: 70,
  }, {
    id: 'bluePurpleRedGradient',
    colors: ['#DBD4FF', '#4D04AD', '#FF3537'],
    rotate: 80,
  }, {
    id: 'orangeGreenGradient',
    colors: ['#C80039', '#FF6236', '#B4EC51'],
    rotate: 90,
  },
];

export const gradientIds = gradientSpecs.map(spec => `url(#${spec.id})`);

export const Gradients = () => (
  <defs>
    {gradientSpecs.map(spec => (
      <linearGradient id={spec.id} key={spec.id} gradientTransform={`rotate(${spec.rotate})`}>
        {spec.colors.map((color, i) => (
          <stop stopColor={color} offset={`${i * (100 / (spec.colors.length - 1))}%`} key={i}/>
        ))}
      </linearGradient>
    ))}
  </defs>
);
