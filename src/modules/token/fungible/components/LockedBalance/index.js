import React from 'react';
import Dialog from '@basics/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TransactionSignature from '@transaction/detail/manager/transactionSignature';
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
