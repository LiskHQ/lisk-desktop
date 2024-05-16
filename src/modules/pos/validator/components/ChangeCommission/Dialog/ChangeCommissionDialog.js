/* istanbul ignore file */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from '@theme/dialog/dialog';
import { ChangeCommissionForm as Form } from '../Form';
import Summary from '../Summary';
import Status from '../Status';

export const ChangeCommission = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const onMultiStepChange = ({ step: { current } }) => {
    setCurrentStep(current);
  };

  return (
    <Dialog hasClose size={currentStep === 1 ? 'md' : 'sm'}>
      <MultiStep prevPage={history.goBack} onChange={onMultiStepChange} backButtonLabel={t('Back')}>
        <Form />
        <Summary />
        <TxSignatureCollector confirmText={t('Confirm and sign')} />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export const ChangeCommissionDialog = ChangeCommission;
