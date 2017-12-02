import React from 'react';

const gradients = [
  'url(#purpleGradient)',
  'url(#lightBlueGradient)',
  'url(#darkBlueGradient)',
  'url(#greenBlueGradient)',
  'url(#redPurpleGradient)',
];

const Gradients = () => (
  <defs>
    <linearGradient id="purpleGradient">
      <stop stopColor="#3023AE" offset="0%"/>
      <stop stopColor="#C86DD7" offset="100%"/>
    </linearGradient>
    <linearGradient id="lightBlueGradient">
      <stop stopColor="#DBD4FF" offset="0%"/>
      <stop stopColor="#0792FF" offset="100%"/>
    </linearGradient>
    <linearGradient id="darkBlueGradient">
      <stop stopColor="#3023AE" offset="0%"/>
      <stop stopColor="#519AEC" offset="100%"/>
    </linearGradient>
    <linearGradient id="greenBlueGradient">
      <stop stopColor="#3023AE" offset="0%"/>
      <stop stopColor="#53A0FD" offset="50%"/>
      <stop stopColor="#B4EC51" offset="100%"/>
    </linearGradient>
    <linearGradient id="redPurpleGradient">
      <stop stopColor="#FF3537" offset="0%"/>
      <stop stopColor="#4D04AD" offset="100%"/>
    </linearGradient>
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
      <Gradients />
      <circle {...props.circle} />
      <polygon {...computeTriangle(props.triangle)} />
      <rect {...props.square} />
      <rect {...props.rect} />
    </svg>
  );
};

export default AccountVisual;

