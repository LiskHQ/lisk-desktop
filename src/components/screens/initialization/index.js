import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from '../../toolbox/icon';
import { PrimaryButton } from '../../toolbox/buttons';
import DialogLink from '../../toolbox/dialog/link';
import styles from './initialization.css';

const Initialization = ({ t }) => {
  return (
    <div className={styles.container}>
      <Icon name="shieldInitialization" className={styles.headerIcon} />
      <p>{t('Initialize your account')}</p>
      <p>{t('Your account is not safe until you initialize it. It takes 1 minute of your time and 0.1 LSK to protect your account. ')}</p>
      <p>{t('You can learn more')}
        <button
          onClick={() => {
            window.open('https://lisk.io/blog/announcement/lisk-account-initialization', '_blank', 'rel="noopener noreferrer');
          }}
        >
          here
        </button>
      </p>
      <DialogLink component="send">
        <PrimaryButton>{t('Initialize')}</PrimaryButton>
      </DialogLink>
    </div>
  );
};

export default withTranslation()(Initialization);
