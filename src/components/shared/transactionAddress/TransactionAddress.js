import React from 'react';
import { tokenMap } from '../../../constants/tokens';
import regex from '../../../utils/regex';
import transactionTypes, { transactionNames } from '../../../constants/transactionTypes';
import styles from './transactionAddress.css';

const TransactionAddress = ({
  address, bookmarks, transactionType, t, token,
}) => {
  const account = [...bookmarks.LSK, ...bookmarks.BTC].filter(acc => acc.address === address);

  const renderAddress = () => {
    if (token === tokenMap.LSK.key) {
      return account.length ? account[0].title : address;
    }
    return account.length ? account[0].title : address.replace(regex.btcAddressTrunk, '$1...$3');
  };

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      <span>
        {transactionType !== transactionTypes.send
          ? transactionNames(t)[transactionType]
          : renderAddress()}
      </span>
      {account.length ? (
        <span className={styles.subTitle}>
          {token === tokenMap.LSK.key ? address : address.replace(regex.btcAddressTrunk, '$1...$3')}
        </span>
      ) : null}
    </div>
  );
};

export default TransactionAddress;
