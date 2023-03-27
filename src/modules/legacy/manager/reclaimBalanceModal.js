import React, { useCallback, useState } from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Summary from '../components/Summary';
import Status from '../components/Status';

const ReclaimBalanceModal = () => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector([1, 2].includes(current));
  }, []);

  return (
    <Dialog hasClose={isStepTxSignatureCollector} size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep onChange={onMultiStepChange}>
        <Summary />
        <TxSignatureCollector />
        <Status />
      </MultiStep>
    </Dialog>
  );
};

export default ReclaimBalanceModal;
