import React from 'react';
import {
  MODULE_COMMANDS_NAME_ID_MAP,
  MODULE_COMMANDS_MAP,
} from '@transaction/configuration/moduleAssets';
import Icon from 'src/theme/Icon';
import { tokenMap } from '@token/fungible/consts/tokens';
import TransactionAddress from '../transactionAddress';
import styles from './TransactionTypeFigure.css';

const TransactionTypeFigure = ({ moduleCommandID, className = '', address, iconOnly }) => {
  if (moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.transfer) {
    return null;
  }
  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      <Icon
        name={MODULE_COMMANDS_MAP[moduleCommandID]?.icon ?? 'txDefault'}
        className={styles.transactionIcon}
      />
      {!iconOnly ? (
        <span>
          <TransactionAddress
            address={address}
            bookmarks={{ LSK: [] }} // @todo why bookmarks are empty?
            t={(str) => str} // @todo this is also a mock
            token={tokenMap.LSK.key} // @todo why this is hardcoded?
            moduleCommandID={moduleCommandID}
          />
        </span>
      ) : null}
    </div>
  );
};

export default TransactionTypeFigure;
