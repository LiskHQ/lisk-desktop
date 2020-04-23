import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import AccountVisual from '../../../toolbox/accountVisual';
import { getIndexOfBookmark } from '../../../../utils/bookmarks';
import styles from './header.css';

// eslint-disable-next-line complexity
const headerAccountInfo = ({
  address,
  bookmarks,
  delegate,
  t,
  token,
}) => {
  const { apiVersion } = useSelector(state => state.network.networks.LSK);
  const myAddress = useSelector(state => state.account.info[token].address);
  const index = getIndexOfBookmark(bookmarks, { address, token });
  const accounts = bookmarks[token];
  const accountTitle = delegate.username
    || (index > -1 && accounts[index] && accounts[index].title);
  let label = '';
  if (address === myAddress) {
    label = t('My Account');
  } else if (delegate.username) {
    label = apiVersion === '2' ? t('Delegate #{{rank}}', { rank: delegate.rank }) : t('Delegate');
  }

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

export default withTranslation()(headerAccountInfo);
