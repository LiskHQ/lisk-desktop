import React, { useState } from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsSummary from '@pos/validator/components/ClaimRewardsSummary';
import TxBroadcasterWithStatus from '@transaction/components/TxBroadcasterWithStatus';
import ClaimRewardsForm from '../ClaimRewardsForm';
import styles from './styles.css';

const ClaimRewardsView = () => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);

  const onMultiStepChange = ({ step: { current } }) => {
    setIsStepTxSignatureCollector([2, 3].includes(current));
  };

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep onChange={onMultiStepChange} className={styles.wrapper}>
        <ClaimRewardsForm />
        <ClaimRewardsSummary />
        <TxSignatureCollector />
        <TxBroadcasterWithStatus />
      </MultiStep>
    </Dialog>
  );
};

export default ClaimRewardsView;
