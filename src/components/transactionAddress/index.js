// istanbul ignore file
import React from 'react';
import { tokenMap } from '../../constants/tokens';
import regex from '../../utils/regex';
import styles from './transactionAddress.css';

const TransactionAddress = ({
  address, followedAccounts, transactionType, t, token,
}) => {
  const checkForFollowedAccount = () => [...followedAccounts.LSK, ...followedAccounts.BTC]
    .filter(acc => acc.address === address);

  const account = checkForFollowedAccount();

  // eslint-disable-next-line complexity
  const checkTransactionType = () => {
    switch (transactionType) {
      case 1:
        return t('Second passphrase registration');
      case 2:
        return t('Delegate registration');
      case 3:
        return t('Delegate vote', { context: 'noun' });
      case 4:
        return t('Multisignature Creation');
      case 5:
        return t('Blockchain Application Registration');
      case 6:
        return t('Send Lisk to Blockchain Application');
      case 7:
        return t('Send Lisk from Blockchain Application');
      default: {
        if (token === tokenMap.LSK.key) return account.length ? account[0].title : address;
        return account.length ? account[0].title : address.replace(regex.btcAddressTrunk, '$1...$3');
      }
    }
  };

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      <span>{checkTransactionType()}</span>
      {
        account.length
        ? <span className={styles.subTitle}>
          {
            token === tokenMap.LSK.key ? address : address.replace(regex.btcAddressTrunk, '$1...$3')
          }
          </span>
        : null
      }
    </div>
  );
};

export default TransactionAddress;
