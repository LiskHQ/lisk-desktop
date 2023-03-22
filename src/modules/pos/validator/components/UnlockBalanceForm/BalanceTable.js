import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import UnlockingList from './UnlockingList';
import styles from './unlockBalance.css';

const BalanceTable = ({
  sentStakesAmount,
  unlockedAmount,
  currentBlockHeight,
  lockedPendingUnlocks,
  token
}) => {
  const { t } = useTranslation();
  return (
    <ul className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
      {(sentStakesAmount !== 0 || lockedPendingUnlocks?.length > 0 || unlockedAmount !== 0) && (
        <li>
          <p className={styles.columnTitle}>{t('Amount')}</p>
          <p className={styles.columnTitle}>{t('Status')}</p>
        </li>
      )}
      {sentStakesAmount !== 0 && (
        <li>
          <p className="locked-balance">
            <TokenAmount val={sentStakesAmount} token={token} />
          </p>
          <p>
            <Icon name="lock" />
            {t('locked')}
          </p>
        </li>
      )}
      {lockedPendingUnlocks?.length > 0 && (
        <UnlockingList
          lockedPendingUnlocks={lockedPendingUnlocks}
          currentBlockHeight={currentBlockHeight}
          t={t}
        />
      )}
      {unlockedAmount !== 0 && (
        <li>
          <p className="available-balance">
            <TokenAmount val={unlockedAmount} token={token} />
          </p>
          <p>
            <Icon name="unlock" />
            {t('available to unlock')}
          </p>
        </li>
      )}
    </ul>
  );
};

export default BalanceTable;
