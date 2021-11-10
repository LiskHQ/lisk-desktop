import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTransactions } from '@store/selectors';
import { MODULE_ASSETS_NAME_ID_MAP, actionTypes } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';
import { fromRawLsk } from '@utils/lsk';
import { transactionDoubleSigned } from '@actions';
import Piwik from '@utils/piwik';
import { isEmpty } from '@utils/helpers';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;

const Summary = ({
  account,
  nickname,
  prevStep,
  t,
  nextStep,
  transactionInfo,
}) => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
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
      Piwik.trackingEvent('RegisterDelegate_SubmitTransaction', 'button', 'Next step');
      if (!transactions.txSignatureError
        && !isEmpty(transactions.signedTransaction)) {
        nextStep({
          transactionInfo,
        });
      } else if (transactions.txSignatureError) {
        nextStep({
          error: transactions.txSignatureError,
        });
      }
    }
  };

  const onConfirmAction = {
    label: t('Register delegate'),
    onClick: onSubmit,
  };
  const onCancelAction = {
    label: t('Go back'),
    onClick: () => { prevStep({ nickname }); },
  };

  return (
    <TransactionSummary
      title={t('Delegate registration summary')}
      t={t}
      account={account}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      fee={!account.summary.isMultisignature && fromRawLsk(transactionInfo.fee)}
      classNames={`${styles.box} ${styles.summaryContainer}`}
      createTransaction={(callback) => {
        callback(transactionInfo);
      }}
      keys={account.keys}
      setSecondPass={setSecondPass}
    >
      <TransactionInfo
        nickname={nickname}
        moduleAssetId={moduleAssetId}
        transaction={transactionInfo}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
