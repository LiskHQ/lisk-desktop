import React, { useState, useCallback } from 'react';
import routes from 'src/routes/routes';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Summary from '@wallet/components/RequestSignSummary';
import Status from '@wallet/components/RequestSignStatus';
import RequestSummary from '../RequestSummary';
import styles from './requestView.css';

const RequestView = ({ history }) => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector([2, 3].includes(current));
  }, []);

  return (
    <Dialog hasClose className={styles.dialogWrapper} size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep
        onChange={onMultiStepChange}
        key="RequestView"
        finalCallback={backToWallet}
        className={styles.wrapper}
      >
        <RequestSummary history={history} />
        <Summary />
        <TxSignatureCollector confirmText="Confirm and sign"/>
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default RequestView;
