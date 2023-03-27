import React from 'react';
import DemoRenderer from 'src/theme/demo/demoRenderer';
import Illustration, { illustrations } from '.';

const IllustrationDemo = () => (
  <>
    <h2>Illustration</h2>
    {Object.keys(illustrations).map((name) => (
      <DemoRenderer key={name}>
        <Illustration name={name} />
      </DemoRenderer>
    ))}
  </>
);

export default IllustrationDemo;
