import React from 'react';
import Button from 'react-toolbox/lib/button';
import grid from 'flexboxgrid/dist/flexboxgrid.css';


const Alert = props => (
  <div>
    <p>{props.text}</p>
    <br />
    <section className={`${grid.row} ${grid['between-xs']}`}>
      <span />
      <Button label='Ok' onClick={props.closeDialog} className='ok-button'/>
    </section>
  </div>
);

export default Alert;
