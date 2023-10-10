/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Dialog from 'src/theme/dialog/dialog';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';

import Form from '../RegisterMultisigForm';
import Summary from '../RegisterMultisigSummary';
import Status from '../RegisterMultisigStatus';
import styles from './styles.css';

const RegisterMultisigView = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector(current === 2);
  }, []);

  const [currentAccount] = useCurrentAccount();

  const currentAccountAddress = currentAccount.metadata?.address;

  const authQuery = useAuth({
    config: { params: { address: currentAccountAddress } },
    options: { enabled: !!currentAccountAddress },
  });

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep
        key="multisignature"
        finalCallback={closeModal}
        className={styles.modal}
        onChange={onMultiStepChange}
      >
        <Form authQuery={authQuery} />
        <Summary authQuery={authQuery}/>
        <TxSignatureCollector />
        <Status authQuery={authQuery} />
      </MultiStep>
    </Dialog>
  );
};

export default RegisterMultisigView;
