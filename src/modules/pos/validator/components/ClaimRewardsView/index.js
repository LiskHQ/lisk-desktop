import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsForm from '../ClaimRewardsForm';

const ClaimRewardsView = () => (
    <Dialog hasClose>
      <MultiStep>
        <ClaimRewardsForm />
        <TxSignatureCollector />
      </MultiStep>
    </Dialog>
  );

export default ClaimRewardsView;
