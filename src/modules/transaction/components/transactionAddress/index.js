import React from 'react';

import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { getModuleCommandTitle } from '@transaction/utils/moduleAssets';
import { truncateAddress } from '@wallet/utils/account';
import styles from './transactionAddress.css';

const Address = ({ bookmark, address, className }) => {
  const addressTrunk = address && truncateAddress(address);

  if (bookmark) return <span>{bookmark.title}</span>;
  return (
    <>
      <span className={`${className} showOnLargeViewPort`}>
        {address.length < 24 ? address : addressTrunk}
      </span>
      <span className={`${className} hideOnLargeViewPort`}>{addressTrunk}</span>
    </>
  );
};

const TransactionAddress = ({ address, bookmarks, moduleCommandID, token }) => {
  const bookmark = bookmarks[token].find((acc) => acc.address === address);
  const title = getModuleCommandTitle()[moduleCommandID].replace('multisignature', 'multisig.');

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      {moduleCommandID !== MODULE_COMMANDS_NAME_ID_MAP.transfer ? (
        <span>{title}</span>
      ) : (
        <Address address={address} bookmark={bookmark} />
      )}
      {bookmark && <Address address={address} className={styles.subTitle} />}
    </div>
  );
};

export default TransactionAddress;
