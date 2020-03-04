// istanbul ignore file
import React from 'react';
import { withTranslation } from 'react-i18next';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import styles from './overview.css';

const Overview = ({ t }) => (
  <Box>
    <BoxHeader>
      <h1>{t('Overview')}</h1>
    </BoxHeader>
    <div className={styles.container}>
      <div className={styles.column}>
        <h2 className={styles.title}>{t('Distribution of transaction types')}</h2>
      </div>
      <div className={styles.column}>
        <h2 className={styles.title}>{t('Amount per transaction (LSK)')}</h2>
      </div>
      <div className={styles.column}>
        <h2 className={styles.title}>{t('No transactions / volume (LSK)')}</h2>
      </div>
    </div>
  </Box>
);

export default withTranslation()(Overview);
