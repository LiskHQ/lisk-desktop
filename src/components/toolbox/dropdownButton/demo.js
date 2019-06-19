import React from 'react';
import DropdownButton from './';
import DemoRenderer from '../demoRenderer';

const DropdownButtonDemo = () => (
  <div>
    <h2>DropdownButton</h2>
    <DemoRenderer >
      <DropdownButton buttonLabel='Button that toggles it' >
        <span>DropdownButton content</span>
      </DropdownButton>
    </DemoRenderer>
  </div>
);

export default DropdownButtonDemo;

