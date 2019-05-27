import React from 'react';
import CheckBox from './';
import DemoRenderer from '../demoRenderer';

const CheckBoxDemo = () => (
  <React.Fragment>
    <h2>CheckBox</h2>
    <DemoRenderer>
      <CheckBox checked={true} onChange={() => {}} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={false} onChange={() => {}} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={true} accent={true} onChange={() => {}} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={false} removed={true} onChange={() => {}} />
    </DemoRenderer>
  </React.Fragment>
);

export default CheckBoxDemo;

