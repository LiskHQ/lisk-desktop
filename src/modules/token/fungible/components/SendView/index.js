/* istanbul ignore file */
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { parseSearchParams } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Form from '../SendForm';
import Summary from '../SendSummary';
import Status from '../SendStatus';
import styles from './send.css';

const Send = () => {
  const history = useHistory();
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };
  const initialValue = parseSearchParams(history.location.search);
  const { t } = useTranslation();
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
        <TxSignatureCollector confirmText={t('Confirm and Sign')} />
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default Send;
