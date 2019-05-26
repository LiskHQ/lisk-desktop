
import React from 'react';
import CheckBox from './';

const CheckBoxDemo = () => (
  <React.Fragment>
    <CheckBox checked={true} />
    <CheckBox checked={false} />
    <CheckBox checked={true} accent={true}/>
    <CheckBox checked={false} removed={true}/>
  </React.Fragment>
);

export default CheckBoxDemo;

