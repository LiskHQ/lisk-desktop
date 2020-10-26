import React from 'react';
import Dialog from '../../toolbox/dialog/dialog';
import MultiStep from '../../shared/multiStep';
import LockedBalance from './lockedBalance';
import TransactionStatus from './transactionStatus';

const Modal = () => (
  <Dialog hasClose>
    <MultiStep
      key="unlockBalance"
    >
      <LockedBalance />
      <TransactionStatus />
    </MultiStep>
  </Dialog>
);

export default Modal;
