import React from 'react';
import Animation, { animations } from '.';
import DemoRenderer from '../demoRenderer';

const AnimationDemo = () => (
  <>
    <h2>Animation</h2>
    { Object.keys(animations).map(name => (
      <DemoRenderer key={name}>
        <Animation
          name={name}
          loop
        />
      </DemoRenderer>
    )) }
  </>
);

export default AnimationDemo;
