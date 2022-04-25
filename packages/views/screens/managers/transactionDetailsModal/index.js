import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@basics/dialog/dialog';
import TransactionDetailsManager from '../../../../transaction/detail/manager/transactionDetails';
import TransactionDetails from '../transactionDetails';
import styles from './styles.css';

const TransactionDetailsModal = () => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
    <TransactionDetailsManager>
      <TransactionDetails title="Transaction details" />
    </TransactionDetailsManager>
  </Dialog>
);

export default TransactionDetailsModal;
