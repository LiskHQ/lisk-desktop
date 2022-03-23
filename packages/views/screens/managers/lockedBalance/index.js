import React from 'react';
import Dialog from '@basics/dialog/dialog';
import MultiStep from '@shared/multiStep';
import TransactionSignature from '@shared/transactionSignature';
import Form from './form';
import Status from './status';
import Summary from './summary';

const Modal = () => (
  <Dialog hasClose>
    <MultiStep
      key="unlockBalance"
    >
      <Form />
      <Summary />
      <TransactionSignature />
      <Status />
    </MultiStep>
  </Dialog>
);

export default Modal;
