import React from 'react';

const gradSpecs = [
  {
    primary: {
      id: 'Green-1',
      colors: ['#96F7E1', '#5DECBF'],
      rotate: -225,
    },
    secondary: {
      id: 'Gray-1',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    },
    additional: [{
      id: 'Orange-1',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    }, {
      id: 'Purple-1',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'Blue-1',
      colors: ['#00C0FF', '#004DFF'],
      rotate: -255,
    }, {
      id: 'Green-1.2',
      colors: ['#00DABE', '#00B38A'],
      rotate: -45,
    }],
  }, {
    primary: {
      id: 'Purple-2',
      colors: ['#840AD6', '#4D04AD'],
      rotate: -225,
    },
    secondary: {
      id: 'Pink-2',
      colors: ['#F792A6', '#EC596D'],
      rotate: -225,
    },
    additional: [{
      id: 'Red-2',
      colors: ['#C747BB', '#962286'],
      rotate: -225,
    }, {
      id: 'Spew-2',
      colors: ['#D8AADF', '#B071BC'],
      rotate: -45,
    }, {
      id: 'Blue-2',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -255,
    }, {
      id: 'Pink-2.2',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  },
];

const addUrl = spec => ({
  ...spec,
  url: `url(#${spec.id})`,
});

export const gradientSchemes = gradSpecs.map(spec => ({
  primary: addUrl(spec.primary),
  secondary: addUrl(spec.secondary),
  additional: spec.additional.map(addUrl),
}));

export const Gradients = ({ scheme }) => (
  <defs>
    {[scheme.primary, scheme.secondary, ...scheme.additional].map(spec => (
      <linearGradient id={spec.id} key={spec.id} gradientTransform={`rotate(${spec.rotate})`}>
        {spec.colors.map((color, i) => (
          <stop stopColor={color} offset={`${i * (100 / (spec.colors.length - 1))}%`} key={i}/>
        ))}
      </linearGradient>
    ))}
  </defs>
);
