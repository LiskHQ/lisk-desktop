import React from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Summary from '../components/summary';
import Status from '../components/status';

const ReclaimBalanceModal = () => (
  <Dialog>
    <MultiStep>
      <Summary />
      <TxSignatureCollector />
      <Status />
    </MultiStep>
  </Dialog>
);

export default ReclaimBalanceModal;
