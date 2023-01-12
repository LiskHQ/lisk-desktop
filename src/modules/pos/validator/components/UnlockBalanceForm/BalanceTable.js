import React from 'react';
import { useTranslation } from 'react-i18next';
import { tokenMap } from '@token/fungible/consts/tokens';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import UnlockingList from './UnlockingList';
import styles from './unlockBalance.css';

const BalanceTable = ({
  lockedInStakes,
  unlockableBalance,
  currentBlockHeight,
  pendingUnlocks,
}) => {
  const { t } = useTranslation();
  return (
    <ul className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
      {(lockedInStakes !== 0 || pendingUnlocks?.length > 0 || unlockableBalance !== 0) && (
        <li>
          <p className={styles.columnTitle}>{t('Amount')}</p>
          <p className={styles.columnTitle}>{t('Status')}</p>
        </li>
      )}
      {lockedInStakes !== 0 && (
        <li>
          <p className="locked-balance">
            <TokenAmount val={lockedInStakes} token={tokenMap.LSK.key} />
          </p>
          <p>
            <Icon name="lock" />
            {t('locked')}
          </p>
        </li>
      )}
      {pendingUnlocks?.length > 0 && (
        <UnlockingList
          pendingUnlocks={pendingUnlocks}
          currentBlockHeight={currentBlockHeight}
          t={t}
        />
      )}
      {unlockableBalance !== 0 && (
        <li>
          <p className="available-balance">
            <TokenAmount val={unlockableBalance} token={tokenMap.LSK.key} />
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
