import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@toolbox/dialog/dialog';
import TransactionDetails from '../transactionDetails';

const TransactionDetailsModal = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
    <TransactionDetails {...props} />
  </Dialog>
);

export default TransactionDetailsModal;
