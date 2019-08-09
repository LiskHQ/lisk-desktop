import React from 'react';
import Box from '.';
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
        <Box.Header>
          <h1>Custom header</h1>
        </Box.Header>
        <div>Content</div>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box>
        <Box.Header>
          <Box.Tabs
            tabs={[
              { name: 'Tab 1', value: 'tab1' },
              { name: 'Tab 2', value: 'tab2' },
            ]}
            onClick={onClick}
            active="tab2"
          />
          <span>Some other stuff</span>
        </Box.Header>
        <div>Content</div>
      </Box>
    </DemoRenderer>
  </React.Fragment>
);

export default BoxDemo;
