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
      id: 'Orange-2',
      colors: ['#FFD300', '#FF9100'],
      rotate: -225,
    },
    secondary: {
      id: 'White-2',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    },
    additional: [{
      id: 'Blue-2',
      colors: ['#92BEFF', '#598AFF'],
      rotate: -225,
    }, {
      id: 'Gray-2',
      colors: ['#E2E7FF', '#C1CBFF'],
      rotate: -255,
    }, {
      id: 'Blue-2.2',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'Pink-2',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  }, {
    primary: {
      id: 'Purple-3',
      colors: ['#840AD6', '#4D04AD'],
      rotate: -225,
    },
    secondary: {
      id: 'Pink-3',
      colors: ['#F792A6', '#EC596D'],
      rotate: -225,
    },
    additional: [{
      id: 'Red-3',
      colors: ['#C747BB', '#962286'],
      rotate: -225,
    }, {
      id: 'Spew-3',
      colors: ['#D8AADF', '#B071BC'],
      rotate: -255,
    }, {
      id: 'Blue-3',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'Pink-3.2',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  }, {
    primary: {
      id: 'Purple-4',
      colors: ['#D876FF', '#A142D5'],
      rotate: -255,
    },
    secondary: {
      id: 'Blue-4',
      colors: ['#7B56FF', '#4029B8'],
      rotate: -225,
    },
    additional: [{
      id: 'Blue-4.2',
      colors: ['#00C0FF', '#004DFF'],
      rotate: -225,
    }, {
      id: 'Blue-4.3',
      colors: ['#53C7FF', '#1B97FF'],
      rotate: -255,
    }, {
      id: 'Pink-4',
      colors: ['#FF89B4', '#BA019C'],
      rotate: -255,
    }, {
      id: 'Orange-4',
      colors: ['#FFCF20', '#FF5C00'],
      rotate: -225,
    }],
  }, {
    primary: {
      id: 'Orange-5',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    },
    secondary: {
      id: 'Purple-5',
      colors: ['#3023AE', '#C86DD7'],
      rotate: -45,
    },
    additional: [{
      id: 'Blue-5',
      colors: ['#3023AE', '#53A0FD'],
      rotate: -45,
    }, {
      id: 'Orange-5.2',
      colors: ['#FFCF20', '#FF5C00'],
      rotate: -255,
    }, {
      id: 'Blue-5.2',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'Pink-5',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  }, {
    primary: {
      id: 'Pink-6',
      colors: ['#FF89B4', '#BA019C'],
      rotate: -255,
    },
    secondary: {
      id: 'White-6',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    },
    additional: [{
      id: 'Pink-6.2',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }, {
      id: 'Blue-6',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'Blue-6.2',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -255,
    }, {
      id: 'Orange-6',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    }],
  }, {
    primary: {
      id: 'Blue-7',
      colors: ['#17499B', '#3C7FB4'],
      rotate: -45,
    },
    secondary: {
      id: 'Gray-7',
      colors: ['#A3C2E6', '#3C5068'],
      rotate: -225,
    },
    additional: [{
      id: 'Blue-7.2',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -225,
    }, {
      id: 'Orange-7',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -255,
    }, {
      id: 'Green-7',
      colors: ['#96F7E1', '#5DECBF'],
      rotate: -255,
    }, {
      id: 'Green-7.2',
      colors: ['#00B491', '#007D58'],
      rotate: -225,
    }],
  }, {
    primary: {
      id: 'Black-8',
      colors: ['#122037', '#243847'],
      rotate: -45,
    },
    secondary: {
      id: 'Gray-8',
      colors: ['#7192B9', '#3A5E89'],
      rotate: -225,
    },
    additional: [{
      id: 'Blue-8',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -225,
    }, {
      id: 'Green-8',
      colors: ['#95D425', '#33B200'],
      rotate: -255,
    }, {
      id: 'Green-8-2',
      colors: ['#96F7E1', '#5DECBF'],
      rotate: -255,
    }, {
      id: 'Green-8.3',
      colors: ['#00B491', '#007D58'],
      rotate: -255,
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
