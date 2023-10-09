/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';

import { useLocation } from 'react-router';
import Form from '../signMultisigForm';
import Summary from '../signMultisigSummary';
import Status from '../signMultisigStatus';

const SignMultisigView = ({ history }) => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stringifiedTransaction = queryParams.get('stringifiedTransaction');

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
        <Form
          initialTransactionJSON={
            stringifiedTransaction && JSON.parse(decodeURIComponent(stringifiedTransaction))
          }
        />
        <Summary />
        <TxSignatureCollector />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default SignMultisigView;
