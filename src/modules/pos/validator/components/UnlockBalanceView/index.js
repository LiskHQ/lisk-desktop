import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Form from '../UnlockBalanceForm';
import Status from '../UnlockBalanceStatus';
import Summary from '../UnlockBalanceSummary';

const UnlockBalanceView = () => (
  <Dialog hasClose>
    <MultiStep key="unlockBalance">
      <Form />
      <Summary />
      <TxSignatureCollector />
      <Status />
    </MultiStep>
  </Dialog>
);

export default UnlockBalanceView;
