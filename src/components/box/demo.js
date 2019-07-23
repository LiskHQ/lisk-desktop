import React from 'react';
import Box from '.';
import Tabs from '../toolbox/tabs';
import DemoRenderer from '../toolbox/demoRenderer';

/* eslint-disable-next-line no-console */
const onClick = console.log;

const BoxDemo = () => (
  <React.Fragment>
    <h2>Box</h2>
    <DemoRenderer>
      <Box> Content </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box>
        <header>
          <h1>Custom header</h1>
        </header>
        <div>Content</div>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box>
        <header>
          <Tabs
            tabs={[
              { name: 'Tab 1', value: 'tab1' },
              { name: 'Tab 2', value: 'tab2' },
            ]}
            onClick={onClick}
            active="tab2"
          />
          <span>Some other stuff</span>
        </header>
        <div>Content</div>
      </Box>
    </DemoRenderer>
  </React.Fragment>
);

export default BoxDemo;
