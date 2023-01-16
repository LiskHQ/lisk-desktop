import React, { useRef } from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsForm from '../ClaimRewardsForm';

const ClaimRewardsView = () => {
  const multiStepRef = useRef(null);

  const onClaimRewards = () => {
    multiStepRef.current.next();
  };

  return (
    <Dialog hasClose>
      <MultiStep>
        <ClaimRewardsForm onClaimRewards={onClaimRewards} />
        <TxSignatureCollector />
      </MultiStep>
    </Dialog>
  )
};

export default ClaimRewardsView;
