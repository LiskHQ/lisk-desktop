import React from 'react';
import regex from '../../../utils/regex';
import transactionTypes from '../../../constants/transactionTypes';
import styles from './transactionAddress.css';

const Address = ({
  bookmark, address, className,
}) => {
  const addressTrunk = address && address.replace(regex.lskAddressTrunk, '$1...$3');

  if (bookmark) return (<span>{bookmark.title}</span>);
  return (
    <>
      <span className={`${className} showOnLargeViewPort`}>
        {address.length < 24 ? address : addressTrunk}
      </span>
      <span className={`${className} hideOnLargeViewPort`}>
        {addressTrunk}
      </span>
    </>
  );
};

const TransactionAddress = ({
  address, bookmarks, transactionType, token,
}) => {
  const bookmark = bookmarks[token].find(acc => acc.address === address);

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      {
        transactionType !== transactionTypes().transfer.code.legacy
          ? <span>{transactionTypes.getByCode(transactionType).title}</span>
          : <Address address={address} bookmark={bookmark} />
      }
      {bookmark && <Address address={address} className={styles.subTitle} />}
    </div>
  );
};

export default TransactionAddress;
