import React from 'react';
import MultiStep from '@shared/multiStep';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@toolbox/dialog/dialog';
import Summary from './summary';
import Status from './status';

const ReclaimBalanceModal = () => (
  <Dialog>
    <MultiStep>
      <Summary />
      <TransactionSignature />
      <Status />
    </MultiStep>
  </Dialog>
);

export default ReclaimBalanceModal;
