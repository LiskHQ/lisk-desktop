/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';

import { useLocation } from 'react-router';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useDeprecatedAccount } from '@account/hooks';
import { joinModuleAndCommand } from '@transaction/utils';
import Form from '../signMultisigForm';
import Summary from '../signMultisigSummary';
import Status from '../signMultisigStatus';

const SignMultisigView = ({ history }) => {
  const [currentStep, setIsStepTxSignatureCollector] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stringifiedTransaction = queryParams.get('stringifiedTransaction');

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector(current);
  }, []);

  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  if (stringifiedTransaction) {
    return (
      <SignMultisigViewSimple
        currentStep={currentStep}
        stringifiedTransaction={stringifiedTransaction}
        onMultiStepChange={onMultiStepChange}
        closeModal={closeModal}
        history={history}
      />
    );
  }

  return (
    <Dialog hasClose size={currentStep === 2 && 'sm'}>
      <MultiStep
        key="sign-multisignature-transaction"
        finalCallback={closeModal}
        onChange={onMultiStepChange}
      >
        <Form />
        <Summary />
        <TxSignatureCollector />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default SignMultisigView;

function SignMultisigViewSimple({
  currentStep,
  closeModal,
  onMultiStepChange,
  stringifiedTransaction,
  history,
}) {
  useSchemas();
  useDeprecatedAccount();
  const transaction = JSON.parse(decodeURIComponent(stringifiedTransaction));

  const moduleCommand = joinModuleAndCommand(transaction);
  const formProps = { moduleCommand };

  return (
    <Dialog hasClose size={currentStep === 1 && 'sm'}>
      <MultiStep
        key="sign-multisignature-transaction-short"
        finalCallback={closeModal}
        onChange={onMultiStepChange}
      >
        <Summary formProps={formProps} transactionJSON={transaction} />
        <TxSignatureCollector />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
}
