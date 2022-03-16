import React from 'react';
import Illustration, { illustrations } from '.';
import DemoRenderer from '../demoRenderer';

const IllustrationDemo = () => (
  <>
    <h2>Illustration</h2>
    { Object.keys(illustrations).map(name => (
      <DemoRenderer key={name}>
        <Illustration name={name} />
      </DemoRenderer>
    )) }
  </>
);

export default IllustrationDemo;
