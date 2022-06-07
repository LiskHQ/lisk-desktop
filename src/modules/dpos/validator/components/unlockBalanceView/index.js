import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Form from '../UnlockBalanceForm';
import Status from '../unlockBalanceStatus';
import Summary from '../unlockBalanceSummary';

const Modal = () => (
  <Dialog hasClose>
    <MultiStep key="unlockBalance">
      <Form />
      <Summary />
      <TxSignatureCollector />
      <Status />
    </MultiStep>
  </Dialog>
);

export default Modal;
