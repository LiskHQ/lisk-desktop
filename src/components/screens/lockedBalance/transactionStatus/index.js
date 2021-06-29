import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { routes } from '@constants';
import { transactionBroadcasted as transactionBroadcastedAction } from '@actions';
import { PrimaryButton } from '@toolbox/buttons';
import { TransactionResult, getBroadcastStatus } from '@shared/transactionResult';
import statusMessages from './statusMessages';
import styles from './status.css';

const Status = ({
  t, history, transactionInfo, transactions, transactionBroadcasted,
}) => {
  const status = getBroadcastStatus(transactions, false); // handle HW error
  const onSuccess = () => history.push(routes.wallet.path);
  const template = statusMessages(t, onSuccess)[status.code];

  useEffect(() => {
    if (transactionInfo) transactionBroadcasted(transactionInfo);
  }, [transactionInfo]);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
      >
        {template.button && (
          <PrimaryButton
            onClick={template.button.onClick}
            className={`${template.button.className} dialog-close-button`}
          >
            {template.button.title}
          </PrimaryButton>
        )}
      </TransactionResult>
    </div>
  );
};

const mapStateToProps = state => ({
  account: state.account,
  transactions: state.transactions,
});

const mapDispatchToProps = dispatch => ({
  transactionBroadcasted: (data) => dispatch(transactionBroadcastedAction(data)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withTranslation(),
)(Status);
