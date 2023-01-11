import React, { useRef } from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from '@common/components/MultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsForm from '../ClaimRewardsForm';

const ClaimRewardsView = () => {
  const multiStepRef = useRef(null);

  const onClaimRewards = () => {
    multiStepRef.current.next();
  };

  return (
    <Dialog hasClose>
      <MultiStep ref={multiStepRef} key="ClaimRewardsView">
        <ClaimRewardsForm onClaimRewards={onClaimRewards} />
        <TxSignatureCollector />
      </MultiStep>
    </Dialog>
  )
};

export default ClaimRewardsView;
