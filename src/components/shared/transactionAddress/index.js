import React from 'react';

import { MODULE_ASSETS } from '@constants';
import { truncateAddress } from '@utils/account';
import styles from './transactionAddress.css';

const Address = ({
  bookmark, address, className,
}) => {
  const addressTrunk = address && truncateAddress(address);

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
  address, bookmarks, moduleAssetName, token,
}) => {
  const bookmark = bookmarks[token].find(acc => acc.address === address);

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      {
        moduleAssetName !== MODULE_ASSETS.transfer
          ? <span>{moduleAssetName}</span>
          : <Address address={address} bookmark={bookmark} />
      }
      {bookmark && <Address address={address} className={styles.subTitle} />}
    </div>
  );
};

export default TransactionAddress;
