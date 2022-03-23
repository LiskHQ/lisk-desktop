import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@basics/dialog/dialog';
import TransactionDetails from '../transactionDetails';
import styles from './styles.css';

const TransactionDetailsModal = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
    <TransactionDetails {...props} title="Transaction details" />
  </Dialog>
);

export default TransactionDetailsModal;
