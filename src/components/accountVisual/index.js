import React from 'react';
import { gradientIds, Gradients } from './gradients';

const Rect = props => <rect {...props} />;
const Circle = props => <circle {...props} />;
const Polygon = props => <polygon {...props} />;

const computeTriangle = props => (
  {
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

const computePentagon = props => (
  {
    points: [{
      x: props.x + (props.size / 2),
      y: props.y,
    }, {
      x: props.x + props.size,
      y: props.y + (props.size / 2.5),
    }, {
      x: props.x + (props.size - (props.size / 5)),
      y: props.y + props.size,
    }, {
      x: props.x + (props.size / 5),
      y: props.y + props.size,
    }, {
      x: props.x,
      y: props.y + (props.size / 2.5),
    },
    ].map(({ x, y }) => (`${x},${y}`)).join(' '),
  }
);

const getShape = (chunk, size, gradients) => {
  const shapeNames = [
    'circle', 'triangle', 'square', 'rect', 'pentagon',
    'circle', 'triangle', 'square', 'rect', 'pentagon',
  ];

  const sizes = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ].map(x => x * (size / 20));

  const shapes = {
    circle: {
      component: Circle,
      props: {
        cx: sizes[chunk[1]] + (size / 4),
        cy: sizes[chunk[2]] + (size / 4),
        r: sizes[chunk[3]] / 2,
      },
    },
    square: {
      component: Rect,
      props: {
        x: sizes[chunk[1]],
        y: sizes[chunk[2]],
        height: sizes[chunk[3]],
        width: sizes[chunk[3]],
      },
    },
    rect: {
      component: Rect,
      props: {
        x: sizes[chunk[1]],
        y: sizes[chunk[2]],
        height: sizes[chunk[3]],
        width: sizes[chunk[4]],
      },
    },
    triangle: {
      component: Polygon,
      props: computeTriangle({
        x: sizes[chunk[1]],
        y: sizes[chunk[2]],
        size: sizes[chunk[3]],
      }),
    },
    pentagon: {
      component: Polygon,
      props: computePentagon({
        x: sizes[chunk[1]],
        y: sizes[chunk[2]],
        size: sizes[chunk[3]],
      }),
    },
  };

  return {
    component: shapes[shapeNames[chunk[0]]].component,
    props: {
      ...shapes[shapeNames[chunk[0]]].props,
      fill: gradients[chunk[4]],
    },
  };
};

const AccountVisual = ({ address, size = 200 }) => {
  const addressChunks = address.padStart(21, '0').match(/\d{5}/g);
  const shapes = addressChunks.map(chunk => (
    getShape(chunk, size, gradientIds)
  ));

  return (
    <svg height={size} width={size}>
      <Gradients />
      {shapes.map((shape, i) => (
        <shape.component {...shape.props} key={i} />
      ))}
    </svg>
  );
};

export default AccountVisual;
