
/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Form from '../RegisterValidatorForm';
import Summary from '../RegisterValidatorSummary';
import Status from '../RegisterValidatorStatus';
import styles from './registerValidator.css';

const RegisterValidator = ({ history, t }) => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector([2, 3].includes(current));
  }, []);

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep
        className={styles.multiStep}
        prevPage={history.goBack}
        backButtonLabel={t('Back')}
        onChange={onMultiStepChange}
      >
        <Form t={t} />
        <Summary t={t} />
        <TxSignatureCollector t={t} />
        <Status t={t} />
      </MultiStep>
    </Dialog>
  );
};

export default RegisterValidator;
