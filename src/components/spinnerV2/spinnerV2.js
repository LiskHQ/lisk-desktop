import React from 'react';
import { translate } from 'react-i18next';
import styles from './spinnerV2.css';

const SpinnerV2 = ({ t }) => (
  <span className={styles.wrapper}>
    <span className={`${styles.spinner} spinner`}/>
    <span className={`${styles.label}`}>{t('Pending...')}</span>
  </span>
);

export default translate()(SpinnerV2);
