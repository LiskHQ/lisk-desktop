import React from 'react';
import Switcher from '.';
import DemoRenderer from '../demoRenderer';

/* eslint-disable-next-line no-console */
const onClick = console.log;

const SwitcherDemo = () => (
  <React.Fragment>
    <h2>Switcher</h2>
    <DemoRenderer>
      <Switcher
        onClick={onClick}
        options={[{
          name: 'Option 1',
          value: 'opt_1',
        }, {
          name: 'Option 2',
          value: 'opt_2',
        }, {
          name: 'Option 3',
          value: 'opt_3',
        }]}
        active="opt_1"
      />
    </DemoRenderer>
  </React.Fragment>
);

export default SwitcherDemo;
