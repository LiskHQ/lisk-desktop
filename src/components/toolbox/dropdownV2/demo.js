import React from 'react';
import DropdownV2 from './dropdownV2';
import DemoRenderer from '../demoRenderer';

const DropdownDemo = () => (
  <div>
    <h2>Dropdown</h2>
    <DemoRenderer >
      {/* TODO improve DropdownV2 so that position: relative is not needed here */}
      <span style={{ position: 'relative' }}>
        <span>Dropdown holder</span>
        <DropdownV2
          showDropdown={true}
        >
          <span>Dropdown content</span>
        </DropdownV2>
      </span>
    </DemoRenderer>
  </div>
);

export default DropdownDemo;

