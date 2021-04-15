import React from 'react';
import { withTranslation } from 'react-i18next';
import Illustration from '@toolbox/illustration';
import { PrimaryButton } from '@toolbox/buttons';
import styles from './introduction.css';

const Introduction = ({ t }) => (
  <div className={styles.container}>
    <Illustration className={styles.illustration} name="reclaimBalanceIntro" />
    <p className={styles.header}>{t('Lisk has now been enhanced even further')}</p>
    <p className={styles.text}>
      {t('We are proud to announce that Lisk Core v3 now contains new improved robust security features.')}
      <br />
      <br />
      {t('You can learn more')}
      {' '}
      <span className={styles.link}>{t('here')}</span>
    </p>
    <PrimaryButton className={styles.button}>{t('Continue')}</PrimaryButton>
  </div>
);

export default withTranslation()(Introduction);
