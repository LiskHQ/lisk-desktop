/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router-dom';

import TransactionSignature from '@transaction/components/transactionSignature';
import MultiStep from '@shared/multiStep';
import { removeSearchParamsFromUrl } from '@screens/router/searchParams';
import Dialog from '@basics/dialog/dialog';

import Form from './form';
import Summary from './summary';
import Status from './status';
import styles from './styles.css';

const MultiSignature = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose>
      <MultiStep
        key="multisignature"
        finalCallback={closeModal}
        className={styles.modal}
      >
        <Form />
        <Summary />
        <TransactionSignature />
        <Status />
      </MultiStep>
    </Dialog>

  );
};

export default withRouter(MultiSignature);
