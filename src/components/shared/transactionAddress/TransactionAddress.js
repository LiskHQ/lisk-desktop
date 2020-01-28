import React from 'react';
import { tokenMap } from '../../../constants/tokens';
import regex from '../../../utils/regex';
import transactionTypes from '../../../constants/transactionTypes';
import styles from './transactionAddress.css';

const TransactionAddress = ({
  address, bookmarks, transactionType, token,
}) => {
  const account = [...bookmarks.LSK, ...bookmarks.BTC].filter(acc => acc.address === address);

  const formatter = (token === tokenMap.LSK.key)
    ? value => value
    : (value => value.replace(regex.btcAddressTrunk, '$1...$3'));

  const renderAddress = () => (account.length ? account[0].title : formatter(address));

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      <span>
        {transactionType !== transactionTypes().send.code
          ? transactionTypes.getByCode(transactionType).title
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
