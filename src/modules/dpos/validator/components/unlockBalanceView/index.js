import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TransactionSignature from '@transaction/components/TransactionSignature';
import Form from '../unlockBalanceForm';
import Status from '../unlockBalanceStatus';
import Summary from '../unlockBalanceSummary';

const Modal = () => (
  <Dialog hasClose>
    <MultiStep key="unlockBalance">
      <Form />
      <Summary />
      <TransactionSignature />
      <Status />
    </MultiStep>
  </Dialog>
);

export default Modal;
