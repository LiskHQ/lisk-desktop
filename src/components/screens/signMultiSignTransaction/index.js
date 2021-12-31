/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '@shared/multiStep';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@toolbox/dialog/dialog';

import Form from './form';
import Summary from './summary';
import Status from './status';

const MultiSignature = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose>
      <MultiStep
        key="sign-multisignature-transaction"
        finalCallback={closeModal}
      >
        <Form />
        <Summary />
        <TransactionSignature />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(MultiSignature);
