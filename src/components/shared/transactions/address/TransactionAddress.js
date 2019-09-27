import React from 'react';
import { tokenMap } from '../../../../../constants/tokens';
import regex from '../../../../../utils/regex';
import transactionTypes from '../../../../../constants/transactionTypes';
import styles from './transactionAddress.css';

const TransactionAddress = ({
  address, bookmarks, transactionType, t, token,
}) => {
  const account = [...bookmarks.LSK, ...bookmarks.BTC]
    .filter(acc => acc.address === address);

  // eslint-disable-next-line complexity
  const checkTransactionType = () => {
    switch (transactionType) {
      case transactionTypes.setSecondPassphrase:
        return t('Second passphrase registration');
      case transactionTypes.registerDelegate:
        return t('Delegate registration');
      case transactionTypes.vote:
        return t('Delegate vote');
      // istanbul ignore next
      case 4:
        return t('Multisignature Creation');
      // istanbul ignore next
      case 5:
        return t('Blockchain Application Registration');
      // istanbul ignore next
      case 6:
        return t('Send Lisk to Blockchain Application');
      // istanbul ignore next
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
          ? (
            <span className={styles.subTitle}>
              {
            token === tokenMap.LSK.key ? address : address.replace(regex.btcAddressTrunk, '$1...$3')
          }
            </span>
          )
          : null
      }
    </div>
  );
};

export default TransactionAddress;
