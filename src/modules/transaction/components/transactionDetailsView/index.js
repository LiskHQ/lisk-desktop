import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from 'src/theme/dialog/dialog';
import TransactionDetails from '../TransactionDetails';
import styles from './styles.css';

const TransactionDetailsModal = () => (
  <Dialog
    hasClose
    className={`${grid.row} ${grid['center-xs']} ${styles.container}`}
  >
    <TransactionDetails title="Transaction details" />
  </Dialog>
);

export default TransactionDetailsModal;
