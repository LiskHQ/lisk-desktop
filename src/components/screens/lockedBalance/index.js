import React from 'react';
import Dialog from '@toolbox/dialog/dialog';
import MultiStep from '@shared/multiStep';
import LockedBalance from './lockedBalance';
import TransactionStatus from './transactionStatus';
import Summary from './summary';

const Modal = () => (
  <Dialog hasClose>
    <MultiStep
      key="unlockBalance"
    >
      <LockedBalance />
      <Summary />
      <TransactionStatus />
    </MultiStep>
  </Dialog>
);

export default Modal;
