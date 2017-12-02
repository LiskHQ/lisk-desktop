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
const gradients = gradientSpecs.map(spec => `url(#${spec.id})`);

const Gradients = ({ specs }) => (
  <defs>
    {specs.map(spec => (
      <linearGradient id={spec.id} key={spec.id}>
        {spec.colors.map((color, i) => (
          <stop stopColor={color} offset={`${i * (100 / (spec.colors.length - 1))}%`} key={i}/>
        ))}
      </linearGradient>
    ))}
  </defs>
);

const pickOne = (items, address, relevantIndex) => {
  const index = address.padStart(20, '0')[relevantIndex] % items.length;
  return items[index];
};

const computeTriangle = props => (
  {
    fill: props.fill,
    points: [
      {
        x: props.x + (props.size / 2),
        y: props.y,
      },
      {
        x: props.x + props.size,
        y: props.y + props.size,
      },
      {
        x: props.x,
        y: props.y + props.size,
      },
    ].map(({ x, y }) => (`${x},${y}`)).join(' '),
  }
);

const AccountVisual = ({ address, size = 200 }) => {
  const sizes = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ].map(x => x * (size / 20));

  const shapes = {
    circle: {
      cx: pickOne(sizes, address, 0) + (size / 4),
      cy: pickOne(sizes, address, 1) + (size / 4),
      r: pickOne(sizes, address, 2) / 2,
      fill: pickOne(gradients, address, 3),
    },
    square: {
      x: pickOne(sizes, address, 5),
      y: pickOne(sizes, address, 6),
      height: pickOne(sizes, address, 7),
      width: pickOne(sizes, address, 7),
      fill: pickOne(gradients, address, 8),
    },
    rect: {
      x: pickOne(sizes, address, 10),
      y: pickOne(sizes, address, 11) * 5,
      height: pickOne(sizes, address, 12) / 5,
      width: pickOne(sizes, address, 12),
      fill: pickOne(gradients, address, 13),
    },
    triangle: computeTriangle({
      x: pickOne(sizes, address, 15),
      y: pickOne(sizes, address, 15),
      size: pickOne(sizes, address, 16),
      fill: pickOne(gradients, address, 17),
    }),
  };
  return (
    <svg height={size} width={size}>
      <Gradients specs={gradientSpecs} />
      <circle {...shapes.circle} />
      <polygon {...shapes.triangle} />
      <rect {...shapes.square} />
      <rect {...shapes.rect} />
    </svg>
  );
};

export default AccountVisual;

