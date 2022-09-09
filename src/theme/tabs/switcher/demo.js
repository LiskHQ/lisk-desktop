import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import DemoRenderer from 'src/theme/demo/demoRenderer';
import Switcher from '.';

const SwitcherDemo = () => (
  <>
    <h2>Switcher</h2>
    <MemoryRouter initialEntries={[{}]}>
      <DemoRenderer>
        <Switcher
          options={[
            {
              name: 'Option 1',
              value: 'opt_1',
              id: 'opt1',
            },
            {
              name: 'Option 2',
              value: 'opt_2',
              id: 'opt2',
            },
            {
              name: 'Option 3',
              value: 'opt_3',
              id: 'opt3',
            },
          ]}
          active="opt1"
        />
      </DemoRenderer>
    </MemoryRouter>
  </>
);

export default SwitcherDemo;
