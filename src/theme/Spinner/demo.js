import React from 'react';
import DemoRenderer from 'src/theme/demo/demoRenderer';
import Spinner from './index';

const SpinnerDemo = () => (
  <div>
    <h2>Spinner</h2>
    <DemoRenderer>
      <Spinner />
      <Spinner label="With text" />
      <Spinner label="With text, completed" completed />
    </DemoRenderer>
  </div>
);

export default SpinnerDemo;
