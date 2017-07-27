import React from 'react';
import Button from 'react-toolbox/lib/button';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';


const Alert = props => (
  <div>
    <p>{props.text}</p>
    <br />
    <section className={`${grid.row} ${grid['between-xs']}`}>
      <span />
      <Button label='Ok' onClick={props.closeDialog}/>
    </section>
  </div>
);

export default Alert;
