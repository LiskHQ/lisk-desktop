import React from 'react';
import Dialog from '@basics/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TransactionSignature from '@transaction/components/TransactionSignature';
import Form from './LockedBalanceForm';
import Status from './LockedBalanceStatus';
import Summary from './LockedBalanceSummary';

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
