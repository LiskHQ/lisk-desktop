/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '@shared/multiStep';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@toolbox/dialog/dialog';

import ImportData from './importData';
import ReviewSign from './reviewSign';
import Share from './share';

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
        <ImportData />
        <ReviewSign />
        <TransactionSignature />
        <Share history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(MultiSignature);
