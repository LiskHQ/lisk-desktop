import React from 'react';
import Spinner from '.';
import DemoRenderer from '../demoRenderer';

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
