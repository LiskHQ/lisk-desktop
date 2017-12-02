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

const pickOne = (items, address, bit) => {
  const index = address[bit] % items.length;
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

  const props = {
    circle: {
      r: pickOne(sizes, address, 0) / 2,
      cx: pickOne(sizes, address, 1) + (size / 4),
      cy: pickOne(sizes, address, 2) + (size / 4),
      fill: pickOne(gradients, address, 3),
    },
    square: {
      x: pickOne(sizes, address, 4),
      y: pickOne(sizes, address, 5),
      height: pickOne(sizes, address, 6),
      width: pickOne(sizes, address, 6),
      fill: pickOne(gradients, address, 7),
    },
    rect: {
      x: pickOne(sizes, address, 8),
      y: pickOne(sizes, address, 9) * 5,
      height: pickOne(sizes, address, 10) / 5,
      width: pickOne(sizes, address, 10),
      fill: pickOne(gradients, address, 12),
    },
    triangle: {
      x: pickOne(sizes, address, 13),
      y: pickOne(sizes, address, 14),
      size: pickOne(sizes, address, 15),
      fill: pickOne(gradients, address, 16),
    },
  };
  return (
    <svg height={size} width={size}>
      <Gradients specs={gradientSpecs} />
      <circle {...props.circle} />
      <polygon {...computeTriangle(props.triangle)} />
      <rect {...props.square} />
      <rect {...props.rect} />
    </svg>
  );
};

export default AccountVisual;

