import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP } from '@transaction/configuration/moduleAssets';
import Icon from 'src/theme/Icon';
import { tokenMap } from '@token/fungible/consts/tokens';
import TransactionAddress from '../transactionAddress';
import styles from './TransactionTypeFigure.css';

const TransactionTypeFigure = ({
  moduleAssetId, className = '', address, iconOnly,
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
      {
        !iconOnly ? (
          <span>
            <TransactionAddress
              address={address}
              bookmarks={{ LSK: [] }} // @todo why bookmarks are empty?
              t={str => str} // @todo this is also a mock
              token={tokenMap.LSK.key} // @todo why this is hardcoded?
              moduleAssetId={moduleAssetId}
            />
          </span>
        ) : null
       }
    </div>
  );
};

export default TransactionTypeFigure;
