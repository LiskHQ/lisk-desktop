import React from 'react';
import Button from 'react-toolbox/lib/button';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

const ActionBar = props => (
  <section style={{ margin: '0' }}
    className={`${grid.row} ${grid['between-xs']}`} >
    <Button label={props.secondaryButton.label || 'Cancel'}
      className={props.secondaryButton.className || 'cancel-button'}
      onClick={props.secondaryButton.onClick} />
    <Button primary={true} raised={true}
      label={props.primaryButton.label}
      className={props.primaryButton.className || 'submit-button'}
      disabled={props.primaryButton.disabled}
      onClick={props.primaryButton.onClick}/>
  </section>
);

export default ActionBar;
