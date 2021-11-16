import React from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@constants';
import Icon from '@toolbox/icon';
import LiskAmount from '@shared/liskAmount';
import UnlockingList from './unlockingList';
import styles from './lockedBalance.css';

const BalanceTable = ({
  t,
  lockedInVotes,
  unlockableBalance,
  currentBlockHeight,
  account,
}) => (
  <ul className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
    {(lockedInVotes !== 0 || account?.dpos?.unlocking?.length > 0 || unlockableBalance !== 0)
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
            <LiskAmount val={lockedInVotes} token={tokenMap.LSK.key} />
          </p>
          <p>
            <Icon name="lock" />
            {t('locked')}
          </p>
        </li>
      )}
    {account?.dpos?.unlocking?.length > 0
      && (
      <UnlockingList
        unlocking={account?.dpos?.unlocking}
        currentBlockHeight={currentBlockHeight}
        t={t}
      />
      )}
    {unlockableBalance !== 0
      && (
      <li>
        <p className="available-balance">
          <LiskAmount val={unlockableBalance} token={tokenMap.LSK.key} />
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
