import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted } from '../../../../actions/transactions';
import { PrimaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import styles from './status.css';
import displayTemplate from './displayTemplate';

const Status = ({
  t, history, transactionInfo,
}) => {
  const transactions = useSelector(state => state.transactions);
  const dispatch = useDispatch();
  const [status, setStatus] = useState('pending');
  const success = status !== 'fail';

  const template = displayTemplate(
    t,
    status,
    () => {
      removeSearchParamsFromUrl(history, ['modal'], true);
    },
  );

  useEffect(() => {
    const confirmed = transactions.confirmed
      .filter(tx => tx.id === transactionInfo.id);
    const error = transactions.broadcastedTransactionsError
      .filter(tx => tx.transaction.id === transactionInfo.id);

    if (confirmed.length) setStatus('ok');
    if (error.length) setStatus('fail');
  }, [transactions]);

  useEffect(() => {
    dispatch(transactionBroadcasted(transactionInfo));
  }, [transactionInfo]);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        illustration={success ? 'transactionSuccess' : 'transactionError'}
        success={success}
        title={template.title}
        message={template.message}
        className={styles.content}
        primaryButon={template.button}
      >
        {template.button && (
          <PrimaryButton
            onClick={template.button.onClick}
            className={template.button.className}
          >
            {template.button.title}
          </PrimaryButton>
        )
        }
      </TransactionResult>
    </div>
  );
};

export default compose(
  withRouter,
  withTranslation(),
)(Status);
