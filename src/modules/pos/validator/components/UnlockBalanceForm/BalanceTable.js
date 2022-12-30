import React from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@token/fungible/consts/tokens';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import UnlockingList from './UnlockingList';
import styles from './unlockBalance.css';

const BalanceTable = ({
  t,
  lockedInVotes,
  unlockableBalance,
  currentBlockHeight,
  account,
}) => (
  <ul className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
    {(lockedInVotes !== 0 || account?.pos?.pendingUnlocks?.length > 0 || unlockableBalance !== 0)
      && (
      <li>
        <p className={styles.columnTitle}>{t('Amount')}</p>
        <p className={styles.columnTitle}>{t('Status')}</p>
      </li>
      )}
    {lockedInVotes !== 0
      && (
        <li>
          <p className="locked-balance">
            <TokenAmount val={lockedInVotes} token={tokenMap.LSK.key} />
          </p>
          <p>
            <Icon name="lock" />
            {t('locked')}
          </p>
        </li>
      )}
    {account?.pos?.pendingUnlocks?.length > 0
      && (
      <UnlockingList
        pendingUnlocks={account?.pos?.pendingUnlocks}
        currentBlockHeight={currentBlockHeight}
        t={t}
      />
      )}
    {unlockableBalance !== 0
      && (
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

export default withTranslation()(BalanceTable);
