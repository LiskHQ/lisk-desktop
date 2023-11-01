import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import WarningNotification from '@common/components/warningNotification';
import { truncateAddress } from '@wallet/utils/account';
import AccountRow from '@account/components/AccountRow';
import styles from './NextAccountToSign.css';

function NextAccountToSign({ className, nextAccountToSign }) {
  const { t } = useTranslation();

  return (
    <div className={classNames(className, styles.NextAccountToSign)}>
      <WarningNotification
        isVisible
        message={
          <span>
            {t('A required signatory account')}{' '}
            <b>
              ({nextAccountToSign?.metadata?.name} -{' '}
              {truncateAddress(nextAccountToSign?.metadata?.address)})
            </b>{' '}
            {t(
              'to complete this transaction has been found on your Lisk Desktop. Please click on “Switch account” to complete this transaction.'
            )}
          </span>
        }
      />
      <h4 className={styles.requiredAccountTitle}>{t('Required account')}</h4>
      <AccountRow account={nextAccountToSign} />
    </div>
  );
}

export { NextAccountToSign };
