import React from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Summary from '../components/Summary';
import Status from '../components/Status';

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
