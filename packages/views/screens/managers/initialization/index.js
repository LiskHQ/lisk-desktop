import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from 'src/theme/Icon';
import { PrimaryButton } from 'src/theme/buttons';
import DialogLink from 'src/theme/dialog/link';
import styles from './initialization.css';

const Initialization = ({ t }) => (
  <div className={styles.container}>
    <Icon name="initialiseRegistration" className={styles.headerIcon} />
    <p className={styles.header}>{t('Initialize your account')}</p>
    <p className={styles.text}>
      {t('Your account is not safe until you initialize it.')}
      <br />
      {t('It takes 1 minute of your time and 0.1 LSK to protect your account.')}
      <br />
      <br />
      <br />
      {t('You can learn more')}{' '}
      <span
        className={styles.link}
        onClick={() => {
          window.open(
            'https://lisk.com/blog/announcement/lisk-account-initialization',
            '_blank',
            'rel=noopener noreferrer'
          );
        }}
      >
        here
      </span>
    </p>
    <DialogLink component="send" data={{ initialization: true }}>
      <PrimaryButton className={styles.button}>{t('Initialize')}</PrimaryButton>
    </DialogLink>
  </div>
);

export default withTranslation()(Initialization);
