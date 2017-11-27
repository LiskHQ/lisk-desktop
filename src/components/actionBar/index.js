import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './actionBar.css';
import { Button, PrimaryButton } from '../toolbox/buttons/button';

export const ActionBarRaw = ({
  secondaryButton, primaryButton, t,
}) => (
  <section className={grid.row} >
    <div className={grid['col-xs-4']}>
      <Button
        label={secondaryButton.label || t('Cancel')}
        onClick={secondaryButton.onClick}
        type={secondaryButton.type || 'button'}
        theme={styles}
      />
    </div>
    <div className={grid['col-xs-8']}>
      <PrimaryButton
        label={primaryButton.label}
        disabled={primaryButton.disabled}
        type={primaryButton.type}
        theme={styles}
      />
    </div>
  </section>
);

export default translate()(ActionBarRaw);
