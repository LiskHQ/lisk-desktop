import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP } from '@transaction/configuration/moduleAssets';
import Icon from '@basics/icon';
import TransactionAddress from '@wallet/detail/info/accountVisual/transactionAddress';
import styles from './transactionTypeFigure.css';

const TransactionTypeFigure = ({
  moduleAssetId, className = '', address,
}) => {
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
    return null;
  }
  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      <Icon
        name={MODULE_ASSETS_MAP[moduleAssetId]?.icon ?? 'txDefault'}
        className={styles.transactionIcon}
      />
      <span>
        <TransactionAddress
          address={address}
          bookmarks={{ LSK: [] }}
          t={str => str}
          token={'LSK'}
          moduleAssetId={moduleAssetId}
        />
      </span>
    </div>
  );
};

export default TransactionTypeFigure;
