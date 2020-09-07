import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Switcher from '.';
import DemoRenderer from '../demoRenderer';

const SwitcherDemo = () => (
  <React.Fragment>
    <h2>Switcher</h2>
    <MemoryRouter
      initialEntries={[{}]}
    >
      <DemoRenderer>
        <Switcher
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
    </MemoryRouter>
  </React.Fragment>
);

export default SwitcherDemo;
