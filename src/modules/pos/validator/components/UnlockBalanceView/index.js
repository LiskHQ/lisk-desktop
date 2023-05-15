import React, { useCallback, useState } from 'react';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Form from '../UnlockBalanceForm';
import Status from '../UnlockBalanceStatus';
import Summary from '../UnlockBalanceSummary';
import styles from './styles.css';

const UnlockBalanceView = () => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector([2, 3].includes(current));
  }, []);

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep key="unlockBalance" onChange={onMultiStepChange} className={styles.wrapper}>
        <Form />
        <Summary />
        <TxSignatureCollector />
        <Status />
      </MultiStep>
    </Dialog>
  );
};

export default UnlockBalanceView;
