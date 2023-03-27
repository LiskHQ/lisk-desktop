import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from '../RemoveAccount/RemoveAccount.css';

const RemoveSuccess = ({ onComplete }) => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('Account was removed')}</h1>
      <div className={`${styles.accountRemovedIcon}`}>
        <Icon name="accountRemoved" data-testid="accountRemovedIcon" />
      </div>
      <div className={styles.buttonRow}>
        <PrimaryButton className={styles.button} onClick={onComplete}>
          {t('Continue to manage accounts')}
        </PrimaryButton>
      </div>
    </>
  );
};

export default RemoveSuccess;
