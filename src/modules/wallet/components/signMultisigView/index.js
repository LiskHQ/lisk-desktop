/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';

import Form from '../signMultisigForm';
import Summary from '../signMultisigSummary';
import Status from '../signMultisigStatus';

const SignMultisigView = ({ history }) => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector(current === 2);
  }, []);

  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
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
