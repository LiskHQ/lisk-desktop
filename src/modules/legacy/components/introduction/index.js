import React from 'react';
import { withTranslation } from 'react-i18next';
import Illustration from '@basics/illustration';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './introduction.css';

const Introduction = ({ t, nextStep }) => (
  <div className={styles.container}>
    <Illustration className={styles.illustration} name="reclaimBalanceIntro" />
    <p className={styles.header}>
      {t('Lisk has now been enhanced even further')}
    </p>
    <p className={styles.text}>
      {t(
        'We are proud to announce that Lisk Core v3 now contains new improved robust security features.',
      )}
      <br />
      <br />
      {t('You can learn more')}
      {' '}
      <span
        className={styles.link}
        onClick={() => {
          window.open(
            'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration',
            '_blank',
            'rel=noopener noreferrer',
          );
        }}
      >
        {t('here')}
      </span>
    </p>
    <PrimaryButton className={styles.button} onClick={() => nextStep()}>
      {t('Continue')}
    </PrimaryButton>
  </div>
);

export default withTranslation()(Introduction);
