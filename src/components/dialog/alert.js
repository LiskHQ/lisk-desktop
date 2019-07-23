import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';

import styles from './alert.css';

const Alert = ({ text, closeDialog, t }) => (
  <div className={styles.alertBox}>
    <p className={`alert-dialog-message ${styles.description}`}>{text}</p>
    <section className={`${grid.row} ${grid['between-xs']} ${styles.okButton}`}>
      <PrimaryButtonV2 onClick={closeDialog} className="ok-button">
        {t('Ok')}
      </PrimaryButtonV2>
    </section>
  </div>
);

export default translate()(Alert);
