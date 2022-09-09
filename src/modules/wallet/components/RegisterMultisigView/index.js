/* istanbul ignore file */
import React from 'react';

import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Dialog from 'src/theme/dialog/dialog';

import Form from '../RegisterMultisigForm';
import Summary from '../RegisterMultisigSummary';
import Status from '../RegisterMultisigStatus';
import styles from './styles.css';

const RegisterMultisigView = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose>
      <MultiStep key="multisignature" finalCallback={closeModal} className={styles.modal}>
        <Form />
        <Summary />
        <TxSignatureCollector />
        <Status />
      </MultiStep>
    </Dialog>
  );
};

export default RegisterMultisigView;
