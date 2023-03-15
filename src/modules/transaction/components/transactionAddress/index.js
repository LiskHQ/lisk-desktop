import React from 'react';

import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { getModuleCommandTitle } from 'src/modules/transaction/utils/moduleCommand';
import { truncateAddress } from '@wallet/utils/account';
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
  address, bookmarks, moduleCommand, token,
}) => {
  const bookmark = bookmarks[token].find(acc => acc.address === address);
  const title = moduleCommand && getModuleCommandTitle()[moduleCommand]?.replace('multisignature', 'multisig.');

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      {
        moduleCommand !== MODULE_COMMANDS_NAME_MAP.transfer
          ? <span>{title}</span>
          : <Address address={address} bookmark={bookmark} />
      }
      {bookmark && <Address address={address} className={styles.subTitle} />}
    </div>
  );
};

export default TransactionAddress;
