import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PricedButton from '../pricedButton';
import styles from './actionBar.css';
import { Button } from '../toolbox/buttons/button';

export const ActionBarRaw = ({
  secondaryButton, primaryButton, account, t, className,
}) => (
  <section className={`${grid.row} ${grid['between-xs']} ${styles.wrapper} ${className}`} >
    <Button
      label={secondaryButton.label || t('Cancel')}
      className={secondaryButton.className || 'cancel-button'}
      onClick={secondaryButton.onClick}
      type={secondaryButton.type || 'button'} />

    <PricedButton
      t={t}
      primary={true}
      raised={true}
      label={primaryButton.label}
      fee={primaryButton.fee}
      balance={account ? account.balance : 0}
      customClassName={primaryButton.className || 'submit-button'}
      disabled={primaryButton.disabled}
      type={primaryButton.type}
      onClick={primaryButton.onClick} />
  </section>
);

export default translate()(ActionBarRaw);
