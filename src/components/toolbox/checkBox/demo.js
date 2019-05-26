import React from 'react';
import CheckBox from './';

const CheckBoxDemo = () => (
  <React.Fragment>
    <h2>CheckBox</h2>
    <div>
      <label>{'<CheckBox checked={true} /> '}</label>
      <CheckBox checked={true} />
    </div>
    <div>
      <label>{'<CheckBox checked={false} /> '}</label>
      <CheckBox checked={false} />
    </div>
    <div>
      <label>{'<CheckBox checked={true} accent={true} /> '}</label>
      <CheckBox checked={true} accent={true} />
    </div>
    <div>
      <label>{'<CheckBox checked={false} removed={true} /> '}</label>
      <CheckBox checked={false} removed={true} />
    </div>
  </React.Fragment>
);

export default CheckBoxDemo;

