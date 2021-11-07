import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { transactionDoubleSigned } from '@actions';
import { MODULE_ASSETS_NAME_ID_MAP, actionTypes } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import { selectActiveToken, selectTransactions } from '@store/selectors';
import Piwik from '@utils/piwik';
import { isEmpty } from '@utils/helpers';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.unlockToken;

const Summary = ({
  transactionInfo,
  fee,
  prevStep,
  t,
  nextStep,
}) => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const account = useSelector(selectActiveToken);
  const [secondPass, setSecondPass] = useState('');

  useEffect(() => {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: transactionInfo,
    });
  }, []);

  useEffect(() => {
    if (secondPass) {
      dispatch(transactionDoubleSigned({ secondPass }));
    }
  }, [secondPass]);

  const onSubmit = () => {
    if (!account.summary.isMultisignature || secondPass) {
      Piwik.trackingEvent('UnlockBalance_SubmitTransaction', 'button', 'Next step');
      if (!transactions.txSignatureError
        && !isEmpty(transactions.signedTransaction)) {
        nextStep();
      } else if (transactions.txSignatureError) {
        nextStep({
          error: transactions.txSignatureError,
        });
      }
    }
  };

  const onConfirmAction = {
    label: t('Confirm'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Cancel'),
    onClick: () => { prevStep(); },
  };

  return (
    <TransactionSummary
      title={t('Unlock LSK summary')}
      t={t}
      account={account}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && fee.value}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      createTransaction={(callback) => {
        callback(transactionInfo);
      }}
      keys={account.keys}
      setSecondPass={setSecondPass}
    >
      <TransactionInfo
        moduleAssetId={moduleAssetId}
        transaction={transactionInfo}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default withTranslation()(Summary);
