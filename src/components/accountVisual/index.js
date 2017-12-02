import React from 'react';
import { gradientIds, Gradients } from './gradients';

const computeTriangle = props => (
  {
    fill: props.fill,
    points: [{
      x: props.x + (props.size / 2),
      y: props.y,
    }, {
      x: props.x + props.size,
      y: props.y + props.size,
    }, {
      x: props.x,
      y: props.y + props.size,
    },
    ].map(({ x, y }) => (`${x},${y}`)).join(' '),
  }
);

const AccountVisual = ({ address, size = 200 }) => {
  address = address.padStart(20, '0');
  const sizes = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ].map(x => x * (size / 20));

  const shapes = {
    circle: {
      cx: sizes[address[0]] + (size / 4),
      cy: sizes[address[1]] + (size / 4),
      r: sizes[address[2]] / 2,
      fill: gradientIds[address[3]],
    },
    square: {
      x: sizes[address[5]],
      y: sizes[address[6]],
      height: sizes[address[7]],
      width: sizes[address[7]],
      fill: gradientIds[address[8]],
    },
    rect: {
      x: sizes[address[10]],
      y: sizes[address[11]] * 5,
      height: sizes[address[12]] / 5,
      width: sizes[address[12]],
      fill: gradientIds[address[13]],
    },
    triangle: computeTriangle({
      x: sizes[address[15]],
      y: sizes[address[15]],
      size: sizes[address[16]],
      fill: gradientIds[address[17]],
    }),
  };

  return (
    <svg height={size} width={size}>
      <Gradients />
      <circle {...shapes.circle} />
      <polygon {...shapes.triangle} />
      <rect {...shapes.square} />
      <rect {...shapes.rect} />
    </svg>
  );
};

export default AccountVisual;
