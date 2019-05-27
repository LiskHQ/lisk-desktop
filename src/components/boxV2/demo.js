import React from 'react';
import BoxV2 from './';
import Tabs from '../toolbox/tabs';
import DemoRenderer from '../toolbox/demoRenderer';

const BoxV2Demo = () => (
  <React.Fragment>
    <h2>BoxV2</h2>
    <DemoRenderer>
      <BoxV2> Content </BoxV2>
    </DemoRenderer>
    <DemoRenderer>
      <BoxV2>
       <header>
         <h1>Custom header</h1>
       </header>
       <div>Content</div>
      </BoxV2>
    </DemoRenderer>
    <DemoRenderer>
      <BoxV2>
       <header>
         <Tabs tabs={[
           { name: 'Tab 1', value: 'tab1' },
           { name: 'Tab 2', value: 'tab2' },
         ]}
           onClick={() => {}}
           active='tab2'/>
         <span>Some other stuff</span>
       </header>
       <div>Content</div>
      </BoxV2>
    </DemoRenderer>
  </React.Fragment>
);

export default BoxV2Demo;
