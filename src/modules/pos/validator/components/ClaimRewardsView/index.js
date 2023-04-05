import React, { useState } from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsSummary from '@pos/validator/components/ClaimRewardsSummary';
import TxBroadcasterWithStatus from '@transaction/components/TxBroadcasterWithStatus/TxBroadcasterWithStatus';
import ClaimRewardsForm from '../ClaimRewardsForm';

const ClaimRewardsView = () => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);

  const onMultiStepChange = ({ step: { current } }) => {
    setIsStepTxSignatureCollector(current === 2);
  };

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep onChange={onMultiStepChange}>
        <ClaimRewardsForm />
        <ClaimRewardsSummary />
        <TxSignatureCollector />
        <TxBroadcasterWithStatus />
      </MultiStep>
    </Dialog>
  );
};

export default ClaimRewardsView;
