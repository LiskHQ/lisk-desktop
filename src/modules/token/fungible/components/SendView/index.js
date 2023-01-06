/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import { withRouter } from 'react-router-dom';

import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { parseSearchParams } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Form from '../SendForm';
import Summary from '../SendSummary';
import Status from '../SendStatus';
import styles from './send.css';

const Send = ({ history }) => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };
  const initialValue = parseSearchParams(history.location.search);

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector([2, 3].includes(current));
  }, []);

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep
        key="send"
        finalCallback={backToWallet}
        onChange={onMultiStepChange}
        className={styles.wrapper}
      >
        <Form initialValue={initialValue} />
        <Summary />
        <TxSignatureCollector confirmText="Confirm and Sign" />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(Send);
