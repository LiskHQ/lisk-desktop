import React from 'react';
import Button from 'react-toolbox/lib/button';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PricedButton from '../pricedButton';
import styles from './actionBar.css';

const ActionBar = ({
  secondaryButton, primaryButton, account,
}) => (
  <section className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`} >
    <Button
      label={secondaryButton.label || 'Cancel'}
      className={secondaryButton.className || 'cancel-button'}
      onClick={secondaryButton.onClick} />

    <PricedButton
      primary={true}
      raised={true}
      label={primaryButton.label}
      fee={primaryButton.fee}
      balance={account ? account.balance : 0}
      customClassName={primaryButton.className || 'submit-button'}
      disabled={primaryButton.disabled}
      onClick={primaryButton.onClick} />
  </section>
);

export default ActionBar;
