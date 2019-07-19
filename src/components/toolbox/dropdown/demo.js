import React from 'react';
import Dropdown from './dropdown';
import DemoRenderer from '../demoRenderer';

const DropdownDemo = () => (
  <div>
    <h2>Dropdown</h2>
    <DemoRenderer>
      {/* TODO improve Dropdown so that position: relative is not needed here */}
      <span style={{ position: 'relative' }}>
        <span>Dropdown holder</span>
        <Dropdown
          showDropdown
        >
          <span>Dropdown content</span>
        </Dropdown>
      </span>
    </DemoRenderer>
  </div>
);

export default DropdownDemo;
