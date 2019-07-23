import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../../accountVisual';
import { getIndexOfBookmark } from '../../../utils/bookmarks';
import styles from './transactionsOverviewHeader.css';

// eslint-disable-next-line complexity
const headerAccountInfo = ({
  account,
  address,
  bookmarks,
  delegate,
  t,
  token,
}) => {
  const index = getIndexOfBookmark(bookmarks, { address, token });
  const accounts = bookmarks[token];
  const accountTitle = delegate.username
    || (index > -1 && accounts[index] && accounts[index].title);
  const label = (address === account.address && t('My Account'))
    || (delegate.username && t('Delegate #{{rank}}', { rank: delegate.rank }));

  return (
    <div className={`${styles.account}`}>
      <AccountVisual
        address={address}
        size={48}
      />
      <div className={styles.accountInfo}>
        <div>
          <h2 className={`${styles.title} account-name`}>
            { accountTitle || address }
          </h2>
          { label
            ? <span className={`${styles.label} account-label`}>{label}</span>
            : null }
        </div>
      </div>
    </div>
  );
};

export default translate()(headerAccountInfo);
