import React from 'react';
import { gradientIds, Gradients } from './gradients';

const computeTriangle = props => (
  {
    fill: props.fill,
    transform: props.transform,
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
      cx: sizes[address[1]] + (size / 4),
      cy: sizes[address[2]] + (size / 4),
      r: sizes[address[3]] / 2,
      fill: gradientIds[address[4]],
    },
    square: {
      x: sizes[address[5]],
      y: sizes[address[6]],
      height: sizes[address[7]],
      width: sizes[address[7]],
      fill: gradientIds[address[8]],
      // transform: `rotate(${sizes[address[9]]} ${size / 2} ${size / 2})`,
    },
    rect: {
      x: sizes[address[10]],
      y: sizes[address[11]],
      height: sizes[address[14]],
      width: sizes[address[12]],
      fill: gradientIds[address[13]],
      // transform: `rotate(${sizes[address[14]]} ${size / 2} ${size / 2})`,
    },
    triangle: computeTriangle({
      x: sizes[address[15]],
      y: sizes[address[16]],
      size: sizes[address[17]],
      fill: gradientIds[address[18]],
      // transform: `rotate(${sizes[address[19]]} ${size / 2} ${size / 2})`,
    }),
  };

  return (
    <svg height={size} width={size}>
      <Gradients />
      <rect {...shapes.rect} />
      <rect {...shapes.square} />
      <circle {...shapes.circle} />
      <polygon {...shapes.triangle} />
    </svg>
  );
};

export default AccountVisual;
