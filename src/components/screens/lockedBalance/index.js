import React from 'react';
import Dialog from '@toolbox/dialog/dialog';
import MultiStep from '@shared/multiStep';
import Form from './form';
import TransactionStatus from './transactionStatus';
import Summary from './summary';

const Modal = () => (
  <Dialog hasClose>
    <MultiStep
      key="unlockBalance"
    >
      <Form />
      <Summary />
      <TransactionStatus />
    </MultiStep>
  </Dialog>
);

export default Modal;
