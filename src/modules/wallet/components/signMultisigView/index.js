/* istanbul ignore file */
import React from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';

import Form from '../signMultisigForm';
import Summary from '../signMultisigSummary';
import Status from '../signMultisigStatus';

const SignMultisigView = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose>
      <MultiStep key="sign-multisignature-transaction" finalCallback={closeModal}>
        <Form />
        <Summary />
        <TxSignatureCollector />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default SignMultisigView;
