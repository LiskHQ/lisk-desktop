import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from '../toolbox/buttons/button';

import styles from './alert.css';

const Alert = ({ text, closeDialog, t }) => (
  <div className={styles.alertBox}>
    <p className={`alert-dialog-message ${styles.description}`}>{text}</p>
    <br />
    <section className={`${grid.row} ${grid['between-xs']} ${styles.okButton}`}>
      <Button label={t('Ok')} onClick={closeDialog} className='ok-button'/>
    </section>
  </div>
);

export default translate()(Alert);
