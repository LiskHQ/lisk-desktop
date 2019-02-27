import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../../accountVisual';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import styles from './transactionsOverviewHeader.css';

// eslint-disable-next-line complexity
const headerAccountInfo = ({
  t, address, followedAccounts, account,
  delegate,
}) => {
  const index = getIndexOfFollowedAccount(
    followedAccounts,
    { address },
  );

  const accountTitle = delegate.username
    || (index > -1 && followedAccounts[index] && followedAccounts[index].title);

  const label =
    (address === account.address && t('My Account'))
    || (delegate.username && t('Delegate #{{rank}}', { rank: delegate.rank }))
    || (!!accountTitle && t('Followed Account'));

  return (
    <div className={`${styles.account}`}>
      <AccountVisual
        address={address}
        size={48}
        />
      <div className={styles.accountInfo}>
        <div>
          <h2 className={`${styles.title}`}>
            { accountTitle || t('Wallet') }
          </h2>
          { label
            ? <span className={`${styles.label}`}>{label}</span>
            : null }
        </div>
        <span className={styles.address}>
          {address}
        </span>
      </div>
    </div>
  );
};

export default translate()(headerAccountInfo);
