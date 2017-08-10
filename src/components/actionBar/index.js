import React from 'react';
import Button from 'react-toolbox/lib/button';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PricedButton from '../pricedButton';
import styles from './actionBar.css';

const ActionBar = props => (
  <section className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`} >
    <Button
      label={props.secondaryButton.label || 'Cancel'}
      className={props.secondaryButton.className || 'cancel-button'}
      onClick={props.secondaryButton.onClick} />

    <PricedButton
      primary={true}
      raised={true}
      label={props.primaryButton.label}
      fee={props.primaryButton.fee}
      balance={props.account ? props.account.balance : 0}
      className={props.primaryButton.className || 'submit-button'}
      disabled={props.primaryButton.disabled}
      onClick={props.primaryButton.onClick}/>
  </section>
);

export default ActionBar;
