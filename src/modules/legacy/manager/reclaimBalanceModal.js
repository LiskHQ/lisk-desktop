import React from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TransactionSignature from '@transaction/components/TransactionSignature';
import Dialog from '@basics/dialog/dialog';
import Summary from '../components/summary';
import Status from '../components/status';

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
