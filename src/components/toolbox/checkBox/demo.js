import React from 'react';
import CheckBox from './';
import DemoRenderer from '../demoRenderer';

/* eslint-disable-next-line no-console */
const onChange = console.log;

const CheckBoxDemo = () => (
  <React.Fragment>
    <h2>CheckBox</h2>
    <DemoRenderer>
      <CheckBox checked={true} onChange={onChange} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={false} onChange={onChange} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={true} accent={true} onChange={onChange} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={false} removed={true} onChange={onChange} />
    </DemoRenderer>
  </React.Fragment>
);

export default CheckBoxDemo;

