/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '@shared/multiStep';
import { removeSearchParamsFromUrl } from '@screens/router/searchParams';
import TransactionSignature from '@transaction/detail/manager/transactionSignature';
import Dialog from '@basics/dialog/dialog';

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
