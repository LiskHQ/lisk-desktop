import React from 'react';
import CheckBox from '.';
import DemoRenderer from '../demoRenderer';

/* eslint-disable-next-line no-console */
const onChange = console.log;

const CheckBoxDemo = () => (
  <React.Fragment>
    <h2>CheckBox</h2>
    <DemoRenderer>
      <CheckBox checked onChange={onChange} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={false} onChange={onChange} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked accent onChange={onChange} />
    </DemoRenderer>
    <DemoRenderer>
      <CheckBox checked={false} removed onChange={onChange} />
    </DemoRenderer>
  </React.Fragment>
);

export default CheckBoxDemo;
