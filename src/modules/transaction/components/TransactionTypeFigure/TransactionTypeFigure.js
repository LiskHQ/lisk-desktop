import React from 'react';
import {
  MODULE_COMMANDS_MAP,
} from 'src/modules/transaction/configuration/moduleCommand';
import Icon from 'src/theme/Icon';
import { tokenMap } from '@token/fungible/consts/tokens';
import TransactionAddress from '../transactionAddress';
import styles from './TransactionTypeFigure.css';

const TransactionTypeFigure = ({ moduleCommand, className = '', address, iconOnly }) => (
  <div className={`${styles.wrapper} ${className} transaction-image`}>
    <Icon
      name={MODULE_COMMANDS_MAP[moduleCommand]?.icon ?? 'txDefault'}
      className={styles.transactionIcon}
    />
    {!iconOnly && (
      <span>
        <TransactionAddress
          address={address}
          bookmarks={{ LSK: [] }} // @todo why bookmarks are empty?
          token={tokenMap.LSK.key} // @todo why this is hardcoded?
          moduleCommand={moduleCommand}
        />
      </span>
    )}
  </div>
);

export default TransactionTypeFigure;
