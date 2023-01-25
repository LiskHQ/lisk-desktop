import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsSummary from '@pos/validator/components/ClaimRewardsSummary';
import ClaimRewardsForm from '../ClaimRewardsForm';
import TxBroadcasterWithStatus from '@transaction/components/TxBroadcasterWithStatus/TxBroadcasterWithStatus';

const ClaimRewardsView = () => (
    <Dialog hasClose>
      <MultiStep>
        <ClaimRewardsForm />
        <ClaimRewardsSummary />
        <TxSignatureCollector />
        <TxBroadcasterWithStatus />
      </MultiStep>
    </Dialog>
  );

export default ClaimRewardsView;
