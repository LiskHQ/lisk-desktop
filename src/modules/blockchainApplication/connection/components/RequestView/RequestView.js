import React, { useState, useCallback } from 'react';
import routes from 'src/routes/routes';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Summary from '@wallet/components/RequestSignSummary';
import Status from '@wallet/components/RequestSignStatus';
import { useSession } from '@libs/wcm/hooks/useSession';
import { USER_REJECT_ERROR } from '@libs/wcm/utils/jsonRPCFormat';
import RequestSummary from '../RequestSummary';
import styles from './requestView.css';

const RequestView = ({ history }) => {
  const { respond } = useSession();

  const [currentStep, setCurrentStep] = useState(0);
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setCurrentStep(current);
  }, []);

  const onCloseIcon = async () => {
    const isStatusView = currentStep === 3;
    if (!isStatusView) {
      await respond({ payload: USER_REJECT_ERROR });
    }
  };

  const isStepTxSignatureCollector = [2, 3].includes(currentStep);

  return (
    <Dialog
      hasClose
      onCloseIcon={onCloseIcon}
      className={styles.dialogWrapper}
      size={isStepTxSignatureCollector && 'sm'}
    >
      <MultiStep
        onChange={onMultiStepChange}
        key="RequestView"
        finalCallback={backToWallet}
        className={styles.wrapper}
      >
        <RequestSummary history={history} />
        <Summary />
        <TxSignatureCollector confirmText="Confirm and sign" />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default RequestView;
